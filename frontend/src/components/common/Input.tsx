import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  type = 'text',
  id,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="font-body-bold text-body-bold text-on-surface flex items-center gap-1.5">
        {icon && <span aria-hidden="true" className="text-primary">{icon}</span>}
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={inputId}
          type={effectiveType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full min-h-[48px] px-4 py-3 bg-surface-container-lowest border-2 rounded-xl text-on-surface font-body-md text-body-md placeholder-on-surface-variant/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-4 focus:ring-primary-fixed transition-colors ${
            error ? 'border-error text-error' : 'border-outline-variant focus:border-primary'
          } ${isPassword ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
            className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface-variant hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} role="alert" className="font-label-md text-label-md text-error flex items-center gap-1 mt-0.5 font-semibold">
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </span>
      )}
    </div>
  );
};
