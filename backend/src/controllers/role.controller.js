import { matchRoles } from '../services/role.service.js';
import { normalizeSkills } from '../utils/skillNormalizer.js';
import { detectDomain } from '../services/domain.service.js';

export const getRoleMatches = (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: "Invalid input. 'skills' array is required." });
    }

    const normalizedSkills = normalizeSkills(skills);
    const { domain } = detectDomain(normalizedSkills);
    const recommendations = matchRoles(normalizedSkills, domain);

    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error('Role matching error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
