import os
import re
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

def clean_skill_text(text):
    """
    NLP Preprocessing & Cleaning:
    1. Converts text to lowercase.
    2. Removes special characters except alphanumeric, spaces, and select technical signs 
       (e.g., C++, .Net, C#) to preserve vital vocabulary.
    3. Compresses multiple spaces to a single space.
    """
    if not isinstance(text, str):
        return ""
    
    text = text.lower()
    
    # Preserve key technical suffixes like C#, C++, .Net, GD&T
    text = re.sub(r'[^a-zA-Z0-9&#_+-]', ' ', text)
    
    # Trim and remove multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def run_production_preprocessing():
    print("==================================================")
    print("STARTING REAL DATASET PREPROCESSING PIPELINE")
    print("==================================================")

    # 1. Resolve robust file paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    raw_dataset_path = os.path.join(script_dir, '../datasets/raw/clean_it_roles_dataset_no_leakage.csv')
    cleaned_output_path = os.path.join(script_dir, '../datasets/cleaned/clean_it_roles_dataset_preprocessed.csv')
    vectorizer_output_path = os.path.join(script_dir, '../models/role_classifier_vectorizer.joblib')
    
    final_xtrain_path = os.path.join(script_dir, '../datasets/final/X_train_tfidf.joblib')
    final_xval_path = os.path.join(script_dir, '../datasets/final/X_val_tfidf.joblib')
    final_ytrain_path = os.path.join(script_dir, '../datasets/final/y_train.joblib')
    final_yval_path = os.path.join(script_dir, '../datasets/final/y_val.joblib')

    print(f"Loading raw dataset from: {raw_dataset_path}")
    if not os.path.exists(raw_dataset_path):
        raise FileNotFoundError(f"Real dataset not found! Please ensure it was copied to: {raw_dataset_path}")

    # Load dataset
    df = pd.read_csv(raw_dataset_path)
    total_raw_records = len(df)
    print(f"Loaded successfully! Initial records: {total_raw_records}")

    # 2. Null Handling
    print("\n[STEP 1] Handling null values...")
    null_text = df['text'].isnull().sum()
    null_role = df['role'].isnull().sum()
    print(f"  Null 'text' values found: {null_text}")
    print(f"  Null 'role' values found: {null_role}")
    
    df = df.dropna(subset=['text', 'role'])
    print(f"  Records remaining after null dropping: {len(df)}")

    # 3. Duplicate Handling
    print("\n[STEP 2] Handling duplicate text samples...")
    duplicates = df.duplicated(subset=['text']).sum()
    print(f"  Duplicate descriptions found: {duplicates}")
    
    df = df.drop_duplicates(subset=['text'])
    post_dedup_records = len(df)
    print(f"  Records remaining after deduplication: {post_dedup_records}")
    print(f"  Total records cleaned/filtered out: {total_raw_records - post_dedup_records}")

    # 4. Role Distribution Analysis
    print("\n[STEP 3] Running class (role) distribution analysis:")
    role_counts = df['role'].value_counts()
    print("-" * 50)
    for role_name, count in role_counts.items():
        percentage = (count / post_dedup_records) * 100
        print(f"  * {role_name:<30} : {count:<5} ({percentage:.2f}%)")
    print("-" * 50)

    # 5. Clean Text Column
    print("\n[STEP 4] Applying skill text standardizations...")
    df['cleaned_text'] = df['text'].apply(clean_skill_text)
    
    # Save the intermediate preprocessed DataFrame
    os.makedirs(os.path.dirname(cleaned_output_path), exist_ok=True)
    df.to_csv(cleaned_output_path, index=False)
    print(f"  Cleaned dataset saved to: {cleaned_output_path}")

    # 6. Stratified Split (80% train, 20% validation)
    print("\n[STEP 5] Splitting dataset into training and validation folds (Stratified)...")
    X = df['cleaned_text']
    y = df['role']

    # Stratified split to preserve class distribution across folds
    X_train, X_val, y_train, y_val = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print(f"  Training Set Shape  : {X_train.shape[0]} profiles")
    print(f"  Validation Set Shape: {X_val.shape[0]} profiles")

    # 7. TF-IDF Vectorization
    print("\n[STEP 6] Performing TF-IDF Vectorization...")
    # Using 'english' stopwords and capturing technical symbols
    vectorizer = TfidfVectorizer(
        token_pattern=r'(?u)\b[a-zA-Z0-9&#_+-]+\b',
        stop_words='english',
        lowercase=True
    )

    # Fit vectorizer on training data and transform folds
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_val_tfidf = vectorizer.transform(X_val)

    vocabulary_size = len(vectorizer.vocabulary_)
    print(f"  TF-IDF Feature Space dimension: {vocabulary_size} distinct vocabulary words")
    print(f"  Training matrix shape         : {X_train_tfidf.shape}")
    print(f"  Validation matrix shape       : {X_val_tfidf.shape}")

    # 8. Save Processed Vectors and Estimators
    print("\n[STEP 7] Serializing preprocessed vectors and TF-IDF estimator...")
    os.makedirs(os.path.dirname(vectorizer_output_path), exist_ok=True)
    os.makedirs(os.path.dirname(final_xtrain_path), exist_ok=True)

    # Save vectorizer
    joblib.dump(vectorizer, vectorizer_output_path)
    print(f"  Saved TfidfVectorizer to: {vectorizer_output_path}")

    # Save final matrices and label lists
    joblib.dump(X_train_tfidf, final_xtrain_path)
    joblib.dump(X_val_tfidf, final_xval_path)
    joblib.dump(y_train, final_ytrain_path)
    joblib.dump(y_val, final_yval_path)
    print("  Saved TF-IDF sparse matrices and stratified target labels!")

    print("\n==================================================")
    print("PRODUCTION PREPROCESSING PIPELINE COMPLETED!")
    print("==================================================")

if __name__ == '__main__':
    run_production_preprocessing()
