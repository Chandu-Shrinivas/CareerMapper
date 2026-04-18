import express from 'express';
import { suggestDomain } from '../controllers/knowledge.controller.js';

const router = express.Router();

router.post('/suggest-domain', suggestDomain);

export default router;
