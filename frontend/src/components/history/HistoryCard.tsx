import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { DetectionResult } from '../../types/detection';
import { Badge } from '../common/Badge';
import { useLanguage } from '../../i18n/LanguageContext';

interface HistoryCardProps {
  item: DetectionResult;
  onDelete: (id: string) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ item, onDelete }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const formattedDate = new Date(item.createdAt).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  return (
    <article
      className="flex flex-col bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/40 hover:shadow-md transition-all relative overflow-hidden"
    >
      <div className="flex gap-space-sm items-start cursor-pointer" onClick={() => navigate(`/history/${item.id}`)}>
        {/* Leaf Photo Thumbnail */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container-high shadow-inner">
          <img
            src={item.imageUrl}
            alt={`${item.cropBn || item.crop} - ${item.diseaseBn || item.disease}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <Badge riskLevel={item.riskLevel} />
            <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap flex items-center gap-0.5">
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>

          <h3 className="font-title-lg text-title-lg text-on-surface font-bold truncate mt-0.5">
            {language === 'bn' ? (item.cropBn || item.crop) : item.crop} — {language === 'bn' ? (item.diseaseBn || item.disease) : item.disease}
          </h3>

          <div className="flex items-center justify-between mt-1 text-on-surface-variant font-label-md text-label-md">
            <span className="flex items-center gap-0.5 truncate">
              <MapPin size={14} className="text-primary" />
              {item.location || (language === 'bn' ? 'বাংলাদেশ' : 'Bangladesh')}
            </span>
            <span className="font-bold text-primary">
              {item.confidence}% {language === 'bn' ? 'নিশ্চিত' : 'accuracy'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-space-xs mt-space-xs border-t border-outline-variant/30">
        <button
          type="button"
          onClick={() => navigate(`/history/${item.id}`)}
          className="font-label-lg text-label-lg font-bold text-primary hover:underline flex items-center gap-1 min-h-[44px]"
        >
          <span>{language === 'bn' ? 'বিস্তারিত তথ্য দেখুন' : 'View Details'}</span>
          <ChevronRight size={18} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (item.id) onDelete(item.id);
          }}
          aria-label={`${item.crop} ${item.disease} রেকর্ড মুছে ফেলুন`}
          className="min-h-[44px] px-3 py-1.5 rounded-lg text-error hover:bg-error-container/40 flex items-center gap-1 font-label-md text-label-md font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-error"
        >
          <Trash2 size={16} />
          <span>{language === 'bn' ? 'মুছুন' : 'Delete'}</span>
        </button>
      </div>
    </article>
  );
};
