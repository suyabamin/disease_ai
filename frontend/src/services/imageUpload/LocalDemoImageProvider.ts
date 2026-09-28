import { ImageUploadProvider, ImageUploadResult } from './types';

export class LocalDemoImageProvider implements ImageUploadProvider {
  async uploadImage(file: File): Promise<ImageUploadResult> {
    // Validate file format and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid image format. Please select a JPG, PNG, or WebP file.");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit. Please select a smaller photo.");
    }

    // Simulate short network delay
    await new Promise((res) => setTimeout(res, 600));

    const objectUrl = URL.createObjectURL(file);
    return {
      url: objectUrl,
      assetId: 'demo-asset-' + Date.now(),
      provider: 'local_demo'
    };
  }
}
