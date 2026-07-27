# P7.f — Code Connect Mappings / Backlog

## Decision: backlog, not live mappings

Code Connect links a Figma component to a **stable, versioned production code component** so Dev Mode can show real implementation snippets. This project has no such codebase yet:

- `03_Mockup Design/` is an explicitly-scoped **UI mockup/prototype** (Vite + React), not the production frontend. Every contract in `P3_UI_API_CONTRACTS.md` through `P6_SCREEN_CONTRACTS.md` states this plainly — mockup interactions are "React local state," never "backend-ready" (`AI_EXECUTION_WORKFLOW.md` rule 9).
- No production component library, package, or repository exists to point Code Connect at. Wiring live mappings to the mockup's `components/shared.tsx`/`components/layout.tsx` would present throwaway prototype code as if it were the stable implementation Dev Mode should hand a developer — actively misleading, not helpful.

So P7.f's output is the **mapping backlog** the task instructions call for as the fallback: a name-and-behavior correspondence table for whoever builds the real production component library to turn into actual Code Connect mappings once that library is stable.

## Mapping backlog: Figma component → mockup reference → production action needed

| Figma component | Mockup reference (`03_Mockup Design/src/app/components/shared.tsx` unless noted) | Production action needed |
|---|---|---|
| Button | `Button`-equivalent inline styling (no extracted component in the mockup — buttons are hand-styled per instance) | **Extract a real `Button` component first** — the mockup never factored this out, so there's nothing stable to connect to yet even in spirit |
| Type Badge / Status Badge / Priority Badge / Role Badge | `TypeBadge`, `StatusBadge`, `PriorityBadge`, `RoleBadge` | Map directly once these (or their production equivalents) stabilize — names and enum values already match 1:1, verified repeatedly across every plan |
| Avatar | `Avatar` | Direct map candidate — stable shape (`owner`, `size`) since P2 |
| Entity Status Badge | inline per-screen styling in `ProjectsPage.tsx`/`SettingsPage.tsx` (`userStatusCfg`, project status chips) | Same as Button — extract first, then map |
| Defect Priority Chip / Severity Badge / Timebox State Badge | `DEFECT_PRIORITY_LABELS`, `QualityPage.tsx`'s `SeverityBadge`, `IterationsPage.tsx`'s `STATE_STYLES` | Direct map candidates — these mockup functions are already isolated, named, and stable |
| Notification Card | inline JSX in `NotificationsPage.tsx` (not extracted) | Extract first |
| Permission State Chip | inline `STATE_STYLE` rendering in `SettingsPage.tsx` (not extracted) | Extract first |
| Dialog (`Type=Destructive Confirmation`, `Require Typed Name`) | `ConfirmDestructive` (`ProjectsPage.tsx`), `ConfirmRemoveUserAccess` (`SettingsPage.tsx`) — two separately-named mockup functions that Figma correctly unified into one component+property | Production should follow Figma's model (one component, a boolean prop), not the mockup's two-function duplication — flag this as a *design system improvement over the mockup*, not a straight port |
| App Shell / TopNav / Context Bar / Breadcrumb | `TopNav`, `ContextBar`, breadcrumb logic in `layout.tsx` | Direct map candidates — already extracted, named, and used identically everywhere |
| Icons (all 51) | `lucide-react` package imports | **These don't need extraction or Code Connect at all** — just import the named `lucide-react` icon directly; see `P7_DEV_MODE_GUIDE.md` §3 |

## What this backlog is not

This is not a request to build the production component library now — that's out of scope for a Figma conversion project per every prior plan's contracts (development owns DTO/API/persistence/implementation; this project owns design fidelity and documented behavior). It's a ready-made checklist for whoever *does* start that build: which Figma components already have a clean 1:1 mockup source to reference, which need extraction first, and the one case (Dialog) where Figma's model is better than the mockup's and should be followed rather than reversed.
