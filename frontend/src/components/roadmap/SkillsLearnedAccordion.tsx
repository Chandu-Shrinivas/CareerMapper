import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Check, Award, Sparkles } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { SkillIcon } from '../SkillIcon';
import { FRONTEND_SEMANTIC_NODES } from '../../data/frontendSemanticModel';
import { BACKEND_SEMANTIC_NODES } from '../../data/backendSemanticModel';
import { getSemanticNode } from '../../utils/roadmapHierarchy';
import type { NodeStatus } from '../../services/RoadmapProgressStore';

interface SkillsLearnedAccordionProps {
  nodeStatuses: Record<string, NodeStatus>;
  roadmapId?: string;
  className?: string;
}

export function getLearnedSkills(nodeStatuses: Record<string, NodeStatus>, roadmapId?: string): string[] {
  const learnedSet = new Set<string>();
  const activeModel = roadmapId === 'backend' ? BACKEND_SEMANTIC_NODES : FRONTEND_SEMANTIC_NODES;

  // 1. Direct skills marked DONE in roadmap
  for (const [nodeId, status] of Object.entries(nodeStatuses)) {
    if (status === 'done') {
      const sem = getSemanticNode(nodeId, roadmapId);
      if (sem && sem.skillMapping?.type === 'direct' && sem.skillMapping.canonicalSkillId) {
        learnedSet.add(sem.skillMapping.canonicalSkillId);
      }
    }
  }

  // 2. Group skills where all children are DONE
  for (const pSem of Object.values(activeModel)) {
    if (pSem.kind === 'group' && pSem.skillMapping?.type === 'group' && pSem.skillMapping.canonicalSkillId) {
      const children = pSem.childNodeIds || [];
      if (children.length > 0 && children.every(cId => nodeStatuses[cId] === 'done')) {
        learnedSet.add(pSem.skillMapping.canonicalSkillId);
      }
    }
  }

  // 3. Check profile skills from localStorage
  if (typeof localStorage !== 'undefined') {
    try {
      const profileRaw = localStorage.getItem('cm_profile_draft') || localStorage.getItem('careerProfile');
      if (profileRaw) {
        const profile = JSON.parse(profileRaw);
        if (Array.isArray(profile.skills)) {
          for (const s of profile.skills) {
            const sName = typeof s === 'string' ? s : s?.name;
            if (sName) {
              for (const sem of Object.values(activeModel)) {
                if (
                  sem.skillMapping?.canonicalSkillId &&
                  sem.skillMapping.canonicalSkillId.toLowerCase() === sName.toLowerCase()
                ) {
                  learnedSet.add(sem.skillMapping.canonicalSkillId);
                }
              }
            }
          }
        }
      }
    } catch (e) {}
  }

  return Array.from(learnedSet);
}

export const SkillsLearnedAccordion: React.FC<SkillsLearnedAccordionProps> = ({
  nodeStatuses,
  roadmapId,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const learnedSkills = getLearnedSkills(nodeStatuses, roadmapId);

  return (
    <Card className={`bg-zinc-900/80 border-zinc-800/80 rounded-xl overflow-hidden shadow-sm transition-all ${className || ''}`}>
      {/* Accordion Toggle Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          {isExpanded ? (
            <ChevronDown className="size-4 text-emerald-400 shrink-0 transition-transform" />
          ) : (
            <ChevronRight className="size-4 text-zinc-400 shrink-0 transition-transform" />
          )}

          <div className="flex items-center gap-2">
            <Award className="size-4 text-emerald-400 shrink-0" />
            <span className="text-sm font-bold text-white tracking-tight">
              Skills Learned
            </span>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs px-2 py-0.5 font-mono font-bold">
              {learnedSkills.length}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="hidden sm:inline font-mono">
            {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </span>
        </div>
      </button>

      {/* Expanded Skills List */}
      {isExpanded && (
        <div className="px-5 pb-4 pt-1 border-t border-zinc-800/60 bg-zinc-950/40 animate-fadeUp">
          {learnedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {learnedSkills.map((skillName) => (
                <div
                  key={skillName}
                  className="bg-zinc-900 border border-emerald-500/30 hover:border-emerald-500/60 text-zinc-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Check className="size-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                  <SkillIcon skill={skillName} className="size-3.5" />
                  <span className="font-semibold">{skillName}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
              <Sparkles className="size-4 text-zinc-600" />
              <span>No skills learned yet. Mark topics as completed in the roadmap to build your skills inventory.</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default SkillsLearnedAccordion;
