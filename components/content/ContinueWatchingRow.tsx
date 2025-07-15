'use client';

import { useState, useEffect } from 'react';
import { WatchHistory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { watchProgressService } from '@/lib/watch-progress';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/context';

interface ContinueWatchingRowProps {
  title?: string;
}

export function ContinueWatchingRow({ title = "Continue Watching" }: ContinueWatchingRowProps) {
  const [continueWatching, setContinueWatching] = useState<WatchHistory[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const { currentProfile } = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user || !currentProfile) return;

    setLoading(true);

    // Subscribe to real-time updates
    const unsubscribe = watchProgressService.subscribeToContinueWatching(
      user.uid,
      currentProfile.id,
      (watchHistory) => {
        setContinueWatching(watchHistory);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, currentProfile]);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`continue-watching-scroll`);
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleRemove = async (item: WatchHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !currentProfile) return;

    await watchProgressService.removeFromContinueWatching(
      user.uid,
      currentProfile.id,
      item.contentId,
      item.episodeId
    );
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{t('content.continueWatching')}</h2>
        <div className="flex space-x-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 h-44 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (continueWatching.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">{t('content.continueWatching')}</h2>
      <div className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
        <div
          id="continue-watching-scroll"
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {continueWatching.map((item) => (
            <div
              key={`${item.contentId}-${item.episodeId || 'main'}`}
              className="relative flex-shrink-0 w-80 h-44 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 group/item"
              onClick={() => {
                const watchUrl = item.episodeId 
                  ? `/watch/${item.contentId}?episode=${item.episodeId}`
                  : `/watch/${item.contentId}`;
                router.push(watchUrl);
              }}
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/50 transition-all duration-300" />
              
              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 text-white opacity-0 group-hover/item:opacity-100 transition-opacity"
                onClick={(e) => handleRemove(item, e)}
              >
                <X className="w-4 h-4" />
              </Button>
              
              {/* Content Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                  {item.title}
                  {item.episodeId && item.seasonNumber && item.episodeNumber && (
                    <span className="text-gray-300 ml-2">
                      S{item.seasonNumber}:E{item.episodeNumber}
                    </span>
                  )}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>
                    {formatTime(item.progressSeconds)} / {formatDuration(item.duration)}
                  </span>
                  <span>{Math.round(item.progress)}% watched</span>
                </div>
              </div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                  <Play className="w-4 h-4 mr-1" />
                  {t('content.resume')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}