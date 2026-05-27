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
      // Apply strict domain filtering
      if (detectedDomain !== 'Unknown' && roleData.domain !== detectedDomain) {
        continue;
      }

      const roleSkills = roleData.skills;
      
      // Soft role relevance: anchors boost score but don't hard-block
      const hasSkill = (skill) => userSkillMap[canonicalizeSkill(skill)] > 0;
      let anchorSkills = ROLE_ANCHOR_SKILLS[roleName] || [];

      if (roleName === 'Frontend Developer') {
        anchorSkills = ['react', 'javascript', 'html', 'css', 'dom'];
      } else if (roleName === 'Backend Developer') {
        anchorSkills = ['node', 'api', 'sql', 'authentication', 'authorization', 'java', 'python'];
      } else if (roleName === 'Full Stack Developer') {
        anchorSkills = ['react', 'javascript', 'html', 'css', 'node', 'java', 'python', 'sql', 'api'];
      } else if (roleName === 'Software Tester' || roleName === 'Tester') {
        anchorSkills = ['testing', 'postman', 'api', 'automation'];
      } else if (roleName === 'Data Analyst') {
        anchorSkills = ['python', 'sql', 'statistics', 'data cleaning', 'tableau'];
      } else if (roleName === 'DevOps Engineer') {
        anchorSkills = ['docker', 'linux', 'aws', 'microservices', 'ci cd'];
      } else if (roleName === 'Data Scientist') {
        anchorSkills = ['data science', 'machine learning', 'pandas'];
      } else if (roleName === 'Machine Learning Engineer') {
        anchorSkills = ['machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch'];
      } else if (roleName === 'UI/UX Designer') {
        anchorSkills = ['ui design', 'ux design', 'figma', 'wireframing'];
      } else if (roleName === 'Mobile Developer') {
        anchorSkills = ['mobile app development', 'react native', 'flutter', 'swift', 'kotlin', 'android studio'];
      } else if (!anchorSkills || anchorSkills.length === 0) {
        // Auto-extract core skills (weight >= 3) as anchors for any unlisted roles
        for (const [skill, weight] of Object.entries(roleSkills)) {
          if (weight >= 3) {
            anchorSkills.push(canonicalizeSkill(skill));
          }
        }
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
      if (roleMaxWeight > 0) {
        const totalRoleWeight = Object.values(roleSkills).reduce((acc, wt) => acc + wt, 0);
        const coveragePercent = totalRoleWeight > 0 ? (matchedRoleWeight / totalRoleWeight) * 100 : 0;
        const qualityPercent = matchedRoleWeight > 0 ? (weightedScore / (matchedRoleWeight * MAX_LEVEL_WEIGHT)) * 100 : 0;
        const matchedAnchors = anchorSkills.filter(hasSkill).length;
        const anchorRatio = anchorSkills.length > 0 ? (matchedAnchors / anchorSkills.length) : 0;

        // Relaxed scoring: coverage drives rank, anchors boost relevance, weak overlap still gets low scores.
        const baseScore = (coveragePercent * 0.85) + (qualityPercent * 0.15);
        const anchorBoost = anchorRatio * 22; // Boosted strong anchors
        percentage = Math.round(baseScore + anchorBoost);
        percentage = Math.max(0, Math.min(90, percentage)); // keep cap

        // STRICT FILTERING TO PREVENT LEAKAGE AND CONTROL SECONDARY ROLES
        if (matchedSkills === 0 || coveragePercent < 5) {
          percentage = 0;
        } else if (anchorRatio === 0) {
          // No core skills matched -> Massive penalty to prevent leakage
          percentage = Math.max(0, Math.min(25, percentage - 25)); // Smoothed penalty
        } else if (anchorRatio < 0.4) {
          // Weak core skill overlap -> Capped secondary role
          percentage = Math.max(0, Math.min(45, percentage - 10)); // Softened drop and raised cap
        }

        // HARD CUTOFFS FOR SPECIALIZED ROLES
        if (roleName === 'Machine Learning Engineer' || roleName === 'Data Scientist') {
          const hasAdvancedML = ['machine learning', 'deep learning', 'data science', 'tensorflow', 'pytorch', 'nlp', 'computer vision'].some(hasSkill);
          if (!hasAdvancedML) {
            percentage = 0; // Hard cutoff if they have no actual ML skills
          }
        }

        if (roleName === 'Data Analyst') {
          const hasDataCore = ['statistics', 'data cleaning', 'tableau', 'excel'].some(hasSkill);
          if (!hasDataCore) {
            percentage = Math.max(0, percentage - 25); // Heavy penalty if only python/sql
          }
        }

        if (roleName === 'Cloud Engineer' || roleName === 'DevOps Engineer') {
          const hasCloudCore = ['aws', 'azure', 'docker', 'kubernetes', 'linux', 'ci cd'].filter(hasSkill).length;
          if (hasCloudCore < 2) {
            percentage = Math.max(0, percentage - 15); // Require at least 2 cloud/devops skills to score high
          }
        }

        if (roleName === 'UI/UX Designer') {
          const hasDesignCore = ['ui design', 'ux design', 'figma', 'wireframing', 'adobe xd'].some(hasSkill);
          if (!hasDesignCore) {
            percentage = 0; // Hard cutoff to separate from developers who just know HTML/CSS
          }
        }

        if (roleName === 'Mobile Developer') {
          const hasMobileCore = ['mobile app development', 'react native', 'flutter', 'swift', 'kotlin', 'android studio'].some(hasSkill);
          if (!hasMobileCore) {
            percentage = 0; // Hard cutoff to separate from standard devs
          }
        }

        // Consistency tuning: keep broad roles from overpowering specialists on one-sided skill sets.
        if (roleName === 'Full Stack Developer') {
          const hasFrontendAnchor = ['react', 'javascript', 'html', 'css'].some(hasSkill);
          const hasBackendAnchor = ['node', 'java', 'python', 'sql', 'api'].some(hasSkill);
          if (hasFrontendAnchor && hasBackendAnchor) {
            percentage = Math.min(90, percentage + 8);
          } else {
            percentage = Math.max(0, percentage - 8); // Softened from 12 to 8
          }
        }

        if (roleName === 'Backend Developer') {
          const backendCoreMatched = ['node', 'api', 'sql', 'authentication'].filter(hasSkill).length;
          if (backendCoreMatched >= 2) {
            percentage = Math.min(90, percentage + 10);
          }
        }

        if (roleName === 'Software Tester' || roleName === 'Tester') {
          const hasTesterCore = ['testing', 'postman', 'automation'].some(hasSkill);
          if (!hasTesterCore) {
            percentage = Math.max(0, percentage - 15);
          } else {
            percentage = Math.min(90, percentage + 12); // Boost tester if core skills are present
          }
        }
      }

      recommendations.push({ role: roleName, score: percentage });
    }

    // Apply minimum score threshold to remove noise
    const validRecommendations = recommendations.filter(r => r.score >= 15);

    validRecommendations.sort((a, b) => b.score - a.score);

    // Return top 3 recommendations
    return validRecommendations.slice(0, 3);

  } catch (error) {
    console.error('Error matching roles:', error);
    return [];
  }
};
