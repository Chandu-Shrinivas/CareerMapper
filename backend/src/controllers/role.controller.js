import { matchRoles } from '../services/role.service.js';
import { normalizeSkills, getNormalizedSkillName } from '../utils/skillNormalizer.js';
import { detectDomain } from '../services/domain.service.js';
import { getMarketAnalysisData } from '../services/market.service.js';
import { resolveSkill } from '../services/skill.service.js';

export const getRoleMatches = async (req, res) => {
  try {
    const { skills, domain: overrideDomain } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: "Invalid input. 'skills' array is required." });
    }

    const normalizedSkills = normalizeSkills(skills);
    const detected = detectDomain(normalizedSkills);
    
    // If no overrideDomain is specified, use all matched domains if multiple exist
    let domain = overrideDomain;
    if (!domain) {
      if (detected.domains && detected.domains.length > 0) {
        domain = detected.domains.map(d => d.name);
      } else {
        domain = detected.domain;
      }
    }
    
    const recommendations = await matchRoles(normalizedSkills, domain);

    // Resolve recommendation skills
    const resolvedRecommendations = await Promise.all(recommendations.map(async (r) => {
      const [matched, missing] = await Promise.all([
        Promise.all((r.matchedSkills || []).map(resolveSkill)),
        Promise.all((r.missingSkills || []).map(resolveSkill))
      ]);
      return { ...r, matchedSkills: matched, missingSkills: missing };
    }));

    return res.status(200).json({ recommendations: resolvedRecommendations });
  } catch (error) {
    console.error('Role matching error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMarketAnalysis = async (req, res) => {
  try {
    const { role } = req.params;
    const country = req.query.country || 'India';

    if (!role) {
      return res.status(400).json({ error: "Role param is required." });
    }

    // Parse user's current skills from query param (format: skills=react:expert,git:beginner)
    // Applying normalization boundaries and defaulting
    const userSkills = [];
    if (req.query.skills) {
      req.query.skills.split(',').forEach(item => {
        const parts = item.split(':');
        const rawName = parts[0].trim();
        let rawLevel = parts[1] ? parts[1].trim().toLowerCase() : 'beginner';
        if (rawLevel === 'undefined' || !['beginner', 'intermediate', 'advanced', 'expert'].includes(rawLevel)) {
          rawLevel = 'beginner';
        }
        const name = getNormalizedSkillName(rawName);
        if (name) {
          userSkills.push({ name, level: rawLevel });
        }
      });
    }

    // Call service to check cache / query Tavily + Gemini
    const forceRefresh = req.query.refresh === 'true';
    const rawData = await getMarketAnalysisData(role, country, forceRefresh);

    // Perform deterministic Readiness Score and Skill Gap calculations
    const coreList = (rawData.skills?.core || []).map(s => getNormalizedSkillName(s));
    const emergingList = (rawData.skills?.emerging || []).map(s => getNormalizedSkillName(s));
    const stableList = (rawData.skills?.stable || []).map(s => getNormalizedSkillName(s));

    const requiredSkills = coreList;
    const preferredSkills = [...new Set([...emergingList, ...stableList])].filter(s => !requiredSkills.includes(s));

    let userScore = 0;
    let totalPossibleScore = 0;

    const covered = [];
    const highPriorityGaps = [];
    const mediumPriorityGaps = [];

    // Calculate required weights (10 points each)
    requiredSkills.forEach(skillName => {
      totalPossibleScore += 10;
      const userHasSkill = userSkills.find(s => s.name === skillName);
      if (userHasSkill) {
        let mult = 0.6;
        if (userHasSkill.level === 'expert' || userHasSkill.level === 'advanced') mult = 1.0;
        else if (userHasSkill.level === 'intermediate') mult = 0.85;

        userScore += (mult * 10);
        covered.push(skillName);
      } else {
        highPriorityGaps.push(skillName);
      }
    });

    // Calculate preferred weights (5 points each)
    preferredSkills.forEach(skillName => {
      totalPossibleScore += 5;
      const userHasSkill = userSkills.find(s => s.name === skillName);
      if (userHasSkill) {
        let mult = 0.6;
        if (userHasSkill.level === 'expert' || userHasSkill.level === 'advanced') mult = 1.0;
        else if (userHasSkill.level === 'intermediate') mult = 0.85;

        userScore += (mult * 5);
        covered.push(skillName);
      } else {
        mediumPriorityGaps.push(skillName);
      }
    });

    // Secure readiness calculations between 0 and 100, preventing NaN or Infinity
    let marketReadiness = 0;
    if (totalPossibleScore > 0) {
      const rawRatio = userScore / totalPossibleScore;
      marketReadiness = Math.round(rawRatio * 100);
    }
    marketReadiness = Math.max(0, Math.min(100, marketReadiness));
    if (isNaN(marketReadiness) || !isFinite(marketReadiness)) {
      marketReadiness = 0;
    }

    // Attach userGap details using resolved skill objects
    const userGap = {
      marketReadiness,
      covered: await Promise.all(covered.map(resolveSkill)),
      gaps: {
        high: await Promise.all(highPriorityGaps.map(resolveSkill)),
        medium: await Promise.all(mediumPriorityGaps.map(resolveSkill))
      }
    };

    // Return combined payload conforming to CareerMapper conventions
    const resolvedSkills = {
      core: await Promise.all((rawData.skills?.core || []).map(resolveSkill)),
      emerging: await Promise.all((rawData.skills?.emerging || []).map(resolveSkill)),
      stable: await Promise.all((rawData.skills?.stable || []).map(resolveSkill)),
      declining: await Promise.all((rawData.skills?.declining || []).map(resolveSkill))
    };

    const responseData = { ...rawData, skills: resolvedSkills };
    if (!responseData.historicalTrend || responseData.historicalTrend.available === false) {
      responseData.available = false;
      responseData.reason = "insufficient_historical_evidence";
      responseData.historicalTrend = [];
    }

    // Set X-Cache response header for client & auditing verification
    res.setHeader('X-Cache', rawData.isCacheHit ? 'HIT' : 'MISS');

    return res.status(200).json({
      ...responseData,
      userGap
    });

  } catch (error) {
    console.error('Market analysis error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

