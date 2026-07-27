# Plan 2 — Live Progress

## Current component family

**Plan 2 is complete.** All of P2.a–P2.h are done: 22 components across actions, forms, feedback/identity and overlays, all structurally and visually QA-passed. `P2_COMPONENT_CATALOG.md` and `P2_VALIDATION.md` are written. Status is `AWAITING PLAN 2 CONFIRMATION` — per `AI_EXECUTION_WORKFLOW.md`, do not start Plan 3 until the user sends `CONFIRM PLAN 2` or an equally unambiguous approval.

## Completed native Figma work

| Item | Figma page/node | Result |
|---|---|---|
| Icon seed library | `Icons` / page `11:2` | `Icon/ChevronRight` (`11:6`), `Icon/Plus` (`11:9`), `Icon/X` (`11:12`); SVG editable and bound to `color/icon/default`. |
| Button documentation | `Button` / frame `12:2` | Usage, API and accessibility-oriented guidance present. |
| Button component set | `Button` / `15:20` | 27 variants: `Size` (Small/Medium/Large) × `Style` (Primary/Secondary/Destructive) × `State` (Default/Hover/Disabled). `Destructive` added in P2.d from `SettingsPage.tsx` `ConfirmRemoveUserAccess`: bg `color/status/danger`, hover `red/800` (new Primitive, derived by applying the same darkening ratio already observed between `navy/700`→`navy/800`), Disabled uses 45% opacity on the same red rather than switching to a neutral bg (matches the mockup's `disabled:opacity-45` exactly, unlike Primary/Secondary's bg-swap disabled treatment). |
| Button properties | `15:20` | `Label` text, `Show Icon` boolean, `Icon` instance swap. |
| Icon Button documentation | `Icon Button` / frame `17:3` | Usage guidance requires an accessible name in the consuming screen or tooltip. |
| Icon Button component set | `Icon Button` / `20:101` | 27 variants: `Size` (Small/Medium/Large) × `Style` (Primary/Secondary/Ghost) × `State` (Default/Hover/Disabled). |
| Icon Button property | `20:101` | `Icon` instance swap. |
| Link Action documentation | `Link Action` / frame `21:3` | Usage guidance and API documentation. |
| Link Action component set | `Link Action` / `21:76` | 6 variants: `Size` (Small/Medium) × `State` (Default/Hover/Disabled). |
| Link Action properties | `21:76` | `Label` text, `Show Icon` boolean, `Icon` instance swap. |
| Overflow action | `Icon Button` + `Icon/MoreHorizontal` (`23:6`) | Reuse decision: no duplicate overflow component; MoreHorizontal is a preferred Icon swap choice. |
| Text Input documentation | `Text Input` / frame `24:4` | Documents pairing with Form Field and required focus/error/disabled differentiation. |
| Text Input component set | `Text Input` / `24:79` | 10 variants: `Size` (Small/Medium) × `State` (Default/Focused/Filled/Error/Disabled). |
| Text Input property | `24:79` | `Value` text property. |
| Form Field documentation | `Form Field` / frame `27:2` | Documents label, required indicator, Text Input instance and supporting feedback. |
| Form Field component set | `Form Field` / `36:70` | 3 variants: `State` (Default/Error/Disabled). Variant nodes `28:2`, `36:3`, `36:11`. |
| Form Field properties | `36:70` | `Label` text, `Supporting Text` text, `Required` boolean; linked to `label`, `supporting-text` and `required` in all three variants. |
| Textarea documentation | `Textarea` / frame `39:4` | Documents the shared Text Input box treatment and pairing with Form Field. |
| Textarea component set | `Textarea` / `39:17` | 5 variants: `State` (Default/Focused/Filled/Error/Disabled). Built by cloning the Text Input Medium variant, so every padding/radius/fill/stroke binding is inherited rather than re-declared. |
| Textarea property | `39:17` | `Value#39:0` text property. |
| Icon additions | `Icons` / `11:2` | `Icon/ChevronDown` (`40:2`), `Icon/Check` (`41:2`), both cloned from ChevronRight so the `color/icon/default` stroke binding and SCALE constraints carry over. |
| Select documentation | `Select` / frame `40:52` | Documents the shared Text Input box treatment and that the option menu is a separate P2.d overlay. |
| Select component set | `Select` / `40:31` | 10 variants: `Size` (Small/Medium) x `State` (Default/Focused/Filled/Error/Disabled). Cloned from the Text Input set, then a 16px chevron affordance added per variant. |
| Select properties | `40:31` | `Value#24:0` text, `Icon#40:0` instance swap (defaults to ChevronDown). Chevron muted to `color/text/muted` on both Disabled variants. |
| Checkbox documentation | `Checkbox` / frame `41:4` | Documents that the control carries no label and takes its accessible name from the consuming context. |
| Checkbox component set | `Checkbox` / `41:91` | 6 variants: `Checked` (False/True) x `State` (Default/Focused/Disabled). 16x16 box, radius `sm`, nested `Icon/Check` instance toggled by variant. |
| Radio documentation | `Radio` / frame `45:5` | Documents the control's mutually-exclusive group semantics and that it takes its accessible name from the consuming context. |
| Radio component set | `Radio` / `45:88` | 6 variants: `Checked` (False/True) x `State` (Default/Focused/Disabled). 16x16 circle (radius `full`), inner dot ellipse instead of a check mark; same focus-ring treatment as Checkbox. |
| Toggle documentation | `Toggle` / frame `46:2` | Documents that Disabled uses 45% opacity rather than a distinct colour, matching the mockup implementation directly. |
| Toggle component set | `Toggle` / `46:20` | 6 variants: `On` (False/True) x `State` (Default/Focused/Disabled). 36x20 full-radius track, 16x16 white knob at x=2 (off) / x=18 (on); off-track bound to `neutral/300` (nearest primitive to the mockup's `#cbd5e1`, no semantic token exists for a switch track). |
| Icon additions (P2.c) | `Icons` / `11:2` | `Icon/AlertCircle` (`54:2`), `Icon/InfoCircle` (`54:6`) — circle outline + glyph, same construction as ChevronRight/Check; both correctly use `visible:false` on their placeholder white frame fill (see corrections below). |
| Avatar component set | `Avatar` / `52:69` | 4 variants: `Size` (XS/Small/Medium/Large), 20/24/28/32px. `Initials` text property (shared, intentionally — same initials regardless of size). Default fill uses `color/action/primary/bg` as a placeholder; per-user colour is instance data, overridden per consuming screen. |
| Type Badge component set | `Type Badge` / `50:15` | 4 variants: `Type` (Story/Defect/Task/Feature). Label baked per variant — no shared text property (see corrections below). Bound to new `color/badge/type/*` tokens. |
| Status Badge component set | `Status Badge` / `52:25` | 6 variants: `Status` (Idea/Defined/In-Progress/Completed/Accepted/Release). Dot + label, label baked per variant; `Completed` displays "Done" per the mockup's display-text override. Bound to `color/badge/status/*` tokens. |
| Priority Badge component set | `Priority Badge` / `52:43` | 4 variants: `Priority` (Critical/High/Medium/Low). Dot + label, no border (matches mockup). Bound to `color/badge/priority/*` tokens. |
| Role Badge component set | `Role Badge` / `52:55` | 3 variants: `Role` (Workspace Admin/Project Admin/Project Member). Plain text, no dot/border. Bound to `color/badge/role/*` tokens. |
| Progress component set | `Progress` / `53:86` | 3 variants: `Tier` (Low/Mid/Complete) — amber/blue/green fill matching `MiniProgress`'s threshold logic. `Value/Max` shared text property. Fill bar has no percentage property; documented as "resize proportionally" for arbitrary values. |
| Alert component set | `Alert` / `55:79` | 4 variants: `Type` (Error/Success/Warning/Info). `Title`/`Description` shared text properties; icon baked per variant (Check for Success, AlertCircle for Error/Warning, InfoCircle for Info — see corrections below). Bound to `color/status/*` (icon/text) and new `color/feedback/*/bg`+`/border` tokens. |
| Toast component set | `Toast` / `57:122` | 4 variants: `Type` (Error/Success/Warning/Info). Same icon/colour language as Alert but on an opaque `color/bg/surface` card with `Elevation/Overlay` and a close affordance — distinguishes an overlay notification from an inline banner. `Title`/`Description` shared text properties. |
| Tooltip component set | `Tooltip` / `58:29` | 2 variants: `Position` (Top/Bottom), arrow flips to point at the anchor. Dark surface using `color/nav/bg`/`color/nav/text` + `Elevation/Overlay` per P1 rule 6. `Label` shared text property. |
| Icon/AlertTriangle | `Icons` / `62:2` | New icon for destructive confirmation, matching lucide AlertTriangle; placeholder fill correctly set `visible:false`. |
| Dialog component set | `Dialog` / `65:20` | 2 variants: `Type` (Standard/Destructive Confirmation). Standard: header (title/subtitle/Icon Button Ghost close, swapped to the X icon) + a `Content` Slot property (real slot, not a placeholder frame) + footer with Secondary/Primary Button instances, matching `NewItemModal`. Destructive Confirmation: icon circle (`color/feedback/danger/bg` + `Icon/AlertTriangle`) + title + description + a Text Input instance for the typed-name confirmation + Cancel/Destructive Button instances, matching `SettingsPage.tsx` `ConfirmRemoveUserAccess` exactly, including the Destructive button defaulting to its Disabled variant (mirrors `canConfirm` starting false). Both use `Elevation/Overlay`; scrim colour differs by Type and lives at the page level, documented but not modeled as a node (rgba(0,0,0,0.28) Standard, rgba(15,23,42,0.42) Destructive). |
| Validation | structural + visual | Variant axes/properties/bindings verified; screenshot rechecked after label spacing and icon-contrast corrections. Form Field screenshot confirms Default/Error/Disabled differentiation. |

## Token binding summary

- Primary: `color/action/primary/bg`; hover `color/nav/bg`; text `color/text/inverse`.
- Secondary: `color/bg/surface`; hover `color/bg/selected`; text `color/text/secondary`; border `color/border/default`.
- Disabled: `color/bg/subtle` + `color/text/muted`.
- Spacing, radius and font size use the Plan 1 variable collections.
- Nested icon instances override to `color/text/inverse` for Primary and `color/text/muted` for Disabled; this preserves contrast while retaining the reusable icon swap API.
- Form Field: label `color/text/secondary`, required indicator `color/status/danger`, supporting text `color/text/muted` (Default) / `color/status/danger` (Error) / `color/text/muted` (Disabled). The nested Text Input instance carries the control's own state styling.

## QA evidence

- Structural audit: Button, Icon Button, Link Action, Text Input and Form Field axes/properties/token bindings verified.
- Visual audit: Button/Link Action/Icon Button layouts pass. Text Input text geometry was corrected from zero width to fixed size-specific regions, then rechecked with a component-set screenshot.
- Form Field audit: every token binding resolved to a concrete colour (`#5c6478` label, `#b91c1c` required/error, `#8c94a6` muted); each variant's nested Text Input confirmed on the matching state; screenshot shows correct Default/Error/Disabled differentiation.

## Documented exceptions

1. **Focus ring literal colour.** `Checkbox`, `Radio` and `Toggle` `State=Focused` variants use a `DROP_SHADOW` focus ring with a literal `rgba(29,63,115,0.35)` rather than a bound colour variable. `figma.variables.setBoundVariableForEffect` forces alpha to 1, and an opaque `color/border/focus` ring is invisible against the navy `Checked=True`/`On=True` fills. The literal value is the resolved `color/border/focus` at 35%. Recorded on the Checkbox focused variants via `setSharedPluginData('dsb', 'focusRing', ...)`. This is the "explicitly documented exception" allowed by P1 rule 2.
2. **Toggle off-track colour.** The mockup's off-track hex `#cbd5e1` (`SettingsPage.tsx:24`) has no matching semantic token in the `Color` collection (no "control/track" concept exists yet). Nearest-distance comparison against every `Primitives` colour picked `neutral/300` (`#dde2ea`, distance 0.094 in normalized RGB) over `neutral/400` (distance 0.184). Bound to the primitive rather than left as a literal, per P1 rule 2's primitive-value allowance.
3. **Toggle disabled state.** Uses 45% node opacity rather than a distinct fill, mirroring the mockup's `disabled:opacity-45` directly instead of inventing a new disabled colour.
4. **62 new Color-collection tokens (P2.c).** 54 `color/badge/{type|status|priority|role}/*` tokens sourced exactly from `shared.tsx`'s `TYPE_CFG`/`STATUS_CFG`/`PRI_CFG`/`RoleBadge` hex values (D-005: keep domain-specific mappings rather than one shared badge primitive), plus 8 `color/feedback/{success|warning|danger|info}/{bg|border}` tokens for Alert/Toast (danger sourced from `LoginPage.tsx:72`'s `role="alert"` banner; the other three reuse the same accent hues already established for badges). Dark mode mirrors Light for all of these — the mockup has no dark theme, and this matches the existing precedent where saturated/accent-role tokens (`color/status/success`, `color/status/danger`, `color/status/info`, `color/text/muted`, `color/nav/text`) already keep identical Light/Dark values.
5. **Progress "Low" tier fill.** Bound directly to the `amber/500` Primitive rather than a semantic `Color` token, because no existing semantic token matches the mockup's `#e59f0c` accent (the closest semantic, `color/status/warning`, resolves to a different, darker `#8a5808` meant for text). Binding to a Primitive is preferred over a literal per P1 rule 2.
6. **Alert/Toast/Tooltip have no direct mockup precedent** beyond the single `LoginPage.tsx` error alert. Built using the closest existing visual language (Alert extends the LoginPage pattern to all 4 status types; Toast reuses Alert's language on an elevated surface; Tooltip reuses the `color/nav/*` dark-surface tokens already established for navigation). Flagged here for visibility, not as an open decision — resolvable autonomously from the existing token system per workflow rule 5/6.

## Correction applied during P2.b2

The Form Field base bound `label` to `color/text/primary` and the required indicator to `color/text/muted`. Mockup `03_Mockup Design/src/app/components/shared.tsx` uses `#5c6478` for field labels and `#dc2626` for the required asterisk, so both were rebound to `color/text/secondary` and `color/status/danger` before the variants were cloned.

## Next autonomous action

P2.a, P2.b and P2.c are all complete. Next: **P2.d — Overlay components**: dialog, destructive confirmation, dropdown/popover, drawer base.

Before building, read `03_Mockup Design/src/app/pages/SettingsPage.tsx` (destructive confirmation pattern already referenced in a P2.c doc note, `#fef2f2`/`AlertTriangle` icon circle) and check `WorkItemDetailPage.tsx`/`ProjectsPage.tsx` for existing modal structures (`NewItemModal` was referenced from `shared.tsx` imports). Dropdown/popover should reuse `Elevation/Overlay` and, where it lists options, may reuse `Select`'s value-row visual language rather than invent a new one.

### Three recurring lessons — apply to every future component

1. **`combineAsVariants` merges same-named TEXT/INSTANCE_SWAP component properties into ONE shared property across the whole set**, forcing every variant's actual displayed value to the shared default. This is *correct* when the property is genuinely meant to be freely overridable regardless of variant (Button's Label, Avatar's Initials, Progress's Value/Max, Alert/Toast's Title/Description). It is a *bug* when the value should track the variant itself (Type Badge's label, Alert/Toast's Icon which must match Type). For the latter case: do NOT call `addComponentProperty` per-variant before combining — just bake the correct literal value/instance into each variant and leave it unlinked.
2. **New icon components must set `visible: false` on their placeholder frame fill**, matching the convention already used by every existing icon (`ChevronRight`, `Check`, etc.) — a `visible: true` white fill is invisible on a white canvas during icon-only QA but shows as a glaring white box the moment the icon is placed on any tinted surface (this broke Alert's Warning/Info variants before being caught and fixed).
3. **`node.resize()` resets `primaryAxisSizingMode`/`counterAxisSizingMode`/`layoutSizingHorizontal` back to `FIXED`.** This bit twice in one session: Alert's description text clipped to height 10, and the entire Standard Dialog collapsed to a 10px-tall bar, both because a sizing-mode assignment was made *before* a `resize()` call earlier in the same build. Rule: finish all `resize()` calls on a node first, then set `AUTO`/`HUG`/`FILL` sizing modes as the last step before moving to the next node.

All P2 checklist items are review-ready. Status set to `AWAITING PLAN 2 CONFIRMATION`. Next plan (P3 — UX patterns/BE contracts) starts only after `CONFIRM PLAN 2`.
