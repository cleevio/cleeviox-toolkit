import type { KnipConfigObject } from '../types/index.js';

export const baseNextjsConfig = {
  ignore: ['src/assets/components/icons/**'],
  ignoreDependencies: ['@changesets/cli', 'orval', 'postcss', 'tailwindcss', '@cleeviox/knip'],
  ignoreExportsUsedInFile: true,
  next: {
    entry: ['next.config.{js,ts}', 'src/app/**/*.{ts,tsx}', 'src/middleware.{ts,js}', 'src/module/i18n/*.ts'],
  },
  project: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
} satisfies KnipConfigObject;
