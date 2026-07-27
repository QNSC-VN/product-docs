# Plan 6 — Screen-Level Contracts

Same template and rule as `P4_SCREEN_CONTRACTS.md` / `P5_SCREEN_CONTRACTS.md`: UI requirements, not an API specification. Contracts continue the numbering from Plan 5 (10–12).

## Contract 13 — Notifications (`SCR-08`)

| Field | Value |
|---|---|
| Context required | Signed-in user only. Not project/team-scoped for display, but notification *creation* is gated by the recipient's access to the target US/DE (SRS §8). |
| Read model | Notification list for the current user: type (Assigned/Mention), title, body, project, actor, timestamp, read state. Popup shows the newest unread Mention, falling back to the newest unread of any type (`NotificationsPage.tsx`'s `popup` logic, exact match). |
| Enumerations | Two fixed event types only for Phase 4.1 — `assigned`, `mention` (SRS §5). Do not add other categories without a BA decision; the SRS explicitly scopes this small on purpose. |
| Actions | Open notification (marks read, routes to target work item); Mark all as read; filter by All/Unread/Assigned/Mentions. |
| Mutation states | Marking read is optimistic/local in the mockup; no `submitting`/`server-error` distinction modeled. Flag to API-owner: read-state writes must be idempotent per SRS FR-021, and the backend must reject read/update attempts for another user's notifications (FR-020) regardless of what the UI shows. |
| Authorization | System-baseline `E` for all roles (RBAC SRS, confirmed again in `PROD_ROLE_ACTION_MATRIX` rows `notifications:view`/`notifications:mark_read`/`notifications:view_target`, all locked `E,E,E`). The *content* of a notification must still respect current project/team access — SRS §8: if access is revoked after creation, the row may show only a safe fallback, never restricted metadata. |
| Navigation | Clicking a notification or "Go to item" opens the related Work Item Detail. If the target is no longer accessible, this must resolve to the shared Not Found/Access Denied state (`P3_RBAC_AND_SYSTEM_STATES.md`), never a raw error. |
| Audit | Not in scope — Notifications are excluded from the Audit Log's event scope (Settings/Audit SRS §8, "excluded event scope" list implicitly; notifications aren't administrative/settings actions). |

## Contract 14 — Roles & Permissions Matrix (`SCR-09`)

| Field | Value |
|---|---|
| Context required | Workspace Admin session. Screen is entirely `H` (hidden) for Project Admin/Project Member per RBAC SRS §3.8 and `workspace_settings:view`/`permission_matrix:edit` matrix rows. |
| Read model | Full `Screen`/`Action`/`Permission`/`WA`/`PA`/`PM` matrix — 75 rows in the mockup baseline (`PROD_ROLE_ACTION_MATRIX`); Figma shows 12 representative rows covering every distinct visual case (see `P6_PROGRESS.md` for the exact selection rationale). **Not exhaustive** — always check the mockup source for a specific row not shown in Figma. |
| Enumerations | `E`/`R`/`D`/`H` per cell (`Permission State Chip`). `Locked` rows (Auth/App Shell/Notifications/Personal) never become editable regardless of edit mode — a business rule, not a UI accident (SRS §2 "System baseline rows display a lock and never become dropdowns in matrix Edit mode"). |
| Actions | Edit (unlocks PA/PM cells as dropdowns; WA column and locked rows stay fixed); Save (persists, returns to read-only display, creates an audit event). |
| Mutation states | `idle` (locked display) → `editing` (dropdowns active for unlocked PA/PM cells) → on Save: persists and returns to `idle`. No `validation-error` state exists — any `E`/`R`/`D`/`H` value is always valid for any cell. |
| Authorization | `E` for Workspace Admin only (`role === "Workspace Admin"` gates `canEditPermissionMatrix` in the mockup exactly). Editing one row's `E`/`R`/`D`/`H` per role must not change any other row's permission code — action independence is a confirmed business rule (SRS §2), not incidental. |
| Navigation | None — this is a standalone configuration screen. |
| Audit | **Required.** Saving matrix changes must create an audit event identifying actor, changed role, screen/action, old state, new state and time (SRS §3.8). This is one of the five event types Audit Log (`SCR-13`) is scoped to include. |

## Contract 15 — Settings: Workspace / Teams / User Management (`SCR-10`, `SCR-11`, `SCR-12`)

| Field | Value |
|---|---|
| Context required | Workspace Admin session for all three — entirely `H` for Project Admin/Project Member (SRS Settings & Audit §3.2, §7). |
| Read model | **Workspace Settings**: Company Name (editable), Workspace Slug/Company Scope/Workspace Admin (read-only display). **Teams**: Name/Project/Lead/Members/Status/Updated. **User Management**: Name/Email/Phone/Role/Status/Last Login, searchable by name/phone/email, filterable by role. |
| Enumerations | Team status reuses `Entity Status Badge` `Active`/`Deactive`. User status reuses the same component's `Active`/`Invited`/`Deactive` variants — these variants existed in the library since P4 specifically anticipating this screen (`MACHINE_HANDOFF.md`). |
| Actions | Workspace Settings: Save Changes. Teams: Create/Edit Team, Deactivate/Restore (destructive, see Contract 16). User Management: Invite User, click a row to open User Details (Name/Role/Status/Phone editable, Email read-only, Remove User Access destructive). |
| Mutation states | Standard `idle`→`submitting`→`success`/`server-error` per the shared mutation state machine (`P3_UI_API_CONTRACTS.md`). Workspace Settings save must create an audit event (SRS §3.4). |
| Authorization | Workspace Admin only for all three screens, no partial-access variant — unlike Project Admin's Manage Projects nuance (full CRUD in assigned projects, read-only elsewhere), there is no "assigned subset" concept for workspace-level Teams/Users/Settings; it's binary WA-vs-everyone-else. |
| Navigation | Entry points are fixed and singular per SRS: top-right gear only (never via the workspace dropdown's Manage Projects, which is Project-scoped only per the reconciled P4-SET-02 decision). |
| Audit | User Management and Teams mutations are all in the Audit Log's included event scope (invite, info/role/status/team-allocation update, removal/deactivation; team create/edit/status changes handled the same way per SRS §8). |

## Contract 16 — Destructive Confirmation Pattern (applies across `SCR-11`, `SCR-12`, Manage Projects)

| Field | Value |
|---|---|
| Component | `Dialog` `Type=Destructive Confirmation` (`65:20`), now with the `Require Typed Name` boolean added in P6.d. |
| High-risk actions (`Require Typed Name=true`) | Delete Project, Remove User Access — user must type the exact target name before the destructive button enables (SRS §9's "High-risk confirmation rule"). |
| Ordinary destructive actions (`Require Typed Name=false`) | Archive/Restore Project, Deactivate/Restore Team — plain named-target confirmation, no typing required. |
| Dependency blocking | If business dependencies block the action (active teams/delivery items, linked artifacts, sole Workspace Admin), the modal must show the blocking reason in read-only form and must not allow confirmation. **Not built as a distinct Figma variant** — flag for Plan 7 if a reviewer wants this explicit blocked-state composition; the mockup's coverage of this case (`Delete must be blocked when the target has dependent or linked data`) was already flagged as an open item back in Contract 9 (`P4_SCREEN_CONTRACTS.md`, Q-10). |
| Audit | Every action in this pattern creates an audit event on success (SRS §9's audit rule) — except delivery-item deletes (work item/task/defect/etc.), which are explicitly **excluded** from the Audit Log (SRS §8's excluded event scope). Do not assume "destructive confirmation shown" implies "audited" — the two are only correlated for administrative/settings actions. |

## Contract 17 — Audit Log (`SCR-13`)

| Field | Value |
|---|---|
| Context required | Workspace Admin session; `H` for Project Admin/Project Member (project-level audit visibility is explicitly deferred to a future P4.3 refinement per SRS §3.7). |
| Read model | Time (weekday, month, day, year, hour, minute, second) / Actor / Detail — a single readable sentence, deliberately with **no separate Action or Entity column** (SRS §8, a confirmed simplification, not an oversight). |
| Enumerations | None — Detail is free text describing the event. |
| Actions | Search by actor name; search by time text. No create/edit/delete actions exist for audit rows — the log is read-only by design. |
| Mutation states | N/A — read-only surface. |
| Authorization | View-only, Workspace Admin only. No role can mutate audit entries under any circumstance. |
| Navigation | None. |
| Audit | N/A (this screen *is* the audit surface). Included event scope: Workspace Settings save, user invite/info/role/status/team-allocation update, user removal/deactivation, role permission matrix save, team administrative changes. Excluded: all work item/task/defect field changes, notes/mentions/attachments/watchers, iteration/sprint/release execution activity, reporting/portfolio activity. |

## Open questions added by P6

These extend Q-01…Q-14 from prior plans.

| ID | Question | Why it matters |
|---|---|---|
| Q-15 | Should Project Admin/Project Member's Settings sidebar fully omit WA-only items, or show them locked-with-a-lock-icon (as the current mockup renders)? | SRS wording says "do not see" (implying hidden/`H`); the mockup code renders `opacity-40` + lock icon (a `D`-style visible-but-disabled treatment). Resolved for this pass by treating the SRS as authoritative per Plan 0's source precedence — Figma's PA/PM App Shell should omit these items — but this is worth a BA confirmation since the mockup's simulation behavior may be intentional (so BA/testers can see every surface exists while validating the role switcher). |
| Q-16 | What should the "blocked delete" dependency modal look like when a Project/Team/user removal is prevented by linked data? | SRS §9 requires this behavior but no Figma composition exists yet for it (nor does the mockup appear to fully implement it based on available source). Carries forward the same gap flagged as Q-10 in Plan 4. |

## Coverage note

Contracts 1–5 are in `P3_UI_API_CONTRACTS.md`, 6–9 in `P4_SCREEN_CONTRACTS.md`, 10–12 in `P5_SCREEN_CONTRACTS.md`. Contracts 13–17 above cover every screen/pattern Plan 6 converted. Workflow Status and Labels have no contract because they are out of scope for Phase 4 (SRS-confirmed deferral, see `P6_PROGRESS.md`).
