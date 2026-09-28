import { DetectionResult, HistoryFilterOptions } from '../types/detection';

export interface DetectionRepository {
  saveDetection(userId: string, detection: DetectionResult): Promise<string>;
  getDetections(userId: string, filterOptions?: HistoryFilterOptions): Promise<DetectionResult[]>;
  getDetectionById(userId: string, detectionId: string): Promise<DetectionResult | null>;
  deleteDetection(userId: string, detectionId: string): Promise<void>;
}
