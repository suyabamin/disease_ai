import { ImageUploadProvider } from './types';
import { CloudinaryImageProvider } from './CloudinaryImageProvider';
import { LocalDemoImageProvider } from './LocalDemoImageProvider';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const getImageUploadProvider = (): ImageUploadProvider => {
  if (cloudName && uploadPreset) {
    return new CloudinaryImageProvider(cloudName, uploadPreset);
  }
  return new LocalDemoImageProvider();
};
