import { normalizeAndResolveSkill } from './normalization.service.js';

/**
 * Normalizes a raw profile object (often sent by the client or parsed from database)
 * into a standard data structure consumed by the gap and priority engines.
 */
export const getNormalizedUserProfile = async (rawProfile) => {
  const profile = rawProfile || {};
  
  // Normalize and resolve skills
  const rawSkills = Array.isArray(profile.skills) ? profile.skills : [];
  const normalizedSkills = await Promise.all(
    rawSkills.map(async (s) => {
      const name = typeof s === 'object' && s !== null ? s.name : s;
      let level = typeof s === 'object' && s !== null ? s.level : 'beginner';
      level = level ? String(level).toLowerCase().trim() : 'beginner';
      
      if (!['beginner', 'intermediate', 'advanced', 'expert'].includes(level)) {
        level = 'beginner';
      }
      
      const resolved = await normalizeAndResolveSkill(name);
      return {
        ...resolved,
        level
      };
    })
  );

  return {
    skills: normalizedSkills.filter(s => s.canonicalId),
    experience: profile.experience || '',
    education: profile.education || '',
    projects: Array.isArray(profile.projects) ? profile.projects : [],
    certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
    targetRoles: Array.isArray(profile.targetRoles) ? profile.targetRoles : [],
    existingAssessmentResults: Array.isArray(profile.existingAssessmentResults) ? profile.existingAssessmentResults : [],
    relevantEvidence: Array.isArray(profile.relevantEvidence) ? profile.relevantEvidence : []
  };
};
