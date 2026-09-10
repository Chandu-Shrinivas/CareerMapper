import Project from '../models/project.model.js';
import Evidence from '../models/evidence.model.js';
import Roadmap from '../models/roadmap.model.js';
import { generateProjectsForRoadmap } from '../services/roadmap/project.service.js';
import mongoose from 'mongoose';

/**
 * Controller to generate practical projects for a roadmap
 */
export const generateProjects = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { profile, refresh } = req.body;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId parameter.' });
    }

    const roadmapDoc = await Roadmap.findById(roadmapId);
    if (!roadmapDoc) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    // Verify ownership
    if (roadmapDoc.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: You do not own this roadmap.' });
    }

    const result = await generateProjectsForRoadmap(roadmapId, profile || {}, refresh === true);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[CONTROLLER] Project generation failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate projects.' });
  }
};

/**
 * Controller to submit evidence for a project
 */
export const submitEvidence = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { projectId, type, title, description, url, fileMetadata } = req.body;
    const userEmail = req.user.email;

    if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return res.status(400).json({ error: 'Invalid or missing roadmapId.' });
    }
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid or missing projectId.' });
    }
    if (!url || !type || !title || !description) {
      return res.status(400).json({ error: 'Missing required evidence submission fields (type, title, description, url).' });
    }

    const projectDoc = await Project.findById(projectId);
    if (!projectDoc) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Verify ownership
    if (projectDoc.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: You do not own this project.' });
    }

    const newEvidence = new Evidence({
      userId: userEmail,
      roadmapId,
      projectId,
      skillIds: projectDoc.skillIds,
      type,
      title,
      description,
      url,
      fileMetadata: fileMetadata || {},
      verificationStatus: 'pending'
    });

    await newEvidence.save();

    // Auto-update project status
    projectDoc.status = 'submitted';
    await projectDoc.save();

    return res.status(201).json(newEvidence);
  } catch (error) {
    console.error('[CONTROLLER] Evidence submission failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit evidence.' });
  }
};

/**
 * Controller to retrieve all evidence submitted for a roadmap
 */
export const getEvidence = async (req, res) => {
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
      return res.status(403).json({ error: 'Forbidden: You do not own this roadmap.' });
    }

    const submissions = await Evidence.find({ roadmapId }).sort({ createdAt: -1 });
    return res.status(200).json(submissions);
  } catch (error) {
    console.error('[CONTROLLER] Get evidence failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve evidence.' });
  }
};

/**
 * Controller to update evidence verification status
 */
export const updateEvidenceStatus = async (req, res) => {
  try {
    const { evidenceId } = req.params;
    const { verificationStatus, verificationNotes } = req.body;
    const userEmail = req.user.email;

    if (!evidenceId || !mongoose.Types.ObjectId.isValid(evidenceId)) {
      return res.status(400).json({ error: 'Invalid or missing evidenceId.' });
    }

    const evidenceDoc = await Evidence.findById(evidenceId);
    if (!evidenceDoc) {
      return res.status(404).json({ error: 'Evidence submission not found.' });
    }

    // Update submission status
    if (verificationStatus) evidenceDoc.verificationStatus = verificationStatus;
    if (verificationNotes) evidenceDoc.verificationNotes = verificationNotes;

    await evidenceDoc.save();

    // Auto-update associated project status accordingly
    const projectDoc = await Project.findById(evidenceDoc.projectId);
    if (projectDoc) {
      if (verificationStatus === 'verified' || verificationStatus === 'accepted') {
        projectDoc.status = 'verified';
      } else if (verificationStatus === 'rejected') {
        projectDoc.status = 'in_progress';
      } else if (verificationStatus === 'needs_revision') {
        projectDoc.status = 'in_progress';
      }
      await projectDoc.save();
    }

    return res.status(200).json(evidenceDoc);
  } catch (error) {
    console.error('[CONTROLLER] Update evidence status failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to update evidence status.' });
  }
};

/**
 * Controller to delete evidence submission
 */
export const deleteEvidence = async (req, res) => {
  try {
    const { evidenceId } = req.params;
    const userEmail = req.user.email;

    if (!evidenceId || !mongoose.Types.ObjectId.isValid(evidenceId)) {
      return res.status(400).json({ error: 'Invalid or missing evidenceId.' });
    }

    const evidenceDoc = await Evidence.findById(evidenceId);
    if (!evidenceDoc) {
      return res.status(404).json({ error: 'Evidence submission not found.' });
    }

    // Verify ownership
    if (evidenceDoc.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: You do not own this evidence.' });
    }

    const projectId = evidenceDoc.projectId;
    await Evidence.findByIdAndDelete(evidenceId);

    // Revert associated project status
    const projectDoc = await Project.findById(projectId);
    if (projectDoc) {
      projectDoc.status = 'in_progress';
      await projectDoc.save();
    }

    return res.status(200).json({ message: 'Evidence submission deleted successfully.' });
  } catch (error) {
    console.error('[CONTROLLER] Delete evidence failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to delete evidence.' });
  }
};
