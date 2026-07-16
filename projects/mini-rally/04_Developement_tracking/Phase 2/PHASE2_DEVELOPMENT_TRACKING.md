# Phase 2 - Development Tracking

## 1. Tracking Information

| Attribute | Value |
|---|---|
| Phase | Phase 2 - Agile Execution |
| Current delivery slice | P2.3 - Iteration Status linked with Backlog |
| Suggested timebox | 37.0 hours |
| Company scope | Single-company: `ACME Space Inc.` |
| Modules in Phase 2 | Backlog Enhancement, Iteration Management, Iteration Status |
| Overall status | `BA/SRS READY; DEV IN REVIEW / GAP FIXING` |
| Mockup | P2.1, P2.2 and P2.3 updated |
| SRS/DB mapping | P2.1, P2.2 and P2.3 reconciled for dev handoff |
| Production implementation | In review / gap fixing in Rally prod |
| Last updated | 2026-07-12 |

> BA decision 2026-07-12: `Team Status` is moved out of Phase 2 and into Phase 3. `Team Board` is moved out of Phase 2/3/4 and into Backlog for the future. Phase 2 focuses on `Project -> Team -> Backlog -> Timeboxes/Iterations -> Iteration Status`.

> BA decision 2026-06-28: Workspace selector Project/Team is the global Phase 2 context. Backlog, Timeboxes/Iterations, Iteration Status and related records must be filtered by the selected Project/Team. Create Work Item and Create Iteration auto-fill Project/Team from this context. Current mock account is Workspace Admin, so admin may change Project/Team in create/edit forms where enabled, but the selected Team must belong to the selected Project.

> BA decision 2026-07-06: `All Teams` is valid as a Phase 2 context for Backlog, Timeboxes/Iterations and Iteration Status. Permission-specific create/edit restrictions under `All Teams` are deferred to the permissions phase.

> BA decision 2026-07-06: Phase 2 Timeboxes shows Iterations only. Release and Milestone type options are hidden in Phase 2 and return in Phase 3.

> BA decision 2026-07-06: Backlog and Iteration Status move controls must call the real rank/LexoRank reorder behavior. They are not visual-only mock controls.

## 2. Status Legend

| Status | Meaning |
|---|---|
| `NOT STARTED` | Production code not started |
| `IN PROGRESS` | Development in progress |
| `BLOCKED` | Cannot continue without dependency/decision |
| `IN REVIEW` | Code complete, under review/test |
| `DONE` | Code, tests and acceptance criteria passed |
| `DEFERRED` | Moved out of current phase/slice |
| `DECIDED` | BA/PO decision made |
| `BA READY` | BA document/mockup scope is ready for dev handoff |

## 3. Progress Summary

| Group | BA/SRS status | Dev/prod status | Current note |
|---|---|---|---|
| Backlog Enhancement P2.1 | `BA READY` | `IN REVIEW` | Prod exists; filter/server-side sort gaps remain for follow-up. |
| Iteration Management P2.2 | `BA READY` | `IN REVIEW` | Prod exists; Task Estimate roll-up, validation and Project/Team edit rule need review. |
| Iteration Status P2.3 | `BA READY` | `IN REVIEW` | Prod exists; inline edit, column resize, Add Item fields and pagination need review. |
| **Total active Phase 2** | **BA READY** | **IN REVIEW / GAP FIXING** | Do not mark Phase 2 Done until prod gaps pass acceptance. |

### Time Summary

| Metric | Value |
|---|---:|
| Planned for P2.1 | 9.0h |
| Planned for P2.2 | 14.0h |
| Planned for P2.3 | 14.0h |
| Actual | Tracked in Rally prod status, not this BA plan |
| Remaining active Phase 2 | Gap-fixing effort TBD from prod issue breakdown |
| Variance | TBD after prod gap fixing is estimated |

> The task breakdown below remains the BA implementation checklist. Current dev status is summarized above from the Rally prod audit; individual task-level prod status should be updated when the gap-fixing tickets are split.

## 4. Development Task Plan - P2.1 Backlog Enhancement

| ID | Module | Development task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P2-BL-01 | Contract | Extend backlog query params | Project/Team context, quick search, dynamic filters, sort contract | Phase 1 Backlog API | 1.0h | 0h | `NOT STARTED` |
| P2-BL-02 | Backend | Inline update API support | PATCH work item fields allowed from backlog | Work Item update API | 1.0h | 0h | `NOT STARTED` |
| P2-BL-03 | Backend | Bulk release assignment | Bulk mutation with permission checks | Release FK existing | 1.0h | 0h | `NOT STARTED` |
| P2-BL-04 | Backend | Bulk iteration assignment | Bulk mutation updates `work_items.iteration_id` with project/team validation | Iteration FK existing | 1.0h | 0h | `NOT STARTED` |
| P2-BL-05 | Backend | Backlog reorder | Rank update with LexoRank | `work_items.rank` | 1.25h | 0h | `NOT STARTED` |
| P2-BL-06 | Frontend | Search + Manage Filters integration | Toolbar search, multi-column filter manager, URL/query state, including Iteration | P2-BL-01 | 1.0h | 0h | `NOT STARTED` |
| P2-BL-07 | Frontend | Inline edit grid behavior | Optimistic edit/rollback/read-only states including Iteration | P2-BL-02 | 1.25h | 0h | `NOT STARTED` |
| P2-BL-08 | Frontend | Bulk release/iteration assignment UI | Selected rows + mutation + refresh | P2-BL-03..04 | 0.75h | 0h | `NOT STARTED` |
| P2-BL-09 | Verification | Contract/unit/e2e coverage | Project/Team context filter, create defaults, inline edit, iteration assignment, reorder, permission tests | P2-BL-01..08 | 0.75h | 0h | `NOT STARTED` |

## 5. Development Task Plan - P2.2 Iteration Management

| ID | Module | Development task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P2-IT-01 | Contract | Define Iteration DTOs and OpenAPI | List/create/detail/update contracts | Project/Team context | 1.0h | 0h | `NOT STARTED` |
| P2-IT-02 | DB/Backend | Verify or add sprint/iteration fields | Theme, Notes, Planned Velocity mapping decided and migrated if needed | `planning.sprints` | 1.0h | 0h | `NOT STARTED` |
| P2-IT-03 | Backend | List/search/filter/sort iterations | `GET /projects/:id/iterations` filtered by selected Project/Team context | P2-IT-01 | 1.25h | 0h | `NOT STARTED` |
| P2-IT-04 | Backend | Create iteration | Required fields, Project/Team default validation and permission checks | P2-IT-02 | 1.0h | 0h | `NOT STARTED` |
| P2-IT-05 | Backend | Get/update iteration detail | Theme/Notes/right-panel fields update | P2-IT-02 | 1.25h | 0h | `NOT STARTED` |
| P2-IT-06 | Frontend | Timeboxes route/list | Iterations list with search, state filter, sort, pagination | P2-IT-03 | 1.25h | 0h | `NOT STARTED` |
| P2-IT-07 | Frontend | Quick create modal | Type, Project, Team, Name, Start/End Date, State | P2-IT-04 | 1.0h | 0h | `NOT STARTED` |
| P2-IT-08 | Frontend | Full-page Iteration detail | Open from Create with details and row click | P2-IT-05 | 1.5h | 0h | `NOT STARTED` |
| P2-IT-09 | Frontend | Permission/read-only/error states | Viewer read-only, validation, save pending/error | P2-IT-04..08 | 1.0h | 0h | `NOT STARTED` |
| P2-IT-10 | Backend | Expose iteration assignment options | Iterations available to Work Item assignment with project/team validation | Work Item API, P2-IT-02 | 1.0h | 0h | `NOT STARTED` |
| P2-IT-11 | Frontend | Consume iteration assignment options | Backlog list and Work Item Detail can select valid Iteration values | P2-IT-10, P2-BL-07 | 1.25h | 0h | `NOT STARTED` |
| P2-IT-12 | Verification | Unit/contract/e2e smoke tests | Context filter, create defaults, list, detail, validation, permission, assignment | P2-IT-01..11 | 0.75h | 0h | `NOT STARTED` |

## 6. Development Task Plan - P2.3 Iteration Status

| ID | Module | Development task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P2-IS-01 | Contract | Define Iteration Status DTOs and query params | OpenAPI/API contract for selector, metrics, list | P2.2 Iteration DTO | 1.0h | 0h | `NOT STARTED` |
| P2-IS-02 | Backend | Implement Iteration selector source | Timeboxes Iteration records sorted by date and filtered by Project/Team context | P2.2 Iteration backend | 0.75h | 0h | `NOT STARTED` |
| P2-IS-03 | Backend | Implement Iteration Status metrics | Planned velocity, end days, accepted, defects, tasks | Work item iteration assignment | 1.25h | 0h | `NOT STARTED` |
| P2-IS-04 | Backend | Implement Iteration work item list | Search/filter/sort/pagination by selected Iteration, including Iteration field | P2.1 list patterns, P2-BL-04 | 1.5h | 0h | `NOT STARTED` |
| P2-IS-05 | Backend | Support inline update fields | PATCH title/status/iteration/estimate/owner with permission | Work Item update API | 1.0h | 0h | `NOT STARTED` |
| P2-IS-06 | Backend | Create Story/Defect into Iteration | POST selected Iteration work item endpoint with Project/Team auto-fill from context | Work Item create API | 1.0h | 0h | `NOT STARTED` |
| P2-IS-07 | Frontend | Build Track > Iteration Status route/header | Track dropdown, title, selector, no old context bar | App shell | 1.0h | 0h | `NOT STARTED` |
| P2-IS-08 | Frontend | Build metrics strip | Metrics cards and loading/empty states | P2-IS-03 | 0.75h | 0h | `NOT STARTED` |
| P2-IS-09 | Frontend | Build enhanced Iteration list | Backlog-style search/filter/sort/resize/pagination with Iteration column | P2-IS-04 | 1.75h | 0h | `NOT STARTED` |
| P2-IS-10 | Frontend | Implement inline editing | Name/status/iteration/estimate/owner update flow | P2-IS-05 | 1.25h | 0h | `NOT STARTED` |
| P2-IS-11 | Frontend | Implement Add Item modal | Story/Defect create and create-with-details flow | P2-IS-06 | 1.25h | 0h | `NOT STARTED` |
| P2-IS-12 | Frontend | Work Item Detail right-panel Iteration field | Detail opened from Iteration Status shows editable Iteration | P2-BL-02 | 0.5h | 0h | `NOT STARTED` |
| P2-IS-13 | Verification | Unit/contract/e2e tests | Selector, metrics, filters, iteration column, create, detail route | P2-IS-01..12 | 1.0h | 0h | `NOT STARTED` |

## 7. Business Flow Coverage - Project To Iteration Status

Phase 2 must preserve this end-to-end business chain:

```text
Manage Project
-> Manage Team under Project
-> User selects Project/Team from workspace selector
-> Backlog creates and manages Story/Defect for that Project/Team
-> Timeboxes creates Iteration for that Project/Team
-> Existing Backlog Story/Defect can be assigned to the Iteration from Backlog list or Work Item Detail
-> Iteration Status shows only work items assigned to the selected Iteration
```

Mandatory rules for development:

- Team creation belongs to Phase 1 Manage (`Projects`, `Teams`, `Users`).
- A Team must belong to or be available for the selected Project before it can be used on Backlog, Iteration or Iteration Status.
- Workspace selector Project/Team is the active data context for Phase 2 screens.
- Changing workspace selector Project/Team must refresh Backlog, Timeboxes/Iterations and Iteration Status selector/list data.
- Backlog must show only Story/Defect records in the selected Project/Team context.
- Timeboxes/Iterations must show only Iterations in the selected Project/Team context.
- Iteration Status selector must show only Iterations in the selected Project/Team context.
- Create Work Item and Create Iteration must auto-fill Project and Team from the active workspace selector context.
- Workspace Admin can change Project/Team in create/edit forms where enabled; validation must still enforce Team belongs to Project.
- Iteration belongs to a Project/Team context for Phase 2. `All Teams` is a valid list context; permission-specific create/edit behavior for that context is deferred.
- A backlog work item can be assigned to an Iteration only when Project and Team match the Iteration context.
- Backlog list and Work Item Detail must expose the Work Item `Iteration` field.
- Iteration Status reads assigned work items from the same backlog/work item source of truth. It must not keep a separate execution-only item store.
- `Add Item` on Iteration Status creates a new Story/Defect directly into the selected Iteration and the same item must also exist in Backlog.
- Existing backlog assignment is not done from the Iteration Status Add Item modal. It is handled through the Work Item `Iteration` field.

Business gap found and resolved in this update:

- Previous docs deferred existing backlog assignment. That would make Iteration Status unable to link with existing backlog work. Phase 2 now treats Iteration as a Work Item assignment field available from Backlog and Work Item Detail.

## 8. Deferred Items And Scope Boundaries

| Item | Status | Target phase/reason |
|---|---|---|
| Team Board | `FUTURE BACKLOG` | Optional future board view; not part of current Agile management MVP |
| Team Status | `DEFERRED` | Phase 3 Track reporting/status |
| Board drag/drop status transition | `FUTURE BACKLOG` | Optional future board behavior; transition rules/WIP limits not needed for current MVP |
| Release CRUD/detail/readiness | `DEFERRED` | Phase 3 Release Management |
| Milestones | `DEFERRED` | Phase 3 delivery checkpoint |
| Dedicated Start/Close/carry-over workflow | `NOT REQUIRED` | Confirmed baseline uses manual Iteration status changes and manual Story/Defect movement between Iterations |
| Saved views | `DEFERRED` | Can follow after filter/list contract is stable |

## 9. Suggested Execution Order

```text
P2-BL-01..09

P2-IT-01 Contract
-> P2-IT-02 DB mapping/migration decision
-> P2-IT-03 List API
-> P2-IT-04 Create API
-> P2-IT-05 Detail API
-> P2-IT-06 FE list
-> P2-IT-07 FE quick create
-> P2-IT-08 FE detail
-> P2-IT-09 Permission/error states
-> P2-IT-10 Expose iteration assignment options
-> P2-IT-11 FE consumes iteration assignment options in Backlog/Detail
-> P2-IT-12 Verification

P2-IS-01 Contract
-> P2-IS-02 Iteration selector source
-> P2-IS-03 Metrics
-> P2-IS-04 List API
-> P2-IS-05 Inline update API
-> P2-IS-06 Create in Iteration API
-> P2-IS-07 FE route/header
-> P2-IS-08 FE metrics strip
-> P2-IS-09 FE enhanced list
-> P2-IS-10 FE inline editing
-> P2-IS-11 FE Add Item modal/detail flow
-> P2-IS-12 Work Item Detail right-panel Iteration field
-> P2-IS-13 Verification
```

Team Status and Team Board are intentionally not included in Phase 2 execution order. Team Status is Phase 3; Team Board is Backlog for the future.

## 10. Acceptance Checklist - P2.2

- [ ] User can open `Plan > Timeboxes`.
- [ ] Timeboxes defaults to `Iterations`.
- [ ] Timeboxes respects the active workspace selector Project/Team context.
- [ ] Iterations list shows Name, Theme, Start Date, End Date, Project, Planned Velocity, Task Estimate, State.
- [ ] Iterations list only shows records for the selected Project/Team.
- [ ] User can search Iterations.
- [ ] User can filter Iterations by State.
- [ ] User can sort Iteration list columns.
- [ ] `Create Iteration` opens quick create modal.
- [ ] Quick create modal includes Project, Team, Name, Start Date, End Date, State.
- [ ] Quick create auto-fills Project and Team from workspace selector context.
- [ ] Workspace Admin can override Project/Team when enabled, but Team must belong to Project.
- [ ] Name, Start Date, End Date and State are required.
- [ ] `Create with details` opens full-page detail.
- [ ] Clicking an existing row opens full-page detail.
- [ ] Detail page left side has Theme and Notes.
- [ ] Detail page right panel has Project, Team, Start Date, End Date, State, Planned Velocity.
- [ ] Detail page does not duplicate Project/Team in top context bar or subtitle.
- [ ] Existing row detail preloads Theme, dates, State and Planned Velocity.
- [ ] User can assign existing Backlog Story/Defect items to an Iteration from Backlog list or Work Item Detail.
- [ ] System rejects assignment when work item Project/Team does not match Iteration Project/Team.
- [ ] User can unassign an item from an Iteration without deleting the Backlog item.
- [ ] Assigned items appear in Iteration Status for the selected Iteration.
- [ ] Viewer cannot create, edit or assign iterations.
- [ ] Releases and Milestones are not implemented in P2.2.

## 11. Acceptance Checklist - P2.3

- [ ] User can open `Track > Iteration Status`.
- [ ] Phase 2 only implements Iteration Status under Track.
- [ ] Iteration Status respects the active workspace selector Project/Team context.
- [ ] Team Board and Team Status are not Phase 2 development scope.
- [ ] Page title is `Iteration`.
- [ ] Saved Views is not displayed.
- [ ] Top Project/Release/Iteration/Team context filter bar is not displayed.
- [ ] Iteration selector combines Iteration name and date range in one control.
- [ ] Iteration selector options come from Timeboxes Iteration records.
- [ ] Iteration selector shows Iterations in the selected Project/Team context, including valid `All Teams` behavior.
- [ ] Changing Iteration refreshes metrics and list.
- [ ] Metric strip shows Planned Velocity, Iteration End, Accepted, Defects and Tasks.
- [ ] Defects metric counts work items of type Defect in selected Iteration.
- [ ] Work item list shows selected Iteration items only.
- [ ] Work item list is sourced from Backlog/work_items assignment, not a separate store.
- [ ] Per-row Defects column is not displayed.
- [ ] Work item list shows Iteration column.
- [ ] Quick search and Manage Filters behave like Backlog Enhancement.
- [ ] Sort, resize, pagination and inline edit behave like Backlog Enhancement, including Iteration field.
- [ ] Schedule State values are Idea, Defined, In-Progress, Completed, Accepted, Release.
- [ ] Row click opens full Work Item Detail.
- [ ] Work Item Detail right panel shows Iteration field.
- [ ] Add Item button is beside filter controls.
- [ ] Quick Create and bottom Add work item row are not displayed.
- [ ] Add Item modal supports only Story and Defect.
- [ ] Add Item modal does not show Schedule State or Choose Existing Backlog Item.
- [ ] Create Item creates a Story/Defect directly in the selected Iteration and also available in Backlog.
- [ ] Create Item auto-fills Project and Team from the active workspace selector and selected Iteration.
- [ ] Create with details opens full Work Item Detail using Backlog flow.

## 12. Risk & Decision Log

| ID | Risk/Decision | Impact | Mitigation | Owner | Status |
|---|---|---|---|---|---|
| P2-IT-R01 | DB currently calls entity `sprints`, UI calls it `Iterations` | Medium | Use `planning.sprints` backend table with `Iteration` UI/API naming or document alias clearly | BA/Tech | Open |
| P2-IT-R02 | Theme, Notes, Planned Velocity may need DB extension | High | Decide migration before FE integration | Tech Lead | Open |
| P2-IT-R03 | Iteration state labels differ from DB states | Medium | Map Planning/Committed/Accepted to future/active/closed or store UI enum | Dev | Open |
| P2-IT-R04 | Releases/Milestones visible as type options may confuse scope | Low | Hide Release/Milestone type options in Phase 2; restore them in Phase 3 | BA | Decided |
| P2-IT-R05 | Date overlap policy not fully decided | Medium | Default warn-only unless same-team overlap must be blocked later | BA/PO | Open |
| P2-IT-R06 | Existing backlog assignment is required for Iteration Status to link with Backlog | High | Keep assignment as Work Item `iterationId` field in Backlog/Detail and test before P2.3 | BA/Dev | Decided |
| P2-IS-R01 | Iteration Status Schedule State differs from Backlog sample statuses | Medium | Use P2.3 enum Idea/Defined/In-Progress/Completed/Accepted/Release and map legacy values explicitly | BA/Dev | Decided |
| P2-IS-R02 | Defects metric can be misread as child defect count | Medium | SRS defines Defects as count of work items where type = Defect in selected Iteration | BA | Decided |
| P2-IS-R03 | Permission matrix is not finalized | Medium | Mock assumes admin; backend must still enforce baseline project/work item permissions | BA/Tech | Open |
| P2-PHASE-R01 | Dev agent may still pick up old Team Board mockup | High | Move Team Status docs to Phase 3, Team Board docs to Future Backlog, and remove Phase 2 execution tasks | BA | Decided |
| P2-CONTEXT-R01 | Workspace selector context could be missed by individual feature teams | High | Document as global Phase 2 rule and include tests for Backlog, Timeboxes and Iteration Status | BA/Dev | Decided |

## 13. Daily Log

| Date | Time spent | Tasks | Result | Blocker | Next action |
|---|---:|---|---|---|---|
| YYYY-MM-DD | 0h | - | - | - | - |

## 14. Change Log

| Date | Change | Reason |
|---|---|---|
| 2026-06-24 | Created Phase 2 tracking for P2.1 Backlog Enhancement | Prepare Phase 2 part 1 |
| 2026-06-25 | Added BA decisions for P2.1 Backlog Enhancement | Lock Backlog mockup scope |
| 2026-06-26 | Added P2.2 Iteration Management tracking and tasks | Prepare Iterations for development |
| 2026-06-26 | Marked Releases and Milestones as Phase 3 scope | BA decision |
| 2026-06-27 | Added P2.3 Iteration Status SRS, task plan and acceptance checklist | Prepare Iteration Status for development |
| 2026-07-12 | Moved Team Status to Phase 3 and Team Board to Future Backlog | Phase 2 focuses Iteration Status linked with Backlog |
| 2026-06-28 | Added existing Backlog-to-Iteration assignment into P2.2 | Close business gap for Iteration Status source data |
| 2026-06-28 | Added global workspace selector Project/Team context rules | Ensure Backlog, Iterations and Iteration Status filter and create records under the selected Project/Team |
| 2026-07-12 | Reconciled Phase 2 tracking status with prod audit conclusion | BA/SRS is ready; Rally prod is in review/gap fixing, not not-started |
| 2026-07-12 | Added All Teams, hidden Release/Milestone type options and rank/LexoRank rules | Resolve Phase 2 documentation mismatches found in audit |

## 15. Reference Documents

- [`01_Backlog_Enhancement/SRS.md`](01_Backlog_Enhancement/SRS.md)
- [`02_Iterations/SRS.md`](02_Iterations/SRS.md)
- [`03_Iteration_Status/SRS.md`](03_Iteration_Status/SRS.md)
- [`PHASE2_MOCKUP_CHECKLIST.md`](PHASE2_MOCKUP_CHECKLIST.md)
- [`../Phase 3/01_Team_Status/SRS.md`](../Phase%203/01_Team_Status/SRS.md)
- [`../Future_Backlog/01_Team_Board.md`](../Future_Backlog/01_Team_Board.md)
- [`../Project_developement_plan.md`](../Project_developement_plan.md)
- [`../../01_DB design/mini_rally_database_design.md`](../../01_DB%20design/mini_rally_database_design.md)
- [`../../05_Architecture/DATABASE_SCHEMA.md`](../../05_Architecture/DATABASE_SCHEMA.md)
