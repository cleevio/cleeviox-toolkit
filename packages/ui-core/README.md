# @cleeviox/ui-core

Core UI primitives and utilities for CleevioX Next.js projects (Tailwind v4 + React 19).

```bash
bun add @cleeviox/ui-core
```

## Usage

```tsx
import { Button, cn } from '@cleeviox/ui-core';

<Button variant="outline" size="sm" className={cn('mt-4', isWide && 'w-full')}>
  Save
</Button>;
```

Add one import to your `globals.css` — the package registers its own sources with Tailwind (`@source` inside `styles.css`) and will carry shared design tokens over time:

```css
@import 'tailwindcss';
@import '@cleeviox/ui-core/styles.css';
```

Projects scaffolded with `@cleeviox/create-web-template` get this wired automatically when the `ui-core` styling preset is selected.

## Exports

- `cn(...inputs)` — clsx + tailwind-merge class combiner
- `Button` / `buttonVariants` — CVA-based button primitive (`variant`: primary · outline · ghost, `size`: sm · md · lg)
