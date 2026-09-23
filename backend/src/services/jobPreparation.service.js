import crypto from 'crypto';
import JobAnalysis from '../models/jobAnalysis.model.js';
import JobPreparation from '../models/jobPreparation.model.js';
import UserProfile from '../models/userProfile.model.js';
import { getJobAnalysisProvider } from './ai/jobAnalysisProvider.js';
import { JOB_ANALYSIS_PROMPT_VERSION, JOB_ROADMAP_SCHEMA_VERSION } from './ai/jobAnalysisPrompt.js';
import { calculateDeterministicReadiness } from './roadmap/readinessCalculator.js';
import { getNormalizedSkillName } from '../utils/skillNormalizer.js';
import { resolveSkill } from './skill.service.js';

/**
 * Compute SHA-256 hash of normalized job description.
 */
export const computeJobDescriptionHash = (description = '') => {
  const normalizedText = String(description)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

  return {
    normalizedText,
    hash: crypto.createHash('sha256').update(normalizedText).digest('hex')
  };
};

/**
 * Perform Level 1: Job Description Analysis with Long-Term SHA-256 Persistent Caching.
 * Reused across all users analyzing identical job descriptions.
 */
export const analyzeJobDescriptionWithCache = async (jobTitle, company, description, forceReanalyze = false) => {
  const { normalizedText, hash } = computeJobDescriptionHash(description);

  // 1. Check persistent MongoDB cache unless forced
  if (!forceReanalyze) {
    const cached = await JobAnalysis.findOne({
      descriptionHash: hash,
      promptVersion: JOB_ANALYSIS_PROMPT_VERSION,
      schemaVersion: JOB_ROADMAP_SCHEMA_VERSION
    });

    if (cached && cached.analysis) {
      console.log(`[JOB ANALYSIS CACHE HIT] SHA-256 hash="${hash.slice(0, 12)}..." Provider=${cached.provider}`);
      return {
        hash,
        analysis: cached.analysis,
        cached: true,
        analysisId: cached._id
      };
    }
  }

  // 2. Call configured AI provider (Gemini or Grok) on backend
  console.log(`[AI ANALYSIS CALL] Analyzing JD hash="${hash.slice(0, 12)}..." for title="${jobTitle}"...`);
  const provider = getJobAnalysisProvider();
  const result = await provider.analyzeJobDescription({ jobTitle, company, description });

  // 3. Persist analysis to job_analysis_cache (Long-term, persistent)
  const savedCache = await JobAnalysis.findOneAndUpdate(
    {
      descriptionHash: hash,
      promptVersion: JOB_ANALYSIS_PROMPT_VERSION,
      schemaVersion: JOB_ROADMAP_SCHEMA_VERSION
    },
    {
      descriptionHash: hash,
      normalizedText,
      provider: process.env.JOB_ANALYSIS_PROVIDER || 'gemini',
      model: 'gemini-flash-latest',
      promptVersion: JOB_ANALYSIS_PROMPT_VERSION,
      schemaVersion: JOB_ROADMAP_SCHEMA_VERSION,
      analysis: result,
      extractedSkills: result.skills || [],
      structuredDescription: result.job || {}
    },
    { upsert: true, returnDocument: 'after' }
  );

  console.log(`[JOB ANALYSIS CACHE SAVE] Persisted analysis for hash="${hash.slice(0, 12)}..."`);

  return {
    hash,
    analysis: result,
    cached: false,
    analysisId: savedCache._id
  };
};

/**
 * Perform Level 2: User Job Preparation Roadmap Generation.
 */
export const createOrGetJobPreparation = async (userId, job, userSkills = []) => {
  // Check if prep roadmap already exists for user + job
  const existingPrep = await JobPreparation.findOne({ userId, jobId: job.id }) || await JobPreparation.findOne({ jobId: job.id });
  if (existingPrep) {
    console.log(`[JOB PREPARATION ROADMAP HIT] userId="${userId}" jobId="${job.id}"`);
    return existingPrep;
  }

  // Stage 1 & 2: Job Analysis via SHA-256 Cache / Provider
  const { hash, analysis } = await analyzeJobDescriptionWithCache(
    job.title || 'Target Job',
    job.company || 'Target Company',
    job.description || ''
  );

  // Stage 3 & 4: Canonical Skill Normalization & User Profile Matching
  const userSkillNorms = new Set(
    (userSkills || []).map(s => typeof s === 'string' ? getNormalizedSkillName(s) : getNormalizedSkillName(s.name || s.skillName)).filter(Boolean)
  );

  const matchedReqIds = new Set();
  const partialReqIds = new Set();

  (analysis.requirements || []).forEach(req => {
    const norm = req.canonicalSkillId || getNormalizedSkillName(req.name);
    if (norm && userSkillNorms.has(norm)) {
      matchedReqIds.add(req.id);
      matchedReqIds.add(norm);
    }
  });

  // Stage 5: Deterministic Readiness Score Calculation
  const readiness = calculateDeterministicReadiness(analysis.requirements || [], matchedReqIds, partialReqIds);

  // Stage 6: Job-Specific Roadmap Nodes & Edges Generation
  const nodeStatuses = {};
  const nodes = (analysis.roadmapPlan || []).map(node => {
    const norm = node.canonicalSkillId || getNormalizedSkillName(node.title);
    const isUserMatched = norm && userSkillNorms.has(norm);
    
    // Status is 'done' if already matched in profile skills, else 'default'
    const status = isUserMatched ? 'done' : 'default';
    nodeStatuses[node.id] = status;

    return {
      ...node,
      status
    };
  });

  const eligibleNodes = nodes.filter(n => n.progressEligible !== false);
  const completedCount = eligibleNodes.filter(n => nodeStatuses[n.id] === 'done').length;
  const progressPercentage = eligibleNodes.length > 0 ? Math.round((completedCount / eligibleNodes.length) * 100) : 0;

  const progress = {
    totalNodes: nodes.length,
    completedNodes: completedCount,
    eligibleNodes: eligibleNodes.length,
    progressPercentage
  };

  // Interview Question Mapping
  const interviewQuestions = (analysis.interviewAreas || []).map((area, idx) => ({
    questionId: `iq-${idx + 1}`,
    category: 'Technical',
    question: `Describe how you approach ${area.area} in engineering projects. What best practices do you enforce?`,
    difficulty: 'Intermediate',
    answerGuide: `Focus on architectural tradeoffs, design patterns, testing strategy, and practical implementation for ${area.area}.`
  }));

  // Create & Save JobPreparation Record
  const newPrep = await JobPreparation.create({
    userId,
    jobId: job.id,
    jobTitle: job.title || 'Target Job',
    company: job.company || 'Target Company',
    companyLogo: job.companyLogo || '',
    location: job.location || 'Remote',
    source: job.source || 'JSearch',
    canonicalRoleId: job.title?.toLowerCase().includes('backend') ? 'backend-developer' : 'software-engineer',

    jobSnapshot: {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      descriptionHash: hash,
      analyzedAt: new Date(),
      analysisVersion: JOB_ANALYSIS_PROMPT_VERSION
    },

    requirements: analysis.requirements || [],
    nodes,
    edges: analysis.edges || [],
    nodeStatuses,
    readiness,
    progress,
    interviewQuestions,
    status: 'ACTIVE'
  });

  return newPrep;
};

/**
 * Toggle Node Status & Synchronize Skills Inventory on DONE.
 */
export const toggleJobRoadmapNodeStatus = async (prepId, userId, nodeId, newStatus) => {
  let prep = await JobPreparation.findOne({ _id: prepId, userId });
  if (!prep) {
    prep = await JobPreparation.findById(prepId);
  }
  if (!prep) throw new Error('Job preparation plan not found.');

  let node = prep.nodes.find(n => n.id === nodeId);
  if (!node) {
    node = prep.nodes.find(n => n.canonicalSkillId === nodeId || n.title?.toLowerCase() === nodeId.toLowerCase());
  }

  if (!node) {
    // Dynamically create node entry if missing from array
    node = {
      id: nodeId,
      title: nodeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      type: 'technology',
      importance: 'required',
      canonicalSkillId: getNormalizedSkillName(nodeId) || nodeId,
      progressEligible: true,
      status: newStatus
    };
    prep.nodes.push(node);
  } else {
    node.status = newStatus;
  }

  const oldStatus = node.status || 'default';
  node.status = newStatus;

  if (prep.nodeStatuses && typeof prep.nodeStatuses.set === 'function') {
    prep.nodeStatuses.set(nodeId, newStatus);
  } else if (prep.nodeStatuses) {
    prep.nodeStatuses[nodeId] = newStatus;
  }

  // Update Progress
  const eligibleNodes = prep.nodes.filter(n => n.progressEligible !== false);
  const completedCount = eligibleNodes.filter(n => n.status === 'done').length;
  const progressPercentage = eligibleNodes.length > 0 ? Math.round((completedCount / eligibleNodes.length) * 100) : 0;

  prep.progress = {
    totalNodes: prep.nodes.length,
    completedNodes: completedCount,
    eligibleNodes: eligibleNodes.length,
    progressPercentage
  };

  // Synchronize Skills Inventory if technology node becomes DONE
  if (node.type === 'technology' || node.type === 'skill') {
    const canonicalSkillId = node.canonicalSkillId || getNormalizedSkillName(node.title);
    
    if (newStatus === 'done' && canonicalSkillId) {
      // Add canonical skill to user profile skills if absent
      let profile = await UserProfile.findOne({ userId });
      if (!profile) {
        profile = new UserProfile({ 
          userId, 
          activeTargetRole: { roleId: 'software-engineer', roleTitle: 'Software Engineer' },
          skills: [] 
        });
      }

      const existingSkill = (profile.skills || []).find(s => getNormalizedSkillName(s.name || s.skillName) === canonicalSkillId);
      if (!existingSkill) {
        const resolved = await resolveSkill(node.title);
        profile.skills.push({
          name: resolved.display || node.title,
          skillId: canonicalSkillId,
          level: 'Intermediate',
          source: 'job-roadmap',
          earnedAt: new Date()
        });
        await profile.save();
        console.log(`[SKILL SYNC] Added "${node.title}" to Skills Inventory for userId="${userId}".`);
      }
    } else if (oldStatus === 'done' && newStatus !== 'done' && canonicalSkillId) {
      // Remove ONLY roadmap-earned contribution
      const profile = await UserProfile.findOne({ userId });
      if (profile && Array.isArray(profile.skills)) {
        profile.skills = profile.skills.filter(s => {
          const isTarget = getNormalizedSkillName(s.name || s.skillName) === canonicalSkillId;
          const isRoadmapEarned = s.source === 'job-roadmap';
          return !(isTarget && isRoadmapEarned);
        });
        await profile.save();
        console.log(`[SKILL SYNC] Removed roadmap-earned contribution of "${node.title}" for userId="${userId}".`);
      }
    }
  }

  // Deterministically recalculate readiness
  const matchedReqIds = new Set();
  const partialReqIds = new Set();

  prep.nodes.forEach(n => {
    if (n.status === 'done') {
      const norm = getNormalizedSkillName(n.canonicalSkillId || n.title);
      if (norm) {
        matchedReqIds.add(norm);
        if (n.canonicalSkillId) matchedReqIds.add(n.canonicalSkillId);
        if (n.title) matchedReqIds.add(n.title.toLowerCase());
      }
    }
  });

  prep.readiness = calculateDeterministicReadiness(prep.requirements, matchedReqIds, partialReqIds);

  prep.markModified('nodes');
  prep.markModified('nodeStatuses');
  prep.markModified('readiness');
  prep.markModified('progress');

  await prep.save();
  return prep;
};
