import type { Script } from '~/types/script.js';

export const TSC: Script = ['./**/*.{ts,tsx}', [() => 'tsc --build']];
