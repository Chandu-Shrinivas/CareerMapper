import { 
  getOrGenerateInterviewPrep, 
  startInterviewSimulation, 
  respondToSimulationQuestion, 
  completeInterviewSimulation 
} from '../services/roadmap/interviewPrep.service.js';
import { generateRoadmap } from '../services/roadmap/engine.service.js';
import { getOrGenerateCompanyIntelligence } from '../services/roadmap/companyIntelligence.service.js';
import { SavedJob } from '../models/savedJob.model.js';
import Roadmap from '../models/roadmap.model.js';
import mongoose from 'mongoose';

/**
 * Controller to fetch cached interview prep details (strictly ZERO AI call on load).
 */
export const getInterviewPrepController = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId.' });
    }

    const prep = await getOrGenerateInterviewPrep(roadmapId, userEmail, false);
    return res.status(200).json(prep);
  } catch (error) {
    console.error('[CONTROLLER] Get interview prep failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve interview preparation.' });
  }
};

/**
 * Controller to explicitly generate/refresh interview prep (AI call allowed on explicit request).
 */
export const generateInterviewPrepController = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId.' });
    }

    const prep = await getOrGenerateInterviewPrep(roadmapId, userEmail, true);
    return res.status(200).json(prep);
  } catch (error) {
    console.error('[CONTROLLER] Generate interview prep failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate interview preparation.' });
  }
};

/**
 * Controller to start an adaptive interview simulation.
 */
export const startInterviewSimulationController = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { mode } = req.body;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId.' });
    }

    const session = await startInterviewSimulation(roadmapId, userEmail, mode || 'Mixed');
    return res.status(201).json(session);
  } catch (error) {
    console.error('[CONTROLLER] Start interview simulation failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to start interview simulation.' });
  }
};

/**
 * Controller to submit a response to a simulation question.
 */
export const respondToSimulationQuestionController = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, userAnswer } = req.body;
    const userEmail = req.user.email;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: 'Invalid or missing sessionId.' });
    }
    if (!questionId || userAnswer === undefined) {
      return res.status(400).json({ error: 'Missing required questionId or userAnswer.' });
    }

    const result = await respondToSimulationQuestion(sessionId, userEmail, questionId, userAnswer);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[CONTROLLER] Simulation response failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to process simulation response.' });
  }
};

/**
 * Controller to complete an interview simulation session.
 */
export const completeInterviewSimulationController = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userEmail = req.user.email;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: 'Invalid or missing sessionId.' });
    }

    const session = await completeInterviewSimulation(sessionId, userEmail);
    return res.status(200).json(session);
  } catch (error) {
    console.error('[CONTROLLER] Complete simulation failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to complete simulation session.' });
  }
};

/**
 * Controller to prepare for a Saved Job (connects saved job to interview prep/roadmap).
 */
export const prepareSavedJobController = async (req, res) => {
  try {
    const { savedJobId } = req.params;
    const userEmail = req.user.email;

    if (!savedJobId || !mongoose.Types.ObjectId.isValid(savedJobId)) {
      return res.status(400).json({ error: 'Invalid or missing savedJobId.' });
    }

    const savedJobDoc = await SavedJob.findById(savedJobId);
    if (!savedJobDoc || savedJobDoc.userEmail !== userEmail) {
      return res.status(404).json({ error: 'Saved job not found or access denied.' });
    }

    // Find or link active roadmap matching company/role
    let roadmapDoc = await Roadmap.findOne({ userId: userEmail, company: savedJobDoc.company });
    if (!roadmapDoc) {
      roadmapDoc = await Roadmap.findOne({ userId: userEmail });
    }

    if (!roadmapDoc) {
      roadmapDoc = await generateRoadmap({
        userId: userEmail,
        targetRole: savedJobDoc.title || 'Software Engineer',
        company: savedJobDoc.company || 'Target Company',
        domain: 'Technology',
        userSkills: []
      });
    }

    // Update company & target role if needed
    roadmapDoc.company = savedJobDoc.company || roadmapDoc.company;
    roadmapDoc.targetRole = savedJobDoc.title || roadmapDoc.targetRole;
    await roadmapDoc.save();

    // Trigger explicit prep generation for this target
    const prep = await getOrGenerateInterviewPrep(roadmapDoc._id, userEmail, true);

    return res.status(200).json({
      message: `Interview preparation initialized for ${savedJobDoc.company}`,
      roadmapId: roadmapDoc._id,
      company: savedJobDoc.company,
      targetRole: savedJobDoc.title,
      prep
    });
  } catch (error) {
    console.error('[CONTROLLER] Prepare saved job failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to prepare saved job.' });
  }
};
