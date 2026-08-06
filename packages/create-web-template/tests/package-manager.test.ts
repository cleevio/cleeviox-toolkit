import { describe, expect, test } from 'bun:test';

import { auditArgs, dlx } from '../src/lib/package-manager.js';

describe('dlx', () => {
  test('builds a runnable command per package manager', () => {
    expect(dlx('pnpm', 'create-next-app@latest')).toEqual(['pnpm', 'dlx', 'create-next-app@latest']);
    expect(dlx('bun', 'create-next-app@latest')).toEqual(['bunx', 'create-next-app@latest']);
    expect(dlx('npm', 'create-next-app@latest')).toEqual(['npm', 'exec', '--yes', '--', 'create-next-app@latest']);
  });
});

describe('auditArgs', () => {
  test('uses a high severity threshold where supported', () => {
    expect(auditArgs('pnpm')).toEqual(['pnpm', 'audit', '--audit-level', 'high']);
    expect(auditArgs('npm')).toEqual(['npm', 'audit', '--audit-level=high']);
    expect(auditArgs('bun')).toEqual(['bun', 'audit']);
  });
});
