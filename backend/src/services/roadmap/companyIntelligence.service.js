import CompanyIntelligence from '../../models/companyIntelligence.model.js';
import { generateJSON } from '../ai/aiGateway.js';

/**
 * Normalizes context inputs into a deterministic cache key.
 */
export const normalizeContextKey = (company = 'General', targetRole = 'General', domain = 'General') => {
  const normCompany = String(company || 'General').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  const normRole = String(targetRole || 'General').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  const normDomain = String(domain || 'General').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${normCompany}:${normRole}:${normDomain}`;
};

/**
 * Deterministic fallback generator for company & role intelligence when AI is unavailable or fails.
 */
export const buildDeterministicFallbackIntelligence = (company, targetRole, domain) => {
  const normDomain = String(domain || '').toLowerCase();
  
  let techStack = ['Core Fundamentals', 'Documentation', 'Problem Solving'];
  let requiredSkills = ['Problem Solving', 'Communication', 'Technical Fundamentals'];
  let preferredSkills = ['Project Management', 'Quality Assurance'];
  let technicalTopics = ['Core Principles', 'Domain Standards', 'Workflow Optimization'];
  let behavioralAreas = ['Team Collaboration', 'Handling Feedback', 'Project Execution'];

  if (normDomain.includes('software') || normDomain.includes('it') || normDomain.includes('backend') || normDomain.includes('frontend')) {
    techStack = ['Git', 'REST APIs', 'SQL/NoSQL', 'System Architecture'];
    requiredSkills = ['JavaScript', 'HTML/CSS', 'Data Structures', 'Git'];
    preferredSkills = ['Docker', 'CI/CD', 'Cloud Architecture'];
    technicalTopics = ['System Design', 'API Performance', 'Database Indexing', 'Code Quality'];
  } else if (normDomain.includes('mechanical') || normDomain.includes('manufacturing')) {
    techStack = ['AutoCAD', 'SolidWorks', 'ANSYS', 'GD&T'];
    requiredSkills = ['Mechanical Design', 'Thermodynamics', 'Materials Science', 'CAD'];
    preferredSkills = ['FEA Analysis', 'DFM/DFA', 'CNC Machining'];
    technicalTopics = ['Geometric Dimensioning', 'Stress Analysis', 'Manufacturing Processes'];
  } else if (normDomain.includes('civil') || normDomain.includes('construction')) {
    techStack = ['AutoCAD Civil 3D', 'STAAD.Pro', 'Revit', 'MS Project'];
    requiredSkills = ['Structural Analysis', 'Concrete Design', 'Surveying', 'Building Codes'];
    preferredSkills = ['Geotechnical Engineering', 'BIM Modeling'];
    technicalTopics = ['Load Calculations', 'Structural Stability', 'Safety Compliance'];
  } else if (normDomain.includes('finance') || normDomain.includes('accounting')) {
    techStack = ['MS Excel (Advanced)', 'Financial Modeling', 'Bloomberg Terminal', 'ERP Systems'];
    requiredSkills = ['Financial Analysis', 'Accounting Principles', 'Valuation', 'Excel'];
    preferredSkills = ['DCF Modeling', 'Risk Assessment', 'Budget Forecasting'];
    technicalTopics = ['Cash Flow Analysis', 'Financial Statement Analysis', 'Portfolio Valuation'];
  } else if (normDomain.includes('data') || normDomain.includes('ml')) {
    techStack = ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Tableau'];
    requiredSkills = ['Python', 'SQL', 'Data Analysis', 'Statistics'];
    preferredSkills = ['Machine Learning', 'Big Data (Spark)', 'A/B Testing'];
    technicalTopics = ['Exploratory Data Analysis', 'Model Validation', 'SQL Aggregations'];
  } else if (normDomain.includes('marketing')) {
    techStack = ['Google Analytics', 'HubSpot', 'SEO Tools', 'Social Media Ads'];
    requiredSkills = ['Digital Marketing', 'Content Strategy', 'SEO', 'Data Analytics'];
    preferredSkills = ['Paid Ads (PPC)', 'Conversion Rate Optimization'];
    technicalTopics = ['Campaign Performance', 'Customer Attribution', 'Funnel Optimization'];
  }

  return {
    companyOverview: {
      industry: domain || 'Technology & Engineering',
      companySize: 'Enterprise / Mid-size',
      description: `${company} is a leading organization hiring for ${targetRole} positions within the ${domain} domain.`,
      businessAreas: [domain, 'Core Engineering', 'Product Operations']
    },
    roleExpectations: {
      coreResponsibilities: [
        `Execute core ${targetRole} deliverables adhering to quality standards.`,
        `Collaborate with cross-functional teams at ${company}.`,
        `Solve technical and operational challenges within the ${domain} domain.`
      ],
      techStack,
      experienceExpectations: 'Entry to Mid-Level Competency'
    },
    skillRequirements: {
      requiredSkills,
      preferredSkills
    },
    interviewAreas: {
      technicalTopics,
      behavioralAreas,
      typicalStages: ['Recruiter Screen', 'Technical / Domain Assessment', 'System & Practical Review', 'Culture & Leadership Round']
    },
    sources: [
      {
        title: `${company} Industry Role Baseline`,
        source: 'CareerMapper Standard Benchmark',
        url: 'N/A',
        confidence: 0.85
      }
    ],
    isFallback: true
  };
};

/**
 * Retrieves cached company intelligence or generates it on explicit request.
 */
export const getOrGenerateCompanyIntelligence = async (company, targetRole, domain, refresh = false) => {
  const contextKey = normalizeContextKey(company, targetRole, domain);

  // Check cache unless refresh is requested
  if (!refresh) {
    const cached = await CompanyIntelligence.findOne({ contextKey });
    if (cached && new Date() < new Date(cached.expiresAt)) {
      return cached;
    }
  }

  // On cache miss or explicit refresh, request AI generation
  let intelligenceData = null;
  try {
    const prompt = `
Generate structured company & role intelligence for:
Company: "${company}"
Target Role: "${targetRole}"
Domain: "${domain}"

Return a valid JSON object matching this schema:
{
  "companyOverview": {
    "industry": "string",
    "companySize": "string",
    "description": "string",
    "businessAreas": ["string"]
  },
  "roleExpectations": {
    "coreResponsibilities": ["string"],
    "techStack": ["string"],
    "experienceExpectations": "string"
  },
  "skillRequirements": {
    "requiredSkills": ["string"],
    "preferredSkills": ["string"]
  },
  "interviewAreas": {
    "technicalTopics": ["string"],
    "behavioralAreas": ["string"],
    "typicalStages": ["string"]
  },
  "sources": [
    {
      "title": "string",
      "source": "string",
      "url": "string",
      "confidence": number
    }
  ]
}
Ensure the intelligence is domain-appropriate for "${domain}". Do not assume software engineering unless the domain is software.
`;

    const systemInstruction = `You are a career intelligence engine. Provide accurate, domain-specific expectations for roles at companies. Output strictly valid JSON.`;
    const aiResult = await generateJSON(prompt, systemInstruction);

    if (aiResult && aiResult.roleExpectations && aiResult.skillRequirements) {
      intelligenceData = {
        ...aiResult,
        isFallback: false
      };
    }
  } catch (err) {
    console.warn(`[COMPANY INTELLIGENCE] AI call failed or key unconfigured: ${err.message}. Using deterministic fallback.`);
  }

  // Fallback if AI fails or returns invalid structure
  if (!intelligenceData) {
    intelligenceData = buildDeterministicFallbackIntelligence(company, targetRole, domain);
  }

  // Upsert into cache
  const updated = await CompanyIntelligence.findOneAndUpdate(
    { contextKey },
    {
      contextKey,
      company: company || 'General',
      targetRole: targetRole || 'General',
      domain: domain || 'General',
      ...intelligenceData,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    { upsert: true, returnDocument: 'after' }
  );

  return updated;
};
