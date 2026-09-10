import express from 'express';
import { getActiveTargetRole, setActiveTargetRole } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/user/target-role', getActiveTargetRole);
router.post('/user/target-role', setActiveTargetRole);

export default router;
