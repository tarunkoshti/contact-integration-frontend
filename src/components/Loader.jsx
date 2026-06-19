import React from 'react';

export default function Loader({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className={`rounded-full border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin ${sizeClasses[size]}`} />
        <div className={`absolute top-0 left-0 rounded-full border-slate-700/50 ${sizeClasses[size]} pointer-events-none`} />
      </div>
      {text && (
        <span className="text-sm font-medium tracking-wide text-slate-400 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}
