# CAREERMAPPER — FACT-CHECKED RESEARCH PAPER SOURCE OF TRUTH

**Document Purpose**: A strictly verified, fact-checked baseline of empirical evidence, model parameters, evaluation metrics, dataset semantics, and technical logic from the CURRENT CareerMapper repository.

**Date**: September 24, 2026  
**Source of Truth Repository**: `CareerMapper-main`  
**Status**: 100% FACT-CHECKED & VERIFIED AGAINST CODE/ARTIFACTS  

---

## 1. Current System

- **Official Title**: CareerMapper: A Multi-Domain Hybrid Career Intelligence & Job Preparation Platform
- **System Purpose**: End-to-end multi-domain career guidance platform performing resume text extraction, skill normalization, proficiency level detection, domain detection, domain-routed ML role classification, hybrid score fusion, skill gap analysis, deterministic readiness scoring, live job aggregation, and interactive roadmap navigation.
- **Target Disciplines**: Engineering, Business, and Commerce.
- **Production Stack**:
  - **Frontend**: React 19, TypeScript, Vite v8.2.1, Tailwind CSS, Lucide React.
  - **Backend API Gateway**: Node.js v20+, Express.js, `pdf-parse`, `multer` memory storage.
  - **ML Service**: Python 3.11, FastAPI, Uvicorn, Scikit-Learn (LinearSVC), Joblib, NumPy.
  - **Database & Cache**: MongoDB 7.0 (Mongoose ODM) with offline local JSON file fallbacks (`domains.json`, `roles.json`).
  - **External Services**: JSearch API (via RapidAPI for live job postings) and Google Gemini API (`gemini-2.5-flash` for out-of-taxonomy skill domain suggestions).

---

## 2. Current Architecture

```
User Resume (PDF / DOCX / JSON)
       │
       ▼
Express API Gateway (Port 5000)
       ├──> pdf-parse (Text Extraction)
       ├──> Regex Skill Engine (domains.json & skillDictionary.json)
       ├──> Domain Detection Engine (domain.service.js)
       ├──> Hybrid Role Service (role.service.js)
       │         │
       │         ▼ (HTTP POST /predict)
       │    FastAPI Python Service (Port 8000)
       │         ├──> InferenceGuard (Token Capping <= 2, Vocab Non-Zero Check)
       │         └──> Domain-Routed Classifier (LinearSVC)
       │
       ├──> Job Matching Engine (job.service.js)
       ├──> Readiness Calculator (readinessCalculator.js)
       └──> Frontend Interactive SVG Engine / Fallback View (Port 5173)
```

---

## 3. Current Supported Domains (6)

1. **Information Technology (IT)**
2. **Electronics & Communication Engineering (ECE)**
3. **Mechanical Engineering**
4. **Master of Business Administration (MBA)**
5. **Bachelor of Commerce (B.Com)**
6. **Civil Engineering**

---

## 4. Current Supported Roles (38 Canonical Roles)

- **IT Domain (10 Roles)**: Backend Developer, Cloud Engineer, Cybersecurity Analyst, Data Analyst, DevOps Engineer, Frontend Developer, Full Stack Developer, Mobile Developer, Software Tester, UI/UX Designer.
- **ECE Domain (5 Roles)**: Embedded Systems Engineer, IoT Engineer, PCB Design Engineer, Signal Processing Engineer, VLSI Design Engineer.
- **Mechanical Domain (5 Roles)**: CAD Design Engineer, FEA/CFD Analyst, HVAC Engineer, Manufacturing Engineer, Product Design Engineer.
- **MBA Domain (6 Roles)**: Business Analyst, HR Executive, Marketing Analyst, Operations Manager, Product Manager, Sales Executive.
- **B.Com Domain (6 Roles)**: Accountant, Auditor, Bookkeeper, Finance Executive, Financial Analyst, Tax Consultant.
- **Civil Domain (6 Roles)**: Civil Site Engineer, Construction Project Engineer, Geotechnical Engineer, Quantity Surveyor, Structural Engineer, Transportation Engineer.

---

## 5. Datasets Audit & Record Counts

### Master Datasets (Real Job Postings Corpora)

| Domain | Master Dataset Path | File Format | Master Record Count | Source Corpus / Sourcing Type |
| :--- | :--- | :---: | :---: | :--- |
| **IT** | `ml/datasets/cleaned/clean_it_roles_dataset_preprocessed.csv` | CSV | **1,947** | Sourced from IT job postings & raw dataset `clean_it_roles_dataset_no_leakage.csv` |
| **ECE** | `scratch/ece_master.csv` | CSV | **5,663** | Extracted from 1.3M LinkedIn dataset using ECE SOC codes & hardware keywords |
| **Mechanical** | `data/mechanical_master.csv` | CSV | **10,706** | Sourced from LinkedIn job postings corpus using mechanical engineering SOC codes |
| **MBA** | `data/mba_master.csv` | CSV | **42,368** | Extracted from 1.3M LinkedIn dataset using Business Administration SOC codes |
| **B.Com** | `data/bcom_master.csv` / `data/bcom_master.parquet` | CSV / Parquet | **34,303** | Sourced from commercial accounting & finance job posting corpora |
| **Civil** | `data/civil_master.csv` / `data/civil_master.parquet` | CSV / Parquet | **11,192** | Sourced from civil & structural engineering job posting corpora |

**Exact Total Master Dataset Count**: **106,179 records** ($1,947 + 5,663 + 10,706 + 42,368 + 34,303 + 11,192 = 106,179$).

### Record Semantics & Sourcing Categorization
- **Record Unit**: Each record represents a **single real-world job posting text description** with its corresponding canonical role label.
- **Real vs Synthetic**: All 6 master datasets consist of **REAL** job posting data. No synthetic AI-generated text was used.
- **Manually Authored Benchmarks**: Evaluation benchmark suites (such as the MBA 19-case robustness test in `reports/mba_role_classifier_comprehensive_test.md`) are **MANUALLY AUTHORED** test cases created by authors to evaluate boundary edge cases.

---

## 6. Models Ground Truth Specification

Verified directly by unpickling model artifacts using Python `joblib`:

| Domain | Classifier Type | Number of Classes | Vectorizer Type | N-Gram Range | Vocabulary Size | Hyperparameters ($C$, Class Weight) |
| :--- | :--- | :---: | :--- | :---: | :---: | :--- |
| **IT** | `LinearSVC` | 10 | `TfidfVectorizer` | **(1, 1)** | 21,604 | `C=1.0`, `class_weight=None` |
| **ECE** | `LinearSVC` | 5 | `TfidfVectorizer` | (1, 2) | 30,000 | `C=1.0`, `class_weight='balanced'` |
| **Mechanical** | `LinearSVC` | 5 | `TfidfVectorizer` | (1, 2) | 50,000 | `C=0.5`, `class_weight='balanced'` |
| **MBA** | `LinearSVC` | 6 | `TfidfVectorizer` | (1, 3) | 50,000 | `C=1.0`, `class_weight='balanced'` |
| **B.Com** | `LinearSVC` | 6 | `TfidfVectorizer` | (1, 3) | 50,000 | `C=1.0`, `class_weight=None` |
| **Civil** | `LinearSVC` | 6 | `TfidfVectorizer` | (1, 3) | 50,000 | `C=1.0`, `class_weight=None` |

---

## 7. Training Configuration

- **Data Split Strategy**: Stratified Random Split using fixed `random_state=42` across all domains.
- **Split Ratios**: 70% Train, 15% Validation, 15% Test.
- **Data Leakage Check**: 0 overlapping IDs or exact text strings between Train, Validation, and Test splits.
- **Retraining Strategy**: After hyperparameter selection on the Validation set, final models for MBA and Civil were retrained on Train + Validation (85% of master data) before evaluating on the untouched Test set (15%).

---

## 8. Evaluation Results Fact-Check Matrix

Verified against original report markdown files in `reports/`:

| Domain | Master Size | Train Count | Val Count | Test Count | Test Accuracy | Macro Precision | Macro Recall | Macro F1 | Weighted F1 | Mean Margin | Source Report |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **IT** | 1,947 | 1,362 | 292 | 293 | **91.20%** | 0.8950 | 0.8820 | **0.8850** | 0.9110 | 1.4300 | [pre_integration_validation_report.md](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/reports/pre_integration_validation_report.md) |
| **ECE** | 5,663 | 3,964 | 849 | 850 | **94.59%** | 0.9211 | 0.9176 | **0.9189** | 0.9456 | 1.5200 | [ece_role_classifier_report.md](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/reports/ece_role_classifier_report.md) |
| **Mechanical** | 10,706 | 7,494 | 1,606 | 1,606 | **93.34%** | 0.9137 | 0.9194 | **0.9163** | 0.9339 | 1.4631 | [mechanical_role_classifier_report.md](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/reports/mechanical_role_classifier_report.md) |
| **MBA** | 42,368 | 29,657 | 6,355 | 6,356 | **99.04%** | 0.9860 | 0.9774 | **0.9815** | 0.9904 | 2.3211 | [mba_role_classifier_report.md](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/reports/mba_role_classifier_report.md) |
| **B.Com** | 34,303 | 24,012 | 5,145 | 5,146 | **96.15%** | 0.9483 | 0.9341 | **0.9408** | 0.9614 | 1.8837 | [bcom_role_classifier_report.md](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/reports/bcom_role_classifier_report.md) |
| **Civil** | 11,192 | 7,834 | 1,679 | 1,679 | **99.46%** | 0.9964 | 0.9936 | **0.9950** | 0.9946 | 1.9323 | [civil_role_classifier_report.md](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/reports/civil_role_classifier_report.md) |

---

## 9. Benchmark & Robustness Results

1. **MBA 19-Case Robustness Benchmark**: Evaluated in `reports/mba_role_classifier_comprehensive_test.md`. Achieved **94.74% Accuracy** (18/19 passed) across clear titles, JD prose, skill lists, and boundary pairs.
2. **Real Resume Test Suite (7 Candidate Resumes)**: Evaluated in `reports/final_system_validation_report.md`. Achieved **100% pipeline pass rate** across PDF/DOCX resumes ranging from 616 bytes to 599 KB of text.
3. **Keyword-Stuffing Attack Test**: Evaluated in `reports/pre_integration_validation_report.md`. Repeating a skill word 50 times skews un-sanitized TF-IDF vectors; resolved by capping token occurrences to 2 in `InferenceGuard.sanitize_text()`.

---

## 10. Hybrid Components Fact-Check

Inspect file: [role.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/role.service.js)

### Formula Verification
- **Code Execution**: The hybrid score formula IS ACTUALLY EXECUTED in production code inside `matchRoles` (`role.service.js:L296`):
  ```javascript
  if (mlConfidence >= 0.35) {
    hybridScores[mlPred.role] = Math.round(ruleScore * 0.5 + (mlConfidence * 100) * 0.5);
  }
  ```
- **RuleScore**: Preliminary match score (0–90) derived from rule engine coverage %, quality %, and anchor ratio.
- **MLConfidence**: Float (0.0 to 1.0) calculated via Softmax over LinearSVC decision function scores:
  ```python
  exp_scores = np.exp(decision_scores - np.max(decision_scores))
  probs = exp_scores / np.sum(exp_scores)
  ```
- **Calibration Terminology Fact-Check**: The confidence score is **Softmax-normalized**. It is **NOT Platt-scaled** or isotonic-calibrated probability (no `CalibratedClassifierCV` was trained). Calling it "Softmax-normalized decision score" is technically accurate; calling it "formally calibrated probability" is inaccurate.

---

## 11. Skill Extraction Fact-Check

Inspect file: [resume.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/resume.service.js)

- **Regex Boundary Pattern**: `new RegExp("(?<![a-zA-Z0-9])" + escapedSkill + "(?![a-zA-Z0-9])", "gi")`
- **Line-Wrap Normalization**: Replaces line breaks (`\r\n`, `\n`) and multiple spaces with a single space to capture multi-word skills split across line breaks.
- **Proficiency Level Detection**: [levelDetector.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/utils/levelDetector.js) measures character distance to level keywords inside sentence boundaries within a 60-character window (`WINDOW_THRESHOLD = 60`). Defaults to `"beginner"`.
- **Extraction Audit**: Verified 100% coverage (22/22 expected skills extracted from sample CS resume, 0% substring leakage) in `skill_extraction_audit.md`.

---

## 12. Domain Detection Fact-Check

Inspect file: [domain.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/domain.service.js)

- **Scoring Formula**: $\text{Confidence} = \left(\frac{\text{MatchCount}}{\text{TotalSkills}}\right) \times 100$
- **Ambiguity Threshold**: Sets `isAmbiguous = true` when $\text{Score}_{\text{top1}} - \text{Score}_{\text{top2}} < 10$.
- **Evidence Output**: Emits matching skill tokens per domain (`evidence: [...]`).

---

## 13. Role Prediction Fact-Check

Inspect file: [inference_guard.py](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/utils/inference_guard.py)

- **Domain Routing**: `_load_domain_model(domain)` dynamically loads and queries the specified domain classifier artifact.
- **Decision Margin**: Calculates top-1 minus top-2 probability difference ($\text{Margin} = P_1 - P_2$).
- **Low Confidence Flag**: Sets `low_confidence = true` if $P_1 < 0.25$ or $\text{Margin} < 0.05$.
- **Fallback Flag**: Triggers `fallback: true` when $P_1 < 0.15$ or when no vocabulary tokens match (`vec.nnz == 0`).

---

## 14. Skill Gap Fact-Check

Inspect file: [gap.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/roadmap/gap.service.js)

- **Calculation**: Deterministic set difference $S_{\text{missing}} = R_{\text{target}} \setminus S_{\text{user}}$.
- **Categorization**: Missing skills categorized into Core Missing ($\text{Weight} \ge 3$) and Secondary Missing ($\text{Weight} < 3$).

---

## 15. Job Readiness Fact-Check

Inspect file: [readinessCalculator.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/roadmap/readinessCalculator.js)

- **Formula**:
  $$R_{\text{readiness}} = \min\left(100, \max\left(0, \text{Math.round}\left( \frac{\sum_{i=1}^{N} w_i \times s_i}{\sum_{i=1}^{N} w_i} \times 100 \right)\right)\right)$$
- **Weights ($w_i$)**: `critical`: 3.0, `required`: 2.0, `preferred`: 1.0, `nice-to-have`: 0.5.
- **Satisfaction ($s_i$)**: Full Match = 1.0, Partial Match = 0.5, Missing = 0.0.

---

## 16. Job Matching Fact-Check

Inspect file: [job.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/job.service.js)

- **Sources**: Live JSearch API (RapidAPI) and MongoDB `Job` collection cache ($\le 24$ hours old).
- **Matching Algorithm**: Cosine TF-IDF similarity and skill overlap between candidate skills and job description required skills.

---

## 17. Recommendations Fact-Check

- Fuses Rule Engine coverage score (0–90) with ML Softmax confidence score.
- Returns top-3 ranked role recommendations with matched skills and missing skill gaps.

---

## 18. Roadmaps Fact-Check

Inspect file: [RoleRoadmapDetailPage.tsx](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/frontend/src/pages/RoleRoadmapDetailPage.tsx)

- **Interactive SVG Roadmaps**: **28 unique SVG interactive roadmaps** supported in the frontend (`FrontendSvgRoadmap`, `BackendSvgRoadmap`, `FullstackSvgRoadmap`, `DevopsSvgRoadmap`, `AndroidSvgRoadmap`, `AiEngineerSvgRoadmap`, `DataAnalystSvgRoadmap`, `DevSecOpsSvgRoadmap`, `DataEngineerSvgRoadmap`, `PostgreSqlDbaSvgRoadmap`, `MachineLearningSvgRoadmap`, `AiDataScientistSvgRoadmap`, `BlockchainSvgRoadmap`, `IosSvgRoadmap`, `SoftwareArchitectSvgRoadmap`, `QaEngineerSvgRoadmap`, `CyberSecuritySvgRoadmap`, `ApiDesignSvgRoadmap`, `TechnicalWriterSvgRoadmap`, `UxDesignSvgRoadmap`, `GameDeveloperSvgRoadmap`, `ProductManagerSvgRoadmap`, `MlopsSvgRoadmap`, `SystemDesignSvgRoadmap`, `EngineeringManagerSvgRoadmap`, `ForwardDeployedEngineerSvgRoadmap`, `AspnetCoreSvgRoadmap`, `DatastructuresAndAlgorithmsSvgRoadmap`).
- **Non-IT Domains Handling**: Non-IT roles (`ECE`, `Mechanical`, `MBA`, `B.Com`, `Civil`) render a **Domain Preparation Fallback View** displaying skill requirements rather than fake IT graphs.

---

## 19. Inference Performance Fact-Check — CRITICAL

Inspect file: [test_ml_validation.py](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/tests/test_ml_validation.py#L213-L234)

- **Reported Metric**: Average Latency **0.2086 ms** (P50: **0.1779 ms**).
- **Exact Scope**: Represents ONLY Python warm execution of `vectorizer.transform([text])` + Softmax over `clf.decision_function(vec)` for an 8-word benchmark string (`"python sql data analyst pandas statistics notebook visualization"`).
- **Exclusions**:
  - EXCLUDES model unpickling/loading (models are pre-loaded in memory).
  - EXCLUDES PDF/DOCX file extraction (`pdf-parse`).
  - EXCLUDES Node.js regex skill extraction loop.
  - EXCLUDES Express gateway network overhead and FastAPI HTTP POST transmission latency over port 8000.
  - EXCLUDES MongoDB database queries and job matching.
- **Paper Framing Requirement**: MUST NOT be described as "complete resume analysis latency". MUST be described as "warm standalone Python TF-IDF vectorization and LinearSVC matrix multiplication latency for a single pre-sanitized text profile".

---

## 20. Limitations

1. Closed-set multiclass models force top-1 prediction on out-of-domain inputs unless caught by `vec.nnz == 0` or confidence threshold guard ($<0.25$).
2. Interactive SVG roadmaps are available for 28 tech/software roles; non-IT domains use domain fallback views.
3. Minor specialized classes (e.g. Signal Processing Engineer) require class weighting due to lower sample counts.

---

## 21. Research Contributions Classification

1. **Multi-Domain Career Intelligence Architecture**: **SUPPORTED BY IMPLEMENTATION** (6 domain classifiers for 38 canonical roles).
2. **Domain-Routed Isolation Strategy**: **SUPPORTED BY IMPLEMENTATION** (`InferenceGuard._load_domain_model`).
3. **Calibrated Hybrid Score Fusion**: **PARTIALLY SUPPORTED** (Formula is implemented; confidence is Softmax-normalized, NOT Platt-scaled).
4. **Sanitized & Guarded Inference Layer**: **SUPPORTED BY IMPLEMENTATION (with terminology correction)** (Token frequency capped to 2; described as input sanitization / keyword-stuffing mitigation, NOT adversarial defense).
5. **"First open multi-domain framework"**: **REQUIRES LITERATURE EVIDENCE** (Cannot be proven by codebase alone; requires comparative literature review).

---

## 22. Claims Requiring Literature Support

- Comparative novelty against existing academic career recommendation systems (e.g. Zhang et al., Chen et al.).
- State-of-the-art benchmarks on non-IT occupational datasets.

---

## 23. Author Information Still Required

1. Author names, affiliations, and institutional emails.
2. Hardware environment specs for offline model training (CPU model, RAM size, GPU details if any).
3. IRB / Ethics approval documentation if human student surveys were conducted.
4. Target conference/journal formatting requirements.
