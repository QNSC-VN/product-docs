# Phase 3 - Development Tracking

## 1. Tracking Information

| Attribute | Value |
|---|---|
| Phase | Phase 3 - Team Status, Release Management, Milestones, Quality/Defect |
| Current delivery slice | Phase 3 documentation handoff |
| Company scope | Single-company: `ACME Space Inc.` |
| Overall status | `P3.1 READY; P3.2 READY; P3.3 READY; P3.4 READY` |
| P3.1 Mockup | Approved |
| P3.1 SRS | Ready for Development |
| Production implementation | Dev in progress per BA context; use this tracking file as documentation handoff baseline |
| Last updated | 2026-07-12 |

BA decisions:

- P3.1 Team Status is approved as a dense dashboard/table grouped by member.
- Team Board moves to Backlog for the future.
- Team Board is absent from active navigation and retained only in Future Backlog; it is not part of P3.1.
- P3.2 Release Management Timeboxes dashboard behavior is documented: inline edit, resizable columns and locked create modal type.
- P3.2 Release readiness is user-managed from linked US/DE release notes; no system readiness calculation is required in P3.2.
- P3.3 Milestones can span multiple projects, multiple teams and multiple releases; readiness checklist is not required.
- P3.3 Milestone dashboard shows only Name, Target Start Date, Target End Date and Status.
- P3.3 Milestone detail now uses compact input-like count controls for Projects/Teams/Releases with searchable selection modals.
- P3.3 Milestone Artifacts are assigned US/DE Story/Defect work items and are shown with the Backlog dashboard presentation.
- P3.4 Quality/Defect has a dedicated `Quality > Defect` dashboard. Dashboard columns, field option sets, create/edit behavior and core state transitions are confirmed.
- P3.4 Fixed In Build is an optional manual text field for the build/version/release label where the defect fix is expected or delivered.
- Team Status parent roll-up rule, revised by BA on 2026-07-19: one completed Task must not auto-complete its parent while other child Tasks are still not Completed; all child Tasks Completed auto-completes the parent; reopening a Task from that state recalculates metrics and auto-moves the parent to In-Progress. Authorized users can still manually change parent status afterward.
- Work Item Detail `Tasks` tab is the Task Dashboard for a parent Story/Defect and must support inline edit for Task Name, State, Owner, To Do, Actuals and Estimate.
- Timeline file is updated for Phase 3 documentation closure and Future Backlog scope alignment.

## 2. Status Legend

| Status | Meaning |
|---|---|
| `NOT STARTED` | Production code not started |
| `READY` | BA/mockup/SRS are ready for development |
| `CORE READY` | Core scope is ready; explicitly deferred sub-scope remains outside handoff |
| `DASHBOARD READY` | Dashboard scope is ready; workflow actions are deferred |
| `IN PROGRESS` | Development in progress |
| `BLOCKED` | Cannot continue without dependency/decision |
| `IN REVIEW` | Code complete, under review/test |
| `DONE` | Code, tests and acceptance criteria passed |
| `DEFERRED` | Moved out of current phase/slice |
| `PENDING MOCKUP` | Needs mockup review before dev-ready SRS |

## 3. Progress Summary

| Group | Total tasks | Ready | Done | In Progress | Blocked | Not Started | Status |
|---|---:|---:|---:|---:|---:|---:|---|
| Team Status P3.1 | 12 | 12 | 0 | 0 | 0 | 12 | `READY` |
| Release Management P3.2 | 12 | 12 | 0 | 0 | 0 | 12 | `READY` |
| Milestones P3.3 | 10 | 10 | 0 | 0 | 0 | 10 | `READY` |
| Quality/Defect P3.4 | 10 | 10 | 0 | 0 | 0 | 10 | `READY` |

## 4. Development Task Plan - P3.1 Team Status

| ID | Module | Development task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P3-TS-01 | Contract | Define Team Status OpenAPI/DTO | Query response, capacity patch, task patch contracts | P2.3 | 1.0h | 0h | `NOT STARTED` |
| P3-TS-02 | Backend | Implement Team Status query | Groups by owner/member for selected Project/Team/Iteration | P3-TS-01 | 2.0h | 0h | `NOT STARTED` |
| P3-TS-03 | Backend | Implement member capacity persistence | Upsert capacity by Project/Team/Iteration/User | P3-TS-01 | 1.5h | 0h | `NOT STARTED` |
| P3-TS-04 | Backend | Implement task inline patch | Patch task title/state from Team Status | P3-TS-01 | 1.5h | 0h | `NOT STARTED` |
| P3-TS-05 | Backend | Refresh parent Work Product roll-up and status automation | Task state change recalculates progress; all Tasks Completed -> parent Completed; reopen -> parent In-Progress | P3-TS-04 | 1.0h | 0h | `NOT STARTED` |
| P3-TS-06 | Backend | Permission guards | Viewer read-only and edit permission enforcement | P3-TS-01 | 1.0h | 0h | `NOT STARTED` |
| P3-TS-07 | Frontend | Team Status route/page | `Track > Team Status` page shell | P3-TS-01 | 1.0h | 0h | `NOT STARTED` |
| P3-TS-08 | Frontend | Iteration selector reuse | Same picker behavior as Iteration Status | P3-TS-07 | 0.75h | 0h | `NOT STARTED` |
| P3-TS-09 | Frontend | Dense grouped table | Header, totals row, member rows, task rows | P3-TS-02 | 2.0h | 0h | `NOT STARTED` |
| P3-TS-10 | Frontend | Inline edit controls | Capacity, Task Name, State dropdown | P3-TS-03, P3-TS-04 | 1.5h | 0h | `NOT STARTED` |
| P3-TS-11 | Frontend | Task Dashboard inline edit | Work Item Detail Tasks tab supports inline Name, State, Owner, To Do, Actuals and Estimate | P3-TS-04 | 1.0h | 0h | `NOT STARTED` |
| P3-TS-12 | Frontend | Column resize behavior | Resizable Team Status columns | P3-TS-09 | 0.75h | 0h | `NOT STARTED` |
| P3-TS-13 | Verification | Team Status tests | API, permission, calculation, UI smoke tests | P3-TS-01..12 | 2.0h | 0h | `NOT STARTED` |

## 5. P3.1 Delivery Dependencies

| Dependency | Required behavior |
|---|---|
| Work Item / Task model | Must support task-level row identity and parent Work Product reference |
| Iteration model | Must expose Iterations filtered by Project/Team |
| Release relation | Must expose release name for task/work product row |
| Capacity storage | Must support per-member capacity for selected Iteration |
| Permissions | Must distinguish read from edit access |
| Existing detail flow | Row click should reuse Work Item Detail routing |

## 6. P3.1 Acceptance Checklist

- [ ] API returns Team Status groups for selected Project/Team/Iteration.
- [ ] API rejects Iteration from another Project/Team.
- [ ] API returns task IDs in task rows and parent US/DE in Work Product.
- [ ] API normalizes unsupported source states for Team Status display.
- [ ] Capacity PATCH persists valid values.
- [ ] Capacity PATCH rejects invalid negative values.
- [ ] Task PATCH persists title.
- [ ] Task PATCH accepts only Defined/In-Progress/Completed.
- [ ] Task Completed refreshes parent US/DE roll-up; parent stays unchanged if any child task is still not Completed.
- [ ] Completing the final open child Task auto-completes the parent US/DE.
- [ ] Reopening a Task from the all-completed state recalculates metrics and auto-moves parent US/DE to `In-Progress`.
- [ ] Parent US/DE status remains manually editable from existing Work Item edit surfaces after auto-completion.
- [ ] Viewer direct PATCH returns 403.
- [ ] Frontend page opens from Track menu.
- [ ] Frontend Iteration picker matches Iteration Status picker.
- [ ] Frontend table matches approved dense template.
- [ ] Frontend supports group collapse/expand.
- [ ] Frontend supports inline Capacity edit.
- [ ] Frontend supports inline Task Name edit.
- [ ] Frontend supports inline State edit.
- [ ] Work Item Detail Tasks tab supports inline edit for Task Name, State, Owner, To Do, Actuals and Estimate.
- [ ] Task Dashboard inline edit does not open Task Detail; clicking Task ID still opens Task Detail.
- [ ] Frontend supports column resizing.
- [ ] Row click opens detail; inline controls do not trigger detail.
- [ ] Empty result state is handled.

## 7. Development Task Plan - P3.2 Release Management

P3.2 Timeboxes dashboard mockup is approved. Current confirmed direction:

- Release Management is Project-level.
- Release lives under `Plan > Timeboxes > Releases`.
- Timeboxes dashboard supports inline edit and resizable columns.
- Create Release modal locks Type to Release.
- Release status values are `Planning`, `Active`, `Accepted`.
- Release detail needs Theme and Notes rich text areas.
- Right panel fields include Start Date, Release Date, Project, State, Planned Velocity, Plan Estimate, Task Roll-up, Accepted and Version.

| ID | Module | Development task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P3-REL-01 | Contract | Define Release DTO/OpenAPI | List/create/detail/update contracts | P2 work item model | TBD | 0h | `NOT STARTED` |
| P3-REL-02 | Backend | Implement Project-level Release model | Release fields and state enum | P3-REL-01 | TBD | 0h | `NOT STARTED` |
| P3-REL-03 | Backend | Release list query | Project-filtered list with sort/page/search | P3-REL-02 | TBD | 0h | `NOT STARTED` |
| P3-REL-04 | Backend | Inline update API | PATCH Name/Theme/dates/Project/velocity/estimate/state | P3-REL-02 | TBD | 0h | `NOT STARTED` |
| P3-REL-05 | Backend | Release detail query | Theme/Notes/right-panel fields | P3-REL-02 | TBD | 0h | `NOT STARTED` |
| P3-REL-06 | Frontend | Timeboxes Release dashboard | Inline editable/resizable list | P3-REL-01 | TBD | 0h | `NOT STARTED` |
| P3-REL-07 | Frontend | Create Release modal | Type locked to Release | P3-REL-01 | TBD | 0h | `NOT STARTED` |
| P3-REL-08 | Frontend | Release detail page | Theme/Notes/right-panel layout | P3-REL-05 | TBD | 0h | `NOT STARTED` |
| P3-REL-09 | Security | Permission guards | Viewer read-only and API 403 | P3-REL-01 | TBD | 0h | `NOT STARTED` |
| P3-REL-10 | Verification | Release dashboard tests | Inline edit/resize/type lock/state enum | P3-REL-01..09 | TBD | 0h | `NOT STARTED` |
| P3-REL-11 | Verification | Release detail tests | Detail fields and permissions | P3-REL-08 | TBD | 0h | `NOT STARTED` |
| P3-REL-12 | BA | Document readiness rule | User gathers readiness from linked US/DE release notes | BA | TBD | 0h | `READY` |
| P3-REL-13 | Frontend/Backend | Artifact reassignment UX | Moving a US/DE to another Release removes it from the previous Release artifact list, recalculates counts and shows a toast | P3-REL-01..08 | TBD | 0h | `READY` |

## 8. Development Task Plan - P3.3 Milestones

P3.3 core scope is ready for handoff. Current confirmed direction:

- Milestones live as a type beside Iterations/Releases/Milestones under Timeboxes.
- Milestones can span multiple Projects and multiple Teams.
- Milestones can link multiple Releases.
- With no linked Release, user manually sets Target Start/End Date.
- With one or more linked Releases, Target Start Date is derived from the earliest linked Release start date and Target End Date from the latest linked Release end/release date.
- Milestone Artifacts are assigned US/DE Story/Defect work items.
- Milestones do not include a readiness checklist.
- Milestone dashboard shows only Name, Target Start Date, Target End Date and Status.
- Milestone detail right panel keeps Projects/Teams/Releases compact as selected-count summaries; each opens a searchable selection modal.
- A dedicated Artifacts tab is reserved beside Details and shows assigned work items with the Backlog dashboard presentation.

| ID | Module | Development task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P3-MS-01 | Contract | Define Milestone DTO/OpenAPI | List/create/detail/update contracts with project/team/release relations | P2 Timeboxes, P3.2 Releases | TBD | 0h | `READY` |
| P3-MS-02 | Backend | Implement Milestone model | Multi-project, multi-team, multi-release fields | P3-MS-01 | TBD | 0h | `READY` |
| P3-MS-03 | Backend | Milestone list query | Timeboxes Milestone dashboard with Name/Target dates/Status | P3-MS-02 | TBD | 0h | `READY` |
| P3-MS-04 | Backend | Target date behavior | Manual dates without Release; earliest linked Release start and latest linked Release end when linked | P3-MS-02 | TBD | 0h | `READY` |
| P3-MS-05 | Backend | Milestone update API | Name, status, project/team/release relations and derived date recalculation | P3-MS-02 | TBD | 0h | `READY` |
| P3-MS-06 | Frontend | Milestone dashboard | Four-column Timeboxes table with resize support | P3-MS-03 | TBD | 0h | `READY` |
| P3-MS-07 | Frontend | Milestone detail | Details tab plus right metadata panel | P3-MS-05 | TBD | 0h | `READY` |
| P3-MS-08 | Frontend | Relation selection modals | Searchable Projects/Teams/Releases selection from compact count controls | P3-MS-05 | TBD | 0h | `READY` |
| P3-MS-09 | Security | Permission guards | Viewer read-only and mutation 403 | P3-MS-01 | TBD | 0h | `READY` |
| P3-MS-10 | Frontend/Backend | Milestone Artifacts | Assigned Story/Defect work item dashboard using Backlog presentation | P3-MS-01..08 | TBD | 0h | `READY` |
| P3-MS-11 | Frontend/Backend | Milestone assignment guardrails | Validate artifact project/team is in Milestone scope; removal leaves Release assignment unchanged | P3-MS-01..10 | TBD | 0h | `READY` |

## 9. Development Task Plan - P3.4 Quality/Defect

P3.4 has a dedicated `Quality > Defect` dashboard entry in the mockup. Confirmed dashboard columns: Rank, ID, Name, User Story, Severity, Priority, State, Flow State, Fixed In Build, Iteration, Submitted By and Owner.

Confirmed defect option sets:

- Severity: None, Critical, Major Problem, Minor Problem, Trivial.
- Priority: None, Urgent, High, Normal, Low.
- State: Submitted, Open, Fixed, Closed, Closed Declined.
- Flow State: Idea, Defined, In-Progress, Completed, Accepted, Release; it mirrors Schedule State two-way in MVP and defaults to Idea.

Create/edit behavior, core state transitions and Fixed In Build input behavior are confirmed.

| ID | Module | Development task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P3-QA-01 | Contract | Define Defect dashboard DTO/OpenAPI | Same Defect work items as Backlog with Quality dashboard fields | Phase 2 Backlog | TBD | 0h | `READY` |
| P3-QA-02 | Backend | Defect dashboard query | Search/sort/page data for confirmed columns | P3-QA-01 | TBD | 0h | `READY` |
| P3-QA-03 | Backend | Defect field option sets | Severity, Priority, State and Flow State enums | P3-QA-01 | TBD | 0h | `READY` |
| P3-QA-04 | Frontend | Quality > Defect route | Dedicated dashboard entry under Quality menu | App navigation | TBD | 0h | `READY` |
| P3-QA-05 | Frontend | Defect dashboard table | Backlog-style table with confirmed columns, resize/sort/page/search | P3-QA-02 | TBD | 0h | `READY` |
| P3-QA-06 | Frontend | Inline field controls | Severity/Priority/State/Flow State dropdowns and Owner edit | P3-QA-03 | TBD | 0h | `READY` |
| P3-QA-07 | Security/Verification | Defect permissions and tests | Viewer read-only, mutation 403, dashboard smoke tests | P3-QA-01..06 | TBD | 0h | `READY` |
| P3-QA-08 | Frontend/Backend | Defect create/edit flow | Create from Backlog and Quality, optional User Story, inline edit, shared detail page | P3-QA-01..06 | TBD | 0h | `READY` |
| P3-QA-09 | Backend | Defect state transitions | Submitted/Open/Fixed/Closed/Closed Declined transition validation; reopen is deferred unless permission is confirmed | P3-QA-03 | TBD | 0h | `READY` |
| P3-QA-10 | Frontend/Backend | Fixed In Build field | Optional manual text field on dashboard/detail | P3-QA-01..06 | TBD | 0h | `READY` |

## 10. Deferred Items And Scope Boundaries

| Item | Status | Target |
|---|---|---|
| Team Board | `FUTURE BACKLOG` | Optional future board view; not part of current MVP |
| Board drag/drop status transition | `FUTURE BACKLOG` | Optional future board behavior |
| WIP limits | `FUTURE BACKLOG` | Optional future board configuration |
| Saved Team Status views | `DEFERRED` | Future |
| Advanced charts/reports | `DEFERRED` | Reports phase |
| Permission model and bulk actions | `DEFERRED` | Future/after BA confirmation |
| Defect reopen from Closed/Closed Declined | `DEFERRED` | Future/after permission rule confirmation |

## 11. Deferred Follow-Ups

No open BA confirmation blocks Phase 3 documentation handoff.

Deferred follow-ups:

- Permission model and bulk actions are intentionally not considered yet.
- Defect reopen from `Closed` or `Closed Declined` is not required for Phase 3.4 implementation until BA confirms who can reopen and what audit/reason fields are required.
