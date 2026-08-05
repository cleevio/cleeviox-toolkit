import { describe, expect, test } from 'bun:test';

import { injectCssImports } from '../src/lib/globals-css.js';

const CNA_GLOBALS = `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

body {
  background: var(--background);
}
`;

describe('injectCssImports', () => {
  test('inserts right after the tailwind import, keeping the baseline intact', () => {
    const { anchored, css } = injectCssImports(CNA_GLOBALS, ['@cleeviox/ui-core/styles.css']);
    expect(anchored).toBe(true);
    expect(css.startsWith(`@import "tailwindcss";\n@import '@cleeviox/ui-core/styles.css';`)).toBe(true);
    expect(css).toContain('--background: #ffffff');
  });

  test('handles single-quoted tailwind imports', () => {
    const { anchored, css } = injectCssImports(`@import 'tailwindcss';\nbody {}\n`, ['pkg/styles.css']);
    expect(anchored).toBe(true);
    expect(css).toContain(`@import 'tailwindcss';\n@import 'pkg/styles.css';`);
  });

  test('is idempotent', () => {
    const once = injectCssImports(CNA_GLOBALS, ['pkg/styles.css']).css;
    const twice = injectCssImports(once, ['pkg/styles.css']).css;
    expect(twice).toBe(once);
  });

  test('prepends and reports when the anchor is missing', () => {
    const { anchored, css } = injectCssImports('body {}\n', ['pkg/styles.css']);
    expect(anchored).toBe(false);
    expect(css.startsWith(`@import 'pkg/styles.css';`)).toBe(true);
  });

  test('no specifiers is a no-op', () => {
    expect(injectCssImports(CNA_GLOBALS, [])).toEqual({ anchored: true, css: CNA_GLOBALS });
  });
});
