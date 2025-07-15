'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Palette, 
  User, 
  Shield, 
  Bell, 
  Globe,
  Monitor,
  Lock,
  Smartphone
} from 'lucide-react';

interface SettingsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const settingsSections = [
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
    description: 'Theme, colors, and layout'
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    description: 'Profile and personal info'
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    icon: Shield,
    description: 'Privacy settings and security'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Email and push notifications'
  },
  {
    id: 'language',
    label: 'Language & Region',
    icon: Globe,
    description: 'Language and location settings'
  }
];

export function SettingsNavigation({ activeSection, onSectionChange }: SettingsNavigationProps) {
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-0">
        <nav className="space-y-1">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <Button
                key={section.id}
                variant="ghost"
                className={`w-full justify-start p-4 h-auto text-left ${
                  isActive 
                    ? 'bg-red-600/20 text-red-400 border-r-2 border-red-600' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => onSectionChange(section.id)}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{section.label}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {section.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}