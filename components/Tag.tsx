import React from 'react';
import { cn } from '../lib/utils';

// The whole site's one joke hinges on this staying quiet: REAL and AI tags
// look the same at a glance (same neutral border/muted text), so you have
// to actually read the product to tell which is which.
export const Tag: React.FC<{ isReal: boolean; className?: string }> = ({ isReal, className }) => (
  <span
    className={cn(
      'font-mono-tag text-[10px] tracking-[0.1em] uppercase rounded border border-border text-ink-faint px-1.5 py-0.5',
      className
    )}
  >
    {isReal ? 'Real' : 'AI'}
  </span>
);

export const formatCount = (n: number): string => n.toLocaleString('en-US');
