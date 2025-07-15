'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Eye, Lock, UserCheck, Download, Trash2 } from 'lucide-react';

interface PrivacySettingsProps {
  settings: any;
  onUpdate: (updates: any) => void;
  isLoading: boolean;
}

export function PrivacySettings({ settings, onUpdate, isLoading }: PrivacySettingsProps) {
  const handlePrivacyChange = (key: string, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Privacy & Security</h2>
        <p className="text-gray-400 mt-1">Control your privacy and security settings</p>
      </div>

      {/* Profile Privacy */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Profile Privacy
          </CardTitle>
          <CardDescription>Control who can see your profile and activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Public Profile</Label>
              <p className="text-gray-400 text-sm">Allow others to find and view your profile</p>
            </div>
            <Switch
              checked={settings.publicProfile}
              onCheckedChange={(value) => handlePrivacyChange('publicProfile', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Show Watch History</Label>
              <p className="text-gray-400 text-sm">Display your recently watched content</p>
            </div>
            <Switch
              checked={settings.showWatchHistory}
              onCheckedChange={(value) => handlePrivacyChange('showWatchHistory', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Show My List</Label>
              <p className="text-gray-400 text-sm">Allow others to see your saved content</p>
            </div>
            <Switch
              checked={settings.showMyList}
              onCheckedChange={(value) => handlePrivacyChange('showMyList', value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Profile Visibility</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="public">Public - Anyone can find me</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private - Only me</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data & Analytics */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Data & Analytics
          </CardTitle>
          <CardDescription>Control how your data is used and collected</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Analytics Tracking</Label>
              <p className="text-gray-400 text-sm">Help improve Tomflix with usage analytics</p>
            </div>
            <Switch
              checked={settings.analyticsTracking}
              onCheckedChange={(value) => handlePrivacyChange('analyticsTracking', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Personalized Recommendations</Label>
              <p className="text-gray-400 text-sm">Use viewing history for better recommendations</p>
            </div>
            <Switch
              checked={settings.personalizedRecommendations}
              onCheckedChange={(value) => handlePrivacyChange('personalizedRecommendations', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Marketing Communications</Label>
              <p className="text-gray-400 text-sm">Receive promotional emails and offers</p>
            </div>
            <Switch
              checked={settings.marketingCommunications}
              onCheckedChange={(value) => handlePrivacyChange('marketingCommunications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Third-party Data Sharing</Label>
              <p className="text-gray-400 text-sm">Share anonymized data with partners</p>
            </div>
            <Switch
              checked={settings.thirdPartyDataSharing}
              onCheckedChange={(value) => handlePrivacyChange('thirdPartyDataSharing', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage your account security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Two-Factor Authentication</Label>
              <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Enable 2FA
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Login Notifications</Label>
              <p className="text-gray-400 text-sm">Get notified of new sign-ins to your account</p>
            </div>
            <Switch
              checked={settings.loginNotifications}
              onCheckedChange={(value) => handlePrivacyChange('loginNotifications', value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Session Timeout</Label>
            <Select
              value={settings.sessionTimeout}
              onValueChange={(value) => handlePrivacyChange('sessionTimeout', value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="1hour">1 Hour</SelectItem>
                <SelectItem value="1day">1 Day</SelectItem>
                <SelectItem value="1week">1 Week</SelectItem>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Data Management
          </CardTitle>
          <CardDescription>Download or delete your personal data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Download Your Data</div>
              <div className="text-gray-400 text-sm">
                Get a copy of all your data including watch history and preferences
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Clear Watch History</div>
              <div className="text-gray-400 text-sm">
                Remove all viewing history and reset recommendations
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-600 text-red-400 hover:bg-red-600/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}