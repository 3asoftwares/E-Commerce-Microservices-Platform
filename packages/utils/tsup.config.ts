import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      client: 'src/client.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: false,
    external: ['express', 'express-validator'],
  },
  {
    entry: {
      server: 'src/validation/server.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    external: ['express', 'express-validator'],
  },
]);
