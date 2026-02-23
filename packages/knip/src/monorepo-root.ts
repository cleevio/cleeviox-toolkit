import type { KnipConfig } from 'knip';

export const monorepoRootConfig = {
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
} satisfies KnipConfig;
