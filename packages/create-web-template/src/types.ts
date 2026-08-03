export type PackageManager = 'pnpm' | 'npm' | 'bun';
export type Styling = 'ui-core' | 'shadcn' | 'tailwind-only';
export type DataLayer = 'server-actions' | 'tanstack-query' | 'tanstack-query-zustand';
export type Auth = 'none' | 'authjs' | 'clerk' | 'cleevio-jwt';
export type Addon = 'docker' | 'storybook' | 'playwright';

export const ADDONS = ['docker', 'storybook', 'playwright'] as const satisfies readonly Addon[];

export interface ProjectConfig {
  readonly addons: readonly Addon[];
  readonly audit: boolean;
  readonly auth: Auth;
  readonly data: DataLayer;
  readonly dryRun: boolean;
  readonly git: boolean;
  readonly install: boolean;
  readonly packageManager: PackageManager;
  readonly projectName: string;
  readonly styling: Styling;
  readonly targetDir: string;
}

/** What a single feature contributes to the generated project. */
export interface FeatureSpec {
  /** Bare package names — versions are resolved from the registry at scaffold time. */
  readonly dependencies?: readonly string[];
  readonly devDependencies?: readonly string[];
  readonly env?: Readonly<Record<string, string>>;
  readonly scripts?: Readonly<Record<string, string>>;
  /** Template dirs, relative to `templates/`, applied in order. */
  readonly templates?: readonly string[];
}
