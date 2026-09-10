// ============================================================================
// CareerMapper domain types.
//
// These types describe the REAL shape of data that will eventually come from
// the backend pipeline (extraction → normalization → domain detection →
// rule-based matching → ML prediction → hybrid recommendation).
//
// Nothing in the UI should assume fields beyond what's declared here.
// When backend integration happens (Phase 9), `services/api.ts` swaps its
// mock implementations for real fetch calls returning these exact shapes —
// components do not change.
// ============================================================================

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type DomainId = 'it' | 'mechanical' | 'ece' | 'mba' | 'bcom';

export interface Domain {
  id: DomainId;
  label: string;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: ProficiencyLevel;
  /** true if this skill came directly from resume/manual entry (vs. inferred) */
  source: 'extracted' | 'manual';
}

export interface DomainDetectionResult {
  domain: Domain;
  /** 0-100 confidence score from the domain detection step */
  confidence: number;
}

export interface SkillMatch {
  skillId: string;
  skillName: string;
  skillRaw?: any;
  /** how strong this skill's contribution to the match is */
  status: 'strong' | 'moderate';
}

export interface SkillGapEntry {
  skillName: string;
  skillRaw?: any;
  /** 'strengthen' = user has it but weak; 'learn' = user doesn't have it at all */
  gapType: 'strengthen' | 'learn';
}

export interface CareerMatch {
  id: string;
  roleTitle: string;
  domain: DomainId;
  /** 0-100 hybrid recommendation score */
  matchScore: number;
  summary: string;
  matchedSkills: SkillMatch[];
  gaps: SkillGapEntry[];
}

export interface CareerDetail extends CareerMatch {
  overview: string;
  whyThisRole: string;
  strengths: string[];
  roadmapId: string;
}

export interface RoadmapStage {
  id: string;
  order: number;
  title: string;
  description: string;
  status: 'done' | 'current' | 'upcoming';
  skills: string[];
}

export interface Roadmap {
  id: string;
  careerId: string;
  stages: RoadmapStage[];
}

export interface CareerProfile {
  domain: DomainDetectionResult;
  skills: Skill[];
  topMatch?: CareerMatch;
  otherMatches: CareerMatch[];
}

// -------- Analysis pipeline (upload flow) --------

export type AnalysisStageId =
  | 'reading'
  | 'extracting'
  | 'proficiency'
  | 'domain'
  | 'matching';

export interface AnalysisStageStatus {
  id: AnalysisStageId;
  label: string;
  status: 'pending' | 'active' | 'done' | 'error';
}

// -------- API envelope --------

/** Every service call resolves to this so the UI can render loading/error/empty states uniformly. */
export type ApiResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
  | { status: 'empty' };

// -------- Future features (not implemented — types exist so UI can render
// honest "coming soon" states without inventing data) --------

export interface FutureJob {
  title: string;
  company: string;
}

// -------- Market Intelligence Types --------

export interface MarketOverview {
  description: string;
  responsibilities: string[];
  environment: string;
  experienceLevels: string;
  technologies: string[];
}

export interface MarketSignal {
  signal: string;
  source: string;
}

export interface MarketDemand {
  status: 'growing' | 'stable' | 'declining' | 'mixed' | 'insufficient_data';
  confidence: 'high' | 'medium' | 'low';
  signals: MarketSignal[];
}

export interface SourceMetadata {
  title: string;
  organization: string;
  url: string;
}

export interface HistoricalEvidence {
  year: number;
  metric: 'job_postings' | 'salary_lpa' | 'employment_count';
  value: number | null;
  unit: 'count' | 'inr' | 'percentage';
  source: SourceMetadata;
  confidence: string;
}

export interface CompanyListing {
  company: string;
  role: string;
  location: string;
  experience: string;
  requiredSkills: string[];
  preferredSkills: string[];
  salary?: string | null;
  postingDate?: string | null;
  source: {
    title: string;
    url: string;
  };
}

export interface SalaryRange {
  experienceLevel: string;
  min: number;
  max: number | null;
  currency: string;
  period: string;
  source: SourceMetadata;
}

export interface SourceCitation {
  title: string;
  organization: string;
  sourceType: string;
  url: string;
}

export interface UserGap {
  marketReadiness: number;
  covered: string[];
  gaps: {
    high: string[];
    medium: string[];
  };
}

export interface MarketAnalysisData {
  role: string;
  country: string;
  overview: MarketOverview;
  demand: MarketDemand;
  historicalEvidence: HistoricalEvidence[];
  skills: {
    core: string[];
    emerging: string[];
    stable: string[];
    declining: string[];
  };
  companies: CompanyListing[];
  salary: SalaryRange[];
  sources: SourceCitation[];
  userGap: UserGap;
}

// -------- Role Roadmap Interactive Graph Types --------

export interface NodePosition {
  x: number;
  y: number;
}

export type RoadmapNodeStatus = 'COMPLETED' | 'IN_PROGRESS' | 'AVAILABLE' | 'LOCKED';
export type MatchStatus = 'MATCHED' | 'GAP' | 'WEAK';

export interface ResourceLink {
  title: string;
  url: string;
  type?: 'Doc' | 'Article' | 'Video' | 'Course' | 'Guide';
}

export interface RoleRoadmapNode {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours?: number;
  whyItMatters?: string;
  prerequisites?: string[];
  childrenIds?: string[];
  subtopics?: string[];
  resources?: ResourceLink[];
  status?: RoadmapNodeStatus;
  userMatch?: MatchStatus;
  position?: NodePosition;
  jobRelevance?: 'High' | 'Medium' | 'Essential' | 'Recommended';
  isOfficialTarget?: boolean;
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'default' | 'recommended' | 'optional';
}

export interface RoleRoadmapGraph {
  slug: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  nodes: RoleRoadmapNode[];
  edges: RoadmapEdge[];
  canvasWidth?: number;
  canvasHeight?: number;
}
