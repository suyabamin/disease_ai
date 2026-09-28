import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, RefreshCw, Trash2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ViewfinderProps {
  imagePreview: string | null;
  onImageSelected: (file: File) => void;
  onRemoveImage: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  error?: string | null;
}

export const Viewfinder: React.FC<ViewfinderProps> = ({
  imagePreview,
  onImageSelected,
  onRemoveImage,
  onAnalyze,
  isAnalyzing,
  error
}) => {
  const { language } = useLanguage();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-space-md w-full">
      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="camera-capture-input"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        id="gallery-upload-input"
      />

      {/* Main Aspect Square Viewfinder Box */}
      <section
        aria-label="ক্যামেরা স্ক্যান ফ্রেম"
        className="relative w-full aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-xl bg-inverse-surface text-inverse-on-surface flex items-center justify-center border-2 border-outline-variant/30"
      >
        {imagePreview ? (
          /* Selected Image Preview Mode */
          <div className="relative w-full h-full">
            <img
              src={imagePreview}
              alt="আক্রান্ত পাতার নমুনা ছবি"
              className="w-full h-full object-cover"
            />
            {/* HUD Status Overlay */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/90 text-on-primary font-label-md text-label-md backdrop-blur-md shadow-md">
                <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">verified</span>
                {language === 'bn' ? 'পাতা প্রস্তুত • Ready' : 'Leaf Ready'}
              </span>
            </div>

            {/* Corner Viewfinder HUD Brackets */}
            <div aria-hidden="true" className="absolute inset-4 pointer-events-none flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-4 border-l-4 border-tertiary-fixed rounded-tl-xl" />
                <div className="w-8 h-8 border-t-4 border-r-4 border-tertiary-fixed rounded-tr-xl" />
              </div>
              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-4 border-l-4 border-tertiary-fixed rounded-bl-xl" />
                <div className="w-8 h-8 border-b-4 border-r-4 border-tertiary-fixed rounded-br-xl" />
              </div>
            </div>
          </div>
        ) : (
          /* Empty Camera Shutter Placeholder Mode */
          <div className="flex flex-col items-center justify-center p-space-lg text-center gap-space-md relative w-full h-full bg-gradient-to-b from-inverse-surface via-inverse-surface/95 to-black">
            {/* Viewfinder HUD Corner Brackets */}
            <div aria-hidden="true" className="absolute inset-4 pointer-events-none flex flex-col justify-between opacity-80">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-4 border-l-4 border-tertiary-fixed rounded-tl-xl" />
                <div className="w-8 h-8 border-t-4 border-r-4 border-tertiary-fixed rounded-tr-xl" />
              </div>
              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-4 border-l-4 border-tertiary-fixed rounded-bl-xl" />
                <div className="w-8 h-8 border-b-4 border-r-4 border-tertiary-fixed rounded-br-xl" />
              </div>
            </div>

            {/* Shutter Icon Frame */}
            <div className="w-20 h-20 rounded-full bg-primary-fixed/20 border-2 border-dashed border-tertiary-fixed flex items-center justify-center text-tertiary-fixed animate-pulse">
              <Camera size={36} />
            </div>

            <div className="flex flex-col gap-1 max-w-xs">
              <span className="font-headline-md text-headline-md font-bold text-inverse-on-surface">
                {language === 'bn' ? 'আক্রান্ত পাতার ছবি নিন' : 'Capture Diseased Leaf'}
              </span>
              <span className="font-label-md text-label-md text-inverse-on-surface/70">
                {language === 'bn' ? 'পর্যাপ্ত আলোতে সরাসরি ক্যামেরা বা গ্যালারি থেকে সিলেক্ট করুন' : 'Take a photo in good light or select from gallery'}
              </span>
            </div>

            {/* Shutter Trigger Envelope */}
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform ring-4 ring-primary-fixed/40 focus:outline-none"
                aria-label="ক্যামেরা খুলে ছবি তুলুন"
              >
                <Camera size={28} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Validation Error Banner if any */}
      {error && (
        <div role="alert" className="p-space-sm rounded-xl bg-error-container text-on-error-container flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-error">warning</span>
          <span className="font-label-lg text-label-lg font-bold">{error}</span>
        </div>
      )}

      {/* Primary Action Buttons Bar */}
      {imagePreview ? (
        <div className="flex flex-col gap-space-sm w-full">
          <div className="grid grid-cols-2 gap-space-sm w-full">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="min-h-[52px] px-4 py-3 rounded-xl bg-surface-container-high text-on-surface font-title-lg font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <RefreshCw size={20} className="text-primary" />
              <span>{language === 'bn' ? 'পরিবর্তন (Replace)' : 'Replace'}</span>
            </button>
            <button
              type="button"
              onClick={onRemoveImage}
              className="min-h-[52px] px-4 py-3 rounded-xl bg-error-container/50 text-error font-title-lg font-bold flex items-center justify-center gap-2 hover:bg-error-container transition-colors focus:outline-none focus:ring-2 focus:ring-error"
            >
              <Trash2 size={20} />
              <span>{language === 'bn' ? 'মুছে ফেলুন (Remove)' : 'Remove'}</span>
            </button>
          </div>

          {/* Analyze CTA Trigger */}
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full min-h-[48px] min-w-0 px-3 py-2 rounded-xl bg-primary text-on-primary font-title-lg font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-primary-container active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-primary-fixed"
          >
            <Sparkles size={20} className="shrink-0" />
            <span className="min-w-0 text-center">{language === 'bn' ? 'এআই বিশ্লেষণ শুরু করুন (Analyze)' : 'Analyze Leaf with AI'}</span>
          </button>
        </div>
      ) : (
        /* Action buttons to trigger camera or gallery pick */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm w-full">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="w-full min-h-[56px] px-space-md py-3 rounded-xl bg-primary text-on-primary flex items-center justify-center gap-space-sm shadow-md hover:bg-primary-container active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-primary-fixed"
          >
            <Camera size={26} />
            <div className="flex flex-col text-left">
              <span className="font-title-lg text-title-lg font-bold leading-none">{language === 'bn' ? 'ছবি তুলুন' : 'Take Photo'}</span>
              <span className="font-label-md text-label-md text-on-primary-container leading-tight">Use Device Camera</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="w-full min-h-[56px] px-space-md py-3 rounded-xl bg-surface-container-high text-primary flex items-center justify-center gap-space-sm hover:bg-surface-container-highest active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-primary-fixed"
          >
            <ImageIcon size={26} />
            <div className="flex flex-col text-left">
              <span className="font-title-lg text-title-lg font-bold leading-none text-primary">{language === 'bn' ? 'গ্যালারি ফাইল' : 'Gallery Upload'}</span>
              <span className="font-label-md text-label-md text-on-surface-variant leading-tight">Select from Device</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
