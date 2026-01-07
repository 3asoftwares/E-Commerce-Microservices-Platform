import type { Config } from 'tailwindcss';
import baseConfig from '../../packages/utils/src/config/tailwind.config';

const config: Config = {
  ...(baseConfig as Config),
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.stories.{js,ts,jsx,tsx}',
    './.storybook/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
