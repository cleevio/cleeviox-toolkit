export type PackageManager = 'pnpm' | 'npm' | 'bun';
export type Styling = 'ui-core' | 'shadcn' | 'tailwind-only';
export type DataLayer = 'server-actions' | 'tanstack-query' | 'tanstack-query-zustand';
export type Auth = 'none' | 'workos' | 'firebase';
export type Addon = 'docker' | 'storybook' | 'playwright';
/** Single member today — the enum keeps future stacks (nestjs, …) a flag value, not a redesign. */
export type Stack = 'nextjs';

export const ADDONS = ['docker', 'storybook', 'playwright'] as const satisfies readonly Addon[];

export interface ProjectConfig {
  /** One/two sentences on what the project is — lands in the generated CLAUDE.md. Empty = not provided. */
  readonly about: string;
  readonly addons: readonly Addon[];
  readonly audit: boolean;
  readonly auth: Auth;
  readonly data: DataLayer;
  readonly dryRun: boolean;
  /** Figma personal access token (env FIGMA_TOKEN or prompted) — never persisted. */
  readonly figmaToken: string | undefined;
  /** Figma file URL whose variables become src/app/theme.css; undefined skips the step. */
  readonly figmaUrl: string | undefined;
  readonly git: boolean;
  readonly install: boolean;
  readonly packageManager: PackageManager;
  readonly projectName: string;
  readonly stack: Stack;
  readonly styling: Styling;
  readonly targetDir: string;
}

/** What a single feature contributes to the generated project. */
export interface FeatureSpec {
  /**
   * CSS specifiers injected into the app's globals.css right after the
   * `@import "tailwindcss"` line — the create-next-app baseline is patched,
   * never overwritten.
   */
  readonly cssImports?: readonly string[];
  /** Bare package names — versions are resolved from the registry at scaffold time. */
  readonly dependencies?: readonly string[];
  readonly devDependencies?: readonly string[];
  readonly env?: Readonly<Record<string, string>>;
  readonly scripts?: Readonly<Record<string, string>>;
  /** Template dirs, relative to `templates/`, applied in order. */
  readonly templates?: readonly string[];
}
