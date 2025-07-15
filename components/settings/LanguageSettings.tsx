'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Globe, Clock, MapPin, Type } from 'lucide-react';

interface LanguageSettingsProps {
  settings: any;
  onUpdate: (updates: any) => void;
  isLoading: boolean;
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' }
];

const regions = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' }
];

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
];

export function LanguageSettings({ settings, onUpdate, isLoading }: LanguageSettingsProps) {
  const handleLanguageChange = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Language & Region</h2>
        <p className="text-gray-400 mt-1">Configure your language and regional preferences</p>
      </div>

      {/* Language Settings */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Language Preferences
          </CardTitle>
          <CardDescription>Choose your preferred language for the interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white font-medium">Interface Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleLanguageChange('language', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.name}</span>
                      <span className="text-gray-400">({lang.nativeName})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Audio Language</Label>
            <Select
              value={settings.audioLanguage}
              onValueChange={(value) => handleLanguageChange('audioLanguage', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.name}</span>
                      <span className="text-gray-400">({lang.nativeName})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Subtitle Language</Label>
            <Select
              value={settings.subtitleLanguage}
              onValueChange={(value) => handleLanguageChange('subtitleLanguage', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="off">Off</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.name}</span>
                      <span className="text-gray-400">({lang.nativeName})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Auto-detect Language</Label>
              <p className="text-gray-400 text-sm">Automatically detect language from browser settings</p>
            </div>
            <Switch
              checked={settings.autoDetectLanguage}
              onCheckedChange={(value) => handleLanguageChange('autoDetectLanguage', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Regional Settings
          </CardTitle>
          <CardDescription>Configure your location and regional preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white font-medium">Country/Region</Label>
            <Select
              value={settings.region}
              onValueChange={(value) => handleLanguageChange('region', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {regions.map((region) => (
                  <SelectItem key={region.code} value={region.code}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Content Region</Label>
            <Select
              value={settings.contentRegion}
              onValueChange={(value) => handleLanguageChange('contentRegion', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="auto">Auto (Based on location)</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region.code} value={region.code}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-gray-400 text-sm">
              This affects which content is available to you
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Show Regional Content Only</Label>
              <p className="text-gray-400 text-sm">Only display content available in your region</p>
            </div>
            <Switch
              checked={settings.regionalContentOnly}
              onCheckedChange={(value) => handleLanguageChange('regionalContentOnly', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Time & Date Settings */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Time & Date
          </CardTitle>
          <CardDescription>Configure time zone and date format preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white font-medium">Time Zone</Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) => handleLanguageChange('timezone', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Date Format</Label>
            <Select
              value={settings.dateFormat}
              onValueChange={(value) => handleLanguageChange('dateFormat', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (UK)</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                <SelectItem value="DD.MM.YYYY">DD.MM.YYYY (German)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Time Format</Label>
            <Select
              value={settings.timeFormat}
              onValueChange={(value) => handleLanguageChange('timeFormat', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Auto-detect Time Zone</Label>
              <p className="text-gray-400 text-sm">Automatically detect time zone from your location</p>
            </div>
            <Switch
              checked={settings.autoDetectTimezone}
              onCheckedChange={(value) => handleLanguageChange('autoDetectTimezone', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Type className="w-5 h-5 mr-2" />
            Accessibility
          </CardTitle>
          <CardDescription>Language and text accessibility options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">High Contrast Subtitles</Label>
              <p className="text-gray-400 text-sm">Use high contrast colors for better subtitle visibility</p>
            </div>
            <Switch
              checked={settings.highContrastSubtitles}
              onCheckedChange={(value) => handleLanguageChange('highContrastSubtitles', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Audio Descriptions</Label>
              <p className="text-gray-400 text-sm">Enable audio descriptions when available</p>
            </div>
            <Switch
              checked={settings.audioDescriptions}
              onCheckedChange={(value) => handleLanguageChange('audioDescriptions', value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Subtitle Size</Label>
            <Select
              value={settings.subtitleSize}
              onValueChange={(value) => handleLanguageChange('subtitleSize', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extra-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}