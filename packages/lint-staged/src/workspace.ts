import type { Configuration } from 'lint-staged';

export const workspace = {
  './**/*.{js,json,mdx,ts,tsx}': ['biome check --write'],
  './**/*.{ts,tsx}': [() => 'tsc --build'],
} satisfies Configuration;
