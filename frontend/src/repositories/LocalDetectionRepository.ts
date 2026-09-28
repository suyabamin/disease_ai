import { DetectionRepository } from './detectionRepository';
import { DetectionResult, HistoryFilterOptions } from '../types/detection';

const LOCAL_STORAGE_KEY = 'agroai_local_detections';

export class LocalDetectionRepository implements DetectionRepository {
  private getStore(): DetectionResult[] {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    try {
      const stored = JSON.parse(raw) as DetectionResult[];
      const realScans = stored.filter((item) => item.demo === false);
      if (realScans.length !== stored.length) this.saveStore(realScans);
      return realScans;
    } catch {
      return [];
    }
  }

  private saveStore(items: DetectionResult[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }

  async saveDetection(_userId: string, detection: DetectionResult): Promise<string> {
    if (detection.demo) throw new Error('Demo results cannot be saved as scan history.');
    const items = this.getStore();
    const id = detection.id || 'ag-' + Math.floor(10000 + Math.random() * 90000);
    const newItem: DetectionResult = {
      ...detection,
      id
    };
    items.unshift(newItem);
    this.saveStore(items);
    return id;
  }

  async getDetections(_userId: string, options?: HistoryFilterOptions): Promise<DetectionResult[]> {
    let items = this.getStore();

    if (options?.query) {
      const q = options.query.toLowerCase();
      items = items.filter(
        (item) =>
          item.crop.toLowerCase().includes(q) ||
          (item.cropBn && item.cropBn.includes(q)) ||
          item.disease.toLowerCase().includes(q) ||
          (item.diseaseBn && item.diseaseBn.includes(q))
      );
    }

    if (options?.crop && options.crop !== 'all') {
      items = items.filter((item) => item.crop.toLowerCase() === options.crop?.toLowerCase());
    }

    if (options?.riskLevel && options.riskLevel !== 'all') {
      items = items.filter((item) => item.riskLevel === options.riskLevel);
    }

    if (options?.sortBy === 'oldest') {
      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return items;
  }

  async getDetectionById(_userId: string, detectionId: string): Promise<DetectionResult | null> {
    const items = this.getStore();
    return items.find((i) => i.id === detectionId) || null;
  }

  async deleteDetection(_userId: string, detectionId: string): Promise<void> {
    const items = this.getStore();
    const filtered = items.filter((i) => i.id !== detectionId);
    this.saveStore(filtered);
  }
}
