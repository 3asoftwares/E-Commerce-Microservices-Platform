import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import * as path from 'path';

export default defineConfig({
  plugins: [
    react(),
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
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js'),
  },
});
