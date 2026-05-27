import { readJsonFile } from '../utils/fileUtils.js';

const domainsData = readJsonFile('data/domains.json');

export const detectDomain = (normalizedSkills) => {

  let bestDomain = 'Unknown';
  let maxConfidence = 0;

  const totalSkills = normalizedSkills.length;
  if (totalSkills === 0) {
    return { domain: bestDomain, confidence: 0 };
  }

  const skillNames = normalizedSkills.map(s => s.name);

  for (const [domain, domainSkills] of Object.entries(domainsData)) {
    let matchCount = 0;
    
    for (const skill of skillNames) {
      if (domainSkills.includes(skill)) {
        matchCount++;
      }
    }

    const confidence = (matchCount / totalSkills) * 100;

    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      bestDomain = domain;
    }
  }

  return {
    domain: bestDomain,
    confidence: Math.round(maxConfidence)
  };
};
