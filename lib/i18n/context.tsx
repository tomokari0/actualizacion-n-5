'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, languages, defaultLanguage, fallbackLanguage } from './translations';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  availableLanguages: typeof languages;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState(defaultLanguage);

  // Load saved language preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('tomflix-language');
      if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
        setLanguageState(savedLanguage);
      } else {
        // Auto-detect browser language
        const browserLanguage = navigator.language.split('-')[0];
        const supportedLanguage = languages.find(lang => lang.code === browserLanguage);
        if (supportedLanguage) {
          setLanguageState(browserLanguage);
        }
      }
    }
  }, []);

  // Save language preference and update document attributes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tomflix-language', language);
      
      // Update document language and direction
      document.documentElement.lang = language;
      const currentLang = languages.find(lang => lang.code === language);
      document.documentElement.dir = currentLang?.rtl ? 'rtl' : 'ltr';
    }
  }, [language]);

  const setLanguage = (lang: string) => {
    if (languages.find(l => l.code === lang)) {
      setLanguageState(lang);
    }
  };

  // Translation function with nested key support and parameter interpolation
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    
    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to default language
        value = translations[fallbackLanguage as keyof typeof translations];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            // Return key if translation not found
            return key;
          }
        }
        break;
      }
    }

    // If value is not a string, return the key
    if (typeof value !== 'string') {
      return key;
    }

    // Parameter interpolation
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  const currentLang = languages.find(lang => lang.code === language);
  const isRTL = currentLang?.rtl || false;

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    isRTL,
    availableLanguages: languages
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Hook for easier translation access
export function useTranslation() {
  const { t } = useI18n();
  return { t };
}