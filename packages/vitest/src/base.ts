import { defineConfig } from 'vitest/config';

import { coverage } from './coverage.js';

export const base = defineConfig({
  test: {
    coverage: {
      ...coverage,
      include: ['src/**/*.ts'],
    },
    environment: 'node',
  },
});
