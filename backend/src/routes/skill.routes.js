import express from 'express';
import { detectUserDomain, resolveSkillsBatch } from '../controllers/skill.controller.js';

const router = express.Router();

router.post('/detect-domain', detectUserDomain);
router.post('/skills/resolve', resolveSkillsBatch);

export default router;
