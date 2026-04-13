import express from 'express';
import { detectDomain } from '../controllers/skill.controller.js';

const router = express.Router();

router.post('/detect-domain', detectDomain);

export default router;
