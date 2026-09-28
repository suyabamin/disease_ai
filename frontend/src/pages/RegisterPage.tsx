import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AppLayout } from '../components/layout/AppLayout';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { register, loading, error: authError } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError(language === 'bn' ? 'সকল ঘর সঠিকভাবে পূরণ করুন' : 'Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setFormError(language === 'bn' ? 'পাসওয়ার্ড মেলেনি' : 'Passwords do not match');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/home');
    } catch (err: any) {
      setFormError(err.message || (language === 'bn' ? 'নিবন্ধন ব্যর্থ হয়েছে' : 'Registration failed'));
    }
  };

  return (
    <AppLayout hideHeader hideBottomNav>
      <div className="flex flex-col min-h-[85vh] justify-center max-w-sm mx-auto py-space-md">
        <div className="flex flex-col items-center text-center gap-space-xs mb-space-md">
          <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-2xl shadow-lg mb-1">
            🌾
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            {t.createAccount}
          </h1>
          <p className="font-label-lg text-label-lg text-on-surface-variant">
            {language === 'bn' ? 'সহজে ডিজিটাল কৃষি সেবায় যুক্ত হোন' : 'Join AgroAI Bangladesh'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-md border border-outline-variant/30">
          {(formError || authError) && (
            <div role="alert" className="p-3 rounded-xl bg-error-container text-on-error-container font-label-lg text-label-lg font-bold flex items-center gap-2">
              <AlertCircle size={20} className="shrink-0" />
              <span>{formError || authError}</span>
            </div>
          )}

          <Input
            label={t.name}
            type="text"
            placeholder="রফিকুল ইসলাম"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <Input
            label={t.confirmPassword}
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} fullWidth icon={<UserPlus size={20} />}>
            {t.register}
          </Button>

          <div className="flex items-center justify-center gap-2 pt-2 border-t border-outline-variant/30">
            <span className="font-label-lg text-label-lg text-on-surface-variant">
              {language === 'bn' ? 'পূর্বেই অ্যাকাউন্ট আছে?' : 'Already have an account?'}
            </span>
            <Link
              to="/login"
              className="font-label-lg text-label-lg text-primary font-bold hover:underline min-h-[44px] flex items-center"
            >
              {t.login}
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
