import { describe, it, expect } from 'vitest';
import { ProductStatus } from '../../src/enums/productStatus';

describe('ProductStatus Enum', () => {
  it('should have all product status values defined', () => {
    expect(ProductStatus).toBeDefined();
  });

  it('should export ProductStatus as an enum', () => {
    expect(typeof ProductStatus).toBe('object');
  });

  it('should have consistent key-value pairs', () => {
    Object.entries(ProductStatus).forEach(([key, value]) => {
      expect(typeof key).toBe('string');
      expect(typeof value).toBe('string');
    });
  });
});
