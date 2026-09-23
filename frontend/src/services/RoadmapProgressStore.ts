import type { NodeStatus, RoadmapDefinition } from '../types/roadmap';
import type { SvgElementItem } from '../data/frontendSvgData';
import { getDescendantNodeIds, getParentAggregateStatus, getSemanticNode } from '../utils/roadmapHierarchy';
import { FRONTEND_SEMANTIC_NODES } from '../data/frontendSemanticModel';
import { BACKEND_SEMANTIC_NODES } from '../data/backendSemanticModel';
import { syncRoleSkillsToProfile } from '../utils/frontendSkillMapper';

export type { NodeStatus };

export const RoadmapProgressStore = {
  notifyListeners(roadmapId: string) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cm_roadmap_progress_changed', { detail: { roadmapId } }));
      window.dispatchEvent(new Event('careerProfileUpdated'));
      window.dispatchEvent(new Event('storage'));
    }
  },

  getStatuses(roadmapId: string): Record<string, NodeStatus> {
    try {
      const storageKey = `cm_roadmap_progress_${roadmapId}`;
      const raw = localStorage.getItem(storageKey);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      console.error(`[RoadmapProgressStore] Error reading progress for ${roadmapId}:`, e);
      return {};
    }
  },

  getProgress(roadmapId: string): Record<string, NodeStatus> {
    return this.getStatuses(roadmapId);
  },

  getLastUpdated(roadmapId: string): string | null {
    try {
      const key = `cm_roadmap_progress_${roadmapId}_last_updated`;
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },

  setStatus(
    roadmapId: string,
    nodeId: string,
    status: NodeStatus,
    dataset?: SvgElementItem[],
    roadmapDefinition?: RoadmapDefinition | null
  ): Record<string, NodeStatus> {
    const current = this.getStatuses(roadmapId);
    const activeModel = roadmapId === 'backend' ? BACKEND_SEMANTIC_NODES : FRONTEND_SEMANTIC_NODES;
    const semanticNode = getSemanticNode(nodeId, roadmapId);

    // Apply status to target node
    if (status === 'default') {
      delete current[nodeId];
    } else {
      current[nodeId] = status;
    }

    // 1. Propagate status to descendants based on completionMode (if node has children)
    if (semanticNode && semanticNode.childNodeIds && semanticNode.childNodeIds.length > 0) {
      const mode = semanticNode.completionMode || 'all';
      if (mode === 'choose-one') {
        if (status === 'default') {
          for (const cId of semanticNode.childNodeIds) {
            delete current[cId];
          }
        }
      } else {
        // mode === 'all'
        const descendants = getDescendantNodeIds(nodeId, dataset, roadmapDefinition, roadmapId);
        for (const descId of descendants) {
          if (status === 'default') {
            delete current[descId];
          } else {
            current[descId] = status;
          }
        }
      }
    }

    // 2. Aggregate parent status if target node is a child of a group
    for (const [pId, pSem] of Object.entries(activeModel)) {
      if (pSem.childNodeIds && pSem.childNodeIds.includes(nodeId)) {
        const aggStatus = getParentAggregateStatus(pId, current, dataset, roadmapDefinition, roadmapId);
        if (aggStatus) {
          if (aggStatus === 'default') {
            delete current[pId];
          } else {
            current[pId] = aggStatus;
          }
        }
      }
    }

    try {
      const storageKey = `cm_roadmap_progress_${roadmapId}`;
      localStorage.setItem(storageKey, JSON.stringify(current));
      const updatedKey = `cm_roadmap_progress_${roadmapId}_last_updated`;
      localStorage.setItem(updatedKey, new Date().toISOString());
    } catch (e) {
      console.error(`[RoadmapProgressStore] Error saving progress for ${roadmapId}:`, e);
    }

    if (roadmapId === 'frontend' || roadmapId === 'backend') {
      try {
        syncRoleSkillsToProfile(roadmapId, nodeId, status, current);
      } catch (e) {
        console.error('[RoadmapProgressStore] Error syncing skills:', e);
      }
    }

    this.notifyListeners(roadmapId);
    return current;
  },

  toggleStatus(
    roadmapId: string,
    nodeId: string,
    targetStatus: NodeStatus,
    dataset?: SvgElementItem[],
    roadmapDefinition?: RoadmapDefinition | null
  ): { nextStatus: NodeStatus; allStatuses: Record<string, NodeStatus> } {
    const current = this.getStatuses(roadmapId);
    const currentStatus = current[nodeId] || 'default';
    const nextStatus = currentStatus === targetStatus ? 'default' : targetStatus;
    const allStatuses = this.setStatus(roadmapId, nodeId, nextStatus, dataset, roadmapDefinition);
    return { nextStatus, allStatuses };
  },

  resetProgress(roadmapId: string, slug?: string): Record<string, NodeStatus> {
    try {
      const keysToClear = [
        `cm_roadmap_progress_${roadmapId}`,
        `cm_roadmap_progress_${roadmapId}_last_updated`
      ];
      if (slug && slug !== roadmapId) {
        keysToClear.push(`cm_roadmap_progress_${slug}`);
        keysToClear.push(`cm_roadmap_progress_${slug}_last_updated`);
      }
      keysToClear.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.error(`[RoadmapProgressStore] Error resetting progress for ${roadmapId}:`, e);
    }
    this.notifyListeners(roadmapId);
    if (slug && slug !== roadmapId) {
      this.notifyListeners(slug);
    }
    return {};
  }
};
