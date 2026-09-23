import os
import re
import joblib
import numpy as np

# Global Configuration & Diagnostic Flags
MECHANICAL_HYBRID_SHADOW_MODE = True
HYBRID_STATUS = "EXPERIMENTAL_SHADOW_ONLY"

class MechanicalHybridClassifier:
    """
    Production wrapper for Mechanical Role Classifier v1.
    
    Status: EXPERIMENTAL_SHADOW_ONLY
    The frozen ML model (LinearSVC v1) is the authoritative production role predictor.
    The hybrid layer computes diagnostic telemetry only and NEVER overrides production output when shadow_mode=True.
    """
    def __init__(self, model_dir=None):
        if model_dir is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            model_dir = os.path.join(current_dir, 'models', 'mechanical_role_classifier')
            
        self.model_dir = model_dir
        self.model_path = os.path.join(model_dir, 'model.joblib')
        self.vectorizer_path = os.path.join(model_dir, 'vectorizer.joblib')
        self.label_encoder_path = os.path.join(model_dir, 'label_encoder.joblib')
        
        self.clf = None
        self.vectorizer = None
        self.id2label = None
        self.label2id = None

    def load_models(self):
        """Loads frozen model artifacts on demand."""
        if self.clf is None or self.vectorizer is None or self.id2label is None:
            if not (os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path) and os.path.exists(self.label_encoder_path)):
                raise FileNotFoundError(f"Mechanical model artifacts not found in {self.model_dir}")
                
            self.clf = joblib.load(self.model_path)
            self.vectorizer = joblib.load(self.vectorizer_path)
            label_encoder = joblib.load(self.label_encoder_path)
            
            if isinstance(label_encoder, dict):
                self.label2id = label_encoder
                self.id2label = {v: k for k, v in label_encoder.items()}
            else:
                self.id2label = {i: name for i, name in enumerate(label_encoder.classes_)}
                self.label2id = {name: i for i, name in enumerate(label_encoder.classes_)}

    def evaluate_shadow_hybrid(self, text, ml_role, ml_second_role, decision_margin):
        """
        Calculates diagnostic shadow hybrid decision outputs.
        Does NOT alter ML model weights or production returns.
        """
        l_text = text.lower().strip()
        
        # 1. Empty / Minimal Input Check
        if not l_text or len(l_text) < 10:
            return {
                "hybrid_role": "REJECTED_OOD",
                "decision_type": "REJECTED_OOD",
                "ood_rejected": True,
                "reason": "Empty or minimal input length"
            }
            
        # 2. Domain Signals
        mech_signals = [
            "cad", "autocad", "solidworks", "catia", "creo", "drafting", "3d modeling", "gd&t", "drafter", "detailer",
            "fea", "cfd", "ansys", "abaqus", "comsol", "finite element", "computational fluid", "meshing", "stress analysis",
            "manufacturing", "cnc", "machining", "lean manufacturing", "six sigma", "tooling", "assembly",
            "product design", "product development", "dfm", "dfa", "bom", "prototyping", "design validation",
            "hvac", "refrigeration", "chilled water", "ductwork", "duct design", "cooling loads", "ventilation"
        ]
        
        ood_signals = [
            "software engineer", "rest api", "java", "spring boot", "react", "postgresql", "python developer", "frontend developer",
            "data scientist", "pandas", "numpy", "tensorflow", "machine learning",
            "accountant", "tally", "gst", "taxation", "bookkeeping", "financial analyst",
            "marketing analyst", "seo", "google analytics", "digital campaigns",
            "civil engineer", "reinforced concrete", "foundations", "highways",
            "electrical engineer", "power distribution", "transformers", "electrical panels",
            "embedded systems", "firmware", "pcb circuits", "microcontroller", "arm", "stm32"
        ]
        
        has_mech_signal = any(kw in l_text for kw in mech_signals)
        has_ood_signal = any(kw in l_text for kw in ood_signals)
        
        # Reject OOD if strong non-mechanical domain signal present AND no mechanical signals
        if has_ood_signal and not has_mech_signal:
            return {
                "hybrid_role": "REJECTED_OOD",
                "decision_type": "REJECTED_OOD",
                "ood_rejected": True,
                "reason": "Strong non-mechanical OOD keywords detected without mechanical evidence"
            }
            
        # Reject low-margin predictions with no mechanical evidence
        if decision_margin < 0.25 and not has_mech_signal:
            return {
                "hybrid_role": "REJECTED_OOD",
                "decision_type": "REJECTED_OOD",
                "ood_rejected": True,
                "reason": "Low decision margin (< 0.25) with zero mechanical domain evidence"
            }
            
        # 3. Contextual Boundary Disambiguation for CAD Design Engineer vs Product Design Engineer
        candidate_pair = {ml_role, ml_second_role}
        if candidate_pair == {"CAD Design Engineer", "Product Design Engineer"} and decision_margin < 2.0:
            cad_title_signals = ["cad designer", "cad engineer", "cad drafter", "drafter", "drafting", "autocad designer", "3d cad design specialist", "detailer", "mechanical drafter"]
            cad_drawing_signals = ["gd&t", "engineering drawings", "technical drawings", "2d and 3d drawings", "tolerance stack-up"]
            prod_dev_signals = ["dfm", "dfa", "bom", "product development", "product lifecycle", "prototype development", "new product development", "design validation", "concept development"]
            
            has_cad_title = any(kw in l_text for kw in cad_title_signals)
            has_cad_drawings = any(kw in l_text for kw in cad_drawing_signals)
            has_prod_dev = any(kw in l_text for kw in prod_dev_signals)
            
            if (has_cad_title or has_cad_drawings) and not has_prod_dev:
                return {
                    "hybrid_role": "CAD Design Engineer",
                    "decision_type": "RESOLVED_CAD_DISAMBIGUATION",
                    "ood_rejected": False,
                    "reason": "CAD drafting title/drawing evidence present without product development/DFM/BOM"
                }
            elif has_prod_dev:
                return {
                    "hybrid_role": "Product Design Engineer",
                    "decision_type": "RESOLVED_PRODUCT_DESIGN_DISAMBIGUATION",
                    "ood_rejected": False,
                    "reason": "Product development/DFM/BOM evidence present"
                }

        # Default fallback: Accept raw ML baseline prediction
        return {
            "hybrid_role": ml_role,
            "decision_type": "ACCEPTED_BASELINE",
            "ood_rejected": False,
            "reason": "Accepted ML baseline prediction"
        }

    def predict(self, text, shadow_mode=MECHANICAL_HYBRID_SHADOW_MODE):
        """
        Performs inference using frozen Mechanical Role Classifier v1.
        Calculates Shadow Hybrid decision outputs for diagnostic telemetry.
        
        Args:
            text (str): Raw job/resume text.
            shadow_mode (bool): Always True in production. Guarantees final_role == ml_role.
            
        Returns:
            dict: Structured JSON output complying with CareerMapper requirements.
        """
        self.load_models()
        
        if text is None or not isinstance(text, str) or not text.strip():
            ml_role = self.id2label[0]
            ml_second_role = self.id2label[1] if len(self.id2label) > 1 else ml_role
            decision_margin = 0.0
        else:
            vec_text = self.vectorizer.transform([text])
            dec_scores = self.clf.decision_function(vec_text)[0]
            sorted_indices = np.argsort(dec_scores)[::-1]
            
            top1_idx = sorted_indices[0]
            top2_idx = sorted_indices[1]
            
            ml_role = self.id2label[top1_idx]
            ml_second_role = self.id2label[top2_idx]
            decision_margin = float(dec_scores[top1_idx] - dec_scores[top2_idx])
            
        # Compute Diagnostic Shadow Hybrid Output
        sh_result = self.evaluate_shadow_hybrid(text, ml_role, ml_second_role, decision_margin)
        
        hybrid_role = sh_result["hybrid_role"]
        decision_type = sh_result["decision_type"]
        ood_rejected = sh_result["ood_rejected"]
        
        # INVARIANT: In shadow mode, ML prediction is strictly authoritative
        if shadow_mode:
            final_role = ml_role
        else:
            final_role = None if ood_rejected else hybrid_role

        return {
            "ml_role": ml_role,
            "ml_second_role": ml_second_role,
            "decision_margin": round(decision_margin, 4),
            "hybrid_role": hybrid_role,
            "decision_type": decision_type,
            "ood_rejected": ood_rejected,
            "final_role": final_role,
            "shadow_mode": shadow_mode,
            "hybrid_status": HYBRID_STATUS,
            "reason": sh_result["reason"]
        }
