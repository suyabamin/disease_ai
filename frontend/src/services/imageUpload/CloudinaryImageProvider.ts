import { ImageUploadProvider, ImageUploadResult } from './types';

export class CloudinaryImageProvider implements ImageUploadProvider {
  private cloudName: string;
  private uploadPreset: string;

  constructor(cloudName: string, uploadPreset: string) {
    this.cloudName = cloudName;
    this.uploadPreset = uploadPreset;
  }

  async uploadImage(file: File): Promise<ImageUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      throw new Error(`Cloudinary upload failed with status ${res.status}`);
    }

    const data = await res.json();
    return {
      url: data.secure_url || data.url,
      assetId: data.public_id || ('cloudinary-' + Date.now()),
      provider: 'cloudinary'
    };
  }
}
