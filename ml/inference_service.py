import os
import sys
import uvicorn
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
    text: str = Field(..., description="Raw text describing technical profile/skills", example="react html css javascript web developer")

@app.get("/health")
async def health_check():
    """Service health status check endpoint."""
    try:
        # Re-verify model paths and loading
        guard._load_models()
        return {
            "status": "healthy",
            "model": "LinearSVC",
            "classes_loaded": len(guard.clf.classes_)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "reason": str(e)
        }

@app.post("/predict")
async def predict_role(request: PredictionRequest):
    """
    Predicts top 3 matched IT roles safely based on technical skill input.
    """
    res = guard.predict_safe(request.text)
    
    # Return structured output directly (including fallback status, error messages, and Top-K predictions)
    return res

if __name__ == "__main__":
    # Standard independent port run
    uvicorn.run("inference_service:app", host="127.0.0.1", port=8000, reload=False)
