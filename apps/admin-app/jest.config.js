/** @type {import('jest').Config} */
const baseConfig = require('../../packages/utils/src/config/jest.frontend.config');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    // Additional app-specific mocks
    '^\\.\\./store/store$': '<rootDir>/tests/__mocks__/store.ts',
    '^\\.\\./(\\.\\./)store/store$': '<rootDir>/tests/__mocks__/store.ts',
  },
};
