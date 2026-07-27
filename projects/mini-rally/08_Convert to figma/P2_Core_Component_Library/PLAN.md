# Plan 2 — Core Component Library

## Goal

Create a token-bound reusable component library that screens can consume as instances.

## Checklist

- [x] P2.a Create action components: Button, Icon Button, Link action, overflow action.
  - [x] P2.a1 Button: 18 native variants; Label, Show Icon and Icon instance-swap properties; visual/structural QA passed.
  - [x] P2.a2 Icon Button: 27 native variants; Icon instance-swap property; visual/structural QA passed.
  - [x] P2.a3 Link Action: 6 native variants; Label, Show Icon and Icon instance-swap properties; visual/structural QA passed.
  - [x] P2.a4 Overflow action: reuse `Icon Button` with `Icon/MoreHorizontal` instance swap; no duplicate component created.
- [x] P2.b Create form components: FormField, input, textarea, select/combobox, checkbox, radio and toggle.
  - [x] P2.b1 Text Input: 10 native variants; editable Value property; visual/structural QA passed after text-geometry correction.
  - [x] P2.b2 Form Field: 3 native variants (`State` Default/Error/Disabled); Label and Supporting Text text properties, Required boolean; nested Text Input state bound per variant; visual/structural QA passed.
  - [x] P2.b3 Textarea, select/combobox, checkbox, radio and toggle.
    - [x] Textarea: 5 native variants (`State` Default/Focused/Filled/Error/Disabled); Value text property; visual/structural QA passed.
    - [x] Select/Combobox: 10 native variants (`Size` x `State`); Value text and Icon instance-swap properties; visual/structural QA passed.
    - [x] Checkbox: 6 native variants (`Checked` x `State`); nested Icon/Check toggled by variant; visual/structural QA passed.
    - [x] Radio: 6 native variants (`Checked` x `State`); inner dot ellipse; visual/structural QA passed.
    - [x] Toggle: 6 native variants (`On` x `State`); track/knob composition; visual/structural QA passed.
- [x] P2.c Create feedback/identity components: Alert, toast, tooltip, avatar, role/type/status/priority badges, progress.
  - [x] Avatar: 4 native size variants (XS/Small/Medium/Large); Initials text property; visual/structural QA passed.
  - [x] Type Badge: 4 native variants; label baked per variant (no shared override); visual/structural QA passed.
  - [x] Status Badge: 6 native variants incl. Completed→"Done" display override; visual/structural QA passed.
  - [x] Priority Badge: 4 native variants, no border per mockup; visual/structural QA passed.
  - [x] Role Badge: 3 native variants, plain text no dot/border; visual/structural QA passed.
  - [x] Progress: 3 native Tier variants (Low/Mid/Complete) demonstrating threshold colours; Value/Max text property; resizable fill documented for arbitrary percentages; visual/structural QA passed.
  - [x] Alert: 4 native Type variants (Error/Success/Warning/Info); Title/Description text properties; icon baked per variant; visual/structural QA passed.
  - [x] Toast: 4 native Type variants; Elevation/Overlay; Title/Description text properties; close affordance; visual/structural QA passed.
  - [x] Tooltip: 2 native Position variants (Top/Bottom) with flipped arrow; Label text property; visual/structural QA passed.
- [x] P2.d Create overlay components: dialog, destructive confirmation, dropdown/popover, drawer base.
  - [x] Button retroactively extended with `Destructive` style (27 variants total) for the destructive confirmation dialog's confirm action.
  - [x] Dialog: 2 native Type variants (Standard/Destructive Confirmation); Standard uses a real Slot for content; Destructive Confirmation matches `ConfirmRemoveUserAccess` exactly; visual/structural QA passed.
  - [x] Menu Item: 2 native State variants (Default/Hover); Show Icon/Icon/Label shared properties; visual/structural QA passed.
  - [x] Dropdown/popover: `Dropdown Menu` composed of Menu Item instances + optional section label, `Elevation/Overlay`; visual/structural QA passed.
  - [x] Drawer base: docked side panel (border-left, not overlay) with header (Type Badge + id + title + Expand/Close Icon Button instances) and a Content Slot for screen-specific field grids; visual/structural QA passed.
- [x] P2.e Define variants, text/boolean/instance-swap properties and state coverage. (Done incrementally per component above — each has its own variant axes and TEXT/BOOLEAN/INSTANCE_SWAP properties recorded in its checklist line and in `P2_PROGRESS.md`.)
- [x] P2.f Document usage, accessibility and code/mockup source for each component. (Every component has a documentation frame with title/description/specification, sourced from the mockup file+line evidenced in `P2_PROGRESS.md`.)
- [x] P2.g Validate metadata, bindings, variant matrix, screenshots and typography per component. (Every component was screenshot-verified and structurally audited before being marked complete; corrections are logged in `P2_PROGRESS.md`'s exception/correction sections.)
- [x] P2.h Write `P2_COMPONENT_CATALOG.md` and `P2_VALIDATION.md`.

## Rules

- Build one component family at a time; no batch creation.
- Use instance swap for icons; do not create an icon-per-variant matrix.
- Split a component when variant combinations exceed a maintainable API.

## Exit criteria

- Each component has token bindings, documented API and validated states.
- No screen-only duplicate component is introduced.
- Component catalog maps every component to source code and intended screens.

## Gate

Set tracker to `AWAITING PLAN 2 CONFIRMATION`; stop until `CONFIRM PLAN 2`.
