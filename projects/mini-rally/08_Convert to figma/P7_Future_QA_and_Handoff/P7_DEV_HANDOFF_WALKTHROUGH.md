# P7.g — Dev-Handoff Walkthrough

Walked through Contracts 1-5 (`P3_UI_API_CONTRACTS.md`) as an implementer would, cross-checking each contract's described pattern against what actually exists in Figma (`Pilot — Backlog to Detail`, `96:12`, plus the screens that later superseded/extended the pilot).

## Contract 1 — App Shell and context switching

Matches. `App Shell`/`TopNav`/`Context Bar` components exist and are used identically across every screen in Plans 4-7. Role Badge enumeration confirmed present.

## Contract 2 — Backlog list (pilot)

Matches `1 — Backlog (Workspace Admin)` and `5 — Backlog as Project Member` frames. Query/mutation states, enumerations and authorization notes (Release assignment `H` for PM) all verified present in the built frames.

## Contract 3 — Work Item Detail / Drawer (pilot)

Matches `2 — Backlog with Work Item drawer` frame, plus the later full-page `SCR-03 Work Item Detail` (Plan 4) which extends this same contract (Contract 3's coverage note in `P4_SCREEN_CONTRACTS.md` already states this explicitly — no gap).

## Contract 4 — Create work item

Matches `3 — Create Work Item dialog` frame. `Dialog Type=Standard` + `Form Field` composition confirmed.

## Contract 5 — Destructive delete: **gap found and fixed**

**Finding:** Contract 5 describes a Destructive Confirmation pattern (typed-confirmation Confirm button, blocked-delete handling) for "Delete work item / remove user access / delete project" — but **no frame anywhere in the entire Figma file demonstrated it** until this walkthrough. `P3_PILOT_VALIDATION.md` never mentions Contract 5. The `Dialog` component's `Type=Destructive Confirmation` variant itself is real and correct (built in P2, extended with `Require Typed Name` in P6.d and verified working there), but the two P6.d verification instances were temporary test nodes, explicitly created and then removed (`inst1.remove(); inst2.remove()`) after confirming the property toggle worked — so even that verification left no persisted trace.

**Fixed:** added a persisted frame to the Pilot, `6 — Destructive delete confirmation (Contract 5)` (`183:2802`), using `Require Typed Name=true` (work item delete groups with Delete Project/Remove User Access per Contract 5's own listing) with realistic content ("Delete 'Checkout API returns 500 on discount codes'?", "Type US-4821 to confirm", "Delete Work Item" button) so the full pilot now demonstrates all five contracts end to end, not four.

**Secondary finding, not a contradiction (cross-referenced to avoid future confusion):** Contract 5 (P3) and Contract 16 (P6, `P6_SCREEN_CONTRACTS.md`) were written three plans apart and describe what could look like conflicting rules at a glance — Contract 5 says destructive deletes need typed confirmation; Contract 16 says *some* destructive actions (Archive/Restore Project, Deactivate/Restore Team) don't. They are actually consistent: Contract 5's list (work item delete, remove user access, delete project) is exactly the high-risk set that keeps `Require Typed Name=true`; Contract 16's ordinary-risk list is a **different, non-overlapping** set of actions. Recorded here so a future reader doesn't have to re-derive this cross-reference themselves.

## Open items surfaced by this walkthrough (not new — restating for handoff completeness)

- Q-02 (blocked-delete structured shape) is still open and directly affects the new pilot frame 6's "blocked" case, which was not built (only the happy-path confirmation was) — same scope boundary as Contract 5's own text ("needs a structured reason from BE — see Q-02").
- Q-16 (P6) — no Figma composition exists for the blocked-delete state on *any* screen, not just this one. Both notes point at the same underlying gap; a single future pass can close both.
