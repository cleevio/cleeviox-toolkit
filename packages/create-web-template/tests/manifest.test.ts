import { describe, expect, test } from 'bun:test';

import { featureDependencyNames, mergeManifest } from '../src/lib/manifest.js';
import type { FeatureSpec } from '../src/types.js';

const FEATURES: readonly FeatureSpec[] = [
  { devDependencies: ['typescript'], scripts: { check: 'biome check' } },
  { dependencies: ['@tanstack/react-query'], scripts: { 'test:e2e': 'playwright test' } },
];

describe('mergeManifest', () => {
  test('resolved ranges are applied and create-next-app pins win', () => {
    const merged = mergeManifest({
      features: FEATURES,
      manifest: {
        dependencies: { next: '16.1.4', react: '19.2.0' },
        name: 'placeholder',
        scripts: { build: 'next build', dev: 'next dev' },
      },
      projectName: 'my-app',
      ranges: { '@tanstack/react-query': '^5.90.0', react: '^19.9.9', typescript: '^6.0.3' },
    });

    expect(merged.name).toBe('my-app');
    // create-next-app's react pin survives even though a range was resolved.
    expect(merged.dependencies).toEqual({ '@tanstack/react-query': '^5.90.0', next: '16.1.4', react: '19.2.0' });
    expect(merged.devDependencies).toEqual({ typescript: '^6.0.3' });
    expect(merged.scripts).toEqual({
      build: 'next build',
      check: 'biome check',
      dev: 'next dev',
      'test:e2e': 'playwright test',
    });
    expect(merged.engines).toEqual({ node: '>=24.16.0' });
  });

  test('unresolved packages fall back to the latest specifier', () => {
    const merged = mergeManifest({
      features: [{ dependencies: ['left-pad'] }],
      manifest: {},
      projectName: 'app',
      ranges: {},
    });
    expect(merged.dependencies).toEqual({ 'left-pad': 'latest' });
  });
});

describe('featureDependencyNames', () => {
  test('flattens across features', () => {
    expect(featureDependencyNames(FEATURES)).toEqual({
      dependencies: ['@tanstack/react-query'],
      devDependencies: ['typescript'],
    });
  });
});
