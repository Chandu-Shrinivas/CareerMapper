/**
 * CAREERMAPPER — ROLE RESOLUTION & ROADMAP LINKAGE SYSTEM
 * 
 * Deterministically normalizes Career Analysis recommended roles,
 * resolves aliases to a single canonical RoleDefinition, and links
 * to existing Role Roadmaps.
 */

export interface RoleDefinition {
  id: string;
  canonicalName: string;
  aliases: string[];
  type: "role";
  roadmapId?: string;
}

export interface RoleRoadmapMatch {
  roleId: string;
  canonicalName: string;
  roadmapId: string;
  route: string;
}

/**
 * CENTRALIZED ALIAS REGISTRY & ROLE DEFINITIONS
 * Source of truth for all role definitions and alias mappings in CareerMapper.
 */
export const ROLE_DEFINITIONS: Record<string, RoleDefinition> = {
  "frontend-developer": {
    id: "frontend-developer",
    type: "role",
    canonicalName: "Frontend Developer",
    aliases: [
      "frontend developer",
      "frontend engineer",
      "front-end developer",
      "front end developer",
      "front-end engineer",
      "front end engineer",
      "client-side developer",
      "client side developer",
      "web developer",
      "ui developer",
      "frontend web developer"
    ],
    roadmapId: "frontend"
  },

  "backend-developer": {
    id: "backend-developer",
    type: "role",
    canonicalName: "Backend Developer",
    aliases: [
      "backend developer",
      "backend engineer",
      "back-end developer",
      "back end developer",
      "back-end engineer",
      "back end engineer",
      "server-side developer",
      "server side developer",
      "server-side engineer",
      "server side engineer",
      "backend web developer"
    ],
    roadmapId: "backend"
  },

  "full-stack-developer": {
    id: "full-stack-developer",
    type: "role",
    canonicalName: "Full Stack Developer",
    aliases: [
      "full stack developer",
      "fullstack developer",
      "full-stack developer",
      "full stack engineer",
      "fullstack engineer",
      "full-stack engineer",
      "web engineer"
    ],
    roadmapId: "fullstack"
  },

  "devops-engineer": {
    id: "devops-engineer",
    type: "role",
    canonicalName: "DevOps Engineer",
    aliases: [
      "devops engineer",
      "devops developer",
      "dev ops engineer",
      "dev-ops engineer",
      "site reliability engineer",
      "sre",
      "infrastructure engineer",
      "platform engineer",
      "cloud devops engineer"
    ],
    roadmapId: "devops"
  },

  "android-developer": {
    id: "android-developer",
    type: "role",
    canonicalName: "Android Developer",
    aliases: [
      "android developer",
      "android engineer",
      "android app developer",
      "android mobile developer"
    ],
    roadmapId: "android"
  },

  "ai-engineer": {
    id: "ai-engineer",
    type: "role",
    canonicalName: "AI Engineer",
    aliases: [
      "ai engineer",
      "artificial intelligence engineer",
      "ai developer",
      "generative ai engineer",
      "genai engineer",
      "ai solutions engineer"
    ],
    roadmapId: "ai-engineer"
  },

  "data-analyst": {
    id: "data-analyst",
    type: "role",
    canonicalName: "Data Analyst",
    aliases: [
      "data analyst",
      "business intelligence analyst",
      "bi analyst",
      "analytics engineer",
      "data analytics specialist"
    ],
    roadmapId: "data-analyst"
  },

  "devsecops-engineer": {
    id: "devsecops-engineer",
    type: "role",
    canonicalName: "DevSecOps Engineer",
    aliases: [
      "devsecops engineer",
      "devsecops expert",
      "devsecops specialist",
      "secops engineer",
      "security devops engineer"
    ],
    roadmapId: "devsecops"
  },

  "data-engineer": {
    id: "data-engineer",
    type: "role",
    canonicalName: "Data Engineer",
    aliases: [
      "data engineer",
      "big data engineer",
      "data pipeline engineer",
      "data infrastructure engineer"
    ],
    roadmapId: "data-engineer"
  },

  "postgresql-dba": {
    id: "postgresql-dba",
    type: "role",
    canonicalName: "PostgreSQL DBA",
    aliases: [
      "postgresql dba",
      "postgres dba",
      "postgresql database administrator",
      "postgres database administrator",
      "database administrator",
      "dba"
    ],
    roadmapId: "postgresql-dba"
  },

  "machine-learning-engineer": {
    id: "machine-learning-engineer",
    type: "role",
    canonicalName: "Machine Learning Engineer",
    aliases: [
      "machine learning engineer",
      "ml engineer",
      "machine learning developer",
      "ml developer",
      "deep learning engineer"
    ],
    roadmapId: "machine-learning"
  },

  "ai-data-scientist": {
    id: "ai-data-scientist",
    type: "role",
    canonicalName: "AI & Data Scientist",
    aliases: [
      "ai data scientist",
      "ai & data scientist",
      "data scientist",
      "ai and data scientist",
      "applied scientist",
      "research scientist"
    ],
    roadmapId: "ai-data-scientist"
  },

  "blockchain-developer": {
    id: "blockchain-developer",
    type: "role",
    canonicalName: "Blockchain Developer",
    aliases: [
      "blockchain developer",
      "blockchain engineer",
      "web3 developer",
      "smart contract developer",
      "solidity developer",
      "crypto engineer"
    ],
    roadmapId: "blockchain"
  },

  "ios-developer": {
    id: "ios-developer",
    type: "role",
    canonicalName: "iOS Developer",
    aliases: [
      "ios developer",
      "ios engineer",
      "swift developer",
      "ios app developer",
      "apple developer"
    ],
    roadmapId: "ios"
  },

  "software-architect": {
    id: "software-architect",
    type: "role",
    canonicalName: "Software Architect",
    aliases: [
      "software architect",
      "solutions architect",
      "application architect",
      "enterprise architect",
      "technical architect"
    ],
    roadmapId: "software-architect"
  },

  "qa-engineer": {
    id: "qa-engineer",
    type: "role",
    canonicalName: "QA Engineer",
    aliases: [
      "qa engineer",
      "quality assurance engineer",
      "software test engineer",
      "qa automation engineer",
      "test automation engineer",
      "qa analyst",
      "software tester",
      "testing engineer"
    ],
    roadmapId: "qa-engineer"
  },

  "cyber-security-expert": {
    id: "cyber-security-expert",
    type: "role",
    canonicalName: "Cyber Security Expert",
    aliases: [
      "cyber security expert",
      "cyber security engineer",
      "cybersecurity specialist",
      "information security engineer",
      "infosec engineer",
      "security engineer",
      "cyber security consultant"
    ],
    roadmapId: "cyber-security"
  },

  "api-design-engineer": {
    id: "api-design-engineer",
    type: "role",
    canonicalName: "API Design Engineer",
    aliases: [
      "api design engineer",
      "api designer",
      "api architect",
      "api engineer"
    ],
    roadmapId: "api-design"
  },

  "technical-writer": {
    id: "technical-writer",
    type: "role",
    canonicalName: "Technical Writer",
    aliases: [
      "technical writer",
      "documentation engineer",
      "tech writer",
      "content engineer"
    ],
    roadmapId: "technical-writer"
  },

  "ux-designer": {
    id: "ux-designer",
    type: "role",
    canonicalName: "UX Designer",
    aliases: [
      "ux designer",
      "ui/ux designer",
      "ui ux designer",
      "user experience designer",
      "product designer",
      "interaction designer"
    ],
    roadmapId: "ux-design"
  },

  "game-developer": {
    id: "game-developer",
    type: "role",
    canonicalName: "Game Developer",
    aliases: [
      "game developer",
      "game engineer",
      "game programmer",
      "unity developer",
      "unreal engine developer"
    ],
    roadmapId: "game-developer"
  },

  "product-manager": {
    id: "product-manager",
    type: "role",
    canonicalName: "Product Manager",
    aliases: [
      "product manager",
      "pm",
      "technical product manager",
      "associate product manager",
      "group product manager"
    ],
    roadmapId: "product-manager"
  },

  "mlops-engineer": {
    id: "mlops-engineer",
    type: "role",
    canonicalName: "MLOps Engineer",
    aliases: [
      "mlops engineer",
      "ml ops engineer",
      "machine learning ops engineer",
      "ml platform engineer"
    ],
    roadmapId: "mlops"
  },

  "system-design-architect": {
    id: "system-design-architect",
    type: "role",
    canonicalName: "System Design Architect",
    aliases: [
      "system design architect",
      "system designer",
      "systems architect"
    ],
    roadmapId: "system-design"
  },

  "engineering-manager": {
    id: "engineering-manager",
    type: "role",
    canonicalName: "Engineering Manager",
    aliases: [
      "engineering manager",
      "em",
      "software engineering manager",
      "development manager",
      "tech lead manager"
    ],
    roadmapId: "engineering-manager"
  },

  "forward-deployed-engineer": {
    id: "forward-deployed-engineer",
    type: "role",
    canonicalName: "Forward Deployed Engineer",
    aliases: [
      "forward deployed engineer",
      "fde",
      "forward deployed software engineer"
    ],
    roadmapId: "forward-deployed-engineer"
  },

  "aspnet-core-developer": {
    id: "aspnet-core-developer",
    type: "role",
    canonicalName: "ASP.NET Core Developer",
    aliases: [
      "asp.net core developer",
      "aspnet core developer",
      "asp.net core engineer",
      "asp.net developer",
      ".net developer",
      "dot net developer",
      "c# developer",
      "c# engineer",
      ".net engineer"
    ],
    roadmapId: "aspnet-core"
  },

  // Roles in taxonomy without a roadmap (Requirement 22)
  "cloud-security-specialist": {
    id: "cloud-security-specialist",
    type: "role",
    canonicalName: "Cloud Security Specialist",
    aliases: [
      "cloud security specialist",
      "cloud security engineer",
      "aws security specialist"
    ],
    roadmapId: undefined
  },

  "embedded-systems-engineer": {
    id: "embedded-systems-engineer",
    type: "role",
    canonicalName: "Embedded Systems Engineer",
    aliases: [
      "embedded systems engineer",
      "embedded engineer",
      "firmware engineer"
    ],
    roadmapId: undefined
  }
};

/**
 * NORMALIZATION UTILITY
 * Handles case, leading/trailing whitespace, repeated whitespace, hyphens, en/em dashes, and punctuation.
 */
export function normalizeRoleName(roleName: string): string {
  if (!roleName) return '';
  return roleName
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, ' ')
    .replace(/[^a-z0-9#+.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * DETERMINISTIC ROLE RESOLVER
 * Priority:
 * 1. Exact canonical Role ID match
 * 2. Exact normalized Canonical Name match
 * 3. Exact normalized Alias match
 * 4. Otherwise unresolved (null)
 */
export function resolveCareerRole(roleName: string): RoleDefinition | null {
  if (!roleName) return null;

  const rawTrimmed = roleName.trim();
  const rawIdSlug = rawTrimmed.toLowerCase().replace(/\s+/g, '-');

  // 1. Exact Role ID match
  if (ROLE_DEFINITIONS[rawTrimmed.toLowerCase()]) {
    return ROLE_DEFINITIONS[rawTrimmed.toLowerCase()];
  }
  if (ROLE_DEFINITIONS[rawIdSlug]) {
    return ROLE_DEFINITIONS[rawIdSlug];
  }

  const normInput = normalizeRoleName(roleName);
  if (!normInput) return null;

  // 2. Exact Normalized Canonical Name Match
  for (const roleDef of Object.values(ROLE_DEFINITIONS)) {
    if (normalizeRoleName(roleDef.canonicalName) === normInput) {
      return roleDef;
    }
  }

  // 3. Exact Normalized Alias Match
  for (const roleDef of Object.values(ROLE_DEFINITIONS)) {
    for (const alias of roleDef.aliases) {
      if (normalizeRoleName(alias) === normInput) {
        return roleDef;
      }
    }
  }

  // 4. Unresolved
  return null;
}

/**
 * GET CANONICAL ROLE NAME
 * Returns the canonical display name if resolved, or the original roleName if unresolved.
 */
export function getCanonicalRoleName(roleName: string): string {
  const resolved = resolveCareerRole(roleName);
  return resolved ? resolved.canonicalName : roleName;
}

/**
 * GET ROLE ROADMAP
 * Returns the roadmap details if an existing Role Roadmap is registered for the resolved role.
 * Returns null if no roadmap exists, or if the role is non-role roadmap (e.g. DSA).
 */
export function getRoleRoadmap(roleName: string): RoleRoadmapMatch | null {
  const resolved = resolveCareerRole(roleName);
  if (!resolved || !resolved.roadmapId) {
    return null;
  }

  // Explicit safety check: DSA and other non-role roadmaps must NOT be linked here
  if (resolved.roadmapId === 'datastructures-and-algorithms' || resolved.roadmapId === 'dsa') {
    return null;
  }

  return {
    roleId: resolved.id,
    canonicalName: resolved.canonicalName,
    roadmapId: resolved.roadmapId,
    route: `/role-roadmaps/${resolved.roadmapId}`
  };
}

/**
 * HAS ROLE ROADMAP
 * Checks whether an existing Role Roadmap is available for the given roleName.
 */
export function hasRoleRoadmap(roleName: string): boolean {
  return getRoleRoadmap(roleName) !== null;
}
