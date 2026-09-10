import SkillVerification from '../../models/skillVerification.model.js';
import Roadmap from '../../models/roadmap.model.js';
import Mission from '../../models/mission.model.js';
import Project from '../../models/project.model.js';
import Evidence from '../../models/evidence.model.js';
import EvidenceAnalysis from '../../models/evidenceAnalysis.model.js';
import Assessment from '../../models/assessment.model.js';
import AssessmentAttempt from '../../models/assessmentAttempt.model.js';
import { generateJSON } from '../ai/aiGateway.js';
import mongoose from 'mongoose';

// 1. Centralized and configurable verification weights
export const VERIFICATION_WEIGHTS = {
  assessment: 0.35,
  projects: 0.25,
  evidence: 0.20,
  missions: 0.10,
  recency: 0.10
};

// 2. Configurable status threshold levels
export const STATUS_THRESHOLDS = [
  { min: 90, status: 'VERIFIED' },
  { min: 75, status: 'STRONG' },
  { min: 60, status: 'DEMONSTRATED' },
  { min: 40, status: 'DEVELOPING' },
  { min: 0,  status: 'UNVERIFIED' }
];

// 3. Configurable minimum verified requirements
export const VERIFIED_MIN_REQUIREMENTS = {
  bestAssessmentScore: 75,
  minCompletedOrVerifiedProjects: 1,
  minAcceptedOrVerifiedEvidence: 1,
  missionCompletionPercentage: 50,
  maxRejectedEvidence: 0
};

// 4. Configurable recency score thresholds
export const RECENCY_THRESHOLDS = [
  { days: 30, score: 100 },
  { days: 90, score: 85 },
  { days: 180, score: 70 },
  { days: 365, score: 50 },
  { days: Infinity, score: 30 }
];

/**
 * Calculates deterministic skill verification score and confidence breakdown.
 */
export const calculateVerificationScore = async (userId, roadmapId, skillId) => {
  const roadmapDoc = await Roadmap.findById(roadmapId);
  if (!roadmapDoc) {
    throw new Error('Roadmap not found.');
  }

  if (roadmapDoc.userId !== userId) {
    return {
      userId,
      roadmapId: roadmapDoc._id,
      skillId,
      canonicalSkillId: skillId,
      targetRole: roadmapDoc.targetRole,
      company: roadmapDoc.company || '',
      domain: roadmapDoc.domain || 'Technology',
      assessmentAttempts: 0,
      bestAssessmentScore: 0,
      latestAssessmentScore: 0,
      assessmentPassed: false,
      assessmentLevel: 'Needs Foundation',
      totalMissions: 0,
      completedMissions: 0,
      verifiedMissions: 0,
      missionCompletionPercentage: 0,
      totalProjects: 0,
      completedProjects: 0,
      verifiedProjects: 0,
      projectCompletionPercentage: 0,
      totalEvidence: 0,
      acceptedEvidence: 0,
      verifiedEvidence: 0,
      pendingEvidence: 0,
      rejectedEvidence: 0,
      confidenceScore: 0,
      verificationStatus: 'UNVERIFIED',
      confidenceBreakdown: {
        assessment: { score: 0, weight: 35, contribution: 0 },
        projects: { score: 0, weight: 25, contribution: 0 },
        evidence: { score: 0, weight: 20, contribution: 0 },
        missions: { score: 0, weight: 10, contribution: 0 },
        recency: { score: 0, weight: 10, contribution: 0 },
        final: 0
      },
      verificationWarnings: ['Forbidden: Roadmap does not belong to this user.'],
      missingRequirements: [],
      missing: [],
      recommendedNextAction: 'Access denied.',
      lastActivityAt: new Date(),
      lastVerifiedAt: new Date(),
      verificationVersion: 1
    };
  }

  // 1. Fetch Assessments & Attempts (Never automatically triggers assessment generation)
  const assessments = await Assessment.find({ roadmapId, skillIds: skillId });
  const assessmentIds = assessments.map(a => a._id);
  
  let bestAssessmentScore = 0;
  let latestAssessmentScore = 0;
  let assessmentAttempts = 0;
  let lastAssessmentDate = null;

  if (assessmentIds.length > 0) {
    const attempts = await AssessmentAttempt.find({
      assessmentId: { $in: assessmentIds },
      userId,
      submittedAt: { $exists: true }
    }).sort({ submittedAt: 1 });

    assessmentAttempts = attempts.length;
    if (assessmentAttempts > 0) {
      bestAssessmentScore = Math.max(...attempts.map(at => at.score));
      latestAssessmentScore = attempts[attempts.length - 1].score;
      lastAssessmentDate = attempts[attempts.length - 1].submittedAt;
    }
  }

  const assessmentPassed = bestAssessmentScore >= 70;
  let assessmentLevel = 'Needs Foundation';
  if (bestAssessmentScore >= 90) assessmentLevel = 'Advanced';
  else if (bestAssessmentScore >= 75) assessmentLevel = 'Strong';
  else if (bestAssessmentScore >= 60) assessmentLevel = 'Competent';
  else if (bestAssessmentScore >= 40) assessmentLevel = 'Developing';

  // 2. Fetch Missions (Exclude status = skipped)
  const missions = await Mission.find({ roadmapId, skillId, status: { $ne: 'skipped' } });
  const totalMissions = missions.length;
  const completedMissions = missions.filter(m => m.status === 'completed' || m.status === 'verified').length;
  const verifiedMissions = missions.filter(m => m.status === 'verified').length;
  const missionCompletionPercentage = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
  
  let lastMissionDate = null;
  const activeMissions = missions.filter(m => ['completed', 'verified', 'in_progress'].includes(m.status));
  if (activeMissions.length > 0) {
    lastMissionDate = new Date(Math.max(...activeMissions.map(m => new Date(m.updatedAt).getTime())));
  }

  // 3. Fetch Projects (Exclude status = skipped)
  const projects = await Project.find({
    roadmapId,
    skillIds: skillId,
    selectionStatus: 'active',
    status: { $ne: 'skipped' }
  });
  
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed' || p.status === 'verified').length;
  const verifiedProjects = projects.filter(p => p.status === 'verified').length;
  const projectCompletionPercentage = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  let projectPointsSum = 0;
  projects.forEach(p => {
    if (p.status === 'verified') projectPointsSum += 100;
    else if (p.status === 'completed') projectPointsSum += 80;
    else if (p.status === 'submitted') projectPointsSum += 60;
    else if (p.status === 'under_review') projectPointsSum += 50;
    else if (p.status === 'in_progress') projectPointsSum += 25;
  });
  const projectScore = totalProjects > 0 ? Math.round(projectPointsSum / totalProjects) : 0;

  let lastProjectDate = null;
  const activeProjects = projects.filter(p => p.status !== 'not_started');
  if (activeProjects.length > 0) {
    lastProjectDate = new Date(Math.max(...activeProjects.map(p => new Date(p.updatedAt).getTime())));
  }

  // 4. Fetch Evidence (Deduplicate duplicate URLs)
  const evidences = await Evidence.find({ roadmapId, skillIds: skillId });
  const uniqueEvidencesMap = new Map();
  evidences.forEach(ev => {
    const key = ev.url || ev._id.toString();
    const existing = uniqueEvidencesMap.get(key);
    if (!existing) {
      uniqueEvidencesMap.set(key, ev);
    } else {
      const statusWeights = { verified: 5, accepted: 4, pending: 3, needs_revision: 2, rejected: 1 };
      if ((statusWeights[ev.verificationStatus] || 0) > (statusWeights[existing.verificationStatus] || 0)) {
        uniqueEvidencesMap.set(key, ev);
      }
    }
  });

  const uniqueEvidences = Array.from(uniqueEvidencesMap.values());
  const totalEvidence = uniqueEvidences.length;
  const acceptedEvidence = uniqueEvidences.filter(e => e.verificationStatus === 'accepted').length;
  const verifiedEvidence = uniqueEvidences.filter(e => e.verificationStatus === 'verified').length;
  const pendingEvidence = uniqueEvidences.filter(e => e.verificationStatus === 'pending').length;
  const rejectedEvidence = uniqueEvidences.filter(e => e.verificationStatus === 'rejected').length;

  let evidencePointsSum = 0;
  uniqueEvidences.forEach(e => {
    if (e.verificationStatus === 'verified') evidencePointsSum += 100;
    else if (e.verificationStatus === 'accepted') evidencePointsSum += 85;
    else if (e.verificationStatus === 'pending') evidencePointsSum += 50;
    else if (e.verificationStatus === 'needs_revision') evidencePointsSum += 25;
  });
  const evidenceScore = totalEvidence > 0 ? Math.round(evidencePointsSum / totalEvidence) : 0;

  let lastEvidenceDate = null;
  if (uniqueEvidences.length > 0) {
    lastEvidenceDate = new Date(Math.max(...uniqueEvidences.map(e => new Date(e.updatedAt).getTime())));
  }

  // 5. Centralized Recency Score Logic
  const dates = [lastAssessmentDate, lastMissionDate, lastProjectDate, lastEvidenceDate].filter(d => d !== null);
  let lastActivityAt = null;
  let recencyScore = 0;

  if (dates.length > 0) {
    lastActivityAt = new Date(Math.max(...dates.map(d => d.getTime())));
    const diffDays = Math.ceil((Date.now() - lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
    
    const matchedRecency = RECENCY_THRESHOLDS.find(t => diffDays <= t.days);
    recencyScore = matchedRecency ? matchedRecency.score : 30;
  }

  // 6. Confidence Score
  const assessmentScore = bestAssessmentScore;
  const missionScore = missionCompletionPercentage;

  const finalScoreVal = 
      assessmentScore * VERIFICATION_WEIGHTS.assessment
    + projectScore * VERIFICATION_WEIGHTS.projects
    + evidenceScore * VERIFICATION_WEIGHTS.evidence
    + missionScore * VERIFICATION_WEIGHTS.missions
    + recencyScore * VERIFICATION_WEIGHTS.recency;

  const confidenceScore = Math.round(finalScoreVal);

  // 7. Threshold classification
  const matchedThreshold = STATUS_THRESHOLDS.find(t => confidenceScore >= t.min);
  let verificationStatus = matchedThreshold ? matchedThreshold.status : 'UNVERIFIED';

  // 8. Strict Minimum Verification requirements
  const verificationWarnings = [];
  const missingRequirements = [];

  const completedOrVerifiedProjectsCount = completedProjects;
  const acceptedOrVerifiedEvidenceCount = acceptedEvidence + verifiedEvidence;

  if (verificationStatus === 'VERIFIED') {
    let failedPreReq = false;

    if (bestAssessmentScore < VERIFIED_MIN_REQUIREMENTS.bestAssessmentScore) {
      failedPreReq = true;
      missingRequirements.push(`Complete the assessment with a score above ${VERIFIED_MIN_REQUIREMENTS.bestAssessmentScore}%.`);
      verificationWarnings.push('Assessment performance is below the verification threshold.');
    }
    if (completedOrVerifiedProjectsCount < VERIFIED_MIN_REQUIREMENTS.minCompletedOrVerifiedProjects && 
        acceptedOrVerifiedEvidenceCount < VERIFIED_MIN_REQUIREMENTS.minAcceptedOrVerifiedEvidence) {
      failedPreReq = true;
      missingRequirements.push('Submit verified practical evidence or complete a project.');
      verificationWarnings.push('Practical evidence has not been verified.');
    }
    if (missionScore < VERIFIED_MIN_REQUIREMENTS.missionCompletionPercentage) {
      failedPreReq = true;
      missingRequirements.push(`Complete at least ${VERIFIED_MIN_REQUIREMENTS.missionCompletionPercentage}% of the required missions.`);
      verificationWarnings.push('Mission completion is below the target threshold.');
    }
    if (rejectedEvidence > VERIFIED_MIN_REQUIREMENTS.maxRejectedEvidence) {
      failedPreReq = true;
      missingRequirements.push('Resolve all rejected evidence.');
      verificationWarnings.push('Rejected evidence exists for this skill.');
    }

    if (failedPreReq) {
      verificationStatus = 'STRONG'; // Demote to STRONG
    }
  }

  // Conflict signaling checks
  if (bestAssessmentScore >= 75 && rejectedEvidence > 0) {
    verificationWarnings.push('Assessment performance is strong but some practical evidence was rejected.');
  }
  if (bestAssessmentScore > 0 && bestAssessmentScore < 60 && completedProjects > 0) {
    verificationWarnings.push('Practical projects are completed but assessment performance is low.');
  }
  if (lastActivityAt) {
    const diffDays = Math.ceil((Date.now() - lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 90) {
      verificationWarnings.push('Recent activity is low (older than 90 days).');
    }
  } else {
    missingRequirements.push('Add recent evidence.');
  }

  // Extra generic missing requirements lists for UX
  if (assessmentAttempts === 0) {
    missingRequirements.push(`Complete the ${skillId} assessment.`);
  }
  if (totalEvidence === 0) {
    missingRequirements.push(`Submit evidence for your ${skillId} project.`);
  }
  if (completedProjects === 0) {
    missingRequirements.push(`Finish the ${skillId} project.`);
  }

  // Recommended actions (Deterministic)
  let recommendedNextAction = 'Keep practicing and refining the skill.';
  if (totalMissions > 0 && missionScore < 50) {
    recommendedNextAction = `Finish the ${skillId} mission.`;
  } else if (assessmentAttempts === 0) {
    recommendedNextAction = `Complete the ${skillId} assessment.`;
  } else if (bestAssessmentScore < 75) {
    recommendedNextAction = `Improve assessment score above 75%.`;
  } else if (totalProjects > 0 && projectScore < 50) {
    recommendedNextAction = `Complete the practical project for ${skillId}.`;
  } else if (totalEvidence === 0) {
    recommendedNextAction = `Submit evidence for your ${skillId} project.`;
  } else if (recencyScore < 50) {
    recommendedNextAction = `Add recent evidence.`;
  } else if (bestAssessmentScore < 90) {
    recommendedNextAction = `Improve assessment score above 90%`;
  }

  // Compile breakdown object
  const confidenceBreakdown = {
    assessment: {
      score: assessmentScore,
      weight: Math.round(VERIFICATION_WEIGHTS.assessment * 100),
      contribution: parseFloat((assessmentScore * VERIFICATION_WEIGHTS.assessment).toFixed(1))
    },
    projects: {
      score: projectScore,
      weight: Math.round(VERIFICATION_WEIGHTS.projects * 100),
      contribution: parseFloat((projectScore * VERIFICATION_WEIGHTS.projects).toFixed(1))
    },
    evidence: {
      score: evidenceScore,
      weight: Math.round(VERIFICATION_WEIGHTS.evidence * 100),
      contribution: parseFloat((evidenceScore * VERIFICATION_WEIGHTS.evidence).toFixed(1))
    },
    missions: {
      score: missionScore,
      weight: Math.round(VERIFICATION_WEIGHTS.missions * 100),
      contribution: parseFloat((missionScore * VERIFICATION_WEIGHTS.missions).toFixed(1))
    },
    recency: {
      score: recencyScore,
      weight: Math.round(VERIFICATION_WEIGHTS.recency * 100),
      contribution: parseFloat((recencyScore * VERIFICATION_WEIGHTS.recency).toFixed(1))
    },
    final: confidenceScore
  };

  const primaryDomain = roadmapDoc.domain || 'Technology';

  // Format array names exactly as schema: missingRequirements (mapped to missing)
  const verificationData = {
    userId,
    roadmapId: roadmapDoc._id,
    skillId,
    canonicalSkillId: skillId,
    targetRole: roadmapDoc.targetRole,
    company: roadmapDoc.company || '',
    domain: primaryDomain,
    assessmentAttempts,
    bestAssessmentScore,
    latestAssessmentScore,
    assessmentPassed,
    assessmentLevel,
    totalMissions,
    completedMissions,
    verifiedMissions,
    missionCompletionPercentage,
    totalProjects,
    completedProjects,
    verifiedProjects,
    projectCompletionPercentage,
    totalEvidence,
    acceptedEvidence,
    verifiedEvidence,
    pendingEvidence,
    rejectedEvidence,
    confidenceScore,
    verificationStatus,
    confidenceBreakdown,
    verificationWarnings,
    missingRequirements,
    missing: missingRequirements, // compatibility
    recommendedNextAction,
    lastActivityAt: lastActivityAt || new Date(),
    lastVerifiedAt: new Date(),
    verificationVersion: 1
  };

  let saved = null;
  if (mongoose.connection.readyState === 1) {
    try {
      saved = await SkillVerification.findOneAndUpdate(
        { userId, roadmapId: roadmapDoc._id, skillId },
        verificationData,
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn('[WARNING] Skill verification database write failed:', err.message);
    }
  }

  return saved || verificationData;
};

/**
 * Recalculates all skill verification records for a roadmap
 */
export const recalculateRoadmapVerifications = async (userId, roadmapId) => {
  const roadmapDoc = await Roadmap.findById(roadmapId);
  if (!roadmapDoc) {
    throw new Error('Roadmap not found.');
  }

  const skillIds = new Set();
  (roadmapDoc.phases || []).forEach(p => {
    (p.skills || []).forEach(s => {
      skillIds.add(s.canonicalId);
    });
  });

  const list = [];
  for (const skillId of skillIds) {
    const verified = await calculateVerificationScore(userId, roadmapId, skillId);
    list.push(verified);
  }

  return list;
};

/**
 * Analyzes evidence relevance using AI Gateway with local template fallback caching.
 */
export const analyzeEvidenceRelevance = async (evidenceId, skillId, refresh = false) => {
  const evidence = await Evidence.findById(evidenceId);
  if (!evidence) {
    throw new Error('Evidence not found.');
  }

  const cacheQuery = { evidenceId, version: 1 };
  
  if (!refresh && mongoose.connection.readyState === 1) {
    const cached = await EvidenceAnalysis.findOne(cacheQuery);
    if (cached) {
      console.log(`[ANALYSIS CACHE HIT] evidenceId="${evidenceId}"`);
      return cached;
    }
  }

  console.log(`[ANALYSIS CACHE MISS] Analyzing evidenceId="${evidenceId}"`);
  
  const targetSkills = evidence.skillIds || [skillId];
  
  let analysis = null;
  const systemPrompt = `You are a Technical Reviewer assessing candidate evidence submissions.
Determine whether the provided url, title, description, and metadata demonstrate proficiency in the following skills: ${targetSkills.join(', ')}.
Respond strictly in JSON format matching this schema:
{
  "relevant": true | false,
  "confidence": 0 - 100,
  "matchedSkills": ["skill1", "skill2"],
  "missingEvidence": ["reason1", "reason2"],
  "reasoning": "Clear explanation of evaluation details"
}
`;
  const prompt = `
Evidence Title: ${evidence.title}
Evidence Description: ${evidence.description}
Evidence URL: ${evidence.url}
Evidence Type: ${evidence.type}
Target Skills to Assess: ${targetSkills.join(', ')}
`;

  try {
    const aiResponse = await generateJSON(prompt, systemPrompt);
    if (aiResponse && aiResponse.reasoning) {
      analysis = {
        relevant: aiResponse.relevant === true,
        confidence: parseInt(aiResponse.confidence, 10) || 70,
        matchedSkills: Array.isArray(aiResponse.matchedSkills) ? aiResponse.matchedSkills : targetSkills,
        missingEvidence: Array.isArray(aiResponse.missingEvidence) ? aiResponse.missingEvidence : [],
        reasoning: aiResponse.reasoning
      };
    }
  } catch (err) {
    console.warn('[WARNING] AI Evidence analysis failed, falling back to keywords analysis:', err.message);
  }

  if (!analysis) {
    // Local keywords heuristics fallback
    const matchedList = [];
    const missingList = [];
    
    targetSkills.forEach(s => {
      const match = evidence.title.toLowerCase().includes(s.toLowerCase()) ||
                    evidence.description.toLowerCase().includes(s.toLowerCase()) ||
                    evidence.url.toLowerCase().includes(s.toLowerCase());
      if (match) {
        matchedList.push(s);
      } else {
        missingList.push(`Keyword '${s}' not found in metadata.`);
      }
    });

    const isAnyRelevant = matchedList.length > 0;

    analysis = {
      relevant: isAnyRelevant,
      confidence: isAnyRelevant ? 75 : 30,
      matchedSkills: matchedList,
      missingEvidence: missingList,
      reasoning: isAnyRelevant 
        ? `Local keyword heuristic matched skill names in evidence metadata.`
        : `Local keyword analysis found no mention of target skills in title, description, or url.`
    };
  }

  const analysisRecord = {
    evidenceId,
    roadmapId: evidence.roadmapId,
    userId: evidence.userId,
    skillIds: targetSkills,
    analysis,
    relevant: analysis.relevant,
    confidence: analysis.confidence,
    matchedSkills: analysis.matchedSkills,
    missingEvidence: analysis.missingEvidence,
    reasoning: analysis.reasoning,
    provider: 'Gemini',
    model: 'gemini-1.5-flash',
    version: 1,
    analyzedAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  };

  let saved = null;
  if (mongoose.connection.readyState === 1) {
    try {
      saved = await EvidenceAnalysis.findOneAndUpdate(
        cacheQuery,
        analysisRecord,
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn('[WARNING] Failed to write analysis to database:', err.message);
    }
  }

  return saved || analysisRecord;
};
