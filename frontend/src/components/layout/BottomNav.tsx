import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, History, User } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    { path: '/home', label: t.home, icon: Home },
    { path: '/detect', label: t.detect, icon: Camera, isCenter: true },
    { path: '/history', label: t.history, icon: History },
    { path: '/profile', label: t.profile, icon: User }
  ];

  return (
    <nav
      aria-label="মোবাইল নেভিগেশন (Bottom Navigation)"
      className="fixed bottom-0 inset-x-0 z-50 bg-surface-container-lowest/95 backdrop-blur-lg border-t border-outline-variant/40 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-space-xs">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                aria-label={`${item.label} ${isActive ? '(বর্তমান পৃষ্ঠা)' : ''}`}
                className="relative -top-4 flex flex-col items-center justify-center focus:outline-none group"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-on-primary shadow-lg transition-transform active:scale-95 group-focus:ring-4 group-focus:ring-primary-fixed ${
                  isActive ? 'bg-primary ring-4 ring-primary-fixed' : 'bg-primary hover:bg-primary-container'
                }`}>
                  <Icon size={26} />
                </div>
                <span className={`text-[12px] font-bold mt-0.5 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              aria-label={`${item.label} ${isActive ? '(বর্তমান পৃষ্ঠা)' : ''}`}
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon size={22} className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
              <span className={`text-[12px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
