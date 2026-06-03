import { normalizeSkills, prettifySkillName } from '../utils/skillNormalizer.js';
import { detectDomain } from '../services/domain.service.js';

export const detectUserDomain = (req, res) => {
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
    const { domain, confidence } = detectDomain(normalizedSkills);

    // Format skill names for response presentation
    const prettySkills = normalizedSkills.map(s => ({
      name: prettifySkillName(s.name),
      level: s.level
    }));

    // 3. Return response
    return res.status(200).json({
      skills: prettySkills,
      domain,
      confidence
    });
  } catch (error) {
    console.error('Error in detectUserDomain:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
