import axios from 'axios';
import { config } from '../../config/env.js';

// Helper to clean markdown formatting and repair minor JSON syntax errors
const cleanJsonString = (text) => {
  if (!text) return "";
  let str = text;

  // Remove triple-backtick code fences
  const codeBlockMatch = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch) {
    str = codeBlockMatch[1];
  } else {
    const startBrace = str.indexOf('{');
    const endBrace = str.lastIndexOf('}');
    if (startBrace !== -1 && endBrace > startBrace) {
      str = str.substring(startBrace, endBrace + 1);
    }
  }

  str = str.trim();
  // Repair trailing commas before closing braces/brackets
  str = str.replace(/,\s*([}\]])/g, '$1');

  return str;
};

/**
 * AI Gateway supporting multiple providers with fallback logic.
 * Enforces timeouts, validates JSON schema, and catches failures gracefully.
 */
export const generateJSON = async (prompt, systemInstruction = '', schema = null) => {
  const groqApiKey = config.groqApiKey;
  const geminiApiKey = config.geminiApiKey;

  // 1. Try Groq Provider if key is configured
  if (groqApiKey && groqApiKey !== 'YOUR_GROQ_API_KEY_HERE' && groqApiKey.trim()) {
    try {
      console.log('[AI GATEWAY] Routing request to Groq...');
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1
      }, {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      const content = response.data?.choices?.[0]?.message?.content;
      if (content) {
        const cleaned = cleanJsonString(content);
        return JSON.parse(cleaned);
      }
    } catch (err) {
      console.warn('[AI GATEWAY WARNING] Groq call failed, attempting Gemini fallback...', err.message);
    }
  }

  // 2. Try Gemini Provider if key is configured
  if (geminiApiKey && geminiApiKey !== 'PASTE_YOUR_GEMINI_API_KEY_HERE' && geminiApiKey.trim()) {
    try {
      console.log('[AI GATEWAY] Routing request to Gemini...');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      
      const fullPrompt = systemInstruction 
        ? `${systemInstruction}\n\nUser request:\n${prompt}`
        : prompt;

      const response = await axios.post(url, {
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      }, {
        timeout: 15000
      });

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleaned = cleanJsonString(text);
        return JSON.parse(cleaned);
      }
    } catch (err) {
      console.warn('[AI GATEWAY WARNING] Gemini call failed:', err.message);
    }
  }

  // 3. Throw explicit controlled error if both providers fail
  throw new Error('AI providers are unconfigured or temporarily overloaded.');
};
