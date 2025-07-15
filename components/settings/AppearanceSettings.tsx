'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Palette, RotateCcw, Eye } from 'lucide-react';

interface AppearanceSettingsProps {
  settings: any;
  onUpdate: (updates: any) => void;
  onReset: () => void;
  isLoading: boolean;
}

const themes = [
  { id: 'dark', name: 'Dark', description: 'Dark theme (default)' },
  { id: 'light', name: 'Light', description: 'Light theme' },
  { id: 'auto', name: 'Auto', description: 'Follow system preference' }
];

const accentColors = [
  { id: 'red', name: 'Red', color: '#dc2626' },
  { id: 'blue', name: 'Blue', color: '#2563eb' },
  { id: 'green', name: 'Green', color: '#16a34a' },
  { id: 'purple', name: 'Purple', color: '#9333ea' },
  { id: 'orange', name: 'Orange', color: '#ea580c' },
  { id: 'pink', name: 'Pink', color: '#db2777' }
];

const fontSizes = [
  { id: 'small', name: 'Small', size: '14px' },
  { id: 'medium', name: 'Medium', size: '16px' },
  { id: 'large', name: 'Large', size: '18px' },
  { id: 'extra-large', name: 'Extra Large', size: '20px' }
];

const layouts = [
  { id: 'compact', name: 'Compact', description: 'More content, less spacing' },
  { id: 'comfortable', name: 'Comfortable', description: 'Balanced spacing' },
  { id: 'spacious', name: 'Spacious', description: 'More spacing, less content' }
];

export function AppearanceSettings({ settings, onUpdate, onReset, isLoading }: AppearanceSettingsProps) {
  const [previewMode, setPreviewMode] = useState(false);

  const handleThemeChange = (theme: string) => {
    onUpdate({ theme });
  };

  const handleAccentColorChange = (accentColor: string) => {
    onUpdate({ accentColor });
  };

  const handleFontSizeChange = (fontSize: string) => {
    onUpdate({ fontSize });
  };

  const handleLayoutChange = (layout: string) => {
    onUpdate({ layout });
  };

  const handleAutoplayChange = (autoplay: boolean) => {
    onUpdate({ autoplay });
  };

  const handleAnimationsChange = (animations: boolean) => {
    onUpdate({ animations });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Appearance</h2>
          <p className="text-gray-400 mt-1">Customize the look and feel of Tomflix</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-gray-600 text-white hover:bg-gray-800"
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {previewMode && (
        <Card className="bg-blue-600/20 border-blue-600/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Preview Mode Active</span>
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                Changes are temporary
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme Selection */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Theme
          </CardTitle>
          <CardDescription>Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  settings.theme === theme.id
                    ? 'border-red-600 bg-red-600/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full ${
                    theme.id === 'dark' ? 'bg-gray-800' :
                    theme.id === 'light' ? 'bg-white' :
                    'bg-gradient-to-r from-gray-800 to-white'
                  }`} />
                  <div>
                    <div className="text-white font-medium">{theme.name}</div>
                    <div className="text-gray-400 text-sm">{theme.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accent Color */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Accent Color</CardTitle>
          <CardDescription>Choose your preferred accent color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {accentColors.map((color) => (
              <button
                key={color.id}
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  settings.accentColor === color.id
                    ? 'border-white scale-110'
                    : 'border-gray-600 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.color }}
                onClick={() => handleAccentColorChange(color.id)}
                title={color.name}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Font Size</CardTitle>
          <CardDescription>Adjust text size for better readability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                className={`p-3 rounded-lg border transition-all text-center ${
                  settings.fontSize === size.id
                    ? 'border-red-600 bg-red-600/10 text-red-400'
                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
                onClick={() => handleFontSizeChange(size.id)}
              >
                <div style={{ fontSize: size.size }} className="font-medium">Aa</div>
                <div className="text-xs mt-1">{size.name}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Layout */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Layout</CardTitle>
          <CardDescription>Choose how content is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {layouts.map((layout) => (
              <div
                key={layout.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  settings.layout === layout.id
                    ? 'border-red-600 bg-red-600/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => handleLayoutChange(layout.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{layout.name}</div>
                    <div className="text-gray-400 text-sm">{layout.description}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    settings.layout === layout.id
                      ? 'border-red-600 bg-red-600'
                      : 'border-gray-600'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Playback Settings */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Playback & Animations</CardTitle>
          <CardDescription>Control video and interface behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Autoplay</Label>
              <p className="text-gray-400 text-sm">Automatically play videos when selected</p>
            </div>
            <Switch
              checked={settings.autoplay}
              onCheckedChange={handleAutoplayChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Animations</Label>
              <p className="text-gray-400 text-sm">Enable smooth transitions and effects</p>
            </div>
            <Switch
              checked={settings.animations}
              onCheckedChange={handleAnimationsChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}