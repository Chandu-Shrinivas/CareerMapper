import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { type SvgElementItem, type SvgChildElement, type SvgNodeGroup } from '../../data/frontendSvgData';
import { RoadmapProgressStore, type NodeStatus } from '../../services/RoadmapProgressStore';
import { getNavigationConfig } from '../../utils/roadmapNavigation';
import { NodeStatusMenu } from './NodeStatusMenu';
import { RoadmapDetailDrawer, type DrawerNodeData } from './RoadmapDetailDrawer';

interface GenericSvgRoadmapProps {
  roadmapId: string;
  title: string;
  viewBox: string;
  dataset: SvgElementItem[];
  className?: string;
  onNodeStatusChange?: () => void;
  selectedNodeId?: string | null;
}

export const GenericSvgRoadmap: React.FC<GenericSvgRoadmapProps> = ({
  roadmapId,
  title,
  viewBox,
  dataset,
  className,
  onNodeStatusChange,
  selectedNodeId
}) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Statuses state persisted in localStorage under roadmapId
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>(() => {
    return RoadmapProgressStore.getStatuses(roadmapId);
  });

  // Re-sync when roadmapId changes
  useEffect(() => {
    setNodeStatuses(RoadmapProgressStore.getStatuses(roadmapId));
  }, [roadmapId]);

  // Hover menu state
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredNodePos, setHoveredNodePos] = useState<{ top: number; left: number } | null>(null);
  const hoveredElementRef = useRef<SVGGElement | null>(null);

  // Detail drawer state
  const [selectedDrawerNode, setSelectedDrawerNode] = useState<DrawerNodeData | null>(null);

  // Sync drawer when selectedNodeId changes from parent header
  useEffect(() => {
    if (!selectedNodeId) return;
    const target = dataset.find(item => item.kind === 'g' && item.dataNodeId === selectedNodeId);
    if (target && target.dataNodeId) {
      const nodeTitle = target.dataTitle || extractTextFromChildren(target.children) || 'Roadmap Topic';
      setSelectedDrawerNode({
        id: target.dataNodeId,
        title: nodeTitle,
        type: target.dataType || 'topic',
        parentId: target.dataParentId ?? undefined,
        parentTitle: target.dataParentTitle ?? undefined,
        status: nodeStatuses[target.dataNodeId] || 'default'
      });
    }
  }, [selectedNodeId, dataset, nodeStatuses]);

  // Sync to localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setNodeStatuses(RoadmapProgressStore.getStatuses(roadmapId));
      onNodeStatusChange?.();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [roadmapId, onNodeStatusChange]);

  // Recalculate menu position dynamically on scroll / resize / container changes
  const updateHoverPosition = () => {
    if (!hoveredElementRef.current || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const nodeRect = hoveredElementRef.current.getBoundingClientRect();

    const relativeLeft = (nodeRect.left - containerRect.left) + (nodeRect.width / 2);
    const relativeTop = (nodeRect.top - containerRect.top);

    setHoveredNodePos({ left: relativeLeft, top: relativeTop });
  };

  useEffect(() => {
    if (!hoveredNodeId) return;

    updateHoverPosition();

    const handleScrollOrResize = () => {
      requestAnimationFrame(updateHoverPosition);
    };

    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    const container = containerRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (container && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleScrollOrResize);
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
      window.removeEventListener('resize', handleScrollOrResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [hoveredNodeId]);

  const isRoadmapShGroup = (node: SvgNodeGroup): boolean => {
    if (node.dataLink && node.dataLink.toLowerCase().includes('roadmap.sh')) return true;
    if (node.dataNodeId === 'ktU7bNX3hu-_hTFE1CjrM' || node.dataNodeId === '2zqZkyVgigifcRS1H7F_b' || node.dataNodeId === 'yHmHXymPNWwu8p1vvqD3o') return true;

    if (node.children) {
      for (const child of node.children) {
        if (child.tag === 'text') {
          if (child.text && (child.text.toLowerCase().includes('roadmap.sh') || child.text.toLowerCase().includes('find the detailed version of this roadmap'))) {
            return true;
          }
          if (child.tspans) {
            for (const ts of child.tspans) {
              if (ts.text && (ts.text.toLowerCase().includes('roadmap.sh') || ts.text.toLowerCase().includes('find the detailed version of this roadmap'))) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  };

  const isLearningNode = (node: SvgNodeGroup): boolean => {
    if (!node.dataNodeId) return false;
    const navConfig = getNavigationConfig(node.dataNodeId ?? undefined, node.dataLink ?? undefined, node.dataTitle ?? undefined);
    if (navConfig) return false; // Navigation nodes are not learning nodes
    const t = node.dataType;
    return t === 'topic' || t === 'subtopic' || t === 'todo' || t === 'todo-checkbox';
  };

  const handleStatusChange = (nodeId: string, status: 'learning' | 'done' | 'skipped' | 'default', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const { nextStatus, allStatuses } = RoadmapProgressStore.toggleStatus(roadmapId, nodeId, status as any);
    setNodeStatuses({ ...allStatuses });
    onNodeStatusChange?.();

    // Update open drawer if currently selected
    if (selectedDrawerNode && selectedDrawerNode.id === nodeId) {
      setSelectedDrawerNode(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const handleNodeMouseEnter = (node: SvgNodeGroup, e: React.MouseEvent<SVGGElement>) => {
    if (!isLearningNode(node) || !node.dataNodeId || node.dataType === 'todo-checkbox') return;

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    hoveredElementRef.current = e.currentTarget;
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const nodeRect = e.currentTarget.getBoundingClientRect();

    const relativeLeft = (nodeRect.left - containerRect.left) + (nodeRect.width / 2);
    const relativeTop = (nodeRect.top - containerRect.top);

    setHoveredNodePos({ left: relativeLeft, top: relativeTop });
    setHoveredNodeId(node.dataNodeId);
  };

  const handleNodeMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setHoveredNodeId(null);
      hoveredElementRef.current = null;
    }, 150);
  };

  const handleMenuMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const handleMenuMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setHoveredNodeId(null);
    }, 150);
  };

  const handleNodeClick = (node: SvgNodeGroup, e: React.MouseEvent) => {
    e.stopPropagation();

    if (isRoadmapShGroup(node)) return;

    // Direct toggle on todo-checkbox or todo text
    if ((node.dataType === 'todo-checkbox' || node.dataType === 'todo') && node.dataNodeId) {
      const current = nodeStatuses[node.dataNodeId] || 'default';
      const nextStatus = current === 'done' ? 'default' : 'done';
      handleStatusChange(node.dataNodeId, nextStatus, e);
      return;
    }

    // 1. Navigation Node handling
    const navConfig = getNavigationConfig(node.dataNodeId ?? undefined, node.dataLink ?? undefined, node.dataTitle ?? undefined);
    if (navConfig) {
      if (navConfig.isExternal) {
        window.open(navConfig.route, '_blank');
      } else {
        navigate(navConfig.route);
      }
      return;
    }

    // 2. Learning Node handling -> Open Detail Drawer
    if (isLearningNode(node) && node.dataNodeId) {
      const status = nodeStatuses[node.dataNodeId] || 'default';
      const nodeTitle = node.dataTitle || extractTextFromChildren(node.children) || 'Roadmap Topic';
      setSelectedDrawerNode({
        id: node.dataNodeId,
        title: nodeTitle,
        type: node.dataType || 'topic',
        parentId: node.dataParentId ?? undefined,
        parentTitle: node.dataParentTitle ?? undefined,
        status
      });
    }
  };


  const renderNodeChild = (
    child: SvgChildElement,
    index: number,
    status: NodeStatus,
    dataType?: string
  ) => {
    switch (child.tag) {
      case 'rect': {
        let fill = child.fill || 'transparent';
        let stroke = child.stroke || 'black';
        const strokeWidth = child.strokeWidth || '2.7';

        if (dataType === 'todo-checkbox') {
          if (status === 'done') {
            fill = '#9ca3af'; // Gray background
            stroke = '#4b5563';
          } else {
            fill = 'transparent';
            stroke = child.stroke || 'black';
          }
          return (
            <rect
              key={index}
              x={child.x ?? undefined}
              y={child.y ?? undefined}
              width={child.width ?? undefined}
              height={child.height ?? undefined}
              rx={child.rx ?? 4}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              className="transition-colors duration-200 cursor-pointer"
            />
          );
        }

        if (status === 'done') {
          fill = '#00a843'; // Light green
        } else if (status === 'learning') {
          fill = '#874efe'; // Lavender/purple
        } else if (status === 'skipped') {
          fill = '#496b69'; // Dark slate gray
        }

        return (
          <rect
            key={index}
            x={child.x ?? undefined}
            y={child.y ?? undefined}
            width={child.width ?? undefined}
            height={child.height ?? undefined}
            rx={child.rx ?? 5}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            style={child.style ? { cssText: child.style } as any : undefined}
            className="transition-colors duration-200"
          />
        );
      }
      case 'text': {
        let textDecoration = 'none';
        let fill = child.fill || 'black';

        if (status === 'learning') {
          textDecoration = 'underline';
        } else if (status === 'done' || status === 'skipped') {
          textDecoration = 'line-through';
        }

        const tspansList = child.tspans || (child.children?.filter(c => c.tag === 'tspan') as any);

        if (tspansList && tspansList.length > 0) {
          return (
            <text
              key={index}
              x={child.x ?? undefined}
              y={child.y ?? undefined}
              fontSize={child.fontSize ?? undefined}
              fill={fill}
              textAnchor={child.textAnchor as any}
              dominantBaseline={child.dominantBaseline as any}
              style={{ textDecoration }}
            >
              {tspansList.map((ts: any, tsIdx: number) => (
                <tspan
                  key={tsIdx}
                  x={ts.x ?? undefined}
                  y={ts.y ?? undefined}
                  dy={ts.dy ?? undefined}
                  textAnchor={ts.textAnchor as any}
                  dominantBaseline={ts.dominantBaseline as any}
                  fontSize={ts.fontSize ?? undefined}
                  fill={ts.fill ?? undefined}
                  style={{ textDecoration }}
                >
                  {ts.text || (ts.children ? extractTextFromChildren(ts.children) : '')}
                </tspan>
              ))}
            </text>
          );
        }
        return (
          <text
            key={index}
            x={child.x ?? undefined}
            y={child.y ?? undefined}
            fontSize={child.fontSize || '17'}
            fill={fill}
            textAnchor={child.textAnchor as any}
            dominantBaseline={child.dominantBaseline as any}
            style={{ textDecoration }}
          >
            {child.text || (child.children ? extractTextFromChildren(child.children) : '')}
          </text>
        );
      }
      case 'line':
        return (
          <line
            key={index}
            x1={child.x1 ?? undefined}
            y1={child.y1 ?? undefined}
            x2={child.x2 ?? undefined}
            y2={child.y2 ?? undefined}
            style={{
              strokeLinecap: 'round',
              strokeWidth: '3.5px',
              stroke: '#2B78E4',
              strokeDasharray: '0.8 8',
              ...parseStyleString(child.style ?? undefined)
            }}
          />
        );
      case 'circle':
        return (
          <circle
            key={index}
            cx={child.cx ?? undefined}
            cy={child.cy ?? undefined}
            r={child.r ?? undefined}
            fill={child.fill || 'none'}
            stroke={child.stroke || '#ffffff'}
            strokeWidth={child.strokeWidth || '2'}
          />
        );
      case 'path':
        return (
          <path
            key={index}
            d={child.d ?? undefined}
            fill={child.fill || 'none'}
            stroke={child.stroke || '#ffffff'}
            strokeWidth={child.strokeWidth || '2'}
            strokeLinecap={(child.strokeLinecap as any) || 'round'}
            strokeLinejoin={(child.strokeLinejoin as any) || 'round'}
          />
        );
      case 'g':
        return (
          <g key={index}>
            {child.children?.map((subChild, subIdx) =>
              renderNodeChild(subChild, subIdx, status, dataType)
            )}
          </g>
        );
      default:
        return null;
    }
  };

  const renderCheckboxCheckmark = (node: SvgNodeGroup, status: NodeStatus) => {
    if (node.dataType !== 'todo-checkbox' || status !== 'done') return null;

    const rect = node.children.find(c => c.tag === 'rect');
    if (!rect || rect.x === undefined || rect.y === undefined) return null;

    const x = Number(rect.x);
    const y = Number(rect.y);
    const w = Number(rect.width || 20);
    const h = Number(rect.height || 20);

    const cx = x + w / 2;
    const cy = y + h / 2;

    const pathD = `M ${cx - 4.5} ${cy - 0.5} L ${cx - 1} ${cy + 3} L ${cx + 4.5} ${cy - 3.5}`;

    return (
      <path
        key="checkbox-check"
        d={pathD}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  // Helper to render right status indicator dot & icon when status is active
  const renderStatusIndicator = (node: SvgNodeGroup, status: NodeStatus) => {
    if (status === 'default') return null;
    if (node.dataType === 'todo-checkbox' || node.dataType === 'todo') return null;

    const mainRect = node.children.find(c => c.tag === 'rect');
    if (!mainRect || mainRect.x === undefined || mainRect.y === undefined || mainRect.width === undefined || mainRect.height === undefined) {
      return null;
    }

    const x = Number(mainRect.x);
    const y = Number(mainRect.y);
    const w = Number(mainRect.width);
    const h = Number(mainRect.height);

    const cx = x + w;
    const cy = y + h / 2;
    const r = 9.5;

    if (status === 'done') {
      const pathD = `M ${cx - 4} ${cy} L ${cx - 1.2} ${cy + 3} L ${cx + 3.8} ${cy - 2.5}`;
      return (
        <g key="status-indicator">
          <circle cx={cx} cy={cy} r={r} fill="#00a843" />
          <path
            d={pathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    }

    if (status === 'skipped') {
      const pathD = `M ${cx - 3} ${cy - 3} L ${cx + 3} ${cy + 3} M ${cx + 3} ${cy - 3} L ${cx - 3} ${cy + 3}`;
      return (
        <g key="status-indicator">
          <circle cx={cx} cy={cy} r={r} fill="#71717a" />
          <path
            d={pathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    }

    if (status === 'learning') {
      return (
        <g key="status-indicator">
          <circle cx={cx} cy={cy} r={r} fill="#874efe" />
          <circle cx={cx} cy={cy} r="4" fill="#ffffff" />
        </g>
      );
    }

    return null;
  };

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-x-auto flex justify-center bg-white py-6 rounded-2xl border border-zinc-200 shadow-sm relative select-none ${className || ''}`}
    >
      <div className="w-full max-w-[1000px] relative">
        {/* SVG GRAPH */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox={viewBox}
          className="w-full h-auto"
          style={{ fontFamily: 'Balsamiq Sans, Comic Sans MS, sans-serif' }}
          version="1.1"
        >
          {dataset.map((elem: SvgElementItem, idx: number) => {
            if (elem.kind === 'path') {
              return (
                <path
                  key={`edge-${idx}`}
                  d={elem.d}
                  fill="none"
                  stroke={elem.stroke || '#2b78e4'}
                  strokeWidth={elem.strokeWidth || '3.5'}
                  data-edge-id={elem.dataEdgeId}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={elem.strokeDasharray || '0'}
                />
              );
            }

            if (elem.kind === 'circle') {
              return (
                <circle
                  key={`circle-${idx}`}
                  cx={elem.cx}
                  cy={elem.cy}
                  r={elem.r}
                  fill={elem.fill}
                  id={elem.id ?? undefined}
                />
              );
            }

            if (elem.kind === 'g') {
              if (isRoadmapShGroup(elem)) return null;

              const status = (elem.dataNodeId ? nodeStatuses[elem.dataNodeId] : 'default') || 'default';
              const isLearning = isLearningNode(elem);
              const isNav = getNavigationConfig(elem.dataNodeId ?? undefined, elem.dataLink ?? undefined, elem.dataTitle ?? undefined);

              return (
                <g
                  key={elem.dataNodeId ? `${elem.dataNodeId}-${elem.dataType || ''}-${idx}` : `group-${idx}`}
                  data-node-id={elem.dataNodeId ?? undefined}
                  data-type={elem.dataType ?? undefined}
                  data-title={elem.dataTitle ?? undefined}
                  data-parent-id={elem.dataParentId ?? undefined}
                  data-parent-title={elem.dataParentTitle ?? undefined}
                  data-link={elem.dataLink ?? undefined}
                  onMouseEnter={(e) => handleNodeMouseEnter(elem, e)}
                  onMouseLeave={handleNodeMouseLeave}
                  onClick={(e) => handleNodeClick(elem, e)}
                  className={`${isLearning || isNav ? 'cursor-pointer' : ''}`}
                >
                  {elem.children.map((child, childIdx) =>
                    renderNodeChild(child, childIdx, status, elem.dataType ?? undefined)
                  )}
                  {renderCheckboxCheckmark(elem, status)}
                  {renderStatusIndicator(elem, status)}
                </g>
              );
            }

            return null;
          })}
        </svg>

        {/* HTML HOVER CONTROL MENU OVERLAY */}
        {hoveredNodeId && hoveredNodePos && (
          <NodeStatusMenu
            currentStatus={nodeStatuses[hoveredNodeId] || 'default'}
            onSelectStatus={(status, e) => handleStatusChange(hoveredNodeId, status, e)}
            position={hoveredNodePos}
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
          />
        )}
      </div>

      {/* DETAIL DRAWER */}
      <RoadmapDetailDrawer
        node={selectedDrawerNode}
        onClose={() => setSelectedDrawerNode(null)}
        onStatusChange={(status) => {
          if (selectedDrawerNode) {
            handleStatusChange(selectedDrawerNode.id, status);
          }
        }}
        onAskAITutor={(topicTitle) => {
          toast.info(`Launching AI Tutor session for ${title}: ${topicTitle}`);
        }}
      />
    </div>
  );
};

function parseStyleString(styleStr?: string): React.CSSProperties {
  if (!styleStr) return {};
  const styleObj: Record<string, string> = {};
  styleStr.split(';').forEach(pair => {
    const [key, val] = pair.split(':').map(s => s?.trim());
    if (key && val) {
      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styleObj[camelKey] = val;
    }
  });
  return styleObj as React.CSSProperties;
}

function extractTextFromChildren(children?: SvgChildElement[]): string {
  if (!children || children.length === 0) return '';
  const parts: string[] = [];
  for (const c of children) {
    if (c.text) {
      parts.push(c.text);
    } else if (c.tspans && c.tspans.length > 0) {
      parts.push(c.tspans.map(t => t.text).join(' '));
    } else if (c.children && c.children.length > 0) {
      const sub = extractTextFromChildren(c.children);
      if (sub) parts.push(sub);
    }
  }
  return parts.join(' ').trim();
}

export default GenericSvgRoadmap;
