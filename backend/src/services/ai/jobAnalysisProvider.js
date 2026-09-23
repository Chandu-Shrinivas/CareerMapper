import axios from 'axios';
import { config } from '../../config/env.js';
import { buildJobAnalysisPrompt } from './jobAnalysisPrompt.js';
import { validateAndSanitizeJobAnalysis } from './jobAnalysisSchemaValidator.js';
import { getNormalizedSkillName } from '../../utils/skillNormalizer.js';
import { readJsonFile } from '../../utils/fileUtils.js';

/**
 * Base Abstract Provider Class
 */
export class JobAnalysisProvider {
  /**
   * @param {Object} input - { jobTitle, company, description }
   * @returns {Promise<Object>} JobAnalysisResult
   */
  async analyzeJobDescription(input) {
    throw new Error('Method analyzeJobDescription() must be implemented.');
  }
}

/**
 * Gemini Provider Implementation with automatic model & Grok fallback
 */
export class GeminiJobAnalysisProvider extends JobAnalysisProvider {
  constructor(apiKey, modelName = 'gemini-flash-latest') {
    super();
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || config.geminiApiKey;
    this.modelName = modelName;
  }

  async analyzeJobDescription({ jobTitle, company, description }) {
    if (!this.apiKey || this.apiKey.includes('YOUR_') || !this.apiKey.trim()) {
      console.warn('[GEMINI WARNING] Gemini key missing/placeholder. Falling back to Grok/Groq provider.');
      const grok = new GrokJobAnalysisProvider();
      return grok.analyzeJobDescription({ jobTitle, company, description });
    }

    const prompt = buildJobAnalysisPrompt(jobTitle, company, description);
    const modelsToTry = [this.modelName, 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-pro-latest'];

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const response = await axios.post(
          url,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          },
          { timeout: 15000 }
        );

        const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText);
          return validateAndSanitizeJobAnalysis(parsed);
        }
      } catch (err) {
        console.warn(`[GEMINI MODEL ATTEMPT FAILED] Model="${model}":`, err?.response?.data?.error?.message || err.message);
      }
    }

    console.warn('[GEMINI FAILED] All Gemini models failed. Falling back to Grok/Groq provider...');
    const grok = new GrokJobAnalysisProvider();
    return grok.analyzeJobDescription({ jobTitle, company, description });
  }
}

/**
 * Grok / Groq Provider Implementation with Rule-Based Fallback Protection
 */
export class GrokJobAnalysisProvider extends JobAnalysisProvider {
  constructor(apiKey, modelName = 'groq/compound') {
    super();
    this.apiKey = apiKey || process.env.GROQ_API_KEY || config.groqApiKey;
    this.modelName = modelName;
  }

  async analyzeJobDescription({ jobTitle, company, description }) {
    if (!this.apiKey || this.apiKey.includes('YOUR_') || !this.apiKey.trim()) {
      console.warn('[GROK WARNING] Grok API key unconfigured. Using Rule-Based Job Analysis Engine.');
      return fallbackRuleBasedAnalysis(jobTitle, company, description);
    }

    const prompt = buildJobAnalysisPrompt(jobTitle, company, description);
    const modelsToTry = [this.modelName, 'groq/compound', 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b'];

    for (const model of modelsToTry) {
      try {
        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model,
            messages: [
              { role: 'system', content: 'You are a precise technical talent analysis engine. Always output strict JSON.' },
              { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        const content = response.data?.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return validateAndSanitizeJobAnalysis(parsed);
        }
      } catch (err) {
        console.warn(`[GROK MODEL ATTEMPT FAILED] Model="${model}":`, err?.response?.data?.error?.message || err.message);
      }
    }

    console.warn('[AI API RATE LIMIT / DOWN] Reverting to deterministic Rule-Based Analysis Engine...');
    return fallbackRuleBasedAnalysis(jobTitle, company, description);
  }
}

/**
 * Fallback Rule-Based Analysis Engine when cloud AI rate limits hit.
 */

const fallbackRuleBasedAnalysis = (jobTitle, company, description) => {
  const text = (description || '').toLowerCase();
  
  // Dynamically load domain skills vocabulary
  const domainsData = readJsonFile('data/domains.json') || {};
  const matchedTech = [];
  const seenSkills = new Set();

  // Scan all domain skill catalogs for occurrences in job description text
  for (const [domain, skillsList] of Object.entries(domainsData)) {
    for (const rawSkill of skillsList) {
      const skillName = rawSkill.trim();
      if (!skillName || seenSkills.has(skillName.toLowerCase())) continue;

      const escaped = skillName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?<![a-zA-Z0-9])${escaped}(?![a-zA-Z0-9])`, 'i');

      if (pattern.test(text)) {
        seenSkills.add(skillName.toLowerCase());
        const importance = matchedTech.length < 2 ? 'critical' : matchedTech.length < 5 ? 'required' : 'preferred';
        matchedTech.push({
          name: skillName.charAt(0).toUpperCase() + skillName.slice(1),
          category: 'REQUIRED',
          importance,
          skillId: skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
      }
    }
  }

  if (matchedTech.length === 0) {
    matchedTech.push({ name: 'Core Engineering', category: 'REQUIRED', importance: 'critical', skillId: 'engineering' });
  }

  const requirements = matchedTech.map((t, idx) => ({
    id: `req-${idx + 1}`,
    name: t.name,
    canonicalSkillId: t.skillId,
    category: t.category,
    importance: t.importance,
    evidence: `Explicitly mentioned in job description for ${jobTitle}`,
    source: 'job-description',
    reason: ''
  }));

  const roadmapPlan = matchedTech.map((t, idx) => ({
    id: `node-${idx + 1}`,
    title: `${t.name} Core & Patterns`,
    description: `Master key concepts, best practices, and practical application for ${t.name}.`,
    category: 'Technical Stack',
    type: 'technology',
    importance: t.importance,
    canonicalSkillId: t.skillId,
    estimatedMinutes: 180,
    whyRequired: `Direct requirement specified in the ${jobTitle} job description.`,
    jobEvidence: `Experience with ${t.name} requested by ${company}.`,
    preparationGoal: `Demonstrate production readiness in ${t.name}.`,
    resources: [],
    interviewRelevance: 'high',
    prerequisites: idx > 0 ? [`node-${idx}`] : [],
    completionMode: 'all',
    progressEligible: true,
    status: 'default'
  }));

  const edges = [];
  for (let i = 0; i < roadmapPlan.length - 1; i++) {
    edges.push({
      id: `edge-${i + 1}`,
      from: roadmapPlan[i].id,
      to: roadmapPlan[i + 1].id,
      relationType: 'prerequisite'
    });
  }

  const result = {
    job: {
      title: jobTitle,
      company: company,
      seniority: 'Mid / Senior',
      employmentType: 'Full-time',
      location: 'Remote'
    },
    requirements,
    skills: matchedTech.map(t => t.name),
    concepts: ['Architecture', 'Best Practices', 'Testing'],
    responsibilities: ['Develop scalable solutions', 'Collaborate with team'],
    domainKnowledge: [],
    softSkills: ['Problem Solving', 'Communication'],
    experienceRequirements: ['Relevant experience in role'],
    educationRequirements: ['Bachelor degree or equivalent'],
    certifications: [],
    interviewAreas: matchedTech.map((t, i) => ({
      id: `int-${i + 1}`,
      area: `${t.name} Interview Questions`,
      relatedRequirements: [`req-${i + 1}`],
      importance: 'high'
    })),
    roadmapPlan,
    edges
  };

  return validateAndSanitizeJobAnalysis(result);
};

/**
 * Provider Factory Function
 */
export const getJobAnalysisProvider = () => {
  const providerType = (process.env.JOB_ANALYSIS_PROVIDER || 'gemini').toLowerCase();
  
  if (providerType === 'grok' || providerType === 'groq') {
    console.log('[AI PROVIDER] Initialized GrokJobAnalysisProvider');
    return new GrokJobAnalysisProvider();
  }

  console.log('[AI PROVIDER] Initialized GeminiJobAnalysisProvider');
  return new GeminiJobAnalysisProvider();
};
