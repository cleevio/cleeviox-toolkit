import { describe, expect, test } from 'bun:test';

import { buttonVariants, cn } from '../src/index.js';

describe('cn', () => {
  test('merges and dedupes conflicting Tailwind utilities', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm', { hidden: false }, ['font-medium'])).toBe('text-sm font-medium');
  });
});

describe('buttonVariants', () => {
  test('applies defaults and variant overrides', () => {
    expect(buttonVariants({})).toContain('h-10');
    expect(buttonVariants({ size: 'sm', variant: 'outline' })).toContain('border');
    expect(buttonVariants({ size: 'sm' })).toContain('h-9');
  });
});
