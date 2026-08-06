# @cleeviox/create-web-template

Interactive generator for Cleevio Next.js applications.

```bash
npm create @cleeviox/web-template
# or (init is the default subcommand — explicit form works too)
npx @cleeviox/create-web-template init my-app --styling shadcn --addons docker,playwright -y
```

Future subcommands (`sync-theme`, `add <feature>`) will live under the same bin.

## What it does

1. Runs `create-next-app@latest` (App Router, TypeScript, Tailwind, `src/` dir) — no vendored Next.js boilerplate, so new projects always start on the current stable release.
2. Resolves the latest stable versions of all optional dependencies from the registry (caret ranges, nothing pinned by hand) and merges them into `package.json`.
3. Attaches the Cleevio toolkit configs (`@cleeviox/tsconfig`, `@cleeviox/biome`, `@cleeviox/knip`, `@cleeviox/lint-staged`) as two-line `extends` files.
4. Renders feature templates (styling, data layer, auth, add-ons) with Handlebars — including a project-specific `CLAUDE.md` built from your answers (scope, stack, features, commands, Cleevio conventions); create-next-app's `AGENTS.md` is kept as the framework-level layer.
5. Registers the [Cleevio Claude Code marketplace](https://gitlab.com/honzanemecek/cleevio-marketplace) in a committed `.claude/settings.json` (`cleevio-core` + `cleevio-frontend` plugins enabled) and, when the `claude` CLI is available, installs the frontend plugin right away — opt out with `--no-claude-marketplace`.
6. Installs dependencies with your package manager and runs a non-fatal vulnerability audit — enforce the gate in your CI pipeline, where a failure is actionable.
7. Offers to start the dev server right away (interactive runs only — never with `-y`, `--dry-run` or `--no-install`).

## Flags

| Flag | Values | Default |
| --- | --- | --- |
| `--about <text>` | project scope, lands in the generated CLAUDE.md | empty (TODO placeholder) |
| `--stack <stack>` | `nextjs` | `nextjs` (more stacks planned) |
| `--pm <manager>` | `pnpm` `npm` `bun` | detected from invoker |
| `--styling <preset>` | `ui-core` `shadcn` `tailwind-only` | `shadcn` (until `@cleeviox/ui-core` is published) |
| `--data <preset>` | `server-actions` `tanstack-query` `tanstack-query-zustand` | `tanstack-query` |
| `--auth <provider>` | `none` `workos` `firebase` | `none` |
| `--addons <list>` | `docker,storybook,playwright` | none |
| `--dir <path>` | output directory | derived from project name (`@scope/app` → `./app`) |
| `--figma <url>` | Figma file URL — variables become `src/app/theme.css` | off |
| `--no-claude-marketplace` | skip Claude Code marketplace setup | marketplace on |
| `--no-install` / `--no-git` / `--no-audit` | | |
| `--dry-run` | plan only, write nothing | `false` |
| `-y, --yes` | accept defaults, never prompt | `false` |

## Figma design tokens

Pass `--figma <file-url>` (or answer the wizard prompt) and the generator reads the file's [local variables](https://www.figma.com/developers/api#variables) and writes them as `src/app/theme.css`, imported from `globals.css` via the same patch mechanism as feature stylesheets:

- `COLOR` → `--color-<slug>` in `@theme` (hex, or `rgb(… / a)` when translucent); aliases are resolved, default mode is used
- `FLOAT` → `--radius-*` / `--spacing-*` when the name hints at it, plain `:root` var otherwise (px)
- font-ish `STRING` → `--font-*`; booleans are skipped

Requires a token in `FIGMA_TOKEN` (or `FIGMA_ACCESS_TOKEN`) with the `file_variables:read` scope — the variables REST API is **Figma Enterprise only**. The fetch runs before anything is written to disk, so a bad token fails fast; the token itself is never persisted.

## Template conventions

- `*.hbs` files are rendered with Handlebars (`strict` mode); everything else is copied verbatim.
- A path segment starting with `_` becomes a dot segment on output (`_storybook/` → `.storybook/`, `_dockerignore` → `.dockerignore`) because npm strips dotfiles like `.gitignore` from published tarballs.
- Fragments are applied in feature order; later fragments may overwrite earlier files — that is the composition mechanism, not an accident.
- The Dockerfile ships as three static, per-package-manager files (`addons/docker/{pnpm,npm,bun}/Dockerfile`) instead of one template, so editors and hadolint can lint them.
