# Plan 1 — Token Mapping

## Figma collections

| Collection | Modes | Count | Purpose |
|---|---|---:|---|
| Primitives | Value | 22 | Hidden raw neutral, navy and semantic-status source values |
| Color | Light, Dark | 20 | Alias-only semantic colours for canvas, text, border, action, status, navigation and icon use |
| Spacing | Value | 12 | 0–48 px gap/dimension scale |
| Radius | Value | 7 | none, xs, sm, md, lg, xl, full |
| Typography | Value | 8 | Inter family and 10–20 px foundational size scale |

## Existing code mappings

| Figma variable | Web syntax | Existing mockup source |
|---|---|---|
| `color/bg/canvas` | `var(--background)` | `theme.css` |
| `color/bg/surface` | `var(--card)` | `theme.css` |
| `color/text/primary` | `var(--foreground)` | `theme.css` |
| `color/text/secondary` | `var(--muted-foreground)` | `theme.css` |
| `color/action/primary/bg` | `var(--primary)` | `theme.css` |
| `color/action/primary/text` | `var(--primary-foreground)` | `theme.css` |
| `color/border/default` | `var(--border)` | `theme.css` |
| `color/border/focus` | `var(--ring)` | `theme.css` |
| `color/nav/bg` | `var(--sidebar)` | `theme.css` |

`--mr-*` syntax is the approved target naming for semantic values not yet represented by a stable CSS variable in the mockup. It is a refactor/handoff requirement, not evidence that production code already uses that syntax.

## Styles

- Text: `Display/Page`, `Heading/Section`, `Body/Content`, `Body/Default`, `Label/Default`, `Label/Caption`.
- Effects: `Elevation/1`, `Elevation/Overlay`.

