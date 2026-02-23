import { describe, expect, it } from 'bun:test';
import { defineConfig } from '~/define-config.js';
import { baseNextjsConfig } from '~/nextjs/nextjs.js';

describe('defineConfig (nextjs)', () => {
  it('returns the base config when called with no overrides', () => {
    const result = defineConfig(baseNextjsConfig);
    expect(result).toMatchObject(baseNextjsConfig);
  });

  it('merges top-level scalar overrides', () => {
    const result = defineConfig(baseNextjsConfig, { ignoreExportsUsedInFile: false });
    expect(result.ignoreExportsUsedInFile).toBe(false);
  });

  it('appends to ignore array', () => {
    const result = defineConfig(baseNextjsConfig, { ignore: ['src/generated/**'] });
    expect(result.ignore).toEqual([...baseNextjsConfig.ignore, 'src/generated/**']);
  });

  it('appends to ignoreDependencies array', () => {
    const result = defineConfig(baseNextjsConfig, { ignoreDependencies: ['lodash'] });
    expect(result.ignoreDependencies).toEqual([...baseNextjsConfig.ignoreDependencies, 'lodash']);
  });

  it('appends to project array', () => {
    const result = defineConfig(baseNextjsConfig, { project: ['e2e/**/*.ts'] });
    expect(result.project).toEqual([...baseNextjsConfig.project, 'e2e/**/*.ts']);
  });

  it('preserves base arrays when overrides arrays are empty', () => {
    const result = defineConfig(baseNextjsConfig, { ignore: [] });
    expect(result.ignore).toEqual(baseNextjsConfig.ignore);
  });

  it('overrides the next plugin config', () => {
    const customNext = { entry: ['src/pages/**/*.tsx'] };
    const result = defineConfig(baseNextjsConfig, { next: customNext });
    expect(result.next).toEqual(customNext);
  });
});
