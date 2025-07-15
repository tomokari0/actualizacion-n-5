'use client';

import { Profile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

interface ProfileCardProps {
  profile: Profile;
  onSelect: (profile: Profile) => void;
  onEdit?: (profile: Profile) => void;
  isEditing?: boolean;
}

export function ProfileCard({ profile, onSelect, onEdit, isEditing = false }: ProfileCardProps) {
  const { t } = useTranslation();
  
  const handleClick = () => {
    if (isEditing && onEdit) {
      onEdit(profile);
    } else {
      onSelect(profile);
    }
  };

  return (
    <Card className="bg-transparent border-none cursor-pointer group" onClick={handleClick}>
      <CardContent className="p-0 text-center">
        <div className="relative">
          <Avatar className="w-32 h-32 mx-auto mb-4 group-hover:scale-105 transition-transform">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        <h3 className="text-white text-lg font-medium group-hover:text-gray-300 transition-colors">
          {profile.name}
        </h3>
        {profile.isKids && (
          <div className="mt-2">
            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
              {t('profiles.kids')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}