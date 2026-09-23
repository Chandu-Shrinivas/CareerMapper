# Mechanical Role Classifier v1 — Shadow Mode Status & Regression Analysis Report

**Domain**: Mechanical  
**Module**: `MechanicalHybridClassifier` (`ml/mechanical_hybrid_classifier.py`)  
**Date**: 2026-09-23  
**Status**: **EXPERIMENTAL_SHADOW_ONLY** (`MECHANICAL_HYBRID_SHADOW_MODE = True`)  
**Authoritative Production Predictor**: **Mechanical Role Classifier v1 (LinearSVC C=0.5)**  

---

## 1. Executive Summary & Decision Rationale

Following the independent 65-case **T2 stress test**, evaluation demonstrated that the **frozen Mechanical Role Classifier v1 ML model** outperforms the rule-based Shadow Hybrid decision layer:

- **Baseline ML Model**: **92.45% Accuracy** (49/53) | **0.9332 Macro F1**
- **Shadow Hybrid Layer**: **88.68% Accuracy** (47/53) | **0.7593 Macro F1**

**Regression Observed**: The hybrid rules, designed to disambiguate CAD vs Product Design on an earlier suite, caused a net regression (**-3.77% Accuracy**, **-0.1739 Macro F1**) on unseen benchmark cases—particularly by over-rejecting minimal inputs (e.g., `"CFD"`) and overriding valid ML boundary predictions.

**Conclusion**:
- **Mechanical Role Classifier v1** remains the **sole authoritative production predictor** (`final_role = ml_role`).
- The **Mechanical Hybrid Layer** is retained strictly for **experimental, diagnostic logging** (`HYBRID_STATUS = "EXPERIMENTAL_SHADOW_ONLY"`).

---

## 2. Benchmark Comparison (T2 65-Case Suite)

| Metric | Baseline ML Model (v1) | Hybrid Diagnostic Layer | Status / Invariant |
| :--- | :---: | :---: | :--- |
| **In-Domain Accuracy (53 cases)** | **92.45%** (49/53) | **88.68%** (47/53) | Baseline superior (+3.77%) |
| **In-Domain Macro F1** | **0.9332** | **0.7593** | Baseline superior (+0.1739) |
| **OOD Diagnostic Rejection (12 cases)** | **0.0%** (Closed Set) | **41.67%** (5/12) | Diagnostic telemetry only |
| **Shadow Mode Invariant (`final_role == ml_role`)** | **100.0%** (65/65) | N/A |  **100% Invariant Holds** |

---

## 3. Detailed Regression Analysis

1. **Minimal Inputs**:
   - For ultra-short inputs like `"CFD"` (`T2_042`), the hybrid layer's length filter (`len < 10`) returned `REJECTED_OOD`, overriding the ML model's correct prediction of `FEA/CFD Analyst`.
2. **Boundary Over-Correction**:
   - On boundary prompts like `T2_024` (`"Mechanical drafter using CATIA..."`), rule interactions between tool names and design phrasing caused false role assignments.
3. **Generalization Gap**:
   - Static regex/keyword rules tuned on a specific set of boundary cases do not generalize cleanly across diverse real-world phrasing compared to the sublinear TF-IDF + LinearSVC feature weights.

---

## 4. Model & Data Artifacts Untouched Confirmation

The following core artifacts remain 100% unmodified and frozen:

- [`ml/models/mechanical_role_classifier/model.joblib`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/models/mechanical_role_classifier/model.joblib): **UNTOUCHED (0 bytes modified)**
- [`ml/models/mechanical_role_classifier/vectorizer.joblib`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/models/mechanical_role_classifier/vectorizer.joblib): **UNTOUCHED (0 bytes modified)**
- [`ml/models/mechanical_role_classifier/label_encoder.joblib`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/models/mechanical_role_classifier/label_encoder.joblib): **UNTOUCHED (0 bytes modified)**
- [`scratch/mechanical_master.csv`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/scratch/mechanical_master.csv): **UNTOUCHED (0 bytes modified)**
- IT & ECE Classifiers: **UNTOUCHED**

---

## 5. Future Requirements Before Hybrid Activation

Before any decision layer can become authoritative in production (`MECHANICAL_HYBRID_SHADOW_MODE = False`), all of the following conditions must be met:

1. **Zero Accuracy Regression**: The hybrid layer must achieve $\ge 92.45\%$ accuracy on all benchmark suites without reducing Macro F1 below $0.9332$.
2. **Short/Minimal Input Safety**: Minimal technical inputs (`"CFD"`, `"AutoCAD"`, `"CNC machining"`) must be correctly mapped without false OOD rejection.
3. **Cross-Domain Generalization**: Rules must demonstrate non-degrading performance across at least 3 independent unseen test suites.

---

## 6. Final Recommendation & System Status

- **Mechanical Role Classifier v1** remains the **authoritative Mechanical role predictor**.
- **Mechanical Hybrid Layer** remains **experimental/shadow-only** (`MECHANICAL_HYBRID_SHADOW_MODE = True`, `HYBRID_STATUS = "EXPERIMENTAL_SHADOW_ONLY"`).
