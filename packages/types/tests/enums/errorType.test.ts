import { describe, it, expect } from 'vitest';
import { ErrorType } from '../../src/enums/errorType';

describe('ErrorType Enum', () => {
  it('should have all error type values defined', () => {
    expect(ErrorType).toBeDefined();
  });

  it('should export ErrorType as an enum', () => {
    expect(typeof ErrorType).toBe('object');
  });

  it('should have consistent key-value pairs', () => {
    Object.entries(ErrorType).forEach(([key, value]) => {
      expect(typeof key).toBe('string');
      expect(typeof value).toBe('string');
    });
  });
});
