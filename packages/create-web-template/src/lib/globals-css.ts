const TAILWIND_IMPORT_PATTERN = /@import\s+(['"])tailwindcss\1[^;]*;/;

export interface InjectResult {
  /** False when the tailwind import anchor was missing and lines were prepended instead. */
  readonly anchored: boolean;
  readonly css: string;
}

/**
 * Inserts `@import` lines into a globals.css right after its
 * `@import "tailwindcss"` line, keeping the create-next-app baseline intact.
 * Idempotent: specifiers already imported are skipped. When the anchor is
 * missing (create-next-app changed its output), lines are prepended — CSS
 * imports must precede other rules — and the caller should warn.
 */
export function injectCssImports(source: string, specifiers: readonly string[]): InjectResult {
  const lines = specifiers.map((specifier) => `@import '${specifier}';`).filter((line) => !source.includes(line));
  if (lines.length === 0) {
    return { anchored: true, css: source };
  }

  const block = lines.join('\n');
  const anchor = TAILWIND_IMPORT_PATTERN.exec(source);
  if (anchor) {
    const insertAt = anchor.index + anchor[0].length;
    return { anchored: true, css: `${source.slice(0, insertAt)}\n${block}${source.slice(insertAt)}` };
  }
  return { anchored: false, css: `${block}\n${source}` };
}
