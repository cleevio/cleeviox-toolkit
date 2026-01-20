<div align="center">

<a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="https://cdn.prod.website-files.com/673a5bd2bc85b7eb95ca2680/675014f89c10e31bea648179_Logo%20Space.svg" width="308" style="background-color: #151a1d; padding: 15px" />
</a>

# TSCONFIG

[![NPM Version](https://img.shields.io/npm/v/%40cleeviox%2Ftsconfig)](https://www.npmjs.com/package/@cleeviox/tsconfig)

### TypeScript configuration used on CleevioX projects

</div>

## Installation

```bash
bun add --dev @cleeviox/tsconfig typescript
```

In a monorepo, install the package in the root, then create configs in each workspace.

## Usage

Use one of the following configurations by creating a `tsconfig.json` file relative to its root based on your need:

### Library

Used for workspaces, which contain pieces of code, which are meant to be reusable, for instance `packages/utils`.

```json
{
  "extends": "@cleeviox/tsconfig/library",
  "include": ["**/*.js", "**/*.ts", "**/*.tsx"],
  "exclude": ["dist", "node_modules"]
}
```

If you intend to distribute your workspace, you should also add a `tsconfig.build.json` file, which actually emits files:

```json
{
  "compilerOptions": {
    "noEmit": false,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "extends": "./tsconfig.json",
  "include": ["./src"],
  "references": []
}
```

Then build your package by specifying which config to use:

```bash
# package.json
"scripts": {
    "build": "tsc --build tsconfig.build.json"
  }
```

### App

Used for react applications.

```json
{
  "extends": "@cleeviox/tsconfig/app",
  "include": ["**/*.js", "**/*.ts", "**/*.tsx"],
  "exclude": ["build", "node_modules"]
}
```

### Node.js

Used for nodejs projects which do not rely on any frameworks. For `nestjs` use this [config](#nestjs)

```json
{
  "extends": "@cleeviox/tsconfig/nodejs",
  "include": ["**/*.js", "**/*.ts", "**/*.tsx"],
  "exclude": ["build", "node_modules"]
}
```

### Next.js

Used for `nestjs` projects:

```json
{
  "extends": "@cleeviox/tsconfig/nextjs",
  "include": [".next/types/**/*.ts", "**/*.js", "**/*.ts", "**/*.tsx"],
  "exclude": [".next/**/*.js", "node_modules"]
}
```

### Nest.js

Used for `nextjs` projects:

```json
{
  "extends": "@cleeviox/tsconfig/nestjs",
  "include": ["**/*.js", "**/*.ts"],
  "exclude": ["build", "node_modules"]
}
```

### Root

If your project is a monorepo, use this configuration for the project root __only__. Every subsequent workspace then has its own `tsconfig.json` file, chosen from the above configs based on its purpose.

```json
{
  "extends": "@cleeviox/tsconfig",
  "include": ["./*.js", "./*.ts"],
  "exclude": ["node_modules"]
}
```