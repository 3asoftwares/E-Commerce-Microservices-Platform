/**
 * Example: How Package Resolution Works in Services
 * 
 * This file demonstrates how the same import statements work
 * in both local and production environments.
 */

// ============================================================
// COMMON USAGE - Works in both local and production
// ============================================================

// Import utilities
import { logger, formatDate, validateEmail } from '@3asoftwares/utils';

// Import types
import type { User, Product, Order } from '@3asoftwares/types';

// Import UI components (if needed in backend)
import { Button } from '@3asoftwares/ui';

// Import server-specific utilities
import { connectDatabase, hashPassword } from '@3asoftwares/utils/server';

// ============================================================
// LOCAL DEVELOPMENT RESOLUTION (RESOLVE_FROM_SOURCE=true)
// ============================================================

// The above imports resolve to:
// '@3asoftwares/utils'          → ./packages/utils/src/index.ts
// '@3asoftwares/types'          → ./packages/types/src/index.ts
// '@3asoftwares/ui'             → ./packages/ui-library/src/index.ts
// '@3asoftwares/utils/server'   → ./packages/utils/src/server.ts

// ============================================================
// PRODUCTION RESOLUTION (RESOLVE_FROM_SOURCE=false)
// ============================================================

// The above imports resolve to:
// '@3asoftwares/utils'          → node_modules/@3asoftwares/utils/dist/index.js
// '@3asoftwares/types'          → node_modules/@3asoftwares/types/dist/index.d.ts
// '@3asoftwares/ui'             → node_modules/@3asoftwares/ui/dist/index.js
// '@3asoftwares/utils/server'   → node_modules/@3asoftwares/utils/dist/server.js

// ============================================================
// PRACTICAL EXAMPLE: Auth Service
// ============================================================

import express from 'express';
import type { AuthRequest, AuthResponse } from '@3asoftwares/types';
import { logger, validateEmail } from '@3asoftwares/utils';
import { hashPassword, comparePassword } from '@3asoftwares/utils/server';

const app = express();

// Login handler - same code works in both environments
app.post('/login', async (req: AuthRequest, res: AuthResponse) => {
  try {
    // Validate email
    if (!validateEmail(req.body.email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Log request
    logger.info(`Login attempt for ${req.body.email}`);

    // Check password (uses server-side utility in production)
    const isValid = await comparePassword(req.body.password, user.passwordHash);

    res.json({ success: true });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================
// PRACTICAL EXAMPLE: Product Service
// ============================================================

import type { Product } from '@3asoftwares/types';
import { formatDate } from '@3asoftwares/utils';

class ProductService {
  async getProduct(id: string): Promise<Product> {
    // Fetch product
    const product = await db.products.findById(id);

    // Format date using shared utility
    return {
      ...product,
      createdAt: formatDate(product.createdAt),
      updatedAt: formatDate(product.updatedAt),
    };
  }

  async listProducts(filters?: any): Promise<Product[]> {
    const products = await db.products.find(filters || {});
    return products.map(p => ({
      ...p,
      createdAt: formatDate(p.createdAt),
    }));
  }
}

// ============================================================
// PRACTICAL EXAMPLE: Frontend App
// ============================================================

// In React components - also same imports
import { Button, Card, Modal } from '@3asoftwares/ui';
import type { User, Product } from '@3asoftwares/types';
import { useApi, formatPrice } from '@3asoftwares/utils';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <h2>{product.name}</h2>
      <p>{formatPrice(product.price)}</p>
      <Button>Add to Cart</Button>
    </Card>
  );
}

// ============================================================
// CONFIGURATION - How Services Use Resolution Config
// ============================================================

// In a service's tsconfig.json or build config:
// The resolution is handled automatically based on environment variables

// For webpack/vite config:
// import { aliasConfig } from './config/package-resolution.js';
// 
// module.exports = {
//   resolve: {
//     alias: aliasConfig  // Automatically uses correct paths
//   }
// };

// ============================================================
// ENVIRONMENT DETECTION
// ============================================================

// At runtime, you can detect which mode is active:
const isLocalDev = process.env.RESOLVE_FROM_SOURCE === 'true';
const isProduction = process.env.NODE_ENV === 'production';

console.log(`Running in ${isLocalDev ? 'LOCAL' : 'PRODUCTION'} mode`);

// This can be used for conditional logic:
if (isLocalDev) {
  // Enable verbose logging in development
  logger.setLevel('debug');
} else {
  // Use minimal logging in production
  logger.setLevel('warn');
}

// ============================================================
// SUMMARY
// ============================================================

// KEY POINTS:
// 1. Import statements are IDENTICAL in both modes
// 2. Resolution happens automatically based on environment
// 3. Local: imports from source, hot-reload enabled
// 4. Production: imports from pre-built, optimized
// 5. Same code works everywhere - zero changes needed!

// ENVIRONMENT VARIABLES:
// - NODE_ENV: 'development' (local) or 'production'
// - PACKAGE_MODE: 'local' or 'production'
// - RESOLVE_FROM_SOURCE: 'true' (local) or 'false' (production)

// NO CONDITIONAL IMPORTS NEEDED!
// The build tools handle resolution automatically.
