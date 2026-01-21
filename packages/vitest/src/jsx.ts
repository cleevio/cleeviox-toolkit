import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { coverage } from './coverage.js';

export const jsx = defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      ...coverage,
      include: ['src/**/*.{ts,tsx}'],
    },
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
  },
});
