const LEVEL_VALUES = {
  none: 0,
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4
};

const DEFAULT_PRIORITY_CONFIG = {
  weights: {
    requirementType: 40,   // Required vs preferred
    gapSize: 30,           // Difference in proficiency levels
    roleRelevance: 20,     // General relevance to the role
    companyRelevance: 10   // Specific relevance to the company
  },
  prereqBoost: 15          // Score boost for foundational prerequisites
};

/**
 * Calculates priority scores for all identified skill gaps using a configurable weighting formula.
 */
export const calculateSkillPriorities = (skillGaps, config = DEFAULT_PRIORITY_CONFIG) => {
  const { weights, prereqBoost } = config;

  // Build dependency map to identify which skills are prerequisites for others in the gaps list
  const dependentSkills = new Set();
  skillGaps.forEach(g => {
    (g.skill.prerequisites || []).forEach(prereqId => {
      dependentSkills.add(prereqId);
    });
  });

  return skillGaps.map(g => {
    if (!g.gap) {
      return { ...g, priority: 'LOW' };
    }

    // 1. Requirement Type Score (Max: weights.requirementType)
    const reqMultiplier = g.requirementType === 'required' ? 1.0 : 0.5;
    const reqScore = weights.requirementType * reqMultiplier;

    // 2. Gap Size Score (Max: weights.gapSize)
    const currentVal = LEVEL_VALUES[g.currentLevel] || 0;
    const requiredVal = LEVEL_VALUES[g.requiredLevel] || 2; // default intermediate
    const diff = Math.max(0, requiredVal - currentVal);
    // Diff can be 1, 2, 3, or 4. Divide by 4 to get ratio.
    const gapScore = weights.gapSize * (diff / 4);

    // 3. Role Relevance Score (Max: weights.roleRelevance)
    const roleScore = weights.roleRelevance * ((g.roleRelevance || 5) / 10);

    // 4. Company Relevance Score (Max: weights.companyRelevance)
    const companyScore = weights.companyRelevance * ((g.companyRelevance || 5) / 10);

    // 5. Prerequisite Boost
    let boost = 0;
    if (dependentSkills.has(g.skill.canonicalId)) {
      boost = prereqBoost;
    }

    // Total Score
    let totalScore = reqScore + gapScore + roleScore + companyScore + boost;
    totalScore = Math.max(0, Math.min(100, Math.round(totalScore)));

    // Map score to priority class
    let priority = 'MEDIUM';
    if (totalScore >= 75) {
      priority = 'CRITICAL';
    } else if (totalScore >= 55) {
      priority = 'HIGH';
    } else if (totalScore >= 35) {
      priority = 'MEDIUM';
    } else {
      priority = 'LOW';
    }

    return {
      ...g,
      priority
    };
  });
};
