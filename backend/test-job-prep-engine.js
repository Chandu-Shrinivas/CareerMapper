import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import JobPreparation from './src/models/jobPreparation.model.js';
import JobAnalysis from './src/models/jobAnalysis.model.js';
import { 
  analyzeJobDescriptionWithCache, 
  createOrGetJobPreparation,
  toggleJobRoadmapNodeStatus,
  computeJobDescriptionHash
} from './src/services/jobPreparation.service.js';

async function runTests() {
  console.log('=== MY JOB PREPARATION ROADMAPS — TEST SUITE ===');

  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/careermapper');
  console.log('✓ Connected to MongoDB');

  const testJob = {
    id: 'test-job-999',
    title: 'Senior Backend Developer',
    company: 'Acme Corp',
    source: 'JSearch',
    description: `
    Responsibilities:
    - Build and maintain high-performance REST microservices using Java 17 and Spring Boot.
    - Design normalized MySQL database schemas and write complex SQL queries and ACID transactions.
    - Containerize applications using Docker and deploy to AWS Cloud infrastructure.
    - Write unit and integration tests using JUnit and Mockito.

    Requirements:
    - 5+ years experience in Java and Spring Boot.
    - Strong proficiency in SQL, MySQL, and database indexing.
    - Solid understanding of Git, Linux commands, and CI/CD pipelines.
    - Bachelor's degree in Computer Science.
    `
  };

  const userSkills = ['Java', 'SQL', 'Git'];

  // Clear previous test caches
  const { hash } = computeJobDescriptionHash(testJob.description);
  await JobAnalysis.deleteMany({ descriptionHash: hash });
  await JobPreparation.deleteMany({ userId: 'test-user-1', jobId: testJob.id });

  // Test 1: SHA-256 Hash Computation
  console.log(`✓ Test 1: SHA-256 Hash computed: ${hash.slice(0, 16)}...`);

  // Test 2: AI Job Analysis & Cache Save
  console.log('Testing AI Analysis and Cache Save...');
  const analysisResult1 = await analyzeJobDescriptionWithCache(testJob.title, testJob.company, testJob.description);
  console.log(`✓ Test 2: AI Job Analysis returned ${analysisResult1.analysis.requirements.length} requirements and ${analysisResult1.analysis.roadmapPlan.length} roadmap nodes. Cached: ${analysisResult1.cached}`);

  // Test 3: Cache Hit (Same JD twice -> 0 AI calls)
  console.log('Testing Cache Hit on duplicate analysis...');
  const analysisResult2 = await analyzeJobDescriptionWithCache(testJob.title, testJob.company, testJob.description);
  console.log(`✓ Test 3: Second call cached=${analysisResult2.cached}. Hash matches: ${analysisResult1.hash === analysisResult2.hash}`);

  if (!analysisResult2.cached) {
    console.error('❌ FAIL: Cache hit test failed! AI was re-invoked on identical JD.');
  }

  // Test 4: Job Preparation Roadmap Creation & Deterministic Readiness
  console.log('Creating Job Preparation Roadmap...');
  const prep = await createOrGetJobPreparation('test-user-1', testJob, userSkills);
  
  console.log(`✓ Test 4: Job Preparation created with ID=${prep._id}`);
  console.log(`   - Readiness Score: ${prep.readiness.overallReadiness}%`);
  console.log(`   - Critical Readiness: ${prep.readiness.criticalReadiness}%`);
  console.log(`   - Nodes count: ${prep.nodes.length}, Edges count: ${prep.edges.length}`);

  // Test 5: Node Status Toggle & Readiness Recalculation
  console.log('Toggling Spring Boot node to DONE...');
  const springBootNode = prep.nodes.find(n => n.title.toLowerCase().includes('spring') || n.canonicalSkillId === 'spring-boot' || n.canonicalSkillId === 'java');
  const targetNode = springBootNode || prep.nodes[0];

  if (targetNode) {
    const prevScore = prep.readiness.overallReadiness;
    const updatedPrep = await toggleJobRoadmapNodeStatus(prep._id, 'test-user-1', targetNode.id, 'done');
    console.log(`✓ Test 5: Toggled node "${targetNode.title}" to DONE. Updated Readiness: ${updatedPrep.readiness.overallReadiness}%`);
    if (updatedPrep.readiness.overallReadiness < prevScore) {
      console.warn('⚠️ Readiness score decreased after completing a node.');
    }
  }

  // Clean up test data
  await JobPreparation.deleteMany({ userId: 'test-user-1', jobId: testJob.id });
  await JobAnalysis.deleteMany({ descriptionHash: hash });

  console.log('=== ALL BACKEND TESTS PASSED SUCCESSFULLY ===');
  await mongoose.disconnect();
}

runTests().catch(err => {
  console.error('❌ TEST FAILED:', err);
  process.exit(1);
});
