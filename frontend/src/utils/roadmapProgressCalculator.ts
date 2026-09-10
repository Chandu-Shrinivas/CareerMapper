import type { RoadmapDefinition, RoadmapNode, NodeStatus } from '../types/roadmap';

export interface SectionProgress {
  id: string;
  title: string;
  total: number;
  done: number;
  learning: number;
  skipped: number;
  notStarted: number;
  percentage: number;
}

export interface RecommendedTopic {
  nodeId: string;
  title: string;
  description?: string;
  reason: string;
  isContinueLearning: boolean;
}

export interface CalculatedRoadmapProgress {
  roadmapId: string;
  total: number;
  done: number;
  learning: number;
  skipped: number;
  notStarted: number;
  completionPercentage: number;
  isComplete: boolean;
  remainingMinutes: number;
  formattedRemainingTime: string | null;
  lastUpdated: string | null;
  sections: SectionProgress[];
  nextRecommendation: RecommendedTopic | null;
}

export function isEligibleLearningNode(node: {
  id?: string;
  type?: string;
  statusEnabled?: boolean;
}): boolean {
  if (node.statusEnabled === false) return false;
  if (node.type === 'main') return false;
  if (node.type === 'navigation' && node.statusEnabled !== true) return false;
  return true;
}

export function calculateRoadmapProgress(
  roadmapDefinition: RoadmapDefinition | null,
  nodeStatuses: Record<string, NodeStatus>,
  lastUpdated: string | null = null,
  fallbackDatasetNodes?: { id: string; title: string; type?: string; statusEnabled?: boolean }[]
): CalculatedRoadmapProgress {
  const roadmapId = roadmapDefinition?.id || 'unknown';
  
  // 1. Gather trackable nodes
  let trackableNodes: RoadmapNode[] = [];

  if (fallbackDatasetNodes && fallbackDatasetNodes.length > 0) {
    trackableNodes = fallbackDatasetNodes
      .filter(isEligibleLearningNode)
      .map(n => ({
        id: n.id,
        title: n.title,
        type: (n.type as any) || 'topic',
        statusEnabled: n.statusEnabled !== false
      }));
  } else if (roadmapDefinition && roadmapDefinition.nodes && roadmapDefinition.nodes.length > 0) {
    trackableNodes = roadmapDefinition.nodes.filter(isEligibleLearningNode);
  }


  const total = trackableNodes.length;
  let done = 0;
  let learning = 0;
  let skipped = 0;
  let notStarted = 0;
  let remainingMinutes = 0;
  let hasEstimatedMinutes = false;

  const statusMap: Record<string, NodeStatus> = {};

  for (const node of trackableNodes) {
    const st = nodeStatuses[node.id] || 'default';
    statusMap[node.id] = st;

    if (st === 'done') {
      done++;
    } else if (st === 'learning') {
      learning++;
    } else if (st === 'skipped') {
      skipped++;
    } else {
      notStarted++;
    }

    if (st !== 'done' && st !== 'skipped') {
      if (typeof node.estimatedMinutes === 'number' && node.estimatedMinutes > 0) {
        remainingMinutes += node.estimatedMinutes;
        hasEstimatedMinutes = true;
      }
    }
  }

  const completionPercentage = total > 0 ? Math.round((done / total) * 100) : 0;
  const isComplete = total > 0 && done === total;

  // Format remaining time if available
  let formattedRemainingTime: string | null = null;
  if (hasEstimatedMinutes && remainingMinutes > 0) {
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    if (hours > 0 && mins > 0) {
      formattedRemainingTime = `${hours}h ${mins}m`;
    } else if (hours > 0) {
      formattedRemainingTime = `${hours}h`;
    } else {
      formattedRemainingTime = `${mins}m`;
    }
  }

  // 2. Section progress calculation
  const sectionsMap: Record<string, { id: string; title: string; nodes: RoadmapNode[] }> = {};
  
  if (roadmapDefinition && roadmapDefinition.nodes) {
    const mainTopics = roadmapDefinition.nodes.filter(n => n.type === 'topic');
    for (const topic of mainTopics) {
      const subtopics = roadmapDefinition.nodes.filter(
        n => n.type === 'subtopic' && (n.parentId === topic.id || n.parentTitle === topic.title) && isEligibleLearningNode(n)
      );
      if (subtopics.length > 0) {
        sectionsMap[topic.id] = {
          id: topic.id,
          title: topic.title,
          nodes: subtopics
        };
      }
    }
  }

  const sections: SectionProgress[] = Object.values(sectionsMap).map(sec => {
    let sTotal = sec.nodes.length;
    let sDone = 0;
    let sLearning = 0;
    let sSkipped = 0;
    let sNotStarted = 0;

    for (const n of sec.nodes) {
      const st = nodeStatuses[n.id] || 'default';
      if (st === 'done') sDone++;
      else if (st === 'learning') sLearning++;
      else if (st === 'skipped') sSkipped++;
      else sNotStarted++;
    }

    const pct = sTotal > 0 ? Math.round((sDone / sTotal) * 100) : 0;

    return {
      id: sec.id,
      title: sec.title,
      total: sTotal,
      done: sDone,
      learning: sLearning,
      skipped: sSkipped,
      notStarted: sNotStarted,
      percentage: pct
    };
  });

  // 3. Next Topic Recommendation logic (Deterministic)
  let nextRecommendation: RecommendedTopic | null = null;

  // A: Priority to existing "learning" node
  const activeLearningNode = trackableNodes.find(n => (nodeStatuses[n.id] || 'default') === 'learning');

  if (activeLearningNode) {
    nextRecommendation = {
      nodeId: activeLearningNode.id,
      title: activeLearningNode.title,
      description: activeLearningNode.description || undefined,
      reason: 'Currently in progress',
      isContinueLearning: true
    };
  } else {
    // B: Next unstarted topic whose prerequisites are satisfied
    const unstartedNodes = trackableNodes.filter(n => (nodeStatuses[n.id] || 'default') === 'default');

    let candidate: RoadmapNode | null = null;

    for (const node of unstartedNodes) {
      // Check if prerequisites are met
      if (node.prerequisites && node.prerequisites.length > 0) {
        const prereqsMet = node.prerequisites.every(pId => {
          const st = nodeStatuses[pId];
          return st === 'done';
        });
        if (prereqsMet) {
          candidate = node;
          break;
        }
      } else {
        // No prerequisites required
        candidate = node;
        break;
      }
    }

    // Fallback: pick first unstarted node
    if (!candidate && unstartedNodes.length > 0) {
      candidate = unstartedNodes[0];
    }

    if (candidate) {
      nextRecommendation = {
        nodeId: candidate.id,
        title: candidate.title,
        description: candidate.description || undefined,
        reason: candidate.prerequisites && candidate.prerequisites.length > 0
          ? 'Previous prerequisite topics are complete'
          : 'Next recommended topic in learning path',
        isContinueLearning: false
      };
    }
  }

  return {
    roadmapId,
    total,
    done,
    learning,
    skipped,
    notStarted,
    completionPercentage,
    isComplete,
    remainingMinutes,
    formattedRemainingTime,
    lastUpdated,
    sections,
    nextRecommendation
  };
}

export function getAITutorProgressContext(
  roadmapId: string,
  roadmapDefinition: RoadmapDefinition | null,
  nodeStatuses: Record<string, NodeStatus>
) {
  const calc = calculateRoadmapProgress(roadmapDefinition, nodeStatuses);
  return {
    roadmapId,
    title: roadmapDefinition?.title || roadmapId,
    completionPercentage: calc.completionPercentage,
    isComplete: calc.isComplete,
    totalTopics: calc.total,
    doneCount: calc.done,
    learningCount: calc.learning,
    skippedCount: calc.skipped,
    notStartedCount: calc.notStarted,
    nextRecommendedTopic: calc.nextRecommendation ? {
      title: calc.nextRecommendation.title,
      isContinueLearning: calc.nextRecommendation.isContinueLearning,
      reason: calc.nextRecommendation.reason
    } : null
  };
}
