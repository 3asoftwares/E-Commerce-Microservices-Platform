import { describe, it, expect } from 'vitest';
import {
  UserRole,
  OrderStatus,
  ProductStatus,
  PaymentStatus,
  PaymentMethod,
  ShippingMethod,
  LogLevel,
  ErrorType,
} from '../../src/enums';

describe('Enums Index Exports', () => {
  it('should export UserRole', () => {
    expect(UserRole).toBeDefined();
  });

  it('should export OrderStatus', () => {
    expect(OrderStatus).toBeDefined();
  });

  it('should export ProductStatus', () => {
    expect(ProductStatus).toBeDefined();
  });

  it('should export PaymentStatus', () => {
    expect(PaymentStatus).toBeDefined();
  });

  it('should export PaymentMethod', () => {
    expect(PaymentMethod).toBeDefined();
  });

  it('should export ShippingMethod', () => {
    expect(ShippingMethod).toBeDefined();
  });

  it('should export LogLevel', () => {
    expect(LogLevel).toBeDefined();
  });

  it('should export ErrorType', () => {
    expect(ErrorType).toBeDefined();
  });
});
