<div align="center">

<a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="../../public/logo.svg" width="308"  style="background-color: #151a1d; padding: 15px" />

# BIOME

### Biome configurations for cleeviox projects

</a>
</div>

## 👷 Installation

```bash
pnpm add --save-dev @cleevio/biome @biomejs/biome
```

## Usage

Extend the appropriate configuration in your `biome.json` file by referencing the package through `node_modules`:

### Base

Suitable for general TypeScript projects.

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "extends": ["./node_modules/@cleevio/biome/base.json"]
}
```

### React

For React (JSX) projects.

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "extends": ["./node_modules/@cleevio/biome/react.json"]
}
```

### Next.js

For Next.js projects (extends React configuration).

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "extends": ["./node_modules/@cleevio/biome/nextjs.json"]
}
```

### NestJS

For NestJS projects.

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "extends": ["./node_modules/@cleevio/biome/nestjs.json"]
}
```

## Running Biome

After setting up your configuration, you can run Biome commands:

```bash
# Check code
pnpm biome check .

# Format code
pnpm biome format --write .

# Lint code
pnpm biome lint .

# Fix issues
pnpm biome check --write .
```

## Setup With IDE

First install the official VSCode extension.

Add the following settings to your `settings.json` file:

```json
{
  "editor.codeActionsOnSave": {
    "source.action.useSortedKeys.biome": "explicit",
    "source.fixAll.biome": "explicit"
  },
  "editor.defaultFormatter": "biomejs.biome",
  "[github-actions-workflow]": {
    "editor.defaultFormatter": "redhat.vscode-yaml"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

See the link below for a more detailed explanation.

[Further Reading](https://biomejs.dev/guides/editors/first-party-extensions/)

## Notes

- Biome combines formatting and linting in a single tool
- These configurations aim to match the existing ESLint and Prettier rules used in Cleevio projects
- Some ESLint rules may not have direct Biome equivalents - the configurations include the closest matches available