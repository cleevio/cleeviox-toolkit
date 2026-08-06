import type { FeatureSpec } from '../types.js';

export type Manifest = Record<string, unknown> & {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  name?: string;
  scripts?: Record<string, string>;
};

export interface MergeManifestOptions {
  readonly features: readonly FeatureSpec[];
  readonly manifest: Manifest;
  readonly projectName: string;
  readonly ranges: Readonly<Record<string, string>>;
}

export function featureDependencyNames(features: readonly FeatureSpec[]): {
  dependencies: readonly string[];
  devDependencies: readonly string[];
} {
  return {
    dependencies: features.flatMap((feature) => feature.dependencies ?? []),
    devDependencies: features.flatMap((feature) => feature.devDependencies ?? []),
  };
}

/**
 * Pure merge of feature contributions into the create-next-app manifest.
 *
 * create-next-app's own pins win over our resolved ranges: it knows which
 * next/react pair is coherent, and overriding that is how you get a peer-dep
 * conflict on day one.
 */
export function mergeManifest({ features, manifest, projectName, ranges }: MergeManifestOptions): Manifest {
  const { dependencies, devDependencies } = featureDependencyNames(features);

  const pick = (names: readonly string[]): Record<string, string> =>
    Object.fromEntries(names.map((name) => [name, ranges[name] ?? 'latest']));

  return {
    ...manifest,
    dependencies: { ...pick(dependencies), ...manifest.dependencies },
    devDependencies: { ...pick(devDependencies), ...manifest.devDependencies },
    engines: { node: '>=24.16.0' },
    name: projectName,
    scripts: {
      ...manifest.scripts,
      ...Object.assign({}, ...features.map((feature) => feature.scripts ?? {})),
    },
  };
}
