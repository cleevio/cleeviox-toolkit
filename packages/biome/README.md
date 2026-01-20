<div align="center">

<!-- <a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="https://cdn.prod.website-files.com/673a5bd2bc85b7eb95ca2680/675014f89c10e31bea648179_Logo%20Space.svg" width="308" style="background-color: #151a1d; padding: 15px" />
</a> -->

# BIOME

[![NPM Version](https://img.shields.io/npm/v/%40cleeviox%2Fbiome)](https://www.npmjs.com/package/@cleeviox/biome)

### Biome configuration used on CleevioX projects

</div>

## Installation

```bash
bun add --dev @cleeviox/biome @biomejs/biome
```

## Usage

Extend the appropriate configuration in your `biome.json` file by referencing the package through `node_modules`:

### Base

Suitable for general TypeScript projects.

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "extends": ["./node_modules/@cleeviox/biome/base.json"]
}
```

### React

For React (JSX) projects.

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "extends": ["./node_modules/@cleeviox/biome/react.json"]
}
```

### Next.js

For Next.js projects (extends React configuration).

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "extends": ["./node_modules/@cleeviox/biome/nextjs.json"]
}
```

### NestJS

For NestJS projects.

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "extends": ["./node_modules/@cleeviox/biome/nestjs.json"]
}
```

## Running Biome

After setting up your configuration, you can run Biome commands:

```bash
# Check code
bun biome check .

# Format code
bun biome format --write .

# Lint code
bun biome lint .

# Fix issues
bun biome check --write .
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