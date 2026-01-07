/**
 * Cookie utility functions for secure authentication storage
 */

export interface CookieOptions {
  expires?: number; // days
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

const DEFAULT_OPTIONS: CookieOptions = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
};

/**
 * Set a cookie with the given name, value, and options
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  if (typeof document === 'undefined') return;

  const opts = { ...DEFAULT_OPTIONS, ...options };
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (opts.expires) {
    const date = new Date();
    date.setTime(date.getTime() + opts.expires * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  if (opts.path) {
    cookieString += `; path=${opts.path}`;
  }

  if (opts.domain) {
    cookieString += `; domain=${opts.domain}`;
  }

  if (opts.secure) {
    cookieString += '; secure';
  }

  if (opts.sameSite) {
    cookieString += `; samesite=${opts.sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

/**
 * Remove a cookie by name
 */
export const removeCookie = (name: string, options: CookieOptions = {}): void => {
  if (typeof document === 'undefined') return;

  const opts = { ...DEFAULT_OPTIONS, ...options };
  setCookie(name, '', { ...opts, expires: -1 });
};

/**
 * Check if cookies are enabled in the browser
 */
export const areCookiesEnabled = (): boolean => {
  if (typeof document === 'undefined') return false;

  try {
    document.cookie = 'cookietest=1';
    const result = document.cookie.indexOf('cookietest=') !== -1;
    document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
    return result;
  } catch {
    return false;
  }
};

// Cookie names for auth data
export const AUTH_COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRY: 'tokenExpiry',
  USER: 'user',
} as const;
