import { CommentWithLikeStatus } from '@/lib/models/Comment';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: CommentWithLikeStatus[];
  loading: boolean;
  onCommentUpdated: (comment: CommentWithLikeStatus) => void;
  onCommentDeleted: (commentId: string) => void;
  onLikeToggled: (commentId: string, liked: boolean, totalLikes: number) => void;
}

export function CommentList({
  comments,
  loading,
  onCommentUpdated,
  onCommentDeleted,
  onLikeToggled
}: CommentListProps) {
  if (loading && comments.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex space-x-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-1/4" />
              <div className="h-16 bg-gray-700 rounded" />
              <div className="h-4 bg-gray-700 rounded w-1/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id?.toString()}
          comment={comment}
          onCommentUpdated={onCommentUpdated}
          onCommentDeleted={onCommentDeleted}
          onLikeToggled={onLikeToggled}
        />
      ))}
    </div>
  );
}