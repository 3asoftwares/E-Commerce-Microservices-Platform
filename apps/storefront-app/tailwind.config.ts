/** @type {import('tailwindcss').Config} */
import baseConfig from '@3asoftwares/utils/config/tailwind';

export default {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@3asoftwares/ui-library/dist/**/*.{js,mjs}',
  ],
};
