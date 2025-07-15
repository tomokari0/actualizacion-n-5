'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'select' | 'compact';
  showFlag?: boolean;
  showNativeName?: boolean;
  className?: string;
}

export function LanguageSelector({ 
  variant = 'dropdown', 
  showFlag = true, 
  showNativeName = true,
  className = '' 
}: LanguageSelectorProps) {
  const { language, setLanguage, availableLanguages } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  if (variant === 'select') {
    return (
      <div className={className}>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white min-w-[150px]">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {availableLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center space-x-2">
                  {showFlag && <span className="text-lg">{lang.flag}</span>}
                  <span>{showNativeName ? lang.nativeName : lang.name}</span>
                  {language === lang.code && <Check className="w-4 h-4 ml-auto" />}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`text-white hover:text-gray-300 ${className}`}
          >
            {showFlag && currentLanguage && (
              <span className="text-lg mr-1">{currentLanguage.flag}</span>
            )}
            <span className="text-sm font-medium">
              {currentLanguage?.code.toUpperCase()}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black/95 border-gray-700 min-w-[180px]">
          {availableLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className="text-white hover:bg-gray-800 cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  {showFlag && <span className="text-lg">{lang.flag}</span>}
                  <span>{showNativeName ? lang.nativeName : lang.name}</span>
                </div>
                {language === lang.code && <Check className="w-4 h-4 text-red-500" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default dropdown variant
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`text-white hover:text-gray-300 ${className}`}
        >
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            {showFlag && currentLanguage && (
              <span className="text-lg">{currentLanguage.flag}</span>
            )}
            <span className="hidden sm:inline">
              {currentLanguage ? (showNativeName ? currentLanguage.nativeName : currentLanguage.name) : 'Language'}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/95 border-gray-700 min-w-[200px]">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code);
              setIsOpen(false);
            }}
            className="text-white hover:bg-gray-800 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                {showFlag && <span className="text-lg">{lang.flag}</span>}
                <div>
                  <div className="font-medium">{lang.name}</div>
                  {showNativeName && lang.name !== lang.nativeName && (
                    <div className="text-sm text-gray-400">{lang.nativeName}</div>
                  )}
                </div>
              </div>
              {language === lang.code && <Check className="w-4 h-4 text-red-500" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}