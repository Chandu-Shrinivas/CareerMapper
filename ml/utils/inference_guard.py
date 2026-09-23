import os
import re
import joblib
import numpy as np

class InferenceGuard:
    DOMAIN_ALIAS = {
        'it': 'IT',
        'ece': 'ECE',
        'mechanical': 'Mechanical',
        'mba': 'MBA',
        'bcom': 'B.Com',
        'b.com': 'B.Com',
        'civil': 'Civil'
    }

    def __init__(self, model_path=None, vectorizer_path=None):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        ml_dir = os.path.dirname(current_dir)
        
        # Paths for all 6 domain classifiers
        self.configs = {
            'IT': {
                'model_path': model_path or os.path.join(ml_dir, 'models', 'best_role_classifier.joblib'),
                'vectorizer_path': vectorizer_path or os.path.join(ml_dir, 'models', 'best_vectorizer.joblib'),
                'le_path': None
            },
            'ECE': {
                'model_path': os.path.join(ml_dir, 'models', 'ece_role_classifier', 'model.joblib'),
                'vectorizer_path': os.path.join(ml_dir, 'models', 'ece_role_classifier', 'vectorizer.joblib'),
                'le_path': os.path.join(ml_dir, 'models', 'ece_role_classifier', 'label_encoder.joblib')
            },
            'Mechanical': {
                'model_path': os.path.join(ml_dir, 'models', 'mechanical_role_classifier', 'model.joblib'),
                'vectorizer_path': os.path.join(ml_dir, 'models', 'mechanical_role_classifier', 'vectorizer.joblib'),
                'le_path': os.path.join(ml_dir, 'models', 'mechanical_role_classifier', 'label_encoder.joblib')
            },
            'MBA': {
                'model_path': os.path.join(ml_dir, 'models', 'mba_role_classifier', 'model.joblib'),
                'vectorizer_path': os.path.join(ml_dir, 'models', 'mba_role_classifier', 'vectorizer.joblib'),
                'le_path': os.path.join(ml_dir, 'models', 'mba_role_classifier', 'label_encoder.joblib')
            },
            'B.Com': {
                'model_path': os.path.join(ml_dir, 'models', 'bcom_role_classifier', 'model.joblib'),
                'vectorizer_path': os.path.join(ml_dir, 'models', 'bcom_role_classifier', 'vectorizer.joblib'),
                'le_path': os.path.join(ml_dir, 'models', 'bcom_role_classifier', 'label_encoder.joblib')
            },
            'Civil': {
                'model_path': os.path.join(ml_dir, 'models', 'civil_role_classifier', 'model.joblib'),
                'vectorizer_path': os.path.join(ml_dir, 'models', 'civil_role_classifier', 'vectorizer.joblib'),
                'le_path': os.path.join(ml_dir, 'models', 'civil_role_classifier', 'label_encoder.joblib')
            }
        }
        
        self.models = {}

    def _normalize_domain(self, domain):
        if not domain or not isinstance(domain, str):
            return 'IT'
        norm = domain.strip().lower()
        return self.DOMAIN_ALIAS.get(norm, 'IT')

    def _load_domain_model(self, domain_name):
        canonical_domain = self._normalize_domain(domain_name)
        if canonical_domain in self.models:
            return self.models[canonical_domain]

        cfg = self.configs.get(canonical_domain, self.configs['IT'])
        if not os.path.exists(cfg['model_path']) or not os.path.exists(cfg['vectorizer_path']):
            raise FileNotFoundError(
                f"Model artifacts not found for domain {canonical_domain}:\n"
                f"  - Classifier: {cfg['model_path']}\n"
                f"  - Vectorizer: {cfg['vectorizer_path']}"
            )

        clf = joblib.load(cfg['model_path'])
        vec = joblib.load(cfg['vectorizer_path'])
        le = joblib.load(cfg['le_path']) if cfg['le_path'] and os.path.exists(cfg['le_path']) else None

        if le is not None:
            if hasattr(le, 'classes_'):
                class_names = list(le.classes_)
            elif isinstance(le, dict):
                rev = {v: k for k, v in le.items()}
                class_names = [rev[i] for i in range(len(rev))]
            else:
                class_names = list(clf.classes_)
        else:
            class_names = list(clf.classes_)

        loaded = {
            'clf': clf,
            'vec': vec,
            'class_names': class_names,
            'domain': canonical_domain
        }
        self.models[canonical_domain] = loaded
        return loaded

    def _load_models(self):
        """Pre-loads default IT model or all models."""
        self._load_domain_model('IT')

    def clean_skill_text(self, text):
        """Cleans and normalizes input text preserving essential technical tokens."""
        if not isinstance(text, str):
            return ""
        text = text.lower()
        # Preserve technical tokens like C#, C++, .Net, GD&T, STAAD.Pro
        text = re.sub(r'[^a-zA-Z0-9&#_+-]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def sanitize_text(self, text):
        """Filters duplicate token spam by capping occurrences of any word to 2."""
        cleaned = self.clean_skill_text(text)
        tokens = cleaned.split()
        
        counts = {}
        capped_tokens = []
        for t in tokens:
            counts[t] = counts.get(t, 0) + 1
            if counts[t] <= 2:
                capped_tokens.append(t)
        return " ".join(capped_tokens)

    def calculate_softmax(self, decision_scores):
        """Applies stable Softmax to decision boundary scores."""
        exp_scores = np.exp(decision_scores - np.max(decision_scores))
        return exp_scores / np.sum(exp_scores)

    def predict_safe(self, text, domain=None, top_k=3):
        """
        Performs safe, calibrated, domain-routed role predictions.
        
        Args:
            text (str): Raw resume or skill description text.
            domain (str): Target domain ('IT', 'ECE', 'Mechanical', 'MBA', 'B.Com', 'Civil').
            top_k (int): Number of top recommendations to return.
        """
        if text is None or not isinstance(text, str) or not text.strip():
            return {
                "success": False,
                "error": "Empty or invalid profile text"
            }
            
        target_domain = self._normalize_domain(domain)
        
        try:
            model_obj = self._load_domain_model(target_domain)
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to initialize model for domain {target_domain}: {str(e)}"
            }

        clf = model_obj['clf']
        vec = model_obj['vec']
        class_names = model_obj['class_names']

        sanitized = self.sanitize_text(text)
        if not sanitized:
            return {
                "success": True,
                "fallback": True,
                "domain": target_domain,
                "message": "Empty sanitized profile text",
                "role": {"predicted": "Unknown", "confidence": 0.0, "margin": 0.0},
                "predictions": []
            }

        try:
            vec_in = vec.transform([sanitized])
            
            # Out-of-vocabulary check
            if vec_in.nnz == 0:
                return {
                    "success": True,
                    "fallback": True,
                    "domain": target_domain,
                    "message": "No recognized domain vocabulary matched",
                    "role": {"predicted": "Unknown", "confidence": 0.0, "margin": 0.0},
                    "predictions": []
                }

            decision_scores = clf.decision_function(vec_in)[0]
            probs = self.calculate_softmax(decision_scores)
            top_indices = np.argsort(probs)[::-1]

            top1_role = class_names[top_indices[0]]
            top1_conf = float(probs[top_indices[0]])
            top2_conf = float(probs[top_indices[1]]) if len(top_indices) > 1 else 0.0
            margin = float(top1_conf - top2_conf)

            low_confidence = (top1_conf < 0.25 or margin < 0.05)

            predictions = []
            for idx in top_indices[:top_k]:
                predictions.append({
                    "role": class_names[idx],
                    "confidence": round(float(probs[idx]), 4)
                })

            return {
                "success": True,
                "fallback": low_confidence and top1_conf < 0.15,
                "domain": target_domain,
                "role": {
                    "predicted": top1_role,
                    "confidence": round(top1_conf, 4),
                    "margin": round(margin, 4)
                },
                "predictions": predictions,
                "low_confidence": low_confidence,
                "warning": "Low confidence prediction" if low_confidence else None
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"Model inference execution error: {str(e)}"
            }

