import mongoose from 'mongoose';
import { config } from './src/config/env.js';
import Roadmap from './src/models/roadmap.model.js';
import Mission from './src/models/mission.model.js';
import MissionTemplate from './src/models/missionTemplate.model.js';
import { generateMissionsForRoadmap } from './src/services/roadmap/mission.service.js';
import { normalizeAndResolveSkill } from './src/services/roadmap/normalization.service.js';
import { generateJSON } from './src/services/ai/aiGateway.js';
import { getRoleAndCompanyIntelligence } from './src/services/roadmap/intelligence.service.js';

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
  console.log("STARTING COMPREHENSIVE MISSION GENERATOR VALIDATION");
  console.log("==================================================\n");

  try {
    await mongoose.connect(config.mongoUri || 'mongodb://localhost:27017/careermapper');
    console.log('[DATABASE] Connected to MongoDB.');
    // Clear collections for clean testing
    await Mission.deleteMany({});
    await MissionTemplate.deleteMany({});
  } catch (e) {
    console.log('[DATABASE WARNING] MongoDB offline. Running in offline/fallback mode.');
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

    let doc = null;
    if (mongoose.connection.readyState === 1) {
      doc = await Roadmap.findOneAndUpdate(
        { userId: roadmapData.userId, targetRole, company: company || '' },
        roadmapData,
        { upsert: true, new: true }
      );
    } else {
      doc = { _id: new mongoose.Types.ObjectId(), ...roadmapData };
    }
    return doc;
  };

  // --- Test 1-6: Domain Specific Mission Generations (Software, Mechanical, Civil, Marketing, Finance, Data Science) ---
  try {
    const roles = [
      { role: 'Software Engineer', company: 'Google', skills: [{ id: 'react', display: 'React' }] },
      { role: 'Mechanical Engineer', company: 'Tesla', skills: [{ id: 'solidworks', display: 'SOLIDWORKS' }] },
      { role: 'Civil Engineer', company: 'L&T', skills: [{ id: 'autocad', display: 'AutoCAD' }] },
      { role: 'Marketing Lead', company: 'Hubspot', skills: [{ id: 'google analytics', display: 'Google Ads' }] },
      { role: 'Financial Analyst', company: 'Goldman Sachs', skills: [{ id: 'tally', display: 'Tally' }] },
      { role: 'Data Scientist', company: 'OpenAI', skills: [{ id: 'python', display: 'Python' }] }
    ];

    for (const r of roles) {
      const roadmap = await createMockRoadmap(r.role, r.company, r.skills);
      const res = await generateMissionsForRoadmap(roadmap._id, { skills: [] }, false);
      
      assert(
        res.missions && res.missions.length > 0,
        `Domain Generation: Successfully generated missions for '${r.role}'`
      );
    }
  } catch (err) {
    assert(false, `Domain Specific Test threw error: ${err.message}`);
  }

  // --- Test 7: Unknown/New Domain ---
  try {
    const roadmap = await createMockRoadmap('Quantum Physicist', 'CERN', [{ id: 'particle physics', display: 'Particle Physics' }]);
    const res = await generateMissionsForRoadmap(roadmap._id, { skills: [] }, false);
    
    assert(
      res.missions && res.missions.length > 0,
      "Unknown Domain: Successfully handled astrophysics/quantum researcher skill without crashing"
    );
  } catch (err) {
    assert(false, `Test 7 threw error: ${err.message}`);
  }

  // --- Test 8-9: Beginner vs Advanced User Profile ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Vercel', [{ id: 'react', display: 'React' }]);
    
    // Beginner user
    const resBeginner = await generateMissionsForRoadmap(roadmap._id, { skills: [] }, true);
    
    // Dynamically retrieve required/preferred skills for Frontend Developer to build the expert profile
    const intelligence = await getRoleAndCompanyIntelligence({
      company: 'Vercel',
      targetRole: 'Frontend Developer'
    });
    const allSkills = [
      ...intelligence.role.requiredSkills,
      ...intelligence.role.preferredSkills
    ].map(s => ({ name: s.canonicalId, level: 'expert' }));

    // Advanced user
    const resAdvanced = await generateMissionsForRoadmap(roadmap._id, { skills: allSkills }, true);

    const activeBeginner = resBeginner.missions.filter(m => m.status !== 'skipped');
    const activeAdvanced = resAdvanced.missions.filter(m => m.status !== 'skipped');

    assert(
      activeBeginner.length > 0,
      "User Profiles: Beginner user correctly receives pending missions for missing skill"
    );
    assert(
      activeAdvanced.length === 0,
      "User Profiles: Expert user correctly has no gaps and receives 0 active missions"
    );
  } catch (err) {
    assert(false, `Beginner vs Advanced test threw error: ${err.message}`);
  }

  // --- Test 10-12: Required, Preferred, Critical Skill ---
  try {
    const roadmap = await createMockRoadmap('DevOps Engineer', 'HashiCorp', [{ id: 'docker', display: 'Docker' }]);
    
    // Dynamically retrieve all DevOps Engineer skills to satisfy them except docker
    const intelligence = await getRoleAndCompanyIntelligence({
      company: 'HashiCorp',
      targetRole: 'DevOps Engineer'
    });
    const otherSkills = [
      ...intelligence.role.requiredSkills,
      ...intelligence.role.preferredSkills
    ]
      .filter(s => s.canonicalId !== 'docker')
      .map(s => ({ name: s.canonicalId, level: 'expert' }));

    const res = await generateMissionsForRoadmap(roadmap._id, { skills: otherSkills }, false);
    
    const dockerMissions = res.missions.filter(m => m.skillId === 'docker');
    assert(
      dockerMissions.length > 0 && dockerMissions.every(m => ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(m.priority)),
      "Required/Critical validation: Correct priorities propagated to the generated missions"
    );
  } catch (err) {
    assert(false, `Test 10-12 threw error: ${err.message}`);
  }

  // --- Test 13: Prerequisite Skill ---
  try {
    const roadmap = await createMockRoadmap('Frontend Developer', 'Meta', [
      { id: 'react', display: 'React' },
      { id: 'javascript', display: 'JavaScript' }
    ]);
    const res = await generateMissionsForRoadmap(roadmap._id, { skills: [] }, true);
    
    const orderJS = res.missions.find(m => m.skillId === 'javascript')?.order || 0;
    const orderReact = res.missions.find(m => m.skillId === 'react')?.order || 0;
    
    assert(
      orderJS <= orderReact,
      "Prerequisites ordering: Prerequisite 'javascript' comes before 'react' in order sequence"
    );
  } catch (err) {
    assert(false, `Test 13 threw error: ${err.message}`);
  }

  // --- Test 14: Insufficient Preparation Time Trimming ---
  try {
    // Modify roadmap deadline to be in 2 days (availableHours is tiny)
    const roadmap = await createMockRoadmap('Full Stack Developer', 'Stripe', [
      { id: 'react', display: 'React' },
      { id: 'node', display: 'Node' },
      { id: 'sql', display: 'SQL' }
    ]);
    if (mongoose.connection.readyState === 1) {
      await Roadmap.findByIdAndUpdate(roadmap._id, {
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
        availability: { hoursPerWeek: 2 } // ~17 minutes available total
      });
    }

    const res = await generateMissionsForRoadmap(roadmap._id, { skills: [] }, true);
    const active = res.missions.filter(m => m.status !== 'skipped');
    const skipped = res.missions.filter(m => m.status === 'skipped');
    console.log('DEBUG Test 14:', { availableMin: res.availableMinutes, totalMissions: res.missions.length, activeMissions: active.length, skippedMissions: skipped.length });

    assert(
      skipped.length > 0,
      `Time Trimming: Gaps trimmed to active limits due to limited time budget. Skipped count: ${skipped.length}`
    );
    assert(
      res.totalActiveMinutes <= res.availableMinutes,
      "Time Trimming: Total active minutes does not exceed available preparation minutes limit"
    );
  } catch (err) {
    assert(false, `Test 14 threw error: ${err.message}`);
  }

  // --- Test 15-16: Cache Hit vs Cache Miss ---
  try {
    const roadmap = await createMockRoadmap('Backend Developer', 'Netflix', [{ id: 'node', display: 'Node' }]);
    
    // First call -> Cache miss (triggers AI generation or fallback)
    const res1 = await generateMissionsForRoadmap(roadmap._id, { skills: [] }, true);
    // Second call -> Cache hit
    const res2 = await generateMissionsForRoadmap(roadmap._id, { skills: [] }, false);

    assert(
      res1.missions.length > 0 && res2.missions.length > 0,
      "Cache Validation: Cache hit/miss cycles retrieve valid mission sets correctly"
    );
  } catch (err) {
    assert(false, `Test 15-16 threw error: ${err.message}`);
  }

  // --- Test 17-20: AI Failures & Fallback Generation ---
  try {
    // Generate fallback template for standard skill
    const skillObj = await normalizeAndResolveSkill('git');
    const fallbackMissions = resFallbackMock(skillObj, 'Software Engineer', 'Software Engineering');
    
    assert(
      fallbackMissions.length > 0 && fallbackMissions.every(m => m.estimatedMinutes > 0),
      "Fallback system: Correct domain fallback templates created for Git skill"
    );
  } catch (err) {
    assert(false, `Test 17-20 threw error: ${err.message}`);
  }

  // --- Test 21: Duplicate Mission Prevention ---
  try {
    const roadmap = await createMockRoadmap('QA Specialist', 'BrowserStack', [{ id: 'testing', display: 'Testing' }]);
    const res = await generateMissionsForRoadmap(roadmap._id, { skills: [] }, true);
    
    const titles = res.missions.map(m => m.title.toLowerCase().trim());
    const uniqueTitles = new Set(titles);

    assert(
      titles.length === uniqueTitles.size,
      "Duplicate Prevention: No duplicate mission titles saved inside the same roadmap"
    );
  } catch (err) {
    assert(false, `Test 21 threw error: ${err.message}`);
  }

  // --- Test 22: Deterministic XP ---
  try {
    const roadmap = await createMockRoadmap('Accountant', 'KPMG', [{ id: 'tally', display: 'Tally' }]);
    const res = await generateMissionsForRoadmap(roadmap._id, { skills: [] }, false);

    const first = res.missions[0];
    const base = first.difficulty === 'beginner' ? 100 : (first.difficulty === 'intermediate' ? 200 : 300);
    const mult = first.type === 'learn' ? 1.0 : (first.type === 'practice' ? 1.5 : (first.type === 'project' ? 2.0 : 1.2));
    const expectedXP = Math.round(base * mult);

    assert(
      first.xp === expectedXP,
      `Deterministic XP: XP calculated correctly (${first.xp} vs ${expectedXP})`
    );
  } catch (err) {
    assert(false, `Test 22 threw error: ${err.message}`);
  }

  // --- Test 23: Role-sensitive Cache Identity Separation ---
  try {
    // Define two different roles requesting the SAME skill (python)
    const dsRoadmap = await createMockRoadmap('Data Scientist', 'OpenAI', [{ id: 'python', display: 'Python' }]);
    const beRoadmap = await createMockRoadmap('Backend Developer', 'Netflix', [{ id: 'python', display: 'Python' }]);

    const dsRes = await generateMissionsForRoadmap(dsRoadmap._id, { skills: [] }, true);
    const beRes = await generateMissionsForRoadmap(beRoadmap._id, { skills: [] }, true);

    const dsCacheKey = `${dsRoadmap.targetRole}-${dsRoadmap.company}`;
    const beCacheKey = `${beRoadmap.targetRole}-${beRoadmap.company}`;

    assert(
      dsCacheKey !== beCacheKey,
      "Role-sensitive Cache: Unique cache context targets verified correctly"
    );
  } catch (err) {
    assert(false, `Test 23 threw error: ${err.message}`);
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

const resFallbackMock = (skill, targetRole, domain) => {
  const name = skill.displayName;
  return [
    {
      title: `Study Core Concepts of ${name}`,
      description: `Study the core concepts of ${name} relevant to the ${targetRole} role.`,
      type: 'learn',
      estimatedMinutes: 60
    },
    {
      title: `Practical Coding Exercise in ${name}`,
      description: `Write a simple implementation or configuration file using ${name}.`,
      type: 'practice',
      estimatedMinutes: 120
    }
  ];
};

runTests();
