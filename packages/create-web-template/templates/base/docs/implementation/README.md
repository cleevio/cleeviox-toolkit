# Implementation docs

Every non-trivial feature starts as a document here — plan first, code second
(see the Workflow section in `CLAUDE.md`). One file per topic:
`docs/implementation/{topic}.md`, kebab-case.

These documents are living: whenever behavior changes, the corresponding
document is updated in the same change.

## Skeleton

```markdown
# {Feature name}

## Context
What problem this solves and for whom. One paragraph.

## Plan
Numbered steps of the implementation — concrete enough that someone else
(or an agent) could execute them.

## Decisions
| Decision | Alternatives considered | Why |
| --- | --- | --- |

## Testing
Which exact logic gets unit tests (business rules, transformations, edge
cases). UI is explicitly out of scope for unit tests.

## Status
Draft / Approved / Implemented — with dates.
```
