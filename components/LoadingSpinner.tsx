import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin" />
        <p className="font-mono-tag text-xs text-ink-faint">Loading leftorium.ca…</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
