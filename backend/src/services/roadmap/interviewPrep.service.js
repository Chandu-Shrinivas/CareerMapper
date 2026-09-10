import InterviewPrep from '../../models/interviewPrep.model.js';
import InterviewSimulation from '../../models/interviewSimulation.model.js';
import Roadmap from '../../models/roadmap.model.js';
import SkillVerification from '../../models/skillVerification.model.js';
import Assessment from '../../models/assessment.model.js';
import AssessmentAttempt from '../../models/assessmentAttempt.model.js';
import Project from '../../models/project.model.js';
import Evidence from '../../models/evidence.model.js';
import Mission from '../../models/mission.model.js';
import { getOrGenerateCompanyIntelligence, normalizeContextKey } from './companyIntelligence.service.js';
import { generateJSON } from '../ai/aiGateway.js';

/**
 * Calculates a deterministic readiness score from verified signals.
 */
export const calculateDeterministicReadiness = (preparationMatrix, verifications, assessments, projects, evidence, simulations, timePlan) => {
  if (!preparationMatrix || preparationMatrix.length === 0) {
    return {
      overall: 40,
      skillReadiness: 40,
      technicalReadiness: 40,
      domainReadiness: 40,
      interviewPerformance: 50,
      weakAreas: ['Skill Baseline'],
      strongAreas: [],
      blockingRequirements: [],
      explanation: 'Initial preparation matrix generated. Complete skills and practice topics.'
    };
  }

  // 1. Skill readiness from matrix status
  const totalSkills = preparationMatrix.length;
  const readySkills = preparationMatrix.filter(s => s.status === 'READY' || s.status === 'STRONG').length;
  const missingCritical = preparationMatrix.filter(s => s.status === 'MISSING' || s.status === 'HIGH_PRIORITY');
  
  const skillReadiness = Math.round((readySkills / totalSkills) * 100);

  // 2. Technical & Domain readiness from verifications & assessments
  const verifiedCount = verifications.filter(v => v.verificationStatus === 'VERIFIED' || v.verificationStatus === 'STRONG').length;
  const technicalReadiness = Math.min(100, Math.round((verifiedCount / Math.max(1, totalSkills)) * 85) + 15);

  // 3. Project & evidence contribution
  const verifiedProjects = projects.filter(p => p.status === 'verified' || p.status === 'submitted').length;
  const domainReadiness = Math.min(100, Math.round((verifiedProjects / Math.max(1, projects.length || 1)) * 60) + 40);

  // 4. Interview simulation performance
  const completedSims = simulations.filter(s => s.status === 'completed');
  let interviewPerformance = 60; // baseline default
  if (completedSims.length > 0) {
    const avgScore = completedSims.reduce((acc, curr) => acc + (curr.scoreSummary?.overallScore || 50), 0) / completedSims.length;
    interviewPerformance = Math.round(avgScore);
  }

  // Weighted overall calculation: 40% skills, 25% technical verification, 20% projects, 15% simulation
  let overall = Math.round((skillReadiness * 0.4) + (technicalReadiness * 0.25) + (domainReadiness * 0.2) + (interviewPerformance * 0.15));

  // Time pressure penalty if sprint mode
  if (timePlan?.planningMode === 'FINAL_REVIEW' && missingCritical.length > 0) {
    overall = Math.max(20, overall - 15);
  }

  const weakAreas = missingCritical.map(s => s.skillName);
  const strongAreas = preparationMatrix.filter(s => s.status === 'STRONG' || s.status === 'READY').map(s => s.skillName);
  const blockingRequirements = missingCritical.filter(s => s.priority === 'CRITICAL').map(s => `${s.skillName} requires verification`);

  return {
    overall,
    skillReadiness,
    technicalReadiness,
    domainReadiness,
    interviewPerformance,
    weakAreas,
    strongAreas,
    blockingRequirements,
    explanation: `Readiness calculated from ${readySkills}/${totalSkills} ready skills and ${verifiedProjects} verified practical projects.`
  };
};

/**
 * Builds domain-adapted preparation topics.
 */
export const buildDomainTopics = (domain, company, targetRole, preparationMatrix) => {
  const normDomain = String(domain || '').toLowerCase();
  
  const topics = [];
  
  // 1. Technical / Domain Core Topic
  const highPrioritySkill = preparationMatrix.find(s => s.status === 'HIGH_PRIORITY' || s.status === 'MISSING') || preparationMatrix[0];
  topics.push({
    topicId: 'topic-1-core-domain',
    title: `${domain} Core Fundamentals & ${highPrioritySkill?.skillName || 'Primary Skills'}`,
    category: normDomain.includes('software') ? 'Technical' : 'Domain',
    importance: 'HIGH',
    priority: 'CRITICAL',
    estimatedMinutes: 45,
    relatedSkills: highPrioritySkill ? [highPrioritySkill.skillId] : [],
    status: 'IN_PROGRESS',
    reason: `Essential baseline knowledge for ${targetRole} positions at ${company}.`
  });

  // 2. Practical / Scenario Topic
  topics.push({
    topicId: 'topic-2-scenario-practical',
    title: normDomain.includes('software') ? 'System Architecture & Data Flows' :
           normDomain.includes('mechanical') ? 'CAD Modeling & Manufacturing Constraints' :
           normDomain.includes('civil') ? 'Structural Load Calculations & Standards' :
           normDomain.includes('finance') ? 'Financial Modeling & Valuation Analysis' :
           'Practical Problem Solving & Workflows',
    category: 'Scenario',
    importance: 'HIGH',
    priority: 'HIGH',
    estimatedMinutes: 60,
    relatedSkills: preparationMatrix.slice(0, 2).map(s => s.skillId),
    status: 'NOT_STARTED',
    reason: `Evaluates real-world application of ${domain} concepts.`
  });

  // 3. Behavioral & Culture Topic
  topics.push({
    topicId: 'topic-3-behavioral-leadership',
    title: `${company} Culture & Behavioral Situations`,
    category: 'Behavioral',
    importance: 'MEDIUM',
    priority: 'MEDIUM',
    estimatedMinutes: 30,
    relatedSkills: [],
    status: 'NOT_STARTED',
    reason: `Assesses teamwork, communication, and project execution experience.`
  });

  return topics;
};

/**
 * Builds target-sensitive question bank in structured batches.
 */
export const buildQuestionBank = (company, targetRole, domain, preparationMatrix) => {
  const normDomain = String(domain || '').toLowerCase();
  
  const questions = [
    {
      questionId: 'q-1',
      category: 'technical',
      difficulty: 'intermediate',
      skillId: preparationMatrix[0]?.skillId || 'core-1',
      topic: 'Core Fundamentals',
      question: `What are the primary performance and design considerations when developing solutions for ${targetRole} roles?`,
      type: 'multiple_choice',
      options: [
        'Scalability, reliability, and standards compliance',
        'Speed of development without testing',
        'Ignoring edge cases in production',
        'Hardcoding configurations directly'
      ],
      correctAnswer: 'Scalability, reliability, and standards compliance',
      evaluationCriteria: 'Option 1 correctly addresses engineering standards.',
      points: 10,
      isCompanyReported: true
    },
    {
      questionId: 'q-2',
      category: 'scenario',
      difficulty: 'intermediate',
      skillId: preparationMatrix[1]?.skillId || 'core-2',
      topic: 'Practical Problem Solving',
      question: `Describe how you handle conflicting technical requirements or unexpected bottlenecks during a ${domain} project.`,
      type: 'short_answer',
      options: [],
      correctAnswer: 'Prioritize core constraints, conduct tradeoff analysis, and communicate transparently with stakeholders.',
      evaluationCriteria: 'Look for structured decision making and stakeholder communication.',
      points: 15,
      isCompanyReported: false
    },
    {
      questionId: 'q-3',
      category: 'behavioral',
      difficulty: 'beginner',
      skillId: 'behavioral',
      topic: 'Behavioral & Leadership',
      question: `Give an example of a time you received constructive feedback on your ${domain} work at ${company} or a previous team. How did you adapt?`,
      type: 'short_answer',
      options: [],
      correctAnswer: 'Acknowledged feedback objectively, implemented corrective revisions, and verified outcomes.',
      evaluationCriteria: 'Demonstrates professional growth and receptiveness to feedback.',
      points: 10,
      isCompanyReported: true
    }
  ];

  if (normDomain.includes('software')) {
    questions.push({
      questionId: 'q-4',
      category: 'technical',
      difficulty: 'advanced',
      skillId: 'system-design',
      topic: 'System Design',
      question: 'Which index type is best suited for querying exact match key-value lookups in database management systems?',
      type: 'multiple_choice',
      options: ['Hash Index', 'B-Tree Index', 'Spatial Index', 'Full-Text Index'],
      correctAnswer: 'Hash Index',
      evaluationCriteria: 'Hash indexes provide O(1) exact lookups.',
      points: 15,
      isCompanyReported: false
    });
  } else if (normDomain.includes('mechanical')) {
    questions.push({
      questionId: 'q-4',
      category: 'technical',
      difficulty: 'advanced',
      skillId: 'gd-and-t',
      topic: 'Geometric Dimensioning',
      question: 'In GD&T, what does the Maximum Material Condition (MMC) symbol specify?',
      type: 'multiple_choice',
      options: [
        'The state of a feature containing the maximum amount of material within stated limits',
        'The minimum weight allowed for casting',
        'The thermal expansion coefficient',
        'The surface roughness metric'
      ],
      correctAnswer: 'The state of a feature containing the maximum amount of material within stated limits',
      evaluationCriteria: 'MMC specifies feature state with maximum material.',
      points: 15,
      isCompanyReported: true
    });
  }

  return questions;
};

/**
 * Primary service function to fetch or generate user-scoped interview prep.
 */
export const getOrGenerateInterviewPrep = async (roadmapId, userId, refresh = false) => {
  const roadmapDoc = await Roadmap.findById(roadmapId);
  if (!roadmapDoc) throw new Error('Roadmap not found.');
  if (roadmapDoc.userId !== userId) throw new Error('Forbidden: Access denied.');

  const company = roadmapDoc.company || 'Target Company';
  const targetRole = roadmapDoc.targetRole || 'Target Role';
  let domain = roadmapDoc.domain || 'General';
  
  if (domain === 'General' && targetRole) {
    const roleLower = targetRole.toLowerCase();
    if (roleLower.includes('mechanical')) domain = 'Mechanical Engineering';
    else if (roleLower.includes('civil') || roleLower.includes('structural')) domain = 'Civil Engineering';
    else if (roleLower.includes('finance') || roleLower.includes('financial')) domain = 'Finance';
    else if (roleLower.includes('marketing')) domain = 'Marketing';
    else if (roleLower.includes('data')) domain = 'Data Science';
    else if (roleLower.includes('software') || roleLower.includes('developer')) domain = 'Software';
  }

  const contextKey = normalizeContextKey(company, targetRole, domain);

  if (!refresh) {
    const existing = await InterviewPrep.findOne({ roadmapId, userId });
    if (existing) {
      return sanitizePrepForFrontend(existing);
    }
  }

  // Fetch company intelligence
  const intelligence = await getOrGenerateCompanyIntelligence(company, targetRole, domain, refresh);

  // Fetch user roadmap signals
  const verifications = await SkillVerification.find({ roadmapId, userId });
  const projects = await Project.find({ roadmapId, userId });
  const evidence = await Evidence.find({ roadmapId, userId });
  const simulations = await InterviewSimulation.find({ roadmapId, userId });

  // Map company required skills against roadmap skills
  const requiredList = intelligence.skillRequirements?.requiredSkills || ['Problem Solving', 'Communication'];
  const preferredList = intelligence.skillRequirements?.preferredSkills || [];

  const preparationMatrix = [...requiredList, ...preferredList].map((skillName, idx) => {
    const isRequired = idx < requiredList.length;
    const normSkill = skillName.toLowerCase();
    
    const ver = verifications.find(v => v.skillId.toLowerCase().includes(normSkill) || normSkill.includes(v.skillId.toLowerCase()));
    
    let status = 'NEEDS_PRACTICE';
    let currentProficiency = 'beginner';
    
    if (ver) {
      currentProficiency = ver.currentLevel || 'intermediate';
      if (ver.verificationStatus === 'VERIFIED' || ver.verificationStatus === 'STRONG') {
        status = 'STRONG';
      } else if (ver.verificationStatus === 'DEMONSTRATED') {
        status = 'READY';
      }
    } else if (isRequired && idx === 0) {
      status = 'HIGH_PRIORITY';
    } else if (isRequired) {
      status = 'MISSING';
    }

    return {
      skillId: normSkill.replace(/[^a-z0-9]/g, '_'),
      skillName,
      requiredProficiency: isRequired ? 'intermediate' : 'beginner',
      currentProficiency,
      status,
      gap: status === 'STRONG' ? 'None' : 'Requires review',
      priority: isRequired ? 'CRITICAL' : 'MEDIUM',
      reason: isRequired ? `Required by ${company} for ${targetRole}.` : `Preferred skill for ${targetRole}.`,
      recommendedAction: status === 'STRONG' ? 'Maintain competency' : `Practice ${skillName} interview topics`
    };
  });

  const topics = buildDomainTopics(domain, company, targetRole, preparationMatrix);
  const questionBank = buildQuestionBank(company, targetRole, domain, preparationMatrix);

  // Time plan stub from roadmap
  const timePlan = { planningMode: roadmapDoc.planningMode || 'NORMAL' };
  const readinessScore = calculateDeterministicReadiness(preparationMatrix, verifications, [], projects, evidence, simulations, timePlan);

  const highestGapSkill = preparationMatrix.find(s => s.status === 'HIGH_PRIORITY' || s.status === 'MISSING') || preparationMatrix[0];
  const nextInterviewMove = {
    title: `Practice ${highestGapSkill?.skillName || 'Interview Questions'}`,
    reason: `${highestGapSkill?.skillName || 'Primary skill'} is a critical requirement for ${company}.`,
    topicId: topics[0]?.topicId || 'topic-1',
    priority: 'HIGH',
    estimatedMinutes: 35,
    type: 'PRACTICE_TOPIC'
  };

  const prepDoc = await InterviewPrep.findOneAndUpdate(
    { roadmapId, userId },
    {
      roadmapId,
      userId,
      contextKey,
      company,
      targetRole,
      domain,
      preparationMatrix,
      topics,
      questionBank,
      readinessScore,
      nextInterviewMove,
      version: (roadmapDoc.version || 1),
      generatedAt: new Date()
    },
    { upsert: true, returnDocument: 'after' }
  );

  return sanitizePrepForFrontend(prepDoc);
};

/**
 * Sanitizes interview prep DTO before sending to frontend (strips hidden answers/criteria).
 */
export const sanitizePrepForFrontend = (prepDoc) => {
  const obj = prepDoc.toObject ? prepDoc.toObject() : { ...prepDoc };
  if (obj.questionBank) {
    obj.questionBank = obj.questionBank.map(q => {
      const { correctAnswer, evaluationCriteria, ...safe } = q;
      return safe;
    });
  }
  return obj;
};

/**
 * Starts an adaptive interview simulation session.
 */
export const startInterviewSimulation = async (roadmapId, userId, mode = 'Mixed') => {
  const prep = await InterviewPrep.findOne({ roadmapId, userId });
  if (!prep) throw new Error('Interview prep document not initialized. Generate prep first.');

  const questionsPool = prep.questionBank || [];
  let filtered = questionsPool;
  if (mode !== 'Mixed') {
    filtered = questionsPool.filter(q => q.category.toLowerCase() === mode.toLowerCase() || q.topic.toLowerCase().includes(mode.toLowerCase()));
  }
  if (filtered.length === 0) filtered = questionsPool;

  const sessionQuestions = filtered.map(q => ({
    questionId: q.questionId,
    category: q.category,
    question: q.question,
    type: q.type,
    options: q.options || [],
    difficulty: q.difficulty || 'intermediate'
  }));

  const session = new InterviewSimulation({
    roadmapId,
    userId,
    mode,
    status: 'in_progress',
    currentDifficulty: 'intermediate',
    questions: sessionQuestions,
    currentQuestionIndex: 0,
    windowResults: [],
    responses: []
  });

  await session.save();
  return session;
};

/**
 * Evaluates answer response in simulation and adapts difficulty.
 */
export const respondToSimulationQuestion = async (sessionId, userId, questionId, userAnswer) => {
  const session = await InterviewSimulation.findById(sessionId);
  if (!session) throw new Error('Simulation session not found.');
  if (session.userId !== userId) throw new Error('Forbidden: Access denied.');

  const currentQ = session.questions.find(q => q.questionId === questionId);
  if (!currentQ) throw new Error('Question not found in simulation session.');

  // Fetch stored prep question with answer key for grading
  const prep = await InterviewPrep.findOne({ roadmapId: session.roadmapId, userId });
  const prepQ = prep?.questionBank?.find(q => q.questionId === questionId);

  let isCorrect = false;
  let score = 50;
  let feedback = 'Response evaluated.';
  let strength = 'Moderate';

  if (prepQ && prepQ.correctAnswer) {
    const cleanUser = String(userAnswer || '').trim().toLowerCase();
    const cleanExpected = String(prepQ.correctAnswer).trim().toLowerCase();
    
    if (cleanUser === cleanExpected || cleanUser.includes(cleanExpected) || cleanExpected.includes(cleanUser)) {
      isCorrect = true;
      score = 90;
      feedback = 'Excellent answer! Fully aligns with expectations.';
      strength = 'Strong';
    } else if (cleanUser.length > 10) {
      isCorrect = true;
      score = 70;
      feedback = 'Good response covering core concepts.';
      strength = 'Moderate';
    } else {
      isCorrect = false;
      score = 30;
      feedback = 'Incomplete response. Consider including trade-off and performance factors.';
      strength = 'Needs Work';
    }
  } else {
    isCorrect = String(userAnswer || '').length > 5;
    score = isCorrect ? 75 : 40;
    feedback = isCorrect ? 'Clear subjective explanation.' : 'Brief response.';
  }

  // Update rolling window (size = 3) for adaptive difficulty
  session.windowResults.push(isCorrect);
  if (session.windowResults.length > 3) session.windowResults.shift();

  if (session.windowResults.length === 3) {
    const correctCount = session.windowResults.filter(Boolean).length;
    if (correctCount === 3) {
      if (session.currentDifficulty === 'beginner') session.currentDifficulty = 'intermediate';
      else if (session.currentDifficulty === 'intermediate') session.currentDifficulty = 'advanced';
    } else if (correctCount <= 1) {
      if (session.currentDifficulty === 'advanced') session.currentDifficulty = 'intermediate';
      else if (session.currentDifficulty === 'intermediate') session.currentDifficulty = 'beginner';
    }
  }

  session.responses.push({
    questionId,
    questionText: currentQ.question,
    userAnswer,
    score,
    isCorrect,
    feedback,
    strength,
    missingConcepts: isCorrect ? [] : ['Detailed engineering tradeoffs']
  });

  session.currentQuestionIndex += 1;
  if (session.currentQuestionIndex >= session.questions.length) {
    session.status = 'completed';
    session.completedAt = new Date();
  }

  await session.save();
  return {
    isCorrect,
    score,
    feedback,
    strength,
    nextDifficulty: session.currentDifficulty,
    isFinished: session.status === 'completed',
    session
  };
};

/**
 * Finalizes simulation session and computes overall interview scores.
 */
export const completeInterviewSimulation = async (sessionId, userId) => {
  const session = await InterviewSimulation.findById(sessionId);
  if (!session) throw new Error('Simulation session not found.');
  if (session.userId !== userId) throw new Error('Forbidden: Access denied.');

  const totalResponses = session.responses.length;
  const overallScore = totalResponses > 0
    ? Math.round(session.responses.reduce((sum, r) => sum + r.score, 0) / totalResponses)
    : 0;

  session.status = 'completed';
  session.completedAt = new Date();
  session.scoreSummary = {
    overallScore,
    technicalScore: overallScore,
    domainScore: Math.min(100, overallScore + 5),
    behavioralScore: 80,
    strongestAreas: ['Technical Concepts', 'Problem Solving'],
    weakestAreas: overallScore < 70 ? ['Scenario Tradeoffs'] : [],
    recommendedTopics: ['System Design & Architecture', 'Handling Bottlenecks']
  };

  await session.save();

  // Update interview prep document readiness score
  const prep = await InterviewPrep.findOne({ roadmapId: session.roadmapId, userId });
  if (prep) {
    prep.readinessScore.interviewPerformance = overallScore;
    prep.readinessScore.overall = Math.round((prep.readinessScore.skillReadiness * 0.4) + (prep.readinessScore.technicalReadiness * 0.25) + (prep.readinessScore.domainReadiness * 0.2) + (overallScore * 0.15));
    await prep.save();
  }

  return session;
};
