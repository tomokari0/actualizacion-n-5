'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Shield, Camera, Save, AlertCircle } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface AccountSettingsProps {
  settings: any;
  onUpdate: (updates: any) => void;
  user: FirebaseUser;
  isLoading: boolean;
}

export function AccountSettings({ settings, onUpdate, user, isLoading }: AccountSettingsProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [bio, setBio] = useState(settings.bio || '');
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    onUpdate({
      displayName,
      bio
    });
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setDisplayName(user.displayName || '');
    setBio(settings.bio || '');
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    setHasChanges(true);
  };

  const handleBioChange = (value: string) => {
    setBio(value);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Account Settings</h2>
        <p className="text-gray-400 mt-1">Manage your profile and account information</p>
      </div>

      {/* Profile Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Information
          </CardTitle>
          <CardDescription>Your public profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.photoURL || ''} />
              <AvatarFallback className="bg-red-600 text-white text-xl">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-gray-400 text-sm mt-2">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label className="text-white">Display Name</Label>
            {isEditing ? (
              <Input
                value={displayName}
                onChange={(e) => handleDisplayNameChange(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter your display name"
              />
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">{displayName || 'Not set'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-white"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label className="text-white">Bio</Label>
            {isEditing ? (
              <Textarea
                value={bio}
                onChange={(e) => handleBioChange(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Tell us about yourself..."
                rows={3}
                maxLength={160}
              />
            ) : (
              <div className="flex items-start justify-between">
                <span className="text-gray-300">{bio || 'No bio added'}</span>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
            {isEditing && (
              <p className="text-gray-400 text-sm">{bio.length}/160 characters</p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Account Details
          </CardTitle>
          <CardDescription>Your account information and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">{user.email}</span>
                {user.emailVerified ? (
                  <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">
                    Unverified
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Member Since
              </Label>
              <span className="text-gray-300">
                {user.metadata.creationTime ? 
                  new Date(user.metadata.creationTime).toLocaleDateString() : 
                  'Unknown'
                }
              </span>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Account Type</Label>
              <Badge variant="secondary" className="bg-red-600/20 text-red-400">
                Premium
              </Badge>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Last Sign In</Label>
              <span className="text-gray-300">
                {user.metadata.lastSignInTime ? 
                  new Date(user.metadata.lastSignInTime).toLocaleDateString() : 
                  'Unknown'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Connected Accounts</CardTitle>
          <CardDescription>Manage your linked social accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">G</span>
              </div>
              <div>
                <div className="text-white font-medium">Google</div>
                <div className="text-gray-400 text-sm">
                  {user.providerData.some(p => p.providerId === 'google.com') ? 
                    'Connected' : 'Not connected'
                  }
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              {user.providerData.some(p => p.providerId === 'google.com') ? 
                'Disconnect' : 'Connect'
              }
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-900/20 border-red-600/50">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Delete Account</div>
              <div className="text-gray-400 text-sm">
                Permanently delete your account and all data
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}