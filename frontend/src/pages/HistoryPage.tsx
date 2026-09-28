import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ArrowLeft, Trash2, Calendar } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getDetectionRepository } from '../repositories';
import { DetectionResult, RiskLevel } from '../types/detection';
import { useAuth } from '../context/AuthContext';
import { HistoryCard } from '../components/history/HistoryCard';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';
import { AppLayout } from '../components/layout/AppLayout';

export const HistoryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<DetectionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const repo = getDetectionRepository();
      const data = await repo.getDetections(user?.uid || 'guest', {
        query: searchQuery,
        crop: selectedCropFilter,
        riskLevel: selectedRiskFilter
      });
      setItems(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user, searchQuery, selectedCropFilter, selectedRiskFilter]);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      const repo = getDetectionRepository();
      await repo.deleteDetection(user?.uid || 'guest', deleteTargetId);
      setDeleteTargetId(null);
      setToastMessage(language === 'bn' ? 'রেকর্ডটি মুছে ফেলা হয়েছে' : 'Record deleted');
      fetchHistory();
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  const totalScans = items.length;
  const solvedScans = items.filter(i => i.confidence >= 70 && i.riskLevel !== 'unknown').length;
  const uncertainScans = items.filter(i => i.confidence < 70 || i.riskLevel === 'unknown').length;

  return (
    <AppLayout>
      <div className="flex flex-col w-full pb-12 gap-space-md">
        {toastMessage && (
          <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
        )}

        {/* Top Header & Export PDF Button */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                onClick={() => navigate('/home')}
                aria-label="ফিরে যান"
                className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <ArrowLeft size={22} />
              </button>
              <div className="flex flex-col">
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold tracking-tight">
                  {language === 'bn' ? 'রোগ নির্ণয়ের ইতিহাস' : 'Diagnostic History'}
                </h1>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  Scan History & Diagnostic Logs
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setToastMessage(language === 'bn' ? 'পিডিএফ রিপোর্ট তৈরি হচ্ছে...' : 'Exporting PDF report...')}
              aria-label="রিপোর্ট ডাউনলোড • Export PDF"
              className="min-h-[48px] px-3 flex items-center gap-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors text-primary font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <Download size={18} />
              <span>PDF</span>
            </button>
          </div>

          {/* Quick Aggregate Stats Summary Grid */}
          <div className="grid grid-cols-3 gap-space-xs mt-1">
            <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-sm">
              <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">analytics</span>
                {t.totalScans}
              </span>
              <span className="font-headline-md text-headline-md text-primary font-bold mt-0.5">
                {totalScans}<span className="font-label-md text-label-md font-normal text-on-surface-variant ml-0.5">{language === 'bn' ? 'টি' : ''}</span>
              </span>
            </div>

            <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-sm">
              <span className="font-label-md text-label-md text-tertiary-container flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-tertiary-container">verified</span>
                {t.solvedScans}
              </span>
              <span className="font-headline-md text-headline-md text-primary-container font-bold mt-0.5">
                {solvedScans}<span className="font-label-md text-label-md font-normal text-on-surface-variant ml-0.5">{language === 'bn' ? 'টি' : ''}</span>
              </span>
            </div>

            <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-sm">
              <span className="font-label-md text-label-md text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">help_center</span>
                {t.uncertainScans}
              </span>
              <span className="font-headline-md text-headline-md text-secondary font-bold mt-0.5">
                {uncertainScans}<span className="font-label-md text-label-md font-normal text-on-surface-variant ml-0.5">{language === 'bn' ? 'টি' : ''}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col gap-space-sm">
          {/* Accessible Search Input */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
              <Search size={20} />
            </div>
            <input
              type="search"
              id="disease-search"
              aria-label="রোগ বা ফসলের নাম দিয়ে খুঁজুন"
              placeholder={language === 'bn' ? 'রোগ বা ফসলের নাম দিয়ে খুঁজুন...' : 'Search by crop or disease name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[48px] pl-11 pr-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-on-surface font-body-md text-body-md placeholder-on-surface-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          {/* Quick Filter Chips Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none" role="toolbar" aria-label="ফিল্টার তালিকা">
            <button
              type="button"
              onClick={() => { setSelectedCropFilter('all'); setSelectedRiskFilter('all'); }}
              className={`min-h-[44px] px-4 rounded-full font-label-md text-label-md whitespace-nowrap shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 ${
                selectedCropFilter === 'all' && selectedRiskFilter === 'all' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span>{language === 'bn' ? 'সকল (All)' : 'All'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCropFilter('tomato')}
              className={`min-h-[44px] px-3.5 rounded-full font-label-md text-label-md whitespace-nowrap flex items-center gap-1 focus:outline-none focus:ring-2 ${
                selectedCropFilter === 'tomato' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span>🍅 {language === 'bn' ? 'টমেটো' : 'Tomato'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCropFilter('rice')}
              className={`min-h-[44px] px-3.5 rounded-full font-label-md text-label-md whitespace-nowrap flex items-center gap-1 focus:outline-none focus:ring-2 ${
                selectedCropFilter === 'rice' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span>🌾 {language === 'bn' ? 'ধান' : 'Rice'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCropFilter('potato')}
              className={`min-h-[44px] px-3.5 rounded-full font-label-md text-label-md whitespace-nowrap flex items-center gap-1 focus:outline-none focus:ring-2 ${
                selectedCropFilter === 'potato' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span>🥔 {language === 'bn' ? 'আলু' : 'Potato'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRiskFilter('high')}
              className={`min-h-[44px] px-3.5 rounded-full font-label-md text-label-md whitespace-nowrap flex items-center gap-1 focus:outline-none focus:ring-2 ${
                selectedRiskFilter === 'high' ? 'bg-error text-on-error font-bold' : 'bg-surface-container text-error hover:bg-error-container/40'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span>{t.highRisk}</span>
            </button>
          </div>
        </div>

        {/* History Item Timeline */}
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant font-label-lg font-bold">
            {language === 'bn' ? 'হিস্ট্রি লোড হচ্ছে...' : 'Loading history logs...'}
          </div>
        ) : items.length > 0 ? (
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-2 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <h2 className="font-title-lg text-title-lg text-on-surface font-bold flex items-center gap-1">
                <Calendar size={18} className="text-primary" />
                {language === 'bn' ? 'স্ক্যান রেকর্ডসমূহ' : 'Scan Logs'}
              </h2>
            </div>

            {items.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onDelete={(id) => setDeleteTargetId(id)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-space-xl text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col items-center gap-3 my-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-4xl mb-1">
              🌱
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              {t.noHistoryYet}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
              {language === 'bn' ? 'আপনার ফসলের পাতা প্রথমবার স্ক্যান করতে নিচের বাটনে চাপ দিন।' : 'Tap below to scan your crop leaf for the first time.'}
            </p>
            <Button onClick={() => navigate('/detect')} className="mt-2">
              {t.detectDisease}
            </Button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={Boolean(deleteTargetId)}
          onClose={() => setDeleteTargetId(null)}
          title={language === 'bn' ? 'রেকর্ড মুছে ফেলার নিশ্চিতকরণ' : 'Confirm Deletion'}
          footer={
            <>
              <Button variant="ghost" onClick={() => setDeleteTargetId(null)}>
                {t.cancel}
              </Button>
              <Button variant="danger" icon={<Trash2 size={18} />} onClick={handleDeleteConfirm}>
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
