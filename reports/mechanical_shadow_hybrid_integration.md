# Mechanical Role Classifier v1 — Shadow Hybrid Integration Report

**Module**: `MechanicalHybridClassifier` (`ml/mechanical_hybrid_classifier.py`)  
**Domain**: Mechanical  
**Date**: 2026-09-23  
**Status**: **INTEGRATED & OPERATING IN SHADOW MODE** (`MECHANICAL_HYBRID_SHADOW_MODE = True`)  

---

## 1. Integration Architecture & Workflow

The **Mechanical Shadow Hybrid Layer** wraps around the frozen **Mechanical Role Classifier v1** without altering model weights, vectorizer vocabularies, or dataset files:

```
                  Input Text
                       │
                       ▼
         Frozen Mechanical Classifier v1
         (TF-IDF (1,2) + LinearSVC C=0.5)
                       │
         ┌─────────────┴─────────────┐
         │                           │
      ml_role                  ml_second_role & decision_margin
         │                           │
         └─────────────┬─────────────┘
                       ▼
        Mechanical Shadow Hybrid Layer
        (Boundary Disambiguation & OOD Check)
                       │
         ┌─────────────┴─────────────┐
         │                           │
    hybrid_role               decision_type & ood_rejected
         │                           │
         └─────────────┬─────────────┘
                       ▼
       Shadow Mode Gate (MECHANICAL_HYBRID_SHADOW_MODE=True)
                       │
    ┌──────────────────┴──────────────────┐
    │                                     │
Shadow Mode=True                      Shadow Mode=False
final_role = ml_role                  final_role = hybrid_role
(Logged for diagnostics)              (Production returned role)
```

---

## 2. Decision Logic & Boundary Disambiguation Rules

Boundary disambiguation is evaluated **only** when `top1` and `top2` predictions are `CAD Design Engineer` and `Product Design Engineer` with decision margin $< 2.0$:

- **CAD-oriented Signals**:
  - `drafting`, `drafter`, `autocad`, `autocad designer`, `3d cad design specialist`, `detailer`, `mechanical drafter`
  - Technical drawing context: `gd&t`, `engineering drawings`, `technical drawings`, `tolerance stack-up`
  - *Condition*: If CAD title/drawing evidence exists AND product development signals are ABSENT $\rightarrow$ set `hybrid_role = "CAD Design Engineer"`, `decision_type = "RESOLVED_CAD_DISAMBIGUATION"`.
- **Product Development Signals**:
  - `product development`, `product design`, `dfm`, `dfa`, `bom`, `prototyping`, `prototype`, `new product development`, `design validation`
  - *Condition*: If product development signals exist $\rightarrow$ set `hybrid_role = "Product Design Engineer"`, `decision_type = "RESOLVED_PRODUCT_DESIGN_DISAMBIGUATION"`.
- **Safety Invariant**: Neither `SolidWorks` alone nor `GD&T` alone triggers an automatic CAD override, as both terms occur in multiple Mechanical roles.

---

## 3. Out-of-Domain (OOD) Handling Rules

The underlying ML classifier is a closed-set multiclass model. The hybrid layer detects non-mechanical inputs and returns `decision_type = "REJECTED_OOD"`:

- **OOD Signals Evaluated**: Software/IT (`software`, `rest api`, `java`, `spring boot`, `react`), Data Science (`data scientist`, `pandas`), Accounting (`accountant`, `tally`), Marketing (`marketing analyst`, `seo`), Civil (`civil engineer`, `reinforced concrete`), and Electrical/ECE (`electrical engineer`, `embedded systems`, `firmware`, `pcb circuits`).
- **Safety Threshold**: Rejection triggers ONLY when strong non-mechanical domain terms appear WITHOUT explicit Mechanical domain evidence (`cad`, `fea`, `cfd`, `ansys`, `cnc`, `machining`, `hvac`, `solidworks`, `autocad`, `catia`, `creo`, `lean manufacturing`, `dfm`, `dfa`, `bom`).

---

## 4. Required Output JSON Schema

The integrated module returns a complete, structured diagnostic dictionary:

```json
{
  "ml_role": "Product Design Engineer",
  "ml_second_role": "CAD Design Engineer",
  "decision_margin": 1.8585,
  "hybrid_role": "CAD Design Engineer",
  "decision_type": "RESOLVED_CAD_DISAMBIGUATION",
  "ood_rejected": false,
  "final_role": "Product Design Engineer",
  "shadow_mode": true,
  "reason": "CAD drafting title/drawing evidence present without product development/DFM/BOM"
}
```

---

## 5. Stress-Test Reproduction & Validation

Evaluating the integrated `MechanicalHybridClassifier` module on the 114 stress-test cases:

| Metric | Baseline ML | Integrated Shadow Hybrid | Reproduction Verification |
| :--- | :---: | :---: | :--- |
| **In-Domain Accuracy (91 cases)** | **84.62%** (77/91) | **89.01%** (81/91) |  **EXACT MATCH (+4.39%)** |
| **In-Domain Macro F1 (91 cases)** | **0.8381** | **0.8902** |  **EXACT MATCH (+0.0521)** |
| **OOD Rejection Count (23 OOD cases)** | **0.0%** (Closed Set) | **69.57%** (16/23) |  **EXACT MATCH (16/23)** |
| **Shadow Mode Invariant (`final_role == ml_role`)** | N/A | **100.0%** (114/114) |  **EXACT MATCH** |

---

## 6. Model Artifacts Untouched Confirmation

- [`ml/models/mechanical_role_classifier/model.joblib`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/models/mechanical_role_classifier/model.joblib): **UNTOUCHED (0 bytes modified)**
- [`ml/models/mechanical_role_classifier/vectorizer.joblib`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/models/mechanical_role_classifier/vectorizer.joblib): **UNTOUCHED (0 bytes modified)**
- [`ml/models/mechanical_role_classifier/label_encoder.joblib`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/models/mechanical_role_classifier/label_encoder.joblib): **UNTOUCHED (0 bytes modified)**
- [`scratch/mechanical_master.csv`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/scratch/mechanical_master.csv): **UNTOUCHED (0 bytes modified)**
- IT & ECE Classifiers: **UNTOUCHED**
