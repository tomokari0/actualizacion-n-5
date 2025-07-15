'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ContentRow } from '@/components/content/ContentRow';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/lib/store';
import { mockContent } from '@/lib/mock-data';
import { Content } from '@/lib/types';
import { AdUnit } from '@/components/ads/AdUnit';
import { Footer } from '@/components/layout/Footer';

export default function TVShowsPage() {
  const [content, setContent] = useState<Content[]>([]);
  const { user } = useAuth();
  const { currentProfile } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!currentProfile) {
      router.push('/profiles');
      return;
    }

    const tvShows = mockContent.filter(item => item.type === 'series');
    setContent(tvShows);
  }, [user, currentProfile, router]);

  if (!user || !currentProfile) {
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

  const dramaShows = content.filter(item => item.genre.includes('Drama'));
  const horrorShows = content.filter(item => item.genre.includes('Horror'));
  const crimeShows = content.filter(item => item.genre.includes('Crime'));

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-16 px-4 md:px-8 lg:px-16 pb-16">
        <h1 className="text-4xl font-bold text-white mb-8">TV Shows</h1>
        
        {/* Ad Banner */}
        <div className="mb-8">
          <AdUnit type="banner" className="max-w-4xl mx-auto" />
        </div>
        
        <ContentRow title="Popular TV Shows" content={content} />
        
        {/* Ad Rectangle between content rows */}
        <div className="my-8 flex justify-center">
          <AdUnit type="rectangle" />
        </div>
        
        <ContentRow title="Drama Series" content={dramaShows} />
        <ContentRow title="Horror Series" content={horrorShows} />
        <ContentRow title="Crime Series" content={crimeShows} />
      </div>
      <Footer />
    </div>
  );
}