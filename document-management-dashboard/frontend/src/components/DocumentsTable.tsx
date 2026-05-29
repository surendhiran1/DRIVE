import React from 'react';
import { Download, FileText, Calendar, HardDrive } from 'lucide-react';
import { useAppStore, Document } from '../store/useAppStore.js';
import { formatBytes } from './UploadCard.js';
import { StatusBadge } from './StatusBadge.js';
import { SkeletonRow } from './LoadingSpinner.js';
import { EmptyState } from './EmptyState.js';
import api from '../services/api.js';

interface DocumentsTableProps {
  limit?: number;
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const DocumentsTable: React.FC<DocumentsTableProps> = ({ limit }) => {
  const { documents, searchQuery, loadingDocs } = useAppStore();

  // Filter documents by search query
  const filteredDocuments = documents.filter((doc) =>
    doc.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayDocuments = limit ? filteredDocuments.slice(0, limit) : filteredDocuments;

  const handleDownload = (id: string) => {
    // Generate full download link and trigger download in browser
    const url = `${api.defaults.baseURL}/documents/${id}/download`;
    window.open(url, '_blank');
  };

  if (loadingDocs) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="h-12 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
        </div>
        <div>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  if (displayDocuments.length === 0) {
    return (
      <EmptyState
        title="No documents found"
        description={
          searchQuery
            ? `We couldn't find any documents matching "${searchQuery}"`
            : "You haven't uploaded any PDF files yet. Drag some files into the dashboard upload zone to get started."
        }
        icon={<HardDrive size={40} className="text-slate-350 dark:text-slate-500" />}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4.5">File Name</th>
              <th className="px-6 py-4.5">File Size</th>
              <th className="px-6 py-4.5">Upload Date</th>
              <th className="px-6 py-4.5">Status</th>
              <th className="px-6 py-4.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {displayDocuments.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
              >
                {/* Filename */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-50/50 text-brand-500 rounded-lg dark:bg-brand-950/20 dark:text-brand-400">
                      <FileText size={18} />
                    </div>
                    <div className="font-semibold text-slate-700 dark:text-slate-200 max-w-xs md:max-w-sm truncate" title={doc.originalName}>
                      {doc.originalName}
                    </div>
                  </div>
                </td>

                {/* Size */}
                <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-medium">
                  {formatBytes(doc.size)}
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-slate-500 dark:text-slate-450">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{formatDate(doc.createdAt)}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={doc.uploadStatus} />
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDownload(doc.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-850 hover:border-brand-500 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-950/10 transition-all cursor-pointer"
                    title="Download PDF"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DocumentsTable;
