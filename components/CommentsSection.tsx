
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StrapiService } from '../services/strapiService';
import Button from './Button';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    username: string;
    avatar: string | null;
  };
}

interface CommentsSectionProps {
  productId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ productId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [productId]);

  const loadComments = async () => {
    const data = await StrapiService.getComments(productId);
    setComments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      await StrapiService.submitComment(productId, newComment);
      setNewComment('');
      await loadComments(); // Reload to see new comment
    } catch (error) {
      console.error('Failed to submit comment', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-white dark:bg-[#1a2131] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-2xl font-black mb-6">Community Thoughts</h3>

      {/* Comment List */}
      <div className="space-y-6 mb-8">
        {comments.length === 0 ? (
          <p className="text-slate-500 italic">No comments yet. Be the first southpaw to speak up!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                {comment.user.avatar ? (
                  <img src={comment.user.avatar} alt={comment.user.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-slate-400">{comment.user.username.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{comment.user.username}</span>
                  <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-4 pr-32 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-32"
            required
          />
          <div className="absolute bottom-4 right-4">
            <Button size="sm" type="submit" disabled={isLoading}>
              {isLoading ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 text-center">
          <p className="text-slate-500 mb-4">You need to be logged in to join the discussion.</p>
          <Button onClick={() => navigate('/auth')} variant="outline" size="sm">
            Log In or Sign Up
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
