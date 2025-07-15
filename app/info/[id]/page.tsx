'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CommentSection } from '@/components/comments/CommentSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Plus, Heart, ArrowLeft, Clock, Calendar, Star } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/lib/store';
import { mockContent } from '@/lib/mock-data';
import { Content } from '@/lib/types';

interface InfoPageProps {
  params: {
    id: string;
  };
}

export default function InfoPage({ params }: InfoPageProps) {
  const [content, setContent] = useState<Content | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);
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

    // Find content by ID
    const foundContent = mockContent.find(item => item.id === params.id);
    if (foundContent) {
      setContent(foundContent);
      loadLikeData(foundContent.id);
    } else {
      router.push('/browse');
    }
  }, [user, currentProfile, params.id, router]);

  const loadLikeData = async (contentId: string) => {
    try {
      const params = new URLSearchParams({
        targetId: contentId,
        targetType: 'movie'
      });

      if (user) {
        params.append('userId', user.uid);
      }

      const response = await fetch(`/api/likes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likes);
        setLiked(data.isLiked);
      }
    } catch (error) {
      console.error('Error loading like data:', error);
    }
  };

  const handleLike = async () => {
    if (!user || !content || liking) return;

    setLiking(true);
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          targetId: content.id,
          targetType: 'movie'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setLiked(result.liked);
        setLikeCount(result.totalLikes);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLiking(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-16">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={content.thumbnails.large}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white hover:bg-white/20"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </div>

        {/* Content Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">{content.title}</h1>
                
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {content.releaseYear}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(content.duration)}
                  </div>
                  <Badge variant="secondary" className="bg-gray-700 text-white">
                    {content.rating}
                  </Badge>
                  <div className="flex items-center text-gray-400">
                    <Heart className="w-4 h-4 mr-1" />
                    {likeCount} likes
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {content.genre.map((genre) => (
                    <Badge key={genre} variant="outline" className="border-red-600 text-red-400">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {content.description}
                </p>

                {/* Cast */}
                <div>
                  <h3 className="text-white font-semibold mb-2">Reparto</h3>
                  <p className="text-gray-400">{content.cast.join(', ')}</p>
                </div>
              </div>

              {/* Comments Section */}
              <CommentSection movieId={content.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => router.push(`/watch/${content.id}`)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Reproducir
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-white hover:bg-gray-800"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar a Mi Lista
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleLike}
                  disabled={liking}
                  className={`w-full border-gray-600 hover:bg-gray-800 ${
                    liked ? 'text-red-500 border-red-500' : 'text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${liked ? 'fill-current' : ''}`} />
                  {liked ? 'Te gusta' : 'Me gusta'} ({likeCount})
                </Button>
              </div>

              {/* Movie Poster */}
              <div className="aspect-[2/3] rounded-lg overflow-hidden">
                <img
                  src={content.thumbnails.medium}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Additional Info */}
              <div className="bg-gray-900 rounded-lg p-4 space-y-3">
                <h3 className="text-white font-semibold">Información adicional</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo:</span>
                    <span className="text-white capitalize">{content.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duración:</span>
                    <span className="text-white">{formatDuration(content.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Año:</span>
                    <span className="text-white">{content.releaseYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Clasificación:</span>
                    <span className="text-white">{content.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}