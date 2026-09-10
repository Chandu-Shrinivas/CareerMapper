import type { RoadmapDefinition } from '../types/roadmap';

export const FULLSTACK_ROADMAP_DEFINITION: RoadmapDefinition = {
  "id": "fullstack",
  "slug": "fullstack",
  "title": "Full Stack Developer",
  "version": "2026.1",
  "description": "Step by step guide to becoming a Full Stack Developer in 2026: Frontend, Backend, Databases, Cloud Deployment, and System Integration.",
  "nodes": [
    {
      "id": "fullstack-main-header",
      "title": "Full Stack Developer",
      "type": "main",
      "description": "Step by step guide to becoming a Full Stack Developer in 2026: Frontend, Backend, Databases, Cloud Deployment, and System Integration.",
      "statusEnabled": false
    },
    {
      "id": "fullstack-topic-1",
      "title": "Frontend Core (React & UI)",
      "type": "topic",
      "description": "Building interactive interfaces with React, TypeScript, Tailwind CSS, and state management.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "fullstack-subtopic-1-1",
      "title": "React Components & Hooks",
      "type": "subtopic",
      "description": "Key subtopic concept: React Components & Hooks",
      "parentId": "fullstack-topic-1",
      "parentTitle": "Frontend Core (React & UI)",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-1-2",
      "title": "TypeScript Type Safety",
      "type": "subtopic",
      "description": "Key subtopic concept: TypeScript Type Safety",
      "parentId": "fullstack-topic-1",
      "parentTitle": "Frontend Core (React & UI)",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-1-3",
      "title": "Tailwind CSS Styling",
      "type": "subtopic",
      "description": "Key subtopic concept: Tailwind CSS Styling",
      "parentId": "fullstack-topic-1",
      "parentTitle": "Frontend Core (React & UI)",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-1-4",
      "title": "State Management (Redux/Zustand)",
      "type": "subtopic",
      "description": "Key subtopic concept: State Management (Redux/Zustand)",
      "parentId": "fullstack-topic-1",
      "parentTitle": "Frontend Core (React & UI)",
      "statusEnabled": true
    },
    {
      "id": "fullstack-topic-2",
      "title": "Backend API & Server Architecture",
      "type": "topic",
      "description": "Building robust server endpoints, middleware, validation, and business logic layer.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "fullstack-subtopic-2-1",
      "title": "Node.js / Express Server",
      "type": "subtopic",
      "description": "Key subtopic concept: Node.js / Express Server",
      "parentId": "fullstack-topic-2",
      "parentTitle": "Backend API & Server Architecture",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-2-2",
      "title": "RESTful API Endpoints",
      "type": "subtopic",
      "description": "Key subtopic concept: RESTful API Endpoints",
      "parentId": "fullstack-topic-2",
      "parentTitle": "Backend API & Server Architecture",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-2-3",
      "title": "Middleware & Error Handling",
      "type": "subtopic",
      "description": "Key subtopic concept: Middleware & Error Handling",
      "parentId": "fullstack-topic-2",
      "parentTitle": "Backend API & Server Architecture",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-2-4",
      "title": "Data Validation (Zod/Joi)",
      "type": "subtopic",
      "description": "Key subtopic concept: Data Validation (Zod/Joi)",
      "parentId": "fullstack-topic-2",
      "parentTitle": "Backend API & Server Architecture",
      "statusEnabled": true
    },
    {
      "id": "fullstack-topic-3",
      "title": "Database Integration & ORMs",
      "type": "topic",
      "description": "Connecting backend applications to SQL and NoSQL databases using modern Object-Relational Mappers.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "fullstack-subtopic-3-1",
      "title": "Prisma ORM / Mongoose",
      "type": "subtopic",
      "description": "Key subtopic concept: Prisma ORM / Mongoose",
      "parentId": "fullstack-topic-3",
      "parentTitle": "Database Integration & ORMs",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-3-2",
      "title": "PostgreSQL Relational Storage",
      "type": "subtopic",
      "description": "Key subtopic concept: PostgreSQL Relational Storage",
      "parentId": "fullstack-topic-3",
      "parentTitle": "Database Integration & ORMs",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-3-3",
      "title": "MongoDB Document Storage",
      "type": "subtopic",
      "description": "Key subtopic concept: MongoDB Document Storage",
      "parentId": "fullstack-topic-3",
      "parentTitle": "Database Integration & ORMs",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-3-4",
      "title": "Database Migrations",
      "type": "subtopic",
      "description": "Key subtopic concept: Database Migrations",
      "parentId": "fullstack-topic-3",
      "parentTitle": "Database Integration & ORMs",
      "statusEnabled": true
    },
    {
      "id": "fullstack-topic-4",
      "title": "Full Stack Frameworks (Next.js)",
      "type": "topic",
      "description": "Server-side rendering (SSR), static site generation (SSG), API routes, and Server Components.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "fullstack-subtopic-4-1",
      "title": "Next.js App Router",
      "type": "subtopic",
      "description": "Key subtopic concept: Next.js App Router",
      "parentId": "fullstack-topic-4",
      "parentTitle": "Full Stack Frameworks (Next.js)",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-4-2",
      "title": "Server Components & Server Actions",
      "type": "subtopic",
      "description": "Key subtopic concept: Server Components & Server Actions",
      "parentId": "fullstack-topic-4",
      "parentTitle": "Full Stack Frameworks (Next.js)",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-4-3",
      "title": "SSR vs SSG Rendering",
      "type": "subtopic",
      "description": "Key subtopic concept: SSR vs SSG Rendering",
      "parentId": "fullstack-topic-4",
      "parentTitle": "Full Stack Frameworks (Next.js)",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-4-4",
      "title": "API Route Handlers",
      "type": "subtopic",
      "description": "Key subtopic concept: API Route Handlers",
      "parentId": "fullstack-topic-4",
      "parentTitle": "Full Stack Frameworks (Next.js)",
      "statusEnabled": true
    },
    {
      "id": "fullstack-topic-5",
      "title": "Deployment, Auth & Cloud",
      "type": "topic",
      "description": "Deploying full stack applications to Vercel/AWS, configuring authentication, and monitoring.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "fullstack-subtopic-5-1",
      "title": "Authentication (NextAuth/Clerk)",
      "type": "subtopic",
      "description": "Key subtopic concept: Authentication (NextAuth/Clerk)",
      "parentId": "fullstack-topic-5",
      "parentTitle": "Deployment, Auth & Cloud",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-5-2",
      "title": "Vercel & AWS Deployment",
      "type": "subtopic",
      "description": "Key subtopic concept: Vercel & AWS Deployment",
      "parentId": "fullstack-topic-5",
      "parentTitle": "Deployment, Auth & Cloud",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-5-3",
      "title": "Environment Variables & Security",
      "type": "subtopic",
      "description": "Key subtopic concept: Environment Variables & Security",
      "parentId": "fullstack-topic-5",
      "parentTitle": "Deployment, Auth & Cloud",
      "statusEnabled": true
    },
    {
      "id": "fullstack-subtopic-5-4",
      "title": "Serverless Functions",
      "type": "subtopic",
      "description": "Key subtopic concept: Serverless Functions",
      "parentId": "fullstack-topic-5",
      "parentTitle": "Deployment, Auth & Cloud",
      "statusEnabled": true
    },
    {
      "id": "fullstack-nav-1",
      "title": "Frontend Developer",
      "type": "navigation",
      "description": "Explore the Frontend Developer roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/frontend"
    },
    {
      "id": "fullstack-nav-2",
      "title": "Backend Developer",
      "type": "navigation",
      "description": "Explore the Backend Developer roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/backend"
    }
  ],
  "badges": [],
  "relatedRoadmaps": []
};
