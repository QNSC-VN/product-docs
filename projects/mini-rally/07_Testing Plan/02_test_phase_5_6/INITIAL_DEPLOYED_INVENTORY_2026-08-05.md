# Initial Deployed Inventory — 2026-08-05

> **Historical environment snapshot:** The authorization dependency described here used the former three-role model. Current re-test data must use Workspace Admin and per-Project `Admin`/`Editor`/`Viewer`/`No Access` assignments.

**Environment checked:** `https://rally-dev.qnsc.vn/`
**Account:** signed-in Workspace Admin session
**Current scope:** QNSC / Project `TEST` / All Teams

| Check | Deployed observation | Mockup/SRS comparison | Initial disposition |
|---|---|---|---|
| Portfolio menu | Portfolio Items, Capacity Planning, Release Tracking are present in the approved order | Matches Phase 5-6 navigation contract | Pass inventory |
| Portfolio Items | `/portfolio` renders Type, search, New Feature, Filters, Show Fields and sortable/resizable table; current scope has no rows | Core surface exists. Deployed default is `Feature` and heading is `Portfolio`; mockup default is `Epic` and breadcrumb/surface says `Portfolio Items` | BA confirm before classifying gap |
| Capacity Planning | `/capacity-planning` renders Release navigation, search, Add New, filters and empty plan table | Core surface exists, but Project has no Release or Plan | Blocked for calculation/lifecycle by test data |
| Release Tracking | `/release-tracking` shows `No releases in this project` and directs user to Plan > Timeboxes | Matches the approved no-Release empty state | Pass empty-state inventory |
| Reports information architecture | `/reports` Type contains exactly Iteration Burndown, Velocity and Team Capacity | Matches Phase 6 contract | Pass inventory |
| Burndown empty state | No Iteration -> `No burndown to show` | Matches explicit empty-state requirement | Pass inventory |
| Team Capacity empty state | No Iteration -> blank indicators and `Nothing to show for this iteration` | Core empty state exists; detailed no-capacity/no-task variants still need data | Partial inventory |
| Velocity empty state | With no eligible Iteration, screen remained `Loading…` after repeated wait | SRS requires an explicit no-completed-Iteration empty state | Potential defect; retest and BA confirm |
| Data/account readiness | Only one visible Project (`TEST`), no Team/Release/Iteration/Portfolio data and only Workspace Admin session observed | Cannot prove calculations, persistence or three-role authorization | Blocked dependency |

No deployed data was created, edited or deleted during this inventory pass.
