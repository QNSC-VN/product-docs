# Future Backlog — Release/Milestone Artifact Add New Item

## Status

**DEFERRED BY BA DECISION 2026-08-15.**

Current delivery is sufficient when users assign Release or Milestone from existing Work Item and Portfolio Item create/detail surfaces. Release/Milestone Artifact lists must still display those assignments correctly.

## Deferred journey

- Release Artifacts `Add New Item`: create US/DE through shared Backlog creation or Feature through shared Portfolio creation; prefill current Release.
- Milestone Artifacts `Add New Item`: create US/DE through shared Backlog creation or Feature/Epic through shared Portfolio creation; prefill current Milestone.
- `Create` creates exactly one item and returns to Artifacts.
- `Create with details` creates exactly one item and opens the matching Work Item or Portfolio Item detail.

## Preserved active rules

- Release Artifacts supports direct US/DE/Feature; Epic and Task are excluded.
- Milestone Artifacts supports direct US/DE/Feature/Epic; Task is excluded.
- A Milestone-linked Feature contributes its Story/Defect descendants to inherited display/rollup scope.
- A Milestone-linked Epic contributes child Features and their Story/Defect descendants.
- Direct and inherited populations are de-duplicated by stable item ID; existing rollup formulas remain unchanged.

## Reopen test gate

Run `P3-REL-FB-001` and `P3-MS-FB-001` only after BA reopens this backlog item and DEV deploys the Artifact-origin creation journey.
