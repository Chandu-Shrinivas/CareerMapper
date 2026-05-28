import os
import re
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer

# =====================================================================
# STAGE 1: Explaining Why TF-IDF is Used for Text Classification
# =====================================================================
"""
Why TF-IDF (Term Frequency-Inverse Document Frequency)?
------------------------------------------------------
Machine learning models cannot process raw text directly. They require numerical vectors.
TF-IDF is an NLP technique that converts text documents into numerical vectors by balancing two factors:

1. Term Frequency (TF): How frequently a word appears in a specific document.
   - If 'react' appears multiple times in a profile, TF increases, indicating high local importance.
   
2. Inverse Document Frequency (IDF): How common or rare a word is across ALL documents in the dataset.
   - Common stopwords like 'and', 'developer', or 'engineer' appear in almost every profile. IDF penalizes them.
   - Rare, highly informative technical keywords like 'react', 'kubernetes', or 'gd&t' have a very high IDF boost.

Mathematical Intuition:
   TF-IDF(t, d, D) = TF(t, d) * IDF(t, D)
   
Result:
   Highly descriptive anchor skills get large weights, while generic filler words are suppressed.
"""

def clean_skill_text(text):
    """
    STAGE 2: Text Preprocessing & Cleaning Function
    
    This function cleans raw skill list text:
    1. Converts string to lowercase.
    2. Removes punctuation and special characters, keeping alphanumeric tokens and common abbreviations.
    3. Trims redundant spaces.
    """
    if not isinstance(text, str):
        return ""
    
    # Convert text to lowercase
    text = text.toLowerCase() if hasattr(text, 'toLowerCase') else str(text).lower()
    
    # Remove special characters except alphanumeric, spaces, and select technical signs (e.g. C++, .Net, C#)
    # This keeps common skills like 'c#', 'c++', 'gd&t', and '.net' intact
    text = re.sub(r'[^a-zA-Z0-9&#_+-]', ' ', text)
    
    # Remove redundant multiple spaces with a single space
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def run_tfidf_pipeline():
    print("==================================================")
    # STAGE 3: Loading the CSV Dataset
    # ==================================================
    print("Stage 3: Loading raw job/skill dataset...")
    
    # Mocking standard dataset structure as a demonstration or load from file
    mock_csv_data = {
        'text': [
            'React.JS, Redux, javascript, HTML5, CSS3, DOM, Responsive design',
            'NodeJS, ExpressJS, API, SQL, authentication, authorization, mongo DB, docker',
            'Testing, manual testing, selenium testing, postman, API, python, Git',
            'Python, SQL, statistics, data cleaning, tableau, MS excel, powerpoint',
            'SolidWorks, sw, auto cad, CATIA v5, Creo, GD&T, 3D printing',
            'Embedded C, ARM cortex, Firmware, STM 32, real time os (RTOS), UART, I2C, SPI',
            'Business analysis, Strategy, Analytics, Stakeholder management, swot analysis',
            'Accounting, Finance, tally erp, gst, TDS, Income tax return, BRS, excel'
        ],
        'role': [
            'Frontend Developer',
            'Backend Developer',
            'Software Tester',
            'Data Analyst',
            'CAD Design Engineer',
            'Embedded Systems Engineer',
            'Business Analyst',
            'Accountant'
        ]
    }
    
    df = pd.DataFrame(mock_csv_data)
    print(f"Dataset successfully loaded. Columns found: {list(df.columns)}")
    print(f"Total candidate records: {len(df)}")
    print("\nSample records before preprocessing:")
    print(df.head(3))
    print("-" * 50)

    # ==================================================
    # STAGE 4: Cleaning and Preprocessing Text
    # ==================================================
    print("Stage 4: Cleaning text columns (lowercase, special chars)...")
    df['cleaned_text'] = df['text'].apply(clean_skill_text)
    
    print("\nSample records after preprocessing:")
    for idx, row in df.head(3).iterrows():
        print(f"  Raw:     {row['text']}")
        print(f"  Cleaned: {row['cleaned_text']}\n")
    print("-" * 50)

    # ==================================================
    # STAGE 5: Split Dataset into Train/Test Splits
    # ==================================================
    print("Stage 5: Splitting dataset into training and validation folds...")
    
    X = df['cleaned_text']
    y = df['role']
    
    # Split using train_test_split (80% train, 20% test)
    # random_state is set for full reproducibility
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, 
        test_size=0.2, 
        random_state=42
    )
    
    print(f"  Training samples:   {len(X_train)}")
    print(f"  Validation samples: {len(X_val)}")
    print("-" * 50)

    # ==================================================
    # STAGE 6: Applying TF-IDF Vectorization
    # ==================================================
    print("Stage 6: Transforming clean text to TF-IDF feature matrix...")
    
    # We define token_pattern to keep technical characters like #, +, - (C++, C#, .Net)
    vectorizer = TfidfVectorizer(
        token_pattern=r'(?u)\b[a-zA-Z0-9&#_+-]+\b',
        lowercase=True
    )
    
    # Fit & transform on training fold, and transform on validation fold
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_val_tfidf = vectorizer.transform(X_val)
    
    print(f"  Vocabulary Size: {len(vectorizer.vocabulary_)} distinct skill terms")
    print("  Extracted Vocabulary mapping:")
    print(dict(list(vectorizer.vocabulary_.items())[:10]))
    print("-" * 50)

    # ==================================================
    # STAGE 7: Showing Resulting Feature Matrices
    # ==================================================
    print("Stage 7: Displaying resulting sparse matrix shapes...")
    print(f"  Training Sparse Matrix Shape:   {X_train_tfidf.shape}")
    print(f"  Validation Sparse Matrix Shape: {X_val_tfidf.shape}")
    print("\nProportion details:")
    print(f"  - Rows: {X_train_tfidf.shape[0]} profiles")
    print(f"  - Columns (Features): {X_train_tfidf.shape[1]} unique skill dimensions")
    print("==================================================")
    print("TF-IDF PIPELINE WORKFLOW COMPLETE!")

if __name__ == '__main__':
    run_tfidf_pipeline()
