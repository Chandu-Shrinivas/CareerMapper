# CareerMapper Complete API Postman Testing Guide

This document provides a verified, complete API inventory and testing specification generated from the actual CareerMapper codebase (covering the Node.js Express Backend, Rule Engine, and Python FastAPI ML Inference Service). Use this guide to configure and run Postman tests for all components.

---

## Complete API Inventory Table

| Endpoint | Method | Engine | Port | Source File | Status |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **`/health`** | `GET` | Python ML Service, LinearSVC Model | `8000` | `ml/inference_service.py` | Active |
| **`/predict`** | `POST` | Inference Safety Layer, LinearSVC | `8000` | `ml/inference_service.py` | Active |
| **`/extract-skills`**| `POST` | Resume Parser, Skill Extraction & Level Detection, Domain Detection | `5000` | `backend/src/routes/resume.routes.js` | Active |
| **`/detect-domain`** | `POST` | Domain Detection Engine, Skill Normalizer | `5000` | `backend/src/routes/skill.routes.js` | Active |
| **`/match-roles`** | `POST` | Rule Engine, Hybrid Recommendation Engine | `5000` | `backend/src/routes/role.routes.js` | Active |
| **`/suggest-domain`**| `POST` | Domain Detection (Gemini LLM Helper) | `5000` | `backend/src/routes/knowledge.routes.js` | Active |
| **`/health`** | `GET` | Node.js Backend | `5000` | *N/A (Missing from code)* | **MISSING** |

---

## Codebase Audit: Component Analysis & Health Gaps

After auditing the entire backend and Python ML service codebase, the following architectural gaps and issues have been identified:

### 1. Missing Backend Health Endpoint
* There is **no `/health` endpoint** in the Node.js Express backend. The backend Express routing setup in `backend/src/app.js` only mounts `skillRoutes`, `knowledgeRoutes`, `resumeRoutes`, and `roleRoutes` at the root `/`. While the Python ML service implements `GET /health` on port `8000`, the Node.js API gateway on port `5000` is missing a corresponding health route.

### 2. Unimplemented Route Drafts & Controller Files
Six endpoint categories exist in the `backend/src/routes/` folder as completely empty (0-byte) files. Their corresponding controllers and services are also empty shells:
* `admin.routes.js` (expected paths like `POST /admin/setup`, `GET /admin/stats` are missing)
* `auth.routes.js` (expected login/register endpoints are missing)
* `company.routes.js` (expected job-posting organization management is missing)
* `domain.routes.js` (expected domain listing/metadata is missing)
* `gap.routes.js` (expected skill gap analysis engine is missing)
* `job.routes.js` (expected job posting CRUD operations are missing)

### 3. Unused Service Functions
* `findUnknownSkills` inside [knowledge.service.js](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/backend/src/services/knowledge.service.js) is fully implemented but is **never imported or referenced** in any active controller or router.

### 4. Duplicate Python Service Code
* The directory `ml-service` contains an empty `ml_api.py` and `predict.py` file. The active Python ML Inference service is entirely located inside the `ml` folder (`ml/inference_service.py` and `ml/utils/inference_guard.py`). The `ml-service` directory is stale and should be removed.

---

## SECTION 1: Backend Health Tests

### Test 1.1: Python ML Service Health Check
* **Exact URL**: `http://127.0.0.1:8000/health`
* **Method**: `GET`
* **Headers**: None
* **Body**: None (Empty)
* **Expected Output (200 OK)**:
  ```json
  {
    "status": "healthy",
    "model": "LinearSVC",
    "classes_loaded": 10
  }
  ```
* **Pass Criteria**: Status is `200 OK`, response JSON contains `"status": "healthy"`, and models are verified as loaded.
* **Fail Criteria**: Response status code is not 200, or the JSON indicates `"status": "unhealthy"` with a failure reason.

### Test 1.2: Node.js Backend Health Check (Missing Endpoint Verification)
* **Exact URL**: `http://localhost:5000/health`
* **Method**: `GET`
* **Headers**: None
* **Body**: None
* **Expected Output (404 Not Found)**:
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="utf-8">
  <title>Error</title>
  </head>
  <body>
  <pre>Cannot GET /health</pre>
  </body>
  </html>
  ```
* **Pass Criteria**: Returns `404 Not Found` (confirming the endpoint is currently missing from the codebase).
* **Fail Criteria**: Returns `200 OK` (indicating a route was added without documentation).

---

## SECTION 2: Resume Parser Tests

### Test 2.1: Parse PDF and Extract Content
* **Exact URL**: `http://localhost:5000/extract-skills`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `multipart/form-data`
* **Body (Form-Data)**:
  * Key: `file`
  * Type: `File`
  * Value: `[Upload test-resume.pdf or any text-based PDF]`
* **Expected Output (200 OK)**:
  ```json
  {
    "skills": [
      {
        "name": "react",
        "level": "advanced"
      },
      {
        "name": "python",
        "level": "beginner"
      }
    ],
    "domain": "IT",
    "confidence": 100
  }
  ```
* **Pass Criteria**: HTTP Status `200 OK`, response body contains a `skills` array, a detected `domain`, and a `confidence` percentage.
* **Fail Criteria**: HTTP Status is `400` or `500`, or response does not contain the extracted skills.

---

## SECTION 3: Skill Extraction Tests

### Test 3.1: Technical Skill Vocabulary Extraction
* **Exact URL**: `http://localhost:5000/extract-skills`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `multipart/form-data`
* **Body (Form-Data)**:
  * Key: `file`
  * Value: `[Upload a PDF containing text: "Experienced SolidWorks modeler with KiCad and VHDL skills"]`
* **Expected Output (200 OK)**:
  ```json
  {
    "skills": [
      {
        "name": "solidworks",
        "level": "intermediate"
      },
      {
        "name": "kicad",
        "level": "beginner"
      },
      {
        "name": "vhdl",
        "level": "beginner"
      }
    ],
    "domain": "ECE",
    "confidence": 67
  }
  ```
  *(Note: SolidWorks belongs to Mechanical, KiCad/VHDL belong to ECE, yielding ECE as the dominant domain at 2/3 = 67% confidence)*
* **Pass Criteria**: PDF parser successfully maps synonyms (if any) and extracts the canonical tokens matching `data/domains.json`.
* **Fail Criteria**: Response does not return the listed ECE/Mechanical skills or reports an incorrect domain.

---

## SECTION 4: Skill Level Detection Tests

### Test 4.1: Proximity Sentence Level Extraction
* **Exact URL**: `http://localhost:5000/extract-skills`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `multipart/form-data`
* **Body (Form-Data)**:
  * Key: `file`
  * Value: `[Upload a PDF containing text: "Advanced React developer with intermediate Node.js experience"]`
* **Expected Output (200 OK)**:
  ```json
  {
    "skills": [
      {
        "name": "react",
        "level": "advanced"
      },
      {
        "name": "node",
        "level": "intermediate"
      }
    ],
    "domain": "IT",
    "confidence": 100
  }
  ```
* **Pass Criteria**: Proximity algorithm isolates sentence separators and correctly classifies `react` as `advanced` and `node` as `intermediate`.
* **Fail Criteria**: `react` is assigned `intermediate` or `node` is assigned `advanced` (leakage across sentence boundaries).

---

## SECTION 5: Default Level Assignment Tests

### Test 5.1: No Level Keywords Present
* **Exact URL**: `http://localhost:5000/extract-skills`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `multipart/form-data`
* **Body (Form-Data)**:
  * Key: `file`
  * Value: `[Upload a PDF containing text: "Python developer with SQL knowledge"]`
* **Expected Output (200 OK)**:
  ```json
  {
    "skills": [
      {
        "name": "python",
        "level": "beginner"
      },
      {
        "name": "sql",
        "level": "beginner"
      }
    ],
    "domain": "IT",
    "confidence": 100
  }
  ```
* **Pass Criteria**: Both `python` and `sql` default to `beginner` since no proximity level keywords ("expert", "advanced", "worked", etc.) exist in the sentence.
* **Fail Criteria**: Skills are assigned any level higher than `beginner`.

### Test 5.2: Invalid Skill Levels Defaulting (JSON Pre-Extracted Input)
* **Exact URL**: `http://localhost:5000/detect-domain`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "skills": [
      {
        "name": "react",
        "level": "super-pro"
      }
    ]
  }
  ```
* **Expected Output (200 OK)**:
  ```json
  {
    "skills": [
      {
        "name": "react",
        "level": "beginner"
      }
    ],
    "domain": "IT",
    "confidence": 100
  }
  ```
* **Pass Criteria**: The level `"super-pro"` is caught as invalid and successfully defaulted to `"beginner"`.
* **Fail Criteria**: The invalid level is passed through unchanged, or the request crashes.

---

## SECTION 6: Domain Detection Tests

### Test 6.1: High Confidence Domain Mapping
* **Exact URL**: `http://localhost:5000/detect-domain`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "skills": [
      { "name": "accounting", "level": "advanced" },
      { "name": "tally", "level": "intermediate" },
      { "name": "gst", "level": "advanced" }
    ]
  }
  ```
* **Expected Output (200 OK)**:
  ```json
  {
    "skills": [
      { "name": "accounting", "level": "advanced" },
      { "name": "tally", "level": "intermediate" },
      { "name": "gst", "level": "advanced" }
    ],
    "domain": "BCom",
    "confidence": 100
  }
  ```
* **Pass Criteria**: Domain is resolved as `"BCom"` with `100` confidence.
* **Fail Criteria**: The domain is resolved as "Unknown" or mapped to a different category.

### Test 6.2: AI-Assisted Domain Suggestion (Single Skill)
* **Exact URL**: `http://localhost:5000/suggest-domain`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "skill": "solidworks"
  }
  ```
* **Expected Output (200 OK)**:
  ```json
  {
    "skill": "solidworks",
    "suggestedDomain": "Mechanical"
  }
  ```
* **Pass Criteria**: Returns JSON with the skill name and the suggested domain matching LLM classification.
* **Fail Criteria**: Response returns an error, or the `suggestedDomain` field is empty.

---

## SECTION 7: Rule Engine Tests

### Test 7.1: Anchor Skill Recommendation Boost
* **Exact URL**: `http://localhost:5000/match-roles`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "skills": [
      { "name": "testing", "level": "advanced" },
      { "name": "postman", "level": "advanced" },
      { "name": "api", "level": "intermediate" }
    ]
  }
  ```
* **Expected Output (200 OK - Fallback/Standalone Rule Engine)**:
  ```json
  {
    "recommendations": [
      {
        "role": "Software Tester",
        "score": 85
      }
    ]
  }
  ```
  *(Note: Tester anchor skills are fully matched, resulting in a high score of 85)*
* **Pass Criteria**: `Software Tester` is returned as the top recommended role with a score >= 70.
* **Fail Criteria**: Software Tester is omitted or scored below 50.

### Test 7.2: Core Anchor Skill Penalization (Anti-Leakage)
* **Exact URL**: `http://localhost:5000/match-roles`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "skills": [
      { "name": "python", "level": "advanced" },
      { "name": "sql", "level": "advanced" },
      { "name": "linux", "level": "advanced" }
    ]
  }
  ```
* **Expected Output (200 OK)**:
  ```json
  {
    "recommendations": [
      {
        "role": "Data Analyst",
        "score": 45
      },
      {
        "role": "Database Administrator",
        "score": 38
      }
    ]
  }
  ```
* **Pass Criteria**: `Software Tester` and `Frontend Developer` are **completely excluded** (or scored below 15) because their core anchor skills (`testing`, `postman` for Tester; `react`, `html` for Frontend) are missing.
* **Fail Criteria**: `Software Tester` or `Frontend Developer` leakage occurs with scores >= 45.

---

## SECTION 8: ML Prediction Tests

### Test 8.1: Direct ML Service Role Classification
* **Exact URL**: `http://127.0.0.1:8000/predict`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "text": "html css javascript react redux frontend web developer ui designer responsive design"
  }
  ```
* **Expected Output (200 OK)**:
  ```json
  {
    "success": true,
    "fallback": false,
    "predictions": [
      {
        "role": "Frontend Developer",
        "confidence": 0.7317806465261768
      },
      {
        "role": "Full Stack Developer",
        "confidence": 0.06203550121298066
      },
      {
        "role": "UI/UX Designer",
        "confidence": 0.044845328658844705
      }
    ]
  }
  ```
* **Pass Criteria**: Status `200 OK`, `success` is `true`, `fallback` is `false`, and `predictions` list has `"role": "Frontend Developer"` with highest confidence.
* **Fail Criteria**: Classification returns wrong primary role, fallback is triggered, or HTTP error status is returned.

---

## SECTION 9: Inference Safety Tests

### Test 9.1: Term Spam Sanitization (TF-IDF Weight Inflation Block)
* **Exact URL**: `http://127.0.0.1:8000/predict`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "text": "python python python python python python database database sql sql sql api api api api"
  }
  ```
* **Expected Output (200 OK)**:
  ```json
  {
    "success": true,
    "fallback": false,
    "predictions": [
      {
        "role": "Backend Developer",
        "confidence": 0.5613
      },
      ...
    ]
  }
  ```
* **Pass Criteria**: The safety layer sanitizes text by capping token counts to a maximum of 2, resolving the input to `"python python database database sql sql api api"`, and executing predictions successfully.
* **Fail Criteria**: Request is blocked, or classification accuracy falls due to uncalibrated weights.

### Test 9.2: Low Confidence Confidence-Threshold suppression
* **Exact URL**: `http://127.0.0.1:8000/predict`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "text": "general technology computer programmer analyst coordinator"
  }
  ```
* **Expected Output (200 OK)**:
  ```json
  {
    "success": true,
    "fallback": true,
    "message": "Low confidence prediction",
    "recommendations": []
  }
  ```
* **Pass Criteria**: The top class prediction fails to exceed the **25% confidence threshold**, triggering a safe ML fallback.
* **Fail Criteria**: Returns recommendations with a low-confidence classification, or returns an HTTP error.

### Test 9.3: Non-Technical Garbage Prose Rejection
* **Exact URL**: `http://127.0.0.1:8000/predict`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "text": "the quick brown fox jumps over the lazy dog"
  }
  ```
* **Expected Output (200 OK)**:
  ```json
  {
    "success": false,
    "error": "Non-technical or low-information content detected"
  }
  ```
* **Pass Criteria**: Rejects the request because the vocabulary overlap with the fitted TF-IDF vocabulary is under the minimum index threshold (`vec.nnz < 2`).
* **Fail Criteria**: Service successfully returns a class prediction for random non-technical text.

---

## SECTION 10: Hybrid Recommendation Tests

### Test 10.1: Combined Score Calculations
* **Exact URL**: `http://localhost:5000/match-roles`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "skills": [
      { "name": "react", "level": "advanced" },
      { "name": "javascript", "level": "advanced" },
      { "name": "html", "level": "advanced" },
      { "name": "css", "level": "intermediate" },
      { "name": "dom", "level": "intermediate" }
    ]
  }
  ```
* **Expected Output (200 OK)**:
  ```json
  {
    "recommendations": [
      {
        "role": "Frontend Developer",
        "score": 82
      },
      ...
    ]
  }
  ```
  *(Note: Rule score (90) and ML confidence score (approx 73%) are combined using: `Math.round(90 * 0.5 + 73 * 0.5) = 82`)*
* **Pass Criteria**: Returns top 3 recommended roles where the scores reflect the hybrid equation `(RuleScore * 0.5) + (MLConfidence * 100 * 0.5)`.
* **Fail Criteria**: Scores are purely rule-based (e.g. exactly 90) despite the ML service being operational, or the request fails.

---

## SECTION 11: Failure Tests

### Test 11.1: Missing Skills Array
* **Exact URL**: `http://localhost:5000/detect-domain`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {}
  ```
* **Expected Output (400 Bad Request)**:
  ```json
  {
    "error": "No skills provided"
  }
  ```
* **Pass/Fail Criteria**: Passes if status is 400 with the exact validation message.

### Test 11.2: Skill Missing Name Property
* **Exact URL**: `http://localhost:5000/detect-domain`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "skills": [
      {
        "level": "advanced"
      }
    ]
  }
  ```
* **Expected Output (400 Bad Request)**:
  ```json
  {
    "error": "Each skill must have a name"
  }
  ```
* **Pass/Fail Criteria**: Passes if status is 400 with the exact error message.

### Test 11.3: Suggest Domain Missing Skill String
* **Exact URL**: `http://localhost:5000/suggest-domain`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "skill": 12345
  }
  ```
* **Expected Output (400 Bad Request)**:
  ```json
  {
    "error": "Invalid input. Expected a skill string."
  }
  ```
* **Pass/Fail Criteria**: Passes if status is 400 with the validation message.

### Test 11.4: Match Roles Invalid Skills Format
* **Exact URL**: `http://localhost:5000/match-roles`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "skills": "react"
  }
  ```
* **Expected Output (400 Bad Request)**:
  ```json
  {
    "error": "Invalid input. 'skills' array is required."
  }
  ```
* **Pass/Fail Criteria**: Passes if status is 400 with the exact error message.

### Test 11.5: Direct ML Predict - Malformed Payload (FastAPI Schema)
* **Exact URL**: `http://127.0.0.1:8000/predict`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "text": ["react", "python"]
  }
  ```
* **Expected Output (422 Unprocessable Entity)**:
  ```json
  {
    "detail": [
      {
        "type": "string_type",
        "loc": [
          "body",
          "text"
        ],
        "msg": "Input should be a valid string",
        "input": [
          "react",
          "python"
        ]
      }
    ]
  }
  ```
* **Pass/Fail Criteria**: Passes if FastAPI validation layer blocks the request with a standard 422 status and schema error details.

### Test 11.6: Resume Parser - Missing File Payload
* **Exact URL**: `http://localhost:5000/extract-skills`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `multipart/form-data`
* **Body**: None
* **Expected Output (400 Bad Request)**:
  ```json
  {
    "error": "No file uploaded"
  }
  ```
* **Pass/Fail Criteria**: Passes if status is 400 with the correct error message.
