import { Button } from '../../components/Button';
import React from 'react';

export interface InfoProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export const Info: React.FC<InfoProps> = ({ open, title = 'Info', message, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <svg
            className="w-7 h-7 text-blue-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="mb-6 text-gray-700 dark:text-gray-200 text-base leading-relaxed">{message}</p>
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
