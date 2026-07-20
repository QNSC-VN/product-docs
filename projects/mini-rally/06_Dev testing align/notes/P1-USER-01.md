# P1-USER-01 - User Management list, search and detail

## Audit state

- Date: 2026-07-19
- Environment: DevInt plus local mockup
- DevInt route: `https://rally-dev.qnsc.vn/settings` > `User Management`
- Mockup route: Workspace Settings > User Management
- Result: Partial execution; BA fix direction confirmed
- Safety boundary: no invitation, access removal or role mutation was submitted

## Confirmed working

1. User Management is under the Settings gear and Workspace section.
2. DevInt loads 12 workspace-member rows.
3. Clicking a member opens detail with name, email, phone, role, status, last login and joined date.
4. The current user cannot edit their own role inline or remove their own access.

## BA-confirmed reconciliation decisions

### 1. Final User list columns

- SRS: User, Email, Workspace Role, Status, Teams, Last Login.
- Mockup: Name, Email, Phone number, Role, Status, Last Login.
- DevInt: Member, Phone, Role, Status, Last Login, Joined.
- Decision: implement the approved mockup/SRS list design. Use the SRS list contract: User, Email, Workspace Role, Status, Teams, Last Login. Keep Phone and Joined in User detail only.

### 2. Search and filters

- SRS: search by name/email/role, Role filter, and Status filter All/Active/Deactive.
- Mockup: search plus Role filter; Status filter is missing.
- DevInt: no local search, Role filter or Status filter.
- Decision: implement the approved mockup/SRS controls in DevInt and reconcile the missing Status filter in the mockup.

### 3. Edit User flow

- SRS and the approved mockup define the target Edit User behavior.
- Current Settings mockup still has a competing read-only detail surface.
- DevInt opens read-only Member details and edits Role inline.
- Decision: Edit User must follow the approved mockup/SRS; reconcile the competing read-only and inline-only model.

### 4. Invite User flow

- DevInt exposes Invite member, but clicking it currently has no effect.
- Decision: dev is free to design the Invite interaction. Mark it `Not Tested` and retest after dev finishes; do not classify the current no-op as the final result.

### 5. Workspace Role catalog

- SRS: Workspace Admin, Project Manager, Product Owner, Developer, Tester, Viewer.
- Mockup: Workspace Admin, Project Admin, Project Member.
- DevInt: Project Member, Project Viewer, Workspace Member, Scrum Master, Product Owner, Developer, QA Engineer, Project Admin, Workspace Admin; some rows show no role.
- Decision: this belongs to Phase 4 Roles & Permissions. Mark it `Not Tested` in the current Phase 1 audit.

### 6. Duplicate member row

- DevInt shows two identical `Admin User` rows.
- Opening each row resolves to the same `admin@acme.dev` account and identical membership data.
- Decision: retain this observation and report it to dev for investigation. Dev should inspect the API response/workspace membership mapping and remove the duplicate response or duplicate test membership. No schema change is requested.

## Retest after decisions/fix

1. Search by name, email and role; combine Role and Status filters.
2. Open a row and execute the approved Edit User flow; verify the same account updates in the list and detail.
3. After dev completes Invite, execute the dev-designed flow with an agreed controlled account.
4. Validate role choices during Phase 4 Roles & Permissions testing.
5. Confirm `admin@acme.dev` appears once after dev investigation/fix.
