import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SplashPage } from '../pages/SplashPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { HomePage } from '../pages/HomePage';
import { DetectPage } from '../pages/DetectPage';
import { ResultPage } from '../pages/ResultPage';
import { LowConfidencePage } from '../pages/LowConfidencePage';
import { HistoryPage } from '../pages/HistoryPage';
import { HistoryDetailsPage } from '../pages/HistoryDetailsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  { path: '/', element: <SplashPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    )
  },
  {
    path: '/detect',
    element: (
      <ProtectedRoute>
        <DetectPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/result',
    element: (
      <ProtectedRoute>
        <ResultPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/result/:id',
    element: (
      <ProtectedRoute>
        <ResultPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/low-confidence',
    element: (
      <ProtectedRoute>
        <LowConfidencePage />
      </ProtectedRoute>
    )
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <HistoryPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/history/:id',
    element: (
      <ProtectedRoute>
        <HistoryDetailsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  { path: '*', element: <Navigate to="/home" replace /> }
]);
