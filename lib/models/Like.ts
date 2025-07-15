import { ObjectId } from 'mongodb';

export interface Like {
  _id?: ObjectId;
  userId: string;
  targetId: string; // Can be movieId or commentId
  targetType: 'movie' | 'comment';
  createdAt: Date;
}

export interface CreateLikeData {
  userId: string;
  targetId: string;
  targetType: 'movie' | 'comment';
}