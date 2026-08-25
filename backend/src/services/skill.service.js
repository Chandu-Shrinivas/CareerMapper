import Skill from '../models/skill.model.js';
import mongoose from 'mongoose';
import { getNormalizedSkillName, prettifySkillName, canonicalizeSkill } from '../utils/skillNormalizer.js';

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
  
  // Design
  'figma': { display: 'Figma', category: 'Design', iconUrl: 'figma', iconType: 'devicon' },
  'photoshop': { display: 'Adobe Photoshop', category: 'Design', iconUrl: 'photoshop', iconType: 'devicon' },
  'ui design': { display: 'UI Design', category: 'Design', iconType: 'lucide', iconName: 'Wrench' },
  'ux design': { display: 'UX Design', category: 'Design', iconType: 'lucide', iconName: 'Wrench' },
  
  // Marketing
  'seo': { display: 'SEO', category: 'Marketing', iconType: 'lucide', iconName: 'Briefcase' },
  'digital marketing': { display: 'Digital Marketing', category: 'Marketing', iconType: 'lucide', iconName: 'Briefcase' },
  
  // Finance
  'accounting': { display: 'Accounting', category: 'Finance', iconType: 'lucide', iconName: 'Settings' },
  'financial analysis': { display: 'Financial Analysis', category: 'Finance', iconType: 'lucide', iconName: 'Settings' },
  
  // Management & Soft Skills
  'project management': { display: 'Project Management', category: 'Management', iconType: 'lucide', iconName: 'Briefcase' },
  'leadership': { display: 'Leadership', category: 'Soft Skills', iconType: 'lucide', iconName: 'Languages' },
  'communication': { display: 'Communication', category: 'Soft Skills', iconType: 'lucide', iconName: 'Languages' },
  'supply chain management': { display: 'Supply Chain Management', category: 'Business', iconType: 'lucide', iconName: 'Briefcase' }
};

/**
 * Categorize a skill using regex heuristics
 */
const classifyCategory = (canonical) => {
  const text = canonical.toLowerCase();
  
  if (text.includes('db') || text.includes('sql') || text.includes('database') || text.includes('query') || text.includes('postgres') || text.includes('mongo')) {
    return 'Data';
  }
  if (text.includes('ai') || text.includes('ml') || text.includes('model') || text.includes('machine learning') || text.includes('neural') || text.includes('deep learning') || text.includes('nlp')) {
    return 'Data';
  }
  if (text.includes('design') || text.includes('figma') || text.includes('photoshop') || text.includes('adobe') || text.includes('sketch') || text.includes('ui') || text.includes('ux') || text.includes('wireframe')) {
    return 'Design';
  }
  if (text.includes('marketing') || text.includes('seo') || text.includes('ads') || text.includes('sales') || text.includes('adwords') || text.includes('brand') || text.includes('social media')) {
    return 'Marketing';
  }
  if (text.includes('finance') || text.includes('accounting') || text.includes('tax') || text.includes('gst') || text.includes('budget') || text.includes('cost') || text.includes('revenue')) {
    return 'Finance';
  }
  if (text.includes('manage') || text.includes('lead') || text.includes('project') || text.includes('agile') || text.includes('scrum') || text.includes('product') || text.includes('operation') || text.includes('supply chain')) {
    return 'Management';
  }
  if (text.includes('communication') || text.includes('english') || text.includes('writing') || text.includes('team') || text.includes('presentation') || text.includes('interpersonal')) {
    return 'Soft Skills';
  }
  if (text.includes('care') || text.includes('health') || text.includes('clinic') || text.includes('nurse') || text.includes('doctor')) {
    return 'Healthcare';
  }
  
  return 'Technology'; // default category fallback
};

/**
 * Get category generic lucide icon name
 */
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
 * Resolves a raw skill name into a unified Canonical Metadata Object.
 * Caches resolution in MongoDB and Memory to keep lookups sub-millisecond.
 */
export const resolveSkill = async (rawName) => {
  if (!rawName || typeof rawName !== 'string' || !rawName.trim()) {
    return {
      canonical: '',
      display: 'Unknown Skill',
      category: 'Technology',
      iconUrl: '',
      iconType: 'lucide',
      iconName: 'Wrench'
    };
  }

  // 1. Synonym mapping to canonical name
  const canonical = getNormalizedSkillName(rawName);
  
  // 2. Check Memory cache
  if (resolvedSkillsMemoryCache.has(canonical)) {
    return resolvedSkillsMemoryCache.get(canonical);
  }

  // 3. Check MongoDB Cache
  if (mongoose.connection.readyState === 1) {
    try {
      const dbCached = await Skill.findOne({ canonical });
      if (dbCached) {
        const metadata = dbCached.toObject ? dbCached.toObject() : dbCached;
        resolvedSkillsMemoryCache.set(canonical, metadata);
        return metadata;
      }
    } catch (err) {
      console.warn('[WARNING] Failed to query resolved skill cache in MongoDB:', err.message);
    }
  }

  // 4. Resolve statically/heuristically
  let display = '';
  let category = '';
  let iconUrl = '';
  let iconType = 'lucide';
  let iconName = 'Wrench';

  // Check seed registry
  if (seedRegistry[canonical]) {
    const seed = seedRegistry[canonical];
    display = seed.display;
    category = seed.category;
    iconUrl = seed.iconUrl || '';
    iconType = seed.iconType || 'lucide';
    iconName = seed.iconName || getCategoryIconName(category);
  } else {
    // Dynamic fallback classification
    display = prettifySkillName(canonical);
    category = classifyCategory(canonical);
    
    // Check brand icon availability
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

  const metadata = {
    canonical,
    display,
    category,
    iconUrl,
    iconType,
    iconName
  };

  // 5. Save to Caches
  resolvedSkillsMemoryCache.set(canonical, metadata);
  if (mongoose.connection.readyState === 1) {
    try {
      await Skill.findOneAndUpdate({ canonical }, metadata, { upsert: true, returnDocument: 'after' });
    } catch (err) {
      console.warn('[WARNING] Failed to save resolved skill to MongoDB:', err.message);
    }
  }

  return metadata;
};
