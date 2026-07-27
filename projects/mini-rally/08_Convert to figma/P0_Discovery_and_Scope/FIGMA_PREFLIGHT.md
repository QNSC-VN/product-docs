# Plan 0 — Figma Target Preflight

## Target

- File: [Mini Rally Figma](https://www.figma.com/design/ttpggMpbPwggOZl6umowzC/Mini_Rally_Figma?node-id=0-1&m=dev)
- File key: `ttpggMpbPwggOZl6umowzC`
- Verified node: `0:1` / `Page 1`
- Test mode: read-only; no Figma object was created, edited or deleted.

## Test results

| Check | Result | Implication |
|---|---|---|
| File type | Figma Design | Supports pages, variables, styles, components and Dev Mode handoff. |
| Figma integration read access | Passed | Codex can inspect this target file. |
| Existing pages | One empty page: `Page 1` | No existing UI structure will be overwritten. |
| Existing canvas nodes | 0 | Clean canvas. |
| Local variable collections | 0 | Plan 1 will establish the Mini Rally token architecture from scratch. |
| Local text styles | 0 | Plan 1 will establish approved typography styles. |
| Local effect styles | 0 | Plan 1 will establish elevation/shadow styles where required. |
| Subscribed libraries | 0 | No remote library is currently attached. |
| Available libraries | Material 3 and Simple Design System (plus platform kits) | They are only available options; none will be added without a deliberate reuse decision. |

## Decision

This is a suitable destination file for the conversion. We will build a Mini Rally-owned design system rather than importing Material 3/Simple Design System wholesale, because the current mockup has its own desktop data-product visual language and integration requirements.

## Remaining preflight condition

The read-only test passed. The first Plan 1 write will also verify actual edit permission. If Figma returns a permission error, no partial change is applied and the workflow pauses for access correction.

