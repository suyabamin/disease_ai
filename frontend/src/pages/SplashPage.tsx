import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-surface via-surface-container-low to-surface-container justify-between p-margin relative overflow-hidden select-none">
      {/* Background Decorative Foliage Glow */}
      <div className="absolute top-10 -right-20 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

      {/* Top Brand Pill */}
      <div className="pt-safe flex items-center justify-between z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest shadow-sm border border-outline-variant/40">
          <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container animate-pulse" />
          <span className="font-label-md text-label-md font-bold text-primary">AgroAI v2.4</span>
        </div>
      </div>

      {/* Hero Welcome Content */}
      <div className="flex flex-col items-center text-center my-auto py- space-y-6 z-10 max-w-sm mx-auto">
        {/* Animated Brand Emblem */}
        <div className="relative group cursor-pointer" onClick={handleStart}>
          <div className="w-28 h-28 rounded-3xl bg-primary text-on-primary flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95">
            <Leaf size={56} className="animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg">
            <Sparkles size={20} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-headline-xl text-headline-xl font-bold text-primary tracking-tight">
            {t.appName}
          </h1>
          <p className="font-title-lg text-title-lg text-on-surface-variant font-medium max-w-xs">
            {t.appTagline}
          </p>
        </div>

        {/* Value Prop Chips */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm text-label-md font-semibold text-on-surface">
            <ShieldCheck size={16} className="text-tertiary-container" />
            {language === 'bn' ? '৯৮% পর্যন্ত নির্ভুলতা' : 'Up to 98% Accuracy'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm text-label-md font-semibold text-on-surface">
            <span className="text-base">🌾</span>
            {language === 'bn' ? '৬+ প্রধান ফসল' : '6+ Major Crops'}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pb-safe flex flex-col gap-space-sm z-10 w-full max-w-sm mx-auto">
        <button
          type="button"
          onClick={handleStart}
          className="w-full min-h-[56px] px-space-md py-4 rounded-2xl bg-primary text-on-primary font-headline-md font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-primary-container active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-primary-fixed"
        >
          <span>{user ? (language === 'bn' ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Go to Dashboard') : (language === 'bn' ? 'শুরু করুন' : 'Get Started')}</span>
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};
