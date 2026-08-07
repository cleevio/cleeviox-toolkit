---
'@cleeviox/create-web-template': patch
---

Generated projects now pass their own `check` out of the box, and dead references are gone:

- post-install `check:fix` pass aligns create-next-app's output with the project's biome config (the first commit no longer fights the husky hook)
- `.env.example` is always generated (CLAUDE.md's routing table points at it)
- CLAUDE.md only promises `src/app/theme.css` when a Figma URL actually generated it
- WorkOS template migrated from the deprecated `middleware.ts` convention to `proxy.ts` (Next 16.3+); favicon svg carries a title for a11y
