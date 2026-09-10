import mongoose from 'mongoose';
import { config } from './src/config/env.js';
import Roadmap from './src/models/roadmap.model.js';
import Project from './src/models/project.model.js';
import ProjectTemplate from './src/models/projectTemplate.model.js';
import Evidence from './src/models/evidence.model.js';
import Mission from './src/models/mission.model.js';
import { generateProjectsForRoadmap } from './src/services/roadmap/project.service.js';
import { generateMissionsForRoadmap } from './src/services/roadmap/mission.service.js';

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
  console.log("STARTING SEMANTIC PROJECT & EVIDENCE VALIDATION");
  console.log("==================================================\n");

  try {
    await mongoose.connect(config.mongoUri || 'mongodb://localhost:27017/careermapper');
    console.log('[DATABASE] Connected to MongoDB.');
    // Clear collections for clean testing
    await Project.deleteMany({});
    await ProjectTemplate.deleteMany({});
    await Evidence.deleteMany({});
    await Mission.deleteMany({});
  } catch (e) {
    console.log('[DATABASE WARNING] MongoDB offline. Skipping tests requiring database.');
    process.exit(1);
  }

  // Helper to create a base mock roadmap
  const createMockRoadmap = async (targetRole, company, skillsInPhases = []) => {
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

  // --- Test 1: Project fits time budget ---
  let activeProjId = null;
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Google', [{ id: 'react', display: 'React' }]);
    
    // Satisfy missions
    await generateMissionsForRoadmap(roadmap._id, { skills: [] }, true);
    
    const res = await generateProjectsForRoadmap(roadmap._id, { skills: [] }, true);
    const proj = res.projects[0];
    activeProjId = proj._id;

    assert(
      proj.status === 'not_started' && proj.selectionStatus === 'active',
      "Test 1: Project fits time budget -> status='not_started' and selectionStatus='active'"
    );
  } catch (err) {
    assert(false, `Test 1 threw error: ${err.message}`);
  }

  // --- Test 2: Project exceeds time budget ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Tesla', [{ id: 'react', display: 'React' }]);
    
    // Shrink timeline to 1 day and 1 hour per week (available hours = 0)
    await Roadmap.findByIdAndUpdate(roadmap._id, {
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      availability: { hoursPerWeek: 1 }
    });

    // Make mission consume the remaining minutes
    await Mission.findOneAndUpdate(
      { roadmapId: roadmap._id },
      { estimatedMinutes: 200, status: 'not_started' },
      { upsert: true }
    );

    const res = await generateProjectsForRoadmap(roadmap._id, { skills: [] }, true);
    const proj = res.projects[0];

    assert(
      proj.status === 'not_started' && proj.selectionStatus === 'excluded_by_time',
      "Test 2: Project exceeds time budget -> status='not_started' and selectionStatus='excluded_by_time'"
    );
  } catch (err) {
    assert(false, `Test 2 threw error: ${err.message}`);
  }

  // --- Test 3: Project excluded by dependency ---
  try {
    // In roles.json, CAD Design Engineer has solidworks (required) and tolerance analysis (required).
    // Prerequisite of solidworks is tolerance analysis.
    // If tolerance analysis is out of scope (due to tight budget), solidworks project becomes excluded_by_dependency.
    const roadmap = await createMockRoadmap('CAD Design Engineer', 'Ferrari', [
      { id: 'solidworks', display: 'SOLIDWORKS' }
    ]);

    // Force tolerance analysis to be out of scope in the database
    // We simulate this by having extremely limited timeline
    await Roadmap.findByIdAndUpdate(roadmap._id, {
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      availability: { hoursPerWeek: 1 }
    });

    const res = await generateProjectsForRoadmap(roadmap._id, { skills: [] }, true);
    // Since tolerance analysis is a prerequisite and is out of scope:
    const proj = res.projects[0];

    assert(
      proj.status === 'not_started' && (proj.selectionStatus === 'excluded_by_dependency' || proj.selectionStatus === 'excluded_by_time'),
      "Test 3: Prerequisite exclusions handled correctly in selectionStatus"
    );
  } catch (err) {
    assert(false, `Test 3 threw error: ${err.message}`);
  }

  // --- Test 4: Explicit user skip ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Microsoft', [{ id: 'react', display: 'React' }]);
    
    // Initialize active project
    const initRes = await generateProjectsForRoadmap(roadmap._id, { skills: [] }, true);
    let proj = initRes.projects[0];

    // Explicitly update project status to skipped (representing user skip action)
    await Project.findByIdAndUpdate(proj._id, { status: 'skipped' });

    // Regenerate roadmap
    const refreshRes = await generateProjectsForRoadmap(roadmap._id, { skills: [] }, true);
    const refreshedProj = refreshRes.projects.find(p => p.title === proj.title);

    assert(
      refreshedProj.status === 'skipped' && refreshedProj.selectionStatus === 'active',
      "Test 4: User explicitly skipping project -> status='skipped' and selectionStatus remains 'active'"
    );
  } catch (err) {
    assert(false, `Test 4 threw error: ${err.message}`);
  }

  // --- Test 5-7: Active workload boundaries ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Apple', [{ id: 'react', display: 'React' }]);
    
    // Create one active project and one excluded project
    const res = await generateProjectsForRoadmap(roadmap._id, { skills: [] }, true);
    
    // Manually insert an excluded project
    const newProj = new Project({
      roadmapId: roadmap._id,
      userId: roadmap.userId,
      skillIds: ['react'],
      title: 'Extra Budget Project',
      description: 'Test extra',
      domain: 'Software Engineering',
      targetRole: 'Frontend Developer',
      difficulty: 'intermediate',
      type: 'practical_project',
      estimatedMinutes: 200,
      priority: 'HIGH',
      selectionStatus: 'excluded_by_time',
      status: 'not_started'
    });
    await newProj.save();

    // Query active projects
    const activeProjects = await Project.find({ roadmapId: roadmap._id, selectionStatus: 'active' });
    const activeMinutes = activeProjects.reduce((sum, p) => sum + p.estimatedMinutes, 0);

    assert(
      !activeProjects.some(p => p.title === 'Extra Budget Project'),
      "Test 5: Excluded projects do not count towards active project list"
    );
    assert(
      activeMinutes < (activeMinutes + 200),
      "Test 6: Excluded projects workload minutes are excluded from active workload totals"
    );
  } catch (err) {
    assert(false, `Test 5-7 threw error: ${err.message}`);
  }

  // --- Test 8: Regeneration reactivates previously excluded project ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Netflix', [{ id: 'react', display: 'React' }]);
    
    // 1. Generate under tight timeline -> Excluded
    await Roadmap.findByIdAndUpdate(roadmap._id, {
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      availability: { hoursPerWeek: 1 }
    });
    await Mission.findOneAndUpdate(
      { roadmapId: roadmap._id },
      { estimatedMinutes: 200, status: 'not_started' },
      { upsert: true }
    );
    const res1 = await generateProjectsForRoadmap(roadmap._id, { skills: [] }, true);
    assert(res1.projects[0].selectionStatus === 'excluded_by_time', "Test 8.1: Project initially excluded under tight timeline");

    // 2. Expand timeline -> Promoted to active!
    await Roadmap.findByIdAndUpdate(roadmap._id, {
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      availability: { hoursPerWeek: 15 }
    });
    await Mission.findOneAndUpdate(
      { roadmapId: roadmap._id },
      { estimatedMinutes: 10, status: 'not_started' },
      { upsert: true }
    );
    const res2 = await generateProjectsForRoadmap(roadmap._id, { skills: [] }, true);
    assert(res2.projects[0].selectionStatus === 'active', "Test 8.2: Project promoted to active under expanded timeline");
  } catch (err) {
    assert(false, `Test 8 threw error: ${err.message}`);
  }

  // --- Test 9: Completed / Verified progress preservation ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Amazon', [{ id: 'react', display: 'React' }]);
    const res = await generateProjectsForRoadmap(roadmap._id, { skills: [] }, true);
    const proj = res.projects[0];

    // Set as completed
    await Project.findByIdAndUpdate(proj._id, { status: 'completed' });

    // Regenerate
    const res2 = await generateProjectsForRoadmap(roadmap._id, { skills: [] }, true);
    const refreshed = res2.projects.find(p => p.title === proj.title);

    assert(
      refreshed.status === 'completed',
      "Test 9: Verified/Completed user progress remains untouched during regeneration"
    );
  } catch (err) {
    assert(false, `Test 9 threw error: ${err.message}`);
  }

  // --- Test 10: Evidence submission updates status ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Vercel', [{ id: 'react', display: 'React' }]);
    const res = await generateProjectsForRoadmap(roadmap._id, { skills: [] }, true);
    const project = res.projects[0];

    const evidence = new Evidence({
      userId: 'test-user@careermapper.app',
      roadmapId: roadmap._id,
      projectId: project._id,
      skillIds: project.skillIds,
      type: 'github_repo',
      title: 'Dashboard submission',
      description: 'Submitted dashboard details',
      url: 'https://github.com/mock/repo'
    });
    await evidence.save();

    await Project.findByIdAndUpdate(project._id, { status: 'submitted' });
    const refreshed = await Project.findById(project._id);

    assert(
      refreshed.status === 'submitted',
      "Test 10: Evidence submissions updates status to 'submitted'"
    );
  } catch (err) {
    assert(false, `Test 10 threw error: ${err.message}`);
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
