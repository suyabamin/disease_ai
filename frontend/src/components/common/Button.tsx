import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-title-lg font-bold rounded-xl transition-all focus:outline-none focus:ring-4 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none min-h-[48px] select-none";

  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-container focus:ring-primary-fixed shadow-md",
    secondary: "bg-surface-container-high text-primary hover:bg-surface-container-highest focus:ring-primary-fixed",
    danger: "bg-error text-on-error hover:bg-error-container focus:ring-error shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary-fixed",
    ghost: "text-on-surface-variant hover:bg-surface-container-high focus:ring-primary"
  };

  const sizes = {
    sm: "px-3 py-2 text-label-lg min-h-[44px]",
    md: "px-4 py-3 text-title-lg min-h-[52px]",
    lg: "px-6 py-4 text-headline-md min-h-[56px]"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span aria-hidden="true" className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span aria-hidden="true" className="mr-2 text-[22px] flex items-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
