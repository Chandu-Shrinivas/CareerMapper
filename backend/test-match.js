import { matchRoles } from './src/services/role.service.js';

const skills = [
  { "name": "react", "level": "advanced" },
  { "name": "javascript", "level": "advanced" },
  { "name": "html", "level": "advanced" },
  { "name": "css", "level": "intermediate" }
];

const result = matchRoles(skills);
console.log("\n--- FINAL OUTPUT ---");
console.log(JSON.stringify(result, null, 2));
