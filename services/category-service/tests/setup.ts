// Jest setup file for category-service
import { jest } from '@jest/globals';

process.env.MONGODB_URI = 'mongodb://localhost:27017/test-categories';
process.env.PORT = '3014';

jest.setTimeout(10000);

afterAll(async () => {
  jest.clearAllMocks();
});
