import Roadmap from '../../models/roadmap.model.js';
import RoadmapSnapshot from '../../models/roadmapSnapshot.model.js';
import Mission from '../../models/mission.model.js';
import Project from '../../models/project.model.js';
import AssessmentAttempt from '../../models/assessmentAttempt.model.js';
import Evidence from '../../models/evidence.model.js';
import SkillVerification from '../../models/skillVerification.model.js';
import { getRoleAndCompanyIntelligence } from './intelligence.service.js';
import { calculateSkillGaps } from './gap.service.js';
import { topologicalSortSkills } from './dependency.service.js';
import { calculateSkillPriorities } from './priority.service.js';
import { calculateTimePlanning } from './time.service.js';
import { recalculateRoadmapVerifications } from './verification.service.js';
import mongoose from 'mongoose';

const LEVEL_VALUES = {
  none: 0,
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4
};

const getLevelFromVerification = (status, requiredLevel) => {
  if (status === 'VERIFIED') return requiredLevel;
  if (status === 'STRONG') {
    if (requiredLevel === 'advanced') return 'intermediate';
    if (requiredLevel === 'expert') return 'advanced';
    return requiredLevel;
  }
  if (status === 'DEMONSTRATED') return 'intermediate';
  if (status === 'DEVELOPING') return 'beginner';
  return 'none';
};

/**
 * Recalculates the roadmap state adaptively.
 */
export const recalculateRoadmapState = async (roadmapId, options = {}) => {
  if (!mongoose.Types.ObjectId.isValid(roadmapId)) {
    throw new Error('Invalid roadmap ID.');
  }

  // 1. Load active roadmap
  const roadmapDoc = await Roadmap.findById(roadmapId);
  if (!roadmapDoc) {
    throw new Error('Roadmap not found.');
  }

  // 2. Validate user ownership
  if (options.userEmail && roadmapDoc.userId !== options.userEmail.trim().toLowerCase()) {
    throw new Error('Unauthorized user access.');
  }

  const userId = roadmapDoc.userId;

  // 3. Handle Target Role / Company change
  if (options.targetRole && options.targetRole.trim().toLowerCase() !== roadmapDoc.targetRole.trim().toLowerCase()) {
    return {
      requiresRegeneration: true,
      reason: 'target_role_changed'
    };
  }

  // Update target company if specified and changed
  let companyChanged = false;
  if (options.company !== undefined && options.company !== roadmapDoc.company) {
    roadmapDoc.company = options.company || '';
    companyChanged = true;
  }

  // Handle deadline or availability change from options
  if (options.interviewDate !== undefined || options.deadlineDate !== undefined) {
    roadmapDoc.deadline = options.interviewDate ? new Date(options.interviewDate) : (options.deadlineDate ? new Date(options.deadlineDate) : null);
  }
  if (options.hoursPerWeek !== undefined) {
    roadmapDoc.availability = {
      hoursPerWeek: Number(options.hoursPerWeek) || 10
    };
  }

  // Load old verification records before recalculating to calculate the diff accurately
  const oldVerifications = await SkillVerification.find({ userId, roadmapId: roadmapDoc._id });

  // 4. Recalculate skill verification statuses
  await recalculateRoadmapVerifications(userId, roadmapDoc._id);
  const verifications = await SkillVerification.find({ userId, roadmapId: roadmapDoc._id });

  // 5. Fetch existing missions, projects, assessments, and evidence
  const [missions, projects, attempts, evidenceList] = await Promise.all([
    Mission.find({ roadmapId: roadmapDoc._id }),
    Project.find({ roadmapId: roadmapDoc._id }),
    AssessmentAttempt.find({ roadmapId: roadmapDoc._id }),
    Evidence.find({ roadmapId: roadmapDoc._id })
  ]);

  // 6. Reconstruct user's effective proficiency levels
  // Use options.profile if provided as baseline, otherwise rebuild from roadmap prioritized skills
  let baseUserProfile = { skills: [] };
  if (options.profile && Array.isArray(options.profile.skills)) {
    baseUserProfile.skills = options.profile.skills.map(s => {
      const name = typeof s === 'object' && s !== null ? s.name : s;
      let level = typeof s === 'object' && s !== null ? s.level : 'beginner';
      level = level ? String(level).toLowerCase().trim() : 'beginner';
      return { canonicalId: name.toLowerCase().replace(/\s+/g, '-'), displayName: name, level };
    });
  } else {
    baseUserProfile.skills = roadmapDoc.prioritizedSkills.map(ps => ({
      canonicalId: ps.canonicalId,
      displayName: ps.displayName,
      level: 'none'
    }));
  }

  // Overlay skill verification metrics onto effective proficiency
  verifications.forEach(ver => {
    const ps = roadmapDoc.prioritizedSkills.find(p => p.canonicalId === ver.skillId);
    const requiredType = ps ? ps.requirementType : 'required';
    const requiredLevel = requiredType === 'required' ? 'advanced' : 'intermediate';
    const upgradedLevel = getLevelFromVerification(ver.verificationStatus, requiredLevel);

    const match = baseUserProfile.skills.find(s => s.canonicalId === ver.skillId);
    if (match) {
      const currentVal = LEVEL_VALUES[match.level] || 0;
      const upgradedVal = LEVEL_VALUES[upgradedLevel] || 0;
      if (upgradedVal > currentVal) {
        match.level = upgradedLevel;
      }
    } else {
      baseUserProfile.skills.push({
        canonicalId: ver.skillId,
        displayName: ps ? ps.displayName : ver.skillId,
        level: upgradedLevel
      });
    }
  });

  // 7. Recalculate Gaps
  const intelligence = await getRoleAndCompanyIntelligence({
    company: roadmapDoc.company,
    targetRole: roadmapDoc.targetRole,
    jobId: roadmapDoc.jobId
  });

  const gaps = calculateSkillGaps(baseUserProfile, intelligence.role, intelligence.company);

  // 8. Sort Gaps topologically
  const sortedGaps = await topologicalSortSkills(gaps);

  // 9. Compute Priority Scores
  const prioritizedGaps = calculateSkillPriorities(sortedGaps);

  // 10. Time Adaptation
  const timePlan = calculateTimePlanning({
    interviewDate: roadmapDoc.deadline,
    hoursPerWeek: roadmapDoc.availability.hoursPerWeek,
    prioritizedGaps: prioritizedGaps
  });

  // 11. Maintenance state assignment
  const currentSkillStates = prioritizedGaps.map(g => {
    const ver = verifications.find(v => v.skillId === g.skill.canonicalId);
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
      // Check if any missions or projects have been completed
      const skillMissions = missions.filter(m => m.skillId === g.skill.canonicalId);
      const isAnyCompleted = skillMissions.some(m => m.status === 'completed' || m.status === 'verified');
      if (isAnyCompleted) {
        skillState = 'LEARNING';
      }
    }

    // Dependency block checking
    const uncompletedPrereqs = (g.skill.prerequisites || []).filter(prereqId => {
      const pVer = verifications.find(v => v.skillId === prereqId);
      const pStatus = pVer ? pVer.verificationStatus : 'UNVERIFIED';
      return pStatus !== 'VERIFIED' && pStatus !== 'STRONG';
    });

    if (uncompletedPrereqs.length > 0 && skillState !== 'MAINTENANCE' && skillState !== 'STRONG') {
      skillState = 'BLOCKED';
    }

    return {
      skillId: g.skill.canonicalId,
      displayName: g.skill.displayName,
      requiredLevel: g.requiredLevel,
      currentLevel: g.currentLevel,
      confidence,
      verificationStatus,
      gap: g.gap,
      priority: g.priority,
      skillState
    };
  });

  // Re-build Phases
  const inScopeGaps = timePlan.inScopeSkills.filter(g => g.gap);
  
  const phase1Skills = [];
  const phase2Skills = [];
  const phase3Skills = [];

  inScopeGaps.forEach((g, idx) => {
    const fraction = idx / inScopeGaps.length;
    const skillData = {
      canonicalId: g.skill.canonicalId,
      displayName: g.skill.displayName,
      proficiencyLevel: g.requiredLevel,
      priority: g.priority
    };

    if (fraction < 0.33) {
      phase1Skills.push(skillData);
    } else if (fraction < 0.66) {
      phase2Skills.push(skillData);
    } else {
      phase3Skills.push(skillData);
    }
  });

  const phases = [];
  if (phase1Skills.length > 0) {
    phases.push({
      phaseId: 'phase-1-foundations',
      title: 'Phase 1: Foundational Prerequisites',
      description: 'Acquire early prerequisite and core foundational skills needed for this path.',
      estimatedHours: phase1Skills.reduce((acc, s) => acc + 15, 0),
      skills: phase1Skills
    });
  }

  if (phase2Skills.length > 0) {
    phases.push({
      phaseId: 'phase-2-core',
      title: 'Phase 2: Core Subject Proficiency',
      description: 'Strengthen essential skills and core technologies specifically requested for the target role.',
      estimatedHours: phase2Skills.reduce((acc, s) => acc + 25, 0),
      skills: phase2Skills
    });
  }

  if (phase3Skills.length > 0) {
    phases.push({
      phaseId: 'phase-3-advanced',
      title: 'Phase 3: Advanced Topics & Integration',
      description: 'Master advanced applications, auxiliary tools, and architectural frameworks.',
      estimatedHours: phase3Skills.reduce((acc, s) => acc + 35, 0),
      skills: phase3Skills
    });
  }

  // Phase 4 Capstone & Maintenance Review
  const masteredSkills = timePlan.inScopeSkills.filter(g => !g.gap || currentSkillStates.find(css => css.skillId === g.skill.canonicalId && css.skillState === 'MAINTENANCE')).map(g => ({
    canonicalId: g.skill.canonicalId,
    displayName: g.skill.displayName,
    proficiencyLevel: g.currentLevel,
    priority: 'LOW'
  }));

  if (masteredSkills.length > 0) {
    phases.push({
      phaseId: 'phase-4-review',
      title: 'Phase 4: Capstone & Maintenance Review',
      description: 'Maintain proficiency in skills you already satisfy and apply them in projects.',
      estimatedHours: masteredSkills.reduce((acc, s) => acc + 5, 0),
      skills: masteredSkills
    });
  }

  // 12. Preserve completed work & adjust future incomplete work in database
  const activeSkillIds = new Set(prioritizedGaps.map(g => g.skill.canonicalId));
  const inScopeSkillIds = new Set(timePlan.inScopeSkills.map(g => g.skill.canonicalId));

  // Recalculate remaining workload estimates
  let remainingMissionsCount = 0;
  let remainingProjectsCount = 0;

  for (const mission of missions) {
    const isCompleted = ['completed', 'verified'].includes(mission.status);
    const css = currentSkillStates.find(c => c.skillId === mission.skillId);

    if (isCompleted || mission.status === 'in_progress') {
      continue;
    }

    // If skill is out of scope or obsolete
    if (!activeSkillIds.has(mission.skillId) || !inScopeSkillIds.has(mission.skillId) || (css && css.skillState === 'MAINTENANCE')) {
      mission.status = 'skipped';
      await mission.save();
    } else {
      // Update priority and ordering based on recalculated priority
      if (css) {
        mission.priority = css.priority;
      }
      remainingMissionsCount++;
      await mission.save();
    }
  }

  for (const project of projects) {
    const isCompleted = ['submitted', 'under_review', 'completed', 'verified'].includes(project.status);
    const hasActiveSkill = project.skillIds.some(sid => activeSkillIds.has(sid));
    const hasInScopeSkill = project.skillIds.some(sid => inScopeSkillIds.has(sid));
    const allSkillsMaintenance = project.skillIds.every(sid => {
      const css = currentSkillStates.find(c => c.skillId === sid);
      return css && css.skillState === 'MAINTENANCE';
    });

    if (isCompleted || project.status === 'in_progress') {
      continue;
    }

    if (!hasActiveSkill || !hasInScopeSkill || allSkillsMaintenance) {
      project.selectionStatus = 'excluded_by_time';
      await project.save();
    } else {
      project.selectionStatus = 'active';
      // Map priority to project
      const firstSkillCss = currentSkillStates.find(c => project.skillIds.includes(c.skillId));
      if (firstSkillCss) {
        project.priority = firstSkillCss.priority;
      }
      remainingProjectsCount++;
      await project.save();
    }
  }

  // 13. Determine completion percentage (centralized weights: skills = 40%, missions = 20%, projects = 25%, assessments = 15%)
  const totalRoadmapSkills = currentSkillStates.length;
  const verifiedSkillsCount = currentSkillStates.filter(c => c.skillState === 'MAINTENANCE' || c.skillState === 'STRONG').length;
  const skillsPercentage = totalRoadmapSkills > 0 ? (verifiedSkillsCount / totalRoadmapSkills) * 100 : 100;

  // Missions percentage (excluding skipped/obsolete)
  const eligibleMissions = missions.filter(m => m.status !== 'skipped');
  const completedMissions = eligibleMissions.filter(m => ['completed', 'verified'].includes(m.status));
  const missionsPercentage = eligibleMissions.length > 0 ? (completedMissions.length / eligibleMissions.length) * 100 : 100;

  // Projects percentage (excluding excluded/skipped)
  const eligibleProjects = projects.filter(p => p.selectionStatus === 'active' && p.status !== 'skipped');
  const completedProjects = eligibleProjects.filter(p => ['completed', 'verified'].includes(p.status));
  const projectsPercentage = eligibleProjects.length > 0 ? (completedProjects.length / eligibleProjects.length) * 100 : 100;

  // Assessments percentage
  const totalRequiredAssessments = currentSkillStates.filter(c => c.skillState !== 'MAINTENANCE').length;
  const passedAssessments = currentSkillStates.filter(c => c.confidence >= 70).length;
  const assessmentsPercentage = totalRequiredAssessments > 0 ? (passedAssessments / totalRequiredAssessments) * 100 : 100;

  const completionPercentage = Math.round(
    skillsPercentage * 0.40 +
    missionsPercentage * 0.20 +
    projectsPercentage * 0.25 +
    assessmentsPercentage * 0.15
  );

  const completed = completionPercentage >= 100;

  // Determine roadmapState
  let roadmapState = 'ACTIVE';
  if (completed) {
    roadmapState = 'COMPLETED';
  } else if (companyChanged) {
    roadmapState = 'TARGET_CHANGED';
  } else if (options.interviewDate || options.deadlineDate) {
    roadmapState = 'DEADLINE_CHANGED';
  } else if (timePlan.timeSprintWarning) {
    roadmapState = 'AT_RISK';
  }

  // 14. Generate deterministic roadmap diff
  const oldPrioritized = roadmapDoc.prioritizedSkills || [];
  const added = prioritizedGaps
    .filter(g => !oldPrioritized.some(op => op.canonicalId === g.skill.canonicalId))
    .map(g => g.skill.displayName);
  const removed = oldPrioritized
    .filter(op => !prioritizedGaps.some(g => g.skill.canonicalId === op.canonicalId))
    .map(op => op.displayName);

  const completedDiff = [];
  const reprioritized = [];
  const deprioritized = [];

  prioritizedGaps.forEach(g => {
    const oldPs = oldPrioritized.find(op => op.canonicalId === g.skill.canonicalId);
    if (!oldPs) return;

    // Check if transitioned to satisfied/maintenance
    const oldVer = oldVerifications.find(v => v.skillId === g.skill.canonicalId);
    const ver = verifications.find(v => v.skillId === g.skill.canonicalId);
    if (ver && ver.verificationStatus === 'VERIFIED' && (!oldVer || oldVer.verificationStatus !== 'VERIFIED')) {
      completedDiff.push(g.skill.displayName);
    }

    const priorityMap = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
    const oldVal = priorityMap[oldPs.priority] || 3;
    const newVal = priorityMap[g.priority] || 3;

    if (newVal < oldVal) {
      reprioritized.push({ skill: g.skill.displayName, from: oldPs.priority, to: g.priority });
    } else if (newVal > oldVal) {
      deprioritized.push({ skill: g.skill.displayName, from: oldPs.priority, to: g.priority });
    }
  });

  const roadmapDiff = {
    added,
    removed,
    completed: completedDiff,
    reprioritized,
    deprioritized
  };

  // Determine adaptation decision
  let decision = 'UNCHANGED';
  let reason = 'Roadmap recalculated successfully.';
  if (completed) {
    decision = 'ROADMAP_COMPLETED';
    reason = 'Congratulations! You have resolved all preparation gaps.';
  } else if (options.targetRole && options.targetRole !== roadmapDoc.targetRole) {
    decision = 'TARGET_CHANGED';
    reason = `Target role updated to ${options.targetRole}.`;
  } else if (options.interviewDate || options.deadlineDate) {
    decision = 'DEADLINE_CHANGED';
    reason = `Preparation deadline adjusted. Remaining timeline recalculated.`;
  } else if (completedDiff.length > 0) {
    decision = 'SKILL_COMPLETED';
    reason = `${completedDiff.join(', ')} verified successfully. Focus shifted.`;
  } else if (reprioritized.length > 0 || deprioritized.length > 0) {
    decision = 'REPRIORITIZED';
    reason = `Preparation priorities updated based on recent activity.`;
  } else if (companyChanged) {
    decision = 'TARGET_CHANGED';
    reason = `Target company updated to ${options.company}.`;
  }

  // 15. Create a concise adaptation summary for UI rendering
  const adaptationSummary = {
    summary: reason,
    completed: completedDiff,
    reprioritized: reprioritized.map(r => r.skill),
    deprioritized: deprioritized.map(d => d.skill),
    newFocus: prioritizedGaps.filter(g => g.priority === 'CRITICAL' || g.priority === 'HIGH').slice(0, 3).map(g => g.skill.displayName)
  };

  // Determine if changes are meaningful
  const isMeaningful = 
    decision !== 'UNCHANGED' ||
    added.length > 0 ||
    removed.length > 0 ||
    completedDiff.length > 0 ||
    reprioritized.length > 0 ||
    deprioritized.length > 0;

  // 16. Save snapshot & update version only if changes are meaningful
  if (isMeaningful && mongoose.connection.readyState === 1) {
    try {
      await RoadmapSnapshot.create({
        roadmapId: roadmapDoc._id,
        version: roadmapDoc.version,
        roadmapData: roadmapDoc.toObject(),
        recalculationReason: options.reason || reason,
        adaptationSummary: roadmapDoc.adaptationSummary || adaptationSummary
      });

      roadmapDoc.previousVersion = roadmapDoc.version.toString();
      roadmapDoc.version += 1;
      roadmapDoc.recalculatedAt = new Date();
      roadmapDoc.recalculationReason = options.reason || reason;
      roadmapDoc.adaptationSummary = adaptationSummary;
    } catch (err) {
      console.warn('[WARNING] Roadmap snapshot creation failed:', err.message);
    }
  }

  // Update active roadmap document values
  roadmapDoc.readinessScore = Math.round(skillsPercentage);
  roadmapDoc.phases = phases;
  roadmapDoc.prioritizedSkills = prioritizedGaps.map(g => ({
    canonicalId: g.skill.canonicalId,
    displayName: g.skill.displayName,
    priority: g.priority,
    requirementType: g.requirementType
  }));
  roadmapDoc.roadmapState = roadmapState;

  if (mongoose.connection.readyState === 1) {
    await roadmapDoc.save();
  }

  return {
    roadmap: roadmapDoc,
    version: roadmapDoc.version,
    adaptationSummary: roadmapDoc.adaptationSummary || adaptationSummary,
    roadmapDiff,
    currentSkillStates,
    activePlan: phases,
    timePlan: {
      daysRemaining: timePlan.daysRemaining,
      availableHours: timePlan.availableHours,
      totalRequiredHours: timePlan.totalRequiredHours,
      planningMode: timePlan.planningMode,
      timeSprintWarning: timePlan.timeSprintWarning,
      completed,
      completionPercentage
    }
  };
};
