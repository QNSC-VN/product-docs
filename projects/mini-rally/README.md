# Mini Rally — BA & Product Design

Business analysis and design artifacts for **Mini Rally**, an agile project-management tool (portfolio → projects → backlog → work items → iterations → tracking).

> Code lives in the implementation repo. This folder holds the *what* and *why*: requirements, specs, DB design, mockups, and development tracking.

## Contents

| Folder | What's inside |
|--------|---------------|
| [`00_Documents/`](00_Documents/) | Project overview, ERD, use-case/role mapping, screen traceability, UI business review |
| [`01_DB design/`](01_DB%20design/) | Database design doc + `Diagram.drawio` ER diagram |
| [`02_Prompt UI/`](02_Prompt%20UI/) | UI generation prompts |
| [`03_Mockup Design/`](03_Mockup%20Design/) | Interactive Vite/React + shadcn mockup (source only; run locally) |
| [`04_Developement_tracking/`](04_Developement_tracking/) | Per-phase SRS, development tracking & mockup checklists (Phases 0–3) |
| [`05_Architecture/`](05_Architecture/) | Architecture, backend/frontend structure, DB schema, CI/CD, production readiness |

## Running the mockup

```bash
cd "03_Mockup Design"
pnpm install
pnpm dev
```

## Status

- **Phase 0** (App Shell, Auth, Workspace, Project) — see [`04_Developement_tracking/Phase 0/`](04_Developement_tracking/Phase%200/)
- **Phase 1** (Backlog, Work Items, Tasks, Time Tracking, Attachments, Activity Log, Manage Projects/Teams/Users) — see [`04_Developement_tracking/Phase 1/`](04_Developement_tracking/Phase%201/)
- **Phase 2** (Backlog Enhancement, Iterations, Iteration Status) — see [`04_Developement_tracking/Phase 2/`](04_Developement_tracking/Phase%202/)
- **Phase 3** (Team Board / Team Status) — see [`04_Developement_tracking/Phase 3/`](04_Developement_tracking/Phase%203/)
