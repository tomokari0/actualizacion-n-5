export interface User {
  id: string;
  email: string;
  displayName: string;
  profiles: Profile[];
  preferences: UserPreferences;
  watchHistory: WatchHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  language: string;
  maturityLevel: "kids" | "teen" | "adult";
}

export interface Content {
  id: string;
  type: "movie" | "series";
  title: string;
  description: string;
  thumbnails: {
    small: string;
    medium: string;
    large: string;
  };
  videoUrl: string;
  seasons?: Season[];
  duration: number;
  genre: string[];
  tags: string[];
  rating: string;
  releaseYear: number;
  cast: string[];
  featured?: boolean;
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  thumbnail: string;
  episodeNumber: number;
}

export interface WatchHistory {
  contentId: string;
  profileId: string;
  userId: string;
  watchedAt: Date;
  progress: number;
  progressSeconds: number;
  completed: boolean;
  thumbnail: string;
  title: string;
  type: 'movie' | 'series';
  episodeId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  duration: number;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: string;
  autoplay: boolean;
  qualityPreference: 'auto' | '4k' | 'hd' | 'sd';
}