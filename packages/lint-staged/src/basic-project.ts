import type { Configuration } from 'lint-staged';

import { workspace } from './workspace.js';

/**
 * Lint-staged configuration for a single package repository.
 */
export const singlePackage = {
  ...workspace,
} satisfies Configuration;
