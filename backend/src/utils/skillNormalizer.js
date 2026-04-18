import { readJsonFile } from './fileUtils.js';

const synonyms = readJsonFile('data/skillDictionary.json');

export const normalizeSkills = (skills) => {
  const levelHierarchy = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3
  };

  const normalizedMap = new Map();

  const validLevels = ['beginner', 'intermediate', 'advanced'];

  skills.forEach(skill => {
    // Test 5, 11: Safely convert to string and strip special characters
    let normalizedName = String(skill.name).replace(/[^a-zA-Z0-9]/g, '').toLowerCase().trim();
    
    // Map synonyms if they exist in dictionary
    if (synonyms[normalizedName]) {
      normalizedName = synonyms[normalizedName];
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
