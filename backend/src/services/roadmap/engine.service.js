import Roadmap from '../../models/roadmap.model.js';
import { getNormalizedUserProfile } from './profileAdapter.service.js';
import { getRoleAndCompanyIntelligence } from './intelligence.service.js';
import { calculateSkillGaps } from './gap.service.js';
import { topologicalSortSkills } from './dependency.service.js';
import { calculateSkillPriorities } from './priority.service.js';
import { calculateTimePlanning } from './time.service.js';
import mongoose from 'mongoose';

/**
 * Main coordinator function to generate and save an Adaptive Career Roadmap
 */
export const generateRoadmap = async (userId, rawProfile, targetRoleParams) => {
  const { company, targetRole, jobId, description, location, interviewDate, deadlineDate, hoursPerWeek } = targetRoleParams;

  // 1. Normalize the User Profile (Module 2)
  const normalizedProfile = await getNormalizedUserProfile(rawProfile);

  // 2. Extract Company & Target Role Intelligence (Module 1)
  const intelligence = await getRoleAndCompanyIntelligence({
    company,
    targetRole,
    jobId,
    description,
    location
  });

  // 3. Compute Deterministic Skill Gaps (Module 4)
  const gaps = calculateSkillGaps(normalizedProfile, intelligence.role, intelligence.company);

  // 4. Sort Gaps Topologically according to Prerequisites (Module 5)
  const sortedGaps = await topologicalSortSkills(gaps);

  // 5. Compute Priority Scores (Module 6)
  const prioritizedGaps = calculateSkillPriorities(sortedGaps);

  // 6. Apply Time Planning & Trimming (Module 7)
  const timePlan = calculateTimePlanning({
    interviewDate,
    deadlineDate,
    hoursPerWeek: hoursPerWeek || 10,
    prioritizedGaps: prioritizedGaps
  });

  // 7. Calculate overall readiness score (satisfied skills / total skills)
  const totalSkills = gaps.length;
  const satisfiedSkills = gaps.filter(g => !g.gap).length;
  const readinessScore = totalSkills > 0 ? Math.round((satisfiedSkills / totalSkills) * 100) : 0;

  // 8. Structure Gaps into 3 sequential preparation phases (Module 8)
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
      estimatedHours: phase1Skills.reduce((acc, s) => acc + 15, 0), // typical 15h prep estimate
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

  // Phase 4 for already mastered skills
  const masteredSkills = timePlan.inScopeSkills.filter(g => !g.gap).map(g => ({
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

  // 9. Structure final roadmap contract object
  const roadmapData = {
    userId,
    company: company || '',
    targetRole,
    jobId: jobId || null,
    deadline: interviewDate ? new Date(interviewDate) : (deadlineDate ? new Date(deadlineDate) : null),
    availability: {
      hoursPerWeek: hoursPerWeek || 10
    },
    readinessScore,
    phases,
    prioritizedSkills: prioritizedGaps.map(g => ({
      canonicalId: g.skill.canonicalId,
      displayName: g.skill.displayName,
      priority: g.priority,
      requirementType: g.requirementType
    })),
    version: 1
  };

  // 10. Save to MongoDB
  let savedRoadmap = null;
  if (mongoose.connection.readyState === 1) {
    try {
      savedRoadmap = await Roadmap.findOneAndUpdate(
        { userId, targetRole, company: company || '' },
        roadmapData,
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn('[WARNING] Failed to save Roadmap to MongoDB:', err.message);
    }
  }

  // Fallback to simple object representation if database is offline
  if (!savedRoadmap) {
    savedRoadmap = {
      _id: new mongoose.Types.ObjectId(),
      ...roadmapData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  return {
    roadmap: savedRoadmap,
    timePlanning: {
      daysRemaining: timePlan.daysRemaining,
      availableHours: timePlan.availableHours,
      totalRequiredHours: timePlan.totalRequiredHours,
      planningMode: timePlan.planningMode,
      timeSprintWarning: timePlan.timeSprintWarning
    },
    companyIntelligence: intelligence.company,
    roleIntelligence: intelligence.role
  };
};
