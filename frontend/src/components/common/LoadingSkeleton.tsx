import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200 border-2 border-black" />
        ))}
      </div>
      <div className="h-64 bg-slate-200 border-2 border-black" />
      <div className="h-48 bg-slate-200 border-2 border-black" />
    </div>
  );
};
