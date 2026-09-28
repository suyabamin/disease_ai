import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image as ImageIcon, ArrowRight, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { getDetectionRepository } from '../repositories';
import { DetectionResult } from '../types/detection';
import { Badge } from '../components/common/Badge';
import { AppLayout } from '../components/layout/AppLayout';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [recentScans, setRecentScans] = useState<DetectionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const repo = getDetectionRepository();
        const data = await repo.getDetections(user?.uid || 'guest');
        setRecentScans(data.filter((scan) => !scan.demo).slice(0, 3));
      } catch (err) {
        console.error("Failed to load recent scans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, [user]);

  return (
    <AppLayout>
      <div className="flex flex-col w-full gap-space-md">
        {/* 2. Primary Scan / Disease Detection Hero Card */}
        <section
          aria-labelledby="scan-section-heading"
          className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-md border border-outline-variant/40"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-bold">
              {language === 'bn' ? 'এআই প্রযুক্তি • AI Diagnostic' : 'AI Crop Diagnostic'}
            </span>
          </div>

          <h2
            id="scan-section-heading"
            className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface font-bold leading-tight"
          >
            {t.detectDisease}
          </h2>

          <p className="font-body-md text-body-md text-on-surface-variant mt-1 mb-space-md">
            {language === 'bn'
              ? 'পাতার ছবি তুলে বা গ্যালারি থেকে দিয়ে কয়েক সেকেন্ডে নির্ভরযোগ্য রোগ নির্ণয় করুন।'
              : 'Take a photo of a leaf or upload from gallery to get instant disease diagnosis.'}
          </p>

          {/* Large High-Contrast CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm w-full">
            {/* Camera Button */}
            <button
              type="button"
              onClick={() => navigate('/detect')}
              aria-label="ক্যামেরা দিয়ে পাতার ছবি তুলুন"
              className="w-full min-h-[56px] px-space-md py-3.5 rounded-xl bg-primary text-on-primary flex items-center justify-center gap-space-sm shadow-lg hover:bg-primary-container active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-primary-fixed"
            >
              <Camera size={28} />
              <div className="flex flex-col text-left">
                <span className="font-title-lg text-title-lg font-bold leading-none">{t.takePhoto}</span>
                <span className="font-label-md text-label-md text-on-primary-container leading-tight">Take Leaf Photo</span>
              </div>
            </button>

            {/* Upload Button */}
            <button
              type="button"
              onClick={() => navigate('/detect')}
              aria-label="গ্যালারি থেকে পাতার ছবি আপলোড করুন"
              className="w-full min-h-[56px] px-space-md py-3.5 rounded-xl bg-surface-container-high text-primary flex items-center justify-center gap-space-sm hover:bg-surface-container-highest active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-primary-fixed"
            >
              <ImageIcon size={28} className="text-primary" />
              <div className="flex flex-col text-left">
                <span className="font-title-lg text-title-lg font-bold leading-none text-primary">{t.uploadGallery}</span>
                <span className="font-label-md text-label-md text-on-surface-variant leading-tight">Upload from Gallery</span>
              </div>
            </button>
          </div>

          {/* Practical Field Capture Tip */}
          <div className="mt-space-md pt-space-xs flex items-center gap-2 bg-surface-container-low rounded-xl p-3 border border-outline-variant/20">
            <Lightbulb size={20} className="text-secondary shrink-0" />
            <p className="font-label-md text-label-md text-on-surface-variant leading-normal">
              <strong>{language === 'bn' ? 'পরামর্শ:' : 'Tip:'}</strong> {language === 'bn' ? 'আক্রান্ত অংশের স্পষ্ট ও ঝকঝকে ছবি পর্যাপ্ত আলোতে নিন।' : 'Take a clear close-up photo of the infected leaf area in natural daylight.'}
            </p>
          </div>
        </section>

        {/* 3. Recent Detections Timeline Section */}
        <section aria-labelledby="recent-records-heading" className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between px-space-xs">
            <h2 id="recent-records-heading" className="font-headline-md text-headline-md text-on-surface font-bold">
              {t.recentScans}
            </h2>
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="font-label-lg text-label-lg font-bold text-primary hover:underline flex items-center gap-1 min-h-[44px] px-2"
            >
              <span>{t.viewAll}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-on-surface-variant font-label-lg">
              {language === 'bn' ? 'লোড হচ্ছে...' : 'Loading recent scans...'}
            </div>
          ) : recentScans.length > 0 ? (
            <div className="flex flex-col gap-space-sm">
              {recentScans.map((scan) => (
                <article
                  key={scan.id}
                  onClick={() => navigate(`/history/${scan.id}`)}
                  className="flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex gap-space-sm items-start">
                    <img
                      src={scan.imageUrl}
                      alt={scan.crop}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-inner"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <Badge riskLevel={scan.riskLevel} />
                        <span className="font-label-md text-label-md text-on-surface-variant">
                          {new Date(scan.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-title-lg text-title-lg text-on-surface font-bold truncate">
                        {language === 'bn' ? `${scan.cropBn || scan.crop} - ${scan.diseaseBn || scan.disease}` : `${scan.crop} - ${scan.disease}`}
                      </h3>
                      <div className="flex items-center justify-between text-on-surface-variant font-label-md text-label-md mt-1">
                        <span>{new Date(scan.createdAt).toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="font-bold text-primary">{scan.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-space-lg text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col items-center gap-2">
              <span className="text-4xl">🌱</span>
              <span className="font-title-lg font-bold text-on-surface">{t.noHistoryYet}</span>
              <button
                type="button"
                onClick={() => navigate('/detect')}
                className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-label-lg"
              >
                {t.detectDisease}
              </button>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};
