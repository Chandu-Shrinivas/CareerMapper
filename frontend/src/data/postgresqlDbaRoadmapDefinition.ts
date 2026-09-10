import type { RoadmapDefinition } from '../types/roadmap';

export const POSTGRESQL_DBA_ROADMAP_DEFINITION: RoadmapDefinition = {
  "id": "postgresql-dba",
  "slug": "postgresql-dba",
  "title": "PostgreSQL DBA",
  "version": "2026.1",
  "description": "Step by step guide to becoming a modern PostgreSQL DB Administrator in 2026: Administration, Performance Tuning, WAL Logging, Replication, and High Availability.",
  "nodes": [
    {
      "id": "pg-main-header",
      "title": "PostgreSQL DBA",
      "type": "main",
      "description": "Step by step guide to becoming a modern PostgreSQL DB Administrator in 2026: Administration, Performance Tuning, WAL Logging, Replication, and High Availability.",
      "statusEnabled": false
    },
    {
      "id": "pg-topic-intro",
      "title": "Introduction & Basic RDBMS Concepts",
      "type": "topic",
      "description": "Relational databases, RDBMS benefits and limitations, PostgreSQL vs NoSQL/other RDBMS, Object Model, and Relational Model.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "pg-subtopic-intro-whatis",
      "title": "What are Relational Databases?",
      "type": "subtopic",
      "description": "Tables, relationships, schema enforcement, data integrity, and SQL querying fundamentals.",
      "parentId": "pg-topic-intro",
      "parentTitle": "Introduction & Basic RDBMS Concepts",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-intro-benefits",
      "title": "RDBMS Benefits and Limitations",
      "type": "subtopic",
      "description": "ACID compliance, complex queries, joins, vs vertical/horizontal scaling limits.",
      "parentId": "pg-topic-intro",
      "parentTitle": "Introduction & Basic RDBMS Concepts",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-intro-vs-nosql",
      "title": "PostgreSQL vs NoSQL & Other RDBMS",
      "type": "subtopic",
      "description": "Comparing Postgres with MySQL, Oracle, MongoDB, and document/key-value stores.",
      "parentId": "pg-topic-intro",
      "parentTitle": "Introduction & Basic RDBMS Concepts",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-object-relational-model",
      "title": "Object Model & Relational Model",
      "type": "subtopic",
      "description": "Domains, attributes, tuples, relations, constraints, schemas, tables, rows, columns, and NULL handling.",
      "parentId": "pg-topic-intro",
      "parentTitle": "Introduction & Basic RDBMS Concepts",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-high-level-concepts",
      "title": "High Level Database Concepts (ACID, MVCC)",
      "type": "subtopic",
      "description": "ACID properties, Multi-Version Concurrency Control (MVCC), Transactions, Write-ahead Log (WAL), and Query Processing.",
      "parentId": "pg-topic-intro",
      "parentTitle": "Introduction & Basic RDBMS Concepts",
      "statusEnabled": true
    },
    {
      "id": "pg-topic-install-sql",
      "title": "Installation, Setup & SQL Mastery",
      "type": "topic",
      "description": "Installing Postgres (Docker, Package Managers, psql CLI, Cloud), Managing Postgres (systemd, pg_ctl), DDL, DML, COPY, and Advanced SQL.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical",
      "prerequisites": [
        "pg-topic-intro"
      ]
    },
    {
      "id": "pg-subtopic-install-managing",
      "title": "Installation & Managing Postgres",
      "type": "subtopic",
      "description": "Deploying via Docker, systemd services, pg_ctl, pg_ctlcluster, psql client, and cloud deployments.",
      "parentId": "pg-topic-install-sql",
      "parentTitle": "Installation, Setup & SQL Mastery",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-ddl-dml",
      "title": "DDL, DML & COPY Queries",
      "type": "subtopic",
      "description": "CREATING/ALTERING schemas and tables, data types, querying, filtering, joining, and bulk importing via COPY.",
      "parentId": "pg-topic-install-sql",
      "parentTitle": "Installation, Setup & SQL Mastery",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-advanced-sql",
      "title": "Advanced SQL (CTE, Subqueries, Lateral Join)",
      "type": "subtopic",
      "description": "Common Table Expressions (CTE), Subqueries, Grouping, Set Operations, Lateral Joins, and Window Functions.",
      "parentId": "pg-topic-install-sql",
      "parentTitle": "Installation, Setup & SQL Mastery",
      "statusEnabled": true
    },
    {
      "id": "pg-topic-configuring",
      "title": "Configuring postgresql.conf",
      "type": "topic",
      "description": "Resource usage, memory settings (shared_buffers, work_mem), WAL settings, autovacuum, query planner, and extensions.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "critical",
      "prerequisites": [
        "pg-topic-install-sql"
      ]
    },
    {
      "id": "pg-subtopic-config-resources-wal",
      "title": "Resource Usage & WAL Configuration",
      "type": "subtopic",
      "description": "Configuring shared_buffers, work_mem, maintenance_work_mem, max_connections, wal_level, and checkpoint_completion_target.",
      "parentId": "pg-topic-configuring",
      "parentTitle": "Configuring postgresql.conf",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-config-vacuum-planner",
      "title": "Vacuuming, Checkpoints & Query Planner",
      "type": "subtopic",
      "description": "Autovacuum thresholds, vacuum freeze, background writer, checkpoint intervals, and planner cost constants.",
      "parentId": "pg-topic-configuring",
      "parentTitle": "Configuring postgresql.conf",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-config-logging-ext",
      "title": "Logging, Statistics & Extensions",
      "type": "subtopic",
      "description": "log_destination, log_min_duration_statement, track_activities, and loading extra extensions (pg_stat_statements).",
      "parentId": "pg-topic-configuring",
      "parentTitle": "Configuring postgresql.conf",
      "statusEnabled": true
    },
    {
      "id": "pg-topic-security",
      "title": "Security & Access Control",
      "type": "topic",
      "description": "Role management, object privileges (GRANT/REVOKE), authentication (pg_hba.conf, SSL), Row-Level Security (RLS), and SELinux.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "critical",
      "prerequisites": [
        "pg-topic-configuring"
      ]
    },
    {
      "id": "pg-subtopic-security-roles-hba",
      "title": "Authentication, Roles & pg_hba.conf",
      "type": "subtopic",
      "description": "Managing roles/users, passwords, trust/md5/scram-sha-256 auth, pg_hba.conf rules, and SSL/TLS encryption.",
      "parentId": "pg-topic-security",
      "parentTitle": "Security & Access Control",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-security-privileges-rls",
      "title": "Privileges & Row-Level Security (RLS)",
      "type": "subtopic",
      "description": "GRANT/REVOKE privileges, default privileges, schema permissions, RLS policies, and OS security (SELinux/AppArmor).",
      "parentId": "pg-topic-security",
      "parentTitle": "Security & Access Control",
      "statusEnabled": true
    },
    {
      "id": "pg-topic-infrastructure",
      "title": "Infrastructure, Backups & High Availability",
      "type": "topic",
      "description": "Backup & recovery (pg_dump, pg_basebackup, barman, pgbackrest), replication (streaming, logical), PgBouncer pooling, HA (Patroni), and Kubernetes.",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "critical",
      "prerequisites": [
        "pg-topic-security"
      ]
    },
    {
      "id": "pg-subtopic-backups",
      "title": "Backup & Recovery Tools (Builtin & 3rd Party)",
      "type": "subtopic",
      "description": "Logical backups (pg_dump, pg_dumpall, pg_restore), physical backups (pg_basebackup), and tools (barman, WAL-G, pgbackrest, pg_probackup).",
      "parentId": "pg-topic-infrastructure",
      "parentTitle": "Infrastructure, Backups & High Availability",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-replication-ha",
      "title": "Replication, Pooling & High Availability",
      "type": "subtopic",
      "description": "Streaming replication, logical replication, PgBouncer connection pooling, Patroni cluster management, and Kubernetes operators.",
      "parentId": "pg-topic-infrastructure",
      "parentTitle": "Infrastructure, Backups & High Availability",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-upgrades-anonymization",
      "title": "Upgrades & Anonymization",
      "type": "subtopic",
      "description": "Major version upgrades using pg_upgrade and logical replication; data anonymization using PostgreSQL Anonymizer.",
      "parentId": "pg-topic-infrastructure",
      "parentTitle": "Infrastructure, Backups & High Availability",
      "statusEnabled": true
    },
    {
      "id": "pg-topic-internals-tuning",
      "title": "Low Level Internals & Tuning",
      "type": "topic",
      "description": "Postgres processes, memory architecture, buffer management, lock management, physical storage file layout, system catalog, and workload tuning (OLTP/OLAP).",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "high",
      "prerequisites": [
        "pg-topic-infrastructure"
      ]
    },
    {
      "id": "pg-subtopic-internals-storage",
      "title": "Processes, Memory & Physical Storage Layout",
      "type": "subtopic",
      "description": "Postgres backend processes, shared memory, buffer pool, heap files, TOAST tables, system catalog, and lock manager.",
      "parentId": "pg-topic-internals-tuning",
      "parentTitle": "Low Level Internals & Tuning",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-workload-tuning",
      "title": "Per-Database Tuning & Workload Customization",
      "type": "subtopic",
      "description": "ALTER USER/DATABASE SET parameters, storage parameters, and tuning for OLTP, OLAP, or HTAP workloads.",
      "parentId": "pg-topic-internals-tuning",
      "parentTitle": "Low Level Internals & Tuning",
      "statusEnabled": true
    },
    {
      "id": "pg-topic-plpgsql",
      "title": "Advanced SQL & PL/pgSQL",
      "type": "topic",
      "description": "PL/pgSQL procedural language, stored procedures, functions, triggers, recursive CTEs, and window functions.",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "high",
      "prerequisites": [
        "pg-topic-internals-tuning"
      ]
    },
    {
      "id": "pg-subtopic-plpgsql-functions-triggers",
      "title": "PL/pgSQL Functions & Triggers",
      "type": "subtopic",
      "description": "Writing PL/pgSQL functions, triggers, stored procedures, exception handling, and custom aggregates.",
      "parentId": "pg-topic-plpgsql",
      "parentTitle": "Advanced SQL & PL/pgSQL",
      "statusEnabled": true
    },
    {
      "id": "pg-topic-troubleshooting",
      "title": "Troubleshooting, Query Analysis & Profiling",
      "type": "topic",
      "description": "EXPLAIN ANALYZE, pg_stat_activity, pg_stat_statements, pgcenter, Depesz, PEV2, profiling (perf, gdb, strace, ebpf), and log analysis (pgBadger, pgCluu).",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "critical",
      "prerequisites": [
        "pg-topic-plpgsql"
      ]
    },
    {
      "id": "pg-subtopic-explain-analysis",
      "title": "Query Analysis (EXPLAIN, Depesz, PEV2)",
      "type": "subtopic",
      "description": "Reading EXPLAIN (ANALYZE, BUFFERS), cost estimation, plan nodes, Depesz, PEV2, and tensor explain tools.",
      "parentId": "pg-topic-troubleshooting",
      "parentTitle": "Troubleshooting, Query Analysis & Profiling",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-system-views-monitoring",
      "title": "Postgres System Views & Monitoring Tools",
      "type": "subtopic",
      "description": "pg_stat_activity, pg_stat_statements, pgcenter, Prometheus, Zabbix, check_pgactivity, and temBoard.",
      "parentId": "pg-topic-troubleshooting",
      "parentTitle": "Troubleshooting, Query Analysis & Profiling",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-log-analysis-profiling",
      "title": "Log Analysis & OS Profiling Tools",
      "type": "subtopic",
      "description": "Parsing logs with pgBadger, pgCluu, awk/grep/sed; OS profiling using top, sysstat, iotop, perf, gdb, strace, and eBPF.",
      "parentId": "pg-topic-troubleshooting",
      "parentTitle": "Troubleshooting, Query Analysis & Profiling",
      "statusEnabled": true
    },
    {
      "id": "pg-topic-optimization-indexes",
      "title": "SQL Optimization & Indexing",
      "type": "topic",
      "description": "SQL query & schema anti-patterns, index types (B-Tree, BRIN, GiST, GIN, SP-GiST, Hash), partial indexes, and expression indexes.",
      "statusEnabled": true,
      "difficulty": "advanced",
      "priority": "critical",
      "prerequisites": [
        "pg-topic-troubleshooting"
      ]
    },
    {
      "id": "pg-subtopic-index-types",
      "title": "Index Types & Use Cases",
      "type": "subtopic",
      "description": "Deep dive into B-Tree (default), BRIN (large sequential tables), GiST (geometric/full-text), GIN (jsonb/arrays), SP-GiST, and Hash indexes.",
      "parentId": "pg-topic-optimization-indexes",
      "parentTitle": "SQL Optimization & Indexing",
      "statusEnabled": true
    },
    {
      "id": "pg-subtopic-query-schema-patterns",
      "title": "Query & Schema Design Anti-Patterns",
      "type": "subtopic",
      "description": "Identifying inefficient joins, N+1 queries, unindexed foreign keys, table bloat, and improper data types.",
      "parentId": "pg-topic-optimization-indexes",
      "parentTitle": "SQL Optimization & Indexing",
      "statusEnabled": true
    }
  ],
  "relatedRoadmaps": [
    {
      "id": "r-mongodb",
      "title": "MongoDB Roadmap",
      "slug": "mongodb",
      "url": "https://roadmap.sh/mongodb"
    },
    {
      "id": "r-backend",
      "title": "Backend Roadmap",
      "slug": "backend",
      "url": "https://roadmap.sh/backend"
    },
    {
      "id": "r-devops",
      "title": "DevOps Roadmap",
      "slug": "devops",
      "url": "https://roadmap.sh/devops"
    }
  ]
};
