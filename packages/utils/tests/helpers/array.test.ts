import { describe, it, expect } from 'vitest';
import {
  chunk,
  unique,
  removeDuplicates,
  groupBy,
  sortBy,
  flatten,
  difference,
  intersection,
} from '../../src/helpers';

describe('Array Utilities', () => {
  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle empty array', () => {
      expect(chunk([], 2)).toEqual([]);
    });

    it('should handle chunk size larger than array', () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });
  });

  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should handle empty array', () => {
      expect(unique([])).toEqual([]);
    });

    it('should work with strings', () => {
      expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicates by key', () => {
      const arr = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 1, name: 'c' },
      ];
      expect(removeDuplicates(arr, 'id')).toHaveLength(2);
    });

    it('should keep first occurrence', () => {
      const arr = [
        { id: 1, name: 'first' },
        { id: 1, name: 'second' },
      ];
      expect(removeDuplicates(arr, 'id')[0].name).toBe('first');
    });
  });

  describe('groupBy', () => {
    it('should group array by key', () => {
      const arr = [
        { category: 'a', value: 1 },
        { category: 'b', value: 2 },
        { category: 'a', value: 3 },
      ];
      const grouped = groupBy(arr, 'category');
      expect(grouped['a']).toHaveLength(2);
      expect(grouped['b']).toHaveLength(1);
    });
  });

  describe('sortBy', () => {
    it('should sort array ascending by default', () => {
      const arr = [{ value: 3 }, { value: 1 }, { value: 2 }];
      const sorted = sortBy(arr, 'value');
      expect(sorted[0].value).toBe(1);
    });

    it('should sort array descending', () => {
      const arr = [{ value: 1 }, { value: 3 }, { value: 2 }];
      const sorted = sortBy(arr, 'value', 'DESC');
      expect(sorted[0].value).toBe(3);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      expect(flatten([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle empty arrays', () => {
      expect(flatten([[], []])).toEqual([]);
    });
  });

  describe('difference', () => {
    it('should return items in first array not in second', () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
    });

    it('should return empty if all items match', () => {
      expect(difference([1, 2], [1, 2])).toEqual([]);
    });
  });

  describe('intersection', () => {
    it('should return common items', () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });

    it('should return empty if no common items', () => {
      expect(intersection([1, 2], [3, 4])).toEqual([]);
    });
  });
});
