import express from 'express';
import {
  prepareJob,
  getJobPreparations,
  getJobPreparationById,
  togglePreparationNode,
  recalculateReadiness,
  reanalyzeJob,
  getJobInterviewPrep,
  startInterviewSimulation
} from '../controllers/jobPreparation.controller.js';

const router = express.Router();

router.post('/prepare/:jobId', prepareJob);
router.post('/create', prepareJob);
router.post('/generate', prepareJob);
router.get('/', getJobPreparations);
router.get('/:id', getJobPreparationById);
router.patch('/:id/node-status', togglePreparationNode);
router.post('/:id/node-status', togglePreparationNode);
router.post('/:id/tasks/:taskId/toggle', (req, res, next) => {
  req.body.nodeId = req.params.taskId;
  return togglePreparationNode(req, res, next);
});
router.post('/:id/recalculate', recalculateReadiness);
router.post('/:id/reanalyze', reanalyzeJob);
router.get('/:id/interview-prep', getJobInterviewPrep);
router.post('/:id/interview-simulation', startInterviewSimulation);

export default router;
