import { describe, expect, it } from 'bun:test';
import { defineNextjsConfig } from '~/nextjs/define-nextjs-config.js';
import { baseNextjsConfig } from '~/nextjs/nextjs.js';

describe('defineNextjsConfig', () => {
  it('returns the base config when called with no overrides', () => {
    const result = defineNextjsConfig();
    expect(result).toMatchObject(baseNextjsConfig);
  });

  it('merges top-level scalar overrides', () => {
    const result = defineNextjsConfig({ ignoreExportsUsedInFile: false });
    expect(result.ignoreExportsUsedInFile).toBe(false);
  });

  it('appends to ignore array', () => {
    const result = defineNextjsConfig({ ignore: ['src/generated/**'] });
    expect(result.ignore).toEqual([...baseNextjsConfig.ignore, 'src/generated/**']);
  });

  it('appends to ignoreDependencies array', () => {
    const result = defineNextjsConfig({ ignoreDependencies: ['lodash'] });
    expect(result.ignoreDependencies).toEqual([...baseNextjsConfig.ignoreDependencies, 'lodash']);
  });

  it('appends to project array', () => {
    const result = defineNextjsConfig({ project: ['e2e/**/*.ts'] });
    expect(result.project).toEqual([...baseNextjsConfig.project, 'e2e/**/*.ts']);
  });

  it('preserves base arrays when overrides arrays are empty', () => {
    const result = defineNextjsConfig({ ignore: [] });
    expect(result.ignore).toEqual(baseNextjsConfig.ignore);
  });

  it('overrides the next plugin config', () => {
    const customNext = { entry: ['src/pages/**/*.tsx'] };
    const result = defineNextjsConfig({ next: customNext });
    expect(result.next).toEqual(customNext);
  });
});
