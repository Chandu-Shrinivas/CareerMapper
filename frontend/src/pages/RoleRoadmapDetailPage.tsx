import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ChevronRight, Layers, BookOpen } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { api } from '../services/api';
import { FRONTEND_ROADMAP_DEFINITION } from '../data/frontendRoadmapDefinition';
import { BACKEND_ROADMAP_DEFINITION } from '../data/backendRoadmapDefinition';
import { FULLSTACK_ROADMAP_DEFINITION } from '../data/fullstackRoadmapDefinition';
import { DEVOPS_ROADMAP_DEFINITION } from '../data/devopsRoadmapDefinition';
import { ANDROID_ROADMAP_DEFINITION } from '../data/androidRoadmapDefinition';
import { AI_ENGINEER_ROADMAP_DEFINITION } from '../data/aiEngineerRoadmapDefinition';
import { DATA_ANALYST_ROADMAP_DEFINITION } from '../data/dataAnalystRoadmapDefinition';
import { DATA_ENGINEER_ROADMAP_DEFINITION } from '../data/dataEngineerRoadmapDefinition';
import { POSTGRESQL_DBA_ROADMAP_DEFINITION } from '../data/postgresqlDbaRoadmapDefinition';
import { DEVSECOPS_ROADMAP_DEFINITION } from '../data/devSecOpsRoadmapDefinition';
import { MACHINE_LEARNING_ROADMAP_DEFINITION } from '../data/machineLearningRoadmapDefinition';
import { AI_DATA_SCIENTIST_ROADMAP_DEFINITION } from '../data/aiDataScientistRoadmapDefinition';

import { FRONTEND_SVG_DATASET } from '../data/frontendSvgData';
import { BACKEND_SVG_DATASET } from '../data/backendSvgData';
import { FULLSTACK_SVG_DATASET } from '../data/fullstackSvgData';
import { DEVOPS_SVG_DATASET } from '../data/devopsSvgData';
import { ANDROID_SVG_DATASET } from '../data/androidSvgData';
import { AI_ENGINEER_SVG_DATASET } from '../data/aiEngineerSvgData';
import { DATA_ANALYST_SVG_DATASET } from '../data/dataAnalystSvgData';
import { DEVSECOPS_SVG_DATASET } from '../data/devSecOpsSvgData';
import { DATA_ENGINEER_SVG_DATASET } from '../data/dataEngineerSvgData';
import { POSTGRESQL_DBA_SVG_DATASET } from '../data/postgresqlDbaSvgData';
import { MACHINE_LEARNING_SVG_DATASET } from '../data/machineLearningSvgData';
import { AI_DATA_SCIENTIST_SVG_DATASET } from '../data/aiDataScientistSvgData';
import type { SvgElementItem } from '../data/frontendSvgData';

import type { RoadmapDefinition } from '../types/roadmap';
import FrontendSvgRoadmap from '../components/roadmap/FrontendSvgRoadmap';
import BackendSvgRoadmap from '../components/roadmap/BackendSvgRoadmap';
import FullstackSvgRoadmap from '../components/roadmap/FullstackSvgRoadmap';
import DevopsSvgRoadmap from '../components/roadmap/DevopsSvgRoadmap';
import AndroidSvgRoadmap from '../components/roadmap/AndroidSvgRoadmap';
import AiEngineerSvgRoadmap from '../components/roadmap/AiEngineerSvgRoadmap';
import DataAnalystSvgRoadmap from '../components/roadmap/DataAnalystSvgRoadmap';
import DevSecOpsSvgRoadmap from '../components/roadmap/DevSecOpsSvgRoadmap';
import DataEngineerSvgRoadmap from '../components/roadmap/DataEngineerSvgRoadmap';
import PostgreSqlDbaSvgRoadmap from '../components/roadmap/PostgreSqlDbaSvgRoadmap';
import MachineLearningSvgRoadmap from '../components/roadmap/MachineLearningSvgRoadmap';
import AiDataScientistSvgRoadmap from '../components/roadmap/AiDataScientistSvgRoadmap';

import { RoadmapDetailDrawer, type DrawerNodeData } from '../components/roadmap/RoadmapDetailDrawer';
import { RoadmapProgressStore, type NodeStatus } from '../services/RoadmapProgressStore';
import { RoadmapProgressSummary } from '../components/roadmap/RoadmapProgressSummary';
import { calculateRoadmapProgress } from '../utils/roadmapProgressCalculator';

const ROADMAP_REGISTRY: Record<string, RoadmapDefinition> = {
  'frontend': FRONTEND_ROADMAP_DEFINITION,
  'frontend-developer': FRONTEND_ROADMAP_DEFINITION,
  'backend': BACKEND_ROADMAP_DEFINITION,
  'backend-developer': BACKEND_ROADMAP_DEFINITION,
  'fullstack': FULLSTACK_ROADMAP_DEFINITION,
  'full-stack': FULLSTACK_ROADMAP_DEFINITION,
  'fullstack-developer': FULLSTACK_ROADMAP_DEFINITION,
  'devops': DEVOPS_ROADMAP_DEFINITION,
  'devops-engineer': DEVOPS_ROADMAP_DEFINITION,
  'android': ANDROID_ROADMAP_DEFINITION,
  'android-developer': ANDROID_ROADMAP_DEFINITION,
  'ai-engineer': AI_ENGINEER_ROADMAP_DEFINITION,
  'ai-engineer-roadmap': AI_ENGINEER_ROADMAP_DEFINITION,
  'ai': AI_ENGINEER_ROADMAP_DEFINITION,
  'data-analyst': DATA_ANALYST_ROADMAP_DEFINITION,
  'data-analyst-roadmap': DATA_ANALYST_ROADMAP_DEFINITION,
  'devsecops': DEVSECOPS_ROADMAP_DEFINITION,
  'devsecops-expert': DEVSECOPS_ROADMAP_DEFINITION,
  'devsecops-roadmap': DEVSECOPS_ROADMAP_DEFINITION,
  'data-engineer': DATA_ENGINEER_ROADMAP_DEFINITION,
  'data-engineer-roadmap': DATA_ENGINEER_ROADMAP_DEFINITION,
  'postgresql-dba': POSTGRESQL_DBA_ROADMAP_DEFINITION,
  'postgresql': POSTGRESQL_DBA_ROADMAP_DEFINITION,
  'postgresql-dba-roadmap': POSTGRESQL_DBA_ROADMAP_DEFINITION,
  'machine-learning': MACHINE_LEARNING_ROADMAP_DEFINITION,
  'machine-learning-roadmap': MACHINE_LEARNING_ROADMAP_DEFINITION,
  'ml': MACHINE_LEARNING_ROADMAP_DEFINITION,
  'ai-data-scientist': AI_DATA_SCIENTIST_ROADMAP_DEFINITION,
  'ai-and-data-scientist': AI_DATA_SCIENTIST_ROADMAP_DEFINITION,
  'ai-data-scientist-roadmap': AI_DATA_SCIENTIST_ROADMAP_DEFINITION,
  'data-scientist': AI_DATA_SCIENTIST_ROADMAP_DEFINITION,
  'data-scientist-roadmap': AI_DATA_SCIENTIST_ROADMAP_DEFINITION,
};

const SVG_DATASET_MAP: Record<string, SvgElementItem[]> = {
  'frontend': FRONTEND_SVG_DATASET,
  'frontend-developer': FRONTEND_SVG_DATASET,
  'backend': BACKEND_SVG_DATASET,
  'backend-developer': BACKEND_SVG_DATASET,
  'fullstack': FULLSTACK_SVG_DATASET,
  'full-stack': FULLSTACK_SVG_DATASET,
  'fullstack-developer': FULLSTACK_SVG_DATASET,
  'devops': DEVOPS_SVG_DATASET,
  'devops-engineer': DEVOPS_SVG_DATASET,
  'android': ANDROID_SVG_DATASET,
  'android-developer': ANDROID_SVG_DATASET,
  'ai-engineer': AI_ENGINEER_SVG_DATASET,
  'ai-engineer-roadmap': AI_ENGINEER_SVG_DATASET,
  'ai': AI_ENGINEER_SVG_DATASET,
  'data-analyst': DATA_ANALYST_SVG_DATASET,
  'data-analyst-roadmap': DATA_ANALYST_SVG_DATASET,
  'devsecops': DEVSECOPS_SVG_DATASET,
  'devsecops-expert': DEVSECOPS_SVG_DATASET,
  'devsecops-roadmap': DEVSECOPS_SVG_DATASET,
  'data-engineer': DATA_ENGINEER_SVG_DATASET,
  'data-engineer-roadmap': DATA_ENGINEER_SVG_DATASET,
  'postgresql-dba': POSTGRESQL_DBA_SVG_DATASET,
  'postgresql': POSTGRESQL_DBA_SVG_DATASET,
  'postgresql-dba-roadmap': POSTGRESQL_DBA_SVG_DATASET,
  'machine-learning': MACHINE_LEARNING_SVG_DATASET,
  'machine-learning-roadmap': MACHINE_LEARNING_SVG_DATASET,
  'ml': MACHINE_LEARNING_SVG_DATASET,
  'ai-data-scientist': AI_DATA_SCIENTIST_SVG_DATASET,
  'ai-and-data-scientist': AI_DATA_SCIENTIST_SVG_DATASET,
  'ai-data-scientist-roadmap': AI_DATA_SCIENTIST_SVG_DATASET,
  'data-scientist': AI_DATA_SCIENTIST_SVG_DATASET,
  'data-scientist-roadmap': AI_DATA_SCIENTIST_SVG_DATASET,
};

function getTrackableSvgNodes(dataset?: SvgElementItem[]) {
  if (!dataset) return undefined;
  const nodes: { id: string; title: string; type?: string; statusEnabled?: boolean }[] = [];
  for (const item of dataset) {
    if (item.kind === 'g' && item.dataNodeId) {
      if (item.dataLink && item.dataLink.toLowerCase().includes('roadmap.sh')) continue;
      if (item.dataNodeId === 'ktU7bNX3hu-_hTFE1CjrM' || item.dataNodeId === '2zqZkyVgigifcRS1H7F_b' || item.dataNodeId === 'yHmHXymPNWwu8p1vvqD3o') continue;
      
      const t = item.dataType;
      if (t === 'topic' || t === 'subtopic' || t === 'todo' || t === 'todo-checkbox') {
        let title = item.dataTitle;
        if (!title && item.children) {
          for (const c of item.children) {
            if (c.tag === 'text') {
              if (c.text) { title = c.text; break; }
              if (c.tspans) { title = c.tspans.map(ts => ts.text).join(' '); break; }
            }
          }
        }
        nodes.push({
          id: item.dataNodeId,
          title: title || 'Topic',
          type: t,
          statusEnabled: true
        });
      }
    }
  }
  return nodes;
}

function RoadmapDataListView({ roadmapData }: { roadmapData: RoadmapDefinition }) {
  const navigate = useNavigate();
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>(() => {
    return RoadmapProgressStore.getStatuses(roadmapData.slug);
  });
  const [selectedDrawerNode, setSelectedDrawerNode] = useState<DrawerNodeData | null>(null);

  useEffect(() => {
    setNodeStatuses(RoadmapProgressStore.getStatuses(roadmapData.slug));
  }, [roadmapData.slug]);

  const topics = roadmapData.nodes.filter(n => n.type === 'topic');
  const navigationNodes = roadmapData.nodes.filter(n => n.type === 'navigation');

  const getSubtopicsForTopic = (topicId: string, topicTitle: string) => {
    return roadmapData.nodes.filter(
      n => n.type === 'subtopic' && (n.parentId === topicId || n.parentTitle === topicTitle)
    );
  };

  const getStatusBadge = (status: NodeStatus) => {
    switch (status) {
      case 'learning':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px]">Learning</Badge>;
      case 'done':
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">Done</Badge>;
      case 'skipped':
        return <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px]">Skipped</Badge>;
      default:
        return <Badge variant="outline" className="text-zinc-500 border-zinc-800 text-[10px]">Unstarted</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Prerequisites / Navigation Header if present */}
      {navigationNodes.length > 0 && (
        <Card className="bg-zinc-900/60 border-zinc-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Layers className="size-4" />
            <span>Recommended Learning Paths & Prerequisites</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {navigationNodes.map(nav => (
              <Button
                key={nav.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (nav.destination) navigate(nav.destination);
                  else if (nav.link) window.open(nav.link, '_blank');
                }}
                className="bg-zinc-900 border-zinc-700 hover:border-emerald-500/50 text-zinc-300 hover:text-white text-xs gap-1.5 cursor-pointer"
              >
                <span>{nav.title}</span>
                <ChevronRight className="size-3.5" />
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Topics & Subtopics List */}
      <div className="space-y-6">
        {topics.map((topic, index) => {
          const subtopics = getSubtopicsForTopic(topic.id, topic.title);
          return (
            <Card key={topic.id} className="bg-zinc-900/50 border-zinc-800/80 p-6 rounded-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">Section {index + 1}</span>
                    {topic.priority && (
                      <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 capitalize">
                        {topic.priority} Priority
                      </Badge>
                    )}
                    {topic.difficulty && (
                      <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400 capitalize">
                        {topic.difficulty}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">{topic.title}</h2>
                  {topic.description && (
                    <p className="text-xs text-zinc-400 max-w-3xl">{topic.description}</p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const status = nodeStatuses[topic.id] || 'default';
                    setSelectedDrawerNode({
                      id: topic.id,
                      title: topic.title,
                      type: 'topic',
                      description: topic.description || undefined,
                      status
                    });
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 shrink-0 cursor-pointer gap-1.5"
                >
                  <BookOpen className="size-3.5" />
                  <span>View Details</span>
                </Button>
              </div>

              {/* Subtopic Cards */}
              {subtopics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {subtopics.map(sub => {
                    const status = nodeStatuses[sub.id] || 'default';
                    return (
                      <div
                        key={sub.id}
                        onClick={() => {
                          setSelectedDrawerNode({
                            id: sub.id,
                            title: sub.title,
                            type: 'subtopic',
                            description: sub.description || undefined,
                            parentId: topic.id,
                            parentTitle: topic.title,
                            status
                          });
                        }}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          status === 'done'
                            ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                            : status === 'learning'
                            ? 'bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50'
                            : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-semibold text-white tracking-tight leading-snug">
                              {sub.title}
                            </h3>
                            {getStatusBadge(status)}
                          </div>
                          {sub.description && (
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                              {sub.description}
                            </p>
                          )}
                        </div>

                        {sub.prerequisites && sub.prerequisites.length > 0 && (
                          <div className="pt-2 border-t border-zinc-800/40 flex items-center gap-1.5 text-[10px] text-zinc-500">
                            <Layers className="size-3" />
                            <span>Prereqs: {sub.prerequisites.length} requirement(s)</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Related Roadmaps Footer */}
      {roadmapData.relatedRoadmaps && roadmapData.relatedRoadmaps.length > 0 && (
        <Card className="bg-zinc-900/60 border-zinc-800 p-6 rounded-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Related Learning Paths</h3>
          <div className="flex flex-wrap gap-2">
            {roadmapData.relatedRoadmaps.map(r => (
              <Button
                key={r.id}
                variant="outline"
                size="sm"
                onClick={() => navigate(`/role-roadmaps/${r.slug}`)}
                className="bg-zinc-950 border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-white text-xs gap-1.5 cursor-pointer"
              >
                <span>{r.title}</span>
                <ChevronRight className="size-3.5" />
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Detail Drawer */}
      {selectedDrawerNode && (
        <RoadmapDetailDrawer
          node={selectedDrawerNode}
          onClose={() => setSelectedDrawerNode(null)}
          onStatusChange={(status) => {
            const { nextStatus, allStatuses } = RoadmapProgressStore.toggleStatus(
              roadmapData.slug,
              selectedDrawerNode.id,
              status
            );
            setNodeStatuses({ ...allStatuses });
            setSelectedDrawerNode(prev => prev ? { ...prev, status: nextStatus } : null);
          }}
        />
      )}
    </div>
  );
}

export default function RoleRoadmapDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [roadmapData, setRoadmapData] = useState<RoadmapDefinition | null>(null);
  const [loading, setLoading] = useState(true);

  // Status & Progress State
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>({});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const refreshProgress = useCallback((roadmapId: string) => {
    setNodeStatuses(RoadmapProgressStore.getStatuses(roadmapId));
    setLastUpdated(RoadmapProgressStore.getLastUpdated(roadmapId));
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    const s = slug.toLowerCase();
    const registered = ROADMAP_REGISTRY[s];

    if (registered) {
      setRoadmapData(registered);
      refreshProgress(registered.id);
      setLoading(false);
    } else {
      api.getRoleRoadmapBySlug(slug)
        .then((res) => {
          if (res.status === 'success' && res.data && res.data.nodes) {
            setRoadmapData(res.data);
            refreshProgress(res.data.id);
          } else {
            setRoadmapData(FRONTEND_ROADMAP_DEFINITION);
            refreshProgress(FRONTEND_ROADMAP_DEFINITION.id);
          }
        })
        .catch(() => {
          setRoadmapData(FRONTEND_ROADMAP_DEFINITION);
          refreshProgress(FRONTEND_ROADMAP_DEFINITION.id);
        })
        .finally(() => setLoading(false));
    }
  }, [slug, refreshProgress]);

  if (loading || !roadmapData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="size-6 text-emerald-400 animate-spin" />
      </div>
    );
  }

  const s = (slug || '').toLowerCase();
  const isBackend = s === 'backend' || s === 'backend-developer';
  const isFullstack = s === 'fullstack' || s === 'full-stack' || s === 'fullstack-developer';
  const isDevops = s === 'devops' || s === 'devops-engineer';
  const isAndroid = s === 'android' || s === 'android-developer';
  const isAiEngineer = s === 'ai-engineer' || s === 'ai-engineer-roadmap' || s === 'ai';
  const isDataAnalyst = s === 'data-analyst' || s === 'data-analyst-roadmap';
  const isDevSecOps = s === 'devsecops' || s === 'devsecops-expert' || s === 'devsecops-roadmap';
  const isFrontend = s === 'frontend' || s === 'frontend-developer' || s === 'frontend-beginner';
  const isDataEngineer = s === 'data-engineer' || s === 'data-engineer-roadmap';
  const isPostgreSqlDba = s === 'postgresql-dba' || s === 'postgresql' || s === 'postgresql-dba-roadmap';
  const isMachineLearning = s === 'machine-learning' || s === 'machine-learning-roadmap' || s === 'ml';
  const isAiDataScientist = s === 'ai-data-scientist' || s === 'ai-and-data-scientist' || s === 'ai-data-scientist-roadmap' || s === 'data-scientist' || s === 'data-scientist-roadmap';

  const currentDataset = SVG_DATASET_MAP[s] || SVG_DATASET_MAP[roadmapData.id] || SVG_DATASET_MAP[roadmapData.slug];
  const trackableSvgNodes = getTrackableSvgNodes(currentDataset);

  const calculatedProgress = calculateRoadmapProgress(roadmapData, nodeStatuses, lastUpdated, trackableSvgNodes);

  const handleNodeStatusChange = () => {
    refreshProgress(roadmapData.id);
  };

  const handleResetProgress = () => {
    const emptyStatuses = RoadmapProgressStore.resetProgress(roadmapData.id);
    setNodeStatuses(emptyStatuses);
    setLastUpdated(null);
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/role-roadmaps')}
          className="text-zinc-400 hover:text-white hover:bg-zinc-900 gap-2 text-xs cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Role Roadmaps</span>
        </Button>
      </div>

      {/* Unified Top Header & Roadmap Progress Summary */}
      <RoadmapProgressSummary
        progress={calculatedProgress}
        roadmapTitle={roadmapData.title}
        roadmapDescription={roadmapData.description}
        onResetProgress={handleResetProgress}
        onSelectNode={handleSelectNode}
      />

      {/* SVG vs Data ListView Renderer */}
      {isBackend ? (
        <BackendSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : isFullstack ? (
        <FullstackSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : isDevops ? (
        <DevopsSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : isAndroid ? (
        <AndroidSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : isAiEngineer ? (
        <AiEngineerSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : isDataAnalyst ? (
        <DataAnalystSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : isDevSecOps ? (
        <DevSecOpsSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : isFrontend ? (
        <FrontendSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : isDataEngineer ? (
        <DataEngineerSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : isPostgreSqlDba ? (
        <PostgreSqlDbaSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : isMachineLearning ? (
        <MachineLearningSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : isAiDataScientist ? (
        <AiDataScientistSvgRoadmap onNodeStatusChange={handleNodeStatusChange} selectedNodeId={selectedNodeId} />
      ) : (
        <RoadmapDataListView roadmapData={roadmapData} />
      )}
    </div>
  );
}

