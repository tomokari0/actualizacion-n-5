'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/lib/store';
import { mockContent } from '@/lib/mock-data';
import { Content } from '@/lib/types';

interface WatchPageProps {
  params: {
    id: string;
  };
}

export default function WatchPage({ params }: WatchPageProps) {
  const [content, setContent] = useState<Content | null>(null);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const { currentProfile, updateProgress } = useAppStore();
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

    // Find content by ID
    const foundContent = mockContent.find(item => item.id === params.id);
    if (foundContent) {
      setContent(foundContent);
      // In a real app, you'd load the user's watch progress here
      setProgress(0);
    } else {
      router.push('/browse');
    }
  }, [user, currentProfile, params.id, router]);

  const handleProgress = (newProgress: number) => {
    // Progress is now handled by VideoPlayer component
  };

  if (!user || !currentProfile || !content) {
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
      <VideoPlayer
        videoUrl={content.videoUrl}
        title={content.title}
        content={content}
        onProgress={handleProgress}
        initialProgress={progress}
      />
    </div>
  );
}