import { describe, expect, test } from 'bun:test';

import { injectNextConfigOptions } from '../src/lib/next-config.js';

/** create-next-app ≥16.4 with `--tailwind --turbopack`: the loader replaces postcss.config.mjs. */
const CNA_TURBOPACK_CONFIG = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
`;

const STRICT_MODE = { key: 'reactStrictMode', value: 'true' };
const STANDALONE = { comment: 'Self-contained server bundle.', key: 'output', value: "'standalone'" };

describe('injectNextConfigOptions', () => {
  test('inserts at the top of the config object, keeping the tailwind loader intact', () => {
    const { anchored, source } = injectNextConfigOptions(CNA_TURBOPACK_CONFIG, [STRICT_MODE]);
    expect(anchored).toBe(true);
    expect(source).toContain('const nextConfig: NextConfig = {\n  reactStrictMode: true,\n  /* config options here */');
    expect(source).toContain('loaders: ["@tailwindcss/turbopack"]');
  });

  test('renders the comment above its entry', () => {
    const { source } = injectNextConfigOptions(CNA_TURBOPACK_CONFIG, [STANDALONE, STRICT_MODE]);
    expect(source).toContain(
      "{\n  // Self-contained server bundle.\n  output: 'standalone',\n  reactStrictMode: true,\n",
    );
  });

  test('handles an untyped config object', () => {
    const { anchored, source } = injectNextConfigOptions('const nextConfig = {\n};\n', [STRICT_MODE]);
    expect(anchored).toBe(true);
    expect(source).toBe('const nextConfig = {\n  reactStrictMode: true,\n};\n');
  });

  test('is idempotent', () => {
    const once = injectNextConfigOptions(CNA_TURBOPACK_CONFIG, [STANDALONE, STRICT_MODE]).source;
    const twice = injectNextConfigOptions(once, [STANDALONE, STRICT_MODE]).source;
    expect(twice).toBe(once);
  });

  test('leaves the source untouched and reports when the config object is missing', () => {
    const source = 'export default { reactStrictMode: false };\n';
    expect(injectNextConfigOptions(source, [STRICT_MODE])).toEqual({ anchored: false, source });
  });
});
