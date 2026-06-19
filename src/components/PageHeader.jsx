import React from 'react';

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 m-0 md:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
