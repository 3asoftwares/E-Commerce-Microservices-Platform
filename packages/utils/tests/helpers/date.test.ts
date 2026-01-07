import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  addDays,
  addHours,
  getDaysDifference,
  isDateInRange,
  isFutureDate,
  isPastDate,
} from '../../src/helpers';

describe('Date Utilities', () => {
  const fixedDate = new Date('2024-06-15T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toContain('01');
      expect(formatDate(date)).toContain('15');
    });

    it('should format date with custom format', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date, 'YYYY-MM-DD');
      expect(formatted).toBe('2024-01-15');
    });
  });

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2024-01-15');
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should handle negative days', () => {
      const date = new Date('2024-01-15');
      const result = addDays(date, -5);
      expect(result.getDate()).toBe(10);
    });
  });

  describe('addHours', () => {
    it('should add hours to date', () => {
      const date = new Date('2024-01-15T10:00:00');
      const result = addHours(date, 5);
      expect(result.getHours()).toBe(15);
    });
  });

  describe('getDaysDifference', () => {
    it('should calculate days between dates', () => {
      const date1 = new Date('2024-01-10');
      const date2 = new Date('2024-01-15');
      expect(getDaysDifference(date1, date2)).toBe(5);
    });

    it('should return positive value regardless of order', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-10');
      expect(getDaysDifference(date1, date2)).toBe(5);
    });
  });

  describe('isDateInRange', () => {
    it('should return true if date is in range', () => {
      const date = new Date('2024-01-15');
      const start = new Date('2024-01-10');
      const end = new Date('2024-01-20');
      expect(isDateInRange(date, start, end)).toBe(true);
    });

    it('should return false if date is outside range', () => {
      const date = new Date('2024-01-25');
      const start = new Date('2024-01-10');
      const end = new Date('2024-01-20');
      expect(isDateInRange(date, start, end)).toBe(false);
    });

    it('should include boundary dates', () => {
      const date = new Date('2024-01-10');
      const start = new Date('2024-01-10');
      const end = new Date('2024-01-20');
      expect(isDateInRange(date, start, end)).toBe(true);
    });
  });

  describe('isFutureDate', () => {
    it('should return true for future date', () => {
      const futureDate = new Date('2024-12-31');
      expect(isFutureDate(futureDate)).toBe(true);
    });

    it('should return false for past date', () => {
      const pastDate = new Date('2024-01-01');
      expect(isFutureDate(pastDate)).toBe(false);
    });
  });

  describe('isPastDate', () => {
    it('should return true for past date', () => {
      const pastDate = new Date('2024-01-01');
      expect(isPastDate(pastDate)).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = new Date('2024-12-31');
      expect(isPastDate(futureDate)).toBe(false);
    });
  });
});
