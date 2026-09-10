import { generateRoadmap } from '../services/roadmap/engine.service.js';
import Roadmap from '../models/roadmap.model.js';
import Mission from '../models/mission.model.js';
import mongoose from 'mongoose';

/**
 * Controller to handle the generation of an adaptive roadmap
 */
export const createRoadmap = async (req, res) => {
  try {
    const { profile } = req.body;
    let { userId, targetRoleParams } = req.body;

    if (!userId) {
      userId = req.headers['x-user-email'] || req.body.email || 'demo@careermapper.app';
    }

    if (!targetRoleParams) {
      if (req.body.targetRole) {
        targetRoleParams = {
          targetRole: req.body.targetRole,
          company: req.body.company || 'Target Company',
          domain: req.body.domain || 'Technology',
          userSkills: req.body.userSkills || []
        };
      }
    }

    if (!targetRoleParams || !targetRoleParams.targetRole) {
      return res.status(400).json({ error: "Missing required object 'targetRoleParams' with property 'targetRole'." });
    }

    const payload = await generateRoadmap(userId, profile || {}, targetRoleParams);
    return res.status(200).json(payload);

  } catch (error) {
    console.error('[CONTROLLER] Roadmap generation failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate career roadmap.' });
  }
};

/**
 * Controller to retrieve an existing roadmap by ID or userId
 */
export const getRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, targetRole } = req.query;

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const roadmap = await Roadmap.findById(id);
      if (!roadmap) {
        return res.status(404).json({ error: 'Roadmap not found.' });
      }
      return res.status(200).json({ roadmap });
    }

    if (userId) {
      const query = { userId };
      if (targetRole) {
        query.targetRole = targetRole;
      }
      const roadmaps = await Roadmap.find(query).sort({ updatedAt: -1 });
      return res.status(200).json({ roadmaps });
    }

    return res.status(400).json({ error: 'Please provide either a roadmap id or userId.' });

  } catch (error) {
    console.error('[CONTROLLER] Get roadmap error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error.' });
  }
};

import { generateMissionsForRoadmap } from '../services/roadmap/mission.service.js';

/**
 * Controller to generate missions for an existing roadmap
 */
export const generateMissions = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { profile, refresh } = req.body;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId parameter.' });
    }

    const result = await generateMissionsForRoadmap(roadmapId, profile || {}, refresh === true);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[CONTROLLER] Mission generation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate missions.' });
  }
};

/**
 * Controller to update the status of a mission
 */
export const updateMissionStatus = async (req, res) => {
  try {
    const { roadmapId, missionId } = req.params;
    const { status } = req.body;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId.' });
    }
    if (!missionId || !mongoose.Types.ObjectId.isValid(missionId)) {
      return res.status(400).json({ error: 'Invalid or missing missionId.' });
    }
    if (!['not_started', 'in_progress', 'completed', 'skipped'].includes(status)) {
      return res.status(400).json({ error: 'Invalid mission status.' });
    }

    const missionDoc = await Mission.findById(missionId);
    if (!missionDoc) {
      return res.status(404).json({ error: 'Mission not found.' });
    }

    // Verify ownership via roadmap
    const roadmapDoc = await Roadmap.findById(roadmapId);
    if (!roadmapDoc || roadmapDoc.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: You do not own this roadmap.' });
    }

    missionDoc.status = status;
    await missionDoc.save();

    return res.status(200).json(missionDoc);
  } catch (error) {
    console.error('[CONTROLLER] Update mission status failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to update mission status.' });
  }
};
