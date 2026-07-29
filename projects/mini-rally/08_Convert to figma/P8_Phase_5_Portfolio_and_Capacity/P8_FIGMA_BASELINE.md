# P8 Figma Baseline

## Existing reference frame

| Node | Finding | P8 disposition |
|---|---|---|
| `SCR-15 Portfolio (Future)` `175:1713` | Native instance has an explicit `FUTURE / REFERENCE ONLY — NOT DEV-READY` banner and uses the historical `Initiative` hierarchy. | Retain as historical reference until P8 review; do not treat as P5.1 completion. |
| `175:1713` content | Metrics and hierarchy are illustrative only; it lacks the closed Epic/Feature fields, scoped dialogs, detail states, rollup rules and P5.1 permission states. | Replace/supersede with P8 Portfolio screens. |
| Capacity Planning | No approved dev-ready Figma screen was found in the prior conversion coverage. | Build new P8 screen set from the closed P5.2 source contract. |

## Initial library discovery

- Figma design-system search for `Portfolio State Badge`, `Estimate Badge` and `Capacity Plan Status Badge` returned no direct reusable asset.
- This is not proof that generic local primitives do not exist: the historical frame still contains instances such as Avatar, Type Badge and Status Badge.
- P8.1 must enumerate the local native component sets and decide reuse/extension/new component explicitly before any P8 screen build.

## Baseline rule

The P8 implementation uses native, token-bound components and approved P0–P7 patterns. It must never convert the old Future/Reference frame by treating its existing child frames as source components.
