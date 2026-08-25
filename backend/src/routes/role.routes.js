import express from 'express';
import { getRoleMatches, getMarketAnalysis } from '../controllers/role.controller.js';

const router = express.Router();

router.post('/match-roles', getRoleMatches);
router.get('/market-analysis/:role', getMarketAnalysis);

export default router;
