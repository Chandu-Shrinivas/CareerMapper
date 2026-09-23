export const ROLE_ROADMAPS_DATA = [
  {
    "slug": "frontend",
    "title": "Frontend Developer",
    "description": "Step-by-step guide to becoming a modern Frontend developer (HTML, CSS, JavaScript, React, etc.)",
    "category": "Engineering",
    "icon": "Layout",
    "nodeCount": 230,
    "nodes": [
      {
        "id": "web-fundamentals",
        "title": "Web Fundamentals & HTTP",
        "description": "Understand how the Internet works, DNS, HTTP/HTTPS requests, browser rendering engines, and client-server architecture.",
        "category": "FOUNDATION",
        "difficulty": "Beginner",
        "estimatedHours": 8,
        "prerequisites": [],
        "subtopics": [
          "How DNS Works",
          "HTTP Verbs & Status Codes",
          "DOM vs BOM",
          "Browser Storage (Cookies, LocalStorage)"
        ],
        "resources": [
          {
            "title": "MDN: How the Web Works",
            "url": "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "backend",
    "title": "Backend Developer",
    "description": "Step-by-step guide to becoming a modern Backend developer (Node.js, PostgreSQL, APIs, Caching, etc.)",
    "category": "Engineering",
    "icon": "Server",
    "nodeCount": 287,
    "nodes": [
      {
        "id": "backend-language",
        "title": "Backend Programming",
        "description": "Master server-side programming languages, Node.js runtime, event loops, and RESTful APIs.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 30,
        "prerequisites": [],
        "subtopics": [
          "Async I/O",
          "REST API Design",
          "Authentication JWT",
          "Caching Redis"
        ],
        "resources": [
          {
            "title": "Node.js Docs",
            "url": "https://nodejs.org/",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "fullstack",
    "title": "Full Stack Developer",
    "description": "Step-by-step guide to becoming a modern Full Stack developer (Frontend + Backend + DevOps fundamentals)",
    "category": "Engineering",
    "icon": "Layers",
    "nodeCount": 100,
    "nodes": [
      {
        "id": "fullstack-basics",
        "title": "Fullstack Applications",
        "description": "Building end-to-end web applications with modern frontend frameworks and API backends.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 40,
        "prerequisites": [],
        "subtopics": [
          "React / Next.js",
          "Node.js Express",
          "Database ORM",
          "Deployment"
        ],
        "resources": [
          {
            "title": "Full Stack Guide",
            "url": "https://roadmap.sh/full-stack",
            "type": "Guide"
          }
        ]
      }
    ]
  },
  {
    "slug": "devops",
    "title": "DevOps Roadmap",
    "description": "Step by step guide for DevOps, SRE or any other Operations Role in 2026",
    "category": "Infrastructure",
    "icon": "Cloud",
    "nodeCount": 233,
    "nodes": [
      {
        "id": "devops-linux",
        "title": "Linux & Cloud Infrastructure",
        "description": "Master Linux administration, Docker containers, Kubernetes, and CI/CD pipelines.",
        "category": "FOUNDATION",
        "difficulty": "Beginner",
        "estimatedHours": 25,
        "prerequisites": [],
        "subtopics": [
          "Linux CLI",
          "Docker",
          "Kubernetes",
          "Terraform"
        ],
        "resources": [
          {
            "title": "DevOps Guide",
            "url": "https://roadmap.sh/devops",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "android",
    "title": "Android Developer",
    "description": "Step by step guide to becoming an Android developer in 2026",
    "category": "Mobile",
    "icon": "Smartphone",
    "nodeCount": 196,
    "nodes": [
      {
        "id": "android-kotlin",
        "title": "Kotlin & Jetpack Compose",
        "description": "Build modern native Android applications using Kotlin and Jetpack Compose.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 30,
        "prerequisites": [],
        "subtopics": [
          "Kotlin Syntax",
          "Jetpack Compose",
          "Coroutines",
          "Retrofit"
        ],
        "resources": [
          {
            "title": "Android Docs",
            "url": "https://developer.android.com/",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "ai-engineer",
    "title": "AI Engineer",
    "description": "Step by step guide to becoming an AI Engineer in 2026",
    "category": "AI & Data",
    "icon": "Cpu",
    "nodeCount": 324,
    "nodes": [
      {
        "id": "ai-llm",
        "title": "LLMs, RAG & Vector Databases",
        "description": "Build production AI applications using foundation models, vector search, and agentic frameworks.",
        "category": "CORE",
        "difficulty": "Advanced",
        "estimatedHours": 35,
        "prerequisites": [],
        "subtopics": [
          "Prompt Engineering",
          "Embeddings",
          "Vector DBs (Qdrant/Pinecone)",
          "LangChain / LlamaIndex"
        ],
        "resources": [
          {
            "title": "AI Engineering Guide",
            "url": "https://roadmap.sh/ai-engineer",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "data-analyst",
    "title": "Data Analyst",
    "description": "Step by step guide to becoming a Data Analyst in 2026",
    "category": "AI & Data",
    "icon": "BarChart",
    "nodeCount": 203,
    "nodes": [
      {
        "id": "data-analyst-sql",
        "title": "SQL, Excel & Visualization",
        "description": "Query relational data, build dashboards in PowerBI/Tableau, and analyze business trends.",
        "category": "FOUNDATION",
        "difficulty": "Beginner",
        "estimatedHours": 20,
        "prerequisites": [],
        "subtopics": [
          "Advanced Excel",
          "SQL Window Functions",
          "PowerBI / Tableau",
          "Python Pandas"
        ],
        "resources": [
          {
            "title": "Data Analyst Guide",
            "url": "https://roadmap.sh/data-analyst",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "devsecops",
    "title": "DevSecOps",
    "description": "Step by step guide to becoming a DevSecOps Expert in 2026",
    "category": "Security",
    "icon": "Shield",
    "nodeCount": 165,
    "nodes": [
      {
        "id": "devsecops-core",
        "title": "Application & Container Security",
        "description": "Integrate SAST/DAST scanning, secret management, container hardening, and compliance into CI/CD.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 25,
        "prerequisites": [],
        "subtopics": [
          "OWASP Top 10",
          "SonarQube / Semgrep",
          "Trivy Image Scan",
          "HashiCorp Vault"
        ],
        "resources": [
          {
            "title": "DevSecOps Guide",
            "url": "https://roadmap.sh/devsecops",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "data-engineer",
    "title": "Data Engineer",
    "description": "Step by step guide to becoming a Data Engineer in 2026",
    "category": "AI & Data",
    "icon": "Database",
    "nodeCount": 26,
    "nodes": [
      {
        "id": "data-engineer-pipelines",
        "title": "ETL Pipelines & Data Warehousing",
        "description": "Build data pipelines using Spark, Airflow, Snowflake, and distributed data systems.",
        "category": "CORE",
        "difficulty": "Advanced",
        "estimatedHours": 35,
        "prerequisites": [],
        "subtopics": [
          "ETL / ELT",
          "Apache Spark",
          "Airflow Orchestration",
          "Snowflake / BigQuery"
        ],
        "resources": [
          {
            "title": "Data Engineer Guide",
            "url": "https://roadmap.sh/data-engineer",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "postgresql-dba",
    "title": "PostgreSQL DBA",
    "description": "Step by step guide to becoming a modern PostgreSQL DB Administrator in 2026",
    "category": "Infrastructure",
    "icon": "Database",
    "nodeCount": 269,
    "nodes": [
      {
        "id": "pg-dba-admin",
        "title": "PostgreSQL Administration & Tuning",
        "description": "Configure replication, connection pooling, VACUUM maintenance, query tuning, and backups.",
        "category": "ADVANCED",
        "difficulty": "Advanced",
        "estimatedHours": 30,
        "prerequisites": [],
        "subtopics": [
          "B-Tree Indexing",
          "WAL Logs",
          "PgBouncer",
          "Performance Tuning"
        ],
        "resources": [
          {
            "title": "PostgreSQL DBA Guide",
            "url": "https://roadmap.sh/postgresql-dba",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "machine-learning",
    "title": "Machine Learning",
    "description": "Step by step guide to becoming a Machine Learning Engineer in 2026",
    "category": "AI & Data",
    "icon": "Cpu",
    "nodeCount": 278,
    "nodes": [
      {
        "id": "ml-algorithms",
        "title": "Supervised & Deep Learning Algorithms",
        "description": "Feature engineering, Scikit-Learn models, XGBoost, PyTorch neural networks, and model deployment.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 35,
        "prerequisites": [],
        "subtopics": [
          "Regression & Classification",
          "Random Forests",
          "PyTorch Tensors",
          "Model Training"
        ],
        "resources": [
          {
            "title": "ML Guide",
            "url": "https://roadmap.sh/machine-learning",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "data-scientist",
    "title": "Data Scientist",
    "description": "Step by step guide to becoming a Data Scientist in 2026",
    "category": "AI & Data",
    "icon": "BarChart",
    "nodeCount": 153,
    "nodes": [
      {
        "id": "ds-stats",
        "title": "Statistics, EDA & Predictive Modeling",
        "description": "Probability distributions, A/B testing, statistical modeling, and Python data science packages.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 30,
        "prerequisites": [],
        "subtopics": [
          "Hypothesis Testing",
          "Statistical Modeling",
          "Python Seaborn",
          "Scikit-Learn"
        ],
        "resources": [
          {
            "title": "Data Scientist Guide",
            "url": "https://roadmap.sh/ai-data-scientist",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "blockchain",
    "title": "Blockchain Developer",
    "description": "Step by step guide to becoming a blockchain developer in 2026.",
    "category": "Engineering",
    "icon": "Layers",
    "nodeCount": 196,
    "nodes": [
      {
        "id": "blockchain-basics",
        "title": "Smart Contracts & Web3",
        "description": "Understand Ethereum, Solidity smart contracts, Web3.js / Ethers.js, and decentralized apps.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 30,
        "prerequisites": [],
        "subtopics": [
          "Solidity Syntax",
          "EVM Architecture",
          "ERC-20 & ERC-721 Tokens",
          "Smart Contract Audits"
        ],
        "resources": [
          {
            "title": "Blockchain Guide",
            "url": "https://roadmap.sh/blockchain",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "ios",
    "title": "iOS Developer",
    "description": "Step by step guide to becoming an iOS developer in 2026",
    "category": "Mobile",
    "icon": "Smartphone",
    "nodeCount": 326,
    "nodes": [
      {
        "id": "ios-swiftui",
        "title": "Swift & SwiftUI Development",
        "description": "Build native iOS apps using Swift, SwiftUI, Combine framework, and Xcode.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 30,
        "prerequisites": [],
        "subtopics": [
          "Swift Optionals",
          "SwiftUI Modifiers",
          "NavigationStack",
          "CoreData / SwiftData"
        ],
        "resources": [
          {
            "title": "iOS Developer Guide",
            "url": "https://roadmap.sh/ios",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "software-architect",
    "title": "Software Architect",
    "description": "Step by step guide to becoming a Software Architect in 2026",
    "category": "Engineering",
    "icon": "Layers",
    "nodeCount": 207,
    "nodes": [
      {
        "id": "architect-basics",
        "title": "Understand the Basics",
        "description": "Core concepts of software architecture, role of an architect, and architecture levels (Application, Solution, Enterprise).",
        "category": "FOUNDATION",
        "difficulty": "Beginner",
        "estimatedHours": 25,
        "prerequisites": [],
        "subtopics": [
          "What is Software Architecture",
          "Role of an Architect",
          "Application vs Solution vs Enterprise Architecture"
        ],
        "resources": [
          {
            "title": "Software Architect Guide",
            "url": "https://roadmap.sh/software-architect",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "qa",
    "title": "QA Engineer / Automation Tester",
    "description": "Steps to follow in order to become a modern QA Engineer in 2026",
    "category": "Engineering",
    "icon": "CheckCircle",
    "nodeCount": 237,
    "nodes": [
      {
        "id": "qa-fundamentals",
        "title": "QA Fundamentals & Testing Approaches",
        "description": "Quality Assurance principles, QA mindset, White Box, Gray Box, Black Box, Test Oracles, and Test Prioritization.",
        "category": "FOUNDATION",
        "difficulty": "Beginner",
        "estimatedHours": 20,
        "prerequisites": [],
        "subtopics": [
          "What is Quality Assurance",
          "QA Mindset",
          "White Box vs Black Box Testing",
          "Test Management Tools"
        ],
        "resources": [
          {
            "title": "QA Engineer Guide",
            "url": "https://roadmap.sh/qa",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "cyber-security",
    "title": "Cyber Security Expert",
    "description": "Step by step guide to becoming a Cyber Security Expert in 2026",
    "category": "Security",
    "icon": "Shield",
    "nodeCount": 302,
    "nodes": [
      {
        "id": "cyber-security-header",
        "title": "Cyber Security Expert",
        "description": "Step by step guide to becoming a Cyber Security Expert in 2026",
        "category": "FOUNDATION",
        "difficulty": "Beginner",
        "estimatedHours": 40,
        "prerequisites": [],
        "subtopics": [
          "Fundamental IT Skills",
          "Networking Knowledge",
          "Security Skills",
          "Cloud Security"
        ],
        "resources": [
          {
            "title": "Cyber Security Roadmap",
            "url": "https://roadmap.sh/cyber-security",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "api-design",
    "title": "API Design",
    "description": "Step by step guide to learn how to design and build robust APIs in 2026",
    "category": "Engineering",
    "icon": "Layers",
    "nodeCount": 98,
    "nodes": [
      {
        "id": "api-design-header",
        "title": "API Design",
        "description": "Step by step guide to learn how to design and build robust APIs in 2026",
        "category": "FOUNDATION",
        "difficulty": "Beginner",
        "estimatedHours": 25,
        "prerequisites": [],
        "subtopics": [
          "REST Principles",
          "URI Design",
          "Versioning Strategies",
          "Pagination",
          "API Security"
        ],
        "resources": [
          {
            "title": "API Design Roadmap",
            "url": "https://roadmap.sh/api-design",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "technical-writer",
    "title": "Technical Writer",
    "description": "Roadmap for anyone looking for a career in technical writing in 2026",
    "category": "Engineering",
    "icon": "Layers",
    "nodeCount": 65,
    "nodes": [
      {
        "id": "technical-writer-header",
        "title": "Technical Writer",
        "description": "Roadmap for anyone looking for a career in technical writing in 2026",
        "category": "FOUNDATION",
        "difficulty": "Beginner",
        "estimatedHours": 20,
        "prerequisites": [],
        "subtopics": [
          "Introduction",
          "Required Skills",
          "Tooling",
          "Best Practices",
          "Types of Technical Content"
        ],
        "resources": [
          {
            "title": "Technical Writer Roadmap",
            "url": "https://roadmap.sh/technical-writer",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "ux-design",
    "title": "UX Design",
    "description": "Step by step guide to becoming a UX Designer in 2026",
    "category": "Engineering",
    "icon": "Layout",
    "nodeCount": 94,
    "nodes": [
      {
        "id": "ux-design-header",
        "title": "UX Design",
        "description": "Step by step guide to becoming a UX Designer in 2026",
        "category": "FOUNDATION",
        "difficulty": "Beginner",
        "estimatedHours": 30,
        "prerequisites": [],
        "subtopics": [
          "Human Decision Making",
          "Behavior Change Strategies",
          "Understanding the Product",
          "Prototyping",
          "UX Best Practices"
        ],
        "resources": [
          {
            "title": "UX Design Roadmap",
            "url": "https://roadmap.sh/ux-design",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "game-developer",
    "title": "Game Developer",
    "description": "Step by step guide to becoming a Game Developer in 2026",
    "category": "Engineering",
    "icon": "Layers",
    "nodeCount": 110,
    "nodes": [
      {
        "id": "game-developer-header",
        "title": "Game Developer",
        "description": "Step by step guide to becoming a Game Developer in 2026",
        "category": "FOUNDATION",
        "difficulty": "Intermediate",
        "estimatedHours": 45,
        "prerequisites": [],
        "subtopics": [
          "Client Side Development",
          "Game Mathematics",
          "Game Physics",
          "Computer Graphics",
          "Game AI"
        ],
        "resources": [
          {
            "title": "Game Developer Roadmap",
            "url": "https://roadmap.sh/game-developer",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "product-manager",
    "title": "Product Manager",
    "description": "Everything you need to know to become a Product Manager in 2026",
    "category": "Management",
    "icon": "Layers",
    "nodeCount": 191,
    "nodes": [
      {
        "id": "Hk61DnFkfaeuxO2LSupMS",
        "title": "Idea Generation",
        "description": "Learn Idea Generation and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Mind Mapping",
          "Brainwriting",
          "SCAMPER",
          "Brainstorming Techniques",
          "Discovery",
          "Selection",
          "Validation",
          "Iterative Process",
          "Execution",
          "Blue Ocean Strategy",
          "TRIZ (Theory of Inventive Problem Solving)",
          "Problem Framing"
        ],
        "resources": [
          {
            "title": "Idea Generation Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "fmpJB_14CYn7PVuoGZdoz",
        "title": "Product Identification",
        "description": "Learn Product Identification and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Product Identification Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "Eusp5p6gNIxtU_yVvOkmu",
        "title": "Market Analysis",
        "description": "Learn Market Analysis and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Market Analysis Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "8LAy6uBfrdtrjF8ygAGoo",
        "title": "User Research",
        "description": "Learn User Research and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "User Research Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "YPqdrZguH0ArEFSe-VwKS",
        "title": "Positioning",
        "description": "Learn Positioning and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Identifying Market Needs",
          "Competitive Analysis",
          "Emerging Market Trends",
          "User Personas",
          "User Interviews",
          "Surveys and Questionnaires",
          "Ethnographic Research",
          "USP (Unique Selling Point)",
          "Defining & Communicating",
          "Market Segmentation",
          "Case Studies"
        ],
        "resources": [
          {
            "title": "Positioning Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "KnAlfSHDjLnQ7CMv5W-Ee",
        "title": "Market and User Research",
        "description": "Learn Market and User Research and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Market and User Research Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "WbrOaEjm9pVz9U0sq1Sw0",
        "title": "Product Strategy",
        "description": "Learn Product Strategy and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Product Strategy Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "l-KrmCOKEfpLHq4j-9SoY",
        "title": "Vision & Mission",
        "description": "Learn Vision & Mission and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Statement",
          "Proposition",
          "Capabilities",
          "Solved Constraints",
          "Future Constraints",
          "Reference Materials",
          "Narrative"
        ],
        "resources": [
          {
            "title": "Vision & Mission Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "n2AYdM2dlJfuZ97jXY49U",
        "title": "Defining Goals",
        "description": "Learn Defining Goals and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Target",
          "Baseline",
          "Trend",
          "Timeframe",
          "Goal Types"
        ],
        "resources": [
          {
            "title": "Defining Goals Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "6OjKcLbUZVJdUDC7if0Uy",
        "title": "Value Proposition",
        "description": "Learn Value Proposition and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Defining Value Proposition",
          "Value Proposition Canvas"
        ],
        "resources": [
          {
            "title": "Value Proposition Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "0AQj2F1n8VKHBwuF4ywrp",
        "title": "Value vs Features",
        "description": "Learn Value vs Features and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Finding Balance",
          "Feature Creep"
        ],
        "resources": [
          {
            "title": "Value vs Features Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "m46lX4dUHik_BSHQwaU2l",
        "title": "Strategic Thinking",
        "description": "Learn Strategic Thinking and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Competitive Strategy",
          "Five Forces Analysis",
          "Competetive Advantage",
          "Strategic Partners",
          "Identify Partners",
          "Managing Partnerships"
        ],
        "resources": [
          {
            "title": "Strategic Thinking Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "DoJCeL_vEXv3aVrLt7P_R",
        "title": "Product Planning",
        "description": "Learn Product Planning and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Product Planning Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "0tJ7zlgOIaioCMmVavfqz",
        "title": "Product Requirements",
        "description": "Learn Product Requirements and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Writing PRDs",
          "User Stories",
          "Job Stories"
        ],
        "resources": [
          {
            "title": "Product Requirements Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "gS3ofDrqDRKbecIskIyGi",
        "title": "Product Roadmap",
        "description": "Learn Product Roadmap and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Creating a Roadmap",
          "Prioritising Features",
          "Continuous Roadmapping",
          "Outcome-Based Roadmaps",
          "Communicating the Roadmap"
        ],
        "resources": [
          {
            "title": "Product Roadmap Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "lq5Hl1ZXBQRRI_4ywn7yA",
        "title": "Backlog Management",
        "description": "Learn Backlog Management and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Prioritization Techniques",
          "Grooming Sessions",
          "User Story Mapping"
        ],
        "resources": [
          {
            "title": "Backlog Management Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "74FApE4fYNihBkOfl3w3p",
        "title": "Product Design",
        "description": "Learn Product Design and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Product Design Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "-lFYy5W1YqWuTiM3QRF4k",
        "title": "UX / UI Design",
        "description": "Learn UX / UI Design and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Principles of UX Design",
          "Wireframing and Prototyping",
          "Design Thinking"
        ],
        "resources": [
          {
            "title": "UX / UI Design Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "lxU25qxxgxnNF3c3kdZxz",
        "title": "Service Design",
        "description": "Learn Service Design and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Service Design Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "S_-9msr3vGZgOQ36zErnf",
        "title": "Interaction Design",
        "description": "Learn Interaction Design and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Interaction Design Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "v3hKowLMBVq9eCXkUhrDZ",
        "title": "User Testing",
        "description": "Learn User Testing and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Usability Testing",
          "A/B Testing",
          "Remote User Testing"
        ],
        "resources": [
          {
            "title": "User Testing Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "hLy9kA3yEyDQ32XTq6I8b",
        "title": "Development and Launch",
        "description": "Learn Development and Launch and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Development and Launch Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "sAu4Gr1hg8S4jAV0bOSdY",
        "title": "Agile Methodology",
        "description": "Learn Agile Methodology and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Agile Methodology Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "2r-NPGcROFmw-pd4rvsAJ",
        "title": "Working with Engineering Teams",
        "description": "Learn Working with Engineering Teams and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Scrum Basics",
          "Kanban Basics",
          "Sprint Planning",
          "Daily Standups",
          "Retrospectives",
          "Minimum Viable Product (MVP)"
        ],
        "resources": [
          {
            "title": "Working with Engineering Teams Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "53XS2zKdK6IDdOP07yiT7",
        "title": "Go-to-Market Strategy",
        "description": "Learn Go-to-Market Strategy and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Launch Planning",
          "Marketing Strategies",
          "Growth Hacking"
        ],
        "resources": [
          {
            "title": "Go-to-Market Strategy Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "VqNK1rNAnr_yvi_a0YZEs",
        "title": "Release Strategies",
        "description": "Learn Release Strategies and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Feature Toggles",
          "Phased Rollouts",
          "Dark Launches"
        ],
        "resources": [
          {
            "title": "Release Strategies Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "h10DphS6mi7ZwbyHppPsb",
        "title": "Product Metrics",
        "description": "Learn Product Metrics and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Product Metrics Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "RfllpwFxWBeHF29oUwGo_",
        "title": "Key Product Metrics",
        "description": "Learn Key Product Metrics and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "DAU (Daily Active Users)",
          "MAU (Monthly Active Users)",
          "Conversion Rate",
          "Retention Rate",
          "Churn Rate",
          "LTV (Lifetime Value)",
          "CAC (Customer Acquisition Cost)",
          "North Star Metric"
        ],
        "resources": [
          {
            "title": "Key Product Metrics Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "eO7glnL0HixQYnoF3uvSW",
        "title": "Data-Driven Decision Making",
        "description": "Learn Data-Driven Decision Making and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "A/B Testing",
          "Cohort Analysis",
          "Predictive Analytics"
        ],
        "resources": [
          {
            "title": "Data-Driven Decision Making Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "kirIe5QsxruRUbWGfQtbD",
        "title": "Feedback Loops",
        "description": "Learn Feedback Loops and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Feedback Loops Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "q-D_wIIv24wQyX1wqYi2R",
        "title": "Stakeholder Management",
        "description": "Learn Stakeholder Management and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Stakeholder Management Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "5-4MXlRjH-4PlF2giZpVL",
        "title": "Communication Skills",
        "description": "Learn Communication Skills and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Interpersonal",
          "Business",
          "Communication Techniques",
          "Difficult Conversations",
          "Active Listening",
          "Conflict Resolution",
          "Alignment & Buy-In",
          "Showing Impact"
        ],
        "resources": [
          {
            "title": "Communication Skills Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "X-2mVBut_pn4o_fEGVrib",
        "title": "Managing Stakeholders",
        "description": "Learn Managing Stakeholders and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Identifying Stakeholders",
          "Stakeholder Mapping",
          "Stakeholder Engagement",
          "Remote Stakeholders"
        ],
        "resources": [
          {
            "title": "Managing Stakeholders Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "xbtAfWUo8V5JqW7f3103x",
        "title": "Product Management Tools",
        "description": "Learn Product Management Tools and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Product Management Tools Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "XG-QBb--HXL-1r-jInYDN",
        "title": "Roadmapping Tools",
        "description": "Learn Roadmapping Tools and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Roadmapping Tools Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "Yjxk2gUi5jQONeLzBaeJz",
        "title": "Project Management Tools",
        "description": "Learn Project Management Tools and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Project Management Tools Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "lJ_7-oYaFWST8aBd5lIgM",
        "title": "Analytics Tools",
        "description": "Learn Analytics Tools and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Analytics Tools Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "IAta7OX7pAxUzkFdHibY9",
        "title": "Communication Tools",
        "description": "Learn Communication Tools and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Product Board",
          "Aha",
          "Notion",
          "Jira",
          "Linear",
          "Trello",
          "Amplitude",
          "Heap",
          "Looker",
          "Slack",
          "Teams",
          "Discord"
        ],
        "resources": [
          {
            "title": "Communication Tools Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "5KH5gd8l8ZcXb3hrbXVGv",
        "title": "Risk Management",
        "description": "Learn Risk Management and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Risk Management Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "oO-ujKApmpoQdkPEkOQG7",
        "title": "Identifying Risks",
        "description": "Learn Identifying Risks and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Risk Identification Techniques",
          "Risk Register"
        ],
        "resources": [
          {
            "title": "Identifying Risks Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "0uRTNYMwTU9JzvIWSvDSm",
        "title": "Risk Assessment",
        "description": "Learn Risk Assessment and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Qualitative Risk Assessment",
          "Quantitative Risk Assessment"
        ],
        "resources": [
          {
            "title": "Risk Assessment Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "A-srndVB0olGq0qkApnwi",
        "title": "Risk Mitigation",
        "description": "Learn Risk Mitigation and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Mitigation Strategies",
          "Contingency Planning"
        ],
        "resources": [
          {
            "title": "Risk Mitigation Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "zJGg20NPStLPkeL5LKoGm",
        "title": "Monitoring and Controlling Risks",
        "description": "Learn Monitoring and Controlling Risks and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Risk Monitoring Tools",
          "Risk Audits"
        ],
        "resources": [
          {
            "title": "Monitoring and Controlling Risks Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "nrGUiI55jBUgegvRGGe7P",
        "title": "Advanced Topics",
        "description": "Learn Advanced Topics and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Advanced Topics Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "4i_kX9oZunMBFYevu7lyi",
        "title": "Scaling Products",
        "description": "Learn Scaling Products and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Growth Strategies",
          "Internationalization",
          "Platform Thinking"
        ],
        "resources": [
          {
            "title": "Scaling Products Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "BGtxI9CHtJfhRMdUEIfWa",
        "title": "Portfolio Management",
        "description": "Learn Portfolio Management and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Portfolio Management Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "9y_I41kJhkmyBJjiTw8Xd",
        "title": "Advanced Analysis",
        "description": "Learn Advanced Analysis and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Predictive Analytics",
          "ML in Product Mgmt.",
          "AI in Product Mgmt."
        ],
        "resources": [
          {
            "title": "Advanced Analysis Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "WyKJxhfnbz6jx-Tvg40_j",
        "title": "Leadership and Influence",
        "description": "Learn Leadership and Influence and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Building and Leading Teams",
          "Influencing without Authority",
          "Emotional Intelligence"
        ],
        "resources": [
          {
            "title": "Leadership and Influence Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "kYr7vgV-9US2x5HFYZGwq",
        "title": "Keep Learning",
        "description": "Learn Keep Learning and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Keep Learning Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "9vy4uIoykk2zSSyIok4_S",
        "title": "Introduction",
        "description": "Learn Introduction and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Related Roadmaps UX Design Roadmap Data Analyst Design System"
        ],
        "resources": [
          {
            "title": "Introduction Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "yHmHXymPNWwu8p1vvqD3o",
        "title": "Find the detailed version of this roadmap along with other similar roadmaps",
        "description": "Learn Find the detailed version of this roadmap along with other similar roadmaps and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "roadmap.sh"
        ],
        "resources": [
          {
            "title": "Find the detailed version of this roadmap along with other similar roadmaps Guide",
            "url": "https://roadmap.sh/product-manager",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "mlops",
    "title": "MLOps Roadmap",
    "description": "Step by step guide to learn MLOps in 2026",
    "category": "AI & Data",
    "icon": "Cpu",
    "nodeCount": 76,
    "nodes": [
      {
        "id": "_7uvOebQUI4xaSwtMjpEd",
        "title": "Programming Fundamentals",
        "description": "Learn Programming Fundamentals and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Programming Fundamentals Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "FbfHP9hFBuISrGzKaX-qm",
        "title": "Shout out to Maria Vechtomova who helped make this roadmap.",
        "description": "Learn Shout out to Maria Vechtomova who helped make this roadmap. and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "LinkedIn Profile",
          "Python",
          "Go",
          "Bash"
        ],
        "resources": [
          {
            "title": "Shout out to Maria Vechtomova who helped make this roadmap. Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "_NPGsGEjcLekjGisdDFWt",
        "title": "Version Control Systems",
        "description": "Learn Version Control Systems and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Git",
          "GitHub",
          "Related Roadmaps AI & Data Scientist DevOps Roadmap Backend Roadmap Machine Learning Roadmap Python Roadmap Shell/Bash Roadmap"
        ],
        "resources": [
          {
            "title": "Version Control Systems Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "ulka7VEVjz6ls5SnI6a6z",
        "title": "Machine Learning Fundamentals",
        "description": "Learn Machine Learning Fundamentals and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Machine Learning Fundamentals Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "VykbCu7LWIx8fQpqKzoA7",
        "title": "Data Engineering Fundamentals",
        "description": "Learn Data Engineering Fundamentals and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Data Pipelines",
          "Data Lakes & Warehouses",
          "Data Ingestion Architecture",
          "Airflow",
          "Spark",
          "Kafka",
          "Flink",
          "MLOps Principles",
          "MLOps Components",
          "Version Control",
          "CI/CD",
          "Orchestration",
          "Experiment Tracking",
          "Data Lineage",
          "Model Training & Serving",
          "Monitoring & Observability"
        ],
        "resources": [
          {
            "title": "Data Engineering Fundamentals Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "sf67bSL7HAx6iN7S6MYKs",
        "title": "Infrastructure as Code",
        "description": "Learn Infrastructure as Code and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Infrastructure as Code Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "yHmHXymPNWwu8p1vvqD3o",
        "title": "Find the detailed version of this roadmap along with other similar roadmaps",
        "description": "Learn Find the detailed version of this roadmap along with other similar roadmaps and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "roadmap.sh",
          "DevOps Roadmap"
        ],
        "resources": [
          {
            "title": "Find the detailed version of this roadmap along with other similar roadmaps Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "IghGpwAFVB067uOosmoDC",
        "title": "What is MLOps?",
        "description": "Learn What is MLOps? and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "SQL",
          "DVC",
          "Terraform",
          "Ansible",
          "KubeFlow"
        ],
        "resources": [
          {
            "title": "What is MLOps? Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "5VuCUCfb4DEi0HKW11PIX",
        "title": "Orchestration & Deployment",
        "description": "Learn Orchestration & Deployment and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Orchestration & Deployment Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "fR4Qr_ifoBLTpxdkJ50rB",
        "title": "Monitoring & Observability",
        "description": "Learn Monitoring & Observability and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Prometheus",
          "Grafana",
          "TensorFlow",
          "Scikit-learn",
          "PyTorch",
          "MLFlow"
        ],
        "resources": [
          {
            "title": "Monitoring & Observability Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "oUhlUoWQQ1txx_sepD5ev",
        "title": "CI/CD",
        "description": "Learn CI/CD and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Jenkins",
          "GItLab",
          "Deep Learning",
          "Machine Learning",
          "Maths & Statistics",
          "Model Evaluation"
        ],
        "resources": [
          {
            "title": "CI/CD Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "O5dely89N5UCMBeUfh8ud",
        "title": "Visit the following roadmaps to keep learning",
        "description": "Learn Visit the following roadmaps to keep learning and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Python",
          "DevOps",
          "Machine Learning"
        ],
        "resources": [
          {
            "title": "Visit the following roadmaps to keep learning Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "w8z91Hlqm0sPligYD3VCk",
        "title": "Edge AI",
        "description": "Learn Edge AI and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Jetson",
          "TFLite",
          "PyTorch Mobile"
        ],
        "resources": [
          {
            "title": "Edge AI Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "qy37ppIWDT_we-duuHwgT",
        "title": "Explainable AI",
        "description": "Learn Explainable AI and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "LIME",
          "SHAP",
          "GitHub Actions",
          "CML"
        ],
        "resources": [
          {
            "title": "Explainable AI Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "00GZcwe25QYi7rDzaOoMt",
        "title": "Cloud Computing",
        "description": "Learn Cloud Computing and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "AWS / Azure / GCP",
          "Cloud-native ML Services"
        ],
        "resources": [
          {
            "title": "Cloud Computing Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "tKeejLv8Q7QX40UtOjpav",
        "title": "Containerization",
        "description": "Learn Containerization and core principles.",
        "category": "AI & DATA",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Docker",
          "Kubernetes",
          "Tools",
          "Tools"
        ],
        "resources": [
          {
            "title": "Containerization Guide",
            "url": "https://roadmap.sh/mlops",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "system-design",
    "title": "System Design Roadmap",
    "description": "Everything you need to know about designing large-scale systems in 2026",
    "category": "Engineering",
    "icon": "Layers",
    "nodeCount": 170,
    "nodes": [
      {
        "id": "_hYN0gEi9BL24nptEtXWU",
        "title": "Introduction",
        "description": "Learn Introduction and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "What is System Design?",
          "How to approach System Design?"
        ],
        "resources": [
          {
            "title": "Introduction Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "e_15lymUjFc6VWqzPnKxG",
        "title": "Performance vs Scalability",
        "description": "Learn Performance vs Scalability and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Performance vs Scalability Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "O3wAHLnzrkvLWr4afHDdr",
        "title": "Latency vs Throughput",
        "description": "Learn Latency vs Throughput and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Latency vs Throughput Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "uJc27BNAuP321HQNbjftn",
        "title": "Availability vs Consistency",
        "description": "Learn Availability vs Consistency and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "CAP Theorem",
          "AP - Availability + Partition Tolerance",
          "CP - Consistency + Partition Tolerance"
        ],
        "resources": [
          {
            "title": "Availability vs Consistency Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "GHe8V-REu1loRpDnHbyUn",
        "title": "Consistency Patterns",
        "description": "Learn Consistency Patterns and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Weak Consistency",
          "Eventual Consistency",
          "Strong Consistency"
        ],
        "resources": [
          {
            "title": "Consistency Patterns Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "ezptoTqeaepByegxS5kHL",
        "title": "Availability Patterns",
        "description": "Learn Availability Patterns and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Fail-Over",
          "Active - Active",
          "Active - Passive",
          "Replication",
          "Master - Slave",
          "Master - Master",
          "Availability in Numbers",
          "99.9% Availability - three 9s",
          "99.99% Availability - four 9s",
          "Availability in Parallel vs Sequence"
        ],
        "resources": [
          {
            "title": "Availability Patterns Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "DOESIlBThd_wp2uOSd_CS",
        "title": "Background Jobs",
        "description": "Learn Background Jobs and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Event-Driven",
          "Schedule Driven",
          "Returning Results"
        ],
        "resources": [
          {
            "title": "Background Jobs Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "Uk6J8JRcKVEFz4_8rLfnQ",
        "title": "Domain Name System",
        "description": "Learn Domain Name System and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Domain Name System Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "O730v5Ww3ByAiBSs6fwyM",
        "title": "Content Delivery Networks",
        "description": "Learn Content Delivery Networks and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Push CDNs",
          "Pull CDNs"
        ],
        "resources": [
          {
            "title": "Content Delivery Networks Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "14KqLKgh090Rb3MDwelWY",
        "title": "Load Balancers",
        "description": "Learn Load Balancers and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "LB vs Reverse Proxy",
          "Load Balancing Algorithms",
          "Layer 7 Load Balancing",
          "Layer 4 Load Balancing",
          "Horizontal Scaling"
        ],
        "resources": [
          {
            "title": "Load Balancers Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "XXuzTrP5UNVwSpAk-tAGr",
        "title": "Application Layer",
        "description": "Learn Application Layer and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Microservices",
          "Service Discovery"
        ],
        "resources": [
          {
            "title": "Application Layer Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "5FXwwRMNBhG7LT5ub6t2L",
        "title": "Databases",
        "description": "Learn Databases and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "SQL vs NoSQL",
          "Replication",
          "Sharding",
          "Federation",
          "Denormalization",
          "SQL Tuning",
          "RDBMS",
          "Key-Value Store",
          "Document Store",
          "Wide Column Store",
          "Graph Databases",
          "NoSQL"
        ],
        "resources": [
          {
            "title": "Databases Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "-X4g8kljgVBOBcf1DDzgi",
        "title": "Caching",
        "description": "Learn Caching and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Refresh Ahead",
          "Write-behind",
          "Write-through",
          "Cache Aside",
          "Strategies",
          "Client Caching",
          "CDN Caching",
          "Web Server Caching",
          "Database Caching",
          "Application Caching"
        ],
        "resources": [
          {
            "title": "Caching Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "84N4XY31PwXRntXX1sdCU",
        "title": "Asynchronism",
        "description": "Learn Asynchronism and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Back Pressure",
          "Task Queues",
          "Message Queues",
          "Types of Caching"
        ],
        "resources": [
          {
            "title": "Asynchronism Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "3pRi8M4xQXsehkdfUNtYL",
        "title": "Idempotent Operations",
        "description": "Learn Idempotent Operations and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Idempotent Operations Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "uQFzD_ryd-8Dr1ppjorYJ",
        "title": "Communication",
        "description": "Learn Communication and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "HTTP",
          "TCP",
          "UDP",
          "RPC",
          "REST",
          "gRPC",
          "GraphQL"
        ],
        "resources": [
          {
            "title": "Communication Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "p--uEm6klLx_hKxKJiXE5",
        "title": "Performance Antipatterns",
        "description": "Learn Performance Antipatterns and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Busy Database",
          "Busy Frontend",
          "Chatty I/O",
          "Extraneous Fetching",
          "Improper Instantiation",
          "Monolithic Persistence",
          "No Caching",
          "Noisy Neighbor",
          "Retry Storm",
          "Synchronous I/O"
        ],
        "resources": [
          {
            "title": "Performance Antipatterns Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "hDFYlGFYwcwWXLmrxodFX",
        "title": "Monitoring",
        "description": "Learn Monitoring and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Health Monitoring",
          "Availability Monitoring",
          "Performance Monitoring",
          "Security Monitoring",
          "Usage Monitoring",
          "Instrumentation",
          "Visualization & Alerts"
        ],
        "resources": [
          {
            "title": "Monitoring Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "8ZK2iHO4D3cONYu2JN74F",
        "title": "The design patterns given in this section are of varying importance. You don't need to master all of them. Simply get an overview of each and this will give you some insight into designing scalable systems.",
        "description": "Learn The design patterns given in this section are of varying importance. You don't need to master all of them. Simply get an overview of each and this will give you some insight into designing scalable systems. and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "The design patterns given in this section are of varying importance. You don't need to master all of them. Simply get an overview of each and this will give you some insight into designing scalable systems. Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "THlzcZTNnPGLRiHPWT-Jv",
        "title": "Cloud Design Patterns",
        "description": "Learn Cloud Design Patterns and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Cloud Design Patterns Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "dsWpta3WIBvv2K9pNVPo0",
        "title": "Messaging",
        "description": "Learn Messaging and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Sequential Convoy",
          "Scheduling Agent Supervisor",
          "Queue-Based Load Leveling",
          "Publisher/Subscriber",
          "Priority Queue",
          "Pipes and Filters",
          "Competing Consumers",
          "Choreography",
          "Claim Check",
          "Async Request Reply"
        ],
        "resources": [
          {
            "title": "Messaging Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "W0cUCrhiwH_Nrzxw50x3L",
        "title": "Data Management",
        "description": "Learn Data Management and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Valet Key",
          "Static Content Hosting",
          "Sharding",
          "Materialized View",
          "Index Table",
          "Event Sourcing",
          "CQRS",
          "Cache-Aside"
        ],
        "resources": [
          {
            "title": "Data Management Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "PtJ7-v1VCLsyaWWYHYujV",
        "title": "Design & Implementation",
        "description": "Learn Design & Implementation and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Strangler Fig",
          "Static Content Hosting",
          "Sidecar",
          "Pipes & Filters",
          "Leader Election",
          "Gateway Routing",
          "Gateway Offloading",
          "Gateway Aggregation",
          "External Config Store",
          "Compute Resource Consolidation",
          "CQRS",
          "Backends for Frontend",
          "Anti-Corruption Layer",
          "Ambassador"
        ],
        "resources": [
          {
            "title": "Design & Implementation Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "DYkdM_L7T2GcTPAoZNnUR",
        "title": "Reliability Patterns",
        "description": "Learn Reliability Patterns and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Reliability Patterns Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "Xzkvf4naveszLGV9b-8ih",
        "title": "Availability",
        "description": "Learn Availability and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Deployment Stamps",
          "Geodes",
          "Health Endpoint Monitoring",
          "Queue-Based Load Leveling",
          "Throttling"
        ],
        "resources": [
          {
            "title": "Availability Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "wPe7Xlwqws7tEpTAVvYjr",
        "title": "High Availability",
        "description": "Learn High Availability and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Deployment Stamps",
          "Geodes",
          "Health Endpoint Monitoring",
          "Bulkhead",
          "Circuit Breaker"
        ],
        "resources": [
          {
            "title": "High Availability Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "wlAWMjxZF6yav3ZXOScxH",
        "title": "Resiliency",
        "description": "Learn Resiliency and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Bulkhead",
          "Circuit Breaker",
          "Compensating Transaction",
          "Health Endpoint Monitoring",
          "Leader Election",
          "Queue-Based Load Leveling",
          "Retry ",
          "Scheduler Agent Supervisor"
        ],
        "resources": [
          {
            "title": "Resiliency Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "ZvYpE6-N5dAtRDIwqcAu6",
        "title": "Security",
        "description": "Learn Security and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Federated Identity",
          "Gatekeeper",
          "Valet Key"
        ],
        "resources": [
          {
            "title": "Security Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "0vLaVNJaJSHZ_bHli6Qzs",
        "title": "Visit the following relevant tracks to learn more",
        "description": "Learn Visit the following relevant tracks to learn more and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Backend",
          "Software Architect",
          "DevOps",
          "Other Roadmaps Backend Roadmap DevOps Roadmap Software Design and Architecture"
        ],
        "resources": [
          {
            "title": "Visit the following relevant tracks to learn more Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "yHmHXymPNWwu8p1vvqD3o",
        "title": "Find the detailed version of this roadmap along with other similar roadmaps",
        "description": "Learn Find the detailed version of this roadmap along with other similar roadmaps and core principles.",
        "category": "ENGINEERING",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "roadmap.sh"
        ],
        "resources": [
          {
            "title": "Find the detailed version of this roadmap along with other similar roadmaps Guide",
            "url": "https://roadmap.sh/system-design",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "engineering-manager",
    "title": "Engineering Manager",
    "description": "Everything you need to know to become an Engineering Manager in 2026",
    "category": "Management",
    "icon": "Layers",
    "nodeCount": 177,
    "nodes": [
      {
        "id": "_hYN0gEi9BL24nptEtXWU",
        "title": "What is Engineering Management?",
        "description": "Learn What is Engineering Management? and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "What is Engineering Management? Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "0vLaVNJaJSHZ_bHli6Qzs",
        "title": "Visit the following relevant tracks about system design and architecture",
        "description": "Learn Visit the following relevant tracks about system design and architecture and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Software Architect",
          "System Design",
          "EM vs Tech Lead vs IC",
          "People",
          "Product",
          "Key Focus Areas",
          "Process"
        ],
        "resources": [
          {
            "title": "Visit the following relevant tracks about system design and architecture Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "_V1bNZwDOIKF_bskubGTG",
        "title": "Technical Leadership",
        "description": "Learn Technical Leadership and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Architectural Decision-Making",
          "System Monitoring & Performance",
          "Scaling Infrastructure",
          "Software Engineering Background",
          "System Design and Architecture",
          "Technical Debt and Management",
          "Technical Documentation",
          "Code Review Best Practices",
          "Foundational Knowledge",
          "Technical Roadmapping",
          "Build vs Buy Evaluation",
          "Technical Risk Assessment",
          "Technical Strategy",
          "CI/CD Implementation",
          "Development / Release Workflow",
          "Technical Standards Setting",
          "Security  Best Practices",
          "Testing Strategies",
          "Quality and Process",
          "Incident Management",
          "Hiring and Recruitment",
          "Team Structure and Design",
          "Performance Evaluations",
          "Mentoring and Coaching",
          "Career Development Planning",
          "Team Development",
          "Delegation",
          "Conflict Resolution",
          "Feedback Delivery",
          "Team Motivation",
          "Trust / Influence Building",
          "Leadership Skills",
          "One-on-One Meetings",
          "Team Meetings",
          "Status Reporting",
          "Stakeholder Management",
          "Cross-functional Collaboration",
          "Communication",
          "Resource Allocation",
          "Sprint Planning",
          "Release Management",
          "Risk Management",
          "Dependency management",
          "Project Planning",
          "Agile methodologies",
          "Project Tracking",
          "Milestone Management",
          "Scope Management",
          "Timeline Estimation",
          "Execution",
          "KPI Definition",
          "Velocity Tracking",
          "Quality Metrics",
          "Team Health Metrics",
          "Project Postmortems",
          "Measurement",
          "Strategic Thinking",
          "Product strategy alignment",
          "Business Case Development",
          "ROI analysis",
          "Market awareness",
          "Competitive Analysis",
          "Financial Management",
          "Budget Planning",
          "Resource forecasting",
          "Cost Optimization",
          "Vendor Management",
          "Organizational Awareness",
          "Company Culture",
          "Change management",
          "Organization structure",
          "Politics navigation",
          "Cross-department collaboration",
          "Emotional Intelligence"
        ],
        "resources": [
          {
            "title": "Technical Leadership Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "UoHPKOKUHF2avXFUT5Vz4",
        "title": "Culture Building",
        "description": "Learn Culture Building and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Defining and Enforcing Values",
          "Team Traditions and Rituals",
          "Recognition programs",
          "Social connections",
          "Inclusive environment creation",
          "Innovation fostering",
          "Learning culture development",
          "Knowledge sharing practices",
          "Technical excellence mindset",
          "Blameless Post-mortems",
          "Bias Recognition / Mitigation",
          "Emergency protocols",
          "War Room Management",
          "Stakeholder Communication",
          "Post-incident analysis",
          "Service Recovery",
          "Incident Response",
          "Contingency planning",
          "Disaster recovery",
          "Business continuity",
          "Security incident handling",
          "Production issues management",
          "Risk Mitigation"
        ],
        "resources": [
          {
            "title": "Culture Building Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "bZ81ie09XsQw-YD17nBQ_",
        "title": "Crisis Management",
        "description": "Learn Crisis Management and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Engineering Culture",
          "Team Culture",
          "Burnout prevention",
          "Critical situation leadership",
          "Emergency staffing",
          "Stress management",
          "Work-life balance during crises",
          "Team Support"
        ],
        "resources": [
          {
            "title": "Crisis Management Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "xKFDpqkzQ6EvTDixM0_hi",
        "title": "Stakeholder Management",
        "description": "Learn Stakeholder Management and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Board presentations",
          "Executive summaries",
          "Strategic proposals",
          "Budget requests",
          "Vision alignment",
          "Executive Communication",
          "Customer feedback integration",
          "Technical customer support",
          "Customer success alignment",
          "Feature prioritization",
          "Technical partnerships",
          "Customer Relations",
          "Vendor relationships",
          "Technology partnerships",
          "Integration management",
          "API strategy",
          "External collaboration",
          "Partner Management"
        ],
        "resources": [
          {
            "title": "Stakeholder Management Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "jt-LF5QbGVs0cwTuHFQF6",
        "title": "Project Management",
        "description": "Learn Project Management and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "Project Management Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "X_nhWY6Veipg2OWISeJEa",
        "title": "People Management",
        "description": "Learn People Management and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [],
        "resources": [
          {
            "title": "People Management Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "6shGmkSVDCch9z6rspSRC",
        "title": "Business Acumen",
        "description": "Learn Business Acumen and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Legacy System Retirement"
        ],
        "resources": [
          {
            "title": "Business Acumen Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "dfXKIXcRZDOT1NJczx_Jf",
        "title": "Knowledge Management",
        "description": "Learn Knowledge Management and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Architecture documentation",
          "Process documentation",
          "Decision records",
          "Lessons Learned",
          "Best Practices",
          "Documentation",
          "Mentoring Programs",
          "Knowledge bases",
          "Brown Bags",
          "Tech Talks",
          "Knowledge Transfer"
        ],
        "resources": [
          {
            "title": "Knowledge Management Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "_RF_sIeR2YhGf7g4htNV6",
        "title": "Change Management",
        "description": "Learn Change Management and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "Migration planning",
          "Legacy system retirement",
          "Technology adoption",
          "Tool transitions",
          "Process changes",
          "Technical Change",
          "Change strategy",
          "Impact assessment",
          "Stakeholder management",
          "Communication planning",
          "Resistance management",
          "Organizational Change",
          "Team Change",
          "Reorganizations",
          "Team mergers",
          "Role transitions",
          "Responsibility shifts",
          "Culture evolution",
          "Software Design & Architecture",
          "Related Roadmaps Backend Development DevOps Engineering System Design Software Architect"
        ],
        "resources": [
          {
            "title": "Change Management Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      },
      {
        "id": "yHmHXymPNWwu8p1vvqD3o",
        "title": "Find the detailed version of this roadmap along with other similar roadmaps",
        "description": "Learn Find the detailed version of this roadmap along with other similar roadmaps and core principles.",
        "category": "MANAGEMENT",
        "difficulty": "Intermediate",
        "estimatedHours": 15,
        "prerequisites": [],
        "subtopics": [
          "roadmap.sh"
        ],
        "resources": [
          {
            "title": "Find the detailed version of this roadmap along with other similar roadmaps Guide",
            "url": "https://roadmap.sh/engineering-manager",
            "type": "Doc"
          }
        ]
      }
    ]
  },
  {
    "slug": "forward-deployed-engineer",
    "title": "Forward Deployed Engineer",
    "description": "Step-by-step guide to becoming a Forward Deployed Engineer in 2026",
    "category": "Engineering",
    "icon": "Cpu",
    "nodeCount": 15,
    "nodes": [
      {
        "id": "fde-roles-responsibilities",
        "title": "Roles & Responsibilities",
        "description": "Understand the core duties of an FDE: on-site customer delivery, integration engineering, custom feature development, and production support.",
        "category": "CORE",
        "difficulty": "Beginner",
        "estimatedHours": 10,
        "prerequisites": [],
        "subtopics": ["Customer Delivery", "Field Engineering", "Production Support"],
        "resources": [{ "title": "What is an FDE?", "url": "https://roadmap.sh/forward-deployed-engineer", "type": "Doc" }]
      },
      {
        "id": "fde-technical-foundations",
        "title": "Full-Stack & Systems Mastery",
        "description": "Command line proficiency, shell scripting, Linux administration, frontend/backend engineering, and DSA.",
        "category": "FOUNDATION",
        "difficulty": "Intermediate",
        "estimatedHours": 30,
        "prerequisites": [],
        "subtopics": ["Linux Skills", "Frontend Skills", "Backend Skills", "DSA & System Design"],
        "resources": [{ "title": "Linux & Full-Stack Guide", "url": "https://roadmap.sh/full-stack", "type": "Doc" }]
      },
      {
        "id": "fde-ai-cloud",
        "title": "AI Engineering & Cloud Infrastructure",
        "description": "Integrating LLMs, building RAG systems, Docker containerization, Kubernetes orchestration, and IaC with Terraform.",
        "category": "ADVANCED",
        "difficulty": "Advanced",
        "estimatedHours": 35,
        "prerequisites": ["fde-technical-foundations"],
        "subtopics": ["AI Engineering Skills", "DevOps Skills", "Container Deployment"],
        "resources": [{ "title": "AI Engineering Guide", "url": "https://roadmap.sh/ai-engineer", "type": "Doc" }]
      },
      {
        "id": "fde-discovery-scoping",
        "title": "Discovery & Technical Scoping",
        "description": "Requirements gathering, technical scoping, sequencing, and evaluating tradeoffs between scope, speed, and quality.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 20,
        "prerequisites": [],
        "subtopics": ["Requirements Gathering", "Technical Scoping & Sequencing", "Tradeoffs: Scope, Speed, Quality"],
        "resources": [{ "title": "Technical Scoping Best Practices", "url": "https://roadmap.sh/forward-deployed-engineer", "type": "Guide" }]
      },
      {
        "id": "fde-field-skills",
        "title": "Customer Delivery & Business Acumen",
        "description": "Technical writing, enterprise workflows, ROI & AI impact analysis, stakeholder management, and product feedback loops.",
        "category": "PROJECTS",
        "difficulty": "Intermediate",
        "estimatedHours": 25,
        "prerequisites": [],
        "subtopics": ["Technical Writing", "Enterprise Workflow", "ROI & AI Impact", "Stakeholder Management", "Product Feedback Loop"],
        "resources": [{ "title": "Field Delivery Guide", "url": "https://roadmap.sh/forward-deployed-engineer", "type": "Doc" }]
      }
    ]
  },
  {
    "slug": "aspnet-core",
    "title": "ASP.NET Core Developer",
    "description": "Step-by-step guide to becoming an ASP.NET Core developer in 2026",
    "category": "Engineering",
    "icon": "Server",
    "nodeCount": 16,
    "nodes": [
      {
        "id": "csharp-fundamentals",
        "title": "C# & .NET Language Foundations",
        "description": "Master C# syntax, type system, object-oriented principles, LINQ, and asynchronous programming with async/await.",
        "category": "FOUNDATION",
        "difficulty": "Beginner",
        "estimatedHours": 20,
        "prerequisites": [],
        "subtopics": ["C# Language Syntax & OOP", "LINQ & Generics", "Asynchronous Programming (async/await)"],
        "resources": [{ "title": "C# Documentation", "url": "https://learn.microsoft.com/en-us/dotnet/csharp/", "type": "Doc" }]
      },
      {
        "id": "aspnet-architecture",
        "title": "ASP.NET Core Framework Architecture",
        "description": "MVC & Razor Pages pattern, HTTP middleware request pipeline, Dependency Injection lifetimes, and Options pattern.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 25,
        "prerequisites": ["csharp-fundamentals"],
        "subtopics": ["MVC & Razor Pages", "Middleware Pipeline", "Dependency Injection & Lifetimes", "Configuration & Options Pattern"],
        "resources": [{ "title": "ASP.NET Core Documentation", "url": "https://learn.microsoft.com/en-us/aspnet/core/", "type": "Doc" }]
      },
      {
        "id": "web-apis-rest",
        "title": "Web APIs & RESTful Services",
        "description": "Building REST API controllers, attribute routing, Minimal APIs, DTO request binding, and FluentValidation.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 20,
        "prerequisites": ["aspnet-architecture"],
        "subtopics": ["API Controllers & Routing", "Minimal APIs", "Model Validation & FluentValidation"],
        "resources": [{ "title": "Build Web APIs with ASP.NET Core", "url": "https://learn.microsoft.com/en-us/aspnet/core/web-api/", "type": "Guide" }]
      },
      {
        "id": "ef-core-data",
        "title": "Data Access & Entity Framework Core",
        "description": "Mapping database tables to C# entity models, DbContext configuration, EF Core migrations, and LINQ queries.",
        "category": "CORE",
        "difficulty": "Intermediate",
        "estimatedHours": 25,
        "prerequisites": ["csharp-fundamentals"],
        "subtopics": ["EF Core & DbContext", "Migrations & Database Seeding"],
        "resources": [{ "title": "Entity Framework Core Docs", "url": "https://learn.microsoft.com/en-us/ef/core/", "type": "Doc" }]
      },
      {
        "id": "security-authentication",
        "title": "Authentication & Web Security",
        "description": "User authentication with ASP.NET Core Identity, JWT Bearer tokens, Claims, CORS policy, and CSRF protection.",
        "category": "ADVANCED",
        "difficulty": "Advanced",
        "estimatedHours": 20,
        "prerequisites": ["web-apis-rest"],
        "subtopics": ["ASP.NET Core Identity & JWT", "CORS & Protection"],
        "resources": [{ "title": "ASP.NET Core Security Overview", "url": "https://learn.microsoft.com/en-us/aspnet/core/security/", "type": "Doc" }]
      },
      {
        "id": "signalr-testing",
        "title": "Real-Time Apps & Automated Testing",
        "description": "Real-time communication using SignalR hubs and unit/integration testing controllers with xUnit and WebApplicationFactory.",
        "category": "ADVANCED",
        "difficulty": "Advanced",
        "estimatedHours": 20,
        "prerequisites": ["aspnet-architecture"],
        "subtopics": ["SignalR Real-Time Hubs", "Unit & Integration Testing"],
        "resources": [{ "title": "SignalR Overview", "url": "https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction", "type": "Doc" }]
      }
    ]
  },
  {
  "slug": "datastructures-and-algorithms",
  "title": "Data Structures & Algorithms",
  "description": "Step by step guide to learn Data Structures and Algorithms in 2026",
  "category": "Computer Science",
  "icon": "Code",
  "nodeCount": 107,
  "nodes": [
    {
      "id": "Z4uVzAoNzcAkyjd-lp3_M",
      "title": "Pick a Language",
      "description": "Learn Pick a Language in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Pick a Language"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "5jNTeoLONIHWlT68poo7b",
      "parentTitle": "Data Structures & Algorithms"
    },
    {
      "id": "HVD9G3JlLBsAg111vQILj",
      "title": "JavaScript",
      "description": "Learn JavaScript in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "JavaScript"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Z4uVzAoNzcAkyjd-lp3_M",
      "parentTitle": "Pick a Language"
    },
    {
      "id": "gjZZOwmYkXQHPfg9Ynz80",
      "title": "Java",
      "description": "Learn Java in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Java"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Z4uVzAoNzcAkyjd-lp3_M",
      "parentTitle": "Pick a Language"
    },
    {
      "id": "OkdM_PJge70j5tsjT2Esl",
      "title": "Go",
      "description": "Learn Go in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Go"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Z4uVzAoNzcAkyjd-lp3_M",
      "parentTitle": "Pick a Language"
    },
    {
      "id": "BZvNEZjCNuHPg5SkX90bt",
      "title": "C#",
      "description": "Learn C# in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "C#"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "IWmq4UFB5j6O3UJfarh1u",
      "title": "C++",
      "description": "Learn C++ in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "C++"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "XyRCXhZjQFcDNaUSNNQV-",
      "title": "Python",
      "description": "Learn Python in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Python"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "acgRMEuL4ZGGRHpZ7kXSo",
      "title": "Rust",
      "description": "Learn Rust in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Rust"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "9h1mz0xAUvPrnRm9VndJF",
      "title": "Ruby",
      "description": "Learn Ruby in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Ruby"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Z4uVzAoNzcAkyjd-lp3_M",
      "parentTitle": "Pick a Language"
    },
    {
      "id": "ebQdTOAOV54WBToHmFtBk",
      "title": "Programming Fundamentals",
      "description": "Learn Programming Fundamentals in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Programming Fundamentals"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "kE6qddRhO8C5ur3JbeuhF",
      "title": "Language Syntax",
      "description": "Learn Language Syntax in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Language Syntax"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "ebQdTOAOV54WBToHmFtBk",
      "parentTitle": "Programming Fundamentals"
    },
    {
      "id": "G74Xp8_EMZO2oEzNTRAli",
      "title": "Control Structures",
      "description": "Learn Control Structures in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Control Structures"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "ebQdTOAOV54WBToHmFtBk",
      "parentTitle": "Programming Fundamentals"
    },
    {
      "id": "Cu08m5JOfvrPUDGony144",
      "title": "Functions",
      "description": "Learn Functions in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Functions"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "ebQdTOAOV54WBToHmFtBk",
      "parentTitle": "Programming Fundamentals"
    },
    {
      "id": "QFR1FMOf2OV3n3jcDnOCP",
      "title": "OOP Basics",
      "description": "Learn OOP Basics in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "OOP Basics"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "ebQdTOAOV54WBToHmFtBk",
      "parentTitle": "Programming Fundamentals"
    },
    {
      "id": "tvy3Vic8Vp-Ie2x_OyZ5b",
      "title": "Pseudo Code",
      "description": "Learn Pseudo Code in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Pseudo Code"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "ebQdTOAOV54WBToHmFtBk",
      "parentTitle": "Programming Fundamentals"
    },
    {
      "id": "jvWuYXWRtt_ePawc4q1Tg",
      "title": "What are Data Structures?",
      "description": "Learn What are Data Structures? in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "What are Data Structures?"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "ebQdTOAOV54WBToHmFtBk",
      "parentTitle": "Programming Fundamentals"
    },
    {
      "id": "8_GkF9zhRL8tvT2qu-bGj",
      "title": "Why are Data Structures Important?",
      "description": "Learn Why are Data Structures Important? in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Why are Data Structures Important?"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "iTlpa9A7h33FkUAv0UaVZ",
      "title": "Basic Data Structures",
      "description": "Learn Basic Data Structures in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Basic Data Structures"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "lxY3ErxJ_D3zkSAXIBUpv",
      "title": "Array",
      "description": "Learn Array in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Array"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "bRu9u8pEAQ1TmKygjIjyI",
      "title": "Linked Lists",
      "description": "Learn Linked Lists in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Linked Lists"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "iTlpa9A7h33FkUAv0UaVZ",
      "parentTitle": "Basic Data Structures"
    },
    {
      "id": "jvKRykGNy140FlquF2fcK",
      "title": "Stacks",
      "description": "Learn Stacks in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Stacks"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "iTlpa9A7h33FkUAv0UaVZ",
      "parentTitle": "Basic Data Structures"
    },
    {
      "id": "v0phjC75jhmE1z-f9ZMck",
      "title": "Queues",
      "description": "Learn Queues in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Queues"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "kSy-8ubESdmIX4Fyl8TSu",
      "title": "Hash Tables",
      "description": "Learn Hash Tables in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Hash Tables"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "iTlpa9A7h33FkUAv0UaVZ",
      "parentTitle": "Basic Data Structures"
    },
    {
      "id": "VotdHk0_bI3CeoIf-KoKu",
      "title": "Algorithmic Complexity",
      "description": "Learn Algorithmic Complexity in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Algorithmic Complexity"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "iTlpa9A7h33FkUAv0UaVZ",
      "parentTitle": "Basic Data Structures"
    },
    {
      "id": "unaYmPzK761Eh_iZMLeRC",
      "title": "Time vs Space Complexity",
      "description": "Learn Time vs Space Complexity in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Time vs Space Complexity"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "VotdHk0_bI3CeoIf-KoKu",
      "parentTitle": "Algorithmic Complexity"
    },
    {
      "id": "HosRc0hczubBHrWxCzEJj",
      "title": "How to Calculate Complexity?",
      "description": "Learn How to Calculate Complexity? in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "How to Calculate Complexity?"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "VotdHk0_bI3CeoIf-KoKu",
      "parentTitle": "Algorithmic Complexity"
    },
    {
      "id": "nqnO1Wz3gYIMR98_BnF2V",
      "title": "Common Runtimes",
      "description": "Learn Common Runtimes in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Common Runtimes"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "_bpV8MkVOY8ZatTXYaEE4",
      "title": "Constant",
      "description": "Learn Constant in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Constant"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "Cnceet0yroFHzn8npAir8",
      "title": "Logarithmic",
      "description": "Learn Logarithmic in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Logarithmic"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "HOpL-4jYhOe0LNrrkPrET",
      "title": "Linear",
      "description": "Learn Linear in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Linear"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "QKhmM_IG1FkBudfdrf1aT",
      "title": "Polynomial",
      "description": "Learn Polynomial in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Polynomial"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "xqzaYJBvlsNtT6qZ59ktv",
      "title": "Exponential",
      "description": "Learn Exponential in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Exponential"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "wclY3cmt1fBNYjLsmijdW",
      "title": "Factorial",
      "description": "Learn Factorial in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Factorial"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "v0LrabYYOKzV4oCXOK2Rs",
      "title": "Asymptotic Notation",
      "description": "Learn Asymptotic Notation in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Asymptotic Notation"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "VotdHk0_bI3CeoIf-KoKu",
      "parentTitle": "Algorithmic Complexity"
    },
    {
      "id": "oylTfop_JDPHJ3jYuA2Nq",
      "title": "Big-O Notation",
      "description": "Learn Big-O Notation in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Big-O Notation"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "Ex6tzu6gwrarWm1CNFufO",
      "title": "Big-\u03b8 Notation",
      "description": "Learn Big-\u03b8 Notation in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Big-\u03b8 Notation"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "CkUi93TvTkEm2_isHNvqr",
      "title": "Big-\u03a9 Notation",
      "description": "Learn Big-\u03a9 Notation in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Big-\u03a9 Notation"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "WzFkdkcbL8ea9DBkjfSwa",
      "title": "Sorting Algorithms",
      "description": "Learn Sorting Algorithms in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Sorting Algorithms"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "VotdHk0_bI3CeoIf-KoKu",
      "parentTitle": "Algorithmic Complexity"
    },
    {
      "id": "zUDKCJCQHLW4c_6A349R3",
      "title": "Bubble Sort",
      "description": "Learn Bubble Sort in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Bubble Sort"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "k0UBAj3hOYab4mUziOYyW",
      "title": "Merge Sort",
      "description": "Learn Merge Sort in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Merge Sort"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "liJfTV5ajAFZcfwBdVGpU",
      "title": "Insertion Sort",
      "description": "Learn Insertion Sort in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Insertion Sort"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "LgEV0Wm4avrOqR8bV5GXW",
      "title": "Quick Sort",
      "description": "Learn Quick Sort in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Quick Sort"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "SMgBHvqXLD6Cgr2nix4wR",
      "title": "Selection Sort",
      "description": "Learn Selection Sort in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Selection Sort"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "yMv9Oa3hsgT8Adx6m_rdL",
      "title": "Heap Sort",
      "description": "Learn Heap Sort in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Heap Sort"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "z_Cf_alLAYSCyYtNviRcO",
      "title": "Search Algorithms",
      "description": "Learn Search Algorithms in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Search Algorithms"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "AtX-PeI8nY4-5bA-xLla0",
      "title": "Linear Search",
      "description": "Learn Linear Search in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Linear Search"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "Wt74MRKaZcs8lYvfqjffT",
      "title": "Binary Search",
      "description": "Learn Binary Search in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Binary Search"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "r2Jagzbx0qOG-VtxBY-mz",
      "title": "Tree Data Structures",
      "description": "Learn Tree Data Structures in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Tree Data Structures"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "2Od5lNc6fCM6Gyj_axj4n",
      "title": "Tree Traversal",
      "description": "Learn Tree Traversal in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Tree Traversal"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "YJsAQWJpLwVN6oCxNwNAn",
      "title": "Search Algorithms",
      "description": "Learn Search Algorithms in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Search Algorithms"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "pfg-qclOpvlsGMdlZ1aoj",
      "title": "Breadth First Search",
      "description": "Learn Breadth First Search in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Breadth First Search"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "gR8KcOIADUxS8hdiEaGZy",
      "title": "Depth First Search",
      "description": "Learn Depth First Search in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Depth First Search"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "iCA7UKZih4ItDmDNEC8Q-",
      "title": "In-Order Traversal",
      "description": "Learn In-Order Traversal in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "In-Order Traversal"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "BMEoO65zsX51H4Js1gcWI",
      "title": "Pre-Order Traversal",
      "description": "Learn Pre-Order Traversal in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Pre-Order Traversal"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "j6_DyKiyG1wBuygQkxWB7",
      "title": "Post-Order Traversal",
      "description": "Learn Post-Order Traversal in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Post-Order Traversal"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "RPU5CGp2Li5lk0UB-zNHT",
      "title": "Binary Trees",
      "description": "Learn Binary Trees in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Binary Trees"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "UYm7unZfXd9Ge5EYV4odb",
      "title": "Binary Search Trees",
      "description": "Learn Binary Search Trees in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Binary Search Trees"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "5MCgKpylPzDZaGBEUU51r",
      "title": "AVL Trees",
      "description": "Learn AVL Trees in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "AVL Trees"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "2F6BcbAzICynOK3oEj-Is",
      "title": "B-Trees",
      "description": "Learn B-Trees in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "B-Trees"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "j_r1tB16bA7R3yDAWN7Oj",
      "title": "Graph Data Structures",
      "description": "Learn Graph Data Structures in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Graph Data Structures"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "r2Jagzbx0qOG-VtxBY-mz",
      "parentTitle": "Tree Data Structures"
    },
    {
      "id": "XVw2_dL3uN0SOWmjH1Uao",
      "title": "Directed Graph",
      "description": "Learn Directed Graph in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Directed Graph"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "VnKm_j7McUW9Lo0iKyPUp",
      "title": "Undirected Graph",
      "description": "Learn Undirected Graph in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Undirected Graph"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "j_r1tB16bA7R3yDAWN7Oj",
      "parentTitle": "Graph Data Structures"
    },
    {
      "id": "LW5HZMca4lvhbbA8KYaOa",
      "title": "Search Algorithms",
      "description": "Learn Search Algorithms in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Search Algorithms"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "c7LdXJPv-5M-NPKSCXYuB",
      "title": "Breadth First Search",
      "description": "Learn Breadth First Search in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Breadth First Search"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "NrPO7vF8Z1WzmA9Ca3Y_E",
      "title": "Depth First Search",
      "description": "Learn Depth First Search in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Depth First Search"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "N-qvYirxpORcaTslvlOL0",
      "title": "Shortest Path Algorithms",
      "description": "Learn Shortest Path Algorithms in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Shortest Path Algorithms"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "87UugvReiywF0E7Acos9U",
      "title": "Dijkstra's Algorithm",
      "description": "Learn Dijkstra's Algorithm in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Dijkstra's Algorithm"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "7CgGwdwHnOmISmEPtJegN",
      "title": "Bellman-Ford Algoritm",
      "description": "Learn Bellman-Ford Algoritm in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Bellman-Ford Algoritm"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "Ktqau1VkVrnnVYByqcacM",
      "title": "Minimum Spanning Tree",
      "description": "Learn Minimum Spanning Tree in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Minimum Spanning Tree"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "yEWnYjW0ZLVhsLc9rH4ae",
      "title": "Prim's Algorithm",
      "description": "Learn Prim's Algorithm in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Prim's Algorithm"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "F3bPbwIdCNMzL7QXEYJK3",
      "title": "Kruskal's Algorithm",
      "description": "Learn Kruskal's Algorithm in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Kruskal's Algorithm"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "KnyUHDvpDTUO0EkAs9pT8",
      "title": "Advanced Data Structures",
      "description": "Learn Advanced Data Structures in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Advanced Data Structures"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "zy3wpb1MjizfUfx9_rZy2",
      "title": "Trie",
      "description": "Learn Trie in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Trie"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "KnyUHDvpDTUO0EkAs9pT8",
      "parentTitle": "Advanced Data Structures"
    },
    {
      "id": "iFNS3x9wVRIjpixct6H7x",
      "title": "Segment Trees",
      "description": "Learn Segment Trees in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Segment Trees"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "KnyUHDvpDTUO0EkAs9pT8",
      "parentTitle": "Advanced Data Structures"
    },
    {
      "id": "V9SWO58kaMsU1NT7q26WG",
      "title": "Fenwick Trees",
      "description": "Learn Fenwick Trees in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Fenwick Trees"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "KnyUHDvpDTUO0EkAs9pT8",
      "parentTitle": "Advanced Data Structures"
    },
    {
      "id": "La8XAT0BWvqRCrvQxtZIp",
      "title": "Disjoint Set (Union-Find)",
      "description": "Learn Disjoint Set (Union-Find) in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Disjoint Set (Union-Find)"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "KnyUHDvpDTUO0EkAs9pT8",
      "parentTitle": "Advanced Data Structures"
    },
    {
      "id": "zprVkxpojaxNo0LQar3Ex",
      "title": "Suffix Trees and Arrays",
      "description": "Learn Suffix Trees and Arrays in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Suffix Trees and Arrays"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "KnyUHDvpDTUO0EkAs9pT8",
      "parentTitle": "Advanced Data Structures"
    },
    {
      "id": "kSpgFuAHyzySWlGBLOHZR",
      "title": "Complex Data Structures",
      "description": "Learn Complex Data Structures in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Complex Data Structures"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "2G6vn7K11_mPQQ7_IXJ96",
      "title": "B/B+ Trees",
      "description": "Learn B/B+ Trees in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "B/B+ Trees"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "kSpgFuAHyzySWlGBLOHZR",
      "parentTitle": "Complex Data Structures"
    },
    {
      "id": "TQu-OBpvR-aQfMByUcwyM",
      "title": "Skip List",
      "description": "Learn Skip List in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Skip List"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "kSpgFuAHyzySWlGBLOHZR",
      "parentTitle": "Complex Data Structures"
    },
    {
      "id": "uxErZ4gLeKqwhrUG88InQ",
      "title": "ISAM",
      "description": "Learn ISAM in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "ISAM"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "kSpgFuAHyzySWlGBLOHZR",
      "parentTitle": "Complex Data Structures"
    },
    {
      "id": "o0fNAhJ1LsCdmGzY2ni_x",
      "title": "2-3 Trees",
      "description": "Learn 2-3 Trees in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "2-3 Trees"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "kSpgFuAHyzySWlGBLOHZR",
      "parentTitle": "Complex Data Structures"
    },
    {
      "id": "Ar7GEGfI9O_dLPbIEVhF_",
      "title": "Indexing",
      "description": "Learn Indexing in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Indexing"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "kSpgFuAHyzySWlGBLOHZR",
      "parentTitle": "Complex Data Structures"
    },
    {
      "id": "4noav5w_8GrMTXN1Lxm5h",
      "title": "Linear",
      "description": "Learn Linear in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Linear"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Ar7GEGfI9O_dLPbIEVhF_",
      "parentTitle": "Indexing"
    },
    {
      "id": "ZXUfeyfC5oSKkGktXuK8t",
      "title": "Tree-Based",
      "description": "Learn Tree-Based in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Tree-Based"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Ar7GEGfI9O_dLPbIEVhF_",
      "parentTitle": "Indexing"
    },
    {
      "id": "Y1Uz6XRbR1YqFtO4akiPA",
      "title": "Problem Solving Techniques",
      "description": "Learn Problem Solving Techniques in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Problem Solving Techniques"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "5T2y6Iqi-I_zOtLkeSPzY",
      "title": "Brute Force",
      "description": "Learn Brute Force in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Brute Force"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "mKoC5o__gLSTjAlq8iXkV",
      "title": "Backtracking",
      "description": "Learn Backtracking in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Backtracking"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Y1Uz6XRbR1YqFtO4akiPA",
      "parentTitle": "Problem Solving Techniques"
    },
    {
      "id": "qUlqyTjk3XKF9DEm6Lsgb",
      "title": "Greedy Algorithms",
      "description": "Learn Greedy Algorithms in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Greedy Algorithms"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Y1Uz6XRbR1YqFtO4akiPA",
      "parentTitle": "Problem Solving Techniques"
    },
    {
      "id": "RiS8KZs3YBE6mKWPHszMp",
      "title": "Randomised Algorithms",
      "description": "Learn Randomised Algorithms in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Randomised Algorithms"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Y1Uz6XRbR1YqFtO4akiPA",
      "parentTitle": "Problem Solving Techniques"
    },
    {
      "id": "xchWhsizaKgYuHPC4Tz9H",
      "title": "Divide and Conquer",
      "description": "Learn Divide and Conquer in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Divide and Conquer"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Y1Uz6XRbR1YqFtO4akiPA",
      "parentTitle": "Problem Solving Techniques"
    },
    {
      "id": "4ZAzcwP0oPGZ9Rw042V8-",
      "title": "Recursion",
      "description": "Learn Recursion in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Recursion"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Y1Uz6XRbR1YqFtO4akiPA",
      "parentTitle": "Problem Solving Techniques"
    },
    {
      "id": "jKAZNybU9cxufNBdFsqsP",
      "title": "Dynamic Programming",
      "description": "Learn Dynamic Programming in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Dynamic Programming"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Y1Uz6XRbR1YqFtO4akiPA",
      "parentTitle": "Problem Solving Techniques"
    },
    {
      "id": "itvhUXbe9dr9JN5ga2jYy",
      "title": "Two Pointer Technique",
      "description": "Learn Two Pointer Technique in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Two Pointer Technique"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Y1Uz6XRbR1YqFtO4akiPA",
      "parentTitle": "Problem Solving Techniques"
    },
    {
      "id": "gbHVR-ojRxv9I0E5eSlWy",
      "title": "Sliding Window Technique",
      "description": "Learn Sliding Window Technique in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Sliding Window Technique"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ],
      "parentId": "Y1Uz6XRbR1YqFtO4akiPA",
      "parentTitle": "Problem Solving Techniques"
    },
    {
      "id": "VMV4F-SPKWn9CtpHXEjeN",
      "title": "Platforms to Practice",
      "description": "Learn Platforms to Practice in Data Structures & Algorithms",
      "category": "TOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Platforms to Practice"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "waM_j5mbe_XoA7h8u4vFN",
      "title": "Leetcode",
      "description": "Learn Leetcode in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Leetcode"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "8-7phxPp1D1mv2yubpLBo",
      "title": "Edabit",
      "description": "Learn Edabit in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Edabit"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "J_No8GTa92DcwPtua30wL",
      "title": "Fast and Slow Pointers",
      "description": "Learn Fast and Slow Pointers in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Fast and Slow Pointers"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "L1FIJAluyxG6CGaVLM20O",
      "title": "Cyclic Sort",
      "description": "Learn Cyclic Sort in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Cyclic Sort"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "S2mBvlFTd673XcXxisD5P",
      "title": "Merge Intervals",
      "description": "Learn Merge Intervals in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Merge Intervals"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "JcchUF_U99zkFpXp3VT2R",
      "title": "Kth Element",
      "description": "Learn Kth Element in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Kth Element"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "MGb8ufztTK75aXAyEAuaf",
      "title": "Two Heaps",
      "description": "Learn Two Heaps in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Two Heaps"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "gaaRAL3HR48Qj9rz1CkDU",
      "title": "Multi-threaded",
      "description": "Learn Multi-threaded in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Multi-threaded"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "q9qLI6HzOJ0vYaIVrZ5CU",
      "title": "Island traversal",
      "description": "Learn Island traversal in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Island traversal"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "R3Coq0TG1_cSOXzXWgpuI",
      "title": "Heap",
      "description": "Learn Heap in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "Heap"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    },
    {
      "id": "AabJqPUwFVBVS02YPDPvL",
      "title": "A* Algorithm",
      "description": "Learn A* Algorithm in Data Structures & Algorithms",
      "category": "SUBTOPIC",
      "difficulty": "Intermediate",
      "estimatedHours": 10,
      "prerequisites": [],
      "subtopics": [
        "A* Algorithm"
      ],
      "resources": [
        {
          "title": "roadmap.sh DSA",
          "url": "https://roadmap.sh/datastructures-and-algorithms",
          "type": "Doc"
        }
      ]
    }
  ]
}
];
