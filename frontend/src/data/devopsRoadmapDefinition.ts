import type { RoadmapDefinition } from '../types/roadmap';

export const DEVOPS_ROADMAP_DEFINITION: RoadmapDefinition = {
  "id": "devops",
  "slug": "devops",
  "title": "DevOps Engineer",
  "version": "2026.1",
  "description": "Step by step guide to becoming a DevOps Engineer in 2026: Linux, Networking, Docker, Kubernetes, CI/CD, Terraform, AWS, and Observability.",
  "nodes": [
    {
      "id": "devops-main-header",
      "title": "DevOps Engineer",
      "type": "main",
      "description": "Step by step guide to becoming a DevOps Engineer in 2026: Linux, Networking, Docker, Kubernetes, CI/CD, Terraform, AWS, and Observability.",
      "statusEnabled": false
    },
    {
      "id": "devops-topic-1",
      "title": "Linux Systems & Scripting",
      "type": "topic",
      "description": "Mastering Linux command-line, system administration, process management, and Shell/Bash scripting.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "devops-subtopic-1-1",
      "title": "Linux Shell & Bash Scripting",
      "type": "subtopic",
      "description": "Key subtopic concept: Linux Shell & Bash Scripting",
      "parentId": "devops-topic-1",
      "parentTitle": "Linux Systems & Scripting",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-1-2",
      "title": "User & File Permissions",
      "type": "subtopic",
      "description": "Key subtopic concept: User & File Permissions",
      "parentId": "devops-topic-1",
      "parentTitle": "Linux Systems & Scripting",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-1-3",
      "title": "Process & Service Management (systemd)",
      "type": "subtopic",
      "description": "Key subtopic concept: Process & Service Management (systemd)",
      "parentId": "devops-topic-1",
      "parentTitle": "Linux Systems & Scripting",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-1-4",
      "title": "SSH & Remote Administration",
      "type": "subtopic",
      "description": "Key subtopic concept: SSH & Remote Administration",
      "parentId": "devops-topic-1",
      "parentTitle": "Linux Systems & Scripting",
      "statusEnabled": true
    },
    {
      "id": "devops-topic-2",
      "title": "Networking & Security Fundamentals",
      "type": "topic",
      "description": "Understanding OSI model, TCP/IP, DNS, Firewalls, SSL/TLS certificates, and VPNs.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "devops-subtopic-2-1",
      "title": "TCP/IP, HTTP & Subnetting",
      "type": "subtopic",
      "description": "Key subtopic concept: TCP/IP, HTTP & Subnetting",
      "parentId": "devops-topic-2",
      "parentTitle": "Networking & Security Fundamentals",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-2-2",
      "title": "DNS Resolution & Record Types",
      "type": "subtopic",
      "description": "Key subtopic concept: DNS Resolution & Record Types",
      "parentId": "devops-topic-2",
      "parentTitle": "Networking & Security Fundamentals",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-2-3",
      "title": "SSL/TLS & Cert-Manager",
      "type": "subtopic",
      "description": "Key subtopic concept: SSL/TLS & Cert-Manager",
      "parentId": "devops-topic-2",
      "parentTitle": "Networking & Security Fundamentals",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-2-4",
      "title": "Firewalls, Security Groups & VPNs",
      "type": "subtopic",
      "description": "Key subtopic concept: Firewalls, Security Groups & VPNs",
      "parentId": "devops-topic-2",
      "parentTitle": "Networking & Security Fundamentals",
      "statusEnabled": true
    },
    {
      "id": "devops-topic-3",
      "title": "Containerization with Docker",
      "type": "topic",
      "description": "Packaging applications into isolated, deterministic Docker containers for reproducible builds.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "devops-subtopic-3-1",
      "title": "Dockerfile Writing Best Practices",
      "type": "subtopic",
      "description": "Key subtopic concept: Dockerfile Writing Best Practices",
      "parentId": "devops-topic-3",
      "parentTitle": "Containerization with Docker",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-3-2",
      "title": "Docker Compose Multi-Container",
      "type": "subtopic",
      "description": "Key subtopic concept: Docker Compose Multi-Container",
      "parentId": "devops-topic-3",
      "parentTitle": "Containerization with Docker",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-3-3",
      "title": "Image Optimization & Multi-Stage Builds",
      "type": "subtopic",
      "description": "Key subtopic concept: Image Optimization & Multi-Stage Builds",
      "parentId": "devops-topic-3",
      "parentTitle": "Containerization with Docker",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-3-4",
      "title": "Container Registries (ECR/DockerHub)",
      "type": "subtopic",
      "description": "Key subtopic concept: Container Registries (ECR/DockerHub)",
      "parentId": "devops-topic-3",
      "parentTitle": "Containerization with Docker",
      "statusEnabled": true
    },
    {
      "id": "devops-topic-4",
      "title": "Orchestration with Kubernetes",
      "type": "topic",
      "description": "Deploying, scaling, and managing containerized applications with Kubernetes clusters.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "devops-subtopic-4-1",
      "title": "K8s Pods, Deployments & Services",
      "type": "subtopic",
      "description": "Key subtopic concept: K8s Pods, Deployments & Services",
      "parentId": "devops-topic-4",
      "parentTitle": "Orchestration with Kubernetes",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-4-2",
      "title": "Ingress Controllers & Routes",
      "type": "subtopic",
      "description": "Key subtopic concept: Ingress Controllers & Routes",
      "parentId": "devops-topic-4",
      "parentTitle": "Orchestration with Kubernetes",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-4-3",
      "title": "ConfigMaps & Secrets",
      "type": "subtopic",
      "description": "Key subtopic concept: ConfigMaps & Secrets",
      "parentId": "devops-topic-4",
      "parentTitle": "Orchestration with Kubernetes",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-4-4",
      "title": "Helm Chart Package Management",
      "type": "subtopic",
      "description": "Key subtopic concept: Helm Chart Package Management",
      "parentId": "devops-topic-4",
      "parentTitle": "Orchestration with Kubernetes",
      "statusEnabled": true
    },
    {
      "id": "devops-topic-5",
      "title": "Infrastructure as Code (IaC)",
      "type": "topic",
      "description": "Provisioning and managing cloud infrastructure declaratively using Terraform and Ansible.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "devops-subtopic-5-1",
      "title": "Terraform Modules & State",
      "type": "subtopic",
      "description": "Key subtopic concept: Terraform Modules & State",
      "parentId": "devops-topic-5",
      "parentTitle": "Infrastructure as Code (IaC)",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-5-2",
      "title": "AWS/GCP Cloud Provisioning",
      "type": "subtopic",
      "description": "Key subtopic concept: AWS/GCP Cloud Provisioning",
      "parentId": "devops-topic-5",
      "parentTitle": "Infrastructure as Code (IaC)",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-5-3",
      "title": "Ansible Configuration Management",
      "type": "subtopic",
      "description": "Key subtopic concept: Ansible Configuration Management",
      "parentId": "devops-topic-5",
      "parentTitle": "Infrastructure as Code (IaC)",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-5-4",
      "title": "GitOps with ArgoCD",
      "type": "subtopic",
      "description": "Key subtopic concept: GitOps with ArgoCD",
      "parentId": "devops-topic-5",
      "parentTitle": "Infrastructure as Code (IaC)",
      "statusEnabled": true
    },
    {
      "id": "devops-topic-6",
      "title": "CI/CD & Observability",
      "type": "topic",
      "description": "Continuous integration pipelines, automated deployment, Prometheus metrics, and Grafana dashboards.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "devops-subtopic-6-1",
      "title": "GitHub Actions & GitLab CI Pipelines",
      "type": "subtopic",
      "description": "Key subtopic concept: GitHub Actions & GitLab CI Pipelines",
      "parentId": "devops-topic-6",
      "parentTitle": "CI/CD & Observability",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-6-2",
      "title": "Prometheus Metrics & Alerts",
      "type": "subtopic",
      "description": "Key subtopic concept: Prometheus Metrics & Alerts",
      "parentId": "devops-topic-6",
      "parentTitle": "CI/CD & Observability",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-6-3",
      "title": "Grafana Dashboard Monitoring",
      "type": "subtopic",
      "description": "Key subtopic concept: Grafana Dashboard Monitoring",
      "parentId": "devops-topic-6",
      "parentTitle": "CI/CD & Observability",
      "statusEnabled": true
    },
    {
      "id": "devops-subtopic-6-4",
      "title": "Distributed Tracing (Jaeger/OpenTelemetry)",
      "type": "subtopic",
      "description": "Key subtopic concept: Distributed Tracing (Jaeger/OpenTelemetry)",
      "parentId": "devops-topic-6",
      "parentTitle": "CI/CD & Observability",
      "statusEnabled": true
    },
    {
      "id": "devops-nav-1",
      "title": "DevSecOps Expert",
      "type": "navigation",
      "description": "Explore the DevSecOps Expert roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/devsecops"
    },
    {
      "id": "devops-nav-2",
      "title": "Cloud Architect",
      "type": "navigation",
      "description": "Explore the Cloud Architect roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/cloud"
    }
  ],
  "badges": [],
  "relatedRoadmaps": []
};
