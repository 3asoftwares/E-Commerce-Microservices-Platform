import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            © 2025 3A Softwares. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <a href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400">
              Privacy
            </a>
            <a href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400">
              Terms
            </a>
            <a href="/help" className="hover:text-primary-600 dark:hover:text-primary-400">
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
