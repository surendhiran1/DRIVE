import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import Header from './Header.js';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main body content container */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AppLayout;
