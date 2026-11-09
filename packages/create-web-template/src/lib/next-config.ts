import type { NextConfigOption } from '../types.js';

const CONFIG_OBJECT_PATTERN = /const nextConfig(?::\s*NextConfig)?\s*=\s*\{[^\S\n]*\n/;

export interface InjectNextConfigResult {
  /** False when the `nextConfig` object literal was not found — the source is then returned untouched. */
  readonly anchored: boolean;
  readonly source: string;
}

/**
 * Inserts options at the top of create-next-app's `nextConfig` object,
 * keeping everything it generated there (e.g. the Tailwind turbopack loader)
 * intact. Idempotent: keys already present in the source are skipped.
 */
export function injectNextConfigOptions(source: string, options: readonly NextConfigOption[]): InjectNextConfigResult {
  const anchor = CONFIG_OBJECT_PATTERN.exec(source);
  if (!anchor) {
    return { anchored: false, source };
  }

  const block = options
    .filter((option) => !new RegExp(`^\\s*${option.key}\\s*:`, 'm').test(source))
    .map(renderOption)
    .join('');
  const insertAt = anchor.index + anchor[0].length;
  return { anchored: true, source: `${source.slice(0, insertAt)}${block}${source.slice(insertAt)}` };
}

/** Renders one option as object-literal lines, its comment first. */
function renderOption({ comment, key, value }: NextConfigOption): string {
  const commentLine = comment === undefined ? '' : `  // ${comment}\n`;
  return `${commentLine}  ${key}: ${value},\n`;
}
