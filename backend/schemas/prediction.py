"""
Pydantic schemas for AgroAI Bangladesh API responses.
"""
from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class SinglePrediction(BaseModel):
    class_id: int = Field(..., description="0-93 class index")
    disease: str = Field(..., description="Raw class name, e.g. Tomato_Late_Blight")
    display_name: str = Field(..., description="User-friendly name, e.g. Tomato Late Blight")
    crop: str = Field(..., description="Extracted crop name, e.g. Tomato")
    confidence: float = Field(..., description="Probability score 0.0 to 1.0")
    confidence_percent: float = Field(..., description="Percentage score 0.0 to 100.0")


class ImageQualityInfo(BaseModel):
    status: str = Field(..., description="good, acceptable, or poor")
    width: int
    height: int
    aspect_ratio: float
    brightness: float
    contrast: float
    blur_score: float
    quality_flags: List[str] = Field(default_factory=list)


class ModelMeta(BaseModel):
    name: str = "CropDisease_EfficientNetB0"
    architecture: str = "EfficientNetB0"
    classes: int = 94
    input_size: str = "224x224"


class PredictionResponse(BaseModel):
    success: bool = True
    prediction: Optional[SinglePrediction] = None
    uncertain: bool = False
    low_confidence: bool = False
    confidence_level: str = Field(..., description="high, moderate, or low")
    margin: float = Field(..., description="Difference between top-1 and top-2 probabilities")
    entropy: float = Field(..., description="Shannon entropy of probability distribution")
    quality: ImageQualityInfo
    top_predictions: List[SinglePrediction] = Field(default_factory=list)
    model: ModelMeta = Field(default_factory=ModelMeta)
    demo: bool = False


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    num_classes: int
    model_name: str


class ModelInfoResponse(BaseModel):
    model_name: str
    architecture: str
    input_size: str
    num_classes: int
    test_samples: int
    test_accuracy: float
    macro_f1: float
    weighted_f1: float
    model_version: str = "1.0"
