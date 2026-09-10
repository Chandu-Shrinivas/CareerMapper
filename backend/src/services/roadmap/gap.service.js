const LEVEL_VALUES = {
  none: 0,
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4
};

/**
 * Compares normalized user profile skills against required and preferred target skills.
 * Calculates deterministic gaps based on level weights.
 */
export const calculateSkillGaps = (userProfile, targetRoleInfo, companyInfo = {}) => {
  const gaps = [];

  const userSkillMap = {};
  (userProfile.skills || []).forEach(s => {
    userSkillMap[s.canonicalId] = s.level || 'beginner';
  });

  const processedCanonicalIds = new Set();

  const evaluateSkill = (skill, requirementType) => {
    const canonicalId = skill.canonicalId;
    if (processedCanonicalIds.has(canonicalId)) return;
    processedCanonicalIds.add(canonicalId);

    const currentLevel = userSkillMap[canonicalId] || 'none';
    
    // Determine required level: required skills require advanced/intermediate, preferred require intermediate/beginner
    const requiredLevel = requirementType === 'required' ? 'advanced' : 'intermediate';

    const currentVal = LEVEL_VALUES[currentLevel] || 0;
    const requiredVal = LEVEL_VALUES[requiredLevel] || 0;
    const gapExists = currentVal < requiredVal;

    // Calculate relevance metrics
    const roleRelevance = requirementType === 'required' ? 10 : 5;
    
    // Evaluate company relevance: check if skill name is in company's technologies or description
    let companyRelevance = 5;
    if (companyInfo && companyInfo.name) {
      const companyText = `${companyInfo.description || ''} ${(companyInfo.technologies || []).join(' ')}`.toLowerCase();
      if (companyText.includes(skill.displayName.toLowerCase()) || companyText.includes(canonicalId)) {
        companyRelevance = 10;
      }
    }

    let evidence = '';
    if (gapExists) {
      if (currentLevel === 'none') {
        evidence = `Foundational gap: Skill is completely missing from profile. Target proficiency: ${requiredLevel}.`;
      } else {
        evidence = `Proficiency gap: Current level is ${currentLevel}, but target level requires ${requiredLevel}.`;
      }
    } else {
      evidence = `Requirement met: Current level is ${currentLevel}, which satisfies the target level ${requiredLevel}.`;
    }

    gaps.push({
      skill,
      currentLevel,
      requiredLevel,
      gap: gapExists,
      requirementType,
      roleRelevance,
      companyRelevance,
      priority: 'LOW', // calculated by Priority Engine
      evidence
    });
  };

  // Process required skills
  (targetRoleInfo.requiredSkills || []).forEach(s => evaluateSkill(s, 'required'));

  // Process preferred skills
  (targetRoleInfo.preferredSkills || []).forEach(s => evaluateSkill(s, 'preferred'));

  return gaps;
};
