import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getJobAnalysis } from '../jobAnalysis.service.js';
import { generateJSON } from '../ai/aiGateway.js';
import { normalizeAndResolveSkill } from './normalization.service.js';
import { getNormalizedSkillName } from '../../utils/skillNormalizer.js';
import { config } from '../../config/env.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rolesFilePath = path.join(__dirname, '../../data/roles.json');

// Helper to query Tavily API for company grounding
const queryTavilyCompany = async (companyName) => {
  const apiKey = config.tavilyApiKey;
  if (!apiKey || apiKey === 'PASTE_YOUR_TAVILY_API_KEY_HERE' || !apiKey.trim() || !companyName) {
    return null;
  }

  try {
    const query = `${companyName} company profile industry tech stack and hiring focus`;
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'basic',
      max_results: 3
    }, { timeout: 8000 });

    if (response.data?.results?.length > 0) {
      return response.data.results.map(r => r.content).join('\n');
    }
  } catch (err) {
    console.warn('[WARNING] Tavily company query failed:', err.message);
  }
  return null;
};

/**
 * Resolves local fallback data from roles.json
 */
const getLocalRoleFallback = (roleTitle) => {
  const cleanTitle = (roleTitle || '').split(',')[0].trim();
  const lowerTitle = (roleTitle || '').toLowerCase();

  try {
    const rolesData = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));
    const roleKeys = Object.keys(rolesData);

    // Exact or clean token match
    let matchedKey = roleKeys.find(
      k => k.toLowerCase() === lowerTitle || k.toLowerCase() === cleanTitle.toLowerCase()
    );

    // Substring match
    if (!matchedKey) {
      matchedKey = roleKeys.find(k => lowerTitle.includes(k.toLowerCase()) || k.toLowerCase().includes(cleanTitle.toLowerCase()));
    }

    if (matchedKey) {
      const entry = rolesData[matchedKey];
      const skills = Object.entries(entry.skills || {}).map(([name, weight]) => ({
        name,
        weight
      }));

      const required = skills.filter(s => s.weight >= 3).map(s => s.name);
      const preferred = skills.filter(s => s.weight < 3).map(s => s.name);

      return {
        roleTitle: matchedKey,
        domain: entry.domain || 'Technology',
        responsibilities: [`Perform core tasks associated with ${matchedKey} role.`],
        requiredSkills: required.length > 0 ? required : ['javascript', 'python', 'sql'],
        preferredSkills: preferred,
        experience: '2-4 years',
        education: "Bachelor's degree in a relevant field",
        tools: [],
        certifications: [],
        roleSpecificRequirements: '',
        evidenceType: 'derived'
      };
    }
  } catch (err) {
    console.error('[WARNING] Failed to load local roles.json data:', err.message);
  }

  // Keyword-based fallback
  let defaultSkills = [];
  let domain = 'Technology';

  if (lowerTitle.includes('data') || lowerTitle.includes('analytics') || lowerTitle.includes('science') || lowerTitle.includes('machine')) {
    defaultSkills = ['python', 'pandas', 'machine learning', 'sql', 'statistics', 'data visualization'];
    domain = 'Data Science';
  } else if (lowerTitle.includes('finance') || lowerTitle.includes('financial') || lowerTitle.includes('banking')) {
    defaultSkills = ['financial modeling', 'excel', 'sql', 'statistics'];
    domain = 'Finance';
  } else if (lowerTitle.includes('civil')) {
    defaultSkills = ['autocad', 'civil engineering', 'project management'];
    domain = 'Civil Engineering';
  } else if (lowerTitle.includes('mechanical')) {
    defaultSkills = ['solidworks', 'mechanical design', 'cad'];
    domain = 'Mechanical Engineering';
  } else if (lowerTitle.includes('marketing')) {
    defaultSkills = ['google analytics', 'seo', 'content strategy'];
    domain = 'Marketing';
  } else if (lowerTitle.includes('design') || lowerTitle.includes('ui') || lowerTitle.includes('ux')) {
    defaultSkills = ['figma', 'design systems', 'wireframing'];
    domain = 'Design';
  } else if (lowerTitle.includes('cloud') || lowerTitle.includes('devops') || lowerTitle.includes('sysadmin')) {
    defaultSkills = ['docker', 'kubernetes', 'aws', 'linux'];
    domain = 'DevOps & Cloud';
  } else if (lowerTitle.includes('test') || lowerTitle.includes('qa')) {
    defaultSkills = ['selenium', 'testing', 'cypress', 'javascript'];
    domain = 'Software Quality';
  } else {
    defaultSkills = ['python', 'javascript', 'sql', 'problem solving'];
    domain = 'Technology';
  }

  return {
    roleTitle: cleanTitle || roleTitle,
    domain,
    responsibilities: [`Perform functions of ${roleTitle}.`],
    requiredSkills: defaultSkills,
    preferredSkills: [],
    experience: 'Entry to mid level',
    education: 'Not specified',
    tools: [],
    certifications: [],
    roleSpecificRequirements: '',
    evidenceType: 'derived'
  };
};

/**
 * Main Intelligence Service
 */
export const getRoleAndCompanyIntelligence = async (params) => {
  const { company, targetRole, jobId, description, location } = params;

  let roleInfo = null;
  let companyInfo = {
    name: company || '',
    industry: '',
    description: '',
    technologies: [],
    hiringInfo: '',
    evidenceType: 'derived'
  };

  // 1. Fetch Company Information if name provided
  if (company && company.trim()) {
    const searchContext = await queryTavilyCompany(company);
    if (searchContext) {
      try {
        const prompt = `
Extract verified details about the company "${company}" from this search context:
${searchContext}

If the context contains no relevant details, do not hallucinate. Keep description, technologies, or industry empty.
Respond strictly in JSON format matching this schema:
{
  "industry": "Company industry or sector",
  "description": "Short summary description",
  "technologies": ["technology1", "technology2", ...],
  "hiringInfo": "Hiring practices or active roles if mentioned"
}
`;
        const companyAI = await generateJSON(prompt, 'You extract clean structured company metadata.');
        companyInfo = {
          name: company,
          industry: companyAI.industry || '',
          description: companyAI.description || '',
          technologies: Array.isArray(companyAI.technologies) ? companyAI.technologies : [],
          hiringInfo: companyAI.hiringInfo || '',
          evidenceType: 'verified/source-derived'
        };
      } catch {
        // Fallback for company on AI failure
        companyInfo.evidenceType = 'derived';
      }
    }
  }

  // 2. Fetch Role Requirements
  if (jobId || (description && description.trim())) {
    // A. Source-derived from active job listing
    try {
      console.log(`[INTELLIGENCE] Processing job description for role="${targetRole}"`);
      const analysis = await getJobAnalysis(jobId || 'temp-id', description || '', targetRole, []);
      
      const sd = analysis.structuredDescription || {};
      const required = Array.isArray(sd.requiredSkills) && sd.requiredSkills.length > 0
        ? sd.requiredSkills
        : analysis.extractedSkills?.map(s => s.display || s) || [];
      const preferred = Array.isArray(sd.preferredSkills) ? sd.preferredSkills : [];

      roleInfo = {
        roleTitle: targetRole,
        domain: classifyDomainFromSkills(required),
        responsibilities: sd.responsibilities || [],
        requiredSkills: required,
        preferredSkills: preferred,
        experience: sd.experience || '',
        education: sd.education || '',
        tools: [],
        certifications: [],
        roleSpecificRequirements: sd.otherRequirements || '',
        evidenceType: 'verified/source-derived'
      };
    } catch (err) {
      console.warn('[WARNING] Failed to extract from job description, falling back...', err.message);
    }
  }

  // B. AI-driven inference lookup
  if (!roleInfo) {
    try {
      console.log(`[INTELLIGENCE] Requesting AI inference for role="${targetRole}" at company="${company || 'General'}"`);
      const prompt = `
Generate standard role requirements for the role: "${targetRole}"
Target Company (context): "${company || 'General'}"

Do not invent company-specific details if the company is not well-known. Keep domain-agnostic principles.
Respond strictly in JSON format matching this schema:
{
  "domain": "IT | Mechanical | Civil | Finance | Marketing | Healthcare | etc.",
  "responsibilities": ["Responsibility 1", "Responsibility 2", ...],
  "requiredSkills": ["Skill A", "Skill B", ...],
  "preferredSkills": ["Skill C", "Skill D", ...],
  "experience": "Typical years of experience required",
  "education": "Typical education requirements",
  "tools": ["Tool 1", "Tool 2", ...],
  "certifications": ["Cert 1", "Cert 2", ...]
}
`;
      const roleAI = await generateJSON(prompt, 'You are a career analyst generating standard requirements.');
      roleInfo = {
        roleTitle: targetRole,
        domain: roleAI.domain || 'Technology',
        responsibilities: roleAI.responsibilities || [],
        requiredSkills: roleAI.requiredSkills || [],
        preferredSkills: roleAI.preferredSkills || [],
        experience: roleAI.experience || '',
        education: roleAI.education || '',
        tools: roleAI.tools || [],
        certifications: roleAI.certifications || [],
        roleSpecificRequirements: '',
        evidenceType: 'AI inference'
      };
    } catch (err) {
      console.warn('[WARNING] AI inference failed. Falling back to local rules registry.', err.message);
      // C. Local rules fallback
      roleInfo = getLocalRoleFallback(targetRole);
    }
  }

  // 3. Resolve all skill strings inside roleInfo to canonical skill objects
  const resolvedRequired = await Promise.all(
    (roleInfo.requiredSkills || []).map(async (s) => normalizeAndResolveSkill(s))
  );
  const resolvedPreferred = await Promise.all(
    (roleInfo.preferredSkills || []).map(async (s) => normalizeAndResolveSkill(s))
  );

  return {
    company: companyInfo,
    role: {
      ...roleInfo,
      requiredSkills: resolvedRequired.filter(s => s.canonicalId),
      preferredSkills: resolvedPreferred.filter(s => s.canonicalId)
    }
  };
};

/**
 * Classifies a target domain based on the majority domain of its core skills
 */
const classifyDomainFromSkills = (skillsList) => {
  const domainCounts = {};
  skillsList.forEach(s => {
    const canonical = getNormalizedSkillName(s);
    const domain = classifyDomain(canonical);
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
  });

  let maxDomain = 'Technology';
  let maxCount = 0;
  for (const [dom, count] of Object.entries(domainCounts)) {
    if (count > maxCount) {
      maxDomain = dom;
      maxCount = count;
    }
  }
  return maxDomain;
};

const classifyDomain = (canonical) => {
  const text = canonical.toLowerCase();
  if (text.includes('autocad') || text.includes('structural') || text.includes('concrete') || text.includes('revit') || text.includes('civil')) {
    return 'Civil Engineering';
  }
  if (text.includes('solidworks') || text.includes('creo') || text.includes('catia') || text.includes('ansys') || text.includes('mechanical') || text.includes('cad') || text.includes('gd&t') || text.includes('cnc')) {
    return 'Mechanical Engineering';
  }
  if (text.includes('finance') || text.includes('accounting') || text.includes('tax') || text.includes('gst') || text.includes('tds') || text.includes('tally') || text.includes('quickbooks') || text.includes('payroll') || text.includes('ifrs') || text.includes('reconciliation')) {
    return 'Finance';
  }
  if (text.includes('marketing') || text.includes('seo') || text.includes('ads') || text.includes('adwords') || text.includes('campaign') || text.includes('sales') || text.includes('analytics')) {
    return 'Marketing';
  }
  if (text.includes('react') || text.includes('node') || text.includes('javascript') || text.includes('typescript') || text.includes('docker') || text.includes('kubernetes') || text.includes('aws') || text.includes('sql') || text.includes('html') || text.includes('css')) {
    return 'Software Engineering';
  }
  if (text.includes('machine learning') || text.includes('neural') || text.includes('tensorflow') || text.includes('pytorch') || text.includes('nlp') || text.includes('computer vision') || text.includes('data science') || text.includes('statistics')) {
    return 'Data Science';
  }
  return 'General';
};
