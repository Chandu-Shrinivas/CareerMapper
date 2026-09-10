import type { RoadmapDefinition } from '../types/roadmap';

export const AI_DATA_SCIENTIST_ROADMAP_DEFINITION: RoadmapDefinition = {
  "id": "ai-data-scientist",
  "slug": "ai-data-scientist",
  "title": "AI and Data Scientist Roadmap",
  "version": "2026.1",
  "description": "Step by step roadmap guide to becoming an AI and Data Scientist in 2026: Mathematics, Statistics, Econometrics, Coding, EDA, Machine Learning, Deep Learning, MLOps, AI Engineering, and Vibe Coding.",
  "nodes": [
    {
      "id": "ds-main-header",
      "title": "AI and Data Scientist Roadmap",
      "type": "main",
      "description": "Step by step roadmap guide to becoming an AI and Data Scientist in 2026",
      "statusEnabled": false
    },
    {
      "id": "ds-prereq-python",
      "title": "Python for Data Analysis",
      "type": "navigation",
      "description": "Prerequisite track: Python programming for data handling and analysis.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/python-data-analysis",
      "link": "https://roadmap.sh/python-data-analysis"
    },
    {
      "id": "ds-prereq-sql",
      "title": "SQL Roadmap",
      "type": "navigation",
      "description": "Prerequisite track: SQL queries, joins, indexing, and data retrieval.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/sql",
      "link": "https://roadmap.sh/sql"
    },
    {
      "id": "aStaDENn5PhEa-cFvNzXa",
      "title": "Mathematics",
      "type": "topic",
      "description": "Linear Algebra, Calculus, Mathematical Analysis, and Differential Calculus for AI and Data Science.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "gWMvD83hVXeTmCuHGIiOL",
      "title": "Linear Algebra, Calculus, Mathematical Analysis",
      "type": "subtopic",
      "description": "Vectors, matrices, matrix multiplication, derivatives, integrals, and vector calculus.",
      "parentId": "aStaDENn5PhEa-cFvNzXa",
      "parentTitle": "Mathematics",
      "statusEnabled": true
    },
    {
      "id": "mwPJh33MEUQ4Co_LiVEOb",
      "title": "Differential Calculus",
      "type": "subtopic",
      "description": "Partial derivatives, gradients, Jacobian, Hessian matrices, and optimization techniques.",
      "parentId": "aStaDENn5PhEa-cFvNzXa",
      "parentTitle": "Mathematics",
      "statusEnabled": true
    },
    {
      "id": "4WZL_fzJ3cZdWLLDoWN8D",
      "title": "Statistics",
      "type": "topic",
      "description": "Central Limit Theorem, Hypothesis Testing, Probability, Sampling, A/B Testing, and Test Sensitivity.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "Y9YJdARIRqqCBCy3GVYdA",
      "title": "Statistics, CLT",
      "type": "subtopic",
      "description": "Descriptive statistics, distributions, standard deviation, and Central Limit Theorem.",
      "parentId": "4WZL_fzJ3cZdWLLDoWN8D",
      "parentTitle": "Statistics",
      "statusEnabled": true
    },
    {
      "id": "XJXIkWVDIrPJ-bVIvX0ZO",
      "title": "Hypothesis Testing",
      "type": "subtopic",
      "description": "t-tests, z-tests, p-values, null hypothesis, Type I and Type II errors.",
      "parentId": "4WZL_fzJ3cZdWLLDoWN8D",
      "parentTitle": "Statistics",
      "statusEnabled": true
    },
    {
      "id": "jxJtwbiCvxHqmkWkE7zdx",
      "title": "Probability and Sampling",
      "type": "subtopic",
      "description": "Conditional probability, Bayes theorem, random variables, sampling methods, and confidence intervals.",
      "parentId": "4WZL_fzJ3cZdWLLDoWN8D",
      "parentTitle": "Statistics",
      "statusEnabled": true
    },
    {
      "id": "mJq9b50MJM9o9dLhx40iN",
      "title": "AB Testing",
      "type": "subtopic",
      "description": "Designing, running, and evaluating online controlled experiments.",
      "parentId": "4WZL_fzJ3cZdWLLDoWN8D",
      "parentTitle": "Statistics",
      "statusEnabled": true
    },
    {
      "id": "v68nwX914qCwHDSwY_ZhG",
      "title": "Increasing Test Sensitivity",
      "type": "subtopic",
      "description": "Minimum detectable effect (MDE), CUPED, CUPAC, and stratification techniques.",
      "parentId": "4WZL_fzJ3cZdWLLDoWN8D",
      "parentTitle": "Statistics",
      "statusEnabled": true
    },
    {
      "id": "n2JFGwFxTuOviW6kHO1Uv",
      "title": "Ratio Metrics",
      "type": "subtopic",
      "description": "Delta method, ratio metric evaluation, and variance estimation.",
      "parentId": "4WZL_fzJ3cZdWLLDoWN8D",
      "parentTitle": "Statistics",
      "statusEnabled": true
    },
    {
      "id": "Gd2egqKZPnbPW1W2jw4j8",
      "title": "Econometrics",
      "type": "topic",
      "description": "Regression analysis, time series forecasting, ARIMA, and distribution fitting.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "y6xXsc-uSAmRDnNuyhqH2",
      "title": "Pre-requisites of Econometrics",
      "type": "subtopic",
      "description": "Statistical modeling foundations, assumptions of linear models, and econometric theorems.",
      "parentId": "Gd2egqKZPnbPW1W2jw4j8",
      "parentTitle": "Econometrics",
      "statusEnabled": true
    },
    {
      "id": "h19k9Fn5XPh3_pKEC8Ftp",
      "title": "Regression, Timeseries, Fitting Distributions",
      "type": "subtopic",
      "description": "OLS regression, ARIMA models, stationarity, autocorrelation, and forecasting.",
      "parentId": "Gd2egqKZPnbPW1W2jw4j8",
      "parentTitle": "Econometrics",
      "statusEnabled": true
    },
    {
      "id": "XLDWuSt4tI4gnmqMFdpmy",
      "title": "Coding",
      "type": "topic",
      "description": "Python, Data Structures, Algorithms, and SQL programming for Data Science.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "MVrAqizgkoAs2aghN8TgV",
      "title": "Learn Python Programming Language",
      "type": "subtopic",
      "description": "Python syntax, OOP, virtual environments, data structures, and packages.",
      "parentId": "XLDWuSt4tI4gnmqMFdpmy",
      "parentTitle": "Coding",
      "statusEnabled": true
    },
    {
      "id": "StBCykpzpM4g9PRFeSNXa",
      "title": "Data Structures and Algorithms (Python)",
      "type": "subtopic",
      "description": "Arrays, hash maps, trees, sorting, searching, and time/space complexity.",
      "parentId": "XLDWuSt4tI4gnmqMFdpmy",
      "parentTitle": "Coding",
      "statusEnabled": true
    },
    {
      "id": "Im0tXXn3GC-FUq2aMHgwm",
      "title": "Learn SQL",
      "type": "subtopic",
      "description": "SELECT queries, JOINs, aggregations, window functions, and CTEs.",
      "parentId": "XLDWuSt4tI4gnmqMFdpmy",
      "parentTitle": "Coding",
      "statusEnabled": true
    },
    {
      "id": "l1027SBZxTHKzqWw98Ee-",
      "title": "Exploratory Data Analysis",
      "type": "topic",
      "description": "Data understanding, data cleaning, analysis, and visualization using Pandas, Seaborn, and Matplotlib.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "JaN8YhMeN3whAe2TCXvw9",
      "title": "Data understanding, Data Analysis and Visualization",
      "type": "subtopic",
      "description": "Exploratory plots, feature distributions, correlation matrices, and handling missing data.",
      "parentId": "l1027SBZxTHKzqWw98Ee-",
      "parentTitle": "Exploratory Data Analysis",
      "statusEnabled": true
    },
    {
      "id": "kBdt_t2SvVsY3blfubWIz",
      "title": "Machine Learning",
      "type": "topic",
      "description": "Supervised learning, unsupervised learning, ensemble methods, decision trees, and neural networks.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "critical"
    },
    {
      "id": "FdBih8tlGPPy97YWq463y",
      "title": "Classic ML (Sup., Unsup.), Advanced ML (Ensembles, NNs)",
      "type": "subtopic",
      "description": "Linear models, Random Forests, XGBoost, K-Means, PCA, cross-validation, and hyperparameter tuning.",
      "parentId": "kBdt_t2SvVsY3blfubWIz",
      "parentTitle": "Machine Learning",
      "statusEnabled": true
    },
    {
      "id": "cjvVLN0XjrKPn6o20oMmc",
      "title": "Deep Learning",
      "type": "topic",
      "description": "Fully connected neural networks, CNNs, RNNs, LSTMs, Transformers, and Transfer Learning.",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "critical"
    },
    {
      "id": "eOFoGKveaHaBm_6ppJUtA",
      "title": "Fully Connected, CNN, RNN, LSTM, Transformers, TL",
      "type": "subtopic",
      "description": "PyTorch, TensorFlow, Attention mechanisms, backpropagation, and pre-trained models.",
      "parentId": "cjvVLN0XjrKPn6o20oMmc",
      "parentTitle": "Deep Learning",
      "statusEnabled": true
    },
    {
      "id": "Qa85hEVe2kz62k9Pj4QCA",
      "title": "MLOps",
      "type": "topic",
      "description": "Model deployment, tracking, monitoring, CI/CD for Machine Learning models.",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "high"
    },
    {
      "id": "uPzzUpI0--7OWDfNeBIjt",
      "title": "Deployment Models, CI/CD",
      "type": "subtopic",
      "description": "Model serving APIs, Docker, MLflow, model monitoring, and automated retraining pipelines.",
      "parentId": "Qa85hEVe2kz62k9Pj4QCA",
      "parentTitle": "MLOps",
      "statusEnabled": true
    },
    {
      "id": "SWEAVNGiQp5sTm3NWp4n5",
      "title": "AI Engineering",
      "type": "topic",
      "description": "Prompt Engineering, Large Language Models (LLMs), RAG (Retrieval-Augmented Generation), AI Agents, and Fine-tuning.",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "critical"
    },
    {
      "id": "u7jmgvZYpKSzu9t7e0ACh",
      "title": "Prompt Engineering, LLMs, RAG, Agents, Fine-tuning",
      "type": "subtopic",
      "description": "Building LLM applications, vector databases, LangChain, LlamaIndex, and model fine-tuning.",
      "parentId": "SWEAVNGiQp5sTm3NWp4n5",
      "parentTitle": "AI Engineering",
      "statusEnabled": true
    },
    {
      "id": "ILGi2zpuyTGfkyZjua9jv",
      "title": "Vibe Coding",
      "type": "topic",
      "description": "AI Coding Assistants (Claude Code, GitHub Copilot) and AI App Builders.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "medium"
    },
    {
      "id": "zX4rhaEsjEuRAWWY83Sae",
      "title": "AI Coding Assitants, AI App Builders",
      "type": "subtopic",
      "description": "Leveraging AI agentic workflows, prompt-driven code generation, and AI-assisted development tools.",
      "parentId": "ILGi2zpuyTGfkyZjua9jv",
      "parentTitle": "Vibe Coding",
      "statusEnabled": true
    }
  ],
  "relatedRoadmaps": [
    {
      "id": "r-python",
      "title": "Python for Data Analysis",
      "slug": "python-data-analysis",
      "url": "https://roadmap.sh/python-data-analysis"
    },
    {
      "id": "r-sql",
      "title": "SQL Roadmap",
      "slug": "sql",
      "url": "https://roadmap.sh/sql"
    },
    {
      "id": "r-data-analyst",
      "title": "Data Analyst",
      "slug": "data-analyst",
      "url": "https://roadmap.sh/data-analyst"
    },
    {
      "id": "r-ai-engineer",
      "title": "AI Engineer Roadmap",
      "slug": "ai-engineer",
      "url": "https://roadmap.sh/ai-engineer"
    },
    {
      "id": "r-machine-learning",
      "title": "Machine Learning",
      "slug": "machine-learning",
      "url": "https://roadmap.sh/machine-learning"
    }
  ]
};
