'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ContentRow } from '@/components/content/ContentRow';
import { ContinueWatchingRow } from '@/components/content/ContinueWatchingRow';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/lib/store';
import { mockContent } from '@/lib/mock-data';
import { Content } from '@/lib/types';
import { AdUnit } from '@/components/ads/AdUnit';
import { Footer } from '@/components/layout/Footer';

export default function MyListPage() {
  const [myList, setMyList] = useState<Content[]>([]);
  const [continueWatching, setContinueWatching] = useState<Content[]>([]);
  const { user } = useAuth();
  const { currentProfile, watchHistory } = useAppStore();
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

    // In a real app, you'd load the user's saved content and watch history
    // For now, we'll use some mock data
    setMyList(mockContent.slice(0, 3));
    setContinueWatching(mockContent.slice(3, 6));
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

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-16 px-4 md:px-8 lg:px-16 pb-16">
        <h1 className="text-4xl font-bold text-white mb-8">My List</h1>
        
        {/* Ad Banner */}
        <div className="mb-8">
          <AdUnit type="banner" className="max-w-4xl mx-auto" />
        </div>
        
        <ContinueWatchingRow />
        {continueWatching.length > 0 && (
          <ContentRow title="Continue Watching" content={continueWatching} />
        )}
        
        {/* Ad Rectangle between sections */}
        {(myList.length > 0 || continueWatching.length > 0) && (
          <div className="my-8 flex justify-center">
            <AdUnit type="rectangle" />
          </div>
        )}
        
        {myList.length > 0 && (
          <ContentRow title="My List" content={myList} />
        )}
        {myList.length === 0 && continueWatching.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Your list is empty</p>
            <p className="text-gray-500 mt-2">Add movies and TV shows to your list to watch them later</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}