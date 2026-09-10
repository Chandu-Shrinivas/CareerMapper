import Roadmap from '../../models/roadmap.model.js';
import RoadmapSnapshot from '../../models/roadmapSnapshot.model.js';
import Mission from '../../models/mission.model.js';
import Project from '../../models/project.model.js';
import Assessment from '../../models/assessment.model.js';
import AssessmentAttempt from '../../models/assessmentAttempt.model.js';
import Evidence from '../../models/evidence.model.js';
import SkillVerification from '../../models/skillVerification.model.js';
import SkillDependency from '../../models/skillDependency.model.js';
import mongoose from 'mongoose';

/**
 * Helper to determine unlocking skills
 */
function getUnlocks(skillId, skillStates) {
  return skillStates
    .filter(s => s.prerequisites.includes(skillId))
    .map(s => s.name);
}

/**
 * Deterministic Next Action Selector from pre-loaded data (no AI queries, no N+1 database queries)
 */
export const getNextActionFromLoadedData = (data) => {
  const {
    roadmapDoc,
    missions,
    projects,
    assessments,
    attempts,
    evidenceList,
    verifications,
    dependencies
  } = data;

  // Reconstruct skill states
  const skillStates = roadmapDoc.prioritizedSkills.map(ps => {
    const ver = verifications.find(v => v.skillId === ps.canonicalId);
    const confidence = ver ? ver.confidenceScore : 0;
    const verificationStatus = ver ? ver.verificationStatus : 'UNVERIFIED';

    let skillState = 'NOT_STARTED';
    if (verificationStatus === 'VERIFIED') {
      skillState = 'MAINTENANCE';
    } else if (verificationStatus === 'STRONG') {
      skillState = 'STRONG';
    } else if (verificationStatus === 'DEMONSTRATED') {
      skillState = 'DEMONSTRATED';
    } else if (verificationStatus === 'DEVELOPING') {
      skillState = 'DEVELOPING';
    } else {
      const skillMissions = missions.filter(m => m.skillId === ps.canonicalId);
      const isAnyCompleted = skillMissions.some(m => ['completed', 'verified'].includes(m.status));
      if (isAnyCompleted) {
        skillState = 'LEARNING';
      }
    }

    // Get prerequisites for this skill
    const prereqIds = dependencies
      .filter(d => d.skillId === ps.canonicalId)
      .map(d => d.prerequisiteSkillId);

    const uncompletedPrereqs = prereqIds.filter(prereqId => {
      const pVer = verifications.find(v => v.skillId === prereqId);
      const pStatus = pVer ? pVer.verificationStatus : 'UNVERIFIED';
      return pStatus !== 'VERIFIED' && pStatus !== 'STRONG';
    });

    if (uncompletedPrereqs.length > 0 && skillState !== 'MAINTENANCE' && skillState !== 'STRONG') {
      skillState = 'BLOCKED';
    }

    return {
      skillId: ps.canonicalId,
      name: ps.displayName,
      priority: ps.priority,
      verificationStatus,
      confidence,
      skillState,
      prerequisites: prereqIds,
      uncompletedPrereqs
    };
  });

  // If all skills are VERIFIED or STRONG, roadmap is completed!
  const allVerified = skillStates.every(s => s.skillState === 'MAINTENANCE' || s.skillState === 'STRONG');
  if (allVerified && skillStates.length > 0) {
    return {
      type: 'COMPLETED',
      title: 'Roadmap completed'
    };
  }

  // Filter to find unblocked, uncompleted skills
  const candidates = [];

  skillStates.forEach(s => {
    // Skip if verified / strong / maintenance
    if (s.skillState === 'MAINTENANCE' || s.skillState === 'STRONG') {
      return;
    }
    // Skip if blocked
    if (s.skillState === 'BLOCKED') {
      return;
    }

    // Generate immediate next action candidate for this skill
    const skillMissions = missions.filter(m => m.skillId === s.skillId && m.status !== 'skipped');
    const incompleteMission = skillMissions.find(m => ['not_started', 'in_progress'].includes(m.status));

    if (incompleteMission) {
      candidates.push({
        type: 'MISSION',
        id: incompleteMission._id,
        title: incompleteMission.title,
        skillId: s.skillId,
        skill: s.name,
        priority: incompleteMission.priority,
        estimatedMinutes: incompleteMission.estimatedMinutes,
        reason: `Complete mission "${incompleteMission.title}" to build skills in ${s.name}.`,
        unlocks: getUnlocks(s.skillId, skillStates),
        skillState: s
      });
      return;
    }

    // Missions are complete, check projects
    const skillProjects = projects.filter(p => p.skillIds.includes(s.skillId) && p.selectionStatus === 'active');
    const incompleteProject = skillProjects.find(p => ['not_started', 'in_progress'].includes(p.status));

    if (incompleteProject) {
      candidates.push({
        type: 'PROJECT',
        id: incompleteProject._id,
        title: incompleteProject.title,
        skillId: s.skillId,
        skillIds: incompleteProject.skillIds,
        skill: s.name,
        priority: incompleteProject.priority,
        estimatedMinutes: incompleteProject.estimatedMinutes,
        progress: incompleteProject.status === 'in_progress' ? 50 : 0,
        reason: `Build project "${incompleteProject.title}" to apply your ${s.name} knowledge.`,
        unlocks: getUnlocks(s.skillId, skillStates),
        skillState: s
      });
      return;
    }

    // Projects are complete, check evidence
    const completedProjectNeedsEvidence = skillProjects.find(p => 
      ['completed', 'submitted', 'under_review'].includes(p.status) &&
      !evidenceList.some(e => e.projectId.toString() === p._id.toString() && ['accepted', 'verified'].includes(e.verificationStatus))
    );

    if (completedProjectNeedsEvidence) {
      candidates.push({
        type: 'EVIDENCE',
        projectId: completedProjectNeedsEvidence._id,
        title: `Submit Evidence for ${completedProjectNeedsEvidence.title}`,
        skillId: s.skillId,
        skill: s.name,
        priority: completedProjectNeedsEvidence.priority,
        estimatedMinutes: 15,
        requiredEvidence: completedProjectNeedsEvidence.evidenceRequirements && completedProjectNeedsEvidence.evidenceRequirements.length > 0
          ? completedProjectNeedsEvidence.evidenceRequirements 
          : ['GitHub repository'],
        reason: `Submit evidence for your completed project to verify your ${s.name} skills.`,
        unlocks: getUnlocks(s.skillId, skillStates),
        skillState: s
      });
      return;
    }

    // Check assessments
    const hasPassedAttempt = attempts.some(a => 
      assessments.some(as => as._id.toString() === a.assessmentId.toString() && as.skillIds.includes(s.skillId)) &&
      a.score >= 75
    );

    if (!hasPassedAttempt) {
      const existingAssessment = assessments.find(as => as.skillIds.includes(s.skillId) && as.selectionStatus === 'active');
      if (existingAssessment) {
        candidates.push({
          type: 'ASSESSMENT',
          action: 'TAKE_ASSESSMENT',
          assessmentId: existingAssessment._id,
          generated: true,
          available: true,
          skillId: s.skillId,
          skill: s.name,
          priority: s.priority,
          estimatedMinutes: existingAssessment.estimatedMinutes,
          reason: `Pass the assessment checkpoint for ${s.name} to verify your knowledge.`,
          unlocks: getUnlocks(s.skillId, skillStates),
          skillState: s
        });
      } else {
        candidates.push({
          type: 'ASSESSMENT',
          action: 'TAKE_ASSESSMENT',
          assessmentId: null,
          generated: false,
          available: true,
          skillId: s.skillId,
          skill: s.name,
          priority: s.priority,
          estimatedMinutes: 30,
          reason: `Generate and complete the assessment for ${s.name} to unlock verification.`,
          unlocks: getUnlocks(s.skillId, skillStates),
          skillState: s
        });
      }
      return;
    }

    // Otherwise, needs review
    candidates.push({
      type: 'REVIEW',
      title: `Review ${s.name} Status`,
      skillId: s.skillId,
      skill: s.name,
      priority: s.priority,
      estimatedMinutes: 10,
      reason: `Review status and requirements for ${s.name}.`,
      unlocks: getUnlocks(s.skillId, skillStates),
      skillState: s
    });
  });

  if (candidates.length === 0) {
    return {
      type: 'REVIEW',
      title: 'No active tasks',
      reason: 'No active next actions could be determined.'
    };
  }

  // Rank the candidates
  const ranked = candidates.map(c => {
    let rank = 9;

    // Check if the skill is a prerequisite of a CRITICAL skill
    const isPrereqOfCritical = skillStates.some(os => 
      os.priority === 'CRITICAL' && 
      os.prerequisites.includes(c.skillId)
    );
    // Check if the skill is a prerequisite of a HIGH skill
    const isPrereqOfHigh = skillStates.some(os => 
      os.priority === 'HIGH' && 
      os.prerequisites.includes(c.skillId)
    );

    if (isPrereqOfCritical) {
      rank = 1;
    } else if (isPrereqOfHigh) {
      rank = 2;
    } else if (c.type === 'MISSION' && c.skillState.priority === 'CRITICAL') {
      rank = 3;
    } else if (c.type === 'MISSION' && c.skillState.priority === 'HIGH') {
      rank = 4;
    } else if (c.type === 'PROJECT') {
      rank = 5;
    } else if (c.type === 'EVIDENCE') {
      rank = 6;
    } else if (c.type === 'ASSESSMENT') {
      rank = 7;
    } else if (c.type === 'REVIEW') {
      rank = 8;
    }

    return {
      candidate: c,
      rank,
      priorityValue: { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4 }[c.skillState.priority] || 4,
      topoIdx: roadmapDoc.prioritizedSkills.findIndex(ps => ps.canonicalId === c.skillId)
    };
  });

  // Sort: rank asc, priorityValue asc, topoIdx asc
  ranked.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    if (a.priorityValue !== b.priorityValue) return a.priorityValue - b.priorityValue;
    return a.topoIdx - b.topoIdx;
  });

  const chosen = ranked[0].candidate;
  const resultAction = {
    type: chosen.type,
    title: chosen.title,
    skillId: chosen.skillId,
    skill: chosen.skill,
    priority: chosen.priority,
    estimatedMinutes: chosen.estimatedMinutes,
    reason: chosen.reason,
    unlocks: chosen.unlocks
  };

  if (chosen.id) resultAction.id = chosen.id;
  if (chosen.projectId) resultAction.projectId = chosen.projectId;
  if (chosen.assessmentId !== undefined) resultAction.assessmentId = chosen.assessmentId;
  if (chosen.action) resultAction.action = chosen.action;
  if (chosen.available !== undefined) resultAction.available = chosen.available;
  if (chosen.generated !== undefined) resultAction.generated = chosen.generated;
  if (chosen.progress !== undefined) resultAction.progress = chosen.progress;
  if (chosen.requiredEvidence) resultAction.requiredEvidence = chosen.requiredEvidence;

  return resultAction;
};

/**
 * Returns deterministic next action selector
 */
export const getNextActionSelector = async (roadmapId, userId) => {
  const roadmapDoc = await Roadmap.findById(roadmapId);
  if (!roadmapDoc) {
    return null;
  }
  if (roadmapDoc.userId.trim().toLowerCase() !== userId.trim().toLowerCase()) {
    throw new Error('Unauthorized user access.');
  }

  const [missions, projects, assessments, attempts, evidenceList, verifications, dependencies] = await Promise.all([
    Mission.find({ roadmapId: roadmapDoc._id }),
    Project.find({ roadmapId: roadmapDoc._id }),
    Assessment.find({ roadmapId: roadmapDoc._id }),
    AssessmentAttempt.find({ roadmapId: roadmapDoc._id }),
    Evidence.find({ roadmapId: roadmapDoc._id }),
    SkillVerification.find({ userId: roadmapDoc.userId, roadmapId: roadmapDoc._id }),
    SkillDependency.find({
      skillId: { $in: roadmapDoc.prioritizedSkills.map(ps => ps.canonicalId) }
    })
  ]);

  return getNextActionFromLoadedData({
    roadmapDoc,
    missions,
    projects,
    assessments,
    attempts,
    evidenceList,
    verifications,
    dependencies
  });
};

/**
 * Returns the fully aggregated career roadmap experience details DTO (Front-end ready)
 */
export const getRoadmapExperience = async (roadmapId, userId) => {
  const roadmapDoc = await Roadmap.findById(roadmapId);
  if (!roadmapDoc) {
    throw new Error('Roadmap not found.');
  }
  if (roadmapDoc.userId.trim().toLowerCase() !== userId.trim().toLowerCase()) {
    throw new Error('Unauthorized user access.');
  }

  // Load related documents in parallel (no N+1 queries)
  const [missions, projects, assessments, attempts, evidenceList, verifications, snapshots, dependencies] = await Promise.all([
    Mission.find({ roadmapId: roadmapDoc._id }),
    Project.find({ roadmapId: roadmapDoc._id }),
    Assessment.find({ roadmapId: roadmapDoc._id }),
    AssessmentAttempt.find({ roadmapId: roadmapDoc._id }),
    Evidence.find({ roadmapId: roadmapDoc._id }),
    SkillVerification.find({ userId: roadmapDoc.userId, roadmapId: roadmapDoc._id }),
    RoadmapSnapshot.find({ roadmapId: roadmapDoc._id }).sort({ version: -1 }),
    SkillDependency.find({
      skillId: { $in: roadmapDoc.prioritizedSkills.map(ps => ps.canonicalId) }
    })
  ]);

  // Compute Skill Node States
  const skillStates = roadmapDoc.prioritizedSkills.map(ps => {
    const ver = verifications.find(v => v.skillId === ps.canonicalId);
    const confidence = ver ? ver.confidenceScore : 0;
    const verificationStatus = ver ? ver.verificationStatus : 'UNVERIFIED';

    let skillState = 'NOT_STARTED';
    if (verificationStatus === 'VERIFIED') {
      skillState = 'MAINTENANCE';
    } else if (verificationStatus === 'STRONG') {
      skillState = 'STRONG';
    } else if (verificationStatus === 'DEMONSTRATED') {
      skillState = 'DEMONSTRATED';
    } else if (verificationStatus === 'DEVELOPING') {
      skillState = 'DEVELOPING';
    } else {
      const skillMissions = missions.filter(m => m.skillId === ps.canonicalId);
      const isAnyCompleted = skillMissions.some(m => ['completed', 'verified'].includes(m.status));
      if (isAnyCompleted) {
        skillState = 'LEARNING';
      }
    }

    const prereqIds = dependencies
      .filter(d => d.skillId === ps.canonicalId)
      .map(d => d.prerequisiteSkillId);

    const uncompletedPrereqs = prereqIds.filter(prereqId => {
      const pVer = verifications.find(v => v.skillId === prereqId);
      const pStatus = pVer ? pVer.verificationStatus : 'UNVERIFIED';
      return pStatus !== 'VERIFIED' && pStatus !== 'STRONG';
    });

    if (uncompletedPrereqs.length > 0 && skillState !== 'MAINTENANCE' && skillState !== 'STRONG') {
      skillState = 'BLOCKED';
    }

    return {
      skillId: ps.canonicalId,
      name: ps.displayName,
      state: skillState,
      confidence,
      priority: ps.priority,
      blockedBy: uncompletedPrereqs.map(pId => {
        const pVer = verifications.find(v => v.skillId === pId);
        return {
          skillId: pId,
          requiredStatus: 'STRONG',
          currentStatus: pVer ? pVer.verificationStatus : 'UNVERIFIED'
        };
      })
    };
  });

  // Calculate deterministic next best action
  const nextAction = getNextActionFromLoadedData({
    roadmapDoc,
    missions,
    projects,
    assessments,
    attempts,
    evidenceList,
    verifications,
    dependencies
  });

  // Calculate Gamification/Progress stats
  const totalMissionsCount = missions.filter(m => m.status !== 'skipped').length;
  const completedMissionsCount = missions.filter(m => ['completed', 'verified'].includes(m.status)).length;
  const totalProjectsCount = projects.filter(p => p.selectionStatus === 'active' && p.status !== 'skipped').length;
  const completedProjectsCount = projects.filter(p => p.selectionStatus === 'active' && ['completed', 'verified'].includes(p.status)).length;
  const passedAssessmentsCount = verifications.filter(v => v.bestAssessmentScore >= 75).length;
  const verifiedSkillsCount = skillStates.filter(s => s.state === 'MAINTENANCE' || s.state === 'STRONG').length;

  const xpEarned = missions
    .filter(m => ['completed', 'verified'].includes(m.status))
    .reduce((sum, m) => sum + (m.xp || 0), 0);

  const xpAvailable = missions
    .filter(m => m.status !== 'skipped')
    .reduce((sum, m) => sum + (m.xp || 0), 0);

  // Reconstruct completion percentage using the same formula as Module 13
  const totalRoadmapSkills = skillStates.length;
  const skillsPercentage = totalRoadmapSkills > 0 ? (verifiedSkillsCount / totalRoadmapSkills) * 100 : 0;
  const missionsPercentage = totalMissionsCount > 0 ? (completedMissionsCount / totalMissionsCount) * 100 : 0;
  const projectsPercentage = totalProjectsCount > 0 ? (completedProjectsCount / totalProjectsCount) * 100 : 0;

  const totalRequiredAssessments = skillStates.filter(s => s.state !== 'MAINTENANCE').length;
  const assessmentsPercentage = totalRequiredAssessments > 0 ? (passedAssessmentsCount / totalRequiredAssessments) * 100 : 0;

  const completionPercentage = totalRoadmapSkills > 0 ? Math.round(
    skillsPercentage * 0.40 +
    missionsPercentage * 0.20 +
    projectsPercentage * 0.25 +
    assessmentsPercentage * 0.15
  ) : 0;

  // Time / Deadline Experience (reused from roadmap & time planning logic)
  const interviewDate = roadmapDoc.deadline;
  let daysRemaining = 84;
  let hasTargetDate = false;
  if (interviewDate) {
    const diffMs = new Date(interviewDate).getTime() - Date.now();
    daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    hasTargetDate = true;
  }
  const hoursPerWeek = roadmapDoc.availability?.hoursPerWeek || 10;
  const availableHours = Math.round((daysRemaining / 7) * hoursPerWeek);

  let planningMode = 'NORMAL';
  if (hasTargetDate) {
    if (daysRemaining < 3) {
      planningMode = 'FINAL_REVIEW';
    } else if (daysRemaining < 14) {
      planningMode = 'INTERVIEW_SPRINT';
    }
  }

  // Current Phase
  let activePhaseId = roadmapDoc.activePhase || '';
  const resolvedPhases = (roadmapDoc.phases || []).map((phase, pIdx) => {
    const phaseSkills = phase.skills.map(s => s.canonicalId);
    const totalPhaseSkills = phaseSkills.length;
    const completedPhaseSkills = skillStates.filter(s => phaseSkills.includes(s.skillId) && (s.state === 'MAINTENANCE' || s.state === 'STRONG')).length;
    const progress = totalPhaseSkills > 0 ? Math.round((completedPhaseSkills / totalPhaseSkills) * 100) : 100;

    let status = 'NOT_STARTED';
    if (progress === 100) {
      status = 'COMPLETED';
    } else if (progress > 0 || pIdx === 0 || activePhaseId === phase.phaseId) {
      status = 'IN_PROGRESS';
      if (!activePhaseId) activePhaseId = phase.phaseId;
    } else {
      status = 'LOCKED';
    }

    const phaseMissions = missions.filter(m => phaseSkills.includes(m.skillId) && m.status !== 'skipped');
    const phaseProjects = projects.filter(p => p.skillIds.some(sid => phaseSkills.includes(sid)) && p.selectionStatus === 'active');

    const estimatedMinutes = phaseMissions.reduce((acc, m) => acc + (m.estimatedMinutes || 30), 0) +
                             phaseProjects.reduce((acc, p) => acc + (p.estimatedMinutes || 60), 0);

    const completedMinutes = phaseMissions.filter(m => ['completed', 'verified'].includes(m.status)).reduce((acc, m) => acc + (m.estimatedMinutes || 30), 0) +
                             phaseProjects.filter(p => ['completed', 'verified'].includes(p.status)).reduce((acc, p) => acc + (p.estimatedMinutes || 60), 0);

    return {
      id: phase.phaseId,
      title: phase.title,
      description: phase.description || '',
      status,
      progress,
      estimatedMinutes,
      completedMinutes,
      skills: phase.skills.map(s => {
        const matchingState = skillStates.find(ss => ss.skillId === s.canonicalId);
        return {
          canonicalId: s.canonicalId,
          displayName: s.displayName,
          proficiencyLevel: s.proficiencyLevel,
          priority: s.priority,
          state: matchingState ? matchingState.state : 'NOT_STARTED'
        };
      })
    };
  });

  const activePhaseObj = resolvedPhases.find(p => p.id === activePhaseId) || resolvedPhases[0] || {};
  const currentPhase = {
    id: activePhaseObj.id || '',
    title: activePhaseObj.title || 'Foundations',
    description: activePhaseObj.description || '',
    status: activePhaseObj.status || 'IN_PROGRESS',
    progress: activePhaseObj.progress || 0,
    estimatedMinutes: activePhaseObj.estimatedMinutes || 0,
    completedMinutes: activePhaseObj.completedMinutes || 0
  };

  // Adaptation Summary (Module 13 summary/diff)
  const adaptation = roadmapDoc.adaptationSummary || {
    summary: 'Roadmap initialized.',
    completed: [],
    reprioritized: [],
    deprioritized: [],
    newFocus: []
  };

  // Version History list
  const versions = [
    {
      version: roadmapDoc.version,
      reason: roadmapDoc.recalculationReason || 'Current active roadmap version',
      createdAt: roadmapDoc.recalculatedAt || roadmapDoc.updatedAt,
      summary: roadmapDoc.adaptationSummary || null,
      isActive: true
    },
    ...snapshots.map(s => ({
      version: s.version,
      reason: s.recalculationReason || 'Roadmap adapted due to progress updates',
      createdAt: s.createdAt,
      summary: s.adaptationSummary || null,
      isActive: false
    }))
  ];

  return {
    roadmap: {
      id: roadmapDoc._id,
      version: roadmapDoc.version,
      targetRole: roadmapDoc.targetRole,
      company: roadmapDoc.company,
      interviewDate: roadmapDoc.deadline,
      roadmapState: roadmapDoc.roadmapState,
      activePhase: activePhaseId,
      planningMode
    },
    progress: {
      percentage: completionPercentage,
      xpEarned,
      xpAvailable,
      skillsVerified: verifiedSkillsCount,
      missionsCompleted: completedMissionsCount,
      projectsCompleted: completedProjectsCount,
      assessmentsPassed: passedAssessmentsCount
    },
    timePlan: {
      daysRemaining,
      availableHours,
      requiredHours: availableHours,
      planningMode,
      timePressure: planningMode === 'FINAL_REVIEW' ? 'CRITICAL' : (planningMode === 'INTERVIEW_SPRINT' ? 'HIGH' : 'NORMAL'),
      warning: planningMode !== 'NORMAL' ? 'Focus on critical path skills' : ''
    },
    currentPhase,
    nextAction,
    phases: resolvedPhases,
    skills: skillStates,
    missions: missions.map(m => ({
      id: m._id,
      skillId: m.skillId,
      title: m.title,
      description: m.description,
      type: m.type,
      difficulty: m.difficulty,
      estimatedMinutes: m.estimatedMinutes,
      xp: m.xp,
      priority: m.priority,
      status: m.status,
      prerequisites: m.prerequisites,
      order: m.order,
      expectedOutcome: m.expectedOutcome || ''
    })),
    projects: projects.map(p => ({
      id: p._id,
      skillIds: p.skillIds,
      title: p.title,
      description: p.description,
      difficulty: p.difficulty,
      type: p.type,
      estimatedMinutes: p.estimatedMinutes,
      priority: p.priority,
      status: p.status,
      milestones: p.milestones || [],
      deliverables: p.deliverables || [],
      evidenceRequirements: p.evidenceRequirements || []
    })),
    assessments: assessments.map(a => ({
      id: a._id,
      skillIds: a.skillIds,
      title: a.title,
      description: a.description,
      type: a.type,
      difficulty: a.difficulty,
      estimatedMinutes: a.estimatedMinutes,
      status: a.status
    })),
    evidence: evidenceList.map(e => ({
      id: e._id,
      projectId: e.projectId,
      skillIds: e.skillIds,
      type: e.type,
      title: e.title,
      url: e.url,
      verificationStatus: e.verificationStatus,
      submittedAt: e.submittedAt
    })),
    adaptation,
    versions
  };
};
