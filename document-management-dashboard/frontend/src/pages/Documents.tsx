import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import DocumentsTable from '../components/DocumentsTable.js';
import { FileText } from 'lucide-react';

export const Documents: React.FC = () => {
  const { documents, fetchDocuments } = useAppStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const totalFiles = documents.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title block */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">Document Repository</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, and download your uploaded files.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <FileText size={16} className="text-brand-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {totalFiles} Total PDF{totalFiles !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Main File Table */}
      <DocumentsTable />
    </div>
  );
};
export default Documents;
