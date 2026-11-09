---
'@cleeviox/create-web-template': patch
---

Freshly generated projects get working Tailwind and a working commit hook:

- `next.config.ts` is patched instead of rendered over, so create-next-app's `@tailwindcss/turbopack` loader (16.4+) survives — before, Tailwind wasn't processed at all
- `.husky/pre-commit` runs lint-staged — `prepare: husky` alone never installed a hook
- `.vscode/settings.json` makes Biome the formatter on save, overriding a user-level Prettier default
- the starter `page.tsx` suppresses `noJsxLiterals`, so `check` passes right after scaffolding
