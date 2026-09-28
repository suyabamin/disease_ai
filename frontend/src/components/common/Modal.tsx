import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  const { reducedMotion } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`w-full max-w-lg max-h-[calc(100dvh-2rem)] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant flex flex-col overflow-hidden ${
          reducedMotion ? '' : 'animate-in fade-in zoom-in-95 duration-150'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-space-md bg-surface-container-low border-b border-outline-variant/40">
          <h2 id="modal-title" className="font-headline-md text-headline-md font-bold text-on-surface">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন (Close)"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-space-md min-h-0 flex-1 overflow-y-auto max-h-[70vh]">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-space-md bg-surface-container-low border-t border-outline-variant/40 flex items-center justify-end gap-space-sm">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
