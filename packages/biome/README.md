<div align="center">

<a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="https://media.licdn.com/dms/image/v2/D4E0BAQGEw-d0KstvqA/company-logo_200_200/company-logo_200_200/0/1739267861557/cleeviox_logo?e=1770249600&v=beta&t=8t9CF4oPTbILP9z4SBOcq0AIY8UcV5baTp3sTxHJew8" width="120" style="background-color: #151a1d; padding: 15px" />
</a>

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

It is recommended to install `biome` globally for seamless integration with `biome`'s LSP.

```bash
  brew install biome
```

Add the following settings to your `settings.json` file:

```json
{
  {
	"editor.defaultFormatter": "biomejs.biome",
	"editor.formatOnSave": true,
	"[typescript]": {
		"editor.defaultFormatter": "biomejs.biome"
	},
	"[javascript]": {
		"editor.defaultFormatter": "biomejs.biome"
	},
	"[javascriptreact]": {
		"editor.defaultFormatter": "biomejs.biome"
	},
	"[typescriptreact]": {
		"editor.defaultFormatter": "biomejs.biome"
	},
	"[json]": {
		"editor.defaultFormatter": "biomejs.biome"
	},
	"[jsonc]": {
		"editor.defaultFormatter": "biomejs.biome"
	}
}
}
```

See the link below for a more detailed explanation.

[Further Reading](https://biomejs.dev/guides/editors/first-party-extensions/)

## Notes

- Biome combines formatting and linting in a single tool
- These configurations aim to match the existing ESLint and Prettier rules used in Cleevio projects
- Some ESLint rules may not have direct Biome equivalents - the configurations include the closest matches available