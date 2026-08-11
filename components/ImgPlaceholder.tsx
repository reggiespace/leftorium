import React, { useState } from 'react';
import { cn } from '../lib/utils';

// Product photos live in Garage S3 (storage.reggiespace.ca/health) once
// uploaded via Strapi — see STRAPI_SETUP.md. Until a real photo/render
// exists for a product, this renders the same labelled placeholder the
// DC prototype used, and falls back to it again if the image URL 404s.
export const ImgPlaceholder: React.FC<{
  label: string;
  src?: string;
  className?: string;
  aspect?: string;
}> = ({ label, src, className, aspect = 'aspect-[4/3]' }) => {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <div className={cn(aspect, 'overflow-hidden rounded-[14px] border border-border', className)}>
        <img
          src={src}
          alt={label}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        aspect,
        'grid place-items-center text-center p-4 rounded-[14px] border border-border',
        className
      )}
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, #262937 0 10px, #20222f 10px 20px)',
      }}
    >
      <span className="font-mono-tag text-[10px] tracking-[0.12em] uppercase text-ink-faint">{label}</span>
    </div>
  );
};
