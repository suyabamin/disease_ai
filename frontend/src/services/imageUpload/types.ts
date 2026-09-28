export interface ImageUploadResult {
  url: string;
  assetId: string;
  provider: 'cloudinary' | 'local_demo';
}

export interface ImageUploadProvider {
  uploadImage(file: File): Promise<ImageUploadResult>;
}
