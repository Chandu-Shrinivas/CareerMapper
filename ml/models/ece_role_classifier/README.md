# ECE Role Classifier Model Artifacts

**Model Architecture**: TF-IDF (1,2 n-grams) + LinearSVC (class_weight='balanced')  
**Test Accuracy**: 94.59%  
**Test Macro F1**: 0.9189  
**Date Trained**: 2026-09-22  

## Files
- `model.joblib`: Trained LinearSVC classifier.
- `vectorizer.joblib`: Trained TfidfVectorizer.
- `label_encoder.joblib`: LabelEncoder mapping target strings to integers.
- `metadata.json`: Model hyperparameters, split details, and evaluation metrics.
