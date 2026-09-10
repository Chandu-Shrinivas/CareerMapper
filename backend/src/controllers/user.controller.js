import UserProfile from '../models/userProfile.model.js';
import Roadmap from '../models/roadmap.model.js';
import { generateRoadmap } from '../services/roadmap/engine.service.js';

/**
 * Retrieves the canonical active target role for the authenticated user from MongoDB
 */
export const getActiveTargetRole = async (req, res) => {
  try {
    const userId = req.user?.email || req.headers['x-user-email'] || req.query.userId || 'demo@careermapper.app';
    
    let profile = await UserProfile.findOne({ userId: userId.toLowerCase() });

    if (profile && profile.activeTargetRole && profile.activeTargetRole.roleTitle) {
      return res.status(200).json({ activeTargetRole: profile.activeTargetRole });
    }

    // Fallback: Check existing Roadmaps for this user
    const latestRoadmap = await Roadmap.findOne({ userId: userId.toLowerCase() }).sort({ createdAt: -1 });

    if (latestRoadmap && latestRoadmap.targetRole) {
      const activeRoleObj = {
        roleTitle: latestRoadmap.targetRole,
        company: latestRoadmap.company || 'Target Company',
        domain: latestRoadmap.domain || 'Technology',
        matchScore: latestRoadmap.readinessScore || 80,
        matchedSkills: [],
        skillsToStrengthen: (latestRoadmap.prioritizedSkills || []).map(s => s.displayName),
        source: 'roadmap_inferred',
        updatedAt: new Date()
      };

      // Persist to UserProfile
      profile = await UserProfile.findOneAndUpdate(
        { userId: userId.toLowerCase() },
        { $set: { activeTargetRole: activeRoleObj } },
        { upsert: true, new: true }
      );

      return res.status(200).json({ activeTargetRole: profile.activeTargetRole });
    }

    return res.status(200).json({ activeTargetRole: null });
  } catch (error) {
    console.error('[USER CONTROLLER] getActiveTargetRole failed:', error);
    return res.status(500).json({ error: 'Failed to retrieve active target role.' });
  }
};

/**
 * Single Source of Truth Setter: Persists active target role to MongoDB and triggers roadmap generation
 */
export const setActiveTargetRole = async (req, res) => {
  try {
    const userId = req.user?.email || req.headers['x-user-email'] || req.body.userId || 'demo@careermapper.app';
    const { roleTitle, company, domain, matchScore, matchedSkills, skillsToStrengthen, source } = req.body;

    if (!roleTitle) {
      return res.status(400).json({ error: "Missing required parameter 'roleTitle'." });
    }

    const cleanRoleTitle = roleTitle.split(',')[0].trim();

    const activeRoleObj = {
      roleTitle: cleanRoleTitle,
      company: company || 'Target Company',
      domain: domain || 'Technology',
      matchScore: typeof matchScore === 'number' ? matchScore : 80,
      matchedSkills: Array.isArray(matchedSkills) ? matchedSkills : [],
      skillsToStrengthen: Array.isArray(skillsToStrengthen) ? skillsToStrengthen : [],
      source: source || 'user_selected',
      updatedAt: new Date()
    };

    // 1. Save to UserProfile in MongoDB
    const profile = await UserProfile.findOneAndUpdate(
      { userId: userId.toLowerCase() },
      { $set: { activeTargetRole: activeRoleObj } },
      { upsert: true, new: true }
    );

    // 2. Ensure Roadmap document exists or generate a fresh roadmap in MongoDB
    let roadmapDoc = await Roadmap.findOne({
      userId: userId.toLowerCase(),
      targetRole: cleanRoleTitle
    }).sort({ createdAt: -1 });

    if (!roadmapDoc || !roadmapDoc.prioritizedSkills || roadmapDoc.prioritizedSkills.length === 0) {
      const generated = await generateRoadmap(userId.toLowerCase(), {}, {
        targetRole: cleanRoleTitle,
        company: activeRoleObj.company,
        domain: activeRoleObj.domain
      });
      roadmapDoc = generated.roadmap;
    }

    return res.status(200).json({
      success: true,
      activeTargetRole: profile.activeTargetRole,
      roadmapId: roadmapDoc._id
    });
  } catch (error) {
    console.error('[USER CONTROLLER] setActiveTargetRole failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to update active target role.' });
  }
};
