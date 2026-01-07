import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faRightFromBracket, faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
  extraContent?: React.ReactNode;
  logoUrl?: any;
  appName?: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
  showThemeToggle?: boolean;
  showLanguageSelector?: boolean;
}

export const Header = ({
  user,
  onLogin,
  onLogout,
  onCreateAccount,
  extraContent,
  logoUrl,
  appName = '3A Softwares',
  theme = 'light',
  onToggleTheme,
  language = 'en',
  onLanguageChange,
  showThemeToggle = true,
  showLanguageSelector = true,
}: HeaderProps) => (
  <header className="fixed w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        {logoUrl ? (
          <img src={logoUrl} alt={appName} width={40} height={40} className="object-contain" />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {appName.charAt(0)}
          </div>
        )}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none m-0">
          {appName}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {showThemeToggle && onToggleTheme && (
          <Button
            onClick={onToggleTheme}
            variant="ghost"
            size="sm"
            className="text-xl px-3 !no-underline"
            aria-label="Toggle theme"
          >
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </Button>
        )}
        {showLanguageSelector && onLanguageChange && (
          <Select
            value={language}
            onChange={onLanguageChange}
            size="sm"
            variant="outline"
            options={[
              { value: 'en', label: 'EN' },
              { value: 'hi', label: 'HI' },
              { value: 'ca', label: 'CA' },
            ]}
            className="min-w-[80px]"
          />
        )}
        {extraContent}
        {user ? (
          <div className="flex gap-2 min-w-[300px] items-center justify-end">
            <span className="text-sm text-gray-700 dark:text-gray-300 mr-2.5">
              Welcome, <b className="font-bold text-gray-900 dark:text-white">{user.name}</b>!
            </span>
            <Button size="sm" className="!w-auto" onClick={onLogout} variant="outline">
              <FontAwesomeIcon icon={faRightFromBracket} className="mr-1" /> Log Out
            </Button>
          </div>
        ) : (
          <>
            <Button size="sm" onClick={onLogin} variant="outline">
              <FontAwesomeIcon icon={faRightToBracket} className="mr-1" /> Log In
            </Button>
            <Button variant="primary" size="sm" onClick={onCreateAccount}>
              <FontAwesomeIcon icon={faUserPlus} className="mr-1" /> Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  </header>
);
