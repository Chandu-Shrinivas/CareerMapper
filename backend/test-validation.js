import { matchRoles } from './src/services/role.service.js';
import { normalizeSkills } from './src/utils/skillNormalizer.js';
import { detectDomain } from './src/services/domain.service.js';

const runValidation = () => {
  console.log("==================================================");
  console.log("STARTING COMPREHENSIVE SYSTEM VALIDATION");
  console.log("==================================================\n");

  const suites = [
    {
      name: "1. Skill Normalization & Mapping",
      cases: [
        {
          input: [
            { name: "ReactJS", level: "advanced" },
            { name: "react.js", level: "beginner" },
            { name: "nodejs", level: "intermediate" },
            { name: "JS", level: "advanced" }
          ],
          verify: (res) => {
            console.log("Normalized Map:", res);
            const react = res.find(s => s.name === "react");
            const node = res.find(s => s.name === "node");
            const js = res.find(s => s.name === "javascript");
            const ok = react && react.level === "advanced" && node && node.level === "intermediate" && js && js.level === "advanced";
            console.log(`-> Deduplication and mapping check: ${ok ? "PASS" : "FAIL"}`);
          }
        }
      ]
    },
    {
      name: "2. Domain Detection Accuracy",
      cases: [
        {
          input: [
            { name: "react", level: "advanced" },
            { name: "node", level: "advanced" }
          ],
          verify: (res) => {
            const domain = detectDomain(res);
            console.log(`Input IT skills -> Detected: ${domain.domain} (${domain.confidence}%)`);
            console.log(`-> Should be IT: ${domain.domain === "IT" ? "PASS" : "FAIL"}`);
          }
        },
        {
          input: [
            { name: "solidworks", level: "advanced" },
            { name: "autocad", level: "intermediate" }
          ],
          verify: (res) => {
            const domain = detectDomain(res);
            console.log(`Input Mechanical skills -> Detected: ${domain.domain} (${domain.confidence}%)`);
            console.log(`-> Should be Mechanical: ${domain.domain === "Mechanical" ? "PASS" : "FAIL"}`);
          }
        },
        {
          input: [
            { name: "accounting", level: "advanced" },
            { name: "tally", level: "advanced" }
          ],
          verify: (res) => {
            const domain = detectDomain(res);
            console.log(`Input BCom skills -> Detected: ${domain.domain} (${domain.confidence}%)`);
            console.log(`-> Should be BCom: ${domain.domain === "BCom" ? "PASS" : "FAIL"}`);
          }
        },
        {
          input: [
            { name: "solidworks", level: "advanced" }, // Mechanical
            { name: "embedded c", level: "advanced" }, // ECE
            { name: "react", level: "intermediate" } // IT
          ],
          verify: (res) => {
            const domain = detectDomain(res);
            console.log(`Mixed equal skills -> Detected: ${domain.domain} (${domain.confidence}%)`);
          }
        }
      ]
    },
    {
      name: "3. Domain Isolation & Rule Capping",
      cases: [
        {
          name: "MBA profile should NOT return IT roles",
          input: [
            { name: "business analysis", level: "advanced" },
            { name: "strategy", level: "advanced" },
            { name: "marketing", level: "advanced" }
          ],
          verify: (res) => {
            const dom = detectDomain(res);
            const matches = matchRoles(res, dom.domain);
            console.log(`MBA Matches (domain=${dom.domain}):`, matches);
            const containsIT = matches.some(m => ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Tester"].includes(m.role));
            console.log(`-> Contains IT Roles? ${containsIT ? "FAIL" : "PASS (Isolated)"}`);
          }
        },
        {
          name: "BCom profile should NOT return IT roles",
          input: [
            { name: "accounting", level: "advanced" },
            { name: "auditing", level: "advanced" },
            { name: "gst", level: "advanced" }
          ],
          verify: (res) => {
            const dom = detectDomain(res);
            const matches = matchRoles(res, dom.domain);
            console.log(`BCom Matches (domain=${dom.domain}):`, matches);
            const containsIT = matches.some(m => ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Tester"].includes(m.role));
            console.log(`-> Contains IT Roles? ${containsIT ? "FAIL" : "PASS (Isolated)"}`);
          }
        }
      ]
    },
    {
      name: "4. Anchor Skill Logic & Leakage Protection",
      cases: [
        {
          name: "Tester role matches core anchors (testing/postman)",
          input: [
            { name: "testing", level: "advanced" },
            { name: "postman", level: "advanced" },
            { name: "api", level: "intermediate" }
          ],
          verify: (res) => {
            const dom = detectDomain(res);
            const matches = matchRoles(res, dom.domain);
            const tester = matches.find(m => m.role === "Software Tester");
            console.log(`Tester with core skills -> Score: ${tester ? tester.score : "Not Recommended"}`);
            console.log(`-> Tester recommended high? ${tester && tester.score >= 70 ? "PASS" : "FAIL"}`);
          }
        },
        {
          name: "Software Tester without core skills should be penalized/cut off",
          input: [
            { name: "python", level: "advanced" },
            { name: "sql", level: "advanced" },
            { name: "linux", level: "advanced" }
          ],
          verify: (res) => {
            const dom = detectDomain(res);
            const matches = matchRoles(res, dom.domain);
            const tester = matches.find(m => m.role === "Software Tester");
            console.log(`Tester without core skills -> Score: ${tester ? tester.score : "Not Recommended"}`);
            console.log(`-> Correctly penalized/omitted? ${!tester || tester.score < 40 ? "PASS" : "FAIL"}`);
          }
        },
        {
          name: "Frontend Developer without HTML/CSS/JS/React",
          input: [
            { name: "redux", level: "advanced" },
            { name: "tailwind", level: "advanced" },
            { name: "figma", level: "advanced" }
          ],
          verify: (res) => {
            const dom = detectDomain(res);
            const matches = matchRoles(res, dom.domain);
            const frontend = matches.find(m => m.role === "Frontend Developer");
            console.log(`Frontend without core anchors -> Score: ${frontend ? frontend.score : "Not Recommended"}`);
            console.log(`-> Correctly penalized/omitted? ${!frontend || frontend.score < 40 ? "PASS" : "FAIL"}`);
          }
        }
      ]
    },
    {
      name: "5. Edge Cases",
      cases: [
        {
          name: "Empty Payload",
          input: [],
          verify: (res) => {
            const dom = detectDomain(res);
            const matches = matchRoles(res, dom.domain);
            console.log(`Empty Input -> Domain: ${dom.domain}, Matches:`, matches);
            console.log(`-> Handled safely? ${dom.domain === "Unknown" && matches.length === 0 ? "PASS" : "FAIL"}`);
          }
        },
        {
          name: "Unknown Skills",
          input: [
            { name: "blockchain", level: "advanced" },
            { name: "quantum computing", level: "advanced" }
          ],
          verify: (res) => {
            const dom = detectDomain(res);
            const matches = matchRoles(res, dom.domain);
            console.log(`Unknown Input -> Domain: ${dom.domain}, Matches:`, matches);
            console.log(`-> Handled safely? ${dom.domain === "Unknown" && matches.length === 0 ? "PASS" : "FAIL"}`);
          }
        },
        {
          name: "Invalid Skill Levels",
          input: [
            { name: "react", level: "expert" }, // Expert is not in skillNormalizer hierarchy!
            { name: "javascript", level: "super-pro" }
          ],
          verify: (res) => {
            console.log("Invalid Levels Normalization:", res);
            const react = res.find(s => s.name === "react");
            const js = res.find(s => s.name === "javascript");
            console.log(`-> React level (expert): ${react ? react.level : "null"}`);
            console.log(`-> JS level (super-pro): ${js ? js.level : "null"}`);
          }
        }
      ]
    }
  ];

  suites.forEach(s => {
    console.log("--------------------------------------------------");
    console.log(`Suite: ${s.name}`);
    console.log("--------------------------------------------------");
    s.cases.forEach((c, idx) => {
      if (c.name) console.log(`\nCase: ${c.name}`);
      const normalized = normalizeSkills(c.input);
      c.verify(normalized);
    });
    console.log("\n");
  });
};

runValidation();
