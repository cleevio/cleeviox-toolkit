import type { Configuration } from 'lint-staged';

import { specialFiles } from './special-files.js';

export const projectRoot = {
  ...specialFiles,
  './*.{js,json,ts}': ['biome check --write --files-ignore-unknown=true --no-errors-on-unmatched'],
  './*.ts': [() => 'tsc --build'],
} satisfies Configuration;
