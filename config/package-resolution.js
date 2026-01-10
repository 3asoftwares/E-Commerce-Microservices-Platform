/**
 * Package Resolution Configuration
 * 
 * Handles different import strategies for local vs production:
 * - LOCAL: Imports from source packages in /packages and /services
 * - PRODUCTION: Imports pre-built packages from node_modules
 */

const packageMode = process.env.PACKAGE_MODE || process.env.NODE_ENV || 'local';
const resolveFromSource = process.env.RESOLVE_FROM_SOURCE === 'true' || packageMode === 'local';

// Utility packages location
const utilsLocation = resolveFromSource 
  ? './packages/utils/src/index.ts'
  : '@3asoftwares/utils';

const typesLocation = resolveFromSource
  ? './packages/types/src/index.ts'
  : '@3asoftwares/types';

// UI Library always loads from npm package (never local)
const uiLibraryLocation = '@3asoftwares/ui';

// Server-side utils location
const serverUtilsLocation = resolveFromSource
  ? './packages/utils/src/server.ts'
  : '@3asoftwares/utils/server';

/**
 * Alias configuration for different build tools
 * Use this in webpack, vite, tsconfig, etc.
 */
const aliasConfig = {
  '@3asoftwares/utils': utilsLocation,
  '@3asoftwares/types': typesLocation,
  '@3asoftwares/ui': uiLibraryLocation,
  '@3asoftwares/utils/server': serverUtilsLocation,
};

/**
 * Path mapping for tsconfig.json
 */
const tsconfigPaths = {
  '@3asoftwares/utils': [resolveFromSource ? 'packages/utils/src' : 'node_modules/@3asoftwares/utils'],
  '@3asoftwares/utils/*': [resolveFromSource ? 'packages/utils/src/*' : 'node_modules/@3asoftwares/utils/*'],
  '@3asoftwares/types': [resolveFromSource ? 'packages/types/src' : 'node_modules/@3asoftwares/types'],
  '@3asoftwares/types/*': [resolveFromSource ? 'packages/types/src/*' : 'node_modules/@3asoftwares/types/*'],
  '@3asoftwares/ui': ['node_modules/@3asoftwares/ui'],
  '@3asoftwares/ui/*': ['node_modules/@3asoftwares/ui/*'],
};

module.exports = {
  packageMode,
  resolveFromSource,
  aliasConfig,
  tsconfigPaths,
  utilsLocation,
  typesLocation,
  uiLibraryLocation,
  serverUtilsLocation,
};
