import { describe, expect, it } from 'bun:test';
import { defineConfig } from '~/define-config.js';
import { baseMonorepoRootConfig } from '~/monorepo-root/monorepo-root.js';

describe('defineConfig (monorepo-root)', () => {
  it('returns the base config when called with no overrides', () => {
    const result = defineConfig(baseMonorepoRootConfig);
    expect(result).toMatchObject(baseMonorepoRootConfig);
  });

  it('overrides workspace config', () => {
    const customWorkspaces = {
      '.': { entry: 'bin/*.js', project: 'bin/**/*.js' },
    };
    const result = defineConfig(baseMonorepoRootConfig, { workspaces: customWorkspaces });
    expect(result.workspaces).toEqual(customWorkspaces);
  });

  it('merges top-level scalar overrides', () => {
    const result = defineConfig(baseMonorepoRootConfig, { ignoreExportsUsedInFile: true });
    expect(result.ignoreExportsUsedInFile).toBe(true);
  });
});
