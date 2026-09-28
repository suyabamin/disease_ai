import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { LanguageProvider } from '../i18n/LanguageContext';
import { AccessibilityProvider } from '../context/AccessibilityContext';
import { AuthProvider } from '../context/AuthContext';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
};
