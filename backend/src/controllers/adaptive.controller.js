import { recalculateRoadmapState } from '../services/roadmap/adaptive.service.js';
import RoadmapSnapshot from '../models/roadmapSnapshot.model.js';
import Roadmap from '../models/roadmap.model.js';
import mongoose from 'mongoose';

/**
 * Recalculate roadmap adaptively
 */
export const recalculateRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { reason, profile, hoursPerWeek, interviewDate, deadlineDate, targetRole, company } = req.body;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId parameter.' });
    }

    const result = await recalculateRoadmapState(roadmapId, {
      userEmail,
      reason,
      profile,
      hoursPerWeek,
      interviewDate,
      deadlineDate,
      targetRole,
      company
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('[CONTROLLER] Recalculate roadmap failed:', error);
    if (error.message === 'Unauthorized user access.') {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message || 'Failed to recalculate roadmap.' });
  }
};

/**
 * Get all versions of a roadmap
 */
export const getRoadmapVersions = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId parameter.' });
    }

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    if (roadmap.userId !== userEmail) {
      return res.status(403).json({ error: 'Unauthorized user access.' });
    }

    // Find all snapshot history
    const snapshots = await RoadmapSnapshot.find({ roadmapId }).sort({ version: -1 });

    const versions = [
      {
        version: roadmap.version,
        recalculatedAt: roadmap.recalculatedAt || roadmap.updatedAt,
        recalculationReason: roadmap.recalculationReason || 'Current active roadmap version',
        adaptationSummary: roadmap.adaptationSummary,
        isActive: true
      },
      ...snapshots.map(s => ({
        version: s.version,
        recalculatedAt: s.createdAt,
        recalculationReason: s.recalculationReason,
        adaptationSummary: s.adaptationSummary,
        isActive: false
      }))
    ];

    return res.status(200).json({ versions });
  } catch (error) {
    console.error('[CONTROLLER] Get roadmap versions failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch roadmap versions.' });
  }
};

/**
 * Get specific version details of a roadmap
 */
export const getRoadmapVersionDetails = async (req, res) => {
  try {
    const { roadmapId, version } = req.params;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId parameter.' });
    }

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    if (roadmap.userId !== userEmail) {
      return res.status(403).json({ error: 'Unauthorized user access.' });
    }

    const targetVersion = parseInt(version, 10);
    if (isNaN(targetVersion)) {
      return res.status(400).json({ error: 'Invalid version number parameter.' });
    }

    // If requesting the current active version
    if (roadmap.version === targetVersion) {
      return res.status(200).json({ version: targetVersion, roadmapData: roadmap });
    }

    // Query snapshot archive
    const snapshot = await RoadmapSnapshot.findOne({ roadmapId, version: targetVersion });
    if (!snapshot) {
      return res.status(404).json({ error: `Roadmap version ${version} not found.` });
    }

    return res.status(200).json({ version: targetVersion, roadmapData: snapshot.roadmapData });
  } catch (error) {
    console.error('[CONTROLLER] Get specific roadmap version failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch roadmap version snapshot.' });
  }
};

/**
 * Get latest adaptation summary
 */
export const getRoadmapAdaptationSummary = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId parameter.' });
    }

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    if (roadmap.userId !== userEmail) {
      return res.status(403).json({ error: 'Unauthorized user access.' });
    }

    return res.status(200).json({
      version: roadmap.version,
      recalculatedAt: roadmap.recalculatedAt || roadmap.updatedAt,
      recalculationReason: roadmap.recalculationReason || 'Initial setup',
      adaptationSummary: roadmap.adaptationSummary || {
        summary: 'Your career preparation roadmap has been initialized.',
        completed: [],
        reprioritized: [],
        deprioritized: [],
        newFocus: roadmap.prioritizedSkills.slice(0, 3).map(ps => ps.displayName)
      }
    });
  } catch (error) {
    console.error('[CONTROLLER] Get roadmap adaptation summary failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch latest adaptation summary.' });
  }
};
