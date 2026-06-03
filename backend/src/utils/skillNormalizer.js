import { readJsonFile } from './fileUtils.js';

const synonyms = readJsonFile('data/skillDictionary.json');
const synonymEntries = Object.entries(synonyms);

const canonicalizeSkill = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const synonymMap = synonymEntries.reduce((acc, [key, val]) => {
  acc[canonicalizeSkill(key)] = canonicalizeSkill(val);
  return acc;
}, {});

export const normalizeSkills = (skills) => {
  const levelHierarchy = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'expert': 4
  };

  const normalizedMap = new Map();

  const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];

  skills.forEach(skill => {
    // Canonical form keeps multi-word skills consistent across datasets
    let normalizedName = canonicalizeSkill(skill.name);
    
    // Map synonyms if they exist in dictionary
    if (synonymMap[normalizedName]) {
      normalizedName = synonymMap[normalizedName];
    }

    if (!normalizedName) {
      return;
    }
    
    // Test 6, 7: Validate and default level
    let skillLevel = skill.level ? String(skill.level).toLowerCase().trim() : 'beginner';
    if (!validLevels.includes(skillLevel)) {
      skillLevel = 'beginner';
    }

    const existingSkill = normalizedMap.get(normalizedName);
    const currentLevelValue = levelHierarchy[skillLevel] || 1;
    
    if (!existingSkill) {
      normalizedMap.set(normalizedName, { name: normalizedName, level: skillLevel });
    } else {
      const existingLevelValue = levelHierarchy[existingSkill.level] || 1;
      if (currentLevelValue > existingLevelValue) {
        normalizedMap.set(normalizedName, { name: normalizedName, level: skillLevel });
      }
    }
  });

  return Array.from(normalizedMap.values());
};

const prettyMap = {
  "java": "Java",
  "python": "Python",
  "c": "C",
  "javascript": "JavaScript",
  "typescript": "TypeScript",
  "html": "HTML",
  "css": "CSS",
  "react": "React.js",
  "react.js": "React.js",
  "tailwind": "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  "api": "REST APIs",
  "rest api": "REST APIs",
  "rest apis": "REST APIs",
  "spring boot": "Spring Boot",
  "mysql": "MySQL",
  "git": "Git",
  "github": "GitHub",
  "vs code": "VS Code",
  "eclipse": "Eclipse",
  "linux": "Linux",
  "windows": "Windows",
  "figma": "Figma",
  "sap": "SAP",
  "chatgpt": "ChatGPT",
  "gemini ai": "Gemini AI",
  "google generative ai": "Google Generative AI",
  "hibernate": "Hibernate",
  "maven": "Maven",
  "ui design": "UI Design",
  "ux design": "UX Design",
  "node": "Node.js",
  "node.js": "Node.js",
  "express": "Express",
  "redux": "Redux",
  "mongodb": "MongoDB",
  "mongo": "MongoDB",
  "postman": "Postman"
};

export const prettifySkillName = (name) => {
  if (!name) return "";
  const lower = name.toLowerCase().trim();
  if (prettyMap[lower]) {
    return prettyMap[lower];
  }
  // Title case fallback
  return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
