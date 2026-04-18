import { suggestDomainForSkill } from '../services/gemini.service.js';

export const suggestDomain = async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill || typeof skill !== 'string') {
      return res.status(400).json({ error: 'Invalid input. Expected a skill string.' });
    }

    const suggestion = await suggestDomainForSkill(skill);

    return res.status(200).json(suggestion);
  } catch (error) {
    console.error('Error in suggestDomain controller:', error);
    return res.status(500).json({ error: 'Internal server error while fetching suggestion' });
  }
};
