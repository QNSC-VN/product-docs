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

## Contract 14 — Permission Model (`SCR-09`)

| Field | Value |
|---|---|
| Context required | Signed-in user. Workspace Admin sees the full explanation; a normal user can see `My Permissions` for their own Project assignments. |
| Read model | One company authority (`Workspace Admin`) and four contextual Project Access Levels: `Admin`, `Editor`, `Viewer`, `No Access`; includes scope and allowed outcomes per feature. |
| Enumerations | UI outcomes are `Allowed`, `Read-only` and `Hidden`. `Disabled` is reserved for temporary validation/lifecycle state and is not an Access Level. |
| Actions | None. Permission Model is explanatory and read-only. Access is changed only through Users > Project Access or Project > Users & Permissions by Workspace Admin. |
| Mutation states | N/A — read-only surface. |
| Authorization | The displayed model never grants access. Effective authorization is calculated from Workspace Admin status or the user's Access Level in the active Project. |
| Navigation | None — this is a standalone configuration screen. |
| Audit | N/A. Project-access changes are audited at the management journey where Workspace Admin saves them. |

## Contract 15 — Settings: Workspace / Workspaces & Projects / Users (`SCR-10`, `SCR-11`, `SCR-12`)

| Field | Value |
|---|---|
| Context required | Workspace Settings and Users require Workspace Admin. Workspaces & Projects is available to normal users, limited to Projects/Teams they can access. |
| Read model | **Workspace Settings**: Company Name, Workspace Slug/Company Scope and internal Workspace Admin display. **Workspaces & Projects**: Project tree, Details, Users & Permissions and Teams. **Users**: Name/Email/Phone/Disabled/Planner/Last Login plus User Details and Project Access. |
| Enumerations | Team status reuses `Entity Status Badge` `Active`/`Deactive`. User status reuses the same component's `Active`/`Invited`/`Deactive` variants — these variants existed in the library since P4 specifically anticipating this screen (`MACHINE_HANDOFF.md`). |
| Actions | Workspace Admin: edit Workspace Settings; CRUD Projects/Teams; invite/disable users; assign Project Access and Team membership. Project `Admin`: read-only Details/Teams/Users & Permissions for its assigned Project. Editor/Viewer see only their accessible Project/Team context. |
| Mutation states | Standard `idle`→`submitting`→`success`/`server-error` per the shared mutation state machine (`P3_UI_API_CONTRACTS.md`). Workspace Settings save must create an audit event (SRS §3.4). |
| Authorization | Only Workspace Admin mutates company users, Project structure, Team structure, Project Access or Team membership. Project `Admin` does not gain structural management from its delivery access. Workspace Admin is not listed as a Project member or candidate. |
| Navigation | Single entry point through the top-right Settings gear; no duplicate Manage Projects route. |
| Audit | Successful administrative changes to Workspace, Projects, Teams, users, Project Access and Team membership are included. |

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
| Context required | Workspace Admin session; hidden for all normal Project access levels. |
| Read model | Time (weekday, month, day, year, hour, minute, second) / Actor / Detail — a single readable sentence, deliberately with **no separate Action or Entity column** (SRS §8, a confirmed simplification, not an oversight). |
| Enumerations | None — Detail is free text describing the event. |
| Actions | Search by actor name; search by time text. No create/edit/delete actions exist for audit rows — the log is read-only by design. |
| Mutation states | N/A — read-only surface. |
| Authorization | View-only, Workspace Admin only. No role can mutate audit entries under any circumstance. |
| Navigation | None. |
| Audit | N/A (this screen *is* the audit surface). Included event scope: Workspace Settings save, Project/Team administrative changes, user invite/info/status changes, Project Access and Team membership changes, user removal/deactivation. Excluded: delivery-item edits, notes/mentions/attachments/watchers, iteration/release execution and reporting activity. |

## Open questions added by P6

These extend Q-01…Q-14 from prior plans.

| ID | Question | Why it matters |
|---|---|---|
| Q-15 | Resolved 2026-08-10: how are non-WA settings shown? | `Workspaces & Projects` remains visible but scoped/read-only so a user can understand Project Access and Team context. WA-only mutation controls and company-management surfaces are hidden. |
| Q-16 | What should the "blocked delete" dependency modal look like when a Project/Team/user removal is prevented by linked data? | SRS §9 requires this behavior but no Figma composition exists yet for it (nor does the mockup appear to fully implement it based on available source). Carries forward the same gap flagged as Q-10 in Plan 4. |

## Coverage note

Contracts 1–5 are in `P3_UI_API_CONTRACTS.md`, 6–9 in `P4_SCREEN_CONTRACTS.md`, 10–12 in `P5_SCREEN_CONTRACTS.md`. Contracts 13–17 above cover every screen/pattern Plan 6 converted. Workflow Status and Labels have no contract because they are out of scope for Phase 4 (SRS-confirmed deferral, see `P6_PROGRESS.md`).
