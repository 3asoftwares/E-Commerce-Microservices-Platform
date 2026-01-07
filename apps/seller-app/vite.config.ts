import { defineConfig, mergeConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';
import { createBaseViteConfig } from '../../packages/utils/src/config/vite.config';

const baseConfig = createBaseViteConfig(__dirname);

export default mergeConfig(baseConfig, defineConfig({
  plugins: [
    federation({
      name: 'sellerApp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/bootstrap.tsx',
        './Dashboard': './src/pages/Dashboard.tsx',
        './SellerProducts': './src/pages/SellerProducts.tsx',
        './SellerUpload': './src/pages/SellerUpload.tsx',
        './SellerOrders': './src/pages/SellerOrders.tsx',
        './SellerEarnings': './src/pages/SellerEarnings.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3002,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  preview: {
    port: 3002,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
}));
