import express from 'express';
import { getJobs, analyzeJob } from '../controllers/job.controller.js';

const router = express.Router();

router.get('/jobs', getJobs);
router.post('/jobs/analyze', analyzeJob);

export default router;
