#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import * as p from '@clack/prompts';
import { Command, Option } from 'commander';
import color from 'picocolors';

import { CliError } from './lib/errors.js';
import { packageExists } from './lib/npm-registry.js';
import { detectPackageManager } from './lib/package-manager.js';
import { defaultDirectoryFor, validateProjectName } from './lib/project-name.js';
import { pkg } from './lib/scope.js';
import { targetDirectoryConflict } from './lib/target-dir.js';
import { scaffold } from './scaffold.js';
import {
  ADDONS,
  type Addon,
  type Auth,
  type DataLayer,
  type PackageManager,
  type ProjectConfig,
  type Styling,
} from './types.js';

interface RawFlags {
  readonly addons?: readonly Addon[];
  readonly audit: boolean;
  readonly auth?: Auth;
  readonly data?: DataLayer;
  readonly dir?: string;
  readonly dryRun: boolean;
  readonly git: boolean;
  readonly install: boolean;
  readonly pm?: PackageManager;
  readonly styling?: Styling;
  readonly yes: boolean;
}

/** Conventional exit code for SIGINT: 128 + signal number 2. */
const EXIT_SIGINT = 130;

/** clack returns a symbol on Ctrl-C; bail out uniformly rather than at six call sites. */
function unwrap<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel('Scaffolding cancelled.');
    process.exit(EXIT_SIGINT);
  }
  return value as T;
}

function parseAddons(raw: string): readonly Addon[] {
  const parsed = raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  const invalid = parsed.filter((entry) => !(ADDONS as readonly string[]).includes(entry));
  if (invalid.length > 0) {
    throw new CliError(`Unknown add-on(s): ${invalid.join(', ')}. Valid: ${ADDONS.join(', ')}.`);
  }
  return parsed as Addon[];
}

function parseProgram(argv: readonly string[]): { flags: RawFlags; nameArg: string | undefined } {
  const program = new Command()
    .name('create-web-template')
    .description('Scaffold a Cleevio Next.js application (App Router, TypeScript, Biome).')
    .argument('[project-name]', 'directory / package name of the new app')
    .addOption(new Option('--pm <manager>', 'package manager').choices(['pnpm', 'npm', 'bun']))
    .addOption(new Option('--styling <preset>', 'UI & styling preset').choices(['ui-core', 'shadcn', 'tailwind-only']))
    .addOption(
      new Option('--data <preset>', 'data fetching & state preset').choices([
        'server-actions',
        'tanstack-query',
        'tanstack-query-zustand',
      ]),
    )
    .addOption(
      new Option('--auth <provider>', 'authentication provider').choices(['none', 'authjs', 'clerk', 'cleevio-jwt']),
    )
    .option('--addons <list>', `comma-separated: ${ADDONS.join(',')}`, parseAddons)
    .option('--dir <path>', 'output directory (default: derived from the project name)')
    .option('--no-install', 'skip dependency installation')
    .option('--no-git', 'skip git initialisation')
    .option('--no-audit', 'skip the post-install vulnerability audit')
    .option('--dry-run', 'plan only — write nothing to disk', false)
    .option('-y, --yes', 'accept all defaults, never prompt', false)
    .allowExcessArguments(false)
    .parse([...argv]);

  return { flags: program.opts<RawFlags>(), nameArg: program.args[0] };
}

async function assertStylingInstallable(styling: Styling): Promise<void> {
  // An explicit --styling=ui-core must not silently produce a broken project
  // while the package is unpublished.
  if (styling === 'ui-core' && !(await packageExists(pkg('ui-core')))) {
    throw new CliError(`${pkg('ui-core')} is not published yet — use --styling=shadcn for now.`);
  }
}

function nonInteractiveConfig(nameArg: string | undefined, flags: RawFlags): ProjectConfig {
  const projectName = nameArg ?? 'cleevio-web-app';
  const nameError = validateProjectName(projectName);
  if (nameError) {
    throw new CliError(`Invalid project name: ${nameError}`);
  }

  return {
    addons: flags.addons ?? [],
    audit: flags.audit,
    auth: flags.auth ?? 'none',
    data: flags.data ?? 'tanstack-query',
    dryRun: flags.dryRun,
    git: flags.git,
    install: flags.install,
    packageManager: flags.pm ?? detectPackageManager(),
    projectName,
    // Default flips to ui-core once @cleeviox/ui-core is published.
    styling: flags.styling ?? 'shadcn',
    targetDir: path.resolve(process.cwd(), flags.dir ?? defaultDirectoryFor(projectName)),
  };
}

async function promptStyling(uiCoreAvailable: boolean): Promise<Styling> {
  return unwrap(
    await p.select({
      initialValue: (uiCoreAvailable ? 'ui-core' : 'shadcn') as Styling,
      message: 'UI & styling',
      options: [
        ...(uiCoreAvailable
          ? [{ hint: 'recommended', label: `Tailwind + ${pkg('ui-core')}`, value: 'ui-core' as Styling }]
          : []),
        {
          ...(uiCoreAvailable ? {} : { hint: 'recommended' }),
          label: 'Tailwind + shadcn/ui baseline',
          value: 'shadcn' as Styling,
        },
        { label: 'Tailwind only', value: 'tailwind-only' as Styling },
      ],
    }),
  );
}

async function promptData(): Promise<DataLayer> {
  return unwrap(
    await p.select({
      initialValue: 'tanstack-query' as DataLayer,
      message: 'Data fetching & state',
      options: [
        { hint: 'Server Components + client cache', label: 'TanStack Query', value: 'tanstack-query' as DataLayer },
        {
          hint: 'adds client-side global state',
          label: 'TanStack Query + Zustand',
          value: 'tanstack-query-zustand' as DataLayer,
        },
        { hint: 'no client data layer', label: 'Server Actions only', value: 'server-actions' as DataLayer },
      ],
    }),
  );
}

async function promptAuth(): Promise<Auth> {
  return unwrap(
    await p.select({
      initialValue: 'none' as Auth,
      message: 'Authentication',
      options: [
        { label: 'None', value: 'none' as Auth },
        { label: 'Auth.js (NextAuth v5)', value: 'authjs' as Auth },
        { label: 'Clerk', value: 'clerk' as Auth },
        { hint: 'httpOnly cookie + refresh rotation', label: 'Cleevio JWT flow', value: 'cleevio-jwt' as Auth },
      ],
    }),
  );
}

async function promptAddons(): Promise<readonly Addon[]> {
  return unwrap(
    await p.multiselect({
      initialValues: [] as Addon[],
      message: 'Add-ons & tooling',
      options: [
        { label: 'Docker (multi-stage, standalone output)', value: 'docker' as Addon },
        { label: 'Storybook', value: 'storybook' as Addon },
        { label: 'E2E testing (Playwright)', value: 'playwright' as Addon },
      ],
      required: false,
    }),
  );
}

async function promptPackageManager(detected: PackageManager): Promise<PackageManager> {
  return unwrap(
    await p.select({
      initialValue: detected,
      message: 'Package manager',
      options: [
        { label: 'pnpm', value: 'pnpm' as PackageManager },
        { label: 'npm', value: 'npm' as PackageManager },
        { label: 'bun', value: 'bun' as PackageManager },
      ],
    }),
  );
}

/**
 * Framework is deliberately NOT a prompt. Next.js + App Router is the Cleevio
 * standard; making it selectable invites drift we then have to support.
 */
async function collectConfig(nameArg: string | undefined, flags: RawFlags): Promise<ProjectConfig> {
  if (flags.yes || !process.stdin.isTTY) {
    return nonInteractiveConfig(nameArg, flags);
  }

  // Kicked off before the intro renders, awaited at the styling step — free latency-wise.
  const uiCoreProbe = packageExists(pkg('ui-core')).catch(() => false);

  p.intro(color.bgCyan(color.black(' create-web-template ')));
  p.note(
    [
      `${color.cyan('Next.js')}   App Router, TypeScript strict, ${color.dim('src/')}`,
      `${color.cyan('Tooling')}   ${pkg('tsconfig')} · ${pkg('biome')} · ${pkg('knip')}`,
      `${color.cyan('Versions')}  resolved live from npm — nothing pinned by hand`,
    ].join('\n'),
    'Cleevio baseline',
  );

  const projectName = unwrap(
    await p.text({
      defaultValue: nameArg ?? 'cleevio-web-app',
      message: 'Project name',
      placeholder: nameArg ?? 'cleevio-web-app',
      // Also rejects names whose output directory is already taken — better a
      // re-prompt here than a failure after five more answered questions.
      validate: (value) => {
        const candidate = value || (nameArg ?? 'cleevio-web-app');
        const nameError = validateProjectName(candidate);
        if (nameError) {
          return nameError;
        }
        if (flags.dir === undefined) {
          return targetDirectoryConflict(path.resolve(process.cwd(), defaultDirectoryFor(candidate)));
        }
        return undefined;
      },
      ...(nameArg === undefined ? {} : { initialValue: nameArg }),
    }),
  );

  // Covers the --dir override, which the name prompt cannot validate.
  const targetDir = path.resolve(process.cwd(), flags.dir ?? defaultDirectoryFor(projectName));
  const dirConflict = targetDirectoryConflict(targetDir);
  if (dirConflict) {
    throw new CliError(dirConflict);
  }

  const styling = flags.styling ?? (await promptStyling(await uiCoreProbe));
  const data = flags.data ?? (await promptData());
  const auth = flags.auth ?? (await promptAuth());
  const addons = flags.addons ?? (await promptAddons());
  const packageManager = flags.pm ?? (await promptPackageManager(detectPackageManager()));

  return {
    addons,
    audit: flags.audit,
    auth,
    data,
    dryRun: flags.dryRun,
    git: flags.git,
    install: flags.install,
    packageManager,
    projectName,
    styling,
    targetDir,
  };
}

async function main(): Promise<void> {
  const { flags, nameArg } = parseProgram(process.argv);
  const config = await collectConfig(nameArg, flags);
  if (!config.dryRun) {
    await assertStylingInstallable(config.styling);
  }
  const result = await scaffold(config);

  const packageManager = config.packageManager;
  const relative = path.relative(process.cwd(), config.targetDir) || '.';

  p.outro(
    [
      color.green('✔ Project ready.'),
      '',
      `  cd ${relative}`,
      ...(config.install ? [] : [`  ${packageManager} install`]),
      `  ${packageManager} run dev`,
      ...(result.auditWarnings > 0
        ? ['', color.yellow(`  ⚠ Advisories reported by \`${packageManager} audit\` — review before shipping.`)]
        : []),
    ].join('\n'),
  );
}

main().catch((error: unknown) => {
  if (error instanceof CliError) {
    p.log.error(error.message);
    process.exit(1);
  }
  p.log.error('Unexpected failure — this is a bug in create-web-template.');
  console.error(error);
  process.exit(1);
});
