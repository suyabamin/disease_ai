import React from 'react';
import { CropInfo } from '../../types/detection';
import { useLanguage } from '../../i18n/LanguageContext';

export const CROPS_LIST: CropInfo[] = [
  { id: 'tomato', bnName: 'টমেটো', enName: 'Tomato', emoji: '🍅' },
  { id: 'rice', bnName: 'ধান', enName: 'Rice', emoji: '🌾' },
  { id: 'potato', bnName: 'আলু', enName: 'Potato', emoji: '🥔' },
  { id: 'eggplant', bnName: 'বেগুন', enName: 'Eggplant', emoji: '🍆' },
  { id: 'chilli', bnName: 'মরিচ', enName: 'Chilli', emoji: '🌶' },
  { id: 'maize', bnName: 'ভুট্টা', enName: 'Maize', emoji: '🌽' },
  { id: 'others', bnName: 'অন্যান্য', enName: 'Others', emoji: '🌱' }
];

interface CropSelectorProps {
  selectedCrop: string;
  onSelectCrop: (cropId: string) => void;
}

export const CropSelector: React.FC<CropSelectorProps> = ({ selectedCrop, onSelectCrop }) => {
  const { language } = useLanguage();

  return (
    <section aria-label="ফসল নির্বাচন" className="flex flex-col gap-space-xs">
      <div className="flex items-center justify-between mb-1">
        <label className="font-body-bold text-body-bold text-on-surface flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[20px] text-primary">eco</span>
          {language === 'bn' ? 'ফসল নির্বাচন করুন' : 'Select Crop'}
        </label>
        <span className="font-label-md text-label-md text-primary font-bold">
          {CROPS_LIST.find(c => c.id === selectedCrop)?.bnName || 'টমেটো'} নির্বাচিত
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="radiogroup">
        {CROPS_LIST.map((c) => {
          const isSelected = selectedCrop === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectCrop(c.id)}
              className={`min-h-[48px] px-3.5 py-2 rounded-full flex items-center gap-2 shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                isSelected
                  ? 'bg-primary-container text-on-primary shadow-sm font-bold ring-2 ring-primary-fixed'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high shadow-sm'
              }`}
            >
              <span aria-hidden="true" className="text-[20px]">{c.emoji}</span>
              <span className="font-label-lg text-label-lg">
                {language === 'bn' ? `${c.bnName} (${c.enName})` : c.enName}
              </span>
              {isSelected && (
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
