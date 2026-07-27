# E2E-11/12/13 — Work Item state, Iteration accept & no-lock (DevInt live)

**Execution date:** 2026-07-20
**Environment:** `https://rally-dev.qnsc.vn/` (Microsoft SSO, `hieuvbm@qnsc.vn`), context `NXP / All Teams`
**Items used:** `US-7`, `US-9` (Sprint 26.2), `DE-1`, iterations `Sprint 26.1` (Committed) / `Sprint 26.2` (Planning)

## E2E-11 — Work Item Schedule/Flow state catalog + mirror: FAIL

Tested on `US-7` (and observed on `US-9`).

- **Catalog:** Schedule State has all 6 buttons (`Idea / Defined / In Progress / Completed / Accepted / Release`) but labels **"In Progress"** not the canonical `In-Progress`. **Flow State dropdown has only 4 options** (`Defined / In Progress / Completed / Accepted`) — **missing `Idea` and `Release`**. Business define (BR-WI-01): both fields use all six values.
- **No mirror, both directions:** set Schedule State → `In Progress`, Flow State **stayed `Defined`**; set Flow State → `Completed`, Schedule State **stayed `In Progress`**. Schedule and Flow are fully independent; BR-WI-01 requires bidirectional mirroring. This is the broader root of `DEV-017` (auto-complete mirror).
- `US-7` was reverted to `Defined / Defined` after the probe.
- Gap: **DEV-020** (BA confirmed 2026-07-20; design must match the mockup).

## E2E-12 — Iteration auto-Accept when all US/DE Accepted: FAIL

Set both scope items of `Sprint 26.2` (`US-7`, `US-9`) to Schedule State `Accepted`.

- Iteration Status **ACCEPTED tile = 100% (13 of 13 pts)** and the iteration detail showed **ACCEPTED 13 pts (100% of committed)** — the Accepted metric correctly counts US/DE in `Accepted` state (per the BA metric definition).
- ❌ But `Sprint 26.2` **State stayed `Planning`** in Timeboxes — the iteration did **not** auto-change to `Accepted`. Business define (BR-IT-02) requires a non-empty iteration whose assigned US/DE are all Accepted to auto-change to `Accepted`.
- Accepted metric is correct; only the automatic State transition is missing.
- Gap: **DEV-021** (BA confirmed 2026-07-20: per SRS/mockup the iteration must auto-Accept when all US/DE are Accepted and remain manually editable).

## E2E-13 — No status locks scope + manual control: PASS (with DEV-022)

Tested against `Sprint 26.1` (Committed).

- **No scope lock — confirmed both directions:** added `DE-1` to the Committed `Sprint 26.1` (scope 3 → 4, persisted after reload), then removed it again (scope 4 → 3). Both succeeded → `Committed` does not lock scope (BR-IT-03). `DE-1` restored to `No iteration`.
- **Manual status control:** iteration detail exposes `Commit Iteration` and `Accept Iteration` buttons. However, committing a second iteration is **blocked**: "Another iteration is already committed for this project" — DevInt enforces a **single Committed iteration per project**, which the business define does not state.
- Gap: **DEV-022** — BA confirmed 2026-07-20 that multiple Committed iterations per project are allowed (remove the restriction).

## Side observations

- Iteration detail **TASKS tile = 0** for `Sprint 26.2` even though `US-9` has 2 child Tasks — same family as `DEV-012` (task count).

## Live data left after this run

- `US-7`: Schedule State `Accepted` (Flow `Defined`), Sprint 26.2.
- `US-9`: Schedule State `Accepted` (Flow `Defined`), Sprint 26.2; TA-6/TA-7 unchanged.
- `Sprint 26.2`: `Planning`. `Sprint 26.1`: `Committed` (scope restored to 3). `DE-1`: `No iteration` (restored).

Awaiting BA decision on whether to revert US-7/US-9 Schedule State back from Accepted.
