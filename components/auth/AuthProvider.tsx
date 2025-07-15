'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { watchProgressService } from '@/lib/watch-progress';
import { useAppStore } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser: setStoreUser } = useAppStore();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setStoreUser(user ? {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        profiles: [],
        preferences: {
          theme: 'dark',
          language: 'en',
          autoplay: true,
          qualityPreference: 'auto'
        },
        watchHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      } : null);
      setLoading(false);
      
      // Cleanup watch progress service when user signs out
      if (!user) {
        watchProgressService.cleanup();
      }
    });

    return unsubscribe;
  }, [setStoreUser]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}