# Civil Engineering Role Classifier v1

Production text-classification model for identifying canonical Civil Engineering career roles from job posting text.

## Overview
- **Domain**: Civil Engineering
- **Total Training Records**: 11,192 (from `data/civil_master.csv`)
- **Classes (6)**: `['Civil Site Engineer', 'Construction Project Engineer', 'Geotechnical Engineer', 'Quantity Surveyor', 'Structural Engineer', 'Transportation Engineer']` 
- **Selected Candidate**: `Candidate 3: TF-IDF Word (1,3) + LinearSVC (C=1.0)`
- **Test Accuracy**: `0.9946`
- **Test Macro F1**: `0.9950`

## Usage
```python
import joblib
model = joblib.load('ml/models/civil_role_classifier/model.joblib')
vectorizer = joblib.load('ml/models/civil_role_classifier/vectorizer.joblib')
label_encoder = joblib.load('ml/models/civil_role_classifier/label_encoder.joblib')

text = ['Senior Structural Engineer responsible for reinforced concrete design and ETABS modeling']
vec = vectorizer.transform(text)
pred_idx = model.predict(vec)[0]
pred_role = label_encoder.inverse_transform([pred_idx])[0]
print(pred_role)
```
