import { getDatabase } from '@/lib/mongodb';
import { Comment, CreateCommentData, UpdateCommentData, CommentWithLikeStatus } from '@/lib/models/Comment';
import { ObjectId } from 'mongodb';

export class CommentService {
  private static async getCollection() {
    const db = await getDatabase();
    return db.collection<Comment>('comments');
  }

  static async createComment(data: CreateCommentData): Promise<Comment> {
    const collection = await this.getCollection();
    
    const comment: Omit<Comment, '_id'> = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0
    };

    const result = await collection.insertOne(comment);
    
    return {
      _id: result.insertedId,
      ...comment
    };
  }

  static async getCommentsByMovie(
    movieId: string, 
    page: number = 1, 
    limit: number = 20,
    userId?: string
  ): Promise<{ comments: CommentWithLikeStatus[], total: number, hasMore: boolean }> {
    const collection = await this.getCollection();
    const skip = (page - 1) * limit;

    // Get comments with pagination
    const comments = await collection
      .find({ movieId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count
    const total = await collection.countDocuments({ movieId });

    // Check if user has liked each comment
    let commentsWithLikeStatus: CommentWithLikeStatus[] = comments.map(comment => ({
      ...comment,
      isLikedByUser: false
    }));

    if (userId) {
      const { LikeService } = await import('./likeService');
      const commentIds = comments.map(c => c._id!.toString());
      const userLikes = await LikeService.getUserLikes(userId, commentIds, 'comment');
      
      commentsWithLikeStatus = comments.map(comment => ({
        ...comment,
        isLikedByUser: userLikes.includes(comment._id!.toString())
      }));
    }

    return {
      comments: commentsWithLikeStatus,
      total,
      hasMore: skip + comments.length < total
    };
  }

  static async updateComment(commentId: string, data: UpdateCommentData): Promise<Comment | null> {
    const collection = await this.getCollection();
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      { $set: data },
      { returnDocument: 'after' }
    );

    return result;
  }

  static async deleteComment(commentId: string, userId: string): Promise<boolean> {
    const collection = await this.getCollection();
    
    const result = await collection.deleteOne({
      _id: new ObjectId(commentId),
      userId // Ensure user can only delete their own comments
    });

    return result.deletedCount > 0;
  }

  static async incrementLikes(commentId: string): Promise<void> {
    const collection = await this.getCollection();
    
    await collection.updateOne(
      { _id: new ObjectId(commentId) },
      { $inc: { likes: 1 } }
    );
  }

  static async decrementLikes(commentId: string): Promise<void> {
    const collection = await this.getCollection();
    
    await collection.updateOne(
      { _id: new ObjectId(commentId) },
      { $inc: { likes: -1 } }
    );
  }

  static async getCommentById(commentId: string): Promise<Comment | null> {
    const collection = await this.getCollection();
    
    return await collection.findOne({ _id: new ObjectId(commentId) });
  }
}