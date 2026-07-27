# Plan 7 — Live Progress

## Current item

Plan 7 confirmed by the user (`2026-07-21`). **All 8 plans (0 through 7) are now approved — the Mini Rally mockup-to-Figma conversion project is complete.** `RELEASE_NOTES.md` is the authoritative final summary. Any future work against this file is a maintenance/change-request against a finished deliverable, not a continuation of this checklist.

## P7.h — Final coverage matrix, gaps, release notes, gate

Final reuse audit: 0 broken instances across `SCR-08` through `SCR-17` (10 screens spanning Plans 6-7). `CONVERSION_PROGRESS.md`'s coverage matrix updated — Team Board, Portfolio, Reports and the Release Planning placeholder moved from "Needs decision" to "Converted (Future/Reference)"; zero rows remain in "Needs decision." Wrote `RELEASE_NOTES.md`: consolidates the complete Q-01 through Q-16 open-question ledger (noting which are resolved-for-this-pass vs genuinely open for BA/API), lists all 7 real defects/gaps found and fixed during the entire conversion (not mockup features — actual bugs and documentation gaps caught along the way), and gives a recommended implementation order for whoever builds the real product.

## P7.g — Dev-handoff walkthrough

Full write-up in `P7_DEV_HANDOFF_WALKTHROUGH.md`. Walked Contracts 1-5 against what's actually built. Contracts 1-4 matched cleanly. **Contract 5 (Destructive delete) had a real gap: zero persisted Figma evidence anywhere in the file**, despite being fully specified — the `Dialog Type=Destructive Confirmation` component is real and correct (verified in P6.d), but that verification used temporary throwaway instances that were deleted right after. Fixed by adding a sixth, persisted pilot frame demonstrating it in context (realistic work-item-delete content, `Require Typed Name=true`). `P3_PILOT_VALIDATION.md`'s reuse-audit table updated to include it (0 locally-authored leaves, same as every other pilot frame). Also cross-referenced Contract 5 (P3) against Contract 16 (P6) explicitly — they looked like they could contradict at a glance but don't (non-overlapping action lists), recorded so a future reader doesn't have to re-derive this.

## P7.f — Code Connect mappings

Decided against live Code Connect mappings — no stable production codebase exists to point at (only `03_Mockup Design`, explicitly documented as UI-reference/not-backend-ready throughout every prior plan's contracts). Wrote `P7_CODE_CONNECT_BACKLOG.md`: a Figma-component → mockup-source → production-action table, flagging which components have a clean 1:1 mockup reference ready to map once real code stabilizes, which need extraction first (Button, Entity Status Badge, Notification Card, Permission State Chip were never factored into their own mockup component), and one case (`Dialog`'s `Require Typed Name`) where Figma's unified model is better than the mockup's two duplicated functions and production should follow Figma, not the mockup.

## P7.e — Dev Mode documentation

Full write-up in `P7_DEV_MODE_GUIDE.md`. Since `P2_COMPONENT_CATALOG.md` was never updated after Plan 2, wrote an addendum table indexing every component added in Plans 3-7 (16 additional entries) so Dev Mode consumers don't miss real, in-use components. Also documented variable syntax (4 collections, the P7.c token-audit caveat), asset policy (icons map 1:1 to `lucide-react` imports already used in the mockup, no exported raster/SVG assets), and export policy (components→code components, never screenshot-trace a screen).

## P7.d — Accessibility and responsive audit

Full write-up in `P7_ACCESSIBILITY_AND_RESPONSIVE_AUDIT.md`. Headline finding: `color/text/muted` measures 3.1:1 contrast against white — fails WCAG AA (4.5:1) for the normal-size caption text it's used at throughout the file. This is inherited faithfully from the mockup's own `#8c94a6`, not introduced by the conversion; flagged for BA/design sign-off rather than changed unilaterally (contrast fixes are a one-line token change once approved, since every screen references the token, never a literal). Also documented: focus-state gaps on bespoke Plan 5-7 click targets, keyboard/ARIA requirements as developer guidance, and confirmation that no wide table silently collapses (one deliberate, disclosed width compression on Quality/Defects).

## P7.b — Naming audit

Checked page names, every component/component-set name across all 21 component pages plus `Icons`, and Variable naming prefixes (202 variables total).

**Findings:**
- Naming is consistent: PascalCase-with-spaces for component sets (`Button`, `Icon Button`, `Type Badge`...), `Icon/Name` slash-namespace for icons, `color/`/`font/` slash-namespace for semantic tokens, bare short names (`0`-`11`, `xs`-`full`) for the `Primitives` collection — the last one looked like an inconsistency at first glance but is the intended two-tier token architecture (Primitives are raw scale values, never referenced directly by designers; Color/Spacing/Radius/Typography alias them with semantic names), not a defect.
- **Deliberate convention shift, worth recording explicitly:** every P2-built badge family (`Type Badge`, `Status Badge`, `Priority Badge`, `Role Badge`) lives on its own dedicated component page. Every badge/pattern built from P5 onward (`Defect Priority Chip`, `Timebox State Badge`, `Severity Badge`, `Notification Card`, `Permission State Chip`) lives inline on `Screens — Phase 0–1` instead. This was a conscious choice each time (matching the immediately-preceding component's placement) but was never centralized — a Dev Mode consumer scanning only the dedicated component pages would miss five real, in-use components. Recommendation for whoever does the actual dev handoff: either move these five to their own pages, or make sure the Dev Mode documentation (P7.e) explicitly calls out `Screens — Phase 0–1` as a second component location, not just a screens page.
- No duplicate/orphaned component-set names found in this pass (the one duplicate that existed — `Icon/Flag` — was already caught and fixed during Plan 6, see `MACHINE_HANDOFF.md`).

## P7.c — Token binding audit

**Real defect found and fixed at the root:** `font/size/base`, `font/size/lg` and `font/size/xl` were used as token names throughout **every** screen built in Plans 5, 6 and 7 (dozens of text nodes) but **never actually existed** as variables — the real Typography scale is `caption`(10)/`small`(11)/`body`(12)/`content`(13)/`label`(14)/`title`(16)/`page`(20), with no `base`/`lg`/`xl` names at all. Calling `node.setBoundVariable('fontSize', undefined)` does **not** throw and does **not** cleanly no-op either — empirically it silently falls back to whatever font-size variable Figma last successfully bound in that session, overriding both the literal `fontSize` I'd also set *and* the intended token. This is a new, more insidious variant of the already-documented "missing variable key silently resolves to a placeholder" bug (`MACHINE_HANDOFF.md` point 3) — that one at least kept a visible literal color; this one makes affected text a few pixels off from intended with no visible error and no easy way to detect it from a screenshot.

**Fix applied:** created the three missing tokens for real, as aliases to the closest correct existing size (`base`→`body` 12px, `lg`→`label` 14px, `xl`→`page` 20px — matching what each call site's literal `size` argument actually intended). Verified a fresh text node using `font/size/base` now binds correctly. This fixes every **future** script in this session or a resumed one.

**Not retroactively fixed, and why:** rebinding every already-built node across Plans 5-7 would require inspecting each text node's actual resolved size individually (the wrong fallback value depends on each script's own execution history, not a fixed constant, so there is no single find-and-replace). Given the affected nodes are 1-2px off at most (a `body`/`label`/`page`-adjacent size, not a broken layout) and span dozens of already-reviewed screens across three plans, this is recorded as a known, low-priority cosmetic gap rather than chased node-by-node. **Flagged for whoever runs final QA (rest of P7 or a dedicated pass): spot-check text sizing on any screen from Plan 5 onward against the mockup if pixel-exact typography matters before dev handoff.**

No other unresolved token-binding issues or hard-coded literal values were found in a scan of color/spacing token prefixes — every other lookup used real, existing keys throughout.

## Completed native Figma work

### P7.a — Future/reference screens

Per D-002 ("Convert future-coded screens as reference only... include Tier B in Figma marked Future/reference only, not dev-ready"), built one lightweight representative frame per remaining coded-but-future surface. All four use a new `future-reference-banner` pattern (amber `Alert`-style strip, bold caption "FUTURE / REFERENCE ONLY — NOT DEV-READY") docked at the top of the App Shell content slot — not a componentized pattern (it's a one-off documentation marker, not a reusable UI element), built inline per screen.

| Item | Figma page/node | Result |
|---|---|---|
| `SCR-14 Release Planning (Placeholder, Future)` | `Screens — Phase 4` / `174:1737` | Matches `App.tsx`'s `ReleasePlanningPlaceholder` almost verbatim — eyebrow "FUTURE BACKLOG · PHASE 5", title, description card, centered. |
| `SCR-15 Portfolio (Future)` | `Screens — Phase 4` / `175:1713` | 5-metric strip (Initiatives/Features/Total Stories/Accepted Stories/Total Points) + a 5-row Initiative→Feature→Story hierarchy sample (indentation, `Type Badge`, `Status Badge`, `Avatar` reused) — not the full recursive tree from `PortfolioPage.tsx`, just enough rows to show the pattern. |
| `SCR-16 Team Board (Future)` | `Screens — Phase 4` / `176:1930` | 5-metric strip + 3 Kanban columns (Defined/In Progress/Completed) with WIP-limit chips (one shown over-limit in red) and 5 example cards (`Type Badge`, `Priority Badge`, `Avatar` reused). |
| `SCR-17 Reports (Future)` | `Screens — Phase 4` / `177:2156` | Header + a widget grid: Sprint Burndown/Velocity as simplified bar placeholders (not real `recharts` fidelity — a lower bar is correct for a screen this document itself says is not dev-ready), Status Distribution, Defect Summary, Release Progress. |

**Fidelity note (deliberate, not a shortcut):** these four screens are intentionally lower-fidelity than every Phase 0-4 screen — no pixel-exact chart reproduction, no exhaustive data rows, no dedicated new components beyond the one shared banner pattern. Building them pixel-perfect would misrepresent them as dev-ready, contradicting the banner's own claim. This matches D-002's instruction precisely: reference only.

**API/build note:** hit a sizing-axis mistake specific to this pass — for a `layoutMode: 'VERTICAL'` frame, the axis that controls **height** is `primaryAxisSizingMode`, not `counterAxisSizingMode` (counter-axis is *width* for a vertical stack). Several widget/card containers collapsed to 0-100px because `counterAxisSizingMode` was set instead. Documented in `MACHINE_HANDOFF.md` as a new API note — this is a distinct, more specific case of the general "sizing axis is relative to layoutMode, not absolute horizontal/vertical" rule already known from prior plans, worth calling out explicitly since it was misapplied silently (no error thrown) until visually caught.

## Next autonomous action

Continue `P7.b`: run a naming audit for pages, components, properties, variables and styles across the whole file.
