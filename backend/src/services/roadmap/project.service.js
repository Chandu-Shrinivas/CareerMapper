import Project from '../../models/project.model.js';
import ProjectTemplate from '../../models/projectTemplate.model.js';
import Roadmap from '../../models/roadmap.model.js';
import Mission from '../../models/mission.model.js';
import { generateJSON } from '../ai/aiGateway.js';
import { getNormalizedUserProfile } from './profileAdapter.service.js';
import { getRoleAndCompanyIntelligence } from './intelligence.service.js';
import { calculateSkillGaps } from './gap.service.js';
import { calculateSkillPriorities } from './priority.service.js';
import { calculateTimePlanning } from './time.service.js';
import { topologicalSortSkills } from './dependency.service.js';
import mongoose from 'mongoose';

const VALID_PROJECT_TYPES = [
  'practical_project', 'case_study', 'design_challenge', 'engineering_exercise',
  'analysis', 'simulation', 'portfolio_piece', 'presentation', 'research',
  'implementation', 'assessment_project'
];

/**
 * Returns a domain-specific fallback project template if AI is offline.
 */
const generateFallbackProject = (skills, targetRole, domain) => {
  const skillNames = skills.map(s => s.displayName).join(', ');
  const skillIds = skills.map(s => s.canonicalId);

  let fallbackType = 'Technical';
  if (domain === 'UI/UX' || domain === 'Design') fallbackType = 'Design';
  else if (domain === 'Finance' || domain === 'Marketing' || domain === 'HR' || domain === 'Operations') fallbackType = 'Business';
  else if (domain === 'Mechanical Engineering' || domain === 'Civil Engineering' || domain === 'Electrical Engineering') fallbackType = 'Engineering';

  switch (fallbackType) {
    case 'Design':
      return {
        title: `UX Usability & UI Redesign Challenge for ${skillNames}`,
        description: `Conduct user research and produce wireframes demonstrating ${skillNames} guidelines.`,
        type: 'design_challenge',
        estimatedMinutes: 240,
        objectives: [
          'Audit existing flow usability flaws',
          'Create wireframes mapping optimized flow layout',
          'Document design rationale and standards applied'
        ],
        instructions: [
          '1. Research target user personas and standard wireframing patterns.',
          '2. Mock up high-fidelity redesign screens using design tools.',
          '3. Package design files alongside usability audit documentation.'
        ],
        deliverables: [
          'Design files / prototype URL link',
          'Usability analysis report pdf'
        ],
        evaluationCriteria: [
          'Visual alignment, hierarchy, and consistency',
          'Clarity of UX recommendations'
        ],
        tools: ['Figma', 'Adobe XD', 'Sketch'],
        evidenceRequirements: ['Prototype link', 'Redesign case study report'],
        milestones: [
          { title: 'Usability Audit', description: 'Review existing visual layouts.' },
          { title: 'Wireframes Creation', description: 'Draw high fidelity screen redesign mockups.' },
          { title: 'Case Study Submission', description: 'Assemble design rationales.' }
        ]
      };
    case 'Business':
      return {
        title: `Business Case & Campaign Optimization for ${skillNames}`,
        description: `Formulate a data-driven business analysis model evaluating ${skillNames}.`,
        type: 'case_study',
        estimatedMinutes: 180,
        objectives: [
          'Aggregate performance metrics and calculate CTR/ROI ratios',
          'Determine bottleneck metrics and operational leaks',
          'Propose strategic recommendations slide deck'
        ],
        instructions: [
          '1. Retrieve performance dataset for target company / sector.',
          '2. Analyze CAC, CTR, or revenue trends in spreadsheets.',
          '3. Build a presentation detailing recommendations and action steps.'
        ],
        deliverables: [
          'Spreadsheet model calculation analysis',
          'Presentation deck slides'
        ],
        evaluationCriteria: [
          'Mathematical correctness of KPIs and trend estimates',
          'Feasibility of recommendations'
        ],
        tools: ['Excel', 'Google Slides', 'Tableau'],
        evidenceRequirements: ['Analysis spreadsheet link', 'Presentation slides'],
        milestones: [
          { title: 'Data aggregation', description: 'Clean and format campaign variables.' },
          { title: 'Spreadsheet formulas', description: 'Compute growth metrics and scenario outcomes.' },
          { title: 'Final presentation', description: 'Assemble executive summary.' }
        ]
      };
    case 'Engineering':
      return {
        title: `Mechanical/Structural Drawing Analysis for ${skillNames}`,
        description: `Interpret mechanical standards, GD&T, or structural codes on drawings for ${skillNames}.`,
        type: 'engineering_exercise',
        estimatedMinutes: 240,
        objectives: [
          'Verify datum references and tolerance stack-up compliance',
          'Formulate force load paths and stress calculations',
          'Draft standard engineering drawing annotations'
        ],
        instructions: [
          '1. Open standard drawing sample in engineering tools.',
          '2. Compute tolerance stacks or structural force equations.',
          '3. Document the calculations and annotations on the drawing files.'
        ],
        deliverables: [
          'Annotated drawing sheet / CAD file',
          'Calculations engineering report'
        ],
        evaluationCriteria: [
          'Adherence to ASME/ISO/IS engineering standards',
          'Mathematical accuracy of stress or tolerance equations'
        ],
        tools: ['SolidWorks', 'AutoCAD', 'Ansys'],
        evidenceRequirements: ['Annotated drawing file', 'Engineering report'],
        milestones: [
          { title: 'Initial load/datum review', description: 'Inspect drawing geometry.' },
          { title: 'Stress & stack calculations', description: 'Run engineering equations.' },
          { title: 'Final report assembly', description: 'Package drawing annotations.' }
        ]
      };
    default: // Technical/Software fallback
      return {
        title: `Practical Application Implementation of ${skillNames}`,
        description: `Implement a secure database, script, or REST API integrating ${skillNames}.`,
        type: 'practical_project',
        estimatedMinutes: 240,
        objectives: [
          'Set up local development execution environment',
          'Write modular code implementing core features of the skills',
          'Verify script runs error-free under multiple input parameters'
        ],
        instructions: [
          '1. Configure configuration files and project directories.',
          '2. Code the API routes, database connections, or scripts.',
          '3. Publish source code to Git repository and test execution.'
        ],
        deliverables: [
          'Git repository link with README documentation',
          'Local test results documentation / console prints'
        ],
        evaluationCriteria: [
          'Execution cleanliness and absence of syntax errors',
          'README clarity and instructions accuracy'
        ],
        tools: ['Git', 'VS Code', 'NodeJS/Python'],
        evidenceRequirements: ['GitHub repo URL', 'Local execution screenshots'],
        milestones: [
          { title: 'Project setup', description: 'Initialize repository directory.' },
          { title: 'Coding implementation', description: 'Write core logic.' },
          { title: 'Verification tests', description: 'Deploy and screenshot console execution.' }
        ]
      };
  }
};

/**
 * Validates and sanitizes projects returned by AI.
 */
const validateAndSanitizeProjects = (projectsList) => {
  if (!Array.isArray(projectsList)) return [];

  const validated = [];
  projectsList.forEach(p => {
    if (!p.title || !p.description) return;

    let type = String(p.type || 'practical_project').toLowerCase().trim();
    if (!VALID_PROJECT_TYPES.includes(type)) {
      type = 'practical_project';
    }

    const estimatedMinutes = parseInt(p.estimatedMinutes, 10);
    if (isNaN(estimatedMinutes) || estimatedMinutes <= 0) {
      return; // reject invalid duration
    }

    validated.push({
      title: p.title.trim().substring(0, 100),
      description: p.description.trim().substring(0, 500),
      type,
      estimatedMinutes,
      objectives: Array.isArray(p.objectives) ? p.objectives.map(o => String(o).trim()) : [],
      instructions: Array.isArray(p.instructions) ? p.instructions.map(i => String(i).trim()) : [],
      deliverables: Array.isArray(p.deliverables) ? p.deliverables.map(d => String(d).trim()) : [],
      evaluationCriteria: Array.isArray(p.evaluationCriteria) ? p.evaluationCriteria.map(e => String(e).trim()) : [],
      tools: Array.isArray(p.tools) ? p.tools.map(t => String(t).trim()) : [],
      evidenceRequirements: Array.isArray(p.evidenceRequirements) ? p.evidenceRequirements.map(e => String(e).trim()) : [],
      milestones: Array.isArray(p.milestones) ? p.milestones.map(m => ({
        title: String(m.title || m).trim(),
        description: String(m.description || '').trim()
      })) : []
    });
  });

  return validated;
};

/**
 * Main coordinator function to generate projects for a roadmap
 */
export const generateProjectsForRoadmap = async (roadmapId, rawProfile, refresh = false) => {
  // 1. Load Roadmap
  const roadmapDoc = await Roadmap.findById(roadmapId);
  if (!roadmapDoc) {
    throw new Error('Roadmap document not found.');
  }

  // 2. Load existing user projects if refresh is false
  if (!refresh) {
    const existing = await Project.find({ roadmapId }).sort({ order: 1 });
    if (existing.length > 0) {
      const activeMissions = await Mission.find({ roadmapId, status: { $ne: 'skipped' } });
      const totalMissionMin = activeMissions.reduce((acc, m) => acc + m.estimatedMinutes, 0);
      const availableMin = (roadmapDoc.availability?.hoursPerWeek || 10) * 12 * 60; // base minutes
      const remainingMin = Math.max(0, availableMin - totalMissionMin);

      const totalGenProjects = existing.reduce((acc, p) => acc + p.estimatedMinutes, 0);
      const totalActiveProjects = existing.filter(p => p.selectionStatus === 'active').reduce((acc, p) => acc + p.estimatedMinutes, 0);

      return {
        roadmapId: roadmapDoc._id,
        mode: 'NORMAL',
        availableMinutes: availableMin,
        totalMissionMinutes: totalMissionMin,
        remainingMinutesForProjects: remainingMin,
        totalGeneratedProjectMinutes: totalGenProjects,
        totalActiveProjectMinutes: totalActiveProjects,
        projects: existing
      };
    }
  }

  // 3. Re-run roadmap services to retrieve prioritized gaps
  const normalizedProfile = await getNormalizedUserProfile(rawProfile);
  const intelligence = await getRoleAndCompanyIntelligence({
    company: roadmapDoc.company,
    targetRole: roadmapDoc.targetRole,
    jobId: roadmapDoc.jobId
  });

  const gaps = calculateSkillGaps(normalizedProfile, intelligence.role, intelligence.company);
  const sortedGaps = await topologicalSortSkills(gaps);
  const prioritizedGaps = calculateSkillPriorities(sortedGaps);
  const timePlan = calculateTimePlanning({
    interviewDate: roadmapDoc.deadline,
    hoursPerWeek: roadmapDoc.availability?.hoursPerWeek || 10,
    prioritizedGaps
  });

  let inScopeGapsToLearn = timePlan.inScopeSkills.filter(g => g.gap);
  if (inScopeGapsToLearn.length === 0 && prioritizedGaps.some(g => g.gap)) {
    const topGap = prioritizedGaps.find(g => g.gap);
    if (topGap) {
      inScopeGapsToLearn = [topGap];
    }
  }

  if (inScopeGapsToLearn.length === 0) {
    return {
      roadmapId: roadmapDoc._id,
      mode: timePlan.planningMode,
      availableMinutes: timePlan.availableHours * 60,
      totalMissionMinutes: 0,
      remainingMinutesForProjects: timePlan.availableHours * 60,
      totalGeneratedProjectMinutes: 0,
      totalActiveProjectMinutes: 0,
      projects: []
    };
  }

  // Group skill canonical IDs alphabetically for deterministic cache compound lookup key
  const skillsToVerify = inScopeGapsToLearn.map(g => g.skill.canonicalId).sort();
  const primaryDomain = inScopeGapsToLearn[0]?.skill?.domain || 'Technology';

  // Determine difficulty base on required levels
  let difficulty = 'beginner';
  const hasAdvanced = inScopeGapsToLearn.some(g => g.requiredLevel === 'expert' || g.requiredLevel === 'advanced');
  const hasIntermediate = inScopeGapsToLearn.some(g => g.requiredLevel === 'intermediate');
  if (hasAdvanced) difficulty = 'advanced';
  else if (hasIntermediate) difficulty = 'intermediate';

  const cacheQuery = {
    skillIds: skillsToVerify,
    currentLevel: inScopeGapsToLearn[0]?.currentLevel || 'none',
    requiredLevel: inScopeGapsToLearn[0]?.requiredLevel || 'intermediate',
    domain: primaryDomain,
    targetRole: roadmapDoc.targetRole,
    company: roadmapDoc.company || '',
    roadmapMode: timePlan.planningMode
  };

  let template = null;
  if (!refresh && mongoose.connection.readyState === 1) {
    try {
      template = await ProjectTemplate.findOne(cacheQuery);
    } catch (err) {
      console.warn('[WARNING] Project cache query failed:', err.message);
    }
  }

  let rawProjects = [];
  let source = 'ai';

  if (template && template.projects && template.projects.length > 0) {
    console.log(`[PROJECT CACHE HIT] skills="${skillsToVerify.join(',')}" targetRole="${roadmapDoc.targetRole}"`);
    rawProjects = template.projects;
    source = 'ai';
  } else {
    console.log(`[PROJECT CACHE MISS] Generating projects via AI for skills="${skillsToVerify.join(',')}"`);
    const systemPrompt = `You are a domain-agnostic Career Coach and AI Project Builder.
Create exactly 1 or 2 comprehensive practical projects that verify the user's proficiency in these skills: '${skillsToVerify.join(', ')}' for target role '${roadmapDoc.targetRole}'.
Do NOT produce software/coding projects for non-software domains (e.g. use tolerance calculations for Mechanical, CTR/analytics reports for Marketing, wireframing prototypes for UI/UX, or revenue scenarios for Finance).
For each project, define: title, description, type (one of the enum list), estimatedMinutes, objectives, instructions, deliverables, evaluationCriteria, tools, and evidenceRequirements.

Respond strictly in JSON format matching this schema:
{
  "projects": [
    {
      "title": "Clean, descriptive project title",
      "description": "Why it matters and contextual value",
      "type": "practical_project | case_study | design_challenge | engineering_exercise | analysis | simulation | portfolio_piece | presentation | research | implementation | assessment_project",
      "estimatedMinutes": 240,
      "objectives": ["Objective 1", "Objective 2"],
      "instructions": ["Step 1", "Step 2"],
      "deliverables": ["Deliverable A", "Deliverable B"],
      "evaluationCriteria": ["Criteria A", "Criteria B"],
      "tools": ["Tool A", "Tool B"],
      "evidenceRequirements": ["Expected evidence URL type 1", "Expected evidence URL type 2"],
      "milestones": [
        { "title": "Milestone Title", "description": "Milestone description" }
      ]
    }
  ]
}
`;
    const prompt = `
Generate projects verifying these skills: ${skillsToVerify.join(', ')}
Target Role: ${roadmapDoc.targetRole}
Target Company: ${roadmapDoc.company || 'General'}
Primary Domain: ${primaryDomain}
Current User Level: ${inScopeGapsToLearn[0]?.currentLevel || 'none'}
Target Required Level: ${inScopeGapsToLearn[0]?.requiredLevel || 'intermediate'}
Available preparation timeline: ${timePlan.availableHours} hours.
`;
    try {
      const aiResponse = await generateJSON(prompt, systemPrompt);
      rawProjects = validateAndSanitizeProjects(aiResponse?.projects);
      source = 'ai';

      if (rawProjects.length > 0 && mongoose.connection.readyState === 1) {
        await ProjectTemplate.findOneAndUpdate(
          cacheQuery,
          { ...cacheQuery, projects: rawProjects, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
          { upsert: true }
        );
      }
    } catch (err) {
      console.warn('[WARNING] AI Project generation failed. Falling back to local templates:', err.message);
      const fallback = generateFallbackProject(inScopeGapsToLearn.map(g => g.skill), roadmapDoc.targetRole, primaryDomain);
      rawProjects = [fallback];
      source = 'fallback';

      if (mongoose.connection.readyState === 1) {
        try {
          await ProjectTemplate.findOneAndUpdate(
            cacheQuery,
            { ...cacheQuery, projects: rawProjects, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
            { upsert: true }
          );
        } catch (cacheErr) {
          console.warn('[WARNING] Failed to cache fallback project template:', cacheErr.message);
        }
      }
    }
  }

  // 4. Retrieve user-specific missions to establish project ↔ mission IDs connections
  const userMissions = await Mission.find({ roadmapId: roadmapDoc._id });

  // 5. Time Budget Coordination
  const activeMissions = userMissions.filter(m => m.status !== 'skipped');
  const totalMissionMin = activeMissions.reduce((acc, m) => acc + m.estimatedMinutes, 0);
  const availableMin = timePlan.availableHours * 60;
  const remainingMinForProjects = Math.max(0, availableMin - totalMissionMin);

  let accumulatedProjectMinutes = 0;
  const savedProjectsList = [];

  for (let i = 0; i < rawProjects.length; i++) {
    const p = rawProjects[i];

    // Find pre-requisite mission instance IDs generated for the skills in this project
    const missionIds = userMissions
      .filter(m => skillsToVerify.includes(m.skillId))
      .map(m => m._id.toString());

    // Determine status & selectionStatus based on time budget and prerequisites
    let status = 'not_started';
    let selectionStatus = 'active';

    const outOfScopeCanonicalIds = (timePlan.outOfScopeSkills || []).map(os => os.skill.canonicalId);
    const isDependencyExcluded = (inScopeGapsToLearn[0]?.skill?.prerequisites || []).some(prereq => 
      outOfScopeCanonicalIds.includes(prereq)
    );

    if (isDependencyExcluded) {
      selectionStatus = 'excluded_by_dependency';
    } else if (accumulatedProjectMinutes + p.estimatedMinutes <= remainingMinForProjects) {
      accumulatedProjectMinutes += p.estimatedMinutes;
      selectionStatus = 'active';
    } else {
      selectionStatus = 'excluded_by_time';
    }

    let finalStatus = status;
    let finalSelectionStatus = selectionStatus;

    let existingProj = null;
    if (mongoose.connection.readyState === 1) {
      try {
        existingProj = await Project.findOne({ roadmapId: roadmapDoc._id, title: p.title });
      } catch (err) {
        console.warn('[WARNING] Failed to query existing project:', err.message);
      }
    }

    if (existingProj) {
      if (existingProj.status !== 'not_started') {
        finalStatus = existingProj.status;
      }
      if (['in_progress', 'submitted', 'under_review', 'completed', 'verified', 'skipped'].includes(existingProj.status)) {
        finalSelectionStatus = 'active';
        if (selectionStatus !== 'active') {
          accumulatedProjectMinutes += p.estimatedMinutes;
        }
      }
    }

    const projectData = {
      roadmapId: roadmapDoc._id,
      userId: roadmapDoc.userId,
      skillIds: skillsToVerify,
      missionIds,
      title: p.title,
      description: p.description,
      domain: primaryDomain,
      targetRole: roadmapDoc.targetRole,
      company: roadmapDoc.company || '',
      difficulty,
      type: p.type,
      estimatedMinutes: p.estimatedMinutes,
      priority: inScopeGapsToLearn[0]?.priority || 'HIGH',
      prerequisites: inScopeGapsToLearn[0]?.skill?.prerequisites || [],
      objectives: p.objectives,
      instructions: p.instructions,
      deliverables: p.deliverables,
      evaluationCriteria: p.evaluationCriteria,
      tools: p.tools,
      expectedSkills: skillsToVerify,
      evidenceRequirements: p.evidenceRequirements,
      source,
      order: i,
      selectionStatus: finalSelectionStatus,
      status: finalStatus,
      milestones: p.milestones.map(m => ({ title: m.title, description: m.description, status: 'not_started' }))
    };

    let saved = null;
    if (mongoose.connection.readyState === 1) {
      try {
        if (refresh) {
          await Project.deleteMany({ roadmapId: roadmapDoc._id, title: p.title, status: 'not_started' });
        }
        saved = await Project.findOneAndUpdate(
          { roadmapId: roadmapDoc._id, title: p.title },
          projectData,
          { upsert: true, new: true }
        );
      } catch (err) {
        console.warn('[WARNING] Failed to write project instance to database:', err.message);
      }
    }

    if (!saved) {
      saved = {
        _id: new mongoose.Types.ObjectId(),
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    savedProjectsList.push(saved);
  }

  const totalGenProjects = savedProjectsList.reduce((acc, p) => acc + p.estimatedMinutes, 0);
  const totalActiveProjects = savedProjectsList.filter(p => p.selectionStatus === 'active').reduce((acc, p) => acc + p.estimatedMinutes, 0);

  return {
    roadmapId: roadmapDoc._id,
    mode: timePlan.planningMode,
    availableMinutes: availableMin,
    totalMissionMinutes: totalMissionMin,
    remainingMinutesForProjects: remainingMinForProjects,
    totalGeneratedProjectMinutes: totalGenProjects,
    totalActiveProjectMinutes: totalActiveProjects,
    projects: savedProjectsList
  };
};
