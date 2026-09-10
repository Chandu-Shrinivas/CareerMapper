import { getChatCompletion } from '../services/chat.service.js';

/**
 * Handle incoming user queries, fetch insights via Groq, and return assistant reply.
 */
export const handleChatCompletion = async (req, res) => {
  const { messages, context } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  try {
    const reply = await getChatCompletion(messages, context);
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('[CHAT CONTROLLER ERROR]', err.message);
    return res.status(500).json({ error: 'Failed to process chat completion. Please try again.' });
  }
};
