# How Real Rally Models Roles, Permissions and Scoping

Research date: 2026-08-04. Target product: **Broadcom Rally Software** (formerly CA Agile Central, Rally Dev, `rally1.rallydev.com`).

## Evidence-quality legend

- **[DOC]** — stated in Broadcom official documentation (techdocs.broadcom.com or knowledge.broadcom.com KB).
- **[API]** — inferred from the WSAPI object schema / KB API examples, not from a prose statement of intent.
- **[COMM]** — Broadcom-employee or user statement on community.broadcom.com.
- **[NONE]** — no authoritative source found; explicitly flagged rather than guessed.

> **Search hazard, recorded so nobody repeats it:** `help.rallyuxr.com` ("Rally UXR") is an unrelated user-research SaaS product that ranks highly for "Rally roles and permissions" and *does* advertise 6 default roles and custom roles with "dozens of granular permissions". That is **not** Broadcom Rally. Every claim on that domain was excluded. If a future reader finds a source claiming Rally has custom roles, check the domain first — this is almost certainly the confusion.

---

## 1. Permission tiers and roles

Rally has **three permission tiers**, plus a set of orthogonal per-user capability flags. The tiers are not a single role enum — they are two separate permission objects plus boolean flags on `User`.

### Tier 1 — Subscription

Subscription Administrator is **not** a permission row. It is a boolean on the `User` object.

- `"Subscription Admin  Select this check box if the user is a subscription administrator."` [DOC] — [Managing Users PDF, p.8 / User Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/user-fields.html)
- Set via API as `"SubscriptionAdmin":true` against the `setpermissionflags` endpoint [API] — [KB 47760](https://knowledge.broadcom.com/external/article/47760/how-to-create-and-update-rally-projectpe.html)

### Tier 2 — Workspace (`WorkspacePermission.Role`)

| UI name | API `Role` value | Documented access rights |
|---|---|---|
| No Access | *(absence of row)* | `"No visibility to the workspace or projects in the workspace."` |
| User | `User` | `"Access to the workspace. Set additional permissions for each project in the workspace."` |
| Workspace Admin | `Admin` | `"Adds workspace administrator permissions for the user."` |

[DOC] — [Set User Access Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html); [API] role values — [KB 111599](https://knowledge.broadcom.com/external/article/111599/web-services-api-how-to-get-all-workspac.html): `"there are 2 permissions for Workspaces: User and Admin"`.

### Tier 3 — Project (`ProjectPermission.Role`)

| UI name | API `Role` value | Documented access rights |
|---|---|---|
| No Access | *(absence of row)* | `"No visibility to the project (Default value for each user)."` |
| Viewer | `Viewer` | `"Access to view the project and all work items within the project."` |
| Editor | `Editor` | `"Access to create, edit, and delete all work items inside the project. Create, edit, and delete milestones."` |
| Project Admin | `Admin` | project settings access; `"Ability to create child projects."`; `"Edit viewer, editor, and team member permissions in administrated projects."`; may create users if subscription admin enables it; `"Cannot delete users."` |

[DOC] — [Set User Access Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html); [API] role values — [KB 111601](https://knowledge.broadcom.com/external/article/111601/rally-web-services-api-how-to-get-all-p.html): `"The specific level of permission ('Viewer', 'Editor' or 'Admin') is kept on the Role field."`

### Orthogonal capability flags (not tiers, not roles)

These are booleans on `User` that cut across the tier model — Rally's escape hatch instead of custom roles:

- **Timebox Admin** — `"A timebox admin has permissions to create, edit, or delete release or iteration timeboxes."` Only appears when the workspace has *Restrict Timebox Management* enabled. [DOC]
- **Planner** — `"Select this check box if the user is a planner and can create capacity plans for a delivery group."` [DOC]
- **Investment Admin** — `"Select this check box if the user can have view and edit access to all investments fields."` [DOC]
- **Team Member** — a checkbox next to the project Permission field; see Q4. [DOC]

All from [Managing Users PDF](https://techdocs.broadcom.com/content/dam/broadcom/techdocs/us/en/dita/ca-enterprise-software/valueops/rally-help/attachments/rally-managing-users.pdf) (p.8) / [User Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/user-fields.html).

### One global invariant worth stealing

`"You cannot view or edit a user if you have lesser permissions than that user. For example, a workspace administrator cannot edit or view a subscription administrator."` [DOC] — [Set User Access Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html)

**Our clone: DIVERGES.** We have 3 roles across 2 tiers where Rally has 7 named levels across 3 tiers plus 4 capability flags; critically we lack both `Viewer` and an explicit `No Access` default. Consequence: we have no way to express "read-only stakeholder" or "this user must not see this project", which are the two most common real-world Rally configurations.

**Our clone (`PLATFORM_ADMIN_EMAILS`): the *concept* MATCHES, the *mechanism* is an INVENTION.** Rally genuinely has a subscription-tier admin above workspace admin, and it genuinely is a boolean flag rather than a scoped grant — so a platform-admin tier is Rally-legitimate. Deriving it from an env-var email list at SSO time is not; Rally stores it as data on `User`. Consequence: our elevation is invisible to the admin UI and unauditable.

---

## 2. Scoping mechanics

**Rally attaches permissions with one row per (user, scope) pair, and project rows are the load-bearing ones.**

- `ProjectPermission` is a **per-project row**: `"A combination of the User, the Project and the Workspace will constitute a unique entry in this"` endpoint. [DOC/API] — [KB 111601](https://knowledge.broadcom.com/external/article/111601/rally-web-services-api-how-to-get-all-p.html)
- Shape: `{"ProjectPermission": {"Project": {"_ref": "/project/<OID>"}, "Role": "Viewer", "User": {"_ref": "/user/<OID>"}}}` [API] — [KB 47760](https://knowledge.broadcom.com/external/article/47760/how-to-create-and-update-rally-projectpe.html)
- `WorkspacePermission` is a per-workspace row with `Role` in {`User`, `Admin`}. [API] — [KB 111599](https://knowledge.broadcom.com/external/article/111599/web-services-api-how-to-get-all-workspac.html)
- The permission objects are `"UserPermission (abstract), WorkspacePermission and ProjectPermission"`. [DOC] — [WSAPI User Creation and Management](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api/user-creation-and-management.html)

### Can one user hold different roles in different projects simultaneously? **Yes — this is the normal case.**

`"The left-hand pane lists the Workspaces to which the user has access, and the right-hand pane lists the Projects within that Workspace and the user's permission level for each Project."` [DOC] — [Editing User Project Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/editing-user-project-permissions.html)

### Does a workspace-level role grant every project in the workspace? **Only for Workspace Admin. Not for workspace `User`.**

This is the single most important finding for our bug. The implication runs **upward, not downward**:

- Workspace `User` explicitly does *not* confer project access — it only makes you eligible: `"Access to the workspace. Set additional permissions for each project in the workspace."` [DOC]
- And the grant direction is bottom-up: `"Adding a user to a project automatically provides user access to the workspace."` [DOC] — [Set User Access Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html)
- Workspace Admin *does* get workspace-wide reach: `"Viewing all projects is limited to subscription and workspace administrators."` [DOC] — [Set Up Your Projects (Teams)](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/set-up-your-projects-teams.html)

So Rally's rule is: **workspace membership is a prerequisite, project permission is the authorization.** Default project state is No Access.

**Our clone: DIVERGES, and it is precisely inverted.** We grant `project_member` at *workspace* scope and then union all workspace-scoped grants into every project — implementing exactly the downward implication Rally documents as not existing, while never writing the per-project rows that Rally treats as the actual authorization. Consequence: our production state is not "Rally with scoping switched off"; it is a different and strictly more permissive model, and the fix is a data migration (workspace grant → N project grants), not a resolver tweak.

---

## 3. Project hierarchy inheritance

**Permissions do not cascade down the project hierarchy automatically. Rally makes cascade an explicit, opt-in, copy-at-creation operation.**

- Copying is opt-in and off by default: `"Copy all Users (with existing permissions from) the parent Team: Select Yes to copy all users (with existing permissions) from the parent project. This field is set to No by default."` [DOC] — [Create a Child Project](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/set-up-your-projects-teams/admin-create-a-child-project.html)
- Note this is a **copy**, not an inheritance link — it happens once, at creation, asynchronously. Later parent changes do not propagate. [DOC, same page]
- Admin *authority* does follow the hierarchy downward for creation: `"Project administrators can create child projects under projects that they administer."` [DOC, same page]
- One documented case where a grant *is* cascaded: `"New users are created with project administrator level access for the project from which the new user was invited, including all child projects."` [DOC] — [Managing Users PDF](https://techdocs.broadcom.com/content/dam/broadcom/techdocs/us/en/dita/ca-enterprise-software/valueops/rally-help/attachments/rally-managing-users.pdf) (p.16, Invite Users)
- Lifecycle *does* cascade: `"When closing a project, all child projects must also be closed."` [DOC] — [Close Projects and Workspaces](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/close-projects-and-workspaces.html)
- Community thread title corroborates that users are surprised by the *absence* of inheritance: [Milestones: Child Projects NOT Automatically Inheriting from Parent](https://community.broadcom.com/enterprisesoftware/communities/community-home/digestviewer/viewthread?MessageKey=f90a5da6-aa1e-4777-976a-893a32ddb6af&CommunityKey=f303f769-8d4c-44d9-924c-3845bba6444e&tab=digestviewer) [COMM]

### Interaction with the project picker's "including child projects"

Project scoping is a **query/view concern, orthogonal to permission**. It narrows what you see; it never widens what you may see.

- `projectScopeUp` / `projectScopeDown` are booleans: `"These parameters control whether parent or child projects are included in the search space."` and `"When not specified, they default to the setting of the user in the Project Picker."` [DOC] — [WSAPI Project Scoping](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api/project-scoping.html)
- UI equivalent: `"If the Child Projects check box is selected, your view displays all work items in your current project and all other projects below it in the project tree."` [DOC] — [Viewing Multiple Projects at Once](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/using-rally/customizing-pages-and-views/controlling-what-projects-you-see/viewing-multiple-projects-at-once.html)
- **[NONE]** No Broadcom page explicitly states that scope-down is intersected with the user's permission set. It is *inferred* from the No Access definition (`"No visibility to the project"`) that a scoped-down query cannot surface work items from a project you have No Access to. Worth empirical verification before we rely on it.

**Our clone: INVENTION by omission.** We have no parent/child permission semantics at all — neither the opt-in copy nor the "admin of parent may create children" rule. Consequence: when we do turn on project scoping, admins will have to grant every leaf project by hand, which is the workflow Rally's copy-at-creation option exists to avoid.

---

## 4. Team scope — **BA DECISION: `team` is NOT a Rally authorization dimension**

This is the highest-confidence negative finding in the report. In Rally, **project *is* the team.** "Team" is a UI synonym for project, not a separate entity and not a separate scope.

### Evidence that project == team

- The canonical membership page is literally titled **"Managing Project (Team) Membership"**, and opens: `"Projects in Rally are primarily used to represent development teams."` [DOC] — [Managing Project (Team) Membership](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/set-up-your-projects-teams/managing-project-team-membership.html)
- The whole documentation section is titled **"Set Up Your Projects (Teams)"**. [DOC] — [section index](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/set-up-your-projects-teams.html)
- Rally's own UI copy uses "Team" where the data model says project — e.g. the child-project field `"Copy all Users (with existing permissions from) the parent Team"` is a *project* field. [DOC]
- **Schema-level proof:** the `TeamMemberships` collection on `User` contains **project references**: `POST /user/<USER_OID>/teammemberships/add` with `{"CollectionItems":[{"_ref":"/project/<PROJECT_OID>"}]}`. There is no `Team` object. [API] — [KB 47760](https://knowledge.broadcom.com/external/article/47760/how-to-create-and-update-rally-projectpe.html)

### Evidence that Team Member is a flag, not an authorization level

- It is a checkbox *beside* the Permission field, not a value *of* it: `"Team Member (check box next to Permission field in user editor window)"`. [DOC]
- Its documented effects are entirely presentational plus one convenience side-effect:
  - `"When checked, user is automatically set as an editor in the project."`
  - `"Username appears at the top of drop-down list under Team Members section, when editing the Owner field of work items."`
  - `"User appears in the project Team Status page."` [DOC]
- It cannot *reduce* access, and it presupposes Editor: `"Users must be at least an editor in order to be a team member."` [DOC]
- It is decoupled from authorization in both directions: `"You can manage team member status separately from project permissions."` and unchecking it does not change permissions. [DOC]
- Project Admins may edit it as if it were a permission: `"Edit viewer, editor, and team member permissions in administrated projects."` [DOC] — [Set User Access Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html)

All Team Member quotes: [Managing Project (Team) Membership](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/set-up-your-projects-teams/managing-project-team-membership.html) and [Set User Access Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html).

### Verdict

**Our clone: MATCHES Rally — the SRS is the thing that diverges.** Our scope enum `global|workspace|project` with no team scope is exactly Rally's shape. The SRS requirement *"Project Member sees only Teams assigned by Workspace Admin"* has **no Rally basis as an authorization rule**; if "Team" in that sentence is read as "Project" (which is what Rally means by it), the requirement is already satisfiable with per-project `ProjectPermission` rows — which is Q2's fix, not a new scope.

Consequence: **do not add a `team` scope to the schema.** Close the BA item by (a) renaming "Team" to "Project" in the SRS or documenting them as synonyms, and (b) if we want the Owner-dropdown/Team-Status affordance, model it as Rally does — a boolean `isTeamMember` flag on the existing project membership row that implies Editor, never a scope.

---

## 5. Viewer vs Editor

**Viewer is read-only at project granularity, and No Access is a genuinely separate state that is also the default.**

- Viewer: `"Access to view the project and all work items within the project."` [DOC]
- Editor: `"Access to create, edit, and delete all work items inside the project. Create, edit, and delete milestones."` [DOC]
- No Access, separate and default: `"No visibility to the project (Default value for each user)."` [DOC] — all three from [Set User Access Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html)
- There is also a workspace-level No Access: `"No visibility to the workspace or projects in the workspace."` [DOC]

What a Viewer specifically *cannot* do, beyond the obvious:

- Cannot be a team member — `"Users must be at least an editor in order to be a team member."` [DOC]
- Cannot tag work items — `"Viewers wouldn't be able to tag the items."` — West Blair, Broadcom [COMM] — [User Permissions thread](https://community.broadcom.com/communities/community-home/digestviewer/viewthread?MID=796981)
- Viewer is all-or-nothing per project: there is no partial-read. Read access is granted at project granularity, and (per Q6) there is no field- or type-level restriction.

Default for a newly created user is the *bottom* of the ladder, not the middle: `"A newly created user will have Workspace User and Project Viewer permissions according to the subscription administrator's default workspace and project."` [DOC] — [Set User Access Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html). Corroborated as observed API behavior: [KB 138717 — "Users created via API get viewer permission to creator's default Rally projects"](https://knowledge.broadcom.com/external/article/138717/users-created-via-api-get-viewer-permiss.html)

**Our clone: DIVERGES — two missing states, and the default is at the wrong end.** We have no Viewer and no No Access, and our SSO default is an editor-equivalent (`project_member`) at workspace scope. Rally's default is Viewer on one default project. Consequence: we cannot onboard a read-only stakeholder at all, and our provisioning default is the maximally permissive choice where Rally's is near-minimal.

---

## 6. Editable permission matrix — **BA DECISION: Rally has NO role×action matrix. Roles are fixed built-ins.**

This is the second decisive finding. Rally does **not** expose an admin-editable role×action grid, does not support custom roles, and explicitly does not support sub-artifact permission granularity.

### Direct statements from Broadcom employees

- `"The permissions currently only allow View, Editor, and some different types of administrators. Anyone with Editor privileges would be able to make the changes, and Viewers wouldn't be able to tag the items."` — West Blair, Broadcom [COMM]
- `"There isn't a granularity of the permission to allow a user to update only parts of an artifact or certain types of artifacts."` — Sagi Gabay, Broadcom [COMM]

Both from [User Permissions | Rally Software](https://community.broadcom.com/communities/community-home/digestviewer/viewthread?MID=796981) — the asker wanted exactly what our BA's grid would provide (let a group tag items but not edit stories/defects) and was told it is not possible.

### The complete set of things Rally lets an admin configure about permissions

Not a matrix — a handful of named delegation toggles:

| Toggle | Tier | Documented text |
|---|---|---|
| Purge Recycle Bin | Workspace | `"Select the Enable check box. Enter the number of days to keep items in the Recycle Bin before purging."` |
| Restrict Timebox Management | Workspace | `"Select Yes to enable... the ability to edit timeboxes is limited to subscription and workspace administrators."` |
| Project Admins Can Manage Work Rules | Workspace | `"Select Yes to enable. When enabled, project administrators are able to create and edit work rules."` |
| Project admins may create users | Subscription | `"If enabled by the subscription administrator, can create new users (may only enable permissions in administrated projects)."` |
| Workspace admins may invite users | Subscription | `"Subscription administrators can also enable this feature so that a workspace administrator can invite new users."` |
| Default access for new users | Workspace | `"Workspace and subscription administrators can set a preferred permission default for new users created within a workspace."` |

Sources: [Configure Admin Capabilities](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customize-workspace-details/configure-admin-capabilities.html) (first three), [Set User Access Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html) and [Managing Users PDF](https://techdocs.broadcom.com/content/dam/broadcom/techdocs/us/en/dita/ca-enterprise-software/valueops/rally-help/attachments/rally-managing-users.pdf) (rest). All [DOC].

Plus the four per-user capability flags from Q1 (Timebox Admin, Planner, Investment Admin, Team Member) — Rally's actual answer to "we need finer granularity" is **to ship a new named boolean**, not to expose a configurable grid.

### The near-miss that is not a permission feature

Rally has per-project **field visibility** ("Visibility in Teams"), which superficially resembles a per-screen-per-field grid:

- `"Use the Visibility in Teams field to control which projects have access to use the field."` [DOC] — [Manage Custom Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/manage-fields-for-workspaces/manage-custom-fields.html)
- But it is keyed by **project, not by role**, it is documented as a decluttering/config feature rather than access control, and no Broadcom page frames it as a security boundary. Required-ness overrides it and is workspace-global: `"If you create a custom field as required, it is visible and the field is required in all open projects."` [DOC]

### Verdict

**Our clone: INVENTION — and so is the BA's proposal, more so.** Rally has no role×action matrix at any granularity. Our existing 3-state (`full|view|none`) × ~19-row admin matrix is *already more configurable than Rally*. The BA's 4-state E/R/D/H per-screen×per-action grid would be a large multiple of Rally's actual surface area.

Consequence for the standing dispute: **the Rally evidence does not support building the E/R/D/H grid.** If the grid is retained it must be justified as a deliberate product improvement over Rally, with an owner for the combinatorial test burden — not as Rally parity. The Rally-faithful design is a fixed role ladder (No Access / Viewer / Editor / Project Admin / Workspace Admin / Subscription Admin) plus a short, named, hand-audited list of delegation toggles. Note also that a matrix is only *meaningful* once Q2 is fixed; today it grids over roles that all resolve to the same effective access.

---

## 7. Effective time of permission changes

**[NONE] — no authoritative source found stating whether Rally permission changes are immediate, next-request, or next-login.** No techdocs or KB page addresses the semantics directly. What the evidence does show is that Rally has **session-cached state that goes stale**, and that the documented remedy is forcing a re-login:

- The failure mode is documented: after `"an administrator making a change to the user's project permissions"`, users see a Permission Error, because `"The project that is bookmarked (or was being accessed) is no longer available for the user"`. Recommended resolution includes `"Disable user sessions"` and navigating `"without using a bookmark/link"`. [DOC] — [KB 57529](https://knowledge.broadcom.com/external/article/57529/rally-users-seeing-a-permission-error-wh.html)
- Forced logout is an explicit admin tool: `"You can automatically log a user out of all of their existing sessions by using the Delete Sessions option. You must be a subscription administrator to delete user sessions."` [DOC] — [Disable, Delete, or Unlock a User](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/disable-delete-or-unlock-a-user.html)
- Permission-changing pages say nothing about timing: [Editing User Project Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/editing-user-project-permissions.html) and [KB 112109](https://knowledge.broadcom.com/external/article/112109/rally-users-need-to-access-project-or-up.html) are both silent.

Best available reading, labelled as inference: revocation is enforced server-side on subsequent requests (hence the Permission Error rather than silent continued access), but client-side/session state such as the project picker's current project and default-project preference is cached and can misbehave until re-login. Rally's answer is an admin-triggered session purge rather than a cache-invalidation guarantee.

**Our clone: MATCHES on the dimension that matters, and is arguably better.** Our next-request enforcement via cache invalidation is consistent with Rally's server-side behavior, and we avoid the stale-session class of bug that KB 57529 exists to explain. Consequence: no change needed; but if we ever add a client-side permission cache or a "current project" preference, KB 57529 is the bug report we will reproduce.

---

## 8. Specific action gates

| Action | Minimum Rally role | Evidence |
|---|---|---|
| Create **top-level** project | Workspace Admin (or Subscription Admin) | `"You must be a subscription or a workspace administrator to create a project."` [DOC] — [Create a Project for Your Workspace](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/create-a-project-for-your-workspace.html) |
| Create **child** project | Project Admin *of the parent* | `"Project administrators can create child projects under projects that they administer."` [DOC] — [Create a Child Project](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/set-up-your-projects-teams/admin-create-a-child-project.html) |
| **Delete** a project | **Impossible — feature does not exist** | `"You cannot delete workspaces or projects. However, closing projects or workspaces can have the same effect."` [DOC] — [Close Projects and Workspaces](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/close-projects-and-workspaces.html); corroborated `"In Rally, there is no direct method to delete a project or workspace."` [DOC] — [KB 47886](https://knowledge.broadcom.com/external/article/47886/rally-deleting-workspaces-and-projects.html) |
| **Archive/close** a project | Project Admin | `"You must be a project, workspace, or subscription administrator"`; also `"Closing a project blocks all edits to work items or timeboxes except to change the project."` and `"When closing a project, all child projects must also be closed."` [DOC] — same page |
| Create/manage **teams** | == create/manage **projects** (see Q4) | Team is a project; gates above apply. Team *membership* flag: Project Admin — `"Edit viewer, editor, and team member permissions in administrated projects."` [DOC] |
| **Invite users** | Subscription Admin; Workspace Admin only if enabled | `"A subscription administrator can quickly invite up to three new users to Rally at a time. Subscription administrators can also enable this feature so that a workspace administrator can invite new users."` [DOC] — [Managing Users PDF](https://techdocs.broadcom.com/content/dam/broadcom/techdocs/us/en/dita/ca-enterprise-software/valueops/rally-help/attachments/rally-managing-users.pdf) p.16 |
| **Create users** | Subscription/Workspace Admin; Project Admin only if enabled | `"Only Subscription Administrators and Workspace Administrators are allowed to create Users."` + `"If enabled by the subscription administrator, can create new users"`; and Project Admin `"Cannot delete users."` [DOC] |
| **Assign a work item to a Release** | **Editor** | Editor has `"Access to create, edit, and delete all work items inside the project."` [DOC]. *Restrict Timebox Management* restricts CRUD on the timebox **object**, not assignment: `"only subscription administrators, workspace administrators, or users with the timebox admin permission can create, update, or delete release or iteration timeboxes"` [DOC] — [Managing Releases](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/planning/planning-with-timeboxes/timebox-based-planning/working-with-releases/managing-releases.html). **[NONE]/inferred:** no page states it blocks setting the Release field on a story — worth live verification. Default is off: `"By default, the Restrict Timebox Management feature is not enabled."` [DOC] |
| Edit **workflow states** — *Flow States* (board columns, project-scoped) | **Project Admin** (Editors excluded) | `"Subscription administrators, workspace administrators, and project administrators can edit the settings of a board from the Settings page."` [DOC] — [Set Up Your Team Board](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/set-up-your-team-board.html) |
| Edit **workflow states** — *Schedule State* (workspace-scoped) | **Workspace Admin**, and mostly immutable | `"Flow states are scoped to a project while schedule states are workspace-scoped."` and `"schedule states are workspace specific and cannot be changed at the project (team) level."` [DOC] — [Customize the Flow State Columns](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/team-board-page/customize-the-flow-state-columns-on-your-team-board.html). Only 2 custom slots: `"Four of the values are non-modifiable (they cannot be edited or disabled): Defined, In-Progress, Completed, Accepted."` [DOC] — [Modifying Schedule States](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/modifying-schedule-states.html). Role inferred from `"As the subscription or workspace administrator, you can manage, create, or edit fields"` [DOC] — [Manage Fields for Workspaces](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/manage-fields-for-workspaces.html) |
| View **work-item** revision history | **[NONE] — no role restriction documented**; inferred Viewer | [View Revision History](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/tracking/additional-tracking-pages/view-revision-history.html) documents procedure and columns but states no permission requirement. Inferred from Viewer = `"view the project and all work items within the project."` |
| View **project** revision history | Project edit permission (Project Admin) | It lives on the admin Setup page: `"The Setup icon displays next to projects where you have permission to edit."` [DOC] — [View the Revision History for Projects](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/set-up-your-projects-teams/view-the-revision-history-for-projects.html) |
| Create custom fields | Subscription/Workspace Admin | `"You must be a subscription or workspace administrator to create custom fields."` [DOC] — [Manage Custom Fields](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/manage-fields-for-workspaces/manage-custom-fields.html) |

### Two SRS complaints that Rally resolves in the clone's favor

- **"Project Member can assign a work item to a Release (SRS forbids)."** Rally lets an **Editor** do this; a project member is our Editor equivalent. **Our clone: MATCHES Rally — the SRS rule is the invention.** Consequence: don't build the block; instead consider Rally's actual control, a `Restrict Timebox Management` workspace toggle plus a Timebox Admin flag, which restricts editing the Release *object*.
- **"Project Admin can edit workflow statuses and labels (SRS says deferred)."** Rally lets Project Admin edit **project-scoped Flow States**, but *not* workspace-scoped Schedule States. **Our clone: PARTIALLY MATCHES.** Consequence: keep Project Admin editing of project-scoped board states; ensure no Project Admin path can mutate a workspace-wide status set, and note Rally hard-codes four core schedule states.

**Our clone otherwise: DIVERGES on delete semantics.** Rally has no project delete at all — only close, with a mandatory child-cascade and an edit-lock. Consequence: if we expose project delete, we are inventing a destructive operation Rally deliberately does not have; `archive`/`close` with child cascade is the faithful model.

---

## 9. Cross-project read

**A Rally Project Administrator cannot see projects they don't administer — not even read-only. Cross-workspace visibility is an admin-tier privilege only.**

- `"As a project administrator, you can only see project hierarchies that you have been given access"`, and cannot navigate to a project's details page `"if you do not have project administrator permission for that project."` [DOC] — [Set Up Your Projects (Teams)](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/set-up-your-projects-teams.html) (also the "View All Projects as a Workspace Administrator or Subscription Administrator" child page; note that page's direct URL currently returns HTTP 404 — the text is quoted from the section index)
- `"Viewing all projects is limited to subscription and workspace administrators."` [DOC] — same page
- A user with No Access to a project sees nothing of it: `"No visibility to the project (Default value for each user)."` [DOC] — [Set User Access Permissions](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-users/creating-and-editing-users/set-user-access-permissions.html)
- Even admin *search* is filtered: workspace-admin user search `"does not display information for closed projects or closed workspaces"` [DOC] — [KB 236983](https://knowledge.broadcom.com/external/article/236983/rally-administration-search-for-users-wi.html)
- **Can a project member see other projects in the workspace at all?** Only those where they hold a `ProjectPermission` row. Workspace `User` grants workspace access but explicitly requires per-project permissions (Q2). Rally's aggregate/rollup views work by scoping *within* the permitted set (Q3), not by granting extra read.

**Our clone: MATCHES Rally. The SRS requirement is the invention.** Our behavior — Project Admin cannot see projects they don't administer — is exactly what Rally documents. The SRS demand that Project Admins get read-only visibility into non-administered projects has **no Rally basis**; in Rally, read-only cross-project visibility is achieved by granting an explicit `Viewer` `ProjectPermission` row, which is a per-project grant, not a role capability. Consequence: close this SRS item as "works as designed"; the real gap it is groping toward is that we have no `Viewer` role to grant (Q5) and no per-project grants to grant it with (Q2).

---

## Recommended changes, ranked by confidence in the Rally evidence

### Tier 1 — Very high confidence (multiple direct [DOC] quotes; safe to act on now)

1. **Stop granting at workspace scope; write per-project `ProjectPermission`-equivalent rows.** Rally's implication direction is bottom-up (project grant ⇒ workspace access), never top-down. Migrate existing workspace-scoped `project_member` grants into explicit per-project grants and remove the "union all workspace grants into every project" resolver rule. This is the production bug; everything else is cosmetic until it is fixed. *(Q2)*
2. **Do NOT add a `team` scope. Close the SRS "team-level authorization" item.** Rally has no `Team` object; `TeamMemberships` is a collection of *project* refs, and Team Member is a presentational boolean that implies Editor. If the affordance is wanted, add `isTeamMember: boolean` to the project membership row. *(Q4)*
3. **Do NOT build the E/R/D/H per-screen×per-action grid as Rally parity.** Two Broadcom employees state on the record that Rally has no such granularity. Our existing 3-state matrix already exceeds Rally. If the grid survives, it must be owned as a deliberate product bet, not a parity requirement. *(Q6)*
4. **Close the SRS item "Project Admin should see non-administered projects read-only."** Rally explicitly denies this. The Rally way to get read-only cross-project visibility is an explicit per-project Viewer grant. *(Q9)*
5. **Add a `Viewer` (read-only) role and an explicit `no_access` default.** These are the two most-used states in real Rally and we have neither; `no_access` is Rally's documented per-project default. *(Q1, Q5)*
6. **Replace project delete with archive/close, cascading to children and locking edits.** Rally cannot delete projects at all. *(Q8)*

### Tier 2 — High confidence (clear [DOC] basis, but a product choice remains)

7. **Drop the SRS rule forbidding Project Member from assigning to a Release.** Rally's Editor can do this. If the control is genuinely needed, implement Rally's actual mechanism: a workspace `Restrict Timebox Management` toggle plus a `Timebox Admin` per-user flag governing CRUD on the Release/Iteration object. *(Q8)*
8. **Split workflow-state editing by scope.** Allow Project Admin to edit project-scoped board/flow states; require Workspace Admin for the workspace-wide status set. Consider making a core subset of statuses non-deletable, as Rally does with Defined/In-Progress/Completed/Accepted. *(Q8)*
9. **Model Subscription Admin as stored data, not an env var.** Rally's `User.SubscriptionAdmin` boolean is the precedent; `PLATFORM_ADMIN_EMAILS` makes our highest privilege invisible to the admin UI and to audit. *(Q1)*
10. **Adopt the "cannot view or edit a user with greater permissions than yourself" invariant.** Cheap, documented, and prevents privilege-escalation-by-user-editor. *(Q1)*
11. **Add opt-in "copy permissions from parent project" at child-project creation, defaulting to off.** This is Rally's one concession to hierarchy, and it will be needed operationally once (1) lands. *(Q3)*

### Tier 3 — Moderate / low confidence (thin or inferred evidence — verify before building)

12. **Keep next-request permission enforcement.** Consistent with Rally's server-side behavior and avoids Rally's documented stale-session bug class — but Rally never states its own semantics, so this is inference, not parity. *(Q7)*
13. **Treat project scoping (scope up/down) as a filter intersected with the permitted project set.** Strongly implied by the No Access definition but never stated; verify empirically. *(Q3)*
14. **Leave work-item revision history visible to any user who can read the work item; gate project-level revision history behind project admin.** The project-level half is documented; the work-item half is inferred from the Viewer definition. *(Q8)*
15. **Do not model field-level visibility as a security boundary.** Rally's "Visibility in Teams" is keyed by project, not role, and is never framed as access control. If we want it, it is a UX decluttering feature. *(Q6)*

### Open items requiring empirical verification against a live Rally tenant

- Whether `Restrict Timebox Management` blocks *assigning* a story to a Release, or only CRUD on the Release object. *(Q8)*
- Whether a Viewer can open work-item revision history. *(Q8)*
- Whether scope-down surfaces work items from child projects the user has No Access to. *(Q3)*
- The exact role required to change per-project field visibility. *(Q6)*

### Note on WSAPI writability

Older WSAPI docs state `"To change user permissions, use the graphical applications in Rally tools. UserPermission will be enhanced in the future to allow modification of user permissions."` [DOC] — [WSAPI User Creation and Management](https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/reference/rally-web-services-api/user-creation-and-management.html). This is contradicted in practice by KB articles documenting `POST` creation of `ProjectPermission`/`WorkspacePermission` and a `setpermissionflags` endpoint ([KB 47760](https://knowledge.broadcom.com/external/article/47760/how-to-create-and-update-rally-projectpe.html), [KB 374424](https://knowledge.broadcom.com/external/article/374424/rally-user-permission-management-using-r.html)) and by the official [RallyTools/Rally-User-Management](https://github.com/RallyTools/Rally-User-Management/blob/master/lib/permissions_utility.rb) tooling. Treat the WSAPI reference page as stale; permissions are API-writable.
