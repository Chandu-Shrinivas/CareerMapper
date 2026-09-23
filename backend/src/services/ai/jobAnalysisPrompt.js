export const JOB_ANALYSIS_PROMPT_VERSION = 'job-analysis-v1';
export const JOB_ROADMAP_SCHEMA_VERSION = 'job-roadmap-v1';

export const buildJobAnalysisPrompt = (jobTitle, company, description) => {
  return `
You are an expert technical talent assessor and engineering director.
Analyze the following Job Description in complete detail for role: "${jobTitle}" at company "${company}".

Your task:
1. Extract ALL explicit and implicit technical and non-technical requirements.
2. Distinguish explicit requirements (stated in text) from inferred requirements (concepts/tools strongly implied to perform the stated duties).
3. Classify requirement importance into: "critical", "required", "preferred", or "nice-to-have".
4. Identify roadmap preparation topics, prerequisite relationships, interview preparation areas, and project validation ideas.

JOB TITLE: ${jobTitle}
COMPANY: ${company}

JOB DESCRIPTION:
${description}

Respond STRICTLY in JSON matching the exact schema below. Do NOT wrap in markdown or extra text.

{
  "job": {
    "title": "${jobTitle}",
    "company": "${company}",
    "seniority": "Senior / Mid / Junior / Lead / Entry / Unspecified",
    "employmentType": "Full-time / Part-time / Contract / Unspecified",
    "location": "Location or Remote"
  },
  "requirements": [
    {
      "id": "req-1",
      "name": "Spring Boot",
      "canonicalSkillId": "spring-boot",
      "category": "REQUIRED",
      "importance": "critical",
      "evidence": "5+ years of experience with Spring Boot for microservices",
      "source": "job-description",
      "reason": ""
    },
    {
      "id": "req-2",
      "name": "REST API Security",
      "canonicalSkillId": "rest-api-security",
      "category": "REQUIRED",
      "importance": "required",
      "evidence": "Build secure REST API endpoints",
      "source": "inferred",
      "reason": "Required to securely implement and expose backend services stated in duties"
    }
  ],
  "skills": ["Java", "Spring Boot", "MySQL", "Docker", "Git"],
  "concepts": ["Dependency Injection", "REST Controllers", "ACID Transactions", "Multithreading"],
  "responsibilities": ["Develop scalable microservices", "Maintain database schemas"],
  "domainKnowledge": ["E-commerce payment flows", "Financial compliance"],
  "softSkills": ["Team Collaboration", "Problem Solving"],
  "experienceRequirements": ["5+ years backend engineering"],
  "educationRequirements": ["BS in Computer Science or equivalent"],
  "certifications": ["AWS Certified Developer"],
  "interviewAreas": [
    {
      "id": "int-1",
      "area": "Spring Boot & Core Java",
      "relatedRequirements": ["req-1"],
      "importance": "high"
    }
  ],
  "roadmapPlan": [
    {
      "id": "node-1",
      "title": "Java Core & Multithreading",
      "category": "Core Programming",
      "type": "technology",
      "importance": "critical",
      "canonicalSkillId": "java",
      "estimatedMinutes": 180,
      "whyRequired": "Job relies heavily on core Java backend performance",
      "jobEvidence": "Primary programming language listed in qualifications",
      "preparationGoal": "Master Java 17 features, collections, and concurrency primitives",
      "interviewRelevance": "high",
      "prerequisites": [],
      "completionMode": "all"
    },
    {
      "id": "node-2",
      "title": "Spring Boot Framework",
      "category": "Backend Framework",
      "type": "technology",
      "importance": "critical",
      "canonicalSkillId": "spring-boot",
      "estimatedMinutes": 240,
      "whyRequired": "Core framework for service development",
      "jobEvidence": "Develop REST services using Spring Boot",
      "preparationGoal": "Build REST controllers, configure dependency injection, handle exceptions",
      "interviewRelevance": "high",
      "prerequisites": ["node-1"],
      "completionMode": "all"
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "from": "node-1",
      "to": "node-2",
      "relationType": "prerequisite"
    }
  ]
}

Note for categories in requirements: Use one of REQUIRED, PREFERRED, NICE_TO_HAVE, RESPONSIBILITY, DOMAIN_KNOWLEDGE, SOFT_SKILL, EDUCATION, EXPERIENCE, CERTIFICATION.
Note for importance: Use one of "critical", "required", "preferred", "nice-to-have".
Note for source: Use "job-description" or "inferred". If inferred, provide a clear reason.
Note for edges relationType: Use "main-flow", "prerequisite", "child", "alternative", or "related".
`;
};
