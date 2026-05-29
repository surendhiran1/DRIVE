import React from 'react';

interface ProgressBarProps {
  progress: number;
  height?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 'h-2',
  color = 'bg-brand-500',
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full ${height} overflow-hidden`}>
      <div
        className={`h-full rounded-full transition-all duration-350 ease-out ${color}`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};
export default ProgressBar;
