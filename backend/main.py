"""
AgroAI Bangladesh — FastAPI backend
====================================
Serves the real crop disease detection model.

Endpoints:
    GET  /api/health       — health check
    GET  /api/model-info   — model metadata & accuracy
    POST /api/predict      — upload image → disease prediction

Run:
    cd backend
    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

import json
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware

from schemas.prediction import (
    HealthResponse,
    ModelInfoResponse,
    ModelMeta,
    PredictionResponse,
)
from services.predictor import (
    MODEL_NAME,
    MODEL_VERSION,
    CropDiseasePredictor,
)
from utils.image import ImageValidationError, preprocess_image, validate_image_bytes

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger("agroai")

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "crop_disease_model.keras"
CLASS_NAMES_PATH = BASE_DIR / "model" / "class_names.json"
METRICS_PATH = BASE_DIR / "training" / "crop_disease_model_package" / "metrics.json"

# ---------------------------------------------------------------------------
# CORS — allow the Vite dev server and any configured production origin
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
extra_origin = os.getenv("FRONTEND_ORIGIN", "")
if extra_origin:
    ALLOWED_ORIGINS.append(extra_origin)

# ---------------------------------------------------------------------------
# Global predictor instance (loaded once at startup)
# ---------------------------------------------------------------------------
_predictor: CropDiseasePredictor | None = None


# ---------------------------------------------------------------------------
# Lifespan — model is loaded here, once, before any request is served
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global _predictor
    logger.info("=" * 60)
    logger.info("AgroAI Bangladesh — starting up")
    logger.info("Model path : %s", MODEL_PATH)
    logger.info("Classes    : %s", CLASS_NAMES_PATH)

    try:
        _predictor = CropDiseasePredictor(MODEL_PATH, CLASS_NAMES_PATH)
        logger.info("✅ Model loaded — ready to serve predictions.")
    except FileNotFoundError as exc:
        logger.error("❌ %s", exc)
        logger.error(
            "Place the model files in backend/model/ and restart. "
            "The API will start but /api/predict will return 503."
        )
    except Exception as exc:
        logger.exception("❌ Model loading failed: %s", exc)

    logger.info("=" * 60)
    yield
    # shutdown
    logger.info("AgroAI Bangladesh — shutting down.")


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AgroAI Bangladesh — Crop Disease Detection API",
    description=(
        "FastAPI backend serving a real EfficientNetB0 model trained on "
        "94 Bangladeshi crop disease classes."
    ),
    version=MODEL_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
def _model_meta() -> ModelMeta:
    return ModelMeta(
        name=MODEL_NAME,
        architecture="EfficientNetB0",
        classes=94,
        input_size=224,
    )


def _load_metrics() -> Dict[str, Any]:
    """Read metrics.json if it exists, otherwise return hard-coded values."""
    defaults = {
        "test_samples": 12423,
        "test_accuracy": 0.8861,
        "macro_f1": 0.8552,
        "weighted_f1": 0.8852,
    }
    if METRICS_PATH.exists():
        try:
            with METRICS_PATH.open("r", encoding="utf-8") as f:
                data = json.load(f)
            return {**defaults, **data}
        except Exception:
            pass
    return defaults


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health():
    """Returns model status. model_loaded=false means predictions will fail."""
    if _predictor and _predictor.is_loaded:
        return HealthResponse(
            status="ok",
            model_loaded=True,
            num_classes=_predictor.num_classes,
            model_name=MODEL_NAME,
        )
    return HealthResponse(status="error", model_loaded=False)


@app.get("/api/model-info", response_model=ModelInfoResponse, tags=["Model"])
async def model_info():
    """Returns model metadata and evaluation metrics."""
    m = _load_metrics()
    return ModelInfoResponse(
        model_name=MODEL_NAME,
        architecture="EfficientNetB0",
        input_size="224x224",
        num_classes=94,
        test_samples=m["test_samples"],
        test_accuracy=m["test_accuracy"],
        macro_f1=m["macro_f1"],
        weighted_f1=m["weighted_f1"],
        model_version=MODEL_VERSION,
    )


@app.post(
    "/api/predict",
    response_model=PredictionResponse,
    tags=["Prediction"],
    summary="Upload a crop leaf image and get a disease prediction",
)
async def predict(file: UploadFile = File(..., description="Crop/leaf image (JPEG, PNG, WebP)")):
    """
    Accepts a multipart image upload and returns the top disease predictions
    from the trained EfficientNetB0 model.

    - **file**: image file (JPEG / PNG / WebP, max 10 MB)
    """
    # ── 1. Guard: model must be loaded ───────────────────────────────
    if not _predictor or not _predictor.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "AI service unavailable — model not loaded.",
                "hint": "Ensure crop_disease_model.keras is in backend/model/ and restart.",
            },
        )

    # ── 2. Read file bytes ────────────────────────────────────────────
    try:
        data = await file.read()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {exc}",
        )

    # ── 3. Validate ───────────────────────────────────────────────────
    try:
        validate_image_bytes(data, file.content_type)
    except ImageValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )

    # ── 4. Predict & analyze quality ──────────────────────────────────
    try:
        response = _predictor.predict(data)
        return response
    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {exc}",
        )
