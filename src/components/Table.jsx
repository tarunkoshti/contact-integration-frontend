import React from 'react';

export default function Table({ headers = [], children, emptyState }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {children}
          </tbody>
        </table>
      </div>
      {emptyState && (
        <div className="flex flex-col items-center justify-center p-12 text-slate-500">
          {emptyState}
        </div>
      )}
    </div>
  );
}
