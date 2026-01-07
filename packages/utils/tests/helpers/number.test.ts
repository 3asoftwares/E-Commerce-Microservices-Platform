import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  roundUp,
  roundDown,
  calculatePercentage,
  calculateDiscount,
  calculateTax,
} from '../../src/helpers';

describe('Number Utilities', () => {
  describe('formatCurrency', () => {
    it('should format as USD by default', () => {
      expect(formatCurrency(100)).toBe('$100.00');
    });

    it('should format with different currencies', () => {
      expect(formatCurrency(100, 'EUR')).toContain('100');
    });

    it('should handle decimals', () => {
      expect(formatCurrency(99.99)).toBe('$99.99');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('formatNumber', () => {
    it('should format to 2 decimals by default', () => {
      expect(formatNumber(3.14159)).toBe(3.14);
    });

    it('should format to specified decimals', () => {
      expect(formatNumber(3.14159, 4)).toBe(3.1416);
    });

    it('should handle integers', () => {
      expect(formatNumber(5)).toBe(5);
    });
  });

  describe('roundUp', () => {
    it('should round up to 2 decimals by default', () => {
      expect(roundUp(3.141)).toBe(3.15);
    });

    it('should round up to specified decimals', () => {
      expect(roundUp(3.1111, 3)).toBe(3.112);
    });
  });

  describe('roundDown', () => {
    it('should round down to 2 decimals by default', () => {
      expect(roundDown(3.149)).toBe(3.14);
    });

    it('should round down to specified decimals', () => {
      expect(roundDown(3.1199, 3)).toBe(3.119);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(100, 10)).toBe(10);
    });

    it('should handle 0 percentage', () => {
      expect(calculatePercentage(100, 0)).toBe(0);
    });

    it('should handle 100 percentage', () => {
      expect(calculatePercentage(100, 100)).toBe(100);
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate discounted price', () => {
      expect(calculateDiscount(100, 10)).toBe(90);
    });

    it('should handle 0 discount', () => {
      expect(calculateDiscount(100, 0)).toBe(100);
    });

    it('should handle 100% discount', () => {
      expect(calculateDiscount(100, 100)).toBe(0);
    });
  });

  describe('calculateTax', () => {
    it('should calculate tax amount', () => {
      expect(calculateTax(100, 0.1)).toBe(10);
    });

    it('should handle 0 tax rate', () => {
      expect(calculateTax(100, 0)).toBe(0);
    });
  });
});
