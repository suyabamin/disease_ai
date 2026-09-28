import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AppLayout } from '../components/layout/AppLayout';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout hideHeader hideBottomNav>
      <div className="flex flex-col min-h-[80vh] justify-center max-w-sm mx-auto py-space-md">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-primary font-bold text-label-lg mb-space-md min-h-[44px]"
        >
          <ArrowLeft size={20} />
          <span>{language === 'bn' ? 'ফিরে যান' : 'Back'}</span>
        </button>

        <div className="flex flex-col items-center text-center gap-space-xs mb-space-md">
          <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-lg mb-1">
            <KeyRound size={28} />
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            {t.forgotPassword}
          </h1>
          <p className="font-label-lg text-label-lg text-on-surface-variant">
            {language === 'bn' ? 'আপনার নিবন্ধিত ইমেইল টাইপ করুন' : 'Enter your registered email'}
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center text-center p-space-md bg-tertiary-fixed/30 border border-tertiary-container rounded-2xl gap-3">
            <CheckCircle2 size={40} className="text-tertiary-container animate-bounce" />
            <span className="font-title-lg text-title-lg font-bold text-on-surface">
              {language === 'bn' ? 'পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে!' : 'Reset link has been sent!'}
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {language === 'bn' ? 'আপনার ইনবক্স বা স্প্যাম ফোল্ডার পরীক্ষা করুন।' : 'Check your inbox or spam folder.'}
            </p>
            <Link to="/login" className="w-full">
              <Button fullWidth>{t.login}</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-md border border-outline-variant/30">
            <Input
              label={t.email}
              type="email"
              placeholder="farmer@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" loading={loading} fullWidth>
              {language === 'bn' ? 'পাসওয়ার্ড রিসেট ইমেইল পাঠান' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </div>
    </AppLayout>
  );
};
