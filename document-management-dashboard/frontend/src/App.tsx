import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store/useAppStore.js';
import AppLayout from './components/AppLayout.js';
import Dashboard from './pages/Dashboard.js';
import Documents from './pages/Documents.js';
import Notifications from './pages/Notifications.js';

export const App: React.FC = () => {
  const initializeSocketListeners = useAppStore((state) => state.initializeSocketListeners);
  const fetchDocuments = useAppStore((state) => state.fetchDocuments);
  const fetchNotifications = useAppStore((state) => state.fetchNotifications);
  const darkMode = useAppStore((state) => state.darkMode);

  // Initialize Socket events and fetch initial state data
  useEffect(() => {
    initializeSocketListeners();
    fetchDocuments();
    fetchNotifications();
  }, [initializeSocketListeners, fetchDocuments, fetchNotifications]);

  // Set up initial HTML class for dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      {/* Toast Notification Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-semibold dark:bg-slate-900 dark:text-slate-100 dark:border dark:border-slate-800',
          duration: 4000,
          style: {
            borderRadius: '12px',
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="notifications" element={<Notifications />} />
          {/* Fallback redirect to dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
