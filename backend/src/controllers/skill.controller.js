import { normalizeSkills } from '../utils/skillNormalizer.js';
import { detectDomain } from '../services/domain.service.js';
import { resolveSkill } from '../services/skill.service.js';

export const detectUserDomain = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ error: 'No skills provided' });
    }
    if (!skills.every(skill => skill.name)) {
      return res.status(400).json({ error: 'Each skill must have a name' });
    }

    // 1. Normalize skills
    const normalizedSkills = normalizeSkills(skills);

    // 2. Detect domain
    const { domain, confidence, domains } = detectDomain(normalizedSkills);

    // Format skill names for response presentation using resolved metadata
    const prettySkills = await Promise.all(normalizedSkills.map(async (s) => {
      const resolved = await resolveSkill(s.name);
      return {
        name: resolved.display,
        canonical: resolved.canonical,
        level: s.level,
        category: resolved.category,
        iconUrl: resolved.iconUrl,
        iconType: resolved.iconType,
        iconName: resolved.iconName
      };
    }));

    // 3. Return response
    return res.status(200).json({
      skills: prettySkills,
      domain,
      confidence,
      domains
    });
  } catch (error) {
    console.error('Error in detectUserDomain:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const resolveSkillsBatch = async (req, res) => {
  try {
    const { skills } = req.body;
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills array is required.' });
    }

    const resolved = {};
    await Promise.all(skills.map(async (skill) => {
      if (typeof skill === 'string' && skill.trim()) {
        const result = await resolveSkill(skill);
        resolved[skill.toLowerCase().trim()] = result;
      }
    }));

    return res.status(200).json({
      status: 'success',
      resolved
    });
  } catch (error) {
    console.error('Error in resolveSkillsBatch:', error);
    return res.status(500).json({ error: error.message || 'Failed to resolve skills.' });
  }
};
