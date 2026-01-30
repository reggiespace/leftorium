import { Info, Star } from "lucide-react";
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
      await StrapiService.submitRating(productId, score, leftoriumUserId, existingRatingId);
      
      let newCount = count;
      let newAvg = avg;

      if (!existingRatingId) {
        newCount = count + 1;
        newAvg = ((avg * count) + score) / newCount;
      } else {
        newAvg = ((avg * count) - (userRating || 0) + score) / count;
      }

      setUserRating(score);
      setAvg(newAvg);
      setCount(newCount);
      
      if (!existingRatingId) {
        const res = await StrapiService.getUserRating(productId, leftoriumUserId);
        if (res) setExistingRatingId(res.id);
      }

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
            <Star 
              className={`h-6 w-6 transition-colors ${
                star <= currentScore
                  ? 'text-primary fill-primary' 
                  : 'text-muted-foreground fill-none'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-black text-muted-foreground italic">
          {avg.toFixed(1)} ({count} {count === 1 ? 'vote' : 'votes'})
        </span>
      </div>
      {interactive && !userId && (
        <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 flex items-center gap-1">
          <Info className="h-3 w-3" />
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
