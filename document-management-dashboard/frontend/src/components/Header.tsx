import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore.js';
import NotificationBell from './NotificationBell.js';

export const Header: React.FC = () => {
  const location = useLocation();
  const darkMode = useAppStore((state) => state.darkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/documents':
        return 'Documents';
      case '/notifications':
        return 'Notifications';
      default:
        return 'DocuFlow';
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative w-64 max-md:hidden">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500 dark:focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-655 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications Icon Bell */}
        <NotificationBell />

        {/* User Divider & Profile Profile */}
        <div className="h-6 w-px bg-slate-250 dark:bg-slate-800" />

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-brand-500/20">
            JD
          </div>
          <div className="text-left max-md:hidden">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-250 leading-none">John Doe</p>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-none block mt-0.5">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
