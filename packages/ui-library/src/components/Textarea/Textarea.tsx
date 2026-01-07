import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-white resize-none ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
);

Textarea.displayName = 'Textarea';
