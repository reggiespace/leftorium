import { useCallback, useEffect, useState } from 'react';

// Likes are decorative, not a real vote count: there's no registration
// story yet, so nothing is written to Strapi. Clicking Like just adds 1
// to the product's seed count in *your* browser (localStorage), so it
// survives navigation and reloads for you, but never syncs anywhere else.
const STORAGE_KEY = 'leftorium.likes';

function readLikedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeLikedSet(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // localStorage unavailable (private mode, etc.) — likes just won't persist.
  }
}

export function useLikes() {
  const [liked, setLiked] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setLiked(readLikedSet());
  }, []);

  const isLiked = useCallback((id: string) => liked.has(id), [liked]);

  const toggleLike = useCallback((id: string) => {
    setLiked((prev) => {
      const next = new Set<string>(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeLikedSet(next);
      return next;
    });
  }, []);

  const displayLikes = useCallback(
    (id: string, seedLikes: number) => seedLikes + (liked.has(id) ? 1 : 0),
    [liked]
  );

  return { isLiked, toggleLike, displayLikes };
}
