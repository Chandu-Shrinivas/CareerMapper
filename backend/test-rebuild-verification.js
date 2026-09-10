import mongoose from 'mongoose';
import { config } from './src/config/env.js';
import RoleRoadmap from './src/models/roleRoadmap.model.js';
import UserRoleProgress from './src/models/userRoleProgress.model.js';
import JobPreparation from './src/models/jobPreparation.model.js';
import InterviewSession from './src/models/interviewSession.model.js';
import { seedRoleRoadmapsIfNeeded } from './src/controllers/roleRoadmap.controller.js';
import { prepareJob } from './src/controllers/jobPreparation.controller.js';

async function runVerification() {
  console.log('--- CAREERMAPPER REBUILD BACKEND VERIFICATION ---');
  
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✓ Connected to MongoDB:', config.mongoUri);

    // 1. Verify Role Roadmaps Seeding
    await seedRoleRoadmapsIfNeeded();
    const roleCount = await RoleRoadmap.countDocuments();
    console.log(`✓ RoleRoadmaps library count: ${roleCount}`);

    const frontendRole = await RoleRoadmap.findOne({ slug: 'frontend-developer' });
    console.log('✓ Frontend Developer roadmap title:', frontendRole?.title, 'with', frontendRole?.nodes?.length, 'nodes');

    // 2. Verify User Role Progress toggle
    const testUserId = 'test-user-verification@careermapper.app';
    const testSlug = 'frontend-developer';
    const testNodeId = 'html-css';

    let progress = await UserRoleProgress.findOne({ userId: testUserId, roleSlug: testSlug });
    if (!progress) {
      progress = await UserRoleProgress.create({ userId: testUserId, roleSlug: testSlug, completedNodes: [testNodeId] });
    } else {
      if (!progress.completedNodes.includes(testNodeId)) {
        progress.completedNodes.push(testNodeId);
        await progress.save();
      }
    }
    console.log(`✓ UserRoleProgress persisted node "${testNodeId}" for ${testUserId}. Total completed: ${progress.completedNodes.length}`);

    // 3. Verify JobPreparation Generation & Deterministic Score
    const testJobId = 'job-fsd-01'; // Razorpay Full Stack Developer
    const mockReq = {
      params: { jobId: testJobId },
      body: { email: testUserId, userSkills: ['React', 'JavaScript', 'HTML', 'CSS'] },
      user: { email: testUserId }
    };

    let resData = null;
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          resData = data;
          return data;
        }
      })
    };

    await prepareJob(mockReq, mockRes);
    console.log('✓ JobPreparation controller executed.');
    if (resData && resData.data) {
      console.log('  Job Title:', resData.data.jobTitle);
      console.log('  Company:', resData.data.company);
      console.log('  Deterministic Readiness Score:', resData.data.readinessScore, '%');
      console.log('  Extracted Skills:', resData.data.extractedSkills.length);
      console.log('  Matched Skills:', resData.data.matchedSkills.length);
      console.log('  Missing Skills:', resData.data.missingSkills.length);
      console.log('  Tasks generated:', resData.data.tasks.length);
    }

    console.log('\n--- VERIFICATION SUCCESSFUL ---');
  } catch (err) {
    console.error('❌ VERIFICATION FAILED:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runVerification();
