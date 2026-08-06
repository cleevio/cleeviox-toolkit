import fs from 'node:fs';

/** Entries that do not block scaffolding into an existing directory. */
const IGNORABLE = new Set(['.git', '.DS_Store']);

/**
 * Returns an error message when the directory exists and contains anything
 * meaningful, undefined when it is safe to scaffold into. Sync so it can run
 * inside a prompt's validate callback, before any other question is asked.
 */
export function targetDirectoryConflict(dir: string): string | undefined {
  let entries: readonly string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    // ENOENT and friends: the directory will be created; real I/O errors
    // resurface with context once the scaffold actually writes.
    return undefined;
  }
  const blocking = entries.filter((entry) => !IGNORABLE.has(entry));
  if (blocking.length === 0) {
    return undefined;
  }
  return `Directory is not empty: ${dir} — pick a different name or run inside an empty folder.`;
}
