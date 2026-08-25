import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/careermapper',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  geminiApiKey: process.env.GEMINI_API_KEY,
  tavilyApiKey: process.env.TAVILY_API_KEY,
  rapidApiKey: process.env.RAPIDAPI_KEY || process.env.JSEARCH_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  jobCacheTtlHours: parseInt(process.env.JOB_CACHE_TTL_HOURS || '12', 10)
};
