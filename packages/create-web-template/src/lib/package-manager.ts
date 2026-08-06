import process from 'node:process';
import type { PackageManager } from '../types.js';

export function detectPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent ?? '';
  if (userAgent.startsWith('bun')) {
    return 'bun';
  }
  if (userAgent.startsWith('pnpm')) {
    return 'pnpm';
  }
  return 'npm';
}

/** Command that runs a remote binary without installing it globally. */
export function dlx(packageManager: PackageManager, packageSpec: string): readonly [string, ...string[]] {
  switch (packageManager) {
    case 'pnpm':
      return ['pnpm', 'dlx', packageSpec];
    case 'bun':
      return ['bunx', packageSpec];
    case 'npm':
      return ['npm', 'exec', '--yes', '--', packageSpec];
  }
}

export function auditArgs(packageManager: PackageManager): readonly [string, ...string[]] {
  switch (packageManager) {
    case 'pnpm':
      return ['pnpm', 'audit', '--audit-level', 'high'];
    case 'npm':
      return ['npm', 'audit', '--audit-level=high'];
    case 'bun':
      // bun audit has no severity threshold flag.
      return ['bun', 'audit'];
  }
}
