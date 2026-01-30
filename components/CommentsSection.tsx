import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Send } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StrapiService } from '../services/strapiService';

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
    <div className="mt-16 bg-muted/30 rounded-[2.5rem] p-8 border-4 border-background shadow-inner">
      <h3 className="text-2xl font-black mb-8 flex items-center gap-3 italic">
        <MessageSquare className="h-6 w-6 text-primary" />
        Community Thoughts
      </h3>

      {/* Comment List */}
      <div className="space-y-8 mb-10">
        {isLoading && comments.length === 0 ? (
          <div className="flex justify-center py-8">
             <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-background/50 rounded-2xl p-8 text-center border-2 border-dashed border-muted">
            <p className="text-muted-foreground italic font-medium">No comments yet. Be the first southpaw to speak up!</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 group animate-in slide-in-from-bottom-2 duration-300">
                <Avatar className="size-12 border-2 border-background shadow-md">
                  {comment.user.avatar && <AvatarImage src={comment.user.avatar} alt={comment.user.username} />}
                  <AvatarFallback className="bg-primary/10 text-primary font-black">
                    {comment.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm">{comment.user.username}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="bg-background p-4 rounded-2xl rounded-tl-none border-2 border-muted/50 shadow-sm relative group-hover:border-primary/20 transition-colors">
                    <p className="text-foreground/80 text-sm leading-relaxed">{comment.content}</p>
                  </div>
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
                  className="rounded-full px-6 border-2 font-bold"
                >
                  {isLoadingMore ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {isLoadingMore ? 'Loading More...' : 'View More Comments'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="relative group">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-6 pr-32 bg-background rounded-[2rem] border-2 border-muted focus:border-primary transition-all min-h-[120px] shadow-sm"
            required
          />
          <div className="absolute bottom-4 right-4">
            <Button size="sm" type="submit" disabled={isLoading || !newComment.trim()} className="rounded-xl px-6 h-11 font-bold shadow-lg shadow-primary/20">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              {isLoading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-background/50 rounded-[2rem] p-10 text-center border-4 border-dashed border-muted">
          <p className="text-muted-foreground font-medium mb-6">You need to be logged in to join the discussion.</p>
          <Button onClick={() => navigate('/auth')} variant="default" className="rounded-full px-8 h-12 font-black italic shadow-lg shadow-primary/20">
            Log In or Sign Up
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;

