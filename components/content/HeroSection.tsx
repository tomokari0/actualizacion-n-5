'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Info, VolumeX, Volume2 } from 'lucide-react';
import { Content } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';

interface HeroSectionProps {
  featuredContent: Content[];
}

export function HeroSection({ featuredContent }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredContent.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [featuredContent.length]);

  if (!featuredContent.length) return null;

  const currentContent = featuredContent[currentIndex];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={currentContent.thumbnails.large}
          alt={currentContent.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {currentContent.title}
            </h1>
            <p className="text-lg text-gray-200 mb-6 line-clamp-3">
              {currentContent.description}
            </p>
            <div className="flex items-center space-x-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
                onClick={() => router.push(`/watch/${currentContent.id}`)}
              >
                <Play className="w-5 h-5 mr-2" />
                {t('content.play')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-400 text-white hover:bg-gray-800 px-8 py-3 text-lg"
                onClick={() => router.push(`/info/${currentContent.id}`)}
              >
                <Info className="w-5 h-5 mr-2" />
                {t('content.moreInfo')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 hover:bg-black/75 text-white border border-gray-600"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 z-20 flex space-x-2">
        {featuredContent.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}