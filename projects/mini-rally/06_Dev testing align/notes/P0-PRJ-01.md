# P0-PRJ-01 — Manage Projects list and filters

## Audit scope

- Environments: DevInt `https://rally-dev.qnsc.vn/projects` and local mockup
- Account: `hieuvbm@qnsc.vn`
- Audit date: 2026-07-19
- Mutation level: read-only; no Project was created, edited or archived

## DevInt execution results

- Loaded five active Projects with stable keys and names.
- Summary values matched visible data: Total `5`, Active `5`, Archived `0`, Linked Teams `4`.
- Search `MOB` returned only `MOB — Mobile App`.
- Search `Infrastructure` returned only `OPS — DevOps & Infrastructure`.
- Search `NO-PROJECT-999` returned `No projects found` and recovery guidance.
- Archived filter returned an empty state, consistent with Archived count `0`.
- Active filter restored all five active Projects.
- Each row exposed `Edit project` and `Archive project` actions.

## Mockup/SRS comparison

### Match

- Project key, name/description, status, owner-like responsible person, member/team aggregates and updated time are visible.
- Key/name search, status filters and empty state are implemented.
- Edit/archive actions are reachable from each row.
- Teams is no longer a separate tab beside Projects; Team management remains under Settings.

### GAP-P0-PRJ-001 — labels

- Mockup: `Manage Projects`, `Owner`.
- DevInt: `Projects`, `Lead`.
- Recommended: use `Manage Projects` and `Owner` consistently.

### GAP-P0-PRJ-002 — Start Date

- Mockup/SRS show Start Date.
- DevInt omits Start Date.
- BA confirmed DevInt must add Start Date like the mockup/SRS while retaining the current fields and actions.

### GAP-P0-PRJ-003 — linked Team display coverage

- Mockup shows linked Team names/badges and `+N` overflow.
- During P0-PRJ-02, controlled Project `AUD719` was created with `Team Alpha`.
- DevInt row `AUD719` shows Teams count `1` but does not identify `Team Alpha`.
- BA classified this as **NOT TESTED** until dev finishes Team code. Retest after Team implementation; do not hand off it as a confirmed Project-list defect yet.

## Coverage not tested

- Permission-based exclusion requires a second restricted account.
- Positive Archived filtering requires at least one archived Project; current DevInt has zero.
- Pagination requires more Projects than one page.

BA confirmed these are recorded as **NOT TESTED due to missing data/account**, not as observed defects.

## BA confirmation requested

1. Still pending: choose between DevInt `Projects` / `Lead` and mockup/SRS `Manage Projects` / `Owner` wording.
2. Confirmed: add Start Date to match the mockup/SRS.
3. Linked Team display remains NOT TESTED until Team code is finished. Other coverage limitations remain NOT TESTED.
