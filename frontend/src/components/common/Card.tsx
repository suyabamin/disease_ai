import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, role, tabIndex }) => {
  return (
    <div
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      className={`bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow active:scale-[0.995]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
