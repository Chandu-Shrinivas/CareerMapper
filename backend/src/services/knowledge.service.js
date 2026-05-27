import { readJsonFile } from '../utils/fileUtils.js';

export const findUnknownSkills = (normalizedSkills) => {
  const domainsData = readJsonFile('data/domains.json');

  // Collect all known skills
  const knownSkills = new Set();
  for (const domainSkills of Object.values(domainsData)) {
    for (const skill of domainSkills) {
      knownSkills.add(skill);
    }
  }

  const unknownSkills = [];

  for (const skillObj of normalizedSkills) {
    if (!knownSkills.has(skillObj.name)) {
      unknownSkills.push(skillObj.name);
    }
  }

  return {
    unknownSkills
  };
};
