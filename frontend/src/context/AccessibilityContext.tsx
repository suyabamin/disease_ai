import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  largeFont: boolean;
  setLargeFont: (val: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('agroai_a11y_motion') === 'true' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('agroai_a11y_contrast') === 'true';
  });

  const [largeFont, setLargeFont] = useState<boolean>(() => {
    return localStorage.getItem('agroai_a11y_font') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('agroai_a11y_motion', String(reducedMotion));
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('agroai_a11y_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('agroai_a11y_font', String(largeFont));
    if (largeFont) {
      document.documentElement.classList.add('text-lg-a11y');
    } else {
      document.documentElement.classList.remove('text-lg-a11y');
    }
  }, [largeFont]);

  return (
    <AccessibilityContext.Provider value={{
      reducedMotion,
      setReducedMotion,
      highContrast,
      setHighContrast,
      largeFont,
      setLargeFont
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
