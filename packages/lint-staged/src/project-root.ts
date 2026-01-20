import type { Configuration } from 'lint-staged';

export const projectRoot = {
  './*.{js,json,ts}': ['biome check --write --files-ignore-unknown=true --no-errors-on-unmatched'],
  './*.ts': [() => 'tsc --build'],
} satisfies Configuration;
