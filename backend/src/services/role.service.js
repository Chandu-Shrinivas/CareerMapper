import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rolesFilePath = path.join(__dirname, '../data/roles.json');

const LEVEL_WEIGHTS = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4
};

const MAX_LEVEL_WEIGHT = 4;
const MIN_MATCHED_SKILLS = 2;
const MIN_COVERAGE_PERCENT = 20;

const canonicalizeSkill = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const ROLE_ANCHOR_SKILLS = {
  'Frontend Developer': ['react', 'javascript', 'html', 'css'],
  'Backend Developer': ['node', 'java', 'python', 'authentication', 'authorization'],
  'Full Stack Developer': ['react', 'javascript', 'html', 'css', 'node', 'java', 'python'],
  'Software Tester': ['testing', 'postman'],
  'Data Analyst': ['python', 'statistics', 'data cleaning'],
  'DevOps Engineer': ['docker', 'linux', 'aws', 'microservices'],
  'Business Analyst': ['business analysis', 'market research', 'swot analysis'],
  'Marketing Analyst': ['digital marketing', 'google analytics', 'seo'],
  'Sales Executive': ['b2b sales', 'crm', 'salesforce'],
  'Operations Manager': ['supply chain management', 'erp', 'project management'],
  'Financial Analyst': ['financial modeling', 'forecasting', 'budgeting']
};

export const matchRoles = (userSkills, detectedDomain = 'Unknown') => {
  if (!userSkills || !Array.isArray(userSkills)) {
    return [];
  }

  try {
    const rolesData = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));
    const recommendations = [];

    const userSkillMap = {};
    userSkills.forEach(skill => {
      if (skill && skill.name) {
        const normalizedLevel = skill.level ? String(skill.level).trim().toLowerCase() : '';
        const levelWeight = LEVEL_WEIGHTS[normalizedLevel] || 0;
        const normalizedSkillName = canonicalizeSkill(skill.name);
        if (!normalizedSkillName || levelWeight <= 0) {
          return;
        }
        userSkillMap[normalizedSkillName] = levelWeight;
      }
    });

    const userSkillNames = Object.keys(userSkillMap);
    if (userSkillNames.length === 0) {
      return [];
    }

    for (const [roleName, roleData] of Object.entries(rolesData)) {
      if (detectedDomain !== 'Unknown' && roleData.domain !== detectedDomain) {
        continue;
      }

      const roleSkills = roleData.skills;
      
      // ROLE GATING (MANDATORY)
      const hasSkill = (skill) => userSkillMap[canonicalizeSkill(skill)] > 0;
      let gatePassed = true;

      if (roleName === 'Frontend Developer') {
        gatePassed = hasSkill('react') || hasSkill('javascript');
      } else if (roleName === 'Backend Developer') {
        gatePassed = hasSkill('node') || hasSkill('java') || hasSkill('python');
      } else if (roleName === 'Full Stack Developer') {
        const hasFrontend = ['react', 'javascript', 'html', 'css'].some(hasSkill);
        const hasBackend = ['node', 'java', 'python', 'sql', 'api'].some(hasSkill);
        gatePassed = hasFrontend && hasBackend;
      } else if (roleName === 'Software Tester' || roleName === 'Tester') {
        gatePassed = hasSkill('testing') || hasSkill('postman');
      } else if (roleName === 'Data Analyst') {
        gatePassed = hasSkill('python') || hasSkill('statistics') || hasSkill('data cleaning');
      } else if (roleName === 'DevOps Engineer') {
        gatePassed = hasSkill('docker') || hasSkill('linux') || hasSkill('aws');
      } else if (ROLE_ANCHOR_SKILLS[roleName]) {
        gatePassed = ROLE_ANCHOR_SKILLS[roleName].some(hasSkill);
      }

      if (!gatePassed) {
        continue;
      }

      let weightedScore = 0;
      let matchedRoleWeight = 0;
      let roleMaxWeight = 0;
      let matchedSkills = 0;

      for (const [skillName, roleWeight] of Object.entries(roleSkills)) {
        const normalizedSkillName = canonicalizeSkill(skillName);
        const userLevelWeight = userSkillMap[normalizedSkillName];
        roleMaxWeight += (roleWeight * MAX_LEVEL_WEIGHT);
        
        if (userLevelWeight) {
          weightedScore += (roleWeight * userLevelWeight);
          matchedRoleWeight += roleWeight;
          matchedSkills++;
        }
      }

      let percentage = 0;
      if (weightedScore > 0 && roleMaxWeight > 0) {
        const coveragePercent = (matchedRoleWeight / Object.values(roleSkills).reduce((acc, wt) => acc + wt, 0)) * 100;
        const qualityPercent = (weightedScore / roleMaxWeight) * 100;

        if (matchedSkills < MIN_MATCHED_SKILLS || coveragePercent < MIN_COVERAGE_PERCENT) {
          continue;
        }

        percentage = Math.round((coveragePercent * 0.7) + (qualityPercent * 0.3));
        percentage = Math.min(90, percentage); // requested cap
      }

      if (percentage > 0) {
        recommendations.push({ role: roleName, score: percentage });
      }
    }

    recommendations.sort((a, b) => b.score - a.score);

    // Return top 3 roles (or more if you want, but standard is top 3)
    return recommendations.slice(0, 3);

  } catch (error) {
    console.error('Error matching roles:', error);
    return [];
  }
};
