import * as path from 'path';
import webpack, { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

type WebpackConfiguration = Configuration & {
  devServer?: DevServerConfiguration;
};

export interface WebpackBaseOptions {
  rootDir: string;
  entry?: string;
  outputPath?: string;
  publicPath?: string;
  htmlTemplate?: string;
  htmlTitle?: string;
  devServerPort?: number;
}

/**
 * Creates base Webpack configuration for shell/host applications
 */
export function createBaseWebpackConfig(options: WebpackBaseOptions): WebpackConfiguration {
  const {
    rootDir,
    entry = './src/index.tsx',
    outputPath = 'dist',
    publicPath = 'auto',
    htmlTemplate = './public/index.html',
    htmlTitle = 'E-Commerce App',
    devServerPort = 3000,
  } = options;

  const isProduction = process.env.NODE_ENV === 'production';

  return {
    entry,
    target: 'web',
    output: {
      path: path.resolve(rootDir, outputPath),
      filename: 'bundle.[contenthash].js',
      publicPath,
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name].[hash][ext]',
          },
        },
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-react',
                  ['@babel/preset-typescript', { onlyRemoveTypeImports: true }],
                ],
              },
            },
          ],
          exclude: /node_modules\/(?!@3asoftwares)/,
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: htmlTemplate,
        title: htmlTitle,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            name: 'react-vendor',
            priority: 20,
          },
          uiLibrary: {
            test: /[\\/]packages[\\/]ui-library[\\/]/,
            name: 'ui-library',
            priority: 15,
          },
        },
      },
      runtimeChunk: 'single',
    },
    performance: {
      hints: false,
    },
    devServer: {
      port: devServerPort,
      hot: true,
      historyApiFallback: true,
    },
  };
}

export { webpack, HtmlWebpackPlugin, MiniCssExtractPlugin };
