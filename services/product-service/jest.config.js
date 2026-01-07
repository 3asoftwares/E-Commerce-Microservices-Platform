/** @type {import('jest').Config} */
const baseConfig = require('../../packages/utils/src/config/jest.backend.config');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@e-commerce/types$': '<rootDir>/../../packages/types/src/index.ts',
  },
};
