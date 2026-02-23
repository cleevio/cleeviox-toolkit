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

All configurations are created with `defineConfig(base, overrides?)`. It performs a shallow merge of the base and overrides, while **appending** the `ignore`, `ignoreDependencies`, and `project` arrays rather than overwriting them.

### Monorepo Root

```ts
import { defineConfig, baseMonorepoRootConfig } from '@cleeviox/knip';

export default defineConfig(baseMonorepoRootConfig);
```

### Next.js Projects

```ts
import { defineConfig, baseNextjsConfig } from '@cleeviox/knip';

export default defineConfig(baseNextjsConfig);
```

To extend a base config, pass overrides as the second argument:

```ts
import { defineConfig, baseNextjsConfig } from '@cleeviox/knip';

export default defineConfig(baseNextjsConfig, {
  ignoreDependencies: ['my-extra-dep'],
  ignore: ['src/generated/**'],
});
```

You can also compose a fully custom config without a base:

```ts
import { defineConfig } from '@cleeviox/knip';

export default defineConfig({
  project: ['src/**/*.ts'],
  ignoreDependencies: ['some-dep'],
});
```

## Available Exports

| Export | Description |
|--------|-------------|
| `defineConfig` | Factory function — merges a base config with optional overrides, appending array fields |
| `baseNextjsConfig` | Base config for Next.js projects |
| `baseMonorepoRootConfig` | Base config for monorepo roots with workspace support |
| `KnipConfigObject` | TypeScript type for a knip configuration object |
