import Assessment from '../../models/assessment.model.js';
import AssessmentQuestion from '../../models/assessmentQuestion.model.js';
import AssessmentAttempt from '../../models/assessmentAttempt.model.js';
import AssessmentTemplate from '../../models/assessmentTemplate.model.js';
import Roadmap from '../../models/roadmap.model.js';
import Mission from '../../models/mission.model.js';
import Project from '../../models/project.model.js';
import { generateJSON } from '../ai/aiGateway.js';
import { getNormalizedUserProfile } from './profileAdapter.service.js';
import { getRoleAndCompanyIntelligence } from './intelligence.service.js';
import { calculateSkillGaps } from './gap.service.js';
import { calculateSkillPriorities } from './priority.service.js';
import { calculateTimePlanning } from './time.service.js';
import { topologicalSortSkills } from './dependency.service.js';
import mongoose from 'mongoose';

/**
 * Returns domain-specific fallback questions matching various difficulties.
 */
const generateFallbackQuestions = (skill, targetRole, domain) => {
  const skillId = skill.canonicalId;
  const displayName = skill.displayName;

  let fallbackType = 'Technical';
  if (domain === 'UI/UX' || domain === 'Design') fallbackType = 'Design';
  else if (domain === 'Finance' || domain === 'Marketing' || domain === 'HR' || domain === 'Operations') fallbackType = 'Business';
  else if (domain === 'Mechanical Engineering' || domain === 'Civil Engineering' || domain === 'Electrical Engineering') fallbackType = 'Engineering';

  switch (fallbackType) {
    case 'Design':
      return [
        {
          skillId,
          question: `Which UX validation method is most appropriate to evaluate initial wireframe layout usability for ${displayName}?`,
          type: 'mcq',
          options: ['A/B testing', 'Paper prototype cognitive walkthrough', 'Eye tracking metrics', 'Automated accessibility crawlers'],
          correctAnswer: 'Paper prototype cognitive walkthrough',
          explanation: 'Cognitive walkthroughs evaluate early concepts before writing code.',
          difficulty: 'beginner',
          points: 10,
          domain
        },
        {
          skillId,
          question: `An interface redesign for ${displayName} has a high dropoff at checkout. Which UX metric should you audit first?`,
          type: 'scenario',
          correctAnswer: 'usability',
          explanation: 'Usability testing or checkout completion funnel leaks.',
          difficulty: 'intermediate',
          points: 10,
          domain
        },
        {
          skillId,
          question: `Detail a comprehensive layout wireframe design review structure for validating ${displayName} requirements.`,
          type: 'practical',
          correctAnswer: 'layout',
          explanation: 'Comprehensive guidelines evaluating visual alignment and font hierarchy.',
          difficulty: 'advanced',
          points: 10,
          domain
        },
        {
          skillId,
          question: `Define the layout guidelines stack hierarchy for responsive design challenges matching ${displayName}.`,
          type: 'practical',
          correctAnswer: 'layout',
          explanation: 'Detailed instructions on layout sizing.',
          difficulty: 'advanced',
          points: 10,
          domain
        }
      ];
    case 'Business':
      return [
        {
          skillId,
          question: `What is the correct calculation formula for Campaign ROI evaluating ${displayName}?`,
          type: 'mcq',
          options: ['(Revenue - Cost) / Cost', 'Cost / Conversions', 'Clicks / Impressions', 'Revenue * CTR'],
          correctAnswer: '(Revenue - Cost) / Cost',
          explanation: 'ROI ratio measures net return on investment.',
          difficulty: 'beginner',
          points: 10,
          domain
        },
        {
          skillId,
          question: `If CPC decreases while CPM remains flat during a campaign testing ${displayName}, what trend is indicated?`,
          type: 'scenario',
          correctAnswer: 'CTR',
          explanation: 'Indicates CTR increased because clicks gained relative to impressions.',
          difficulty: 'intermediate',
          points: 10,
          domain
        },
        {
          skillId,
          question: `Describe the sensitivity analysis assumptions sheet structure for evaluating ${displayName} forecasting.`,
          type: 'practical',
          correctAnswer: 'sensitivity',
          explanation: 'A model documenting three scenarios (base, best, worst).',
          difficulty: 'advanced',
          points: 10,
          domain
        },
        {
          skillId,
          question: `Formulate a three-scenario financial stack forecasting model guidelines for ${displayName}.`,
          type: 'practical',
          correctAnswer: 'forecasting',
          explanation: 'Constructing revenue growth variables.',
          difficulty: 'advanced',
          points: 10,
          domain
        }
      ];
    case 'Engineering':
      return [
        {
          skillId,
          question: `Which engineering tool is standard for GD&T and mechanical layout validation for ${displayName}?`,
          type: 'mcq',
          options: ['SolidWorks Drawing Module', 'Photoshop Layers', 'React DevTools', 'Campaign Manager'],
          correctAnswer: 'SolidWorks Drawing Module',
          explanation: 'SolidWorks Drawing allows tolerance stack analysis.',
          difficulty: 'beginner',
          points: 10,
          domain
        },
        {
          skillId,
          question: `On a drawing for ${displayName}, a datum reference is misaligned by 0.5mm. What stack equation checks this impact?`,
          type: 'numerical',
          correctAnswer: '0.5',
          explanation: 'Calculated using tolerance stack analysis calculations.',
          difficulty: 'intermediate',
          points: 10,
          domain
        },
        {
          skillId,
          question: `Verify the structural integrity of a load path frame under 10kN force verifying ${displayName}.`,
          type: 'practical',
          correctAnswer: 'load path',
          explanation: 'Calculations evaluating shear stress stack force.',
          difficulty: 'advanced',
          points: 10,
          domain
        },
        {
          skillId,
          question: `Perform mechanical tolerance stress equation limits validation for ${displayName}.`,
          type: 'practical',
          correctAnswer: 'tolerance',
          explanation: 'Verifying tolerance stack compliance.',
          difficulty: 'advanced',
          points: 10,
          domain
        }
      ];
    default: // Technical/Software fallback
      return [
        {
          skillId,
          question: `Which HTTP response status code represents unauthorized access to a ${displayName} resource?`,
          type: 'mcq',
          options: ['200 OK', '401 Unauthorized', '404 Not Found', '500 Server Error'],
          correctAnswer: '401 Unauthorized',
          explanation: '401 indicates authentication credentials are missing or invalid.',
          difficulty: 'beginner',
          points: 10,
          domain
        },
        {
          skillId,
          question: `A local API for ${displayName} throws memory leaks under rapid load testing. Which tool should you use to analyze this?`,
          type: 'scenario',
          correctAnswer: 'profiler',
          explanation: 'Memory profiler shows leaks in allocated arrays.',
          difficulty: 'intermediate',
          points: 10,
          domain
        },
        {
          skillId,
          question: `Write a modular helper script in Javascript or Python verifying ${displayName} credentials.`,
          type: 'code',
          correctAnswer: 'function',
          explanation: 'A script evaluating API requests.',
          difficulty: 'advanced',
          points: 10,
          domain
        },
        {
          skillId,
          question: `Write an advanced backend script implementing modular middleware for ${displayName}.`,
          type: 'code',
          correctAnswer: 'middleware',
          explanation: 'Verifying authentication token headers.',
          difficulty: 'advanced',
          points: 10,
          domain
        }
      ];
  }
};

/**
 * Validates and sanitizes question structure.
 */
const validateAndSanitizeQuestions = (questions, primarySkillId, domain) => {
  if (!Array.isArray(questions)) return [];

  const validated = [];
  const seenQuestions = new Set();

  questions.forEach(q => {
    if (!q.question || !q.type || !q.correctAnswer || !q.explanation) return;

    const questionText = q.question.trim();
    if (seenQuestions.has(questionText.toLowerCase())) return; // skip duplicates

    const type = String(q.type).toLowerCase().trim();
    if (!['mcq', 'multiple_select', 'true_false', 'short_answer', 'numerical', 'scenario', 'code', 'practical'].includes(type)) return;

    let difficulty = String(q.difficulty || 'intermediate').toLowerCase().trim();
    if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) difficulty = 'intermediate';

    const points = parseInt(q.points, 10) || 10;

    validated.push({
      skillId: q.skillId || primarySkillId,
      question: questionText,
      type,
      options: Array.isArray(q.options) ? q.options.map(o => String(o).trim()) : [],
      correctAnswer: q.correctAnswer,
      acceptableAnswers: Array.isArray(q.acceptableAnswers) ? q.acceptableAnswers.map(a => String(a).trim()) : [String(q.correctAnswer).trim()],
      explanation: q.explanation.trim(),
      difficulty,
      points,
      domain: q.domain || domain,
      evaluationCriteria: Array.isArray(q.evaluationCriteria) ? q.evaluationCriteria.map(e => String(e).trim()) : []
    });

    seenQuestions.add(questionText.toLowerCase());
  });

  return validated;
};

/**
 * Deterministic Level 1 & 2 Grading
 */
export const gradeObjectiveAnswer = (question, answer) => {
  if (answer === undefined || answer === null) return { correct: false, pointsEarned: 0, feedback: 'No answer submitted.' };

  const type = question.type;
  const correctVal = question.correctAnswer;

  if (type === 'mcq' || type === 'true_false') {
    const isCorrect = String(correctVal).trim().toLowerCase() === String(answer).trim().toLowerCase();
    return {
      correct: isCorrect,
      pointsEarned: isCorrect ? question.points : 0,
      feedback: isCorrect ? 'Correct!' : `Incorrect. Explanation: ${question.explanation}`
    };
  }

  if (type === 'multiple_select') {
    const correctArr = Array.isArray(correctVal) ? correctVal.map(x => String(x).trim().toLowerCase()).sort() : [];
    const userArr = Array.isArray(answer) ? answer.map(x => String(x).trim().toLowerCase()).sort() : [];
    
    const isCorrect = correctArr.length === userArr.length && correctArr.every((v, i) => v === userArr[i]);
    return {
      correct: isCorrect,
      pointsEarned: isCorrect ? question.points : 0,
      feedback: isCorrect ? 'Correct!' : `Incorrect. Explanation: ${question.explanation}`
    };
  }

  if (type === 'numerical') {
    const correctNum = parseFloat(correctVal);
    const userNum = parseFloat(answer);
    
    if (isNaN(correctNum) || isNaN(userNum)) {
      return { correct: false, pointsEarned: 0, feedback: 'Invalid numerical inputs.' };
    }

    const tolerance = 0.01; // Configurable 1% tolerance
    const delta = Math.abs(correctNum - userNum);
    const isCorrect = delta <= Math.abs(correctNum * tolerance);

    return {
      correct: isCorrect,
      pointsEarned: isCorrect ? question.points : 0,
      feedback: isCorrect ? 'Correct!' : `Incorrect. Expected approximately ${correctNum}. Explanation: ${question.explanation}`
    };
  }

  if (type === 'short_answer') {
    const cleanAnswer = String(answer).trim().toLowerCase();
    const matches = question.acceptableAnswers.some(acceptable => 
      cleanAnswer.includes(String(acceptable).trim().toLowerCase())
    );
    return {
      correct: matches,
      pointsEarned: matches ? question.points : 0,
      feedback: matches ? 'Correct!' : `Incorrect. Explanation: ${question.explanation}`
    };
  }

  return null;
};

/**
 * Main coordinator function to generate assessments
 */
export const generateAssessmentsForRoadmap = async (roadmapId, rawProfile, refresh = false, options = {}) => {
  const roadmapDoc = await Roadmap.findById(roadmapId);
  if (!roadmapDoc) {
    throw new Error('Roadmap document not found.');
  }

  // 1. Re-run roadmap engines to get gaps
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

  // Handle empty gaps fallback
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
      availableMinutes: timePlan.availableHours * 60,
      totalMissionMinutes: 0,
      totalProjectMinutes: 0,
      remainingMinutesForAssessments: timePlan.availableHours * 60,
      totalGeneratedAssessmentMinutes: 0,
      totalActiveAssessmentMinutes: 0,
      assessments: []
    };
  }

  // 2. Determine skillsToVerify based on on-demand request rules
  let skillsToVerify = [];
  if (options.skillIds && options.skillIds.length > 0) {
    skillsToVerify = options.skillIds.map(s => s.toLowerCase().trim()).sort();
  } else {
    // Intelligent Selection prioritizing CRITICAL, HIGH, etc. that are not yet passed
    const passedAssessments = await Assessment.find({ roadmapId: roadmapDoc._id, status: 'passed' });
    const passedSkillIds = new Set(passedAssessments.flatMap(a => a.skillIds));
    
    // Find first gap that has no passed assessment
    const selectedGap = prioritizedGaps.find(g => g.gap && !passedSkillIds.has(g.skill.canonicalId));
    if (selectedGap) {
      skillsToVerify = [selectedGap.skill.canonicalId];
    } else {
      const firstGap = prioritizedGaps.find(g => g.gap);
      if (firstGap) {
        skillsToVerify = [firstGap.skill.canonicalId];
      } else {
        skillsToVerify = [prioritizedGaps[0]?.skill?.canonicalId || 'react'];
      }
    }
  }

  // 3. Load existing assessment if refresh is false
  if (!refresh && mongoose.connection.readyState === 1) {
    const existing = await Assessment.findOne({
      roadmapId,
      skillIds: { $all: skillsToVerify, $size: skillsToVerify.length }
    });
    if (existing) {
      // Calculate overall stats for consistency
      const activeMissions = await Mission.find({ roadmapId: roadmapDoc._id, status: { $ne: 'skipped' } });
      const totalMissionMin = activeMissions.reduce((acc, m) => acc + m.estimatedMinutes, 0);
      
      const activeProjects = await Project.find({ roadmapId: roadmapDoc._id, selectionStatus: 'active' });
      const totalProjectMin = activeProjects.reduce((acc, p) => acc + p.estimatedMinutes, 0);

      const allAssessments = await Assessment.find({ roadmapId });
      const totalGenAssessments = allAssessments.reduce((acc, a) => acc + a.estimatedMinutes, 0);
      const totalActiveAssessments = allAssessments.filter(a => a.selectionStatus === 'active').reduce((acc, a) => acc + a.estimatedMinutes, 0);
      
      const availableMin = (roadmapDoc.availability?.hoursPerWeek || 10) * 12 * 60;
      const remainingMin = Math.max(0, availableMin - (totalMissionMin + totalProjectMin + totalActiveAssessments));

      return {
        roadmapId: roadmapDoc._id,
        availableMinutes: availableMin,
        totalMissionMinutes: totalMissionMin,
        totalProjectMinutes: totalProjectMin,
        remainingMinutesForAssessments: remainingMin,
        totalGeneratedAssessmentMinutes: totalGenAssessments,
        totalActiveAssessmentMinutes: totalActiveAssessments,
        assessments: [existing]
      };
    }
  }

  // 4. Time Budget Constraint check SPECIFICALLY when requesting assessment
  const estimatedMinutes = 30; // standard assessment budget duration
  const activeMissions = await Mission.find({ roadmapId: roadmapDoc._id, status: { $ne: 'skipped' } });
  const totalMissionMin = activeMissions.reduce((acc, m) => acc + m.estimatedMinutes, 0);

  const activeProjects = await Project.find({ roadmapId: roadmapDoc._id, selectionStatus: 'active' });
  const totalProjectMin = activeProjects.reduce((acc, p) => acc + p.estimatedMinutes, 0);

  // Compute other active assessments, excluding the one we might update
  const otherActiveAssessments = await Assessment.find({
    roadmapId: roadmapDoc._id,
    selectionStatus: 'active',
    skillIds: { $ne: skillsToVerify }
  });
  const currentActiveAssessmentMin = otherActiveAssessments.reduce((acc, a) => acc + a.estimatedMinutes, 0);

  const totalPrepMin = totalMissionMin + totalProjectMin + currentActiveAssessmentMin;
  const availableMin = timePlan.availableHours * 60;

  if (totalPrepMin + estimatedMinutes > availableMin) {
    return {
      available: false,
      reason: 'insufficient_preparation_time'
    };
  }

  // Find relevant gaps for these skills to verify
  const matchingGaps = inScopeGapsToLearn.filter(g => skillsToVerify.includes(g.skill.canonicalId));
  const primaryGap = matchingGaps[0] || inScopeGapsToLearn[0];
  const primaryDomain = primaryGap?.skill?.domain || 'Technology';

  // Determine difficulty base on required levels or options override
  let difficulty = options.difficulty;
  if (!difficulty) {
    difficulty = 'beginner';
    const hasAdvanced = matchingGaps.some(g => g.requiredLevel === 'expert' || g.requiredLevel === 'advanced');
    const hasIntermediate = matchingGaps.some(g => g.requiredLevel === 'intermediate');
    if (hasAdvanced) difficulty = 'advanced';
    else if (hasIntermediate) difficulty = 'intermediate';
  }

  const cacheQuery = {
    skillIds: skillsToVerify,
    currentLevel: primaryGap?.currentLevel || 'none',
    requiredLevel: primaryGap?.requiredLevel || 'intermediate',
    domain: primaryDomain,
    targetRole: roadmapDoc.targetRole,
    company: roadmapDoc.company || '',
    roadmapMode: timePlan.planningMode
  };

  const hashKey = `${skillsToVerify.join(',')}:${cacheQuery.currentLevel}:${cacheQuery.requiredLevel}:${primaryDomain}:${roadmapDoc.targetRole.toLowerCase().replace(/[^a-z0-9]/g,'')}:${roadmapDoc.company.toLowerCase().replace(/[^a-z0-9]/g,'')}:${timePlan.planningMode}`;

  let template = null;
  if (!refresh && mongoose.connection.readyState === 1) {
    try {
      template = await AssessmentTemplate.findOne({ contextHash: hashKey });
    } catch (err) {
      console.warn('[WARNING] Assessment template query failed:', err.message);
    }
  }

  let rawAssessment = null;
  let source = 'ai';
  let version = 1;

  if (template && template.assessment) {
    console.log(`[ASSESSMENT CACHE HIT] skills="${skillsToVerify.join(',')}" targetRole="${roadmapDoc.targetRole}"`);
    rawAssessment = template.assessment;
    version = template.assessmentVersion || 1;
  } else {
    console.log(`[ASSESSMENT CACHE MISS] Generating assessments via AI for skills="${skillsToVerify.join(',')}"`);
    const systemPrompt = `You are a domain-agnostic Career Coach and Assessment Builder.
Create exactly 1 comprehensive assessment with 5 to 10 questions that verify the user's proficiency in these skills: '${skillsToVerify.join(', ')}' for target role '${roadmapDoc.targetRole}'.
Do NOT produce software/coding questions for non-software domains (e.g. use tolerance calculations for Mechanical, CTR/analytics equations for Marketing, UX design critiques for UI/UX, or accounting calculations for Finance).
For each question, define: question, type (one of the enum list), options (MCQ only), correctAnswer, acceptableAnswers (if numerical/text), explanation, difficulty, points, domain, and evaluationCriteria.

Respond strictly in JSON format matching this schema:
{
  "assessment": {
    "title": "Clean, descriptive assessment title",
    "description": "Why it matters and contextual value",
    "type": "mixed | knowledge | scenario | technical | case_study",
    "difficulty": "beginner | intermediate | advanced",
    "questions": [
      {
        "question": "Comprehensive question text",
        "type": "mcq | multiple_select | true_false | short_answer | numerical | scenario | code | practical",
        "options": ["Option 1", "Option 2"],
        "correctAnswer": "Correct option or value",
        "acceptableAnswers": ["Acceptable value 1", "Acceptable value 2"],
        "explanation": "Detailed why this is correct",
        "difficulty": "beginner | intermediate | advanced",
        "points": 10,
        "domain": "${primaryDomain}",
        "evaluationCriteria": ["Criteria A", "Criteria B"]
      }
    ]
  }
}
`;
    const prompt = `
Generate assessments verifying these skills: ${skillsToVerify.join(', ')}
Target Role: ${roadmapDoc.targetRole}
Target Company: ${roadmapDoc.company || 'General'}
Primary Domain: ${primaryDomain}
Current User Level: ${primaryGap?.currentLevel || 'none'}
Target Required Level: ${primaryGap?.requiredLevel || 'intermediate'}
Available preparation timeline: ${timePlan.availableHours} hours.
`;
    try {
      const aiResponse = await generateJSON(prompt, systemPrompt);
      const sanitized = validateAndSanitizeQuestions(aiResponse?.assessment?.questions, skillsToVerify[0], primaryDomain);
      if (sanitized.length > 0) {
        rawAssessment = {
          title: aiResponse.assessment.title || `Skill Assessment for ${skillsToVerify.join(', ')}`,
          description: aiResponse.assessment.description || `Measure capability across ${skillsToVerify.join(', ')}`,
          type: aiResponse.assessment.type || 'mixed',
          difficulty,
          questions: sanitized
        };

        // Increment version if regenerating existing cache
        let nextVersion = 1;
        const oldTemplate = await AssessmentTemplate.findOne({ contextHash: hashKey });
        if (oldTemplate) {
          nextVersion = (oldTemplate.assessmentVersion || 1) + 1;
        }

        if (mongoose.connection.readyState === 1) {
          await AssessmentTemplate.findOneAndUpdate(
            { contextHash: hashKey },
            {
              ...cacheQuery,
              contextHash: hashKey,
              assessment: rawAssessment,
              assessmentVersion: nextVersion,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            { upsert: true, new: true }
          );
        }
        version = nextVersion;
      }
    } catch (err) {
      console.warn('[WARNING] AI Assessment generation failed. Falling back to local templates:', err.message);
    }

    if (!rawAssessment) {
      const fallbackQuestions = [];
      skillsToVerify.forEach(skillId => {
        const mockSkill = { canonicalId: skillId, displayName: skillId.toUpperCase() };
        const fallbackSet = generateFallbackQuestions(mockSkill, roadmapDoc.targetRole, primaryDomain);
        fallbackQuestions.push(...fallbackSet);
      });

      rawAssessment = {
        title: `Technical & Scenario Assessment for ${skillsToVerify.join(', ')}`,
        description: `Measure domain applications across ${skillsToVerify.join(', ')}.`,
        type: 'mixed',
        difficulty,
        questions: fallbackQuestions
      };
      source = 'fallback';

      if (mongoose.connection.readyState === 1) {
        try {
          await AssessmentTemplate.findOneAndUpdate(
            { contextHash: hashKey },
            {
              ...cacheQuery,
              contextHash: hashKey,
              assessment: rawAssessment,
              assessmentVersion: 1,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            { upsert: true }
          );
        } catch (cacheErr) {
          console.warn('[WARNING] Failed to cache fallback assessment template:', cacheErr.message);
        }
      }
      version = 1;
    }
  }

  // Connect assessments to relevant missions and projects
  const missionIds = activeMissions.filter(m => skillsToVerify.includes(m.skillId)).map(m => m._id.toString());
  const projectIds = activeProjects.filter(p => p.skillIds.some(sid => skillsToVerify.includes(sid))).map(p => p._id.toString());

  let selectionStatus = 'active';

  // Determine selectionStatus dependencies
  const outOfScopeCanonicalIds = (timePlan.outOfScopeSkills || []).map(os => os.skill.canonicalId);
  const isDependencyExcluded = (primaryGap?.skill?.prerequisites || []).some(prereq => 
    outOfScopeCanonicalIds.includes(prereq)
  );

  if (isDependencyExcluded) {
    selectionStatus = 'excluded_by_dependency';
  }

  const assessmentData = {
    roadmapId: roadmapDoc._id,
    userId: roadmapDoc.userId,
    skillIds: skillsToVerify,
    targetRole: roadmapDoc.targetRole,
    company: roadmapDoc.company || '',
    domain: primaryDomain,
    title: rawAssessment.title,
    description: rawAssessment.description,
    type: rawAssessment.type,
    difficulty,
    estimatedMinutes,
    missionIds,
    projectIds,
    passingScore: 70,
    maxScore: 100,
    selectionStatus,
    source,
    assessmentVersion: version
  };

  let saved = null;
  if (mongoose.connection.readyState === 1) {
    try {
      if (refresh) {
        await Assessment.deleteMany({ roadmapId: roadmapDoc._id, title: rawAssessment.title, status: 'not_started' });
      }

      const existingDoc = await Assessment.findOne({ roadmapId: roadmapDoc._id, title: rawAssessment.title });
      if (existingDoc && existingDoc.status !== 'not_started') {
        assessmentData.status = existingDoc.status;
        assessmentData.attemptCount = existingDoc.attemptCount;
        assessmentData.bestScore = existingDoc.bestScore;
        assessmentData.currentScore = existingDoc.currentScore;
      }

      saved = await Assessment.findOneAndUpdate(
        { roadmapId: roadmapDoc._id, title: rawAssessment.title },
        assessmentData,
        { upsert: true, new: true }
      );

      await AssessmentQuestion.deleteMany({ assessmentId: saved._id });
      const questionsData = rawAssessment.questions.map((q, idx) => ({
        assessmentId: saved._id,
        skillId: q.skillId,
        question: q.question,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        acceptableAnswers: q.acceptableAnswers,
        explanation: q.explanation,
        difficulty: q.difficulty,
        points: q.points,
        domain: q.domain,
        evaluationCriteria: q.evaluationCriteria,
        order: idx,
        source,
        questionVersion: version
      }));
      await AssessmentQuestion.insertMany(questionsData);
    } catch (err) {
      console.warn('[WARNING] Failed to write assessment instances to database:', err.message);
    }
  }

  if (!saved) {
    saved = {
      _id: new mongoose.Types.ObjectId(),
      ...assessmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  const allAssessments = await Assessment.find({ roadmapId: roadmapDoc._id });
  const totalGenAssessments = allAssessments.reduce((acc, a) => acc + a.estimatedMinutes, 0);
  const totalActiveAssessments = allAssessments.filter(a => a.selectionStatus === 'active').reduce((acc, a) => acc + a.estimatedMinutes, 0);

  const remainingMin = Math.max(0, availableMin - (totalMissionMin + totalProjectMin + totalActiveAssessments));

  return {
    roadmapId: roadmapDoc._id,
    availableMinutes: availableMin,
    totalMissionMinutes: totalMissionMin,
    totalProjectMinutes: totalProjectMin,
    remainingMinutesForAssessments: remainingMin,
    totalGeneratedAssessmentMinutes: totalGenAssessments,
    totalActiveAssessmentMinutes: totalActiveAssessments,
    assessments: [saved]
  };
};
