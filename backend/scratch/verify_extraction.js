import fs from 'fs';
import { extractSkillsFromResume } from '../src/services/resume.service.js';
import { normalizeSkills, prettifySkillName } from '../src/utils/skillNormalizer.js';
import { detectDomain } from '../src/services/domain.service.js';

const runVerification = async () => {
  const filePath = 'c:/Users/Lenovo/Downloads/Computer Science Student _ Java & Full-Stack Development.pdf';
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    return;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const extracted = await extractSkillsFromResume(fileBuffer);
  const normalized = normalizeSkills(extracted);
  
  const prettySkills = normalized.map(s => prettifySkillName(s.name));

  const expectedSkills = [
    "Java", "Python", "C", "JavaScript", "HTML", "CSS", "React.js", "Tailwind CSS", "REST APIs", 
    "Spring Boot", "MySQL", "Git", "GitHub", "VS Code", "Eclipse", "Linux", "Windows", "Figma", 
    "SAP", "ChatGPT", "Gemini AI", "Google Generative AI"
  ];

  const detected = [];
  const missed = [];
  const falsePositives = [];

  prettySkills.forEach(s => {
    if (expectedSkills.includes(s)) {
      detected.push(s);
    } else {
      falsePositives.push(s);
    }
  });

  expectedSkills.forEach(s => {
    if (!prettySkills.includes(s)) {
      missed.push(s);
    }
  });

  const coverage = (detected.length / expectedSkills.length) * 100;

  console.log("==========================================");
  console.log("RESUME SKILL EXTRACTION AUDIT REPORT");
  console.log("==========================================");
  console.log("\nDetected Skills:", JSON.stringify(detected, null, 2));
  console.log("\nMissed Skills:", JSON.stringify(missed, null, 2));
  console.log("\nFalse Positives:", JSON.stringify(falsePositives, null, 2));
  console.log(`\nCoverage Percentage: ${coverage.toFixed(1)}%`);
  console.log("==========================================");
};

runVerification();
