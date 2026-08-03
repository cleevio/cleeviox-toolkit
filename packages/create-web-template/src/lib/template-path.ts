const PATH_SEPARATOR_PATTERN = /[\\/]/;
const HBS_SUFFIX_PATTERN = /\.hbs$/;

/**
 * Maps a template-relative source path to its destination path.
 *
 * - `*.hbs` suffix is stripped (the file was rendered, not copied).
 * - A path segment starting with `_` becomes a dot segment (`_storybook` →
 *   `.storybook`, `_dockerignore` → `.dockerignore`): npm strips `.gitignore`
 *   and friends from published tarballs, so dotfiles cannot ship as-is.
 */
export function toDestinationPath(relativePath: string): string {
  return relativePath
    .split(PATH_SEPARATOR_PATTERN)
    .map((segment) => (segment.startsWith('_') ? `.${segment.slice(1)}` : segment))
    .join('/')
    .replace(HBS_SUFFIX_PATTERN, '');
}
