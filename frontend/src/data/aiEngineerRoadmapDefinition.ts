import type { RoadmapDefinition } from '../types/roadmap';

export const AI_ENGINEER_ROADMAP_DEFINITION: RoadmapDefinition = {
  "id": "ai-engineer",
  "slug": "ai-engineer",
  "title": "AI Engineer",
  "version": "2026.1",
  "description": "Step by step guide to becoming an AI Engineer in 2026: LLMs, Prompt Engineering, RAG Pipelines, Vector DBs, AI Agents, and Model Deployment.",
  "nodes": [
    {
      "id": "ai-engineer-main-header",
      "title": "AI Engineer",
      "type": "main",
      "description": "Step by step guide to becoming an AI Engineer in 2026: LLMs, Prompt Engineering, RAG Pipelines, Vector DBs, AI Agents, and Model Deployment.",
      "statusEnabled": false
    },
    {
      "id": "ai-engineer-topic-1",
      "title": "AI Fundamentals & Pre-trained Models",
      "type": "topic",
      "description": "Overview of AI Engineering, foundation models, APIs (OpenAI, Anthropic, Gemini, Groq), and open-source HuggingFace models.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "ai-engineer-subtopic-1-1",
      "title": "LLM Architectures & Transformers",
      "type": "subtopic",
      "description": "Key subtopic concept: LLM Architectures & Transformers",
      "parentId": "ai-engineer-topic-1",
      "parentTitle": "AI Fundamentals & Pre-trained Models",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-1-2",
      "title": "OpenAI, Anthropic & Gemini APIs",
      "type": "subtopic",
      "description": "Key subtopic concept: OpenAI, Anthropic & Gemini APIs",
      "parentId": "ai-engineer-topic-1",
      "parentTitle": "AI Fundamentals & Pre-trained Models",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-1-3",
      "title": "Hugging Face Model Hub",
      "type": "subtopic",
      "description": "Key subtopic concept: Hugging Face Model Hub",
      "parentId": "ai-engineer-topic-1",
      "parentTitle": "AI Fundamentals & Pre-trained Models",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-1-4",
      "title": "Tokenization & Context Windows",
      "type": "subtopic",
      "description": "Key subtopic concept: Tokenization & Context Windows",
      "parentId": "ai-engineer-topic-1",
      "parentTitle": "AI Fundamentals & Pre-trained Models",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-topic-2",
      "title": "Prompt Engineering & Advanced Techniques",
      "type": "topic",
      "description": "Designing effective prompts, Few-shot prompting, Chain-of-Thought, System Instructions, and Structured Outputs.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "ai-engineer-subtopic-2-1",
      "title": "Chain-of-Thought (CoT) Prompting",
      "type": "subtopic",
      "description": "Key subtopic concept: Chain-of-Thought (CoT) Prompting",
      "parentId": "ai-engineer-topic-2",
      "parentTitle": "Prompt Engineering & Advanced Techniques",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-2-2",
      "title": "Few-Shot & In-Context Learning",
      "type": "subtopic",
      "description": "Key subtopic concept: Few-Shot & In-Context Learning",
      "parentId": "ai-engineer-topic-2",
      "parentTitle": "Prompt Engineering & Advanced Techniques",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-2-3",
      "title": "Structured Outputs (JSON/Zod Schema)",
      "type": "subtopic",
      "description": "Key subtopic concept: Structured Outputs (JSON/Zod Schema)",
      "parentId": "ai-engineer-topic-2",
      "parentTitle": "Prompt Engineering & Advanced Techniques",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-2-4",
      "title": "Prompt Evaluation & Guardrails",
      "type": "subtopic",
      "description": "Key subtopic concept: Prompt Evaluation & Guardrails",
      "parentId": "ai-engineer-topic-2",
      "parentTitle": "Prompt Engineering & Advanced Techniques",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-topic-3",
      "title": "Retrieval-Augmented Generation (RAG)",
      "type": "topic",
      "description": "Connecting LLMs to external knowledge bases using chunking, embeddings, vector search, and reranking.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "ai-engineer-subtopic-3-1",
      "title": "Document Chunking & Preprocessing",
      "type": "subtopic",
      "description": "Key subtopic concept: Document Chunking & Preprocessing",
      "parentId": "ai-engineer-topic-3",
      "parentTitle": "Retrieval-Augmented Generation (RAG)",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-3-2",
      "title": "Embedding Models (OpenAI/Voyage)",
      "type": "subtopic",
      "description": "Key subtopic concept: Embedding Models (OpenAI/Voyage)",
      "parentId": "ai-engineer-topic-3",
      "parentTitle": "Retrieval-Augmented Generation (RAG)",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-3-3",
      "title": "Vector Databases (Chroma/Pinecone)",
      "type": "subtopic",
      "description": "Key subtopic concept: Vector Databases (Chroma/Pinecone)",
      "parentId": "ai-engineer-topic-3",
      "parentTitle": "Retrieval-Augmented Generation (RAG)",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-3-4",
      "title": "Hybrid Search & Reranking (Cohere)",
      "type": "subtopic",
      "description": "Key subtopic concept: Hybrid Search & Reranking (Cohere)",
      "parentId": "ai-engineer-topic-3",
      "parentTitle": "Retrieval-Augmented Generation (RAG)",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-topic-4",
      "title": "AI Agents & Autonomous Workflows",
      "type": "topic",
      "description": "Building multi-step AI agents with tool use, function calling, memory, and orchestration frameworks.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "ai-engineer-subtopic-4-1",
      "title": "Function Calling & Tool Execution",
      "type": "subtopic",
      "description": "Key subtopic concept: Function Calling & Tool Execution",
      "parentId": "ai-engineer-topic-4",
      "parentTitle": "AI Agents & Autonomous Workflows",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-4-2",
      "title": "LangChain & LangGraph Orchestration",
      "type": "subtopic",
      "description": "Key subtopic concept: LangChain & LangGraph Orchestration",
      "parentId": "ai-engineer-topic-4",
      "parentTitle": "AI Agents & Autonomous Workflows",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-4-3",
      "title": "LlamaIndex Agent Workflows",
      "type": "subtopic",
      "description": "Key subtopic concept: LlamaIndex Agent Workflows",
      "parentId": "ai-engineer-topic-4",
      "parentTitle": "AI Agents & Autonomous Workflows",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-4-4",
      "title": "Agent Memory & Reflection Loops",
      "type": "subtopic",
      "description": "Key subtopic concept: Agent Memory & Reflection Loops",
      "parentId": "ai-engineer-topic-4",
      "parentTitle": "AI Agents & Autonomous Workflows",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-topic-5",
      "title": "Fine-Tuning & Model Optimization",
      "type": "topic",
      "description": "Adapting open-source LLMs to custom domain datasets using PEFT, LoRA, QLoRA, and quantization.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "ai-engineer-subtopic-5-1",
      "title": "LoRA & QLoRA Parameter Efficient Tuning",
      "type": "subtopic",
      "description": "Key subtopic concept: LoRA & QLoRA Parameter Efficient Tuning",
      "parentId": "ai-engineer-topic-5",
      "parentTitle": "Fine-Tuning & Model Optimization",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-5-2",
      "title": "Dataset Preparation & Formatting",
      "type": "subtopic",
      "description": "Key subtopic concept: Dataset Preparation & Formatting",
      "parentId": "ai-engineer-topic-5",
      "parentTitle": "Fine-Tuning & Model Optimization",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-5-3",
      "title": "Model Quantization (GGUF/AWQ)",
      "type": "subtopic",
      "description": "Key subtopic concept: Model Quantization (GGUF/AWQ)",
      "parentId": "ai-engineer-topic-5",
      "parentTitle": "Fine-Tuning & Model Optimization",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-5-4",
      "title": "Ollama & vLLM Local Inference",
      "type": "subtopic",
      "description": "Key subtopic concept: Ollama & vLLM Local Inference",
      "parentId": "ai-engineer-topic-5",
      "parentTitle": "Fine-Tuning & Model Optimization",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-topic-6",
      "title": "AI Application Deployment & Evaluation",
      "type": "topic",
      "description": "Building AI production backends, streaming UI components, tracing with LangSmith, and safety guardrails.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "ai-engineer-subtopic-6-1",
      "title": "Streaming Responses & WebSockets",
      "type": "subtopic",
      "description": "Key subtopic concept: Streaming Responses & WebSockets",
      "parentId": "ai-engineer-topic-6",
      "parentTitle": "AI Application Deployment & Evaluation",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-6-2",
      "title": "LangSmith & Phoenix Tracing",
      "type": "subtopic",
      "description": "Key subtopic concept: LangSmith & Phoenix Tracing",
      "parentId": "ai-engineer-topic-6",
      "parentTitle": "AI Application Deployment & Evaluation",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-6-3",
      "title": "Guardrails AI & Safety Checks",
      "type": "subtopic",
      "description": "Key subtopic concept: Guardrails AI & Safety Checks",
      "parentId": "ai-engineer-topic-6",
      "parentTitle": "AI Application Deployment & Evaluation",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-subtopic-6-4",
      "title": "FastAPI AI Microservices",
      "type": "subtopic",
      "description": "Key subtopic concept: FastAPI AI Microservices",
      "parentId": "ai-engineer-topic-6",
      "parentTitle": "AI Application Deployment & Evaluation",
      "statusEnabled": true
    },
    {
      "id": "ai-engineer-nav-1",
      "title": "Data Scientist",
      "type": "navigation",
      "description": "Explore the Data Scientist roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/data-scientist"
    },
    {
      "id": "ai-engineer-nav-2",
      "title": "Machine Learning Engineer",
      "type": "navigation",
      "description": "Explore the Machine Learning Engineer roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/machine-learning"
    }
  ],
  "badges": [],
  "relatedRoadmaps": []
};
