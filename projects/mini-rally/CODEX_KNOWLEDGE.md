# Codex Knowledge - Mini_Rally_pj

Last updated: 2026-07-10

Use this file as the first handoff note when opening this local project from a new Codex/OpenAI account.

## Project role

`D:\Mini_Rally_pj` is the documentation, BA, mockup, SRS, architecture, and testing source of truth for Mini Rally.

`D:\QNSC\Workspace\rally` is the production codebase. Keep this distinction clear: when the user asks for doc-first work, finish the document artifact and stop for the next instruction before jumping into implementation.

## Current local state

- Current branch during handoff: `Hieu_codex/phase-3-1-3-2`
- Tracking branch during handoff: `hieu-fork/Hieu_codex/phase-3-1-3-2`
- Current HEAD during handoff: `74552351 docs: add phase 3 team status and release planning`
- Remotes:
  - `origin`: `https://github.com/hieuvbm2404/Mini_Rally_pj.git`
  - `hieu-fork`: `https://github.com/hieu-vubuiminh/Mini_Rally_pj.git`
- Git status during handoff included modified and untracked docs:
  - modified Phase 2 SRS/checklist files under `04_Developement_tracking/Phase 2`
  - untracked `04_Developement_tracking/Phase 3/03_Milestones/`
  - untracked `Time line.md`
  - untracked `output/`, `outputs/`, `testing/`

Before doing any work, run:

```powershell
git status --short --branch
git remote -v
git log --oneline --decorate -3
```

Do not assume the tree is clean. Preserve existing user/doc changes unless the user explicitly asks to clean them.

## Main folders

- `00_Documents`: project overview, use case/role mapping, UI business review, screen traceability, ERD.
- `01_DB design`: database design.
- `02_Prompt UI`: UI prompt history.
- `03_Mockup Design`: runnable Vite/React mockup bundle.
- `04_Developement_tracking`: phase-by-phase BA/SRS/mockup/development tracking.
- `05_Architecture`: architecture, production readiness, FE/BE structure, database schema, CI/CD.
- `testing`: BA/UAT/regression testing pack for Phase 0, Phase 1, Phase 2.
- `output`: Rally-vs-Mini-Rally alignment and runtime verification outputs.
- `outputs`: additional generated deliverables.

## Read these first

For project/product context:

- `Time line.md`
- `00_Documents\mini_rally_project_overview.md`
- `00_Documents\mini_rally_usecase_role_mapping.md`
- `00_Documents\mini_rally_screen_traceability.md`
- `04_Developement_tracking\Project_developement_plan.md`

For Rally production alignment:

- `output\RALLY_MINI_RALLY_ALIGNMENT_GAP.md`
- `output\RALLY_TEST_EXECUTION_2026-07-07.md`

For testing:

- `testing\README.md`
- `testing\TEST_STRATEGY.md`
- `testing\E2E_BUSINESS_FLOW_COVERAGE.md`
- `testing\TRACEABILITY_MATRIX.md`
- `testing\PHASE0_TEST_SCENARIOS.md`
- `testing\PHASE1_TEST_SCENARIOS.md`
- `testing\PHASE2_TEST_SCENARIOS.md`

## Phase scope memory

Phase 0:

- Foundation baseline.
- Auth, App Shell, fixed Company/Workspace, Project.
- Single-company MVP; no self-service Workspace create/switch UI.

Phase 1:

- Core Work Management.
- Backlog base, Story/Defect create, Work Item Detail, Tasks, Time Tracking, Content/Attachments, Activity Log.
- Manage Projects/Teams/Users belongs in Phase 1.
- Task is a child of Work Item, not an independent Backlog entity.

Phase 2:

- Agile Execution.
- Backlog Enhancement, Timeboxes/Iterations, Iteration Status.
- `Project -> Team -> Backlog -> Iteration assignment -> Iteration Status` is the core chain.
- `All Teams` is a valid Phase 2 context.
- Team Status, Release Management, and Milestones are not Phase 2.
- Team Board is not part of the current planned Agile MVP; preserve it under Future Backlog only.

Phase 3:

- Current BA/dev handoff area.
- Team Status, Release Management, Milestones, Quality/Defect.
- Team Board is Future Backlog and must not be treated as Phase 3 scope.

## Mockup app

The runnable mockup is under:

```powershell
cd "D:\Mini_Rally_pj\03_Mockup Design"
npm install
npm run dev
```

This is a Vite app generated from a design-system/mockup bundle. Use it for visual and BA behavior reference, not as production source code.

## Testing pack shape

The `testing` folder was intentionally created as a dedicated BA/UAT/regression workspace:

- `README.md`: testing pack overview.
- `TEST_STRATEGY.md`: scope, principles, entry/exit criteria.
- `PHASE0_TEST_SCENARIOS.md`: Foundation scenarios.
- `PHASE1_TEST_SCENARIOS.md`: Core Work Management scenarios.
- `PHASE2_TEST_SCENARIOS.md`: Agile Execution scenarios.
- `E2E_BUSINESS_FLOW_COVERAGE.md`: cross-phase business journeys.
- `TRACEABILITY_MATRIX.md`: phase/module/doc/test/out-of-scope mapping.

The main E2E chain:

```text
Login
-> Fixed Company context
-> Manage Project / Team / User
-> Select Project / Team context
-> Create and manage Backlog Story/Defect
-> Update Work Item detail, tasks, time, content, attachments and activity
-> Create Iteration for selected Project/Team
-> Assign Backlog item to Iteration
-> Track assigned items in Iteration Status
```

## Working style for this project

- For doc tasks, produce the requested markdown file first and stop for the next instruction.
- For BA alignment, prefer phase-split docs and explicit scope boundaries.
- If business rules are unclear, ask the user instead of inventing behavior.
- When documenting UI/runtime behavior, reopen and smoke-test the target app first if feasible.
- Keep `Mini_Rally_pj` as the documentation source of truth and `Rally` as production.
