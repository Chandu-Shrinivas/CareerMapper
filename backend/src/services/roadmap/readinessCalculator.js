import { getNormalizedSkillName } from '../../utils/skillNormalizer.js';

/**
 * Deterministic & Explainable Readiness Engine for Job Preparation.
 * Formula:
 * Weighted Score = Sum(weight_i * satisfaction_i) / Sum(weight_i) * 100
 *
 * Requirement Weights:
 * - critical: 3.0
 * - required: 2.0
 * - preferred: 1.0
 * - nice-to-have: 0.5
 */
export const REQUIREMENT_WEIGHTS = {
  critical: 3.0,
  required: 2.0,
  preferred: 1.0,
  'nice-to-have': 0.5
};

export const calculateDeterministicReadiness = (requirements = [], matchedRequirementIds = new Set(), partialRequirementIds = new Set()) => {
  if (!Array.isArray(requirements) || requirements.length === 0) {
    return {
      overallReadiness: 50,
      criticalReadiness: 50,
      requiredReadiness: 50,
      preferredReadiness: 50,
      totalWeight: 0,
      matchedWeight: 0,
      matchedRequirements: [],
      partialRequirements: [],
      missingRequirements: []
    };
  }

  let totalWeight = 0;
  let earnedWeight = 0;

  const importanceStats = {
    critical: { total: 0, earned: 0 },
    required: { total: 0, earned: 0 },
    preferred: { total: 0, earned: 0 },
    'nice-to-have': { total: 0, earned: 0 }
  };

  const matchedRequirements = [];
  const partialRequirements = [];
  const missingRequirements = [];

  requirements.forEach(req => {
    const impKey = (req.importance && REQUIREMENT_WEIGHTS[req.importance.toLowerCase()]) ? req.importance.toLowerCase() : 'required';
    const weight = REQUIREMENT_WEIGHTS[impKey] || 2.0;
    totalWeight += weight;

    importanceStats[impKey] = importanceStats[impKey] || { total: 0, earned: 0 };
    importanceStats[impKey].total += weight;

    const reqNorm = req.canonicalSkillId || getNormalizedSkillName(req.name);

    // Flexible matching against matchedRequirementIds
    const isMatched = 
      matchedRequirementIds.has(req.id) || 
      (reqNorm && matchedRequirementIds.has(reqNorm)) || 
      (req.name && matchedRequirementIds.has(req.name.toLowerCase())) ||
      (req.name && matchedRequirementIds.has(getNormalizedSkillName(req.name)));

    const isPartial = !isMatched && (
      (req.id && partialRequirementIds.has(req.id)) || 
      (reqNorm && partialRequirementIds.has(reqNorm))
    );

    if (isMatched) {
      earnedWeight += weight;
      importanceStats[impKey].earned += weight;
      matchedRequirements.push(req);
    } else if (isPartial) {
      const partialEarned = weight * 0.5;
      earnedWeight += partialEarned;
      importanceStats[impKey].earned += partialEarned;
      partialRequirements.push(req);
    } else {
      missingRequirements.push(req);
    }
  });

  const overallReadiness = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 50;

  const calcSubScore = (imp) => {
    const stat = importanceStats[imp];
    if (!stat || stat.total === 0) return 100;
    return Math.round((stat.earned / stat.total) * 100);
  };

  return {
    overallReadiness: Math.max(0, Math.min(100, overallReadiness)),
    criticalReadiness: calcSubScore('critical'),
    requiredReadiness: calcSubScore('required'),
    preferredReadiness: calcSubScore('preferred'),
    totalWeight,
    matchedWeight: earnedWeight,
    matchedRequirements,
    partialRequirements,
    missingRequirements
  };
};
