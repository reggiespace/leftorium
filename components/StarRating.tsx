import React, { useEffect, useState } from 'react';
import { StrapiService } from '../services/strapiService';

interface StarRatingProps {
  productId: string;
  initialAvg: number;
  initialCount: number;
  interactive?: boolean;
  userId?: string;
  leftoriumUserId?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  productId, 
  initialAvg, 
  initialCount, 
  interactive = false,
  userId,
  leftoriumUserId
}) => {
  const [hover, setHover] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [existingRatingId, setExistingRatingId] = useState<string | undefined>(undefined);
  const [avg, setAvg] = useState(initialAvg);
  const [count, setCount] = useState(initialCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (interactive && leftoriumUserId) {
      StrapiService.getUserRating(productId, leftoriumUserId).then(res => {
        if (res) {
          setUserRating(res.score);
          setExistingRatingId(res.id);
        }
      });
    }
  }, [productId, leftoriumUserId, interactive]);

  const handleRate = async (score: number) => {
    if (!interactive || !leftoriumUserId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 1. Submit/Update rating
      await StrapiService.submitRating(productId, score, leftoriumUserId, existingRatingId);
      
      // 2. Calculate new average and count
      let newCount = count;
      let newAvg = avg;

      if (!existingRatingId) {
        // New rating
        newCount = count + 1;
        newAvg = ((avg * count) + score) / newCount;
      } else {
        // Update rating
        newAvg = ((avg * count) - (userRating || 0) + score) / count;
      }

      // 3. Update local state
      setUserRating(score);
      setAvg(newAvg);
      setCount(newCount);
      
      // We don't have the new rating ID yet if it's new, but we can fetch it or just assume it's there
      // For simplicity, let's re-fetch if we didn't have an ID
      if (!existingRatingId) {
        const res = await StrapiService.getUserRating(productId, leftoriumUserId);
        if (res) setExistingRatingId(res.id);
      }

      // 4. Update Strapi product stats (Best effort)
      await StrapiService.updateProductStats(productId, newAvg, newCount);
      
    } catch (error) {
      console.error('Rating failed:', error);
      alert('Failed to save your rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canVote = interactive && !!leftoriumUserId;
  const currentScore = canVote ? (hover !== null ? hover : (userRating || 0)) : avg;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!canVote || isSubmitting}
            className={`transition-all duration-200 ${
              canVote ? 'cursor-pointer hover:scale-125' : 'cursor-default'
            } ${isSubmitting ? 'opacity-50' : ''}`}
            onClick={() => handleRate(star)}
            onMouseEnter={() => canVote && setHover(star)}
            onMouseLeave={() => canVote && setHover(null)}
          >
            <span 
              className={`material-symbols-outlined text-2xl ${
                star <= currentScore
                  ? 'text-yellow-400' 
                  : 'text-slate-300 dark:text-slate-600'
              }`}
              style={{ fontVariationSettings: ` 'FILL' ${star <= currentScore ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
            >
              star
            </span>
          </button>
        ))}
        <span className="ml-2 text-sm font-bold text-slate-500">
          {avg.toFixed(1)} ({count} {count === 1 ? 'vote' : 'votes'})
        </span>
      </div>
      {interactive && !userId && (
        <p className="text-xs text-primary font-black uppercase tracking-tighter mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">info</span>
          Log in to vote
        </p>
      )}
      {interactive && userId && !userRating && !isSubmitting && (
        <p className="text-[10px] text-primary font-bold animate-pulse">Click to rate!</p>
      )}
    </div>
  );
};

export default StarRating;
