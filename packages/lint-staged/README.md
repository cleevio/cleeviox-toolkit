<div align="center">

<a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="./public/logo.svg" width="308" style="background-color: #151a1d; padding: 15px" />
</a>

# LINT-STAGED

[![NPM Version](https://img.shields.io/npm/v/%40cleeviox%2Flint-staged)](https://www.npmjs.com/package/@cleeviox/lint-staged)

### Lint-staged configuration used on CleevioX projects

</div>

## Installation

```bash
bun add --dev @cleeviox/lint-staged lint-staged
```

## Usage

### Standalone Repositories

For simple, non-monorepo project, add the following configuration to your project root by creating a  `lint-staged.config.js` file with the following contents: 

```js
import { basicProject } from '@cleeviox/lint-staged';

/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  // Additional configuration
  ...projectRoot,
}
```

### Monorepo Root

If your project is a monorepo, install `lint-staged` and create a `lint-staged.config.js` file in the repository root as such:

```js
import { projectRoot } from '@cleeviox/lint-staged';

/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  // Additional configuration
  ...projectRoot,
};
```

### Monorepo Workspaces

Every workspace i.e. every directory inside `apps/` or `packages/` must have its own `lint-staged.config.js` as such:

```js
import { workspace } from '@cleeviox/lint-staged';

/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  // Additional configuration
  ...projectRoot,
};
```

## Available Configurations

| Export | Description |
|--------|-------------|
| `projectRoot` | Configuration for monorepo root with special file handling |
| `workspace` | Configuration for monorepo workspaces |
| `basicProject` | Configuration for single-package repositories |

## Integration with Husky

Add lint-staged to your pre-commit hook:

```bash
# .husky/pre-commit
bun lint-staged
```
