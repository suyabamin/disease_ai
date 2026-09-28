import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AppLayout } from '../components/layout/AppLayout';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('rafiqul.farmer@agroai.bd');
  const [password, setPassword] = useState('password123');
  const [formError, setFormError] = useState<string | null>(null);

  const { login, loginAsDemoUser, loading, isDemoMode, error: authError } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError(language === 'bn' ? 'ইমেইল ও পাসওয়ার্ড প্রদান করুন' : 'Please enter email and password');
      return;
    }

    try {
      await login(email, password);
      navigate('/home');
    } catch (err: any) {
      setFormError(err.message || (language === 'bn' ? 'লগইন ব্যর্থ হয়েছে' : 'Login failed'));
    }
  };

  const handleDemoClick = () => {
    loginAsDemoUser();
    navigate('/home');
  };

  return (
    <AppLayout hideHeader hideBottomNav>
      <div className="flex flex-col min-h-[85vh] justify-center max-w-sm mx-auto py-space-md">
        {/* Header Title Banner */}
        <div className="flex flex-col items-center text-center gap-space-xs mb-space-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-3xl shadow-lg mb-2">
            🌾
          </div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-primary">
            {language === 'bn' ? 'অ্যাগ্রোএআই বাংলাদেশ' : 'AgroAI Bangladesh'}
          </h1>
          <p className="font-title-lg text-title-lg text-on-surface-variant font-medium">
            {t.login}
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-md border border-outline-variant/30">
          {/* Demo Mode Notice Badge */}
          {isDemoMode && (
            <div className="p-3 rounded-xl bg-primary-fixed/40 border border-primary/20 text-on-primary-fixed flex items-center justify-between">
              <span className="font-label-md text-label-md font-bold flex items-center gap-1.5">
                <Sparkles size={16} className="text-primary" />
                {t.demoModeNotice}
              </span>
              <button
                type="button"
                onClick={handleDemoClick}
                className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container shadow"
              >
                {language === 'bn' ? '১-ক্লিক ডেমো প্রবেশ' : '1-Click Demo Login'}
              </button>
            </div>
          )}

          {(formError || authError) && (
            <div role="alert" className="p-3 rounded-xl bg-error-container text-on-error-container font-label-lg text-label-lg font-bold flex items-center gap-2">
              <AlertCircle size={20} className="shrink-0" />
              <span>{formError || authError}</span>
            </div>
          )}

          <Input
            label={t.email}
            type="email"
            placeholder="farmer@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label={t.password}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="font-label-lg text-label-lg text-primary font-bold hover:underline min-h-[44px] flex items-center"
            >
              {t.forgotPassword}
            </Link>
          </div>

          <Button type="submit" loading={loading} fullWidth icon={<LogIn size={20} />}>
            {t.login}
          </Button>

          <div className="flex items-center justify-center gap-2 pt-2 border-t border-outline-variant/30">
            <span className="font-label-lg text-label-lg text-on-surface-variant">
              {language === 'bn' ? 'নতুন ব্যবহারকারী?' : 'New User?'}
            </span>
            <Link
              to="/register"
              className="font-label-lg text-label-lg text-primary font-bold hover:underline min-h-[44px] flex items-center"
            >
              {t.createAccount}
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
