'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, Smartphone, Monitor, Volume2 } from 'lucide-react';

interface NotificationSettingsProps {
  settings: any;
  onUpdate: (updates: any) => void;
  isLoading: boolean;
}

export function NotificationSettings({ settings, onUpdate, isLoading }: NotificationSettingsProps) {
  const handleNotificationChange = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Notifications</h2>
        <p className="text-gray-400 mt-1">Manage how and when you receive notifications</p>
      </div>

      {/* Email Notifications */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Notifications
          </CardTitle>
          <CardDescription>Control email notifications sent to your inbox</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">New Content Alerts</Label>
              <p className="text-gray-400 text-sm">Get notified when new movies and shows are added</p>
            </div>
            <Switch
              checked={settings.emailNewContent}
              onCheckedChange={(value) => handleNotificationChange('emailNewContent', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Recommendations</Label>
              <p className="text-gray-400 text-sm">Personalized content recommendations</p>
            </div>
            <Switch
              checked={settings.emailRecommendations}
              onCheckedChange={(value) => handleNotificationChange('emailRecommendations', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Account Updates</Label>
              <p className="text-gray-400 text-sm">Important account and security notifications</p>
            </div>
            <Switch
              checked={settings.emailAccountUpdates}
              onCheckedChange={(value) => handleNotificationChange('emailAccountUpdates', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Marketing & Promotions</Label>
              <p className="text-gray-400 text-sm">Special offers and promotional content</p>
            </div>
            <Switch
              checked={settings.emailMarketing}
              onCheckedChange={(value) => handleNotificationChange('emailMarketing', value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Email Frequency</Label>
            <Select
              value={settings.emailFrequency}
              onValueChange={(value) => handleNotificationChange('emailFrequency', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
                <SelectItem value="monthly">Monthly Newsletter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Push Notifications
          </CardTitle>
          <CardDescription>Manage notifications on your devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Enable Push Notifications</Label>
              <p className="text-gray-400 text-sm">Allow Tomflix to send push notifications</p>
            </div>
            <Switch
              checked={settings.pushEnabled}
              onCheckedChange={(value) => handleNotificationChange('pushEnabled', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">New Episodes</Label>
              <p className="text-gray-400 text-sm">When new episodes of your shows are available</p>
            </div>
            <Switch
              checked={settings.pushNewEpisodes}
              onCheckedChange={(value) => handleNotificationChange('pushNewEpisodes', value)}
              disabled={!settings.pushEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Continue Watching</Label>
              <p className="text-gray-400 text-sm">Reminders to continue watching your shows</p>
            </div>
            <Switch
              checked={settings.pushContinueWatching}
              onCheckedChange={(value) => handleNotificationChange('pushContinueWatching', value)}
              disabled={!settings.pushEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Trending Content</Label>
              <p className="text-gray-400 text-sm">Popular and trending movies and shows</p>
            </div>
            <Switch
              checked={settings.pushTrending}
              onCheckedChange={(value) => handleNotificationChange('pushTrending', value)}
              disabled={!settings.pushEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            In-App Notifications
          </CardTitle>
          <CardDescription>Control notifications within the Tomflix app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Show Notifications</Label>
              <p className="text-gray-400 text-sm">Display notification banners in the app</p>
            </div>
            <Switch
              checked={settings.inAppNotifications}
              onCheckedChange={(value) => handleNotificationChange('inAppNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Auto-dismiss</Label>
              <p className="text-gray-400 text-sm">Automatically hide notifications after a few seconds</p>
            </div>
            <Switch
              checked={settings.inAppAutoDismiss}
              onCheckedChange={(value) => handleNotificationChange('inAppAutoDismiss', value)}
              disabled={!settings.inAppNotifications}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Notification Position</Label>
            <Select
              value={settings.inAppPosition}
              onValueChange={(value) => handleNotificationChange('inAppPosition', value)}
              disabled={!settings.inAppNotifications}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Sound Settings
          </CardTitle>
          <CardDescription>Configure notification sounds and audio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Notification Sounds</Label>
              <p className="text-gray-400 text-sm">Play sounds for notifications</p>
            </div>
            <Switch
              checked={settings.notificationSounds}
              onCheckedChange={(value) => handleNotificationChange('notificationSounds', value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Sound Theme</Label>
            <Select
              value={settings.soundTheme}
              onValueChange={(value) => handleNotificationChange('soundTheme', value)}
              disabled={!settings.notificationSounds}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="cinematic">Cinematic</SelectItem>
                <SelectItem value="retro">Retro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}