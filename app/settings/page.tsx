'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { SettingsNavigation } from '@/components/settings/SettingsNavigation';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { LanguageSettings } from '@/components/settings/LanguageSettings';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/lib/store';
import { useSettings } from '@/hooks/useSettings';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('appearance');
  const { user } = useAuth();
  const { currentProfile } = useAppStore();
  const router = useRouter();
  const { settings, updateSettings, resetToDefaults, isLoading } = useSettings();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!currentProfile) {
      router.push('/profiles');
      return;
    }
  }, [user, currentProfile, router]);

  if (!user || !currentProfile) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <AppearanceSettings
            settings={settings}
            onUpdate={updateSettings}
            onReset={resetToDefaults}
            isLoading={isLoading}
          />
        );
      case 'account':
        return (
          <AccountSettings
            settings={settings}
            onUpdate={updateSettings}
            user={user}
            isLoading={isLoading}
          />
        );
      case 'privacy':
        return (
          <PrivacySettings
            settings={settings}
            onUpdate={updateSettings}
            isLoading={isLoading}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings
            settings={settings}
            onUpdate={updateSettings}
            isLoading={isLoading}
          />
        );
      case 'language':
        return (
          <LanguageSettings
            settings={settings}
            onUpdate={updateSettings}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-16 px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">
              Customize your Tomflix experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <SettingsNavigation
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}