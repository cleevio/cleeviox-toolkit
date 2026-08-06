import process from 'node:process';
import { execa } from 'execa';
import { CliError } from './errors.js';
import { SCOPE } from './scope.js';

const PUBLIC_REGISTRY = process.env.npm_config_registry ?? 'https://registry.npmjs.org';
const HTTP_TIMEOUT_MS = 8000;
// The npm CLI cold-starts and may hit a slower private registry.
const NPM_CLI_TIMEOUT_MS = 20_000;
const RANGE_PREFIX_PATTERN = /^[\^~]/;
const cache = new Map<string, Promise<string | undefined>>();

/** Raw `latest` version, or undefined when the package does not exist / is unreachable. */
function fetchLatest(name: string): Promise<string | undefined> {
  const hit = cache.get(name);
  if (hit) {
    return hit;
  }

  // Private packages resolve through the npm CLI so scoped-registry config and
  // auth tokens in .npmrc apply; public ones take the fast, spawn-free HTTP path.
  const pending = name.startsWith(`${SCOPE}/`) ? viaNpmCli(name) : viaHttp(name);
  cache.set(name, pending);
  return pending;
}

async function viaHttp(name: string): Promise<string | undefined> {
  try {
    const response = await fetch(`${PUBLIC_REGISTRY}/-/package/${encodeURIComponent(name)}/dist-tags`, {
      signal: AbortSignal.timeout(HTTP_TIMEOUT_MS),
    });
    if (!response.ok) {
      return undefined;
    }
    const tags = (await response.json()) as { latest?: string };
    return tags.latest;
  } catch {
    return undefined;
  }
}

async function viaNpmCli(name: string): Promise<string | undefined> {
  const result = await execa('npm', ['view', name, 'version', '--json'], {
    reject: false,
    timeout: NPM_CLI_TIMEOUT_MS,
  });
  if (result.exitCode !== 0 || typeof result.stdout !== 'string') {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(result.stdout);
    return typeof parsed === 'string' ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Resolves a bare package name to a caret range built from the live `latest`
 * dist-tag — nothing in `templates/` ever carries a hardcoded version.
 *
 * Falls back to the literal `"latest"` specifier when the registry is
 * unreachable; that is still a valid npm range, so the install succeeds.
 */
async function resolveRange(name: string): Promise<string> {
  const version = await fetchLatest(name);
  return version ? `^${version}` : 'latest';
}

/** Existence probe — shares the cache, so a later resolveRange() costs nothing. */
export async function packageExists(name: string): Promise<boolean> {
  return (await fetchLatest(name)) !== undefined;
}

export async function resolveAll(names: readonly string[]): Promise<Record<string, string>> {
  const unique = [...new Set(names)];
  const ranges = await Promise.all(unique.map((name) => resolveRange(name)));
  return Object.fromEntries(unique.map((name, index) => [name, ranges[index] ?? 'latest']));
}

/** Latest published major of a package — used to gate create-next-app flags. */
export async function latestMajor(name: string): Promise<number> {
  const range = await resolveRange(name);
  const major = Number.parseInt(range.replace(RANGE_PREFIX_PATTERN, ''), 10);
  if (Number.isNaN(major)) {
    throw new CliError(`Could not determine the latest major of ${name}.`);
  }
  return major;
}
