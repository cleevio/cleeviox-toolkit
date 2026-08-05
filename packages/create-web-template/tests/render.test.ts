import { afterAll, describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { selectFeatures } from '../src/features/registry.js';
import { renderTemplates } from '../src/scaffold.js';
import type { ProjectConfig } from '../src/types.js';

const tmpDirs: string[] = [];

afterAll(() => {
  for (const dir of tmpDirs) {
    fs.rmSync(dir, { force: true, recursive: true });
  }
});

function makeConfig(overrides: Partial<ProjectConfig>): ProjectConfig {
  const targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-web-template-test-'));
  tmpDirs.push(targetDir);
  return {
    about: '',
    addons: [],
    audit: true,
    auth: 'none',
    data: 'tanstack-query',
    dryRun: false,
    figmaToken: undefined,
    figmaUrl: undefined,
    git: true,
    install: true,
    packageManager: 'pnpm',
    projectName: 'render-test-app',
    stack: 'nextjs',
    styling: 'shadcn',
    targetDir,
    ...overrides,
  };
}

function read(config: ProjectConfig, relative: string): string {
  return fs.readFileSync(path.join(config.targetDir, relative), 'utf8');
}

describe('renderTemplates', () => {
  test('kitchen-sink config renders every fragment with correct conditionals', async () => {
    const config = makeConfig({
      about: 'Internal test project for the generator.',
      addons: ['docker', 'storybook', 'playwright'],
      auth: 'workos',
      data: 'tanstack-query-zustand',
      styling: 'ui-core',
    });
    await renderTemplates(config, selectFeatures(config));

    // Handlebars conditionals resolved, .hbs suffix stripped.
    expect(read(config, 'next.config.ts')).toContain("output: 'standalone'");
    expect(read(config, 'src/app/layout.tsx')).toContain('render-test-app');
    expect(read(config, 'src/app/providers.tsx')).toContain('QueryClientProvider');

    // Auth fragment: AuthKit middleware + OAuth callback route.
    expect(read(config, 'src/middleware.ts')).toContain('authkitMiddleware');
    expect(read(config, 'src/app/callback/route.ts')).toContain('handleAuth');

    // ui-core styling: cn re-export (globals.css wiring is a patch step,
    // covered by globals-css.test.ts).
    expect(read(config, 'src/lib/cn.ts')).toContain("from '@cleeviox/ui-core'");

    // CLAUDE.md reflects the chosen configuration.
    const claudeMd = read(config, 'CLAUDE.md');
    expect(claudeMd).toContain('# render-test-app');
    expect(claudeMd).toContain('Internal test project for the generator.');
    expect(claudeMd).toContain('@cleeviox/ui-core');
    expect(claudeMd).toContain('WorkOS AuthKit');
    expect(claudeMd).toContain('test:e2e');
    expect(claudeMd).toContain('pnpm run dev');

    // Underscore segments became dot segments.
    expect(fs.existsSync(path.join(config.targetDir, '.dockerignore'))).toBe(true);
    // The static Dockerfile matching the chosen package manager was copied.
    expect(read(config, 'Dockerfile')).toContain('pnpm install --frozen-lockfile');
    expect(fs.existsSync(path.join(config.targetDir, '.storybook/main.ts'))).toBe(true);

    // Static files copied verbatim.
    expect(read(config, 'src/stores/app-store.ts')).toContain('zustand');
    expect(read(config, 'playwright.config.ts')).toContain('pnpm run dev');

    // Env contributions aggregated.
    expect(read(config, '.env.example')).toContain('WORKOS_CLIENT_ID=');
  });

  test('minimal config renders no client data layer and no wrappers', async () => {
    const config = makeConfig({ auth: 'none', data: 'server-actions', styling: 'tailwind-only' });
    await renderTemplates(config, selectFeatures(config));

    const providers = read(config, 'src/app/providers.tsx');
    expect(providers).not.toContain('QueryClientProvider');
    expect(fs.existsSync(path.join(config.targetDir, 'src/middleware.ts'))).toBe(false);
    expect(read(config, 'next.config.ts')).not.toContain('standalone');
    expect(fs.existsSync(path.join(config.targetDir, '.env.example'))).toBe(false);
    expect(fs.existsSync(path.join(config.targetDir, '.storybook'))).toBe(false);

    // Empty scope leaves the TODO placeholder in CLAUDE.md.
    const claudeMd = read(config, 'CLAUDE.md');
    expect(claudeMd).toContain('TODO: describe what this project does');
    expect(claudeMd).not.toContain('WorkOS');
  });

  test('dry run writes nothing', async () => {
    const config = makeConfig({ addons: ['docker'], dryRun: true });
    await renderTemplates(config, selectFeatures(config));
    expect(fs.readdirSync(config.targetDir)).toEqual([]);
  });
});
