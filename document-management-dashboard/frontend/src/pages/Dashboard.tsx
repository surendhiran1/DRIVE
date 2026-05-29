import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Files, HardDrive, BellRing, ArrowRight, Loader2, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore.js';
import UploadZone from '../components/UploadZone.js';
import UploadCard from '../components/UploadCard.js';
import DocumentsTable from '../components/DocumentsTable.js';
import ProgressBar from '../components/ProgressBar.js';
import { formatBytes } from '../components/UploadCard.js';

export const Dashboard: React.FC = () => {
  const {
    documents,
    notifications,
    uploadProgress,
    activeSession,
    fetchDocuments,
    fetchNotifications,
  } = useAppStore();

  useEffect(() => {
    fetchDocuments();
    fetchNotifications();
  }, [fetchDocuments, fetchNotifications]);

  // Calculations for stats
  const totalDocs = documents.length;
  const totalStorage = documents.reduce((sum, doc) => sum + doc.size, 0);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const uploadProgressKeys = Object.keys(uploadProgress);
  const hasActiveUploads = uploadProgressKeys.length > 0;

  // Session progress calculations
  const sessionProgress = activeSession
    ? Math.round((activeSession.completedFiles * 100) / activeSession.totalFiles)
    : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-brand-500/10">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-lg space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome to DocuFlow!</h2>
          <p className="text-white/80 text-sm font-medium leading-relaxed">
            Upload, store, and manage your PDF document registry securely. Experience real-time bulk upload notifications and responsive storage indexation.
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Documents */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-500 dark:bg-blue-950/30 dark:text-blue-400 rounded-2xl">
            <Files size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">Total Documents</span>
            <span className="text-2xl font-bold text-slate-850 dark:text-white mt-1 block">
              {totalDocs}
            </span>
          </div>
        </div>

        {/* Total Storage Used */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-2xl">
            <HardDrive size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">Storage Used</span>
            <span className="text-2xl font-bold text-slate-850 dark:text-white mt-1 block">
              {formatBytes(totalStorage)}
            </span>
          </div>
        </div>

        {/* Unread Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
          <div className="p-4 bg-rose-50 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400 rounded-2xl">
            <BellRing size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">Unread Alerts</span>
            <span className="text-2xl font-bold text-slate-850 dark:text-white mt-1 block">
              {unreadNotifs}
            </span>
          </div>
        </div>
      </div>

      {/* Upload Zone & Slices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Upload Documents</h3>
            <UploadZone />
          </div>

          {/* Collapsed Bulk Processing Mode */}
          {activeSession && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse-slow">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-brand-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-wider">Processing Session</span>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {sessionProgress}% Completed
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Uploading files in background
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Completed {activeSession.completedFiles} of {activeSession.totalFiles} files.
                </p>
              </div>

              <ProgressBar progress={sessionProgress} color="bg-brand-500" />
            </div>
          )}

          {/* Standard progress card list (<=3 files or prior to redirection) */}
          {!activeSession && hasActiveUploads && (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Activity</span>
                <button
                  onClick={() => useAppStore.getState().clearUploadProgress()}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer"
                >
                  Clear history
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto pr-1 space-y-3.5">
                {uploadProgressKeys.map((id) => (
                  <UploadCard key={id} item={uploadProgress[id]} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Uploads Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Recent Uploads</h3>
            <Link
              to="/documents"
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              See all files
              <ArrowRight size={14} />
            </Link>
          </div>
          <DocumentsTable limit={5} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
