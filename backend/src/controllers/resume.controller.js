import { extractSkillsFromResume } from '../services/resume.service.js';
import { normalizeSkills } from '../utils/skillNormalizer.js';
import { detectDomain } from '../services/domain.service.js';

export const processResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;

    const extractedSkills = await extractSkillsFromResume(fileBuffer);

    if (extractedSkills.length === 0) {
      return res.status(200).json({
        skills: [],
        domain: "Unknown",
        confidence: 0
      });
    }

    // Pass skills to normalizeSkills() and detectDomain()
    const normalizedSkills = normalizeSkills(extractedSkills);
    const { domain, confidence } = detectDomain(normalizedSkills);

    return res.status(200).json({
      skills: normalizedSkills,
      domain,
      confidence
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    return res.status(500).json({ error: 'Internal server error while processing resume' });
  }
};
