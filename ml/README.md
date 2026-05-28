# CareerMapper Machine Learning Module

This directory contains the machine learning assets, datasets, notebooks, and models for the **CareerMapper AI-Based Career Recommendation System**. The structure is designed to support scalable multi-domain classification workflows (covering IT, Mechanical, MBA, ECE, and BCom) using a Python-based scikit-learn stack.

---

## 📂 Project Directory Structure

```text
ml/
├── datasets/             # Data storage partition
│    ├── raw/             # Unprocessed raw CSV/JSON profiles
│    ├── cleaned/         # Deduplicated, normalized datasets
│    └── final/           # Fully vectorized/encoded feature matrices
│
├── notebooks/            # Jupyter notebooks for model R&D
│    └── baseline_training.ipynb
│
├── models/               # Serialized model weights (e.g. .pkl, .joblib)
│
├── evaluation/           # Performance reports, confusion matrices, and metrics
│
├── scripts/              # Production-ready Python utility scripts
│
├── outputs/              # Saved model predictions and visual plots
│
├── requirements.txt      # Python package dependencies
└── README.md             # This guide
```

---

## ⚙️ Recommended Python Stack & Package Versions

To ensure reproducibility across environments, use the following package specifications:

| Package | Version | Purpose |
| :--- | :---: | :--- |
| **`python`** | `^3.10` | Base interpreter |
| **`numpy`** | `1.26.4` | Efficient numerical linear algebra and vector operations |
| **`pandas`** | `2.2.2` | Structured data manipulation (DataFrames) and preprocessing |
| **`scikit-learn`** | `1.4.2` | Core modeling library (TF-IDF vectorizer, Random Forests, SVMs) |
| **`scipy`** | `1.13.0` | Sparse matrix support for high-dimensional feature spaces |
| **`joblib`** | `1.4.2` | Serialization helper for saving and reloading trained estimators |
| **`xgboost`** | `2.0.3` | Gradient boosted tree framework for high-accuracy classification |
| **`matplotlib`** | `3.9.0` | 2D plotting engine for visual inspections |
| **`seaborn`** | `0.13.2` | Premium statistical data visualization |
| **`jupyter`** | `1.0.0` | Interactive notebook workspace |

To initialize your local virtual environment:
```bash
python -m venv venv
source venv/Scripts/activate # On Windows PowerShell: .\venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🛠️ Multi-Domain Scaling Design

The folder structure is built to scale beyond simple IT classification and support multi-domain recommendation systems (IT, Mechanical, MBA, ECE, BCom) under the following design paradigm:

1. **`datasets/` segregation**:
   * Multi-domain datasets are stored in `datasets/cleaned/` with clear column schemas indicating domain categories.
   * Encourages standard **TF-IDF vectorization** on normalized skill arrays to construct unified feature spaces.
2. **`models/` persistence**:
   * Saved model names follow standard conventions: `role_classifier_[domain].joblib`.
   * The backend dynamically loads the specific domain model based on the domain detected by the preprocessor.
3. **`scripts/` training utilities**:
   * Pre-built training pipelines can easily run modular pipelines per domain, e.g. `python scripts/train.py --domain ECE`.
