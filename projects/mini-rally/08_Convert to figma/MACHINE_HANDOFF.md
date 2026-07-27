# Machine Handoff — Mini Rally Convert to Figma

## Resume source of truth

1. Read `AI_EXECUTION_WORKFLOW.md`.
2. Read `CONVERSION_PROGRESS.md`.
3. Read `P2_Core_Component_Library/PLAN.md`, `P2_PROGRESS.md`, `P2_FIGMA_STATE_LEDGER.json`, `P2_COMPONENT_CATALOG.md` and `P2_VALIDATION.md`.
4. **All 8 plans (0 through 7) are approved. The Mini Rally mockup-to-Figma conversion project is complete.** `CONFIRM PLAN 7` was received on 2026-07-21. There is no Plan 8 — do not start new screen work speculatively. Any future session against this file should be a maintenance/change-request against a finished deliverable ("reopen Plan N for the affected item," per `AI_EXECUTION_WORKFLOW.md` rule 3), not a continuation of the plan checklist. Read `P7_Future_QA_and_Handoff/RELEASE_NOTES.md` first — it is the single authoritative summary of everything built, found and still open across all 8 plans.

## Target Figma file

- File: [Mini Rally Figma](https://www.figma.com/design/ttpggMpbPwggOZl6umowzC/Mini_Rally_Figma?node-id=0-1&m=dev)
- File key: `ttpggMpbPwggOZl6umowzC`
- Required skills for every Figma write: `figma-use`, `figma-generate-library`.
- Figma mutations must run sequentially. Return every mutated/created node ID. Use `setSharedPluginData('dsb', ...)` and the ledger.

## Current status: PROJECT COMPLETE — all 8 plans approved

Plan 7 closed out the whole conversion: 4 new Future/Reference screens (`SCR-14`-`17`, page `Screens — Phase 4`, deliberately lower fidelity per D-002), naming/token/accessibility audits (`P7_ACCESSIBILITY_AND_RESPONSIVE_AUDIT.md`), a real token-binding defect found and fixed (`font/size/base`/`lg`/`xl` never existed — see point 9 below), Dev Mode + Code Connect backlog docs (`P7_DEV_MODE_GUIDE.md`, `P7_CODE_CONNECT_BACKLOG.md`), and a dev-handoff walkthrough that found and fixed a real gap in the Plan 3 pilot (Contract 5/Destructive delete had zero persisted Figma evidence — added pilot frame 6, `183:2802`). **`P7_Future_QA_and_Handoff/RELEASE_NOTES.md` is now the single authoritative project summary** — read it first, not this section, for anything beyond "what to do next."

## Plan 6 status (approved)

Plan 6 added, on top of the Plan 5 component set below: `Notification Card` (`157:1664`, 4 variants), `Permission State Chip` (`162:6122`, 4 variants + `Locked` boolean), new icons `Icon/Hash` (`156:2`) and reused pre-existing `Icon/Flag` (`110:8` — a duplicate `Icon/Flag` was accidentally created and then cleaned up, see Known corrections below). `Dialog` (`65:20`) extended with a `Require Typed Name` boolean on `Type=Destructive Confirmation`. Screens, all on page `Screens — Phase 4` (`158:22`): `SCR-08 Notifications` `158:23` (grouped with popup overlay `160:423`), `SCR-09 Settings — Roles & Permissions` `163:397`, `SCR-10 Settings — Workspace Settings` `166:825`, `SCR-11 Settings — Teams` `167:987`, `SCR-12 Settings — User Management` `168:1191`, `SCR-13 Settings — Audit Log` `169:1422`. Contracts 13–17 in `P6_SCREEN_CONTRACTS.md`. Workflow Status and Labels resolved as out-of-scope per an explicit Phase 4.3 SRS deferral (not built).

## Plan 5 status (approved)

Plan 5 added, on top of the Plan 4 component set below: `Defect Priority Chip` (`130:1596`, 2 variants), `Timebox State Badge` (`133:1639`, 10 variants), `Severity Badge` (`146:5438`, 5 variants). Screens: `SCR-02 Backlog` `132:3740`, `SCR-04 Timeboxes — Iterations` `134:751`, `SCR-05 Iteration Status` `136:952`, `SCR-06 Team Status` `140:5157`, `SCR-07 Quality — Defects` `147:1533` — all on page `Screens — Phase 2–3`. Contracts 10–12 in `P5_SCREEN_CONTRACTS.md`. Release Management (`ReleasesPage.tsx`, `case "releases"`) resolved as Tier B/reference-only (no reachable nav entry — see Q-13); no screen built for it.

## Plan 4 status (approved)

Completed and QA-passed native component sets:

| Family | Figma node | API |
|---|---:|---|
| Button | `15:20` | 18 variants; Label, Show Icon, Icon swap |
| Icon Button | `20:101` | 27 variants; Icon swap; preferred ChevronRight + MoreHorizontal |
| Link Action | `21:76` | 6 variants; Label, Show Icon, Icon swap |
| Text Input | `24:79` | 10 variants; Value property |
| Form Field | `36:70` | 3 variants; Label, Supporting Text, Required |
| Textarea | `39:17` | 5 variants; Value property |
| Select | `40:31` | 10 variants; Value text, Icon instance-swap |
| Checkbox | `41:91` | 6 variants; nested Icon/Check toggled by variant |
| Radio | `45:88` | 6 variants; inner dot ellipse toggled by variant |
| Toggle | `46:20` | 6 variants; track + knob composition |
| Avatar | `52:69` | 4 size variants; Initials property |
| Type Badge | `50:15` | 4 variants; label baked per variant |
| Status Badge | `52:25` | 6 variants; dot + label, Completed shows "Done" |
| Priority Badge | `52:43` | 4 variants; dot + label, no border |
| Role Badge | `52:55` | 3 variants; plain text |
| Progress | `53:86` | 3 Tier variants; Value/Max property |
| Alert | `55:79` | 4 Type variants; Title/Description properties, icon baked per variant |
| Toast | `57:122` | 4 Type variants; Elevation/Overlay + close affordance |
| Tooltip | `58:29` | 2 Position variants; Label property |

Reusable local icons: ChevronRight `11:6`, Plus `11:9`, X `11:12`, MoreHorizontal `23:6`, ChevronDown `40:2`, Check `41:2`, AlertCircle `54:2`, InfoCircle `54:6`.

## Exact resume point

**All 8 plans are confirmed. The project is done.** A future session opened against this file should read `RELEASE_NOTES.md` first, then treat any request as a maintenance/change-request against a finished deliverable — reopen the specific plan folder whose screen/component is affected, don't restart the checklist.

Plan 7 Figma additions (page `Screens — Phase 4`, same page as Plan 6): `SCR-14 Release Planning (Placeholder, Future)` `174:1737`; `SCR-15 Portfolio (Future)` `175:1713`; `SCR-16 Team Board (Future)` `176:1930`; `SCR-17 Reports (Future)` `177:2156`. Plus pilot frame `6 — Destructive delete confirmation (Contract 5)` `183:2802` added to `Pilot — Backlog to Detail` (`96:12`) to close a real gap (see point 9 below and `P7_DEV_HANDOFF_WALKTHROUGH.md`). New tokens: `font/size/base`/`lg`/`xl` (aliases to `body`/`label`/`page` — see point 9). All four P7.a screens use a one-off `future-reference-banner` marker frame, not a component (deliberately not reusable — see `P7_PROGRESS.md`).

Plan 6 Figma page: `Screens — Phase 4` (`158:22`, new page). Key screens: `SCR-08 Notifications` `158:23`; `SCR-09 Settings — Roles & Permissions` `163:397`; `SCR-10 Settings — Workspace Settings` `166:825`; `SCR-11 Settings — Teams` `167:987`; `SCR-12 Settings — User Management` `168:1191`; `SCR-13 Settings — Audit Log` `169:1422`. New patterns: `Notification Card` `157:1664`, `Permission State Chip` `162:6122`. Settings sidebar (Personal/Workspace sections) is a reusable inline pattern, not componentized — cloned per screen via a shared builder function in the build scripts.

Plan 5 Figma page: `Screens — Phase 2–3`. Key screens: `SCR-02 Backlog` `132:3740`; `SCR-04 Timeboxes — Iterations` `134:751`; `SCR-05 Iteration Status` `136:952`; `SCR-06 Team Status` `140:5157`; `SCR-07 Quality — Defects` `147:1533`. New patterns: `Defect Priority Chip` `130:1596`, `Timebox State Badge` `133:1639`, `Severity Badge` `146:5438`.

Plan 4 Figma page: `Screens — Phase 0–1` (`104:2300`). Key screens: `SCR-00 Login — Default` `106:31` / `— Invalid credentials` `109:31`; `SCR-11 Access Denied` `109:140` / `Not Found` `109:481`; `SCR-01 Home` `111:526`; `SCR-01A Manage Projects` `117:920`; `SCR-03 Work Item Detail — Details` `127:1244` / `— Tasks` `129:1516` / `— Revision History` `128:1431`. New patterns: `Metric Card` `110:553`, `Entity Status Badge` `116:938`, `Work Item Detail Header` `122:1197`, `Rich Text Field` `124:1218`.

**Everything still open is consolidated in `RELEASE_NOTES.md`'s Q-01–Q-16 ledger — do not maintain a separate carry-forward list here anymore.** Two items worth calling out because they're easy to miss:
1. Two Plan-4 screens (Manage Projects, Work Item Detail) are still Workspace-Admin-only — no read-only (`R`) variant despite the RBAC pattern existing since P3.f.
2. `font/size/base`/`lg`/`xl` nodes built before P7.c may have a silently-wrong font size (1-2px off) — the tokens are now fixed for future work, but existing nodes were not retroactively rebound (see `P7_PROGRESS.md`'s P7.c section for why).

## Known corrections already resolved

1. Text Input initially showed an ellipsis because text width was zero under `TRUNCATE + FILL`. It was fixed by sizing the text regions explicitly: 284px for Small, 276px for Medium. Preserve this pattern when cloning or extending Text Input.
2. The Form Field base bound `label` to `color/text/primary` and the required indicator to `color/text/muted`. The mockup uses `#5c6478` and `#dc2626`, so they were rebound to `color/text/secondary` and `color/status/danger`. Check new form components against `03_Mockup Design/src/app/components/shared.tsx` rather than assuming the base bindings are right.
3. Checkbox/Radio/Toggle `State=Focused` initially bound the focus ring colour to `color/border/focus` via `setBoundVariableForEffect`, which forces alpha to 1 — an opaque navy ring on a navy `Checked=True`/`On=True` fill is invisible. Fixed with a literal `rgba(29,63,115,0.35)` (documented exception, P1 rule 2). Reuse this exact effect object for any future selection-control focus state.
4. **`combineAsVariants` merges same-named TEXT/INSTANCE_SWAP properties into ONE shared property.** Type Badge's per-variant "Label" properties (and Alert's per-variant "Icon" instance-swap) all collapsed into a single shared property after combining, forcing every variant to display the *first/default* value — Type Badge showed "Story" on all 4 variants, Alert showed the AlertCircle icon on the Success variant. Fixed by deleting the shared property and baking the correct literal value per variant instead. Only add a shared property when the value is genuinely meant to be freely overridable regardless of variant (Button Label, Avatar Initials, Progress Value/Max, Alert/Toast Title/Description all do this correctly).
5. **New icon components must set `visible: false`** on their placeholder white frame fill, matching `ChevronRight`/`Check`. A `visible: true` fill is invisible on white canvas (so it passes icon-only QA) but shows as a white box the moment the icon sits on a tinted surface — caught on Alert's Warning/Info variants.
6. **Check the Icons page before creating a new icon.** A duplicate `Icon/Flag` was created in P6.a because the icon inventory wasn't checked first; caught during Plan 6 validation (two "Icon/Flag" entries in the page's child list) and fixed by swapping all instances to the original (`110:8`) and deleting the duplicate. Always list `iconsPage.children.map(c => c.name)` before building a new icon.
7. **A component set's shared component property (e.g. a boolean) can be added after the fact to extend behavior without duplicating the component** — `Dialog`'s `Require Typed Name` property was added post-hoc to `Type=Destructive Confirmation` via `addComponentProperty` on the component set, then bound to child visibility via `componentPropertyReferences`, letting one variant serve both the typed-confirmation case and the plain-confirmation case.
8. **The axis that `primaryAxisSizingMode` vs `counterAxisSizingMode` controls depends on `layoutMode`, not on "width" vs "height" literally.** For `layoutMode: 'VERTICAL'`, `primaryAxisSizingMode` governs height (the stacking axis) and `counterAxisSizingMode` governs width — the reverse of `'HORIZONTAL'`. Setting the wrong one is a silent no-op with no thrown error; several P7.a widget/card containers collapsed to a stale 0-100px height because `counterAxisSizingMode` was set on a `VERTICAL` frame instead of `primaryAxisSizingMode`. Always check `layoutMode` first before deciding which sizing-mode property to touch.
9. **`node.setBoundVariable(field, undefined)` — passing a variable that doesn't exist (e.g. a typo'd or never-created token key) — does not throw, and does not cleanly leave the literal value either.** It silently falls back to whatever variable was last successfully bound to that field in the plugin session, overriding both your intended token *and* the literal fallback value you may have also set. Caught in P7.c: `font/size/base`, `font/size/lg`, `font/size/xl` were used as token names throughout Plans 5-7 but never actually existed (the real Typography scale is `caption`/`small`/`body`/`content`/`label`/`title`/`page`) — every affected text node silently got a slightly-wrong size with zero error output, only found via a deliberate token audit, not from any screenshot looking visibly broken. **Always verify a size/color-variable key exists in the live variable list before using it in a script — do not assume a plausible-sounding name (`base`, `lg`, `xl`) exists just because it's a common convention.** The three missing tokens were created as proper aliases (`base`→`body`, `lg`→`label`, `xl`→`page`) fixing this for future work; already-built nodes across Plans 5-7 were **not** retroactively rebound (documented as a known low-priority cosmetic gap in `P7_Future_QA_and_Handoff/P7_PROGRESS.md` — the wrong-fallback value isn't a fixed constant, so there's no safe find-and-replace).

## Figma API notes learned in this run

- `addComponentProperty` must be called on the **component set**, not on a variant that already belongs to a set.
- `figma.combineAsVariants` leaves children stacked at (0,0); position them and `resizeWithoutConstraints` from actual child bounds.
- Reading `variable.valuesByMode` on the `Color` collection returns a `VARIABLE_ALIAS` (it aliases `Primitives`), not an RGB object. To verify a rendered colour, read the node's resolved `fills[0].color` instead.
- Cloning an entire component/component set (`node.clone()`) and rewriting only what differs (box shape, icon, text) is far cheaper and safer than rebuilding from scratch — Textarea and Select were built this way from Text Input and inherited every padding/radius/fill/stroke binding for free.
- `figma.variables.setBoundVariableForEffect` also forces alpha to 1 on effect colours, same as paints — translucent effects (focus rings, scrims) need a literal colour, not a bound variable.
- `node.resize()` resets sizing modes to `FIXED` — if `primaryAxisSizingMode`/`counterAxisSizingMode` must be `AUTO`/`HUG`, set them **after** the resize call, not before (this clipped Alert's description text on the first attempt).
- Variable lookup keys must include the full slash-separated name (e.g. `color/badge/type/story/bg`, not `badge/type/story/bg`) — a missing prefix silently resolves to `undefined` and `setBoundVariableForPaint` falls back to the paint's literal placeholder colour with no thrown error, which is a hard bug to spot without diffing the screenshot against expectations.

## Copy-paste prompt for the new machine

```text
Open D:\Mini_Rally_pj\08_Convert to figma. All 8 plans (0 through 7) are approved — the Mini Rally mockup-to-Figma conversion project is complete. Read MACHINE_HANDOFF.md and P7_Future_QA_and_Handoff/RELEASE_NOTES.md (the authoritative project summary: final coverage, every found-and-fixed defect, the full Q-01–Q-16 open-question ledger, recommended implementation order). Treat any new request as a maintenance/change-request against a finished deliverable — reopen the specific plan folder whose screen or component is affected, don't restart the plan checklist.
```
