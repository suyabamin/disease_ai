import { DetectionResult } from '../../types/detection';

export interface InferenceProvider {
  analyzeCropImage(
    imageData: string | File,
    selectedCrop?: string
  ): Promise<DetectionResult>;
}
