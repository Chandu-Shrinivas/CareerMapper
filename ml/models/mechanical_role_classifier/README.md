# Mechanical Role Classifier v1

Supervised classifier predicting CareerMapper Mechanical canonical roles from job/resume text.

- **Domain**: Mechanical
- **Model Type**: LinearSVC (C=0.5)
- **Vectorizer**: TF-IDF ngram=(1, 2) (sublinear_tf=True)
- **Test Accuracy**: 93.34%
- **Test Macro F1**: 0.9163
- **Test Weighted F1**: 0.9339

## Supported Canonical Roles (5)
1. CAD Design Engineer
2. FEA/CFD Analyst
3. Manufacturing Engineer
4. Product Design Engineer
5. HVAC Engineer
