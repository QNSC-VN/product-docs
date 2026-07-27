# P7.e — Dev Mode Documentation

How a developer should consume this Figma file in Dev Mode: component index, variable syntax, asset policy, export policy.

## 1. Component index

`P2_Core_Component_Library/P2_COMPONENT_CATALOG.md` is the primary component index (23 components: Button, Icon Button, Link Action, Text Input, Form Field, Textarea, Select, Checkbox, Radio, Toggle, Avatar, Type/Status/Priority/Role Badge, Progress, Alert, Toast, Tooltip, Dialog, Menu Item, Dropdown, Drawer, App Shell, Data Table pattern). It was never updated after Plan 2, so treat it as the **P0-P2 baseline only**. Everything built afterward is indexed below — this addendum plus the catalog together are the complete component list.

### Addendum: components added in Plans 3-7

| Component | Figma node | Plan | Variants / properties |
|---|---:|---|---|
| Data Table / Table Row / Table Header Cell / Bulk Action Bar / Table Pagination | `78:281` page | P3 | Generic list pattern with a `Cells` Slot per row; reused as-is by `SCR-02 Backlog` |
| Query Controls (Input with Icon / Filter Chip / Filter Bar / List Toolbar) | `84:374` page | P3 | Search/filter/saved-view/pagination pattern |
| System State (`Type`=Empty/Error/Forbidden/Not Found) / Skeleton Row | `88:50` page | P3 | Query-state pattern for any list/detail screen |
| Detail Field / Tag / Activity Row | `90:95` page | P3 | Work Item Detail composition primitives |
| RBAC Outcome | `95:62` page | P3 | E/R/D/H documentation pattern (superseded in practice by `Permission State Chip` for the actual matrix, P6) |
| Metric Card | `110:553` | P4 | Emphasis=Default/Danger |
| Entity Status Badge | `116:938` | P4 | Active/Archived/Invited/Deactive — project/team/user lifecycle, distinct from work-item `Status Badge` |
| Work Item Detail Header | `122:1197` | P4 | Full-page detail header composition |
| Rich Text Field | `124:1218` | P4 | Description/Notes editor chrome |
| Defect Priority Chip | `130:1596` | P5 | `Mode`=Display/Editable — display-label mapping over the shared `PriorityType` enum (Q-11) |
| Timebox State Badge | `133:1639` | P5 | 10 variants — Iteration/Release/Milestone lifecycle, distinct domain from work-item Status Badge (D-005) |
| Severity Badge | `146:5438` | P5 | None/Critical/Major Problem/Minor Problem/Trivial — defect-only, distinct from `Priority Badge` |
| Notification Card | `157:1664` | P6 | `State`=Read/Unread × `Type`=Assigned/Mention; Title/Body/Project/Time/Initials shared properties |
| Permission State Chip | `162:6122` | P6 | Enabled/Read-only/Disabled/Hidden + `Locked` boolean (shows a lock icon) |
| `Dialog` `Require Typed Name` property | `65:20` (extends existing) | P6 | Boolean added to `Type=Destructive Confirmation` — `true` for Delete Project/Remove User Access, `false` for ordinary Archive/Restore/Deactivate |
| `future-reference-banner` | inline per screen, P7 | P7 | Not a component — a one-off amber marker built per Tier-B screen (`SCR-14`-`17`), intentionally not componentized since it exists to be visually distinct scaffolding, not reusable UI |

**Known placement inconsistency (see `P7_PROGRESS.md` naming audit):** every component listed above from P5 onward lives inline on a `Screens — Phase X` page rather than getting its own dedicated component page like the P2/P3/P4 components do. Search by name in Dev Mode's asset panel, not by browsing component pages alone, or you will miss five real components.

## 2. Variable syntax

Four collections: `Primitives` (raw scale — bare names like `0`-`11` for spacing, `xs`-`full` for radius, `white`/`black`/`navy`/`red`/etc. for color swatches — **never reference these directly in code**, they exist only to be aliased), `Color` (semantic, Light/Dark modes, slash-namespaced e.g. `color/text/primary`, `color/badge/severity/critical/bg`), `Spacing` (aliases Primitives spacing scale), `Radius` (aliases Primitives radius scale), `Typography` (`font/family/*`, `font/size/*` — 7 real sizes: `caption`(10)/`small`(11)/`body`(12)/`content`(13)/`label`(14)/`title`(16)/`page`(20); **`base`/`lg`/`xl` were added in P7.c as aliases to `body`/`label`/`page` respectively** after being used-but-missing in Plans 5-7 — see the token-audit finding in `P7_PROGRESS.md` before assuming every text node's bound size is exactly right).

Dev Mode syntax: every bound variable exports as a CSS custom property or platform token reference automatically — do not hand-copy hex values from the canvas. If Dev Mode shows a literal (unbound) color/size on any node, that is either (a) one of the two documented, deliberate exceptions — translucent focus-ring effects (P1 rule 2, `setBoundVariableForEffect` forces alpha=1) — or (b) a token-binding gap per the P7.c audit finding; check `P7_PROGRESS.md` before treating an unbound value as intentional.

## 3. Assets

**No raster/exported image assets exist in this file.** Every icon (`Icons` page, 51 components) is a native vector component — `stroke`-based, 24x24, bound to `color/text/secondary` by default and recolored per-instance where a domain needs it (e.g., notification category tints). Implementation should render these as inline SVG/icon-font glyphs matching the existing `lucide-react` icon names already used in the mockup source (every Figma icon name matches its `lucide-react` import 1:1 — `Icon/Flag` ↔ `<Flag />`, `Icon/Hash` ↔ `<Hash />`, etc.) — do not re-export Figma's vector paths as new SVG assets; use the equivalent `lucide-react` component directly, since that's what the approved mockup already does and Figma's vectors are simplified approximations built for at-a-glance visual parity, not pixel-exact path data (documented in `MACHINE_HANDOFF.md`'s icon-construction notes).

Avatars use text-initials + a solid background color, no photo assets — matches the mockup's `Avatar` component exactly.

## 4. Export policy

- **Components → code components.** Every Figma component set maps to one implementation component with the same variant axes as props (e.g., `Button` `Size`×`Style`×`State` → `<Button size style state>`).
- **Screens → do not export as images or implement as static markup.** Every screen is a composition of the components above; implementation should assemble the same components, not screenshot-trace the Figma frame.
- **Tokens → CSS custom properties / platform theme, not hand-copied values.** See §2.
- **Icons → `lucide-react` imports, not exported SVGs.** See §3.
- **The four Plan 7 Tier-B screens (`SCR-14`-`17`) are explicitly not export candidates for pixel-accurate implementation** — they exist to be visually distinct scaffolding (the `future-reference-banner` marks this), not a spec to build against, per D-002.
