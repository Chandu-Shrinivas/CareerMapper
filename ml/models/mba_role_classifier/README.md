# MBA Role Classifier v1

Production-quality LinearSVC role classification model for predicting six canonical MBA roles:
1. Business Analyst
2. Marketing Analyst
3. HR Executive
4. Product Manager
5. Sales Executive
6. Operations Manager

## Model Details
- **Architecture**: TF-IDF Word (1,3) N-Grams + LinearSVC (`C=1.0`, `class_weight='balanced'`)
- **Dataset**: `data/mba_master.csv` (42,368 real records)
- **Test Accuracy**: `99.04%`
- **Test Macro F1**: `0.9815`
- **Test Weighted F1**: `0.9904`

## Usage
```python
import joblib

model = joblib.load('ml/models/mba_role_classifier/model.joblib')
vectorizer = joblib.load('ml/models/mba_role_classifier/vectorizer.joblib')
le = joblib.load('ml/models/mba_role_classifier/label_encoder.joblib')

text = "Job Title: Senior Product Manager\nCompany: Tech Corp\nSkills: Product Roadmap, User Stories"
vec = vectorizer.transform([text])
pred_idx = model.predict(vec)[0]
role = le.inverse_transform([pred_idx])[0]
print(role)
```
