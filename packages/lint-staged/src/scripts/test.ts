import type { Script } from '~/types/script.js';

export const TEST: Script = ['./**/*.{ts,tsx}', [() => 'tsc bun test']];
