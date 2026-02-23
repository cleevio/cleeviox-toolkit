import type { KnipConfigObject } from '../types/index.js';

export const baseMonorepoRootConfig = {
  workspaces: {
    '.': {
      entry: 'scripts/*.js',
      project: 'scripts/**/*.js',
    },
    'packages/*': {
      entry: '{index,cli}.ts',
      project: '**/*.ts',
    },
  },
} satisfies KnipConfigObject;
