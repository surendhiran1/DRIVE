import React from 'react';
import { FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { UploadProgressItem } from '../store/useAppStore.js';
import ProgressBar from './ProgressBar.js';

interface UploadCardProps {
  item: UploadProgressItem;
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const UploadCard: React.FC<UploadCardProps> = ({ item }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-brand-50 text-brand-500 rounded-lg dark:bg-brand-950/30 dark:text-brand-400">
          <FileText size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-4" title={item.name}>
              {item.name}
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {formatBytes(item.size)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>
              {item.status === 'uploading' && `Uploading... ${item.progress}%`}
              {item.status === 'complete' && 'Upload completed'}
              {item.status === 'failed' && 'Upload failed'}
              {item.status === 'pending' && 'Pending...'}
            </span>
            {item.status === 'uploading' && item.speed && (
              <span className="font-mono text-brand-600 dark:text-brand-400">{item.speed}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <ProgressBar
                progress={item.progress}
                color={
                  item.status === 'failed'
                    ? 'bg-rose-500'
                    : item.status === 'complete'
                    ? 'bg-emerald-500'
                    : 'bg-brand-500'
                }
              />
            </div>
            <div>
              {item.status === 'complete' && (
                <CheckCircle size={16} className="text-emerald-500" />
              )}
              {item.status === 'failed' && (
                <AlertTriangle size={16} className="text-rose-500" />
              )}
              {item.status === 'uploading' && (
                <Loader2 size={16} className="animate-spin text-brand-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UploadCard;
