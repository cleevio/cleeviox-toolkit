---
'@cleeviox/ui-core': minor
---

Initial release: core UI primitives for CleevioX Next.js projects — `cn()` (clsx + tailwind-merge) and a CVA-based `Button`/`buttonVariants`. Tailwind v4 + React 19; consumers add a single `@import '@cleeviox/ui-core/styles.css'` to globals.css — the stylesheet self-registers the package's sources with Tailwind (`@source` inside) and will carry shared design tokens (wired automatically by `@cleeviox/create-web-template`'s `ui-core` styling preset).
