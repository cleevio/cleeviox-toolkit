<div align="center">

<a href="https://github.com/cleevio/cleeviox-toolkit">
<img alt="CleevioX Logo" src="../../public/logo.svg" width="308"  style="background-color: #151a1d; padding: 15px" />

# LINT-STAGED

### Lint-staged config for cleeviox projects

</div>

## 👷 Installation

```bash
pnpm add --save-dev @cleevio/lint-staged lint-staged
```

## 🧠 Usage

### Monorepos

Install the package with `lint-staged` and create a `lint-staged.config.js` file in the root of your monorepo:

```js
export { root as default } from '@cleevio/lint-staged';
```

Then, create a `lint-staged.config.js` file in each workspace:

```js
export { workspace as default } from '@cleevio/lint-staged';
```

### Single-package repos

Install the package and create a `lint-staged.config.js` file in the root of your project:

```js
export { singlePackage as default } from '@cleevio/lint-staged';
```