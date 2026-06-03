import os
import re
import joblib
import numpy as np

class InferenceGuard:
    def __init__(self, model_path=None, vectorizer_path=None):
        # Resolve default paths relative to this script's directory
        # c:\Users\Lenovo\Downloads\CareerMapper-main\ml\utils\inference_guard.py
        current_dir = os.path.dirname(os.path.abspath(__file__))
        ml_dir = os.path.dirname(current_dir)
        
        self.model_path = model_path or os.path.join(ml_dir, 'models', 'best_role_classifier.joblib')
        self.vectorizer_path = vectorizer_path or os.path.join(ml_dir, 'models', 'best_vectorizer.joblib')
        
        self.clf = None
        self.vectorizer = None

    def _load_models(self):
        """Loads serialized classifier and vectorizer models on demand."""
        if self.clf is None or self.vectorizer is None:
            if not os.path.exists(self.model_path) or not os.path.exists(self.vectorizer_path):
                raise FileNotFoundError(
                    f"Model artifacts not found. Please ensure both exist:\n"
                    f"  - Classifier: {self.model_path}\n"
                    f"  - Vectorizer: {self.vectorizer_path}"
                )
            self.clf = joblib.load(self.model_path)
            self.vectorizer = joblib.load(self.vectorizer_path)

    def clean_skill_text(self, text):
        """Cleans and normalizes input text preserving essential technical tokens."""
        if not isinstance(text, str):
            return ""
        text = text.lower()
        # Preserve technical punctuation like C#, C++, .Net, and GD&T
        text = re.sub(r'[^a-zA-Z0-9&#_+-]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def sanitize_text(self, text):
        """Filters duplicate token spam by capping occurrences of any word to exactly 2."""
        cleaned = self.clean_skill_text(text)
        tokens = cleaned.split()
        
        counts = {}
        capped_tokens = []
        for t in tokens:
            counts[t] = counts.get(t, 0) + 1
            if counts[t] <= 2:
                capped_tokens.append(t)
        return " ".join(capped_tokens)

    def check_quality(self, text):
        """
        Validates the informational quality and domain overlap of the profile.
        Returns: (is_valid: bool, error_message: str)
        """
        self._load_models()
        cleaned = self.clean_skill_text(text)
        tokens = cleaned.split()
        
        # Heuristic 1: Minimum token count check
        if len(tokens) < 3:
            return False, "Profile text too short (minimum 3 words required)"
            
        # Heuristic 2: Vocabulary diversity check
        unique_tokens = set(tokens)
        if len(unique_tokens) < 2:
            return False, "Low vocabulary diversity (insufficient distinct terms)"
            
        # Heuristic 3: Technical terms overlap count (using fitted vectorizer vocabulary)
        # We transform the sanitized text to see how many non-zero elements it has
        sanitized = self.sanitize_text(text)
        vec = self.vectorizer.transform([sanitized])
        
        if vec.nnz < 2:
            return False, "Non-technical or low-information content detected"
            
        return True, "OK"

    def calculate_softmax(self, decision_scores):
        """Applies stable Softmax to decision boundary scores."""
        exp_scores = np.exp(decision_scores - np.max(decision_scores))
        return exp_scores / np.sum(exp_scores)

    def predict_safe(self, text, top_k=3):
        """
        Performs safe, calibrated, top-k role recommendations with fallback capabilities.
        
        Args:
            text (str): Raw user resume or profile description.
            top_k (int): Number of top ranked predictions to return.
            
        Returns:
            dict: Structured JSON-compatible result dictionary.
        """
        # 1. Reject empty payloads, whitespaces, or non-strings
        if text is None or not isinstance(text, str) or not text.strip():
            return {
                "success": False,
                "error": "Empty or invalid profile text"
            }
            
        try:
            self._load_models()
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to initialize validation models: {str(e)}"
            }

        # 2. Input Quality Checks (Heuristics gates)
        is_valid, err_msg = self.check_quality(text)
        if not is_valid:
            return {
                "success": False,
                "error": err_msg
            }

        # 3. Spam token filtering & sanitization
        sanitized = self.sanitize_text(text)

        # 4. Inference & soft probability calculations
        try:
            vec = self.vectorizer.transform([sanitized])
            decision_scores = self.clf.decision_function(vec)[0]
            probs = self.calculate_softmax(decision_scores)
            
            classes = self.clf.classes_
            top_indices = np.argsort(probs)[::-1]
            
            max_confidence = float(probs[top_indices[0]])
            
            # 5. Low-Confidence threshold check (< 25%)
            if max_confidence < 0.25:
                return {
                    "success": True,
                    "fallback": True,
                    "message": "Low confidence prediction",
                    "recommendations": []
                }
                
            # 6. Top-K predictions compilation
            predictions = []
            for idx in top_indices[:top_k]:
                predictions.append({
                    "role": classes[idx],
                    "confidence": float(probs[idx])
                })
                
            return {
                "success": True,
                "fallback": False,
                "predictions": predictions
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Model inference execution error: {str(e)}"
            }
