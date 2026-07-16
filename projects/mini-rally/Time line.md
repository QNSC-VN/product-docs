# Mini Rally - Timeline & Progress Tracker

Updated: 2026-07-12
Owner view: BA / Product tracking

## 1. Current BA Conclusion

| Area | Current status | Meaning |
|---|---|---|
| Phase 0 | Completed / foundation baseline | App Shell, Auth, Workspace/Company and Project foundation are accepted in the existing tracking set. |
| Phase 1 | BA/SRS ready | Core Work Management is documented: Backlog, create/detail, Tasks, time/content/activity and Manage Projects/Teams/Users. |
| Phase 2 | BA/SRS ready; prod in review/gap fixing | Backlog Enhancement, Timeboxes/Iterations and Iteration Status are closed for BA handoff. |
| Phase 3 | Docs ready; dev in progress per BA context | Team Status, Release Management, Milestones and Quality/Defect are ready for development handoff. |
| Team Board | Backlog for the future | Not required for the main Agile management MVP. Preserve as optional future board view only. |
| Phase 4 | Future Collaboration & Governance | Notifications, RBAC/permissions, settings/governance and audit-style capabilities. |
| Phase 5 | Future Reporting | Dashboards, burndown/velocity/workload, release progress and exports. |

Current core Agile flow:

```text
Project/Team context
-> Backlog
-> Timeboxes / Iterations
-> Iteration Status
-> Team Status
-> Release / Milestone / Quality tracking
```

Team Board is intentionally outside the current core flow.

## 2. Master Timeline

| Order | Phase | Business theme | Main scope | BA/mockup status | Docs status | Production/dev status | Decision |
|---:|---|---|---|---|---|---|---|
| 1 | Phase 0 | Foundation | App Shell, Auth, Workspace/Company, Project, Project/Team context | Accepted | Complete | Complete in tracking baseline | Keep as foundation baseline. |
| 2 | Phase 1 | Core Work Management | Backlog base, Story/Defect create, Work Item Detail, Tasks, Time Tracking, Content/Attachments, Activity Log, Manage Projects/Teams/Users | Ready | Ready | Ready for dev planning / implementation check | Keep as prerequisite for Phase 2+. |
| 3 | Phase 2.1 | Backlog Enhancement | Search, Manage Filters, sort, inline edit, Release/Iteration assignment, rank reorder, Project/Team context | Done | Ready | In review / gap fixing in Rally prod | Closed for BA handoff. |
| 4 | Phase 2.2 | Timeboxes / Iterations | Iteration list, create, detail, Theme/Notes, Project/Team, assignment options for Backlog | Done | Ready | In review / gap fixing in Rally prod | Closed for BA handoff. |
| 5 | Phase 2.3 | Iteration Status | Iteration selector, metrics, list from Backlog assignment, Add Item, inline edit, Project/Team context | Done | Ready | In review / gap fixing in Rally prod | Closed for BA handoff. |
| 6 | Phase 3.1 | Team Status | Dense member/task status table, capacity edit, Task inline edit, parent US/DE roll-up | Approved | Ready | Dev in progress per BA context | Current Phase 3 execution baseline. |
| 7 | Phase 3.2 | Release Management | Timeboxes Release type, release dashboard/detail, release notes/artifacts, user-managed readiness | Approved | Ready | Dev in progress per BA context | Phase 3 scope. |
| 8 | Phase 3.3 | Milestones | Timeboxes Milestone type, projects/teams/releases linking, artifacts as US/DE | Approved | Ready | Dev in progress per BA context | Phase 3 scope. |
| 9 | Phase 3.4 | Quality / Defect | Dedicated Quality > Defect dashboard, create/edit/detail, core state flow, Fixed In Build | Approved | Ready | Dev in progress per BA context | Phase 3 scope. |
| 10 | Phase 4 | Collaboration & Governance | Notifications, permissions/RBAC, settings, audit/governance | Future | Pending | Not started | Define after Phase 3. |
| 11 | Phase 5 | Reporting | Dashboard, burndown, velocity, workload, release progress, exports | Future | Pending | Not started | Define after core execution data is stable. |
| 12 | Future Backlog | Optional Team Board | Board view, drag/drop, WIP limits, transition rules | Preserved only | Future backlog note | Not planned | Do not implement unless BA re-prioritizes. |

## 3. Phase 2 Closure Summary

| Requirement group | Closure result |
|---|---|
| Backlog Enhancement | Closed. Backlog keeps Story/Defect focus and adds advanced list behaviors plus Iteration assignment. |
| Iteration Management | Closed. `Plan > Timeboxes` implements Iterations only for Phase 2; Releases and Milestones return in Phase 3. |
| Iteration lifecycle | Closed. Iteration status is manual-first: `Planning -> Committed -> Accepted`; system auto-accepts only when all assigned US/DE are Accepted. |
| Iteration Status | Closed. `Track > Iteration Status` reads from Timeboxes Iterations and Backlog/work_items. |
| Data chain | Closed. `Project -> Team -> Backlog -> Iteration assignment -> Iteration Status`. |
| Workspace selector | Closed. Project/Team context filters records and defaults create forms. |
| Out-of-scope guardrail | Closed. Team Status is Phase 3; Team Board/board drag-drop/WIP are Future Backlog. |

BA sign-off statement for Phase 2:

```text
Phase 2 is complete for mockup/SRS handoff.
Production implementation continues as review/gap fixing against Rally prod.
Team Board must not be implemented in current planned phases unless BA re-prioritizes it.
```

## 4. Phase 3 Current Scope

| Slice | Status | Scope note |
|---|---|---|
| P3.1 Team Status | Ready / dev handoff | Dashboard/table grouped by member; not a board. |
| P3.2 Release Management | Ready / dev handoff | Project-level Release under Timeboxes; readiness is user-managed. |
| P3.3 Milestones | Ready / dev handoff | Milestone is a planning checkpoint with Projects/Teams/Releases and US/DE artifacts. |
| P3.4 Quality / Defect | Ready / dev handoff | Defect dashboard/detail/create/edit and confirmed core state flow. |

Phase 3 does not include:

- Team Board.
- Board drag/drop.
- WIP limits.
- Board transition rules.
- Dedicated carry-over workflow.

## 5. Future Backlog

| Backlog item | Status | Why it is future |
|---|---|---|
| Team Board | Optional future | Main Agile management can work through Backlog, Iterations, Iteration Status and Team Status without a board. |
| Board drag/drop | Optional future | Requires transition rules and permission behavior not needed for MVP. |
| WIP limits | Optional future | Requires team-level policy/configuration; not required for current flow. |
| Board transition validation | Optional future | Only needed if drag/drop board is reintroduced. |
| Saved Team Status views | Optional future | Nice-to-have after Team Status usage stabilizes. |
| Defect reopen from Closed/Closed Declined | Optional future | Needs permission, reason and audit rules. |

Reference:

- `04_Developement_tracking/Future_Backlog/01_Team_Board.md`

## 6. Recommended Next Steps

| Order | Workstream | Target output | Status |
|---:|---|---|---|
| 1 | Keep Phase 3 dev aligned | Use Phase 3 SRS/checklists as the dev baseline | Current |
| 2 | Validate Phase 3 implementation against docs | Smoke test Team Status, Release, Milestone and Defect flows as they land | Next |
| 3 | Define Phase 4 only after Phase 3 stabilizes | Notifications, permissions/RBAC, settings and audit/governance | Future |
| 4 | Revisit Team Board only if users need board execution | Promote from Future Backlog into a planned phase only after BA decision | Future optional |

## 7. Source Documents

- `04_Developement_tracking/Project_developement_plan.md`
- `04_Developement_tracking/Phase 2/PHASE2_MOCKUP_CHECKLIST.md`
- `04_Developement_tracking/Phase 2/PHASE2_DEVELOPMENT_TRACKING.md`
- `04_Developement_tracking/Phase 3/PHASE3_MOCKUP_CHECKLIST.md`
- `04_Developement_tracking/Phase 3/PHASE3_DEVELOPMENT_TRACKING.md`
- `04_Developement_tracking/Phase 3/01_Team_Status/SRS.md`
- `04_Developement_tracking/Phase 3/02_Release_Management/SRS.md`
- `04_Developement_tracking/Phase 3/03_Milestones/SRS.md`
- `04_Developement_tracking/Phase 3/04_Quality_Defect/SRS.md`
- `04_Developement_tracking/Future_Backlog/01_Team_Board.md`
