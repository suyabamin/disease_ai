import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, AlertTriangle, RefreshCw, Volume2, Camera, Sun, Focus, Crop as CropIcon, Download } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { DetectionResult } from '../types/detection';
import { TTSService } from '../services/audio/ttsService';
import { AppLayout } from '../components/layout/AppLayout';
import { generateScanReport } from '../services/report/generateScanReport';
import { Toast } from '../components/common/Toast';

export const LowConfidencePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const result = (location.state as { result?: DetectionResult })?.result;

  if (!result || result.demo) return <Navigate to="/detect" replace />;

  const handleReport = () => {
    const opened = generateScanReport(result, language);
    setToastMessage(opened
      ? (language === 'bn' ? 'রিপোর্ট প্রিন্ট ডায়ালগে খোলা হয়েছে' : 'Report opened for PDF export')
      : (language === 'bn' ? 'রিপোর্ট খুলতে পপ-আপ অনুমতি দিন' : 'Allow pop-ups to open the report'));
  };

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
        {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />}
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
              <span className="font-bold text-on-surface">su0.1</span>
              <span className="text-on-surface-variant">{result.id ? `#${result.id}` : (language === 'bn' ? 'অনিশ্চিত স্ক্যান' : 'Uncertain scan')}</span>
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
                {language === 'bn' ? 'অনিশ্চিত ফলাফল' : 'Uncertain result'} • {result.confidence}%
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
              <span className="font-headline-md text-headline-md font-bold text-secondary">{result.confidence}%</span>
            </div>

            <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden flex">
              <div className="bg-secondary-container h-full rounded-full transition-all duration-500" style={{ width: `${result.confidence}%` }} />
            </div>

            <div className="flex justify-between items-center text-outline font-label-md text-label-md">
              <span>0%</span>
              {result.confidenceLevel && <span>{result.confidenceLevel}</span>}
              <span>100%</span>
            </div>
          </div>

          {/* Safety Rationale Card */}
          <div className="flex items-start gap-space-sm bg-surface-container-lowest/80 p-space-sm rounded-xl border border-outline-variant/20">
            <AlertTriangle size={20} className="text-secondary shrink-0 mt-0.5" />
            <p className="font-label-md text-label-md text-on-surface leading-snug">
              {result.disclaimer || t.disclaimer}
            </p>
          </div>

          {/* Audio Advice Button */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleVoiceAdvice}
                className={`min-h-[48px] w-full px-space-sm py-space-xs rounded-xl font-body-bold text-body-bold flex items-center justify-center gap-2 shadow transition-all ${
                  isSpeaking ? 'bg-secondary-container text-on-secondary-container animate-pulse' : 'bg-secondary text-on-secondary hover:bg-on-secondary-container'
                }`}
              >
                <Volume2 size={22} />
                <span>{t.listenVoice}</span>
              </button>
              <button type="button" onClick={handleReport} className="min-h-[48px] w-full px-space-sm py-space-xs rounded-xl bg-primary text-on-primary font-body-bold text-body-bold flex items-center justify-center gap-2">
                <Download size={20} />
                <span>{language === 'bn' ? 'PDF রিপোর্ট' : 'PDF report'}</span>
              </button>
            </div>
        </div>

        <section className="flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-md gap-space-sm">
          <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
            {language === 'bn' ? 'স্ক্যান করা ছবি' : 'Scanned image'}
          </h2>
          <img src={result.imageUrl} alt={language === 'bn' ? 'স্ক্যান করা ফসলের পাতা' : 'Scanned crop leaf'} className="w-full max-h-[420px] rounded-xl object-contain bg-surface-container-low" />
        </section>

        {result.topPredictions?.[0] && (
          <section className="flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-md gap-1">
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
              {language === 'bn' ? 'শীর্ষ সম্ভাব্য পূর্বাভাস (অনিশ্চিত)' : 'Top model estimate (uncertain)'}
            </h2>
            <p className="font-body-md text-body-md text-on-surface">{result.topPredictions[0].crop} · {result.topPredictions[0].display_name}</p>
            <p className="font-label-md text-label-md text-on-surface-variant">{result.topPredictions[0].confidence_percent}%</p>
          </section>
        )}

        {result.quality && (
          <section className="flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-md gap-space-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold flex items-center gap-2">
              <Camera size={22} className="text-primary" />
              {language === 'bn' ? 'ছবির মানের তথ্য' : 'Image quality details'}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{result.quality.status}</p>
            {result.quality.flags.length > 0 && (
              <ul className="flex flex-col gap-2">
                {result.quality.flags.map((flag) => <li key={flag} className="font-label-md text-label-md">{flag}</li>)}
              </ul>
            )}
          </section>
        )}

        {/* 4-Step Illustrated Guide: How to Retake a Good Photo */}
        <div className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-md gap-space-md">
          <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
            {t.retakeGuideTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
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
