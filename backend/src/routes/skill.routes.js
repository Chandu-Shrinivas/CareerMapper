import express from 'express';
import { detectUserDomain } from '../controllers/skill.controller.js';

const router = express.Router();

router.post('/detect-domain', detectUserDomain);

export default router;
