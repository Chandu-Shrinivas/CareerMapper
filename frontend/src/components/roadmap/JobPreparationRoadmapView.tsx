import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, Clock, Award, HelpCircle, AlertCircle, Sparkles, BookOpen, Layers
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';

export type JobNodeStatus = 'default' | 'learning' | 'done' | 'skipped';

export interface JobRoadmapNodeData {
  id: string;
  title: string;
  description?: string;
  category?: string;
  type?: string;
  importance?: 'critical' | 'required' | 'preferred' | 'nice-to-have';
  canonicalSkillId?: string;
  estimatedMinutes?: number;
  whyRequired?: string;
  jobEvidence?: string;
  preparationGoal?: string;
  interviewRelevance?: string;
  prerequisites?: string[];
  completionMode?: 'all' | 'choose-one';
  status?: JobNodeStatus;
}

export interface JobRoadmapEdgeData {
  id: string;
  from: string;
  to: string;
  relationType: 'main-flow' | 'prerequisite' | 'child' | 'alternative' | 'related';
}

interface JobPreparationRoadmapViewProps {
  nodes: JobRoadmapNodeData[];
  edges: JobRoadmapEdgeData[];
  nodeStatuses: Record<string, JobNodeStatus>;
  onNodeStatusChange: (nodeId: string, newStatus: JobNodeStatus) => void;
}

export const JobPreparationRoadmapView: React.FC<JobPreparationRoadmapViewProps> = ({
  nodes = [],
  edges = [],
  nodeStatuses = {},
  onNodeStatusChange
}) => {
  const [selectedNode, setSelectedNode] = useState<JobRoadmapNodeData | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Group nodes by category
  const categoriesMap: Record<string, JobRoadmapNodeData[]> = {};
  nodes.forEach(node => {
    const cat = node.category || 'Core Requirements';
    categoriesMap[cat] = categoriesMap[cat] || [];
    categoriesMap[cat].push(node);
  });

  const getStatus = (nodeId: string): JobNodeStatus => {
    return nodeStatuses[nodeId] || 'default';
  };

  const handleStatusClick = (e: React.MouseEvent, nodeId: string, status: JobNodeStatus) => {
    e.stopPropagation();
    onNodeStatusChange(nodeId, status);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Topology Legend */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-zinc-950 border border-zinc-850 rounded-2xl">
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 flex-wrap">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="size-4" /> ✓ Done
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Clock className="size-4" /> ● Learning
          </span>
          <span className="flex items-center gap-1.5 text-zinc-500 font-bold">
            × Skipped
          </span>
          <span>·</span>
          <span className="text-rose-400 font-bold">CRITICAL TOPIC</span>
        </div>
        <Badge variant="outline" className="border-zinc-800 text-zinc-400 font-mono text-[10px]">
          Explicit Graph Topology ({nodes.length} Nodes · {edges.length} Edges)
        </Badge>
      </div>

      {/* Categorized Node Flow View */}
      <div className="space-y-6">
        {Object.entries(categoriesMap).map(([categoryName, groupNodes], catIndex) => (
          <Card key={categoryName} className="p-6 bg-zinc-950/70 border border-zinc-900 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="size-4 text-emerald-400" />
                {categoryName}
              </h3>
              <Badge variant="outline" className="border-zinc-800 text-zinc-400 font-mono text-[10px]">
                {groupNodes.length} Preparation Topics
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupNodes.map((node) => {
                const currentStatus = getStatus(node.id);
                const isCritical = node.importance === 'critical';

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                      currentStatus === 'done'
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-zinc-200'
                        : currentStatus === 'learning'
                        ? 'bg-amber-950/20 border-amber-500/40 text-white'
                        : currentStatus === 'skipped'
                        ? 'bg-zinc-950 border-zinc-850 opacity-60 text-zinc-500'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-white'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-bold leading-snug ${currentStatus === 'done' ? 'line-through text-emerald-300' : 'text-white'}`}>
                          {node.title}
                        </span>
                        <Badge variant="outline" className={`text-[9px] py-0 px-1.5 font-mono shrink-0 ${
                          isCritical ? 'border-rose-500/40 text-rose-400 bg-rose-500/10' : 'border-zinc-800 text-zinc-400'
                        }`}>
                          {node.importance}
                        </Badge>
                      </div>
                      
                      {node.description && (
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {node.description}
                        </p>
                      )}
                    </div>

                    {/* Choose-One Alternative Indicator */}
                    {node.completionMode === 'choose-one' && (
                      <Badge className="bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-mono text-[9px] w-fit">
                        Alternative Option (Choose One)
                      </Badge>
                    )}

                    {/* Status Toggle Hover Controls */}
                    <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                        <Clock className="size-3" />
                        <span>{node.estimatedMinutes || 120} min</span>
                      </div>

                      {/* Interactive Hover Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleStatusClick(e, node.id, currentStatus === 'learning' ? 'default' : 'learning')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-colors ${
                            currentStatus === 'learning' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                          }`}
                        >
                          Learning
                        </button>
                        <button
                          onClick={(e) => handleStatusClick(e, node.id, currentStatus === 'done' ? 'default' : 'done')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-colors ${
                            currentStatus === 'done' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-300'
                          }`}
                        >
                          ✓ Done
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Node Detail Sheet Drawer */}
      <Sheet open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <SheetContent className="bg-zinc-950 border-l border-zinc-800 text-white p-6 space-y-6 max-w-lg">
          {selectedNode && (
            <>
              <SheetHeader className="space-y-2 border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono text-[10px]">
                    JOB PREPARATION TOPIC
                  </Badge>
                  <Badge variant="outline" className="border-zinc-800 text-zinc-400 font-mono text-[10px]">
                    {selectedNode.importance}
                  </Badge>
                </div>
                <SheetTitle className="text-xl font-black text-white">{selectedNode.title}</SheetTitle>
                <SheetDescription className="text-xs text-zinc-400">{selectedNode.description}</SheetDescription>
              </SheetHeader>

              <div className="space-y-5 text-xs">
                {/* Why This Topic Matters */}
                <div className="space-y-1.5 p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider block text-[10px]">Why This Topic Matters</span>
                  <p className="text-zinc-300 leading-relaxed">{selectedNode.whyRequired}</p>
                </div>

                {/* Job Evidence */}
                {selectedNode.jobEvidence && (
                  <div className="space-y-1.5 p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                    <span className="font-bold text-amber-400 uppercase tracking-wider block text-[10px]">Job Description Evidence</span>
                    <p className="text-zinc-300 font-mono text-[11px] leading-relaxed">"{selectedNode.jobEvidence}"</p>
                  </div>
                )}

                {/* Preparation Goal */}
                {selectedNode.preparationGoal && (
                  <div className="space-y-1.5 p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                    <span className="font-bold text-indigo-400 uppercase tracking-wider block text-[10px]">Preparation Goal</span>
                    <p className="text-zinc-300 leading-relaxed">{selectedNode.preparationGoal}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between gap-3">
                  <Button
                    onClick={() => {
                      onNodeStatusChange(selectedNode.id, getStatus(selectedNode.id) === 'done' ? 'default' : 'done');
                      setSelectedNode(null);
                    }}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold h-10 rounded-xl shadow"
                  >
                    {getStatus(selectedNode.id) === 'done' ? 'Mark Pending' : '✓ Mark Complete'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
