import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
import { readJsonFile } from '../utils/fileUtils.js';
import { detectLevel } from '../utils/levelDetector.js';

export const extractSkillsFromResume = async (fileBuffer) => {
  // STEP 1 — Extract text
  const parser = new PDFParse({ data: fileBuffer });
  const data = await parser.getText();
  const text = data.text.toLowerCase();

  // STEP 2 — Load skill dictionary
  const domainsData = readJsonFile('data/domains.json');
  
  // Combine all domain skills into one array
  const knownSkills = new Set();
  for (const domainSkills of Object.values(domainsData)) {
    for (const skill of domainSkills) {
      knownSkills.add(skill.toLowerCase());
    }
  }

  // STEP 3 — Skill Extraction
  const extractedSkills = [];
  
  for (const skill of knownSkills) {
    if (text.includes(skill)) {
      // STEP 4 — Level Detection
      const detectedLevel = detectLevel(text, skill);
      
      // STEP 5 — Build skill object
      extractedSkills.push({
        name: skill,
        level: detectedLevel
      });
    }
  }

  // STEP 6 — Return array of skills
  return extractedSkills;
};
