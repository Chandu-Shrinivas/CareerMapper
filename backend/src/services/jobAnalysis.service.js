import JobAnalysis from '../models/jobAnalysis.model.js';
import axios from 'axios';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { getNormalizedSkillName } from '../utils/skillNormalizer.js';
import { resolveSkill } from './skill.service.js';

const inMemoryJobAnalysisCache = new Map();

/**
 * Fetch and analyze a job description using Groq AI.
 * Static elements are cached, while user-specific skill matching is calculated dynamically.
 */
export const getJobAnalysis = async (jobId, description, jobTitle, userSkills = [], userRole = '') => {
  let staticAnalysis = null;

  // 1. Check in-memory cache
  if (inMemoryJobAnalysisCache.has(jobId)) {
    console.log(`[JOB ANALYSIS CACHE HIT] Memory — jobId="${jobId}"`);
    staticAnalysis = inMemoryJobAnalysisCache.get(jobId);
  }

  // 2. Check MongoDB cache
  if (!staticAnalysis && mongoose.connection.readyState === 1) {
    try {
      const dbCached = await JobAnalysis.findOne({ jobId });
      if (dbCached) {
        console.log(`[JOB ANALYSIS CACHE HIT] MongoDB — jobId="${jobId}"`);
        staticAnalysis = dbCached.toObject ? dbCached.toObject() : dbCached;
        inMemoryJobAnalysisCache.set(jobId, staticAnalysis);
      }
    } catch (err) {
      console.warn('[WARNING] Job analysis MongoDB cache read failed:', err.message);
    }
  }

  // 3. Perform Live Groq Extraction if not cached
  if (!staticAnalysis) {
    let extractedSkills = [];
    let structuredDescription = null;

    const groqApiKey = config.groqApiKey;
    if (!groqApiKey || groqApiKey === 'YOUR_GROQ_API_KEY_HERE' || !groqApiKey.trim()) {
      console.warn('[WARNING] GROQ_API_KEY is unconfigured. Falling back to default extraction.');
    } else {
      try {
        console.log(`[GROQ] Analyzing job description for job="${jobId}"...`);
        const prompt = `
Analyze the following job description. Extract all relevant technical and non-technical skills, tools, frameworks, languages, platforms, certifications, and domain skills required for the job.
Also, structure the raw job description into sections. Do not invent any information. If a section is not present in the text, leave it empty or omit it. Clean up repeated sentences (such as "reputed company" or similar noise) or corrupted duplicate formatting.
If the job description already contains structured formatting, headers, or bullet points, preserve the original structure and content, simply extracting the skills and formatting it cleanly into the requested JSON schema.

Respond strictly in JSON format. The JSON object must match this schema:
{
  "skills": ["Skill1", "Skill2", ...],
  "structuredDescription": {
    "aboutRole": "Brief summary of the role if available, or empty string",
    "responsibilities": ["List of responsibilities, or empty array"],
    "requiredSkills": ["List of explicitly required skills/tools, or empty array"],
    "preferredSkills": ["List of preferred/nice-to-have skills/tools, or empty array"],
    "experience": "Experience requirements, or empty string",
    "education": "Education requirements, or empty string",
    "benefits": ["List of benefits/perks, or empty array"],
    "otherRequirements": "Any other requirements, or empty string"
  }
}

Job Description:
${description}
`;

        const groqRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.1
        }, {
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 12000
        });

        const contentText = groqRes.data?.choices?.[0]?.message?.content;
        if (contentText) {
          const parsed = JSON.parse(contentText);
          extractedSkills = Array.isArray(parsed.skills) ? parsed.skills : [];
          structuredDescription = parsed.structuredDescription || null;
          console.log(`[GROQ] Analysis complete for "${jobId}". Extracted ${extractedSkills.length} skills.`);
        }
      } catch (err) {
        console.error('[WARNING] Groq API call failed or timed out:', err?.response?.data || err.message);
      }
    }

    // Fallback if Groq failed or was unconfigured
    if (!structuredDescription) {
      structuredDescription = fallbackStructureDescription(description);
    }
    if (extractedSkills.length === 0) {
      extractedSkills = fallbackExtractSkills(description);
    }

    // Save to Cache (Stays in cache for 7 days)
    const ttlHours = 24 * 7;
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
    staticAnalysis = {
      jobId,
      extractedSkills,
      structuredDescription,
      expiresAt
    };

    inMemoryJobAnalysisCache.set(jobId, staticAnalysis);
    if (mongoose.connection.readyState === 1) {
      try {
        await JobAnalysis.findOneAndUpdate({ jobId }, staticAnalysis, { upsert: true, new: true });
        console.log(`[JOB ANALYSIS CACHE SAVE] Saved analysis for "${jobId}" to MongoDB.`);
      } catch (err) {
        console.warn('[WARNING] Job analysis MongoDB cache save failed:', err.message);
      }
    }
  }

  // 4. Perform Dynamic Skill Matching (User-Specific)
  return await enrichAnalysisWithUserSkills(staticAnalysis, userSkills, userRole, jobTitle);
};

// Helper: fallback parsing of description into sections
const fallbackStructureDescription = (description) => {
  // Cleanup repeated company names or common spam words
  let cleaned = (description || '')
    .replace(/(reputed company\s*)+/gi, 'reputed company')
    .replace(/(reputed\s*)+/gi, 'reputed')
    .replace(/(company\s*)+/gi, 'company')
    .trim();

  return {
    aboutRole: cleaned,
    responsibilities: [],
    requiredSkills: [],
    preferredSkills: [],
    experience: '',
    education: '',
    benefits: [],
    otherRequirements: ''
  };
};

// Helper: fallback skill extraction using regex matching
const fallbackExtractSkills = (description) => {
  const commonTechSkills = [
    'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 
    'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'PHP', 'HTML', 'CSS', 'Figma', 
    'Sketch', 'Postgres', 'Redis', 'Machine Learning', 'Data Science', 'TensorFlow', 
    'PyTorch', 'Testing', 'Selenium', 'QA', 'Marketing', 'Sales', 'Product Management',
    'Agile', 'Scrum', 'Git', 'CI/CD'
  ];
  const found = [];
  const text = (description || '').toLowerCase();
  for (const skill of commonTechSkills) {
    if (text.includes(skill.toLowerCase())) {
      found.push(skill);
    }
  }
  return found;
};

// Helper: Enrich static analysis with user-specific skills matching
const enrichAnalysisWithUserSkills = async (analysis, userSkills, userRole, jobTitle) => {
  const jobSkills = analysis.extractedSkills || [];
  const userSkillsNormalized = userSkills.map(s => getNormalizedSkillName(s.name || s)).filter(Boolean);
  
  const matchedSkills = [];
  const missingSkills = [];

  jobSkills.forEach(s => {
    const norm = getNormalizedSkillName(s);
    if (norm && userSkillsNormalized.includes(norm)) {
      matchedSkills.push(s);
    } else {
      missingSkills.push(s);
    }
  });

  // Calculate Match Score based on alignment ratio
  let score = 0;
  if (jobSkills.length > 0) {
    const skillMatchRatio = matchedSkills.length / jobSkills.length;
    score = Math.round(skillMatchRatio * 85);
  } else {
    // If no skills were extracted, default to a neutral baseline
    score = 45;
  }

  // Bonus for role title alignment
  if (userRole && jobTitle.toLowerCase().includes(userRole.toLowerCase())) {
    score += 14;
  } else {
    score += 5;
  }

  score = Math.max(0, Math.min(98, score));

  // Resolve all skill names to unified canonical metadata objects
  const [resolvedExtracted, resolvedMatched, resolvedMissing] = await Promise.all([
    Promise.all(jobSkills.map(resolveSkill)),
    Promise.all(matchedSkills.map(resolveSkill)),
    Promise.all(missingSkills.map(resolveSkill))
  ]);

  return {
    jobId: analysis.jobId,
    extractedSkills: resolvedExtracted,
    structuredDescription: analysis.structuredDescription,
    matchedSkills: resolvedMatched,
    missingSkills: resolvedMissing,
    matchScore: score
  };
};
