import type { RoadmapDefinition } from '../types/roadmap';

export const BACKEND_ROADMAP_DEFINITION: RoadmapDefinition = {
  "id": "backend",
  "slug": "backend",
  "title": "Backend Developer",
  "version": "2026.1",
  "description": "Step by step guide to becoming a Backend Developer in 2026: Node.js, Python, Databases, REST APIs, GraphQL, Microservices, and Cloud Infrastructure.",
  "nodes": [
    {
      "id": "backend-main-header",
      "title": "Backend Developer",
      "type": "main",
      "description": "Step by step guide to becoming a Backend Developer in 2026: Node.js, Python, Databases, REST APIs, GraphQL, Microservices, and Cloud Infrastructure.",
      "statusEnabled": false
    },
    {
      "id": "backend-topic-1",
      "title": "Backend Language & Runtime",
      "type": "topic",
      "description": "Mastering backend programming with Node.js/TypeScript, Python, Java, or Go.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "backend-subtopic-1-1",
      "title": "Node.js & Event Loop",
      "type": "subtopic",
      "description": "Key subtopic concept: Node.js & Event Loop",
      "parentId": "backend-topic-1",
      "parentTitle": "Backend Language & Runtime",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-1-2",
      "title": "Async Programming & Event Emitters",
      "type": "subtopic",
      "description": "Key subtopic concept: Async Programming & Event Emitters",
      "parentId": "backend-topic-1",
      "parentTitle": "Backend Language & Runtime",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-1-3",
      "title": "Python FastAPI / Express.js",
      "type": "subtopic",
      "description": "Key subtopic concept: Python FastAPI / Express.js",
      "parentId": "backend-topic-1",
      "parentTitle": "Backend Language & Runtime",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-1-4",
      "title": "Type Safety & Validation",
      "type": "subtopic",
      "description": "Key subtopic concept: Type Safety & Validation",
      "parentId": "backend-topic-1",
      "parentTitle": "Backend Language & Runtime",
      "statusEnabled": true
    },
    {
      "id": "backend-topic-2",
      "title": "Relational Databases & SQL",
      "type": "topic",
      "description": "Designing relational database schemas, complex SQL queries, JOINs, indexing, and transactions.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "backend-subtopic-2-1",
      "title": "PostgreSQL & MySQL",
      "type": "subtopic",
      "description": "Key subtopic concept: PostgreSQL & MySQL",
      "parentId": "backend-topic-2",
      "parentTitle": "Relational Databases & SQL",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-2-2",
      "title": "Complex JOINs & Window Functions",
      "type": "subtopic",
      "description": "Key subtopic concept: Complex JOINs & Window Functions",
      "parentId": "backend-topic-2",
      "parentTitle": "Relational Databases & SQL",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-2-3",
      "title": "Database Indexing & Query Plans",
      "type": "subtopic",
      "description": "Key subtopic concept: Database Indexing & Query Plans",
      "parentId": "backend-topic-2",
      "parentTitle": "Relational Databases & SQL",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-2-4",
      "title": "ACID Compliance & Transactions",
      "type": "subtopic",
      "description": "Key subtopic concept: ACID Compliance & Transactions",
      "parentId": "backend-topic-2",
      "parentTitle": "Relational Databases & SQL",
      "statusEnabled": true
    },
    {
      "id": "backend-topic-3",
      "title": "NoSQL & Document Databases",
      "type": "topic",
      "description": "Working with non-relational document databases, key-value stores, and caching layers.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "backend-subtopic-3-1",
      "title": "MongoDB Data Modeling",
      "type": "subtopic",
      "description": "Key subtopic concept: MongoDB Data Modeling",
      "parentId": "backend-topic-3",
      "parentTitle": "NoSQL & Document Databases",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-3-2",
      "title": "Aggregation Pipelines",
      "type": "subtopic",
      "description": "Key subtopic concept: Aggregation Pipelines",
      "parentId": "backend-topic-3",
      "parentTitle": "NoSQL & Document Databases",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-3-3",
      "title": "Redis Caching & Key Expiration",
      "type": "subtopic",
      "description": "Key subtopic concept: Redis Caching & Key Expiration",
      "parentId": "backend-topic-3",
      "parentTitle": "NoSQL & Document Databases",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-3-4",
      "title": "Pub/Sub Messaging",
      "type": "subtopic",
      "description": "Key subtopic concept: Pub/Sub Messaging",
      "parentId": "backend-topic-3",
      "parentTitle": "NoSQL & Document Databases",
      "statusEnabled": true
    },
    {
      "id": "backend-topic-4",
      "title": "API Design & Architecture",
      "type": "topic",
      "description": "Designing scalable RESTful APIs, GraphQL endpoints, gRPC services, and WebSockets.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "backend-subtopic-4-1",
      "title": "RESTful API Best Practices",
      "type": "subtopic",
      "description": "Key subtopic concept: RESTful API Best Practices",
      "parentId": "backend-topic-4",
      "parentTitle": "API Design & Architecture",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-4-2",
      "title": "GraphQL Schemas & Resolvers",
      "type": "subtopic",
      "description": "Key subtopic concept: GraphQL Schemas & Resolvers",
      "parentId": "backend-topic-4",
      "parentTitle": "API Design & Architecture",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-4-3",
      "title": "WebSocket Real-time Communication",
      "type": "subtopic",
      "description": "Key subtopic concept: WebSocket Real-time Communication",
      "parentId": "backend-topic-4",
      "parentTitle": "API Design & Architecture",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-4-4",
      "title": "API Versioning & OpenAPI/Swagger",
      "type": "subtopic",
      "description": "Key subtopic concept: API Versioning & OpenAPI/Swagger",
      "parentId": "backend-topic-4",
      "parentTitle": "API Design & Architecture",
      "statusEnabled": true
    },
    {
      "id": "backend-topic-5",
      "title": "Authentication & Authorization",
      "type": "topic",
      "description": "Securing backend applications with JWT, OAuth2, Session management, and Role-Based Access Control (RBAC).",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "backend-subtopic-5-1",
      "title": "JWT Token Authentication",
      "type": "subtopic",
      "description": "Key subtopic concept: JWT Token Authentication",
      "parentId": "backend-topic-5",
      "parentTitle": "Authentication & Authorization",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-5-2",
      "title": "OAuth 2.0 & OpenID Connect",
      "type": "subtopic",
      "description": "Key subtopic concept: OAuth 2.0 & OpenID Connect",
      "parentId": "backend-topic-5",
      "parentTitle": "Authentication & Authorization",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-5-3",
      "title": "Password Hashing (bcrypt/Argon2)",
      "type": "subtopic",
      "description": "Key subtopic concept: Password Hashing (bcrypt/Argon2)",
      "parentId": "backend-topic-5",
      "parentTitle": "Authentication & Authorization",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-5-4",
      "title": "RBAC & Permission Middleware",
      "type": "subtopic",
      "description": "Key subtopic concept: RBAC & Permission Middleware",
      "parentId": "backend-topic-5",
      "parentTitle": "Authentication & Authorization",
      "statusEnabled": true
    },
    {
      "id": "backend-topic-6",
      "title": "System Design & Microservices",
      "type": "topic",
      "description": "Building distributed scalable architectures, message queues, and microservices patterns.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "backend-subtopic-6-1",
      "title": "Message Queues (Kafka / RabbitMQ)",
      "type": "subtopic",
      "description": "Key subtopic concept: Message Queues (Kafka / RabbitMQ)",
      "parentId": "backend-topic-6",
      "parentTitle": "System Design & Microservices",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-6-2",
      "title": "Load Balancing & Reverse Proxies",
      "type": "subtopic",
      "description": "Key subtopic concept: Load Balancing & Reverse Proxies",
      "parentId": "backend-topic-6",
      "parentTitle": "System Design & Microservices",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-6-3",
      "title": "Database Sharding & Replication",
      "type": "subtopic",
      "description": "Key subtopic concept: Database Sharding & Replication",
      "parentId": "backend-topic-6",
      "parentTitle": "System Design & Microservices",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-6-4",
      "title": "Microservices Communication",
      "type": "subtopic",
      "description": "Key subtopic concept: Microservices Communication",
      "parentId": "backend-topic-6",
      "parentTitle": "System Design & Microservices",
      "statusEnabled": true
    },
    {
      "id": "backend-topic-7",
      "title": "Testing, CI/CD & DevOps",
      "type": "topic",
      "description": "Automated testing, continuous integration pipelines, Docker containerization, and monitoring.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "backend-subtopic-7-1",
      "title": "Unit & Integration Testing (Jest/PyTest)",
      "type": "subtopic",
      "description": "Key subtopic concept: Unit & Integration Testing (Jest/PyTest)",
      "parentId": "backend-topic-7",
      "parentTitle": "Testing, CI/CD & DevOps",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-7-2",
      "title": "Docker & Containerization",
      "type": "subtopic",
      "description": "Key subtopic concept: Docker & Containerization",
      "parentId": "backend-topic-7",
      "parentTitle": "Testing, CI/CD & DevOps",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-7-3",
      "title": "GitHub Actions CI/CD Pipelines",
      "type": "subtopic",
      "description": "Key subtopic concept: GitHub Actions CI/CD Pipelines",
      "parentId": "backend-topic-7",
      "parentTitle": "Testing, CI/CD & DevOps",
      "statusEnabled": true
    },
    {
      "id": "backend-subtopic-7-4",
      "title": "Logging, Tracing & Prometheus Metrics",
      "type": "subtopic",
      "description": "Key subtopic concept: Logging, Tracing & Prometheus Metrics",
      "parentId": "backend-topic-7",
      "parentTitle": "Testing, CI/CD & DevOps",
      "statusEnabled": true
    },
    {
      "id": "backend-nav-1",
      "title": "DevOps Engineer",
      "type": "navigation",
      "description": "Explore the DevOps Engineer roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/devops"
    },
    {
      "id": "backend-nav-2",
      "title": "Full Stack Developer",
      "type": "navigation",
      "description": "Explore the Full Stack Developer roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/fullstack"
    }
  ],
  "badges": [],
  "relatedRoadmaps": []
};
