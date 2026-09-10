import express from 'express';
import { createRoadmap, getRoadmap, generateMissions, updateMissionStatus } from '../controllers/roadmap.controller.js';
import { generateProjects, submitEvidence, getEvidence, updateEvidenceStatus, deleteEvidence } from '../controllers/project.controller.js';
import { generateAssessments, getAssessments, getAssessmentDetails, startAssessmentAttempt, submitAssessmentAttempt, getAssessmentResults, getAssessmentAttempts } from '../controllers/assessment.controller.js';
import { recalculateVerification, getRoadmapVerifications, getSkillVerification, postAnalyzeEvidence, getEvidenceAnalysis } from '../controllers/verification.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Mount endpoints
router.post('/roadmap/generate', createRoadmap);
router.get('/roadmap/:id', getRoadmap);
router.get('/roadmap', getRoadmap);
router.post('/roadmap/:roadmapId/missions/generate', generateMissions);
router.patch('/roadmap/:roadmapId/missions/:missionId', requireAuth, updateMissionStatus);

// Practical Projects & Evidence routes (Protected)
router.post('/roadmap/:roadmapId/projects/generate', requireAuth, generateProjects);
router.post('/roadmap/:roadmapId/evidence', requireAuth, submitEvidence);
router.get('/roadmap/:roadmapId/evidence', requireAuth, getEvidence);
router.patch('/evidence/:evidenceId', requireAuth, updateEvidenceStatus);
router.delete('/evidence/:evidenceId', requireAuth, deleteEvidence);

// Adaptive Assessment routes (Protected)
router.post('/roadmap/:roadmapId/assessments/generate', requireAuth, generateAssessments);
router.get('/roadmap/:roadmapId/assessments', requireAuth, getAssessments);
router.get('/assessments/:assessmentId', requireAuth, getAssessmentDetails);
router.post('/assessments/:assessmentId/start', requireAuth, startAssessmentAttempt);
router.post('/assessments/:assessmentId/submit', requireAuth, submitAssessmentAttempt);
router.get('/assessments/:assessmentId/results', requireAuth, getAssessmentResults);
router.get('/assessments/:assessmentId/attempts', requireAuth, getAssessmentAttempts);

// Skill Verification & Confidence routes (Protected)
router.post('/roadmap/:roadmapId/skills/:skillId/verify', requireAuth, recalculateVerification);
router.get('/roadmap/:roadmapId/skills/verification', requireAuth, getRoadmapVerifications);
router.get('/roadmap/:roadmapId/skills/:skillId/verification', requireAuth, getSkillVerification);
router.post('/evidence/:evidenceId/analyze', requireAuth, postAnalyzeEvidence);
router.get('/evidence/:evidenceId/analysis', requireAuth, getEvidenceAnalysis);

// Adaptive Roadmap Recalculation & Versioning routes (Protected)
import { recalculateRoadmap, getRoadmapVersions, getRoadmapVersionDetails, getRoadmapAdaptationSummary } from '../controllers/adaptive.controller.js';
router.post('/roadmap/:roadmapId/recalculate', requireAuth, recalculateRoadmap);
router.get('/roadmap/:roadmapId/versions', requireAuth, getRoadmapVersions);
router.get('/roadmap/:roadmapId/versions/:version', requireAuth, getRoadmapVersionDetails);
router.get('/roadmap/:roadmapId/adaptation', requireAuth, getRoadmapAdaptationSummary);

// Career Roadmap Experience & Mission Control routes (Protected)
import { getRoadmapExperienceController, getNextActionController, getProgressController } from '../controllers/experience.controller.js';
router.get('/roadmap/:roadmapId/experience', requireAuth, getRoadmapExperienceController);
router.get('/roadmap/:roadmapId/next-action', requireAuth, getNextActionController);
router.get('/roadmap/:roadmapId/progress', requireAuth, getProgressController);

// Company Intelligence & Adaptive Interview Preparation routes (Protected)
import { 
  getInterviewPrepController, 
  generateInterviewPrepController, 
  startInterviewSimulationController, 
  respondToSimulationQuestionController, 
  completeInterviewSimulationController,
  prepareSavedJobController
} from '../controllers/interviewPrep.controller.js';

router.get('/roadmap/:roadmapId/interview-prep', requireAuth, getInterviewPrepController);
router.post('/roadmap/:roadmapId/interview-prep/generate', requireAuth, generateInterviewPrepController);
router.post('/roadmap/:roadmapId/interview-simulation/start', requireAuth, startInterviewSimulationController);
router.post('/interview-simulation/:sessionId/respond', requireAuth, respondToSimulationQuestionController);
router.post('/interview-simulation/:sessionId/complete', requireAuth, completeInterviewSimulationController);
router.post('/saved-jobs/:savedJobId/prepare', requireAuth, prepareSavedJobController);

export default router;
