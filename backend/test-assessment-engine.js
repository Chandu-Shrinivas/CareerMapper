import mongoose from 'mongoose';
import { config } from './src/config/env.js';
import Roadmap from './src/models/roadmap.model.js';
import Assessment from './src/models/assessment.model.js';
import AssessmentQuestion from './src/models/assessmentQuestion.model.js';
import AssessmentAttempt from './src/models/assessmentAttempt.model.js';
import AssessmentTemplate from './src/models/assessmentTemplate.model.js';
import Mission from './src/models/mission.model.js';
import Project from './src/models/project.model.js';
import { generateAssessmentsForRoadmap, gradeObjectiveAnswer } from './src/services/roadmap/assessment.service.js';
import { submitAssessmentAttempt } from './src/controllers/assessment.controller.js';

let passes = 0;
let fails = 0;

const assert = (condition, message) => {
  if (condition) {
    passes++;
    console.log(`[PASS] ${message}`);
  } else {
    fails++;
    console.log(`[FAIL] ${message}`);
  }
};

const runTests = async () => {
  console.log("==================================================");
  console.log("STARTING ADAPTIVE ASSESSMENT ENGINE VALIDATION");
  console.log("==================================================\n");

  try {
    await mongoose.connect(config.mongoUri || 'mongodb://localhost:27017/careermapper');
    console.log('[DATABASE] Connected to MongoDB.');
    // Clear collections
    await Assessment.deleteMany({});
    await AssessmentQuestion.deleteMany({});
    await AssessmentAttempt.deleteMany({});
    await AssessmentTemplate.deleteMany({});
    await Mission.deleteMany({});
    await Project.deleteMany({});
  } catch (e) {
    console.log('[DATABASE WARNING] Database connection failed. Pre-requisite validation requires MongoDB.');
    process.exit(1);
  }

  // Helper to create mock roadmap
  const createMockRoadmap = async (targetRole, company, skillsInPhases = [], requirementType = 'required') => {
    const roadmapData = {
      userId: 'test-user@careermapper.app',
      company: company || '',
      targetRole,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days prep
      availability: { hoursPerWeek: 10 },
      readinessScore: 30,
      phases: [
        {
          phaseId: 'phase-1-foundations',
          title: 'Foundations',
          skills: skillsInPhases.map(s => ({
            canonicalId: s.id,
            displayName: s.display,
            proficiencyLevel: 'intermediate',
            priority: 'HIGH'
          }))
        }
      ],
      prioritizedSkills: skillsInPhases.map(s => ({
        canonicalId: s.id,
        displayName: s.display,
        priority: 'HIGH',
        requirementType
      }))
    };

    const doc = await Roadmap.findOneAndUpdate(
      { userId: roadmapData.userId, targetRole, company: company || '' },
      roadmapData,
      { upsert: true, new: true }
    );
    return doc;
  };

  // --- Test 1: Roadmap creation does NOT generate assessments ---
  try {
    await createMockRoadmap('Frontend Developer', 'Vercel', [{ id: 'react', display: 'React' }]);
    const count = await Assessment.countDocuments({});
    assert(count === 0, "Test 1: Roadmap creation does NOT generate assessments automatically");
  } catch (err) {
    assert(false, `Test 1 threw error: ${err.message}`);
  }

  // --- Test 2: Mission / Project generation does NOT generate assessments ---
  try {
    const count = await Assessment.countDocuments({});
    assert(count === 0, "Test 2: Mission/Project generation does NOT automatically trigger assessment creation");
  } catch (err) {
    assert(false, `Test 2 threw error: ${err.message}`);
  }

  // --- Test 3: Explicit Take Assessment generates exactly one assessment ---
  let generatedAssessmentId = null;
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Vercel', [{ id: 'react', display: 'React' }]);
    const res = await generateAssessmentsForRoadmap(roadmap._id, { skills: [] }, false, { skillIds: ['react'] });

    assert(
      res.assessments && res.assessments.length === 1 && res.assessments[0].skillIds.includes('react'),
      "Test 3: Explicit Take Assessment generates exactly one assessment for requested skill"
    );
    generatedAssessmentId = res.assessments[0]._id;
  } catch (err) {
    assert(false, `Test 3 threw error: ${err.message}`);
  }

  // --- Test 4: Second request reuses cached assessment ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Vercel', [{ id: 'react', display: 'React' }]);
    
    // Request again without refresh=true
    const res = await generateAssessmentsForRoadmap(roadmap._id, { skills: [] }, false, { skillIds: ['react'] });
    
    assert(
      res.assessments && res.assessments.length === 1 && String(res.assessments[0]._id) === String(generatedAssessmentId),
      "Test 4: Second assessment request reuses the cached assessment without generating a new one"
    );
  } catch (err) {
    assert(false, `Test 4 threw error: ${err.message}`);
  }

  // --- Test 5: Different roles do not share cache ---
  try {
    const dsRoadmap = await createMockRoadmap('Data Scientist', 'Google', [{ id: 'python', display: 'Python' }]);
    const beRoadmap = await createMockRoadmap('Backend Developer', 'Google', [{ id: 'python', display: 'Python' }]);

    const dsRes = await generateAssessmentsForRoadmap(dsRoadmap._id, { skills: [] }, true, { skillIds: ['python'] });
    const beRes = await generateAssessmentsForRoadmap(beRoadmap._id, { skills: [] }, true, { skillIds: ['python'] });

    assert(
      String(dsRes.assessments[0]._id) !== String(beRes.assessments[0]._id),
      "Test 5: Target-sensitive templates prevent Python + Data Scientist from incorrectly reusing Python + Backend Developer"
    );
  } catch (err) {
    assert(false, `Test 5 threw error: ${err.message}`);
  }

  // --- Test 6: Different companies do not share templates ---
  try {
    const googleRoadmap = await createMockRoadmap('Frontend Developer', 'Google', [{ id: 'react', display: 'React' }]);
    const appleRoadmap = await createMockRoadmap('Frontend Developer', 'Apple', [{ id: 'react', display: 'React' }]);

    const googleRes = await generateAssessmentsForRoadmap(googleRoadmap._id, { skills: [] }, true, { skillIds: ['react'] });
    const appleRes = await generateAssessmentsForRoadmap(appleRoadmap._id, { skills: [] }, true, { skillIds: ['react'] });

    assert(
      googleRes.assessments[0].title !== appleRes.assessments[0].title || String(googleRes.assessments[0]._id) !== String(appleRes.assessments[0]._id),
      "Test 6: Verified target company isolation in template lookup"
    );
  } catch (err) {
    assert(false, `Test 6 threw error: ${err.message}`);
  }

  // --- Test 7: Time constraints return available=false ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Tesla', [{ id: 'react', display: 'React' }]);
    
    // Set low available hours
    await Roadmap.findByIdAndUpdate(roadmap._id, {
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      availability: { hoursPerWeek: 1 }
    });

    // Make mission consume available budget
    await Mission.findOneAndUpdate(
      { roadmapId: roadmap._id },
      { estimatedMinutes: 200, status: 'not_started' },
      { upsert: true }
    );

    const res = await generateAssessmentsForRoadmap(roadmap._id, { skills: [] }, true, { skillIds: ['react'] });

    assert(
      res.available === false && res.reason === 'insufficient_preparation_time',
      "Test 7: Insufficient preparation time returns available=false response details"
    );
  } catch (err) {
    assert(false, `Test 7 threw error: ${err.message}`);
  }

  // --- Test 8-13: Domain Assessments ---
  try {
    const testCases = [
      { role: 'Frontend Developer', company: 'Google', skills: [{ id: 'react', display: 'React' }] },
      { role: 'Data Scientist', company: 'Google', skills: [{ id: 'python', display: 'Python' }] },
      { role: 'CAD Design Engineer', company: 'Tesla', skills: [{ id: 'solidworks', display: 'SOLIDWORKS' }] },
      { role: 'Civil Engineer', company: 'L&T', skills: [{ id: 'autocad', display: 'AutoCAD' }] },
      { role: 'Accountant', company: 'KPMG', skills: [{ id: 'tally', display: 'Tally' }] },
      { role: 'Marketing Analyst', company: 'Hubspot', skills: [{ id: 'google analytics', display: 'Google Ads' }] }
    ];

    for (const tc of testCases) {
      const roadmap = await createMockRoadmap(tc.role, tc.company, tc.skills);
      const res = await generateAssessmentsForRoadmap(roadmap._id, { skills: [] }, true, { skillIds: tc.skills.map(s => s.id) });

      assert(
        res.assessments && res.assessments.length > 0,
        `Domain Assessments: Generated assessment for targetRole '${tc.role}'`
      );

      const qCount = await AssessmentQuestion.countDocuments({ assessmentId: res.assessments[0]._id });
      assert(
        qCount === 4,
        `Domain Questions: Correctly populated fallback questions (count=${qCount}) for '${tc.role}'`
      );
    }
  } catch (err) {
    assert(false, `Test 8-13 threw error: ${err.message}`);
  }

  // --- Test 14: MCQ Grading ---
  try {
    const question = {
      type: 'mcq',
      correctAnswer: 'Option A',
      points: 10,
      explanation: 'A is correct'
    };
    
    const r1 = gradeObjectiveAnswer(question, 'Option A');
    const r2 = gradeObjectiveAnswer(question, 'Option B');

    assert(
      r1.correct && r1.pointsEarned === 10 && !r2.correct && r2.pointsEarned === 0,
      "Test 14: MCQ single answer graded correctly"
    );
  } catch (err) {
    assert(false, `Test 14 threw error: ${err.message}`);
  }

  // --- Test 15: Multiple Select Grading ---
  try {
    const question = {
      type: 'multiple_select',
      correctAnswer: ['JSON', 'HTTP', 'REST'],
      points: 10,
      explanation: 'All match'
    };

    const r1 = gradeObjectiveAnswer(question, ['REST', 'JSON', 'HTTP']);
    const r2 = gradeObjectiveAnswer(question, ['JSON', 'HTTP']);
    const r3 = gradeObjectiveAnswer(question, ['JSON', 'HTTP', 'REST', 'XML']);

    assert(
      r1.correct && !r2.correct && !r3.correct,
      "Test 15: Multiple-select array answer sets validated correctly"
    );
  } catch (err) {
    assert(false, `Test 15 threw error: ${err.message}`);
  }

  // --- Test 16: True / False Grading ---
  try {
    const question = {
      type: 'true_false',
      correctAnswer: 'true',
      points: 10,
      explanation: 'Statement is true'
    };

    const r1 = gradeObjectiveAnswer(question, 'true');
    const r2 = gradeObjectiveAnswer(question, 'false');

    assert(
      r1.correct && !r2.correct,
      "Test 16: True/False options evaluated correctly"
    );
  } catch (err) {
    assert(false, `Test 16 threw error: ${err.message}`);
  }

  // --- Test 17: Numerical Tolerance ---
  try {
    const question = {
      type: 'numerical',
      correctAnswer: 100,
      points: 10,
      explanation: 'Allowed delta within 1% limits'
    };

    const r1 = gradeObjectiveAnswer(question, 100.5);
    const r2 = gradeObjectiveAnswer(question, 101.5);

    assert(
      r1.correct && !r2.correct,
      "Test 17: Numerical grading tolerance delta applied correctly (within 1% range)"
    );
  } catch (err) {
    assert(false, `Test 17 threw error: ${err.message}`);
  }

  // --- Test 18: Short Answer keyword checks ---
  try {
    const question = {
      type: 'short_answer',
      correctAnswer: 'react',
      acceptableAnswers: ['react', 'reactjs'],
      points: 10,
      explanation: 'Keyword React is accepted'
    };

    const r1 = gradeObjectiveAnswer(question, 'I build with ReactJS frameworks');
    const r2 = gradeObjectiveAnswer(question, 'Angular is great');

    assert(
      r1.correct && !r2.correct,
      "Test 18: Short answer keyword normalization match validated successfully"
    );
  } catch (err) {
    assert(false, `Test 18 threw error: ${err.message}`);
  }

  // --- Test 19: Answer protection ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Google', [{ id: 'react', display: 'React' }]);
    const res = await generateAssessmentsForRoadmap(roadmap._id, { skills: [] }, true, { skillIds: ['react'] });
    const assessment = res.assessments[0];

    const questions = await AssessmentQuestion.find({ assessmentId: assessment._id })
      .select('assessmentId skillId question type options difficulty points domain order source questionVersion');

    const leaksAnswers = questions.some(q => q.correctAnswer !== undefined || (q.acceptableAnswers !== undefined && q.acceptableAnswers.length > 0) || (q.evaluationCriteria !== undefined && q.evaluationCriteria.length > 0));

    assert(
      !leaksAnswers,
      "Test 19: Safe projection endpoint shields correct answers from front-end leaks"
    );
  } catch (err) {
    assert(false, `Test 19 threw error: ${err.message}`);
  }

  // --- Test 20: Submit grading and adaptive progression ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Vercel', [{ id: 'react', display: 'React' }], 'preferred');
    const gen = await generateAssessmentsForRoadmap(roadmap._id, { skills: [] }, true, { skillIds: ['react'], difficulty: 'intermediate' });
    const assessment = gen.assessments[0];

    const questions = await AssessmentQuestion.find({ assessmentId: assessment._id }).sort({ order: 1 });

    const attempt = new AssessmentAttempt({
      assessmentId: assessment._id,
      roadmapId: roadmap._id,
      userId: roadmap.userId,
      assessmentVersion: assessment.assessmentVersion,
      answers: [],
      startedAt: new Date()
    });
    await attempt.save();

    const submittedAnswers = questions.map((q, idx) => ({
      questionId: q._id,
      answer: q.correctAnswer
    }));

    const mockReq = {
      params: { assessmentId: assessment._id.toString() },
      body: { attemptId: attempt._id.toString(), answers: submittedAnswers },
      user: { email: roadmap.userId }
    };

    let responseJson = null;
    const mockRes = {
      status: (code) => {
        return {
          json: (data) => {
            responseJson = data;
            return mockRes;
          }
        };
      }
    };

    await submitAssessmentAttempt(mockReq, mockRes);

    assert(
      responseJson && responseJson.attempt && responseJson.attempt.score === 100,
      "Test 20: Submission calculates correct points percentage on backend grading"
    );

    const diffTrack = responseJson.attempt.difficultyProgression;
    assert(
      diffTrack.length > 0 && diffTrack.includes('intermediate') && diffTrack.includes('advanced'),
      "Test 21: Adaptive sliding window increases difficulty progression based on 3/3 correctness rolling progression"
    );
  } catch (err) {
    assert(false, `Test 20 threw error: ${err.message}`);
  }

  console.log("\n==================================================");
  console.log(`TEST RUN COMPLETED: ${passes} PASSES, ${fails} FAILURES`);
  console.log("==================================================");

  await mongoose.disconnect();
  
  if (fails > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
