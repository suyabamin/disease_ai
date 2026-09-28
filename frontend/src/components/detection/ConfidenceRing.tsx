import React, { useEffect, useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface ConfidenceRingProps {
  confidence: number; // 0 - 100
  riskLevel: 'high' | 'medium' | 'low' | 'unknown';
  modelVersion?: string;
  confidenceLevel?: string;
}

export const ConfidenceRing: React.FC<ConfidenceRingProps> = ({ confidence, riskLevel, confidenceLevel }) => {
  const [displayVal, setDisplayVal] = useState(0);
  const { reducedMotion } = useAccessibility();
  const { language } = useLanguage();

  useEffect(() => {
    if (reducedMotion) {
      setDisplayVal(confidence);
      return;
    }

    let start = 0;
    const end = Math.min(100, Math.max(0, confidence));
    const duration = 1200; // ms
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayVal(end);
        clearInterval(timer);
      } else {
        setDisplayVal(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [confidence, reducedMotion]);

  const progressColors = {
    high: 'bg-error',
    medium: 'bg-secondary',
    low: 'bg-tertiary-container',
    unknown: 'bg-on-surface-variant'
  };

  const versionLabel = language === 'bn' ? 'মডেল: su0.1' : 'Model: su0.1';
  const levelLabel = confidenceLevel
    ? `${language === 'bn' ? 'আত্মবিশ্বাসের স্তর' : 'Confidence level'}: ${confidenceLevel}`
    : null;

  return (
    <div className="flex flex-col gap-1.5 p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30">
      <div className="flex items-center justify-between font-label-md text-label-md">
        <span className="text-on-surface font-semibold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-primary">psychology</span>
          {language === 'bn' ? 'এআই আত্মবিশ্বাস মাত্রা' : 'Model Confidence'}
        </span>
        <span className="text-primary font-bold text-headline-md">
          {displayVal.toFixed(1)}% {language === 'bn' ? 'নিশ্চিত' : 'Confident'}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(displayVal)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`AI confidence ${displayVal.toFixed(1)} percent`}
        className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden relative shadow-inner"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${progressColors[riskLevel]}`}
          style={{ width: `${displayVal}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 font-label-md text-[11px] text-outline">
        <span>{versionLabel}</span>
        {levelLabel && <span>{levelLabel}</span>}
      </div>
    </div>
  );
};

