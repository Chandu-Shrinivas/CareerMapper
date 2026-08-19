import { matchRoles } from '../services/role.service.js';
import { normalizeSkills} from '../utils/skillNormalizer.js';
import { detectDomain} from '../services/domain.service.js';

export const getRoleMatches = async (req, res) => {
  try {
    const { skills, domain: overrideDomain } = req.body;

    if (!skills || !Array.isArray(skills)) {
     return res.status(400).json({ error: "Invalid input. 'skills' array is required." });
    }

    const normalizedSkills = normalizeSkills(skills);
    const detected = detectDomain(normalizedSkills);
    
    // If no overrideDomain is specified, use all matched domains if multiple exist
    let domain = overrideDomain;
    if (!domain) {
      if (detected.domains && detected.domains.length > 0) {
        domain = detected.domains.map(d => d.name);
      } else {
        domain = detected.domain;
      }
    }
    
    const recommendations = await matchRoles(normalizedSkills, domain);

    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error('Role matching error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
