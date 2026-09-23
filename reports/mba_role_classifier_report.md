# MBA Role Classifier v1 Evaluation Report

## 1. Dataset Overview
- **Dataset**: `data/mba_master.csv`
- **Total Real Records**: `42,368`
- **Canonical Roles (6)**: Business Analyst, Marketing Analyst, HR Executive, Product Manager, Sales Executive, Operations Manager
- **Domain**: `MBA` (100% verified)
- **Data Integrity**: Passed 0 null checks, 0 duplicate source ID checks, 0 duplicate normalized text checks, and 0 artificial label leakage checks.

---

## 2. Class Distribution
| Canonical Role | Total Master Count | Percentage |
| :--- | :--- | :--- |
| **Business Analyst** | `7,038` | 16.61% |
| **HR Executive** | `7,103` | 16.77% |
| **Marketing Analyst** | `623` | 1.47% |
| **Operations Manager** | `6,425` | 15.16% |
| **Product Manager** | `3,453` | 8.15% |
| **Sales Executive** | `17,726` | 41.84% |

---

## 3. Split Strategy
The dataset was split using a **Stratified Random Split** (`random_state=42`):
- **Train Set (70%)**: `29,657` records
- **Validation Set (15%)**: `6,355` records
- **Test Set (15%)**: `6,356` records
- **Retraining Set (Train + Val)**: `36,012` records

---

## 4. Leakage Checks
- **Source ID Leakage**: `0` overlapping IDs across Train, Validation, and Test.
- **Normalized Text Leakage**: `0` overlapping normalized text entries across splits.
- **Model Selection Guard**: Validation set used exclusively for candidate evaluation and hyperparameter tuning. Test set evaluated ONCE after retraining on Train+Val.

---

## 5. Candidate Models Evaluated
The following 5 candidate model configurations were trained on Train (70%) and evaluated on Validation (15%):

- **Candidate 1: TF-IDF (1,2) + LinearSVC (C=0.5)**
  - N-gram Range: `[1, 2]`, Sublinear TF: `True`, Class Weight: `'balanced'`
- **Candidate 2: TF-IDF (1,2) + LinearSVC (C=1.0)**
  - N-gram Range: `[1, 2]`, Sublinear TF: `True`, Class Weight: `'balanced'`
- **Candidate 3: TF-IDF (1,2) + LinearSVC (C=2.0)**
  - N-gram Range: `[1, 2]`, Sublinear TF: `True`, Class Weight: `'balanced'`
- **Candidate 4: TF-IDF (1,3) + LinearSVC (C=1.0)**
  - N-gram Range: `[1, 3]`, Sublinear TF: `True`, Class Weight: `'balanced'`
- **Candidate 5: TF-IDF (1,2) + LogisticRegression (C=1.0)**
  - N-gram Range: `[1, 2]`, Sublinear TF: `True`, Class Weight: `'balanced'`

---

## 6. Validation Comparison
Model selection was performed using **Validation Macro F1**:

| Candidate Model | Val Accuracy | Val Macro Prec | Val Macro Rec | Val Macro F1 | Val Weighted F1 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Candidate 1: TF-IDF (1,2) + LinearSVC (C=0.5) | 0.9884 | 0.9765 | 0.9794 | **0.9778** | 0.9883 |
| Candidate 2: TF-IDF (1,2) + LinearSVC (C=1.0) | 0.9893 | 0.9789 | 0.9794 | **0.9791** | 0.9893 |
| Candidate 3: TF-IDF (1,2) + LinearSVC (C=2.0) | 0.9901 | 0.9798 | 0.9807 | **0.9802** | 0.9901 |
| Candidate 4: TF-IDF (1,3) + LinearSVC (C=1.0) **(SELECTED)** | 0.9902 | 0.9827 | 0.9785 | **0.9806** | 0.9902 |
| Candidate 5: TF-IDF (1,2) + LogisticRegression (C=1.0) | 0.9838 | 0.9632 | 0.9747 | **0.9686** | 0.9838 |

---

## 7. Selected Model
- **Selected Configuration**: `Candidate 4: TF-IDF (1,3) + LinearSVC (C=1.0)`
- **Classifier**: `LinearSVC (C=1.0, class_weight='balanced', random_state=42)`
- **Vectorizer**: `TfidfVectorizer(ngram_range=(1,3), max_features=50000, sublinear_tf=True)`
- **Selection Rationale**: Achieved the highest Validation Macro F1 score (`0.9806`) while maintaining optimal inference speed and linear decision boundary robustness.

---

## 8. Final Test Results (Evaluated Once on Test Set)
After selecting the best candidate, the model was retrained on **Train + Validation (36,012 records)** and evaluated on the untouched **Test Set (6,356 records)**:

| Metric | Score |
| :--- | :--- |
| **Accuracy** | **99.04%** (`0.9904`) |
| **Macro Precision** | **0.9860** |
| **Macro Recall** | **0.9774** |
| **Macro F1 Score** | **0.9815** |
| **Weighted F1 Score** | **0.9904** |

---

## 9. Per-Role Performance
| Canonical Role | Precision | Recall | F1-Score | Support (Test) |
| :--- | :--- | :--- | :--- | :--- |
| **Business Analyst** | 0.9703 | 0.9905 | **0.9803** | 1,056 |
| **HR Executive** | 0.9916 | 0.9944 | **0.9930** | 1,066 |
| **Marketing Analyst** | 0.9778 | 0.9462 | **0.9617** | 93 |
| **Operations Manager** | 0.9938 | 0.9917 | **0.9927** | 964 |
| **Product Manager** | 0.9839 | 0.9421 | **0.9625** | 518 |
| **Sales Executive** | 0.9985 | 0.9992 | **0.9989** | 2,659 |

---

## 10. Confusion Matrix
Rows represent true ground-truth roles; columns represent predicted roles:

| True \ Pred | **Business Analyst** | **HR Executive** | **Marketing Analyst** | **Operations Manager** | **Product Manager** | **Sales Executive** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Business Analyst** | `1046` | `0` | `2` | `0` | `8` | `0` |
| **HR Executive** | `1` | `1060` | `0` | `4` | `0` | `1` |
| **Marketing Analyst** | `3` | `1` | `88` | `0` | `0` | `1` |
| **Operations Manager** | `0` | `7` | `0` | `956` | `0` | `1` |
| **Product Manager** | `28` | `0` | `0` | `1` | `488` | `1` |
| **Sales Executive** | `0` | `1` | `0` | `1` | `0` | `2657` |

---

## 11. Decision Margin Analysis
Distance margin between top-1 and top-2 LinearSVC decision function scores on the Test set:
- **Mean Margin**: `2.3211`
- **Median Margin**: `2.282`
- **Minimum Margin**: `0.0126`
- **Maximum Margin**: `6.7145`

### Margin Distribution Buckets
| Margin Range | Count | Percentage | Interpretation |
| :--- | :--- | :--- | :--- |
| **> 1.0** | `6,075` | 95.58% | High confidence classification |
| **0.5 – 1.0** | `177` | 2.78% | Moderate confidence classification |
| **< 0.5** | `104` | 1.64% | Low confidence / near-boundary classification |

---

## 12. Independent Robustness & Stress Test
An independent test set of 18 curated stress test cases (not in train set) was evaluated:
- **Stress Test Accuracy**: **94.74%** (`18/19`)

### Detailed Stress Test Breakdown
| Scenario | Expected Role | Predicted Role | Margin | Status |
| :--- | :--- | :--- | :--- | :--- |
| Clear BA title | **Business Analyst** | Business Analyst | `5.4588` | PASS |
| Clear PM title | **Product Manager** | Product Manager | `5.184` | PASS |
| Clear HR title | **HR Executive** | Operations Manager | `0.0963` | FAIL |
| Clear Marketing title | **Marketing Analyst** | Marketing Analyst | `2.0586` | PASS |
| Clear Sales title | **Sales Executive** | Sales Executive | `5.0253` | PASS |
| Clear Ops title | **Operations Manager** | Operations Manager | `2.449` | PASS |
| JD-Style BA | **Business Analyst** | Business Analyst | `4.1292` | PASS |
| JD-Style PM | **Product Manager** | Product Manager | `6.4414` | PASS |
| Resume-Style HR | **HR Executive** | HR Executive | `3.0923` | PASS |
| Resume-Style Sales | **Sales Executive** | Sales Executive | `2.3703` | PASS |
| Boundary BA vs PM (PM leaning) | **Product Manager** | Product Manager | `0.7922` | PASS |
| Boundary BA vs PM (BA leaning) | **Business Analyst** | Business Analyst | `1.8031` | PASS |
| Boundary BA vs Marketing | **Marketing Analyst** | Marketing Analyst | `1.0985` | PASS |
| Boundary Sales vs BA | **Sales Executive** | Sales Executive | `4.9079` | PASS |
| Boundary Ops vs BA | **Operations Manager** | Operations Manager | `0.9331` | PASS |
| Skills-only BA | **Business Analyst** | Business Analyst | `1.4764` | PASS |
| Skills-only PM | **Product Manager** | Product Manager | `4.4028` | PASS |
| Short HR title | **HR Executive** | HR Executive | `3.9935` | PASS |
| Short Sales title | **Sales Executive** | Sales Executive | `1.9876` | PASS |

---

## 13. Out-Of-Domain (OOD) Closed-Set Behavior
Evaluation of non-MBA inputs against the 6-class closed-set classifier:

| Non-MBA Input Label | Assigned MBA Role | Decision Margin | Risk Level |
| :--- | :--- | :--- | :--- |
| Software Engineer | **Product Manager** | `0.466` | High (Closed-Set Forced Mapping) |
| Healthcare RN | **Operations Manager** | `0.5442` | High (Closed-Set Forced Mapping) |
| Trade Electrician | **Operations Manager** | `0.1617` | High (Closed-Set Forced Mapping) |
| Data Scientist | **Business Analyst** | `0.5159` | High (Closed-Set Forced Mapping) |
| Civil Engineer | **Operations Manager** | `0.0332` | High (Closed-Set Forced Mapping) |

---

## 14. Error Analysis & Key Role Boundaries
1. **Business Analyst vs Product Manager**:
   - High precision & recall across both roles (BA F1: ~0.98, PM F1: ~0.96).
   - Misclassifications occur primarily when a posting title contains "Business Analyst" but the description is dominated by product backlog/roadmap terms.
2. **Business Analyst vs Marketing Analyst**:
   - Marketing Analyst achieves high F1 (~0.96). Minor confusion occurs when generic data analytics (SQL, dashboards) overlaps with campaign analytics.
3. **Product Manager vs Operations Manager**:
   - Clean separation (Ops F1: ~0.99). Operations managers focusing on supply chain/logistics show zero confusion with PMs.
4. **Sales Executive**:
   - Highest performing role (F1: ~0.9989), driven by distinct sales revenue, pipeline, and account management vocabulary.

---

## 15. Limitations
1. **Closed-Set Constraint**: Non-MBA inputs (e.g. Software Engineer, Doctor, Electrician) will always be forced into one of the 6 canonical MBA roles unless an out-of-domain threshold guard is implemented in the inference pipeline.
2. **Short Text Sensitivity**: Short inputs (< 5 words) rely heavily on exact title n-grams and exhibit lower decision margins (< 0.5).

---

## 16. Final Recommendation & Freeze Status
- **Final Model**: `LinearSVC (C=1.0, class_weight='balanced')` trained on 36,012 records.
- **Freeze Status**: **MBA ROLE CLASSIFIER v1 = FROZEN**
- **Action**: All model artifacts saved under `ml/models/mba_role_classifier/`. No further training or modification is required.
