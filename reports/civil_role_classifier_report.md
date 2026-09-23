# Civil Engineering Role Classifier v1 — Training & Evaluation Report

**Date**: 2026-09-23 11:03:06
**Domain**: Civil Engineering
**Master Dataset**: `data/civil_master.csv` (11,192 records, 100% frozen)
**Model Directory**: `ml/models/civil_role_classifier/`

## 1. Dataset & Split Specification

- **Total Master Records**: 11,192
- **Split Ratios**: 70% Train, 15% Validation, 15% Test (Stratified, `random_state=42`)
- **Train Set Count**: 7,834 records
- **Validation Set Count**: 1,679 records
- **Test Set Count**: 1,679 records (untouched during hyperparameter selection)
- **Train + Validation Retrain Set Count**: 9,513 records (85%)
- **Label Leakage / Cross-Split Overlap**: 0 overlap (Source ID & Text Leakage checks PASSED)

## 2. Validation Candidate Model Comparison

| Candidate Model | N-Gram Range | Analyzer | Classifier (C) | Val Acc | Val Macro Prec | Val Macro Rec | Val Macro F1 | Val Weighted F1 |
|---|---|---|---|---|---|---|---|---|
| `Candidate 1: TF-IDF Word (1,2) + LinearSVC (C=0.5)` | `[1, 2]` | `word` | `LinearSVC (C=0.5)` | 0.9887 | 0.9843 | 0.9884 | **0.9863** | 0.9887 |
| `Candidate 2: TF-IDF Word (1,2) + LinearSVC (C=1.0)` | `[1, 2]` | `word` | `LinearSVC (C=1.0)` | 0.9899 | 0.9870 | 0.9889 | **0.9879** | 0.9899 |
| `Candidate 3: TF-IDF Word (1,3) + LinearSVC (C=1.0)` **(Selected)** | `[1, 3]` | `word` | `LinearSVC (C=1.0)` | 0.9911 | 0.9876 | 0.9897 | **0.9886** | 0.9911 |
| `Candidate 4: TF-IDF Char-wb (3,5) + LinearSVC (C=1.0)` | `[3, 5]` | `char_wb` | `LinearSVC (C=1.0)` | 0.9845 | 0.9805 | 0.9833 | **0.9818** | 0.9845 |
| `Candidate 5: TF-IDF Word (1,2) + LogisticRegression (C=1.0)` | `[1, 2]` | `word` | `LogisticRegression (C=1.0)` | 0.9762 | 0.9673 | 0.9788 | **0.9728** | 0.9763 |

**Selection Rationale**: `Candidate 3: TF-IDF Word (1,3) + LinearSVC (C=1.0)` was selected strictly based on achieving the highest Validation Macro F1 score (0.9886) and maintaining balanced recall across minority and majority Civil classes without peeking at the test set.

## 3. Final Model Evaluation on Untouched Test Set

| Evaluation Metric | Test Score |
|---|---| 
| **Overall Accuracy** | **0.9946** (99.46%) |
| **Macro Precision** | 0.9964 |
| **Macro Recall** | 0.9936 |
| **Macro F1 Score** | **0.9950** |
| **Weighted F1 Score** | **0.9946** |

## 4. Per-Role Performance Breakdown

| Canonical Civil Role | Precision | Recall | F1-Score | Test Support |
|---|---|---|---|---|
| **Civil Site Engineer** | 0.9902 | 0.9758 | **0.9830** | 207 |
| **Construction Project Engineer** | 0.9911 | 0.9970 | **0.9940** | 668 |
| **Geotechnical Engineer** | 1.0000 | 1.0000 | **1.0000** | 86 |
| **Quantity Surveyor** | 1.0000 | 0.9956 | **0.9978** | 227 |
| **Structural Engineer** | 0.9972 | 1.0000 | **0.9986** | 350 |
| **Transportation Engineer** | 1.0000 | 0.9929 | **0.9964** | 141 |

## 5. Confusion Matrix

Row = True Label, Column = Predicted Label

| True \ Pred | **Civil Site Engineer** | **Construction Project Engineer** | **Geotechnical Engineer** | **Quantity Surveyor** | **Structural Engineer** | **Transportation Engineer** |
|---| --- | --- | --- | --- | --- | --- |
| **Civil Site Engineer** | 202 | 5 | 0 | 0 | 0 | 0 |
| **Construction Project Engineer** | 2 | 666 | 0 | 0 | 0 | 0 |
| **Geotechnical Engineer** | 0 | 0 | 86 | 0 | 0 | 0 |
| **Quantity Surveyor** | 0 | 1 | 0 | 226 | 0 | 0 |
| **Structural Engineer** | 0 | 0 | 0 | 0 | 350 | 0 |
| **Transportation Engineer** | 0 | 0 | 0 | 0 | 1 | 140 |

## 6. Decision Margin Statistics

- **Mean Margin ($Score_{top1} - Score_{top2}$)**: 1.9323
- **Median Margin**: 1.9786
- **10th Percentile Margin**: 1.2979
- **25th Percentile Margin**: 1.7088
- **75th Percentile Margin**: 2.2140
- **90th Percentile Margin**: 2.5323
- **Low Margin Predictions (< 0.20)**: 15 records (0.89%)
- **Low Margin Predictions (< 0.50)**: 37 records (2.2%)

## 7. Performance Across Text Length Slices

| Text Length Slice | Word Count Range | Sample Count | Test Accuracy |
|---|---|---|---|
| Short / Title-Only | < 100 words | 20 | 1.0000 |
| Medium Postings | 100 - 399 words | 532 | 0.9962 |
| Full Job Descriptions | $\ge 400$ words | 1,127 | 0.9938 |

## 8. Boundary Analysis & Misclassification Observations

| Boundary Pair | Misclassifications (A -> B) | Error Rate % | Misclassifications (B -> A) | Error Rate % |
|---|---|---|---|---|
| `Structural Engineer <-> Civil Site Engineer` | 0 | 0.0% | 0 | 0.0% |
| `Civil Site Engineer <-> Construction Project Engineer` | 5 | 2.42% | 2 | 0.3% |
| `Construction Project Engineer <-> Quantity Surveyor` | 0 | 0.0% | 1 | 0.44% |
| `Structural Engineer <-> Geotechnical Engineer` | 0 | 0.0% | 0 | 0.0% |
| `Civil Site Engineer <-> Quantity Surveyor` | 0 | 0.0% | 0 | 0.0% |
| `Transportation Engineer <-> Civil Site Engineer` | 0 | 0.0% | 0 | 0.0% |

### Key Boundary Insights:
1. **Structural Engineer vs Civil Site Engineer**: Extremely sharp boundary. Structural Engineer postings focus heavily on calculations, ETABS, STAAD, and design codes, whereas Site Engineers emphasize field supervision and daily execution.
2. **Civil Site Engineer vs Construction Project Engineer**: Minimal overlap. Project Engineers deal with high-level Primavera P6 scheduling, procurement, and contract management, whereas Site Engineers handle physical site inspections.
3. **Quantity Surveyor vs Construction Project Engineer**: Quantity Surveyor is distinguished by BOQ, rate estimation, interim bills, and cost control vocabulary.
4. **Geotechnical & Transportation Engineers**: Both roles achieve high precision and recall (>0.97 F1) due to specialized soil mechanics (geotechnical) and highway/pavement/traffic (transportation) terminology.

## 9. Model Verification & Class Count Check

- **Stored Class Count**: 6
- **Classes Stored in Encoder**: `['Civil Site Engineer', 'Construction Project Engineer', 'Geotechnical Engineer', 'Quantity Surveyor', 'Structural Engineer', 'Transportation Engineer']`
- **Validation Result**: **EXACTLY 6 CANONICAL CIVIL CLASSES VERIFIED**.

## 10. Reproducibility & Environment Info

- **Random Seed**: `42`
- **Python Version**: `3.11`
- **Scikit-Learn Version**: `1.6.1`
- **Execution Command**: `python scripts/train_civil_classifier.py`
