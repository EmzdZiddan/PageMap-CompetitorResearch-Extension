import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex-1 p-4 space-y-3 overflow-hidden animate-pulse bg-slate-50">
      {/* Skeleton Top metric row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="h-14 bg-slate-200/80 rounded-lg"></div>
        <div className="h-14 bg-slate-200/80 rounded-lg"></div>
        <div className="h-14 bg-slate-200/80 rounded-lg"></div>
      </div>

      {/* Skeleton cards */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-3 rounded-lg border border-slate-200 bg-white space-y-2.5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-3 bg-slate-200 rounded w-6"></div>
              <div className="h-3 bg-slate-200 rounded w-12"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded w-16"></div>
          </div>
          <div className="h-3 bg-slate-200/90 rounded w-3/4"></div>
          <div className="h-2.5 bg-slate-200/60 rounded w-1/2"></div>
        </div>
      ))}

      <div className="text-center pt-2 text-xs text-slate-400 font-mono">
        Extracting competitor page elements…
      </div>
    </div>
  );
};
