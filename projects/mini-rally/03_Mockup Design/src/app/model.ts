export type Role = "Workspace Admin" | "Project Admin" | "Project Member";
export type Page = "home" | "projects" | "backlog" | "iterations" | "track" | "teamBoard" | "teamStatus" | "quality" | "portfolio" | "releasePlanning" | "releases" | "reports" | "notifications" | "settings";
export type WorkItemType = "Story" | "Defect" | "Task" | "Feature";
export type StatusType = "Idea" | "Defined" | "In-Progress" | "Completed" | "Accepted" | "Release";
export type TaskState = "Defined" | "In-Progress" | "Completed";
export type PriorityType = "Critical" | "High" | "Medium" | "Low";
export type MilestoneState = "Planned" | "At Risk" | "Met" | "Missed" | "Cancelled" | "Completed";

export interface Owner { name: string; initials: string; color: string; }
export interface WorkItem {
  id: string; type: WorkItemType; title: string;
  status: StatusType; priority: PriorityType; owner: Owner;
  planEstimate: number; taskCount: number; completedTasks: number;
  taskEstimate?: number; todoEstimate?: number;
  iteration: string; release: string; releaseId?: string; milestoneIds?: string[]; tags: string[];
  description: string; lastUpdated: string; dueDate?: string;
  blocked?: boolean; defectCount?: number; commentCount?: number;
  attachmentCount?: number; project?: string; team?: string; rank?: number;
}
export interface Notification {
  id: number; type: "assigned" | "mention";
  title: string; body: string; time: string; read: boolean; user: Owner; project?: string; workItemId: string;
}
export interface TaskItem {
  id: string; parentWorkItemId: string; rank: number; name: string;
  state: TaskState; owner: Owner; project: string; team: string;
  estimate: number; todo: number; actuals: number;
  description: string; notes: string; attachments: string[];
}
export interface NewWorkItemInput {
  type: "Story" | "Defect";
  title: string;
  project: string;
  team: string;
  owner: Owner;
  planEstimate: number;
  iteration?: string;
  release?: string;
  releaseId?: string;
}
export interface NewTaskInput {
  name: string;
  owner: Owner;
  estimate: number;
}
export interface NewIterationInput {
  name: string;
  theme: string;
  projectKey: string;
  team: string;
  startDate: string;
  endDate: string;
  state: IterationItem["state"];
}
export interface NewReleaseInput {
  name: string; description: string; projectKey: string; team: string;
  startDate: string; releaseDate: string; status: ReleaseItem["status"];
}
export interface NewMilestoneInput {
  name: string; description: string; projectKeys: string[]; teams: string[];
  releaseIds: string[]; startDate: string; endDate: string; state: MilestoneState; owner: Owner;
}
export interface Feature {
  id: string; title: string; status: StatusType; priority: PriorityType;
  owner: Owner; release: string; planEstimate: number; acceptedEstimate: number;
  storyCount: number; completedStories: number;
}
export interface Project {
  key: string; name: string; activeSprint: string; progress: number;
  openDefects: number; blocked: number; owner: Owner;
}
export interface ScopeProject { key: string; name: string; teams: string[]; }
export interface Initiative {
  id: string; title: string; type: "Initiative";
  status: StatusType; priority: PriorityType; owner: Owner;
  release: string; planEstimate: number; featureIds: string[];
  blockedCount: number; relatedCount: number; updatedAt: string;
}
export interface ReleaseItem {
  id: string; name: string; version: string;
  status: "Planning" | "Active" | "Accepted";
  startDate: string; releaseDate: string; progress: number;
  totalItems: number; completedItems: number; openDefects: number; blockedItems: number;
  owner: Owner; description: string;
  projectKey: string; team: string;
}
export interface MilestoneItem {
  id: string; name: string; description: string; state: MilestoneState;
  releaseIds: string[]; projectKeys: string[]; teams: string[];
  manualStartDate: string; manualEndDate: string;
  owner: Owner;
}
export interface IterationItem {
  id: string; name: string; theme: string; state: "Planning" | "Committed" | "Accepted";
  projectKey: string; team: string; startDate: string; endDate: string;
  project: string; plannedVelocity: number; taskEstimate: number;
  capacity: number; plannedPoints: number; acceptedPoints: number;
  itemCount: number; defectCount: number; blockedCount: number;
  owner: Owner; goal: string; history: string[];
}
export interface WorkspaceUser {
  name: string; email: string; role: Role;
  status: "Active" | "Invited" | "Suspended";
  lastLogin: string; owner: Owner;
}
export interface WorkflowStatusItem {
  id: string; name: string; category: "To Do" | "In Progress" | "Done";
  order: number; isFinal: boolean;
}
export interface LabelItem { id: string; name: string; color: string; usage: number; }

// ─── Permissions ──────────────────────────────────────────────────────────────

export const can = {
  create: (_r: Role) => true,
  edit: (_r: Role) => true,
  delete: (_r: Role) => true,
  manageUsers: (r: Role) => r === "Workspace Admin",
  manageSprints: (r: Role) => r !== "Project Member",
  manageBacklog: (_r: Role) => true,
  manageSettings: (r: Role) => r !== "Project Member",
  manageRoles: (r: Role) => r === "Workspace Admin",
  createDefects: (r: Role) => r !== "Project Member",
  viewAdmin: (r: Role) => r === "Workspace Admin",
  dragBoard: (r: Role) => r !== "Project Member",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

export const OWNERS: Owner[] = [
  { name: "Marcus Webb", initials: "MW", color: "#2d5896" },
  { name: "Sarah Chen", initials: "SC", color: "#3d7a4e" },
  { name: "James Okafor", initials: "JO", color: "#7a4e3d" },
  { name: "Priya Nair", initials: "PN", color: "#5c4a87" },
  { name: "Tom Brennan", initials: "TB", color: "#7a6a2d" },
];

export const PROJECTS: Project[] = [
  { key: "NXP", name: "Nexus Platform 2025", activeSprint: "Sprint 24.3", progress: 34, openDefects: 3, blocked: 1, owner: OWNERS[0] },
  { key: "MOB", name: "Mobile App MVP", activeSprint: "Sprint M.1", progress: 18, openDefects: 1, blocked: 0, owner: OWNERS[3] },
  { key: "INF", name: "Infrastructure Refresh", activeSprint: "Sprint I.4", progress: 72, openDefects: 0, blocked: 2, owner: OWNERS[2] },
  { key: "REP", name: "Analytics & Reporting Suite", activeSprint: "Sprint A.2", progress: 45, openDefects: 2, blocked: 0, owner: OWNERS[1] },
];

export const SCOPE_PROJECTS: ScopeProject[] = [
  { key: "NXP", name: "Nexus Platform 2025", teams: ["Core Platform", "Identity & Access", "Data & Reporting"] },
  { key: "MOB", name: "Mobile App MVP", teams: ["Mobile Experience", "Mobile QA"] },
  { key: "INF", name: "Infrastructure Refresh", teams: ["Platform Operations", "Cloud Enablement"] },
  { key: "REP", name: "Analytics & Reporting Suite", teams: ["Analytics", "Data Visualization"] },
];

export const ROLE_SCOPE = {
  projectAdminProjectKeys: ["NXP"],
  projectMemberProjectKey: "NXP",
  projectMemberTeams: ["Core Platform"],
} as const;

export const WORK_ITEMS: WorkItem[] = [
  {
    id: "US-4821", type: "Story", rank: 1,
    title: "Implement SSO authentication via SAML 2.0 for enterprise tenant onboarding",
    status: "In-Progress", priority: "High", owner: OWNERS[0], project: "NXP",
    planEstimate: 8, taskCount: 6, completedTasks: 4, taskEstimate: 16, todoEstimate: 4,
    iteration: "Sprint 24.3", release: "Q4 2024", tags: ["auth", "security"],
    dueDate: "Oct 28, 2024", commentCount: 4, attachmentCount: 2, defectCount: 0,
    description: "Enterprise customers require SAML 2.0 SSO support for automated provisioning through their identity provider. Covers IdP metadata upload, attribute mapping, and session management across tenant boundaries.",
    lastUpdated: "Oct 21, 2024",
  },
  {
    id: "DE-1142", type: "Defect", rank: 2,
    title: "Dashboard widget refresh loop causes memory leak in Firefox 118+",
    status: "Defined", priority: "Critical", owner: OWNERS[1], project: "NXP",
    planEstimate: 3, taskCount: 2, completedTasks: 0, taskEstimate: 6, todoEstimate: 6,
    iteration: "Sprint 24.3", release: "Q4 2024", tags: ["browser-compat", "performance"],
    dueDate: "Oct 25, 2024", commentCount: 6, blocked: true, defectCount: 0,
    description: "When multiple chart widgets are on the same dashboard and auto-refresh is active, Firefox 118+ allocates memory that is never released. Heap snapshot shows detached DOM nodes accumulating after 45 minutes.",
    lastUpdated: "Oct 20, 2024",
  },
  {
    id: "US-4798", type: "Story", rank: 3,
    title: "Bulk export to CSV for work item backlog with custom field mapping",
    status: "Completed", priority: "Medium", owner: OWNERS[2], project: "NXP",
    planEstimate: 5, taskCount: 4, completedTasks: 4, taskEstimate: 10, todoEstimate: 0,
    iteration: "Sprint 24.2", release: "Q4 2024", tags: ["export", "backlog"],
    commentCount: 2, defectCount: 0,
    description: "Users need to export their full backlog to CSV for offline reporting. Supports custom field selection, column ordering, and encoding options for compatibility with Excel and Google Sheets.",
    lastUpdated: "Oct 18, 2024",
  },
  {
    id: "FE-318", type: "Feature", rank: 4,
    title: "Advanced reporting module with configurable KPI dashboards and drill-through",
    status: "In-Progress", priority: "High", owner: OWNERS[3], project: "NXP",
    planEstimate: 21, taskCount: 14, completedTasks: 8, taskEstimate: 42, todoEstimate: 18,
    iteration: "Sprint 24.3", release: "Q1 2025", tags: ["reporting", "dashboards"],
    commentCount: 9, attachmentCount: 4, defectCount: 1,
    description: "New reporting module providing configurable KPI dashboard templates, drill-through capabilities from summary to detail, and scheduled email delivery of report snapshots.",
    lastUpdated: "Oct 22, 2024",
  },
  {
    id: "US-4803", type: "Story", rank: 5,
    title: "Per-user notification preference center with channel routing and digest options",
    status: "Defined", priority: "Low", owner: OWNERS[4], project: "NXP",
    planEstimate: 5, taskCount: 5, completedTasks: 0, taskEstimate: 0, todoEstimate: 0,
    iteration: "Unscheduled", release: "Q1 2025", tags: ["notifications", "ux"],
    commentCount: 1,
    description: "Users receive all notifications via email with no granularity. This story introduces a preference center for channel selection (email, Slack, in-app) and digest schedules per event type.",
    lastUpdated: "Oct 19, 2024",
  },
  {
    id: "TA-2293", type: "Task", rank: 6,
    title: "Upgrade PostgreSQL client library to v15 and execute staged migration scripts",
    status: "Accepted", priority: "Medium", owner: OWNERS[0], project: "NXP",
    planEstimate: 2, taskCount: 1, completedTasks: 1, taskEstimate: 4, todoEstimate: 0,
    iteration: "Sprint 24.2", release: "Q4 2024", tags: ["infrastructure", "database"],
    defectCount: 0,
    description: "Technical upgrade of the pg Node.js driver from v14 to v15 for connection pooling improvements and TLS 1.3 support. Includes staging validation before production apply.",
    lastUpdated: "Oct 15, 2024",
  },
  {
    id: "DE-1138", type: "Defect", rank: 7,
    title: "Sprint velocity chart renders incorrect data when user timezone differs from server",
    status: "In-Progress", priority: "High", owner: OWNERS[1], project: "NXP",
    planEstimate: 3, taskCount: 3, completedTasks: 1, taskEstimate: 8, todoEstimate: 4,
    iteration: "Sprint 24.3", release: "Q4 2024", tags: ["reporting", "timezone"],
    commentCount: 3, defectCount: 0,
    description: "When browser timezone is UTC-5 or earlier, sprint completion dates shift by one day on the velocity chart, causing stories accepted on sprint's last day to appear in the following sprint.",
    lastUpdated: "Oct 21, 2024",
  },
  {
    id: "US-4810", type: "Story", rank: 8,
    title: "Markdown rendering support in work item description and comment fields",
    status: "Defined", priority: "Medium", owner: OWNERS[2], project: "NXP",
    planEstimate: 5, taskCount: 4, completedTasks: 0, taskEstimate: 0, todoEstimate: 0,
    iteration: "Unscheduled", release: "Q1 2025", tags: ["editor", "formatting"],
    description: "Teams rely on code snippets, tables, and formatting in work item descriptions. Adding Markdown support with a toggle between edit and rendered preview modes will improve documentation quality.",
    lastUpdated: "Oct 18, 2024",
  },
  {
    id: "US-4815", type: "Story", rank: 9,
    title: "Real-time collaboration cursor tracking for simultaneous board editing",
    status: "Defined", priority: "Medium", owner: OWNERS[4], project: "NXP",
    planEstimate: 5, taskCount: 4, completedTasks: 0,
    iteration: "Sprint 24.3", release: "Q1 2025", tags: ["collaboration", "realtime"],
    description: "When multiple users have the board open simultaneously, show each user's cursor position and current selection to prevent conflicting edits and improve coordination.",
    lastUpdated: "Oct 19, 2024",
  },
  {
    id: "TA-2297", type: "Task", rank: 10,
    title: "Configure Datadog APM instrumentation across all critical API endpoints",
    status: "In-Progress", priority: "High", owner: OWNERS[0], project: "NXP",
    planEstimate: 3, taskCount: 2, completedTasks: 1, taskEstimate: 6, todoEstimate: 3,
    iteration: "Sprint 24.3", release: "Q4 2024", tags: ["infrastructure", "observability"],
    commentCount: 2,
    description: "Instrument all critical API paths with Datadog APM spans. Establish latency baselines, configure alerting thresholds, and set up service dependency maps in the Datadog UI.",
    lastUpdated: "Oct 22, 2024",
  },
  {
    id: "US-4819", type: "Story", rank: 11,
    title: "Keyboard shortcuts panel accessible via ? key from any page",
    status: "Completed", priority: "Low", owner: OWNERS[2], project: "NXP",
    planEstimate: 2, taskCount: 2, completedTasks: 2, taskEstimate: 4, todoEstimate: 0,
    iteration: "Sprint 24.3", release: "Q4 2024", tags: ["ux", "accessibility"],
    commentCount: 1,
    description: "Power users want keyboard shortcut discovery. Pressing ? on any page should open a modal listing all available shortcuts, grouped by context (global, backlog, board, editor).",
    lastUpdated: "Oct 17, 2024",
  },
  {
    id: "DE-1145", type: "Defect", rank: 12,
    title: "Report export generates corrupt XLSX file for datasets over 10,000 rows",
    status: "Defined", priority: "High", owner: OWNERS[3], project: "NXP",
    planEstimate: 3, taskCount: 2, completedTasks: 0,
    iteration: "Unscheduled", release: "Q4 2024", tags: ["export", "reporting"],
    description: "When exporting reports containing more than 10,000 rows, the resulting XLSX file fails to open in Excel. LibreOffice reports an XML structure error on the shared strings table.",
    lastUpdated: "Oct 20, 2024",
  },
  {
    id: "DE-1139", type: "Defect", rank: 13,
    title: "Email notifications fail when recipient address contains a plus sign character",
    status: "Accepted", priority: "Medium", owner: OWNERS[1], project: "NXP",
    planEstimate: 1, taskCount: 1, completedTasks: 1,
    iteration: "Sprint 24.2", release: "Q4 2024", tags: ["notifications", "email"],
    description: "Addresses like user+tag@company.com fail RFC 5321 validation in the notification service. The plus sign is treated as a space in the URL-encoded envelope, causing SMTP rejection.",
    lastUpdated: "Oct 14, 2024",
  },
  // Track page sample items (e-commerce project)
  {
    id: "US199", type: "Story", rank: 1,
    title: "Child Story Observation — monitor nested story depth and rendering performance",
    status: "In-Progress", priority: "Medium", owner: OWNERS[1], project: "ECO",
    planEstimate: 5, taskCount: 4, completedTasks: 2, taskEstimate: 8, todoEstimate: 4,
    iteration: "Sprint 24.3", release: "Q4 2024", tags: ["performance"],
    commentCount: 2, defectCount: 0,
    description: "Monitor and optimize rendering performance when stories are nested more than two levels deep in the hierarchy view.",
    lastUpdated: "Oct 21, 2024",
  },
  {
    id: "US16", type: "Story", rank: 2,
    title: "Delete Item — allow users to permanently remove products from catalog",
    status: "Completed", priority: "High", owner: OWNERS[0], project: "ECO",
    planEstimate: 3, taskCount: 3, completedTasks: 3, taskEstimate: 6, todoEstimate: 0,
    iteration: "Sprint 24.3", release: "Q4 2024", tags: ["catalog"],
    commentCount: 1, defectCount: 0,
    description: "Add a delete action to product catalog items. Requires soft-delete with a 30-day grace period before permanent removal.",
    lastUpdated: "Oct 22, 2024",
  },
  {
    id: "US554", type: "Story", rank: 3,
    title: "Online Payment — integrate Stripe payment gateway with 3DS authentication",
    status: "In-Progress", priority: "Critical", owner: OWNERS[3], project: "ECO",
    planEstimate: 8, taskCount: 6, completedTasks: 5, taskEstimate: 14, todoEstimate: 2,
    iteration: "Sprint 24.3", release: "Q4 2024", tags: ["payments", "security"],
    commentCount: 7, attachmentCount: 3, defectCount: 1, blocked: false,
    description: "Integrate Stripe with full 3D Secure 2.0 support. Covers card input, payment intent creation, webhook handling, and refund flows.",
    lastUpdated: "Oct 22, 2024",
  },
  {
    id: "US549", type: "Story", rank: 4,
    title: "Images — product image upload with cropping, thumbnails, and CDN delivery",
    status: "In-Progress", priority: "Medium", owner: OWNERS[2], project: "ECO",
    planEstimate: 3, taskCount: 4, completedTasks: 2, taskEstimate: 8, todoEstimate: 4,
    iteration: "Sprint 24.3", release: "Q4 2024", tags: ["media", "cdn"],
    commentCount: 3, defectCount: 0,
    description: "Product managers need to upload, crop, and reorder product images. Images must be processed into multiple thumbnail sizes and served via CDN.",
    lastUpdated: "Oct 20, 2024",
  },
  {
    id: "US383", type: "Story", rank: 5,
    title: "Chat Pop-up Suggestion after 90 Sec Inactive on product page",
    status: "Defined", priority: "Low", owner: OWNERS[4], project: "ECO",
    planEstimate: 5, taskCount: 0, completedTasks: 0, taskEstimate: 0, todoEstimate: 0,
    iteration: "Sprint 24.3", release: "Q1 2025", tags: ["engagement", "chat"],
    description: "Show a chat support pop-up when a user is idle on a product page for more than 90 seconds. Includes dismiss, minimize, and open chat actions.",
    lastUpdated: "Oct 19, 2024",
  },
  {
    id: "US418", type: "Story", rank: 6,
    title: "Shopping Cart — persistent cart with price recalculation and coupon support",
    status: "Accepted", priority: "High", owner: OWNERS[0], project: "ECO",
    planEstimate: 13, taskCount: 8, completedTasks: 8, taskEstimate: 20, todoEstimate: 0,
    iteration: "Sprint 24.3", release: "Q4 2024", tags: ["cart", "checkout"],
    commentCount: 5, defectCount: 0,
    description: "Build a persistent shopping cart that recalculates prices on quantity change, applies coupon codes, and persists across sessions via local storage and server sync.",
    lastUpdated: "Oct 16, 2024",
  },
  {
    id: "US59", type: "Story", rank: 7,
    title: "Make a pet shop — full e-commerce store for pet products and accessories",
    status: "Accepted", priority: "High", owner: OWNERS[1], project: "ECO",
    planEstimate: 21, taskCount: 14, completedTasks: 14, taskEstimate: 40, todoEstimate: 0,
    iteration: "Sprint 24.3", release: "Q4 2024", tags: ["storefront", "foundation"],
    commentCount: 12, attachmentCount: 6, defectCount: 2,
    description: "Foundation story covering the complete e-commerce storefront: product catalog, search, filters, product detail pages, and basic navigation structure.",
    lastUpdated: "Oct 15, 2024",
  },
];

export const FEATURES: Feature[] = [
  { id: "FE-318", title: "Advanced Reporting Module", status: "In-Progress", priority: "High", owner: OWNERS[3], release: "Q1 2025", planEstimate: 55, acceptedEstimate: 18, storyCount: 12, completedStories: 4 },
  { id: "FE-311", title: "Enterprise Authentication Suite (SAML / OIDC)", status: "Completed", priority: "High", owner: OWNERS[0], release: "Q4 2024", planEstimate: 34, acceptedEstimate: 34, storyCount: 9, completedStories: 9 },
  { id: "FE-322", title: "Mobile Application MVP — iOS & Android", status: "Defined", priority: "Medium", owner: OWNERS[4], release: "Q2 2025", planEstimate: 89, acceptedEstimate: 0, storyCount: 22, completedStories: 0 },
  { id: "FE-315", title: "Backlog Automation & Smart Prioritization Engine", status: "In-Progress", priority: "High", owner: OWNERS[1], release: "Q1 2025", planEstimate: 42, acceptedEstimate: 14, storyCount: 10, completedStories: 3 },
  { id: "FE-308", title: "Cross-Project Portfolio Hierarchy & Roadmap View", status: "Defined", priority: "Medium", owner: OWNERS[2], release: "Q2 2025", planEstimate: 60, acceptedEstimate: 0, storyCount: 15, completedStories: 0 },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 1, type: "assigned", title: "US assigned to you", body: "US-4821 · Implement SSO authentication via SAML 2.0", time: "2h ago", read: false, user: OWNERS[3], workItemId: "US-4821" },
  { id: 2, type: "mention", title: "Mentioned in note", body: "DE-1142 · Sarah Chen mentioned @Marcus Webb in Notes", time: "4h ago", read: false, user: OWNERS[1], workItemId: "DE-1142" },
  { id: 3, type: "assigned", title: "DE assigned to you", body: "DE-1142 · Dashboard widget refresh loop causes memory leak in Firefox 118+", time: "Yesterday", read: true, user: OWNERS[1], workItemId: "DE-1142" },
];

export const TASKS_DATA: TaskItem[] = [
  { id: "TA-482101", parentWorkItemId: "US-4821", rank: 1, name: "Prepare implementation approach", state: "Completed", owner: OWNERS[0], project: "NXP", team: "Core Platform", estimate: 3, todo: 0, actuals: 3, description: "Define the SSO implementation approach and validation checkpoints.", notes: "Reviewed with platform lead.", attachments: ["implementation-outline.md"] },
  { id: "TA-482102", parentWorkItemId: "US-4821", rank: 2, name: "Configure SAML metadata upload", state: "Completed", owner: OWNERS[0], project: "NXP", team: "Core Platform", estimate: 3, todo: 0, actuals: 3, description: "Configure metadata upload and validation.", notes: "Metadata validation complete.", attachments: [] },
  { id: "TA-482103", parentWorkItemId: "US-4821", rank: 3, name: "Map IdP attributes", state: "Completed", owner: OWNERS[1], project: "NXP", team: "Core Platform", estimate: 2, todo: 0, actuals: 2, description: "Map IdP attributes to tenant profile fields.", notes: "Required attributes mapped.", attachments: [] },
  { id: "TA-482104", parentWorkItemId: "US-4821", rank: 4, name: "Validate session lifecycle", state: "Completed", owner: OWNERS[1], project: "NXP", team: "Core Platform", estimate: 2, todo: 0, actuals: 2, description: "Validate login, renewal and logout behavior.", notes: "Core session cases pass.", attachments: [] },
  { id: "TA-482105", parentWorkItemId: "US-4821", rank: 5, name: "Complete security review", state: "In-Progress", owner: OWNERS[1], project: "NXP", team: "Core Platform", estimate: 4, todo: 2, actuals: 2, description: "Review SAML security controls and tenant isolation.", notes: "Awaiting final security sign-off.", attachments: [] },
  { id: "TA-482106", parentWorkItemId: "US-4821", rank: 6, name: "Add automated verification", state: "Defined", owner: OWNERS[3], project: "NXP", team: "Core Platform", estimate: 2, todo: 2, actuals: 0, description: "Add automated coverage for SAML provisioning and errors.", notes: "Start after security review.", attachments: [] },
  { id: "TA-114201", parentWorkItemId: "DE-1142", rank: 1, name: "Reproduce Firefox refresh loop", state: "Defined", owner: OWNERS[1], project: "NXP", team: "Core Platform", estimate: 3, todo: 3, actuals: 0, description: "Reproduce the widget refresh loop in supported Firefox versions.", notes: "Use the production dashboard fixture.", attachments: [] },
  { id: "TA-114202", parentWorkItemId: "DE-1142", rank: 2, name: "Release detached chart observers", state: "Defined", owner: OWNERS[1], project: "NXP", team: "Core Platform", estimate: 3, todo: 3, actuals: 0, description: "Dispose detached chart observers and verify memory recovery.", notes: "Implement after reproduction is stable.", attachments: [] },
  { id: "TA-113801", parentWorkItemId: "DE-1138", rank: 1, name: "Normalize velocity timezone input", state: "In-Progress", owner: OWNERS[1], project: "NXP", team: "Core Platform", estimate: 4, todo: 2, actuals: 2, description: "Normalize reporting input to the workspace timezone.", notes: "Validate daylight-saving boundaries.", attachments: [] },
  { id: "TA-113802", parentWorkItemId: "DE-1138", rank: 2, name: "Add timezone regression cases", state: "In-Progress", owner: OWNERS[3], project: "NXP", team: "Core Platform", estimate: 4, todo: 2, actuals: 2, description: "Add regression cases for client and server timezone differences.", notes: "Cover UTC and Asia/Saigon.", attachments: [] },
  { id: "TA-481501", parentWorkItemId: "US-4815", rank: 1, name: "Define cursor event contract", state: "Defined", owner: OWNERS[4], project: "NXP", team: "Core Platform", estimate: 0, todo: 0, actuals: 0, description: "Define the collaboration cursor event contract.", notes: "Planning placeholder.", attachments: [] },
  { id: "TA-481502", parentWorkItemId: "US-4815", rank: 2, name: "Prototype cursor transport", state: "Defined", owner: OWNERS[4], project: "NXP", team: "Core Platform", estimate: 0, todo: 0, actuals: 0, description: "Prototype realtime cursor transport.", notes: "Planning placeholder.", attachments: [] },
  { id: "TA-481503", parentWorkItemId: "US-4815", rank: 3, name: "Render remote cursors", state: "Defined", owner: OWNERS[4], project: "NXP", team: "Core Platform", estimate: 0, todo: 0, actuals: 0, description: "Render remote cursor positions.", notes: "Planning placeholder.", attachments: [] },
  { id: "TA-481504", parentWorkItemId: "US-4815", rank: 4, name: "Validate simultaneous editing", state: "Defined", owner: OWNERS[4], project: "NXP", team: "Core Platform", estimate: 0, todo: 0, actuals: 0, description: "Validate simultaneous board editing behavior.", notes: "Planning placeholder.", attachments: [] },
  { id: "TA-481901", parentWorkItemId: "US-4819", rank: 1, name: "Implement shortcut registry", state: "Completed", owner: OWNERS[2], project: "NXP", team: "Core Platform", estimate: 2, todo: 0, actuals: 2, description: "Implement the global shortcut registry.", notes: "Complete.", attachments: [] },
  { id: "TA-481902", parentWorkItemId: "US-4819", rank: 2, name: "Add shortcut help panel", state: "Completed", owner: OWNERS[2], project: "NXP", team: "Core Platform", estimate: 2, todo: 0, actuals: 2, description: "Add and validate the shortcut help panel.", notes: "Complete.", attachments: [] },
];

export const VELOCITY_DATA = [
  { sprint: "23.4", planned: 44, accepted: 40 },
  { sprint: "23.5", planned: 38, accepted: 32 },
  { sprint: "23.6", planned: 41, accepted: 41 },
  { sprint: "24.1", planned: 45, accepted: 38 },
  { sprint: "24.2", planned: 52, accepted: 49 },
  { sprint: "24.3", planned: 47, accepted: 16 },
];

export const BURNDOWN_DATA = [
  { day: "Oct 14", remaining: 47, ideal: 47 },
  { day: "Oct 15", remaining: 47, ideal: 42.7 },
  { day: "Oct 16", remaining: 42, ideal: 38.4 },
  { day: "Oct 17", remaining: 40, ideal: 34.1 },
  { day: "Oct 18", remaining: 36, ideal: 29.8 },
  { day: "Oct 21", remaining: 31, ideal: 21.2 },
  { day: "Oct 22", remaining: 28, ideal: 16.9 },
  { day: "Oct 23", remaining: 28, ideal: 12.6 },
  { day: "Oct 24", remaining: null, ideal: 8.3 },
  { day: "Oct 25", remaining: null, ideal: 4.0 },
  { day: "Oct 28", remaining: null, ideal: 0 },
];

export const STATUS_PIE = [
  { name: "Accepted", value: 14, color: "#2558a6" },
  { name: "Completed", value: 9, color: "#2a8c3f" },
  { name: "In-Progress", value: 18, color: "#e59f0c" },
  { name: "Defined", value: 22, color: "#8c94a6" },
];

export const INITIATIVES: Initiative[] = [
  { id: "IN-01", title: "Enterprise Platform Modernization", type: "Initiative", status: "In-Progress", priority: "High", owner: OWNERS[0], release: "Q4 2024", planEstimate: 89, featureIds: ["FE-311", "FE-318"], blockedCount: 1, relatedCount: 14, updatedAt: "Oct 22, 2024" },
  { id: "IN-02", title: "Mobile-First Customer Experience", type: "Initiative", status: "Defined", priority: "Medium", owner: OWNERS[3], release: "Q2 2025", planEstimate: 89, featureIds: ["FE-322"], blockedCount: 0, relatedCount: 22, updatedAt: "Oct 15, 2024" },
  { id: "IN-03", title: "Analytics & Intelligence Suite", type: "Initiative", status: "In-Progress", priority: "High", owner: OWNERS[1], release: "Q1 2025", planEstimate: 102, featureIds: ["FE-315", "FE-308"], blockedCount: 0, relatedCount: 25, updatedAt: "Oct 20, 2024" },
];

export const RELEASES_DATA: ReleaseItem[] = [
  { id: "REL-001", name: "Nexus Platform Q4 2024", version: "v3.4.0", status: "Active", startDate: "Oct 1, 2024", releaseDate: "Nov 1, 2024", progress: 58, totalItems: 24, completedItems: 14, openDefects: 3, blockedItems: 1, owner: OWNERS[0], description: "Q4 2024 release covering enterprise auth, CSV export, and critical defect fixes.", projectKey: "NXP", team: "Core Platform" },
  { id: "REL-002", name: "Nexus Platform Q1 2025", version: "v3.5.0", status: "Planning", startDate: "Nov 1, 2024", releaseDate: "Feb 1, 2025", progress: 12, totalItems: 38, completedItems: 5, openDefects: 2, blockedItems: 0, owner: OWNERS[0], description: "Q1 2025 release including advanced reporting module, notification center, and markdown support.", projectKey: "NXP", team: "Core Platform" },
  { id: "REL-003", name: "Nexus Platform Q2 2025", version: "v4.0.0", status: "Planning", startDate: "Feb 1, 2025", releaseDate: "May 1, 2025", progress: 0, totalItems: 52, completedItems: 0, openDefects: 0, blockedItems: 0, owner: OWNERS[3], description: "Major v4.0 with mobile app, portfolio hierarchy, and redesigned reporting dashboards.", projectKey: "NXP", team: "Core Platform" },
  { id: "REL-004", name: "Nexus Platform v3.3", version: "v3.3.0", status: "Accepted", startDate: "Jul 1, 2024", releaseDate: "Sep 30, 2024", progress: 100, totalItems: 18, completedItems: 18, openDefects: 0, blockedItems: 0, owner: OWNERS[0], description: "Accepted on schedule. Included board view, CSV import, and SSO foundation.", projectKey: "NXP", team: "Core Platform" },
];

export const MILESTONES_DATA: MilestoneItem[] = [
  { id: "MS-Q4-RC", name: "Q4 Release Candidate", description: "Release candidate coordination across platform scope.", state: "Planned", releaseIds: ["REL-004", "REL-001"], projectKeys: ["NXP"], teams: ["Core Platform"], manualStartDate: "2024-09-15", manualEndDate: "2024-11-15", owner: OWNERS[0] },
  { id: "MS-SEC", name: "Security Review Complete", description: "Authentication security checkpoint.", state: "At Risk", releaseIds: ["REL-001"], projectKeys: ["NXP"], teams: ["Identity & Access"], manualStartDate: "2024-10-01", manualEndDate: "2024-11-10", owner: OWNERS[2] },
  { id: "MS-Q4-GA", name: "Q4 General Availability", description: "Production launch milestone for Q4 and Q1 carry-forward scope.", state: "Completed", releaseIds: ["REL-001", "REL-002"], projectKeys: ["NXP"], teams: ["Core Platform", "Data & Reporting"], manualStartDate: "2024-10-01", manualEndDate: "2025-02-15", owner: OWNERS[0] },
];

export const ITERATIONS_DATA: IterationItem[] = [
  {
    id: "IT-24-2", name: "Sprint 24.2", theme: "Q4 hardening", state: "Accepted", projectKey: "NXP", team: "Core Platform",
    startDate: "2024-09-30 12:00 AM EST", endDate: "2024-10-11 11:59 PM EST", project: "Nexus Platform 2025",
    plannedVelocity: 52, taskEstimate: 118, capacity: 50, plannedPoints: 52, acceptedPoints: 49,
    itemCount: 8, defectCount: 1, blockedCount: 0, owner: OWNERS[4],
    goal: "Finish backlog export, database upgrade, and notification fixes before Q4 release hardening.",
    history: ["Started Sep 30 by Tom Brennan", "Closed Oct 11 with 49 accepted points", "3 unfinished points moved to Sprint 24.3"],
  },
  {
    id: "IT-24-3", name: "Sprint 24.3", theme: "Authentication stability", state: "Planning", projectKey: "NXP", team: "Core Platform",
    startDate: "2024-10-14 12:00 AM EST", endDate: "2024-10-28 11:59 PM EST", project: "Nexus Platform 2025",
    plannedVelocity: 47, taskEstimate: 106, capacity: 54, plannedPoints: 47, acceptedPoints: 16,
    itemCount: 9, defectCount: 2, blockedCount: 1, owner: OWNERS[0],
    goal: "Stabilize authentication, resolve high priority defects, and keep reporting work visible for Q4 readiness.",
    history: ["Created Oct 10 by Marcus Webb", "Sprint scope agreed Oct 14 with 9 items", "Scope adjusted Oct 21 after timezone defect triage"],
  },
  {
    id: "IT-24-4", name: "Sprint 24.4", theme: "Q1 platform prep", state: "Planning", projectKey: "NXP", team: "Core Platform",
    startDate: "2024-10-29 12:00 AM EST", endDate: "2024-11-12 11:59 PM EST", project: "Nexus Platform 2025",
    plannedVelocity: 31, taskEstimate: 72, capacity: 48, plannedPoints: 31, acceptedPoints: 0,
    itemCount: 6, defectCount: 0, blockedCount: 0, owner: OWNERS[0],
    goal: "Prepare Q1 platform work while keeping remaining Q4 release items small and testable.",
    history: ["Created Oct 18 by Marcus Webb", "Capacity reviewed Oct 22"],
  },
  {
    id: "IT-25-1", name: "Sprint 25.1", theme: "Reporting dashboard", state: "Planning", projectKey: "NXP", team: "Data & Reporting",
    startDate: "2025-01-06 12:00 AM EST", endDate: "2025-01-17 11:59 PM EST", project: "Nexus Platform 2025",
    plannedVelocity: 42, taskEstimate: 0, capacity: 42, plannedPoints: 0, acceptedPoints: 0,
    itemCount: 0, defectCount: 0, blockedCount: 0, owner: OWNERS[3],
    goal: "Initial planning placeholder for reporting dashboard work.",
    history: ["Created Oct 20 by Priya Nair"],
  },
  {
    id: "IT-24-5", name: "Sprint 24.5", theme: "Identity calendar realignment", state: "Planning", projectKey: "NXP", team: "Identity & Access",
    startDate: "2024-11-13 12:00 AM EST", endDate: "2024-11-26 11:59 PM EST", project: "Nexus Platform 2025",
    plannedVelocity: 36, taskEstimate: 0, capacity: 36, plannedPoints: 0, acceptedPoints: 0,
    itemCount: 0, defectCount: 0, blockedCount: 0, owner: OWNERS[1],
    goal: "Placeholder after team calendar realignment.",
    history: ["Created Oct 15 by Sarah Chen"],
  },
];

export const WORKSPACE_USERS: WorkspaceUser[] = [
  { name: "Marcus Webb", email: "marcus.webb@acme.com", role: "Workspace Admin", status: "Active", lastLogin: "Oct 22, 2024 9:14 AM", owner: OWNERS[0] },
  { name: "Sarah Chen", email: "sarah.chen@acme.com", role: "Project Member", status: "Active", lastLogin: "Oct 22, 2024 8:45 AM", owner: OWNERS[1] },
  { name: "James Okafor", email: "james.okafor@acme.com", role: "Project Member", status: "Active", lastLogin: "Oct 21, 2024 4:30 PM", owner: OWNERS[2] },
  { name: "Priya Nair", email: "priya.nair@acme.com", role: "Project Admin", status: "Active", lastLogin: "Oct 22, 2024 10:05 AM", owner: OWNERS[3] },
  { name: "Tom Brennan", email: "tom.brennan@acme.com", role: "Project Admin", status: "Active", lastLogin: "Oct 20, 2024 3:15 PM", owner: OWNERS[4] },
  { name: "Elena Kowalski", email: "elena.kowalski@acme.com", role: "Project Member", status: "Invited", lastLogin: "—", owner: { name: "Elena Kowalski", initials: "EK", color: "#4a7c6e" } },
];

export const WORKFLOW_STATUSES: WorkflowStatusItem[] = [
  { id: "ws1", name: "Idea", category: "To Do", order: 1, isFinal: false },
  { id: "ws2", name: "Defined", category: "To Do", order: 2, isFinal: false },
  { id: "ws3", name: "In-Progress", category: "In Progress", order: 3, isFinal: false },
  { id: "ws4", name: "Completed", category: "Done", order: 4, isFinal: true },
  { id: "ws5", name: "Accepted", category: "Done", order: 5, isFinal: true },
  { id: "ws6", name: "Release", category: "Done", order: 6, isFinal: true },
];

export const LABELS_DATA: LabelItem[] = [
  { id: "l1", name: "auth", color: "#2558a6", usage: 4 },
  { id: "l2", name: "security", color: "#b91c1c", usage: 3 },
  { id: "l3", name: "performance", color: "#c2610c", usage: 2 },
  { id: "l4", name: "ux", color: "#6d28d9", usage: 3 },
  { id: "l5", name: "infrastructure", color: "#475569", usage: 3 },
  { id: "l6", name: "reporting", color: "#1e6930", usage: 5 },
  { id: "l7", name: "notifications", color: "#8a5808", usage: 2 },
  { id: "l8", name: "database", color: "#3d7a4e", usage: 2 },
];

export const WORKLOAD_DATA = [
  { owner: "MW", planned: 13, inProgress: 8, accepted: 6 },
  { owner: "SC", planned: 7, inProgress: 4, accepted: 7 },
  { owner: "JO", planned: 7, inProgress: 5, accepted: 5 },
  { owner: "PN", planned: 24, inProgress: 11, accepted: 4 },
  { owner: "TB", planned: 10, inProgress: 6, accepted: 4 },
];

export const PLANNED_VS_COMPLETED = [
  { sprint: "23.4", planned: 44, completed: 40 },
  { sprint: "23.5", planned: 82, completed: 72 },
  { sprint: "23.6", planned: 123, completed: 113 },
  { sprint: "24.1", planned: 168, completed: 151 },
  { sprint: "24.2", planned: 220, completed: 200 },
  { sprint: "24.3", planned: 267, completed: 216 },
];

export const PERMISSIONS_MATRIX = [
  { action: "Create Work Items", roles: ["Workspace Admin", "Project Admin", "Project Member"] },
  { action: "Edit Work Items", roles: ["Workspace Admin", "Project Admin", "Project Member"] },
  { action: "Delete Work Items", roles: ["Workspace Admin", "Project Admin", "Project Member"] },
  { action: "Manage Users & Roles", roles: ["Workspace Admin"] },
  { action: "Manage Workspace Settings", roles: ["Workspace Admin"] },
  { action: "Manage Project Settings", roles: ["Workspace Admin", "Project Admin"] },
  { action: "Manage Iterations", roles: ["Workspace Admin", "Project Admin"] },
  { action: "Manage Releases", roles: ["Workspace Admin", "Project Admin"] },
  { action: "Prioritize Backlog", roles: ["Workspace Admin", "Project Admin", "Project Member"] },
  { action: "Create Defects", roles: ["Workspace Admin", "Project Admin", "Project Member"] },
  { action: "View Reports", roles: ["Workspace Admin", "Project Admin"] },
  { action: "Export Reports", roles: ["Workspace Admin", "Project Admin"] },
  { action: "Comment", roles: ["Workspace Admin", "Project Admin", "Project Member"] },
  { action: "Upload Attachments", roles: ["Workspace Admin", "Project Admin", "Project Member"] },
];

export const DEFECT_ENVIRONMENTS = ["Firefox 118+", "Chrome 118", "All Browsers", "Safari 17", "Mobile iOS"];
export const RELATED_STORIES = ["US-4821", "FE-318", "US-4798", "—"];
