# Rally Production vs Mini_Rally_pj Alignment Gap

Updated: 2026-07-07
Purpose: Align current Rally production code with Mini_Rally_pj Phase 0, Phase 1 and Phase 2 BA/mockup/SRS baseline.
Owner view: BA / Product / Production readiness.
Scope note: This document now tracks BA-facing FE mockup and flow alignment only. Architecture, BE implementation choices, API exposure, data modeling and permission enforcement design remain dev-owned follow-up work.

## 1. Source Of Truth

Mini_Rally_pj is the documentation and mockup source.

- `D:\Mini_Rally_pj\Time line.md`
- `D:\Mini_Rally_pj\04_Developement_tracking\Phase 0\PHASE0_DEVELOPMENT_TRACKING.md`
- `D:\Mini_Rally_pj\04_Developement_tracking\Phase 0\PHASE0_MOCKUP_CHECKLIST.md`
- `D:\Mini_Rally_pj\04_Developement_tracking\Phase 1\PHASE1_DEVELOPMENT_TRACKING.md`
- `D:\Mini_Rally_pj\04_Developement_tracking\Phase 1\PHASE1_MOCKUP_CHECKLIST.md`
- `D:\Mini_Rally_pj\04_Developement_tracking\Phase 2\PHASE2_DEVELOPMENT_TRACKING.md`
- `D:\Mini_Rally_pj\04_Developement_tracking\Phase 2\PHASE2_MOCKUP_CHECKLIST.md`

Rally is the production codebase.

- `D:\QNSC\Workspace\rally`
- Local FE: `http://localhost:5173`
- Local API: `http://localhost:3000`

## 2. Current Production Runtime Check

| Area | Result | Notes |
|---|---|---|
| Docker services | Not verified in this pass | Docker Desktop was not running on 2026-07-07, so Postgres/Valkey/LocalStack could not be restarted from this audit. |
| API | Not verified in this pass | API depends on local Docker services; no `localhost:3000` listener was available during this audit. |
| Web | Running | Vite app restarted at `http://localhost:5173`; source audit is the primary evidence because API data was unavailable. |
| Worker | Not verified in this pass | Worker was not started because local Docker services were unavailable. |
| Seed data | Source available, runtime not verified | Seed script still defines projects, users, teams, iterations, releases and work items, but DB runtime was not available. |

## 3. Automated Test Result

| Command | Result | BA meaning |
|---|---|---|
| `pnpm test` | Pass | 8 test files, 156 tests passed. |
| `pnpm --filter rally-web typecheck` | Pass | Web TypeScript surface passes independently. |
| `pnpm --filter rally-web build` | Pass | Web production build passes. |
| `pnpm build` | Pass | API and worker build. |
| `pnpm typecheck` | Fail | Root tsconfig currently scans `apps/web` with backend config; also iteration spec mock has `listAssignmentOptions` type issue. |
| `pnpm --filter rally-web test` | Not rerun | Previous gap: missing `jsdom` / no FE unit test files. |
| `pnpm --filter rally-web test:e2e` | Not rerun | Browser smoke was blocked by unavailable API/DB runtime; Playwright install still needs confirmation before E2E. |

## 4. Executive BA Conclusion

Rally FE now contains BA/mockup coverage for the core Phase 0, Phase 1 and Phase 2 surfaces from Mini_Rally_pj.

The current remaining gaps are no longer large missing FE mockup screens. From the BA view, they are mainly:

1. Runtime/API verification was blocked on 2026-07-07 because Docker Desktop was not running.
2. Permission-specific behavior is intentionally deferred, especially `All Teams` create/edit restrictions.
3. Some mockup data in Manage Projects/Teams/Users is explicitly prefixed with `Mockup_` and is BA-facing only.
4. Future/deferred product areas such as Workspace CRUD, Releases and Reports stay hidden or `SOON` in FE where appropriate; implementation architecture is dev-owned.
5. Non-admin/viewer read-only behavior still needs a real role-based smoke test.

## 4A. 2026-07-07 FE Re-Map Snapshot

| Phase | Current FE alignment | Remaining gap |
|---|---|---|
| Phase 0 | App shell, auth screens, forgot/reset password, 403/404, workspace/project/team selector and Project/Team hierarchy are present in Rally FE. | Runtime auth/API verification and role-based permission filtering are not verified in this pass. |
| Phase 1 | Backlog, create Story/Defect, Work Item Detail, Tasks, Revision History, Attachments, Manage Projects, Manage Teams and Manage Users mockups are present. | Manage Teams/Users include `Mockup_` data for BA review; persistence/API behavior still needs runtime verification. |
| Phase 2 | Backlog Enhancement, Timeboxes/Iterations and Iteration Status mockups are present. Manage Filters, bulk assign, rank reorder, Iteration detail and Add Item are represented in FE. | Runtime behavior for API-backed queries/mutations is not verified because local API/DB were unavailable. |

### What Was Added To Rally FE For Alignment

| Area | Added alignment |
|---|---|
| App Shell | Project dropdown now expands teams under each project and supports `All Teams` as a valid context. |
| Manage | `/projects` now carries Manage-style Projects, Teams and Users tabs, including Create/Edit Team with `Team Info` and `Members`, plus Invite/Edit User with Team membership. |
| Create Work Item | Create modal accepts Project context and Team options/default Team from the selected context. |
| Backlog P2.1 | Manage Filters, sortable headers, Rank column, bulk Release/Iteration assignment controls and real rank move controls were added. |
| Timeboxes P2.2 | Iteration list includes Project and Task Estimate mockup columns, New Iteration modal, Iteration detail, and hides Release/Milestone until Phase 3. |
| Iteration Status P2.3 | Added Manage Filters, sorting/pagination, rank move controls, Add Item modal and Rally-like work item list behavior. |

## 4B. BA FE Handoff For Dev

This handoff is intentionally FE/BA-only. Dev can use it to decide the final BE/API/permission implementation without this document prescribing architecture.

| FE surface | BA behavior now represented | Main Rally FE files touched or relevant | Dev follow-up |
|---|---|---|---|
| App Shell context selector | Organization menu shows projects; each project expands its teams; project-level `All Teams` remains selectable. | `apps/web/src/widgets/app-shell/app-shell.tsx`, `apps/web/src/shared/lib/stores/app-context.store.ts`, `apps/web/src/features/teams/api.ts` | Wire final permission rules for which users can see/select project-level and team-level context. |
| Manage Projects / Teams / Users | `/projects` carries BA Manage tabs for Projects, Teams and Users. Team create/edit includes `Team Info` and `Members`; User invite/edit includes team membership. Mock data is prefixed `Mockup_`. | `apps/web/src/pages/projects/projects-page.tsx` | Replace mock-only rows/actions with real persistence when BE is ready; keep `Mockup_` prefix until converted. |
| Create Work Item | Story/Defect create flow supports Project and Team context, including defaulting from selected context where possible. | `apps/web/src/features/work-items/ui/create-work-item-modal.tsx`, `apps/web/src/features/work-items/api.ts` | Confirm create validation once permission matrix and API contract are finalized. |
| Backlog | BA mockup adds Manage Filters, sortable table headers, Rank column, bulk Release/Iteration controls and move up/down rank actions. | `apps/web/src/pages/backlog/backlog-page.tsx`, `apps/web/src/features/work-items/api.ts` | Verify list, filter, bulk update and rank mutation behavior against runtime API. |
| Timeboxes / Iterations | Iteration list aligns with Phase 2 mockup: Project and Task Estimate columns, New Iteration modal, iteration detail page, Release/Milestone hidden until Phase 3. | `apps/web/src/pages/iterations/iterations-page.tsx` | Confirm persisted project/team/estimate behavior against API. |
| Iteration Status | Phase 2 status view has Manage Filters, sortable columns, pagination, rank controls and Add Item modal for Story/Defect. | `apps/web/src/pages/iteration-status/iteration-status-page.tsx` | Verify Add Item and rank/status behavior when API/DB runtime is available. |
| Auth BA screens | Login, forgot password and reset password screens carry Rally branding and BA-ready flow surfaces. | `apps/web/src/pages/login/login-page.tsx`, `apps/web/src/pages/forgot-password/forgot-password-page.tsx`, `apps/web/src/pages/reset-password/reset-password-page.tsx` | Confirm final copy/error behavior with auth API. |

## 5. Phase 0 Alignment

### Phase 0 Scope From Mini_Rally_pj

Foundation scope:

- Authentication.
- App Shell.
- Fixed Company / Workspace.
- Project Management.
- Company -> Project -> Team context.
- No self-service Workspace CRUD/switch UI in single-company MVP.

### Already Available In Rally

| Requirement | Rally status | Evidence |
|---|---|---|
| Login/session/authenticated app | Available | User can access authenticated app as Admin. |
| App shell | Available | Top navigation, Home, Plan, Track, Settings/profile areas render. |
| Fixed company context | Available | UI shows `Acme Corp (Dev Tenant)`. |
| Project/Team selector | Available | App shell shows projects and team rows under each project, with `All Teams` as project-level context. |
| Project list | Available | `/projects` shows 5 active projects. |
| Project create modal | Available | `New Project` modal has Project Name, Key, Lead, Description. |
| Project search/status tabs | Available | Search and All/Active/Archived controls present. |
| Forgot/reset password screens | Available | `/forgot-password` and `/reset-password` FE screens are implemented. |
| 404/403 routes | Available | `/403` and catch-all 404 screens exist. |
| No workspace create/switch UI | Mostly available | FE does not show Workspace create/switch in main UI. |

### Phase 0 Gaps

| Gap | Severity | Notes |
|---|---:|---|
| Project/Team hierarchy permission filtering not verified | Medium | Team selector exists in FE; role-specific filtering still needs non-admin smoke test. |
| Workspace CRUD UI is hidden in FE | Low | From BA view this is aligned for single-company MVP. API/architecture exposure is dev-owned and not tracked as a BA FE gap. |
| Full loading/generic error/retry states not verified | Medium | 403/404 screens exist; generic retry/error-state behavior needs BA error-state checklist and tests. |
| Project archive/restore and read-only archived mutation behavior not fully verified | Medium | UI has controls, but end-to-end mutation behavior was not tested in this pass. |

### Mockup/Doc Actions Needed

| Action | Target |
|---|---|
| Project/Team selector mockup has been added to Rally FE. | Done in App Shell |
| `All Teams` is valid; permission-specific Team enforcement moves to permissions phase. | BA decision done 2026-07-06 |
| Document that Workspace CRUD is not a BA-facing Phase 0 FE surface. Architecture/API handling is dev-owned. | Phase 0 BA scope |

## 6. Phase 1 Alignment

### Phase 1 Scope From Mini_Rally_pj

Core Work Management:

- Manage Projects / Teams / Users.
- Backlog base list.
- Create Story / Defect.
- Work Item Detail.
- Task Management.
- Time Tracking.
- Content / Attachments.
- Basic Activity Log / Revision History.

### Already Available In Rally

| Requirement | Rally status | Evidence |
|---|---|---|
| Backlog load from DB by selected project | Available | `/backlog` shows NXP work items when context is `NXP · All Teams`. |
| Story/Defect only in Backlog | Available | Backlog filter and create modal expose Story/Defect; no Feature/Epic create observed. |
| Backlog search/filter/pagination | Partially available | Search, type/state/owner/release/iteration filters and paging controls are present. |
| Click Work Item ID/detail route | Available | `/item/NXP-10` renders full detail. |
| Create Work Item modal | Available | Modal has Story/Defect, Title, Team, Owner, Plan Estimate, Create with details, Create Item. |
| Work Item Detail tabs | Available | Details, Tasks, Revision History tabs render. |
| Details content | Available | Description, Attachments, Notes, Release Notes render. |
| Sidebar fields | Available | Schedule State, Flow State, Owner, Team, Plan Estimate, Iteration, Release. |
| Attachments UI | Available | Drag/drop upload area visible. |
| Tasks tab | Partially available | Tasks tab exists; seeded item had no tasks, so full task behavior not verified. |
| Manage Projects | Available | `/projects` contains Manage-style Projects tab with create/edit/archive/restore mockup behavior. |
| Manage Teams | Available as FE mockup | `/projects` contains Teams tab, Create/Edit Team modal, Team Info and Members tabs. |
| Manage Users | Available as FE mockup | `/projects` contains Users tab, Invite/Edit User modal, role and team membership selection. |
| User Management in Settings | Available | `/settings` also has User Management with member invite/role assignment surfaces. |
| Backend work item/task/activity/attachment APIs | Available | OpenAPI exposes relevant endpoints. |

### Phase 1 Gaps

| Gap | Severity | Notes |
|---|---:|---|
| Manage Teams/Users persistence not runtime verified | High | FE mockup exists; Docker/API was unavailable in this pass, so real persistence was not smoke-tested. |
| Manage page location uses `/projects` | Medium | Mini_Rally_pj calls this Manage. Rally FE currently hosts Projects/Teams/Users under `/projects`; acceptable as mockup if BA accepts this route. |
| Create Work Item Team API data not runtime verified | Medium | FE uses project teams and context default; API data could not be verified because local API/DB were unavailable. |
| Task management not runtime verified | Medium | Source has Add Task, totals and task detail behavior; needs seeded task or create task flow runtime test. |
| Activity log not runtime proven | Medium | Revision History tab and API hook exist; needs create/update runtime action to verify logging. |
| Rich text sanitization not verified | Medium | UI exists, but security/data contract needs test coverage. |
| Attachment persistence not verified | Medium | Upload UI exists; metadata/object storage behavior not tested end-to-end. |
| Viewer read-only rules not verified | Medium | Need login as viewer and test field mutation restrictions. |

### Mockup/Doc Actions Needed

| Action | Target |
|---|---|
| Confirm BA accepts `/projects` as the Manage Projects/Teams/Users location, or rename/route to a dedicated Manage page later. | Phase 1 Manage |
| Manage Teams production mockup has been added in Rally FE. | Done |
| User Management team membership UI mockup has been added in Rally FE. | Done |
| Add task seeded scenario or QA script for Add Task -> Task Detail -> Revision History. | Phase 1 Task |
| Add Activity Log acceptance examples showing before/after update records. | Phase 1 Activity |

## 7. Phase 2 Alignment

### Phase 2 Scope From Mini_Rally_pj

Agile Execution:

- P2.1 Backlog Enhancement.
- P2.2 Timeboxes / Iterations.
- P2.3 Iteration Status.
- Global Project/Team context rule:
  - Workspace selector Project/Team is source of data context.
  - Backlog, Timeboxes/Iterations and Iteration Status filter by selected Project/Team.
  - Create Work Item and Create Iteration auto-fill Project/Team from selected context.
  - Iteration assignment must match Work Item Project/Team.

Out of Phase 2:

- Team Board.
- Team Status.
- Release Management.
- Milestones.
- Board drag/drop.
- Start/Close/carry-over workflow.

### Already Available In Rally

| Requirement | Rally status | Evidence |
|---|---|---|
| Plan > Timeboxes route | Available | `/timeboxes` renders Timeboxes page. |
| Iterations list | Available | Shows Sprint 25.4, Sprint 26.1, Sprint 26.2. |
| Iteration list columns | Available | Name, Theme, Start Date, End Date, Project, Planned Velocity, Task Estimate and State are in FE source. |
| Create Iteration modal | Available | Modal has Project, Team, Name, Start Date, End Date, State, Create and Create with details. |
| Iteration detail page | Available | Row click/Create with details opens full-page detail with Theme, Notes and right panel fields. |
| Backlog Manage Filters | Available | Manage Filters source exists with selectable filter columns. |
| Backlog bulk assign | Available | Bulk Release and Iteration assignment controls are present when rows are selected. |
| Backlog rank/reorder | Available | Move up/down controls call rank API mutation. |
| Backlog Iteration field | Available | Backlog list has Iteration filter and per-row Iteration select. |
| Work Item Detail Iteration field | Available | Detail right panel shows Iteration select. |
| Track > Iteration Status route | Available | `/iteration-status` renders. |
| Iteration Status selector | Available | Selector shows iteration name and date range. |
| Metrics strip | Available | Planned Velocity, Iteration End, Accepted, Defects, Tasks. |
| Iteration work item list | Available | Shows selected iteration item from work item assignment. |
| Add Item button | Available | Add Item button visible. |
| Iteration Status advanced list controls | Available | Manage Filters, sort headers, pagination and rank move controls are in FE source. |
| Iteration Status Add Item modal | Available | Modal creates Story/Defect into selected Iteration and supports Create with details. |
| Team Status and Future Team Board not implemented in Phase 2 | Aligned | Track only exposes Iteration Status in current Phase 2 scope; Team Status is Phase 3 and Team Board is Future Backlog. |
| Release/Reports nav marked future | Mostly aligned | Nav shows Releases/Reports `SOON`, though backend APIs exist. |

### Phase 2 Gaps

| Gap | Severity | Notes |
|---|---:|---|
| Permission-specific Project/Team behavior not defined | Medium | BA decision allows `All Teams`; permission-specific Team enforcement is deferred. |
| Create Work Item Team default not runtime verified | Medium | FE passes context/default Team and loads project teams; API runtime was unavailable in this pass. |
| Create Iteration Team default not runtime verified | Medium | FE defaults Team from context and loads project teams; API runtime was unavailable in this pass. |
| Iteration Project/Team validation not runtime verified | Medium | Validation needs API/DB smoke test once Docker/API are available. |
| Timeboxes type dropdown Iterations/Releases/Milestones not observed | Aligned | BA decision 2026-07-06: Phase 2 hides deferred Release/Milestone type options and shows Iterations only. |
| Runtime behavior for Backlog/Iteration Status mutations not verified | Medium | FE source has controls and API hooks; local API/DB were unavailable during this audit. |
| Add Item modal runtime behavior not verified | Medium | Source matches Story/Defect-only requirement; create into selected iteration needs API runtime test. |

### Mockup/Doc Actions Needed

| Action | Target |
|---|---|
| Project/Team context selector with actual Team selection. | Done in App Shell |
| Create-flow mockups showing Project/Team auto-fill for Create Work Item and Create Iteration. | Done in FE source; runtime verification pending |
| Add BA note: `All Teams` is allowed as a valid Phase 2 context; permission-specific rules are deferred. | Done 2026-07-06 |
| Backlog Enhancement production mockup for Manage Filters, bulk assignment and reorder controls. | Done |
| Timeboxes Iteration detail page mockup. | Done |
| Iteration Status Add Item modal confirmation mockup. | Done |

### BA Update 2026-07-06

- `All Teams` is allowed as a valid Phase 2 context for Backlog, Timeboxes/Iterations and Iteration Status.
- Create flows may open while context is `All Teams`; Team may remain blank or be user-selectable in mockup.
- Permission-specific rules for who can create/edit without selecting a concrete Team are deferred to the permissions phase.
- Release Management and Milestones remain hidden from Phase 2 UI and are deferred to Phase 3.

## 8. Deferred Scope Check

| Capability | Mini_Rally_pj target | Rally current state | Alignment |
|---|---|---|---|
| Team Board | Future Backlog | Not implemented in FE | Aligned; not required for current MVP |
| Team Status | Phase 3 | Not implemented in FE | Aligned |
| Release Management | Phase 3 | FE nav `SOON`; API handling is dev-owned | FE gated / aligned for BA |
| Milestones | Phase 3 | Not observed | Aligned |
| Reports | Future phase | FE nav `SOON`; API handling is dev-owned | FE gated / aligned for BA |
| Quality | Future/Phase 3+ | FE nav `SOON` | Aligned |
| Portfolio | Post-MVP/future | FE nav `SOON` | Aligned |

BA view: deferred capabilities are acceptable while the FE keeps them hidden or marked `SOON`. Backend/API exposure is dev-owned and should not block BA mockup alignment.

## 9. OpenAPI Surface Observed In Rally

Important API groups already present:

- Auth.
- Workspaces.
- Projects.
- Teams.
- Work Items.
- Tasks.
- Attachments.
- Comments.
- Iterations.
- Releases.
- Notifications.
- Audit logs.
- Reports.
- Roles and role assignments.

BA view:

- Some backend scope may be ahead of current Mini_Rally_pj phase boundaries.
- This does not block BA FE alignment while the FE gates the capability and product docs label it as foundation/future.
- Architecture, API exposure and data-model decisions remain dev-owned.

## 10. Production Gap Priority List

| Priority | Gap | Recommended next action |
|---:|---|---|
| P0 | Runtime API/DB verification unavailable in this pass | Start Docker Desktop/local services, then rerun BA route smoke tests for Phase 0/1/2. |
| P0 | Permission-specific Team behavior deferred | Define permission matrix for `All Teams`, create/edit without concrete Team, and admin override. |
| P1 | Manage route/location decision | Confirm whether `/projects` is accepted as Manage Projects/Teams/Users or should become a dedicated Manage route. |
| P1 | Mockup-backed Manage data needs persistence verification | Verify Projects/Teams/Users create/edit/deactivate against API once local API/DB are available. |
| P1 | Root typecheck status should be refreshed | Previous root typecheck failure may be stale after FE updates; rerun once runtime work resumes. |
| P1 | FE unit/e2e environment should be completed | Ensure jsdom/Playwright browser setup and add smoke tests for the aligned mockups. |
| P2 | Activity/task/attachment persistence not proven | Add seeded QA scenarios and E2E coverage. |
| P2 | Future product areas visible only as `SOON` or hidden in FE | Keep Release/Reports/Portfolio/Quality out of BA acceptance until their phases are opened. API exposure is dev-owned. |

## 11. Suggested Mockup Backlog For Mini_Rally_pj

These mockup/doc updates should be added before or alongside Rally production changes:

1. `Project/Team Context Selector` - done in Rally FE, permission details later
   - Show company.
   - Show selected Project.
   - Show selected Team or `All Teams`.
   - `All Teams` is valid for Phase 2 list/status context.
   - Create flows may open from `All Teams`; Team may remain blank or user-selectable until permission rules are defined later.
   - Define behavior when changing Project refreshes Team options.

2. `Manage Teams` - done in Rally FE mockup
   - Teams list columns: Key, Team, Project, Status, Lead, Updated.
   - No Members/Capacity/Velocity/Actions columns in list.
   - Row click opens edit modal.
   - Create/Edit Team modal tabs: Team Info, Members.
   - Members tab has searchable member selector.

3. `Manage Users` - done in Rally FE mockup
   - Invite user modal.
   - Role selection.
   - Team membership selection.
   - No direct Project assignment.
   - User status: Active, Invited, Deactive.

4. `Create Work Item With Context` - done in Rally FE, runtime API verification pending
   - Type Story/Defect only.
   - Project auto-filled from selector.
   - Team auto-filled if selected.
   - If context is `All Teams`, Team is not forced in Phase 2 mockup; permission-specific enforcement is deferred.

5. `Create Iteration With Context` - done in Rally FE, runtime API verification pending
   - Iteration name, dates, state.
   - Project/Team auto-filled.
   - Team must belong to Project.
   - Create with details behavior.

6. `Backlog Enhancement Controls` - done in Rally FE
   - Manage Filters.
   - Bulk assign Release.
   - Bulk assign Iteration.
   - Rank/reorder controls.

7. `Iteration Status Add Item` - done in Rally FE, runtime API verification pending
   - Add Item modal supports Story/Defect only.
   - No Schedule State.
   - No Choose Existing Backlog Item.
   - Creates into selected Iteration and appears in Backlog.

8. `Task And Activity QA Scenario` - QA/runtime follow-up
   - Seeded Work Item with tasks.
   - Add Task modal.
   - Task Detail page.
   - Revision History after updates.

## 12. BA Questions To Confirm Next

1. Confirmed 2026-07-06: `All Teams` is allowed as a valid context for Backlog, Timeboxes and Iteration Status. Permission-specific restrictions will be defined later.
2. Confirm whether `/projects` is accepted as the Rally FE location for Manage Projects/Teams/Users, or whether BA wants a dedicated `Manage` route/label.
3. Should Settings placeholder tabs such as Workspace Settings, Roles & Permissions and Audit Log stay visible as admin placeholders, or be hidden until implemented?
4. Dev-owned note only: Workspace CRUD / Release API exposure is not a BA FE decision in this document.

## 13. Recommended Next Step

Use this file as the alignment baseline.

Next recommended work:

1. Start Docker Desktop/local services, then rerun BA smoke tests for `/login`, `/projects`, `/backlog`, `/timeboxes`, `/iteration-status`, and a work item detail page.
2. Confirm the Manage route decision in section 12.
3. Define the permission matrix for `All Teams`, Team selection, and create/edit override.
4. Add runtime QA scenarios for task/activity/attachment persistence.
5. Use section 4B as the FE handoff list for dev implementation and API/permission follow-up.

## 14. Runtime Test Update - 2026-07-07

Runtime BA/FE verification was executed in the in-app browser and recorded in:

- `D:\Mini_Rally_pj\output\RALLY_TEST_EXECUTION_2026-07-07.md`

Key updates since the previous runtime-pending notes:

- Phase 0 app shell, login, navigation and global Project/Team context are browser-verified.
- Phase 1 Manage Projects/Teams/Users, Backlog create/list, Work Item Detail, content persistence, sanitization, Task create and Task Detail are browser-verified.
- Phase 2 Backlog Enhancement, Timeboxes/Iteration create, Iteration Status filter/Add Item/Create with details and Viewer read-only behavior are browser-verified.
- `All Teams` context works for the verified BA flows.

Remaining runtime gaps:

- Iteration Status column labels/shape need BA/dev cleanup: current UI uses `#` instead of explicit `Rank` and does not expose Type as a separate column header matching the test document.
- Add Item fails on seed `Sprint 25.4` with `Team is not linked to this project`; the same Add Item flow passes on `Mockup_UI Iteration BA Smoke`.
- Task table is missing some expected Phase 1 columns (`Rank`, `Project`, `Teams`) and task owner selection did not display in the created task row.
- Task Revision History for a newly created task is empty.
- Attachment upload/download/delete remains blocked for in-app browser testing because native file selection is not available through the current browser automation API.
- Root/FE automation tooling still needs dev follow-up: root `pnpm typecheck`, FE unit `jsdom`, and Playwright browser installation/spec coverage.
