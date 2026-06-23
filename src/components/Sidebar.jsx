import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Mail, UserPlus, ShieldCheck, LogOut, FolderPlus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const links = [
    {
      to: '/',
      label: 'Create Project',
      icon: FolderPlus,
    },
    {
      to: '/gmail-accounts',
      label: 'Gmail Accounts',
      icon: Mail,
    },
    {
      to: '/create-contact',
      label: 'Contact Form',
      icon: UserPlus,
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 min-h-screen transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="bg-sky-100 border border-sky-200 p-1.5 rounded-lg text-sky-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 tracking-wider text-sm uppercase">
            Contacts Integrator
          </span>
        </div>
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 cursor-pointer flex items-center justify-center focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={true}
              onClick={() => setIsOpen(false)} // Close sidebar drawer when clicking a link on mobile/tablet
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 group cursor-pointer ${isActive
                  ? 'bg-sky-100/80 text-sky-700 border border-sky-200/50 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40 border border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-105" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 flex flex-col gap-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-150 cursor-pointer w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest text-center mt-1">
          Version 1.0.0
        </p>
      </div>
    </aside>
  );
}
