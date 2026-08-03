import { describe, expect, test } from 'bun:test';

import { defaultDirectoryFor, validateProjectName } from '../src/lib/project-name.js';

describe('defaultDirectoryFor', () => {
  test('plain names map to themselves', () => {
    expect(defaultDirectoryFor('my-app')).toBe('my-app');
  });

  test('scoped names drop the scope', () => {
    expect(defaultDirectoryFor('@cleeviox/portal')).toBe('portal');
  });
});

describe('validateProjectName', () => {
  test.each(['my-app', 'cleevio-web-app', '@cleevio/portal', 'app2', 'a'])('accepts %s', (name) => {
    expect(validateProjectName(name)).toBeUndefined();
  });

  test.each([
    ['', 'empty'],
    ['MyApp', 'uppercase'],
    ['.hidden', 'leading dot'],
    ['_private', 'leading underscore'],
    [' padded', 'whitespace'],
    ['has space', 'inner space'],
    ['a'.repeat(215), 'too long'],
    ['@cleevio/', 'scope without name'],
  ])('rejects %s (%s)', (name) => {
    expect(validateProjectName(name)).toBeDefined();
  });
});
