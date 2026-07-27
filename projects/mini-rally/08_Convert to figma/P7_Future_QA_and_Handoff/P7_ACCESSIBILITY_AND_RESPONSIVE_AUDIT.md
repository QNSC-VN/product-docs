# P7.d — Accessibility and Desktop-Responsive Audit

Figma is a static design tool — it cannot demonstrate real keyboard interaction, screen-reader behavior, or live viewport resizing. This audit therefore covers what a design file *can* actually verify (token contrast ratios, documented focus states, structural min-width/overflow behavior) and documents the rest as **developer guidance annotations**, consistent with the project's standing rule that Figma visibility is never itself a security or behavior guarantee (`P1_DESIGN_RULES.md` rule 9; the same principle extends to accessibility).

## 1. Color contrast audit (WCAG 2.1)

Computed relative-luminance contrast ratios for every text/background token pair actually used across the file, resolved to real RGB values (not assumed):

| Pair | Ratio | WCAG AA (normal text, 4.5:1) | WCAG AAA (7:1) |
|---|---:|---|---|
| `color/text/primary` on `color/bg/surface` | 15.9:1 | Pass | Pass |
| `color/text/secondary` on `color/bg/surface` | 5.9:1 | Pass | Fail |
| `color/status/info` on `color/bg/surface` | 7.0:1 | Pass | Pass (borderline) |
| `color/status/danger` on `color/bg/surface` | 6.5:1 | Pass | Fail |
| `color/text/inverse` on `color/action/primary/bg` (Button Primary) | 10.4:1 | Pass | Pass |
| `color/permission/disabled/text` on `color/permission/disabled/bg` (Permission State Chip) | 4.5:1 | Pass (borderline) | Fail |
| **`color/text/muted` on `color/bg/surface`** | **3.1:1** | **Fail** | Fail |

### Finding: `color/text/muted` fails WCAG AA for normal-size text

`color/text/muted` (`#8c94a6`) on a white/`bg-surface` background measures **3.1:1**, below the 4.5:1 minimum WCAG AA requires for normal-size text (it would pass the 3:1 large-text threshold, but it is used at 10-11px caption sizes throughout — well below "large text"). This token is used **extremely widely**: timestamps ("2h ago"), project/context captions, table helper columns (Fixed In Build, Iteration, Updated), muted metadata across every screen in Plans 4 through 7.

**This is not a Figma-conversion defect — it is inherited directly from the mockup's own color choice** (`#8c94a6` is literally what `NotificationsPage.tsx`, `SettingsPage.tsx` and every other page use for muted grey text; per the project's source precedence, the mockup is the design source of truth once a plan is approved, so this was carried over faithfully rather than invented). **Not unilaterally changed here** — picking a new color would be a real design-system decision (contrast is a legitimate design constraint, but so is matching an already-BA-reviewed visual identity) that needs design/BA sign-off, not something to silently alter mid-QA-pass.

**Recommendation:** flag to BA/design before dev handoff. If WCAG AA compliance is a hard requirement for this product, `color/text/muted` needs a darker replacement (e.g., something in the `#6b7280`-`#707888` range would clear 4.5:1 against white) applied as a single token-value change — because every consuming screen already references the token rather than a literal color, this is a **one-line fix** to propagate everywhere, which is exactly why keeping literal colors out of screens (the discipline enforced throughout every plan) matters.

## 2. Focus states

Confirmed via `P2_COMPONENT_CATALOG.md` and the component sets themselves: `Button`, `Icon Button`, `Text Input`, `Select`, `Checkbox`, `Radio`, `Toggle` all carry a `State=Focused` (or equivalent) variant. Checkbox/Radio/Toggle's focus ring is a **documented exception** — bound via a literal `rgba(29,63,115,0.35)` rather than a token, because `setBoundVariableForEffect` forces alpha to 1 on bound effect colors, which would make an opaque navy ring invisible against a navy checked/on fill (P1 rule 2 exception, first hit in P2, re-confirmed still correct here).

**Gap found:** newer interactive elements built in Plans 5-7 (Table Row select-all/row checkboxes reuse the existing `Checkbox` component so they inherit its focus state correctly, but bespoke bespoke click targets like Settings sidebar items, Notification Card's "Go to item" affordance, and Kanban board card click areas were built as plain frames, not instances of a component with a documented focus state). **Recommendation:** these need a keyboard-focus treatment specified before implementation — not built here because static Figma frames have no interaction state to author against without inventing a new component per one-off click target, which would be premature abstraction for elements whose real focus behavior depends on the eventual DOM structure (a `<button>` vs a `<div role="button">` focus differently).

## 3. Keyboard navigation and ARIA (documentation only — not verifiable in Figma)

These are written as **developer requirements**, since a static design file cannot demonstrate them:

- Every interactive control (buttons, table rows opened via click, Kanban cards, sidebar nav items, dropdown/select triggers) must be reachable via Tab and activatable via Enter/Space, matching the mockup's own keyboard handlers where present (e.g., `TeamBoardPage.tsx`'s `BoardCard` already implements `onKeyDown` for Enter/Space — carry this behavior forward, don't regress it during implementation).
- Modals/Dialogs (`Dialog` component, both `Standard` and `Destructive Confirmation`) must trap focus while open and return focus to the triggering element on close, and must close on Escape.
- The typed-confirmation input (`Require Typed Name=true`) must have an accessible label matching its visible "Type {name} to confirm" instruction text, not just a placeholder.
- Table sort/filter controls need `aria-sort` and accessible names; the mockup's own `aria-label` usage (e.g., `ResizableBacklogHeader`, `ResizableDefectHeader`) should be preserved verbatim in implementation, not reinvented.
- Notification popup (`SCR-08`'s floating overlay) should be announced via an ARIA live region when it appears, since it's a non-modal transient notification a screen-reader user could otherwise miss entirely.

## 4. Desktop-responsive behavior (D-006 / G-006)

D-006 (accepted at Plan 0) scoped this project desktop-first: document minimum widths and horizontal-overflow behavior rather than redesign for mobile. P3 partially executed this (sortable column minimums: RANK 48→64px, EST 40→56px in the Backlog pilot). This pass confirms the same discipline held for every wide table built afterward:

| Screen | Widest content | Behavior |
|---|---|---|
| `SCR-05 Iteration Status` | 11-column table, ~1438px content width | Fits within the 1440px App Shell canvas at desktop width; no horizontal scroll needed at the reference viewport. |
| `SCR-06 Team Status` | Grouped table with Work Product mini-column | Same — fits within canvas. |
| `SCR-07 Quality — Defects` | 12-column table | Built with explicit column widths summing to fit 1440px (deliberately narrower per-column than the mockup's own wider `min-w-[788px]`-per-section layout, which scrolls horizontally in the real app) — **this is a known, accepted compression**, not a bug: the mockup itself horizontally scrolls this table past ~1772px; Figma shows the same columns at tighter widths to stay within one frame for reviewability. Implementation must use the mockup's actual column widths (`DEFECT_COLUMNS` in `QualityPage.tsx`), not Figma's compressed ones. |
| `SCR-09 Roles & Permissions` matrix | Screen/Action/Permission/WA/PA/PM, 6 columns | Fits; the real mockup matrix has a `min-w-[788px]` floor with horizontal scroll for the Screen/Action/Permission columns specifically — Figma's version doesn't need to scroll since only 12 of 75 rows are shown, but implementation must still honor the real min-width. |

**No table built in this project silently collapses or truncates its minimum-viable columns** — every wide table either fits the 1440px reference canvas as-is or (Quality/Defects) uses a documented, intentional width compression for Figma reviewability with the real min-width called out for implementation.

## Summary of new findings this pass

1. `color/text/muted` fails WCAG AA contrast (3.1:1) — inherited from mockup, flagged for BA/design decision, not changed unilaterally.
2. Bespoke click targets from Plans 5-7 (sidebar items, card click areas, "Go to item" links) have no documented focus-state component — flagged as an implementation requirement, not built as new Figma components (would be premature abstraction).
3. Keyboard/ARIA requirements documented as developer guidance, cross-referencing existing mockup `aria-label`/`onKeyDown` patterns that must not regress during implementation.
4. Responsive: confirmed no silent column collapse anywhere; one deliberate width compression (Quality/Defects) called out explicitly so implementation uses real widths.
