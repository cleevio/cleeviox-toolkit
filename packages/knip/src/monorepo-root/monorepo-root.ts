import type { KnipConfigObject } from '../types/index.js';

export const baseMonorepoRootConfig = {
  workspaces: {
    '.': {
      entry: 'scripts/*.js',
      project: 'scripts/**/*.js',
    },
    'packages/*': {
      entry: 'src/{index,cli}.ts',
      project: 'src/*.{ts,tsx}',
    },
  },
} satisfies KnipConfigObject;
