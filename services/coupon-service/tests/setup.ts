// Jest setup file for coupon-service
import { jest } from '@jest/globals';

process.env.MONGODB_URI = 'mongodb://localhost:27017/test-coupons';
process.env.PORT = '3015';

jest.setTimeout(10000);

afterAll(async () => {
  jest.clearAllMocks();
});
