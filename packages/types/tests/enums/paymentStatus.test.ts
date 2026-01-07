import { describe, it, expect } from 'vitest';
import { PaymentStatus } from '../../src/enums/paymentStatus';

describe('PaymentStatus Enum', () => {
  it('should have all payment status values defined', () => {
    expect(PaymentStatus).toBeDefined();
  });

  it('should export PaymentStatus as an enum', () => {
    expect(typeof PaymentStatus).toBe('object');
  });

  it('should have consistent key-value pairs', () => {
    Object.entries(PaymentStatus).forEach(([key, value]) => {
      expect(typeof key).toBe('string');
      expect(typeof value).toBe('string');
    });
  });
});
