import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { CommentWithLikeStatus } from '@/lib/models/Comment';

interface CommentFormProps {
  movieId: string;
  onCommentAdded: (comment: CommentWithLikeStatus) => void;
}

export function CommentForm({ movieId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          movieId,
          content: content.trim(),
          userDisplayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
          userAvatar: user.photoURL
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        onCommentAdded({
          ...newComment,
          isLikedByUser: false
        });
        setContent('');
      } else {
        const error = await response.json();
        console.error('Error creating comment:', error);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarFallback className="bg-red-600 text-white">
            {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe tu comentario..."
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
            rows={3}
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {content.length}/1000 caracteres
            </span>
            <Button
              type="submit"
              disabled={!content.trim() || loading}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? (
                'Enviando...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Comentar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}