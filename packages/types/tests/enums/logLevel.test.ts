import { describe, it, expect } from 'vitest';
import { LogLevel } from '../../src/enums/logLevel';

describe('LogLevel Enum', () => {
  it('should have all log level values defined', () => {
    expect(LogLevel).toBeDefined();
  });

  it('should export LogLevel as an enum', () => {
    expect(typeof LogLevel).toBe('object');
  });

  it('should have consistent key-value pairs', () => {
    Object.entries(LogLevel).forEach(([key, value]) => {
      expect(typeof key).toBe('string');
      expect(typeof value).toBe('string');
    });
  });
});
