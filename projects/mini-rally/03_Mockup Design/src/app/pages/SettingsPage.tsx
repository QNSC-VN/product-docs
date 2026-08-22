import { useState } from "react";
import { useEffect } from "react";
import {
  Search, ChevronDown, ChevronRight, LayoutList, LayoutGrid,
  Plus, Filter, HelpCircle, Settings, RefreshCw, Download,
  MoreHorizontal, X, Layers, Paperclip, Link2, Edit3,
  Home, Shield, Users, LogOut, AlertTriangle, MessageSquare,
  CheckCircle, Lock, Check, Archive, Eye, BarChart2,
  Bookmark, Save, RotateCcw,
  TrendingUp, TrendingDown, Package, Clock, Star, UserCheck,
  FileText, Hash, ChevronUp, Share2, ChevronLeft,
  GripVertical, Copy, Scissors, UserPlus, GitMerge,
  ExternalLink, AlignJustify, Minus, Zap,
  Calendar, RotateCw, ListChecks, Globe, Send, ArrowUpRight,
  CheckSquare, Square, Columns,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { type Role, type ProjectAccessLevel, type Page, type WorkItemType, type StatusType, type PriorityType, type Owner, type WorkItem, type Notification, type Feature, type Project, type ScopeProject, type Initiative, type ReleaseItem, type WorkspaceUser, type WorkflowStatusItem, type LabelItem, can, DEMO_ACCESS_PROFILES, OWNERS, PROJECTS, SCOPE_PROJECTS, ROLE_SCOPE, WORK_ITEMS, FEATURES, NOTIFICATIONS, VELOCITY_DATA, BURNDOWN_DATA, STATUS_PIE, INITIATIVES, RELEASES_DATA, WORKSPACE_USERS, WORKFLOW_STATUSES, LABELS_DATA, WORKLOAD_DATA, PLANNED_VS_COMPLETED, PERMISSIONS_MATRIX, DEFECT_ENVIRONMENTS, RELATED_STORIES } from "../model";
import { releaseStatusCfg, cx, Avatar, TYPE_CFG, TypeBadge, STATUS_CFG, StatusBadge, PRI_CFG, PriorityBadge, MiniProgress, RoleBadge, DetailPanel, NewItemModal, EmptyState, SectionCard } from "../components/shared";
import { WorkspaceProjectsPanel } from "./WorkspaceProjectsPanel";

export const ROLE_TO_PROD_CODE: Record<Role, ProdRoleCode> = { "Workspace Admin": "WA", "Admin": "A", "Editor": "E" };

/**
 * Reads one permission out of the saved role matrix. `E` means the role may
 * perform the action, anything else (`R` read-only, `D` disabled, `H` hidden)
 * means it may not. This is how the Settings > Workspace matrix actually gates
 * Capacity Planning temporarily uses one `capacity_planning:manage` row:
 * `E` is planner Full and `R` is planner View. Action-level RBAC will be
 * defined in a later phase.
 * Workspace Admin stays `E` because its matrix column is intentionally locked,
 * so a Workspace Admin cannot lock itself out of planning.
 */
export function permissionAllows(rows: RoleActionRow[], permission: string, role: Role) {
  const row = rows.find(candidate => candidate.permission === permission);
  if (!row) return false;
  return row.states[ROLE_TO_PROD_CODE[role]] === "E";
}

export function Toggle({ on = true, disabled = false }: { on?: boolean; disabled?: boolean }) {
  const [v, setV] = useState(on);
  return (
    <button disabled={disabled} onClick={() => setV(!v)} className="w-9 h-5 rounded-full relative transition-colors shrink-0 disabled:opacity-45" style={{ backgroundColor: v ? "#1d3f73" : "#cbd5e1" }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: v ? 18 : 2 }} />
    </button>
  );
}

export const AUDIT_LOG_DATA = [
  { time: "Tuesday, October 22, 2024 09:14:08", actor: "Marcus Webb", details: "Updated company name from ACME Space to ACME Space Inc." },
  { time: "Tuesday, October 22, 2024 09:02:31", actor: "Marcus Webb", details: "Removed Priya Nair's access to Mobile App MVP." },
  { time: "Monday, October 21, 2024 16:32:41", actor: "Marcus Webb", details: "Invited Elena Kowalski with Editor access to Infrastructure Refresh." },
  { time: "Monday, October 21, 2024 15:44:09", actor: "Marcus Webb", details: "Changed Priya Nair access to Admin for Nexus Platform 2025." },
  { time: "Sunday, October 20, 2024 11:05:22", actor: "Marcus Webb", details: "Changed Elena Kowalski status from Invited to Active." },
  { time: "Saturday, October 19, 2024 14:30:17", actor: "Marcus Webb", details: "Assigned James Okafor to Data & Reporting team." },
  { time: "Friday, October 18, 2024 10:15:33", actor: "Marcus Webb", details: "Archived project Mobile App MVP." },
  { time: "Tuesday, October 15, 2024 09:00:02", actor: "Marcus Webb", details: "Created team Platform Operations." },
];

export const ALL_ROLES: Role[] = ["Workspace Admin", "Admin", "Editor"];
export const ROLE_ABBR: Record<Role, string> = { "Workspace Admin": "WA", "Admin": "A", "Editor": "E" };

export type ProdRoleCode = "WA" | "A" | "E";
export type PermissionState = "E" | "R" | "D" | "H";
export type RoleActionRow = { screen: string; action: string; permission: string; states: Record<ProdRoleCode, PermissionState>; locked?: boolean };
type UserProjectAccess = { projectKey: string; level: ProjectAccessLevel; teams: string[] };
type SettingsUser = WorkspaceUser & { phoneNumber: string; projectAccess: UserProjectAccess[] };

const PROD_ROLES: { code: ProdRoleCode; name: string; slug: string; summary: string }[] = [
  { code: "WA", name: "Workspace Admin", slug: "workspace_admin", summary: "Full workspace ownership" },
  { code: "A", name: "Admin", slug: "admin", summary: "Manage delivery in an assigned project" },
  { code: "E", name: "Editor", slug: "editor", summary: "Work in assigned project teams" },
];

const USER_PHONE_NUMBERS = ["+1 212 555 0198", "+1 415 555 0142", "+1 312 555 0167", "+1 646 555 0181", "+1 206 555 0174", "+1 503 555 0129"];
const USER_PROJECT_ACCESS: Record<string, UserProjectAccess[]> = {
  "sarah.chen@acme.com": [{ projectKey: "NXP", level: "Editor", teams: ["Core Platform"] }],
  "james.okafor@acme.com": [{ projectKey: "NXP", level: "Editor", teams: ["Data & Reporting"] }],
  "priya.nair@acme.com": [
    { projectKey: "NXP", level: "Admin", teams: ["All Teams"] },
  ],
  "tom.brennan@acme.com": [
    { projectKey: "MOB", level: "Admin", teams: ["All Teams"] },
  ],
  "elena.kowalski@acme.com": [{ projectKey: "INF", level: "Editor", teams: ["Platform Operations"] }],
};
const SETTINGS_USERS: SettingsUser[] = WORKSPACE_USERS.map((user, index) => ({ ...user, phoneNumber: USER_PHONE_NUMBERS[index] ?? "+1 555 0100", projectAccess: USER_PROJECT_ACCESS[user.email] ?? [] }));
const PROJECT_ACCESS_LEVELS: ProjectAccessLevel[] = ["Admin", "Editor"];
const ACCESS_LEVEL_ROWS = [
  { level: "Workspace Admin", scope: "All projects", work: "Full", settings: "Full", people: "Full" },
  { level: "Admin", scope: "Assigned project / All Teams", work: "Full delivery", settings: "Read-only", people: "None" },
  { level: "Editor", scope: "Assigned project / explicit teams", work: "Team delivery edit", settings: "None", people: "None" },
] as const;

type FixedAccessState = "Allowed" | "Read-only" | "Hidden";
type ScreenActionAccessRow = { screen: string; action: string; wa: FixedAccessState; admin: FixedAccessState; editor: FixedAccessState };
const SCREEN_ACTION_ACCESS_ROWS: ScreenActionAccessRow[] = [
  { screen: "Workspace Settings", action: "View and edit workspace settings", wa: "Allowed", admin: "Hidden", editor: "Hidden" },
  { screen: "User Management", action: "Manage company users", wa: "Allowed", admin: "Hidden", editor: "Hidden" },
  { screen: "Project Management", action: "View assigned project structure", wa: "Allowed", admin: "Read-only", editor: "Read-only" },
  { screen: "Project Management", action: "Create, edit, archive or delete Project", wa: "Allowed", admin: "Hidden", editor: "Hidden" },
  { screen: "Project Management", action: "Manage Project access and Teams", wa: "Allowed", admin: "Read-only", editor: "Hidden" },
  { screen: "Backlog / Quality", action: "Create, view, edit and delete delivery work", wa: "Allowed", admin: "Allowed", editor: "Allowed" },
  { screen: "Iteration Status", action: "View and update assigned delivery scope", wa: "Allowed", admin: "Allowed", editor: "Allowed" },
  { screen: "Timebox", action: "Create, edit and delete Iteration/Release/Milestone", wa: "Allowed", admin: "Allowed", editor: "Hidden" },
  { screen: "Capacity / Reports", action: "View and manage project planning", wa: "Allowed", admin: "Allowed", editor: "Hidden" },
];

function AccessBadge({ value }: { value: Role | ProjectAccessLevel }) {
  const cfg = value === "Workspace Admin"
    ? { bg: "#fef2f2", text: "#b91c1c" }
    : value === "Admin"
      ? { bg: "#edf2fb", text: "#2558a6" }
      : { bg: "#eef6f0", text: "#1e6930" };
  return <span className="inline-flex px-2 py-0.5 rounded-sm text-[10px] font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.text }}>{value}</span>;
}

function FixedAccessBadge({ value }: { value: FixedAccessState }) {
  const cfg = value === "Allowed"
    ? { bg: "#eef6f0", text: "#1e6930", border: "#bad7c1" }
    : value === "Read-only"
      ? { bg: "#edf2fb", text: "#2558a6", border: "#bdd0ea" }
      : { bg: "#f7f8fa", text: "#8c94a6", border: "#dde2ea" };
  return <span className="inline-flex px-2 py-0.5 rounded-sm text-[9px] font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>{value}</span>;
}

const STATE_STYLE: Record<PermissionState, { label: string; bg: string; text: string; border: string }> = {
  E: { label: "Enabled", bg: "#eef6f0", text: "#1e6930", border: "#bad7c1" },
  R: { label: "Read-only", bg: "#edf2fb", text: "#1d3f73", border: "#bdd0ea" },
  D: { label: "Disabled", bg: "#f7f8fa", text: "#697285", border: "#dde2ea" },
  H: { label: "Hidden", bg: "#fef2f2", text: "#b91c1c", border: "#f0c7c1" },
};
const PERMISSION_STATE_OPTIONS: PermissionState[] = ["E", "R", "D", "H"];

const roleStates = (WA: PermissionState, A: PermissionState, E: PermissionState): Record<ProdRoleCode, PermissionState> => ({ WA, A, E });

export const PROD_ROLE_ACTION_MATRIX: RoleActionRow[] = [
  { screen: "Auth", action: "Create session (sign in)", permission: "auth:sign_in", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Auth", action: "View restored session", permission: "auth:restore_session", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Auth", action: "Delete session (sign out)", permission: "auth:sign_out", states: roleStates("E", "E", "E"), locked: true },
  { screen: "App Shell", action: "View navigation, breadcrumbs and workspace context", permission: "app_shell:view_navigation", states: roleStates("E", "E", "E"), locked: true },
  { screen: "App Shell", action: "Edit selected project/team context", permission: "app_shell:switch_context", states: roleStates("E", "E", "E"), locked: true },
  { screen: "App Shell", action: "View global work item search results", permission: "app_shell:search_work_items", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Home", action: "View workspace dashboard and project health", permission: "home:view_dashboard", states: roleStates("E", "E", "E") },
  { screen: "Home", action: "View My Work assigned items", permission: "home:view_my_work", states: roleStates("E", "E", "E") },
  { screen: "Manage Projects > Projects", action: "View assigned project structure", permission: "projects:view_list", states: roleStates("E", "R", "R") },
  { screen: "Manage Projects > Projects", action: "Create project", permission: "projects:create", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Projects", action: "Edit project settings", permission: "projects:edit_settings", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Projects", action: "Edit project status to archived", permission: "projects:archive", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Projects", action: "Edit project status to active", permission: "projects:restore", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Projects", action: "Delete project", permission: "projects:delete", states: roleStates("E", "H", "H") },
  { screen: "Settings > Teams", action: "View team list, search and filters", permission: "teams:view_list", states: roleStates("E", "R", "H") },
  { screen: "Settings > Teams", action: "Create team", permission: "teams:create", states: roleStates("E", "H", "H") },
  { screen: "Settings > Teams", action: "Edit team information", permission: "teams:edit_info", states: roleStates("E", "H", "H") },
  { screen: "Settings > Teams", action: "Edit team status", permission: "teams:edit_status", states: roleStates("E", "H", "H") },
  { screen: "Settings > Teams", action: "Edit team lead", permission: "teams:edit_lead", states: roleStates("E", "H", "H") },
  { screen: "Settings > Teams", action: "Edit team members", permission: "teams:edit_members", states: roleStates("E", "H", "H") },
  { screen: "Settings > Teams", action: "Delete team access (deactivate)", permission: "teams:deactivate", states: roleStates("E", "H", "H") },
  { screen: "Settings > Teams", action: "Edit team status to active", permission: "teams:restore", states: roleStates("E", "H", "H") },
  { screen: "Settings > User Management", action: "View workspace users", permission: "users:view_list", states: roleStates("E", "H", "H") },
  { screen: "Settings > User Management", action: "Create user invitation", permission: "users:invite", states: roleStates("E", "H", "H") },
  { screen: "Settings > User Management", action: "Edit user role", permission: "users:edit_role", states: roleStates("E", "H", "H") },
  { screen: "Settings > User Management", action: "Edit user status", permission: "users:edit_status", states: roleStates("E", "H", "H") },
  { screen: "Settings > User Management", action: "Edit user team allocation", permission: "users:edit_team_allocation", states: roleStates("E", "H", "H") },
  { screen: "Settings > User Management", action: "Delete user access from company", permission: "users:remove", states: roleStates("E", "H", "H") },
  { screen: "Backlog", action: "View US/DE rows", permission: "backlog:view_items", states: roleStates("E", "E", "E") },
  { screen: "Backlog", action: "View search, filter, sort, pagination and resized columns", permission: "backlog:view_tools", states: roleStates("E", "E", "E") },
  { screen: "Backlog", action: "Create US/DE work item", permission: "backlog:create_item", states: roleStates("E", "E", "E") },
  { screen: "Backlog", action: "Edit work item fields inline", permission: "backlog:edit_item_fields", states: roleStates("E", "E", "E") },
  { screen: "Backlog", action: "Edit release assignment", permission: "backlog:assign_release", states: roleStates("E", "E", "H") },
  { screen: "Backlog", action: "Edit iteration assignment", permission: "backlog:assign_iteration", states: roleStates("E", "E", "E") },
  { screen: "Backlog", action: "Edit backlog rank order", permission: "backlog:edit_rank", states: roleStates("E", "E", "E") },
  { screen: "Backlog", action: "Delete selected work item", permission: "backlog:delete_item", states: roleStates("E", "E", "E") },
  { screen: "Work Item Detail", action: "View details, fields and revision history", permission: "work_item_detail:view", states: roleStates("E", "E", "E") },
  { screen: "Work Item Detail", action: "Edit work item fields", permission: "work_item_detail:edit_fields", states: roleStates("E", "E", "E") },
  { screen: "Work Item Detail", action: "Edit description", permission: "work_item_detail:edit_description", states: roleStates("E", "E", "E") },
  { screen: "Work Item Detail", action: "Edit item relations", permission: "work_item_detail:edit_relations", states: roleStates("E", "E", "E") },
  { screen: "Work Item Detail", action: "Edit release notes", permission: "work_item_detail:edit_release_notes", states: roleStates("E", "E", "H") },
  { screen: "Work Item Detail", action: "Create attachment", permission: "attachments:create", states: roleStates("E", "E", "E") },
  { screen: "Work Item Detail", action: "Delete attachment", permission: "attachments:delete", states: roleStates("E", "E", "E") },
  { screen: "Work Item Detail", action: "Create note or user mention", permission: "notes:create", states: roleStates("E", "E", "E") },
  { screen: "Work Item Detail", action: "Edit watcher subscription", permission: "watchers:edit_subscription", states: roleStates("E", "E", "E") },
  { screen: "Work Item Detail", action: "Delete work item", permission: "work_item_detail:delete", states: roleStates("E", "E", "E") },
  { screen: "Task Dashboard", action: "View child tasks", permission: "task_dashboard:view", states: roleStates("E", "E", "E") },
  { screen: "Task Dashboard", action: "Create task under US/DE", permission: "task_dashboard:create_task", states: roleStates("E", "E", "E") },
  { screen: "Task Dashboard", action: "Edit task name, state, owner and effort inline", permission: "task_dashboard:edit_task", states: roleStates("E", "E", "E") },
  { screen: "Task Dashboard", action: "Delete task", permission: "task_dashboard:delete_task", states: roleStates("E", "E", "E") },
  { screen: "Task Detail", action: "View task details, attachments and work product", permission: "task_detail:view", states: roleStates("E", "E", "E") },
  { screen: "Task Detail", action: "Edit task details, attachments and work product", permission: "task_detail:edit", states: roleStates("E", "E", "E") },
  { screen: "Timeboxes > Iterations", action: "View iteration list and detail", permission: "iterations:view", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Iterations", action: "Create iteration", permission: "iterations:create", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Iterations", action: "Edit iteration fields", permission: "iterations:edit", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Iterations", action: "Delete iteration", permission: "iterations:delete", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Iterations", action: "Edit work item iteration assignment", permission: "iterations:assign_work_item", states: roleStates("E", "E", "H") },
  { screen: "Track > Iteration Status", action: "View selector, metrics and assigned work items", permission: "iteration_status:view", states: roleStates("E", "E", "E") },
  { screen: "Track > Iteration Status", action: "Create US/DE directly into selected iteration", permission: "iteration_status:create_item", states: roleStates("E", "E", "E") },
  { screen: "Track > Iteration Status", action: "Edit work item fields inline", permission: "iteration_status:edit_item", states: roleStates("E", "E", "E") },
  { screen: "Track > Iteration Status", action: "Delete work item from iteration view", permission: "iteration_status:delete_item", states: roleStates("E", "E", "E") },
  { screen: "Track > Team Status", action: "View grouped member/task status", permission: "team_status:view", states: roleStates("E", "E", "H") },
  { screen: "Track > Team Status", action: "Edit member capacity", permission: "team_status:edit_capacity", states: roleStates("E", "E", "H") },
  { screen: "Track > Team Status", action: "Edit task fields", permission: "team_status:edit_task", states: roleStates("E", "E", "H") },
  { screen: "Track > Team Status", action: "View related work item or task detail", permission: "team_status:view_related_item", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Releases", action: "View release dashboard and detail", permission: "releases:view", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Releases", action: "Create release", permission: "releases:create", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Releases", action: "Edit release fields and artifact assignment", permission: "releases:edit", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Releases", action: "Delete release", permission: "releases:delete", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Milestones", action: "View milestone dashboard, detail and artifacts", permission: "milestones:view", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Milestones", action: "Create milestone", permission: "milestones:create", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Milestones", action: "Edit milestone fields and relations", permission: "milestones:edit", states: roleStates("E", "E", "H") },
  { screen: "Timeboxes > Milestones", action: "Delete milestone", permission: "milestones:delete", states: roleStates("E", "E", "H") },
  { screen: "Quality > Defect", action: "View defect dashboard", permission: "quality:view_dashboard", states: roleStates("E", "E", "E") },
  { screen: "Quality > Defect", action: "Create defect", permission: "defects:create", states: roleStates("E", "E", "E") },
  { screen: "Quality > Defect", action: "Edit severity, priority, state, flow state, owner and fixed build", permission: "defects:edit", states: roleStates("E", "E", "E") },
  { screen: "Quality > Defect", action: "Delete defect", permission: "defects:delete", states: roleStates("E", "E", "E") },
  { screen: "Notifications", action: "View assignment and note mention alerts", permission: "notifications:view", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Notifications", action: "Edit notification read state", permission: "notifications:mark_read", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Notifications", action: "View related US/DE target", permission: "notifications:view_target", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Settings > Personal", action: "View own profile preferences", permission: "profile:view", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Settings > Personal", action: "Edit own profile preferences", permission: "profile:edit", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Manage Projects > Project Settings", action: "View project settings", permission: "project_settings:view", states: roleStates("E", "R", "R") },
  { screen: "Manage Projects > Project Settings", action: "Edit project settings", permission: "project_settings:edit", states: roleStates("E", "H", "H") },
  { screen: "Settings > Workspace", action: "View workspace settings and role matrix", permission: "workspace_settings:view", states: roleStates("E", "H", "H") },
  { screen: "Settings > Workspace", action: "Edit workspace settings", permission: "workspace_settings:edit", states: roleStates("E", "H", "H") },
  { screen: "Settings > Workspace", action: "Edit role matrix and permissions", permission: "permission_matrix:edit", states: roleStates("H", "H", "H") },
  { screen: "Audit Log", action: "View workspace audit trail", permission: "audit_log:view", states: roleStates("E", "H", "H") },
  // Phase 5 access is fixed by Project Access Level. Editor cannot open Portfolio.
  { screen: "Portfolio > Portfolio Items", action: "View Feature list and detail", permission: "portfolio_items:view", states: roleStates("E", "E", "H") },
  { screen: "Portfolio > Portfolio Items", action: "Create feature", permission: "portfolio_items:create", states: roleStates("E", "E", "H") },
  { screen: "Portfolio > Portfolio Items", action: "Edit feature fields and archive state", permission: "portfolio_items:edit", states: roleStates("E", "E", "H") },
  { screen: "Portfolio > Capacity Planning", action: "Manage Capacity Planning", permission: "capacity_planning:manage", states: roleStates("E", "E", "H") },
];

export function userStatusCfg(s: WorkspaceUser["status"]) {
  if (s === "Active") return { bg: "#eef6f0", text: "#1e6930" };
  if (s === "Invited") return { bg: "#fef5e4", text: "#8a5808" };
  return { bg: "#fef2f2", text: "#b91c1c" };
}

export function wfCategoryCfg(c: WorkflowStatusItem["category"]) {
  if (c === "To Do") return { bg: "#eef3fb", text: "#475569" };
  if (c === "In Progress") return { bg: "#fef5e4", text: "#8a5808" };
  return { bg: "#eef6f0", text: "#1e6930" };
}

function ConfirmRemoveUserAccess({ user, onCancel, onConfirm }: { user: SettingsUser; onCancel: () => void; onConfirm: () => void }) {
  const [typedName, setTypedName] = useState("");
  const canConfirm = typedName.trim() === user.name;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.42)" }} onClick={onCancel} />
      <div className="relative w-full max-w-[440px] bg-white rounded-md shadow-2xl p-5" style={{ border: "1px solid #d4d8de" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center mb-3" style={{ color: "#b91c1c", backgroundColor: "#fef2f2" }}><AlertTriangle size={17} /></div>
        <h3 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>Remove {user.name}'s access?</h3>
        <p className="text-[11px] mt-2 leading-5" style={{ color: "#5c6478" }}>The user will be removed from the company user list and will lose workspace access on the next page refresh.</p>
        <label className="block mt-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Type {user.name} to confirm</span>
          <input value={typedName} onChange={event => setTypedName(event.target.value)} className="w-full mt-1 px-3 py-2 rounded text-[12px] focus:outline-none" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
        </label>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onCancel} className="px-3 py-1.5 rounded text-[11px] font-semibold" style={{ border: "1px solid #d9dee7", color: "#5c6478" }}>Cancel</button>
          <button disabled={!canConfirm} onClick={onConfirm} className="px-3 py-1.5 rounded text-[11px] font-semibold text-white disabled:opacity-45" style={{ backgroundColor: "#b91c1c" }}>Remove User Access</button>
        </div>
      </div>
    </div>
  );
}

function UserDetailModal({ user, projectTeamsByProject, isInvite = false, onClose, onSave, onRemoveAccess }: { user: SettingsUser; projectTeamsByProject: Record<string, string[]>; isInvite?: boolean; onClose: () => void; onSave: (user: SettingsUser) => void; onRemoveAccess?: (user: SettingsUser) => void }) {
  const [draft, setDraft] = useState<SettingsUser>(user);
  const [reviewing, setReviewing] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<"general" | "permissions">("general");
  const isWorkspaceAdmin = draft.role === "Workspace Admin";

  function updateProjectAccess(index: number, patch: Partial<UserProjectAccess>) {
    setDraft(previous => ({
      ...previous,
      projectAccess: previous.projectAccess.map((access, accessIndex) => {
        if (accessIndex !== index) return access;
        const next = { ...access, ...patch };
        if (next.level === "Admin") next.teams = ["All Teams"];
        if (patch.projectKey && next.level === "Editor") next.teams = [];
        return next;
      }),
    }));
  }

  function addProjectAccess() {
    const project = SCOPE_PROJECTS.find(candidate => !draft.projectAccess.some(access => access.projectKey === candidate.key));
    if (!project) return;
    setDraft(previous => ({ ...previous, projectAccess: [...previous.projectAccess, { projectKey: project.key, level: "Admin", teams: ["All Teams"] }] }));
  }

  function toggleTeam(index: number, team: string) {
    const access = draft.projectAccess[index];
    const teams = access.teams.includes(team) ? access.teams.filter(item => item !== team) : [...access.teams, team];
    updateProjectAccess(index, { teams });
  }

  function save() {
    onSave({ ...draft, name: draft.name.trim() || user.name, email: draft.email.trim(), phoneNumber: draft.phoneNumber.trim() });
  }

  const hasValidTeamAssignments = draft.projectAccess.every(access => access.level !== "Editor" || access.teams.length > 0);
  const canSave = draft.name.trim().length > 0 && draft.email.trim().length > 0 && hasValidTeamAssignments;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.34)" }} onClick={onClose} />
      <div className="relative w-full max-w-[780px] max-h-[88vh] bg-white rounded-md shadow-2xl overflow-hidden flex flex-col" style={{ border: "1px solid #d4d8de" }}>
        <div className="h-14 px-5 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
          <div>
            <p className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>{isInvite ? "Invite User" : "User Details"}</p>
            <p className="text-[10px]" style={{ color: "#8c94a6" }}>Manage account details and project-specific access</p>
          </div>
          <button aria-label="Close" onClick={onClose} className="p-1 rounded" style={{ color: "#8c94a6" }}><X size={15} /></button>
        </div>

        <div className="h-10 px-5 flex items-end gap-5 shrink-0" style={{ borderBottom: "1px solid #e2e6eb", backgroundColor: "#fbfcfe" }}>
          {(["general", "permissions"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveDetailTab(tab)} className="h-10 px-1 text-[11px] font-semibold" style={{ color: activeDetailTab === tab ? "#1d3f73" : "#6b7280", borderBottom: activeDetailTab === tab ? "2px solid #1d3f73" : "2px solid transparent" }}>{tab === "general" ? "General" : "Project Access"}</button>
          ))}
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          <section className={activeDetailTab === "general" ? "" : "hidden"}>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#8c94a6" }}>Basic Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-[10px] font-semibold" style={{ color: "#5c6478" }}>Name</span>
                <input disabled={isWorkspaceAdmin} value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} className="w-full h-9 px-3 rounded text-[12px] focus:outline-none disabled:bg-[#f4f6f9]" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-semibold" style={{ color: "#5c6478" }}>Email</span>
                <input disabled={!isInvite} value={draft.email} onChange={event => setDraft({ ...draft, email: event.target.value })} className="w-full h-9 px-3 rounded text-[12px] focus:outline-none disabled:bg-[#f4f6f9]" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-semibold" style={{ color: "#5c6478" }}>Phone number</span>
                <input disabled={isWorkspaceAdmin} value={draft.phoneNumber} onChange={event => setDraft({ ...draft, phoneNumber: event.target.value })} className="w-full h-9 px-3 rounded text-[12px] focus:outline-none disabled:bg-[#f4f6f9]" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-semibold" style={{ color: "#5c6478" }}>Status</span>
                <select disabled={isInvite || isWorkspaceAdmin} value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value as WorkspaceUser["status"] })} className="w-full h-9 px-3 rounded text-[12px] bg-white focus:outline-none disabled:bg-[#f4f6f9]" style={{ border: "1px solid #d9dee7", color: "#1a2234" }}>
                  {(["Active", "Invited", "Deactive"] as WorkspaceUser["status"][]).map(item => <option key={item} value={item}>{item === "Deactive" ? "Disabled" : item}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className={activeDetailTab === "permissions" ? "" : "hidden"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>Project Access</h3>
              {!isWorkspaceAdmin && <button disabled={draft.projectAccess.length >= SCOPE_PROJECTS.length} onClick={addProjectAccess} className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-semibold disabled:opacity-40" style={{ color: "#1d3f73", border: "1px solid #bdd0ea" }}><Plus size={11} /> Add Project Access</button>}
            </div>

            {isWorkspaceAdmin ? (
              <div className="flex items-center gap-3 px-3 py-3 rounded" style={{ border: "1px solid #d9dee7" }}>
                <Globe size={14} style={{ color: "#1d3f73" }} />
                <div className="flex-1"><p className="text-[12px] font-semibold" style={{ color: "#1a2234" }}>No Project Assignment</p><p className="text-[10px]" style={{ color: "#8c94a6" }}>Workspace Admin authority is workspace-level and is not assigned through projects.</p></div>
                <AccessBadge value="Workspace Admin" />
              </div>
            ) : (
              <div className="space-y-2">
                {draft.projectAccess.map((access, index) => {
                  const project = SCOPE_PROJECTS.find(candidate => candidate.key === access.projectKey) ?? SCOPE_PROJECTS[0];
                  const availableTeams = projectTeamsByProject[access.projectKey] ?? project.teams;
                  const teamSelectable = access.level === "Editor";
                  return (
                    <div key={`${access.projectKey}-${index}`} className="rounded p-3" style={{ border: "1px solid #d9dee7" }}>
                      <div className="grid items-end gap-3" style={{ gridTemplateColumns: "minmax(180px,1fr) 180px 28px" }}>
                        <label className="space-y-1">
                          <span className="text-[10px] font-semibold" style={{ color: "#5c6478" }}>Project</span>
                          <select value={access.projectKey} onChange={event => updateProjectAccess(index, { projectKey: event.target.value, teams: [] })} className="w-full h-8 px-2 rounded text-[11px] bg-white" style={{ border: "1px solid #d9dee7", color: "#1a2234" }}>
                            {SCOPE_PROJECTS.map(candidate => <option key={candidate.key} value={candidate.key} disabled={draft.projectAccess.some((item, itemIndex) => itemIndex !== index && item.projectKey === candidate.key)}>{candidate.name}</option>)}
                          </select>
                        </label>
                        <label className="space-y-1">
                          <span className="text-[10px] font-semibold" style={{ color: "#5c6478" }}>Access Level</span>
                          <select value={access.level} onChange={event => updateProjectAccess(index, { level: event.target.value as ProjectAccessLevel })} className="w-full h-8 px-2 rounded text-[11px] bg-white" style={{ border: "1px solid #d9dee7", color: "#1a2234" }}>
                            {PROJECT_ACCESS_LEVELS.map(level => <option key={level}>{level}</option>)}
                          </select>
                        </label>
                        <button aria-label={`Remove ${project.name} access row`} onClick={() => setDraft(previous => ({ ...previous, projectAccess: previous.projectAccess.filter((_, accessIndex) => accessIndex !== index) }))} className="h-8 w-7 flex items-center justify-center rounded" style={{ color: "#b91c1c", border: "1px solid #f0c7c1" }}><X size={12} /></button>
                      </div>
                      <div className="mt-3 pt-3" style={{ borderTop: "1px solid #edf0f4" }}>
                        <p className="text-[10px] font-semibold mb-2" style={{ color: teamSelectable ? "#5c6478" : "#b0b8c8" }}>Teams</p>
                        {access.level === "Admin" ? (
                          <div className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-semibold" style={{ color: "#1d3f73", backgroundColor: "#edf2fb", border: "1px solid #bdd0ea" }}><CheckSquare size={11} />All Teams</div>
                        ) : teamSelectable ? (
                          <div className="flex flex-wrap gap-2">
                            {availableTeams.map(team => {
                              const checked = access.teams.includes(team);
                              return <button key={team} onClick={() => toggleTeam(index, team)} className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px]" style={{ color: checked ? "#1d3f73" : "#5c6478", backgroundColor: checked ? "#edf2fb" : "#ffffff", border: `1px solid ${checked ? "#bdd0ea" : "#d9dee7"}` }}>{checked ? <CheckSquare size={11} /> : <Square size={11} />}{team}</button>;
                            })}
                            {access.level === "Editor" && access.teams.length === 0 && <span className="self-center text-[10px]" style={{ color: "#b91c1c" }}>Select at least one team.</span>}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                {draft.projectAccess.length === 0 && <div className="py-6 text-center text-[11px] rounded" style={{ color: "#8c94a6", border: "1px dashed #cbd1dc" }}>No project access assigned.</div>}
              </div>
            )}
          </section>
        </div>

        <div className="px-5 py-3 flex items-center gap-2 shrink-0" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#fbfcfe" }}>
          {!isWorkspaceAdmin && !isInvite && onRemoveAccess && <button onClick={() => onRemoveAccess(user)} className="px-3 py-1.5 rounded text-[11px] font-semibold" style={{ border: "1px solid #f0c7c1", color: "#b91c1c" }}>Remove User Access</button>}
          <p className="ml-auto text-[10px]" style={{ color: "#8c94a6" }}>{isWorkspaceAdmin ? "Workspace Admin is managed internally and is view-only." : "Access changes apply on the next sign-in."}</p>
          <button onClick={onClose} className="px-3 py-1.5 rounded text-[11px] font-semibold" style={{ border: "1px solid #d9dee7", color: "#5c6478" }}>{isWorkspaceAdmin ? "Close" : "Cancel"}</button>
          {!isWorkspaceAdmin && <button disabled={!canSave} onClick={() => setReviewing(true)} className="px-3 py-1.5 rounded text-[11px] font-semibold text-white disabled:opacity-40" style={{ backgroundColor: "#1d3f73" }}>{isInvite ? "Review Invite" : "Review Changes"}</button>}
        </div>
      </div>

      {reviewing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.45)" }} onClick={() => setReviewing(false)} />
          <div className="relative w-full max-w-[500px] bg-white rounded-md shadow-2xl overflow-hidden" style={{ border: "1px solid #d4d8de" }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #e2e6eb" }}><h3 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>{isInvite ? "Review Invitation" : "Review Project Access"}</h3><p className="text-[10px] mt-1" style={{ color: "#8c94a6" }}>Confirm project access and team membership for {draft.name}.</p></div>
            <div className="p-5 space-y-2 max-h-72 overflow-auto">
              {!isWorkspaceAdmin && draft.projectAccess.map(access => {
                const project = SCOPE_PROJECTS.find(candidate => candidate.key === access.projectKey);
                return <div key={access.projectKey} className="flex items-center gap-3 px-3 py-2.5 rounded" style={{ backgroundColor: "#f7f8fa", border: "1px solid #e2e6eb" }}><div className="flex-1"><p className="text-[11px] font-semibold" style={{ color: "#1a2234" }}>{project?.name}</p><p className="text-[10px]" style={{ color: "#8c94a6" }}>{access.teams.length ? access.teams.join(", ") : "No team membership"}</p></div><AccessBadge value={access.level} /></div>;
              })}
              {isWorkspaceAdmin && <div className="flex items-center gap-3 px-3 py-2.5 rounded" style={{ backgroundColor: "#f7f8fa", border: "1px solid #e2e6eb" }}><div className="flex-1"><p className="text-[11px] font-semibold" style={{ color: "#1a2234" }}>No Project Assignment</p><p className="text-[10px]" style={{ color: "#8c94a6" }}>Workspace-level authority only</p></div><AccessBadge value="Workspace Admin" /></div>}
              {!isWorkspaceAdmin && draft.projectAccess.length === 0 && <p className="text-[11px]" style={{ color: "#8c94a6" }}>This user will have no project access.</p>}
            </div>
            <div className="px-5 py-3 flex justify-end gap-2" style={{ borderTop: "1px solid #e2e6eb" }}><button onClick={() => setReviewing(false)} className="px-3 py-1.5 rounded text-[11px] font-semibold" style={{ border: "1px solid #d9dee7", color: "#5c6478" }}>Back</button><button onClick={save} className="px-3 py-1.5 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}>{isInvite ? "Send Invite" : "Confirm & Save"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SettingsPage({ role, projectReadOnly = false, initialTab = "profile" }: { role: Role; projectReadOnly?: boolean; initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [settingsUsers, setSettingsUsers] = useState<SettingsUser[]>(SETTINGS_USERS);
  const [workspaceProjectTeams, setWorkspaceProjectTeams] = useState<Record<string, string[]>>(() => Object.fromEntries(SCOPE_PROJECTS.map(project => [project.key, project.teams])));
  const [selectedUser, setSelectedUser] = useState<SettingsUser | null>(null);
  const [inviteUserOpen, setInviteUserOpen] = useState(false);
  const [removeUserTarget, setRemoveUserTarget] = useState<SettingsUser | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState("All");
  const [auditNameQuery, setAuditNameQuery] = useState("");
  const [auditTimeQuery, setAuditTimeQuery] = useState("");
  const canManageProjectSettings = can.manageSettings(role) && !projectReadOnly;
  const canManageWorkspaceSettings = role === "Workspace Admin";
  useEffect(() => setActiveTab(initialTab), [initialTab]);
  const roleCanOpenTab = role === "Workspace Admin"
    || (role === "Admin" && ["profile", "myPermissions", "workspaceProjects", "permissionModel"].includes(activeTab))
    || (role === "Editor" && ["profile", "myPermissions", "workspaceProjects"].includes(activeTab));
  const visibleActiveTab = roleCanOpenTab ? activeTab : "profile";
  const demoProfile = DEMO_ACCESS_PROFILES[role];
  const myPermissionRows = role === "Workspace Admin"
    ? [{ project: "All Projects", access: "Workspace Admin" as const, teams: "All Teams", capabilities: "Full workspace and project administration" }]
    : role === "Admin"
      ? [
        ...ROLE_SCOPE.adminProjectKeys.map(projectKey => ({ project: SCOPE_PROJECTS.find(project => project.key === projectKey)?.name ?? projectKey, access: "Admin" as const, teams: "All Teams", capabilities: "Manage work items, timeboxes, releases and reports" })),
      ]
      : [{ project: SCOPE_PROJECTS.find(project => project.key === ROLE_SCOPE.editorProjectKey)?.name ?? ROLE_SCOPE.editorProjectKey, access: "Editor" as const, teams: ROLE_SCOPE.editorTeams.join(", "), capabilities: "Create, edit and delete work items; update iteration status" }];
  const sections = [
    { group: "Personal", items: [{ key: "profile", label: "Profile & Account", icon: <UserCheck size={13} /> }, { key: "myPermissions", label: "My Permissions", icon: <Shield size={13} /> }] },
    { group: "Administration", items: [{ key: "workspace", label: "Workspace Settings", icon: <Globe size={13} />, gate: can.viewAdmin(role) }, { key: "members", label: "Users", icon: <Users size={13} />, gate: can.manageUsers(role) }, { key: "workspaceProjects", label: "Workspaces & Projects", icon: <Package size={13} />, gate: true }, { key: "permissionModel", label: "Permission Model", icon: <Shield size={13} />, gate: role !== "Editor" }, { key: "audit", label: "Audit Log", icon: <FileText size={13} />, gate: can.viewAdmin(role) }] },
  ];

  const fieldRow = (label: string, value: string, w = "w-36", disabled = false) => (
    <div key={label} className="flex items-center gap-4">
      <label className={cx(w, "text-[11px] font-semibold shrink-0")} style={{ color: "#5c6478" }}>{label}</label>
      <input disabled={disabled} defaultValue={value} className="flex-1 max-w-72 text-[12px] px-3 py-1.5 rounded focus:outline-none disabled:bg-[#f4f6f9]" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} />
    </div>
  );
  const toggleRow = (label: string, on = true, disabled = false) => (
    <div key={label} className="flex items-center gap-4">
      <label className="w-36 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>{label}</label>
      <Toggle on={on} disabled={disabled} />
    </div>
  );

  const usersFiltered = settingsUsers.filter(user => {
    return (userStatusFilter === "All" || user.status === userStatusFilter) && `${user.name} ${user.email} ${user.phoneNumber}`.toLowerCase().includes(userSearch.toLowerCase());
  });
  const workspaceOwner = settingsUsers.find(u => u.role === "Workspace Admin") || settingsUsers[0];
  const auditFiltered = AUDIT_LOG_DATA.filter(item => item.actor.toLowerCase().includes(auditNameQuery.toLowerCase()) && item.time.toLowerCase().includes(auditTimeQuery.toLowerCase()));
  function saveUser(updatedUser: SettingsUser) {
    setSettingsUsers(previous => previous.map(user => user.email === updatedUser.email ? updatedUser : user));
    setSelectedUser(null);
  }
  function inviteUser(user: SettingsUser) {
    setSettingsUsers(previous => [...previous, user]);
    setInviteUserOpen(false);
  }
  function removeUserAccess(userToRemove: SettingsUser) {
    setSettingsUsers(previous => previous.filter(user => user.email !== userToRemove.email));
    setSelectedUser(null);
    setRemoveUserTarget(null);
  }
  function changeProjectAccess(email: string, projectKey: string, level: ProjectAccessLevel | undefined, teams: string[]) {
    setSettingsUsers(previous => previous.map(user => {
      if (user.email !== email || user.role === "Workspace Admin") return user;
      const otherProjects = user.projectAccess.filter(access => access.projectKey !== projectKey);
      return { ...user, projectAccess: level ? [...otherProjects, { projectKey, level, teams }] : otherProjects };
    }));
  }
  function addProjectTeam(projectKey: string, teamName: string) {
    setWorkspaceProjectTeams(previous => ({ ...previous, [projectKey]: Array.from(new Set([...(previous[projectKey] ?? []), teamName])) }));
  }

  const content: Record<string, React.ReactNode> = {
    permissionModel: (
      <div className="max-w-5xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div><p className="text-[12px] font-semibold" style={{ color: "#1a2234" }}>Project-scoped access</p><p className="mt-1 text-[10px]" style={{ color: "#8c94a6" }}>Access is assigned per Project. Admin receives All Teams; Editor requires one or more explicit Teams.</p></div>
          <span className="inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[10px] font-semibold" style={{ color: "#5c6478", backgroundColor: "#f4f6f9", borderColor: "#dde2ea" }}><Lock size={10} /> Fixed model</span>
        </div>
        <div className="grid grid-cols-2 overflow-hidden rounded border" style={{ borderColor: "#d9dee7" }}>
          {[
            { name: "Admin", tone: "#1d3f73", bg: "#e8eef8", body: "Manage delivery features in the assigned project. Project, user, access and team administration remain Workspace Admin-only." },
            { name: "Editor", tone: "#1e6930", bg: "#eef6f0", body: "Create, edit and delete team-scoped Work Items, Tasks and Quality Defects; update Iteration Status." },
          ].map((item, index) => <div key={item.name} className="min-h-32 p-4" style={{ borderRight: index < 1 ? "1px solid #e2e6eb" : undefined }}><span className="inline-flex rounded-sm px-2 py-0.5 text-[10px] font-semibold" style={{ color: item.tone, backgroundColor: item.bg }}>{item.name}</span><p className="mt-3 text-[11px] leading-5" style={{ color: "#5c6478" }}>{item.body}</p></div>)}
        </div>
        <div className="mt-4 rounded border" style={{ borderColor: "#d9dee7" }}>
          {[
            ["Workspace Admin", "Workspace-level authority; manages projects, users, access and global settings."],
            ["Admin", "Project-level access; manages delivery features in the assigned project. Administration remains Workspace Admin-only."],
            ["Editor", "Project-and-team access; manages delivery work without administration access."],
            ["Unassigned user", "No Project row exists; the Project is hidden and direct access is denied."],
          ].map(([label, detail], index) => <div key={label} className="grid min-h-11 grid-cols-[170px_1fr] items-center px-3" style={{ backgroundColor: index % 2 ? "#fbfcfe" : "white", borderBottom: index < 3 ? "1px solid #edf0f4" : undefined }}><span className="text-[11px] font-semibold" style={{ color: "#1a2234" }}>{label}</span><span className="text-[11px]" style={{ color: "#5c6478" }}>{detail}</span></div>)}
        </div>
      </div>
    ),
    myPermissions: (
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <div><p className="text-[12px] font-semibold" style={{ color: "#1a2234" }}>ACME Space Inc.</p><p className="text-[10px] mt-1" style={{ color: "#8c94a6" }}>Your effective access is read-only. Contact a Workspace Admin to request a change.</p></div>
          <AccessBadge value={demoProfile.label} />
        </div>
        <div className="rounded overflow-hidden" style={{ border: "1px solid #d9dee7" }}>
          <div className="grid h-9 items-center" style={{ gridTemplateColumns: "minmax(190px,1fr) 140px 170px minmax(260px,1.4fr)", backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {["Project", "Access", "Team Membership", "Effective Capabilities"].map(label => <div key={label} className="px-3 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>{label}</div>)}
          </div>
          {myPermissionRows.map((item, index) => (
            <div key={`${item.project}-${item.access}`} className="grid min-h-12 items-center" style={{ gridTemplateColumns: "minmax(190px,1fr) 140px 170px minmax(260px,1.4fr)", backgroundColor: index % 2 ? "#fbfcfe" : "#ffffff", borderBottom: index < myPermissionRows.length - 1 ? "1px solid #edf0f4" : undefined }}>
              <div className="px-3 text-[11px] font-semibold" style={{ color: "#1a2234" }}>{item.project}</div>
              <div className="px-3"><AccessBadge value={item.access} /></div>
              <div className="px-3 text-[11px]" style={{ color: "#5c6478" }}>{item.teams}</div>
              <div className="px-3 text-[11px]" style={{ color: "#3a4254" }}>{item.capabilities}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    profile: (
      <div className="space-y-5">
        <div className="flex items-center gap-4 pb-4" style={{ borderBottom: "1px solid #e2e6eb" }}>
          <Avatar owner={demoProfile.owner} size="lg" />
          <div><p className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>{demoProfile.name}</p><p className="text-[12px]" style={{ color: "#5c6478" }}>{demoProfile.email}</p><div className="mt-1"><RoleBadge role={role} /></div></div>
          <button className="ml-auto px-3 py-1.5 text-[11px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}>Edit Profile</button>
        </div>
        {[["Full Name", demoProfile.name], ["Email", demoProfile.email], ["Time Zone", "UTC-5 (Eastern Time)"], ["Language", "English (US)"]].map(([l, v]) => fieldRow(l, v))}
      </div>
    ),
    project: (
      <div className="space-y-5 max-w-xl">
        {fieldRow("Project Name", "Nexus Platform 2025", "w-36", projectReadOnly)}
        {fieldRow("Project Key", "NXP", "w-36", projectReadOnly)}
        <div className="flex items-center gap-4"><label className="w-36 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>Default Workflow</label><select disabled={projectReadOnly} className="text-[12px] px-2.5 py-1.5 rounded bg-white focus:outline-none disabled:bg-[#f4f6f9]" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}><option>Standard</option><option>Kanban</option><option>Custom</option></select></div>
        <div className="flex items-center gap-4"><label className="w-36 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>Default Assignee</label><select disabled={projectReadOnly} className="text-[12px] px-2.5 py-1.5 rounded bg-white focus:outline-none disabled:bg-[#f4f6f9]" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select></div>
        {toggleRow("Enable Sprint", true, projectReadOnly)}
        {toggleRow("Enable Release", true, projectReadOnly)}
        {toggleRow("Enable Story Points", true, projectReadOnly)}
        {fieldRow("Work Item Key Prefix", "NXP", "w-36", projectReadOnly)}
        {canManageProjectSettings && <div className="pt-3" style={{ borderTop: "1px solid #e2e6eb" }}><button className="px-4 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}>Save Changes</button></div>}
      </div>
    ),
    workflow: (
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px]" style={{ color: "#5c6478" }}>Define the statuses work items move through.</p>
          {canManageProjectSettings && <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded" style={{ border: "1px solid #1d3f73", color: "#1d3f73" }}><Plus size={12} /> Add Status</button>}
        </div>
        <div className="rounded overflow-hidden" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center h-8 px-3 gap-2" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {[["flex-1", "Status Name"], ["w-32", "Category"], ["w-16 text-center", "Order"], ["w-16 text-center", "Final?"], ["w-24 text-right", "Actions"]].map(([c, l], i) => <div key={i} className={cx(c, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{l}</div>)}
          </div>
          {WORKFLOW_STATUSES.map(ws => { const c = wfCategoryCfg(ws.category); return (
            <div key={ws.id} className="flex items-center h-9 px-3 gap-2" style={{ borderBottom: "1px solid #f0f2f5" }}>
              <div className="flex-1 text-[12px] font-medium" style={{ color: "#1a2234" }}>{ws.name}</div>
              <div className="w-32"><span className="px-2 py-px text-[10px] font-semibold rounded-sm" style={{ backgroundColor: c.bg, color: c.text }}>{ws.category}</span></div>
              <div className="w-16 text-center text-[11px] tabular-nums" style={{ color: "#5c6478" }}>{ws.order}</div>
              <div className="w-16 text-center">{ws.isFinal ? <Check size={13} className="inline" style={{ color: "#2a8c3f" }} /> : <Minus size={13} className="inline" style={{ color: "#c4cad4" }} />}</div>
              <div className="w-24 flex items-center justify-end gap-1">{canManageProjectSettings && <><button className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => (e.currentTarget.style.color = "#1a2234")} onMouseLeave={e => (e.currentTarget.style.color = "#8c94a6")}><Edit3 size={12} /></button><button className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => (e.currentTarget.style.color = "#b91c1c")} onMouseLeave={e => (e.currentTarget.style.color = "#8c94a6")}><X size={12} /></button></>}</div>
            </div>
          ); })}
        </div>
      </div>
    ),
    labels: (
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px]" style={{ color: "#5c6478" }}>Manage labels used to categorize work items.</p>
          {canManageProjectSettings && <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded" style={{ border: "1px solid #1d3f73", color: "#1d3f73" }}><Plus size={12} /> Add Label</button>}
        </div>
        <div className="rounded overflow-hidden" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center h-8 px-3 gap-2" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {[["flex-1", "Label"], ["w-28 text-center", "Usage"], ["w-24 text-right", "Actions"]].map(([c, l], i) => <div key={i} className={cx(c, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{l}</div>)}
          </div>
          {LABELS_DATA.map(lab => (
            <div key={lab.id} className="flex items-center h-9 px-3 gap-2" style={{ borderBottom: "1px solid #f0f2f5" }}>
              <div className="flex-1 flex items-center gap-2"><span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lab.color }} /><span className="text-[12px] font-medium" style={{ color: "#1a2234" }}>{lab.name}</span></div>
              <div className="w-28 text-center"><span className="text-[10px] font-semibold px-1.5 py-px rounded-sm" style={{ backgroundColor: "#f0f2f5", color: "#5c6478" }}>{lab.usage} items</span></div>
              <div className="w-24 flex items-center justify-end gap-1">{canManageProjectSettings && <><button className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => (e.currentTarget.style.color = "#1a2234")} onMouseLeave={e => (e.currentTarget.style.color = "#8c94a6")}><Edit3 size={12} /></button><button className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => (e.currentTarget.style.color = "#b91c1c")} onMouseLeave={e => (e.currentTarget.style.color = "#8c94a6")}><X size={12} /></button></>}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    workspace: (
      <div className="space-y-5 max-w-2xl">
        {fieldRow("Workspace Name", "ACME Space Inc.", "w-40", !canManageWorkspaceSettings)}
        {fieldRow("Workspace Slug", "acme-space", "w-40", true)}
        <div className="flex items-center gap-4">
          <label className="w-40 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>Workspace Scope</label>
          <span className="text-[12px] px-3 py-1.5 rounded" style={{ color: "#1a2234", backgroundColor: "#f4f6f9", border: "1px solid #dde2ea" }}>Fixed Workspace</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-40 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>Workspace Admin</label>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor: "#f4f6f9", border: "1px solid #dde2ea" }}>
            <Avatar owner={workspaceOwner.owner} size="sm" />
            <div>
              <p className="text-[12px] font-semibold leading-4" style={{ color: "#1a2234" }}>{workspaceOwner.name}</p>
              <p className="text-[10px] leading-4" style={{ color: "#8c94a6" }}>Assigned internally</p>
            </div>
          </div>
        </div>
        {canManageWorkspaceSettings && <div className="pt-3" style={{ borderTop: "1px solid #e2e6eb" }}><button className="px-4 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}>Save Changes</button></div>}
      </div>
    ),
    members: (
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} />
              <input value={userSearch} onChange={event => setUserSearch(event.target.value)} placeholder="Search name, phone or email..." className="w-64 pl-7 pr-3 py-1.5 rounded text-[11px] focus:outline-none" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
            </div>
            <select aria-label="Filter by status" value={userStatusFilter} onChange={event => setUserStatusFilter(event.target.value)} className="text-[11px] px-2 py-1.5 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{["All", "Active", "Invited", "Deactive"].map(item => <option key={item} value={item}>{item === "All" ? "All statuses" : item === "Deactive" ? "Disabled" : item}</option>)}</select>
          </div>
          {can.manageUsers(role) && <button onClick={() => setInviteUserOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}><UserPlus size={12} /> Invite User</button>}
        </div>
        <div className="rounded overflow-hidden" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center h-8 px-3 gap-2" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {[["w-44", "Name"], ["flex-1", "Email"], ["w-36", "Phone Number"], ["w-24", "Status"], ["w-36", "Last Login"]].map(([c, l], i) => <div key={i} className={cx(c, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{l}</div>)}
          </div>
          {usersFiltered.map(u => (
            <button key={u.email} onClick={() => setSelectedUser(u)} className="w-full flex items-center h-10 px-3 gap-2 text-left hover:bg-[#f7f8fa]" style={{ borderBottom: "1px solid #f0f2f5" }}>
              <div className="w-44 flex items-center gap-2"><Avatar owner={u.owner} size="sm" /><span className="text-[12px] font-medium truncate" style={{ color: "#1a2234" }}>{u.name}</span></div>
              <div className="flex-1 text-[11px] truncate" style={{ color: "#5c6478" }}>{u.email}</div>
              <div className="w-36 text-[10px]" style={{ color: "#5c6478" }}>{u.phoneNumber}</div>
              <div className="w-24"><span className="inline-flex rounded-sm px-2 py-0.5 text-[9px] font-semibold" style={{ color: userStatusCfg(u.status).text, backgroundColor: userStatusCfg(u.status).bg }}>{u.status === "Deactive" ? "Disabled" : u.status}</span></div>
              <div className="w-36 text-[10px]" style={{ color: "#8c94a6" }}>{u.lastLogin}</div>
            </button>
          ))}
          {usersFiltered.length === 0 && <div className="px-3 py-6 text-center text-[11px]" style={{ color: "#8c94a6" }}>No users found.</div>}
        </div>
      </div>
    ),
    roles: (
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <div><div className="flex items-center gap-2"><Shield size={15} style={{ color: "#1d3f73" }} /><span className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Role Actions by Screen</span></div><p className="text-[10px] mt-1" style={{ color: "#8c94a6" }}>Permissions are evaluated by action and project scope. This reference is fixed and read-only.</p></div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-semibold" style={{ color: "#5c6478", backgroundColor: "#f4f6f9", border: "1px solid #dde2ea" }}><Lock size={10} /> Fixed access model</span>
        </div>

        <div className="rounded overflow-hidden" style={{ border: "1px solid #d9dee7" }}>
          <div className="grid h-10 items-center" style={{ gridTemplateColumns: "170px minmax(250px,1fr) 130px 120px 120px", backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {["Screen", "Action", "Workspace Admin", "Admin", "Editor"].map(label => <div key={label} className="px-3 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>{label}</div>)}
          </div>
          {SCREEN_ACTION_ACCESS_ROWS.map((item, index) => (
            <div key={`${item.screen}-${item.action}`} className="grid min-h-10 items-center" style={{ gridTemplateColumns: "170px minmax(250px,1fr) 130px 120px 120px", backgroundColor: index % 2 ? "#fbfcfe" : "#ffffff", borderBottom: index < SCREEN_ACTION_ACCESS_ROWS.length - 1 ? "1px solid #edf0f4" : undefined }}>
              <div className="px-3 text-[10px] font-semibold" style={{ color: "#3a4254" }}>{item.screen}</div>
              <div className="px-3 text-[10px]" style={{ color: "#3a4254" }}>{item.action}</div>
              {[item.wa, item.admin, item.editor].map((value, valueIndex) => <div key={`${item.screen}-${item.action}-${valueIndex}`} className="px-3"><FixedAccessBadge value={value} /></div>)}
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { title: "Rule source", value: "Action + scope", detail: "Screens only reflect the effective permissions" },
            { title: "Project access", value: "Assigned explicitly", detail: "Admin or Editor per Project; otherwise unassigned" },
            { title: "Permission changes", value: "Next sign-in", detail: "Removal takes effect on page refresh" },
          ].map(item => <div key={item.title} className="px-3 py-3 rounded" style={{ border: "1px solid #d9dee7", backgroundColor: "#fbfcfe" }}><p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>{item.title}</p><p className="text-[12px] font-semibold mt-1" style={{ color: "#1a2234" }}>{item.value}</p><p className="text-[10px] mt-1" style={{ color: "#5c6478" }}>{item.detail}</p></div>)}
        </div>
      </div>
    ),
    audit: (
      <div>
        <div className="flex items-end justify-between gap-3 mb-3">
          <p className="text-[12px]" style={{ color: "#5c6478" }}>Administrative and settings changes only.</p>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} />
              <input value={auditNameQuery} onChange={event => setAuditNameQuery(event.target.value)} placeholder="Search actor name..." className="w-44 pl-7 pr-3 py-1.5 rounded text-[11px] focus:outline-none" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
            </div>
            <div className="relative">
              <Clock size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} />
              <input value={auditTimeQuery} onChange={event => setAuditTimeQuery(event.target.value)} placeholder="Search time..." className="w-56 pl-7 pr-3 py-1.5 rounded text-[11px] focus:outline-none" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
            </div>
          </div>
        </div>
        <div className="rounded overflow-hidden" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center h-8 px-3 gap-2" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {[["w-72", "Time"], ["w-40", "Actor"], ["flex-1", "Detail"]].map(([c, l], i) => <div key={i} className={cx(c, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{l}</div>)}
          </div>
          {auditFiltered.map((a, i) => (
            <div key={i} className="flex items-center min-h-10 px-3 gap-2 py-1.5" style={{ borderBottom: "1px solid #f0f2f5" }}>
              <div className="w-72 text-[10px]" style={{ color: "#8c94a6" }}>{a.time}</div>
              <div className="w-40 text-[11px] font-medium truncate" style={{ color: "#1a2234" }}>{a.actor}</div>
              <div className="flex-1 text-[11px] truncate" style={{ color: "#3a4254" }}>{a.details}</div>
            </div>
          ))}
          {auditFiltered.length === 0 && <div className="px-3 py-6 text-center text-[11px]" style={{ color: "#8c94a6" }}>No audit events found.</div>}
        </div>
      </div>
    ),
  };

  return (
    <>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-52 shrink-0 bg-white overflow-y-auto" style={{ borderRight: "1px solid #e2e6eb" }}>
          <div className="px-3 py-3">
            {sections.map(sec => (
              <div key={sec.group} className="mb-4">
                <p className="text-[9px] uppercase tracking-widest font-semibold px-2 mb-1" style={{ color: "#8c94a6" }}>{sec.group}</p>
                {sec.items.map(item => {
                  const locked = item.gate === false;
                  return (
                    <button key={item.key} onClick={() => !locked && setActiveTab(item.key)} className={cx("w-full flex items-center gap-2 px-2 py-1.5 text-[12px] rounded text-left mb-0.5", locked && "opacity-40 cursor-not-allowed")} style={{ backgroundColor: visibleActiveTab === item.key ? "#edf2fb" : "transparent", color: visibleActiveTab === item.key ? "#1d3f73" : "#3a4254", fontWeight: visibleActiveTab === item.key ? 600 : 400 }} disabled={locked}>
                      <span style={{ color: visibleActiveTab === item.key ? "#1d3f73" : "#8c94a6" }}>{item.icon}</span>
                      {item.label}
                      {locked && <Lock size={10} className="ml-auto" style={{ color: "#b0b8c8" }} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-white">
          <h2 className="text-[14px] font-semibold mb-4" style={{ color: "#1a2234" }}>{sections.flatMap(s => s.items).find(i => i.key === visibleActiveTab)?.label || "Settings"}</h2>
          <div style={{ display: visibleActiveTab === "workspaceProjects" ? "contents" : "none" }}>
            <WorkspaceProjectsPanel role={role} workspaceUsers={settingsUsers} onChangeProjectAccess={changeProjectAccess} onAddProjectTeam={addProjectTeam} />
          </div>
          {visibleActiveTab !== "workspaceProjects" && (content[visibleActiveTab] || <p className="text-[12px]" style={{ color: "#5c6478" }}>Select a section from the left menu.</p>)}
        </div>
      </div>
      {selectedUser && <UserDetailModal key={selectedUser.email} user={selectedUser} projectTeamsByProject={workspaceProjectTeams} onClose={() => setSelectedUser(null)} onSave={saveUser} onRemoveAccess={setRemoveUserTarget} />}
      {inviteUserOpen && <UserDetailModal isInvite user={{ name: "", email: "", phoneNumber: "", role: "Editor", status: "Invited", lastLogin: "—", owner: { name: "New User", initials: "NU", color: "#4a7c6e" }, projectAccess: [] }} projectTeamsByProject={workspaceProjectTeams} onClose={() => setInviteUserOpen(false)} onSave={inviteUser} />}
      {removeUserTarget && <ConfirmRemoveUserAccess user={removeUserTarget} onCancel={() => setRemoveUserTarget(null)} onConfirm={() => removeUserAccess(removeUserTarget)} />}
    </>
  );
}

