import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-primary-container text-on-primary-container border-tertiary-fixed',
    error: 'bg-error-container text-on-error-container border-error',
    info: 'bg-surface-container-high text-on-surface border-primary'
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-full border shadow-lg flex items-center gap-2 max-w-[90vw] ${typeStyles[type]}`}
    >
      <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
        {icons[type]}
      </span>
      <span className="font-label-lg text-label-lg font-bold">{message}</span>
    </div>
  );
};
