export type NodeType = 'main' | 'topic' | 'subtopic' | 'navigation' | 'special' | 'horizontal' | 'vertical' | 'section' | 'label' | 'title' | 'linksgroup' | 'paragraph' | 'button' | 'chapter' | 'todo' | 'todo-checkbox' | (string & {});

export type NodeStatus = 'default' | 'learning' | 'done' | 'skipped';

export type ResourceType = 'documentation' | 'article' | 'video' | 'course' | 'guide' | 'project';

export interface Resource {
  id?: string;
  title: string;
  url: string;
  type: ResourceType;
  provider?: string;
  isFree?: boolean;
  isRecommended?: boolean;
}

export interface ProjectReference {
  id: string;
  title: string;
  description: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  url?: string;
}

export interface AssessmentReference {
  enabled: boolean;
  type: 'mcq' | 'code' | 'quiz';
  estimatedMinutes: number;
}

export interface RelatedRoadmap {
  id: string;
  title: string;
  slug: string;
  url?: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  type: NodeType;

  description?: string | null;
  parentId?: string | null;
  parentTitle?: string | null;
  prerequisites?: string[];

  statusEnabled?: boolean;

  resources?: Resource[];
  recommendedResources?: Resource[];
  alternativeResources?: Resource[];

  estimatedMinutes?: number | null;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | null;
  priority?: 'low' | 'medium' | 'high' | 'critical' | null;

  destination?: string | null;
  relatedRoadmaps?: string[];

  projects?: ProjectReference[];
  assessment?: AssessmentReference;

  aiContext?: string;
  orderStrictness?: 'strict' | 'recommended' | 'flexible';
  recommendationType?: 'personal' | 'alternative' | 'optional';

  link?: string | null;
}

export interface RoadmapDefinition {
  id: string;
  slug: string;
  title: string;
  version?: string;
  description?: string;
  category?: string;
  prerequisites?: string[];

  nodes: RoadmapNode[];
  edges?: any[];
  badges?: any[];

  relatedRoadmaps?: RelatedRoadmap[];
}

export interface RoadmapProgressSummary {
  totalNodes: number;
  completedNodes: number;
  learningNodes: number;
  skippedNodes: number;
  remainingNodes: number;
  completionPercentage: number;
}
