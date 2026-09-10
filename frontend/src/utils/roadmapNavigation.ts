export interface NavigationRouteConfig {
  id?: string;
  title?: string;
  route: string;
  isExternal?: boolean;
}

export const NAVIGATION_MAP: Record<string, NavigationRouteConfig> = {
  // Button IDs
  'qXKNK_IsGS8-JgLK-Q9oU': { route: '/role-roadmaps/backend' }, // Nodejs
  'slf6jmim4p9ti6ZRHOZe_': { route: '/role-roadmaps/fullstack' }, // Fullstack
  'Df3nTlTvSQkMGzpufRo9q': { route: '/role-roadmaps/backend' }, // Backend
  '-sFboM4eFUMVq1tlPl-fV': { route: '/role-roadmaps/design-system' }, // Design System
  '6kWlgayUZQnr9z88fUOkk': { route: '/role-roadmaps/typescript' }, // TypeScript
  'k4hMVVBMatedUq5EKiMo4': { route: '/role-roadmaps/prompt-engineering' }, // Prompt Engineering
  'vpimgXt10UQFBDVHR21IU': { route: '/role-roadmaps/ai-agents' }, // AI Agents
  'MfErpYwkJ0wiWJZEUVfrb': { route: '/role-roadmaps/frontend' }, // Visit Beginner Friendly Version
  '2zqZkyVgigifcRS1H7F_b': { route: 'https://roadmap.sh', isExternal: true }, // roadmap.sh button
  'w4AronIkLVW4DiB8BB_cE': { route: 'https://roadmap.sh/frontend/projects?difficulty=beginner', isExternal: true },
  'cSn0Mp45AKmj-bn-b-j_I': { route: 'https://roadmap.sh/frontend/projects?difficulty=intermediate', isExternal: true },
  'YFhTAvoRXc8aIa9FVZgtb': { route: 'https://roadmap.sh/frontend/projects?difficulty=advanced', isExternal: true },

  // Link items inside linksgroup
  'qH0LPtPGcn4Lc1RhXwKVp': { route: '/role-roadmaps/javascript' }, // JavaScript Roadmap
  'NHvKDG4LZt_wRREFYubCd': { route: '/role-roadmaps/react' }, // React Roadmap
  'lYZdNGa-RbSvjTZyyfsHK': { route: '/role-roadmaps/typescript' }, // TypeScript Roadmap
  '-rJot3Dyu48vRQdfpz7HS': { route: '/role-roadmaps/backend' }, // Node.js Roadmap

  // Data Engineer Roadmap buttons & links
  'PUVM4XqV7j5nXBAbIAKwG': { route: '/role-roadmaps/python-data-analysis' },
  'Cj1uO2k_hO5eIQ77jxY6c': { route: '/role-roadmaps/sql' },
  'gu0QppNXop66pFxKFKb4r': { route: '/role-roadmaps/python-data-analysis' },
  'hl06pnTWoMnzLmiOz9Sga': { route: '/role-roadmaps/devops' },
  'KGFYqDgOVSFXd2lbg8vGx': { route: '/role-roadmaps/sql' },
  'xcOlVnhYfnSCfzLpkcaRS': { route: '/role-roadmaps/data-analyst' },
  'UZq7Aq3nhidsXdsKeEnNF': { route: '/role-roadmaps/mlops' },
  'ktU7bNX3hu-_hTFE1CjrM': { route: 'https://roadmap.sh', isExternal: true },

  // PostgreSQL DBA Roadmap buttons & links
  'gC8lsIdYLRzo3HzwVqtm1': { route: '/role-roadmaps/mongodb' },
  'uSLzfLPXxS5-P7ozscvjZ': { route: '/role-roadmaps/backend' },
  '7RR4BlugrhJQpI0MeMj8V': { route: '/role-roadmaps/devops' },
  'dA8pyw5Eq2PCZrMKfg5qH': { route: '/role-roadmaps/mongodb' },
  'Wf1doH-r2O2KQg10KlDTg': { route: '/role-roadmaps/backend' },
};

export function getNavigationConfig(nodeId?: string, linkUrl?: string, _title?: string): NavigationRouteConfig | undefined {
  if (nodeId && NAVIGATION_MAP[nodeId]) {
    return NAVIGATION_MAP[nodeId];
  }
  if (linkUrl) {
    if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
      return { route: linkUrl, isExternal: true };
    }
    return { route: linkUrl, isExternal: false };
  }
  return undefined;
}

export function getRoadmapDefinitionBySlug(_slug: string) {
  try {
    return null;
  } catch (e) {
    return null;
  }
}
