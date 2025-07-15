import { useState, useEffect } from 'react';
import { CommentWithLikeStatus } from '@/lib/models/Comment';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface CommentSectionProps {
  movieId: string;
  className?: string;
}

export function CommentSection({ movieId, className = '' }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithLikeStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();

  const fetchComments = async (pageNum: number = 1, append: boolean = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        movieId,
        page: pageNum.toString(),
        limit: '10'
      });

      if (user) {
        params.append('userId', user.uid);
      }

      const response = await fetch(`/api/comments?${params}`);
      const data = await response.json();

      if (response.ok) {
        if (append) {
          setComments(prev => [...prev, ...data.comments]);
        } else {
          setComments(data.comments);
        }
        setHasMore(data.hasMore);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      fetchComments();
    }
  }, [movieId, isExpanded, user]);

  const handleCommentAdded = (newComment: CommentWithLikeStatus) => {
    setComments(prev => [newComment, ...prev]);
    setTotal(prev => prev + 1);
  };

  const handleCommentUpdated = (updatedComment: CommentWithLikeStatus) => {
    setComments(prev =>
      prev.map(comment =>
        comment._id?.toString() === updatedComment._id?.toString()
          ? updatedComment
          : comment
      )
    );
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment._id?.toString() !== commentId));
    setTotal(prev => prev - 1);
  };

  const handleLikeToggled = (commentId: string, liked: boolean, totalLikes: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment._id?.toString() === commentId
          ? { ...comment, isLikedByUser: liked, likes: totalLikes }
          : comment
      )
    );
  };

  const loadMoreComments = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage, true);
  };

  return (
    <div className={`bg-gray-900 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-white hover:bg-gray-800"
        >
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">
              Comentarios {total > 0 && `(${total})`}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Comment Form */}
          {user && (
            <CommentForm
              movieId={movieId}
              onCommentAdded={handleCommentAdded}
            />
          )}

          {/* Comments List */}
          <CommentList
            comments={comments}
            loading={loading}
            onCommentUpdated={handleCommentUpdated}
            onCommentDeleted={handleCommentDeleted}
            onLikeToggled={handleLikeToggled}
          />

          {/* Load More Button */}
          {hasMore && comments.length > 0 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={loadMoreComments}
                disabled={loading}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                {loading ? 'Cargando...' : 'Cargar más comentarios'}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && comments.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {user
                  ? 'Sé el primero en comentar esta película'
                  : 'Inicia sesión para ver y escribir comentarios'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}