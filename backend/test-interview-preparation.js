import mongoose from 'mongoose';
import Roadmap from './src/models/roadmap.model.js';
import CompanyIntelligence from './src/models/companyIntelligence.model.js';
import InterviewPrep from './src/models/interviewPrep.model.js';
import InterviewSimulation from './src/models/interviewSimulation.model.js';
import { SavedJob } from './src/models/savedJob.model.js';
import SkillVerification from './src/models/skillVerification.model.js';
import { getOrGenerateCompanyIntelligence, normalizeContextKey } from './src/services/roadmap/companyIntelligence.service.js';
import { getOrGenerateInterviewPrep, startInterviewSimulation, respondToSimulationQuestion, completeInterviewSimulation } from './src/services/roadmap/interviewPrep.service.js';
import { config } from './src/config/env.js';

let passed = 0;
let failed = 0;

const assert = (condition, message) => {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
};

const runTests = async () => {
  console.log('==================================================');
  console.log('STARTING MODULE 16 — COMPANY INTELLIGENCE & INTERVIEW PREPARATION TESTS');
  console.log('==================================================\n');

  try {
    await mongoose.connect(config.mongoUri);
    console.log('[DATABASE] Connected to MongoDB.');

    // Cleanup test data
    const userA = 'test-user-a@careermapper.app';
    const userB = 'test-user-b@careermapper.app';

    await Roadmap.deleteMany({ userId: { $in: [userA, userB] } });
    await CompanyIntelligence.deleteMany({ company: { $in: ['Amazon', 'Tesla', 'CivilCorp', 'GoldmanSachs', 'Nike', 'CustomFirm'] } });
    await InterviewPrep.deleteMany({ userId: { $in: [userA, userB] } });
    await InterviewSimulation.deleteMany({ userId: { $in: [userA, userB] } });
    await SavedJob.deleteMany({ userEmail: { $in: [userA, userB] } });

    await InterviewPrep.collection.dropIndexes().catch(() => {});
    await CompanyIntelligence.collection.dropIndexes().catch(() => {});

    // Test 1: Context Key Normalization
    const key1 = normalizeContextKey('Amazon ', 'Software Engineer ', 'Software');
    const key2 = normalizeContextKey('amazon', 'software engineer', 'software');
    assert(key1 === key2, 'Test 1: Context keys normalize deterministically to lowercase');

    // Test 2: Software Engineer Preparation
    const roadmapSoftware = await Roadmap.create({
      userId: userA,
      company: 'Amazon',
      targetRole: 'Software Engineer',
      domain: 'Software',
      skills: [{ canonicalId: 'javascript', displayName: 'JavaScript', category: 'Language' }]
    });

    const prepSoftware = await getOrGenerateInterviewPrep(roadmapSoftware._id, userA, false);
    assert(prepSoftware.company === 'Amazon', 'Test 2: Target company is Amazon');
    assert(prepSoftware.preparationMatrix.length > 0, 'Test 2: Preparation matrix generated');
    assert(prepSoftware.topics.length > 0, 'Test 2: Domain-specific topics generated');

    // Test 3: Mechanical Engineer Preparation
    const roadmapMech = await Roadmap.create({
      userId: userA,
      company: 'Tesla',
      targetRole: 'Mechanical Engineer',
      domain: 'Mechanical Engineering'
    });
    const prepMech = await getOrGenerateInterviewPrep(roadmapMech._id, userA, true);
    assert(prepMech.domain === 'Mechanical Engineering', 'Test 3: Domain correctly mapped to Mechanical Engineering');
    assert(prepMech.topics.some(t => t.title.includes('CAD') || t.title.includes('Manufacturing')), 'Test 3: Topics adapt to Mechanical domain (CAD/Manufacturing)');

    // Test 4: Civil Engineer Preparation
    const roadmapCivil = await Roadmap.create({
      userId: userA,
      company: 'CivilCorp',
      targetRole: 'Structural Engineer',
      domain: 'Civil Engineering'
    });
    const prepCivil = await getOrGenerateInterviewPrep(roadmapCivil._id, userA, true);
    assert(prepCivil.domain === 'Civil Engineering', 'Test 4: Domain correctly mapped to Civil Engineering');

    // Test 5: Finance Domain Preparation
    const roadmapFinance = await Roadmap.create({
      userId: userA,
      company: 'GoldmanSachs',
      targetRole: 'Financial Analyst',
      domain: 'Finance'
    });
    const prepFinance = await getOrGenerateInterviewPrep(roadmapFinance._id, userA, true);
    assert(prepFinance.topics.some(t => t.title.includes('Financial Modeling') || t.title.includes('Valuation')), 'Test 5: Topics adapt to Finance domain (Financial Modeling)');

    // Test 6: Marketing Domain Preparation
    const roadmapMarketing = await Roadmap.create({
      userId: userA,
      company: 'Nike',
      targetRole: 'Marketing Strategist',
      domain: 'Marketing'
    });
    const prepMarketing = await getOrGenerateInterviewPrep(roadmapMarketing._id, userA, true);
    assert(prepMarketing.domain === 'Marketing', 'Test 6: Marketing domain prep created');

    // Test 7: Data Science Domain Preparation
    const roadmapDS = await Roadmap.create({
      userId: userA,
      company: 'Amazon',
      targetRole: 'Data Scientist',
      domain: 'Data Science'
    });
    const prepDS = await getOrGenerateInterviewPrep(roadmapDS._id, userA, true);
    assert(prepDS.domain === 'Data Science', 'Test 7: Data Science domain prep created');

    // Test 8: Custom / Unknown Domain Fallback
    const roadmapCustom = await Roadmap.create({
      userId: userA,
      company: 'CustomFirm',
      targetRole: 'Acoustic Specialist',
      domain: 'Custom Noise Dynamics'
    });
    const prepCustom = await getOrGenerateInterviewPrep(roadmapCustom._id, userA, true);
    assert(prepCustom.readinessScore.overall > 0, 'Test 8: Custom/Unknown domain generates fallback prep deterministically without failing');

    // Test 9: Company Intelligence Cache Reuse
    const intel1 = await getOrGenerateCompanyIntelligence('Amazon', 'Software Engineer', 'Software', false);
    const intel2 = await getOrGenerateCompanyIntelligence('Amazon', 'Software Engineer', 'Software', false);
    assert(intel1._id.toString() === intel2._id.toString(), 'Test 9: Company intelligence is reused from cache on identical context');

    // Test 10: Cache Isolation (Amazon + Software vs Amazon + Finance)
    const intelFinance = await getOrGenerateCompanyIntelligence('Amazon', 'Financial Analyst', 'Finance', false);
    assert(intel1.contextKey !== intelFinance.contextKey, 'Test 10: Cache keys isolate Amazon + Software vs Amazon + Finance');

    // Test 11: User Preparation Isolation (User A vs User B)
    const roadmapB = await Roadmap.create({
      userId: userB,
      company: 'Amazon',
      targetRole: 'Software Engineer',
      domain: 'Software'
    });
    const prepUserB = await getOrGenerateInterviewPrep(roadmapB._id, userB, false);
    assert(prepUserB.userId === userB, 'Test 11: Preparation document is user-scoped');
    assert(prepSoftware.userId === userA, 'Test 11: User A preparation is strictly isolated from User B');

    // Test 12: Question Sanitization (correctAnswer & evaluationCriteria stripped for frontend)
    assert(prepSoftware.questionBank.every(q => q.correctAnswer === undefined && q.evaluationCriteria === undefined), 'Test 12: Question bank sanitizes hidden answer keys');

    // Test 13: Simulation Start & Adaptive Session
    const simSession = await startInterviewSimulation(roadmapSoftware._id, userA, 'Mixed');
    assert(simSession.status === 'in_progress', 'Test 13: Simulation session started in in_progress status');
    assert(simSession.currentDifficulty === 'intermediate', 'Test 13: Simulation starts at intermediate difficulty');

    // Test 14: Simulation Response Submission
    const firstQ = simSession.questions[0];
    const res1 = await respondToSimulationQuestion(simSession._id, userA, firstQ.questionId, 'Scalability, reliability, and standards compliance');
    assert(res1.score > 0, 'Test 14: Simulation response graded successfully');
    assert(res1.isCorrect === true, 'Test 14: Correct answer recognized');

    // Test 15: Simulation Completion & Score Summary
    const completedSim = await completeInterviewSimulation(simSession._id, userA);
    assert(completedSim.status === 'completed', 'Test 15: Simulation marked as completed');
    assert(completedSim.scoreSummary.overallScore > 0, 'Test 15: Overall simulation score computed');

    // Test 16: Saved Job Integration Linkage
    const savedJobDoc = await SavedJob.create({
      userEmail: userA,
      company: 'Amazon',
      title: 'Senior Backend Developer',
      jobId: 'job-12345',
      source: 'JSearch'
    });
    assert(savedJobDoc._id, 'Test 16: Saved job created successfully');

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    await mongoose.disconnect();
    console.log('\n==================================================');
    console.log(`TEST RUN COMPLETED: ${passed} PASSES, ${failed} FAILURES`);
    console.log('==================================================');
    if (failed > 0) process.exit(1);
  }
};

runTests();
