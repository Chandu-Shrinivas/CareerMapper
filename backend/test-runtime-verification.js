import fs from 'fs';

// Beautiful, standard-compliant PDF generator
const makePdf = (text) => {
  const header = "%PDF-1.4\n";
  const obj1 = "1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n";
  const obj2 = "2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n";
  
  const font = "<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n/Encoding /WinAnsiEncoding\n>>";
  const obj3 = `3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 ${font}\n>>\n>>\n/MediaBox [0 0 595 842]\n/Contents 4 0 R\n>>\nendobj\n`;
  
  const stream = `BT\n/F1 12 Tf\n100 700 Td\n(${text}) Tj\nET`;
  const obj4 = `4 0 obj\n<<\n/Length ${stream.length}\n>>\nstream\n${stream}\nendstream\nendobj\n`;
  
  // Calculate offsets dynamically
  const offset1 = header.length;
  const offset2 = offset1 + obj1.length;
  const offset3 = offset2 + obj2.length;
  const offset4 = offset3 + obj3.length;
  const offsetRef = offset4 + obj4.length;
  
  const pad = (num) => String(num).padStart(10, '0');
  
  const xref = `xref\n0 5\n0000000000 65535 f \n${pad(offset1)} 00000 n \n${pad(offset2)} 00000 n \n${pad(offset3)} 00000 n \n${pad(offset4)} 00000 n \n`;
  const trailer = `trailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n${offsetRef}\n%%EOF\n`;
  
  const pdfString = header + obj1 + obj2 + obj3 + obj4 + xref + trailer;
  return Buffer.from(pdfString, 'binary');
};

const runRuntimeVerification = async () => {
  console.log("==================================================");
  console.log("STARTING LIVE BACKEND RUNTIME VALIDATION (12 TESTS)");
  console.log("==================================================\n");

  const baseUrl = "http://localhost:5000";

  // Test 3: Role Matching API (POST /match-roles)
  console.log("--- TEST 3: ROLE MATCHING API ---");
  try {
    const payload3 = {
      skills: [
        { name: "react", level: "advanced" },
        { name: "javascript", level: "advanced" },
        { name: "html", level: "advanced" }
      ]
    };
    const response = await fetch(`${baseUrl}/match-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload3)
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    const frontendDev = data.recommendations?.find(r => r.role === "Frontend Developer");
    console.log(`-> Verdict: ${frontendDev && frontendDev.score >= 50 ? "PASS" : "FAIL"}`);
  } catch (err) {
    console.log("TEST 3 FAILED:", err.message);
  }
  console.log("\n");

  // Test 4: Backend Role Test
  console.log("--- TEST 4: BACKEND ROLE TEST ---");
  try {
    const payload4 = {
      skills: [
        { name: "node", level: "advanced" },
        { name: "sql", level: "advanced" },
        { name: "api", level: "advanced" }
      ]
    };
    const response = await fetch(`${baseUrl}/match-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload4)
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    const firstRole = data.recommendations?.[0]?.role;
    console.log(`-> First role is Backend Developer? ${firstRole === "Backend Developer" ? "PASS" : "FAIL"}`);
  } catch (err) {
    console.log("TEST 4 FAILED:", err.message);
  }
  console.log("\n");

  // Test 5: Full Stack Test
  console.log("--- TEST 5: FULL STACK TEST ---");
  try {
    const payload5 = {
      skills: [
        { name: "react", level: "intermediate" },
        { name: "node", level: "intermediate" },
        { name: "sql", level: "intermediate" }
      ]
    };
    const response = await fetch(`${baseUrl}/match-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload5)
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    const firstRole = data.recommendations?.[0]?.role;
    console.log(`-> First role is Full Stack Developer? ${firstRole === "Full Stack Developer" ? "PASS" : "FAIL"}`);
  } catch (err) {
    console.log("TEST 5 FAILED:", err.message);
  }
  console.log("\n");

  // Test 6: Empty Payload
  console.log("--- TEST 6: EMPTY PAYLOAD ---");
  try {
    const payload6 = {
      skills: []
    };
    const response = await fetch(`${baseUrl}/match-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload6)
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    const pass = data.recommendations && data.recommendations.length === 0;
    console.log(`-> Recommendations empty? ${pass ? "PASS" : "FAIL"}`);
  } catch (err) {
    console.log("TEST 6 FAILED:", err.message);
  }
  console.log("\n");

  // Test 7: Unknown Skills
  console.log("--- TEST 7: UNKNOWN SKILLS ---");
  try {
    const payload7 = {
      skills: [
        { name: "blockchain", level: "advanced" }
      ]
    };
    const response = await fetch(`${baseUrl}/match-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload7)
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    const pass = !data.recommendations || data.recommendations.length === 0;
    console.log(`-> Response empty/low scores? ${pass ? "PASS" : "FAIL"}`);
  } catch (err) {
    console.log("TEST 7 FAILED:", err.message);
  }
  console.log("\n");

  // Test 8: Resume Extraction API
  console.log("--- TEST 8: RESUME EXTRACTION API ---");
  try {
    const buffer = makePdf("Worked as react and node developer.");
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: 'application/pdf' }), 'test-resume.pdf');
    
    const response = await fetch(`${baseUrl}/extract-skills`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    const hasReact = data.skills?.some(s => s.name === "react");
    const hasNode = data.skills?.some(s => s.name === "node");
    const pass = hasReact && hasNode && data.domain === "IT";
    console.log(`-> Extraction and domain OK? ${pass ? "PASS" : "FAIL"}`);
  } catch (err) {
    console.log("TEST 8 FAILED:", err.message);
  }
  console.log("\n");

  // Test 9: Level Detection Validation
  console.log("--- TEST 9: LEVEL DETECTION VALIDATION ---");
  try {
    const buffer = makePdf("Advanced React developer with beginner Python");
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: 'application/pdf' }), 'test-resume.pdf');
    
    const response = await fetch(`${baseUrl}/extract-skills`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    const react = data.skills?.find(s => s.name === "react");
    const python = data.skills?.find(s => s.name === "python");
    const pass = react && react.level === "advanced" && python && python.level === "beginner";
    console.log(`-> Proximity separation OK? ${pass ? "PASS" : "FAIL"}`);
  } catch (err) {
    console.log("TEST 9 FAILED:", err.message);
  }
  console.log("\n");

  // Test 10: Repeated Skill Validation
  console.log("--- TEST 10: REPEATED SKILL VALIDATION ---");
  try {
    const buffer = makePdf("Beginner React developer. Later advanced React engineer.");
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: 'application/pdf' }), 'test-resume.pdf');
    
    const response = await fetch(`${baseUrl}/extract-skills`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    const react = data.skills?.find(s => s.name === "react");
    const pass = react && react.level === "advanced";
    console.log(`-> Highest level React retained? ${pass ? "PASS" : "FAIL"}`);
  } catch (err) {
    console.log("TEST 10 FAILED:", err.message);
  }
  console.log("\n");

  // Test 11: Domain Isolation
  console.log("--- TEST 11: DOMAIN ISOLATION ---");
  try {
    const payload11 = {
      skills: [
        { name: "marketing", level: "advanced" },
        { name: "branding", level: "advanced" }
      ]
    };
    const response = await fetch(`${baseUrl}/match-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload11)
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
    const containsIT = data.recommendations?.some(r => ["Frontend Developer", "Backend Developer", "Full Stack Developer"].includes(r.role));
    console.log(`-> Isolated correctly from IT? ${!containsIT ? "PASS" : "FAIL"}`);
  } catch (err) {
    console.log("TEST 11 FAILED:", err.message);
  }
  console.log("\n");
};

runRuntimeVerification();
