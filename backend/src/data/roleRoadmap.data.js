export const ROLE_ROADMAPS_DATA = [
  {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Step by step guide to becoming a modern Frontend Developer in 2026.',
    category: 'Engineering',
    icon: 'Layout',
    nodes: [
      {
        id: 'web-fundamentals',
        title: 'Web Fundamentals & HTTP',
        description: 'Understand how the Internet works, DNS, HTTP/HTTPS requests, browser rendering engines, and client-server architecture.',
        whyItMatters: 'Foundational understanding of network requests and rendering pipeline essential for web app development.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 8,
        prerequisites: [],
        subtopics: ['How DNS Works', 'HTTP Verbs & Status Codes', 'DOM vs BOM', 'Browser Storage (Cookies, LocalStorage)'],
        resources: [
          { title: 'MDN: How the Web Works', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works', type: 'Doc' },
          { title: 'W3C Web Standards', url: 'https://www.w3.org/standards/', type: 'Guide' }
        ]
      },
      {
        id: 'html-css',
        title: 'HTML5 & CSS3 Essentials',
        description: 'Master semantic HTML markup, accessible forms, CSS Flexbox, CSS Grid, responsive design, and CSS variables.',
        whyItMatters: 'Core building blocks of structural content and adaptive user interface layouts.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 15,
        prerequisites: ['web-fundamentals'],
        subtopics: ['Semantic HTML5 Elements', 'Flexbox & CSS Grid', 'Media Queries & Responsive Breakpoints', 'CSS Specificity & Cascade'],
        resources: [
          { title: 'MDN HTML & CSS Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', type: 'Doc' },
          { title: 'CSS Tricks Complete Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'Article' }
        ]
      },
      {
        id: 'javascript',
        title: 'Modern JavaScript (ES6+)',
        description: 'Deep dive into JS syntax, closures, promises, async/await, ES modules, DOM manipulation, event loop, and fetch API.',
        whyItMatters: 'The universal programming language of web applications.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        prerequisites: ['html-css'],
        subtopics: ['Async/Await & Promises', 'Event Loop & Call Stack', 'ES Modules (Import/Export)', 'Array Methods & Destructuring'],
        resources: [
          { title: 'JavaScript.info Complete Guide', url: 'https://javascript.info/', type: 'Guide' },
          { title: 'MDN JavaScript Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', type: 'Doc' }
        ]
      },
      {
        id: 'git-github',
        title: 'Version Control (Git & GitHub)',
        description: 'Learn branching strategies, pull requests, rebase, merge conflicts, and GitHub collaboration workflows.',
        whyItMatters: 'Crucial for team collaboration, code versioning, and CI/CD pipelines.',
        category: 'TOOLS',
        difficulty: 'Beginner',
        estimatedHours: 6,
        prerequisites: ['javascript'],
        subtopics: ['Git Commit & Push', 'Branching & Merging', 'Resolving Merge Conflicts', 'Pull Requests & Code Reviews'],
        resources: [
          { title: 'Git Documentation', url: 'https://git-scm.com/doc', type: 'Doc' }
        ]
      },
      {
        id: 'react',
        title: 'React & Ecosystem',
        description: 'Component architecture, Hooks (useState, useEffect, useMemo), Context API, React Router, state management, and virtual DOM.',
        whyItMatters: 'Industry-standard UI library used by top global technology companies.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        prerequisites: ['javascript', 'git-github'],
        subtopics: ['JSX & Component Lifecycle', 'Custom Hooks', 'Context API & State Management', 'React Router v6'],
        resources: [
          { title: 'Official React Documentation', url: 'https://react.dev/', type: 'Doc' },
          { title: 'React Hooks Handbook', url: 'https://react.dev/reference/react', type: 'Guide' }
        ]
      },
      {
        id: 'typescript',
        title: 'TypeScript for Frontend',
        description: 'Static typing, interfaces, generics, type guards, utility types, and integrating TypeScript with React components.',
        whyItMatters: 'Drastically reduces runtime bugs and improves enterprise codebase scalability.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        prerequisites: ['react'],
        subtopics: ['Types vs Interfaces', 'Generics & Type Inference', 'React Props Typing', 'Strict Compiler Config'],
        resources: [
          { title: 'TypeScript Official Handbook', url: 'https://www.typescriptlang.org/docs/', type: 'Doc' }
        ]
      },
      {
        id: 'testing-performance',
        title: 'Testing & Performance Optimization',
        description: 'Unit testing with Jest & Vitest, component testing with React Testing Library, web vitals, bundle splitting, and lighthouse optimization.',
        whyItMatters: 'Ensures application resilience, high Core Web Vitals score, and fast page render speed.',
        category: 'ADVANCED',
        difficulty: 'Advanced',
        estimatedHours: 20,
        prerequisites: ['typescript'],
        subtopics: ['React Testing Library', 'Lighthouse Web Vitals', 'Lazy Loading & Code Splitting', 'Memoization'],
        resources: [
          { title: 'Testing Library Docs', url: 'https://testing-library.com/', type: 'Doc' },
          { title: 'Google Web Vitals', url: 'https://web.dev/vitals/', type: 'Article' }
        ]
      },
      {
        id: 'portfolio-projects',
        title: 'Real-world Portfolio Projects',
        description: 'Build enterprise-grade SPA web applications, deploy via Vercel/Netlify, integrate REST APIs, and optimize accessibility.',
        whyItMatters: 'Demonstrates practical engineering capability to recruiters and engineering managers.',
        category: 'PROJECTS',
        difficulty: 'Advanced',
        estimatedHours: 40,
        prerequisites: ['testing-performance'],
        subtopics: ['Full Stack Integration', 'Authentication & JWT', 'CI/CD Deployment', 'Accessibility (a11y) Audit'],
        resources: [
          { title: 'Frontend Mentor Projects', url: 'https://www.frontendmentor.io/', type: 'Project' }
        ]
      }
    ]
  },

  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    description: 'Master server-side architectures, REST & GraphQL APIs, databases, caching, microservices, and security.',
    category: 'Engineering',
    icon: 'Server',
    nodes: [
      {
        id: 'computer-science-basics',
        title: 'OS & Computer Networking Basics',
        description: 'Understand process management, threads, memory, TCP/IP vs UDP, HTTP protocols, and networking sockets.',
        whyItMatters: 'Foundation for understanding high-concurrency backend services and latency constraints.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 12,
        prerequisites: [],
        subtopics: ['TCP/IP Stack', 'Process vs Thread', 'Socket Programming', 'DNS & IP Routing'],
        resources: [
          { title: 'CS Primer Networking', url: 'https://csprimer.com/', type: 'Guide' }
        ]
      },
      {
        id: 'backend-language',
        title: 'Backend Programming (Node.js / Python / Go / Java)',
        description: 'Master a server-side language, standard libraries, asynchronous I/O loops, and file systems.',
        whyItMatters: 'Primary runtime engine for building business APIs and background workers.',
        category: 'FOUNDATION',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        prerequisites: ['computer-science-basics'],
        subtopics: ['Event Loop & Async I/O', 'Error Handling & Logging', 'Package Management', 'Streams & Buffers'],
        resources: [
          { title: 'Node.js Official Documentation', url: 'https://nodejs.org/en/docs/', type: 'Doc' }
        ]
      },
      {
        id: 'relational-databases',
        title: 'Relational Databases (PostgreSQL / MySQL)',
        description: 'SQL queries, joins, indexing strategies, transactions, ACID guarantees, and database normalization.',
        whyItMatters: 'The bedrock of transactional persistence and data integrity for backend applications.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 20,
        prerequisites: ['backend-language'],
        subtopics: ['B-Tree Indexing', 'ACID Properties', 'Complex Joins & Aggregations', 'ORMs vs Raw SQL'],
        resources: [
          { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', type: 'Guide' }
        ]
      },
      {
        id: 'nosql-databases',
        title: 'NoSQL Databases (MongoDB / Redis)',
        description: 'Document models, key-value stores, caching strategies, Redis pub/sub, data modeling for read vs write workloads.',
        whyItMatters: 'Optimizes high-throughput caching and unstructured document storage.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        prerequisites: ['relational-databases'],
        subtopics: ['MongoDB Aggregation Pipeline', 'Redis Cache-Aside Pattern', 'TTL & Eviction Policies', 'Sharding Basics'],
        resources: [
          { title: 'MongoDB University', url: 'https://learn.mongodb.com/', type: 'Guide' }
        ]
      },
      {
        id: 'rest-graphql-apis',
        title: 'API Design (RESTful & GraphQL)',
        description: 'REST architecture constraints, OpenAPI/Swagger specifications, GraphQL schemas, rate limiting, and status codes.',
        whyItMatters: 'Establishes clear, consistent interfaces for client consumers.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 18,
        prerequisites: ['nosql-databases'],
        subtopics: ['REST Naming Conventions', 'OpenAPI 3.0 Specs', 'GraphQL Queries & Mutations', 'Rate Limiting Middleware'],
        resources: [
          { title: 'RESTful API Design Best Practices', url: 'https://restfulapi.net/', type: 'Article' }
        ]
      },
      {
        id: 'backend-security',
        title: 'Authentication & Security',
        description: 'OAuth 2.0, JWT tokens, bcrypt password hashing, CORS, OWASP top 10 protection, and API gateways.',
        whyItMatters: 'Protects application data and user privacy from unauthorized access and cyber threats.',
        category: 'ADVANCED',
        difficulty: 'Advanced',
        estimatedHours: 15,
        prerequisites: ['rest-graphql-apis'],
        subtopics: ['JWT vs Session Cookies', 'OAuth 2.0 & OIDC', 'OWASP Vulnerabilities', 'SQL Injection Defense'],
        resources: [
          { title: 'OWASP Top 10 Security', url: 'https://owasp.org/www-project-top-ten/', type: 'Doc' }
        ]
      },
      {
        id: 'system-design',
        title: 'System Design & Distributed Systems',
        description: 'Load balancing, message queues (Kafka, RabbitMQ), microservices architecture, circuit breakers, and scalability principles.',
        whyItMatters: 'Essential for architecting systems that scale gracefully to millions of requests.',
        category: 'ADVANCED',
        difficulty: 'Advanced',
        estimatedHours: 35,
        prerequisites: ['backend-security'],
        subtopics: ['Consistent Hashing', 'Message Queues & Event Streaming', 'Database Sharding & Replication', 'Microservices vs Monolith'],
        resources: [
          { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'Guide' }
        ]
      }
    ]
  },

  {
    slug: 'full-stack-developer',
    title: 'Full Stack Developer',
    description: 'Comprehensive pathway to building end-to-end modern web applications from UI to database infrastructure.',
    category: 'Engineering',
    icon: 'Layers',
    nodes: [
      {
        id: 'web-foundations',
        title: 'HTML, CSS & Modern JavaScript',
        description: 'Web markup, responsive layouts, ES6+ JavaScript, promises, and browser DevTools.',
        whyItMatters: 'Required base skill set for client-side programming.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 20,
        prerequisites: [],
        subtopics: ['Semantic HTML', 'CSS Flexbox/Grid', 'JS Async/Await', 'Fetch API'],
        resources: [{ title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', type: 'Doc' }]
      },
      {
        id: 'frontend-framework',
        title: 'React / Next.js Framework',
        description: 'Component architecture, SSR/SSG rendering, routing, state management, and API route handlers.',
        whyItMatters: 'Powers fast, interactive frontend applications with server rendering capabilities.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        prerequisites: ['web-foundations'],
        subtopics: ['Next.js App Router', 'Server Components', 'Client State vs Server State', 'Tailwind CSS'],
        resources: [{ title: 'Next.js Documentation', url: 'https://nextjs.org/docs', type: 'Doc' }]
      },
      {
        id: 'backend-runtime',
        title: 'Node.js & Express / NestJS',
        description: 'Building HTTP servers, middleware pipelines, routing, authentication, and environment security.',
        whyItMatters: 'Core backend runtime for processing web requests and business logic.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        prerequisites: ['web-foundations'],
        subtopics: ['Express Routing & Middleware', 'Authentication JWT', 'File Uploads', 'Input Validation Zod'],
        resources: [{ title: 'Express.js Guide', url: 'https://expressjs.com/', type: 'Doc' }]
      },
      {
        id: 'fullstack-databases',
        title: 'SQL & NoSQL Database Integration',
        description: 'PostgreSQL, MongoDB, Prisma ORM, Mongoose schemas, data migrations, and connection pooling.',
        whyItMatters: 'Connects application logic to persistent data storage safely.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 20,
        prerequisites: ['backend-runtime'],
        subtopics: ['Prisma Schema & Migrations', 'Mongoose Models', 'Database Indexing', 'Transactions'],
        resources: [{ title: 'Prisma Docs', url: 'https://www.prisma.io/docs', type: 'Doc' }]
      },
      {
        id: 'deployment-devops',
        title: 'Deployment, Docker & Cloud Hosts',
        description: 'Docker containerization, Vercel/AWS deployment, CI/CD GitHub Actions, and environment variables.',
        whyItMatters: 'Enables continuous delivery of full-stack software to cloud environments.',
        category: 'ADVANCED',
        difficulty: 'Advanced',
        estimatedHours: 20,
        prerequisites: ['frontend-framework', 'fullstack-databases'],
        subtopics: ['Docker Compose', 'GitHub Actions Workflow', 'AWS EC2 / S3', 'Vercel Platform'],
        resources: [{ title: 'Docker Documentation', url: 'https://docs.docker.com/', type: 'Doc' }]
      }
    ]
  },

  {
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Learn Linux administration, Docker, Kubernetes, Infrastructure as Code, CI/CD pipelines, and cloud engineering.',
    category: 'Infrastructure',
    icon: 'Cloud',
    nodes: [
      {
        id: 'linux-bash',
        title: 'Linux Fundamentals & Shell Scripting',
        description: 'Command line mastery, file permissions, process monitoring, SSH keys, networking utilities, and Bash scripts.',
        whyItMatters: 'The universal operating system of cloud infrastructure and servers.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 15,
        prerequisites: [],
        subtopics: ['Linux CLI Commands', 'Bash Automation Scripts', 'Systemd Services', 'SSH & File Permissions'],
        resources: [{ title: 'Linux Journey', url: 'https://linuxjourney.com/', type: 'Guide' }]
      },
      {
        id: 'docker-containers',
        title: 'Docker & Containerization',
        description: 'Container concepts, Dockerfile optimization, multi-stage builds, Docker Compose networks, and registry management.',
        whyItMatters: 'Standardizes application execution across dev, test, and production environments.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 20,
        prerequisites: ['linux-bash'],
        subtopics: ['Dockerfile Directives', 'Multi-Stage Builds', 'Docker Compose', 'Container Security'],
        resources: [{ title: 'Docker Docs', url: 'https://docs.docker.com/', type: 'Doc' }]
      },
      {
        id: 'kubernetes',
        title: 'Kubernetes Container Orchestration',
        description: 'Pods, Deployments, Services, Ingress controllers, ConfigMaps, Secrets, Helm charts, and cluster management.',
        whyItMatters: 'Automates deployment, scaling, and operations of containerized applications.',
        category: 'CORE',
        difficulty: 'Advanced',
        estimatedHours: 35,
        prerequisites: ['docker-containers'],
        subtopics: ['K8s Architecture', 'Deployments & StatefulSets', 'Ingress Controllers', 'Helm Package Manager'],
        resources: [{ title: 'Kubernetes Official Docs', url: 'https://kubernetes.io/docs/', type: 'Doc' }]
      },
      {
        id: 'terraform-iac',
        title: 'Infrastructure as Code (Terraform)',
        description: 'Declarative cloud infrastructure provisioning using HashiCorp Terraform modules, state management, and AWS providers.',
        whyItMatters: 'Eliminates manual cloud configuration by codifying infrastructure.',
        category: 'ADVANCED',
        difficulty: 'Advanced',
        estimatedHours: 25,
        prerequisites: ['kubernetes'],
        subtopics: ['HCL Syntax', 'Terraform State Files', 'AWS Terraform Provider', 'Reusable Modules'],
        resources: [{ title: 'HashiCorp Terraform Learn', url: 'https://developer.hashicorp.com/terraform/tutorials', type: 'Guide' }]
      },
      {
        id: 'cicd-monitoring',
        title: 'CI/CD Pipelines & Monitoring (Prometheus/Grafana)',
        description: 'GitHub Actions, GitLab CI, Prometheus metrics collection, Grafana visualization dashboards, and alerting rules.',
        whyItMatters: 'Ensures continuous automated integration, testing, deployment, and site reliability.',
        category: 'ADVANCED',
        difficulty: 'Advanced',
        estimatedHours: 25,
        prerequisites: ['terraform-iac'],
        subtopics: ['GitHub Actions Workflows', 'Prometheus Metrics', 'Grafana Dashboards', 'Alertmanager'],
        resources: [{ title: 'Prometheus Docs', url: 'https://prometheus.io/docs/', type: 'Doc' }]
      }
    ]
  },

  {
    slug: 'ai-engineer',
    title: 'AI Engineer',
    description: 'Build production AI applications using LLMs, LangChain/LlamaIndex, RAG architectures, vector databases, and fine-tuning.',
    category: 'AI & Data',
    icon: 'Cpu',
    nodes: [
      {
        id: 'python-ai-foundations',
        title: 'Python for AI & Data Science',
        description: 'Python syntax, NumPy vector math, Pandas dataframes, HTTP requests, and virtual environments.',
        whyItMatters: 'The dominant programming language for modern artificial intelligence.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 20,
        prerequisites: [],
        subtopics: ['NumPy Arrays', 'Pandas Dataframes', 'Async Python & Asyncio', 'API Integration'],
        resources: [{ title: 'Python Docs', url: 'https://docs.python.org/3/', type: 'Doc' }]
      },
      {
        id: 'llm-prompt-engineering',
        title: 'LLM Foundations & Prompt Engineering',
        description: 'Understanding Transformer architectures, OpenAI/Gemini/Claude APIs, temperature, system prompts, and structured JSON output.',
        whyItMatters: 'Core techniques for harnessing state-of-the-art foundation models.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        prerequisites: ['python-ai-foundations'],
        subtopics: ['Prompt Design Techniques', 'System vs User Prompts', 'Structured JSON Output', 'Function Calling / Tools'],
        resources: [{ title: 'OpenAI Prompt Engineering Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering', type: 'Guide' }]
      },
      {
        id: 'vector-databases-rag',
        title: 'Vector Databases & Retrieval Augmented Generation (RAG)',
        description: 'Embeddings (OpenAI, Voyage), Pinecone / Qdrant / Chroma vector stores, chunking strategies, hybrid search, and RAG evaluation.',
        whyItMatters: 'Grounds AI models in custom domain knowledge, preventing hallucinations.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        prerequisites: ['llm-prompt-engineering'],
        subtopics: ['Embedding Models', 'Vector Search & Cosine Similarity', 'Document Chunking Strategies', 'RAG Triad Evaluation'],
        resources: [{ title: 'Pinecone Learning Center', url: 'https://www.pinecone.io/learn/', type: 'Guide' }]
      },
      {
        id: 'agentic-frameworks',
        title: 'AI Agent Frameworks (LangChain / AutoGen / CrewAI)',
        description: 'Autonomous agents, tool invocation, multi-agent orchestrations, memory systems, and human-in-the-loop workflows.',
        whyItMatters: 'Powers complex, multi-step autonomous AI workflows and task completion.',
        category: 'ADVANCED',
        difficulty: 'Advanced',
        estimatedHours: 30,
        prerequisites: ['vector-databases-rag'],
        subtopics: ['Agentic Loops & ReAct', 'Tool / API Binding', 'Agent Memory & History', 'Multi-Agent Collaboration'],
        resources: [{ title: 'LangChain Documentation', url: 'https://python.langchain.com/', type: 'Doc' }]
      },
      {
        id: 'ai-evals-deployment',
        title: 'AI Evaluation, Guardrails & Production Deployment',
        description: 'LLM evaluation benchmarks (Ragas, TruLens), Guardrails AI safety, token streaming, cost optimization, and deployment.',
        whyItMatters: 'Guarantees reliable, safe, fast, and cost-effective production deployment.',
        category: 'PROJECTS',
        difficulty: 'Advanced',
        estimatedHours: 25,
        prerequisites: ['agentic-frameworks'],
        subtopics: ['RAGAS Evaluation Framework', 'NeMo / Guardrails AI', 'Server-Sent Events Streaming', 'Model Cost & Rate Limit Management'],
        resources: [{ title: 'Ragas Evaluation Docs', url: 'https://docs.ragas.io/', type: 'Doc' }]
      }
    ]
  },

  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    description: 'Transform raw data into business insights using SQL, Excel, Python, PowerBI / Tableau, and statistical analysis.',
    category: 'AI & Data',
    icon: 'BarChart',
    nodes: [
      {
        id: 'excel-spreadsheets',
        title: 'Advanced Excel & Business Analytics',
        description: 'Pivot tables, VLOOKUP/XLOOKUP, logical functions, data cleaning, and executive dashboard formatting.',
        whyItMatters: 'Every business domain relies on spreadsheets for immediate decision-making data.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 12,
        prerequisites: [],
        subtopics: ['XLOOKUP & INDEX/MATCH', 'Pivot Tables & Charts', 'Data Validation', 'Conditional Formatting'],
        resources: [{ title: 'Microsoft Excel Training', url: 'https://support.microsoft.com/en-us/excel', type: 'Doc' }]
      },
      {
        id: 'sql-data-analytics',
        title: 'SQL Data Extraction & Analytics',
        description: 'SELECT queries, JOINs, GROUP BY aggregations, Window functions (ROW_NUMBER, LAG, LEAD), CTEs, and subqueries.',
        whyItMatters: 'Essential for querying relational data warehouses and transactional databases directly.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        prerequisites: ['excel-spreadsheets'],
        subtopics: ['Window Functions', 'CTEs & Subqueries', 'Aggregations & Grouping', 'Data Cleaning in SQL'],
        resources: [{ title: 'Mode Analytics SQL Tutorial', url: 'https://mode.com/sql-tutorial/', type: 'Guide' }]
      },
      {
        id: 'powerbi-tableau',
        title: 'Data Visualization (PowerBI / Tableau)',
        description: 'Building interactive visual dashboards, DAX expressions, data modeling, storytelling, and KPI metric tracking.',
        whyItMatters: 'Communicates complex analytical findings to non-technical stakeholders effectively.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 20,
        prerequisites: ['sql-data-analytics'],
        subtopics: ['Power BI DAX Formulas', 'Data Relations & Star Schema', 'Interactive Filters & Slicers', 'Executive Storytelling'],
        resources: [{ title: 'Power BI Learning', url: 'https://learn.microsoft.com/en-us/power-bi/', type: 'Guide' }]
      },
      {
        id: 'python-data-analysis',
        title: 'Python for Data Analysis (Pandas & Seaborn)',
        description: 'Pandas data cleaning, Matplotlib/Seaborn visualization, Exploratory Data Analysis (EDA), and Jupyter Notebooks.',
        whyItMatters: 'Enables advanced custom data processing beyond spreadsheet limitations.',
        category: 'ADVANCED',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        prerequisites: ['sql-data-analytics'],
        subtopics: ['Pandas Data Cleaning', 'Exploratory Data Analysis (EDA)', 'Statistical Visualizations', 'Handling Missing Values'],
        resources: [{ title: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/', type: 'Doc' }]
      }
    ]
  },

  {
    slug: 'data-scientist',
    title: 'AI / Data Scientist',
    description: 'Master statistics, machine learning algorithms, deep learning, feature engineering, and predictive modeling.',
    category: 'AI & Data',
    icon: 'Database',
    nodes: [
      {
        id: 'math-stats',
        title: 'Linear Algebra, Calculus & Probability',
        description: 'Matrix operations, partial derivatives, probability distributions, hypothesis testing, and Bayes theorem.',
        whyItMatters: 'Mathematical foundations of optimization and machine learning model algorithms.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 25,
        prerequisites: [],
        subtopics: ['Probability Distributions', 'Hypothesis Testing & p-values', 'Matrix Multiplication', 'Gradient Descent Math'],
        resources: [{ title: 'Khan Academy Statistics', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'Guide' }]
      },
      {
        id: 'machine-learning-scikit',
        title: 'Supervised & Unsupervised Machine Learning',
        description: 'Regression, Decision Trees, Random Forests, XGBoost, K-Means clustering, PCA, and Scikit-Learn pipelines.',
        whyItMatters: 'Core algorithms for predictive modeling, classification, and customer segmentation.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        prerequisites: ['math-stats'],
        subtopics: ['Linear & Logistic Regression', 'Tree Models & Ensembles', 'Cross-Validation & GridSearch', 'Dimensionality Reduction PCA'],
        resources: [{ title: 'Scikit-Learn User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', type: 'Doc' }]
      },
      {
        id: 'deep-learning-pytorch',
        title: 'Deep Learning & Neural Networks (PyTorch)',
        description: 'Neural network architectures, backpropagation, Convolutional Neural Networks (CNNs), Transformers, and PyTorch.',
        whyItMatters: 'Powers state-of-the-art computer vision, natural language processing, and generative AI.',
        category: 'ADVANCED',
        difficulty: 'Advanced',
        estimatedHours: 40,
        prerequisites: ['machine-learning-scikit'],
        subtopics: ['Tensors & Autograd', 'Custom PyTorch Modules', 'Optimization (Adam, SGD)', 'Overfitting & Dropout'],
        resources: [{ title: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', type: 'Doc' }]
      }
    ]
  },

  {
    slug: 'qa-engineer',
    title: 'QA Engineer / Automation Tester',
    description: 'Master manual testing methodologies, Selenium, Cypress, Playwright, API testing with Postman, and test automation frameworks.',
    category: 'Engineering',
    icon: 'CheckCircle',
    nodes: [
      {
        id: 'software-testing-fundamentals',
        title: 'Software Testing Fundamentals',
        description: 'SDLC/STLC phases, test cases writing, defect lifecycle, boundary value analysis, regression testing, and black-box testing.',
        whyItMatters: 'Essential foundation for quality assurance strategies.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 12,
        prerequisites: [],
        subtopics: ['Test Case Design', 'Defect Lifecycle', 'Boundary Value Analysis', 'Equivalence Partitioning'],
        resources: [{ title: 'ISTQB Foundation Guide', url: 'https://www.istqb.org/', type: 'Guide' }]
      },
      {
        id: 'api-testing-postman',
        title: 'API Testing & Postman Automation',
        description: 'REST API verification, HTTP status validation, Postman environment variables, test scripts, and Newman CLI.',
        whyItMatters: 'Validates backend contracts before UI integration.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        prerequisites: ['software-testing-fundamentals'],
        subtopics: ['Postman Collections', 'JavaScript Assertions', 'Newman Test Runner', 'Mock Servers'],
        resources: [{ title: 'Postman Learning Center', url: 'https://learning.postman.com/', type: 'Doc' }]
      },
      {
        id: 'cypress-playwright',
        title: 'UI Automation with Cypress & Playwright',
        description: 'End-to-end web testing, Page Object Model (POM), async wait handling, headless execution, and CI pipeline integration.',
        whyItMatters: 'Modern, fast UI automation frameworks widely adopted in enterprise software teams.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        prerequisites: ['api-testing-postman'],
        subtopics: ['Page Object Pattern', 'Fixtures & Intercepts', 'Parallel Execution', 'CI/CD Reporter Integration'],
        resources: [{ title: 'Playwright Official Docs', url: 'https://playwright.dev/', type: 'Doc' }]
      }
    ]
  },

  {
    slug: 'cyber-security-engineer',
    title: 'Cyber Security Engineer',
    description: 'Learn network security, ethical hacking fundamentals, cryptography, SIEM monitoring, and vulnerability assessment.',
    category: 'Security',
    icon: 'Shield',
    nodes: [
      {
        id: 'security-networking',
        title: 'Networking & Security Fundamentals',
        description: 'OSI model, TCP/IP, firewalls, VPNs, Wireshark packet analysis, DNS security, and SSL/TLS certificates.',
        whyItMatters: 'Understanding network architecture is essential for detecting security breaches.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 20,
        prerequisites: [],
        subtopics: ['Wireshark Packet Capture', 'Port Scanning Nmap', 'Firewall Rules', 'SSL/TLS Handshake'],
        resources: [{ title: 'Cybrary Free Security Courses', url: 'https://www.cybrary.it/', type: 'Guide' }]
      },
      {
        id: 'ethical-hacking-web-security',
        title: 'Ethical Hacking & Web Vulnerabilities',
        description: 'OWASP Top 10, Burp Suite, SQL injection, XSS, CSRF, penetration testing methodologies, and exploit analysis.',
        whyItMatters: 'Allows security engineers to simulate attacker strategies and patch vulnerabilities.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        prerequisites: ['security-networking'],
        subtopics: ['Burp Suite Proxy', 'Cross-Site Scripting (XSS)', 'SQL Injection', 'Penetration Testing Reports'],
        resources: [{ title: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security', type: 'Guide' }]
      }
    ]
  },

  {
    slug: 'android-developer',
    title: 'Android Developer',
    description: 'Build native Android apps using Kotlin, Jetpack Compose, Coroutines, Architecture Components, and Retrofit.',
    category: 'Mobile',
    icon: 'Smartphone',
    nodes: [
      {
        id: 'kotlin-fundamentals',
        title: 'Kotlin Programming Language',
        description: 'Kotlin syntax, null safety, lambdas, extension functions, data classes, and object-oriented paradigms.',
        whyItMatters: 'Official modern language endorsed by Google for Android development.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 20,
        prerequisites: [],
        subtopics: ['Null Safety & Elvis Operator', 'Coroutines & Flow', 'Data Classes', 'Extension Functions'],
        resources: [{ title: 'Kotlin Official Docs', url: 'https://kotlinlang.org/docs/home.html', type: 'Doc' }]
      },
      {
        id: 'jetpack-compose',
        title: 'UI Development with Jetpack Compose',
        description: 'Declarative Android UI, State management, Layouts, Modifiers, Material Design 3, and Navigation Compose.',
        whyItMatters: 'Google recommended modern toolkit for building native Android UI.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        prerequisites: ['kotlin-fundamentals'],
        subtopics: ['Composable Functions', 'Remember & State', 'NavHost & Routing', 'Material3 Theming'],
        resources: [{ title: 'Android Developers Compose Guide', url: 'https://developer.android.com/jetpack/compose', type: 'Doc' }]
      }
    ]
  },

  {
    slug: 'ios-developer',
    title: 'iOS Developer',
    description: 'Build native iOS apps using Swift, SwiftUI, Combine, URLSession, and CoreData.',
    category: 'Mobile',
    icon: 'Smartphone',
    nodes: [
      {
        id: 'swift-basics',
        title: 'Swift Programming Language',
        description: 'Swift syntax, optionals, protocols, structs vs classes, async/await, and error handling.',
        whyItMatters: 'Apple’s powerful, intuitive language for iOS app engineering.',
        category: 'FOUNDATION',
        difficulty: 'Beginner',
        estimatedHours: 20,
        prerequisites: [],
        subtopics: ['Optionals & Unwrapping', 'Protocols & Extensions', 'Async/Await Syntax', 'Structs vs Classes'],
        resources: [{ title: 'Apple Swift Documentation', url: 'https://developer.apple.com/swift/', type: 'Doc' }]
      },
      {
        id: 'swiftui',
        title: 'SwiftUI & App Architecture',
        description: 'Declarative iOS user interfaces, State/Binding/StateObject, NavigationStack, and REST API networking.',
        whyItMatters: 'Modern framework for building user interfaces across all Apple platforms.',
        category: 'CORE',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        prerequisites: ['swift-basics'],
        subtopics: ['VStack/HStack/ZStack', '@State & @Binding', 'NavigationStack', 'URLSession Async Requests'],
        resources: [{ title: 'Apple SwiftUI Tutorials', url: 'https://developer.apple.com/tutorials/swiftui', type: 'Guide' }]
      }
    ]
  }
];
