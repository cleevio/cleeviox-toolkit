<div align="center">

<a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="https://media.licdn.com/dms/image/v2/D4E0BAQGEw-d0KstvqA/company-logo_200_200/company-logo_200_200/0/1739267861557/cleeviox_logo?e=1773273600&v=beta&t=YwuQOrr6dFoTzwBmBrgIoDBcVcnlxWPpsJQpxLseCAg" width="120" style="background-color: #151a1d; padding: 15px" />
</a>

# KNIP

[![NPM Version](https://img.shields.io/npm/v/%40cleeviox%2Fknip)](https://www.npmjs.com/package/@cleeviox/knip)

### Knip configuration used on CleevioX projects

</div>

## Installation

```bash
bun add --dev @cleeviox/knip knip
```

## Usage

Create a `knip.jsonc` file at the appropriate level and extend one of the provided configurations.

### Monorepo Root

For the root of a monorepo, use the `root.jsonc` configuration. It sets up workspace-aware entry and project patterns for scripts and packages.

```jsonc
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "extends": ["./node_modules/@cleeviox/knip/root.jsonc"]
}
```

### Next.js

For Next.js workspaces, use the `nextjs.jsonc` configuration. It includes sensible entry points for the App Router, middleware, and i18n modules.

```jsonc
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "extends": ["./node_modules/@cleeviox/knip/nextjs.jsonc"]
}
```

## Running Knip

After setting up your configuration, you can run Knip to find unused exports, files, and dependencies:

```bash
# Check for unused code
bun knip

# Check and include production-only analysis
bun knip --production
```

## Notes

- Knip helps identify dead code, unused dependencies, and missing exports across your project
- The `nextjs.jsonc` config pre-ignores common false positives such as icon assets and build-time dependencies like `postcss` and `tailwindcss`
- The `root.jsonc` config is designed for monorepos and should only be used at the repository root; individual workspaces should have their own `knip.jsonc`
