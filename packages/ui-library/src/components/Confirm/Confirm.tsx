import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../../components/Button';
import React from 'react';
import { faExclamation, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export interface ConfirmProps {
  open: boolean;
  title?: string;
  message: any;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  loadingText?: string;
}

export const Confirm: React.FC<ConfirmProps> = ({
  open,
  title = 'Confirm',
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  onConfirm,
  onCancel,
  loading = false,
  loadingText = 'Processing...',
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="mb-6 text-gray-700 dark:text-gray-200 text-base leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            loading={loading}
          >
            {loading ? loadingText : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
