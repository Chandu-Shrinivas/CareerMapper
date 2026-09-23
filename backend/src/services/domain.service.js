import { readJsonFile } from '../utils/fileUtils.js';

const domainsData = readJsonFile('data/domains.json');

export const detectDomain = (normalizedSkills) => {
  let bestDomain = 'Unknown';
  let maxConfidence = 0;

  const totalSkills = normalizedSkills ? normalizedSkills.length : 0;
  if (totalSkills === 0) {
    return { domain: bestDomain, confidence: 0, evidence: [], domains: [], isAmbiguous: false };
  }

  const skillNames = normalizedSkills.map(s => String(s.name || s).toLowerCase().trim());
  const matchedDomains = [];
  const domainEvidenceMap = {};

  for (const [domainKey, domainSkills] of Object.entries(domainsData)) {
    const domainName = domainKey === 'BCom' ? 'B.Com' : domainKey;
    const lowerDomainSkills = domainSkills.map(s => String(s).toLowerCase().trim());
    
    let matchCount = 0;
    const evidence = [];

    for (const skill of skillNames) {
      if (lowerDomainSkills.includes(skill)) {
        matchCount++;
        evidence.push(skill);
      }
    }

    const confidence = totalSkills > 0 ? (matchCount / totalSkills) * 100 : 0;

    if (matchCount > 0) {
      matchedDomains.push({
        name: domainName,
        score: Math.round(confidence),
        matchCount,
        evidence
      });
      domainEvidenceMap[domainName] = evidence;
    }

    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      bestDomain = domainName;
    }
  }

  // Sort matched domains descending by score then matchCount
  matchedDomains.sort((a, b) => b.score - a.score || b.matchCount - a.matchCount);

  if (matchedDomains.length > 0) {
    bestDomain = matchedDomains[0].name;
    maxConfidence = matchedDomains[0].score;
  }

  const topEvidence = domainEvidenceMap[bestDomain] || [];

  let isAmbiguous = false;
  if (matchedDomains.length > 1) {
    const diff = matchedDomains[0].score - matchedDomains[1].score;
    if (diff < 10) {
      isAmbiguous = true;
    }
  }

  return {
    domain: bestDomain,
    confidence: Math.round(maxConfidence),
    evidence: topEvidence,
    domains: matchedDomains,
    isAmbiguous
  };
};
