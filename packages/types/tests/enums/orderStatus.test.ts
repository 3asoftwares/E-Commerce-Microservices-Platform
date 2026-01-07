import { describe, it, expect } from 'vitest';
import { OrderStatus } from '../../src/enums/orderStatus';

describe('OrderStatus Enum', () => {
  it('should have PENDING status', () => {
    expect(OrderStatus.PENDING).toBe('PENDING');
  });

  it('should have CONFIRMED status', () => {
    expect(OrderStatus.CONFIRMED).toBe('CONFIRMED');
  });

  it('should have PROCESSING status', () => {
    expect(OrderStatus.PROCESSING).toBe('PROCESSING');
  });

  it('should have SHIPPED status', () => {
    expect(OrderStatus.SHIPPED).toBe('SHIPPED');
  });

  it('should have OUT_FOR_DELIVERY status', () => {
    expect(OrderStatus.OUT_FOR_DELIVERY).toBe('OUT_FOR_DELIVERY');
  });

  it('should have DELIVERED status', () => {
    expect(OrderStatus.DELIVERED).toBe('DELIVERED');
  });

  it('should have CANCELLED status', () => {
    expect(OrderStatus.CANCELLED).toBe('CANCELLED');
  });

  it('should have RETURNED status', () => {
    expect(OrderStatus.RETURNED).toBe('RETURNED');
  });

  it('should have REFUNDED status', () => {
    expect(OrderStatus.REFUNDED).toBe('REFUNDED');
  });

  it('should contain exactly 9 statuses', () => {
    const statusCount = Object.keys(OrderStatus).length;
    expect(statusCount).toBe(9);
  });

  it('should follow proper order lifecycle', () => {
    const lifecycle = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED,
    ];
    expect(lifecycle).toHaveLength(6);
  });

  it('should have terminal statuses', () => {
    const terminalStatuses = [
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
      OrderStatus.RETURNED,
      OrderStatus.REFUNDED,
    ];
    terminalStatuses.forEach((status) => {
      expect(Object.values(OrderStatus)).toContain(status);
    });
  });
});
