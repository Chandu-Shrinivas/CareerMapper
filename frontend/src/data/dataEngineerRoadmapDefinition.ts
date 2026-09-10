import type { RoadmapDefinition } from '../types/roadmap';

export const DATA_ENGINEER_ROADMAP_DEFINITION: RoadmapDefinition = {
  "id": "data-engineer",
  "slug": "data-engineer",
  "title": "Data Engineer",
  "version": "2026.1",
  "description": "Step by step guide to becoming a Data Engineer in 2026: Data Warehousing, PySpark, Airflow, Kafka, dbt, Cloud Data Lakes, and Data Modeling.",
  "nodes": [
    {
      "id": "de-main-header",
      "title": "Data Engineer",
      "type": "main",
      "description": "Step by step guide to becoming a Data Engineer in 2026: Data Warehousing, PySpark, Airflow, Kafka, dbt, Cloud Data Lakes, and Data Modeling.",
      "statusEnabled": false
    },
    {
      "id": "de-prereq-python",
      "title": "Python for Data Analysis",
      "type": "navigation",
      "description": "Prerequisite track: Python programming for data handling and analysis.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/python-data-analysis",
      "link": "https://roadmap.sh/python-data-analysis"
    },
    {
      "id": "de-prereq-sql",
      "title": "SQL Roadmap",
      "type": "navigation",
      "description": "Prerequisite track: SQL queries, joins, indexing, and relational database management.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/sql",
      "link": "https://roadmap.sh/sql"
    },
    {
      "id": "de-topic-intro",
      "title": "Introduction",
      "type": "topic",
      "description": "Foundational concepts of data engineering, roles, responsibilities, and choosing the right technologies.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "de-subtopic-intro-whatis",
      "title": "What is Data Engineering?",
      "type": "subtopic",
      "description": "Designing, building, and maintaining data architecture, pipelines, and data storage systems.",
      "parentId": "de-topic-intro",
      "parentTitle": "Introduction",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-intro-vs-ds",
      "title": "Data Engineering vs Data Science",
      "type": "subtopic",
      "description": "Data engineers build data infrastructure and pipelines; data scientists analyze data and build predictive models.",
      "parentId": "de-topic-intro",
      "parentTitle": "Introduction",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-intro-skills",
      "title": "Skills and Responsibilities",
      "type": "subtopic",
      "description": "Core competencies including distributed systems, data modeling, SQL/NoSQL, ETL/ELT pipelines, and cloud computing.",
      "parentId": "de-topic-intro",
      "parentTitle": "Introduction",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-intro-lifecycle",
      "title": "Data Engineering Lifecycle",
      "type": "subtopic",
      "description": "Overview of stages: Generation, Storage, Ingestion, and Serving.",
      "parentId": "de-topic-intro",
      "parentTitle": "Introduction",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-intro-tech",
      "title": "Choosing the Right Technologies",
      "type": "subtopic",
      "description": "Evaluating data volume, velocity, variety, latency, cost, and team skill set when selecting tech stacks.",
      "parentId": "de-topic-intro",
      "parentTitle": "Introduction",
      "statusEnabled": true
    },
    {
      "id": "de-topic-basics",
      "title": "Learn the Basics",
      "type": "topic",
      "description": "Core programming skills, data structures, algorithms, git, Linux, and networking basics.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical",
      "prerequisites": [
        "de-topic-intro"
      ]
    },
    {
      "id": "de-subtopic-prog-python",
      "title": "Python (Recommended)",
      "type": "subtopic",
      "description": "Primary programming language for data engineering pipelines, scripting, and PySpark.",
      "parentId": "de-topic-basics",
      "parentTitle": "Learn the Basics",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-prog-java",
      "title": "Java",
      "type": "subtopic",
      "description": "JVM language used in big data processing frameworks like Apache Hadoop, Kafka, and Flink.",
      "parentId": "de-topic-basics",
      "parentTitle": "Learn the Basics",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-prog-scala",
      "title": "Scala",
      "type": "subtopic",
      "description": "Functional JVM language used natively in Apache Spark and Kafka ecosystem.",
      "parentId": "de-topic-basics",
      "parentTitle": "Learn the Basics",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-prog-go",
      "title": "Go",
      "type": "subtopic",
      "description": "Compiled language popular for microservices, cloud infrastructure, and CLI tooling.",
      "parentId": "de-topic-basics",
      "parentTitle": "Learn the Basics",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-dsa",
      "title": "Data Structures and Algorithms",
      "type": "subtopic",
      "description": "Arrays, hash tables, trees, queues, sorting, searching, and algorithmic complexity for efficient data processing.",
      "parentId": "de-topic-basics",
      "parentTitle": "Learn the Basics",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-git",
      "title": "Git and GitHub",
      "type": "subtopic",
      "description": "Version control, branching strategies, code reviews, and CI/CD collaboration.",
      "parentId": "de-topic-basics",
      "parentTitle": "Learn the Basics",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-linux",
      "title": "Linux Basics",
      "type": "subtopic",
      "description": "Shell navigation, file permissions, environment variables, system monitoring, and bash scripting.",
      "parentId": "de-topic-basics",
      "parentTitle": "Learn the Basics",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-networking",
      "title": "Networking Fundamentals",
      "type": "subtopic",
      "description": "TCP/IP, HTTP/HTTPS, DNS, SSH, ports, firewalls, and VPC networking.",
      "parentId": "de-topic-basics",
      "parentTitle": "Learn the Basics",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-distributed-basics",
      "title": "Distributed Systems Basics",
      "type": "subtopic",
      "description": "Consensus, partitioning, replication, RPC, fault tolerance, and CAP theorem.",
      "parentId": "de-topic-basics",
      "parentTitle": "Learn the Basics",
      "statusEnabled": true
    },
    {
      "id": "de-topic-generation",
      "title": "Data Generation",
      "type": "topic",
      "description": "Sources of data and data collection considerations across databases, APIs, logs, apps, and IoT.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high",
      "prerequisites": [
        "de-topic-basics"
      ]
    },
    {
      "id": "de-subtopic-sources-database",
      "title": "Database Sources",
      "type": "subtopic",
      "description": "OLTP transactional databases emitting change logs and table dumps.",
      "parentId": "de-topic-generation",
      "parentTitle": "Data Generation",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-sources-apis",
      "title": "APIs & Webhooks",
      "type": "subtopic",
      "description": "Consuming REST, GraphQL, and webhook payloads from third-party services.",
      "parentId": "de-topic-generation",
      "parentTitle": "Data Generation",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-sources-logs",
      "title": "Logs & Telemetry",
      "type": "subtopic",
      "description": "Application logs, web server access logs, syslogs, and metric streams.",
      "parentId": "de-topic-generation",
      "parentTitle": "Data Generation",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-sources-mobile-iot",
      "title": "Mobile Apps & IoT Data",
      "type": "subtopic",
      "description": "High-velocity clickstream events, mobile analytics, and IoT sensor metrics.",
      "parentId": "de-topic-generation",
      "parentTitle": "Data Generation",
      "statusEnabled": true
    },
    {
      "id": "de-topic-storage",
      "title": "Data Storage",
      "type": "topic",
      "description": "Database fundamentals, relational databases, NoSQL databases, and schema design patterns.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "critical",
      "prerequisites": [
        "de-topic-generation"
      ]
    },
    {
      "id": "de-subtopic-db-fundamentals",
      "title": "Database Fundamentals",
      "type": "subtopic",
      "description": "Data normalization, modeling techniques, CAP theorem, OLTP vs OLAP, SCD, and scaling.",
      "parentId": "de-topic-storage",
      "parentTitle": "Data Storage",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-rdbms",
      "title": "Relational Databases",
      "type": "subtopic",
      "description": "SQL, indexing, transactions, MySQL, PostgreSQL, MariaDB, Aurora DB, Oracle, MS SQL.",
      "parentId": "de-topic-storage",
      "parentTitle": "Data Storage",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-nosql",
      "title": "NoSQL Databases",
      "type": "subtopic",
      "description": "Document (MongoDB, ElasticSearch), Column (Cassandra, BigTable, HBase), Graph (Neo4j), Key-Value (Redis, DynamoDB).",
      "parentId": "de-topic-storage",
      "parentTitle": "Data Storage",
      "statusEnabled": true
    },
    {
      "id": "de-topic-warehousing",
      "title": "Data Warehousing & Data Lakes",
      "type": "topic",
      "description": "Data warehouse architectures (BigQuery, Snowflake, Redshift), Data Marts, Data Mesh, and Data Lakes (Databricks, Delta Lake).",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "critical",
      "prerequisites": [
        "de-topic-storage"
      ]
    },
    {
      "id": "de-subtopic-dwh-arch",
      "title": "Data Warehousing Architectures",
      "type": "subtopic",
      "description": "Google BigQuery, Snowflake, Amazon Redshift, Data Mart, Data Mesh, Data Fabric.",
      "parentId": "de-topic-warehousing",
      "parentTitle": "Data Warehousing & Data Lakes",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-data-lake",
      "title": "Data Lakes & Formats",
      "type": "subtopic",
      "description": "Databricks Delta Lake, Apache Iceberg, Apache Hudi, Snowflake, Onehouse, Parquet, and ORC.",
      "parentId": "de-topic-warehousing",
      "parentTitle": "Data Warehousing & Data Lakes",
      "statusEnabled": true
    },
    {
      "id": "de-topic-cloud",
      "title": "Cloud Computing",
      "type": "topic",
      "description": "Cloud data architectures across AWS (EC2, S3, RDS, Glue), Azure (Blob, Data Factory, SQL DB), and GCP (Compute, GCS, Cloud SQL, Dataflow).",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high",
      "prerequisites": [
        "de-topic-warehousing"
      ]
    },
    {
      "id": "de-subtopic-cloud-aws",
      "title": "AWS Data Platform",
      "type": "subtopic",
      "description": "Amazon EC2, S3 storage, Amazon RDS, EMR, and AWS Glue ETL.",
      "parentId": "de-topic-cloud",
      "parentTitle": "Cloud Computing",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-cloud-azure",
      "title": "Azure Data Platform",
      "type": "subtopic",
      "description": "Azure Blob Storage, Azure SQL Database, Azure Data Lake Storage, and Azure Data Factory.",
      "parentId": "de-topic-cloud",
      "parentTitle": "Cloud Computing",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-cloud-gcp",
      "title": "Google Cloud Data Platform",
      "type": "subtopic",
      "description": "Google Compute Engine, Google Cloud Storage, Cloud SQL, BigQuery, and Dataflow.",
      "parentId": "de-topic-cloud",
      "parentTitle": "Cloud Computing",
      "statusEnabled": true
    },
    {
      "id": "de-topic-ingestion",
      "title": "Data Ingestion & Pipelines",
      "type": "topic",
      "description": "Ingestion patterns (Batch, Hybrid, Streaming, Realtime), ETL/ELT processes, and orchestration tools (Apache Airflow, dbt, Luigi, Prefect).",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "critical",
      "prerequisites": [
        "de-topic-cloud"
      ]
    },
    {
      "id": "de-subtopic-ingestion-types",
      "title": "Types of Data Ingestion",
      "type": "subtopic",
      "description": "Batch processing, hybrid ingestion, streaming processing, and real-time CDC ingestion.",
      "parentId": "de-topic-ingestion",
      "parentTitle": "Data Ingestion & Pipelines",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-etl-process",
      "title": "ETL vs ELT Process",
      "type": "subtopic",
      "description": "Extracting from source, transforming data using distributed compute, and loading into analytical target stores.",
      "parentId": "de-topic-ingestion",
      "parentTitle": "Data Ingestion & Pipelines",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-pipeline-tools",
      "title": "Data Pipeline & Orchestration Tools",
      "type": "subtopic",
      "description": "Apache Airflow, dbt (data build tool), Luigi, Dagster, and Prefect.",
      "parentId": "de-topic-ingestion",
      "parentTitle": "Data Ingestion & Pipelines",
      "statusEnabled": true
    },
    {
      "id": "de-topic-bigdata",
      "title": "Big Data Tools & Cluster Computing",
      "type": "topic",
      "description": "Cluster computing fundamentals, Hadoop ecosystem (HDFS, MapReduce, YARN), and Apache Spark.",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "critical",
      "prerequisites": [
        "de-topic-ingestion"
      ]
    },
    {
      "id": "de-subtopic-cluster-basics",
      "title": "Cluster Computing & Distributed File Systems",
      "type": "subtopic",
      "description": "HDFS, cluster resource management, job scheduling, and node orchestration.",
      "parentId": "de-topic-bigdata",
      "parentTitle": "Big Data Tools & Cluster Computing",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-spark",
      "title": "Apache Spark & PySpark",
      "type": "subtopic",
      "description": "Distributed dataframes, RDDs, Spark SQL, Spark Streaming, memory management, and optimization.",
      "parentId": "de-topic-bigdata",
      "parentTitle": "Big Data Tools & Cluster Computing",
      "statusEnabled": true
    },
    {
      "id": "de-topic-containers-devops",
      "title": "Containers, Orchestration & CI/CD",
      "type": "topic",
      "description": "Docker containerization, Kubernetes, managed K8s (GKE, EKS), CI/CD (GitLab, GitHub Actions), IaC (Terraform), and Monitoring.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high",
      "prerequisites": [
        "de-topic-bigdata"
      ]
    },
    {
      "id": "de-subtopic-containers",
      "title": "Containers & Orchestration",
      "type": "subtopic",
      "description": "Docker, Kubernetes, Google Cloud GKE, and AWS EKS for deploying scalable data services.",
      "parentId": "de-topic-containers-devops",
      "parentTitle": "Containers, Orchestration & CI/CD",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-cicd-iac",
      "title": "CI/CD & Infrastructure as Code (IaC)",
      "type": "subtopic",
      "description": "GitLab CI, GitHub Actions, Terraform, OpenTofu, AWS CDK, and Google Deployment Manager.",
      "parentId": "de-topic-containers-devops",
      "parentTitle": "Containers, Orchestration & CI/CD",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-monitoring",
      "title": "Monitoring & Observability",
      "type": "subtopic",
      "description": "Prometheus, Datadog, Sentry, New Relic, and data observability platforms.",
      "parentId": "de-topic-containers-devops",
      "parentTitle": "Containers, Orchestration & CI/CD",
      "statusEnabled": true
    },
    {
      "id": "de-topic-messaging",
      "title": "Messaging Systems & Event Streams",
      "type": "topic",
      "description": "Asynchronous messaging, streams vs queues, and event platforms (Apache Kafka, RabbitMQ, AWS SQS/SNS).",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "critical",
      "prerequisites": [
        "de-topic-containers-devops"
      ]
    },
    {
      "id": "de-subtopic-kafka",
      "title": "Apache Kafka & Event Streaming",
      "type": "subtopic",
      "description": "Topics, partitions, consumer groups, brokers, Kafka Connect, and Schema Registry.",
      "parentId": "de-topic-messaging",
      "parentTitle": "Messaging Systems & Event Streams",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-rabbitmq-sqs",
      "title": "RabbitMQ, AWS SQS & SNS",
      "type": "subtopic",
      "description": "Message queue brokers, pub/sub architecture, dead letter queues, and fan-out patterns.",
      "parentId": "de-topic-messaging",
      "parentTitle": "Messaging Systems & Event Streams",
      "statusEnabled": true
    },
    {
      "id": "de-topic-serving",
      "title": "Data Serving & Business Intelligence",
      "type": "topic",
      "description": "Serving data to analytical applications, BI tools (Power BI, Tableau, Looker, Streamlit), and Reverse ETL (Hightouch, Census, Segment).",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "medium",
      "prerequisites": [
        "de-topic-messaging"
      ]
    },
    {
      "id": "de-subtopic-bi-tools",
      "title": "BI & Analytics Tools",
      "type": "subtopic",
      "description": "Microsoft Power BI, Streamlit, Tableau, and Looker for reporting and executive dashboards.",
      "parentId": "de-topic-serving",
      "parentTitle": "Data Serving & Business Intelligence",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-reverse-etl",
      "title": "Reverse ETL",
      "type": "subtopic",
      "description": "Syncing transformed data from data warehouses back into operational SaaS tools (Hightouch, Census, Segment).",
      "parentId": "de-topic-serving",
      "parentTitle": "Data Serving & Business Intelligence",
      "statusEnabled": true
    },
    {
      "id": "de-topic-governance",
      "title": "Security, Governance & Regulations",
      "type": "topic",
      "description": "Data encryption, RBAC, data masking, data quality, data lineage, metadata management, GDPR, ECPA, and EU AI Act.",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "high",
      "prerequisites": [
        "de-topic-serving"
      ]
    },
    {
      "id": "de-subtopic-sec-masking",
      "title": "Data Security & Masking",
      "type": "subtopic",
      "description": "Authentication vs authorization, encryption at rest/in transit, tokenization, data masking, and obfuscation.",
      "parentId": "de-topic-governance",
      "parentTitle": "Security, Governance & Regulations",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-quality-lineage",
      "title": "Data Quality & Data Lineage",
      "type": "subtopic",
      "description": "Great Expectations, data cataloging, metadata management, lineage tracking, and data interoperability.",
      "parentId": "de-topic-governance",
      "parentTitle": "Security, Governance & Regulations",
      "statusEnabled": true
    },
    {
      "id": "de-subtopic-privacy-regulations",
      "title": "Privacy & Data Regulations",
      "type": "subtopic",
      "description": "GDPR compliance, ECPA, EU AI Act, and data protection regulations.",
      "parentId": "de-topic-governance",
      "parentTitle": "Security, Governance & Regulations",
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
      "id": "r-ai-data-scientist",
      "title": "AI & Data Scientist",
      "slug": "ai-data-scientist",
      "url": "https://roadmap.sh/ai-data-scientist"
    },
    {
      "id": "r-devops",
      "title": "DevOps Roadmap",
      "slug": "devops",
      "url": "https://roadmap.sh/devops"
    },
    {
      "id": "r-mlops",
      "title": "MLOps Roadmap",
      "slug": "mlops",
      "url": "https://roadmap.sh/mlops"
    }
  ]
};
