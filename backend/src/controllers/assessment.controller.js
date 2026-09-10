import Assessment from '../models/assessment.model.js';
import AssessmentQuestion from '../models/assessmentQuestion.model.js';
import AssessmentAttempt from '../models/assessmentAttempt.model.js';
import Roadmap from '../models/roadmap.model.js';
import { generateAssessmentsForRoadmap, gradeObjectiveAnswer } from '../services/roadmap/assessment.service.js';
import mongoose from 'mongoose';

/**
 * Controller to generate assessments for a roadmap
 */
export const generateAssessments = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { profile, refresh, skillIds, assessmentType } = req.body;
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

    const result = await generateAssessmentsForRoadmap(roadmapId, profile || {}, refresh === true, { skillIds, assessmentType });
    if (result && result.available === false) {
      return res.status(200).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('[CONTROLLER] Generate assessments failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate assessments.' });
  }
};

/**
 * Controller to retrieve safe list of assessments for a roadmap
 */
export const getAssessments = async (req, res) => {
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

    const list = await Assessment.find({ roadmapId }).sort({ createdAt: -1 });
    return res.status(200).json(list);
  } catch (error) {
    console.error('[CONTROLLER] Get assessments failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve assessments.' });
  }
};

/**
 * Controller to retrieve single assessment and its safe questions
 */
export const getAssessmentDetails = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userEmail = req.user.email;

    if (!assessmentId || !mongoose.Types.ObjectId.isValid(assessmentId)) {
      return res.status(400).json({ error: 'Invalid or missing assessmentId.' });
    }

    const assessmentDoc = await Assessment.findById(assessmentId);
    if (!assessmentDoc) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }

    if (assessmentDoc.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    // Retrieve safe fields only to prevent leaking correct answers to frontend
    const questions = await AssessmentQuestion.find({ assessmentId })
      .select('assessmentId skillId question type options difficulty points domain order source questionVersion')
      .sort({ order: 1 });

    return res.status(200).json({
      assessment: assessmentDoc,
      questions
    });
  } catch (error) {
    console.error('[CONTROLLER] Get assessment details failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve assessment details.' });
  }
};

/**
 * Controller to start a new assessment attempt session
 */
export const startAssessmentAttempt = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userEmail = req.user.email;

    if (!assessmentId || !mongoose.Types.ObjectId.isValid(assessmentId)) {
      return res.status(400).json({ error: 'Invalid or missing assessmentId.' });
    }

    const assessmentDoc = await Assessment.findById(assessmentId);
    if (!assessmentDoc) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }

    if (assessmentDoc.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    const attempt = new AssessmentAttempt({
      assessmentId: assessmentDoc._id,
      roadmapId: assessmentDoc.roadmapId,
      userId: userEmail,
      assessmentVersion: assessmentDoc.assessmentVersion,
      answers: [],
      status: 'in_progress',
      startedAt: new Date()
    });

    await attempt.save();

    // Update assessment status to in_progress
    assessmentDoc.status = 'in_progress';
    await assessmentDoc.save();

    return res.status(201).json(attempt);
  } catch (error) {
    console.error('[CONTROLLER] Start assessment attempt failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to start attempt.' });
  }
};

/**
 * Controller to grade and submit assessment attempt
 */
export const submitAssessmentAttempt = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { attemptId, answers } = req.body;
    const userEmail = req.user.email;

    if (!assessmentId || !mongoose.Types.ObjectId.isValid(assessmentId)) {
      return res.status(400).json({ error: 'Invalid or missing assessmentId.' });
    }
    if (!attemptId || !mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({ error: 'Invalid or missing attemptId.' });
    }
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid answers array.' });
    }

    const attemptDoc = await AssessmentAttempt.findById(attemptId);
    if (!attemptDoc || attemptDoc.assessmentId.toString() !== assessmentId) {
      return res.status(404).json({ error: 'Attempt session not found.' });
    }

    if (attemptDoc.userId !== userEmail) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    const assessmentDoc = await Assessment.findById(assessmentId);
    if (!assessmentDoc) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }

    // Retrieve full questions (including answers) for grading
    const questions = await AssessmentQuestion.find({ assessmentId }).sort({ order: 1 });

    // Validate submitted question IDs belong to the assessment
    const questionIdsInDb = questions.map(q => q._id.toString());
    const submittedIds = answers.map(a => String(a.questionId));
    
    // Check duplicates in submission
    const duplicateCheck = new Set(submittedIds);
    if (duplicateCheck.size !== submittedIds.length) {
      return res.status(400).json({ error: 'Duplicate question answers submitted.' });
    }

    const hasUnknownId = submittedIds.some(id => !questionIdsInDb.includes(id));
    if (hasUnknownId) {
      return res.status(400).json({ error: 'Submitted answers contain unknown question IDs.' });
    }

    // Rolling adaptive difficulty window progression logic
    const windowSize = 3;
    let currentDifficulty = assessmentDoc.difficulty;
    const difficultyProgression = [];
    const windowResults = [];

    const gradedQuestions = [];
    let earnedPoints = 0;
    let maxPoints = 0;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userAnsObj = answers.find(a => a.questionId.toString() === q._id.toString());
      const userAnswer = userAnsObj ? userAnsObj.answer : null;

      let gradeResult = gradeObjectiveAnswer(q, userAnswer);
      if (!gradeResult) {
        // Level 3 Subjective grading fallback
        let correct = false;
        let pointsEarned = 0;
        let feedback = 'Incorrect response.';

        const cleanAnswer = String(userAnswer || '').trim().toLowerCase();
        const expectedAnswer = String(q.correctAnswer).trim().toLowerCase();

        if (cleanAnswer && expectedAnswer && (cleanAnswer.includes(expectedAnswer) || expectedAnswer.includes(cleanAnswer))) {
          correct = true;
          pointsEarned = q.points;
          feedback = 'Correct subjective explanation!';
        } else if (cleanAnswer.length > 5) {
          correct = true;
          pointsEarned = Math.round(q.points * 0.5);
          feedback = 'Partial credit granted for subjective explanation.';
        }

        gradeResult = { correct, pointsEarned, feedback };
      }

      difficultyProgression.push(currentDifficulty);
      windowResults.push(gradeResult.correct);
      
      if (windowResults.length > windowSize) {
        windowResults.shift(); // slide rolling window
      }

      if (windowResults.length === windowSize) {
        const correctCount = windowResults.filter(c => c === true).length;
        if (correctCount === windowSize) {
          if (currentDifficulty === 'beginner') currentDifficulty = 'intermediate';
          else if (currentDifficulty === 'intermediate') currentDifficulty = 'advanced';
        } else if (correctCount <= 1) {
          if (currentDifficulty === 'advanced') currentDifficulty = 'intermediate';
          else if (currentDifficulty === 'intermediate') currentDifficulty = 'beginner';
        }
      }

      earnedPoints += gradeResult.pointsEarned;
      maxPoints += q.points;

      gradedQuestions.push({
        questionId: q._id,
        questionVersion: q.questionVersion,
        answer: userAnswer,
        correct: gradeResult.correct,
        pointsEarned: gradeResult.pointsEarned,
        feedback: gradeResult.feedback,
        difficulty: q.difficulty
      });
    }

    const percentage = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;
    const passed = percentage >= assessmentDoc.passingScore;

    // Update attempt details
    attemptDoc.answers = answers;
    attemptDoc.score = percentage;
    attemptDoc.earnedPoints = earnedPoints;
    attemptDoc.maximumPoints = maxPoints;
    attemptDoc.percentage = percentage;
    attemptDoc.difficultyProgression = difficultyProgression;
    attemptDoc.submittedAt = new Date();
    attemptDoc.result = passed ? 'passed' : 'failed';
    attemptDoc.questionResults = gradedQuestions;

    await attemptDoc.save();

    // Update parent assessment counters
    assessmentDoc.attemptCount += 1;
    assessmentDoc.currentScore = percentage;
    assessmentDoc.bestScore = Math.max(assessmentDoc.bestScore || 0, percentage);
    assessmentDoc.status = passed ? 'passed' : 'failed';
    assessmentDoc.completedAt = new Date();

    await assessmentDoc.save();

    // Compute skill performance breakdown
    const skillIds = assessmentDoc.skillIds;
    const skillBreakdown = {};
    skillIds.forEach(sid => {
      skillBreakdown[sid] = {
        skillId: sid,
        questionsAttempted: 0,
        correct: 0,
        earnedPoints: 0,
        maximumPoints: 0,
        percentage: 0,
        level: 'Needs Foundation'
      };
    });

    gradedQuestions.forEach(gr => {
      const q = questions.find(qu => qu._id.toString() === gr.questionId.toString());
      if (q && skillBreakdown[q.skillId]) {
        const sb = skillBreakdown[q.skillId];
        sb.questionsAttempted += 1;
        if (gr.correct) sb.correct += 1;
        sb.earnedPoints += gr.pointsEarned;
        sb.maximumPoints += q.points;
      }
    });

    Object.keys(skillBreakdown).forEach(sid => {
      const sb = skillBreakdown[sid];
      sb.percentage = sb.maximumPoints > 0 ? Math.round((sb.earnedPoints / sb.maximumPoints) * 100) : 0;

      if (sb.percentage >= 90) sb.level = 'Advanced';
      else if (sb.percentage >= 75) sb.level = 'Strong';
      else if (sb.percentage >= 60) sb.level = 'Competent';
      else if (sb.percentage >= 40) sb.level = 'Developing';
      else sb.level = 'Needs Foundation';
    });

    return res.status(200).json({
      attempt: attemptDoc,
      questionResults: gradedQuestions.map(gr => {
        const q = questions.find(qu => qu._id.toString() === gr.questionId.toString());
        return {
          questionId: gr.questionId,
          question: q.question,
          type: q.type,
          options: q.options,
          answer: gr.answer,
          correctAnswer: q.correctAnswer,
          correct: gr.correct,
          pointsEarned: gr.pointsEarned,
          explanation: q.explanation,
          feedback: gr.feedback,
          difficulty: gr.difficulty
        };
      }),
      skillPerformance: Object.values(skillBreakdown)
    });
  } catch (error) {
    console.error('[CONTROLLER] Submit assessment attempt failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit attempt.' });
  }
};

/**
 * Controller to get latest completed attempt results
 */
export const getAssessmentResults = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userEmail = req.user.email;

    if (!assessmentId || !mongoose.Types.ObjectId.isValid(assessmentId)) {
      return res.status(400).json({ error: 'Invalid or missing assessmentId.' });
    }

    const latestAttempt = await AssessmentAttempt.findOne({ assessmentId, userId: userEmail, submittedAt: { $exists: true } })
      .sort({ submittedAt: -1 });

    if (!latestAttempt) {
      return res.status(404).json({ error: 'No submitted attempts found for this assessment.' });
    }

    return res.status(200).json(latestAttempt);
  } catch (error) {
    console.error('[CONTROLLER] Get assessment results failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve assessment results.' });
  }
};

/**
 * Controller to get attempt history
 */
export const getAssessmentAttempts = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userEmail = req.user.email;

    if (!assessmentId || !mongoose.Types.ObjectId.isValid(assessmentId)) {
      return res.status(400).json({ error: 'Invalid or missing assessmentId.' });
    }

    const attempts = await AssessmentAttempt.find({ assessmentId, userId: userEmail })
      .sort({ startedAt: -1 });

    return res.status(200).json(attempts);
  } catch (error) {
    console.error('[CONTROLLER] Get assessment attempts failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve assessment attempts.' });
  }
};
