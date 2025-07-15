'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/lib/store';

interface UserSettings {
  // Appearance
  theme: 'dark' | 'light' | 'auto';
  accentColor: string;
  fontSize: string;
  layout: string;
  autoplay: boolean;
  animations: boolean;

  // Account
  displayName: string;
  bio: string;

  // Privacy
  publicProfile: boolean;
  showWatchHistory: boolean;
  showMyList: boolean;
  profileVisibility: string;
  analyticsTracking: boolean;
  personalizedRecommendations: boolean;
  marketingCommunications: boolean;
  thirdPartyDataSharing: boolean;
  loginNotifications: boolean;
  sessionTimeout: string;

  // Notifications
  emailNewContent: boolean;
  emailRecommendations: boolean;
  emailAccountUpdates: boolean;
  emailMarketing: boolean;
  emailFrequency: string;
  pushEnabled: boolean;
  pushNewEpisodes: boolean;
  pushContinueWatching: boolean;
  pushTrending: boolean;
  inAppNotifications: boolean;
  inAppAutoDismiss: boolean;
  inAppPosition: string;
  notificationSounds: boolean;
  soundTheme: string;

  // Language & Region
  language: string;
  audioLanguage: string;
  subtitleLanguage: string;
  autoDetectLanguage: boolean;
  region: string;
  contentRegion: string;
  regionalContentOnly: boolean;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  autoDetectTimezone: boolean;
  highContrastSubtitles: boolean;
  audioDescriptions: boolean;
  subtitleSize: string;
}

const defaultSettings: UserSettings = {
  // Appearance
  theme: 'dark',
  accentColor: 'red',
  fontSize: 'medium',
  layout: 'comfortable',
  autoplay: true,
  animations: true,

  // Account
  displayName: '',
  bio: '',

  // Privacy
  publicProfile: true,
  showWatchHistory: true,
  showMyList: true,
  profileVisibility: 'public',
  analyticsTracking: true,
  personalizedRecommendations: true,
  marketingCommunications: false,
  thirdPartyDataSharing: false,
  loginNotifications: true,
  sessionTimeout: '1week',

  // Notifications
  emailNewContent: true,
  emailRecommendations: true,
  emailAccountUpdates: true,
  emailMarketing: false,
  emailFrequency: 'weekly',
  pushEnabled: true,
  pushNewEpisodes: true,
  pushContinueWatching: true,
  pushTrending: false,
  inAppNotifications: true,
  inAppAutoDismiss: true,
  inAppPosition: 'top-right',
  notificationSounds: true,
  soundTheme: 'default',

  // Language & Region
  language: 'en',
  audioLanguage: 'en',
  subtitleLanguage: 'off',
  autoDetectLanguage: true,
  region: 'US',
  contentRegion: 'auto',
  regionalContentOnly: false,
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12',
  autoDetectTimezone: true,
  highContrastSubtitles: false,
  audioDescriptions: false,
  subtitleSize: 'medium'
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { currentProfile } = useAppStore();

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('tomflix-settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
        } catch (error) {
          console.error('Error parsing saved settings:', error);
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      localStorage.setItem('tomflix-settings', JSON.stringify(settings));
    }
  }, [settings, isLoading]);

  // Apply theme changes to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Apply theme
      if (settings.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
      } else {
        root.classList.toggle('dark', settings.theme === 'dark');
      }

      // Apply accent color
      const accentColors = {
        red: '#dc2626',
        blue: '#2563eb',
        green: '#16a34a',
        purple: '#9333ea',
        orange: '#ea580c',
        pink: '#db2777'
      };
      
      root.style.setProperty('--accent-color', accentColors[settings.accentColor as keyof typeof accentColors] || accentColors.red);

      // Apply font size
      const fontSizes = {
        small: '14px',
        medium: '16px',
        large: '18px',
        'extra-large': '20px'
      };
      
      root.style.setProperty('--base-font-size', fontSizes[settings.fontSize as keyof typeof fontSizes] || fontSizes.medium);

      // Apply animations
      root.style.setProperty('--animation-duration', settings.animations ? '0.3s' : '0s');
    }
  }, [settings.theme, settings.accentColor, settings.fontSize, settings.animations]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tomflix-settings');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tomflix-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSettings({ ...defaultSettings, ...imported });
      } catch (error) {
        console.error('Error importing settings:', error);
      }
    };
    reader.readAsText(file);
  };

  return {
    settings,
    updateSettings,
    resetToDefaults,
    exportSettings,
    importSettings,
    isLoading
  };
}