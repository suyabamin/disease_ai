/**
 * ApiInferenceProvider
 * --------------------
 * Sends a multipart image to the real FastAPI backend and maps the response
 * to the frontend DetectionResult type.
 *
 * Backend endpoint: POST /api/predict
 * Backend response schema (from backend/schemas/prediction.py):
 *   {
 *     success: boolean,
 *     prediction: SinglePrediction | null,   // null when low_confidence
 *     low_confidence: boolean,
 *     top_predictions: SinglePrediction[],
 *     model: { name, architecture, classes, input_size },
 *     demo: false
 *   }
 *
 * SinglePrediction:
 *   { class_id, disease, display_name, crop, confidence, confidence_percent }
 *
 * NOTE: Never falls back to demo data. If the API is unavailable, throws.
 */
import { InferenceProvider } from './types';
import { DetectionResult } from '../../types/detection';

// Map confidence (0–1) to a risk level label.
// IMPORTANT: confidence ≠ severity. This is a UI-only heuristic label.
function confidenceToRiskLevel(confidence: number): DetectionResult['riskLevel'] {
  if (confidence >= 0.90) return 'high';     // Very confident — flag prominently
  if (confidence >= 0.70) return 'medium';
  if (confidence >= 0.50) return 'low';
  return 'unknown';
}

interface SinglePrediction {
  class_id: number;
  disease: string;         // e.g. "Tomato_Late_Blight"
  display_name: string;    // e.g. "Tomato Late Blight"
  crop: string;            // e.g. "Tomato"
  confidence: number;      // 0–1
  confidence_percent: number;
}

interface ApiResponse {
  success: boolean;
  prediction: SinglePrediction | null;
  uncertain?: boolean;
  low_confidence: boolean;
  confidence_level?: string;
  margin?: number;
  entropy?: number;
  quality?: {
    status: string;
    width: number;
    height: number;
    aspect_ratio: number;
    brightness: number;
    contrast: number;
    blur_score: number;
    quality_flags: string[];
  };
  top_predictions: SinglePrediction[];
  model: {
    name: string;
    architecture: string;
    classes: number;
    input_size: string | number;
  };
  demo: boolean;
}

export class ApiInferenceProvider implements InferenceProvider {
  private baseUrl: string;

  constructor(baseUrl: string) {
    // Strip trailing slash
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async analyzeCropImage(imageData: string | File, _selectedCrop?: string): Promise<DetectionResult> {
    // Build multipart/form-data — backend expects the field named "file"
    const formData = new FormData();
    if (imageData instanceof File) {
      formData.append('file', imageData);
    } else {
      // imageData is a URL (e.g. object URL or remote URL)
      // Fetch the blob and re-upload as a File
      const blob = await fetch(imageData).then((r) => r.blob());
      const ext = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg';
      formData.append('file', blob, `image.${ext}`);
    }

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/api/predict`, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header — browser sets it with boundary
      });
    } catch (networkError: any) {
      // Network-level failure (server down, CORS, no internet)
      throw new Error(
        'AI service unavailable — cannot reach the backend server. ' +
        'Make sure the FastAPI backend is running on ' + this.baseUrl
      );
    }

    // Non-2xx responses
    if (!response.ok) {
      let detail = `HTTP ${response.status}`;
      try {
        const errBody = await response.json();
        detail = errBody?.detail || detail;
        if (typeof detail === 'object') {
          detail = (detail as any).error || JSON.stringify(detail);
        }
      } catch { /* ignore */ }

      if (response.status === 503) {
        throw new Error('AI service unavailable — model is not loaded on the backend.');
      }
      if (response.status === 422) {
        throw new Error(`Image rejected: ${detail}`);
      }
      throw new Error(`AI API error: ${detail}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.success) {
      throw new Error('AI API returned success=false. Check backend logs.');
    }

    // ── Low-confidence / Uncertain path ──────────────────────────────────
    if (data.low_confidence || data.uncertain || !data.prediction) {
      const topName = data.top_predictions?.[0]?.display_name || 'Uncertain';
      const topConf = data.top_predictions?.[0]?.confidence ?? 0;
      const topCrop = data.top_predictions?.[0]?.crop || 'Crop';

      return {
        classId: data.top_predictions?.[0]?.class_id,
        crop: topCrop,
        disease: topName,
        confidence: topConf * 100,  // store as percentage for display
        riskLevel: 'unknown',
        confidenceLevel: data.confidence_level,
        isHealthy: false,
        uncertain: true,
        margin: (data as any).margin ?? 0,
        quality: (data as any).quality ? {
          status: (data as any).quality.status,
          brightness: (data as any).quality.brightness,
          contrast: (data as any).quality.contrast,
          blur_score: (data as any).quality.blur_score,
          flags: (data as any).quality.quality_flags || []
        } : undefined,
        topPredictions: data.top_predictions || [],
        symptoms: [],
        immediateActions: [],
        prevention: [],
        treatmentGuidance: [],
        disclaimer:
          'AI classification result — confidence or image clarity below safety threshold. ' +
          'Please consult a qualified agricultural expert before making treatment decisions.',
        imageUrl: imageData instanceof File ? URL.createObjectURL(imageData) : imageData,
        demo: false,
        modelVersion: `${data.model.name} (${data.model.architecture})`,
        createdAt: new Date().toISOString(),
      };
    }

    // ── Confident path ───────────────────────────────────────────────────
    const pred = data.prediction;
    const confPct = pred.confidence_percent;  // already 0–100

    return {
      classId: pred.class_id,
      crop: pred.crop,
      disease: pred.display_name,   // "Tomato Late Blight"
      confidence: confPct,           // stored as 0–100
      riskLevel: confidenceToRiskLevel(pred.confidence),
      confidenceLevel: data.confidence_level,
      isHealthy: pred.disease.toLowerCase().includes('healthy'),
      uncertain: false,
      margin: (data as any).margin ?? 0,
      quality: (data as any).quality ? {
        status: (data as any).quality.status,
        brightness: (data as any).quality.brightness,
        contrast: (data as any).quality.contrast,
        blur_score: (data as any).quality.blur_score,
        flags: (data as any).quality.quality_flags || []
      } : undefined,
      topPredictions: data.top_predictions || [],
      symptoms: [],
      immediateActions: [],
      prevention: [],
      treatmentGuidance: [],
      disclaimer:
        'AI classification result. Please consult a qualified agricultural expert ' +
        'before making any treatment or pesticide application decisions.',
      imageUrl: imageData instanceof File ? URL.createObjectURL(imageData) : imageData,
      demo: false,
      modelVersion: `${data.model.name} v1.0`,
      createdAt: new Date().toISOString(),
    };
  }
}
