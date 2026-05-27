import { normalizeSkills } from './src/utils/skillNormalizer.js';

const runTests = () => {
  console.log("==================================================");
  console.log("RUNNING SKILL NORMALIZATION VALIDATION");
  console.log("==================================================\n");

  // TEST 1
  const input1 = [
    { name: "python", level: "expert" }
  ];
  const res1 = normalizeSkills(input1);
  console.log("Test 1 Input:", input1);
  console.log("Test 1 Result:", res1);
  const p1 = res1.find(s => s.name === "python");
  console.log(`-> Test 1 Verdict: ${p1 && p1.level === "expert" ? "PASS" : "FAIL"}`);
  console.log("");

  // TEST 2
  const input2 = [
    { name: "python", level: "advanced" },
    { name: "python", level: "expert" }
  ];
  const res2 = normalizeSkills(input2);
  console.log("Test 2 Input:", input2);
  console.log("Test 2 Result:", res2);
  const p2 = res2.find(s => s.name === "python");
  console.log(`-> Test 2 Verdict: ${p2 && p2.level === "expert" ? "PASS" : "FAIL"}`);
  console.log("");

  // TEST 3
  const input3 = [
    { name: "react", level: "intermediate" },
    { name: "react", level: "advanced" }
  ];
  const res3 = normalizeSkills(input3);
  console.log("Test 3 Input:", input3);
  console.log("Test 3 Result:", res3);
  const r3 = res3.find(s => s.name === "react");
  console.log(`-> Test 3 Verdict: ${r3 && r3.level === "advanced" ? "PASS" : "FAIL"}`);
  console.log("");
};

runTests();
