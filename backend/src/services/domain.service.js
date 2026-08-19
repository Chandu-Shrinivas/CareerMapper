import { readJsonFile } from '../utils/fileUtils.js';

const domainsData = readJsonFile('data/domains.json');

export const detectDomain = (normalizedSkills) => {

  let bestDomain = 'Unknown';
  let maxConfidence = 0;

  const totalSkills = normalizedSkills.length;
  if (totalSkills === 0) {
    return { domain: bestDomain, confidence: 0, domains: [] };
  }

  const skillNames = normalizedSkills.map(s => s.name);
  const matchedDomains = [];

  for (const [domain, domainSkills] of Object.entries(domainsData)) {
    let matchCount = 0;
    
    for (const skill of skillNames) {
      if (domainSkills.includes(skill)) {
        matchCount++;
      }
    }

    const confidence = (matchCount / totalSkills) * 100;
    
    if (confidence > 0) {
      matchedDomains.push({
        name: domain,
        score: Math.round(confidence)
      });
    }

    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      bestDomain = domain;
    }
  }

  // Sort matched domains descending by score
  matchedDomains.sort((a, b) => b.score - a.score);

  return {
    domain: bestDomain,
    confidence: Math.round(maxConfidence),
    domains: matchedDomains
  };
};
