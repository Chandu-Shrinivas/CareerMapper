import os
import sys
import uvicorn
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# Ensure the parent directory is in Python path for absolute imports
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CURRENT_DIR)

from utils.inference_guard import InferenceGuard

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CareerMapper ML Inference Service",
    description="Calibrated, production-safe career classification using TF-IDF + LinearSVC",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the global inference guard instance (loads models on demand)
guard = InferenceGuard()
try:
    guard._load_models()
except Exception as e:
    print(f"Warning: could not pre-load models at startup: {e}")

class PredictionRequest(BaseModel):
    text: str = Field(..., description="Raw text describing profile/skills", example="react html css javascript web developer")
    domain: Optional[str] = Field(None, description="Domain identifier (IT, ECE, Mechanical, MBA, B.Com, Civil)", example="IT")

@app.get("/health")
async def health_check():
    """Service health status check endpoint for all 6 domain models."""
    try:
        loaded_domains = {}
        for dom in ['IT', 'ECE', 'Mechanical', 'MBA', 'B.Com', 'Civil']:
            mod = guard._load_domain_model(dom)
            loaded_domains[dom] = len(mod['class_names'])
            
        return {
            "status": "healthy",
            "model_type": "LinearSVC",
            "supported_domains": loaded_domains
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "reason": str(e)
        }

@app.post("/predict")
async def predict_role(request: PredictionRequest):
    """
    Predicts top matched roles safely based on profile text and domain routing.
    """
    res = guard.predict_safe(request.text, domain=request.domain)
    return res

if __name__ == "__main__":
    uvicorn.run("inference_service:app", host="127.0.0.1", port=8000, reload=False)


