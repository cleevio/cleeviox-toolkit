import type { Script } from '~/types/index.js';

export const BIOME: Script = ['./**/*.{js,json,mdx,ts,tsx}', ['biome check --write']];
