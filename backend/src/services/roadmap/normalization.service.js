import Skill from '../../models/skill.model.js';
import SkillDependency from '../../models/skillDependency.model.js';
import { getNormalizedSkillName, prettifySkillName, canonicalizeSkill } from '../../utils/skillNormalizer.js';
import mongoose from 'mongoose';
import { readJsonFile } from '../../utils/fileUtils.js';

const resolvedSkillsMemoryCache = new Map();

// Known brand lists matching frontend SkillIcon mappings
const deviconBrands = new Set([
  'react', 'javascript', 'typescript', 'nodejs', 'express', 'mongodb', 
  'cplusplus', 'csharp', 'python', 'java', 'spring', 'mysql', 
  'postgresql', 'html5', 'css3', 'tailwindcss', 'figma', 'git', 
  'github', 'docker', 'kubernetes', 'amazonwebservices', 'azure', 
  'jenkins', 'googlecloud', 'redux', 'sass', 'webpack', 'angularjs', 
  'vuejs', 'go', 'scala', 'selenium', 'jira'
]);

const simpleIconsBrands = new Set(['postman', 'tableau']);

// Seed metadata for common core skills across different domains
const seedRegistry = {
  'react': { display: 'React.js', category: 'Technology', iconUrl: 'react', iconType: 'devicon' },
  'nodejs': { display: 'Node.js', category: 'Technology', iconUrl: 'nodejs', iconType: 'devicon' },
  'javascript': { display: 'JavaScript', category: 'Technology', iconUrl: 'javascript', iconType: 'devicon' },
  'typescript': { display: 'TypeScript', category: 'Technology', iconUrl: 'typescript', iconType: 'devicon' },
  'postgresql': { display: 'PostgreSQL', category: 'Data', iconUrl: 'postgresql', iconType: 'devicon' },
  'mongodb': { display: 'MongoDB', category: 'Data', iconUrl: 'mongodb', iconType: 'devicon' },
  'html': { display: 'HTML5', category: 'Technology', iconUrl: 'html5', iconType: 'devicon' },
  'css': { display: 'CSS3', category: 'Technology', iconUrl: 'css3', iconType: 'devicon' },
  'tailwind': { display: 'Tailwind CSS', category: 'Technology', iconUrl: 'tailwindcss', iconType: 'devicon' },
  'aws': { display: 'AWS', category: 'Technology', iconUrl: 'amazonwebservices', iconType: 'devicon' },
  'python': { display: 'Python', category: 'Technology', iconUrl: 'python', iconType: 'devicon' },
  'java': { display: 'Java', category: 'Technology', iconUrl: 'java', iconType: 'devicon' },
  'git': { display: 'Git', category: 'Technology', iconUrl: 'git', iconType: 'devicon' },
  'github': { display: 'GitHub', category: 'Technology', iconUrl: 'github', iconType: 'devicon' },
  'docker': { display: 'Docker', category: 'Technology', iconUrl: 'docker', iconType: 'devicon' },
  'kubernetes': { display: 'Kubernetes', category: 'Technology', iconUrl: 'kubernetes', iconType: 'devicon' },
  'postman': { display: 'Postman', category: 'Technology', iconUrl: 'postman', iconType: 'simpleicons' },
  'figma': { display: 'Figma', category: 'Design', iconUrl: 'figma', iconType: 'devicon' },
  'photoshop': { display: 'Adobe Photoshop', category: 'Design', iconUrl: 'photoshop', iconType: 'devicon' }
};

/**
 * Categorize a skill using regex heuristics
 */
const classifyCategory = (canonical) => {
  const text = canonical.toLowerCase();
  if (text.includes('db') || text.includes('sql') || text.includes('database') || text.includes('query') || text.includes('postgres') || text.includes('mongo')) {
    return 'Data';
  }
  if (text.includes('ai') || text.includes('ml') || text.includes('model') || text.includes('machine learning') || text.includes('neural') || text.includes('deep learning') || text.includes('nlp') || text.includes('statistics')) {
    return 'Data';
  }
  if (text.includes('design') || text.includes('figma') || text.includes('photoshop') || text.includes('adobe') || text.includes('sketch') || text.includes('ui') || text.includes('ux') || text.includes('wireframe') || text.includes('solidworks') || text.includes('autocad') || text.includes('cad')) {
    return 'Design';
  }
  if (text.includes('marketing') || text.includes('seo') || text.includes('ads') || text.includes('sales') || text.includes('adwords') || text.includes('brand') || text.includes('social media')) {
    return 'Marketing';
  }
  if (text.includes('finance') || text.includes('accounting') || text.includes('tax') || text.includes('gst') || text.includes('budget') || text.includes('cost') || text.includes('revenue') || text.includes('ledger') || text.includes('tally')) {
    return 'Finance';
  }
  if (text.includes('manage') || text.includes('lead') || text.includes('project') || text.includes('agile') || text.includes('scrum') || text.includes('product') || text.includes('operation') || text.includes('supply chain')) {
    return 'Management';
  }
  if (text.includes('care') || text.includes('health') || text.includes('clinic') || text.includes('nurse') || text.includes('doctor')) {
    return 'Healthcare';
  }
  return 'Technology';
};

/**
 * Classify a skill's domain
 */
const classifyDomain = (canonical) => {
  const text = canonical.toLowerCase();
  if (text.includes('autocad') || text.includes('structural') || text.includes('concrete') || text.includes('revit') || text.includes('civil') || text.includes('surveying')) {
    return 'Civil Engineering';
  }
  if (text.includes('solidworks') || text.includes('creo') || text.includes('catia') || text.includes('ansys') || text.includes('mechanical') || text.includes('cad') || text.includes('gd&t') || text.includes('cnc') || text.includes('thermodynamics')) {
    return 'Mechanical Engineering';
  }
  if (text.includes('finance') || text.includes('accounting') || text.includes('tax') || text.includes('gst') || text.includes('tds') || text.includes('tally') || text.includes('quickbooks') || text.includes('payroll') || text.includes('ifrs') || text.includes('reconciliation') || text.includes('ledger')) {
    return 'Finance';
  }
  if (text.includes('marketing') || text.includes('seo') || text.includes('ads') || text.includes('adwords') || text.includes('campaign') || text.includes('sales') || text.includes('copywriting') || text.includes('brand') || text.includes('analytics')) {
    return 'Marketing';
  }
  if (text.includes('react') || text.includes('node') || text.includes('javascript') || text.includes('typescript') || text.includes('docker') || text.includes('kubernetes') || text.includes('aws') || text.includes('sql') || text.includes('html') || text.includes('css') || text.includes('express') || text.includes('django') || text.includes('springboot')) {
    return 'Software Engineering';
  }
  if (text.includes('machine learning') || text.includes('neural') || text.includes('tensorflow') || text.includes('pytorch') || text.includes('nlp') || text.includes('computer vision') || text.includes('data science') || text.includes('statistics') || text.includes('pandas') || text.includes('numpy')) {
    return 'Data Science';
  }
  return 'General';
};

const getCategoryIconName = (category) => {
  switch (category) {
    case 'Data': return 'Database';
    case 'Design': return 'Wrench';
    case 'Marketing': return 'Briefcase';
    case 'Finance': return 'Settings';
    case 'Healthcare': return 'Brain';
    case 'Management':
    case 'Business': return 'Briefcase';
    case 'Soft Skills': return 'Languages';
    default: return 'Wrench';
  }
};

/**
 * Gets aliases from skillDictionary.json for a canonical skill
 */
const getAliasesForCanonical = (canonical) => {
  try {
    const synonyms = readJsonFile('data/skillDictionary.json');
    const aliases = [];
    for (const [key, val] of Object.entries(synonyms)) {
      if (canonicalizeSkill(val) === canonical && canonicalizeSkill(key) !== canonical) {
        aliases.push(key);
      }
    }
    return [...new Set(aliases)];
  } catch {
    return [];
  }
};

/**
 * Resolves a skill into its unified Canonical Skill representation.
 */
export const normalizeAndResolveSkill = async (rawName) => {
  if (!rawName || typeof rawName !== 'string' || !rawName.trim()) {
    return {
      canonicalId: '',
      displayName: 'Unknown Skill',
      aliases: [],
      category: 'Technology',
      domain: 'General',
      parentSkill: null,
      prerequisites: [],
      logoMetadata: {
        iconUrl: '',
        iconType: 'lucide',
        iconName: 'Wrench'
      }
    };
  }

  // 1. Get canonical synonym mapping name
  const canonical = getNormalizedSkillName(rawName);

  // 2. Check Memory cache
  if (resolvedSkillsMemoryCache.has(canonical)) {
    return resolvedSkillsMemoryCache.get(canonical);
  }

  // 3. Check MongoDB
  let dbCached = null;
  if (mongoose.connection.readyState === 1) {
    try {
      dbCached = await Skill.findOne({ canonical });
    } catch (err) {
      console.warn('[WARNING] Failed to query resolved skill in MongoDB:', err.message);
    }
  }

  // 4. Resolve static details
  let display = dbCached?.display;
  let category = dbCached?.category;
  let iconUrl = dbCached?.iconUrl || '';
  let iconType = dbCached?.iconType || 'lucide';
  let iconName = dbCached?.iconName || 'Wrench';
  let aliases = dbCached?.aliases && dbCached.aliases.length > 0 ? dbCached.aliases : getAliasesForCanonical(canonical);
  let domain = dbCached?.domain || classifyDomain(canonical);
  let parentSkill = dbCached?.parentSkill || null;
  
  // Resolve prerequisites from database dependencies
  let prerequisites = [];
  if (mongoose.connection.readyState === 1) {
    try {
      const deps = await SkillDependency.find({ skillId: canonical });
      prerequisites = deps.map(d => d.prerequisiteSkillId);
    } catch {
      // Offline fallback
    }
  }

  if (!display) {
    if (seedRegistry[canonical]) {
      const seed = seedRegistry[canonical];
      display = seed.display;
      category = seed.category;
      iconUrl = seed.iconUrl || '';
      iconType = seed.iconType || 'lucide';
      iconName = seed.iconName || getCategoryIconName(category);
    } else {
      display = prettifySkillName(canonical);
      category = classifyCategory(canonical);

      const cleanBrand = canonical.replace(/[^a-z0-9]/g, '');
      if (deviconBrands.has(cleanBrand)) {
        iconUrl = cleanBrand;
        iconType = 'devicon';
      } else if (deviconBrands.has(canonical)) {
        iconUrl = canonical;
        iconType = 'devicon';
      } else if (simpleIconsBrands.has(canonical)) {
        iconUrl = canonical;
        iconType = 'simpleicons';
      } else {
        iconName = getCategoryIconName(category);
      }
    }
  }

  const result = {
    canonicalId: canonical,
    displayName: display,
    aliases,
    category,
    domain,
    parentSkill,
    prerequisites,
    logoMetadata: {
      iconUrl,
      iconType,
      iconName
    }
  };

  // Cache in memory
  resolvedSkillsMemoryCache.set(canonical, result);

  // Sync to database schema cache
  if (mongoose.connection.readyState === 1) {
    try {
      const mongoPayload = {
        canonical,
        display,
        category,
        iconUrl,
        iconType,
        iconName,
        aliases,
        domain,
        parentSkill,
        prerequisites
      };
      await Skill.findOneAndUpdate({ canonical }, mongoPayload, { upsert: true });
    } catch (err) {
      console.warn('[WARNING] Failed to save resolved skill to MongoDB:', err.message);
    }
  }

  return result;
};
