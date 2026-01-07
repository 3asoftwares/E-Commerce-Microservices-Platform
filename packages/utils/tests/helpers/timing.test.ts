import { describe, it, expect, vi } from 'vitest';
import { delay, debounce, throttle } from '../../src/helpers';

describe('Timing Utilities', () => {
  describe('delay', () => {
    it('should resolve after specified time', async () => {
      vi.useFakeTimers();
      const promise = delay(1000);
      vi.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
      vi.useRealTimers();
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();

      expect(fn).toHaveBeenCalledTimes(2);
      vi.useRealTimers();
    });
  });
});
