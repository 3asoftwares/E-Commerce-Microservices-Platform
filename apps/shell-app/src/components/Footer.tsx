import React from 'react';
import { useTranslation } from '../i18n/I18nContext';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('footer.copyright', { year: currentYear.toString() })}
          </p>
          <div className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <a href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400">
              {t('footer.privacy')}
            </a>
            <a href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400">
              {t('footer.terms')}
            </a>
            <a href="/help" className="hover:text-primary-600 dark:hover:text-primary-400">
              {t('footer.help')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
