import JobPreparation from '../models/jobPreparation.model.js';
import InterviewSession from '../models/interviewSession.model.js';
import { getJobById } from '../services/job.service.js';
import { 
  createOrGetJobPreparation, 
  toggleJobRoadmapNodeStatus, 
  analyzeJobDescriptionWithCache 
} from '../services/jobPreparation.service.js';
import { calculateDeterministicReadiness } from '../services/roadmap/readinessCalculator.js';
import { getNormalizedSkillName } from '../utils/skillNormalizer.js';

// 1. Prepare for a Job Posting
export const prepareJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.email || req.body.email || 'demo@careermapper.app';
    const userSkills = req.body.userSkills || ['React', 'JavaScript', 'HTML', 'CSS', 'Git', 'Java', 'SQL'];

    // Retrieve job listing
    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ status: 'error', message: `Job with ID "${jobId}" not found.` });
    }

    // Orchestrate pipeline via service
    const prep = await createOrGetJobPreparation(userId, job, userSkills);

    return res.status(201).json({
      status: 'success',
      message: 'Job preparation roadmap ready.',
      data: prep
    });
  } catch (err) {
    console.error('[JOB PREPARE ERROR]', err);
    return res.status(500).json({ status: 'error', message: err.message || 'Failed to prepare job roadmap.' });
  }
};

// 2. Get All Job Preparations for User
export const getJobPreparations = async (req, res) => {
  try {
    const userId = req.user?.email || req.query.email || 'demo@careermapper.app';
    const preps = await JobPreparation.find({ userId }).sort({ updatedAt: -1 });

    const responseList = preps.map(p => {
      const overallReadiness = p.readiness?.overallReadiness ?? 50;
      const criticalGaps = (p.readiness?.missingRequirements || []).filter((r) => r.importance === 'critical').length;
      const totalGaps = (p.readiness?.missingRequirements || []).length;
      const matchedCount = (p.readiness?.matchedRequirements || []).length;

      return {
        id: p._id,
        jobId: p.jobId,
        jobTitle: p.jobTitle,
        company: p.company,
        companyLogo: p.companyLogo,
        location: p.location,
        readinessScore: overallReadiness,
        criticalGapsCount: criticalGaps,
        totalGapsCount: totalGaps,
        matchedSkillsCount: matchedCount,
        progressPercentage: p.progress?.progressPercentage || 0,
        completedNodes: p.progress?.completedNodes || 0,
        totalNodes: p.progress?.totalNodes || 0,
        updatedAt: p.updatedAt
      };
    });

    return res.status(200).json({
      status: 'success',
      data: responseList
    });
  } catch (err) {
    console.error('[GET JOB PREPARATIONS ERROR]', err);
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve job preparations.' });
  }
};

// 3. Get Single Job Preparation Detail
export const getJobPreparationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.email || req.query.email || 'demo@careermapper.app';

    const prep = await JobPreparation.findOne({ _id: id, userId });
    if (!prep) {
      return res.status(404).json({ status: 'error', message: 'Job preparation plan not found.' });
    }

    return res.status(200).json({
      status: 'success',
      data: prep
    });
  } catch (err) {
    console.error('[GET JOB PREPARATION BY ID ERROR]', err);
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve preparation details.' });
  }
};

// 4. Toggle Node Status in Roadmap
export const togglePreparationNode = async (req, res) => {
  try {
    const { id } = req.params;
    const { nodeId, status = 'done' } = req.body;
    const userId = req.user?.email || req.body.email || 'demo@careermapper.app';

    if (!nodeId) {
      return res.status(400).json({ status: 'error', message: 'nodeId parameter is required.' });
    }

    const updatedPrep = await toggleJobRoadmapNodeStatus(id, userId, nodeId, status);

    return res.status(200).json({
      status: 'success',
      message: `Node "${nodeId}" status updated to "${status}".`,
      data: updatedPrep
    });
  } catch (err) {
    console.error('[TOGGLE NODE ERROR]', err);
    return res.status(500).json({ status: 'error', message: err.message || 'Failed to update node status.' });
  }
};

// 5. Deterministic Recalculate Readiness (NO AI Call)
export const recalculateReadiness = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.email || req.query.email || 'demo@careermapper.app';

    const prep = await JobPreparation.findOne({ _id: id, userId });
    if (!prep) {
      return res.status(404).json({ status: 'error', message: 'Job preparation plan not found.' });
    }

    const matchedReqIds = new Set();
    const partialReqIds = new Set();

    prep.nodes.forEach(n => {
      if (n.status === 'done') {
        const norm = n.canonicalSkillId || getNormalizedSkillName(n.title);
        if (norm) matchedReqIds.add(norm);
      }
    });

    prep.readiness = calculateDeterministicReadiness(prep.requirements, matchedReqIds, partialReqIds);
    prep.markModified('readiness');
    await prep.save();

    return res.status(200).json({
      status: 'success',
      message: 'Readiness score recalculated deterministically.',
      data: prep.readiness
    });
  } catch (err) {
    console.error('[RECALCULATE READINESS ERROR]', err);
    return res.status(500).json({ status: 'error', message: 'Failed to recalculate readiness.' });
  }
};

// 6. Explicit Re-analyze Job
export const reanalyzeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.email || req.body.email || 'demo@careermapper.app';

    const prep = await JobPreparation.findOne({ _id: id, userId });
    if (!prep) {
      return res.status(404).json({ status: 'error', message: 'Job preparation plan not found.' });
    }

    const job = await getJobById(prep.jobId);
    if (!job) {
      return res.status(404).json({ status: 'error', message: `Original job listing "${prep.jobId}" no longer exists.` });
    }

    // Force re-analysis with AI provider
    const { analysis } = await analyzeJobDescriptionWithCache(
      job.title || prep.jobTitle,
      job.company || prep.company,
      job.description || '',
      true // forceReanalyze
    );

    return res.status(200).json({
      status: 'success',
      message: 'Re-analysis completed. Review updated requirements below.',
      data: {
        newRequirements: analysis.requirements || [],
        newNodes: analysis.roadmapPlan || [],
        newEdges: analysis.edges || []
      }
    });
  } catch (err) {
    console.error('[REANALYZE JOB ERROR]', err);
    return res.status(500).json({ status: 'error', message: err.message || 'Re-analysis failed.' });
  }
};

// 7. Get Interview Prep
export const getJobInterviewPrep = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.email || req.query.email || 'demo@careermapper.app';

    const prep = await JobPreparation.findOne({ _id: id, userId });
    if (!prep) {
      return res.status(404).json({ status: 'error', message: 'Job preparation not found.' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        preparationId: prep._id,
        jobTitle: prep.jobTitle,
        company: prep.company,
        readinessScore: prep.readiness?.overallReadiness || 50,
        questions: prep.interviewQuestions
      }
    });
  } catch (err) {
    console.error('[GET INTERVIEW PREP ERROR]', err);
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve interview prep data.' });
  }
};

// 8. Start Interview Simulation
export const startInterviewSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const { mode = 'Mixed' } = req.body;
    const userId = req.user?.email || req.body.email || 'demo@careermapper.app';

    const prep = await JobPreparation.findOne({ _id: id, userId });
    if (!prep) {
      return res.status(404).json({ status: 'error', message: 'Job preparation not found.' });
    }

    const questionsToAsk = (prep.interviewQuestions || []).map(q => ({
      questionId: q.questionId,
      category: q.category,
      question: q.question,
      difficulty: q.difficulty
    }));

    const session = await InterviewSession.create({
      preparationId: prep._id,
      userId,
      mode,
      questions: questionsToAsk,
      responses: [],
      overallScore: 0,
      status: 'IN_PROGRESS'
    });

    return res.status(201).json({
      status: 'success',
      data: session
    });
  } catch (err) {
    console.error('[START SIMULATION ERROR]', err);
    return res.status(500).json({ status: 'error', message: 'Failed to start interview simulation.' });
  }
};
