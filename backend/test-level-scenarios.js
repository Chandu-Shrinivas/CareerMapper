import { detectLevel } from './src/utils/levelDetector.js';

const runTests = () => {
  console.log("==================================================");
  console.log("RUNNING SCENARIO TESTS FOR levelDetector.js");
  console.log("==================================================\n");

  // Test 1
  const text1 = "Expert communication skills and beginner python";
  console.log("Test 1 Input:", `"${text1}"`);
  console.log("-> communication level:", detectLevel(text1, "communication")); // Expected: advanced
  console.log("-> python level:", detectLevel(text1, "python")); // Expected: beginner
  console.log("");

  // Test 2
  const text2 = "Advanced React developer with intermediate Node.js";
  console.log("Test 2 Input:", `"${text2}"`);
  console.log("-> react level:", detectLevel(text2, "react")); // Expected: advanced
  console.log("-> node level:", detectLevel(text2, "node")); // Expected: intermediate
  console.log("");

  // Test 3
  const text3 = "Python developer";
  console.log("Test 3 Input:", `"${text3}"`);
  console.log("-> python level:", detectLevel(text3, "python")); // Expected: beginner/default (no false advanced)
  console.log("");
};

runTests();
