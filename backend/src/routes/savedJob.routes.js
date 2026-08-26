import express from 'express';
import { 
  saveJob, 
  getSavedJobs, 
  updateSavedJobStatus, 
  deleteSavedJob, 
  getTrackerSummary 
} from '../controllers/savedJob.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are scoped by user Email identity and protected by auth middleware
router.post('/jobs/saved', requireAuth, saveJob);
router.get('/jobs/saved', requireAuth, getSavedJobs);
router.patch('/jobs/saved/:savedJobId/status', requireAuth, updateSavedJobStatus);
router.delete('/jobs/saved/:savedJobId', requireAuth, deleteSavedJob);
router.get('/jobs/tracker', requireAuth, getTrackerSummary);

export default router;
