import React from 'react';
import { RiskLevel } from '../../types/detection';
import { useLanguage } from '../../i18n/LanguageContext';

interface BadgeProps {
  riskLevel: RiskLevel;
  customText?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ riskLevel, customText, className = '' }) => {
  const { language } = useLanguage();

  const configs: Record<RiskLevel, { bg: string; text: string; icon: string; labelBn: string; labelEn: string }> = {
    high: {
      bg: 'bg-error-container text-on-error-container border border-error/30',
      text: 'text-error',
      icon: 'warning',
      labelBn: 'উচ্চ ঝুঁকি (High Risk)',
      labelEn: 'High Risk'
    },
    medium: {
      bg: 'bg-secondary-fixed text-on-secondary-fixed border border-secondary/30',
      text: 'text-secondary',
      icon: 'report_problem',
      labelBn: 'মাঝারি ঝুঁকি (Medium Risk)',
      labelEn: 'Medium Risk'
    },
    low: {
      bg: 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/30',
      text: 'text-tertiary-container',
      icon: 'verified',
      labelBn: 'কম ঝুঁকি (Low Risk)',
      labelEn: 'Low Risk'
    },
    unknown: {
      bg: 'bg-surface-container-high text-on-surface-variant border border-outline/30',
      text: 'text-on-surface-variant',
      icon: 'help',
      labelBn: 'অনিশ্চিত (Uncertain)',
      labelEn: 'Inconclusive'
    }
  };

  const config = configs[riskLevel] || configs.unknown;
  const displayText = customText || (language === 'bn' ? config.labelBn : config.labelEn);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-label-md font-bold shadow-sm ${config.bg} ${className}`}>
      <span aria-hidden="true" className="material-symbols-outlined text-[16px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
        {config.icon}
      </span>
      <span>{displayText}</span>
    </span>
  );
};
