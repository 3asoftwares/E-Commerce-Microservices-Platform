import type { Config } from 'tailwindcss';

const baseConfig = require('@3asoftwares/utils/config/tailwind');

const config: Config = {
  ...baseConfig,
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
    './node_modules/@3asoftwares/ui-library/dist/**/*.{js,mjs}',
  ],
};

export default config;
