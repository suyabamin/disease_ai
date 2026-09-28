import { collection, doc, setDoc, getDocs, getDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { DetectionRepository } from './detectionRepository';
import { DetectionResult, HistoryFilterOptions } from '../types/detection';

export class FirestoreDetectionRepository implements DetectionRepository {
  async saveDetection(userId: string, detection: DetectionResult): Promise<string> {
    if (!db) throw new Error("Firestore instance not available");
    if (detection.demo) throw new Error('Demo results cannot be saved as scan history.');

    const detRef = doc(collection(db, 'users', userId, 'detections'));
    const id = detection.id || detRef.id;

    const payload = {
      ...detection,
      id,
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', userId, 'detections', id), payload);
    return id;
  }

  async getDetections(userId: string, options?: HistoryFilterOptions): Promise<DetectionResult[]> {
    if (!db) throw new Error("Firestore instance not available");

    const q = query(collection(db, 'users', userId, 'detections'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    let results: DetectionResult[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
      } as DetectionResult;
    });

    results = results.filter((item) => item.demo === false);

    if (options?.query) {
      const searchStr = options.query.toLowerCase();
      results = results.filter(
        (item) =>
          item.crop.toLowerCase().includes(searchStr) ||
          (item.cropBn && item.cropBn.includes(searchStr)) ||
          item.disease.toLowerCase().includes(searchStr) ||
          (item.diseaseBn && item.diseaseBn.includes(searchStr))
      );
    }

    if (options?.crop && options.crop !== 'all') {
      results = results.filter((item) => item.crop.toLowerCase() === options.crop?.toLowerCase());
    }

    if (options?.riskLevel && options.riskLevel !== 'all') {
      results = results.filter((item) => item.riskLevel === options.riskLevel);
    }

    return results;
  }

  async getDetectionById(userId: string, detectionId: string): Promise<DetectionResult | null> {
    if (!db) throw new Error("Firestore instance not available");

    const docRef = doc(db, 'users', userId, 'detections', detectionId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    const data = snap.data();
    if (data.demo !== false) return null;
    return {
      ...data,
      id: snap.id,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
    } as DetectionResult;
  }

  async deleteDetection(userId: string, detectionId: string): Promise<void> {
    if (!db) throw new Error("Firestore instance not available");

    const docRef = doc(db, 'users', userId, 'detections', detectionId);
    await deleteDoc(docRef);
  }
}
