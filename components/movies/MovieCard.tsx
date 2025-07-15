'use client';

import { Content } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, Plus, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';

interface MovieCardProps {
  movie: Content;
}

export function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={movie.thumbnails.medium}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => router.push(`/watch/${movie.id}`)}
          >
            <Play className="w-4 h-4 mr-1" />
            {t('content.play')}
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">
          {movie.title}
        </h3>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
          <span>{movie.releaseYear}</span>
          <span>•</span>
          <span>{formatDuration(movie.duration)}</span>
          <span>•</span>
          <span className="bg-gray-700 px-2 py-1 rounded text-xs">
            {movie.rating}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genre.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs"
            >
              {genre}
            </span>
          ))}
        </div>
        
        <p className="text-gray-300 text-sm line-clamp-2 mb-4">
          {movie.description}
        </p>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => router.push(`/watch/${movie.id}`)}
          >
            <Play className="w-4 h-4 mr-1" />
            {t('content.watchNow')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}