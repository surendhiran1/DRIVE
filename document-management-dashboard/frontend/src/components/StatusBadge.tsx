import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, Hourglass } from 'lucide-react';

interface StatusBadgeProps {
  status: 'complete' | 'failed' | 'uploading' | 'pending' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case 'complete':
    case 'success':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
          <CheckCircle2 size={12} />
          Complete
        </span>
      );
    case 'failed':
    case 'error':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800">
          <AlertCircle size={12} />
          Failed
        </span>
      );
    case 'uploading':
    case 'processing':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
          <Loader2 size={12} className="animate-spin" />
          Uploading
        </span>
      );
    case 'pending':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-850">
          <Hourglass size={12} />
          Pending
        </span>
      );
  }
};
