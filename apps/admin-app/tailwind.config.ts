import type { Config } from 'tailwindcss';
const baseConfig = require('../../packages/utils/src/config/tailwind.config');

const config: Config = {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-library/src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
