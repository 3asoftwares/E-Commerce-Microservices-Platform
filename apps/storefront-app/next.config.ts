import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@e-commerce/ui-library', '@e-commerce/types', '@e-commerce/utils'],
  turbopack: {
    // Point to the monorepo root (2 levels up from storefront-app)
    root: path.resolve(__dirname, '..', '..'),
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: 'your-cdn-domain.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
