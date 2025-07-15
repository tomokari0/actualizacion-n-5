import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Coffee, Gift, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

interface DonationMenuProps {
  variant?: 'dropdown' | 'modal';
  className?: string;
}

const donationPlatforms = [
  {
    id: 'patreon',
    name: 'Patreon',
    description: 'Monthly support with exclusive perks',
    url: 'https://patreon.com/TOMOKARI797?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink',
    icon: Users,
    color: 'bg-orange-600 hover:bg-orange-700',
    textColor: 'text-orange-600'
  },
  {
    id: 'kofi',
    name: 'Ko-fi',
    description: 'One-time support, no fees',
    url: 'https://ko-fi.com/seikavtuber',
    icon: Coffee,
    color: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-blue-600'
  },
  {
    id: 'buymeacoffee',
    name: 'Buy Me a Coffee',
    description: 'Quick and easy support',
    url: 'https://buymeacoffee.com/seikavt',
    icon: Gift,
    color: 'bg-yellow-600 hover:bg-yellow-700',
    textColor: 'text-yellow-600'
  }
];

export function DonationMenu({ variant = 'dropdown', className = '' }: DonationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleDonationClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  if (variant === 'dropdown') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`text-white hover:text-gray-300 hover:text-red-400 transition-colors ${className}`}
          >
            <Heart className="w-4 h-4 mr-2" />
            {t('nav.donations')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="bg-black/95 border-gray-700 min-w-[280px] p-2"
          sideOffset={5}
        >
          <div className="mb-2 px-2 py-1">
            <h3 className="text-white font-semibold text-sm">{t('donations.title')}</h3>
            <p className="text-gray-400 text-xs">{t('donations.subtitle')}</p>
          </div>
          
          {donationPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <DropdownMenuItem
                key={platform.id}
                onClick={() => handleDonationClick(platform.url)}
                className="text-white hover:bg-gray-800 cursor-pointer p-3 rounded-md mb-1 focus:bg-gray-800"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{platform.name}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {platform.description}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
          
          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-500 px-2 text-center">
              {t('donations.thanks')}
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Modal variant for mobile or detailed view
  return (
    <Card className="bg-gray-900 border-gray-700 max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-white flex items-center justify-center">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          {t('donations.title')}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {t('donations.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {donationPlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Button
              key={platform.id}
              onClick={() => handleDonationClick(platform.url)}
              className={`w-full ${platform.color} text-white justify-start h-auto p-4`}
              variant="default"
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{platform.name}</div>
                  <div className="text-sm opacity-90">{platform.description}</div>
                </div>
              </div>
            </Button>
          );
        })}
        
        <div className="mt-4 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            {t('donations.thanks')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}