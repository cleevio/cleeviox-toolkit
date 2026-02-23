import type { KnipConfig } from 'knip';

export const nextjsConfig = {
  ignore: ['src/assets/components/icons/**'],
  ignoreDependencies: ['@changesets/cli', 'orval', 'postcss', 'tailwindcss', '@cleeviox/knip'],
  ignoreExportsUsedInFile: true,
  next: {
    entry: ['next.config.{js,ts}', 'src/app/**/*.{ts,tsx}', 'src/middleware.{ts,js}', 'src/module/i18n/*.ts'],
  },
  project: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
} satisfies KnipConfig;
