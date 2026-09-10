import mongoose from 'mongoose';
import { config } from './src/config/env.js';
import Roadmap from './src/models/roadmap.model.js';
import SkillVerification from './src/models/skillVerification.model.js';
import Mission from './src/models/mission.model.js';
import Project from './src/models/project.model.js';
import Evidence from './src/models/evidence.model.js';
import EvidenceAnalysis from './src/models/evidenceAnalysis.model.js';
import Assessment from './src/models/assessment.model.js';
import AssessmentAttempt from './src/models/assessmentAttempt.model.js';
import { calculateVerificationScore, analyzeEvidenceRelevance } from './src/services/roadmap/verification.service.js';

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
  console.log("STARTING SKILL VERIFICATION & CONFIDENCE VALIDATION");
  console.log("==================================================\n");

  try {
    await mongoose.connect(config.mongoUri || 'mongodb://localhost:27017/careermapper');
    console.log('[DATABASE] Connected to MongoDB.');
    // Clear collections
    await SkillVerification.deleteMany({});
    await Mission.deleteMany({});
    await Project.deleteMany({});
    await Evidence.deleteMany({});
    await EvidenceAnalysis.deleteMany({});
    await Assessment.deleteMany({});
    await AssessmentAttempt.deleteMany({});
  } catch (e) {
    console.log('[DATABASE WARNING] Database offline. Pre-requisite validation requires MongoDB.');
    process.exit(1);
  }

  // Helper to create mock roadmap
  const createMockRoadmap = async (targetRole, company, skillsInPhases = []) => {
    const roadmapData = {
      userId: 'test-user@careermapper.app',
      company: company || '',
      targetRole,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
        requirementType: 'required'
      }))
    };

    const doc = await Roadmap.findOneAndUpdate(
      { userId: roadmapData.userId, targetRole, company: company || '' },
      roadmapData,
      { upsert: true, new: true }
    );
    return doc;
  };

  // --- Test 1: Skill with no activity -> UNVERIFIED (score = 0) ---
  let roadmap = null;
  try {
    roadmap = await createMockRoadmap('Frontend Developer', 'Vercel', [{ id: 'react', display: 'React' }]);
    const score = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    
    assert(
      score.confidenceScore === 0 && score.verificationStatus === 'UNVERIFIED',
      "Test 1: Skill with no activity correctly resolves to score=0 and status='UNVERIFIED'"
    );
  } catch (err) {
    assert(false, `Test 1 threw error: ${err.message}`);
  }

  // --- Test 2: Mission completion scoring ---
  try {
    // 2 missions total, 1 completed
    const m1 = new Mission({
      roadmapId: roadmap._id,
      skillId: 'react',
      title: 'Mission 1',
      description: 'React fundamentals',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 30,
      xp: 100,
      priority: 'HIGH',
      status: 'completed'
    });
    const m2 = new Mission({
      roadmapId: roadmap._id,
      skillId: 'react',
      title: 'Mission 2',
      description: 'React advanced',
      type: 'practice',
      difficulty: 'intermediate',
      estimatedMinutes: 45,
      xp: 150,
      priority: 'HIGH',
      status: 'not_started'
    });
    await m1.save();
    await m2.save();

    const score = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    
    assert(
      score.missionCompletionPercentage === 50 && score.confidenceBreakdown.missions.score === 50,
      "Test 2: Mission completion percentage scored correctly (50%)"
    );
  } catch (err) {
    assert(false, `Test 2 threw error: ${err.message}`);
  }

  // --- Test 3-4: Project completion and verification scoring ---
  try {
    const p1 = new Project({
      roadmapId: roadmap._id,
      userId: 'test-user@careermapper.app',
      skillIds: ['react'],
      title: 'Project 1',
      description: 'Build dashboard',
      domain: 'Software Engineering',
      targetRole: 'Frontend Developer',
      difficulty: 'intermediate',
      type: 'practical_project',
      estimatedMinutes: 120,
      priority: 'HIGH',
      selectionStatus: 'active',
      status: 'completed'
    });
    await p1.save();

    const score1 = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    assert(
      score1.projectCompletionPercentage === 100 && score1.confidenceBreakdown.projects.score === 80,
      "Test 3: Completed project yields score of 80"
    );

    // Update status to verified
    await Project.findByIdAndUpdate(p1._id, { status: 'verified' });
    const score2 = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    assert(
      score2.confidenceBreakdown.projects.score === 100,
      "Test 4: Verified project yields score of 100"
    );
  } catch (err) {
    assert(false, `Test 3-4 threw error: ${err.message}`);
  }

  // --- Test 5-7: Evidence status scoring (verified, accepted, pending, rejected) ---
  try {
    const project = await Project.findOne({ roadmapId: roadmap._id });
    
    // 1. Accepted evidence
    const e1 = new Evidence({
      userId: 'test-user@careermapper.app',
      roadmapId: roadmap._id,
      projectId: project._id,
      skillIds: ['react'],
      type: 'github_repo',
      title: 'Repository 1',
      description: 'React code submission',
      url: 'https://github.com/test/repo-1',
      verificationStatus: 'accepted'
    });
    await e1.save();

    const score1 = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    assert(
      score1.confidenceBreakdown.evidence.score === 85,
      "Test 5: Accepted evidence yields score of 85"
    );

    // 2. Verified evidence
    await Evidence.findByIdAndUpdate(e1._id, { verificationStatus: 'verified' });
    const score2 = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    assert(
      score2.confidenceBreakdown.evidence.score === 100,
      "Test 6: Verified evidence yields score of 100"
    );

    // 3. Rejected evidence
    await Evidence.findByIdAndUpdate(e1._id, { verificationStatus: 'rejected' });
    const score3 = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    assert(
      score3.confidenceBreakdown.evidence.score === 0,
      "Test 7: Rejected evidence yields score of 0"
    );

    // Clean up evidence status to accepted for subsequent tests
    await Evidence.findByIdAndUpdate(e1._id, { verificationStatus: 'accepted' });
  } catch (err) {
    assert(false, `Test 5-7 threw error: ${err.message}`);
  }

  // --- Test 8-9: Assessment score integration & best attempt selection ---
  try {
    const assessment = new Assessment({
      roadmapId: roadmap._id,
      userId: 'test-user@careermapper.app',
      skillIds: ['react'],
      targetRole: 'Frontend Developer',
      company: 'Vercel',
      domain: 'Software Engineering',
      title: 'React Assessment',
      description: 'Test react proficiency',
      type: 'mixed',
      difficulty: 'intermediate',
      estimatedMinutes: 30,
      passingScore: 70,
      status: 'completed'
    });
    await assessment.save();

    // Attempt 1: score 60
    const at1 = new AssessmentAttempt({
      assessmentId: assessment._id,
      roadmapId: roadmap._id,
      userId: 'test-user@careermapper.app',
      assessmentVersion: 1,
      answers: [],
      score: 60,
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    });
    // Attempt 2: score 80
    const at2 = new AssessmentAttempt({
      assessmentId: assessment._id,
      roadmapId: roadmap._id,
      userId: 'test-user@careermapper.app',
      assessmentVersion: 1,
      answers: [],
      score: 80,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    });
    await at1.save();
    await at2.save();

    const score = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    
    assert(
      score.bestAssessmentScore === 80 && score.latestAssessmentScore === 80,
      "Test 8: Best assessment attempt chosen (80% score)"
    );
  } catch (err) {
    assert(false, `Test 8-9 threw error: ${err.message}`);
  }

  // --- Test 10: Recency calculation ---
  try {
    // Modify attempts submitted dates to older date (e.g. 50 days ago)
    await AssessmentAttempt.updateMany({}, {
      submittedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)
    }, { timestamps: false });
    await Mission.updateMany({}, { updatedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000) }, { timestamps: false });
    await Project.updateMany({}, { updatedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000) }, { timestamps: false });
    await Evidence.updateMany({}, { updatedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000) }, { timestamps: false });

    const score = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    
    assert(
      score.confidenceBreakdown.recency.score === 85,
      "Test 10: Recency score scales down to 85 for activities older than 30 days but within 90 days"
    );
  } catch (err) {
    assert(false, `Test 10 threw error: ${err.message}`);
  }

  // --- Test 11-12: Final confidence and classification thresholds ---
  try {
    // Force active dates back to recent to get full recency score (100)
    await AssessmentAttempt.updateMany({}, { submittedAt: new Date() }, { timestamps: false });
    
    const score = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    
    // Formula check:
    // assessment (80 * 0.35 = 28)
    // projects (100 * 0.25 = 25)
    // evidence (85 * 0.20 = 17)
    // missions (50 * 0.10 = 5)
    // recency (100 * 0.10 = 10)
    // total = 85
    
    assert(
      score.confidenceScore === 85 && score.verificationStatus === 'STRONG',
      `Test 11-12: Final confidence score (${score.confidenceScore}) and classification ('STRONG') match weighted bounds`
    );
  } catch (err) {
    assert(false, `Test 11-12 threw error: ${err.message}`);
  }

  // --- Test 13: VERIFIED requirements (demoted to STRONG if pre-req fails) ---
  try {
    // If we set bestAssessmentScore = 100, and projects score = 100, and evidence score = 100, but missions score = 0 (less than 50% threshold):
    await Mission.updateMany({ status: 'completed' }, { status: 'not_started' }, { timestamps: false }); // 0% mission completion
    await AssessmentAttempt.updateMany({}, { score: 100 }, { timestamps: false });
    await Evidence.updateMany({}, { verificationStatus: 'verified' }, { timestamps: false });

    const score = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');

    assert(
      score.confidenceScore >= 90 && score.verificationStatus === 'STRONG',
      "Test 13: Demoted to STRONG verificationStatus because mission completion is below 50% limit"
    );
  } catch (err) {
    assert(false, `Test 13 threw error: ${err.message}`);
  }

  // --- Test 14: Missing evidence prevents verification ---
  try {
    // Delete all project entries
    await Project.deleteMany({});
    await Evidence.deleteMany({});

    const score = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    
    assert(
      score.verificationStatus !== 'VERIFIED' && score.missing.some(m => m.toLowerCase().includes('project')) && score.missing.some(m => m.toLowerCase().includes('evidence')),
      "Test 14: Missing projects/evidence prevents verified status and lists missing requirement variables"
    );
  } catch (err) {
    assert(false, `Test 14 threw error: ${err.message}`);
  }

  // --- Test 15: Conflict signals ---
  try {
    const project = new Project({
      roadmapId: roadmap._id,
      userId: 'test-user@careermapper.app',
      skillIds: ['react'],
      title: 'Project 1',
      description: 'Build dashboard',
      domain: 'Software Engineering',
      targetRole: 'Frontend Developer',
      difficulty: 'intermediate',
      type: 'practical_project',
      estimatedMinutes: 120,
      priority: 'HIGH',
      selectionStatus: 'active',
      status: 'verified'
    });
    await project.save();

    const ev = new Evidence({
      userId: 'test-user@careermapper.app',
      roadmapId: roadmap._id,
      projectId: project._id,
      skillIds: ['react'],
      type: 'github_repo',
      title: 'Repository 1',
      description: 'React code submission',
      url: 'https://github.com/test/repo-1',
      verificationStatus: 'rejected' // rejected evidence conflict
    });
    await ev.save();

    const score = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');

    assert(
      score.verificationWarnings.includes('Assessment performance is strong but some practical evidence was rejected.'),
      "Test 15: Conflicting signals warning populated correctly upon rejected evidence on high scores"
    );
  } catch (err) {
    assert(false, `Test 15 threw error: ${err.message}`);
  }

  // --- Test 16: Recommended next action ---
  try {
    const score = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');

    assert(
      score.recommendedNextAction.length > 0 && score.recommendedNextAction.toLowerCase().includes('react'),
      "Test 16: Recommended next action generated deterministically"
    );
  } catch (err) {
    assert(false, `Test 16 threw error: ${err.message}`);
  }

  // --- Test 17-20: AI Evidence analysis cache & Fallback ---
  try {
    const evidence = await Evidence.findOne({ roadmapId: roadmap._id });
    
    // Simulate AI failure fallback
    const analysisRes = await analyzeEvidenceRelevance(evidence._id, 'react', true);

    assert(
      analysisRes.analysis && typeof analysisRes.analysis.relevant === 'boolean' && typeof analysisRes.analysis.confidence === 'number',
      "Test 17-19: Evidence relevance resolves to keyword analysis templates correctly"
    );

    // Retrieve from cache
    const cached = await analyzeEvidenceRelevance(evidence._id, 'react', false);
    assert(
      cached && cached._id !== undefined,
      "Test 20: Verified cache reuse on subsequent calls"
    );
  } catch (err) {
    assert(false, `Test 17-20 threw error: ${err.message}`);
  }

  // --- Test 21: Multiple skills from one project ---
  try {
    const project = new Project({
      roadmapId: roadmap._id,
      userId: 'test-user@careermapper.app',
      skillIds: ['react', 'javascript'], // multiple skills
      title: 'Project Multi',
      description: 'Build portfolio',
      domain: 'Software Engineering',
      targetRole: 'Frontend Developer',
      difficulty: 'intermediate',
      type: 'practical_project',
      estimatedMinutes: 120,
      priority: 'HIGH',
      selectionStatus: 'active',
      status: 'verified'
    });
    await project.save();

    const score1 = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    const score2 = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'javascript');

    assert(
      score1.totalProjects > 0 && score2.totalProjects > 0,
      "Test 21: A single project mapped to multiple skills contributes to all targeted skills verifications"
    );
  } catch (err) {
    assert(false, `Test 21 threw error: ${err.message}`);
  }

  // --- Test 22: User isolation ---
  try {
    const scoreOther = await calculateVerificationScore('other-user@careermapper.app', roadmap._id, 'react');
    assert(
      scoreOther.userId === 'other-user@careermapper.app' && scoreOther.confidenceScore === 0,
      "Test 22: User isolation holds (queries and calculations are isolated to requested user context)"
    );
  } catch (err) {
    assert(false, `Test 22 threw error: ${err.message}`);
  }

  // --- Test 23: Deterministic recalculation ---
  try {
    const scoreFirst = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');
    const scoreSecond = await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');

    assert(
      scoreFirst.confidenceScore === scoreSecond.confidenceScore &&
      scoreFirst.verificationStatus === scoreSecond.verificationStatus &&
      scoreFirst.recommendedNextAction === scoreSecond.recommendedNextAction,
      "Test 23: Deterministic calculations return identical breakdown properties when database remains unchanged"
    );
  } catch (err) {
    assert(false, `Test 23 threw error: ${err.message}`);
  }

  // --- Test 24-25: Verification does NOT generate assessments, missions, or projects ---
  try {
    const initialAssessments = await Assessment.countDocuments({});
    const initialMissions = await Mission.countDocuments({});
    const initialProjects = await Project.countDocuments({});

    await calculateVerificationScore('test-user@careermapper.app', roadmap._id, 'react');

    const finalAssessments = await Assessment.countDocuments({});
    const finalMissions = await Mission.countDocuments({});
    const finalProjects = await Project.countDocuments({});

    assert(
      initialAssessments === finalAssessments &&
      initialMissions === finalMissions &&
      initialProjects === finalProjects,
      "Test 24-25: Verification does NOT automatically generate assessments, missions, or projects"
    );
  } catch (err) {
    assert(false, `Test 24-25 threw error: ${err.message}`);
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
