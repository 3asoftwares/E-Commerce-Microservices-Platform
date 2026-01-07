import { describe, it, expect } from 'vitest';
import { tryParse, withErrorHandling, createApiResponse } from '../../src/helpers';

describe('Error Handling Utilities', () => {
  describe('tryParse', () => {
    it('should parse valid JSON', () => {
      expect(tryParse('{"a": 1}', {})).toEqual({ a: 1 });
    });

    it('should return fallback for invalid JSON', () => {
      expect(tryParse('invalid', { default: true })).toEqual({ default: true });
    });
  });

  describe('withErrorHandling', () => {
    it('should return success for successful function', async () => {
      const result = await withErrorHandling(() => Promise.resolve('data'));
      expect(result.success).toBe(true);
      expect(result.data).toBe('data');
    });

    it('should return error for failed function', async () => {
      const result = await withErrorHandling(() => Promise.reject(new Error('fail')));
      expect(result.success).toBe(false);
      expect(result.error).toBe('fail');
    });
  });

  describe('createApiResponse', () => {
    it('should create success response', () => {
      const response = createApiResponse(true, { id: 1 });
      expect(response.success).toBe(true);
      expect(response.data).toEqual({ id: 1 });
    });

    it('should create error response', () => {
      const response = createApiResponse(false, null, 'Error occurred', 400);
      expect(response.success).toBe(false);
      expect(response.message).toBe('Error occurred');
      expect(response.statusCode).toBe(400);
    });
  });
});
