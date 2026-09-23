import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
import { readJsonFile } from '../utils/fileUtils.js';
import { detectLevel } from '../utils/levelDetector.js';
export const extractSkillsFromResume = async (fileBuffer) => {
  // STEP 1 — Extract text
  let rawText = '';
  try {
    const parser = new PDFParse({ data: fileBuffer });
    const data = await parser.getText();
    rawText = data.text || '';
  } catch (err) {
    rawText = fileBuffer.toString('utf-8');
  }
  const text = rawText.toLowerCase().replace(/\s+/g, ' ');

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
    const escaped = skill.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`(?<![a-zA-Z0-9])${escaped}(?![a-zA-Z0-9])`, 'gi');
    
    let match;
    while ((match = regex.exec(text)) !== null) {
      const idx = match.index;
      
      // STEP 4 — Level Detection (using the specific occurrence index)
      const detectedLevel = detectLevel(text, skill, idx);
      
      // STEP 5 — Build skill object
      extractedSkills.push({
        name: skill,
        level: detectedLevel
      });
      
      // Prevent infinite loop on zero-width match
      if (regex.lastIndex === match.index) {
        regex.lastIndex++;
      }
    }
  }

  // STEP 6 — Return array of skills
  return extractedSkills;
};
