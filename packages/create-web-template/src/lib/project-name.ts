/**
 * Directory a project scaffolds into, derived from its package name: the part
 * after the slash for scoped names (`@cleeviox/portal` → `portal`), the name
 * itself otherwise. Overridable with the `--dir` flag.
 */
export function defaultDirectoryFor(projectName: string): string {
  const slashIndex = projectName.indexOf('/');
  return slashIndex === -1 ? projectName : projectName.slice(slashIndex + 1);
}

/** npm's hard limit on package-name length. */
const MAX_NAME_LENGTH = 214;

const SCOPED_NAME_PATTERN = /^@[a-z0-9-*~][a-z0-9-*._~]*\/[a-z0-9-~][a-z0-9-._~]*$/;
const UNSCOPED_NAME_PATTERN = /^[a-z0-9-~][a-z0-9-._~]*$/;

/**
 * npm package-name rules for *new* packages, inlined: `validate-npm-package-name`
 * ships no types since v8 and the @types package is three majors stale.
 *
 * Returns an error message, or undefined when the name is valid.
 */
export function validateProjectName(name: string): string | undefined {
  if (name.length === 0) {
    return 'Project name cannot be empty.';
  }
  if (name.length > MAX_NAME_LENGTH) {
    return `Project name must be at most ${MAX_NAME_LENGTH} characters.`;
  }
  if (name !== name.toLowerCase()) {
    return 'Project name must be lowercase.';
  }
  if (name.startsWith('.') || name.startsWith('_')) {
    return 'Project name cannot start with a dot or an underscore.';
  }
  if (name !== name.trim()) {
    return 'Project name cannot contain leading or trailing whitespace.';
  }
  if (!(SCOPED_NAME_PATTERN.test(name) || UNSCOPED_NAME_PATTERN.test(name))) {
    return 'Project name contains invalid characters (npm package-name rules apply).';
  }
  return undefined;
}
