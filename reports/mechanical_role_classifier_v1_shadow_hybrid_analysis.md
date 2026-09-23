# Mechanical Role Classifier v1 — Shadow Hybrid Decision Analysis Report

**Model Evaluated**: Mechanical Role Classifier v1 (LinearSVC C=0.5 + TF-IDF 1,2)  
**Dataset Analyzed**: `mechanical_master.csv` (10,706 real records)  
**Date**: 2026-09-23  
**Status**: **SHADOW HYBRID EVALUATION COMPLETE**  

---

## 1. Baseline Frozen-Model Results

The frozen Mechanical Role Classifier v1 model was evaluated on the untouched test set of 1,606 postings from `mechanical_master.csv`:

- **Test Accuracy**: **93.34%** (1,499 / 1,606 correct)
- **Test Macro F1**: **0.9163**
- **Test Weighted F1**: **0.9339**
- **Test Macro Precision**: **0.9137**
- **Test Macro Recall**: **0.9194**

---

## 2. Stress-Test Reproduction Results

Evaluating the frozen model on the 114 custom stress-test cases (91 in-domain canonical cases, 23 OOD / generic cases) yields:

- **Total Test Cases**: **114**
- **In-Domain Canonical Cases**: **91**
- **OOD / Generic / Misleading Cases**: **23**
- **Baseline In-Domain Correct Predictions**: **77 / 91**
- **Baseline In-Domain Accuracy**: **84.62%**
- **Baseline In-Domain Macro F1**: **0.8381**

---

## 3. Low-Margin Decision Score Analysis

Grouping the 91 in-domain stress-test predictions by SVM decision margin ($ \text{Margin} = \text{Top}_1 - \text{Top}_2 $):

| Margin Group | Range | Case Count | Baseline Accuracy | Top Predicted Roles |
| :--- | :--- | :---: | :---: | :--- |
| **Group A** | $ \text{Margin} \ge 1.0 $ (High Conf) | 73 | **89.04%** (65/73) | Product Design (19), Mfg (19), HVAC (16), FEA (15), CAD (4) |
| **Group B** | $ 0.5 \le \text{Margin} < 1.0 $ (Mod Conf) | 7 | **71.43%** (5/7) | Product Design (3), HVAC (2), FEA (1), Mfg (1) |
| **Group C** | $ 0.25 \le \text{Margin} < 0.5 $ (Low Conf) | 3 | **33.33%** (1/3) | Product Design (2), FEA/CFD (1) |
| **Group D** | $ \text{Margin} < 0.25 $ (Near Zero) | 8 | **75.00%** (6/8) | CAD Design (4), Product Design (2), FEA (1), Mfg (1) |

---

## 4. Role Boundary Analysis: CAD Design Engineer ↔ Product Design Engineer

### Empirical Frequency Analysis in `mechanical_master.csv` (10,706 rows)

| Keyword / Signal | CAD Design Engineer (504) | Product Design Engineer (1,886) | Manufacturing Engineer (4,049) | FEA/CFD Analyst (1,164) | HVAC Engineer (3,103) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `cad` | **68.8%** | 48.5% | 29.1% | 40.7% | 7.4% |
| `autocad` | **62.9%** | 14.2% | 13.5% | 10.6% | 16.6% |
| `drafting` | **59.9%** | 6.3% | 4.0% | 7.0% | 3.0% |
| `drafter` / `detailer` | **28.8%** | 0.1% | 0.0% | 0.1% | 0.3% |
| `solidworks` | 28.6% | **32.7%** | 18.8% | 27.3% | 2.6% |
| `gd&t` | 8.5% | **15.9%** | 10.0% | 16.2% | 0.4% |
| `product development` | 5.2% | **39.4%** | 18.0% | 18.9% | 4.8% |
| `product design` | 7.5% | **25.6%** | 12.3% | 9.9% | 13.3% |
| `dfm` / `dfa` | 1.0% | **7.7%** | 6.7% | 6.3% | 0.5% |
| `bom` | 4.6% | **11.3%** | 4.2% | 2.0% | 0.3% |

---

## 5. Comparative Performance: Baseline vs Shadow Hybrid

| Metric | Baseline Frozen Model | Shadow Hybrid Layer | Absolute Change |
| :--- | :---: | :---: | :---: |
| **In-Domain Test Accuracy (91 cases)** | **84.62%** (77/91) | **89.01%** (81/91) | **+4.39%** |
| **In-Domain Macro F1 (91 cases)** | **0.8381** | **0.8902** | **+0.0521** |
| **Clear-Case Accuracy ($\text{Margin} \ge 1.0$)** | **89.04%** (65/73) | **93.15%** (68/73) | **+4.11%** |
| **Ambiguous-Case Accuracy ($\text{Margin} < 1.0$)** | **66.67%** (12/18) | **72.22%** (13/18) | **+5.55%** |
| **OOD Rejection Rate (23 OOD cases)** | **0.0%** (Closed Set) | **65.22%** (15/23) | **+65.22%** |

---

## 6. Final Recommendation

**PROCEED WITH SHADOW HYBRID INTEGRATION**
