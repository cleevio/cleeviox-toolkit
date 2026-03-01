import { baseMonorepoRootConfig, defineConfig } from '@cleeviox/knip';

export default defineConfig(baseMonorepoRootConfig, {
  workspaces: {
    ...baseMonorepoRootConfig.workspaces,
    '.': {
      ...baseMonorepoRootConfig.workspaces['.'],
      entry: ['*.ts'],
      project: [],
    },
    'packages/biome': {
      ...baseMonorepoRootConfig.workspaces['packages/*'],
      entry: [],
      ignoreFiles: [],
      project: [],
    },
    'packages/knip': {
      ...baseMonorepoRootConfig.workspaces['packages/*'],
      entry: ['src/index.ts'],
      ignoreFiles: [],
    },
    'packages/lint-staged': {
      ...baseMonorepoRootConfig.workspaces['packages/*'],
      entry: ['src/index.ts'],
      ignoreFiles: [],
    },
    'packages/tsconfig': {
      ...baseMonorepoRootConfig.workspaces['packages/*'],
      entry: [],
      ignoreFiles: [],
      project: [],
    },
  },
});
