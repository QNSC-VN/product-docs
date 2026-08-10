# P0-PRJ-02 — Create Project

## Audit scope

- Environment: `https://rally-dev.qnsc.vn/projects`
- Account: `hieuvbm@qnsc.vn`
- Audit date: 2026-07-19
- Mutation: created controlled Project `AUD719`
- Retention: keep the Project until P0-PRJ-03 Archive/Restore is completed

## Form comparison

DevInt and mockup both expose Project Name, Project Key, Owner, Start Date, Teams, Description, Cancel and Create.

DevInt additionally loads eligible Workspace users and Team Alpha/Team Beta from current data. The valid test selected Team Alpha and retained the current user as Owner.

## Validation execution

- Blank required fields keep Create disabled.
- DevInt accepted a one-character Project Name sufficiently to enable Create; no invalid Project was submitted.
- Key input uppercases, strips invalid punctuation and truncates at six characters.
- Key helper says `2–6 uppercase letters`, but digits are accepted.
- Duplicate key `NXP` was rejected with `Project key "NXP" is already taken` and the form remained open.
- SRS currently specifies immutable key length 2-10 with uppercase A-Z/0-9.

## Valid creation

Created:

- Key: `AUD719`
- Name: `DEVINT Audit Project 20260719`
- Owner: `Hieu Vu Minh Bui`
- Team: `Team Alpha`
- Description: `Controlled BA audit project for Phase 0 DevInt validation.`
- Status: Active

Observed:

- Success notification appeared.
- Total and Active Projects increased from 5 to 6.
- Linked Teams increased from 4 to 5.
- Search `AUD719` returned exactly the created row.
- Owner, description and Team count `1` were reflected.
- Edit dialog shows `Key: AUD719 · immutable`.

## Start Date coverage

This is the **Project Start Date** stored on the Project, not an Iteration, Release or Milestone date. It represents when work on the Project begins and appears in Create/Edit Project and the approved Project-list mapping.

Start Date rendered in Create and Edit. Automated entry was inconclusive: Create submitted without a date; Edit temporarily showed `2026-07-19` after fill, Save returned success, but reopening displayed blank. Because the native segmented date input could not be reliably controlled in this run, this is classified **NOT TESTED**, not a confirmed persistence defect.

## BA decisions requested

1. Confirmed: enforce Project Name length 2-255 with inline FE validation.
2. Confirmed: Project Key is 2-10 uppercase alphanumeric; current DevInt 2-6 must be aligned.
3. Pending coverage: keep Project Start Date persistence as NOT TESTED until manual/native date-picker entry is verified.
4. Confirmed classification: linked Team display remains NOT TESTED until dev finishes Team code.

## GAP-P0-PRJ-007 — bottom-row Edit action is clipped

- Evidence: `evidence/P0-PRJ-02/GAP-P0-PRJ-007-bottom-row-edit-clipped.png`.
- Reproduction: open Manage Projects, scroll to the final visible row `AUD719`, then open its row-action/Edit control.
- Actual: the action/Edit surface is clipped by the lower table/viewport boundary.
- Expected: the menu and `Edit Project` option remain fully visible and selectable for every row, including the final visible row.
- Classification: **Gap Confirmed**, `P1`, `UI / UX`, FE scope.
- Recommended FE fix: render the popup through a body-level portal, use collision-aware placement that flips above the trigger when needed, avoid clipping from table `overflow`, preserve the appropriate z-index, and keep keyboard navigation working.
