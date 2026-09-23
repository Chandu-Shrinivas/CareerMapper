# B.Com Role Classifier v1

Production text-classification model for identifying canonical B.Com career roles from job description / resume text.

## Overview
- **Domain**: B.Com
- **Total Training Records**: 34,303 (from `data/bcom_master.csv`)
- **Classes (6)**: `['Accountant', 'Auditor', 'Bookkeeper', 'Finance Executive', 'Financial Analyst', 'Tax Consultant']` 
- **Selected Candidate**: `Candidate 3: TF-IDF Word (1,3) + LinearSVC (C=1.0)`
- **Test Accuracy**: `0.9615`
- **Test Macro F1**: `0.9408`

## Usage
```python
import joblib
model = joblib.load('ml/models/bcom_role_classifier/model.joblib')
vectorizer = joblib.load('ml/models/bcom_role_classifier/vectorizer.joblib')
label_encoder = joblib.load('ml/models/bcom_role_classifier/label_encoder.joblib')

text = ['Senior Accountant responsible for general ledger and month-end close']
vec = vectorizer.transform(text)
pred_idx = model.predict(vec)[0]
pred_role = label_encoder.inverse_transform([pred_idx])[0]
print(pred_role)
```
