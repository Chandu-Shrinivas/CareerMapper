import express from 'express';
import {
  prepareJob,
  getJobPreparations,
  getJobPreparationById,
  togglePreparationTask,
  getJobInterviewPrep,
  startInterviewSimulation,
  respondToInterviewSimulation
} from '../controllers/jobPreparation.controller.js';

const router = express.Router();

router.post('/jobs/:jobId/prepare', prepareJob);
router.get('/job-preparations', getJobPreparations);
router.get('/job-preparations/:id', getJobPreparationById);
router.post('/job-preparations/:id/tasks/:taskId/toggle', togglePreparationTask);
router.get('/job-preparations/:id/interview-prep', getJobInterviewPrep);
router.post('/job-preparations/:id/interview-simulation/start', startInterviewSimulation);
router.post('/interview-simulation/:sessionId/respond', respondToInterviewSimulation);

export default router;
