import type { RoadmapDefinition } from '../types/roadmap';

export const DEVSECOPS_ROADMAP_DEFINITION: RoadmapDefinition = {
  "id": "devsecops",
  "slug": "devsecops",
  "title": "DevSecOps Expert",
  "version": "2026.1",
  "description": "Step by step guide to becoming a DevSecOps Expert in 2026: Application Security, SAST/DAST, Secret Management, Container Security, and Compliance.",
  "nodes": [
    {
      "id": "devsecops-main-header",
      "title": "DevSecOps Expert",
      "type": "main",
      "description": "Step by step guide to becoming a DevSecOps Expert in 2026: Application Security, SAST/DAST, Secret Management, Container Security, and Compliance.",
      "statusEnabled": false
    },
    {
      "id": "devsecops-topic-1",
      "title": "Security Fundamentals & Threat Modeling",
      "type": "topic",
      "description": "CIA triad, OWASP Top 10, threat modeling, and embedding security early into the SDLC.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "devsecops-subtopic-1-1",
      "title": "OWASP Top 10 Web Vulnerabilities",
      "type": "subtopic",
      "description": "Key subtopic concept: OWASP Top 10 Web Vulnerabilities",
      "parentId": "devsecops-topic-1",
      "parentTitle": "Security Fundamentals & Threat Modeling",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-1-2",
      "title": "STRIDE Threat Modeling",
      "type": "subtopic",
      "description": "Key subtopic concept: STRIDE Threat Modeling",
      "parentId": "devsecops-topic-1",
      "parentTitle": "Security Fundamentals & Threat Modeling",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-1-3",
      "title": "CIA Triad & Encryption Basics",
      "type": "subtopic",
      "description": "Key subtopic concept: CIA Triad & Encryption Basics",
      "parentId": "devsecops-topic-1",
      "parentTitle": "Security Fundamentals & Threat Modeling",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-1-4",
      "title": "Secure Coding Principles",
      "type": "subtopic",
      "description": "Key subtopic concept: Secure Coding Principles",
      "parentId": "devsecops-topic-1",
      "parentTitle": "Security Fundamentals & Threat Modeling",
      "statusEnabled": true
    },
    {
      "id": "devsecops-topic-2",
      "title": "Static & Dynamic Security Testing (SAST/DAST)",
      "type": "topic",
      "description": "Automating code scanning, vulnerability checks, and dynamic application penetration testing in CI/CD.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "devsecops-subtopic-2-1",
      "title": "SAST with SonarQube / Semgrep",
      "type": "subtopic",
      "description": "Key subtopic concept: SAST with SonarQube / Semgrep",
      "parentId": "devsecops-topic-2",
      "parentTitle": "Static & Dynamic Security Testing (SAST/DAST)",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-2-2",
      "title": "DAST with OWASP ZAP",
      "type": "subtopic",
      "description": "Key subtopic concept: DAST with OWASP ZAP",
      "parentId": "devsecops-topic-2",
      "parentTitle": "Static & Dynamic Security Testing (SAST/DAST)",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-2-3",
      "title": "Dependency Vulnerability Scanning (Snyk/Trivy)",
      "type": "subtopic",
      "description": "Key subtopic concept: Dependency Vulnerability Scanning (Snyk/Trivy)",
      "parentId": "devsecops-topic-2",
      "parentTitle": "Static & Dynamic Security Testing (SAST/DAST)",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-2-4",
      "title": "License Compliance Scanning",
      "type": "subtopic",
      "description": "Key subtopic concept: License Compliance Scanning",
      "parentId": "devsecops-topic-2",
      "parentTitle": "Static & Dynamic Security Testing (SAST/DAST)",
      "statusEnabled": true
    },
    {
      "id": "devsecops-topic-3",
      "title": "Secret Management & IAM Security",
      "type": "topic",
      "description": "Eliminating hardcoded credentials, managing secrets dynamically, and configuring strict IAM rules.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "devsecops-subtopic-3-1",
      "title": "HashiCorp Vault Secrets",
      "type": "subtopic",
      "description": "Key subtopic concept: HashiCorp Vault Secrets",
      "parentId": "devsecops-topic-3",
      "parentTitle": "Secret Management & IAM Security",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-3-2",
      "title": "AWS Secrets Manager",
      "type": "subtopic",
      "description": "Key subtopic concept: AWS Secrets Manager",
      "parentId": "devsecops-topic-3",
      "parentTitle": "Secret Management & IAM Security",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-3-3",
      "title": "Git Secret Leak Prevention (GitLeaks)",
      "type": "subtopic",
      "description": "Key subtopic concept: Git Secret Leak Prevention (GitLeaks)",
      "parentId": "devsecops-topic-3",
      "parentTitle": "Secret Management & IAM Security",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-3-4",
      "title": "Least Privilege IAM Policies",
      "type": "subtopic",
      "description": "Key subtopic concept: Least Privilege IAM Policies",
      "parentId": "devsecops-topic-3",
      "parentTitle": "Secret Management & IAM Security",
      "statusEnabled": true
    },
    {
      "id": "devsecops-topic-4",
      "title": "Container & Kubernetes Security",
      "type": "topic",
      "description": "Securing Docker images, container runtime inspection, and Kubernetes network policies.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "devsecops-subtopic-4-1",
      "title": "Trivy / Clair Image Scanning",
      "type": "subtopic",
      "description": "Key subtopic concept: Trivy / Clair Image Scanning",
      "parentId": "devsecops-topic-4",
      "parentTitle": "Container & Kubernetes Security",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-4-2",
      "title": "Distroless & Non-Root Containers",
      "type": "subtopic",
      "description": "Key subtopic concept: Distroless & Non-Root Containers",
      "parentId": "devsecops-topic-4",
      "parentTitle": "Container & Kubernetes Security",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-4-3",
      "title": "K8s NetworkPolicies & RBAC",
      "type": "subtopic",
      "description": "Key subtopic concept: K8s NetworkPolicies & RBAC",
      "parentId": "devsecops-topic-4",
      "parentTitle": "Container & Kubernetes Security",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-4-4",
      "title": "Runtime Security with Falco",
      "type": "subtopic",
      "description": "Key subtopic concept: Runtime Security with Falco",
      "parentId": "devsecops-topic-4",
      "parentTitle": "Container & Kubernetes Security",
      "statusEnabled": true
    },
    {
      "id": "devsecops-topic-5",
      "title": "Compliance & Infrastructure Auditing",
      "type": "topic",
      "description": "Automating cloud security posture management (CSPM), compliance checks, and audit trails.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "devsecops-subtopic-5-1",
      "title": "IaC Security Scanning (Checkov/Tfsec)",
      "type": "subtopic",
      "description": "Key subtopic concept: IaC Security Scanning (Checkov/Tfsec)",
      "parentId": "devsecops-topic-5",
      "parentTitle": "Compliance & Infrastructure Auditing",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-5-2",
      "title": "CIS Benchmarks Enforcement",
      "type": "subtopic",
      "description": "Key subtopic concept: CIS Benchmarks Enforcement",
      "parentId": "devsecops-topic-5",
      "parentTitle": "Compliance & Infrastructure Auditing",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-5-3",
      "title": "SOC2 / GDPR Compliance Auditing",
      "type": "subtopic",
      "description": "Key subtopic concept: SOC2 / GDPR Compliance Auditing",
      "parentId": "devsecops-topic-5",
      "parentTitle": "Compliance & Infrastructure Auditing",
      "statusEnabled": true
    },
    {
      "id": "devsecops-subtopic-5-4",
      "title": "SIEM Logging & Incident Response",
      "type": "subtopic",
      "description": "Key subtopic concept: SIEM Logging & Incident Response",
      "parentId": "devsecops-topic-5",
      "parentTitle": "Compliance & Infrastructure Auditing",
      "statusEnabled": true
    },
    {
      "id": "devsecops-nav-1",
      "title": "DevOps Engineer",
      "type": "navigation",
      "description": "Explore the DevOps Engineer roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/devops"
    }
  ],
  "badges": [],
  "relatedRoadmaps": []
};
