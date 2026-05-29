import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '', size = 24 }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 size={size} className="animate-spin text-brand-500" />
    </div>
  );
};

export const SkeletonRow: React.FC = () => {
  return (
    <div className="animate-pulse flex space-x-4 py-4 px-6 border-b border-slate-100 dark:border-slate-800">
      <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-10 w-10"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 align-middle self-center"></div>
    </div>
  );
};
