import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

async function testModels() {
  console.log('Testing Gemini API key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
  console.log('Testing Groq API key:', process.env.GROQ_API_KEY ? 'Present' : 'Missing');

  // Test Gemini models
  const geminiModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-2.5-flash'];
  for (const m of geminiModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const res = await axios.post(url, { contents: [{ parts: [{ text: 'Hello' }] }] });
      console.log(`✓ Gemini model SUCCESS: ${m}`);
      break;
    } catch (err) {
      console.log(`✗ Gemini model ${m} failed:`, err.response?.data?.error?.message || err.message);
    }
  }

  // Test Groq models
  const groqModels = ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];
  for (const m of groqModels) {
    try {
      const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: m,
        messages: [{ role: 'user', content: 'Hello' }]
      }, {
        headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
      });
      console.log(`✓ Groq model SUCCESS: ${m}`);
      break;
    } catch (err) {
      console.log(`✗ Groq model ${m} failed:`, err.response?.data?.error?.message || err.message);
    }
  }
}

testModels();
