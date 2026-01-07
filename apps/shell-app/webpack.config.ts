const webpack = require('webpack');
const { ModuleFederationPlugin } = require('webpack').container;
const { createBaseWebpackConfig } = require('../../packages/utils/src/config/webpack.base.config');

// Remote app URLs - configurable via environment variables
const ADMIN_APP_URL = process.env.ADMIN_APP_URL || 'http://localhost:3001';
const SELLER_APP_URL = process.env.SELLER_APP_URL || 'http://localhost:3002';

// Get base configuration
const baseConfig = createBaseWebpackConfig({
  rootDir: __dirname,
  htmlTemplate: './public/index.html',
  htmlTitle: '3A Softwares',
  devServerPort: 3000,
});

module.exports = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      remotes: {
        adminApp: `adminApp@${ADMIN_APP_URL}/remoteEntry.js`,
        sellerApp: `sellerApp@${SELLER_APP_URL}/remoteEntry.js`,
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0',
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0',
          eager: true,
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.20.0',
          eager: true,
        },
      },
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: process.env.NODE_ENV || 'development',
        ADMIN_APP_URL: ADMIN_APP_URL,
        SELLER_APP_URL: SELLER_APP_URL,
      }),
    }),
  ],
};
