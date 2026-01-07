import { describe, it, expect } from 'vitest';
import { omit, pick, deepMerge, isEmpty, getNestedValue, setNestedValue } from '../../src/helpers';

describe('Object Utilities', () => {
  describe('omit', () => {
    it('should remove specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['a', 'b'])).toEqual({ c: 3 });
    });

    it('should handle non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, ['c' as keyof typeof obj])).toEqual({ a: 1, b: 2 });
    });
  });

  describe('pick', () => {
    it('should keep only specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'b'])).toEqual({ a: 1, b: 2 });
    });

    it('should handle non-existent keys', () => {
      const obj = { a: 1 };
      expect(pick(obj, ['a', 'b' as keyof typeof obj])).toEqual({ a: 1 });
    });
  });

  describe('deepMerge', () => {
    it('should merge nested objects', () => {
      const target: Record<string, any> = { a: { b: 1 } };
      const source: Record<string, any> = { a: { c: 2 } };
      expect(deepMerge(target, source)).toEqual({ a: { b: 1, c: 2 } });
    });

    it('should override primitive values', () => {
      const target: Record<string, any> = { a: 1 };
      const source: Record<string, any> = { a: 2 };
      expect(deepMerge(target, source)).toEqual({ a: 2 });
    });

    it('should not modify original objects', () => {
      const target: Record<string, any> = { a: 1 };
      const source: Record<string, any> = { b: 2 };
      deepMerge(target, source);
      expect(target).toEqual({ a: 1 });
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty object', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe('getNestedValue', () => {
    it('should get nested value', () => {
      const obj = { a: { b: { c: 'value' } } };
      expect(getNestedValue(obj, 'a.b.c')).toBe('value');
    });

    it('should return undefined for non-existent path', () => {
      const obj = { a: 1 };
      expect(getNestedValue(obj, 'a.b.c')).toBeUndefined();
    });
  });

  describe('setNestedValue', () => {
    it('should set nested value', () => {
      const obj: Record<string, any> = {};
      setNestedValue(obj, 'a.b.c', 'value');
      expect(obj.a.b.c).toBe('value');
    });

    it('should override existing value', () => {
      const obj = { a: { b: 1 } };
      setNestedValue(obj, 'a.b', 2);
      expect(obj.a.b).toBe(2);
    });
  });
});
