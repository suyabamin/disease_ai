import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface ScanningAnimationProps {
  imageUrl: string;
}

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ imageUrl }) => {
  const { reducedMotion } = useAccessibility();
  const { language } = useLanguage();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-space-md w-full"
    >
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-black border-2 border-primary-fixed">
        <img
          src={imageUrl}
          alt="এআই দ্বারা বিশ্লেষণরত পাতা"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Laser Scanning Beam (Disabled if reduced motion preference is active) */}
        {!reducedMotion && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-tertiary-fixed to-transparent shadow-[0_0_16px_#95f8a7] animate-bounce"
            style={{ top: '45%' }}
          />
        )}

        {/* Viewfinder HUD Corner Brackets */}
        <div aria-hidden="true" className="absolute inset-4 pointer-events-none flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="w-8 h-8 border-t-4 border-l-4 border-tertiary-fixed rounded-tl-xl shadow-sm" />
            <div className="w-8 h-8 border-t-4 border-r-4 border-tertiary-fixed rounded-tr-xl shadow-sm" />
          </div>
          <div className="flex justify-between">
            <div className="w-8 h-8 border-b-4 border-l-4 border-tertiary-fixed rounded-bl-xl shadow-sm" />
            <div className="w-8 h-8 border-b-4 border-r-4 border-tertiary-fixed rounded-br-xl shadow-sm" />
          </div>
        </div>

        {/* Center Target Pulse */}
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-36 h-36 rounded-full border border-dashed border-tertiary-fixed/80 flex items-center justify-center ${reducedMotion ? '' : 'animate-spin'}`} style={{ animationDuration: '12s' }}>
            <div className="w-3 h-3 rounded-full bg-tertiary-fixed shadow-[0_0_10px_#95f8a7]" />
          </div>
        </div>

        {/* Bottom Scanner Overlay Strip */}
        <div className="absolute bottom-4 inset-x-4 px-4 py-2.5 rounded-xl bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed animate-ping" />
            <span className="font-label-lg text-label-lg font-bold">
              {language === 'bn' ? 'রোগের দাগ ও ধরন বিশ্লেষণ...' : 'Scanning Disease Patterns...'}
            </span>
          </div>
          <span className="font-label-md text-label-md text-tertiary-fixed font-mono font-bold">AI v2.4</span>
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-1">
        <span className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
          <span aria-hidden="true" className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          {language === 'bn' ? 'এআই বিশ্লেষণ চলছে...' : 'AI Analysis in Progress...'}
        </span>
        <span className="font-label-md text-label-md text-on-surface-variant">
          {language === 'bn' ? 'দয়া করে কয়েক সেকেন্ড অপেক্ষা করুন' : 'Please wait a few seconds'}
        </span>
      </div>
    </div>
  );
};
