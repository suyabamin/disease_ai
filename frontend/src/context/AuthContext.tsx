import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, sendPasswordResetEmail, updateProfile as fbUpdateProfile } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase/config';
import { UserProfile, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loginAsDemoUser: () => void;
}

const DEMO_USER_KEY = 'agroai_demo_user';

const DEFAULT_DEMO_USER: UserProfile = {
  uid: 'demo-farmer-16123',
  displayName: 'রফিকুল ইসলাম (Rafiqul Islam)',
  email: 'rafiqul.farmer@agroai.bd',
  photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvnzK7UjoSeXsT9OOH3XWipjnFQCT3eL7sTTSlkxnzvPpkZ1ODBU9JNwzpIRFm3jzEC8E_lyB1zZUOVYqOejjAyXPW_zGJ-hSlSdsgYXeITvOucE6njsq8X_IgAtfFKFaAwqKy0KAOUGNNhv9mfscHs8WCR5liQCo0dB3oBiftUAfERG_3dqCml-7iz1Qn_KdUjw6oP9N5myxgIgrMrSFwXKkMIAGc4SPR5UU2cBt9fHAzLBstKcvZ',
  preferredLanguage: 'bn',
  isDemoUser: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check saved demo user if Firebase not configured or demo mode explicitly set
    const savedDemo = localStorage.getItem(DEMO_USER_KEY);
    if (savedDemo) {
      try {
        return JSON.parse(savedDemo);
      } catch (e) {
        return DEFAULT_DEMO_USER;
      }
    }
    // Default logged in demo farmer so the app is immediately usable in presentation
    return DEFAULT_DEMO_USER;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isDemoMode = !isFirebaseConfigured || import.meta.env.VITE_DEMO_MODE === 'true';

  useEffect(() => {
    if (isFirebaseConfigured && auth && !isDemoMode) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const savedDemo = localStorage.getItem(DEMO_USER_KEY);
          let extra: Partial<UserProfile> = {};
          if (savedDemo) {
            try { extra = JSON.parse(savedDemo); } catch {}
          }
          setUser({
            uid: fbUser.uid,
            displayName: fbUser.displayName || extra.displayName || fbUser.email?.split('@')[0] || 'কৃষক ভাই',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || extra.photoURL || undefined,
            phone: extra.phone,
            location: extra.location,
            preferredLanguage: 'bn',
            isDemoUser: false
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [isDemoMode]);

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    setError(null);
    const updated: UserProfile = { ...user, ...updates };

    if (isFirebaseConfigured && auth && auth.currentUser && !isDemoMode) {
      try {
        await fbUpdateProfile(auth.currentUser, {
          displayName: updates.displayName ?? user.displayName,
          photoURL: updates.photoURL ?? user.photoURL
        });
      } catch (e: any) {
        console.warn('Firebase profile update warning:', e);
      }
    }

    setUser(updated);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
  };

  const login = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth && !isDemoMode) {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        // Demo mode login logic
        await new Promise((res) => setTimeout(res, 600));
        const demoUser: UserProfile = {
          uid: 'demo-' + Date.now(),
          displayName: email.split('@')[0] || 'কৃষক (Farmer)',
          email: email,
          preferredLanguage: 'bn',
          isDemoUser: true
        };
        setUser(demoUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth && !isDemoMode) {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        setUser({
          uid: res.user.uid,
          displayName: name,
          email: email,
          preferredLanguage: 'bn',
          isDemoUser: false
        });
      } else {
        await new Promise((res) => setTimeout(res, 600));
        const demoUser: UserProfile = {
          uid: 'demo-' + Date.now(),
          displayName: name || 'নতুন কৃষক',
          email: email,
          preferredLanguage: 'bn',
          isDemoUser: true
        };
        setUser(demoUser);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth && !isDemoMode) {
        await fbSignOut(auth);
      }
      setUser(null);
      localStorage.removeItem(DEMO_USER_KEY);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth && !isDemoMode) {
      await sendPasswordResetEmail(auth, email);
    } else {
      await new Promise((res) => setTimeout(res, 500));
    }
  };

  const loginAsDemoUser = () => {
    setUser(DEFAULT_DEMO_USER);
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isDemoMode,
      error,
      login,
      register,
      logout,
      resetPassword,
      updateUserProfile,
      loginAsDemoUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
