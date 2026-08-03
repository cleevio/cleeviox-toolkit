---
'@cleeviox/create-web-template': minor
---

Initial release of the interactive Cleevio Next.js project generator.

- Delegates to `create-next-app@latest` (App Router, TypeScript, Tailwind, Biome instead of ESLint) — no vendored Next.js boilerplate.
- Resolves latest stable versions for all optional dependencies at scaffold time (caret ranges, private scope via npm CLI so `.npmrc` auth applies).
- Interactive wizard (`@clack/prompts`) for styling, data layer, auth, and add-ons (Docker, Storybook, Playwright); fully flag-driven non-interactive mode with `-y`.
- Attaches `@cleeviox/tsconfig`, `@cleeviox/biome`, `@cleeviox/knip`, `@cleeviox/lint-staged` as two-line extends files.
- Post-scaffold install with the caller's package manager plus a non-fatal `audit` pass.
