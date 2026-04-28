import { matchRoles } from './src/services/role.service.js';

const tests = [
  {
    name: "TEST 1 - FRONTEND",
    skills: [
      { "name": "react", "level": "advanced" },
      { "name": "javascript", "level": "advanced" },
      { "name": "html", "level": "advanced" },
      { "name": "css", "level": "intermediate" },
      { "name": "dom", "level": "intermediate" }
    ]
  },
  {
    name: "TEST 2 - BACKEND",
    skills: [
      { "name": "node", "level": "advanced" },
      { "name": "api", "level": "advanced" },
      { "name": "sql", "level": "advanced" },
      { "name": "authentication", "level": "intermediate" },
      { "name": "express", "level": "intermediate" }
    ]
  },
  {
    name: "TEST 3 - FULL STACK",
    skills: [
      { "name": "react", "level": "intermediate" },
      { "name": "node", "level": "intermediate" },
      { "name": "sql", "level": "intermediate" },
      { "name": "api", "level": "intermediate" }
    ]
  },
  {
    name: "TEST 4 - TESTER",
    skills: [
      { "name": "testing", "level": "advanced" },
      { "name": "postman", "level": "advanced" },
      { "name": "api", "level": "intermediate" }
    ]
  },
  {
    name: "TEST 5 - DATA ANALYST",
    skills: [
      { "name": "python", "level": "advanced" },
      { "name": "sql", "level": "advanced" },
      { "name": "statistics", "level": "intermediate" },
      { "name": "data cleaning", "level": "intermediate" }
    ]
  }
];

tests.forEach(t => {
  console.log(`\n--- ${t.name} ---`);
  const result = matchRoles(t.skills);
  console.log(JSON.stringify(result.slice(0, 3), null, 2));
});
