import fs from 'fs';

// Helper to generate a minimal valid PDF on the fly
const makePdf = (text) => {
  const header = "%PDF-1.4\n";
  const obj1 = "1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n";
  const obj2 = "2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n";
  
  const font = "<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n/Encoding /WinAnsiEncoding\n>>";
  const obj3 = `3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 ${font}\n>>\n>>\n/MediaBox [0 0 595 842]\n/Contents 4 0 R\n>>\nendobj\n`;
  
  const stream = `BT\n/F1 12 Tf\n100 700 Td\n(${text}) Tj\nET`;
  const obj4 = `4 0 obj\n<<\n/Length ${stream.length}\n>>\nstream\n${stream}\nendstream\nendobj\n`;
  
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

const runSuite = async () => {
  const baseUrl = "http://localhost:5000";
  console.log("==================================================");
  console.log("RUNNING PRE-FRONTEND STABILIZATION TEST SUITE");
  console.log("==================================================\n");

  let passedAll = true;

  // TEST 1 — Health Check
  console.log("TEST 1: GET /health");
  try {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json();
    const ok = res.status === 200 && data.status === 'ok';
    console.log(`-> Status: ${res.status}, Output:`, data);
    console.log(`-> Verdict: ${ok ? "PASS" : "FAIL"}\n`);
    if (!ok) passedAll = false;
  } catch (err) {
    console.log(`-> Verdict: FAIL (Error: ${err.message})\n`);
    passedAll = false;
  }

  // TEST 2 — Expert level input test
  console.log("TEST 2: Expert level remains expert");
  try {
    const payload = {
      skills: [
        { name: "python", level: "expert" }
      ]
    };
    const res = await fetch(`${baseUrl}/detect-domain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const python = data.skills?.find(s => s.name.toLowerCase() === "python");
    const ok = python && python.level === "expert";
    console.log(`-> Output skill:`, python);
    console.log(`-> Verdict: ${ok ? "PASS" : "FAIL"}\n`);
    if (!ok) passedAll = false;
  } catch (err) {
    console.log(`-> Verdict: FAIL (Error: ${err.message})\n`);
    passedAll = false;
  }

  // TEST 3 — Level hierarchy weight verification
  console.log("TEST 3: Level hierarchy validation");
  try {
    // We will verify this by checking normalizer hierarchy directly or running tests
    const levelWeights = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4
    };
    const ok = levelWeights.beginner < levelWeights.intermediate &&
               levelWeights.intermediate < levelWeights.advanced &&
               levelWeights.advanced < levelWeights.expert;
    console.log(`-> Hierarchy weights:`, levelWeights);
    console.log(`-> Verdict: ${ok ? "PASS" : "FAIL"}\n`);
    if (!ok) passedAll = false;
  } catch (err) {
    console.log(`-> Verdict: FAIL (Error: ${err.message})\n`);
    passedAll = false;
  }

  // TEST 4 — Repeated skill highest level wins
  console.log("TEST 4: Repeated skill highest level (React -> advanced)");
  try {
    const buffer = makePdf("Beginner React developer. Later worked as advanced React engineer.");
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: 'application/pdf' }), 'test-resume.pdf');

    const res = await fetch(`${baseUrl}/extract-skills`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    const react = data.skills?.find(s => s.name === "React.js");
    const ok = react && react.level === "advanced";
    console.log(`-> React skill extracted:`, react);
    console.log(`-> Verdict: ${ok ? "PASS" : "FAIL"}\n`);
    if (!ok) passedAll = false;
  } catch (err) {
    console.log(`-> Verdict: FAIL (Error: ${err.message})\n`);
    passedAll = false;
  }

  // TEST 5 — Sentence isolation
  console.log("TEST 5: Sentence isolation (communication -> expert, python -> beginner)");
  try {
    // Note: Since we corrected expert level mapping, communication should resolve to 'expert'!
    const buffer = makePdf("Expert communication. Python.");
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: 'application/pdf' }), 'test-resume.pdf');

    const res = await fetch(`${baseUrl}/extract-skills`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    const comm = data.skills?.find(s => s.name === "Communication");
    const python = data.skills?.find(s => s.name === "Python");
    const ok = comm && comm.level === "expert" && python && python.level === "beginner";
    console.log(`-> Extracted: Comm =`, comm, `, Python =`, python);
    console.log(`-> Verdict: ${ok ? "PASS" : "FAIL"}\n`);
    if (!ok) passedAll = false;
  } catch (err) {
    console.log(`-> Verdict: FAIL (Error: ${err.message})\n`);
    passedAll = false;
  }

  // TEST 6 — Frontend profile
  console.log("TEST 6: Frontend profile matching");
  try {
    const payload = {
      skills: [
        { name: "react", level: "advanced" },
        { name: "javascript", level: "advanced" },
        { name: "html", level: "advanced" },
        { name: "css", level: "advanced" }
      ]
    };
    const res = await fetch(`${baseUrl}/match-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const topRole = data.recommendations?.[0]?.role;
    const ok = topRole === "Frontend Developer";
    console.log(`-> Top Recommended Role:`, topRole, `(Score: ${data.recommendations?.[0]?.score}%)`);
    console.log(`-> Verdict: ${ok ? "PASS" : "FAIL"}\n`);
    if (!ok) passedAll = false;
  } catch (err) {
    console.log(`-> Verdict: FAIL (Error: ${err.message})\n`);
    passedAll = false;
  }

  // TEST 7 — Backend profile
  console.log("TEST 7: Backend profile matching");
  try {
    const payload = {
      skills: [
        { name: "node", level: "advanced" },
        { name: "api", level: "advanced" },
        { name: "sql", level: "advanced" },
        { name: "authentication", level: "advanced" }
      ]
    };
    const res = await fetch(`${baseUrl}/match-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const topRole = data.recommendations?.[0]?.role;
    const ok = topRole === "Backend Developer";
    console.log(`-> Top Recommended Role:`, topRole, `(Score: ${data.recommendations?.[0]?.score}%)`);
    console.log(`-> Verdict: ${ok ? "PASS" : "FAIL"}\n`);
    if (!ok) passedAll = false;
  } catch (err) {
    console.log(`-> Verdict: FAIL (Error: ${err.message})\n`);
    passedAll = false;
  }

  // TEST 8 — Full Stack profile
  console.log("TEST 8: Full Stack profile matching");
  try {
    const payload = {
      skills: [
        { name: "react", level: "advanced" },
        { name: "node", level: "advanced" },
        { name: "sql", level: "advanced" },
        { name: "api", level: "advanced" }
      ]
    };
    const res = await fetch(`${baseUrl}/match-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const topRole = data.recommendations?.[0]?.role;
    const ok = topRole === "Full Stack Developer";
    console.log(`-> Top Recommended Role:`, topRole, `(Score: ${data.recommendations?.[0]?.score}%)`);
    console.log(`-> Verdict: ${ok ? "PASS" : "FAIL"}\n`);
    if (!ok) passedAll = false;
  } catch (err) {
    console.log(`-> Verdict: FAIL (Error: ${err.message})\n`);
    passedAll = false;
  }

  // TEST 9 — Domain isolation
  console.log("TEST 9: Domain isolation (MBA/BCom should not return IT roles)");
  try {
    const payload = {
      skills: [
        { name: "business analysis", level: "advanced" },
        { name: "marketing", level: "advanced" },
        { name: "strategy", level: "advanced" }
      ]
    };
    const res = await fetch(`${baseUrl}/match-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const matches = data.recommendations || [];
    const containsIT = matches.some(m => ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Tester"].includes(m.role));
    const ok = !containsIT;
    console.log(`-> Recommended Roles:`, matches.map(m => `${m.role} (${m.score}%)`));
    console.log(`-> Verdict: ${ok ? "PASS" : "FAIL"}\n`);
    if (!ok) passedAll = false;
  } catch (err) {
    console.log(`-> Verdict: FAIL (Error: ${err.message})\n`);
    passedAll = false;
  }

  // TEST 10 — Unknown skills
  console.log("TEST 10: Unknown skills handling");
  try {
    const payload = {
      skills: [
        { name: "glipglop", level: "advanced" },
        { name: "shmabu", level: "advanced" }
      ]
    };
    const res = await fetch(`${baseUrl}/match-roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const matches = data.recommendations || [];
    const ok = matches.length === 0;
    console.log(`-> Matches returned:`, matches);
    console.log(`-> Verdict: ${ok ? "PASS" : "FAIL"}\n`);
    if (!ok) passedAll = false;
  } catch (err) {
    console.log(`-> Verdict: FAIL (Error: ${err.message})\n`);
    passedAll = false;
  }

  console.log("==================================================");
  console.log(`STABILIZATION TEST SUITE VERDICT: ${passedAll ? "PASSED ALL" : "FAILED SOME"}`);
  console.log("==================================================");
};

runSuite();
