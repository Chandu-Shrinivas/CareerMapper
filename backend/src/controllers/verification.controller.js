import { calculateVerificationScore, recalculateRoadmapVerifications, analyzeEvidenceRelevance } from '../services/roadmap/verification.service.js';
import SkillVerification from '../models/skillVerification.model.js';
import Evidence from '../models/evidence.model.js';
import EvidenceAnalysis from '../models/evidenceAnalysis.model.js';
import Roadmap from '../models/roadmap.model.js';
import mongoose from 'mongoose';

/**
 * Controller to recalculate verification score for a specific skill
 */
export const recalculateVerification = async (req, res) => {
  try {
    const { roadmapId, skillId } = req.params;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId.' });
    }
    if (!skillId) {
      return res.status(400).json({ error: 'Missing skillId.' });
    }

    const roadmapDoc = await Roadmap.findById(roadmapId);
    if (!roadmapDoc) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }
    if (roadmapDoc.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    const result = await calculateVerificationScore(userEmail, roadmapId, skillId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[CONTROLLER] Recalculate verification failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to recalculate verification.' });
  }
};

/**
 * Controller to get all verifications for a roadmap
 */
export const getRoadmapVerifications = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId.' });
    }

    const roadmapDoc = await Roadmap.findById(roadmapId);
    if (!roadmapDoc) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }
    if (roadmapDoc.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    const list = await recalculateRoadmapVerifications(userEmail, roadmapId);
    return res.status(200).json(list);
  } catch (error) {
    console.error('[CONTROLLER] Get roadmap verifications failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve roadmap verifications.' });
  }
};

/**
 * Controller to get verification breakdown for one skill
 */
export const getSkillVerification = async (req, res) => {
  try {
    const { roadmapId, skillId } = req.params;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId.' });
    }
    if (!skillId) {
      return res.status(400).json({ error: 'Missing skillId.' });
    }

    const roadmapDoc = await Roadmap.findById(roadmapId);
    if (!roadmapDoc) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }
    if (roadmapDoc.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    let record = await SkillVerification.findOne({ userId: userEmail, roadmapId, skillId });
    if (!record) {
      record = await calculateVerificationScore(userEmail, roadmapId, skillId);
    }

    return res.status(200).json(record);
  } catch (error) {
    console.error('[CONTROLLER] Get skill verification failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve skill verification.' });
  }
};

/**
 * Controller to trigger explicit AI analysis on evidence
 */
export const postAnalyzeEvidence = async (req, res) => {
  try {
    const { evidenceId } = req.params;
    const { skillId, refresh } = req.body;
    const userEmail = req.user.email;

    if (!evidenceId || !mongoose.Types.ObjectId.isValid(evidenceId)) {
      return res.status(400).json({ error: 'Invalid or missing evidenceId.' });
    }
    if (!skillId) {
      return res.status(400).json({ error: 'Missing skillId in request body.' });
    }

    const evidence = await Evidence.findById(evidenceId);
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found.' });
    }

    const roadmap = await Roadmap.findById(evidence.roadmapId);
    if (!roadmap || roadmap.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    const result = await analyzeEvidenceRelevance(evidenceId, skillId, refresh === true);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[CONTROLLER] Analyze evidence failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze evidence.' });
  }
};

/**
 * Controller to retrieve cached evidence analysis
 */
export const getEvidenceAnalysis = async (req, res) => {
  try {
    const { evidenceId } = req.params;
    const { skillId } = req.query;
    const userEmail = req.user.email;

    if (!evidenceId || !mongoose.Types.ObjectId.isValid(evidenceId)) {
      return res.status(400).json({ error: 'Invalid or missing evidenceId.' });
    }
    if (!skillId) {
      return res.status(400).json({ error: 'Missing skillId query parameter.' });
    }

    const evidence = await Evidence.findById(evidenceId);
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found.' });
    }

    const roadmap = await Roadmap.findById(evidence.roadmapId);
    if (!roadmap || roadmap.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    let record = await EvidenceAnalysis.findOne({ evidenceId, evidenceVersion: 1, skillId });
    if (!record) {
      record = await analyzeEvidenceRelevance(evidenceId, skillId, false);
    }

    return res.status(200).json(record);
  } catch (error) {
    console.error('[CONTROLLER] Get evidence analysis failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve evidence analysis.' });
  }
};
