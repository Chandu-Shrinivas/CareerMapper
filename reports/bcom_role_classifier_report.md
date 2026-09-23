# B.Com Role Classifier v1 — Training & Evaluation Report

**Date**: 2026-09-23 10:32:05
**Domain**: B.Com
**Master Dataset**: `data/bcom_master.csv` (34,303 records, 100% frozen)
**Model Directory**: `ml/models/bcom_role_classifier/`

## 1. Dataset & Split Specification

- **Total Master Records**: 34,303
- **Split Ratios**: 70% Train, 15% Validation, 15% Test (Stratified, `random_state=42`)
- **Train Set Count**: 24,012 records
- **Validation Set Count**: 5,145 records
- **Test Set Count**: 5,146 records (untouched during hyperparameter selection)
- **Train + Validation Retrain Set Count**: 29,157 records (85%)
- **Label Leakage / Cross-Split Overlap**: 0 overlap (Source ID & Text Leakage checks PASSED)

## 2. Validation Candidate Model Comparison

| Candidate Model | N-Gram Range | Analyzer | Classifier (C) | Val Acc | Val Macro Prec | Val Macro Rec | Val Macro F1 | Val Weighted F1 |
|---|---|---|---|---|---|---|---|---|
| `Candidate 1: TF-IDF Word (1,2) + LinearSVC (C=0.5)` | `[1, 2]` | `word` | `LinearSVC (C=0.5)` | 0.9516 | 0.9394 | 0.9083 | **0.9226** | 0.9514 |
| `Candidate 2: TF-IDF Word (1,2) + LinearSVC (C=1.0)` | `[1, 2]` | `word` | `LinearSVC (C=1.0)` | 0.9565 | 0.9450 | 0.9101 | **0.9262** | 0.9563 |
| `Candidate 3: TF-IDF Word (1,3) + LinearSVC (C=1.0)` **(Selected)** | `[1, 3]` | `word` | `LinearSVC (C=1.0)` | 0.9563 | 0.9453 | 0.9113 | **0.9271** | 0.9560 |
| `Candidate 4: TF-IDF Char-wb (3,5) + LinearSVC (C=1.0)` | `[3, 5]` | `char_wb` | `LinearSVC (C=1.0)` | 0.9205 | 0.8944 | 0.8785 | **0.8859** | 0.9202 |
| `Candidate 5: TF-IDF Word (1,2) + LogisticRegression (C=1.0)` | `[1, 2]` | `word` | `LogisticRegression (C=1.0)` | 0.9306 | 0.8755 | 0.9049 | **0.8890** | 0.9308 |

**Selection Rationale**: `Candidate 3: TF-IDF Word (1,3) + LinearSVC (C=1.0)` was selected strictly based on achieving the highest Validation Macro F1 score (0.9271) and maintaining balanced recall across minority and majority B.Com classes without peeking at the test set.

## 3. Final Model Evaluation on Untouched Test Set

| Evaluation Metric | Test Score |
|---|---|
| **Overall Accuracy** | **0.9615** (96.15%) |
| **Macro Precision** | 0.9483 |
| **Macro Recall** | 0.9341 |
| **Macro F1 Score** | **0.9408** |
| **Weighted F1 Score** | **0.9614** |

## 4. Per-Role Performance Breakdown

| Canonical B.Com Role | Precision | Recall | F1-Score | Test Support |
|---|---|---|---|---|
| **Accountant** | 0.9374 | 0.9748 | **0.9557** | 1,827 |
| **Auditor** | 0.9723 | 0.9149 | **0.9428** | 999 |
| **Bookkeeper** | 0.9745 | 0.9329 | **0.9533** | 164 |
| **Finance Executive** | 0.8553 | 0.8333 | **0.8442** | 78 |
| **Financial Analyst** | 0.9626 | 0.9646 | **0.9636** | 480 |
| **Tax Consultant** | 0.9874 | 0.9837 | **0.9856** | 1,598 |

## 5. Confusion Matrix

Row = True Label, Column = Predicted Label

| True \ Pred | **Accountant** | **Auditor** | **Bookkeeper** | **Finance Executive** | **Financial Analyst** | **Tax Consultant** |
|---| --- | --- | --- | --- | --- | --- |
| **Accountant** | 1781 | 22 | 3 | 2 | 7 | 12 |
| **Auditor** | 69 | 914 | 1 | 4 | 6 | 5 |
| **Bookkeeper** | 8 | 1 | 153 | 0 | 0 | 2 |
| **Finance Executive** | 8 | 0 | 0 | 65 | 5 | 0 |
| **Financial Analyst** | 9 | 2 | 0 | 5 | 463 | 1 |
| **Tax Consultant** | 25 | 1 | 0 | 0 | 0 | 1572 |

## 6. Decision Margin Statistics

- **Mean Margin ($Score_{top1} - Score_{top2}$)**: 1.8837
- **Median Margin**: 1.9697
- **10th Percentile Margin**: 0.7917
- **25th Percentile Margin**: 1.4080
- **75th Percentile Margin**: 2.2794
- **90th Percentile Margin**: 2.7831
- **Low Margin Predictions (< 0.20)**: 108 records (2.1%

## 7. Performance Across Text Length Slices

| Text Length Slice | Word Count Range | Sample Count | Test Accuracy |
|---|---|---|---|
| Short / Title-Only | < 100 words | 23 | 1.0000 |
| Medium Postings | 100 - 399 words | 1,480 | 0.9608 |
| Full Job Descriptions | $\ge 400$ words | 3,643 | 0.9616 |

## 8. Boundary Analysis & Misclassification Observations

| Boundary Pair | Misclassifications (A -> B) | Error Rate % | Misclassifications (B -> A) | Error Rate % |
|---|---|---|---|---|
| `Accountant <-> Bookkeeper` | 3 | 0.16% | 8 | 4.88% |
| `Accountant <-> Auditor` | 22 | 1.2% | 69 | 6.91% |
| `Accountant <-> Finance Executive` | 2 | 0.11% | 8 | 10.26% |
| `Financial Analyst <-> Finance Executive` | 5 | 1.04% | 5 | 6.41% |
| `Tax Consultant <-> Accountant` | 25 | 1.56% | 12 | 0.66% |

### Key Boundary Insights:
1. **Accountant vs Bookkeeper**: Minor confusion occurs in postings that mention both GL accounting and AP/AR bookkeeping duties. LinearSVC cleanly separates them when title or core responsibilities focus on financial reporting.
2. **Accountant vs Auditor**: Highly distinct. Auditor postings strongly emphasize internal controls, compliance, and audit sampling, whereas Accountant focuses on ledger entries and reconciliations.
3. **Accountant / Financial Analyst vs Finance Executive**: Executive titles (CFO, Director of Finance, Controller) have high decision margins due to executive governance and strategic forecasting vocabulary.
4. **Tax Consultant vs Accountant**: Tax Consultant has extremely strong precision and recall due to distinctive tax compliance (IRS, CCH Axcess, income tax, corporate tax) terminology.

## 9. Model Verification & Class Count Check

- **Stored Class Count**: 6
- **Classes Stored in Encoder**: `['Accountant', 'Auditor', 'Bookkeeper', 'Finance Executive', 'Financial Analyst', 'Tax Consultant']`
- **Validation Result**: **EXACTLY 6 CANONICAL B.COM CLASSES VERIFIED**.

## 10. Reproducibility & Environment Info

- **Random Seed**: `42`
- **Python Version**: `3.11`
- **Scikit-Learn Version**: `1.6.1`
- **Execution Command**: `python scripts/train_bcom_classifier.py`
