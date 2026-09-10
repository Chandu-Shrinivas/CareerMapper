import mongoose from 'mongoose';
import { config } from './src/config/env.js';
import Skill from './src/models/skill.model.js';
import { normalizeAndResolveSkill } from './src/services/roadmap/normalization.service.js';
import { getNormalizedUserProfile } from './src/services/roadmap/profileAdapter.service.js';
import { getRoleAndCompanyIntelligence } from './src/services/roadmap/intelligence.service.js';
import { calculateSkillGaps } from './src/services/roadmap/gap.service.js';
import { calculateSkillPriorities } from './src/services/roadmap/priority.service.js';
import { calculateTimePlanning } from './src/services/roadmap/time.service.js';
import { seedPrerequisites, topologicalSortSkills } from './src/services/roadmap/dependency.service.js';
import { generateRoadmap } from './src/services/roadmap/engine.service.js';

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
  console.log("STARTING ADAPTIVE ROADMAP ENGINE VALIDATION");
  console.log("==================================================\n");

  // Attempt database connection
  try {
    await mongoose.connect(config.mongoUri || 'mongodb://localhost:27017/careermapper');
    console.log('[DATABASE] Connected to MongoDB.');
    // Clear cache for test canonicals to prevent stale cached classifications from failing the tests
    await Skill.deleteMany({ canonical: { $in: ['react', 'python', 'solidworks', 'autocad', 'google analytics', 'tally'] } });
    await seedPrerequisites();
  } catch (e) {
    console.log('[DATABASE WARNING] MongoDB is offline. Test suite will run in offline mode.');
  }

  // --- Test 1: React vs React.js Normalization ---
  try {
    const res1 = await normalizeAndResolveSkill('ReactJS');
    const res2 = await normalizeAndResolveSkill('React.js');
    const res3 = await normalizeAndResolveSkill('React JS');
    
    assert(
      res1.canonicalId === 'react' && res2.canonicalId === 'react' && res3.canonicalId === 'react',
      "Deduplication: ReactJS, React.js, React JS all map to canonical 'react'"
    );
  } catch (err) {
    assert(false, `Test 1 threw error: ${err.message}`);
  }

  // --- Test 2: Python vs Python 3 Normalization ---
  try {
    const res1 = await normalizeAndResolveSkill('Python 3');
    const res2 = await normalizeAndResolveSkill('Python3');
    const res3 = await normalizeAndResolveSkill('python');
    
    assert(
      res1.canonicalId === 'python' && res2.canonicalId === 'python' && res3.canonicalId === 'python',
      "Deduplication: Python 3, Python3, python all map to canonical 'python'"
    );
  } catch (err) {
    assert(false, `Test 2 threw error: ${err.message}`);
  }

  // --- Test 3: Mechanical Engineering Skills ---
  try {
    const solidworks = await normalizeAndResolveSkill('SOLIDWORKS');
    const cad = await normalizeAndResolveSkill('Auto CAD');
    
    assert(
      solidworks.domain === 'Mechanical Engineering' && solidworks.canonicalId === 'solidworks',
      "Mechanical: SOLIDWORKS mapped to Mechanical Engineering domain"
    );
  } catch (err) {
    assert(false, `Test 3 threw error: ${err.message}`);
  }

  // --- Test 4: Civil Engineering Skills ---
  try {
    const autocad = await normalizeAndResolveSkill('autodesk autocad');
    
    assert(
      autocad.domain === 'Civil Engineering' && autocad.canonicalId === 'autocad',
      "Civil: Autodesk AutoCAD mapped to Civil Engineering domain"
    );
  } catch (err) {
    assert(false, `Test 4 threw error: ${err.message}`);
  }

  // --- Test 5: Marketing Skills ---
  try {
    const googleads = await normalizeAndResolveSkill('Google Adwords');
    
    assert(
      googleads.domain === 'Marketing' && googleads.canonicalId === 'google analytics',
      "Marketing: Google Adwords mapped to Marketing domain"
    );
  } catch (err) {
    assert(false, `Test 5 threw error: ${err.message}`);
  }

  // --- Test 6: Finance Skills ---
  try {
    const tally = await normalizeAndResolveSkill('Tally ERP 9');
    
    assert(
      tally.domain === 'Finance' && tally.canonicalId === 'tally',
      "Finance: Tally ERP 9 mapped to Finance domain"
    );
  } catch (err) {
    assert(false, `Test 6 threw error: ${err.message}`);
  }

  // --- Test 7: User Skill Matching & Missing Skill Detection ---
  try {
    const mockProfile = {
      skills: [
        { name: 'ReactJS', level: 'expert' },
        { name: 'python', level: 'beginner' }
      ]
    };
    const mockRole = {
      requiredSkills: [
        await normalizeAndResolveSkill('react'),
        await normalizeAndResolveSkill('javascript'),
        await normalizeAndResolveSkill('node')
      ]
    };
    
    const normalizedProfile = await getNormalizedUserProfile(mockProfile);
    const gaps = calculateSkillGaps(normalizedProfile, mockRole);
    
    const reactGap = gaps.find(g => g.skill.canonicalId === 'react');
    const jsGap = gaps.find(g => g.skill.canonicalId === 'javascript');
    
    assert(
      reactGap && reactGap.gap === false,
      "Skill Matching: React is matched as satisfied (no gap)"
    );
    assert(
      jsGap && jsGap.gap === true && jsGap.currentLevel === 'none',
      "Missing Skill: JavaScript is detected as a gap with level 'none'"
    );
  } catch (err) {
    assert(false, `Test 7 threw error: ${err.message}`);
  }

  // --- Test 8: Required vs Preferred Skills ---
  try {
    const mockProfile = { skills: [] };
    const mockRole = {
      requiredSkills: [await normalizeAndResolveSkill('react')],
      preferredSkills: [await normalizeAndResolveSkill('git')]
    };

    const normalizedProfile = await getNormalizedUserProfile(mockProfile);
    const gaps = calculateSkillGaps(normalizedProfile, mockRole);
    const react = gaps.find(g => g.skill.canonicalId === 'react');
    const git = gaps.find(g => g.skill.canonicalId === 'git');

    assert(
      react.requirementType === 'required' && git.requirementType === 'preferred',
      "Required vs Preferred: Correct requirement classifications assigned"
    );
  } catch (err) {
    assert(false, `Test 8 threw error: ${err.message}`);
  }

  // --- Test 9: Priority Calculation ---
  try {
    const mockProfile = { skills: [{ name: 'react', level: 'beginner' }] };
    const mockRole = {
      requiredSkills: [await normalizeAndResolveSkill('react')]
    };

    const normalizedProfile = await getNormalizedUserProfile(mockProfile);
    const gaps = calculateSkillGaps(normalizedProfile, mockRole);
    const prioritized = calculateSkillPriorities(gaps);
    const react = prioritized.find(p => p.skill.canonicalId === 'react');

    assert(
      react.priority === 'CRITICAL' || react.priority === 'HIGH' || react.priority === 'MEDIUM',
      `Priority Engine: Priority calculated successfully: ${react.priority}`
    );
  } catch (err) {
    assert(false, `Test 9 threw error: ${err.message}`);
  }

  // --- Test 10: Topological Sorting & Prerequisites ---
  try {
    const mockGaps = [
      { skill: await normalizeAndResolveSkill('react'), gap: true, priority: 'HIGH' },
      { skill: await normalizeAndResolveSkill('javascript'), gap: true, priority: 'CRITICAL' }
    ];

    const sorted = await topologicalSortSkills(mockGaps);
    const idxReact = sorted.findIndex(s => s.skill.canonicalId === 'react');
    const idxJS = sorted.findIndex(s => s.skill.canonicalId === 'javascript');

    assert(
      idxJS < idxReact,
      "Topological Sort: Prerequisite 'javascript' comes before 'react'"
    );
  } catch (err) {
    assert(false, `Test 10 threw error: ${err.message}`);
  }

  // --- Test 11: Time planning & Insufficient Time Trimming ---
  try {
    const mockGaps = [
      { skill: await normalizeAndResolveSkill('react'), gap: true, priority: 'HIGH', currentLevel: 'none', requiredLevel: 'intermediate', requirementType: 'required' },
      { skill: await normalizeAndResolveSkill('node'), gap: true, priority: 'HIGH', currentLevel: 'none', requiredLevel: 'intermediate', requirementType: 'required' },
      { skill: await normalizeAndResolveSkill('docker'), gap: true, priority: 'LOW', currentLevel: 'none', requiredLevel: 'intermediate', requirementType: 'preferred' }
    ];

    // Total prep effort would be (10+15) + (10+15) + (10+15) = 75 hours.
    // If availability is 10 hours/week, and target is in 7 days (1 week), total available hours is 10.
    const plan = calculateTimePlanning({
      interviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days remaining
      hoursPerWeek: 10,
      prioritizedGaps: mockGaps
    });

    assert(
      plan.availableHours === 10,
      "Deadline calculation: 10 available study hours computed for 1 week"
    );
    assert(
      plan.inScopeSkills.filter(s => s.gap).length < mockGaps.length,
      "Time Engine: Gaps trimmed because 75 hours required exceeds 10 available hours"
    );
    assert(
      plan.timeSprintWarning === true,
      "Time Engine: Sprint warning triggered for insufficient time on high priority skills"
    );
  } catch (err) {
    assert(false, `Test 11 threw error: ${err.message}`);
  }

  // --- Test 12: Fallbacks & Unknown Domains ---
  try {
    // Check local fallback template when AI is missing/fails
    const intelligence = await getRoleAndCompanyIntelligence({
      targetRole: 'Astrophysics Researcher',
      company: 'NASA'
    });

    assert(
      intelligence.role && intelligence.role.roleTitle === 'Astrophysics Researcher',
      "Robustness: Unknown role creates a valid profile description structure"
    );
    assert(
      intelligence.company && intelligence.company.name === 'NASA',
      "Robustness: Company name is resolved without breaking analysis"
    );
  } catch (err) {
    assert(false, `Test 12 threw error: ${err.message}`);
  }

  // --- Test 13: End-to-end Engine Coordination ---
  try {
    const rawProfile = {
      skills: [
        { name: 'javascript', level: 'advanced' },
        { name: 'html', level: 'expert' }
      ]
    };
    const targetParams = {
      targetRole: 'Frontend Developer',
      company: 'Vercel',
      hoursPerWeek: 15,
      deadlineDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    const roadmapData = await generateRoadmap('test-user-id', rawProfile, targetParams);
    
    assert(
      roadmapData.roadmap && roadmapData.roadmap.phases.length > 0,
      "Engine Coordination: E2E roadmap successfully generated and structured into phases"
    );
    assert(
      roadmapData.roadmap.targetRole === 'Frontend Developer',
      "Engine Coordination: Target role assigned correctly in roadmap contract"
    );
  } catch (err) {
    assert(false, `Test 13 threw error: ${err.message}`);
  }

  console.log("\n==================================================");
  console.log(`TEST RUN COMPLETED: ${passes} PASSES, ${fails} FAILURES`);
  console.log("==================================================");

  // Close DB connection
  await mongoose.disconnect();
  
  if (fails > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
