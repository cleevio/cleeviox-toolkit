# `@cleeviox/create-web-template` — implementation plan

Status of the interactive Next.js project generator and the roadmap ahead.
Owner docs — update this file as phases land.

## Architecture (implemented)

```
wizard (@clack/prompts, commander flags, -y non-interactive)
   │  project name (+ inline dir-conflict validation), scope, tech stack,
   │  styling, Figma URL, data layer, auth, add-ons, package manager
   ▼
scaffold pipeline (src/scaffold.ts)
   1. preflight     — @cleeviox/* reachable on the registry (fail fast, clean disk)
   2. figma         — variables → theme.css contents (fails before anything is written)
   3. create-next-app@latest  — no vendored Next.js; flags gated on CNA major
   4. package.json  — feature deps resolved live from npm (caret ranges); CNA pins win
   5. configs       — two-line extends: @cleeviox/{tsconfig,biome,knip,lint-staged}
   6. templates     — Handlebars fragments per feature; later fragments overwrite earlier
   7. globals.css   — anchored patch (never overwrite): @import theme.css / ui-core styles.css
   8. install + audit (non-fatal; CI is the gate)
```

Key decisions already locked in:

- **No vendored Next.js boilerplate** — CVE mitigation by construction.
- **Regenerate, don't AST-patch** for files we author; **anchored patch** for files CNA owns (globals.css).
- **Ownership in packages**: ui-core ships `styles.css` (self-registering `@source`, future tokens); rules reach projects via dependency bumps, not re-scaffolds.
- **Static templates are typechecked** (`templates/tsconfig.json`, same strict config generated apps get); `.hbs` stays minimal.
- **Dockerfiles are static per package manager** — editor- and hadolint-lintable.

## Phase: CLAUDE.md initialization (in progress)

Goal: every generated project starts with a `CLAUDE.md` that gives agents real
context instead of the generic create-next-app one (which we overwrite).

- Wizard asks two new questions (both flag-drivable, both early in the flow):
  - **Project scope** — free-text one/two sentences (`--about`), lands verbatim
    in CLAUDE.md; empty leaves a TODO comment.
  - **Tech stack** — select, default **Frontend — Next.js** (`--stack nextjs`).
    Single option today; the enum exists so future stacks (see below) are a
    flag value, not a breaking redesign.
- `templates/base/CLAUDE.md.hbs` renders from the full `ProjectConfig`:
  scope, stack summary, per-feature tech list (styling/data/auth/add-ons),
  command reference matching the generated scripts, and Cleevio conventions
  (configs extend `@cleeviox/*` — propose rule changes in the toolkit, not inline;
  Server Components by default; env vars documented in `.env.example`).
- CNA's `AGENTS.md` is left untouched (framework-level guidance); our
  CLAUDE.md carries the project- and org-level layer.

## Phase: Figma design tokens (v1 shipped, fallback needed)

Shipped: `--figma <url>` / wizard prompt → REST `variables/local` → `src/app/theme.css`
(`@theme`: COLOR → `--color-*`, FLOAT → `--radius-*`/`--spacing-*` by name hint,
font STRING → `--font-*`; aliases resolved, default mode, token via `FIGMA_TOKEN`).

Open items, ordered:

1. **Pro-plan fallback** — `variables/local` is Enterprise-only and the Cleevio
   team is on `pro` (confirmed via Figma MCP whoami). On 403, fall back to
   `GET /v1/files/:key/styles` + node fetch: published color/text styles →
   `--color-*` / `--font-*` (no radius/spacing — styles don't carry them).
2. **Modes** — second Figma mode named dark-ish → `prefers-color-scheme: dark`
   override block in theme.css.
3. **Regeneration story** — `create-web-template sync-theme` subcommand that
   re-runs only the Figma → theme.css step inside an existing project
   (theme.css header already records the source URL).

## Phase: publish & adoption

1. Publish `@cleeviox/ui-core` (changeset ready) — the wizard's ui-core preset
   un-hides itself via the registry probe; flip the non-interactive styling
   default from `shadcn` to `ui-core` afterwards.
2. Publish `@cleeviox/create-web-template` (changeset ready) →
   `npm create @cleeviox/web-template`.
3. Real-world E2E of the ui-core preset (needs 1).

## Backlog / later

- **More stacks** behind `--stack`: `nestjs` backend is the obvious next one —
  `@cleeviox/tsconfig/nestjs` and `@cleeviox/biome/nestjs.jsonc` already exist;
  the scaffold step would swap create-next-app for the Nest CLI.
- `add <feature>` subcommand for existing projects — this is where AST-patching
  (ts-morph) becomes justified; scaffold-time stays regenerate-only.
- Typecheck-merge guard for `typescript` version: CNA pins `^5`, toolkit peers
  expect `^6` — decide whether toolkit-owned dev tools should win the merge.
- Matrix E2E in CI: scaffold N configuration combos into tmpdirs, run
  `tsc` + `next build` on each (the unit/render tests cover rendering, not builds).
- Audit gate policy: scaffold-time audit stays advisory; define the CI-side
  gate once a CI add-on (GitLab?) is designed — GitHub Actions add-on was
  removed intentionally.
