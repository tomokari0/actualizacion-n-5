'use client';

import { useState } from 'react';
import { Content } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';

interface ContentRowProps {
  title: string;
  content: Content[];
}

export function ContentRow({ title, content }: ContentRowProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();
  const { t } = useTranslation();

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`scroll-${title}`);
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
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
          id={`scroll-${title}`}
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {content.map((item) => (
            <div
              key={item.id}
              className="relative flex-shrink-0 w-64 h-36 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 group"
              onClick={() => router.push(`/watch/${item.id}`)}
            >
              <img
                src={item.thumbnails.medium}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-gray-300 text-xs line-clamp-2">{item.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                    <Play className="w-3 h-3 mr-1" />
                    {t('content.play')}
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}