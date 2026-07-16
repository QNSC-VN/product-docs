# Test Strategy - Phase 0, 1, 2, 3

## 1. Goal

This test pack ensures Mini Rally keeps moving in the correct business direction before expanding into future governance, reporting or optional board execution.

1. Phase 0 creates the usable foundation: login, session, fixed Company, Project context and basic Project CRUD.
2. Phase 1 creates the core work management layer: Project/Team/User, Backlog, Story/Defect, Detail, Task, Time, Content, Attachment and Activity.
3. Phase 2 connects Backlog with Agile execution: Project/Team context, Iteration assignment and Iteration Status.
4. Phase 3 adds delivery and quality execution views: Team Status, Release Management, Milestones and Quality/Defect.

## 2. Definition of "going in the right direction"

| Rule | Expected |
|---|---|
| Company model | Single-company MVP; no self-service Workspace create/switch on Phase 0 UI. |
| Context model | Top context follows Company -> Project -> Team; later-phase data must respect this context. |
| Project/Team | Team used in Backlog/Iteration/Team Status must belong to a valid Project. |
| Work item source of truth | Story/Defect/Task must not be duplicated between screens; Backlog, Iteration Status, Release, Milestone and Quality views read the same Work Item source. |
| Phase 1 backlog scope | Backlog shows Story and Defect; Task is a child of Work Item, not an independent backlog item. |
| Phase 2 scope | Phase 2 includes Backlog Enhancement, Timeboxes/Iterations and Iteration Status. |
| Iteration lifecycle | Iteration status is manual-first: `Planning -> Committed -> Accepted`; no scope lock and no dedicated carry-over workflow. |
| Task roll-up | Completing all child Tasks can auto-complete parent Story/Defect to `Completed`; partial completion must not auto-complete parent. |
| Manual override | Auto status changes are convenience behavior; authorized users can still manually change Work Item and Iteration status. |
| Phase 3 scope | Phase 3 includes Team Status, Release Management, Milestones and Quality/Defect. |
| Team Board scope | Team Board, board drag/drop, WIP limits and board transition rules are Future Backlog only. |
| Permission | UI hide/disable is UX only; backend must still enforce permission. |
| Audit | Important mutations should create activity/audit events according to each module's scope. |

## 3. Test levels

| Level | Used for | Note |
|---|---|---|
| BA smoke/UAT | Main UI flow, scope and visible expected behavior | Prefer PROD/UAT when BA can only test deployed environments. |
| Functional regression | CRUD, filter, sort, validation, permission | Run after every release/sprint. |
| API/contract | DTO, validation, auth guard, project/team isolation | Requires stable environment with DB/service access. |
| Security/basic negative | Auth, token, direct URL, unauthorized mutation | Does not replace pentest; covers obvious product risks. |
| Automation candidate | Stable flows with predictable data | Prioritize Auth, Project, Backlog, Iteration, Team Status and Defect happy paths. |

## 4. Test data baseline

| Data | Purpose |
|---|---|
| Workspace Admin | Login, create/update, full happy path. |
| Viewer/read-only user | Verify hide/disable UI and backend rejection. |
| At least 2 Projects | Verify context switch and project isolation. |
| At least 2 Teams under one Project | Verify team filter and valid team assignment. |
| Team linked to another Project | Verify invalid Project/Team pair is rejected. |
| Story and Defect | Verify type-specific behavior and shared Work Item source. |
| Story/Defect with multiple child Tasks | Verify Team Status roll-up and parent auto-complete rule. |
| Iteration with assigned items | Verify Iteration Status and Team Status. |
| Release with assigned Story/Defect | Verify Release Artifacts and one active Release assignment. |
| Milestone with Projects/Teams/Releases | Verify multi-scope milestone and artifact assignment. |
| Defect in Quality dashboard | Verify shared Backlog/Quality Defect behavior. |
| Empty Project/Team/Iteration/Release/Milestone | Verify empty states. |

## 5. Entry criteria

- Target environment URL is reachable.
- Test account credentials are valid and authorized.
- Seed data exists or BA has permission to create minimal data.
- Known out-of-scope items are confirmed before execution.
- Browser console/network can be inspected when needed.

## 6. Exit criteria

| Scope | Exit criteria |
|---|---|
| Phase 0 | Login/session/logout, fixed Company, no Workspace create/switch, Project create/list/search/basic validation pass. |
| Phase 1 | Manage Team/User, Backlog Story/Defect, Detail, Task, Time/Content/Attachment, Activity Log core scenarios pass. |
| Phase 2 | Project/Team context filters Backlog/Iterations/Iteration Status, Iteration assignment works, Iteration Status uses Backlog source of truth. |
| Phase 3 | Team Status task roll-up, Release artifacts, Milestone artifacts and Quality Defect core workflow pass. |
| Regression | No P0/P1 severity blocker in the main business journey. |

## 7. Risk-based priority

| Priority | Area | Why |
|---|---|---|
| P0 | Auth/session and direct protected URL | Blocks all use. |
| P0 | Project/Team context isolation | Wrong data visibility breaks product trust. |
| P0 | Create Project/Team/Work Item/Iteration happy path | Core business objects must be usable. |
| P0 | Assignment Story/Defect -> Iteration -> Iteration Status | Main Phase 2 value chain. |
| P0 | Team Status task roll-up and manual override | Wrong status propagation can corrupt Agile progress. |
| P0 | Release/Milestone artifact identity | Release/Milestone must not clone or mutate Work Item identity unexpectedly. |
| P0 | Defect create/edit/state flow | Quality workflow is a core Phase 3 business slice. |
| P1 | Search/filter/sort/pagination/resize | Important daily usage and regression risk. |
| P1 | Permission/read-only behavior | Important, while detailed permission matrix may still evolve. |
| P2 | Advanced empty/error/loading states | Required for quality, less likely to block BA happy path. |

## 8. Out-of-scope boundaries

- Phase 0: Workspace self-service CRUD/switching is not required for single-company MVP.
- Phase 1: Feature/Epic/Initiative, Kanban board, sprint planning drag/drop, advanced timesheet and full admin audit screen are deferred.
- Phase 2: Team Status, Release Management, Milestones and Quality/Defect are not required for Phase 2 acceptance.
- Phase 3: Team Board, board drag/drop, WIP limits, board transition rules, dedicated carry-over workflow, saved Team Status views, executable bulk actions and Defect reopen are not required unless BA later re-prioritizes them.
