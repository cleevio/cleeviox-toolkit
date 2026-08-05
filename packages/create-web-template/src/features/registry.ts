import { pkg } from '../lib/scope.js';
import type { FeatureSpec, ProjectConfig } from '../types.js';

const STYLING: Record<ProjectConfig['styling'], FeatureSpec> = {
  shadcn: {
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react', '@radix-ui/react-slot'],
    templates: ['styling/shadcn'],
  },
  'tailwind-only': {},
  // cn/Button come from the package itself; clsx & tailwind-merge arrive
  // transitively. styles.css self-registers the package with Tailwind
  // (@source inside) and owns shared design tokens.
  'ui-core': {
    cssImports: [`${pkg('ui-core')}/styles.css`],
    dependencies: [pkg('ui-core')],
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
  firebase: {
    dependencies: ['firebase'],
    env: {
      NEXT_PUBLIC_FIREBASE_API_KEY: '',
      NEXT_PUBLIC_FIREBASE_APP_ID: '',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: '',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: '',
    },
    templates: ['auth/firebase'],
  },
  none: {},
  workos: {
    dependencies: ['@workos-inc/authkit-nextjs'],
    env: {
      NEXT_PUBLIC_WORKOS_REDIRECT_URI: 'http://localhost:3000/callback',
      WORKOS_API_KEY: '',
      WORKOS_CLIENT_ID: '',
      WORKOS_COOKIE_PASSWORD: '',
    },
    templates: ['auth/workos'],
  },
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
