export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';

export interface CropInfo {
  id: string;
  bnName: string;
  enName: string;
  emoji: string;
}

export interface TopPrediction {
  class_id: number;
  disease: string;
  display_name: string;
  crop: string;
  confidence: number;       // 0–1
  confidence_percent: number;
}

export interface DetectionResult {
  id?: string;
  classId?: number;          // class_id from model
  crop: string;
  cropBn?: string;
  disease: string;
  diseaseBn?: string;
  scientificName?: string;
  confidence: number; // 0 - 100 (percentage)
  riskLevel: RiskLevel;
  isHealthy?: boolean;
  symptoms: string[];
  symptomsBn?: string[];
  immediateActions: string[];
  immediateActionsBn?: string[];
  prevention: string[];
  preventionBn?: string[];
  treatmentGuidance: string[];
  treatmentGuidanceBn?: string[];
  disclaimer?: string;
  imageUrl: string;
  imageProvider?: string;
  imageAssetId?: string;
  demo: boolean;
  modelVersion?: string;
  location?: string;
  createdAt: string; // ISO string or timestamp
  topPredictions?: TopPrediction[];  // Top 3 from real model
  uncertain?: boolean;
  margin?: number;
  quality?: {
    status: string;
    brightness: number;
    contrast: number;
    blur_score: number;
    flags: string[];
  };
}

export interface HistoryFilterOptions {
  query?: string;
  crop?: string;
  riskLevel?: RiskLevel | 'all';
  sortBy?: 'newest' | 'oldest';
}
