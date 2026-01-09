import type { Config } from 'tailwindcss';
const baseConfig = require('@3asoftwares/utils/config/tailwind');

const config: Config = {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@3asoftwares/ui-library/dist/**/*.{js,mjs}',
  ],
};

export default config;
