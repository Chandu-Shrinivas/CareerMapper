import type { SvgElementItem } from '../data/frontendSvgData';
import type { RoadmapDefinition, NodeStatus } from '../types/roadmap';
import { FRONTEND_SEMANTIC_NODES, type FrontendSemanticNode } from '../data/frontendSemanticModel';
import { BACKEND_SEMANTIC_NODES, type BackendSemanticNode } from '../data/backendSemanticModel';
import { getNavigationConfig } from './roadmapNavigation';

export interface HierarchyNodeInfo {
  id: string;
  title: string;
  type?: string;
  parentId?: string;
  parentTitle?: string;
  statusEnabled?: boolean;
}

export type AnySemanticNode = FrontendSemanticNode | BackendSemanticNode;

export function getSemanticNode(nodeId: string, roadmapId?: string): AnySemanticNode | undefined {
  if (roadmapId === 'backend') {
    return BACKEND_SEMANTIC_NODES[nodeId] || FRONTEND_SEMANTIC_NODES[nodeId];
  }
  if (roadmapId === 'frontend') {
    return FRONTEND_SEMANTIC_NODES[nodeId] || BACKEND_SEMANTIC_NODES[nodeId];
  }
  return FRONTEND_SEMANTIC_NODES[nodeId] || BACKEND_SEMANTIC_NODES[nodeId];
}

function extractTextFromChildren(children?: any[]): string {
  if (!children) return '';
  let textParts: string[] = [];
  for (const c of children) {
    if (c.text) textParts.push(c.text);
    if (c.children) {
      const sub = extractTextFromChildren(c.children);
      if (sub) textParts.push(sub);
    }
  }
  return textParts.join(' ').trim();
}

/**
 * Checks whether a node is an eligible learning topic that can hold status
 */
export function isEligibleNode(node: HierarchyNodeInfo, roadmapId?: string): boolean {
  const semantic = getSemanticNode(node.id, roadmapId);
  if (semantic) {
    return semantic.progressEligible;
  }
  if (node.statusEnabled === false) return false;
  if (node.type === 'main' || node.type === 'legend' || node.type === 'paragraph' || node.type === 'button') return false;

  // Navigation nodes are excluded from status tracking
  const navConfig = getNavigationConfig(node.id, undefined, node.title);
  if (navConfig) return false;

  const t = node.type;
  return t === 'topic' || t === 'subtopic' || t === 'todo' || t === 'todo-checkbox' || !t;
}

/**
 * Builds a comprehensive node map from semantic models and SVG dataset
 */
export function buildRoadmapNodeMap(
  dataset?: SvgElementItem[],
  roadmapDefinition?: RoadmapDefinition | null,
  roadmapId?: string
): Map<string, HierarchyNodeInfo> {
  const nodesMap = new Map<string, HierarchyNodeInfo>();
  const activeModel = roadmapId === 'backend' ? BACKEND_SEMANTIC_NODES : FRONTEND_SEMANTIC_NODES;

  // 1. Populate from semantic model (Source of Truth)
  for (const [id, sem] of Object.entries(activeModel)) {
    nodesMap.set(id, {
      id,
      title: sem.title,
      type: sem.kind === 'group' ? 'topic' : sem.kind === 'concept' ? 'subtopic' : 'topic',
      parentId: sem.parentNodeId,
      statusEnabled: sem.progressEligible
    });
  }

  // 2. Supplement missing title/type metadata from SVG dataset without using SVG parentId/parentTitle for hierarchy
  if (dataset) {
    for (const item of dataset) {
      if (item.kind === 'g' && item.dataNodeId) {
        if (!nodesMap.has(item.dataNodeId)) {
          const title = item.dataTitle || extractTextFromChildren(item.children) || '';
          nodesMap.set(item.dataNodeId, {
            id: item.dataNodeId,
            title,
            type: item.dataType || 'topic',
            statusEnabled: item.dataType !== 'main' && item.dataType !== 'legend'
          });
        }
      }
    }
  }

  return nodesMap;
}

/**
 * Discovers all descendant node IDs (children, grandchildren, etc.) EXCLUSIVELY from semantic models
 */
export function getDescendantNodeIds(
  targetNodeId: string,
  _dataset?: SvgElementItem[],
  _roadmapDefinition?: RoadmapDefinition | null,
  roadmapId?: string
): string[] {
  const semanticNode = getSemanticNode(targetNodeId, roadmapId);
  if (!semanticNode || !semanticNode.childNodeIds || semanticNode.childNodeIds.length === 0) {
    return [];
  }

  const descendants: string[] = [];
  const visited = new Set<string>([targetNodeId]);
  const queue = [...semanticNode.childNodeIds];

  while (queue.length > 0) {
    const currId = queue.shift()!;
    if (visited.has(currId)) continue;
    visited.add(currId);

    const childSem = getSemanticNode(currId, roadmapId);
    if (childSem) {
      if (childSem.progressEligible) {
        descendants.push(currId);
      }
      if (childSem.childNodeIds && childSem.childNodeIds.length > 0) {
        queue.push(...childSem.childNodeIds);
      }
    } else {
      descendants.push(currId);
    }
  }

  return descendants;
}

/**
 * Evaluates parent aggregation status based strictly on semantic models
 */
export function getParentAggregateStatus(
  parentId: string,
  currentStatuses: Record<string, NodeStatus>,
  _dataset?: SvgElementItem[],
  _roadmapDefinition?: RoadmapDefinition | null,
  roadmapId?: string
): NodeStatus | null {
  const semanticParent = getSemanticNode(parentId, roadmapId);
  if (!semanticParent || !semanticParent.childNodeIds || semanticParent.childNodeIds.length === 0) {
    return null;
  }

  const children = semanticParent.childNodeIds;
  const childStatuses = children.map(cId => currentStatuses[cId] || 'default');

  const mode = semanticParent.completionMode || 'all';

  if (mode === 'choose-one') {
    const anyDone = childStatuses.some(s => s === 'done');
    if (anyDone) return 'done';

    const anyLearning = childStatuses.some(s => s === 'learning');
    if (anyLearning) return 'learning';

    const allSkipped = childStatuses.length > 0 && childStatuses.every(s => s === 'skipped');
    if (allSkipped) return 'skipped';

    return 'default';
  }

  // mode === 'all'
  const allDone = childStatuses.length > 0 && childStatuses.every(s => s === 'done');
  if (allDone) return 'done';

  const allSkipped = childStatuses.length > 0 && childStatuses.every(s => s === 'skipped');
  if (allSkipped) return 'skipped';

  const allDefault = childStatuses.every(s => s === 'default');
  if (allDefault) return 'default';

  return 'learning';
}


