import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, AlertTriangle, RefreshCw, Volume2, Camera, Sun, Focus, Crop as CropIcon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { DetectionResult } from '../types/detection';
import { TTSService } from '../services/audio/ttsService';
import { AppLayout } from '../components/layout/AppLayout';

export const LowConfidencePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const result = (location.state as { result?: DetectionResult })?.result || {
    confidence: 42.0,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVRDQyQYPMgApb8QGHj_Hi-V96M2TE_x5wPP1TzFSJBCWjOeWlRP4QYM8OGuxooW2x5-dJzPlHlt0WROcui3zCYYGOvdIvAk5qSotV7DLHYC6jr3Vl3aGEGR9SHCzTqGthAYfK0TfTQ42qGvgYfIWvJwXCSZDYYKOSdpuGdhXGDuze2r-tEfSJYcI1R250DgUC-PyqJheL0EC800rjPH0FA0US7Jgyme4jNmQCF4NTjB0nH5ve09Ym'
  };

  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleVoiceAdvice = () => {
    const speechText = language === 'bn'
      ? 'ছবিটি অস্পষ্ট বা আলো কম থাকায় নিশ্চিতভাবে রোগ শনাক্ত করা যায়নি। ভুল কীটনাশক ছিটানো এড়াতে পর্যাপ্ত আলোতে পাতার ফ্রেম সোজা রেখে পুনরায় ছবি তুলুন।'
      : 'Diagnosis inconclusive due to low confidence. Please retake photo in bright natural light with leaf centered.';

    if (isSpeaking) {
      TTSService.stop();
      setIsSpeaking(false);
    } else {
      const ok = TTSService.speak(speechText, language);
      setIsSpeaking(ok);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col w-full gap-space-md pb-12">
        {/* Navigation & Stepper Header */}
        <div className="flex flex-col gap-space-xs bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/detect')}
              className="min-h-[48px] -ml-2 px-space-xs flex items-center gap-1 text-primary hover:text-on-surface rounded-lg transition-colors font-bold"
            >
              <ArrowLeft size={22} />
              <span>{language === 'bn' ? 'স্ক্যানার' : 'Scanner'}</span>
            </button>
            <div className="flex flex-col items-end text-label-md">
              <span className="font-bold text-on-surface">আইডি: #AG-88301</span>
              <span className="text-on-surface-variant">Uncertain Scan</span>
            </div>
          </div>

          {/* Stepper indicator with Warning at Step 3 */}
          <div className="pt-space-xs flex items-center justify-between gap-1">
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-1.5 w-full rounded-full bg-primary" />
              <span className="font-label-md text-label-md text-on-surface font-semibold">১. ছবি</span>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-1.5 w-full rounded-full bg-primary" />
              <span className="font-label-md text-label-md text-on-surface font-semibold">২. স্ক্যান</span>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-1.5 w-full rounded-full bg-secondary-container" />
              <span className="font-label-md text-label-md text-secondary font-bold flex items-center gap-0.5">
                <AlertTriangle size={14} className="text-secondary" />
                ৩. অনিশ্চিত
              </span>
            </div>
          </div>
        </div>

        {/* Hero Alert Banner: Diagnosis Inconclusive */}
        <div className="flex flex-col bg-secondary-fixed/50 p-space-md rounded-2xl shadow-sm border border-secondary/30 gap-space-sm" role="alert">
          <div className="flex items-start gap-space-sm">
            <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
              <HelpCircle size={28} />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-secondary-fixed leading-tight">
                {t.lowConfidenceTitle}
              </h1>
              <p className="font-label-md text-label-md text-on-secondary-fixed-variant mt-0.5 font-medium">
                Diagnosis Inconclusive • AI Confidence Low ({result.confidence}%)
              </p>
            </div>
          </div>

          {/* Gauge & Progress */}
          <div className="bg-surface-container-lowest p-space-sm rounded-xl flex flex-col gap-space-xs mt-1 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-body-bold text-body-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">speed</span>
                {t.confidence}
              </span>
              <span className="font-headline-md text-headline-md font-bold text-secondary">
                {result.confidence}% (Uncertain)
              </span>
            </div>

            <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden flex">
              <div className="bg-secondary-container h-full rounded-full transition-all duration-500" style={{ width: `${result.confidence}%` }} />
            </div>

            <div className="flex justify-between items-center text-outline font-label-md text-label-md">
              <span>০% ঝুঁকিপূর্ণ</span>
              <span>৭০% নিরাপদ সীমা</span>
              <span>১০০% নিশ্চিত</span>
            </div>
          </div>

          {/* Safety Rationale Card */}
          <div className="flex items-start gap-space-sm bg-surface-container-lowest/80 p-space-sm rounded-xl border border-outline-variant/20">
            <AlertTriangle size={20} className="text-secondary shrink-0 mt-0.5" />
            <p className="font-label-md text-label-md text-on-surface leading-snug">
              <strong className="text-secondary font-bold">সতর্কবার্তা:</strong> ভুল কীটনাশক বা ওষুধ প্রয়োগে ধানের ও ফসলের দীর্ঘমেয়াদী ক্ষতি এড়াতে এআই কোনো কাল্পনিক বা অনুমানভিত্তিক রোগের নাম দেখাচ্ছে না।
            </p>
          </div>

          {/* Audio Advice Button */}
          <button
            type="button"
            onClick={handleVoiceAdvice}
            className={`min-h-[48px] w-full px-space-md py-space-xs rounded-full font-body-bold text-body-bold flex items-center justify-center gap-2 shadow transition-all ${
              isSpeaking ? 'bg-secondary-container text-on-secondary-container animate-pulse' : 'bg-secondary text-on-secondary hover:bg-on-secondary-container'
            }`}
          >
            <Volume2 size={22} />
            <span>{t.listenVoice}</span>
          </button>
        </div>

        {/* Breakdown of Analysis Bottlenecks */}
        <div className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-md gap-space-md">
          <div className="flex items-center justify-between">
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold flex items-center gap-2">
              <Camera size={22} className="text-primary" />
              {language === 'bn' ? 'গৃহীত ছবি পর্যালোচনা' : 'Captured Photo Review'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold">
              {language === 'bn' ? 'ত্রুটিপূর্ণ ছবি' : 'Issue Detected'}
            </span>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container">
            <img src={result.imageUrl} alt="অস্পষ্ট ছবি" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-space-sm text-white font-label-md text-label-md">
              {language === 'bn' ? 'অস্পষ্ট / অতিরিক্ত আলো-ছায়ার মিশ্রণ ধরা পড়েছে' : 'Blur or illumination imbalance detected'}
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg font-bold text-on-surface">
              {language === 'bn' ? 'যে কারণে এআই নিশ্চিত হতে পারছে না:' : 'Why AI confidence is low:'}
            </span>

            <div className="flex items-start gap-space-sm p-3 bg-surface-container-low rounded-xl">
              <div className="w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</div>
              <div className="flex flex-col">
                <span className="font-body-bold text-body-bold text-on-surface">অস্পষ্ট দাগ ও ফোকাসের ঘাটতি</span>
                <span className="font-label-md text-label-md text-on-surface-variant">ক্যামেরা নড়ে যাওয়ায় ছত্রাক বা পোকার লক্ষণ পরিষ্কার নয় (Motion blur)।</span>
              </div>
            </div>

            <div className="flex items-start gap-space-sm p-3 bg-surface-container-low rounded-xl">
              <div className="w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✕</div>
              <div className="flex flex-col">
                <span className="font-body-bold text-body-bold text-on-surface">আলোর বৈষম্য ও তীব্র ছায়া</span>
                <span className="font-label-md text-label-md text-on-surface-variant">সরাসরি রোদ বা ছায়ার কারণে পাতার স্বাভাবিক সবুজ বর্ণ বিকৃত হয়েছে।</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Illustrated Guide: How to Retake a Good Photo */}
        <div className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-md gap-space-md">
          <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
            {t.retakeGuideTitle}
          </h2>

          <div className="grid grid-cols-2 gap-space-sm">
            <div className="flex flex-col p-3 rounded-xl bg-surface-container-low gap-1">
              <Sun size={24} className="text-secondary" />
              <span className="font-body-bold text-body-bold text-on-surface">১. পর্যাপ্ত আলো</span>
              <span className="font-label-md text-label-md text-on-surface-variant">দিনের স্বাভাবিক আলোতে রোদ-ছায়া এড়িয়ে ছবি তুলুন।</span>
            </div>

            <div className="flex flex-col p-3 rounded-xl bg-surface-container-low gap-1">
              <Focus size={24} className="text-primary" />
              <span className="font-body-bold text-body-bold text-on-surface">২. পরিষ্কার ফোকাস</span>
              <span className="font-label-md text-label-md text-on-surface-variant">ক্যামেরা স্থির রেখে পাতার দাগের ওপর ট্যাপ করুন।</span>
            </div>

            <div className="flex flex-col p-3 rounded-xl bg-surface-container-low gap-1">
              <CropIcon size={24} className="text-tertiary-container" />
              <span className="font-body-bold text-body-bold text-on-surface">৩. ফ্রেমের মাঝে</span>
              <span className="font-label-md text-label-md text-on-surface-variant">আক্রান্ত পাতাটি ফ্রেমের ঠিক মাঝখানে রাখুন।</span>
            </div>

            <div className="flex flex-col p-3 rounded-xl bg-surface-container-low gap-1">
              <Camera size={24} className="text-primary" />
              <span className="font-body-bold text-body-bold text-on-surface">৪. কাছে আনুন</span>
              <span className="font-label-md text-label-md text-on-surface-variant">পাতার ৫-৮ ইঞ্চি দূর থেকে ক্লোজআপ ছবি নিন।</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/detect')}
            className="w-full min-h-[56px] px-space-md py-3.5 rounded-xl bg-primary text-on-primary font-headline-md font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-primary-container active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-primary-fixed"
          >
            <RefreshCw size={24} />
            <span>{t.retakePhoto}</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
};
