import { describe, expect, test } from 'bun:test';

import { toDestinationPath } from '../src/lib/template-path.js';

describe('toDestinationPath', () => {
  test('strips the .hbs suffix', () => {
    expect(toDestinationPath('next.config.ts.hbs')).toBe('next.config.ts');
  });

  test('maps underscore-prefixed segments to dot segments', () => {
    expect(toDestinationPath('_config/nested/file.yaml.hbs')).toBe('.config/nested/file.yaml');
    expect(toDestinationPath('_dockerignore')).toBe('.dockerignore');
    expect(toDestinationPath('_storybook/main.ts')).toBe('.storybook/main.ts');
  });

  test('leaves ordinary paths untouched', () => {
    expect(toDestinationPath('src/lib/query-client.ts')).toBe('src/lib/query-client.ts');
    expect(toDestinationPath('src/app/api/auth/[...nextauth]/route.ts')).toBe(
      'src/app/api/auth/[...nextauth]/route.ts',
    );
  });

  test('only strips .hbs at the very end', () => {
    expect(toDestinationPath('weird.hbs.txt')).toBe('weird.hbs.txt');
  });
});
