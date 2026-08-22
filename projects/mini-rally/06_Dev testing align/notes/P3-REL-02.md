# P3-REL-02 - Release Artifact Assignment

## Scope

Assign an existing US/DE to a Release, verify the same Work Item identity appears under Release Artifacts, and verify roll-up and refresh behavior.

## Recorded DevInt execution

- Assigned `US-11` to `RE-2` from the Backlog Release picker.
- Backlog Release column updated.
- Release list Task Estimate roll-up updated to `6h`.
- `RE-2 > Artifacts` stayed empty with `No artifacts linked to this release`.
- A hard reload did not resolve the empty Artifacts list.
- Reassignment/refresh coverage was blocked because the assigned Work Item could not be retrieved from Release Artifacts.

## Result and gap

Result: **Fail**.

`GAP-P3-REL-002` is a P0 functional/data gap. Dev must fix the Release Artifacts query so it returns Work Items whose Release assignment matches.

## Test-data and evidence state

`US-11` was restored to unassigned and `Accepted` after the test. No durable screenshot was committed; the failure must be recaptured during retest.
