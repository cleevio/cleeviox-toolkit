<div align="center">

<a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="./public/logo.svg" width="308" style="background-color: #151a1d; padding: 15px" />
</a>

# Contributing to CleevioX Toolkit

</div>

---

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the CleevioX Toolkit.

## Prerequisites

- Node.js >= 24.0.0
- Bun >= 1.3.6
- Git

## Getting Started

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/cleeviox-toolkit.git
   cd cleeviox-toolkit
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Building

```bash
bun run build
```

### Linting

```bash
# Run linter
bun run lint

# Fix linting issues
bun run lint:fix
```

### Type Checking

```bash
bun run ts
```

### Formatting

```bash
# Check formatting
bun run format

# Fix formatting
bun run format:fix
```

## Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Please format your commit messages accordingly:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code refactoring without feature changes |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks, dependencies, etc. |
| `ci` | CI/CD configuration changes |

### Examples

```bash
feat(biome): add support for Vue.js configuration
fix(tsconfig): correct module resolution for ESM
docs(readme): update installation instructions
chore(deps): bump typescript to 5.9.3
```

## Pull Request Process

1. Ensure all checks pass locally:

   ```bash
   bun run build && bun run lint && bun run ts
   ```

2. Update documentation if needed

3. Add a changeset if your change affects published packages:

   ```bash
   bun changeset
   ```

4. Push your branch and open a pull request

5. Fill out the PR template with a clear description of your changes

6. Wait for review and address any feedback

## Adding a New Package

1. Create a new directory under `packages/`:

   ```bash
   mkdir packages/your-package
   ```

2. Add a `package.json` with the required fields:

   ```json
   {
     "name": "@cleeviox/your-package",
     "version": "0.0.0",
     "type": "module",
     "repository": {
       "type": "git",
       "url": "https://github.com/cleevio/cleeviox-toolkit",
       "directory": "packages/your-package"
     }
   }
   ```

3. Add a `biome.jsonc` extending the base configuration:

   ```json
   {
     "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
     "extends": ["../biome/base.jsonc"]
   }
   ```

4. Add a `README.md` with the logo and documentation

5. Run `bun install` to link the new package

## Code Style

- Use TypeScript for all source files
- Follow the Biome configuration for linting and formatting
- Write clear, descriptive variable and function names
- Add JSDoc comments for public APIs

## Questions?

If you have questions or need help, feel free to open an issue on GitHub.
