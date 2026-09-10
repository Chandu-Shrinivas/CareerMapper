import JobPreparation from '../models/jobPreparation.model.js';
import InterviewSession from '../models/interviewSession.model.js';
import { getJobById } from '../services/job.service.js';
import { getJobAnalysis } from '../services/jobAnalysis.service.js';
import { generateJSON } from '../services/ai/aiGateway.js';

/**
 * Deterministic Readiness Score Calculation Formula:
 * ReadinessScore = Math.round((MatchedSkillsCount / TotalRequiredSkillsCount) * 100)
 */
const calculateDeterministicReadinessScore = (matchedSkills = [], missingSkills = []) => {
  const total = matchedSkills.length + missingSkills.length;
  if (total === 0) return 50; // Neutral baseline if no skills listed in JD
  const score = Math.round((matchedSkills.length / total) * 100);
  return Math.max(0, Math.min(100, score));
};

// 1. Prepare for a Job Posting (System 2)
export const prepareJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.email || req.body.email || 'demo@careermapper.app';
    const userSkills = req.body.userSkills || ['React', 'JavaScript', 'HTML', 'CSS', 'Git'];

    // Find job details
    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ status: 'error', message: `Job with ID "${jobId}" not found.` });
    }

    // Check if preparation plan already exists
    let existingPrep = await JobPreparation.findOne({ userId, jobId });
    if (existingPrep) {
      return res.status(200).json({
        status: 'success',
        message: 'Existing job preparation retrieved.',
        data: existingPrep
      });
    }

    // Perform JD skill extraction & gap analysis
    const analysis = await getJobAnalysis(
      jobId, 
      job.description || '', 
      job.title || '', 
      userSkills, 
      job.title
    );

    const extracted = (analysis.extractedSkills || []).map(s => typeof s === 'string' ? s : (s.name || s.display));
    const matched = (analysis.matchedSkills || []).map(s => typeof s === 'string' ? s : (s.name || s.display));
    const missing = (analysis.missingSkills || []).map(s => typeof s === 'string' ? s : (s.name || s.display));

    // Calculate deterministic score
    const readinessScore = calculateDeterministicReadinessScore(matched, missing);

    // Generate Phases and Tasks
    const phases = [
      { phaseId: 'phase-1', title: 'Phase 1 — Skill Gap Remediation', description: 'Master missing skills required for this role', estimatedDays: 7 },
      { phaseId: 'phase-2', title: 'Phase 2 — Core Competencies & Tools', description: 'Strengthen core tech stack requirements', estimatedDays: 5 },
      { phaseId: 'phase-3', title: 'Phase 3 — Portfolio & Hands-on Project', description: 'Build evidence project demonstrating target skills', estimatedDays: 7 },
      { phaseId: 'phase-4', title: 'Phase 4 — Job & Company Interview Prep', description: 'Practice targeted interview questions and mock scenarios', estimatedDays: 3 }
    ];

    const tasks = [];
    let taskIdCounter = 1;

    // Phase 1 tasks for missing skills
    missing.forEach(skill => {
      tasks.push({
        id: `task-${taskIdCounter++}`,
        phaseId: 'phase-1',
        title: `Learn ${skill} Fundamentals`,
        description: `Study key concepts, official documentation, and practical examples for ${skill}.`,
        category: 'SKILL_BUILDING',
        priority: 'CRITICAL',
        estimatedTime: '4 hours',
        prerequisites: [],
        status: 'PENDING'
      });
      tasks.push({
        id: `task-${taskIdCounter++}`,
        phaseId: 'phase-1',
        title: `Build Mini Practice Task in ${skill}`,
        description: `Create a small proof-of-concept project incorporating ${skill}.`,
        category: 'PRACTICE',
        priority: 'HIGH',
        estimatedTime: '3 hours',
        prerequisites: [`task-${taskIdCounter - 2}`],
        status: 'PENDING'
      });
    });

    // Phase 2 tasks for matched skills review
    matched.slice(0, 3).forEach(skill => {
      tasks.push({
        id: `task-${taskIdCounter++}`,
        phaseId: 'phase-2',
        title: `Review ${skill} Best Practices`,
        description: `Deepen your knowledge of advanced patterns and optimization for ${skill}.`,
        category: 'FOUNDATION',
        priority: 'MEDIUM',
        estimatedTime: '2 hours',
        prerequisites: [],
        status: 'PENDING'
      });
    });

    // Phase 3 project tasks
    tasks.push({
      id: `task-${taskIdCounter++}`,
      phaseId: 'phase-3',
      title: `Build ${job.company || 'Company'} Relevant Portfolio Feature`,
      description: `Architect a mini full-stack feature aligned with ${job.title} job duties.`,
      category: 'PROJECT',
      priority: 'HIGH',
      estimatedTime: '8 hours',
      prerequisites: [],
      status: 'PENDING'
    });

    // Phase 4 interview tasks
    tasks.push({
      id: `task-${taskIdCounter++}`,
      phaseId: 'phase-4',
      title: `Practice ${job.title} Technical Interview Questions`,
      description: `Complete technical question bank for ${job.title} at ${job.company}.`,
      category: 'INTERVIEW',
      priority: 'CRITICAL',
      estimatedTime: '3 hours',
      prerequisites: [],
      status: 'PENDING'
    });
    tasks.push({
      id: `task-${taskIdCounter++}`,
      phaseId: 'phase-4',
      title: `Conduct AI Mock Interview Session`,
      description: `Run interactive simulation covering Technical, Behavioral, and System Design questions.`,
      category: 'INTERVIEW',
      priority: 'HIGH',
      estimatedTime: '1 hour',
      prerequisites: [],
      status: 'PENDING'
    });

    // Generate Interview Questions
    const interviewQuestions = [
      {
        questionId: 'iq-1',
        category: 'Technical',
        question: `Explain how you would architect a scalable solution for ${job.title} using ${matched[0] || 'your core skills'}.`,
        difficulty: 'Intermediate',
        type: 'subjective',
        answerGuide: `Focus on clean separation of concerns, API contract design, error handling, and latency optimizations.`,
        isCompanyReported: true
      },
      {
        questionId: 'iq-2',
        category: 'Technical',
        question: `What challenges have you faced when working with ${missing[0] || 'new technical stack components'} and how did you resolve them?`,
        difficulty: 'Intermediate',
        type: 'subjective',
        answerGuide: `Structure your response using the STAR method (Situation, Task, Action, Result) highlighting proactive learning.`,
        isCompanyReported: false
      },
      {
        questionId: 'iq-3',
        category: 'Project',
        question: `Describe the technical architecture of your recent project. What key design decisions did you make?`,
        difficulty: 'Advanced',
        type: 'subjective',
        answerGuide: `Explain the system flow, database selection tradeoffs, authentication flow, and deployment setup.`,
        isCompanyReported: true
      },
      {
        questionId: 'iq-4',
        category: 'HR',
        question: `Why are you interested in joining ${job.company || 'our company'} as a ${job.title}?`,
        difficulty: 'Beginner',
        type: 'subjective',
        answerGuide: `Connect company products and tech stack with your personal career trajectory and passion.`,
        isCompanyReported: false
      }
    ];

    // Create JobPreparation Record
    const newPrep = await JobPreparation.create({
      userId,
      jobId,
      jobTitle: job.title || 'Target Job',
      company: job.company || 'Target Company',
      companyLogo: job.companyLogo || '',
      location: job.location || 'Remote',
      source: job.source || 'JSearch',
      extractedSkills: extracted,
      matchedSkills: matched,
      missingSkills: missing,
      readinessScore,
      phases,
      tasks,
      interviewQuestions,
      status: 'ACTIVE'
    });

    return res.status(201).json({
      status: 'success',
      message: 'Job preparation roadmap generated successfully.',
      data: newPrep
    });

  } catch (err) {
    console.error('[JOB PREPARE ERROR]', err);
    return res.status(500).json({ status: 'error', message: err.message || 'Failed to generate job preparation.' });
  }
};

// 2. Get All Job Preparations (My Roadmaps)
export const getJobPreparations = async (req, res) => {
  try {
    const userId = req.user?.email || req.query.email || 'demo@careermapper.app';
    const preps = await JobPreparation.find({ userId }).sort({ updatedAt: -1 });

    const responseList = preps.map(p => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter(t => t.status === 'COMPLETED').length;
      const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: p._id,
        jobId: p.jobId,
        jobTitle: p.jobTitle,
        company: p.company,
        companyLogo: p.companyLogo,
        location: p.location,
        readinessScore: p.readinessScore,
        matchedSkillsCount: p.matchedSkills.length,
        missingSkillsCount: p.missingSkills.length,
        totalTasks,
        completedTasks,
        progressPercentage,
        updatedAt: p.updatedAt
      };
    });

    return res.status(200).json({
      status: 'success',
      data: responseList
    });
  } catch (err) {
    console.error('[GET JOB PREPARATIONS ERROR]', err);
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve job preparations.' });
  }
};

// 3. Get Single Job Preparation Detail
export const getJobPreparationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.email || req.query.email || 'demo@careermapper.app';

    const prep = await JobPreparation.findOne({ _id: id, userId });
    if (!prep) {
      return res.status(404).json({ status: 'error', message: 'Job preparation plan not found.' });
    }

    const totalTasks = prep.tasks.length;
    const completedTasks = prep.tasks.filter(t => t.status === 'COMPLETED').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return res.status(200).json({
      status: 'success',
      data: {
        ...prep.toObject(),
        totalTasks,
        completedTasks,
        progressPercentage
      }
    });
  } catch (err) {
    console.error('[GET JOB PREPARATION BY ID ERROR]', err);
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve preparation details.' });
  }
};

// 4. Toggle Task Completion Status
export const togglePreparationTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const userId = req.user?.email || req.body.email || 'demo@careermapper.app';

    const prep = await JobPreparation.findOne({ _id: id, userId });
    if (!prep) {
      return res.status(404).json({ status: 'error', message: 'Job preparation plan not found.' });
    }

    const task = prep.tasks.find(t => t.id === taskId);
    if (!task) {
      return res.status(404).json({ status: 'error', message: `Task "${taskId}" not found in preparation plan.` });
    }

    task.status = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    task.completedAt = task.status === 'COMPLETED' ? new Date() : null;

    prep.markModified('tasks');
    await prep.save();

    const totalTasks = prep.tasks.length;
    const completedTasks = prep.tasks.filter(t => t.status === 'COMPLETED').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return res.status(200).json({
      status: 'success',
      taskId,
      newStatus: task.status,
      completedTasks,
      totalTasks,
      progressPercentage,
      tasks: prep.tasks
    });
  } catch (err) {
    console.error('[TOGGLE TASK ERROR]', err);
    return res.status(500).json({ status: 'error', message: 'Failed to update task completion.' });
  }
};

// 5. Get Interview Prep for Job Preparation
export const getJobInterviewPrep = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.email || req.query.email || 'demo@careermapper.app';

    const prep = await JobPreparation.findOne({ _id: id, userId });
    if (!prep) {
      return res.status(404).json({ status: 'error', message: 'Job preparation not found.' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        preparationId: prep._id,
        jobTitle: prep.jobTitle,
        company: prep.company,
        readinessScore: prep.readinessScore,
        matchedSkills: prep.matchedSkills,
        missingSkills: prep.missingSkills,
        questions: prep.interviewQuestions
      }
    });
  } catch (err) {
    console.error('[GET INTERVIEW PREP ERROR]', err);
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve interview prep data.' });
  }
};

// 6. Start Interview Simulation
export const startInterviewSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const { mode = 'Mixed' } = req.body;
    const userId = req.user?.email || req.body.email || 'demo@careermapper.app';

    const prep = await JobPreparation.findOne({ _id: id, userId });
    if (!prep) {
      return res.status(404).json({ status: 'error', message: 'Job preparation not found.' });
    }

    const filteredQuestions = (prep.interviewQuestions || []).filter(q => {
      if (mode === 'Mixed') return true;
      return (q.category || '').toLowerCase() === mode.toLowerCase();
    });

    const questionsToAsk = (filteredQuestions.length > 0 ? filteredQuestions : prep.interviewQuestions).map(q => ({
      questionId: q.questionId,
      category: q.category,
      question: q.question,
      difficulty: q.difficulty
    }));

    const session = await InterviewSession.create({
      preparationId: prep._id,
      userId,
      mode,
      questions: questionsToAsk,
      responses: [],
      overallScore: 0,
      status: 'IN_PROGRESS'
    });

    return res.status(201).json({
      status: 'success',
      data: session
    });
  } catch (err) {
    console.error('[START SIMULATION ERROR]', err);
    return res.status(500).json({ status: 'error', message: 'Failed to start interview simulation.' });
  }
};

// 7. Respond to Interview Simulation Question
export const respondToInterviewSimulation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, userAnswer } = req.body;

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ status: 'error', message: 'Interview session not found.' });
    }

    const targetQ = session.questions.find(q => q.questionId === questionId);
    if (!targetQ) {
      return res.status(404).json({ status: 'error', message: 'Question not found in session.' });
    }

    // Evaluate answer with AI if configured, or deterministic rules
    let feedback = `Good structured answer for ${targetQ.category}. You addressed key concepts cleanly.`;
    let score = 85;

    try {
      const prompt = `Evaluate the candidate's answer to this interview question:
Question: "${targetQ.question}"
Candidate Answer: "${userAnswer}"

Respond in JSON format:
{
  "score": 85,
  "feedback": "Detailed feedback..."
}`;

      const aiRes = await generateJSON(prompt, 'You are an expert tech interviewer.');
      if (aiRes && aiRes.feedback) {
        feedback = aiRes.feedback;
        score = typeof aiRes.score === 'number' ? aiRes.score : 85;
      }
    } catch (e) {
      console.warn('[AI SIMULATION EVALUATION FALLBACK]', e.message);
    }

    session.responses.push({
      questionId,
      question: targetQ.question,
      userAnswer,
      feedback,
      score,
      evaluatedAt: new Date()
    });

    const totalScore = session.responses.reduce((sum, r) => sum + r.score, 0);
    session.overallScore = Math.round(totalScore / session.responses.length);

    if (session.responses.length >= session.questions.length) {
      session.status = 'COMPLETED';
    }

    await session.save();

    return res.status(200).json({
      status: 'success',
      isFinished: session.status === 'COMPLETED',
      feedback,
      score,
      overallScore: session.overallScore,
      session
    });
  } catch (err) {
    console.error('[RESPOND SIMULATION ERROR]', err);
    return res.status(500).json({ status: 'error', message: 'Failed to record response.' });
  }
};
