import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Profile, Content } from './types';

interface AppState {
  user: User | null;
  currentProfile: Profile | null;
  isAuthenticated: boolean;
  content: Content[];
  watchHistory: any[];
  
  // Actions
  setUser: (user: User | null) => void;
  setCurrentProfile: (profile: Profile | null) => void;
  setContent: (content: Content[]) => void;
  addToWatchHistory: (item: any) => void;
  updateProgress: (contentId: string, progress: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      currentProfile: null,
      isAuthenticated: false,
      content: [],
      watchHistory: [],

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setCurrentProfile: (profile) => set({ currentProfile: profile }),
      setContent: (content) => set({ content }),
      addToWatchHistory: (item) => {
        const { watchHistory } = get();
        set({ watchHistory: [...watchHistory, item] });
      },
      updateProgress: (contentId, progress) => {
        // This is now handled by the WatchProgressService
        // Keeping for backward compatibility
      },
    }),
    {
      name: 'netflix-app-store',
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
    }
  )
);