import mongoose from 'mongoose';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';
import MarketInsight from '../models/marketInsight.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rolesFilePath = path.join(__dirname, '../data/roles.json');

const resolveRoleTitle = (slug) => {
  try {
    const rolesData = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));
    const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const foundKey = Object.keys(rolesData).find(key => 
      key.toLowerCase().replace(/[^a-z0-9]+/g, '') === normalizedSlug
    );
    return foundKey || slug;
  } catch (e) {
    return slug;
  }
};

const inMemoryCache = new Map();

// Helper to query Tavily API
const queryTavily = async (query) => {
  const apiKey = config.tavilyApiKey;
  if (!apiKey || apiKey === 'PASTE_YOUR_TAVILY_API_KEY_HERE' || !apiKey.trim()) {
    console.warn("[WARNING] Tavily API key configuration is missing.");
    return null;
  }

  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 6
    }, { timeout: 15000 });

    return response.data;
  } catch (error) {
    console.error('Tavily search call failed:', error.message);
    return null;
  }
};

// Helper to clean markdown formatting and repair minor JSON syntax errors from Gemini response
const cleanJsonString = (text) => {
  if (!text) return "";
  let str = text;

  // Remove triple-backtick code fences (with or without language tag)
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

  // Repair trailing commas before closing braces/brackets (e.g. `[ "a", "b", ]` -> `[ "a", "b" ]`)
  str = str.replace(/,\s*([}\]])/g, '$1');

  return str;
};

// Helper to compile research prompt
const buildResearchPrompt = (role, country, searchContext) => {
  return [
    `You are a career market analyst system for CareerMapper.`,
    `You are given raw search results about the job market for the role '${role}' in '${country}'. Use them as a starting point.`,
    ``,
    `RAW SEARCH RESULTS:`,
    searchContext,
    ``,
    `Research the job market specifically for the role '${role}' in '${country}'.`,
    `Provide details on overview (description, responsibilities, environment, experienceLevels, technologies), demand status/signals, core/emerging/stable/declining skills, active companies hiring, and salary ranges.`,
    ``,
    `=== HISTORICAL DEMAND INDEX (2016-2026) ===`,
    `Your goal is to produce a COMPLETE normalized job-demand index for '${role}' in '${country}' covering every year from 2016 to 2026. BASE YEAR: 2016 = 100.`,
    ``,
    `STEP 1 — GATHER ALL SIGNALS:`,
    `Search for any historical job market evidence for '${role}' in '${country}':`,
    `  - Yearly job postings or openings counts`,
    `  - Year-on-year (YoY) growth percentages from Naukri, LinkedIn, Indeed, foundit, or recruitment reports`,
    `  - Hiring demand indexes or recruitment volume trends`,
    `  - General India IT/tech sector hiring data if role-specific data is missing for early years`,
    ``,
    `STEP 2 — CHAIN COMPOUND GROWTH:`,
    `If you find YoY growth rates for specific years (e.g. 2024 YoY = +71%):`,
    `  value_N = value_(N-1) × (1 + growth_N / 100)`,
    `Work forwards AND backwards from any known anchor. Chain observed rates to build the series.`,
    `For years before the first observed data point (e.g. 2017-2023 when first signal is 2024):`,
    `  Search for India IT/AI sector growth for that period (typically 12-20% per year 2016-2022).`,
    `  Use that sector growth as an estimated proxy. Mark as "estimated".`,
    ``,
    `STEP 3 — INTERPOLATE GAPS:`,
    `For any year between two derived/observed points with no direct signal:`,
    `  Use linear interpolation of the index values between the two anchor points.`,
    `  Mark these as "estimated".`,
    ``,
    `STEP 4 — CLASSIFY EVERY YEAR:`,
    `  "base"      = 2016 anchor (value always 100)`,
    `  "observed"  = value directly from a reported figure (e.g. job count from Naukri report)`,
    `  "derived"   = computed by applying an observed YoY growth rate to the previous year's value`,
    `  "estimated" = interpolated between two anchors, or extrapolated using sector proxy trends`,
    `  "predicted" = forward projection beyond the last reliable data point`,
    ``,
    `CRITICAL RULES:`,
    `  - Produce a value for EVERY year 2016-2026. Only use null if you genuinely cannot find any basis.`,
    `  - Never fabricate a specific job-opening count. Growth percentages sourced from reports are fine.`,
    `  - Never label an estimated/derived/predicted value as "observed".`,
    `  - Record every observed growth signal in the observedEvidence array (year, growth %, source, url).`,
    `  - Set available: false ONLY if you find zero useful signals and cannot construct any curve.`,
    ``,
    `JSON SCHEMA:`,
    `{`,
    `  "role": "${role}",`,
    `  "country": "${country}",`,
    `  "overview": {`,
    `    "description": "What this role does",`,
    `    "responsibilities": ["Responsibility 1", "Responsibility 2"],`,
    `    "environment": "Typical working environment",`,
    `    "experienceLevels": "Typical experience levels",`,
    `    "technologies": ["Technology 1", "Technology 2"]`,
    `  },`,
    `  "demand": {`,
    `    "status": "growing|stable|declining|mixed|insufficient_data",`,
    `    "confidence": "high|medium|low",`,
    `    "signals": [`,
    `      { "signal": "Demand signal description...", "source": "Source citation" }`,
    `    ]`,
    `  },`,
    `  "historicalEvidence": [],`,
    `  "historicalTrend": {`,
    `    "available": true,`,
    `    "metric": "normalized job demand index",`,
    `    "baseYear": 2016,`,
    `    "baseValue": 100,`,
    `    "data": [`,
    `      {`,
    `        "year": 2016,`,
    `        "value": 100,`,
    `        "type": "base | observed | derived | estimated | predicted",`,
    `        "metric": "demand index",`,
    `        "unit": "index",`,
    `        "source": "Source Name or null",`,
    `        "url": "https://example.com/source-url or null",`,
    `        "evidence": "Evidence details or null"`,
    `      }`,
    `    ],`,
    `    "method": "Explain exactly how you calculated or estimated each year's value",`,
    `    "observedEvidence": [`,
    `      { "year": 2024, "growth": 71, "unit": "percent", "source": "Source Name", "url": "URL", "evidence": "Evidence details" }`,
    `    ],`,
    `    "confidence": "high|medium|low"`,
    `  },`,
    `  "skills": {`,
    `    "core": ["Skill A"],`,
    `    "emerging": ["Skill B"],`,
    `    "stable": ["Skill C"],`,
    `    "declining": ["Skill D"]`,
    `  },`,
    `  "companies": [`,
    `    { "company": "Company Name", "role": "Role Title", "location": "Location", "experience": "Exp", "requiredSkills": ["Skill A"], "preferredSkills": ["Skill B"], "salary": "Salary or null", "postingDate": "Date or null", "source": { "title": "Title", "url": "URL" } }`,
    `  ],`,
    `  "salary": [`,
    `    { "experienceLevel": "fresher|junior|mid|senior|lead", "min": 400000, "max": 700000, "currency": "INR", "period": "annual", "source": { "title": "Report", "organization": "Org", "url": "URL" } }`,
    `  ],`,
    `  "sources": [`,
    `    { "title": "Article", "organization": "Org", "sourceType": "Job Platform", "url": "URL" }`,
    `  ]`,
    `}`,
    ``,
    `Respond ONLY with the JSON object. Do not wrap in markdown or add explanations outside the JSON.`
  ].join('\n');
};

const getFallbackSkeleton = (role, country) => {
  return {
    role,
    country,
    overview: {
      description: `Job market details for ${role} in ${country}.`,
      responsibilities: ["Core role duties"],
      environment: "Standard workplace",
      experienceLevels: "All levels",
      technologies: []
    },
    demand: {
      status: "insufficient_data",
      confidence: "low",
      signals: []
    },
    historicalEvidence: [],
    historicalTrend: {
      available: false,
      reason: "insufficient_historical_evidence",
      metric: "normalized job demand index",
      baseYear: 2016,
      baseValue: 100,
      data: [],
      method: "Baseline fallback data",
      observedEvidence: [],
      confidence: "low"
    },
    skills: {
      core: [],
      emerging: [],
      stable: [],
      declining: []
    },
    companies: [],
    salary: [],
    sources: []
  };
};

// Quality validator helper to ensure failed/skeleton responses are never saved
const isValidMarketInsight = (insight) => {
  if (!insight) return false;
  const desc = insight.overview?.description || '';
  if (desc.startsWith('Job market details for') || desc.startsWith('Insufficient data')) return false;
  if (insight.demand?.status === 'insufficient_data') return false;
  if (!Array.isArray(insight.skills?.core) || insight.skills.core.length === 0) return false;
  return true;
};

const inProgressRequests = new Map();

// Main service query handler
export const getMarketAnalysisData = async (role, country, forceRefresh = false) => {
  const roleSlug = role.toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-z0-9-]/g, '');
  const roleTitle = resolveRoleTitle(roleSlug);
  const cacheKey = `${roleSlug}:${country.toLowerCase()}`;

  // 1. Check cache (unless forceRefresh is explicitly true)
  if (!forceRefresh) {
    if (mongoose.connection.readyState === 1) {
      try {
        const cached = await MarketInsight.findOne({ 
          $or: [{ role: roleSlug }, { role: roleTitle }, { role: new RegExp('^' + roleSlug.replace(/-/g, '[\\s-]') + '$', 'i') }],
          country: country.toLowerCase() 
        });
        if (cached && new Date(cached.expiresAt) > new Date() && isValidMarketInsight(cached)) {
          console.log(`[MARKET] role="${roleTitle}" country="${country}" cacheKey="${cacheKey}" cacheHit=true fetchStarted=false geminiCalled=false tavilyCalled=false cacheSaved=false`);
          return { ...cached.toObject(), isCacheHit: true };
        }
      } catch (err) {
        console.warn("[WARNING] MongoDB cache fetch failed:", err.message);
      }
    }

    const memoryCached = inMemoryCache.get(cacheKey);
    if (memoryCached && new Date(memoryCached.expiresAt) > new Date() && isValidMarketInsight(memoryCached)) {
      console.log(`[MARKET] role="${roleTitle}" country="${country}" cacheKey="${cacheKey}" cacheHit=true fetchStarted=false geminiCalled=false tavilyCalled=false cacheSaved=false (Memory)`);
      return { ...memoryCached, isCacheHit: true };
    }
  } else {
    console.log(`[MARKET] role="${roleTitle}" country="${country}" cacheKey="${cacheKey}" forceRefresh=true — bypassing cache`);
  }

  // 2. Check if a request is already in progress for this exact cacheKey to deduplicate
  if (inProgressRequests.has(cacheKey)) {
    console.log(`[MARKET] role="${roleTitle}" country="${country}" cacheKey="${cacheKey}" cacheHit=false fetchStarted=false (deduplicated - sharing in-progress promise)`);
    return inProgressRequests.get(cacheKey);
  }

  // 3. Create the fetch promise
  const fetchPromise = (async () => {
    console.log(`[MARKET] role="${roleTitle}" country="${country}" cacheKey="${cacheKey}" cacheHit=false fetchStarted=true forceRefresh=${forceRefresh}`);
    
    // Step 3A: Call Tavily first for fast, reliable web search context (~3s)
    let searchContext = "No search results available.";
    let tavilySuccess = false;
    try {
      const tQuery = `"${roleTitle}" ${country} hiring growth job postings historical trend 2016 2017 2018 2019 2020 2021 2022 2023 2024 2025 2026`;
      console.log(`[MARKET] tavilyCalled=true role="${roleTitle}"`);
      const searchData = await queryTavily(tQuery);
      if (searchData && searchData.results && searchData.results.length > 0) {
        tavilySuccess = true;
        console.log(`[MARKET] tavilyReturned=${searchData.results.length} results role="${roleTitle}"`);
        searchContext = searchData.results.map((r, i) => {
          return `[Source ${i+1}] Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}\n`;
        }).join("\n") + `\nSummary: ${searchData.answer || ''}`;
      }
    } catch (err) {
      console.warn("[WARNING] Tavily query failed:", err.message);
    }

    const apiKey = config.geminiApiKey;
    if (!apiKey || apiKey === 'PASTE_YOUR_GEMINI_API_KEY_HERE' || !apiKey.trim()) {
      throw new Error('Gemini API key is not configured.');
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
    const prompt = buildResearchPrompt(roleTitle, country, searchContext);

    const callGeminiWithRetry = async (payload, timeoutMs, maxRetries = 2) => {
      let attempt = 0;
      while (attempt < maxRetries) {
        try {
          const res = await axios.post(geminiUrl, payload, { timeout: timeoutMs });
          return res;
        } catch (err) {
          const isRateLimit = err.response && err.response.status === 429;
          if (isRateLimit && attempt < maxRetries - 1) {
            attempt++;
            const backoff = attempt * 5000;
            console.warn(`[RATE LIMIT] Gemini 429. Retrying in ${backoff}ms (attempt ${attempt}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
          } else {
            throw err;
          }
        }
      }
    };

    let parsedInsight;
    let response;
    
    // PRIMARY PATH: Fast Gemini synthesis using Tavily context (WITHOUT googleSearch tool)
    try {
      console.log(`[GEMINI] Synthesizing market research from Tavily context for: ${roleTitle}...`);
      response = await callGeminiWithRetry({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      }, 45000, 2);

      const responseText = response.data.candidates[0].content.parts[0].text;
      const cleanedText = cleanJsonString(responseText);
      parsedInsight = JSON.parse(cleanedText);
      console.log(`[GEMINI] Synthesis succeeded for: ${roleTitle}`);
    } catch (primaryError) {
      console.warn(`[WARNING] Primary Gemini synthesis failed: ${primaryError.message}. Attempting secondary Google Search Grounding fallback...`);
      try {
        // SECONDARY FALLBACK: Only use Google Search Grounding if primary path failed
        response = await callGeminiWithRetry({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ googleSearch: {} }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        }, 120000, 2);

        const responseText = response.data.candidates[0].content.parts[0].text;
        const cleanedText = cleanJsonString(responseText);
        parsedInsight = JSON.parse(cleanedText);
        console.log(`[GEMINI] Secondary Search Grounding succeeded for: ${roleTitle}`);
      } catch (fallbackError) {
        console.error("[ERROR] Gemini synthesis failed completely:", fallbackError.message);
        throw fallbackError; // Propagate error — DO NOT SAVE SKELETON TO CACHE!
      }
    }

    // --- Server-side linear interpolation ---
    if (parsedInsight.historicalTrend && Array.isArray(parsedInsight.historicalTrend.data)) {
      const tdata = parsedInsight.historicalTrend.data.slice().sort((a, b) => a.year - b.year);

      for (let i = 0; i < tdata.length; i++) {
        if (tdata[i].value !== null && tdata[i].value !== undefined) continue;

        let prev = null, next = null;
        for (let j = i - 1; j >= 0; j--) {
          if (tdata[j].value !== null && tdata[j].value !== undefined) { prev = tdata[j]; break; }
        }
        for (let j = i + 1; j < tdata.length; j++) {
          if (tdata[j].value !== null && tdata[j].value !== undefined) { next = tdata[j]; break; }
        }

        if (prev && next) {
          const span    = next.year - prev.year;
          const offset  = tdata[i].year - prev.year;
          const interp  = prev.value + (next.value - prev.value) * (offset / span);
          tdata[i].value    = Math.round(interp * 10) / 10;
          tdata[i].type     = 'estimated';
          tdata[i].metric   = 'demand index';
          tdata[i].unit     = 'index';
          tdata[i].source   = 'server-side interpolation';
          tdata[i].evidence = `Linearly interpolated between ${prev.year} (${prev.value}) and ${next.year} (${next.value})`;
        }
      }

      parsedInsight.historicalTrend.data = tdata;
    }

    // Validate historicalTrend data count (after interpolation)
    if (!parsedInsight.historicalTrend) {
      parsedInsight.historicalTrend = {
        available: false,
        reason: "insufficient_historical_evidence",
        data: [],
        observedEvidence: []
      };
    } else {
      const trend = parsedInsight.historicalTrend;
      const dataPoints = Array.isArray(trend.data) ? trend.data : [];
      const nonNullPoints = dataPoints.filter(p => p.value !== null && p.value !== undefined);

      if (trend.available === true && nonNullPoints.length < 3) {
        console.log(`[VALIDATION] Insufficient non-null historical points (${nonNullPoints.length} < 3). Overriding to unavailable state.`);
        trend.available = false;
        trend.reason = "insufficient_historical_evidence";
        trend.data = [];
      } else if (trend.available === false) {
        trend.reason = "insufficient_historical_evidence";
        trend.data = [];
      }
    }

    // Pre-cache Quality Safeguard: Validate generated insight before saving
    if (!isValidMarketInsight(parsedInsight)) {
      console.error(`[QUALITY ERROR] Generated insight for ${roleTitle} failed quality validation. Skipping cache write.`);
      throw new Error("Search completed but yielded insufficient market data.");
    }

    // Normalize structure
    parsedInsight.role = roleTitle;
    parsedInsight.country = country.toLowerCase();
    
    const generatedAt = new Date();
    const expiresAt = new Date(generatedAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration
    
    parsedInsight.generatedAt = generatedAt;
    parsedInsight.expiresAt = expiresAt;
    parsedInsight.isCacheHit = false;

    // Save ONLY valid results to Cache
    if (mongoose.connection.readyState === 1) {
      try {
        await MarketInsight.findOneAndUpdate(
          { role: roleTitle, country: country.toLowerCase() },
          parsedInsight,
          { upsert: true, new: true }
        );
        console.log(`[CACHE SAVE] Saved validated analysis for ${roleTitle} to MongoDB.`);
      } catch (err) {
        console.warn("[WARNING] MongoDB cache write failed:", err.message);
      }
    }

    inMemoryCache.set(cacheKey, parsedInsight);
    console.log(`[CACHE SAVE] Saved validated analysis for ${roleTitle} to Memory.`);
    console.log(`[MARKET] role="${roleTitle}" country="${country}" cacheKey="${cacheKey}" fetchCompleted=true cacheSaved=true available=${parsedInsight.historicalTrend?.available}\n`);

    return parsedInsight;
  })();

  inProgressRequests.set(cacheKey, fetchPromise);

  try {
    const result = await fetchPromise;
    return result;
  } finally {
    inProgressRequests.delete(cacheKey);
  }
};
