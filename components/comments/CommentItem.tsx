import { useState } from 'react';
import { CommentWithLikeStatus } from '@/lib/models/Comment';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Heart, MoreVertical, Edit, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface CommentItemProps {
  comment: CommentWithLikeStatus;
  onCommentUpdated: (comment: CommentWithLikeStatus) => void;
  onCommentDeleted: (commentId: string) => void;
  onLikeToggled: (commentId: string, liked: boolean, totalLikes: number) => void;
}

export function CommentItem({
  comment,
  onCommentUpdated,
  onCommentDeleted,
  onLikeToggled
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [liking, setLiking] = useState(false);
  const { user } = useAuth();

  const isOwner = user?.uid === comment.userId;

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent.trim(),
          userId: user?.uid
        }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        onCommentUpdated({
          ...updatedComment,
          isLikedByUser: comment.isLikedByUser
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${comment._id}?userId=${user?.uid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onCommentDeleted(comment._id!.toString());
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || liking) return;

    setLiking(true);
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          targetId: comment._id!.toString(),
          targetType: 'comment'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        onLikeToggled(comment._id!.toString(), result.liked, result.totalLikes);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLiking(false);
    }
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: es
    });
  };

  return (
    <div className="flex space-x-3">
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className="bg-red-600 text-white">
          {comment.userDisplayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-white">{comment.userDisplayName}</span>
            <span className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
              {comment.updatedAt > comment.createdAt && ' (editado)'}
            </span>
          </div>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem
                  onClick={() => setIsEditing(true)}
                  className="text-white hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-400 hover:bg-gray-700"
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
              maxLength={1000}
            />
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={!editContent.trim() || loading}
                className="bg-red-600 hover:bg-red-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Guardar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-1 text-gray-300 whitespace-pre-wrap">{comment.content}</p>
            
            <div className="mt-2 flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={!user || liking}
                className={`text-gray-400 hover:text-red-400 ${
                  comment.isLikedByUser ? 'text-red-500' : ''
                }`}
              >
                <Heart
                  className={`w-4 h-4 mr-1 ${
                    comment.isLikedByUser ? 'fill-current' : ''
                  }`}
                />
                {comment.likes > 0 && comment.likes}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}