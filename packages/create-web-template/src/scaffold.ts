import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as p from '@clack/prompts';
import { execa } from 'execa';
import Handlebars from 'handlebars';
import sortPackageJson from 'sort-package-json';

import { selectFeatures } from './features/registry.js';
import { CliError } from './lib/errors.js';
import { featureDependencyNames, type Manifest, mergeManifest } from './lib/manifest.js';
import { latestMajor, packageExists, resolveAll } from './lib/npm-registry.js';
import { auditArgs, dlx } from './lib/package-manager.js';
import { pkg, SCOPE } from './lib/scope.js';
import { targetDirectoryConflict } from './lib/target-dir.js';
import { toDestinationPath } from './lib/template-path.js';
import type { FeatureSpec, ProjectConfig } from './types.js';

const TEMPLATE_ROOT = fileURLToPath(new URL('../templates', import.meta.url));

/** create-next-app major that introduced the `--turbopack` flag. */
const TURBOPACK_MIN_MAJOR = 15;
/** Highest create-next-app major this CLI's flag set has been verified against. */
const TESTED_MAX_MAJOR = 16;

export interface ScaffoldResult {
  readonly auditWarnings: number;
  readonly targetDir: string;
}

/* ------------------------------------------------------------------ *
 * Preflight.
 * ------------------------------------------------------------------ */

/**
 * Last-resort guard — the wizard already validates this inline at the
 * project-name prompt, so a failure here means the directory changed
 * between prompt and scaffold (or a non-interactive run).
 */
function assertUsableTarget(dir: string): void {
  const conflict = targetDirectoryConflict(dir);
  if (conflict) {
    throw new CliError(conflict);
  }
}

/**
 * Catches a missing scope publication or registry-auth problem in seconds,
 * instead of at install time when a half-written directory is already on disk.
 */
async function assertCleevioConfigsPublished(): Promise<void> {
  const required = [pkg('tsconfig'), pkg('biome'), pkg('knip'), pkg('lint-staged')];
  const found = await Promise.all(required.map((name) => packageExists(name)));
  const missing = required.filter((_, index) => !found[index]);

  if (missing.length > 0) {
    throw new CliError(
      `Cannot resolve ${missing.join(', ')}.\n` +
        `Check you are authenticated against the ${SCOPE} registry ` +
        `(\`npm whoami --scope=${SCOPE}\`) and that the toolkit has been published under ${SCOPE}.`,
    );
  }
}

/* ------------------------------------------------------------------ *
 * 1. Next.js — delegated to the official generator, never vendored.
 * ------------------------------------------------------------------ */

/**
 * No Next.js boilerplate lives in this repo. `create-next-app@latest` runs at
 * scaffold time, so a new project always starts on the current stable Next.js
 * with current transitive deps — CVEs in a stale vendored template are
 * structurally impossible.
 *
 * Flags are gated on the resolved create-next-app major so a future breaking
 * rename degrades to a warning instead of an unusable CLI.
 */
async function runCreateNextApp(config: ProjectConfig): Promise<void> {
  const major = await latestMajor('create-next-app');

  const flags = [
    '--ts',
    '--app',
    '--src-dir',
    '--import-alias',
    '@/*',
    '--tailwind',
    // Cleevio lints with Biome; skipping ESLint avoids installing then deleting it.
    '--no-eslint',
    // package.json is patched before a single byte is fetched; install runs once, later.
    '--skip-install',
    '--yes',
    `--use-${config.packageManager}`,
  ];

  if (major >= TURBOPACK_MIN_MAJOR) {
    flags.push('--turbopack');
  }
  if (!config.git) {
    flags.push('--disable-git');
  }
  if (major > TESTED_MAX_MAJOR) {
    p.log.warn(
      `create-next-app v${major} is newer than this CLI was tested against; ` +
        'verify the generated app and open a toolkit issue if flags drifted.',
    );
  }

  const [file, ...prefix] = dlx(config.packageManager, 'create-next-app@latest');

  await execa(file, [...prefix, config.targetDir, ...flags], {
    // create-next-app reads these; an inherited value from another repo would leak in.
    env: { ADBLOCK: '1', DISABLE_OPENCOLLECTIVE: '1' },
    stdio: 'inherit',
  });
}

/* ------------------------------------------------------------------ *
 * 2. package.json — dynamic version resolution + deep merge.
 * ------------------------------------------------------------------ */

async function patchPackageJson(config: ProjectConfig, features: readonly FeatureSpec[]): Promise<void> {
  const manifestPath = path.join(config.targetDir, 'package.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as Manifest;

  const { dependencies, devDependencies } = featureDependencyNames(features);
  // One batched, cached, concurrent pass over the registry.
  const ranges = await resolveAll([...dependencies, ...devDependencies]);

  const merged = mergeManifest({ features, manifest, projectName: config.projectName, ranges });
  await writeJson(manifestPath, sortPackageJson(merged), config);
}

/* ------------------------------------------------------------------ *
 * 3. Cleevio configs — extend, never inline.
 * ------------------------------------------------------------------ */

/**
 * Every config file is a two-line `extends` pointing at a published
 * @cleeviox/* package. Rules live in the toolkit and reach projects through a
 * normal dependency bump, not a re-scaffold.
 */
async function attachCleevioConfigs(config: ProjectConfig): Promise<void> {
  await writeJson(
    path.join(config.targetDir, 'tsconfig.json'),
    {
      $schema: 'https://json.schemastore.org/tsconfig',
      compilerOptions: { paths: { '@/*': ['./src/*'] } },
      exclude: ['node_modules'],
      extends: `${pkg('tsconfig')}/nextjs`,
      include: ['**/*.ts', '**/*.tsx', 'next-env.d.ts', '.next/types/**/*.ts'],
    },
    config,
  );

  await writeText(
    path.join(config.targetDir, 'biome.jsonc'),
    `{\n  "extends": ["${pkg('biome')}/nextjs.jsonc"]\n}\n`,
    config,
  );

  await writeText(
    path.join(config.targetDir, 'knip.config.ts'),
    `import { baseNextjsConfig, defineConfig } from '${pkg('knip')}';\n\nexport default defineConfig(baseNextjsConfig);\n`,
    config,
  );

  await writeText(
    path.join(config.targetDir, 'lint-staged.config.js'),
    `import { singlePackage } from '${pkg('lint-staged')}';\n\nexport default {\n  ...singlePackage,\n};\n`,
    config,
  );
}

/* ------------------------------------------------------------------ *
 * 4. Templates — render, don't patch.
 * ------------------------------------------------------------------ */

Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);
Handlebars.registerHelper('includes', (list: unknown, value: unknown) => Array.isArray(list) && list.includes(value));

/**
 * Fragments are applied in feature order and later fragments may overwrite
 * earlier ones — that is how `base/src/app/layout.tsx.hbs` renders the right
 * provider tree without any AST surgery on a file we just generated.
 */
export async function renderTemplates(config: ProjectConfig, features: readonly FeatureSpec[]): Promise<void> {
  for (const fragment of features.flatMap((feature) => feature.templates ?? [])) {
    await renderFragment(config, path.join(TEMPLATE_ROOT, fragment));
  }
  await writeEnvExample(config, features);
}

async function renderFragment(config: ProjectConfig, source: string): Promise<void> {
  const entries = await fs.readdir(source, { recursive: true, withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const absolute = path.join(entry.parentPath, entry.name);
    const relative = path.relative(source, absolute);
    const destination = path.join(config.targetDir, toDestinationPath(relative));

    if (entry.name.endsWith('.hbs')) {
      const template = Handlebars.compile(await fs.readFile(absolute, 'utf8'), { noEscape: true, strict: true });
      await writeText(destination, template(config), config);
    } else if (config.dryRun) {
      p.log.step(`would write ${path.relative(config.targetDir, destination)}`);
    } else {
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(absolute, destination);
    }
  }
}

async function writeEnvExample(config: ProjectConfig, features: readonly FeatureSpec[]): Promise<void> {
  const env: Record<string, string> = Object.assign({}, ...features.map((feature) => feature.env ?? {}));
  if (Object.keys(env).length === 0) {
    return;
  }
  const body = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  await writeText(path.join(config.targetDir, '.env.example'), `${body}\n`, config);
}

/* ------------------------------------------------------------------ *
 * 5. Install + audit.
 * ------------------------------------------------------------------ */

async function install(config: ProjectConfig): Promise<void> {
  await execa(config.packageManager, ['install'], { cwd: config.targetDir, stdio: 'inherit' });
}

/**
 * Advisories are reported, never fatal — a transitive high in a fresh Next.js
 * tree is the framework's problem, and failing the scaffold would leave the
 * developer with a half-built directory and no recourse. Enforce the gate in
 * the project's CI pipeline, where a failure is actionable.
 */
async function audit(config: ProjectConfig): Promise<number> {
  const [file, ...args] = auditArgs(config.packageManager);
  const result = await execa(file, args, { cwd: config.targetDir, reject: false, stdio: 'inherit' });
  return result.exitCode === 0 ? 0 : 1;
}

/* ------------------------------------------------------------------ *
 * Orchestration.
 * ------------------------------------------------------------------ */

export async function scaffold(config: ProjectConfig): Promise<ScaffoldResult> {
  assertUsableTarget(config.targetDir);

  const features = selectFeatures(config);
  const spinner = p.spinner();

  if (config.dryRun) {
    p.log.info('Dry run — nothing will be written to disk.');
  } else {
    spinner.start(`Checking ${SCOPE} packages are reachable`);
    await assertCleevioConfigsPublished();
    spinner.stop(`${SCOPE} registry reachable`);

    p.log.step('Scaffolding Next.js via create-next-app@latest');
    await runCreateNextApp(config);

    spinner.start('Resolving latest stable versions and merging package.json');
    await patchPackageJson(config, features);
    spinner.stop('package.json merged');
  }

  spinner.start(`Attaching ${SCOPE} configs`);
  await attachCleevioConfigs(config);
  spinner.stop(`${SCOPE} configs attached`);

  spinner.start('Rendering feature templates');
  await renderTemplates(config, features);
  spinner.stop('Templates rendered');

  if (config.dryRun || !config.install) {
    return { auditWarnings: 0, targetDir: config.targetDir };
  }

  p.log.step(`Installing dependencies with ${config.packageManager}`);
  await install(config);

  let auditWarnings = 0;
  if (config.audit) {
    p.log.step('Auditing for known vulnerabilities');
    auditWarnings = await audit(config);
    p.log.info(auditWarnings === 0 ? 'No advisories found.' : 'Advisories reported (non-fatal).');
  }

  return { auditWarnings, targetDir: config.targetDir };
}

/* ------------------------------------------------------------------ *
 * Small local helpers.
 * ------------------------------------------------------------------ */

async function writeText(file: string, contents: string, config: ProjectConfig): Promise<void> {
  if (config.dryRun) {
    p.log.step(`would write ${path.relative(config.targetDir, file)}`);
    return;
  }
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, contents, 'utf8');
}

async function writeJson(file: string, value: unknown, config: ProjectConfig): Promise<void> {
  await writeText(file, `${JSON.stringify(value, null, 2)}\n`, config);
}
