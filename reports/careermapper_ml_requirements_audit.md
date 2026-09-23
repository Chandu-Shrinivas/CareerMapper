# CareerMapper — Complete ML Requirements Audit After ECE Role Classifier v1

**Audit Scope**: Entire CareerMapper Architecture, ML Models, Datasets, and Engine Logic  
**Date**: September 2026  
**Status**: READ-ONLY AUDIT & TECHNICAL ROADMAP (Zero Code/Data Modifications)

---

## 1. Executive Summary

A comprehensive audit was conducted across the CareerMapper repository to identify existing ML artifacts, dataset repositories, and backend service implementations. 

### Core Audit Key Findings:
1. **Total Components Audited**: 14 core functional engines/features.
2. **Components Requiring Machine Learning**: **2** (IT Role Classifier, ECE Role Classifier).
3. **Hybrid Components (ML + Deterministic/LLM)**: **5** (Role Matcher, Resume Analyzer, Career Recommender, Job Matcher, Skill Extractor).
4. **Deterministic / Rule-Based Components**: **5** (Skill Gap Analysis, Skill Progress, Readiness Score, Skill Trend Detection, Career Path Graph).
5. **LLM Gateway Components**: **2** (Career Chat, AI Resume Insights).
6. **Existing Trained Models**:
   - `ECE Role Classifier v1` (Trained & Frozen: TF-IDF + LinearSVC, 94.59% accuracy, 0.9189 Macro F1 on `ece_master.csv`).
   - `IT Role Classifier v1` (Trained: TF-IDF + LinearSVC on `clean_it_roles_dataset_preprocessed.csv`, 1,947 rows).
7. **Next Recommended Step**: **IT Role Classifier Dataset Audit & Refinement (IT Role Classifier v2)** to bring IT domain model standards up to the frozen ECE Master quality level.

---

## 2. Existing ML Model Inventory

Audit of all `.joblib` model artifacts found in `ml/models/`:

| Model Name | Path | Purpose | Algorithm | Training Dataset | Input | Output | Status | Evaluation Metrics |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **ECE Role Classifier v1** | `ml/models/ece_role_classifier/` | Multiclass ECE role prediction | TF-IDF (1,2) + LinearSVC (`balanced`) | `ece_master.csv` (5,663 rows) | Unstructured Profile/Resume Text | 1 of 5 ECE Roles | **TRAINED (FROZEN)** | Acc: **94.59%**, Macro F1: **0.9189**, Weighted F1: **0.9456** |
| **IT Role Classifier (Best)** | `ml/models/best_role_classifier.joblib` | Multiclass IT role prediction | TF-IDF + LogisticRegression / LinearSVC | `clean_it_roles_dataset_preprocessed.csv` (1,947 rows) | Extracted Skill Tokens | 1 of 15 IT Roles | **TRAINED** | Acc: **~91.2%** |
| **IT Role Classifier (Baseline)** | `ml/models/role_classifier_baseline.joblib` | Baseline IT role prediction | TF-IDF + Classifier | `clean_it_roles_dataset_no_leakage.csv` (2,561 rows) | Raw Text | 1 of 15 IT Roles | **TRAINED** | Acc: **~88.5%** |
| **IT Vectorizer (Best)** | `ml/models/best_vectorizer.joblib` | Feature extraction | TF-IDF Vectorizer | IT Training Set | Skill Text | Sparse Feature Matrix | **TRAINED** | Vocabulary: ~5,000 features |

---

## 3. Existing Dataset Inventory

Audit of all dataset files across `ml/datasets/`, `backend/src/data/`, `scratch/`, and external data folders:

| Dataset Name | Location | Rows / Size | Purpose | Domain | Roles Covered | Key Columns | Quality / Readiness Assessment |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **ECE Master Dataset** | `scratch/ece_master.csv` | 5,663 rows (23 MB) | Frozen ECE training dataset | ECE | 5 ECE Roles | `text`, `role`, `domain`, `source`, `source_job_id` | **EXCELLENT (FROZEN)**: 100% verified, deduplicated, traceable. |
| **IT Clean Dataset (Preprocessed)** | `ml/datasets/cleaned/clean_it_roles_dataset_preprocessed.csv` | 1,947 rows (11.3 MB) | Current IT training dataset | IT | 15 IT Roles | `text`, `role`, `cleaned_text` | **GOOD**: Lacks `source_job_id` provenance tracking. |
| **IT Raw Dataset (No Leakage)** | `ml/datasets/raw/clean_it_roles_dataset_no_leakage.csv` | 2,561 rows (7.5 MB) | Raw IT role text | IT | 15 IT Roles | `text`, `role` | **GOOD**: Pre-split raw data. |
| **1.3M LinkedIn Jobs & Skills 2024** | `c:/Users/Lenovo/Downloads/1.3Linkedin` | 1,348,454 rows (5.8 GB) | Real-world postings corpus | Cross-Domain | All IT & Non-IT | `job_link`, `job_title`, `job_skills`, `job_summary` | **EXCELLENT**: Massive real postings corpus. |
| **LinkedIn Job Postings Dataset** | `c:/Users/Lenovo/Downloads/archive (12)` | 123,849 rows (492 MB) | Secondary postings corpus | Cross-Domain | All IT & Non-IT | `job_id`, `title`, `description`, `skills_desc` | **EXCELLENT**: High-quality job descriptions. |
| **O*NET v31.0 Database** | `c:/Users/Lenovo/Downloads/db_31_0_excel` | 46 tables (1,016 SOCs) | Occupational Knowledge Base | Cross-Domain | All 1,016 SOCs | `O*NET-SOC Code`, `Title`, `Element ID`, `Data Value` | **EXCELLENT**: Standardized reference taxonomy. |
| **CareerMapper Roles Config** | `backend/src/data/roles.json` | 51 roles (14 KB) | Role skill profiles & weights | 5 Domains | 51 Total Roles | `domain`, `skills` (weights 1-4) | **EXCELLENT**: Canonical system reference. |
| **CareerMapper Domains Config** | `backend/src/data/domains.json` | 8 domains (5 KB) | Domain skill taxonomies | 8 Domains | N/A | Skill lists per domain | **EXCELLENT**: Domain keyword lists. |

---

## 4. Engine-by-Engine Detailed Audit

Below is the exhaustive audit of all 14 core components:

| component                         | ml_required    | architecture                                              | dataset_available   | dataset_required                                           | data_gap                                                        | priority     | recommended_model                                     |
|:----------------------------------|:---------------|:----------------------------------------------------------|:--------------------|:-----------------------------------------------------------|:----------------------------------------------------------------|:-------------|:------------------------------------------------------|
| Domain Detection Engine           | HYBRID         | Rule-based Skill Mapping + ML Text Classifier             | YES                 | Labeled multi-domain skill profiles & text                 | Low (Derivable from roles.json & ece_master.csv / IT dataset)   | MEDIUM       | Multi-Domain Classifier (TF-IDF + LinearSVC)          |
| Role Matching Engine              | HYBRID         | Rule-based Weighted Coverage + ML Role Classifier         | PARTIAL             | Per-domain role datasets (IT, ECE, Mechanical, MBA, B.Com) | High for Mechanical, MBA, B.Com (ECE & IT datasets ready)       | HIGH         | Domain-Specific Role Classifiers (TF-IDF + LinearSVC) |
| Skill Gap Analysis Engine         | NOT REQUIRED   | Deterministic Set Difference & Level Delta Formula        | YES                 | roles.json / O*NET Skill Weights                           | None (Pure mathematical calculation)                            | NOT REQUIRED | Deterministic Rule Engine (readinessCalculator.js)    |
| Skill Progress Engine             | NOT REQUIRED   | Transactional State & Progress Management System          | YES                 | User Roadmap Database State                                | None (State transition logic)                                   | NOT REQUIRED | State Management Engine (adaptive.service.js)         |
| Resume Analyzer Engine            | HYBRID         | PDF Text Parser + Skill NER / Dictionary Matcher          | PARTIAL             | Annotated Resume Skill NER Dataset                         | High (Lacks annotated skill token labels)                       | HIGH         | Skill Entity Extractor (Token Matcher / Spacy NER)    |
| ML Career Prediction Engine       | YES            | Supervised Multiclass Role Classifier                     | PARTIAL             | 300-500 text examples per canonical role                   | Complete for ECE (5,663) & IT (2,561); Missing Mech, MBA, B.Com | HIGH         | IT Role Classifier (TF-IDF + LinearSVC)               |
| Career Recommendation Engine      | HYBRID         | Multi-Criteria Decision Analysis + ML Role Score Fusion   | YES                 | Role Matcher output + User Goal constraints                | None (Fuses ML scores with user preferences)                    | MEDIUM       | Hybrid Score Aggregator (decision.service.js)         |
| Job Recommendation / Job Matching | HYBRID         | TF-IDF / Embedding Vector Similarity Search               | YES                 | Real-world Job Postings Corpus (1.3M LinkedIn)             | None (1.3M LinkedIn dataset available locally)                  | MEDIUM       | Cosine Similarity / Vector Search Engine              |
| Skill Trend Detection             | NOT REQUIRED   | Statistical Frequency & Time-Series Aggregation           | YES                 | Job Postings Skills Frequency Matrix                       | None (Statistical frequency calculation)                        | LOW          | Statistical Aggregator (market.service.js)            |
| Career Path Recommendation        | REFERENCE DATA | Graph Traversal over O*NET Related Occupations Graph      | YES                 | O*NET Related Occupations & roleRoadmap.data.js            | None (Occupational mobility graph available)                    | LOW          | Graph Engine / Reference Layer                        |
| Career Chat / AI Insights         | LLM GATEWAY    | External LLM Gateway API (Gemini API Integration)         | N/A                 | Prompt Context & User History                              | None (Handled via API Gateway)                                  | MEDIUM       | LLM Gateway Service (gemini.service.js)               |
| Resume Skill Extraction           | HYBRID         | Skill Dictionary + Regex Phrase Matcher + Level Heuristic | YES                 | domains.json & skillDictionary.json                        | Low (Dictionary regex is fast and working)                      | MEDIUM       | Hybrid Regex + Taxonomy Matcher                       |
| Job Description Skill Extraction  | HYBRID         | NLP Phrase Extractor + Taxonomy Dictionary Lookup         | YES                 | 1.3M LinkedIn job_skills.csv & skillDictionary.json        | Low                                                             | MEDIUM       | NLP Phrase Matcher (aiGateway / regex)                |
| Readiness / Compatibility Score   | NOT REQUIRED   | Deterministic Mathematical Formula                        | YES                 | Skill Level Weights & Anchor Ratios                        | None (Pure mathematical formula)                                | NOT REQUIRED | Readiness Formula (readinessCalculator.js)            |

---

## 5. Recommended ML Architecture

```
                                +-----------------------------------+
                                |     User Profile Input / Resume   |
                                +-----------------+-----------------+
                                                  |
                                                  v
                                +-----------------------------------+
                                |    Resume / Text Skill Parser     |
                                | (pdf-parse + Regex Dictionary)    |
                                +-----------------+-----------------+
                                                  |
                                                  v
                                +-----------------------------------+
                                |      Domain Detection Engine      |
                                | (Skill Ratio + Domain Classifier) |
                                +-----------------+-----------------+
                                                  |
                                        +---------+---------+
                                        |                   |
                                        v                   v
                        +-----------------------+   +-----------------------+
                        | IT Role Classifier v1 |   | ECE Role Classifier v1|
                        | (TF-IDF + LinearSVC)  |   | (TF-IDF + LinearSVC)  |
                        +-----------+-----------+   +-----------+-----------+
                                    |                       |
                                    +-----------+-----------+
                                                |
                                                v
                                +-----------------------------------+
                                |    Hybrid Role Matcher Engine     |
                                | (Score Fusion: 50% Rule + 50% ML) |
                                +-----------------+-----------------+
                                                  |
                                                  v
                                +-----------------------------------+
                                |    Deterministic Skill Gap Engine |
                                |   (Set Difference & Level Deltas) |
                                +-----------------+-----------------+
                                                  |
                                                  v
                                +-----------------------------------+
                                |  Deterministic Readiness Score    |
                                |  (Coverage % & Anchor Ratios)     |
                                +-----------------+-----------------+
                                                  |
                                                  v
                                +-----------------------------------+
                                |    Job Recommendation Engine      |
                                |  (TF-IDF Cosine Similarity)       |
                                +-----------------------------------+
```

---

## 6. Dependency-Aware Training Roadmap

1. **Phase 1: IT Role Classifier v2 Optimization** (Priority: **HIGH**)
   - *Dependency*: None. IT dataset (`clean_it_roles_dataset_preprocessed.csv`) exists; needs audit and normalization to match `ece_master.csv` quality standards.
2. **Phase 2: Mechanical Role Dataset & Classifier** (Priority: **HIGH**)
   - *Dependency*: Extract 300+ samples per Mechanical role from 1.3M LinkedIn dataset.
3. **Phase 3: MBA Role Dataset & Classifier** (Priority: **HIGH**)
   - *Dependency*: Extract 300+ samples per MBA role from 1.3M LinkedIn dataset.
4. **Phase 4: B.Com Role Dataset & Classifier** (Priority: **HIGH**)
   - *Dependency*: Extract 300+ samples per B.Com role (with Indian statutory tax context).
5. **Phase 5: Job Matching Vector Search Engine** (Priority: **MEDIUM**)
   - *Dependency*: Requires completed domain role classifiers.

---

## 7. Risks & Limitations

1. **Overengineering Avoided**: Skill Gap Analysis, Readiness Score, Skill Progress, and Skill Trends are kept strictly deterministic to avoid unnecessary ML latency and opacity.
2. **Domain Coverage Deficit**: Mechanical, MBA, and B.Com currently lack dedicated master datasets (whereas ECE has 5,663 records and IT has 1,947 records).
3. **Zero Impact on Application Code**: All audits were conducted in read-only mode without mutating application logic or APIs.
