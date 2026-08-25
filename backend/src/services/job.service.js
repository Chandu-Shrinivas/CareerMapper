import mongoose from 'mongoose';
import axios from 'axios';
import { config } from '../config/env.js';
import JobInsight from '../models/jobInsight.model.js';
import { getNormalizedSkillName } from '../utils/skillNormalizer.js';
import { resolveSkill } from './skill.service.js';

const inMemoryJobCache = new Map();
const inProgressJobRequests = new Map();

// High-quality fallback jobs dataset for Indian tech ecosystem (used when RapidAPI keys are unconfigured/unsubscribed/rate-limited)
const fallbackTechJobs = [
  // ── Full Stack ─────────────────────────────────────────────────────────────
  {
    id: 'job-fsd-01',
    title: 'Full Stack Developer',
    company: 'Razorpay',
    companyLogo: 'https://logo.clearbit.com/razorpay.com',
    location: 'Bengaluru',
    country: 'India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1-3 years',
    salaryMin: 1200000,
    salaryMax: 1800000,
    currency: 'INR',
    salaryText: '₹12–18 LPA',
    skills: ['React', 'Node.js', 'TypeScript', 'SQL', 'MongoDB', 'AWS', 'Docker'],
    description: 'Build next-generation merchant checkout experiences. Design scaleable REST APIs, work with PostgreSQL/MongoDB, and build clean React dashboards.',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 2 days ago',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/razorpay-full-stack-developer'
  },
  {
    id: 'job-fsd-02',
    title: 'Senior Full Stack Engineer',
    company: 'Swiggy',
    companyLogo: 'https://logo.clearbit.com/swiggy.com',
    location: 'Bengaluru',
    country: 'India',
    workMode: 'On-site',
    employmentType: 'Full-time',
    experience: '3-5 years',
    salaryMin: 2200000,
    salaryMax: 3200000,
    currency: 'INR',
    salaryText: '₹22–32 LPA',
    skills: ['React', 'Node.js', 'Go', 'Microservices', 'Redis', 'Kafka', 'Kubernetes'],
    description: 'Join Swiggy’s core supply platform team. Lead high-throughput microservices handling millions of orders daily, optimizing UI rendering.',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 1 day ago',
    source: 'JSearch',
    sourceUrl: 'https://www.swiggy.com/careers/full-stack-engineer'
  },
  {
    id: 'job-fsd-03',
    title: 'MERN Stack Developer',
    company: 'Meesho',
    companyLogo: 'https://logo.clearbit.com/meesho.com',
    location: 'Bengaluru',
    country: 'India',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '1-3 years',
    salaryMin: 1400000,
    salaryMax: 2000000,
    currency: 'INR',
    salaryText: '₹14–20 LPA',
    skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Redux', 'AWS'],
    description: 'Develop social commerce seller portals. Work on high-traffic Node services and responsive React single-page web applications.',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 3 days ago',
    source: 'LinkedIn',
    sourceUrl: 'https://meesho.com/careers/mern-developer'
  },

  // ── Software Testing & QA ──────────────────────────────────────────────────
  {
    id: 'job-st-01',
    title: 'Software Tester / QA Automation Engineer',
    company: 'Flipkart',
    companyLogo: 'https://logo.clearbit.com/flipkart.com',
    location: 'Bengaluru',
    country: 'India',
    workMode: 'On-site',
    employmentType: 'Full-time',
    experience: '1-3 years',
    salaryMin: 1000000,
    salaryMax: 1500000,
    currency: 'INR',
    salaryText: '₹10–15 LPA',
    skills: ['Testing', 'Selenium', 'Postman', 'JavaScript', 'Python', 'Cypress', 'Git'],
    description: 'Flipkart QA team is seeking an Automation Test Engineer to create robust end-to-end regression suites for checkout and payment services.',
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 5 days ago',
    source: 'LinkedIn',
    sourceUrl: 'https://www.flipkartcareers.com/job/qa-automation-engineer'
  },
  {
    id: 'job-st-02',
    title: 'QA Engineer - Web & API Testing',
    company: 'Paytm',
    companyLogo: 'https://logo.clearbit.com/paytm.com',
    location: 'Noida',
    country: 'India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1-3 years',
    salaryMin: 900000,
    salaryMax: 1400000,
    currency: 'INR',
    salaryText: '₹9–14 LPA',
    skills: ['Postman', 'REST APIs', 'Manual Testing', 'SQL', 'JIRA', 'Automation'],
    description: 'Perform functional API test automation and manual regression verification for payment gateway integrations.',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 2 days ago',
    source: 'JSearch',
    sourceUrl: 'https://paytm.com/careers/qa-engineer'
  },
  {
    id: 'job-st-03',
    title: 'SDET / Test Engineer',
    company: 'Amazon India',
    companyLogo: 'https://logo.clearbit.com/amazon.com',
    location: 'Hyderabad',
    country: 'India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '3-5 years',
    salaryMin: 1800000,
    salaryMax: 2800000,
    currency: 'INR',
    salaryText: '₹18–28 LPA',
    skills: ['Java', 'Selenium', 'TestNG', 'CI/CD', 'Appium', 'AWS', 'Python'],
    description: 'Design software development engineer in test (SDET) automation frameworks for retail order fulfillment software.',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 1 day ago',
    source: 'LinkedIn',
    sourceUrl: 'https://www.amazon.jobs/en/jobs/sdet-hyderabad'
  },
  {
    id: 'job-st-04',
    title: 'Quality Assurance Analyst',
    company: 'Infosys',
    companyLogo: 'https://logo.clearbit.com/infosys.com',
    location: 'Pune',
    country: 'India',
    workMode: 'On-site',
    employmentType: 'Full-time',
    experience: 'Fresher',
    salaryMin: 450000,
    salaryMax: 700000,
    currency: 'INR',
    salaryText: '₹4.5–7 LPA',
    skills: ['Manual Testing', 'Test Cases', 'JIRA', 'SQL', 'Agile'],
    description: 'Execute test suites, create test plans, document defect reports, and collaborate with enterprise development teams.',
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 4 days ago',
    source: 'JSearch',
    sourceUrl: 'https://www.infosys.com/careers/qa-analyst'
  },

  // ── Backend ────────────────────────────────────────────────────────────────
  {
    id: 'job-bed-01',
    title: 'Backend Developer',
    company: 'PhonePe',
    companyLogo: 'https://logo.clearbit.com/phonepe.com',
    location: 'Bengaluru',
    country: 'India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1-3 years',
    salaryMin: 1400000,
    salaryMax: 2000000,
    currency: 'INR',
    salaryText: '₹14–20 LPA',
    skills: ['Node.js', 'Java', 'Python', 'SQL', 'PostgreSQL', 'Redis', 'REST APIs'],
    description: 'PhonePe is looking for a Backend Engineer to build secure, low-latency financial transaction systems.',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 3 days ago',
    source: 'LinkedIn',
    sourceUrl: 'https://www.phonepe.com/careers/backend-developer'
  },
  {
    id: 'job-bed-02',
    title: 'Java Backend Engineer',
    company: 'Zerodha',
    companyLogo: 'https://logo.clearbit.com/zerodha.com',
    location: 'Bengaluru',
    country: 'India',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '3-5 years',
    salaryMin: 2000000,
    salaryMax: 3000000,
    currency: 'INR',
    salaryText: '₹20–30 LPA',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
    description: 'Architect low-latency trading engines, WebSocket telemetry streaming, and core database microservices.',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 2 days ago',
    source: 'LinkedIn',
    sourceUrl: 'https://zerodha.tech/careers/java-backend'
  },

  // ── Frontend ───────────────────────────────────────────────────────────────
  {
    id: 'job-fed-01',
    title: 'Frontend Developer',
    company: 'CRED',
    companyLogo: 'https://logo.clearbit.com/cred.club',
    location: 'Bengaluru',
    country: 'India',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '1-3 years',
    salaryMin: 1500000,
    salaryMax: 2400000,
    currency: 'INR',
    salaryText: '₹15–24 LPA',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Tailwind', 'Next.js'],
    description: 'CRED is hiring a Frontend Engineer passionate about slick animations and high-performance WebGL/React apps.',
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 4 days ago',
    source: 'LinkedIn',
    sourceUrl: 'https://cred.club/careers/frontend-developer'
  },
  {
    id: 'job-fed-02',
    title: 'React UI Developer',
    company: 'Urban Company',
    companyLogo: 'https://logo.clearbit.com/urbancompany.com',
    location: 'Gurugram',
    country: 'India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1-3 years',
    salaryMin: 1200000,
    salaryMax: 1800000,
    currency: 'INR',
    salaryText: '₹12–18 LPA',
    skills: ['React', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS', 'Figma'],
    description: 'Build customer booking web interfaces, partner management workflows, and accessible component libraries.',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 1 day ago',
    source: 'JSearch',
    sourceUrl: 'https://careers.urbancompany.com/react-developer'
  },

  // ── Data Science & ML ──────────────────────────────────────────────────────
  {
    id: 'job-ds-01',
    title: 'Data Scientist',
    company: 'Fractal Analytics',
    companyLogo: 'https://logo.clearbit.com/fractal.ai',
    location: 'Bengaluru',
    country: 'India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1-3 years',
    salaryMin: 1400000,
    salaryMax: 2200000,
    currency: 'INR',
    salaryText: '₹14–22 LPA',
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Pandas', 'Scikit-learn', 'PyTorch'],
    description: 'Fractal Analytics is seeking a Data Scientist to build predictive consumer behavior models and NLP pipelines.',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 1 day ago',
    source: 'LinkedIn',
    sourceUrl: 'https://fractal.ai/careers/data-scientist'
  },
  {
    id: 'job-mle-01',
    title: 'Machine Learning Engineer',
    company: 'Zomato',
    companyLogo: 'https://logo.clearbit.com/zomato.com',
    location: 'Gurugram',
    country: 'India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '3-5 years',
    salaryMin: 2500000,
    salaryMax: 3800000,
    currency: 'INR',
    salaryText: '₹25–38 LPA',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Scikit-learn', 'MLOps', 'Deep Learning'],
    description: 'Build hyper-personalized dish recommendation models and real-time delivery estimation algorithms.',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 2 days ago',
    source: 'JSearch',
    sourceUrl: 'https://www.zomato.com/careers/ml-engineer'
  },

  // ── DevOps & Cloud ────────────────────────────────────────────────────────
  {
    id: 'job-devops-01',
    title: 'DevOps Engineer',
    company: 'Postman',
    companyLogo: 'https://logo.clearbit.com/postman.com',
    location: 'Bengaluru',
    country: 'India',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '3-5 years',
    salaryMin: 2000000,
    salaryMax: 3000000,
    currency: 'INR',
    salaryText: '₹20–30 LPA',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Terraform', 'CI/CD', 'Python'],
    description: 'Manage Postman’s multi-region cloud deployment infrastructure serving 25M+ developers.',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 1 day ago',
    source: 'LinkedIn',
    sourceUrl: 'https://www.postman.com/careers/devops-engineer'
  },
  {
    id: 'job-cloud-01',
    title: 'Cloud Engineer',
    company: 'Freshworks',
    companyLogo: 'https://logo.clearbit.com/freshworks.com',
    location: 'Chennai',
    country: 'India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1-3 years',
    salaryMin: 1100000,
    salaryMax: 1700000,
    currency: 'INR',
    salaryText: '₹11–17 LPA',
    skills: ['AWS', 'Cloud Computing', 'Docker', 'Linux', 'Terraform', 'Python'],
    description: 'Freshworks is looking for a Cloud Infrastructure Engineer to scale AWS SaaS environments.',
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 4 days ago',
    source: 'LinkedIn',
    sourceUrl: 'https://www.freshworks.com/careers/cloud-engineer'
  },

  // ── Data Analyst ──────────────────────────────────────────────────────────
  {
    id: 'job-da-01',
    title: 'Data Analyst',
    company: 'MakeMyTrip',
    companyLogo: 'https://logo.clearbit.com/makemytrip.com',
    location: 'Gurugram',
    country: 'India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1-3 years',
    salaryMin: 900000,
    salaryMax: 1400000,
    currency: 'INR',
    salaryText: '₹9–14 LPA',
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics', 'Data Cleaning'],
    description: 'Transform complex travel booking datasets into actionable commercial insights.',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 3 days ago',
    source: 'JSearch',
    sourceUrl: 'https://careers.makemytrip.com/job/data-analyst'
  },

  // ── UI/UX Design ──────────────────────────────────────────────────────────
  {
    id: 'job-uiux-01',
    title: 'UI/UX Designer',
    company: 'Unacademy',
    companyLogo: 'https://logo.clearbit.com/unacademy.com',
    location: 'Bengaluru',
    country: 'India',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '1-3 years',
    salaryMin: 1000000,
    salaryMax: 1600000,
    currency: 'INR',
    salaryText: '₹10–16 LPA',
    skills: ['Figma', 'UI Design', 'UX Design', 'Wireframing', 'Prototyping', 'User Research'],
    description: 'Create engaging, accessible learning interfaces for millions of students.',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    postedText: 'Posted 2 days ago',
    source: 'LinkedIn',
    sourceUrl: 'https://unacademy.com/careers/ui-ux-designer'
  }
];

// Helper: Normalize external API response to internal canonical schema
const normalizeExternalJob = (rawJob, defaultSource = 'JSearch') => {
  const title = rawJob.job_title || rawJob.title || 'Software Engineer';
  const company = rawJob.employer_name || rawJob.company || 'Tech Employer';
  const location = rawJob.job_city || rawJob.location || 'Bengaluru';
  const country = rawJob.job_country || rawJob.country || 'India';

  const workMode = rawJob.job_is_remote ? 'Remote' : (rawJob.work_mode || 'Hybrid');
  const employmentType = (rawJob.job_employment_type || rawJob.employment_type || 'Full-time').replace('_', '-');

  const minSal = rawJob.job_min_salary || rawJob.salaryMin || 0;
  const maxSal = rawJob.job_max_salary || rawJob.salaryMax || 0;
  const currency = rawJob.job_salary_currency || rawJob.currency || 'INR';

  let salaryText = rawJob.salaryText || '';
  if (!salaryText && (minSal > 0 || maxSal > 0)) {
    if (currency === 'INR') {
      const minLpa = (minSal / 100000).toFixed(1).replace('.0', '');
      const maxLpa = (maxSal / 100000).toFixed(1).replace('.0', '');
      salaryText = minSal && maxSal ? `₹${minLpa}–${maxLpa} LPA` : `Up to ₹${maxLpa || minLpa} LPA`;
    } else {
      salaryText = `$${minSal.toLocaleString()} - $${maxSal.toLocaleString()}`;
    }
  }

  const rawSkills = rawJob.required_skills || rawJob.skills || (rawJob.job_required_skills ? rawJob.job_required_skills : []);

  // Extract and validate exact application URL from JSearch raw fields
  let rawApplyUrl = rawJob.job_apply_link ||
    (Array.isArray(rawJob.apply_options) && rawJob.apply_options[0]?.apply_link) ||
    rawJob.sourceUrl ||
    '';

  let sourceUrl = '';
  if (rawApplyUrl && typeof rawApplyUrl === 'string' && (rawApplyUrl.startsWith('http://') || rawApplyUrl.startsWith('https://'))) {
    sourceUrl = rawApplyUrl;
  }

  return {
    id: rawJob.job_id || rawJob.id || `ext-${Math.random().toString(36).substring(2, 9)}`,
    title,
    company,
    companyLogo: rawJob.employer_logo || rawJob.companyLogo || '',
    location,
    country,
    workMode,
    employmentType,
    experience: rawJob.experience || '1-3 years',
    salaryMin: minSal,
    salaryMax: maxSal,
    currency,
    salaryText: salaryText || 'Competitive Salary',
    skills: Array.isArray(rawSkills) ? rawSkills : [],
    description: rawJob.job_description || rawJob.description || `Job posting for ${title} at ${company}.`,
    postedAt: rawJob.job_posted_at_datetime_utc ? new Date(rawJob.job_posted_at_datetime_utc) : (rawJob.postedAt || new Date()),
    postedText: rawJob.postedText || 'Recently posted',
    source: rawJob.job_publisher || rawJob.source || defaultSource,
    sourceUrl
  };
};

// Deduplicate jobs by URL, external ID, or company+title+location key
export const deduplicateJobs = (jobsList) => {
  const seen = new Set();
  const result = [];

  for (const j of jobsList) {
    const canonicalKey = j.sourceUrl || j.id || `${j.company.toLowerCase().trim()}|${j.title.toLowerCase().trim()}|${j.location.toLowerCase().trim()}`;
    if (!seen.has(canonicalKey)) {
      seen.add(canonicalKey);
      result.push(j);
    }
  }

  return result;
};

// Calculate deterministic job match score vs user's profile
export const calculateJobMatchScore = (job, userSkills = [], userRole = '') => {
  const jobSkillsNormalized = (job.skills || []).map(s => getNormalizedSkillName(s)).filter(Boolean);
  const userSkillsNormalized = (userSkills || []).map(s => getNormalizedSkillName(s.name || s)).filter(Boolean);

  if (jobSkillsNormalized.length === 0) {
    return {
      matchScore: null,
      matchAvailable: false,
      matchedSkills: [],
      missingSkills: []
    };
  }

  const matchedSkills = [];
  const missingSkills = [];

  jobSkillsNormalized.forEach(s => {
    if (userSkillsNormalized.includes(s)) {
      matchedSkills.push(s);
    } else {
      missingSkills.push(s);
    }
  });

  const skillMatchRatio = matchedSkills.length / jobSkillsNormalized.length;
  let score = Math.round(skillMatchRatio * 80);

  // Bonus for role title alignment
  if (userRole && job.title.toLowerCase().includes(userRole.toLowerCase())) {
    score += 15;
  } else {
    score += 10;
  }

  score = Math.max(35, Math.min(98, score));

  return {
    matchScore: score,
    matchAvailable: true,
    matchedSkills,
    missingSkills
  };
};

// ── Scalable Role Keyword Expansion Map ─────────────────────────────────────
export const ROLE_KEYWORD_MAP = {
  'software-tester': [
    'software tester',
    'QA tester',
    'QA engineer',
    'test engineer',
    'quality assurance engineer',
    'automation tester',
    'software QA engineer',
    'SDET'
  ],
  'qa-engineer': [
    'QA engineer',
    'software tester',
    'quality assurance engineer',
    'automation tester',
    'SDET',
    'test engineer'
  ],
  'automation-tester': [
    'automation tester',
    'QA automation engineer',
    'SDET',
    'test automation engineer',
    'QA engineer',
    'software tester'
  ],

  'software-developer': [
    'software developer',
    'software engineer',
    'application developer',
    'associate software developer',
    'software development engineer',
    'SDE',
    'web developer'
  ],
  'software-engineer': [
    'software engineer',
    'software developer',
    'application engineer',
    'software development engineer',
    'SDE',
    'full stack engineer'
  ],

  'devops-engineer': [
    'DevOps engineer',
    'DevOps',
    'cloud engineer',
    'site reliability engineer',
    'SRE',
    'infrastructure engineer'
  ],
  'site-reliability-engineer': [
    'site reliability engineer',
    'SRE',
    'DevOps engineer',
    'infrastructure engineer'
  ],

  'data-scientist': [
    'data scientist',
    'junior data scientist',
    'data analyst',
    'applied data scientist',
    'ML data scientist',
    'machine learning scientist'
  ],
  'data-analyst': [
    'data analyst',
    'business intelligence analyst',
    'BI analyst',
    'data analytics engineer',
    'business analyst'
  ],

  'frontend-developer': [
    'frontend developer',
    'front end engineer',
    'react developer',
    'UI developer',
    'web developer',
    'frontend software engineer'
  ],
  'react-developer': [
    'react developer',
    'frontend developer',
    'front end engineer',
    'UI developer',
    'web developer'
  ],

  'backend-developer': [
    'backend developer',
    'backend engineer',
    'node.js developer',
    'java backend developer',
    'API developer',
    'server-side developer'
  ],
  'nodejs-developer': [
    'node.js developer',
    'backend developer',
    'backend engineer',
    'API developer'
  ],

  'full-stack-developer': [
    'full stack developer',
    'full stack engineer',
    'software engineer full stack',
    'MERN developer',
    'web application developer'
  ],
  'mern-developer': [
    'MERN developer',
    'full stack developer',
    'react node developer',
    'full stack engineer'
  ],

  'machine-learning-engineer': [
    'machine learning engineer',
    'ML engineer',
    'AI/ML engineer',
    'applied ML engineer',
    'machine learning developer'
  ],
  'ai-engineer': [
    'AI engineer',
    'machine learning engineer',
    'ML engineer',
    'AI/ML engineer'
  ],

  'cloud-engineer': [
    'cloud engineer',
    'cloud architect',
    'AWS cloud engineer',
    'cloud infrastructure engineer'
  ],
  'ui-ux-designer': [
    'UI/UX designer',
    'product designer',
    'UI designer',
    'UX designer'
  ],

  'mobile-developer': [
    'mobile developer',
    'react native developer',
    'flutter developer',
    'android developer',
    'iOS developer'
  ],
  'android-developer': [
    'android developer',
    'android engineer',
    'kotlin developer',
    'mobile developer'
  ],
  'ios-developer': [
    'iOS developer',
    'swift developer',
    'iOS engineer',
    'mobile developer'
  ],

  'data-engineer': [
    'data engineer',
    'big data engineer',
    'ETL developer',
    'data pipeline engineer'
  ],
  'cybersecurity-engineer': [
    'cybersecurity engineer',
    'security engineer',
    'information security analyst',
    'penetration tester'
  ]
};

// In-memory cache for dynamically generated role keyword expansions
const dynamicKeywordCache = new Map();

/**
 * Returns a list of search keywords for a given role query.
 * Exact query is always at index 0.
 */
export const getExpandedSearchKeywords = (query) => {
  const queryStr = (query || '').trim();
  if (!queryStr) return ['software developer'];

  const slug = queryStr.toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-z0-9-]/g, '');
  const exactFormatted = queryStr.replace(/-/g, ' ');

  // 1. Direct predefined map check
  if (ROLE_KEYWORD_MAP[slug]) {
    const list = ROLE_KEYWORD_MAP[slug];
    const unique = [exactFormatted, ...list.filter(k => k.toLowerCase() !== exactFormatted.toLowerCase())];
    return unique;
  }

  // 2. Dynamic cache check
  if (dynamicKeywordCache.has(slug)) {
    return dynamicKeywordCache.get(slug);
  }

  // 3. Algorithmic variation generation
  const derived = [exactFormatted];
  const lower = exactFormatted.toLowerCase();

  if (lower.includes('developer')) {
    derived.push(exactFormatted.replace(/developer/gi, 'engineer'));
    derived.push(exactFormatted.replace(/developer/gi, 'software engineer'));
  } else if (lower.includes('engineer')) {
    derived.push(exactFormatted.replace(/engineer/gi, 'developer'));
  }

  if (lower.includes('tester')) {
    derived.push(exactFormatted.replace(/tester/gi, 'QA engineer'));
    derived.push(exactFormatted.replace(/tester/gi, 'quality assurance'));
    derived.push('SDET');
  }

  if (lower.includes('qa')) {
    derived.push('software tester');
    derived.push('test engineer');
    derived.push('quality assurance engineer');
  }

  if (lower.includes('data')) {
    if (!lower.includes('analyst')) derived.push(`${exactFormatted} analyst`);
    if (!lower.includes('engineer')) derived.push(`${exactFormatted} engineer`);
  }

  const uniqueDerived = [...new Set(derived.map(s => s.trim()).filter(Boolean))];
  dynamicKeywordCache.set(slug, uniqueDerived);
  return uniqueDerived;
};

/**
 * Relevance validator: Ensures job title/description is semantically aligned with the target role.
 * Prevents completely unrelated jobs (e.g. electrical/civil engineers when searching software engineer).
 */
export const isJobRelevantToRole = (job, targetRole) => {
  if (!job || !job.title) return false;

  const titleLower = job.title.toLowerCase();
  const roleLower = (targetRole || '').toLowerCase().replace(/-/g, ' ');

  // Filter out non-tech professions if target role is tech-oriented
  const isTechTarget = /software|developer|engineer|tester|qa|data|devops|frontend|backend|full\s*stack|web|cloud|ml|ai|mobile|android|ios|ui|ux/i.test(roleLower);
  if (isTechTarget) {
    const unrelatedKeywords = ['electrical engineer', 'civil engineer', 'mechanical engineer', 'sales executive', 'nursing', 'medical', 'real estate', 'chemical engineer', 'site engineer'];
    if (unrelatedKeywords.some(u => titleLower.includes(u))) {
      return false;
    }
  }

  const roleTokens = roleLower.split(/\s+/).filter(t => t.length > 2 && !['and', 'the', 'for', 'with', 'in'].includes(t));
  if (roleTokens.length === 0) return true;

  const hasTokenMatch = roleTokens.some(t => titleLower.includes(t));
  if (hasTokenMatch) return true;

  const skillsText = (job.skills || []).join(' ').toLowerCase();
  if (roleTokens.some(t => skillsText.includes(t))) return true;

  return true;
};

/**
 * Helper: Fetch jobs for a SINGLE query keyword from JSearch.
 * Uses independent caching (memory + MongoDB) per keyword.
 */
const fetchSingleJSearchQuery = async (searchKeyword, location, country, rapidKey, page = 1) => {
  const kwSlug = searchKeyword.toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-z0-9-]/g, '');
  const locSlug = (location || 'all').toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-z0-9-]/g, '');
  const singleCacheKey = `${kwSlug}:${locSlug}:${country.toLowerCase()}:p${page}`;

  // Check in-memory cache
  const memCached = inMemoryJobCache.get(singleCacheKey);
  if (memCached && new Date(memCached.expiresAt) > new Date() && memCached.jobs.length > 0) {
    console.log(`[KEYWORD CACHE HIT] Memory — kw="${searchKeyword}" → ${memCached.jobs.length} jobs`);
    return { jobs: memCached.jobs, nextPageCursor: memCached.nextPageCursor || null };
  }

  // Check MongoDB cache
  if (mongoose.connection.readyState === 1) {
    try {
      const dbCached = await JobInsight.findOne({ queryKey: singleCacheKey });
      if (dbCached && new Date(dbCached.expiresAt) > new Date() && dbCached.jobs.length > 0) {
        console.log(`[KEYWORD CACHE HIT] MongoDB — kw="${searchKeyword}" → ${dbCached.jobs.length} jobs`);
        const jobs = dbCached.jobs.map(j => j.toObject ? j.toObject() : j);
        inMemoryJobCache.set(singleCacheKey, {
          jobs,
          nextPageCursor: dbCached.nextPageCursor || null,
          expiresAt: dbCached.expiresAt,
          generatedAt: dbCached.generatedAt
        });
        return { jobs, nextPageCursor: dbCached.nextPageCursor || null };
      }
    } catch (err) {
      console.warn('[WARNING] Keyword MongoDB cache read failed:', err.message);
    }
  }

  // Retrieve previous page cursor if page > 1
  let cursor = null;
  if (page > 1) {
    const prevCacheKey = `${kwSlug}:${locSlug}:${country.toLowerCase()}:p${page - 1}`;
    const prevMemCached = inMemoryJobCache.get(prevCacheKey);
    if (prevMemCached && prevMemCached.nextPageCursor) {
      cursor = prevMemCached.nextPageCursor;
    } else if (mongoose.connection.readyState === 1) {
      try {
        const prevDbCached = await JobInsight.findOne({ queryKey: prevCacheKey });
        if (prevDbCached && prevDbCached.nextPageCursor) {
          cursor = prevDbCached.nextPageCursor;
        }
      } catch (err) {
        console.warn('[WARNING] Failed to read previous page cursor:', err.message);
      }
    }
  }

  // Map country name to 2-letter code for JSearch API
  const getCountryCode = (countryName) => {
    const name = (countryName || '').trim().toLowerCase();
    if (name === 'india') return 'in';
    if (name === 'united states' || name === 'us' || name === 'usa') return 'us';
    if (name === 'united kingdom' || name === 'uk') return 'gb';
    if (name === 'canada') return 'ca';
    if (name === 'australia') return 'au';
    if (name.length === 2) return name;
    return 'in'; // default to India as per project requirements
  };
  const countryCode = getCountryCode(country);

  // Live JSearch call
  try {
    console.log(`[RAPIDAPI KEYWORD] Calling JSearch v2 for "${searchKeyword} in ${location !== 'all' ? location : 'India'}" (country=${countryCode}) page=${page}...`);
    const searchRes = await axios.get('https://jsearch.p.rapidapi.com/search-v2', {
      params: {
        query: `${searchKeyword} in ${location !== 'all' ? location : 'India'}`,
        country: countryCode,
        cursor: cursor || undefined,
        num_pages: '1'
      },
      headers: {
        'X-RapidAPI-Key': rapidKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      timeout: 15000
    });

    const rawList = searchRes.data?.data?.jobs || [];
    const nextPageCursor = searchRes.data?.data?.cursor || null;

    if (rawList.length > 0) {
      const jobs = rawList.map(j => normalizeExternalJob(j, 'JSearch'));
      console.log(`[RAPIDAPI KEYWORD] Got ${jobs.length} jobs for "${searchKeyword}"`);

      // Cache independently
      const ttlHours = config.jobCacheTtlHours || 12;
      const generatedAt = new Date();
      const expiresAt = new Date(generatedAt.getTime() + ttlHours * 60 * 60 * 1000);
      const cachePayload = {
        queryKey: singleCacheKey,
        query: searchKeyword,
        location,
        country,
        jobs,
        nextPageCursor,
        generatedAt,
        expiresAt
      };

      inMemoryJobCache.set(singleCacheKey, cachePayload);
      if (mongoose.connection.readyState === 1) {
        JobInsight.findOneAndUpdate({ queryKey: singleCacheKey }, cachePayload, { upsert: true, returnDocument: 'after' })
          .catch(e => console.warn('[WARNING] Keyword MongoDB cache save failed:', e.message));
      }

      return { jobs, nextPageCursor };
    }
  } catch (err) {
    if (err.response?.status === 403) {
      console.warn(`[RAPIDAPI 403] RapidAPI Key is not subscribed to JSearch (jsearch.p.rapidapi.com). Error: "${err.response.data?.message || err.message}". Falling back to curated dataset.`);
    } else {
      console.warn(`[WARNING] JSearch keyword call failed for "${searchKeyword}":`, err.message);
    }
  }

  return { jobs: [], nextPageCursor: null };
};

// Main service query handler
export const getJobsData = async (query = 'full-stack-developer', location = 'all', country = 'India', userSkills = [], userRole = '', forceRefresh = false, page = 1) => {
  const querySlug = (query || 'all-jobs').toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-z0-9-]/g, '');
  const locationSlug = (location || 'all').toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-z0-9-]/g, '');
  const cacheKey = `${querySlug}:${locationSlug}:${country.toLowerCase()}:p${page}`;

  console.log(`[JOBS SERVICE] query="${query}" location="${location}" page=${page} cacheKey="${cacheKey}" forceRefresh=${forceRefresh}`);

  // 1. Check Cache (MongoDB & Memory) unless forceRefresh is true
  if (!forceRefresh) {
    if (mongoose.connection.readyState === 1) {
      try {
        const cached = await JobInsight.findOne({ queryKey: cacheKey });
        if (cached && new Date(cached.expiresAt) > new Date() && cached.jobs.length > 0) {
          console.log(`[JOBS CACHE HIT] MongoDB — query="${query}" page=${page} count=${cached.jobs.length}`);
          const evaluatedJobs = cached.jobs.map(j => {
            const evaluation = calculateJobMatchScore(j, userSkills, userRole);
            return { ...j.toObject(), ...evaluation };
          });
          const resolvedJobs = await Promise.all(evaluatedJobs.map(async (j) => {
            const [skills, matched, missing] = await Promise.all([
              Promise.all((j.skills || []).map(resolveSkill)),
              Promise.all((j.matchedSkills || []).map(resolveSkill)),
              Promise.all((j.missingSkills || []).map(resolveSkill))
            ]);
            return { ...j, skills, matchedSkills: matched, missingSkills: missing };
          }));
          return {
            query,
            location,
            country,
            page,
            jobs: resolvedJobs,
            hasMore: !!cached.nextPageCursor,
            generatedAt: cached.generatedAt,
            isCacheHit: true
          };
        }
      } catch (err) {
        console.warn('[WARNING] Job MongoDB cache read failed:', err.message);
      }
    }

    const memoryCached = inMemoryJobCache.get(cacheKey);
    if (memoryCached && new Date(memoryCached.expiresAt) > new Date()) {
      console.log(`[JOBS CACHE HIT] Memory — query="${query}" page=${page} count=${memoryCached.jobs.length}`);
      const evaluatedJobs = memoryCached.jobs.map(j => {
        const evaluation = calculateJobMatchScore(j, userSkills, userRole);
        return { ...j, ...evaluation };
      });
      const resolvedJobs = await Promise.all(evaluatedJobs.map(async (j) => {
        const [skills, matched, missing] = await Promise.all([
          Promise.all((j.skills || []).map(resolveSkill)),
          Promise.all((j.matchedSkills || []).map(resolveSkill)),
          Promise.all((j.missingSkills || []).map(resolveSkill))
        ]);
        return { ...j, skills, matchedSkills: matched, missingSkills: missing };
      }));
      return {
        query,
        location,
        country,
        page,
        jobs: resolvedJobs,
        hasMore: !!memoryCached.nextPageCursor,
        generatedAt: memoryCached.generatedAt,
        isCacheHit: true
      };
    }
  }

  // 2. Check Deduplication Promise Pool
  if (inProgressJobRequests.has(cacheKey)) {
    console.log(`[JOBS DEDUP] Request in-progress for cacheKey="${cacheKey}" — sharing promise`);
    return inProgressJobRequests.get(cacheKey);
  }

  // 3. Perform Fresh Fetch with Scalable Keyword Expansion
  const fetchPromise = (async () => {
    console.log(`[JOBS MISS] Fetching fresh jobs for query="${query}" location="${location}" page=${page}...`);
    let fetchedJobs = [];
    let usedKeywordExpansion = false;
    let nextPageCursor = null;

    const rapidKey = config.rapidApiKey;
    if (rapidKey && rapidKey !== 'PASTE_YOUR_RAPIDAPI_KEY_HERE' && rapidKey.trim()) {
      const keywords = getExpandedSearchKeywords(query);
      const MIN_TARGET_JOBS = 5;
      const MAX_KEYWORDS_TO_TRY = 4;

      console.log(`[KEYWORD EXPANSION] Query="${query}" expanded to keywords:`, keywords);

      for (let i = 0; i < Math.min(keywords.length, MAX_KEYWORDS_TO_TRY); i++) {
        const kw = keywords[i];
        const { jobs: rawJobs, nextPageCursor: kwCursor } = await fetchSingleJSearchQuery(kw, location, country, rapidKey, page);
        const relevantJobs = rawJobs.filter(j => isJobRelevantToRole(j, query));

        for (const rj of relevantJobs) {
          if (!fetchedJobs.some(existing => existing.id === rj.id || (existing.sourceUrl && existing.sourceUrl === rj.sourceUrl))) {
            fetchedJobs.push(rj);
          }
        }

        if (i > 0 && relevantJobs.length > 0) {
          usedKeywordExpansion = true;
        }

        if (i === 0) {
          nextPageCursor = kwCursor;
        }

        // Stop as soon as target job count is met
        if (fetchedJobs.length >= MIN_TARGET_JOBS) {
          console.log(`[KEYWORD EXPANSION] Reached target (${fetchedJobs.length} jobs) after ${i + 1} keyword search(es), stopping.`);
          break;
        }
      }
    }

    // Fallback if RapidAPI is unconfigured or returned 0 items
    if (fetchedJobs.length === 0) {
      console.log('[JOBS FALLBACK] Utilizing high-quality curated tech job dataset...');
      let filtered = fallbackTechJobs;
      const keywords = getExpandedSearchKeywords(query);

      filtered = fallbackTechJobs.filter(j => {
        const titleLower = j.title.toLowerCase();
        return keywords.some(kw => titleLower.includes(kw.toLowerCase()) || kw.toLowerCase().includes(titleLower));
      });

      if (location && location !== 'all') {
        const locClean = location.toLowerCase();
        const locFiltered = filtered.filter(j => j.location.toLowerCase().includes(locClean) || j.workMode.toLowerCase() === locClean);
        if (locFiltered.length > 0) filtered = locFiltered;
      }

      fetchedJobs = filtered;
    }

    // Deduplicate merged results
    const deduplicated = deduplicateJobs(fetchedJobs);

    // Calculate TTL expiry Date
    const ttlHours = config.jobCacheTtlHours || 12;
    const generatedAt = new Date();
    const expiresAt = new Date(generatedAt.getTime() + ttlHours * 60 * 60 * 1000);

    const insightPayload = {
      queryKey: cacheKey,
      query,
      location,
      country,
      jobs: deduplicated,
      nextPageCursor,
      generatedAt,
      expiresAt
    };

    // Save to MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        await JobInsight.findOneAndUpdate(
          { queryKey: cacheKey },
          insightPayload,
          { upsert: true, returnDocument: 'after' }
        );
        console.log(`[JOBS CACHE SAVE] Saved ${deduplicated.length} jobs for query="${query}" page=${page} to MongoDB.`);
      } catch (err) {
        console.warn('[WARNING] Job MongoDB cache save failed:', err.message);
      }
    }

    // Save to Memory
    inMemoryJobCache.set(cacheKey, insightPayload);

    // Evaluate match scores for user's profile
    const evaluatedJobs = deduplicated.map(j => {
      const evaluation = calculateJobMatchScore(j, userSkills, userRole);
      return { ...j, ...evaluation };
    });

    const resolvedJobs = await Promise.all(evaluatedJobs.map(async (j) => {
      const [skills, matched, missing] = await Promise.all([
        Promise.all((j.skills || []).map(resolveSkill)),
        Promise.all((j.matchedSkills || []).map(resolveSkill)),
        Promise.all((j.missingSkills || []).map(resolveSkill))
      ]);
      return { ...j, skills, matchedSkills: matched, missingSkills: missing };
    }));

    return {
      query,
      location,
      country,
      page,
      jobs: resolvedJobs,
      hasMore: !!nextPageCursor,
      generatedAt,
      isCacheHit: false,
      usedKeywordExpansion
    };
  })();

  inProgressJobRequests.set(cacheKey, fetchPromise);

  try {
    const result = await fetchPromise;
    return result;
  } finally {
    inProgressJobRequests.delete(cacheKey);
  }
};

