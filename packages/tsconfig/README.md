<div align="center">

<a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="../../public/logo.svg" width="308"  style="background-color: #151a1d; padding: 15px" />
</a>

# TSCONFIG

### Typescript utilities for Cleeviox projects

</div>

## 👷 Installation

```bash
bun add --dev @cleeviox/tsconfig typescript
```

In a monorepo, install the package in the root, then create configs in each workspace.

## 🧠 Usage

Add one of the following configurations to your `tsconfig.json`:

### Root

Suitable for monorepo root.

```json
{
  "extends": "@cleeviox/tsconfig",
  "include": ["./*.js", "./*.ts"],
  "exclude": ["node_modules"]
}
```

> ⚠️ Do not use this configuration in monorepo workspaces or single-package repositories. Pick one of the following
> instead.

### App

Suitable for React SPAs.

```json
{
  "extends": "@cleeviox/tsconfig/app",
  "include": ["**/*.js", "**/*.ts", "**/*.tsx"],
  "exclude": ["build", "node_modules"]
}
```

### Library

Suitable for distributable `npm` packages (framework-agnostic).

```json
{
  "extends": "@cleeviox/tsconfig/library",
  "include": ["**/*.js", "**/*.ts", "**/*.tsx"],
  "exclude": ["dist", "node_modules"]
}
```

### Node.js

Suitable for Node.js services and apps.

```json
{
  "extends": "@cleeviox/tsconfig/nodejs",
  "include": ["**/*.js", "**/*.ts", "**/*.tsx"],
  "exclude": ["build", "node_modules"]
}
```

### Next.js

Suitable for Next.js apps.

```json
{
  "extends": "@cleeviox/tsconfig/nextjs",
  "include": [".next/types/**/*.ts", "**/*.js", "**/*.ts", "**/*.tsx"],
  "exclude": [".next/**/*.js", "node_modules"]
}
```

### Nest.js

Suitable for Nest.js apps.

```json
{
  "extends": "@cleeviox/tsconfig/nestjs",
  "include": ["**/*.js", "**/*.ts"],
  "exclude": ["build", "node_modules"]
}
```