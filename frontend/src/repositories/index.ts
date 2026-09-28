import { DetectionRepository } from './detectionRepository';
import { FirestoreDetectionRepository } from './FirestoreDetectionRepository';
import { LocalDetectionRepository } from './LocalDetectionRepository';
import { isFirebaseConfigured } from '../services/firebase/config';

export const getDetectionRepository = (): DetectionRepository => {
  if (isFirebaseConfigured && import.meta.env.VITE_DEMO_MODE !== 'true') {
    return new FirestoreDetectionRepository();
  }
  return new LocalDetectionRepository();
};
