---
'@cleeviox/biome': patch
---

The React and Next.js presets no longer break stock App Router projects:

- `reactjs`: `noReactSpecificProps` is off — it targets Solid/Qwik, and its fix rewrote every `className` to `class`
- `reactjs`: Storybook config and CSF stories may default-export
- `nextjs`: `useImportExtensions` is off — Turbopack can't resolve `./file.js` to `file.tsx`, and the forced `.js` fix rewrote `./globals.css` to `./globals.js`
- `nextjs`: Next.js file conventions (`page`, `layout`, `loading`, metadata files, `proxy`, …) may default-export, and route segments may export `metadata`, `generateMetadata`, `revalidate` & co. next to the component
- `nextjs`: Biome skips what `.gitignore` excludes (`.next/`, `next-env.d.ts`)
