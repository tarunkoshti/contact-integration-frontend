import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, UserPlus, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const links = [
    {
      to: '/',
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
    <aside className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 gap-2.5">
        <div className="bg-sky-100 border border-sky-200 p-1.5 rounded-lg text-sky-600">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className="font-bold text-slate-800 tracking-wider text-sm uppercase">
          Contacts Integrator
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
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

      <div className="p-4 border-t border-slate-200 text-center">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
          Version 1.0.0
        </p>
      </div>
    </aside>
  );
}
