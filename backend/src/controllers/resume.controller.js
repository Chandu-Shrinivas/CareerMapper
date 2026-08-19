import { extractSkillsFromResume } from '../services/resume.service.js';
import { normalizeSkills, prettifySkillName } from '../utils/skillNormalizer.js';
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
    const { domain, confidence, domains } = detectDomain(normalizedSkills);

    // Format skill names for response presentation
    const prettySkills = normalizedSkills.map(s => ({
      name: prettifySkillName(s.name),
      level: s.level
    }));

    // Return response
    return res.status(200).json({
      skills: prettySkills,
      domain,
      confidence,
      domains
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    return res.status(500).json({ error: 'Internal server error while processing resume' });
  }
};
