# Plan 4 — Screen Annotations

Per-screen role, state and action behaviour for every screen built in P4.a–P4.d. This does not redefine rules — it applies the patterns already established in `P3_RBAC_AND_SYSTEM_STATES.md` and `P3_UI_API_CONTRACTS.md` to the specific screens now in Figma. Where a screen needs a rule not covered by P3, that gap is called out explicitly rather than invented here.

## SCR-00 Login

| Aspect | Behaviour |
|---|---|
| Role rules | None — pre-authentication. `auth:sign_in` is fixed `E` for all roles per the RBAC SRS system baseline. |
| States | Default (empty form) → Submitting (`disabled`, label reads "Signing in…", matches mockup exactly) → Error (inline `Alert Type=Error` above the fields, form values preserved) → Success (navigates to Home). No loading skeleton — the whole page is static until submit. |
| Actions | `Sign in` (mutation: create session). `Forgot password?` is a placeholder link in the mockup — do not build a flow for it; flag to BA if Phase 0 needs one. `Keep me signed in` only affects session persistence, not permissions. |
| Gap | The mockup hardcodes a single demo Workspace Admin account. Multi-account / other-role login is not evidenced — Project Admin and Project Member login screens are assumed identical, since the SRS ties role to the account, not the login form. |

## SCR-11 Access Denied / Not Found

| Aspect | Behaviour |
|---|---|
| Role rules | Reached whenever a `H` (Hidden) outcome would otherwise apply — i.e. any role lacking access to the current route. See the pilot-surface gating table in `P3_RBAC_AND_SYSTEM_STATES.md`. |
| States | These *are* the state — there is no further loading/empty/error inside them. |
| Actions | `Back to Backlog` only. Per RBAC SRS §3.4: neither screen may display the restricted record's title, owner, project or team — the Figma components (`System State` `Type=Forbidden`/`Type=Not Found`) are intentionally generic and must not be parameterised with real record data when implemented. |
| Gap | None — this is the most fully-specified state pair in the SRS. |

## SCR-01 Home

| Aspect | Behaviour |
|---|---|
| Role rules | Summary metrics, My Work and Recent Activity are scoped to the signed-in user and their accessible projects — no role-specific hiding within the page itself (App Shell's nav/gear visibility is the only Home-adjacent RBAC surface, already demonstrated on the `TopNav` `Role` variant). |
| States | Not annotated with dedicated empty/error variants in this pass — Home aggregates data from multiple sources (projects, work items, activity), so its loading/error contract is a compound of the Backlog and Project queries already specified in `P3_UI_API_CONTRACTS.md` contract 2. A dedicated Home read model is a P4.g open item, not fully specified here. |
| Actions | Every metric card, "My Work" row and "Project Health" row is a navigation action (drills into Backlog/Track/Quality/Portfolio), not a mutation. |
| Gap | **No contract exists yet for Home's own read model** (aggregated counts, "my work" query, activity feed pagination). Flagged for `P3_UI_API_CONTRACTS.md` as a follow-up contract — Home was out of scope for the P3 pilot, which covered Backlog/Work Item Detail only. |

## SCR-01A Manage Projects

| Aspect | Behaviour |
|---|---|
| Role rules | Per RBAC SRS §3.1: only `workspace_admin` can create, archive, restore or delete a Project — this is the `canManageCompanyStructure` gate in the mockup. Project Admin and Project Member see this screen **read-only** (`R`): the Create Project button and all row actions (Edit/Archive/Restore) must not render. The mockup's own fallback for non-managers is a `MoreHorizontal` glyph with no action wired — treat that as read-only, not as a disabled-but-visible affordance. |
| States | Empty (`EmptyTable` in the mockup — not yet built as a screen variant here, but the pattern is `System State` `Type=Empty` with a "Change the search or filters" description). No dedicated error state was built for this screen; it follows the same query-state machine as any list (`P3_UI_API_CONTRACTS.md` shared conventions). |
| Actions | Create Project (`project:create`, `H` for non-WA) → Standard Dialog with Form Field instances. Edit/Archive/Restore per row (`project:edit`/`:archive`/`:restore`, all `H` for non-WA — not `D`, since RBAC SRS §2 says Create/Edit/Delete must never render as merely disabled when the user cannot mutate). Archive requires the `Dialog` `Type=Destructive Confirmation`; the mockup's own copy ("read-only and hidden from active selectors... history is preserved") should be reused as the dialog body text. |
| Gap | The read-only fallback for PA/PM was not built as a separate screen variant in this pass — only the Workspace Admin (full-access) view exists in Figma. Add a read-only variant before this screen is treated as implementation-ready for non-WA roles. |

## SCR-03 Work Item Detail (Details / Tasks / Revision History)

| Aspect | Behaviour |
|---|---|
| Role rules | From RBAC SRS §3.1 (Project Member confirmed scope): PM can edit fields, description, Notes, mentions, attachments, relations, watcher subscription, and assign an Iteration — but **cannot assign a Release**. The `Release` field in the aside must render as `H` (not merely disabled) for PM; this is a real inline-editing distinction the mockup itself encodes (`disabled={readOnly \|\| role === "Project Member"}` on the Release select) and must survive into implementation. The Release Notes rich-text field carries the same PM restriction (`readOnly={readOnly \|\| role === "Project Member"}`) — PM sees it as read-only text, not an editable field. |
| States | Details tab has no dedicated loading state built (the field aside assumes data is already resolved). Tasks tab's totals row is always visible even with zero tasks — an explicit `Type=Empty` variant for "no tasks yet" was not built; add one if Task creation is prioritised before Plan 5. Revision History reuses `Activity Row`, which has no built-in pagination affordance yet — the mockup shows a fixed list with no "load more", consistent with the SRS not specifying pagination for this log. |
| Actions | Field edits (`work_item:edit`) are inline, not modal — matches Contract 3 in `P3_UI_API_CONTRACTS.md`. Add Task (`work_item:edit`, since Tasks have no separate permission code) opens a Dialog+Form Field composition identical in structure to the pilot's Create Work Item dialog — not rebuilt here as a distinct example. Task field edits (rank, name, state, owner, to-do/actuals/estimate) are inline per-cell, same `submitting` granularity as Backlog's inline edits. |
| Gap | **Milestones field behaviour is only partially annotated.** The mockup gates milestone toggling behind `readOnly \|\| role === "Project Member"` — same restriction as Release — but this was not called out in `P3_UI_API_CONTRACTS.md` Contract 3's authorization row. Recording it here: Milestones toggle is `H` for Project Member, same as Release. |

## Cross-screen finding — Defect priority enum conflict (found in P4.f)

Backlog's Defect rows use a **distinct** priority control — `Low/Normal/High/Urgent/None` (`BACKLOG_PRIORITY_OPTIONS`), styled `#9a3412`/`#f5d899` — instead of the standard `Priority Badge` (Critical/High/Medium/Low) used everywhere else, including Home's My Work table and the P3 pilot's Backlog build. This is P0 finding G-004 made concrete: "status semantics overlap but do not share one domain model." Not resolved here — see `P4_PROGRESS.md` P4.f for the three candidate resolutions. Whoever builds the real Backlog screen in Plan 5 must resolve this before that screen is implementation-ready.

## Cross-screen finding

Two screens (`Manage Projects`, `Work Item Detail`) were only built in their **fullest-access (Workspace Admin) form**. Before either is called implementation-ready, each needs at minimum one read-only (`R`) variant screenshot demonstrating the RBAC SRS's "no mutation controls rendered" rule in context — the `RBAC Outcome` pattern demonstrates this in isolation (P3.f) but has not yet been shown composed into a full real screen. This is the natural next increment if Plan 4 continues past this confirmation gate.
