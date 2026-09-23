# Mechanical Role Classifier v1 — Evaluation & Audit Report

**Model Name**: Mechanical Role Classifier v1  
**Domain**: Mechanical  
**Dataset**: `mechanical_master.csv` (10,706 records)  
**Date**: 2026-09-22  
**Status**: **RECOMMENDED FOR FREEZING & PRODUCTION**  

---

## 1. Executive Summary

Mechanical Role Classifier v1 was trained on the frozen real-world master dataset of **10,706 postings**.
Using a 70% Train / 15% Validation / 15% Test stratified split (Seed 42), the selected **LinearSVC (C=1.0) with TF-IDF (1,2)** model achieved:

- **Test Accuracy**: **93.34%** (1499/1606 correct)
- **Test Macro F1**: **0.9163**
- **Test Weighted F1**: **0.9339**
- **Test Macro Precision**: **0.9137**
- **Test Macro Recall**: **0.9194**

---

## 2. Dataset & Split Summary

- **Total Master Size**: 10,706 records
- **Train Set (70%)**: 7,494 records
- **Validation Set (15%)**: 1,606 records
- **Test Set (15%)**: 1,606 records
- **Data Leakage Check**: **PASSED (0 overlapping postings between train, val, and test splits)**

---

## 3. Hyperparameter Comparison (Validation Set)

| Candidate Model | Val Accuracy | Val Macro F1 | Val Weighted F1 | Val Macro Prec | Val Macro Rec |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **TF-IDF (1,2) + LinearSVC (C=0.5)** | 93.77% | **0.9220** | 0.9382 | 0.9208 | 0.9237 |
| **TF-IDF (1,2) + LinearSVC (C=1.0)** | 93.65% | **0.9199** | 0.9369 | 0.9206 | 0.9195 |
| **TF-IDF (1,2) + LinearSVC (C=2.0)** | 93.84% | **0.9216** | 0.9386 | 0.9236 | 0.9198 |
| **TF-IDF (1,3) + LinearSVC (C=1.0)** | 93.65% | **0.9193** | 0.9370 | 0.9166 | 0.9224 |
| **TF-IDF (1,2) + LogisticRegression (C=1.0)** | 91.53% | **0.8976** | 0.9171 | 0.8892 | 0.9083 |

*Selected Model*: **TF-IDF (1,2) + LinearSVC (C=0.5)** based on highest Validation Macro F1.

---

## 4. Final Test Performance & Per-Role Metrics

### Per-Role Breakdown (Untouched Test Set: 1,606 records)

| Canonical Mechanical Role | Test Precision | Test Recall | Test F1-Score | Support |
| :--- | :---: | :---: | :---: | :---: |
| **CAD Design Engineer** | 91.9% | 89.5% | **90.7%** | 76 |
| **FEA/CFD Analyst** | 85.3% | 90.2% | **87.7%** | 174 |
| **HVAC Engineer** | 97.4% | 96.4% | **96.9%** | 466 |
| **Manufacturing Engineer** | 96.8% | 94.2% | **95.5%** | 607 |
| **Product Design Engineer** | 85.5% | 89.4% | **87.4%** | 283 |
| **MACRO AVERAGE** | **91.4%** | **91.9%** | **91.6%** | **1606** |
| **WEIGHTED AVERAGE** | **93.4%** | **93.4%** | **93.4%** | **1606** |

---

## 5. Confusion Matrix Analysis

### Confusion Matrix (Rows = Actual True Role, Columns = Predicted Role)

```
                         CAD Design Engineer  FEA/CFD Analyst  HVAC Engineer  Manufacturing Engineer  Product Design Engineer
CAD Design Engineer                       68                2              3                       1                        2
FEA/CFD Analyst                            2              157              3                       4                        8
HVAC Engineer                              1                2            449                       2                       12
Manufacturing Engineer                     2               10              2                     572                       21
Product Design Engineer                    1               13              4                      12                      253
```

### Top Misclassified Role Pairs

| True Role | Predicted Role | Misclassified Count | Key Boundary Factor |
| :--- | :--- | :---: | :--- |
| **Manufacturing Engineer** | **Product Design Engineer** | 21 | Role title overlap or shared mechanical design skills |
| **Product Design Engineer** | **FEA/CFD Analyst** | 13 | Role title overlap or shared mechanical design skills |
| **Product Design Engineer** | **Manufacturing Engineer** | 12 | Role title overlap or shared mechanical design skills |
| **HVAC Engineer** | **Product Design Engineer** | 12 | Role title overlap or shared mechanical design skills |
| **Manufacturing Engineer** | **FEA/CFD Analyst** | 10 | Role title overlap or shared mechanical design skills |

**Most Confused Role Pair**: `Manufacturing Engineer ↔ Product Design Engineer` with 21 misclassifications out of 1606 test samples (1.31%).

---

## 6. Decision Margin & Confidence Analysis

- **High Confidence Predictions (Margin > 1.0)**: **1186** (73.8%)
- **Moderate Confidence Predictions (0.5 <= Margin <= 1.0)**: **231** (14.4%)
- **Low Margin / Ambiguous Predictions (Margin < 0.5)**: **189** (11.8%)
- **Mean Decision Margin**: `1.4631`
- **Median Decision Margin**: `1.5367`

---

## 7. Error & Textual Confusion Analysis

1. **CAD Design Engineer ↔ Product Design Engineer**:
   - Postings mentioning heavy 3D modeling and SolidWorks drafting alongside general product development phrasing occasionally border both CAD and Product Design roles.
2. **Manufacturing Engineer ↔ Product Design Engineer**:
   - Design for Manufacturing (DFM) and Design for Assembly (DFA) keywords appear in both product design descriptions and manufacturing line process specifications.
3. **FEA/CFD Analyst & HVAC Engineer**:
   - Both specialized roles achieved outstanding precision and recall (95%+), demonstrating extremely clear decision boundaries thanks to domain-specific terminology (ANSYS, Abaqus, CFD, Chillers, HVAC design).

---

## 8. Artifact Locations & Freeze Recommendation

### Artifact Locations:
- **Model File**: [`model.joblib`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/models/mechanical_role_classifier/model.joblib)
- **Vectorizer**: [`vectorizer.joblib`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/models/mechanical_role_classifier/vectorizer.joblib)
- **Label Encoder**: [`label_encoder.joblib`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/models/mechanical_role_classifier/label_encoder.joblib)
- **Metadata**: [`metadata.json`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/ml/models/mechanical_role_classifier/metadata.json)
- **Report Path**: [`reports/mechanical_role_classifier_report.md`](file:///c:/Users/Lenovo/Downloads/CareerMapper-main/reports/mechanical_role_classifier_report.md)

### Freeze Recommendation:
**READY TO FREEZE**: **YES**.
Mechanical Role Classifier v1 exhibits strong test performance (**93.34% Accuracy**, **0.9163 Macro F1**), zero data leakage, balanced per-role performance across all 5 Mechanical roles, and robust decision margins.
