import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-primary rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold text-sm animate-pulse">Loading Leftorium...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
