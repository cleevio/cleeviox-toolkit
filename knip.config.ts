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
    'packages/create-web-template': {
      ...baseMonorepoRootConfig.workspaces['packages/*'],
      entry: ['src/index.ts'],
      // Templates are scaffold output, not project code — their imports
      // resolve inside generated apps, never in this repo.
      ignore: ['templates/**'],
      ignoreFiles: [],
      project: ['src/**/*.ts', 'tests/**/*.ts'],
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
