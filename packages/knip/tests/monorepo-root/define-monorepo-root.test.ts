import { describe, expect, it } from 'bun:test';
import { defineMonorepoRootConfig } from '~/monorepo-root/define-monorepo-root-config.js';
import { baseMonorepoRootConfig } from '~/monorepo-root/monorepo-root.js';

describe('defineMonorepoRootConfig', () => {
  it('returns the base config when called with no overrides', () => {
    const result = defineMonorepoRootConfig();
    expect(result).toMatchObject(baseMonorepoRootConfig);
  });

  it('overrides workspace config', () => {
    const customWorkspaces = {
      '.': { entry: 'bin/*.js', project: 'bin/**/*.js' },
    };
    const result = defineMonorepoRootConfig({ workspaces: customWorkspaces });
    expect(result.workspaces).toEqual(customWorkspaces);
  });

  it('merges top-level scalar overrides', () => {
    const result = defineMonorepoRootConfig({ ignoreExportsUsedInFile: true });
    expect(result.ignoreExportsUsedInFile).toBe(true);
  });
});
