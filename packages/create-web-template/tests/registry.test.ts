import { describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { selectFeatures } from '../src/features/registry.js';
import { pkg } from '../src/lib/scope.js';
import type { Auth, DataLayer, PackageManager, ProjectConfig, Styling } from '../src/types.js';
import { ADDONS } from '../src/types.js';

const TEMPLATE_ROOT = fileURLToPath(new URL('../templates', import.meta.url));

const STYLINGS: readonly Styling[] = ['ui-core', 'shadcn', 'tailwind-only'];
const DATA_LAYERS: readonly DataLayer[] = ['server-actions', 'tanstack-query', 'tanstack-query-zustand'];
const AUTHS: readonly Auth[] = ['none', 'authjs', 'clerk', 'cleevio-jwt'];
const PACKAGE_MANAGERS: readonly PackageManager[] = ['pnpm', 'npm', 'bun'];

function makeConfig(overrides: Partial<ProjectConfig>): ProjectConfig {
  return {
    addons: [],
    audit: true,
    auth: 'none',
    data: 'tanstack-query',
    dryRun: false,
    git: true,
    install: true,
    packageManager: 'pnpm',
    projectName: 'test-app',
    styling: 'shadcn',
    targetDir: '/tmp/test-app',
    ...overrides,
  };
}

describe('selectFeatures', () => {
  test('every referenced template fragment exists on disk', () => {
    const configs = PACKAGE_MANAGERS.flatMap((packageManager) =>
      STYLINGS.flatMap((styling) =>
        DATA_LAYERS.flatMap((data) =>
          AUTHS.map((auth) => makeConfig({ addons: ADDONS, auth, data, packageManager, styling })),
        ),
      ),
    );
    const fragments = new Set(
      configs.flatMap((config) => selectFeatures(config).flatMap((feature) => feature.templates ?? [])),
    );

    expect(fragments.size).toBeGreaterThan(0);
    for (const fragment of fragments) {
      expect(fs.existsSync(path.join(TEMPLATE_ROOT, fragment))).toBe(true);
    }
  });

  test('base feature always contributes the Cleevio toolchain', () => {
    const [base] = selectFeatures(makeConfig({}));
    expect(base?.devDependencies).toContain(pkg('tsconfig'));
    expect(base?.devDependencies).toContain(pkg('biome'));
    expect(base?.templates).toContain('base');
  });

  test('addon selection maps to addon specs', () => {
    const features = selectFeatures(makeConfig({ addons: ['playwright'] }));
    const scripts = Object.assign({}, ...features.map((feature) => feature.scripts ?? {}));
    expect(scripts['test:e2e']).toBe('playwright test');
  });

  test('no feature spec hardcodes a version', () => {
    for (const styling of STYLINGS) {
      for (const feature of selectFeatures(makeConfig({ addons: ADDONS, styling }))) {
        for (const name of [...(feature.dependencies ?? []), ...(feature.devDependencies ?? [])]) {
          // A version pin would look like name@1.2.3 — bare names only.
          expect(name.slice(1)).not.toInclude('@');
        }
      }
    }
  });
});
