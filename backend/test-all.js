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

tests.forEach(t => {
  console.log(`\n--- ${t.name} ---`);
  const result = matchRoles(t.skills);
  // print top 3
  console.log(JSON.stringify(result.slice(0, 3), null, 2));
});
