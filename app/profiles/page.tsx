'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/lib/types';
import { ProfileCard } from '@/components/profiles/ProfileCard';
import { Button } from '@/components/ui/button';
import { Plus, Edit3 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/context';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { setCurrentProfile } = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Initialize with default profile if none exist
    if (profiles.length === 0) {
      const defaultProfile: Profile = {
        id: '1',
        name: user.displayName || 'User',
        avatar: '',
        isKids: false,
        language: 'en',
        maturityLevel: 'adult'
      };
      setProfiles([defaultProfile]);
    }
  }, [user, profiles.length, router]);

  const handleSelectProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    router.push('/browse');
  };

  const handleAddProfile = () => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      name: `Profile ${profiles.length + 1}`,
      avatar: '',
      isKids: false,
      language: 'en',
      maturityLevel: 'adult'
    };
    setProfiles([...profiles, newProfile]);
  };

  const handleEditProfile = (profile: Profile) => {
    // In a real app, this would open a modal to edit the profile
    console.log('Edit profile:', profile);
  };

  if (!user) {
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('profiles.whoWatching')}</h1>
          <p className="text-gray-400">{t('profiles.selectProfile')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSelect={handleSelectProfile}
              onEdit={handleEditProfile}
              isEditing={isEditing}
            />
          ))}
          {profiles.length < 5 && (
            <div
              className="flex flex-col items-center cursor-pointer group"
              onClick={handleAddProfile}
            >
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-700 transition-colors">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-gray-400 text-lg font-medium group-hover:text-white transition-colors">
                {t('profiles.addProfile')}
              </h3>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? t('profiles.done') : t('profiles.manageProfiles')}
          </Button>
        </div>
      </div>
    </div>
  );
}