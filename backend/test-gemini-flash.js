import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

async function testGeminiFlash() {
  const models = ['gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-pro-latest'];
  for (const m of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const res = await axios.post(url, { contents: [{ parts: [{ text: 'Hello, respond with JSON {"status": "ok"}' }] }] });
      console.log(`SUCCESS for model ${m}:`, res.data.candidates[0].content.parts[0].text);
      return m;
    } catch (err) {
      console.log(`Failed for ${m}:`, err.response?.data?.error?.message || err.message);
    }
  }
}

testGeminiFlash();
