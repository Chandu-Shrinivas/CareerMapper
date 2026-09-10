import express from 'express';
import { handleChatCompletion } from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/chat', handleChatCompletion);

export default router;
