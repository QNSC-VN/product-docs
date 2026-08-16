# Mini Rally Testing Plan

This folder is the single entry point for BA testing from the completed Phase 0-4 audit through the Phase 5-6 deployed-product audit. The master workbook is `PHASE_0_6_AUDIT_TRACKER.xlsx` in this folder.

## Structure

- `01_test_phase_1_to_4/`: all previous test plans, scenarios, trackers, notes and evidence. Phase 0 is retained here as the authentication/app-shell precondition for Phase 1-4 regression.
- `02_test_phase_5_6/`: Phase 5-6 test plan, scenarios, historical observations and evidence.
- `03_Retest/`: current consolidated DEV handoff after the Phase 0-6 Fail/Partial retest. Only the handoff in this folder should be sent to DEV.

## Working rule

1. Compare SRS, approved mockup and deployed behavior.
2. The BA/user is the primary tester and records the result directly in `PHASE_0_6_AUDIT_TRACKER.xlsx`.
3. Codex only executes or re-tests a scenario when the user requests its exact Scenario ID.
4. Record evidence before changing a result.
5. Use `Pass`, `Partial`, `Fail`, `Blocked`, `Not Run`, `Future Backlog` or `Not Required` only.
6. A previous mockup pass or preliminary Codex observation is not a deployed-product pass; the user-owned run must be recorded separately.
7. BA confirms each functional checkpoint before the next mutation-heavy flow.
