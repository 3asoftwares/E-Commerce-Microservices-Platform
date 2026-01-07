import { describe, it, expect, vi } from 'vitest';
import { retry } from '../../src/helpers';

describe('Retry Utilities', () => {
  describe('retry', () => {
    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await retry(fn, 3, 10);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const fn = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue('success');

      const result = await retry(fn, 3, 10);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should throw after max attempts', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('always fail'));

      await expect(retry(fn, 3, 10)).rejects.toThrow('always fail');
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });
});
