import { describe, it, expect } from 'vitest';
import {
  capitalize,
  capitalizeWords,
  toTitleCase,
  slugify,
  generateRandomCode,
  truncate,
} from '../../src/helpers';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should return empty string for empty input', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should not change already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
    });

    it('should return empty string for empty input', () => {
      expect(capitalizeWords('')).toBe('');
    });

    it('should handle single word', () => {
      expect(capitalizeWords('hello')).toBe('Hello');
    });
  });

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });

    it('should handle mixed case input', () => {
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
    });

    it('should return empty string for empty input', () => {
      expect(toTitleCase('')).toBe('');
    });
  });

  describe('slugify', () => {
    it('should create slug from string', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello! World@#$')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });

    it('should return empty string for empty input', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('generateRandomCode', () => {
    it('should generate code of default length', () => {
      const code = generateRandomCode();
      expect(code).toHaveLength(6);
    });

    it('should generate code of specified length', () => {
      const code = generateRandomCode(10);
      expect(code).toHaveLength(10);
    });

    it('should only contain uppercase letters and numbers', () => {
      const code = generateRandomCode(20);
      expect(code).toMatch(/^[A-Z0-9]+$/);
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should use custom suffix', () => {
      expect(truncate('Hello World', 5, '…')).toBe('Hello…');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('');
    });
  });
});
