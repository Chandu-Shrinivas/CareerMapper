import { matchRoles } from './src/services/role.service.js';

const tests = [
  {
    name: "1. FRONTEND USER (PURE)",
    skills: [
      { name: "react", level: "advanced" },
      { name: "javascript", level: "advanced" },
      { name: "html", level: "advanced" },
      { name: "css", level: "intermediate" },
      { name: "responsive design", level: "intermediate" }
    ]
  },
  {
    name: "2. BACKEND USER (PURE)",
    skills: [
      { name: "node", level: "advanced" },
      { name: "sql", level: "advanced" },
      { name: "api", level: "intermediate" },
      { name: "authentication", level: "intermediate" },
      { name: "express", level: "intermediate" }
    ]
  },
  {
    name: "3. FULL STACK USER",
    skills: [
      { name: "react", level: "intermediate" },
      { name: "node", level: "intermediate" },
      { name: "sql", level: "intermediate" },
      { name: "api", level: "intermediate" },
      { name: "html", level: "advanced" }
    ]
  },
  {
    name: "4. TESTER PROFILE",
    skills: [
      { name: "testing", level: "advanced" },
      { name: "postman", level: "advanced" },
      { name: "api", level: "intermediate" }
    ]
  },
  {
    name: "5. DATA ANALYST",
    skills: [
      { name: "python", level: "advanced" },
      { name: "sql", level: "advanced" },
      { name: "statistics", level: "intermediate" },
      { name: "data cleaning", level: "intermediate" }
    ]
  },
  {
    name: "6. MIXED USER (REALISTIC)",
    skills: [
      { name: "react", level: "beginner" },
      { name: "java", level: "intermediate" },
      { name: "sql", level: "intermediate" }
    ]
  },
  {
    name: "7. UNKNOWN SKILLS",
    skills: [
      { name: "blockchain", level: "advanced" }
    ]
  }
];

// Test logic mock
const LEVEL_WEIGHTS = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4
};
const fs = require('fs');
const rolesData = JSON.parse(fs.readFileSync('./src/data/roles.json', 'utf8'));

tests.forEach(t => {
  console.log(`\n--- ${t.name} ---`);
  const recommendations = [];
  
  const userSkillMap = {};
  t.skills.forEach(skill => {
    userSkillMap[skill.name.toLowerCase()] = LEVEL_WEIGHTS[skill.level];
  });

  for (const [roleName, roleData] of Object.entries(rolesData)) {
    let score = 0;
    let matchedWeight = 0;
    for (const [skillName, roleWeight] of Object.entries(roleData.skills)) {
      if (userSkillMap[skillName]) {
        score += roleWeight * userSkillMap[skillName];
        matchedWeight += roleWeight;
      }
    }
    let percentage = 0;
    if (matchedWeight > 0) {
      percentage = Math.round(Math.min(100, 20 + (score / 40) * 80));
    }
    recommendations.push({ role: roleName, score: percentage });
  }
  recommendations.sort((a,b) => b.score - a.score);
  console.log(recommendations.slice(0, 3));
});
