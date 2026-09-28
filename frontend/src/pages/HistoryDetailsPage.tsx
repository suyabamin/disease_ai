import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Volume2, Share2, ZoomIn, ShieldCheck, AlertTriangle, Download } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getDetectionRepository } from '../repositories';
import { DetectionResult } from '../types/detection';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { ConfidenceRing } from '../components/detection/ConfidenceRing';
import { TTSService } from '../services/audio/ttsService';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';
import { AppLayout } from '../components/layout/AppLayout';
import { generateScanReport } from '../services/report/generateScanReport';

export const HistoryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        const repo = getDetectionRepository();
        const data = await repo.getDetectionById(user?.uid || 'guest', id);
        if (data) {
          setItem(data);
        } else {
          navigate('/history');
        }
      } catch (err) {
        console.error("Failed to load details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, user, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      const repo = getDetectionRepository();
      await repo.deleteDetection(user?.uid || 'guest', id);
      navigate('/history');
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleReport = () => {
    if (!item) return;
    const opened = generateScanReport(item, language);
    setToastMessage(opened
      ? (language === 'bn' ? 'রিপোর্ট প্রিন্ট ডায়ালগে খোলা হয়েছে' : 'Report opened for PDF export')
      : (language === 'bn' ? 'রিপোর্ট খুলতে পপ-আপ অনুমতি দিন' : 'Allow pop-ups to open the report'));
  };

  const toggleAudio = () => {
    if (!item) return;
    if (isSpeaking) {
      TTSService.stop();
      setIsSpeaking(false);
    } else {
      const textToSpeak = language === 'bn'
        ? `${item.cropBn || item.crop} এ ${item.diseaseBn || item.disease}। জরুরি ব্যবস্থা: ${item.immediateActionsBn?.[0] || item.immediateActions[0]}`
        : `${item.crop} ${item.disease}. Action: ${item.immediateActions[0]}`;
      const started = TTSService.speak(textToSpeak, language);
      setIsSpeaking(started);
    }
  };

  if (loading || !item) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-label-lg font-bold text-on-surface-variant">
            {language === 'bn' ? 'তথ্য লোড হচ্ছে...' : 'Loading Details...'}
          </span>
        </div>
      </AppLayout>
    );
  }

  const symptomsList = (language === 'bn' && item.symptomsBn?.length) ? item.symptomsBn : item.symptoms;
  const actionsList = (language === 'bn' && item.immediateActionsBn?.length) ? item.immediateActionsBn : item.immediateActions;
  const treatmentList = (language === 'bn' && item.treatmentGuidanceBn?.length) ? item.treatmentGuidanceBn : item.treatmentGuidance;

  return (
    <AppLayout>
      <div className="flex flex-col w-full gap-space-md pb-12">
        {toastMessage && (
          <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
        )}

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/history')}
            className="min-h-[48px] px-3 flex items-center gap-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-bold"
          >
            <ArrowLeft size={20} className="text-primary" />
            <span>{language === 'bn' ? 'হিস্ট্রি / Back' : 'Back to History'}</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleReport}
              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-bold text-label-md flex items-center gap-1"
            >
              <Download size={18} />
              <span>PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-error-container/40 text-error hover:bg-error-container font-bold text-label-md flex items-center gap-1"
            >
              <Trash2 size={18} />
              <span>{t.delete}</span>
            </button>
          </div>
        </div>

        {/* Record ID & Date Strip */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 font-headline-lg-mobile font-bold text-on-surface">
            <span>{language === 'bn' ? 'শনাক্তকরণ বিবরণ' : 'Detection Record'}</span>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md font-bold">
            <ShieldCheck size={16} className="text-primary" />
            #{item.id}
          </span>
        </div>

        {/* Hero Card */}
        <div className="flex flex-col w-full rounded-2xl bg-surface-container-lowest p-space-md shadow-md border border-outline-variant/40 gap-space-md">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-md text-label-md self-start">
                <span className="font-bold text-primary">{item.cropBn || item.crop}</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
                {language === 'bn' ? (item.diseaseBn || item.disease) : item.disease}
              </h1>
              {item.scientificName && (
                <p className="font-body-md text-body-md text-on-surface-variant italic">
                  {item.scientificName}
                </p>
              )}
            </div>

            <Badge riskLevel={item.riskLevel} />
          </div>

          <ConfidenceRing confidence={item.confidence} riskLevel={item.riskLevel} confidenceLevel={item.confidenceLevel} />

          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-high shadow-inner">
            <img src={item.imageUrl} alt={item.crop} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => window.open(item.imageUrl, '_blank')}
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 text-on-surface shadow flex items-center gap-1 font-bold text-label-md"
            >
              <ZoomIn size={18} className="text-primary" />
              <span>Zoom</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-space-sm pt-1">
            <button
              type="button"
              onClick={toggleAudio}
              className={`min-h-[48px] px-3 py-2 rounded-xl flex items-center justify-center gap-2 font-bold text-label-lg shadow ${
                isSpeaking ? 'bg-secondary text-on-secondary animate-pulse' : 'bg-primary-container text-on-primary'
              }`}
            >
              <Volume2 size={20} />
              <span>{isSpeaking ? 'Stop' : t.listenVoice}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setToastMessage(language === 'bn' ? 'লিংক কপি করা হয়েছে' : 'Link copied');
              }}
              className="min-h-[48px] px-3 py-2 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center gap-2 font-bold text-label-lg"
            >
              <Share2 size={20} className="text-secondary" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Accordions / Information Lists */}
        <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 gap-space-xs">
          <h2 className="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">troubleshoot</span>
            {t.symptoms}
          </h2>
          <ul className="flex flex-col gap-2 mt-1">
            {symptomsList.map((s, idx) => (
              <li key={idx} className="p-2.5 rounded-xl bg-surface-container-low font-body-md text-on-surface flex items-start gap-2">
                <span className="font-bold text-primary">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 gap-space-xs">
          <h2 className="font-title-lg text-title-lg font-bold text-error flex items-center gap-2">
            <AlertTriangle size={20} />
            {t.immediateActions}
          </h2>
          <ul className="flex flex-col gap-2 mt-1">
            {actionsList.map((a, idx) => (
              <li key={idx} className="p-2.5 rounded-xl bg-error-container/30 font-body-md text-on-surface flex items-start gap-2">
                <span className="font-bold text-error">!</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 gap-space-xs">
          <h2 className="font-title-lg text-title-lg font-bold text-tertiary-container flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary-container text-[22px]">medical_services</span>
            {t.treatmentGuidance}
          </h2>
          <ul className="flex flex-col gap-2 mt-1">
            {treatmentList.map((tr, idx) => (
              <li key={idx} className="p-2.5 rounded-xl bg-surface-container-low font-body-md text-on-surface flex items-start gap-2">
                <span className="font-bold text-tertiary-container">{idx + 1}.</span>
                <span>{tr}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={language === 'bn' ? 'রেকর্ড মুছে ফেলবেন?' : 'Delete Record?'}
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                {t.cancel}
              </Button>
              <Button variant="danger" icon={<Trash2 size={18} />} onClick={handleDelete}>
                {t.delete}
              </Button>
            </>
          }
        >
          <p className="font-body-lg text-body-lg text-on-surface">
            {t.deleteConfirm}
          </p>
        </Modal>
      </div>
    </AppLayout>
  );
};
