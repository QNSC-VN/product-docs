# Rally Test Execution - 2026-07-07

Scope: BA/FE mockup verification for Rally against `D:\Mini_Rally_pj\testing` and the current alignment file `D:\Mini_Rally_pj\output\RALLY_MINI_RALLY_ALIGNMENT_GAP.md`.

## Source Documents

- `D:\Mini_Rally_pj\testing\README.md`
- `D:\Mini_Rally_pj\testing\PHASE0_TEST_SCENARIOS.md`
- `D:\Mini_Rally_pj\testing\PHASE1_TEST_SCENARIOS.md`
- `D:\Mini_Rally_pj\testing\PHASE2_TEST_SCENARIOS.md`
- `D:\Mini_Rally_pj\testing\TEST_STRATEGY.md`
- `D:\Mini_Rally_pj\testing\E2E_BUSINESS_FLOW_COVERAGE.md`
- `D:\Mini_Rally_pj\testing\TRACEABILITY_MATRIX.md`

## Environment

- Rally FE: `http://localhost:5173`
- Rally API: `http://localhost:3000`
- Seed accounts used:
  - Admin: `admin@acme.dev`
  - Viewer: `viewer@acme.dev`
- Seed/reset status:
  - Docker services healthy.
  - `pnpm db:migrate` passed.
  - `pnpm db:seed` passed.
- Browser tests were run in the in-app browser for visible BA review.

## Automated Checks

| Check | Result | Note |
| --- | --- | --- |
| `pnpm test` | Pass | 8 test files, 156 tests. |
| `pnpm lint` | Pass | Repo lint completed. |
| `pnpm build` | Pass | Repo build completed. |
| `pnpm --filter rally-web typecheck` | Pass | FE typecheck completed. |
| `pnpm --filter rally-web build` | Pass | FE build completed. |
| `pnpm test:e2e` | Pass with no coverage | Command exits 0 but no E2E spec files were found. |
| `pnpm typecheck` | Fail | Root typecheck scans FE/TSX under backend tsconfig and also reports an iteration service spec mock type gap. Dev follow-up. |
| `pnpm --filter rally-web test` | Fail | `jsdom` missing and no FE unit test files found. Dev follow-up. |
| `pnpm --filter rally-web test:e2e` | Fail | Playwright Chromium is not installed locally. Dev follow-up: install browser runtime. |

## Browser / BA Flow Results

| Area | Result | Evidence |
| --- | --- | --- |
| Login as Admin | Pass | Admin login lands on Home with Rally app shell, project context and metrics. |
| Phase 0 shell/navigation | Pass | Home, Plan, Track, Quality/Portfolio/Releases/Reports placeholders and context dropdown are visible. |
| Manage Projects | Pass | Projects tab shows `Mockup_` data, Create Project, and Rally branding. |
| Manage Teams | Pass | Teams tab shows Create Team, team/project/status/lead columns, and Create Team modal with Info/Members tabs. |
| Manage Users | Pass | Users tab shows Invite User, `Mockup_` users, workspace role/status/team data and Invite modal with Teams tab. |
| Backlog base list | Pass | Backlog loads under `NXP - All Teams`; Story/Defect rows are shown; Task rows are not shown as independent backlog items. |
| Backlog create Story | Pass | Created `Mockup_UI Story from BA smoke`; item appears in Backlog. |
| Backlog bulk controls | Pass | Selecting rows shows selection bar and bulk Release/Iteration controls for Admin. |
| Timeboxes list | Pass | Columns include Name, Theme, Start Date, End Date, Project, Planned Velocity, Task Estimate, State. |
| Timebox create iteration | Pass | Created `Mockup_UI Iteration BA Smoke`; item appears in Timeboxes. |
| Iteration Status page scope | Pass | Title is `Iteration`; Team Status is outside Phase 2 and Team Board is Future Backlog; metrics strip is visible. |
| Iteration Status filter panel | Pass | `Manage filters` panel opens. |
| Iteration Status Add Item modal | Pass | Modal supports Story/Defect only and has no Choose Existing Backlog Item control. |
| Iteration Status Add Item into mockup iteration | Pass | Created `NXP-21`; item appears in selected Iteration Status and also in Backlog as the same Work Item source. |
| Iteration Status Create with details | Pass | Created `NXP-22`; app opened Work Item Detail at `/item/NXP-22` with Iteration field available. |
| Work Item Detail content persistence | Pass | Description content persisted after save and refresh. |
| Rich text sanitization | Pass | Unsafe HTML/script text did not execute; script/img handler nodes were not rendered. |
| Task add under Story | Pass with gap | Created child task `NXP-23`; Estimate total updated to 4h. Owner selected in modal did not display in row. |
| Task Detail | Pass | Task opens at `/item/NXP-23` with Details and Revision History only; no Tasks tab. |
| Viewer Backlog read-only | Pass | Create Work Item disabled with permission tooltip; reorder disabled; bulk assign hidden after row selection. |
| Viewer Iteration Status read-only | Pass | Add Item hidden; reorder disabled; only paging select remains editable. |
| Viewer Work Item Detail read-only | Pass | Detail fields disabled and page shows read-only access message. |

## Gaps / Follow-Up

| Gap | Severity | Detail |
| --- | --- | --- |
| Iteration Status required columns | Medium | Mini_Rally_pj expects checkbox, Rank, ID, Type, Name, Schedule State, Iteration, Blocked, Plan Est, Task Est, To Do, Owner. Current UI uses `#` instead of `Rank` and does not expose a separate Type column header in the same way. |
| Add Item on seed `Sprint 25.4` | Medium | Creating directly into seed Sprint 25.4 showed `Team is not linked to this project`. Creating into `Mockup_UI Iteration BA Smoke` passes. Dev should verify seed team/project linkage. |
| Task table columns | Medium | Phase 1 expects Rank, ID, Name, State, Owner, Project, Teams, To Do, Actuals, Estimate. Current visible task table shows ID, Name, State, Owner, To Do, Actuals, Estimate. |
| Task owner persistence/display | Medium | Add Task modal accepted Admin User as owner, but task row displayed owner as `-`. |
| Task Revision History | Medium | New task `NXP-23` Revision History shows `No activity recorded yet`; Phase 1 expects task create/update events. |
| Attachment upload/download/delete | Blocked | In-app browser automation cannot select a native file for upload because the available browser API does not expose file chooser/setInputFiles. Not counted as app pass/fail. |
| Password reset token reuse/expiry | Not Run | Forgot-password neutral response was API-smoked earlier, but reset token reuse/expiry was not fully exercised in UI. |
| FE unit/E2E automation | Tooling Gap | FE unit tests need `jsdom`; FE E2E needs Playwright browser installation and actual E2E specs. |

## Conclusion

Rally does not pass the entire Mini_Rally_pj testing pack yet, but the BA-facing FE mockup coverage for Phase 0, Phase 1 and Phase 2 is mostly aligned and observable in the browser.

The remaining BA/FE gaps are concentrated in Iteration Status column naming/shape, Task table shape, Task owner/activity behavior, seed iteration team linkage, and attachment testing/tooling. Permission/read-only behavior for Viewer is now verified and passes on Backlog, Iteration Status and Work Item Detail.
