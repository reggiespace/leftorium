
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 5;

  useEffect(() => {
    setPage(1);
    setComments([]);
    loadComments(1, true);
  }, [productId]);

  const loadComments = async (pageNum: number, isInitial: boolean = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const resp = await StrapiService.getComments(productId, pageNum, PAGE_SIZE);
      if (isInitial) {
        setComments(resp.data);
      } else {
        setComments(prev => [...prev, ...resp.data]);
      }
      setHasMore(resp.meta.pagination.page < resp.meta.pagination.pageCount);
    } catch (error) {
      console.error('Failed to load comments', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadComments(nextPage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      await StrapiService.submitComment(productId, newComment);
      setNewComment('');
      // Reset to first page to see the new comment (sorted by desc)
      setPage(1);
      await loadComments(1, true);
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
        {isLoading && comments.length === 0 ? (
          <div className="flex justify-center py-4">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-slate-500 italic">No comments yet. Be the first southpaw to speak up!</p>
        ) : (
          <>
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 group">
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                  {comment.user.avatar ? (
                    <img src={comment.user.avatar} alt={comment.user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-slate-400">{comment.user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{comment.user.username}</span>
                    <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="pt-4 flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLoadMore} 
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? 'Loading...' : 'View More Comments'}
                </Button>
              </div>
            )}
          </>
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

