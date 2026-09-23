  # CareerMapper Project Architecture Guide

  This document maps the CareerMapper features, pages, and API endpoints directly to their implementation files and functions. Use this guide to trace the code flow, understand system logic, or navigate the project structure.

  ---

  ## SECTION A: High-Level Architecture Diagram

  The diagram below outlines the interaction between the **React Frontend**, **Express Backend**, **Python ML Service**, and **Gemini API Helper**.

  ```mermaid
  graph TD
      %% Frontend Pages
      subgraph Frontend [React SPA - Port 5173]
          UI_Home["Home Page (/)"] --> UI_Analysis["Analysis Page (/analysis)"]
          UI_Home --> UI_Manual["Manual Entry (/manual)"]
          UI_Analysis --> UI_Recs["Recommendations (/recommendations)"]
          UI_Manual --> UI_Recs --> UI_Details["Details & Roadmaps (/details/:roleName)"]
      end

      %% Express Backend Gateway
      subgraph Backend [Express Backend Gateway - Port 5000]
          R_Resume["POST /extract-skills"] --> C_Resume["resume.controller.js<br>(processResume)"]
          R_Skill["POST /detect-domain"] --> C_Skill["skill.controller.js<br>(detectUserDomain)"]
          R_Role["POST /match-roles"] --> C_Role["role.controller.js<br>(getRoleMatches)"]
          R_Know["POST /suggest-domain"] --> C_Know["knowledge.controller.js<br>(suggestDomain)"]

          C_Resume --> S_Resume["resume.service.js<br>(extractSkillsFromResume)"]
          C_Skill --> S_Domain["domain.service.js<br>(detectDomain)"]
          C_Role --> S_Role["role.service.js<br>(matchRoles)"]
          C_Know --> S_Gemini["gemini.service.js<br>(suggestDomainForSkill)"]
      end

      %% Python ML Inference Service
      subgraph ML_Service [Python FastAPI Service - Port 8000]
          M_Predict["POST /predict"] --> I_Service["inference_service.py<br>(predict_role)"]
          M_Health["GET /health"] --> I_Service
          I_Service --> I_Guard["inference_guard.py<br>(predict_safe)"]
      end

      %% Dictionaries & Serialization
      subgraph Local_Data [Data & Model Artifacts]
          S_Resume --> D_Domains["domains.json"]
          S_Role --> D_Roles["roles.json"]
          I_Guard --> J_Model["best_role_classifier.joblib"]
          I_Guard --> J_Vec["best_vectorizer.joblib"]
      end

      %% Gemini AI
      subgraph Google_LLM [Gemini LLM API]
          S_Gemini --> API_Gemini["gemini-2.5-flash"]
      end

      %% Inter-service Connections
      UI_Analysis -- File Upload --> R_Resume
      UI_Manual -- JSON payload --> R_Skill
      UI_Recs -- JSON payload --> R_Role
      UI_Details -- JSON query --> R_Role
      
      %% Backend -> ML communication
      S_Role -- Axios (1s timeout) --> M_Predict
  ```

  ---

  ## SECTION B: Feature → File Mapping

  ### 1. Resume Upload
  * **Purpose**: Allows users to upload a PDF resume, parses its text, extracts skills, classifies the domain, and returns the list of skills, levels, domain, and confidence.
  * **Route File**: [resume.routes.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/routes/resume.routes.js) (`POST /extract-skills`)
  * **Controller**: [resume.controller.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/controllers/resume.controller.js) → `processResume`
  * **Service**: [resume.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/resume.service.js) → `extractSkillsFromResume`
  * **Utility Files**:
    * [fileUtils.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/utils/fileUtils.js) (reads local JSON databases)
    * [skillNormalizer.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/utils/skillNormalizer.js) (deduplicates, normalizes synonyms, maps user-friendly display names)
    * `multer` (handles memory buffer storage for PDF files)

  ### 2. Resume Parser
  * **Purpose**: Extracts raw text from uploaded PDF binary buffers.
  * **PDF Extraction Library**: `pdf-parse` (imported as `PDFParse`)
  * **Parsing Function**: `extractSkillsFromResume`
  * **File Path**: [resume.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/resume.service.js)

  ### 3. Skill Extraction Engine
  * **Purpose**: Matches parsed PDF text against defined technical skill dictionaries using strict regex boundaries.
  * **Skill Dictionary**: 
    * [domains.json](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/data/domains.json) (defines base vocabulary of domain-related skills)
    * [skillDictionary.json](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/data/skillDictionary.json) (maps synonyms to canonical keys)
  * **Extraction Logic & Matching Algorithm**: 
    * Compiles all skills from `domains.json` into a Set.
    * Loops through each canonical skill, escapes special regex characters, and compiles a boundary-safe pattern:
      `new RegExp("(?<![a-zA-Z0-9])" + escapedSkill + "(?![a-zA-Z0-9])", "gi")`
    * Runs matches globally against space-normalized and lowercased PDF text.
    * Resolves level using proximity detection.
  * **File Paths**: 
    * [resume.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/resume.service.js) (Regex Matching loop)
    * [skillNormalizer.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/utils/skillNormalizer.js) (Synonym Mapping & Presentation Prettifier)

  ### 4. Skill Level Detection
  * **Purpose**: Calculates the proficiency level (`beginner`, `intermediate`, `advanced`, `expert`) for each extracted skill based on adjacent keyword context.
  * **Level Detection Logic**: 
    * Finds the sentence boundaries (`['.', '!', '?', '\n']`) containing the skill occurrence.
    * Searches for level-indicative keywords within those boundaries (`expert`/`advanced` → `advanced`, `intermediate`/`experience`/`worked`/`years` → `intermediate`, `familiar`/`basic`/`beginner` → `beginner`).
    * Measures characters distance from the skill index to the keyword, and assigns the closest keyword if it falls within the `WINDOW_THRESHOLD = 60` characters window.
  * **Beginner Fallback Logic**: If no keyword is matched inside the sentence boundary or is outside the 60-character window, it defaults to `"beginner"`.
  * **File Path**: [levelDetector.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/utils/levelDetector.js) → `detectLevel`

  ### 5. Domain Detection Engine
  * **Purpose**: Identifies the dominant career domain classification (e.g., IT, MBA, Mechanical, ECE) for a given list of skills.
  * **Domain Mapping Logic**: Maps extracted skills to the categories defined in `domains.json`.
  * **Confidence Calculation**: Counts the matches per domain. The confidence is `(matchCount / totalSkills) * 100`. The domain with the highest percentage is returned as the primary classification.
  * **File Path**: [domain.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/domain.service.js) → `detectDomain`

  ### 6. Rule Engine
  * **Purpose**: Scores how well a user's skills fit a list of defined target career roles.
  * **Role Scoring Logic**:
    * Calculates `coveragePercent` (matched weights / total role skill weights) and `qualityPercent` (user's level weight / max level weight).
    * Combines them into a baseline score: `(coveragePercent * 0.85) + (qualityPercent * 0.15)`.
    * Computes `anchorRatio` (matched anchor skills / defined anchors).
    * Adds an `anchorBoost`: `anchorRatio * 22`.
    * Caps the preliminary score at 90.
  * **Anchor Skill Logic**: Defined per role in `ROLE_ANCHOR_SKILLS` (or auto-extracted from database skills with weight >= 3).
  * **Anti-Leakage / Penalization Logic**:
    * Cuttsoff score to 0 if matched skills are 0 or coverage < 5%.
    * Cuttsoff score to 0 for specialized roles (ML Engineer, Data Scientist, UI/UX Designer, Mobile Developer) if they have no core skills matched.
    * Cuttsoff/reduces score heavily (caps at 25) if `anchorRatio === 0`.
    * Caps score at 45 if `anchorRatio < 0.4`.
  * **Role Definitions Database**: [roles.json](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/data/roles.json)
  * **File Path**: [role.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/role.service.js) → `matchRoles`

  ### 7. Gemini Integration
  * **Purpose**: Uses an LLM to predict domain mappings for unrecognized skills that aren't defined in `domains.json`.
  * **Gemini API Integration**: REST post call via Axios.
  * **Model**: `gemini-2.5-flash`
  * **Prompt**: `"Which domain does the skill '${skill}' belong to? Respond only with one domain name like IT, MBA, Mechanical."`
  * **Endpoint**: `POST /suggest-domain` (processed by `suggestDomain` controller)
  * **Service File**: [gemini.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/gemini.service.js) → `suggestDomainForSkill`

  ### 8. LinearSVC ML Model
  * **Purpose**: Multi-class text classification model to match profiles with job roles based on TF-IDF representation.
  * **Model Loading**: `InferenceGuard._load_models()` via `joblib.load()`
  * **Vectorizer Loading**: `InferenceGuard._load_models()` via `joblib.load()`
  * **Prediction Function**: `InferenceGuard.predict_safe(text)`
  * **Serialized Model Location**:
    * Classifier: `ml/models/best_role_classifier.joblib`
    * Vectorizer: `ml/models/best_vectorizer.joblib`
  * **File Path**: [inference_guard.py](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/utils/inference_guard.py) (Inference wrapper)

  ### 9. Inference Safety Layer
  * **Purpose**: Calibrates and filters inputs to the ML service to prevent out-of-distribution inputs, spam, and incorrect low-confidence guesses.
  * **Input Validation & Non-Technical Garbage Prose Rejection**:
    * Minimum token count check (`len(tokens) < 3`)
    * Vocabulary diversity check (`len(unique_tokens) < 2`)
    * Technical vocabulary overlap: checks if TF-IDF representation has at least 2 non-zero elements (`vec.nnz < 2`). If failed, rejects.
  * **Spam Filtering**: Caps any single term occurrence to a maximum of 2 (`sanitize_text`), resolving TF-IDF inflation attacks.
  * **Confidence Threshold**: Rejects recommendations if the top prediction probability falls under 25% (`max_confidence < 0.25`), returning `fallback: true` to trigger the backend Rule Engine instead.
  * **File Path**: [inference_guard.py](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/utils/inference_guard.py) → `predict_safe` and `check_quality`

  ### 10. Hybrid Recommendation Engine
  * **Purpose**: Combines results from the Rule Engine and LinearSVC ML Model for unified, calibrated recommendations.
  * **Rule + ML Merge Logic**:
    * Takes user skills list, merges names into a profile text, and requests predictions from Python ML Service.
    * If the ML service successfully returns results (without fallback):
      * Filters out ML predicted roles that scored < 15 on the Rule Engine.
      * Combines remaining scores: `Math.round(ruleScore * 0.5 + (mlConfidence * 100) * 0.5)`.
      * Merges these hybrid scores into the final recommendations list.
    * If ML service times out (1000ms), fails, or returns fallback, it falls back to using pure Rule Engine scores.
  * **Ranking Algorithm**: Sorts hybrid and rule scores descending, returning the top 3 items.
  * **File Path**: [role.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/role.service.js) → `matchRoles` (Orchestrates ML call & merge)

  ### 11. Frontend Pages
  * **Purpose**: User interface pages served by Vite dev server on Port 5173 (or built static assets in dist/).
  * **Routing File**: [App.tsx](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/frontend/src/App.tsx) (React Router page routing)
  * **Pages and Routes**:
    * **Landing Page (`/`)**: [Landing.tsx](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/frontend/src/pages/Landing.tsx) — Main entry with feature overview and quick access.
    * **Resume Upload Page (`/analysis`)**: [Upload.tsx](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/frontend/src/pages/Upload.tsx) — Handles dragging/dropping resume PDF, progress animations, calls backend `/extract-skills`.
    * **Manual Skill Form (`/manual`)**: [ManualEntry.tsx](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/frontend/src/pages/ManualEntry.tsx) — Interactive skill selection, calls backend `/detect-domain`.
    * **Recommendations (`/recommendations`)**: [Recommendations.tsx](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/frontend/src/pages/Recommendations.tsx) — Displays Top-3 recommended career tracks, match scores, domain, confidence, and skill gap cards.
    * **Role Details (`/details/:roleName`)**: [RoleDetail.tsx](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/frontend/src/pages/RoleDetail.tsx) — Dynamic page presenting interactive career roadmaps and module training paths.

  ---

  ## SECTION C: API → File Mapping

  | Endpoint | Method | Port | Target Engine | Controller / Source File | Target Service & Function | Purpose |
  | :--- | :---: | :---: | :--- | :--- | :--- | :--- |
  | **`/health`** | `GET` | 8000 | Python ML Service | `ml/inference_service.py` | `health_check()` | Verifies ML models exist and reports status. |
  | **`/predict`** | `POST` | 8000 | Python ML Service | `ml/inference_service.py` | `InferenceGuard.predict_safe()` | Performs safe LinearSVC prediction. |
  | **`/extract-skills`** | `POST` | 5000 | Express Backend | `backend/src/routes/resume.routes.js` | `resume.service.js` → `extractSkillsFromResume()` | Parses resume PDFs and extracts skills & levels. |
  | **`/detect-domain`** | `POST` | 5000 | Express Backend | `backend/src/routes/skill.routes.js` | `domain.service.js` → `detectDomain()` | Classifies dominant domain from JSON skills list. |
  | **`/match-roles`** | `POST` | 5000 | Express Backend | `backend/src/routes/role.routes.js` | `role.service.js` → `matchRoles()` | Executes Hybrid recommendation ranking. |
  | **`/suggest-domain`** | `POST` | 5000 | Express Backend | `backend/src/routes/knowledge.routes.js` | `gemini.service.js` → `suggestDomainForSkill()` | Helper suggesting domain mappings via Gemini LLM. |

  > [!NOTE]
  > The Node.js Backend Gateway currently does **not** host a `/health` endpoint on port 5000. Express requests to `/health` return 404.

  ---

  ## SECTION D: Folder Structure Explanation

  ```
  CareerMapper/
  ├── backend/                       # Node.js API Gateway & Business Logic (Port 5000)
  │   ├── scratch/                   # Temporary scripts and testing tools (untracked)
  │   ├── src/
  │   │   ├── app.js                 # Express application initialization & middleware routing
  │   │   ├── server.js              # Server entry point, binds Mongo & starts app on PORT
  │   │   ├── config/                # Environment variables (env.js) and MongoDB connection (db.js)
  │   │   ├── controllers/           # HTTP controllers handling requests, validation & responses
  │   │   ├── data/                  # Local databases (domains.json, roles.json, roadmaps.json)
  │   │   ├── middleware/            # Auth & error handling middlewares
  │   │   ├── models/                # MongoDB ODM Mongoose schema definitions
  │   │   ├── routes/                # Express router mounts (role, resume, skill, knowledge)
  │   │   ├── services/              # Core business services (hybrid role matching, resume, gemini)
  │   │   └── utils/                 # Utilities (proximity level detector, skill normalizer, file reader)
  │   └── tests/                     # Unit and integration test suites
  │
  ├── frontend/                      # React 19 + TypeScript + Vite SPA (Port 5173)
  │   ├── dist/                      # Production build distribution folder
  │   └── src/                       # React application source code
  │       ├── components/            # Reusable UI components (Navbar, Footer, SkillBadge, GapCard, etc.)
  │       ├── context/               # React Context providers (AssessmentContext)
  │       ├── data/                  # Static roadmap & SVG assets
  │       ├── hooks/                 # Custom React hooks
  │       ├── pages/                 # Route page components (Landing, Upload, ManualEntry, Recommendations, RoleDetail)
  │       ├── services/              # API Client (api.ts) & backend communication layer
  │       └── types/                 # TypeScript interfaces & domain schemas
  │
  ├── ml/                            # Active Python ML Inference Service (Port 8000)
  │   ├── datasets/                  # Raw and preprocessed CSV IT roles data
  │   ├── models/                    # Serialized joblib models (LinearSVC, TF-IDF Vectorizer)
  │   ├── notebooks/                 # Baseline model training Jupyter notebook (.ipynb)
  │   ├── scripts/                   # Dataset preprocessing & clean CSV generation python files
  │   ├── utils/                     # Spam filter, quality check, and Inference Guard logic
  │   ├── inference_service.py       # FastAPI routing, health checks, and prediction endpoint
  │   └── requirements.txt           # Python library requirements (scikit-learn, joblib, fastapi)
  ```

  ---

  ## SECTION E: Demo Question Cheat Sheet

  **Q: Where is skill extraction implemented?**
  * **A**: [resume.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/resume.service.js) → `extractSkillsFromResume()`
    * Replaces multiple whitespace patterns, maps against domains list in `domains.json`, searches using lookaround regular expressions, and feeds positions to the level detector.

  **Q: Where is the ML model loaded?**
  * **A**: [inference_guard.py](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/utils/inference_guard.py) → `_load_models()`
    * Loads `best_role_classifier.joblib` and `best_vectorizer.joblib` into memory on demand using `joblib.load()`.

  **Q: Where is domain detection implemented?**
  * **A**: [domain.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/domain.service.js) → `detectDomain()`
    * Calculates mapping overlap against domain skill sets in `data/domains.json` and computes confidence.

  **Q: Where is the hybrid merge math implemented?**
  * **A**: [role.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/role.service.js) → `matchRoles()`
    * Triggers ML service prediction, filters out predictions that scored < 15 on rules, and computes:
      `CombinedScore = Math.round(RuleScore * 0.5 + MLConfidence * 100 * 0.5)`

  **Q: Where is the token spam filter implemented?**
  * **A**: [inference_guard.py](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/utils/inference_guard.py) → `sanitize_text()`
    * Normalizes the skill text, splits it into words, and caps any duplicate technical word occurrences to a maximum of 2 to protect TF-IDF vectorization from keyword stuffing.

  **Q: Where is the non-technical garbage text filter implemented?**
  * **A**: [inference_guard.py](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/utils/inference_guard.py) → `check_quality()`
    * Runs length validation, unique token check, and verifies if the TF-IDF representation has at least 2 matching technical vocabulary indices (`vec.nnz < 2`).
