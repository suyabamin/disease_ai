"""
CropDiseasePredictor — production inference service for crop_disease_model.keras.

Features:
  - Loads model ONCE on backend startup (lifespan pattern)
  - Preprocessing preserves aspect ratio & EXIF orientation
  - Image quality assessment (resolution, contrast, brightness, blur score)
  - Top-1, Top-2, Top-3 class probability calculation
  - Top-1/Top-2 margin & Shannon entropy calculation
  - Configurable confidence & margin thresholds for uncertainty rejection
  - Crop & Disease display formatting
"""
from __future__ import annotations

import json
import logging
import math
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

from schemas.prediction import (
    ImageQualityInfo,
    ModelMeta,
    PredictionResponse,
    SinglePrediction,
)
from utils.image import analyze_image_quality, preprocess_image

logger = logging.getLogger(__name__)

MODEL_NAME = "CropDisease_EfficientNetB0"
MODEL_VERSION = "1.0"
EXPECTED_CLASSES = 94
INPUT_SIZE = 224

# Configurable decision thresholds
CONFIDENCE_HIGH = 0.80
CONFIDENCE_MODERATE = 0.60
CONFIDENCE_THRESHOLD = 0.50  # Minimum top-1 probability for confident prediction
MARGIN_THRESHOLD = 0.08      # Minimum difference between top-1 and top-2


def _extract_crop(class_name: str) -> str:
    """Extract crop name from raw class string like 'Tomato_Late_Blight' -> 'Tomato'."""
    parts = class_name.split("_")
    return parts[0] if parts else class_name


def _display_name(class_name: str) -> str:
    """Format raw class name like 'Tomato_Late_Blight' -> 'Tomato Late Blight'."""
    clean = class_name.replace("_", " ").strip()
    # Collapse multiple spaces
    return " ".join(clean.split())


class CropDiseasePredictor:
    """Singleton predictor. Instantiated once at startup."""

    def __init__(self, model_path: Path, class_names_path: Path) -> None:
        self._model = None
        self._class_names: List[str] = []
        self._loaded = False

        self._load(model_path, class_names_path)

    # ------------------------------------------------------------------
    # Internal: load model & class names
    # ------------------------------------------------------------------

    def _load(self, model_path: Path, class_names_path: Path) -> None:
        if not class_names_path.exists():
            raise FileNotFoundError(f"class_names.json not found at: {class_names_path}")

        with class_names_path.open("r", encoding="utf-8") as f:
            raw_classes = json.load(f)

        if isinstance(raw_classes, dict):
            # Sort integer keys "0".."93"
            self._class_names = [raw_classes[str(i)] for i in range(len(raw_classes))]
        elif isinstance(raw_classes, list):
            self._class_names = raw_classes
        else:
            raise ValueError(f"Invalid class_names.json format: {type(raw_classes)}")

        if len(self._class_names) != EXPECTED_CLASSES:
            raise ValueError(
                f"class_names.json contains {len(self._class_names)} classes but expected {EXPECTED_CLASSES}."
            )
        logger.info("class_names.json loaded — %d classes", len(self._class_names))

        if not model_path.exists():
            raise FileNotFoundError(
                f"Model file not found at: {model_path}\n"
                "Place crop_disease_model.keras in backend/model/ and restart."
            )

        import tensorflow as tf

        logger.info("Loading model from %s …", model_path)
        self._model = tf.keras.models.load_model(str(model_path))
        logger.info("Model loaded successfully.")

        out_shape = self._model.output_shape
        num_out = out_shape[-1]
        if num_out != EXPECTED_CLASSES:
            raise ValueError(
                f"Model output has {num_out} classes but expected {EXPECTED_CLASSES}."
            )
        logger.info("Model validated — input %s  output %s", self._model.input_shape, out_shape)

        self._loaded = True

    # ------------------------------------------------------------------
    # Public Inference API
    # ------------------------------------------------------------------

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    @property
    def num_classes(self) -> int:
        return len(self._class_names)

    def predict(self, image_bytes: bytes, use_tta: bool = False) -> PredictionResponse:
        if not self._loaded or self._model is None:
            raise RuntimeError("Model is not loaded.")

        # 1. Analyze image quality
        quality_dict = analyze_image_quality(image_bytes)
        quality_info = ImageQualityInfo(**quality_dict)

        # 2. Preprocess image
        tensor = preprocess_image(image_bytes)  # (1, 224, 224, 3)

        # 3. Model inference
        probs = self._model.predict(tensor, verbose=0)[0]  # (94,) float32

        # Optional mild TTA (Horizontal Flip) if requested
        if use_tta:
            flipped_tensor = np.flip(tensor, axis=2)
            flipped_probs = self._model.predict(flipped_tensor, verbose=0)[0]
            probs = (probs + flipped_probs) / 2.0

        # Sort top indices
        top_indices = np.argsort(probs)[::-1][:3]
        top1_idx = int(top_indices[0])
        top2_idx = int(top_indices[1]) if len(top_indices) > 1 else top1_idx

        top1_prob = float(probs[top1_idx])
        top2_prob = float(probs[top2_idx])
        margin = float(top1_prob - top2_prob)

        # Calculate Shannon entropy
        clipped_probs = np.clip(probs, 1e-12, 1.0)
        entropy = float(-np.sum(clipped_probs * np.log2(clipped_probs)))

        # Build top-3 prediction objects
        top_predictions: List[SinglePrediction] = []
        for idx in top_indices:
            i = int(idx)
            raw_name = self._class_names[i]
            p_val = float(probs[i])
            top_predictions.append(
                SinglePrediction(
                    class_id=i,
                    disease=raw_name,
                    display_name=_display_name(raw_name),
                    crop=_extract_crop(raw_name),
                    confidence=round(p_val, 6),
                    confidence_percent=round(p_val * 100.0, 2),
                )
            )

        # Confidence level indicator
        if top1_prob >= CONFIDENCE_HIGH:
            confidence_level = "high"
        elif top1_prob >= CONFIDENCE_MODERATE:
            confidence_level = "moderate"
        else:
            confidence_level = "low"

        # Uncertainty decision criteria:
        #   - Image quality is POOR
        #   - OR top-1 confidence is below CONFIDENCE_THRESHOLD (0.50)
        #   - OR top-1/top-2 margin is below MARGIN_THRESHOLD (0.08)
        is_uncertain = (
            quality_dict["status"] == "poor"
            or top1_prob < CONFIDENCE_THRESHOLD
            or margin < MARGIN_THRESHOLD
        )

        top_pred_obj = top_predictions[0] if top_predictions else None
        final_prediction = None if is_uncertain else top_pred_obj

        return PredictionResponse(
            success=True,
            prediction=final_prediction,
            uncertain=is_uncertain,
            low_confidence=is_uncertain,
            confidence_level=confidence_level,
            margin=round(margin, 4),
            entropy=round(entropy, 4),
            quality=quality_info,
            top_predictions=top_predictions,
            model=ModelMeta(),
            demo=False,
        )
