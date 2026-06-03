import { matchRoles } from '../src/services/role.service.js';
import * as mlService from '../src/services/ml.service.js';
import { config } from '../src/config/env.js';

const runIntegrationTests = async () => {
  console.log("=" * 60);
  console.log("RUNNING CAREERMAPPER BACKEND-ML INTEGRATION TESTS");
  console.log("=" * 60);

  let passed = 0;
  let total = 0;

  // Helper assertion
  const assert = (condition, message) => {
    total++;
    if (condition) {
      passed++;
      console.log(`  [PASS] ${message}`);
    } else {
      console.error(`  [FAIL] ${message}`);
    }
  };

  // 1. Python service online & health check
  try {
    console.log("\n[Test 1] Verifying Python ML API health...");
    const health = await mlService.predict("react developer"); // Trigger model loading check
    assert(health && health.success !== undefined, "ML Service responded to query");
  } catch (err) {
    console.error("  [FAIL] Health check failed:", err.message);
  }

  // 2. Empty Payload Handling
  try {
    console.log("\n[Test 2] Verifying empty payload protection...");
    const emptyResult = await mlService.predict("");
    assert(
      emptyResult.success === false && emptyResult.error === 'Empty or invalid profile text input',
      "Properly rejected empty string input"
    );
  } catch (err) {
    console.error("  [FAIL] Empty payload test failed:", err.message);
  }

  // 3. Low-Confidence Fallback Trigger
  try {
    console.log("\n[Test 3] Verifying low-confidence fallback trigger...");
    const lowConfResult = await mlService.predict("general coordinator technology programmer");
    assert(
      lowConfResult.success === true && lowConfResult.fallback === true && lowConfResult.message === 'Low confidence prediction',
      "Ambiguous technical profile successfully triggered the low-confidence gate"
    );
  } catch (err) {
    console.error("  [FAIL] Low-confidence fallback test failed:", err.message);
  }

  // 4. High-Fidelity Frontend Profile
  try {
    console.log("\n[Test 4] Verifying high-fidelity frontend profile routing...");
    const feSkills = [
      { name: "react", level: "advanced" },
      { name: "javascript", level: "advanced" },
      { name: "html", level: "advanced" },
      { name: "css", level: "intermediate" }
    ];
    const recommendations = await matchRoles(feSkills, "IT");
    assert(
      recommendations.length > 0 && recommendations[0].role === "Frontend Developer",
      "Frontend profile predicted Frontend Developer as top recommended career role"
    );
  } catch (err) {
    console.error("  [FAIL] Frontend profile test failed:", err.message);
  }

  // 5. High-Fidelity Backend Profile
  try {
    console.log("\n[Test 5] Verifying high-fidelity backend profile routing...");
    const beSkills = [
      { name: "python", level: "advanced" },
      { name: "node", level: "advanced" },
      { name: "sql", level: "advanced" },
      { name: "api", level: "intermediate" }
    ];
    const recommendations = await matchRoles(beSkills, "IT");
    assert(
      recommendations.length > 0 && recommendations[0].role === "Backend Developer",
      "Backend profile predicted Backend Developer as top recommended career role"
    );
  } catch (err) {
    console.error("  [FAIL] Backend profile test failed:", err.message);
  }

  // 6. Rule-Engine Filtering Behavior (Shielding Leakage)
  try {
    console.log("\n[Test 6] Verifying rule-engine constraints filtering...");
    // Profile with only frontend skills: Frontend Developer predicted
    // If ML makes an error and predicts "Backend Developer" or "Cybersecurity Analyst",
    // the backend MUST filter it out because rule score is 0 due to zero backend anchor skills.
    const pureFeSkills = [
      { name: "react", level: "advanced" },
      { name: "html", level: "advanced" },
      { name: "css", level: "advanced" }
    ];
    const recommendations = await matchRoles(pureFeSkills, "IT");
    
    // Check if Backend Developer or DevOps Engineer exists in recommendations
    const leakedRoles = recommendations.filter(r => r.role === "Backend Developer" || r.role === "DevOps Engineer");
    assert(
      leakedRoles.length === 0,
      "Strict rule constraints successfully shielded matching results against unauthorized ML predictions"
    );
  } catch (err) {
    console.error("  [FAIL] Rule constraint shield test failed:", err.message);
  }

  // 7. Offline Fallback Behavior
  try {
    console.log("\n[Test 7] Verifying ML service offline fallback protection...");
    // Temporarily point config to invalid URL
    const originalUrl = config.mlServiceUrl;
    config.mlServiceUrl = "http://127.0.0.1:9999"; // Invalid port
    
    const feSkills = [
      { name: "react", level: "advanced" },
      { name: "javascript", level: "advanced" }
    ];
    const recommendations = await matchRoles(feSkills, "IT");
    
    assert(
      recommendations.length > 0 && recommendations[0].role === "Frontend Developer",
      "Successfully recovered and fell back to base Rule Engine under simulated offline service"
    );
    
    // Restore config url
    config.mlServiceUrl = originalUrl;
  } catch (err) {
    console.error("  [FAIL] Offline fallback test failed:", err.message);
  }

  // 8. Timeout Protection Recovery
  try {
    console.log("\n[Test 8] Verifying request timeout protection recovery...");
    // Point config to non-responding endpoint IP (e.g. unreachable documentation IP 10.255.255.1)
    const originalUrl = config.mlServiceUrl;
    config.mlServiceUrl = "http://10.255.255.1:8000"; 
    
    const feSkills = [
      { name: "react", level: "advanced" },
      { name: "javascript", level: "advanced" }
    ];
    
    const t0 = Date.now();
    const recommendations = await matchRoles(feSkills, "IT");
    const duration = Date.now() - t0;
    
    assert(
      recommendations.length > 0 && duration < 1500, // Timeout should enforce < 1000ms recovery (+ overhead)
      `Recovered gracefully in ${duration}ms, successfully protected by the 1000ms axios timeout`
    );
    
    config.mlServiceUrl = originalUrl;
  } catch (err) {
    console.error("  [FAIL] Timeout protection test failed:", err.message);
  }

  console.log("\n" + "=" * 60);
  console.log(`AUDIT RESULTS: Passed ${passed}/${total} (${((passed/total)*100).toFixed(1)}%)`);
  console.log("=" * 60);
};

runIntegrationTests();
