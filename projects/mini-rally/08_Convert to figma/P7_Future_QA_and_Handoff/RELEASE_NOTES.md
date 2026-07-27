# Release Notes — Mini Rally Mockup → Figma Conversion

Final deliverable of the 7-plan conversion workflow. This is the single authoritative summary — the per-plan `CONVERSION_PROGRESS.md` bullet list of open questions is now frozen; this document supersedes it as the live reference.

## What's in the Figma file

**File:** [Mini Rally Figma](https://www.figma.com/design/ttpggMpbPwggOZl6umowzC/Mini_Rally_Figma) (`ttpggMpbPwggOZl6umowzC`)

- **Foundations:** 4 variable collections (Primitives, Color [Light/Dark], Spacing, Radius, Typography), fully documented in `P1_TOKEN_MAPPING.md`.
- **39 components/patterns** across the core library (P2: 23), UX patterns (P3: Data Table, Query Controls, System States, Detail Patterns, RBAC), and domain-specific additions (P4-P6: Metric Card, Entity Status Badge, Defect Priority Chip, Timebox State Badge, Severity Badge, Notification Card, Permission State Chip).
- **26 screens** across 4 screen pages (`Screens — Phase 0–1`, `Screens — Phase 2–3`, `Screens — Phase 4`) plus the 6-frame `Pilot — Backlog to Detail`.
- **51 native vector icons**, each mapped 1:1 to a `lucide-react` import name.

## Final screen coverage

| Status | Count | Examples |
|---|---:|---|
| **Converted** (dev-ready fidelity) | 19 screens | Login, Home, Manage Projects, Work Item Detail, Backlog, Timeboxes, Iteration Status, Team Status, Quality/Defects, Notifications, Roles & Permissions, Workspace Settings, Teams, User Management, Audit Log, Access Denied/Not Found |
| **Converted (Future/Reference)** — deliberately lower fidelity per D-002 | 4 screens | Team Board, Portfolio, Reports, Release Planning placeholder |
| **Out of scope** — BA/SRS-confirmed deferral, not built | 3 surfaces | Workflow Status, Labels (Settings & Audit SRS §5/§6), `ReleasesPage.tsx` (Tier B — no reachable nav entry, Q-13) |
| **Needs decision** | 0 remaining | — |

Full row-by-row detail: `CONVERSION_PROGRESS.md`'s Screen coverage matrix.

## Everything found and fixed during this conversion (not just built)

These are genuine defects or gaps discovered while converting — not mockup features, real bugs/gaps caught along the way:

1. **`launch.json` Windows npm path bug** — bare `npm` resolved to a space-containing path and failed; fixed with `cmd /c npm ...` (P4).
2. **`PortfolioPage.tsx` missing `SavedViewsDrop` import** — crashed the entire mockup app (no error boundary) whenever Portfolio rendered. Fixed and committed (`ebc431b`) between Plan 5 and 6.
3. **Duplicate `Icon/Flag` component** — created without checking the existing icon inventory first; found during Plan 6 validation, instances swapped to the original, duplicate deleted.
4. **`Dialog`'s `Type=Destructive Confirmation` had no way to represent ordinary-risk confirmations** — it unconditionally showed a typed-name field, which is only correct for Delete Project/Remove User Access per SRS §9, not for Archive/Restore/Deactivate. Fixed by adding a `Require Typed Name` boolean property (P6.d).
5. **Missing `font/size/base`/`lg`/`xl` tokens** — used throughout Plans 5-7 but never created; `setBoundVariable` with an undefined variable silently falls back rather than erroring, causing subtle unintended font sizes with zero visible error. Root cause fixed (tokens created as correct aliases); already-built nodes not retroactively rebound (documented, low-priority cosmetic gap — see `P7_PROGRESS.md`).
6. **Contract 5 (Destructive delete) had zero persisted Figma evidence anywhere in the file** despite being fully specified since Plan 3 — found during the P7.g dev-handoff walkthrough, fixed by adding a sixth pilot frame.
7. **`color/text/muted` fails WCAG AA contrast** (3.1:1, needs 4.5:1) — inherited faithfully from the mockup's own color choice, not introduced by conversion. Flagged for BA/design sign-off, not changed unilaterally (P7.d).

## Complete open-question ledger (Q-01 through Q-16)

These cannot be resolved from the SRS, mockup or this workspace — genuine blockers for backend/API implementation, not Figma gaps.

| ID | Question | Raised in | Status |
|---|---|---|---|
| Q-01 | Transport/route shape (REST vs GraphQL, offset vs cursor pagination)? | P3 | Open — API owner |
| Q-02 | Structured shape for a blocked-delete response (dependency reason)? | P3 | Open — BA + API owner; same underlying gap as Q-16 |
| Q-03 | Is backlog rank server-side ordered with an optimistic reorder-and-revert endpoint? | P3 | Open — BA + API owner |
| Q-04 | Concurrency model for simultaneous edits? | P3 | Open — API owner |
| Q-09 | Is Home's Recent Activity workspace-wide or user-scoped, and does it paginate? | P4 | Open — BA |
| Q-10 | Does Manage Projects support hard delete, or archive/restore only? | P4 | Open — BA; same underlying gap as Q-16 |
| Q-11 | Backlog Defect-priority enum: display mapping or separate field? | P4 | **Resolved** (P5.a) — confirmed display-label mapping across 3 source files |
| Q-12 | Should Iteration Status/Team Status editing differentiate PA from PM within an already-accessible project? | P5 | Open — BA (mockup currently gates only on project-scope readOnly) |
| Q-13 | Is `ReleasesPage.tsx` dead code or a future wire-up? | P5 | **Resolved for this pass** — Tier B/reference (D-002 precedent); genuine BA answer still valuable |
| Q-14 | Are Quality's `State` and `Flow State` independent or should one derive from the other? | P5 | Open — BA |
| Q-15 | Should PA/PM's Settings sidebar fully omit WA-only items (SRS: "do not see") or show them locked (mockup's actual rendering)? | P6 | **Resolved for this pass** per source precedence (SRS over mockup); BA confirmation still recommended |
| Q-16 | What should the blocked-delete dependency modal actually look like? | P6/P7 | Open — same gap as Q-02/Q-10, now consolidated |

**For whoever picks up implementation:** Q-01, Q-03, Q-04 block starting Backlog specifically. Q-02/Q-10/Q-16 are the same underlying gap (blocked-delete UX) and should be answered together, once, not three times.

## Recommended implementation order

1. **Foundations first:** tokens (Color/Spacing/Radius/Typography) → design system package, before any component.
2. **Core components** (P2 library) — Button through Drawer — these have zero external dependencies.
3. **App Shell + Data Table + System States** (P3 patterns) — every screen depends on these three.
4. **Backlog + Work Item Detail** (the pilot, now with all 5 contracts + the Contract 5 gap closed) — this is the most-validated flow in the file and should be the first real feature built, both because it's fully specified and because building it will surface any remaining contract gaps before they multiply across later screens.
5. **Phase 2-3 delivery screens** (Iterations, Iteration Status, Team Status, Quality) in any order — no screen in this group depends on another.
6. **Phase 4 governance** (Notifications, Roles & Permissions, Settings) — depends on the RBAC model being real (not the mockup's UI-only role switcher), so this should follow real auth/session work, not precede it.
7. **Future/Reference screens** (Team Board, Portfolio, Reports, Release Planning) — explicitly not this release; revisit only when BA expands scope.

## What Figma does not prove

Repeating the standing rule from every plan's contracts, because it matters most at handoff: **Figma visibility, hidden state, or disabled state is a UX signal, never a security control.** Every `H`/`D`/`R` state shown in this file must be enforced server-side independent of what the UI renders. No screen in this file should be read as "this proves the backend is secure" — only "this is what a correctly-secured backend's UI should look like."
