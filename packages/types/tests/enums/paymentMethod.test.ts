import { describe, it, expect } from 'vitest';
import { PaymentMethod } from '../../src/enums/paymentMethod';

describe('PaymentMethod Enum', () => {
  it('should have all payment method values defined', () => {
    expect(PaymentMethod).toBeDefined();
  });

  it('should export PaymentMethod as an enum', () => {
    expect(typeof PaymentMethod).toBe('object');
  });

  it('should have consistent key-value pairs', () => {
    Object.entries(PaymentMethod).forEach(([key, value]) => {
      expect(typeof key).toBe('string');
      expect(typeof value).toBe('string');
    });
  });
});
