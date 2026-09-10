import type { RoadmapDefinition, RoadmapNode } from '../types/roadmap';
import { RoadmapProgressStore } from '../services/RoadmapProgressStore';

export interface TopicRecommendation {
  node: RoadmapNode | null;
  reason: string;
}

export function getRecommendedNextTopic(roadmap: RoadmapDefinition): TopicRecommendation {
  const progress = RoadmapProgressStore.getProgress(roadmap.slug);

  // Eligible learning nodes
  const learningNodes = roadmap.nodes.filter(node => {
    if (node.type === 'navigation' || node.type === 'special') return false;
    return node.statusEnabled !== false;
  });

  if (learningNodes.length === 0) {
    return { node: null, reason: 'No learning nodes available in roadmap.' };
  }

  // 1. Topic currently marked as 'learning'
  const activeLearning = learningNodes.find(node => progress[node.id] === 'learning');
  if (activeLearning) {
    return {
      node: activeLearning,
      reason: `You are currently learning "${activeLearning.title}". Continue working through this topic!`,
    };
  }

  // 2. High or Critical priority topic whose prerequisites are complete
  const highPriority = learningNodes.find(node => {
    const status = progress[node.id] || 'default';
    if (status === 'done' || status === 'skipped') return false;
    if (node.priority === 'critical' || node.priority === 'high') {
      const prereqs = node.prerequisites || [];
      const prereqsMet = prereqs.every(pId => progress[pId] === 'done');
      return prereqsMet;
    }
    return false;
  });

  if (highPriority) {
    return {
      node: highPriority,
      reason: `High priority topic "${highPriority.title}" has all prerequisites met. Recommended next step!`,
    };
  }

  // 3. Next logical topic in roadmap order whose prerequisites are met and not completed
  const nextLogical = learningNodes.find(node => {
    const status = progress[node.id] || 'default';
    if (status === 'done') return false;
    const prereqs = node.prerequisites || [];
    const prereqsMet = prereqs.every(pId => progress[pId] === 'done');
    return prereqsMet;
  });

  if (nextLogical) {
    return {
      node: nextLogical,
      reason: `Next logical topic in sequence is "${nextLogical.title}".`,
    };
  }

  // 4. Incomplete node (including skipped)
  const incomplete = learningNodes.find(node => (progress[node.id] || 'default') !== 'done');
  if (incomplete) {
    return {
      node: incomplete,
      reason: `Revisit "${incomplete.title}" to increase roadmap completion.`,
    };
  }

  return {
    node: null,
    reason: 'Congratulations! You have completed all learning topics in this roadmap.',
  };
}
