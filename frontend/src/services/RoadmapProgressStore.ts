export type NodeStatus = 'default' | 'learning' | 'done' | 'skipped';

export const RoadmapProgressStore = {
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

  setStatus(roadmapId: string, nodeId: string, status: NodeStatus): Record<string, NodeStatus> {
    const current = this.getStatuses(roadmapId);
    if (status === 'default') {
      delete current[nodeId];
    } else {
      current[nodeId] = status;
    }
    try {
      const storageKey = `cm_roadmap_progress_${roadmapId}`;
      localStorage.setItem(storageKey, JSON.stringify(current));
      const updatedKey = `cm_roadmap_progress_${roadmapId}_last_updated`;
      localStorage.setItem(updatedKey, new Date().toISOString());
    } catch (e) {
      console.error(`[RoadmapProgressStore] Error saving progress for ${roadmapId}:`, e);
    }
    return current;
  },

  toggleStatus(
    roadmapId: string,
    nodeId: string,
    targetStatus: NodeStatus
  ): { nextStatus: NodeStatus; allStatuses: Record<string, NodeStatus> } {
    const current = this.getStatuses(roadmapId);
    const currentStatus = current[nodeId] || 'default';
    const nextStatus = currentStatus === targetStatus ? 'default' : targetStatus;
    const allStatuses = this.setStatus(roadmapId, nodeId, nextStatus);
    return { nextStatus, allStatuses };
  },

  resetProgress(roadmapId: string): Record<string, NodeStatus> {
    try {
      const storageKey = `cm_roadmap_progress_${roadmapId}`;
      const updatedKey = `cm_roadmap_progress_${roadmapId}_last_updated`;
      localStorage.removeItem(storageKey);
      localStorage.removeItem(updatedKey);
    } catch (e) {
      console.error(`[RoadmapProgressStore] Error resetting progress for ${roadmapId}:`, e);
    }
    return {};
  }
};

