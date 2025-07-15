import { ObjectId } from 'mongodb';

export interface Comment {
  _id?: ObjectId;
  userId: string;
  movieId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  userDisplayName: string;
  userAvatar?: string;
}

export interface CommentWithLikeStatus extends Comment {
  isLikedByUser: boolean;
}

export interface CreateCommentData {
  userId: string;
  movieId: string;
  content: string;
  userDisplayName: string;
  userAvatar?: string;
}

export interface UpdateCommentData {
  content: string;
  updatedAt: Date;
}