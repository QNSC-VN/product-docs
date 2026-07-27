# Plan 1 — Mini Rally Design Rules

## Core rules

1. Build screens from approved component instances and patterns; do not create page-local copies of reusable UI.
2. Bind colour, spacing, radius and typography to Mini Rally variables/styles. Hard-coded values are only allowed for fixed icon geometry or an explicitly documented exception.
3. Use slash-separated names: `color/bg/surface`, `color/text/primary`, `radius/md`; component properties use readable Pascal Case.
4. Use auto-layout for relationships between children. Desktop data screens document minimum width and horizontal-overflow behaviour rather than silently collapsing dense tables.
5. Use Inter only. Use the approved text styles, not ad-hoc sizes.
6. Use `Elevation/1` for cards and `Elevation/Overlay` for menus, dialogs and drawers.
7. Icons use instance swap or the source SVG; never generate a variant for every glyph.
8. Every data-facing component must specify loading, empty, error, read-only, permission-denied and destructive-confirmation behaviour where relevant.
9. Figma visibility is not security. The UI/API contract must state hidden, disabled, read-only and forbidden outcomes separately.

## Figma naming and page convention

- Foundations before components; components before product screens.
- One component family per page unless the elements are tightly coupled.
- Main components/pattern docs must carry an understandable API and usage note.
- `---` is the page separator. `00–02` are governance/foundations; `03–05` components; `06–07` patterns/shell.

