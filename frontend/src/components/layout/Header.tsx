import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-24 px-margin flex flex-col justify-center gap-space-xs max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => navigate('/home')}>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
              🌾
            </div>
            <div className="flex flex-col">
              <span className="font-label-lg text-label-lg text-primary leading-tight font-bold">
                AgroAI
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant font-medium leading-none">
                {language === 'bn' ? 'বাংলাদেশ ড্যাশবোর্ড' : 'Bangladesh Portal'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            {/* Language Toggle Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তিত করুন'}
              className="min-h-[44px] min-w-[44px] px-space-sm py-space-xs flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <span className={`font-label-md text-label-md font-bold ${language === 'bn' ? 'text-primary' : 'text-on-surface-variant'}`}>
                বাং
              </span>
              <span className="font-label-md text-label-md mx-0.5 text-outline">|</span>
              <span className={`font-label-md text-label-md ${language === 'en' ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'}`}>
                EN
              </span>
            </button>

            {/* Profile Avatar Button */}
            <button
              type="button"
              onClick={() => navigate('/profile')}
              aria-label="User Profile"
              className="min-h-[44px] min-w-[44px] p-0.5 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img
                alt="Profile"
                src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAvnzK7UjoSeXsT9OOH3XWipjnFQCT3eL7sTTSlkxnzvPpkZ1ODBU9JNwzpIRFm3jzEC8E_lyB1zZUOVYqOejjAyXPW_zGJ-hSlSdsgYXeITvOucE6njsq8X_IgAtfFKFaAwqKy0KAOUGNNhv9mfscHs8WCR5liQCo0dB3oBiftUAfERG_3dqCml-7iz1Qn_KdUjw6oP9N5myxgIgrMrSFwXKkMIAGc4SPR5UU2cBt9fHAzLBstKcvZ"}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              />
            </button>
          </div>
        </div>

        {/* Live Connectivity Indicator Bar */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md">
            <span aria-hidden="true" className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
            <span className="font-semibold">অনলাইন • Online</span>
          </div>
          <div className="text-outline text-label-md font-label-md flex items-center gap-1">
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">network_wifi</span>
            <span>4G High</span>
          </div>
        </div>
      </div>
    </header>
  );
};
