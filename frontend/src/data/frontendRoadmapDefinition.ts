import type { RoadmapDefinition } from '../types/roadmap';

export const FRONTEND_ROADMAP_DEFINITION: RoadmapDefinition = {
  "id": "frontend",
  "slug": "frontend",
  "title": "Frontend Developer",
  "version": "2026.1",
  "description": "Step by step guide to becoming a modern Frontend Developer in 2026: HTML, CSS, JavaScript, React, TypeScript, Next.js, and Web Performance.",
  "nodes": [
    {
      "id": "frontend-main-header",
      "title": "Frontend Developer",
      "type": "main",
      "description": "Step by step guide to becoming a modern Frontend Developer in 2026: HTML, CSS, JavaScript, React, TypeScript, Next.js, and Web Performance.",
      "statusEnabled": false
    },
    {
      "id": "frontend-topic-1",
      "title": "Web Fundamentals & Internet",
      "type": "topic",
      "description": "How the web works, HTTP/HTTPS, DNS, browsers, and request/response cycle.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "frontend-subtopic-1-1",
      "title": "How DNS Works",
      "type": "subtopic",
      "description": "Key subtopic concept: How DNS Works",
      "parentId": "frontend-topic-1",
      "parentTitle": "Web Fundamentals & Internet",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-1-2",
      "title": "HTTP Verbs & Status Codes",
      "type": "subtopic",
      "description": "Key subtopic concept: HTTP Verbs & Status Codes",
      "parentId": "frontend-topic-1",
      "parentTitle": "Web Fundamentals & Internet",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-1-3",
      "title": "DOM & BOM Concepts",
      "type": "subtopic",
      "description": "Key subtopic concept: DOM & BOM Concepts",
      "parentId": "frontend-topic-1",
      "parentTitle": "Web Fundamentals & Internet",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-1-4",
      "title": "Browser Storage & Cookies",
      "type": "subtopic",
      "description": "Key subtopic concept: Browser Storage & Cookies",
      "parentId": "frontend-topic-1",
      "parentTitle": "Web Fundamentals & Internet",
      "statusEnabled": true
    },
    {
      "id": "frontend-topic-2",
      "title": "HTML5 & Semantic Markup",
      "type": "topic",
      "description": "Structuring web content with semantic HTML elements, forms, accessibility (a11y), and SEO metadata.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "frontend-subtopic-2-1",
      "title": "Semantic Elements (header, nav, main)",
      "type": "subtopic",
      "description": "Key subtopic concept: Semantic Elements (header, nav, main)",
      "parentId": "frontend-topic-2",
      "parentTitle": "HTML5 & Semantic Markup",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-2-2",
      "title": "HTML5 Form Validation",
      "type": "subtopic",
      "description": "Key subtopic concept: HTML5 Form Validation",
      "parentId": "frontend-topic-2",
      "parentTitle": "HTML5 & Semantic Markup",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-2-3",
      "title": "ARIA Roles & Accessibility",
      "type": "subtopic",
      "description": "Key subtopic concept: ARIA Roles & Accessibility",
      "parentId": "frontend-topic-2",
      "parentTitle": "HTML5 & Semantic Markup",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-2-4",
      "title": "SEO & Meta Tags",
      "type": "subtopic",
      "description": "Key subtopic concept: SEO & Meta Tags",
      "parentId": "frontend-topic-2",
      "parentTitle": "HTML5 & Semantic Markup",
      "statusEnabled": true
    },
    {
      "id": "frontend-topic-3",
      "title": "CSS3, Flexbox & Grid Layouts",
      "type": "topic",
      "description": "Styling interfaces using modern CSS3, responsive design, Flexbox, CSS Grid, and custom properties.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "frontend-subtopic-3-1",
      "title": "CSS Flexbox Deep Dive",
      "type": "subtopic",
      "description": "Key subtopic concept: CSS Flexbox Deep Dive",
      "parentId": "frontend-topic-3",
      "parentTitle": "CSS3, Flexbox & Grid Layouts",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-3-2",
      "title": "CSS Grid Layouts",
      "type": "subtopic",
      "description": "Key subtopic concept: CSS Grid Layouts",
      "parentId": "frontend-topic-3",
      "parentTitle": "CSS3, Flexbox & Grid Layouts",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-3-3",
      "title": "Media Queries & Responsive Breakpoints",
      "type": "subtopic",
      "description": "Key subtopic concept: Media Queries & Responsive Breakpoints",
      "parentId": "frontend-topic-3",
      "parentTitle": "CSS3, Flexbox & Grid Layouts",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-3-4",
      "title": "CSS Variables & Themes",
      "type": "subtopic",
      "description": "Key subtopic concept: CSS Variables & Themes",
      "parentId": "frontend-topic-3",
      "parentTitle": "CSS3, Flexbox & Grid Layouts",
      "statusEnabled": true
    },
    {
      "id": "frontend-topic-4",
      "title": "Modern JavaScript (ES6+)",
      "type": "topic",
      "description": "Core JavaScript syntax, DOM manipulation, asynchronous programming, modules, and ES6+ features.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "frontend-subtopic-4-1",
      "title": "Async/Await & Promises",
      "type": "subtopic",
      "description": "Key subtopic concept: Async/Await & Promises",
      "parentId": "frontend-topic-4",
      "parentTitle": "Modern JavaScript (ES6+)",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-4-2",
      "title": "Event Loop & Call Stack",
      "type": "subtopic",
      "description": "Key subtopic concept: Event Loop & Call Stack",
      "parentId": "frontend-topic-4",
      "parentTitle": "Modern JavaScript (ES6+)",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-4-3",
      "title": "ES Modules (import/export)",
      "type": "subtopic",
      "description": "Key subtopic concept: ES Modules (import/export)",
      "parentId": "frontend-topic-4",
      "parentTitle": "Modern JavaScript (ES6+)",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-4-4",
      "title": "Array Methods & Destructuring",
      "type": "subtopic",
      "description": "Key subtopic concept: Array Methods & Destructuring",
      "parentId": "frontend-topic-4",
      "parentTitle": "Modern JavaScript (ES6+)",
      "statusEnabled": true
    },
    {
      "id": "frontend-topic-5",
      "title": "Version Control (Git & GitHub)",
      "type": "topic",
      "description": "Managing code versions, branching strategies, pull requests, and collaborative Git workflows.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "frontend-subtopic-5-1",
      "title": "Git Branching & Merging",
      "type": "subtopic",
      "description": "Key subtopic concept: Git Branching & Merging",
      "parentId": "frontend-topic-5",
      "parentTitle": "Version Control (Git & GitHub)",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-5-2",
      "title": "Resolving Merge Conflicts",
      "type": "subtopic",
      "description": "Key subtopic concept: Resolving Merge Conflicts",
      "parentId": "frontend-topic-5",
      "parentTitle": "Version Control (Git & GitHub)",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-5-3",
      "title": "GitHub PRs & Code Review",
      "type": "subtopic",
      "description": "Key subtopic concept: GitHub PRs & Code Review",
      "parentId": "frontend-topic-5",
      "parentTitle": "Version Control (Git & GitHub)",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-5-4",
      "title": "Git Rebase vs Merge",
      "type": "subtopic",
      "description": "Key subtopic concept: Git Rebase vs Merge",
      "parentId": "frontend-topic-5",
      "parentTitle": "Version Control (Git & GitHub)",
      "statusEnabled": true
    },
    {
      "id": "frontend-topic-6",
      "title": "CSS Frameworks & Tailwind CSS",
      "type": "topic",
      "description": "Utility-first CSS frameworks for rapid UI development and design system consistency.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "frontend-subtopic-6-1",
      "title": "Tailwind CSS Utility Classes",
      "type": "subtopic",
      "description": "Key subtopic concept: Tailwind CSS Utility Classes",
      "parentId": "frontend-topic-6",
      "parentTitle": "CSS Frameworks & Tailwind CSS",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-6-2",
      "title": "Responsive Design Patterns",
      "type": "subtopic",
      "description": "Key subtopic concept: Responsive Design Patterns",
      "parentId": "frontend-topic-6",
      "parentTitle": "CSS Frameworks & Tailwind CSS",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-6-3",
      "title": "Shadcn UI & Component Primitives",
      "type": "subtopic",
      "description": "Key subtopic concept: Shadcn UI & Component Primitives",
      "parentId": "frontend-topic-6",
      "parentTitle": "CSS Frameworks & Tailwind CSS",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-6-4",
      "title": "CSS Modules & Styled Components",
      "type": "subtopic",
      "description": "Key subtopic concept: CSS Modules & Styled Components",
      "parentId": "frontend-topic-6",
      "parentTitle": "CSS Frameworks & Tailwind CSS",
      "statusEnabled": true
    },
    {
      "id": "frontend-topic-7",
      "title": "React & Component Architecture",
      "type": "topic",
      "description": "Building dynamic user interfaces with React components, JSX, state management, and virtual DOM.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "frontend-subtopic-7-1",
      "title": "JSX & Props",
      "type": "subtopic",
      "description": "Key subtopic concept: JSX & Props",
      "parentId": "frontend-topic-7",
      "parentTitle": "React & Component Architecture",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-7-2",
      "title": "React Hooks (useState, useEffect, useMemo)",
      "type": "subtopic",
      "description": "Key subtopic concept: React Hooks (useState, useEffect, useMemo)",
      "parentId": "frontend-topic-7",
      "parentTitle": "React & Component Architecture",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-7-3",
      "title": "Context API & State",
      "type": "subtopic",
      "description": "Key subtopic concept: Context API & State",
      "parentId": "frontend-topic-7",
      "parentTitle": "React & Component Architecture",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-7-4",
      "title": "React Router Navigation",
      "type": "subtopic",
      "description": "Key subtopic concept: React Router Navigation",
      "parentId": "frontend-topic-7",
      "parentTitle": "React & Component Architecture",
      "statusEnabled": true
    },
    {
      "id": "frontend-topic-8",
      "title": "TypeScript for Frontend",
      "type": "topic",
      "description": "Type-safe frontend development with interfaces, generics, type guards, and React prop typing.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "frontend-subtopic-8-1",
      "title": "Interfaces vs Type Aliases",
      "type": "subtopic",
      "description": "Key subtopic concept: Interfaces vs Type Aliases",
      "parentId": "frontend-topic-8",
      "parentTitle": "TypeScript for Frontend",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-8-2",
      "title": "Generics & Utility Types",
      "type": "subtopic",
      "description": "Key subtopic concept: Generics & Utility Types",
      "parentId": "frontend-topic-8",
      "parentTitle": "TypeScript for Frontend",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-8-3",
      "title": "Typing React Props & Events",
      "type": "subtopic",
      "description": "Key subtopic concept: Typing React Props & Events",
      "parentId": "frontend-topic-8",
      "parentTitle": "TypeScript for Frontend",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-8-4",
      "title": "Strict Compiler Settings",
      "type": "subtopic",
      "description": "Key subtopic concept: Strict Compiler Settings",
      "parentId": "frontend-topic-8",
      "parentTitle": "TypeScript for Frontend",
      "statusEnabled": true
    },
    {
      "id": "frontend-topic-9",
      "title": "Build Tools & Package Managers",
      "type": "topic",
      "description": "Modern JavaScript bundlers, module resolution, and package management.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "frontend-subtopic-9-1",
      "title": "Vite & Fast Refresh",
      "type": "subtopic",
      "description": "Key subtopic concept: Vite & Fast Refresh",
      "parentId": "frontend-topic-9",
      "parentTitle": "Build Tools & Package Managers",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-9-2",
      "title": "npm, yarn & pnpm",
      "type": "subtopic",
      "description": "Key subtopic concept: npm, yarn & pnpm",
      "parentId": "frontend-topic-9",
      "parentTitle": "Build Tools & Package Managers",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-9-3",
      "title": "Code Splitting & Dynamic Imports",
      "type": "subtopic",
      "description": "Key subtopic concept: Code Splitting & Dynamic Imports",
      "parentId": "frontend-topic-9",
      "parentTitle": "Build Tools & Package Managers",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-9-4",
      "title": "Environment Variables",
      "type": "subtopic",
      "description": "Key subtopic concept: Environment Variables",
      "parentId": "frontend-topic-9",
      "parentTitle": "Build Tools & Package Managers",
      "statusEnabled": true
    },
    {
      "id": "frontend-topic-10",
      "title": "Web Performance & Optimization",
      "type": "topic",
      "description": "Optimizing web vitals, image compression, lazy loading, caching, and Lighthouse scores.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "frontend-subtopic-10-1",
      "title": "Core Web Vitals (LCP, CLS, INP)",
      "type": "subtopic",
      "description": "Key subtopic concept: Core Web Vitals (LCP, CLS, INP)",
      "parentId": "frontend-topic-10",
      "parentTitle": "Web Performance & Optimization",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-10-2",
      "title": "Image Optimization & WebP",
      "type": "subtopic",
      "description": "Key subtopic concept: Image Optimization & WebP",
      "parentId": "frontend-topic-10",
      "parentTitle": "Web Performance & Optimization",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-10-3",
      "title": "Lazy Loading Components",
      "type": "subtopic",
      "description": "Key subtopic concept: Lazy Loading Components",
      "parentId": "frontend-topic-10",
      "parentTitle": "Web Performance & Optimization",
      "statusEnabled": true
    },
    {
      "id": "frontend-subtopic-10-4",
      "title": "Bundle Size Analysis",
      "type": "subtopic",
      "description": "Key subtopic concept: Bundle Size Analysis",
      "parentId": "frontend-topic-10",
      "parentTitle": "Web Performance & Optimization",
      "statusEnabled": true
    },
    {
      "id": "frontend-nav-1",
      "title": "Backend Developer",
      "type": "navigation",
      "description": "Explore the Backend Developer roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/backend"
    },
    {
      "id": "frontend-nav-2",
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
