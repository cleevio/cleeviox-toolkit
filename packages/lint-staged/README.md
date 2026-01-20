<div align="center">

<a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="./public/logo.svg" width="308" style="background-color: #151a1d; padding: 15px" />
</a>

# LINT-STAGED

[![NPM Version](https://img.shields.io/npm/v/%40cleeviox%2Flint-staged)](https://www.npmjs.com/package/@cleeviox/lint-staged)

### Lint-staged configuration used on CleevioX projects

</div>

## 👷 Installation

```bash
bun add --dev @cleeviox/lint-staged lint-staged
```

## 🧠 Usage

### Monorepo Root

Install the package with `lint-staged` and create a `lint-staged.config.js` file in the root of your monorepo:

```js
import { projectRoot } from '@cleeviox/lint-staged';

export default {
  ...projectRoot,
};
```

### Monorepo Workspaces

Create a `lint-staged.config.js` file in each workspace:

```js
import { workspace } from '@cleeviox/lint-staged';

export default {
  ...workspace,
};
```

### Single-Package Repos

For standalone projects, create a `lint-staged.config.js` file in the root:

```js
import { basicProject } from '@cleeviox/lint-staged';

export default {
  ...basicProject,
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
