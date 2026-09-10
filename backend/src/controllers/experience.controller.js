import { getRoadmapExperience, getNextActionSelector } from '../services/roadmap/experience.service.js';
import mongoose from 'mongoose';

/**
 * Get aggregated experience DTO for dashboard load
 */
export const getRoadmapExperienceController = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId parameter.' });
    }

    const payload = await getRoadmapExperience(roadmapId, userId);
    return res.status(200).json(payload);
  } catch (error) {
    console.error('[CONTROLLER] Get roadmap experience failed:', error);
    if (error.message === 'Roadmap not found.' || error.message === 'Unauthorized user access.') {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }
    return res.status(500).json({ error: error.message || 'Failed to fetch roadmap experience.' });
  }
};

/**
 * Get deterministic next action
 */
export const getNextActionController = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId parameter.' });
    }

    const nextAction = await getNextActionSelector(roadmapId, userId);
    if (!nextAction) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }
    return res.status(200).json({ nextAction });
  } catch (error) {
    console.error('[CONTROLLER] Get next action failed:', error);
    if (error.message === 'Unauthorized user access.') {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }
    return res.status(500).json({ error: error.message || 'Failed to fetch next action.' });
  }
};

/**
 * Get progress & gamification metrics
 */
export const getProgressController = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId parameter.' });
    }

    const payload = await getRoadmapExperience(roadmapId, userId);
    return res.status(200).json({
      percentage: payload.progress.percentage,
      xpEarned: payload.progress.xpEarned,
      xpAvailable: payload.progress.xpAvailable,
      skillsVerified: payload.progress.skillsVerified,
      missionsCompleted: payload.progress.missionsCompleted,
      projectsCompleted: payload.progress.projectsCompleted,
      assessmentsPassed: payload.progress.assessmentsPassed,
      daysRemaining: payload.timePlan.daysRemaining,
      planningMode: payload.timePlan.planningMode
    });
  } catch (error) {
    console.error('[CONTROLLER] Get progress failed:', error);
    if (error.message === 'Roadmap not found.' || error.message === 'Unauthorized user access.') {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }
    return res.status(500).json({ error: error.message || 'Failed to fetch roadmap progress.' });
  }
};
