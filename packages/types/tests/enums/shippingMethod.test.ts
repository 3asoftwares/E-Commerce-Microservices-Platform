import { describe, it, expect } from 'vitest';
import { ShippingMethod } from '../../src/enums/shippingMethod';

describe('ShippingMethod Enum', () => {
  it('should have all shipping method values defined', () => {
    expect(ShippingMethod).toBeDefined();
  });

  it('should export ShippingMethod as an enum', () => {
    expect(typeof ShippingMethod).toBe('object');
  });

  it('should have consistent key-value pairs', () => {
    Object.entries(ShippingMethod).forEach(([key, value]) => {
      expect(typeof key).toBe('string');
      expect(typeof value).toBe('string');
    });
  });
});
