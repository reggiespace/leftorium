import React, { useEffect, useState } from 'react';
import { getComments } from '../mockData';
import { StrapiService } from '../services/strapiService';
import { Comment } from '../types';

interface CommentsSectionProps {
  productId: string;
}

// Read-only for now: no registration story yet, so no comment submission.
// Curators can still add flavor comments via the Strapi admin (unauthenticated,
// moderated Leftorium Comment collection) — this falls back to the seed data
// ported from the DC prototype when Strapi has nothing for a product.
const CommentsSection: React.FC<CommentsSectionProps> = ({ productId }) => {
  const [comments, setComments] = useState<Comment[]>(() => getComments(productId));

  useEffect(() => {
    let cancelled = false;
    setComments(getComments(productId));
    StrapiService.getComments(productId)
      .then((fromStrapi) => {
        if (!cancelled && fromStrapi.length > 0) setComments(fromStrapi);
      })
      .catch(() => {
        /* keep the seed comments */
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  return (
    <div className="border-t border-border pt-[22px]">
      <p className="mb-4 font-mono-tag text-[10px] tracking-[0.14em] uppercase text-ink-faint">
        {comments.length} comments
      </p>
      <div className="flex flex-col gap-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="w-8 h-8 shrink-0 rounded-full bg-[#3f424d] grid place-items-center font-mono-tag text-[11px] text-ink-dim">
              {c.who.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-baseline gap-2.5 mb-0.5">
                <span className="text-[13.5px] font-medium">{c.who}</span>
                <span className="font-mono-tag text-[10px] text-ink-faint">{c.when}</span>
              </div>
              <p className="text-sm text-ink-dim text-pretty">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
