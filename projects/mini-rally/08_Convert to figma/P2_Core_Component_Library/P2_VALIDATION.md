# Plan 2 — Validation

## Method

Every component below was validated in two passes before being marked complete:

1. **Structural** — `get_metadata`/inline metadata reads confirmed variant axis names and counts, component property keys/types, and variable bindings resolved to a concrete colour (not an unbound literal or a stale alias).
2. **Visual** — a `screenshot()` of the full component set (or the affected variant, for targeted fixes) confirmed every variant renders distinctly, text is not clipped/wrapped incorrectly, and icons/colours match the mockup evidence cited in `P2_PROGRESS.md`.

No component was marked complete in `PLAN.md` until both passes were clean.

## Per-component validation status

| Component | Structural | Visual | Notes |
|---|---|---|---|
| Button | Pass | Pass | 27 variants (was 18; +9 `Destructive` in P2.d) |
| Icon Button | Pass | Pass | 27 variants |
| Link Action | Pass | Pass | 6 variants |
| Text Input | Pass | Pass | Corrected zero-width text truncation (284px Small / 276px Medium) |
| Form Field | Pass | Pass | Corrected label/required token bindings against mockup before cloning states |
| Textarea | Pass | Pass | 5 variants, cloned from Text Input |
| Select | Pass | Pass | 10 variants, cloned from Text Input + chevron affordance |
| Checkbox | Pass | Pass | 6 variants; corrected invisible focus ring (see Exceptions) |
| Radio | Pass | Pass | 6 variants; same focus-ring fix applied proactively |
| Toggle | Pass | Pass | 6 variants; off-track colour resolved to nearest Primitive |
| Avatar | Pass | Pass | 4 variants |
| Type Badge | Pass | Pass | Corrected shared-Label bug (see Bugs Found) |
| Status Badge | Pass | Pass | 6 variants incl. Completed→"Done" |
| Priority Badge | Pass | Pass | 4 variants |
| Role Badge | Pass | Pass | 3 variants |
| Progress | Pass | Pass | 3 tier variants |
| Alert | Pass | Pass | Corrected clipped description (resize-order bug) and shared-Icon bug |
| Toast | Pass | Pass | 4 variants, no regressions (lessons from Alert applied proactively) |
| Tooltip | Pass | Pass | 2 variants |
| Dialog | Pass | Pass | Corrected collapsed layout (resize-order bug, twice — dialog frame and slot) |
| Menu Item | Pass | Pass | 2 states |
| Dropdown / Popover | Pass | Pass | Corrected text-wrap (label not set to FILL) after an atomic script failure required a full page rebuild |
| Drawer | Pass | Pass | Corrected header FILL sizing reverting to HUG |

## Bugs found and fixed during P2 (for future reference)

1. **`combineAsVariants` merges same-named TEXT/INSTANCE_SWAP properties into one shared property across the whole set.** Correct when the value should be freely overridable regardless of variant (Button `Label`, Avatar `Initials`, Progress `Value/Max`, Alert/Toast `Title`/`Description`, Menu Item `Label`/`Icon`). Wrong when the value must track the variant itself — hit on Type Badge (`Label` forced to "Story" on all 4 variants) and Alert (`Icon` forced to `AlertCircle` on the Success variant). Fix: delete the shared property, bake the correct literal/instance per variant instead.
2. **New icon components must set `visible: false` on their placeholder white frame fill**, matching `ChevronRight`/`Check`. A `visible: true` fill is invisible during icon-only QA on a white canvas but shows as a white box once the icon sits on a tinted surface — caught on Alert's Warning/Info variants (`Icon/AlertCircle`, `Icon/InfoCircle`), fixed at the source icon.
3. **`node.resize()` resets `primaryAxisSizingMode`/`counterAxisSizingMode`/`layoutSizingHorizontal` back to `FIXED`.** Hit three times: Alert's description text clipped to a fixed 10px-tall container; the Standard Dialog collapsed to a 10px bar; the Dropdown Menu collapsed identically. Fix: always finish every `resize()` call on a node before setting `AUTO`/`HUG`/`FILL` sizing modes — sizing-mode assignments must be the last thing done to a node, not the first.
4. **A failed `use_figma` script is atomic — nothing it did persists**, including page/frame creation earlier in the same script. Hit once building the Dropdown page: a `TEXT node has no padding property` error partway through meant the whole page, its documentation clone, and the in-progress Dropdown Menu component silently did not exist, even though an earlier line had returned success-shaped intermediate values in my own reasoning. Fix: after any script error, re-verify with `get_metadata`/`getNodeByIdAsync` before assuming any prior step in that same failed call took effect — don't patch forward from an assumed partial state.
5. **Variable lookup keys must include the full slash-separated name.** `V['badge/type/story/bg']` (missing the `color/` prefix) resolved to `undefined`; `setBoundVariableForPaint` then fell back to the paint's literal placeholder colour with no thrown error. All four Type Badge variants rendered black-on-white before this was caught by screenshot diffing, not by an error message.

## Documented exceptions (P1 rule 2 — bind to variables; literals only when explicitly justified)

1. **Focus ring literal colour** (Checkbox, Radio, Toggle, `State=Focused`): `rgba(29,63,115,0.35)` literal, because `setBoundVariableForEffect` forces alpha to 1 and an opaque `color/border/focus` ring is invisible against the navy `Checked=True`/`On=True` fills.
2. **Toggle off-track colour**: bound to the `neutral/300` Primitive (nearest match to the mockup's `#cbd5e1`, distance 0.094 vs `neutral/400`'s 0.184) since no Color-collection semantic exists for a switch track.
3. **Toggle disabled state**: 45% node opacity instead of a distinct fill, matching the mockup's `disabled:opacity-45` directly.
4. **Destructive button disabled state**: same 45%-opacity treatment as Toggle, for the same reason — the mockup's `ConfirmRemoveUserAccess` button uses `disabled:opacity-45` on the solid red fill rather than swapping to a neutral background like Primary/Secondary's disabled state does.
5. **`red/800` Primitive**: derived (not evidenced in the mockup, which shows no Destructive-button hover state) by applying the same ratio already observed between `navy/700` and `navy/800` to `red/700`.
6. **Progress "Low" tier fill**: bound to the `amber/500` Primitive rather than a semantic Color token, since the closest semantic (`color/status/warning`, `#8a5808`) is a different, darker value intended for text, not this accent role.
7. **62 new `color/badge/*` and `color/feedback/*` tokens** (P2.c): Light values sourced exactly from mockup hex; Dark mode mirrors Light because the mockup has no dark theme, consistent with existing precedent for saturated/accent-role tokens (`color/status/success`, `color/status/danger`, `color/status/info`, `color/text/muted`, `color/nav/text` already keep identical Light/Dark values).

## Net-new components without direct mockup evidence

Flagged for visibility, not as open decisions — each was resolved autonomously from the existing token system and design language already established in Plan 1/P2, per workflow rule 5/6:

- **Radio** — no `type="radio"` usage found in the mockup; built as the Checkbox recipe with a circular shape and inner dot, since a mutually-exclusive selection control is a standard system component regardless of whether the current mockup happens to use one.
- **Toast** — no toast/snackbar pattern in the mockup; reuses Alert's colour/icon language on an elevated, opaque surface.
- **Tooltip** — mockup only uses native `title=` attributes (no custom visual); built from the `color/nav/*` dark-surface tokens already established for navigation.
