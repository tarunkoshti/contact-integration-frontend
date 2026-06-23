import React from 'react';
import { Menu } from 'lucide-react';

export default function Navbar({ onMenuClick }) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 flex items-center justify-between lg:justify-end shrink-0">
      {/* Mobile Sidebar Hamburger Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none cursor-pointer flex items-center justify-center"
        aria-label="Toggle Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Admin Dashboard
        </h2>
      </div>
    </header>
  );
}
