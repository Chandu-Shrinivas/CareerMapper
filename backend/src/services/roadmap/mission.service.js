import Mission from '../../models/mission.model.js';
import MissionTemplate from '../../models/missionTemplate.model.js';
import Roadmap from '../../models/roadmap.model.js';
import { generateJSON } from '../ai/aiGateway.js';
import { getNormalizedUserProfile } from './profileAdapter.service.js';
import { getRoleAndCompanyIntelligence } from './intelligence.service.js';
import { calculateSkillGaps } from './gap.service.js';
import { calculateSkillPriorities } from './priority.service.js';
import { calculateTimePlanning } from './time.service.js';
import { topologicalSortSkills } from './dependency.service.js';
import mongoose from 'mongoose';

const VALID_TYPES = ['learn', 'practice', 'project', 'assessment', 'simulation', 'evidence', 'review', 'interview'];

const XP_MULTIPLIERS = {
  learn: 1.0,
  practice: 1.5,
  project: 2.0,
  assessment: 2.0,
  simulation: 1.2,
  evidence: 1.2,
  review: 1.0,
  interview: 1.5
};

const DIFFICULTY_BASES = {
  beginner: 100,
  intermediate: 200,
  advanced: 300
};

const PRIORITY_ORDER = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4
};

/**
 * Normalizes title for duplicate detection
 */
const normalizeTitle = (title) => {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // remove punctuation
    .replace(/\b(a|an|the)\b/g, '') // strip articles
    .replace(/\s+/g, '') // strip spaces
    .trim();
};

/**
 * Generates fallback domain-neutral missions based on skill metadata.
 */
const generateFallbackMissions = (skill, targetRole, domain) => {
  const name = skill.displayName;
  const canonical = skill.canonicalId;

  let fallbackType = 'Technical';
  if (domain === 'UI/UX' || domain === 'Design') fallbackType = 'Design';
  else if (domain === 'Finance' || domain === 'Marketing' || domain === 'HR' || domain === 'Operations') fallbackType = 'Business';
  else if (domain === 'Mechanical Engineering' || domain === 'Civil Engineering' || domain === 'Electrical Engineering') fallbackType = 'Engineering';

  switch (fallbackType) {
    case 'Design':
      return [
        {
          title: `Study UX/UI Principles of ${name}`,
          description: `Learn the visual and layout design principles of ${name} and how it impacts user experience.`,
          type: 'learn',
          instructions: `1. Research industry standard guidelines on ${name}.\n2. Document the primary design guidelines and constraints.`,
          expectedOutcome: `Understand user layout constraints and best practices.`,
          deliverables: `A brief summary sheet listing key user interface guidelines.`,
          evaluationCriteria: `Completeness of design patterns documented.`,
          estimatedMinutes: 60
        },
        {
          title: `Create a Design Exercise in ${name}`,
          description: `Apply layout principles to mock up or design a simple user flow utilizing ${name}.`,
          type: 'practice',
          instructions: `1. Pick a common flow (e.g. user settings or campaign setup).\n2. Apply the design principles of ${name} to create the assets.`,
          expectedOutcome: `Produce a practical design layout.`,
          deliverables: `Image mockup files or screen designs.`,
          evaluationCriteria: `Consistency of spacing, color usage, and alignment.`,
          estimatedMinutes: 120
        }
      ];
    case 'Business':
      return [
        {
          title: `Analyze Business Case for ${name}`,
          description: `Understand the practical business value and application of ${name} inside the ${targetRole} role.`,
          type: 'learn',
          instructions: `1. Research business applications or standard reports using ${name}.\n2. Identify how metrics are tracked.`,
          expectedOutcome: `Clear understanding of business KPIs.`,
          deliverables: `A study sheet defining core KPIs and standard report formats.`,
          evaluationCriteria: `Depth of metrics classification.`,
          estimatedMinutes: 60
        },
        {
          title: `Complete a Case Analysis for ${name}`,
          description: `Apply analysis techniques of ${name} to review a mock business report or dataset.`,
          type: 'practice',
          instructions: `1. Take a sample report related to ${name}.\n2. Extract conversion ratios or financial projections.`,
          expectedOutcome: `Practical spreadsheet analysis or recommendation report.`,
          deliverables: `A short recommendation slide deck or summary document.`,
          evaluationCriteria: `Relevance of recommendations based on findings.`,
          estimatedMinutes: 120
        }
      ];
    case 'Engineering':
      return [
        {
          title: `Review Core Concept Fundamentals of ${name}`,
          description: `Study the mathematical and physical foundations of ${name} within the ${domain} field.`,
          type: 'learn',
          instructions: `1. Review the technical manual or core references for ${name}.\n2. Summarize feature control frames, calculations, or load properties.`,
          expectedOutcome: `Theoretical clarity of standard equations and principles.`,
          deliverables: `Study notes covering the mathematical/standard codes.`,
          evaluationCriteria: `Accuracy of physics/standards references.`,
          estimatedMinutes: 90
        },
        {
          title: `Applied Engineering Exercise in ${name}`,
          description: `Complete a practical calculation or drawing exercise using ${name}.`,
          type: 'practice',
          instructions: `1. Take a sample drawing, structural schematic, or component specifications.\n2. Complete the tolerance checks or load equations using standard methods.`,
          expectedOutcome: `A verified calculation sheet or layout drawing.`,
          deliverables: `Completed calculations file or drawing sheet.`,
          evaluationCriteria: `Correct application of standards and mathematical accuracy.`,
          estimatedMinutes: 180
        }
      ];
    default: // Technical/Software fallback
      return [
        {
          title: `Study Core Concepts of ${name}`,
          description: `Study the core concepts of ${name} relevant to the ${targetRole} role.`,
          type: 'learn',
          instructions: `1. Read the official documentation or tutorial files for ${name}.\n2. Focus on architecture, syntax, and foundational command structures.`,
          expectedOutcome: `Theoretical grasp of terminology and setup.`,
          deliverables: `A technical summary document of the core commands and structures.`,
          evaluationCriteria: `Accuracy of syntax definitions.`,
          estimatedMinutes: 60
        },
        {
          title: `Practical Coding Exercise in ${name}`,
          description: `Write a simple implementation or configuration file using ${name} to apply your study.`,
          type: 'practice',
          instructions: `1. Write a basic script or configuration file.\n2. Verify the execution environment locally.`,
          expectedOutcome: `Working setup or code repository.`,
          deliverables: `Source files or script repository.`,
          evaluationCriteria: `Error-free script execution.`,
          estimatedMinutes: 120
        }
      ];
  }
};

/**
 * Normalizes and validates raw mission items.
 */
const validateAndSanitizeMissions = (missionsList, canonicalId) => {
  if (!Array.isArray(missionsList)) return [];

  const validated = [];
  missionsList.forEach(m => {
    if (!m.title || !m.description) return;

    let type = String(m.type || 'practice').toLowerCase().trim();
    if (!VALID_TYPES.includes(type)) {
      type = 'practice';
    }

    const estimatedMinutes = parseInt(m.estimatedMinutes, 10);
    if (isNaN(estimatedMinutes) || estimatedMinutes <= 0) {
      return; // reject invalid duration
    }

    validated.push({
      title: m.title.trim().substring(0, 100),
      description: m.description.trim().substring(0, 500),
      type,
      instructions: (m.instructions || '').trim(),
      expectedOutcome: (m.expectedOutcome || '').trim(),
      deliverables: (m.deliverables || '').trim(),
      evaluationCriteria: (m.evaluationCriteria || '').trim(),
      estimatedMinutes
    });
  });

  return validated;
};

/**
 * Main coordinator function to generate missions for a roadmap
 */
export const generateMissionsForRoadmap = async (roadmapId, rawProfile, refresh = false) => {
  // 1. Load Roadmap
  const roadmapDoc = await Roadmap.findById(roadmapId);
  if (!roadmapDoc) {
    throw new Error('Roadmap document not found.');
  }

  // 2. Retrieve existing user-specific missions if refresh is false
  if (!refresh) {
    const existing = await Mission.find({ roadmapId }).sort({ order: 1 });
    if (existing.length > 0) {
      // Re-run time calculations to show stats
      const totalGenerated = existing.reduce((acc, m) => acc + m.estimatedMinutes, 0);
      const totalActive = existing.filter(m => m.status !== 'skipped').reduce((acc, m) => acc + m.estimatedMinutes, 0);
      const availableMin = (roadmapDoc.availability?.hoursPerWeek || 10) * 12 * 60; // 12 week base minutes

      return {
        roadmapId: roadmapDoc._id,
        mode: 'NORMAL',
        availableMinutes: availableMin,
        totalGeneratedMinutes: totalGenerated,
        totalActiveMinutes: totalActive,
        missions: existing
      };
    }
  }

  // 3. Compute current gaps using standard profile adapter
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

  const inScopeGaps = timePlan.inScopeSkills;
  let inScopeGapsToLearn = inScopeGaps.filter(g => g.gap);
  if (inScopeGapsToLearn.length === 0 && prioritizedGaps.some(g => g.gap)) {
    const topGap = prioritizedGaps.find(g => g.gap);
    if (topGap) {
      inScopeGapsToLearn = [topGap];
    }
  }

  const finalMissionsList = [];
  const processedTitles = new Set();

  // 4. Generate/Load cached mission definitions for each gap
  for (const gap of inScopeGapsToLearn) {
    const skill = gap.skill;
    const cacheQuery = {
      skillId: skill.canonicalId,
      currentLevel: gap.currentLevel,
      requiredLevel: gap.requiredLevel,
      domain: skill.domain,
      targetRole: roadmapDoc.targetRole,
      company: roadmapDoc.company || '',
      roadmapMode: timePlan.planningMode
    };

    let template = null;
    if (!refresh && mongoose.connection.readyState === 1) {
      try {
        template = await MissionTemplate.findOne(cacheQuery);
      } catch (err) {
        console.warn('[WARNING] Mission template cache query failed:', err.message);
      }
    }

    let rawMissions = [];
    let source = 'ai';

    if (template && template.missions && template.missions.length > 0) {
      console.log(`[MISSION CACHE HIT] skill="${skill.displayName}" targetRole="${roadmapDoc.targetRole}"`);
      rawMissions = template.missions;
      source = 'ai';
    } else {
      console.log(`[MISSION CACHE MISS] Generating missions via AI for skill="${skill.displayName}"`);
      const systemInstruction = `You are a domain-agnostic Career Coach and AI Mission Generator.
Generate exactly 2 to 4 actionable, practical learning and practice missions appropriate for target role '${roadmapDoc.targetRole}' in the '${skill.domain}' domain.
Never assume every mission is a software/coding task. Adapt the activities to the domain (e.g. CAD drawings for Mechanical, forecast scenario analysis for Finance, layout design for UI/UX, CAC calculations for Marketing).
For each mission, provide: title, description, type, estimatedMinutes, instructions, expectedOutcome, deliverables, and evaluationCriteria.

Respond strictly in JSON format matching this schema:
{
  "missions": [
    {
      "title": "Clean, actionable title",
      "description": "Why it matters and contextual importance",
      "type": "learn | practice | project | assessment | simulation | evidence | review | interview",
      "estimatedMinutes": 60,
      "instructions": "Step 1... Step 2...",
      "expectedOutcome": "What to produce or what is expected",
      "deliverables": "Deliverable files or document specs",
      "evaluationCriteria": "How to verify success"
    }
  ]
}
`;
      const prompt = `
Generate missions for:
Skill: ${skill.displayName}
Prerequisite details: ${(skill.prerequisites || []).join(', ')}
Current User Level: ${gap.currentLevel}
Target Required Level: ${gap.requiredLevel}
Available Prep Hours: ${timePlan.availableHours}
Deadline Mode: ${timePlan.planningMode}

Focus only on high-value, domain-appropriate tasks. Avoid generic sentences like "Learn more about ${skill.displayName}". Make it actionable.
`;
      try {
        const aiResponse = await generateJSON(prompt, systemInstruction);
        rawMissions = validateAndSanitizeMissions(aiResponse?.missions, skill.canonicalId);
        source = 'ai';

        // Cache the valid AI definitions
        if (rawMissions.length > 0 && mongoose.connection.readyState === 1) {
          await MissionTemplate.findOneAndUpdate(
            cacheQuery,
            { ...cacheQuery, missions: rawMissions, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
            { upsert: true }
          );
        }
      } catch (err) {
        console.warn(`[WARNING] AI Generation failed for "${skill.displayName}". Falling back to static templates. Error:`, err.message);
        rawMissions = generateFallbackMissions(skill, roadmapDoc.targetRole, skill.domain);
        source = 'fallback';

        if (rawMissions.length > 0 && mongoose.connection.readyState === 1) {
          try {
            await MissionTemplate.findOneAndUpdate(
              cacheQuery,
              { ...cacheQuery, missions: rawMissions, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
              { upsert: true }
            );
          } catch (cacheErr) {
            console.warn('[WARNING] Failed to cache fallback template:', cacheErr.message);
          }
        }
      }
    }

    // Determine difficulty: expert/advanced -> advanced; intermediate -> intermediate; otherwise beginner
    let difficulty = 'beginner';
    if (gap.requiredLevel === 'expert' || gap.requiredLevel === 'advanced') {
      difficulty = 'advanced';
    } else if (gap.requiredLevel === 'intermediate') {
      difficulty = 'intermediate';
    }

    // 5. Clone definitions into User Mission models
    rawMissions.forEach(m => {
      const normT = normalizeTitle(m.title);
      if (processedTitles.has(normT)) return; // duplicate detection
      processedTitles.add(normT);

      // Compute deterministic XP
      const baseXP = DIFFICULTY_BASES[difficulty] || 100;
      const multiplier = XP_MULTIPLIERS[m.type] || 1.2;
      const xp = Math.round(baseXP * multiplier);

      finalMissionsList.push({
        roadmapId: roadmapDoc._id,
        skillId: skill.canonicalId,
        title: m.title,
        description: m.description,
        type: m.type,
        difficulty,
        estimatedMinutes: m.estimatedMinutes,
        xp,
        priority: gap.priority,
        prerequisites: skill.prerequisites || [],
        instructions: m.instructions,
        expectedOutcome: m.expectedOutcome,
        deliverables: m.deliverables,
        evaluationCriteria: m.evaluationCriteria,
        source,
        status: 'not_started' // initial status
      });
    });
  }

  // 6. Time Engine Trimming
  // Sort user missions by skill priority: CRITICAL > HIGH > MEDIUM > LOW
  // Within the same priority, we preserve topological prerequisite order
  finalMissionsList.sort((a, b) => {
    const pA = PRIORITY_ORDER[a.priority] || 4;
    const pB = PRIORITY_ORDER[b.priority] || 4;
    if (pA !== pB) return pA - pB;
    // Fall back to original order (which is already sorted topologically by topologicalSortSkills!)
    return 0;
  });

  const availableMinutes = timePlan.availableHours * 60;
  let accumulatedMinutes = 0;
  
  const savedMissions = [];

  for (let i = 0; i < finalMissionsList.length; i++) {
    const m = finalMissionsList[i];
    m.order = i;

    if (accumulatedMinutes + m.estimatedMinutes <= availableMinutes) {
      accumulatedMinutes += m.estimatedMinutes;
      m.status = 'not_started';
    } else {
      m.status = 'skipped';
    }

    let saved = null;
    if (mongoose.connection.readyState === 1) {
      try {
        // If refresh is true, we delete matching old ones first
        if (refresh) {
          await Mission.deleteMany({ roadmapId: roadmapDoc._id, skillId: m.skillId, title: m.title });
        }
        saved = await Mission.findOneAndUpdate(
          { roadmapId: roadmapDoc._id, skillId: m.skillId, title: m.title },
          m,
          { upsert: true, new: true }
        );
      } catch (err) {
        console.warn('[WARNING] Failed to write mission to MongoDB:', err.message);
      }
    }

    if (!saved) {
      saved = {
        _id: new mongoose.Types.ObjectId(),
        ...m,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    savedMissions.push(saved);
  }

  const totalGenerated = savedMissions.reduce((acc, m) => acc + m.estimatedMinutes, 0);
  const totalActive = savedMissions.filter(m => m.status !== 'skipped').reduce((acc, m) => acc + m.estimatedMinutes, 0);

  return {
    roadmapId: roadmapDoc._id,
    mode: timePlan.planningMode,
    availableMinutes,
    totalGeneratedMinutes: totalGenerated,
    totalActiveMinutes: totalActive,
    missions: savedMissions
  };
};
