import { createBrowserVitestConfig } from '../utils/src/config/vitest.base.config';

export default createBrowserVitestConfig(__dirname, {
  setupFiles: ['./vitest.setup.ts'],
  include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
  coverageInclude: ['src/components/**/*.{ts,tsx}'],
  coverageExclude: [
    'src/components/**/*.stories.tsx',
    'src/components/**/index.ts',
    'src/**/*.d.ts',
  ],
});
