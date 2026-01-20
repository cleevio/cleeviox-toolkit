import type { Configuration } from 'lint-staged';

import { specialFiles } from './special-files.js';
import { workspace } from './workspace.js';

/**
 * Lint-staged configuration for a single package repository.
 */
export const singlePackage = {
  ...specialFiles,
  ...workspace,
} satisfies Configuration;
