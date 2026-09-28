import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Share2, ZoomIn, AlertTriangle, ShieldCheck, Download, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { DetectionResult } from '../types/detection';
import { ConfidenceRing } from '../components/detection/ConfidenceRing';
import { Badge } from '../components/common/Badge';
import { TTSService } from '../services/audio/ttsService';
import { getDetectionRepository } from '../repositories';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/common/Toast';
import { AppLayout } from '../components/layout/AppLayout';
import { generateScanReport } from '../services/report/generateScanReport';

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [result, setResult] = useState<DetectionResult | null>(
    (location.state as { result?: DetectionResult })?.result || null
  );
  const [loading, setLoading] = useState<boolean>(!result);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!result && id) {
      const fetchResult = async () => {
        try {
          const repo = getDetectionRepository();
          const item = await repo.getDetectionById(user?.uid || 'guest', id);
          if (item) {
            setResult(item);
          } else {
            navigate('/history');
          }
        } catch (e) {
          console.error("Failed to load result:", e);
        } finally {
          setLoading(false);
        }
      };
      fetchResult();
    }
  }, [id, result, user, navigate]);

  const toggleAudio = () => {
    if (!result) return;
    if (isSpeaking) {
      TTSService.stop();
      setIsSpeaking(false);
    } else {
      const textToSpeak = language === 'bn'
        ? `${result.cropBn || result.crop} এ ${result.diseaseBn || result.disease} শনাক্ত হয়েছে। ঝুঁকি মাত্রা ${result.riskLevel}। জরুরি করণীয়: ${result.immediateActionsBn?.[0] || result.immediateActions[0]}`
        : `${result.crop} disease identified as ${result.disease}. Risk level ${result.riskLevel}. Immediate action: ${result.immediateActions[0]}`;

      const started = TTSService.speak(textToSpeak, language);
      setIsSpeaking(started);
    }
  };

  const handleShare = () => {
    if (navigator.share && result) {
      navigator.share({
        title: `রুগ্ন-V1: ${result.crop} ${result.disease}`,
        text: `রুগ্ন-V1: ${result.crop} - ${result.disease} (${result.confidence}% confidence)`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage(language === 'bn' ? 'লিংক কপি করা হয়েছে' : 'Link copied to clipboard');
    }
  };

  const handleReport = () => {
    if (!result) return;
    const opened = generateScanReport(result, language);
    setToastMessage(opened
      ? (language === 'bn' ? 'রিপোর্ট প্রিন্ট ডায়ালগে খোলা হয়েছে' : 'Report opened for PDF export')
      : (language === 'bn' ? 'রিপোর্ট খুলতে পপ-আপ অনুমতি দিন' : 'Allow pop-ups to open the report'));
  };

  if (loading || !result) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-label-lg font-bold text-on-surface-variant">
            {language === 'bn' ? 'ফলাফল লোড হচ্ছে...' : 'Loading Result...'}
          </span>
        </div>
      </AppLayout>
    );
  }

  if (result.demo) return <Navigate to="/detect" replace />;

  const symptomsList = (language === 'bn' && result.symptomsBn?.length) ? result.symptomsBn : result.symptoms;
  const actionsList = (language === 'bn' && result.immediateActionsBn?.length) ? result.immediateActionsBn : result.immediateActions;
  const preventionList = (language === 'bn' && result.preventionBn?.length) ? result.preventionBn : result.prevention;
  const treatmentList = (language === 'bn' && result.treatmentGuidanceBn?.length) ? result.treatmentGuidanceBn : result.treatmentGuidance;

  return (
    <AppLayout>
      <div className="flex flex-col w-full gap-space-md pb-12">
        {toastMessage && (
          <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
        )}

        {/* Top Header & Stepper Navigation Bar */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/detect')}
              aria-label="স্ক্যানে ফিরুন (Back to Scan)"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-space-sm py-space-xs rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-label-lg text-label-lg font-bold">
                {language === 'bn' ? 'স্ক্যানে ফিরুন' : 'Back to Scan'}
              </span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md">
              <ShieldCheck size={16} className="text-primary" />
              <span>{result.id ? `আইডি: #${result.id}` : 'রুগ্ন-V1'}</span>
            </div>
          </div>

          {/* 3-Step Process Stepper */}
          <div className="flex items-center justify-between px-space-sm py-2 rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-[16px] text-surface-tint">check_circle</span>
              <span>১. ছবি</span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-[16px] text-surface-tint">check_circle</span>
              <span>২. স্ক্যান</span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold">
              <span className="material-symbols-outlined text-[16px]">biotech</span>
              <span>৩. ফলাফল</span>
            </div>
          </div>
        </div>

        {/* Primary Diagnostic Hero Card */}
        <div className="flex flex-col w-full rounded-2xl bg-surface-container-lowest p-space-md shadow-md border border-outline-variant/40 gap-space-md">
          {/* Crop Identity & Risk Badge */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-md text-label-md self-start">
                <span className="font-bold text-primary">{result.cropBn || result.crop} • {result.crop}</span>
              </div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold mt-1 leading-tight">
                {language === 'bn' ? (result.diseaseBn || result.disease) : result.disease}
              </h1>
              {result.scientificName && (
                <p className="font-body-md text-body-md text-on-surface-variant italic">
                  {result.scientificName}
                </p>
              )}
            </div>

            {/* Redundant Risk Badge (Icon + Text + Color) */}
            <Badge riskLevel={result.riskLevel} />
          </div>

          {/* Animated Confidence Score Gauge */}
          <ConfidenceRing confidence={result.confidence} riskLevel={result.riskLevel} confidenceLevel={result.confidenceLevel} />

          {/* Diagnostic Leaf Image Preview */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-high shadow-inner">
            <img
              src={result.imageUrl}
              alt="আক্রান্ত পাতার নমুনা ছবি"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              aria-label="পাতা জুম করে দেখুন"
              onClick={() => window.open(result.imageUrl, '_blank')}
              className="absolute bottom-3 right-3 min-h-[44px] px-3 py-1.5 rounded-full bg-surface-container-lowest/90 text-on-surface shadow-md hover:bg-surface-container-lowest flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <ZoomIn size={18} className="text-primary" />
              <span className="font-label-md text-label-md font-bold">
                {language === 'bn' ? 'বড় করে দেখুন' : 'Zoom Image'}
              </span>
            </button>
          </div>

          {/* Action Shortcuts Grid (Voice, Report, Share) */}
          <div className="grid grid-cols-3 gap-space-xs pt-1">
            <button
              type="button"
              onClick={toggleAudio}
              aria-label="বাংলায় ভয়েস অডিও শুনুন"
              className={`min-h-[52px] px-2 py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 shadow transition-all active:scale-95 ${
                isSpeaking ? 'bg-secondary text-on-secondary animate-pulse' : 'bg-primary-container text-on-primary hover:bg-primary'
              }`}
            >
              {isSpeaking ? <VolumeX size={22} /> : <Volume2 size={22} />}
              <span className="font-label-md text-label-md font-bold">
                {isSpeaking ? (language === 'bn' ? 'থামুন' : 'Stop') : (language === 'bn' ? 'ভয়েস শুনুন' : 'Listen')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleReport}
              aria-label={language === 'bn' ? 'PDF রিপোর্ট তৈরি করুন' : 'Generate PDF report'}
              className="min-h-[52px] px-2 py-2 rounded-xl bg-surface-container-high text-on-surface flex flex-col items-center justify-center gap-0.5 hover:bg-surface-variant transition-all active:scale-95"
            >
              <Download size={22} className="text-surface-tint" />
              <span className="font-label-md text-label-md font-bold">
                {language === 'bn' ? 'PDF রিপোর্ট' : 'PDF report'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              aria-label="শেয়ার করুন"
              className="min-h-[52px] px-2 py-2 rounded-xl bg-surface-container-high text-on-surface flex flex-col items-center justify-center gap-0.5 hover:bg-surface-variant transition-all active:scale-95"
            >
              <Share2 size={22} className="text-secondary" />
              <span className="font-label-md text-label-md font-bold">
                {language === 'bn' ? 'শেয়ার' : 'Share'}
              </span>
            </button>
          </div>
        </div>

        {result.topPredictions?.length ? (
          <section className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md border border-outline-variant/30 gap-space-xs">
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
              {language === 'bn' ? 'শীর্ষ পূর্বাভাস' : 'Top predictions'}
            </h2>
            {result.topPredictions.map((prediction) => (
              <div key={prediction.class_id} className="flex items-center justify-between gap-3 py-2 border-b border-outline-variant/20 last:border-0">
                <span className="font-body-md text-body-md text-on-surface">{prediction.display_name || prediction.disease}</span>
                <span className="font-label-lg text-label-lg font-bold text-primary">{prediction.confidence_percent}%</span>
              </div>
            ))}
          </section>
        ) : null}

        {result.quality && (
          <section className="flex flex-wrap gap-3 bg-surface-container-low p-space-sm rounded-xl border border-outline-variant/30 font-label-md text-on-surface-variant">
            <span>{language === 'bn' ? 'ছবির মান' : 'Image quality'}: {result.quality.status}</span>
            {result.quality.flags.map((flag) => <span key={flag}>{flag}</span>)}
          </section>
        )}

        {/* Actionable Agricultural Information Sections */}
        {/* 1. Key Symptoms */}
        {symptomsList.length > 0 && <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 gap-space-xs">
          <h2 className="font-title-lg text-title-lg text-on-surface font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">troubleshoot</span>
            {t.symptoms}
          </h2>
          <ul className="flex flex-col gap-2 mt-1">
            {symptomsList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-container-low font-body-md text-body-md text-on-surface">
                <span className="w-5 h-5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>}

        {/* 2. Immediate Actions */}
        {actionsList.length > 0 && <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 gap-space-xs">
          <h2 className="font-title-lg text-title-lg text-error font-bold flex items-center gap-2">
            <AlertTriangle size={22} className="text-error" />
            {t.immediateActions}
          </h2>
          <ul className="flex flex-col gap-2 mt-1">
            {actionsList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-error-container/30 font-body-md text-body-md text-on-surface">
                <span className="w-5 h-5 rounded-full bg-error text-on-error font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>}

        {/* 3. Prevention Guidelines */}
        {preventionList.length > 0 && (
          <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 gap-space-xs">
            <h2 className="font-title-lg text-title-lg text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">shield</span>
              {t.prevention}
            </h2>
            <ul className="flex flex-col gap-2 mt-1">
              {preventionList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-container-low font-body-md text-body-md text-on-surface">
                  <span className="w-5 h-5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 4. Treatment Guidance */}
        {treatmentList.length > 0 && <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 gap-space-xs">
          <h2 className="font-title-lg text-title-lg text-tertiary-container font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary-container text-[24px]">medical_services</span>
            {t.treatmentGuidance}
          </h2>
          <ul className="flex flex-col gap-2 mt-1">
            {treatmentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-container-low font-body-md text-body-md text-on-surface">
                <span className="w-5 h-5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>}

        {/* Secondary Agricultural Disclaimer */}
        <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface-variant font-label-md text-label-md flex items-start gap-2">
          <span className="material-symbols-outlined text-[18px] text-outline shrink-0 mt-0.5">info</span>
          <p>{result.disclaimer || t.disclaimer}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/detect')}
          className="w-full min-h-[52px] px-space-md py-3 rounded-xl bg-primary text-on-primary font-title-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.99] transition-all"
        >
          <RefreshCw size={20} />
          {language === 'bn' ? 'আরেকটি ছবি স্ক্যান করুন' : 'Scan another image'}
        </button>
      </div>
    </AppLayout>
  );
};
