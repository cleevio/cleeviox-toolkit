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

### Monorepo Root

For a monorepo, create a `knip.ts` file in the repository root:

```ts
import { monorepoRootConfig } from '@cleeviox/knip';
import type { KnipConfig } from 'knip';

/**
 * @filename: knip.ts
 */
export default {
  ...monorepoRootConfig,
} satisfies KnipConfig;
```

### Next.js Projects

For a Next.js project, create a `knip.ts` file in your project root:

```ts
import { nextjsConfig } from '@cleeviox/knip';
import type { KnipConfig } from 'knip';

/**
 * @filename: knip.ts
 */
export default {
  ...nextjsConfig,
} satisfies KnipConfig;
```

## Available Configurations

| Export | Description |
|--------|-------------|
| `monorepoRootConfig` | Configuration for monorepo roots with workspace support |
| `nextjsConfig` | Configuration for Next.js projects |
