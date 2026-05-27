import { detectLevel } from './src/utils/levelDetector.js';
import { normalizeSkills } from './src/utils/skillNormalizer.js';
import { readJsonFile } from './src/utils/fileUtils.js';

// Replicate the exact end-to-end extraction and normalization pipeline
const runPipeline = (rawText) => {
  const text = rawText.toLowerCase();

  // 1. Load skill dictionary (same as in resume.service.js)
  const domainsData = readJsonFile('data/domains.json');
  
  const knownSkills = new Set();
  for (const domainSkills of Object.values(domainsData)) {
    for (const skill of domainSkills) {
      knownSkills.add(skill.toLowerCase());
    }
  }

  // 2. Skill Extraction (same as in resume.service.js)
  const extractedSkills = [];
  for (const skill of knownSkills) {
    let idx = text.indexOf(skill);
    while (idx !== -1) {
      const detectedLevel = detectLevel(text, skill, idx);
      extractedSkills.push({
        name: skill,
        level: detectedLevel
      });
      idx = text.indexOf(skill, idx + 1);
    }
  }

  // 3. Normalization (same as in resume.controller.js)
  const normalizedSkills = normalizeSkills(extractedSkills);

  return normalizedSkills;
};

const tests = [
  {
    id: 1,
    name: "TEST 1 — GLOBAL LEAK CHECK",
    input: "Expert communication skills and beginner python developer",
    validate: (skills) => {
      console.log("Extracted:", skills);
      const comm = skills.find(s => s.name === "communication");
      const python = skills.find(s => s.name === "python");
      
      const commPass = comm && comm.level === "advanced";
      const pythonPass = python && python.level === "beginner";
      
      const pass = commPass && pythonPass;
      console.log(`-> Verdict: ${pass ? "PASS" : "FAIL"}`);
      if (!comm) console.log("   Inconsistency: 'communication' skill not extracted!");
      if (python && python.level === "advanced") console.log("   Inconsistency: python was falsely assigned 'advanced'!");
    }
  },
  {
    id: 2,
    name: "TEST 2 — MULTI-SKILL LOCAL CONTEXT",
    input: "Advanced React developer with intermediate Node.js experience",
    validate: (skills) => {
      console.log("Extracted:", skills);
      const react = skills.find(s => s.name === "react");
      const node = skills.find(s => s.name === "node");
      
      const reactPass = react && react.level === "advanced";
      const nodePass = node && node.level === "intermediate";
      
      const pass = reactPass && nodePass;
      console.log(`-> Verdict: ${pass ? "PASS" : "FAIL"}`);
      if (react && node && react.level === node.level) {
        console.log(`   Inconsistency: both react and node are same level: ${react.level}!`);
      }
    }
  },
  {
    id: 3,
    name: "TEST 3 — NO LEVEL KEYWORDS",
    input: "Python developer with SQL knowledge",
    validate: (skills) => {
      console.log("Extracted:", skills);
      const python = skills.find(s => s.name === "python");
      const sql = skills.find(s => s.name === "sql");
      
      const pythonPass = python && python.level === "beginner";
      const sqlPass = sql && sql.level === "beginner";
      
      const pass = pythonPass && sqlPass;
      console.log(`-> Verdict: ${pass ? "PASS" : "FAIL"}`);
      if (python && python.level !== "beginner") console.log("   Inconsistency: python level was auto-inflated!");
      if (sql && sql.level !== "beginner") console.log("   Inconsistency: sql level was auto-inflated!");
    }
  },
  {
    id: 4,
    name: "TEST 4 — DISTANT KEYWORD LEAK",
    input: "Expert in leadership and team management. Worked on Java backend systems.",
    validate: (skills) => {
      console.log("Extracted:", skills);
      const java = skills.find(s => s.name === "java");
      
      // Note: 'leadership' and 'team management' are not in domains.json so they won't extract,
      // but 'java' is in domains.json and should be extracted as beginner or intermediate because
      // the 'expert' keyword is too far away.
      const javaPass = java && (java.level === "beginner" || java.level === "intermediate");
      
      const pass = javaPass;
      console.log(`-> Verdict: ${pass ? "PASS" : "FAIL"}`);
      if (java && java.level !== "beginner") {
        console.log(`   Inconsistency: java level was inflated to ${java.level}!`);
      }
    }
  },
  {
    id: 5,
    name: "TEST 5 — MIXED LEVELS",
    input: "Intermediate SQL developer with advanced Python and beginner Docker skills",
    validate: (skills) => {
      console.log("Extracted:", skills);
      const sql = skills.find(s => s.name === "sql");
      const python = skills.find(s => s.name === "python");
      const docker = skills.find(s => s.name === "docker");
      
      const sqlPass = sql && sql.level === "intermediate";
      const pythonPass = python && python.level === "advanced";
      const dockerPass = docker && docker.level === "beginner";
      
      const pass = sqlPass && pythonPass && dockerPass;
      console.log(`-> Verdict: ${pass ? "PASS" : "FAIL"}`);
    }
  },
  {
    id: 6,
    name: "TEST 6 — REPEATED SKILL",
    input: "Beginner React developer. Later worked as advanced React engineer.",
    validate: (skills) => {
      console.log("Extracted:", skills);
      const react = skills.find(s => s.name === "react");
      
      // Deduplication strategy: the highest level (advanced) should win.
      const pass = react && react.level === "advanced";
      console.log(`-> Verdict: ${pass ? "PASS" : "FAIL"}`);
      if (react) {
        console.log(`   Deduplication outcome: react level resolved to '${react.level}'`);
      }
    }
  },
  {
    id: 7,
    name: "TEST 7 — EDGE CASE",
    input: "Advanced communication. Python.",
    validate: (skills) => {
      console.log("Extracted:", skills);
      const comm = skills.find(s => s.name === "communication");
      const python = skills.find(s => s.name === "python");
      
      const commPass = comm && comm.level === "advanced";
      const pythonPass = python && python.level === "beginner";
      
      const pass = commPass && pythonPass;
      console.log(`-> Verdict: ${pass ? "PASS" : "FAIL"}`);
      if (python && python.level !== "beginner") {
        console.log("   Inconsistency: python level was falsely inflated to advanced!");
      }
    }
  }
];

const runAllTests = () => {
  console.log("==================================================");
  console.log("RUNNING REAL PIPELINE END-TO-END VALIDATION");
  console.log("==================================================\n");

  tests.forEach(t => {
    console.log(`--- ${t.name} ---`);
    console.log(`Input: "${t.input}"`);
    const result = runPipeline(t.input);
    t.validate(result);
    console.log("");
  });
};

runAllTests();
