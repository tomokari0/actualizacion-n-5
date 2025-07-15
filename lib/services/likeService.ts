import { getDatabase } from '@/lib/mongodb';
import { Like, CreateLikeData } from '@/lib/models/Like';
import { ObjectId } from 'mongodb';

export class LikeService {
  private static async getCollection() {
    const db = await getDatabase();
    return db.collection<Like>('likes');
  }

  static async toggleLike(data: CreateLikeData): Promise<{ liked: boolean, totalLikes: number }> {
    const collection = await this.getCollection();
    
    // Check if like already exists
    const existingLike = await collection.findOne({
      userId: data.userId,
      targetId: data.targetId,
      targetType: data.targetType
    });

    if (existingLike) {
      // Remove like
      await collection.deleteOne({ _id: existingLike._id });
      
      // Update like count in target
      if (data.targetType === 'comment') {
        const { CommentService } = await import('./commentService');
        await CommentService.decrementLikes(data.targetId);
      } else if (data.targetType === 'movie') {
        await this.decrementMovieLikes(data.targetId);
      }
      
      const totalLikes = await this.getLikeCount(data.targetId, data.targetType);
      return { liked: false, totalLikes };
    } else {
      // Add like
      const like: Omit<Like, '_id'> = {
        ...data,
        createdAt: new Date()
      };
      
      await collection.insertOne(like);
      
      // Update like count in target
      if (data.targetType === 'comment') {
        const { CommentService } = await import('./commentService');
        await CommentService.incrementLikes(data.targetId);
      } else if (data.targetType === 'movie') {
        await this.incrementMovieLikes(data.targetId);
      }
      
      const totalLikes = await this.getLikeCount(data.targetId, data.targetType);
      return { liked: true, totalLikes };
    }
  }

  static async getLikeCount(targetId: string, targetType: 'movie' | 'comment'): Promise<number> {
    const collection = await this.getCollection();
    
    return await collection.countDocuments({
      targetId,
      targetType
    });
  }

  static async isLikedByUser(userId: string, targetId: string, targetType: 'movie' | 'comment'): Promise<boolean> {
    const collection = await this.getCollection();
    
    const like = await collection.findOne({
      userId,
      targetId,
      targetType
    });

    return !!like;
  }

  static async getUserLikes(userId: string, targetIds: string[], targetType: 'movie' | 'comment'): Promise<string[]> {
    const collection = await this.getCollection();
    
    const likes = await collection.find({
      userId,
      targetId: { $in: targetIds },
      targetType
    }).toArray();

    return likes.map(like => like.targetId);
  }

  private static async incrementMovieLikes(movieId: string): Promise<void> {
    const db = await getDatabase();
    const moviesCollection = db.collection('movies');
    
    await moviesCollection.updateOne(
      { _id: new ObjectId(movieId) },
      { $inc: { likes: 1 } }
    );
  }

  private static async decrementMovieLikes(movieId: string): Promise<void> {
    const db = await getDatabase();
    const moviesCollection = db.collection('movies');
    
    await moviesCollection.updateOne(
      { _id: new ObjectId(movieId) },
      { $inc: { likes: -1 } }
    );
  }
}