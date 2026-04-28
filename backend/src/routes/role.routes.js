import express from 'express';
import { getRoleMatches } from '../controllers/role.controller.js';

const router = express.Router();

router.post('/match-roles', getRoleMatches);

export default router;
