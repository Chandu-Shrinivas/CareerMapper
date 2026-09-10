import type { RoadmapDefinition } from '../types/roadmap';

export const DATA_ANALYST_ROADMAP_DEFINITION: RoadmapDefinition = {
  "id": "data-analyst",
  "slug": "data-analyst",
  "title": "Data Analyst",
  "version": "2026.1",
  "description": "Step by step guide to becoming a Data Analyst in 2026: Excel, SQL, Tableau/Power BI, Python/R, EDA, and Business Intelligence.",
  "nodes": [
    {
      "id": "data-analyst-main-header",
      "title": "Data Analyst",
      "type": "main",
      "description": "Step by step guide to becoming a Data Analyst in 2026: Excel, SQL, Tableau/Power BI, Python/R, EDA, and Business Intelligence.",
      "statusEnabled": false
    },
    {
      "id": "data-analyst-topic-1",
      "title": "Excel & Spreadsheet Modeling",
      "type": "topic",
      "description": "Advanced formulas, Pivot Tables, VLOOKUP/XLOOKUP, data cleaning, and executive dashboard building.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "data-analyst-subtopic-1-1",
      "title": "Pivot Tables & Charts",
      "type": "subtopic",
      "description": "Key subtopic concept: Pivot Tables & Charts",
      "parentId": "data-analyst-topic-1",
      "parentTitle": "Excel & Spreadsheet Modeling",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-1-2",
      "title": "XLOOKUP & INDEX/MATCH",
      "type": "subtopic",
      "description": "Key subtopic concept: XLOOKUP & INDEX/MATCH",
      "parentId": "data-analyst-topic-1",
      "parentTitle": "Excel & Spreadsheet Modeling",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-1-3",
      "title": "Conditional Formatting",
      "type": "subtopic",
      "description": "Key subtopic concept: Conditional Formatting",
      "parentId": "data-analyst-topic-1",
      "parentTitle": "Excel & Spreadsheet Modeling",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-1-4",
      "title": "Data Cleaning Techniques",
      "type": "subtopic",
      "description": "Key subtopic concept: Data Cleaning Techniques",
      "parentId": "data-analyst-topic-1",
      "parentTitle": "Excel & Spreadsheet Modeling",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-topic-2",
      "title": "SQL Querying & Data Extraction",
      "type": "topic",
      "description": "Extracting, aggregating, and joining data across relational databases to answer business questions.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "data-analyst-subtopic-2-1",
      "title": "SELECT, WHERE & GROUP BY",
      "type": "subtopic",
      "description": "Key subtopic concept: SELECT, WHERE & GROUP BY",
      "parentId": "data-analyst-topic-2",
      "parentTitle": "SQL Querying & Data Extraction",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-2-2",
      "title": "JOINs & Subqueries",
      "type": "subtopic",
      "description": "Key subtopic concept: JOINs & Subqueries",
      "parentId": "data-analyst-topic-2",
      "parentTitle": "SQL Querying & Data Extraction",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-2-3",
      "title": "Aggregations & HAVING",
      "type": "subtopic",
      "description": "Key subtopic concept: Aggregations & HAVING",
      "parentId": "data-analyst-topic-2",
      "parentTitle": "SQL Querying & Data Extraction",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-2-4",
      "title": "Window Functions (RANK, Lead/Lag)",
      "type": "subtopic",
      "description": "Key subtopic concept: Window Functions (RANK, Lead/Lag)",
      "parentId": "data-analyst-topic-2",
      "parentTitle": "SQL Querying & Data Extraction",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-topic-3",
      "title": "Business Intelligence & Visualization",
      "type": "topic",
      "description": "Creating interactive dashboards and KPI reports with Power BI and Tableau.",
      "statusEnabled": true,
      "difficulty": "beginner",
      "priority": "critical"
    },
    {
      "id": "data-analyst-subtopic-3-1",
      "title": "Power BI DAX & Data Models",
      "type": "subtopic",
      "description": "Key subtopic concept: Power BI DAX & Data Models",
      "parentId": "data-analyst-topic-3",
      "parentTitle": "Business Intelligence & Visualization",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-3-2",
      "title": "Tableau Workbooks & Dashboards",
      "type": "subtopic",
      "description": "Key subtopic concept: Tableau Workbooks & Dashboards",
      "parentId": "data-analyst-topic-3",
      "parentTitle": "Business Intelligence & Visualization",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-3-3",
      "title": "KPI Metric Design",
      "type": "subtopic",
      "description": "Key subtopic concept: KPI Metric Design",
      "parentId": "data-analyst-topic-3",
      "parentTitle": "Business Intelligence & Visualization",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-3-4",
      "title": "Interactive Drill-down Visuals",
      "type": "subtopic",
      "description": "Key subtopic concept: Interactive Drill-down Visuals",
      "parentId": "data-analyst-topic-3",
      "parentTitle": "Business Intelligence & Visualization",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-topic-4",
      "title": "Python / R for Data Analysis",
      "type": "topic",
      "description": "Exploratory data analysis with Pandas, NumPy, Matplotlib, and Seaborn for automated reporting.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "data-analyst-subtopic-4-1",
      "title": "Pandas DataFrames & Manipulation",
      "type": "subtopic",
      "description": "Key subtopic concept: Pandas DataFrames & Manipulation",
      "parentId": "data-analyst-topic-4",
      "parentTitle": "Python / R for Data Analysis",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-4-2",
      "title": "Matplotlib & Seaborn Charts",
      "type": "subtopic",
      "description": "Key subtopic concept: Matplotlib & Seaborn Charts",
      "parentId": "data-analyst-topic-4",
      "parentTitle": "Python / R for Data Analysis",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-4-3",
      "title": "Jupyter Notebook Workflows",
      "type": "subtopic",
      "description": "Key subtopic concept: Jupyter Notebook Workflows",
      "parentId": "data-analyst-topic-4",
      "parentTitle": "Python / R for Data Analysis",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-4-4",
      "title": "Handling Missing Data",
      "type": "subtopic",
      "description": "Key subtopic concept: Handling Missing Data",
      "parentId": "data-analyst-topic-4",
      "parentTitle": "Python / R for Data Analysis",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-topic-5",
      "title": "Business Storytelling & Metrics",
      "type": "topic",
      "description": "Translating data insights into actionable business recommendations and stakeholder presentations.",
      "statusEnabled": true,
      "difficulty": "intermediate",
      "priority": "high"
    },
    {
      "id": "data-analyst-subtopic-5-1",
      "title": "Defining Business KPIs",
      "type": "subtopic",
      "description": "Key subtopic concept: Defining Business KPIs",
      "parentId": "data-analyst-topic-5",
      "parentTitle": "Business Storytelling & Metrics",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-5-2",
      "title": "A/B Test Analysis Basics",
      "type": "subtopic",
      "description": "Key subtopic concept: A/B Test Analysis Basics",
      "parentId": "data-analyst-topic-5",
      "parentTitle": "Business Storytelling & Metrics",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-5-3",
      "title": "Executive Presentations",
      "type": "subtopic",
      "description": "Key subtopic concept: Executive Presentations",
      "parentId": "data-analyst-topic-5",
      "parentTitle": "Business Storytelling & Metrics",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-subtopic-5-4",
      "title": "Cohort & Funnel Analysis",
      "type": "subtopic",
      "description": "Key subtopic concept: Cohort & Funnel Analysis",
      "parentId": "data-analyst-topic-5",
      "parentTitle": "Business Storytelling & Metrics",
      "statusEnabled": true
    },
    {
      "id": "data-analyst-nav-1",
      "title": "Data Scientist",
      "type": "navigation",
      "description": "Explore the Data Scientist roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/data-scientist"
    },
    {
      "id": "data-analyst-nav-2",
      "title": "Data Engineer",
      "type": "navigation",
      "description": "Explore the Data Engineer roadmap.",
      "statusEnabled": false,
      "destination": "/role-roadmaps/data-engineer"
    }
  ],
  "badges": [],
  "relatedRoadmaps": []
};
