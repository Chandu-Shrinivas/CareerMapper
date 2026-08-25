import { suggestDomainForSkill } from '../services/gemini.service.js';

export const suggestDomain = async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill || typeof skill !== 'string') {
      return res.status(400).json({ error: 'Invalid input. Expected a skill string.' });
    }

    const result = await suggestDomainForSkill(skill);

    if (!result.success) {
      if (result.errorType === 'MISSING_KEY') {
        return res.status(503).json({ error: result.error });
      } else if (result.errorType === 'INVALID_KEY') {
        return res.status(401).json({ error: result.error });
      } else {
        return res.status(502).json({ error: result.error });
      }
    }

    return res.status(200).json({
      skill: result.skill,
      suggestedDomain: result.suggestedDomain
    });
  } catch (error) {
    console.error('Error in suggestDomain controller:', error);
    return res.status(500).json({ error: 'Internal server error while fetching suggestion' });
  }
};
