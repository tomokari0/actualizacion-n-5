import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { WatchHistory, Content } from './types';

export class WatchProgressService {
  private static instance: WatchProgressService;
  private progressUpdateInterval: NodeJS.Timeout | null = null;
  private unsubscribeListeners: Unsubscribe[] = [];

  static getInstance(): WatchProgressService {
    if (!WatchProgressService.instance) {
      WatchProgressService.instance = new WatchProgressService();
    }
    return WatchProgressService.instance;
  }

  // Save or update watch progress
  async saveProgress(
    userId: string,
    profileId: string,
    content: Content,
    progressSeconds: number,
    episodeId?: string,
    seasonNumber?: number,
    episodeNumber?: number
  ): Promise<void> {
    if (!db) return;

    const progressPercent = (progressSeconds / (content.duration * 60)) * 100;
    const isCompleted = progressPercent >= 90; // Consider 90% as completed

    const watchHistoryId = episodeId 
      ? `${userId}_${profileId}_${content.id}_${episodeId}`
      : `${userId}_${profileId}_${content.id}`;

    const watchHistory: Omit<WatchHistory, 'watchedAt'> & { watchedAt: any } & Record<string, any> = {
      contentId: content.id,
      profileId,
      userId,
      progress: progressPercent,
      progressSeconds,
      completed: isCompleted,
      thumbnail: content.thumbnails.medium,
      title: content.title,
      type: content.type,
      duration: content.duration * 60, // Convert to seconds
      watchedAt: serverTimestamp()
    };

    // Only include episode-related fields if they are defined
    if (episodeId !== undefined) {
      watchHistory.episodeId = episodeId;
    }
    if (seasonNumber !== undefined) {
      watchHistory.seasonNumber = seasonNumber;
    }
    if (episodeNumber !== undefined) {
      watchHistory.episodeNumber = episodeNumber;
    }

    try {
      await setDoc(doc(db, 'watchHistory', watchHistoryId), watchHistory, { merge: true });
    } catch (error) {
      console.error('Error saving watch progress:', error);
    }
  }

  // Get watch progress for specific content
  async getProgress(
    userId: string,
    profileId: string,
    contentId: string,
    episodeId?: string
  ): Promise<WatchHistory | null> {
    if (!db) return null;

    const watchHistoryId = episodeId 
      ? `${userId}_${profileId}_${contentId}_${episodeId}`
      : `${userId}_${profileId}_${contentId}`;

    try {
      const docRef = doc(db, 'watchHistory', watchHistoryId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          watchedAt: data.watchedAt?.toDate() || new Date()
        } as WatchHistory;
      }
      return null;
    } catch (error) {
      console.error('Error getting watch progress:', error);
      return null;
    }
  }

  // Get continue watching list for a profile
  async getContinueWatching(
    userId: string,
    profileId: string,
    limitCount: number = 10
  ): Promise<WatchHistory[]> {
    if (!db) return [];

    try {
      const q = query(
        collection(db, 'watchHistory'),
        where('userId', '==', userId),
        where('profileId', '==', profileId),
        where('completed', '==', false),
        where('progress', '>', 5), // Only show if watched more than 5%
        orderBy('watchedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const continueWatching: WatchHistory[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        continueWatching.push({
          ...data,
          watchedAt: data.watchedAt?.toDate() || new Date()
        } as WatchHistory);
      });

      return continueWatching;
    } catch (error) {
      console.error('Error getting continue watching:', error);
      return [];
    }
  }

  // Real-time listener for continue watching updates
  subscribeToContinueWatching(
    userId: string,
    profileId: string,
    callback: (watchHistory: WatchHistory[]) => void,
    limitCount: number = 10
  ): Unsubscribe | null {
    if (!db) return null;

    try {
      const q = query(
        collection(db, 'watchHistory'),
        where('userId', '==', userId),
        where('profileId', '==', profileId),
        where('completed', '==', false),
        where('progress', '>', 5),
        orderBy('watchedAt', 'desc'),
        limit(limitCount)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const continueWatching: WatchHistory[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          continueWatching.push({
            ...data,
            watchedAt: data.watchedAt?.toDate() || new Date()
          } as WatchHistory);
        });
        callback(continueWatching);
      });

      this.unsubscribeListeners.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to continue watching:', error);
      return null;
    }
  }

  // Start auto-save progress (every 10 seconds)
  startAutoSave(
    userId: string,
    profileId: string,
    content: Content,
    getCurrentTime: () => number,
    episodeId?: string,
    seasonNumber?: number,
    episodeNumber?: number
  ): void {
    this.stopAutoSave(); // Clear any existing interval

    this.progressUpdateInterval = setInterval(async () => {
      const currentTime = getCurrentTime();
      if (currentTime > 0) {
        await this.saveProgress(
          userId,
          profileId,
          content,
          currentTime,
          episodeId,
          seasonNumber,
          episodeNumber
        );
      }
    }, 10000); // Save every 10 seconds
  }

  // Stop auto-save progress
  stopAutoSave(): void {
    if (this.progressUpdateInterval) {
      clearInterval(this.progressUpdateInterval);
      this.progressUpdateInterval = null;
    }
  }

  // Mark content as completed
  async markAsCompleted(
    userId: string,
    profileId: string,
    contentId: string,
    episodeId?: string
  ): Promise<void> {
    if (!db) return;

    const watchHistoryId = episodeId 
      ? `${userId}_${profileId}_${contentId}_${episodeId}`
      : `${userId}_${profileId}_${contentId}`;

    try {
      await setDoc(
        doc(db, 'watchHistory', watchHistoryId),
        {
          completed: true,
          progress: 100,
          watchedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error marking as completed:', error);
    }
  }

  // Remove from continue watching
  async removeFromContinueWatching(
    userId: string,
    profileId: string,
    contentId: string,
    episodeId?: string
  ): Promise<void> {
    await this.markAsCompleted(userId, profileId, contentId, episodeId);
  }

  // Get watch history for a profile (completed items)
  async getWatchHistory(
    userId: string,
    profileId: string,
    limitCount: number = 50
  ): Promise<WatchHistory[]> {
    if (!db) return [];

    try {
      const q = query(
        collection(db, 'watchHistory'),
        where('userId', '==', userId),
        where('profileId', '==', profileId),
        orderBy('watchedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const watchHistory: WatchHistory[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        watchHistory.push({
          ...data,
          watchedAt: data.watchedAt?.toDate() || new Date()
        } as WatchHistory);
      });

      return watchHistory;
    } catch (error) {
      console.error('Error getting watch history:', error);
      return [];
    }
  }

  // Cleanup listeners
  cleanup(): void {
    this.stopAutoSave();
    this.unsubscribeListeners.forEach(unsubscribe => unsubscribe());
    this.unsubscribeListeners = [];
  }
}

// Export singleton instance
export const watchProgressService = WatchProgressService.getInstance();