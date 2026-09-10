import mongoose from 'mongoose';
import { config } from './src/config/env.js';
import Roadmap from './src/models/roadmap.model.js';
import RoadmapSnapshot from './src/models/roadmapSnapshot.model.js';
import SkillVerification from './src/models/skillVerification.model.js';
import Mission from './src/models/mission.model.js';
import Project from './src/models/project.model.js';
import Evidence from './src/models/evidence.model.js';
import Assessment from './src/models/assessment.model.js';
import AssessmentAttempt from './src/models/assessmentAttempt.model.js';
import SkillDependency from './src/models/skillDependency.model.js';
import { getRoadmapExperience, getNextActionSelector } from './src/services/roadmap/experience.service.js';
import { recalculateRoadmapState } from './src/services/roadmap/adaptive.service.js';

let passes = 0;
let fails = 0;

const assert = (condition, message) => {
  if (condition) {
    passes++;
    console.log(`[PASS] ${message}`);
  } else {
    fails++;
    console.error(`[FAIL] ${message}`);
  }
};

const runTests = async () => {
  console.log("==================================================");
  console.log("STARTING ROADMAP EXPERIENCE / MISSION CONTROL VALIDATION");
  console.log("==================================================\n");

  config.geminiApiKey = '';
  config.groqApiKey = '';
  config.tavilyApiKey = '';

  try {
    await mongoose.connect(config.mongoUri || 'mongodb://localhost:27017/careermapper');
    console.log('[DATABASE] Connected to MongoDB.');
  } catch (e) {
    console.error('[DATABASE ERROR] Failed to connect to MongoDB.');
    process.exit(1);
  }

  const userId = 'experience-test-user@careermapper.app';
  const otherUserId = 'experience-other-user@careermapper.app';

  // Seed default dependencies for HTML -> CSS -> JavaScript -> React
  await SkillDependency.deleteMany({});
  await SkillDependency.create([
    { skillId: 'javascript', prerequisiteSkillId: 'html', relationshipType: 'requires', validated: true },
    { skillId: 'javascript', prerequisiteSkillId: 'css', relationshipType: 'requires', validated: true },
    { skillId: 'react', prerequisiteSkillId: 'javascript', relationshipType: 'requires', validated: true },
    { skillId: 'tailwind', prerequisiteSkillId: 'css', relationshipType: 'requires', validated: true }
  ]);

  const createMockRoadmap = async (uId = userId) => {
    await Roadmap.deleteMany({});
    await RoadmapSnapshot.deleteMany({});
    await SkillVerification.deleteMany({});
    await Mission.deleteMany({});
    await Project.deleteMany({});
    await Evidence.deleteMany({});
    await Assessment.deleteMany({});
    await AssessmentAttempt.deleteMany({});

    const roadmap = await Roadmap.create({
      userId: uId,
      company: 'Google',
      targetRole: 'Frontend Developer',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days prep
      availability: { hoursPerWeek: 10 },
      readinessScore: 0,
      prioritizedSkills: [
        { canonicalId: 'javascript', displayName: 'JavaScript', priority: 'CRITICAL', requirementType: 'required' },
        { canonicalId: 'react', displayName: 'React', priority: 'CRITICAL', requirementType: 'required' },
        { canonicalId: 'html', displayName: 'Html', priority: 'HIGH', requirementType: 'required' },
        { canonicalId: 'css', displayName: 'Css', priority: 'HIGH', requirementType: 'required' },
        { canonicalId: 'tailwind', displayName: 'Tailwind', priority: 'MEDIUM', requirementType: 'preferred' }
      ],
      phases: [
        {
          phaseId: 'phase-1-foundations',
          title: 'Phase 1: Foundational Prerequisites',
          estimatedHours: 10,
          skills: [
            { canonicalId: 'html', displayName: 'Html', proficiencyLevel: 'advanced', priority: 'HIGH' },
            { canonicalId: 'css', displayName: 'Css', proficiencyLevel: 'advanced', priority: 'HIGH' }
          ]
        },
        {
          phaseId: 'phase-2-core',
          title: 'Phase 2: Core Subject Proficiency',
          estimatedHours: 20,
          skills: [
            { canonicalId: 'javascript', displayName: 'JavaScript', proficiencyLevel: 'advanced', priority: 'CRITICAL' },
            { canonicalId: 'react', displayName: 'React', proficiencyLevel: 'advanced', priority: 'CRITICAL' }
          ]
        }
      ],
      version: 1,
      roadmapState: 'ACTIVE'
    });

    return roadmap;
  };

  // --- Test 1-2: Experience DTO loads with correct roadmap details ---
  try {
    const roadmap = await createMockRoadmap();
    const exp = await getRoadmapExperience(roadmap._id, userId);

    assert(exp !== null, 'Test 1: Experience DTO successfully loads');
    assert(exp.roadmap.targetRole === 'Frontend Developer', 'Test 2: Correct targetRole returned in roadmap experience');
    assert(exp.roadmap.company === 'Google', 'Test 2: Correct company target returned in roadmap experience');
  } catch (err) {
    assert(false, `Test 1-2 threw error: ${err.message}`);
  }

  // --- Test 3: User isolation protection ---
  try {
    const roadmap = await createMockRoadmap();
    let accessDenied = false;
    try {
      await getRoadmapExperience(roadmap._id, otherUserId);
    } catch (e) {
      accessDenied = true;
    }
    assert(accessDenied, 'Test 3: Accessing another user\'s roadmap throws unauthorized error');
  } catch (err) {
    assert(false, `Test 3 threw error: ${err.message}`);
  }

  // --- Test 4: Correct current phase mapping ---
  try {
    const roadmap = await createMockRoadmap();
    const exp = await getRoadmapExperience(roadmap._id, userId);
    assert(exp.currentPhase.id === 'phase-1-foundations', `Test 4: Correct starting phase ID mapped (actual=${exp.currentPhase.id})`);
    assert(exp.currentPhase.progress === 0, 'Test 4: Phase progress correctly starts at 0%');
  } catch (err) {
    assert(false, `Test 4 threw error: ${err.message}`);
  }

  // --- Test 5-6: Deterministic next action: Critical prerequisite takes priority ---
  try {
    const roadmap = await createMockRoadmap();
    // HTML and CSS are prerequisites for JavaScript (CRITICAL). HTML/CSS are HIGH.
    // JavaScript is CRITICAL. Since JS is blocked by HTML/CSS, HTML/CSS are critical prerequisite gaps!
    // Let's create an incomplete mission for HTML.
    const htmlMission = await Mission.create({
      roadmapId: roadmap._id,
      skillId: 'html',
      title: 'HTML Foundations',
      description: 'Learn elements',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 45,
      xp: 100,
      priority: 'HIGH',
      status: 'not_started'
    });

    const exp = await getRoadmapExperience(roadmap._id, userId);
    assert(exp.nextAction !== null, 'Test 5: Next action determined successfully');
    assert(exp.nextAction.type === 'MISSION', `Test 5: Next action type is MISSION (actual=${exp.nextAction.type})`);
    assert(exp.nextAction.skillId === 'html', `Test 6: Critical prerequisite HTML takes priority (actual=${exp.nextAction.skillId})`);
  } catch (err) {
    assert(false, `Test 5-6 threw error: ${err.message}`);
  }

  // --- Test 7: Dependency blockage works ---
  try {
    const roadmap = await createMockRoadmap();
    // React is blocked because JavaScript is not STRONG or VERIFIED.
    // React should have state = 'BLOCKED' and blockedBy listing 'javascript'
    const exp = await getRoadmapExperience(roadmap._id, userId);
    const reactSkill = exp.skills.find(s => s.skillId === 'react');
    assert(reactSkill.state === 'BLOCKED', `Test 7: React skill state correctly resolves to BLOCKED (actual=${reactSkill.state})`);
    assert(reactSkill.blockedBy.some(b => b.skillId === 'javascript'), 'Test 7: React blockedBy lists javascript prerequisite');
  } catch (err) {
    assert(false, `Test 7 threw error: ${err.message}`);
  }

  // --- Test 8-9: Verified skills move to maintenance / excluded from learning actions ---
  try {
    const roadmap = await createMockRoadmap();
    // Mark HTML as VERIFIED in SkillVerification
    await SkillVerification.create({
      userId,
      roadmapId: roadmap._id,
      skillId: 'html',
      canonicalSkillId: 'html',
      targetRole: 'Frontend Developer',
      domain: 'Software',
      confidenceScore: 100,
      verificationStatus: 'VERIFIED'
    });

    // Create a mission for HTML (marked as completed or not started)
    await Mission.create({
      roadmapId: roadmap._id,
      skillId: 'html',
      title: 'HTML Learn',
      description: 'HTML text',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 30,
      xp: 100,
      priority: 'HIGH',
      status: 'not_started'
    });

    // Create a mission for CSS
    await Mission.create({
      roadmapId: roadmap._id,
      skillId: 'css',
      title: 'CSS Learn',
      description: 'CSS text',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 30,
      xp: 100,
      priority: 'HIGH',
      status: 'not_started'
    });

    const exp = await getRoadmapExperience(roadmap._id, userId);
    const htmlSkill = exp.skills.find(s => s.skillId === 'html');
    assert(htmlSkill.state === 'MAINTENANCE', `Test 9: Verified HTML skill enters MAINTENANCE state (actual=${htmlSkill.state})`);
    assert(exp.nextAction.skillId === 'css', `Test 8: Next action skips verified HTML and selects CSS (actual=${exp.nextAction.skillId})`);
  } catch (err) {
    assert(false, `Test 8-9 threw error: ${err.message}`);
  }

  // --- Test 10-11: Incomplete mission selected / completed mission skipped ---
  try {
    const roadmap = await createMockRoadmap();
    const m1 = await Mission.create({
      roadmapId: roadmap._id,
      skillId: 'html',
      title: 'Mission 1',
      description: 'Intro to HTML',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      xp: 50,
      priority: 'HIGH',
      status: 'completed'
    });
    const m2 = await Mission.create({
      roadmapId: roadmap._id,
      skillId: 'html',
      title: 'Mission 2',
      description: 'HTML forms',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 40,
      xp: 100,
      priority: 'HIGH',
      status: 'not_started'
    });

    const exp = await getRoadmapExperience(roadmap._id, userId);
    assert(exp.nextAction.type === 'MISSION', 'Test 10: Next action resolves to MISSION');
    assert(exp.nextAction.title === 'Mission 2', `Test 11: Completed Mission 1 is skipped, Mission 2 selected (actual=${exp.nextAction.title})`);
  } catch (err) {
    assert(false, `Test 10-11 threw error: ${err.message}`);
  }

  // --- Test 12: Project action selected correctly ---
  try {
    const roadmap = await createMockRoadmap();
    // HTML has no incomplete missions (already completed)
    await Mission.create({
      roadmapId: roadmap._id,
      skillId: 'html',
      title: 'Mission 1',
      description: 'Intro to HTML',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      xp: 50,
      priority: 'HIGH',
      status: 'completed'
    });
    // But HTML has an active project that is not started
    const project = await Project.create({
      roadmapId: roadmap._id,
      userId,
      skillIds: ['html'],
      title: 'HTML Personal Portfolio',
      description: 'Build portfolio',
      domain: 'Software',
      targetRole: 'Frontend Developer',
      difficulty: 'beginner',
      type: 'practical_project',
      estimatedMinutes: 120,
      priority: 'HIGH',
      status: 'not_started',
      selectionStatus: 'active'
    });

    const exp = await getRoadmapExperience(roadmap._id, userId);
    assert(exp.nextAction.type === 'PROJECT', `Test 12: Next action type is PROJECT when missions are done (actual=${exp.nextAction.type})`);
    assert(exp.nextAction.title === 'HTML Personal Portfolio', `Test 12: Correct project selected (actual=${exp.nextAction.title})`);
  } catch (err) {
    assert(false, `Test 12 threw error: ${err.message}`);
  }

  // --- Test 13: Evidence action selected correctly ---
  try {
    const roadmap = await createMockRoadmap();
    // HTML missions completed
    await Mission.create({
      roadmapId: roadmap._id,
      skillId: 'html',
      title: 'Mission 1',
      description: 'Intro to HTML',
      status: 'completed',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      xp: 50,
      priority: 'HIGH'
    });
    // HTML project completed
    const project = await Project.create({
      roadmapId: roadmap._id,
      userId,
      skillIds: ['html'],
      title: 'HTML Portfolio',
      description: 'Build html portfolio',
      domain: 'Software',
      targetRole: 'Frontend Developer',
      difficulty: 'beginner',
      type: 'practical_project',
      estimatedMinutes: 120,
      priority: 'HIGH',
      status: 'completed',
      selectionStatus: 'active'
    });

    // Evidence has NOT been submitted (no accepted/verified evidence in DB)
    const exp = await getRoadmapExperience(roadmap._id, userId);
    assert(exp.nextAction.type === 'EVIDENCE', `Test 13: Next action type resolves to EVIDENCE (actual=${exp.nextAction.type})`);
    assert(exp.nextAction.projectId.toString() === project._id.toString(), 'Test 13: Next action includes correct projectId reference');
  } catch (err) {
    assert(false, `Test 13 threw error: ${err.message}`);
  }

  // --- Test 14-16: Assessment checkpoint selected without auto-generating ---
  try {
    const roadmap = await createMockRoadmap();
    // Complete missions and projects
    await Mission.create({
      roadmapId: roadmap._id,
      skillId: 'html',
      title: 'HTML Mission',
      description: 'Intro to HTML',
      status: 'completed',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      xp: 50,
      priority: 'HIGH'
    });
    const project = await Project.create({
      roadmapId: roadmap._id,
      userId,
      skillIds: ['html'],
      title: 'HTML Proj',
      description: 'Proj desc',
      domain: 'Software',
      targetRole: 'Frontend Developer',
      difficulty: 'beginner',
      type: 'practical_project',
      estimatedMinutes: 120,
      priority: 'HIGH',
      status: 'completed',
      selectionStatus: 'active'
    });
    // Submit verified evidence
    await Evidence.create({
      userId,
      roadmapId: roadmap._id,
      projectId: project._id,
      skillIds: ['html'],
      type: 'github_repo',
      title: 'HTML repo link',
      description: 'HTML links',
      url: 'https://github.com/test/html',
      verificationStatus: 'verified'
    });

    // First experience load (no assessment exists yet)
    let exp = await getRoadmapExperience(roadmap._id, userId);
    assert(exp.nextAction.type === 'ASSESSMENT', `Test 14: Next action resolves to ASSESSMENT checkpoint (actual=${exp.nextAction.type})`);
    assert(exp.nextAction.generated === false, 'Test 15: Assessment is NOT automatically generated');
    assert(exp.nextAction.assessmentId === null, 'Test 15: assessmentId is null since it is not generated');

    // Create an assessment manually (reulating on-demand generation)
    const assessment = await Assessment.create({
      roadmapId: roadmap._id,
      userId,
      skillIds: ['html'],
      targetRole: 'Frontend Developer',
      domain: 'IT',
      title: 'HTML Skill Test',
      description: 'HTML questions',
      type: 'technical',
      difficulty: 'intermediate',
      estimatedMinutes: 30,
      selectionStatus: 'active'
    });

    // Second experience load (existing assessment should be reused)
    exp = await getRoadmapExperience(roadmap._id, userId);
    assert(exp.nextAction.type === 'ASSESSMENT', 'Test 16: Next action remains ASSESSMENT');
    assert(exp.nextAction.generated === true, 'Test 16: Existing assessment is recognized as generated');
    assert(exp.nextAction.assessmentId.toString() === assessment._id.toString(), 'Test 16: Reuses correct assessmentId');
  } catch (err) {
    assert(false, `Test 14-16 threw error: ${err.message}`);
  }

  // --- Test 17: Gamification metrics are deterministic ---
  try {
    const roadmap = await createMockRoadmap();
    await Mission.create({
      roadmapId: roadmap._id,
      skillId: 'html',
      title: 'Mission 1',
      description: 'HTML foundations',
      xp: 150,
      status: 'completed',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 30,
      priority: 'HIGH'
    });
    await Mission.create({
      roadmapId: roadmap._id,
      skillId: 'css',
      title: 'Mission 2',
      description: 'CSS foundations',
      xp: 200,
      status: 'not_started',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 30,
      priority: 'HIGH'
    });

    const exp = await getRoadmapExperience(roadmap._id, userId);
    assert(exp.progress.xpEarned === 150, `Test 17: Earned XP sum computed correctly (actual=${exp.progress.xpEarned})`);
    assert(exp.progress.xpAvailable === 350, `Test 17: Total available XP sum computed correctly (actual=${exp.progress.xpAvailable})`);
  } catch (err) {
    assert(false, `Test 17 threw error: ${err.message}`);
  }

  // --- Test 18: Completion percentage matches Module 13 ---
  try {
    const roadmap = await createMockRoadmap();
    // Generate missions, project, evidence, and verifications
    await Mission.create({
      roadmapId: roadmap._id,
      skillId: 'html',
      title: 'HTML Mission',
      description: 'HTML foundations',
      status: 'completed',
      type: 'learn',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      xp: 50,
      priority: 'HIGH'
    });
    // recalculate using Module 13 adaptive service
    const adaptiveResult = await recalculateRoadmapState(roadmap._id, { userEmail: userId });
    const exp = await getRoadmapExperience(roadmap._id, userId);

    assert(exp.progress.percentage === adaptiveResult.timePlan.completionPercentage, `Test 18: Completion percentage matches Module 13 recalculation (actual=${exp.progress.percentage}%, expected=${adaptiveResult.timePlan.completionPercentage}%)`);
  } catch (err) {
    assert(false, `Test 18 threw error: ${err.message}`);
  }

  // --- Test 19-20: Deadline and time pressure parameters are correct ---
  try {
    const roadmap = await createMockRoadmap();
    // Reduce timeline to 5 days remaining
    roadmap.deadline = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    await roadmap.save();

    const exp = await getRoadmapExperience(roadmap._id, userId);
    assert(exp.timePlan.daysRemaining === 5, `Test 19: Correct daysRemaining mapped (actual=${exp.timePlan.daysRemaining})`);
    assert(exp.timePlan.planningMode === 'INTERVIEW_SPRINT', `Test 20: Planning mode transitioned to INTERVIEW_SPRINT (actual=${exp.timePlan.planningMode})`);
    assert(exp.timePlan.timePressure === 'HIGH', `Test 20: Time pressure is HIGH (actual=${exp.timePlan.timePressure})`);
  } catch (err) {
    assert(false, `Test 19-20 threw error: ${err.message}`);
  }

  // --- Test 21-22: Version history and adaptation summary are exposed ---
  try {
    const roadmap = await createMockRoadmap();
    // Change deadline to trigger meaningful adaptation increment
    await recalculateRoadmapState(roadmap._id, {
      userEmail: userId,
      interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
    });

    const exp = await getRoadmapExperience(roadmap._id, userId);
    assert(exp.roadmap.version === 2, `Test 21: Current version incremented to 2 (actual=${exp.roadmap.version})`);
    assert(exp.versions.length === 2, `Test 22: Version history array contains 2 snapshots (actual=${exp.versions.length})`);
    assert(exp.adaptation !== null, 'Test 21: Adaptation summary object returned in DTO');
  } catch (err) {
    assert(false, `Test 21-22 threw error: ${err.message}`);
  }

  // --- Test 26: Performance isolation and query counts (No N+1 queries) ---
  try {
    const roadmap = await createMockRoadmap();
    // Measure MongoDB query operations (no repeated queries)
    let queryCount = 0;
    const oldQuery = mongoose.Query.prototype.exec;
    mongoose.Query.prototype.exec = function() {
      queryCount++;
      return oldQuery.apply(this, arguments);
    };

    await getRoadmapExperience(roadmap._id, userId);

    mongoose.Query.prototype.exec = oldQuery;
    // We fetch about 8 collections in parallel
    assert(queryCount <= 12, `Test 26: Aggregate experience loaded in reasonable fixed number of queries (actual=${queryCount})`);
  } catch (err) {
    assert(false, `Test 26 threw error: ${err.message}`);
  }

  // --- Test 27: Empty state validation ---
  try {
    const roadmap = await createMockRoadmap();
    const exp = await getRoadmapExperience(roadmap._id, userId);

    assert(Array.isArray(exp.missions), 'Test 27: missions is returned as an array even if empty');
    assert(Array.isArray(exp.projects), 'Test 27: projects is returned as an array even if empty');
    assert(Array.isArray(exp.assessments), 'Test 27: assessments is returned as an array even if empty');
  } catch (err) {
    assert(false, `Test 27 threw error: ${err.message}`);
  }

  // --- Test 28: Completed roadmap returns completed nextAction state ---
  try {
    const roadmap = await createMockRoadmap();
    // Verify all prioritized skills
    for (const skill of roadmap.prioritizedSkills) {
      await SkillVerification.create({
        userId,
        roadmapId: roadmap._id,
        skillId: skill.canonicalId,
        canonicalSkillId: skill.canonicalId,
        targetRole: 'Frontend Developer',
        domain: 'Software',
        confidenceScore: 100,
        verificationStatus: 'VERIFIED'
      });
    }

    const nextAction = await getNextActionSelector(roadmap._id, userId);
    assert(nextAction.type === 'COMPLETED', `Test 28: Next action state correctly returns COMPLETED for fully verified roadmaps (actual=${nextAction.type})`);
  } catch (err) {
    assert(false, `Test 28 threw error: ${err.message}`);
  }

  console.log("\n==================================================");
  console.log(`TEST RUN COMPLETED: ${passes} PASSES, ${fails} FAILURES`);
  console.log("==================================================");

  if (fails > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
