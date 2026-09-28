import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Viewfinder } from '../components/detection/Viewfinder';
import { ScanningAnimation } from '../components/detection/ScanningAnimation';
import { getInferenceProvider } from '../services/inference';
import { getImageUploadProvider } from '../services/imageUpload';
import { getDetectionRepository } from '../repositories';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';

export const DetectPage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageSelected = (file: File) => {
    setError(null);

    // Validate format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError(language === 'bn' ? 'সঠিক ছবি ফরম্যাট দিন (JPG, PNG বা WebP)' : 'Invalid format. Use JPG, PNG or WebP.');
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(language === 'bn' ? 'ছবির আকার ১০ মেগাবাইটের কম হতে হবে' : 'Photo size must be less than 10MB.');
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };


  const handleAnalyze = async () => {
    if (!imageFile && !imagePreview) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // 1. Image upload (for history storage URL) — optional, Cloudinary or local
      const uploadProvider = getImageUploadProvider();
      let uploadedUrl = imagePreview!;
      let assetId = 'local-' + Date.now();

      if (imageFile) {
        try {
          const uploadRes = await uploadProvider.uploadImage(imageFile);
          uploadedUrl = uploadRes.url;
          assetId = uploadRes.assetId;
        } catch (_uploadErr) {
          // Image hosting not configured — use local preview URL for display
          // Prediction still proceeds normally
          uploadedUrl = imagePreview!;
        }
      }

      // 2. AI Inference — pass File directly for multipart upload to real backend
      //    Falls back to URL if no File is available
      const inferenceProvider = getInferenceProvider();
      const inferenceInput: File | string = imageFile || uploadedUrl;
      const result = await inferenceProvider.analyzeCropImage(inferenceInput);

      if (result.demo) {
        throw new Error(language === 'bn'
          ? 'প্রকৃত এআই সার্ভার সংযুক্ত নয়। ডেমো ফলাফল সংরক্ষণ করা হয়নি।'
          : 'The real AI service is not connected. Demo results are not saved.');
      }

      // 3. Attach the stored image URL to the result for display & history
      result.imageUrl = uploadedUrl;
      result.imageAssetId = assetId;

      // 4. Save to Firestore history
      const repo = getDetectionRepository();
      const savedId = await repo.saveDetection(user?.uid || 'guest', result);
      result.id = savedId;

      // 5. Navigate based on confidence / risk
      if (result.confidence < 50 || result.riskLevel === 'unknown') {
        navigate('/low-confidence', { state: { result } });
      } else {
        navigate(`/result/${savedId}`, { state: { result } });
      }
    } catch (err: any) {
      console.error('Analysis failure:', err);
      const msg: string = err.message || '';
      // Show specific messages for known failure modes
      if (msg.includes('unavailable') || msg.includes('cannot reach')) {
        setError(
          language === 'bn'
            ? 'AI সার্ভিস অনুপলব্ধ। ব্যাকএন্ড সার্ভার চালু আছে কিনা নিশ্চিত করুন।'
            : 'AI service unavailable. Ensure the backend server is running.'
        );
      } else if (msg.includes('rejected') || msg.includes('Image rejected')) {
        setError(
          language === 'bn'
            ? 'ছবিটি গ্রহণযোগ্য নয়। JPG, PNG বা WebP ফরম্যাট দিন।'
            : msg
        );
      } else {
        setError(
          language === 'bn'
            ? 'বিশ্লেষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
            : 'Analysis failed. Please try again.'
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  };


  return (
    <AppLayout>
      <div className="flex flex-col w-full pb-8 gap-space-md">
        {/* Navigation Bar Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/home')}
            aria-label="ড্যাশবোর্ডে ফিরে যান (Back to Dashboard)"
            className="min-h-[48px] px-3 py-2 -ml-2 rounded-xl flex items-center gap-1.5 text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ArrowLeft size={22} className="text-primary" />
            <span className="font-label-lg text-label-lg font-bold">
              {language === 'bn' ? 'ড্যাশবোর্ড / Back' : 'Back to Dashboard'}
            </span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md">
            <Brain size={16} className="text-primary" />
            <span>su0.1</span>
          </div>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-tight font-bold">
            {language === 'bn' ? 'ফসলের পাতা স্ক্যান করুন' : 'Scan Crop Leaf'}
          </h1>
          <p className="font-label-md text-label-md text-on-surface-variant mt-0.5">
            Crop Leaf Disease Detection • {language === 'bn' ? 'নির্ভুল রোগ নির্ণয় ও প্রতিকার' : 'Accurate Diagnosis & Treatment'}
          </p>
        </div>

        {/* 3-Step Accessible Visual Stepper */}
        <nav aria-label="রোগ নির্ণয় ধাপসমূহ" className="bg-surface-container-lowest p-3.5 rounded-2xl shadow-sm border border-outline-variant/30">
          <ol className="flex items-center justify-between w-full">
            {/* Step 1 */}
            <li className="flex min-w-0 items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md font-bold shadow-sm ${
                imagePreview ? 'bg-primary text-on-primary' : 'bg-primary-container text-on-primary ring-2 ring-primary-fixed'
              }`}>
                {imagePreview ? <Check size={18} /> : '১'}
              </div>
              <div className="flex flex-col min-w-0 pr-1">
                <span className="font-label-md text-label-md text-primary font-bold truncate">১. ছবি গ্রহণ</span>
                <span className="text-[11px] leading-tight text-on-surface-variant truncate">Capture</span>
              </div>
            </li>

            <div aria-hidden="true" className="w-6 h-0.5 bg-primary mr-2" />

            {/* Step 2 */}
            <li className={`flex min-w-0 items-center gap-2 flex-1 ${isAnalyzing ? 'opacity-100' : 'opacity-70'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md font-bold ${
                isAnalyzing ? 'bg-primary text-on-primary animate-pulse' : 'bg-surface-container text-on-surface-variant'
              }`}>
                ২
              </div>
              <div className="flex flex-col min-w-0 pr-1">
                <span className="font-label-md text-label-md text-primary font-bold truncate">২. এআই স্ক্যান</span>
                <span className="text-[11px] leading-tight text-on-surface-variant truncate">AI Scan</span>
              </div>
            </li>

            <div aria-hidden="true" className="w-6 h-0.5 bg-surface-container-high mr-2" />

            {/* Step 3 */}
            <li className="flex min-w-0 items-center gap-2 opacity-50 flex-1">
              <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-label-md text-label-md font-semibold">
                ৩
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface-variant truncate">৩. ফলাফল</span>
                <span className="text-[11px] leading-tight text-on-surface-variant truncate">Result</span>
              </div>
            </li>
          </ol>
        </nav>

        {isAnalyzing && imagePreview ? (
          /* Scanning Screen State */
          <ScanningAnimation imageUrl={imagePreview} />
        ) : (
          /* Viewfinder State */
          <Viewfinder
            imagePreview={imagePreview}
            onImageSelected={handleImageSelected}
            onRemoveImage={handleRemoveImage}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            error={error}
          />
        )}
      </div>
    </AppLayout>
  );
};
