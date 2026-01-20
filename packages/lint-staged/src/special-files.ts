import type { Configuration } from 'lint-staged';

export const specialFiles = {
  './.changeset/*.{json,md}': ['biome check --write'],
} satisfies Configuration;
