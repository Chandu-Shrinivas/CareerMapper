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
    'advanced': 3
  };

  const normalizedMap = new Map();

  const validLevels = ['beginner', 'intermediate', 'advanced'];

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
