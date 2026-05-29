import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Bell, Shield, HelpCircle } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const links = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/documents', label: 'Documents', icon: <FileText size={18} /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="h-9 w-9 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <Shield size={20} className="stroke-[2.5]" />
        </div>
        <div>
          <span className="font-bold text-base text-slate-800 dark:text-white leading-none tracking-tight block">DocuFlow</span>
          <span className="text-[10px] font-semibold text-brand-500 uppercase tracking-widest mt-0.5 block">Enterprise</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center gap-3">
          <HelpCircle size={16} className="text-slate-400 dark:text-slate-500" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 truncate">Need Help?</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Read documentation</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
