import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

async function listModels() {
  console.log('--- GEMINI LIST MODELS ---');
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const res = await axios.get(url);
    const models = res.data.models || [];
    console.log('Available Gemini Models:', models.map(m => m.name).slice(0, 15));
  } catch (err) {
    console.log('Gemini ListModels failed:', err.response?.data?.error?.message || err.message);
  }

  console.log('--- GROQ LIST MODELS ---');
  try {
    const res = await axios.get('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
    });
    const models = res.data.data || [];
    console.log('Available Groq Models:', models.map(m => m.id));
  } catch (err) {
    console.log('Groq ListModels failed:', err.response?.data?.error?.message || err.message);
  }
}

listModels();
