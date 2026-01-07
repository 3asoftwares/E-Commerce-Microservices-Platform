/**
 * Helper Utilities
 * Commonly used utility functions across services and frontend apps
 */

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export const slugify = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

export const generateRandomCode = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatNumber = (num: number, decimals: number = 2): number => {
  return parseFloat(num.toFixed(decimals));
};

export const roundUp = (num: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.ceil(num * factor) / factor;
};

export const roundDown = (num: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
};

export const calculatePercentage = (value: number, percentage: number): number => {
  return formatNumber((value * percentage) / 100);
};

export const calculateDiscount = (price: number, discountPercent: number): number => {
  return formatNumber(price - (price * discountPercent) / 100);
};

export const calculateTax = (amount: number, taxRate: number): number => {
  return formatNumber(amount * taxRate);
};

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

export const removeDuplicates = <T extends Record<string, any>>(arr: T[], key: keyof T): T[] => {
  const seen = new Set();
  return arr.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

export const groupBy = <T extends Record<string, any>>(arr: T[], key: keyof T) => {
  return arr.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
  order: 'ASC' | 'DESC' = 'ASC'
): T[] => {
  const sorted = [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'ASC' ? -1 : 1;
    if (aVal > bVal) return order === 'ASC' ? 1 : -1;
    return 0;
  });
  return sorted;
};

export const flatten = <T>(arr: T[][]): T[] => {
  return arr.reduce((flat, item) => flat.concat(item), []);
};

export const difference = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter((item) => !arr2.includes(item));
};

export const intersection = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter((item) => arr2.includes(item));
};

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

export const omit = <T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

export const pick = <T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> => {
  const result: Partial<T> = {};
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const result = { ...target } as T;
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(
          (target[key] as Record<string, any>) || {},
          source[key] as Record<string, any>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }
  return result;
};

export const isEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

export const getNestedValue = <T = any>(obj: Record<string, any>, path: string): T | undefined => {
  const keys = path.split('.');
  let result: any = obj;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  return result;
};

export const setNestedValue = (obj: Record<string, any>, path: string, value: any): void => {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
};

// ============================================================================
// DATE UTILITIES
// ============================================================================

export const formatDate = (date: Date | string, format: string = 'MM/DD/YYYY'): string => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

export const isFutureDate = (date: Date): boolean => {
  return date > new Date();
};

export const isPastDate = (date: Date): boolean => {
  return date < new Date();
};

// ============================================================================
// DELAY & TIMING UTILITIES
// ============================================================================

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

export const tryParse = <T = any>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

export const withErrorHandling = async <T>(
  fn: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
};

export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  message?: string,
  statusCode: number = 200
) => {
  return {
    success,
    statusCode,
    message: message || (success ? 'Success' : 'Error'),
    data: data || (success ? {} : null),
  };
};

// ============================================================================
// RETRY UTILITIES
// ============================================================================

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await delay(delayMs * attempt);
    }
  }
  throw new Error('Retry failed');
};

// ============================================================================
// TYPE CHECKING UTILITIES
// ============================================================================

export const isString = (val: unknown): val is string => typeof val === 'string';
export const isNumber = (val: unknown): val is number => typeof val === 'number';
export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean';
export const isArray = (val: unknown): val is unknown[] => Array.isArray(val);
export const isObject = (val: unknown): val is Record<string, unknown> =>
  typeof val === 'object' && val !== null && !Array.isArray(val);
export const isFunction = (val: unknown): val is Function => typeof val === 'function';
export const isNull = (val: unknown): val is null => val === null;
export const isUndefined = (val: unknown): val is undefined => val === undefined;
export const isNullOrUndefined = (val: unknown): val is null | undefined =>
  val === null || val === undefined;

export const formatIndianCompact = (num: number = 0) => {
  if (num >= 1e7) {
    return (num / 1e7).toFixed(2).replace(/\.00$/, '') + 'Cr';
  }
  if (num >= 1e5) {
    return (num / 1e5).toFixed(2).replace(/\.00$/, '') + 'L';
  }
  return (
    '₹' +
    num?.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

export function formatPrice(price: number): string {
  return `₹${price?.toFixed(2)}`;
}

export function formatPriceShort(price: number): string {
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(1)}K`;
  }
  return `₹${price.toFixed(0)}`;
}
