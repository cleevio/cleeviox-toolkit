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
      // System CLIs invoked at scaffold time (best-effort, never npm deps):
      // `claude` installs marketplace plugins into the generated project.
      ignoreBinaries: ['claude'],
      // devDependencies that exist purely so the template typecheck
      // (templates/tsconfig.json) can resolve template imports. Templates
      // themselves stay out of analysis via the `project` globs below.
      ignoreDependencies: [
        '@cleeviox/ui-core',
        '@storybook/nextjs',
        '@tanstack/react-query',
        '@types/react',
        '@workos-inc/authkit-nextjs',
        'clsx',
        'firebase',
        'next',
        'react',
        'react-dom',
        'storybook',
        'tailwind-merge',
        'zustand',
      ],
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
      // nextjs.json declares the `next` language-service plugin; the package
      // itself rightly has no dependency on next.
      ignoreUnresolved: ['next'],
      project: [],
    },
    'packages/ui-core': {
      ...baseMonorepoRootConfig.workspaces['packages/*'],
      entry: ['src/index.ts'],
      ignoreFiles: [],
      project: ['src/**/*.{ts,tsx}', 'tests/**/*.ts'],
    },
  },
});
