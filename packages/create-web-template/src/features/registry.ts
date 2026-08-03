import { pkg } from '../lib/scope.js';
import type { FeatureSpec, ProjectConfig } from '../types.js';

const STYLING: Record<ProjectConfig['styling'], FeatureSpec> = {
  shadcn: {
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react', '@radix-ui/react-slot'],
    templates: ['styling/shadcn'],
  },
  'tailwind-only': {},
  'ui-core': {
    dependencies: [pkg('ui-core'), 'clsx', 'tailwind-merge'],
    templates: ['styling/ui-core'],
  },
};

const DATA: Record<ProjectConfig['data'], FeatureSpec> = {
  'server-actions': {},
  'tanstack-query': {
    dependencies: ['@tanstack/react-query'],
    devDependencies: ['@tanstack/react-query-devtools'],
    templates: ['data/tanstack-query'],
  },
  'tanstack-query-zustand': {
    dependencies: ['@tanstack/react-query', 'zustand'],
    devDependencies: ['@tanstack/react-query-devtools'],
    templates: ['data/tanstack-query', 'data/zustand'],
  },
};

const AUTH: Record<ProjectConfig['auth'], FeatureSpec> = {
  authjs: {
    dependencies: ['next-auth'],
    env: { AUTH_SECRET: '', AUTH_URL: 'http://localhost:3000' },
    templates: ['auth/authjs'],
  },
  'cleevio-jwt': {
    dependencies: ['jose'],
    env: { CLEEVIO_AUTH_API_URL: '', CLEEVIO_JWT_COOKIE_NAME: 'cleevio_session' },
    templates: ['auth/cleevio-jwt'],
  },
  clerk: {
    dependencies: ['@clerk/nextjs'],
    env: { CLERK_SECRET_KEY: '', NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: '' },
    templates: ['auth/clerk'],
  },
  none: {},
};

const ADDONS: Record<ProjectConfig['addons'][number], (config: ProjectConfig) => FeatureSpec> = {
  // The Dockerfile differs wholesale per package manager, so it ships as three
  // static, editor-lintable files instead of one Handlebars template.
  docker: ({ packageManager }) => ({
    templates: ['addons/docker/common', `addons/docker/${packageManager}`],
  }),
  playwright: () => ({
    devDependencies: ['@playwright/test'],
    scripts: { 'test:e2e': 'playwright test', 'test:e2e:ui': 'playwright test --ui' },
    templates: ['addons/playwright'],
  }),
  storybook: () => ({
    devDependencies: ['storybook', '@storybook/nextjs', '@storybook/addon-a11y', '@storybook/addon-docs'],
    scripts: { storybook: 'storybook dev -p 6006', 'storybook:build': 'storybook build' },
    templates: ['addons/storybook'],
  }),
};

/** Always-on Cleevio baseline. Versions are still resolved dynamically. */
const BASE: FeatureSpec = {
  devDependencies: [
    pkg('tsconfig'),
    pkg('biome'),
    pkg('knip'),
    pkg('lint-staged'),
    '@biomejs/biome',
    'typescript',
    'knip',
    'lint-staged',
    'husky',
  ],
  scripts: {
    check: 'biome check',
    'check:fix': 'biome check --write .',
    format: 'biome format .',
    knip: 'knip',
    lint: 'biome lint .',
    'lint:fix': 'biome lint --write .',
    prepare: 'husky',
    ts: 'tsc --project tsconfig.json',
  },
  templates: ['base'],
};

export function selectFeatures(config: ProjectConfig): readonly FeatureSpec[] {
  return [
    BASE,
    STYLING[config.styling],
    DATA[config.data],
    AUTH[config.auth],
    ...config.addons.map((addon) => ADDONS[addon](config)),
  ];
}
