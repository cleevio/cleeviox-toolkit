# @cleeviox/create-web-template

Interactive generator for Cleevio Next.js applications.

```bash
npm create @cleeviox/web-template
# or
npx @cleeviox/create-web-template my-app --styling shadcn --addons docker,playwright -y
```

## What it does

1. Runs `create-next-app@latest` (App Router, TypeScript, Tailwind, `src/` dir) — no vendored Next.js boilerplate, so new projects always start on the current stable release.
2. Resolves the latest stable versions of all optional dependencies from the registry (caret ranges, nothing pinned by hand) and merges them into `package.json`.
3. Attaches the Cleevio toolkit configs (`@cleeviox/tsconfig`, `@cleeviox/biome`, `@cleeviox/knip`, `@cleeviox/lint-staged`) as two-line `extends` files.
4. Renders feature templates (styling, data layer, auth, add-ons) with Handlebars.
5. Installs dependencies with your package manager and runs a non-fatal vulnerability audit — enforce the gate in your CI pipeline, where a failure is actionable.

## Flags

| Flag | Values | Default |
| --- | --- | --- |
| `--pm <manager>` | `pnpm` `npm` `bun` | detected from invoker |
| `--styling <preset>` | `ui-core` `shadcn` `tailwind-only` | `shadcn` (until `@cleeviox/ui-core` is published) |
| `--data <preset>` | `server-actions` `tanstack-query` `tanstack-query-zustand` | `tanstack-query` |
| `--auth <provider>` | `none` `authjs` `clerk` `cleevio-jwt` | `none` |
| `--addons <list>` | `docker,storybook,playwright` | none |
| `--dir <path>` | output directory | derived from project name (`@scope/app` → `./app`) |
| `--no-install` / `--no-git` / `--no-audit` | | |
| `--dry-run` | plan only, write nothing | `false` |
| `-y, --yes` | accept defaults, never prompt | `false` |

## Template conventions

- `*.hbs` files are rendered with Handlebars (`strict` mode); everything else is copied verbatim.
- A path segment starting with `_` becomes a dot segment on output (`_storybook/` → `.storybook/`, `_dockerignore` → `.dockerignore`) because npm strips dotfiles like `.gitignore` from published tarballs.
- Fragments are applied in feature order; later fragments may overwrite earlier files — that is the composition mechanism, not an accident.
- The Dockerfile ships as three static, per-package-manager files (`addons/docker/{pnpm,npm,bun}/Dockerfile`) instead of one template, so editors and hadolint can lint them.
