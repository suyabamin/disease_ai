"""
Image preprocessing and quality inspection utilities for crop disease detection.

All processing strictly adheres to model training requirements:
  - RGB mode (forced 3 channels, eliminating RGBA, grayscale, CMYK, palette)
  - EXIF orientation correction (ImageOps.exif_transpose)
  - Aspect-ratio preserving high-quality resize to 224×224
  - Input tensor range: float32 in [0, 255] (EfficientNetB0 internal rescaling)
  - Shape: (1, 224, 224, 3)
"""
from __future__ import annotations

import io
import math
from typing import List, Tuple, Dict, Any

import numpy as np
from PIL import Image, ImageOps, UnidentifiedImageError

# Supported MIME types and extensions
SUPPORTED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
TARGET_SIZE = (224, 224)


class ImageValidationError(ValueError):
    """Raised when an uploaded file cannot be used for prediction."""


def validate_image_bytes(data: bytes, content_type: str | None = None) -> None:
    """Validate raw bytes to ensure a valid, readable image under size limits."""
    if len(data) > MAX_FILE_SIZE_BYTES:
        raise ImageValidationError(
            f"File size ({len(data) / (1024 * 1024):.1f} MB) exceeds maximum allowed 10 MB."
        )
    if len(data) == 0:
        raise ImageValidationError("Uploaded image file is empty.")

    if content_type and content_type.lower() not in SUPPORTED_TYPES:
        raise ImageValidationError(
            f"Unsupported file type '{content_type}'. Please upload JPG, PNG, or WebP."
        )

    try:
        img = Image.open(io.BytesIO(data))
        img.verify()
    except UnidentifiedImageError:
        raise ImageValidationError("Corrupted or unreadable image file.")
    except Exception as exc:
        raise ImageValidationError(f"Image validation failed: {exc}")


def analyze_image_quality(data: bytes) -> Dict[str, Any]:
    """
    Lightweight image quality analyzer using Pillow and NumPy.
    Calculates resolution, aspect ratio, brightness, contrast, and blur metric.
    """
    img = Image.open(io.BytesIO(data))
    img = ImageOps.exif_transpose(img)
    width, height = img.size

    # Convert to RGB array for luminance and gradient calculations
    rgb = np.array(img.convert("RGB"), dtype=np.float32)

    # Luminance L = 0.299 R + 0.587 G + 0.114 B (normalized to 0..1)
    lum = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]) / 255.0

    mean_brightness = float(np.mean(lum))
    contrast = float(np.std(lum))

    # Lightweight blur detection via gradient magnitude variance
    gy, gx = np.gradient(lum)
    grad_mag = np.sqrt(gx ** 2 + gy ** 2)
    blur_score = float(np.var(grad_mag) * 10000.0)

    aspect_ratio = float(width / height) if height > 0 else 1.0

    flags: List[str] = []
    if width < 100 or height < 100:
        flags.append("too_small")
    if mean_brightness < 0.15:
        flags.append("too_dark")
    if mean_brightness > 0.88:
        flags.append("too_bright")
    if contrast < 0.08:
        flags.append("low_contrast")
    if blur_score < 5.0:
        flags.append("too_blurry")

    # Classify overall quality status
    if len(flags) >= 2 or "too_small" in flags:
        status = "poor"
    elif len(flags) == 1:
        status = "acceptable"
    else:
        status = "good"

    return {
        "status": status,
        "width": width,
        "height": height,
        "aspect_ratio": round(aspect_ratio, 2),
        "brightness": round(mean_brightness, 3),
        "contrast": round(contrast, 3),
        "blur_score": round(blur_score, 2),
        "quality_flags": flags,
    }


def preprocess_image(data: bytes) -> np.ndarray:
    """
    Preprocess raw image bytes for EfficientNetB0 inference:
      1. Open image & auto-rotate based on EXIF.
      2. Convert to RGB mode.
      3. High-quality aspect-preserving resize with padding to 224×224.
      4. Convert to float32 NumPy array in [0, 255] range.
      5. Expand batch dimension -> (1, 224, 224, 3).
    """
    img = Image.open(io.BytesIO(data))
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGB")

    # High-quality resize maintaining aspect ratio with letterboxing/padding
    w, h = img.size
    scale = min(TARGET_SIZE[0] / w, TARGET_SIZE[1] / h)
    nw, nh = int(w * scale), int(h * scale)

    resized = img.resize((nw, nh), Image.LANCZOS)
    padded = Image.new("RGB", TARGET_SIZE, (0, 0, 0))
    padded.paste(resized, ((TARGET_SIZE[0] - nw) // 2, (TARGET_SIZE[1] - nh) // 2))

    arr = np.array(padded, dtype=np.float32)
    return np.expand_dims(arr, axis=0)
