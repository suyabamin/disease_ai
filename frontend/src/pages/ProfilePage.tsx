import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Globe, Eye, Zap, Sparkles, UserCheck, ShieldCheck, Edit3, Camera, MapPin, Phone as PhoneIcon, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { isFirebaseConfigured } from '../services/firebase/config';
import { getImageUploadProvider } from '../services/imageUpload';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Toast } from '../components/common/Toast';
import { AppLayout } from '../components/layout/AppLayout';

export const ProfilePage: React.FC = () => {
  const { user, logout, isDemoMode, updateUserProfile } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { reducedMotion, setReducedMotion, highContrast, setHighContrast, largeFont, setLargeFont } = useAccessibility();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(user?.displayName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(user?.photoURL || null);

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleOpenEditModal = () => {
    setEditName(user?.displayName || '');
    setEditPhone(user?.phone || '');
    setEditLocation(user?.location || '');
    setEditPhotoFile(null);
    setEditPhotoPreview(user?.photoURL || null);
    setShowEditModal(true);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToastMessage({
        text: language === 'bn' ? 'সঠিক ছবি ফাইল নির্বাচন করুন (JPG, PNG, WebP)' : 'Please select a valid image file.',
        type: 'error'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setToastMessage({
        text: language === 'bn' ? 'ছবি ১০ মেগাবাইটের কম হতে হবে' : 'Image size must be under 10MB.',
        type: 'error'
      });
      return;
    }

    setEditPhotoFile(file);
    setEditPhotoPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let photoURL = user?.photoURL;

      if (editPhotoFile) {
        try {
          const uploadProvider = getImageUploadProvider();
          const uploadRes = await uploadProvider.uploadImage(editPhotoFile);
          photoURL = uploadRes.url;
        } catch (_uploadErr) {
          // Fallback to blob URL if upload provider fails in local demo
          photoURL = editPhotoPreview || photoURL;
        }
      }

      await updateUserProfile({
        displayName: editName.trim() || user?.displayName || 'কৃষক ভাই',
        phone: editPhone.trim(),
        location: editLocation.trim(),
        photoURL
      });

      setToastMessage({
        text: language === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' : 'Profile updated successfully!',
        type: 'success'
      });
      setShowEditModal(false);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setToastMessage({
        text: language === 'bn' ? 'প্রোফাইল আপডেটে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to update profile. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuAvnzK7UjoSeXsT9OOH3XWipjnFQCT3eL7sTTSlkxnzvPpkZ1ODBU9JNwzpIRFm3jzEC8E_lyB1zZUOVYqOejjAyXPW_zGJ-hSlSdsgYXeITvOucE6njsq8X_IgAtfFKFaAwqKy0KAOUGNNhv9mfscHs8WCR5liQCo0dB3oBiftUAfERG_3dqCml-7iz1Qn_KdUjw6oP9N5myxgIgrMrSFwXKkMIAGc4SPR5UU2cBt9fHAzLBstKcvZ";

  return (
    <AppLayout>
      <div className="flex flex-col w-full pb-12 gap-space-md">
        {toastMessage && (
          <Toast message={toastMessage.text} type={toastMessage.type} onClose={() => setToastMessage(null)} />
        )}

        {/* User Profile Card */}
        <div className="flex items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-md border border-outline-variant/40 flex-wrap">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="relative shrink-0">
              <img
                src={user?.photoURL || defaultAvatar}
                alt={user?.displayName || "Profile Avatar"}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <h1 className="font-headline-md text-headline-md font-bold text-on-surface break-words">
                {user?.displayName || (language === 'bn' ? 'রফিকুল ইসলাম' : 'Rafiqul Islam')}
              </h1>
              <p className="font-label-md text-label-md text-on-surface-variant break-words">
                {user?.email || 'rafiqul.farmer@agroai.bd'}
              </p>

              {user?.phone && (
                <p className="font-label-md text-[13px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <PhoneIcon size={14} className="text-primary" />
                  <span>{user.phone}</span>
                </p>
              )}

              {user?.location && (
                <p className="font-label-md text-[13px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <MapPin size={14} className="text-primary" />
                  <span>{user.location}</span>
                </p>
              )}

              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-[12px] font-bold self-start">
                <UserCheck size={14} />
                <span>{language === 'bn' ? 'অনুমোদিত কৃষক' : 'Verified Farmer'}</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<Edit3 size={16} />}
            onClick={handleOpenEditModal}

          >
            {language === 'bn' ? 'সম্পাদন করুন' : 'Edit Profile'}
          </Button>
        </div>

        {/* System & Mode Status Card */}
        <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 gap-space-xs">
          <h2 className="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary" />
            {language === 'bn' ? 'সিস্টেম ও কনফিগারেশন' : 'System & Integration'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs mt-1">
            <div className="p-3 rounded-xl bg-surface-container-low flex flex-wrap items-center justify-between gap-2">
              <span className="font-label-md text-label-md font-semibold text-on-surface">Firebase Auth & Database</span>
              <span className={`px-2.5 py-0.5 rounded-full font-label-md text-[12px] font-bold ${
                isFirebaseConfigured ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-secondary-fixed text-on-secondary-fixed'
              }`}>
                {isFirebaseConfigured ? 'Active' : 'Demo Local Storage'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low flex flex-wrap items-center justify-between gap-2">
              <span className="font-label-md text-label-md font-semibold text-on-surface">AI Inference Service</span>
              <span className={`px-2.5 py-0.5 rounded-full font-label-md text-[12px] font-bold ${
                isDemoMode ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed'
              }`}>
                {isDemoMode ? 'Demo Inference Mode' : 'AI model: su0.1'}
              </span>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 gap-space-sm">
          <h2 className="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-2">
            <Globe size={20} className="text-primary" />
            {language === 'bn' ? 'ভাষা ও ব্যবহারযোগ্যতা' : 'Language & Display'}
          </h2>

          {/* Language Switch */}
          <div className="flex flex-col items-start gap-2 p-3 rounded-xl bg-surface-container-low sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <span className="font-body-bold text-body-bold text-on-surface">
                {language === 'bn' ? 'অ্যাপের ভাষা (App Language)' : 'Application Language'}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                {language === 'bn' ? 'বর্তমান: বাংলা' : 'Current: English'}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleLanguage}
              className="min-h-[48px] max-w-full px-4 rounded-xl bg-primary text-on-primary font-bold text-label-lg shadow hover:bg-primary-container"
            >
              {language === 'bn' ? 'English এ যান' : 'বাংলায় রূপান্তর'}
            </button>
          </div>
        </div>

        {/* WCAG 2.2 AA Accessibility Settings */}
        <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/30 gap-space-sm">
          <h2 className="font-title-lg text-title-lg font-bold text-on-surface flex items-center gap-2">
            <Eye size={20} className="text-primary" />
            {language === 'bn' ? 'অভিগম্যতা (Accessibility Controls)' : 'Accessibility Controls (WCAG 2.2 AA)'}
          </h2>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <Zap size={20} className="text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="font-body-bold text-body-bold text-on-surface">
                  {language === 'bn' ? 'কম অ্যানিমেশন (Reduced Motion)' : 'Reduced Motion'}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {language === 'bn' ? 'গতিশীল মোশন ও লেজার এনিমেশন বন্ধ রাখে' : 'Disables complex scanning animations'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="w-6 h-6 rounded accent-primary cursor-pointer"
              aria-label="Reduced Motion Toggle"
            />
          </div>

          {/* High Contrast Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <Eye size={20} className="text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="font-body-bold text-body-bold text-on-surface">
                  {language === 'bn' ? 'উচ্চ বৈপরিত্য মোড (High Contrast)' : 'High Contrast Mode'}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {language === 'bn' ? 'প্রখর রোদে দেখার জন্য বর্ডার ও টেক্সট স্পষ্ট করে' : 'Enhances contrast for daylight readability'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="w-6 h-6 rounded accent-primary cursor-pointer"
              aria-label="High Contrast Toggle"
            />
          </div>

          {/* Large Font Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-2.5">
              <Sparkles size={20} className="text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="font-body-bold text-body-bold text-on-surface">
                  {language === 'bn' ? 'বড় অক্ষরের ফন্ট (Large Text)' : 'Large Text Size'}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {language === 'bn' ? 'সহজে পড়ার জন্য ফন্টের সাইজ বৃদ্ধি করে' : 'Scales up text size for easier reading'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={largeFont}
              onChange={(e) => setLargeFont(e.target.checked)}
              className="w-6 h-6 rounded accent-primary cursor-pointer"
              aria-label="Large Font Toggle"
            />
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="danger"
          fullWidth
          icon={<LogOut size={20} />}
          onClick={() => setShowLogoutModal(true)}
        >
          {t.logout}
        </Button>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => !isSaving && setShowEditModal(false)}
          title={language === 'bn' ? 'প্রোফাইল তথ্য আপডেট করুন' : 'Edit Profile Information'}
        >
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 py-2">
            {/* Profile Avatar Upload Picker */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <img
                  src={editPhotoPreview || user?.photoURL || defaultAvatar}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
                />
                <label
                  htmlFor="profile-photo-input"
                  className="absolute bottom-0 right-0 p-2 bg-primary text-on-primary rounded-full shadow-lg cursor-pointer hover:bg-primary-container transition-colors"
                  aria-label="ছবি পরিবর্তন করুন"
                >
                  <Camera size={18} />
                  <input
                    id="profile-photo-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                </label>
              </div>
              <span className="text-xs text-on-surface-variant font-label-md">
                {language === 'bn' ? 'ছবি পরিবর্তন করতে ক্যামেরায় ক্লিক করুন' : 'Click camera icon to change photo'}
              </span>
            </div>

            {/* Name Field */}
            <Input
              label={language === 'bn' ? 'নাম (Name)' : 'Full Name'}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              required
            />

            {/* Phone Field */}
            <Input
              label={language === 'bn' ? 'মোবাইল নম্বর (Phone)' : 'Phone Number'}
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="০১৭XXXXXXXX"
            />

            {/* Location Field */}
            <Input
              label={language === 'bn' ? 'জেলা / ঠিকানা (Location)' : 'Location / District'}
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              placeholder="যেমন: ময়মনসিংহ, বাংলাদেশ"
            />

            <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-outline-variant/30">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowEditModal(false)}
                disabled={isSaving}
              >
                {t.cancel}
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                icon={isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
              >
                {isSaving ? (language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes')}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Logout Modal */}
        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title={language === 'bn' ? 'লগআউট নিশ্চিতকরণ' : 'Confirm Logout'}
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowLogoutModal(false)}>
                {t.cancel}
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                {t.logout}
              </Button>
            </>
          }
        >
          <p className="font-body-lg text-body-lg text-on-surface">
            {language === 'bn' ? 'আপনি কি নিশ্চিতভাবে লগআউট করতে চান?' : 'Are you sure you want to log out?'}
          </p>
        </Modal>
      </div>
    </AppLayout>
  );
};
