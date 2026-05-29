import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore.js';

export const UploadZone: React.FC = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFiles = useAppStore((state) => state.uploadFiles);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const nonPdf = fileList.some(
      (file) => file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')
    );

    if (nonPdf) {
      toast.error('Invalid file type detected. Only PDF files are allowed!');
      return;
    }

    // PDF files validated
    uploadFiles(fileList);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer select-none group min-h-[220px] ${
        isDragActive
          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
          : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
      }`}
      onClick={onButtonClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="application/pdf"
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-4 rounded-full transition-colors duration-200 ${
          isDragActive 
            ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300' 
            : 'bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-brand-950/30 dark:group-hover:text-brand-400'
        }`}>
          <UploadCloud size={32} className={isDragActive ? 'animate-bounce' : ''} />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="text-brand-500 dark:text-brand-400 hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Accepts only PDF documents (Max 25MB)
          </p>
        </div>
      </div>
    </div>
  );
};
export default UploadZone;
