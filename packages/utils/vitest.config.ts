import { createNodeVitestConfig } from './src/config/vitest.base.config';

export default createNodeVitestConfig(__dirname, {
  coverageExclude: ['src/**/*.d.ts', 'src/api/**', 'src/config/**'],
});
