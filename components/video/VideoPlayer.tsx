'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/lib/store';
import { watchProgressService } from '@/lib/watch-progress';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft, SkipBack, SkipForward, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  content: any; // Full content object
  onProgress?: (progress: number) => void;
  initialProgress?: number;
  episodeId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
}

export function VideoPlayer({ 
  videoUrl, 
  title, 
  content,
  onProgress, 
  initialProgress = 0,
  episodeId,
  seasonNumber,
  episodeNumber
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(initialProgress);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const { user } = useAuth();
  const { currentProfile } = useAppStore();
  const router = useRouter();
  const { t } = useTranslation();

  // Load initial progress from database
  useEffect(() => {
    const loadProgress = async () => {
      if (!user || !currentProfile || !content) return;

      const savedProgress = await watchProgressService.getProgress(
        user.uid,
        currentProfile.id,
        content.id,
        episodeId
      );

      if (savedProgress && videoRef.current) {
        const video = videoRef.current;
        video.currentTime = savedProgress.progressSeconds;
        setProgress((savedProgress.progressSeconds / video.duration) * 100);
      }
    };

    loadProgress();
  }, [user, currentProfile, content, episodeId]);

  // Start auto-save when video starts playing
  useEffect(() => {
    if (!user || !currentProfile || !content) return;

    if (isPlaying) {
      watchProgressService.startAutoSave(
        user.uid,
        currentProfile.id,
        content,
        () => videoRef.current?.currentTime || 0,
        episodeId,
        seasonNumber,
        episodeNumber
      );
    } else {
      watchProgressService.stopAutoSave();
    }

    return () => {
      watchProgressService.stopAutoSave();
    };
  }, [isPlaying, user, currentProfile, content, episodeId, seasonNumber, episodeNumber]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
      onProgress?.(currentProgress);

      // Save progress to database periodically
      if (user && currentProfile && content) {
        watchProgressService.saveProgress(
          user.uid,
          currentProfile.id,
          content,
          video.currentTime,
          episodeId,
          seasonNumber,
          episodeNumber
        );
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (initialProgress > 0) {
        video.currentTime = (initialProgress / 100) * video.duration;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      
      // Mark as completed when video ends
      if (user && currentProfile && content) {
        watchProgressService.markAsCompleted(
          user.uid,
          currentProfile.id,
          content.id,
          episodeId
        );
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      watchProgressService.stopAutoSave();
    };
  }, [initialProgress, onProgress, user, currentProfile, content, episodeId, seasonNumber, episodeNumber]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setProgress(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Create a safe filename from the title
      const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${safeTitle}.mp4`;

      // Fetch the video with progress tracking
      const response = await fetch(videoUrl);
      
      if (!response.ok) {
        throw new Error(t('player.downloadFailed'));
      }

      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength || '0', 10);
      let loaded = 0;

      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          chunks.push(value);
          loaded += value.length;
          
          if (total > 0) {
            const progress = (loaded / total) * 100;
            setDownloadProgress(progress);
          }
        }
      }

      // Create blob and download
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert(t('player.downloadFailed'));
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };
  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        playsInline
      />

      {/* Controls Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-white text-lg font-semibold">{title}</h1>
            <div />
          </div>
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/75 text-white"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[progress]}
              onValueChange={handleProgressChange}
              max={100}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-300 mt-1">
              <span>{formatTime((progress / 100) * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => skipTime(-10)}
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => skipTime(10)}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <div className="w-24">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 relative"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <Download className="w-5 h-5" />
                  {isDownloading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className="absolute inset-0 bg-white/20 rounded-full"
                        style={{
                          background: `conic-gradient(from 0deg, transparent ${downloadProgress * 3.6}deg, rgba(255,255,255,0.2) ${downloadProgress * 3.6}deg)`
                        }}
                      />
                      <span className="text-xs font-bold">
                        {Math.round(downloadProgress)}%
                      </span>
                    </div>
                  )}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}