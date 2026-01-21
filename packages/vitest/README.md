<div align="center">

<a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="https://media.licdn.com/dms/image/v2/D4E0BAQGEw-d0KstvqA/company-logo_200_200/company-logo_200_200/0/1739267861557/cleeviox_logo?e=1770249600&v=beta&t=8t9CF4oPTbILP9z4SBOcq0AIY8UcV5baTp3sTxHJew8" width="120" style="background-color: #151a1d; padding: 15px" />
</a>

# VITEST

[![NPM Version](https://img.shields.io/npm/v/%40cleeviox%2Fvitest)](https://www.npmjs.com/package/@cleeviox/vitest)

### Vitest configuration used on CleevioX projects

</div>

## Installation

```bash
bun add --dev @cleeviox/vitest vitest
```

### Optional peer dependencies

Depending on your use case, you may need to install additional peer dependencies:

```bash
# For coverage reporting
bun add --dev @vitest/coverage-v8

# For JSX/React testing (jsdom environment)
bun add --dev jsdom
```

## Usage

Create a `vitest.config.ts` file in your project root and extend one of the available configurations:

### Base

Suitable for general TypeScript/Node.js projects.

```typescript
import { base as default } from '@cleeviox/vitest/base';
```

This configuration includes:
- Node environment
- V8 coverage provider with cobertura, html, lcov, and text reporters
- Coverage for `src/**/*.ts` files

### JSX

For React/JSX projects with jsdom environment.

```typescript
import { jsx as default } from '@cleeviox/vitest';
```

This configuration includes:
- React plugin for JSX support
- jsdom environment
- V8 coverage provider
- Coverage for `src/**/*.{ts,tsx}` files
- Setup file at `tests/setup.ts`

### NestJS

For NestJS projects with SWC compilation.

```typescript
import { nestjs as default } from '@cleeviox/vitest';
```

This configuration includes:
- SWC plugin for fast compilation
- Path alias resolution for `src` directory
- Global test APIs enabled

## Running Tests

After setting up your configuration, you can run Vitest commands:

```bash
# Run tests
bun vitest

# Run tests in watch mode
bun vitest --watch

# Run tests with coverage
bun vitest --coverage

# Run tests once (CI mode)
bun vitest run
```

## Notes

- All configurations use the V8 coverage provider for fast and accurate coverage reporting
- The JSX configuration requires a `tests/setup.ts` file for test setup (e.g., testing-library cleanup)
- The NestJS configuration uses SWC for faster compilation compared to TypeScript
