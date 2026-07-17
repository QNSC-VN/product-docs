import { useState } from "react";
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
import { type Role, type Page, type WorkItemType, type StatusType, type PriorityType, type Owner, type WorkItem, type Notification, type Feature, type Project, type ScopeProject, type Initiative, type ReleaseItem, type WorkspaceUser, type WorkflowStatusItem, type LabelItem, can, OWNERS, PROJECTS, SCOPE_PROJECTS, WORK_ITEMS, FEATURES, NOTIFICATIONS, VELOCITY_DATA, BURNDOWN_DATA, STATUS_PIE, INITIATIVES, RELEASES_DATA, WORKSPACE_USERS, WORKFLOW_STATUSES, LABELS_DATA, WORKLOAD_DATA, PLANNED_VS_COMPLETED, PERMISSIONS_MATRIX, DEFECT_ENVIRONMENTS, RELATED_STORIES } from "../model";
import { releaseStatusCfg, cx, Avatar, TYPE_CFG, TypeBadge, STATUS_CFG, StatusBadge, PRI_CFG, PriorityBadge, MiniProgress, RoleBadge, DetailPanel, NewItemModal, EmptyState, SectionCard } from "../components/shared";

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
  { time: "Tuesday, October 22, 2024 09:02:31", actor: "Marcus Webb", details: "Saved role permission matrix for Project Admin and Project Member." },
  { time: "Monday, October 21, 2024 16:32:41", actor: "Marcus Webb", details: "Invited Elena Kowalski as Project Member." },
  { time: "Monday, October 21, 2024 15:44:09", actor: "Marcus Webb", details: "Updated Priya Nair role from Project Member to Project Admin." },
  { time: "Sunday, October 20, 2024 11:05:22", actor: "Marcus Webb", details: "Changed Elena Kowalski status from Invited to Active." },
  { time: "Saturday, October 19, 2024 14:30:17", actor: "Marcus Webb", details: "Assigned James Okafor to Core Platform team." },
  { time: "Friday, October 18, 2024 10:15:33", actor: "Marcus Webb", details: "Archived project Mobile App MVP." },
  { time: "Tuesday, October 15, 2024 09:00:02", actor: "Marcus Webb", details: "Created team Platform Operations." },
];

export const ALL_ROLES: Role[] = ["Workspace Admin", "Project Admin", "Project Member"];
export const ROLE_ABBR: Record<Role, string> = { "Workspace Admin": "WA", "Project Admin": "PA", "Project Member": "PM" };

type ProdRoleCode = "WA" | "PA" | "PM";
type PermissionState = "E" | "R" | "D" | "H";
type RoleActionRow = { screen: string; action: string; permission: string; states: Record<ProdRoleCode, PermissionState>; locked?: boolean };
type SettingsUser = WorkspaceUser & { phoneNumber: string };

const PROD_ROLES: { code: ProdRoleCode; name: string; slug: string; summary: string }[] = [
  { code: "WA", name: "Workspace Admin", slug: "workspace_admin", summary: "Full workspace ownership" },
  { code: "PA", name: "Project Admin", slug: "project_admin", summary: "Manage assigned project; view other projects" },
  { code: "PM", name: "Project Member", slug: "project_member", summary: "Work in assigned project" },
];

const USER_PHONE_NUMBERS = ["+1 212 555 0198", "+1 415 555 0142", "+1 312 555 0167", "+1 646 555 0181", "+1 206 555 0174", "+1 503 555 0129"];
const SETTINGS_USERS: SettingsUser[] = WORKSPACE_USERS.map((user, index) => ({ ...user, phoneNumber: USER_PHONE_NUMBERS[index] ?? "+1 555 0100" }));

const STATE_STYLE: Record<PermissionState, { label: string; bg: string; text: string; border: string }> = {
  E: { label: "Enabled", bg: "#eef6f0", text: "#1e6930", border: "#bad7c1" },
  R: { label: "Read-only", bg: "#edf2fb", text: "#1d3f73", border: "#bdd0ea" },
  D: { label: "Disabled", bg: "#f7f8fa", text: "#697285", border: "#dde2ea" },
  H: { label: "Hidden", bg: "#fef2f2", text: "#b91c1c", border: "#f0c7c1" },
};
const PERMISSION_STATE_OPTIONS: PermissionState[] = ["E", "R", "D", "H"];

const roleStates = (WA: PermissionState, PA: PermissionState, PM: PermissionState): Record<ProdRoleCode, PermissionState> => ({ WA, PA, PM });

const PROD_ROLE_ACTION_MATRIX: RoleActionRow[] = [
  { screen: "Auth", action: "Create session (sign in)", permission: "auth:sign_in", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Auth", action: "View restored session", permission: "auth:restore_session", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Auth", action: "Delete session (sign out)", permission: "auth:sign_out", states: roleStates("E", "E", "E"), locked: true },
  { screen: "App Shell", action: "View navigation, breadcrumbs and workspace context", permission: "app_shell:view_navigation", states: roleStates("E", "E", "E"), locked: true },
  { screen: "App Shell", action: "Edit selected project/team context", permission: "app_shell:switch_context", states: roleStates("E", "E", "E"), locked: true },
  { screen: "App Shell", action: "View global work item search results", permission: "app_shell:search_work_items", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Home", action: "View workspace dashboard and project health", permission: "home:view_dashboard", states: roleStates("E", "E", "E") },
  { screen: "Home", action: "View My Work assigned items", permission: "home:view_my_work", states: roleStates("E", "E", "E") },
  { screen: "Manage Projects > Projects", action: "View project list, search and filters", permission: "projects:view_list", states: roleStates("E", "E", "H") },
  { screen: "Manage Projects > Projects", action: "Create project", permission: "projects:create", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Projects", action: "Edit project settings", permission: "projects:edit_settings", states: roleStates("E", "E", "H") },
  { screen: "Manage Projects > Projects", action: "Edit project status to archived", permission: "projects:archive", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Projects", action: "Edit project status to active", permission: "projects:restore", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Projects", action: "Delete project", permission: "projects:delete", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Teams", action: "View team list, search and filters", permission: "teams:view_list", states: roleStates("E", "R", "H") },
  { screen: "Manage Projects > Teams", action: "Create team", permission: "teams:create", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Teams", action: "Edit team information", permission: "teams:edit_info", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Teams", action: "Edit team status", permission: "teams:edit_status", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Teams", action: "Edit team lead", permission: "teams:edit_lead", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Teams", action: "Edit team members", permission: "teams:edit_members", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Teams", action: "Delete team access (deactivate)", permission: "teams:deactivate", states: roleStates("E", "H", "H") },
  { screen: "Manage Projects > Teams", action: "Edit team status to active", permission: "teams:restore", states: roleStates("E", "H", "H") },
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
  { screen: "Quality > Defect", action: "View defect dashboard", permission: "quality:view_dashboard", states: roleStates("E", "E", "H") },
  { screen: "Quality > Defect", action: "Create defect", permission: "defects:create", states: roleStates("E", "E", "H") },
  { screen: "Quality > Defect", action: "Edit severity, priority, state, flow state, owner and fixed build", permission: "defects:edit", states: roleStates("E", "E", "H") },
  { screen: "Quality > Defect", action: "Delete defect", permission: "defects:delete", states: roleStates("E", "E", "H") },
  { screen: "Notifications", action: "View assignment and note mention alerts", permission: "notifications:view", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Notifications", action: "Edit notification read state", permission: "notifications:mark_read", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Notifications", action: "View related US/DE target", permission: "notifications:view_target", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Settings > Personal", action: "View own profile preferences", permission: "profile:view", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Settings > Personal", action: "Edit own profile preferences", permission: "profile:edit", states: roleStates("E", "E", "E"), locked: true },
  { screen: "Manage Projects > Project Settings", action: "View project settings", permission: "project_settings:view", states: roleStates("E", "E", "H") },
  { screen: "Manage Projects > Project Settings", action: "Edit project settings", permission: "project_settings:edit", states: roleStates("E", "E", "H") },
  { screen: "Settings > Workspace", action: "View workspace settings and role matrix", permission: "workspace_settings:view", states: roleStates("E", "H", "H") },
  { screen: "Settings > Workspace", action: "Edit workspace settings", permission: "workspace_settings:edit", states: roleStates("E", "H", "H") },
  { screen: "Settings > Workspace", action: "Edit role matrix and permissions", permission: "permission_matrix:edit", states: roleStates("E", "H", "H") },
  { screen: "Audit Log", action: "View workspace audit trail", permission: "audit_log:view", states: roleStates("E", "H", "H") },
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

function UserDetailModal({ user, onClose, onSave, onRemoveAccess }: { user: SettingsUser; onClose: () => void; onSave: (user: SettingsUser) => void; onRemoveAccess: (user: SettingsUser) => void }) {
  const [draft, setDraft] = useState<SettingsUser>(user);
  const readOnly = user.role === "Workspace Admin";

  function save() {
    if (readOnly) return;
    onSave({ ...draft, name: draft.name.trim() || user.name, phoneNumber: draft.phoneNumber.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.34)" }} onClick={onClose} />
      <div className="relative w-full max-w-[520px] bg-white rounded-md shadow-2xl overflow-hidden" style={{ border: "1px solid #d4d8de" }}>
        <div className="h-12 px-4 flex items-center justify-between" style={{ borderBottom: "1px solid #e2e6eb" }}>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>User Details</p>
            <p className="text-[10px]" style={{ color: "#8c94a6" }}>{readOnly ? "Workspace Admin is assigned internally" : user.email}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded" style={{ color: "#8c94a6" }}><X size={15} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid #edf0f4" }}>
            <Avatar owner={draft.owner} size="lg" />
            <div>
              <p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>{draft.name}</p>
              <p className="text-[11px]" style={{ color: "#5c6478" }}>{draft.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Name</span>
              <input disabled={readOnly} value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} className="w-full px-3 py-2 rounded text-[12px] focus:outline-none disabled:bg-[#f4f6f9]" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Phone number</span>
              <input disabled={readOnly} value={draft.phoneNumber} onChange={event => setDraft({ ...draft, phoneNumber: event.target.value })} className="w-full px-3 py-2 rounded text-[12px] focus:outline-none disabled:bg-[#f4f6f9]" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Role</span>
              <select disabled={readOnly} value={draft.role} onChange={event => setDraft({ ...draft, role: event.target.value as Role })} className="w-full px-3 py-2 rounded text-[12px] bg-white focus:outline-none disabled:bg-[#f4f6f9]" style={{ border: "1px solid #d9dee7", color: "#1a2234" }}>
                {ALL_ROLES.map(item => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Status</span>
              <select disabled={readOnly} value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value as WorkspaceUser["status"] })} className="w-full px-3 py-2 rounded text-[12px] bg-white focus:outline-none disabled:bg-[#f4f6f9]" style={{ border: "1px solid #d9dee7", color: "#1a2234" }}>
                {(["Active", "Invited", "Deactive"] as WorkspaceUser["status"][]).map(item => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <label className="space-y-1 block">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Email</span>
            <input disabled value={draft.email} className="w-full px-3 py-2 rounded text-[12px] bg-[#f4f6f9]" style={{ border: "1px solid #d9dee7", color: "#5c6478" }} />
          </label>
        </div>
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderTop: "1px solid #e2e6eb" }}>
          {!readOnly && <button onClick={() => onRemoveAccess(user)} className="px-3 py-1.5 rounded text-[11px] font-semibold" style={{ border: "1px solid #f0c7c1", color: "#b91c1c" }}>Remove User Access</button>}
          <div className="flex-1" />
          <button onClick={onClose} className="px-3 py-1.5 rounded text-[11px] font-semibold" style={{ border: "1px solid #d9dee7", color: "#5c6478" }}>Cancel</button>
          {!readOnly && <button onClick={save} className="px-3 py-1.5 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}>Save Changes</button>}
        </div>
      </div>
    </div>
  );
}

export function SettingsPage({ role, projectReadOnly = false }: { role: Role; projectReadOnly?: boolean }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedProdRole, setSelectedProdRole] = useState<ProdRoleCode>("PA");
  const [permissionRows, setPermissionRows] = useState<RoleActionRow[]>(PROD_ROLE_ACTION_MATRIX);
  const [savedPermissionRows, setSavedPermissionRows] = useState<RoleActionRow[]>(PROD_ROLE_ACTION_MATRIX);
  const [isPermissionEditMode, setIsPermissionEditMode] = useState(false);
  const [permissionSaved, setPermissionSaved] = useState(false);
  const [settingsUsers, setSettingsUsers] = useState<SettingsUser[]>(SETTINGS_USERS);
  const [selectedUser, setSelectedUser] = useState<SettingsUser | null>(null);
  const [removeUserTarget, setRemoveUserTarget] = useState<SettingsUser | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("All");
  const [auditNameQuery, setAuditNameQuery] = useState("");
  const [auditTimeQuery, setAuditTimeQuery] = useState("");
  const canManageProjectSettings = can.manageSettings(role) && !projectReadOnly;
  const canManageWorkspaceSettings = role === "Workspace Admin";
  const sections = [
    { group: "Personal", items: [{ key: "profile", label: "Profile & Account", icon: <UserCheck size={13} /> }] },
    { group: "Workspace", items: [{ key: "workspace", label: "Workspace Settings", icon: <Globe size={13} />, gate: can.viewAdmin(role) }, { key: "members", label: "User Management", icon: <Users size={13} />, gate: can.manageUsers(role) }, { key: "roles", label: "Roles & Permissions", icon: <Shield size={13} />, gate: can.manageRoles(role) }, { key: "audit", label: "Audit Log", icon: <FileText size={13} />, gate: can.viewAdmin(role) }] },
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

  const usersFiltered = settingsUsers.filter(u => (userFilter === "All" || u.role === userFilter) && `${u.name} ${u.email} ${u.phoneNumber}`.toLowerCase().includes(userSearch.toLowerCase()));
  const workspaceOwner = settingsUsers.find(u => u.role === "Workspace Admin") || settingsUsers[0];
  const auditFiltered = AUDIT_LOG_DATA.filter(item => item.actor.toLowerCase().includes(auditNameQuery.toLowerCase()) && item.time.toLowerCase().includes(auditTimeQuery.toLowerCase()));
  const canEditPermissionMatrix = role === "Workspace Admin";
  const hasPermissionChanges = JSON.stringify(permissionRows) !== JSON.stringify(savedPermissionRows);
  function editPermissionState(rowIndex: number, roleCode: ProdRoleCode, state: PermissionState) {
    if (!canEditPermissionMatrix || !isPermissionEditMode || roleCode === "WA" || permissionRows[rowIndex]?.locked) return;
    setPermissionRows(previous => previous.map((row, index) => index === rowIndex ? { ...row, states: { ...row.states, [roleCode]: state } } : row));
    setPermissionSaved(false);
  }
  function startPermissionEdit() {
    if (!canEditPermissionMatrix) return;
    setPermissionRows(savedPermissionRows);
    setIsPermissionEditMode(true);
    setPermissionSaved(false);
  }
  function savePermissionMatrix() {
    if (!canEditPermissionMatrix) return;
    setSavedPermissionRows(permissionRows);
    setIsPermissionEditMode(false);
    setPermissionSaved(true);
  }
  function saveUser(updatedUser: SettingsUser) {
    setSettingsUsers(previous => previous.map(user => user.email === updatedUser.email ? updatedUser : user));
    setSelectedUser(null);
  }
  function removeUserAccess(userToRemove: SettingsUser) {
    setSettingsUsers(previous => previous.filter(user => user.email !== userToRemove.email));
    setSelectedUser(null);
    setRemoveUserTarget(null);
  }

  const content: Record<string, React.ReactNode> = {
    profile: (
      <div className="space-y-5">
        <div className="flex items-center gap-4 pb-4" style={{ borderBottom: "1px solid #e2e6eb" }}>
          <Avatar owner={OWNERS[0]} size="lg" />
          <div><p className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>Marcus Webb</p><p className="text-[12px]" style={{ color: "#5c6478" }}>marcus.webb@acme.com</p><div className="mt-1"><RoleBadge role={role} /></div></div>
          <button className="ml-auto px-3 py-1.5 text-[11px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}>Edit Profile</button>
        </div>
        {[["Full Name", "Marcus Webb"], ["Email", "marcus.webb@acme.com"], ["Time Zone", "UTC-5 (Eastern Time)"], ["Language", "English (US)"]].map(([l, v]) => fieldRow(l, v))}
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
        {fieldRow("Company Name", "ACME Space Inc.", "w-40", !canManageWorkspaceSettings)}
        {fieldRow("Workspace Slug", "acme-space", "w-40", true)}
        <div className="flex items-center gap-4">
          <label className="w-40 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>Company Scope</label>
          <span className="text-[12px] px-3 py-1.5 rounded" style={{ color: "#1a2234", backgroundColor: "#f4f6f9", border: "1px solid #dde2ea" }}>Single company workspace</span>
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
              <input value={userSearch} onChange={event => setUserSearch(event.target.value)} placeholder="Search name, phone, email..." className="w-60 pl-7 pr-3 py-1.5 rounded text-[11px] focus:outline-none" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
            </div>
            <span className="text-[11px] font-semibold" style={{ color: "#5c6478" }}>Filter by role:</span>
            <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="text-[11px] px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{["All", ...ALL_ROLES].map(r => <option key={r}>{r}</option>)}</select>
          </div>
          {can.manageUsers(role) && <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}><UserPlus size={12} /> Invite User</button>}
        </div>
        <div className="rounded overflow-hidden" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center h-8 px-3 gap-2" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {[["w-48", "Name"], ["flex-1", "Email"], ["w-36", "Phone number"], ["w-32", "Role"], ["w-20", "Status"], ["w-40", "Last Login"]].map(([c, l], i) => <div key={i} className={cx(c, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{l}</div>)}
          </div>
          {usersFiltered.map(u => { const sc = userStatusCfg(u.status); return (
            <button key={u.email} onClick={() => setSelectedUser(u)} className="w-full flex items-center h-10 px-3 gap-2 text-left hover:bg-[#f7f8fa]" style={{ borderBottom: "1px solid #f0f2f5" }}>
              <div className="w-48 flex items-center gap-2"><Avatar owner={u.owner} size="sm" /><span className="text-[12px] font-medium truncate" style={{ color: "#1a2234" }}>{u.name}</span></div>
              <div className="flex-1 text-[11px] truncate" style={{ color: "#5c6478" }}>{u.email}</div>
              <div className="w-36 text-[11px] truncate" style={{ color: "#5c6478" }}>{u.phoneNumber}</div>
              <div className="w-32"><RoleBadge role={u.role} /></div>
              <div className="w-20"><span className="px-2 py-px text-[10px] font-semibold rounded-sm" style={{ backgroundColor: sc.bg, color: sc.text }}>{u.status}</span></div>
              <div className="w-40 text-[10px]" style={{ color: "#8c94a6" }}>{u.lastLogin}</div>
            </button>
          ); })}
          {usersFiltered.length === 0 && <div className="px-3 py-6 text-center text-[11px]" style={{ color: "#8c94a6" }}>No users found.</div>}
        </div>
      </div>
    ),
    roles: (
      <div className="flex gap-4 h-full min-h-0">
        <div className="w-64 shrink-0">
          <p className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: "#8c94a6" }}>Production roles</p>
          <div className="space-y-1">
            {PROD_ROLES.map(r => (
              <button
                key={r.code}
                onClick={() => setSelectedProdRole(r.code)}
                className="w-full text-left px-2.5 py-2 rounded"
                style={{ backgroundColor: selectedProdRole === r.code ? "#edf2fb" : "transparent", border: selectedProdRole === r.code ? "1px solid #bdd0ea" : "1px solid transparent" }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 text-center text-[10px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: selectedProdRole === r.code ? "#1d3f73" : "#f0f2f5", color: selectedProdRole === r.code ? "#ffffff" : "#5c6478" }}>{r.code}</span>
                  <span className="text-[12px] font-semibold" style={{ color: selectedProdRole === r.code ? "#1d3f73" : "#1a2234" }}>{r.name}</span>
                </div>
                <p className="mt-1 text-[10px] font-mono" style={{ color: "#5c6478" }}>{r.slug}</p>
                <p className="mt-0.5 text-[10px]" style={{ color: "#8c94a6" }}>{r.summary}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Shield size={14} style={{ color: "#1d3f73" }} />
                <span className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Role Action Matrix</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex flex-wrap justify-end gap-1.5">
                {Object.entries(STATE_STYLE).map(([key, cfg]) => (
                  <span key={key} className="text-[10px] font-semibold px-2 py-1 rounded-sm" style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>{key} {cfg.label}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {permissionSaved && <span className="text-[10px] font-semibold" style={{ color: "#1e6930" }}>Saved</span>}
                {canEditPermissionMatrix && !isPermissionEditMode && (
                  <button onClick={startPermissionEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold" style={{ color: "#1d3f73", border: "1px solid #bdd0ea", backgroundColor: "#edf2fb" }}>
                    <Edit3 size={12} /> Edit
                  </button>
                )}
                {canEditPermissionMatrix && isPermissionEditMode && (
                  <button onClick={savePermissionMatrix} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: hasPermissionChanges ? "#1d3f73" : "#8c94a6" }}>
                    <Save size={12} /> Save
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="rounded overflow-auto flex-1" style={{ border: "1px solid #e2e6eb" }}>
            <div className="grid items-center min-w-[788px] sticky top-0 z-10" style={{ gridTemplateColumns: "140px minmax(240px,1fr) 190px repeat(3,64px)", backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
              {["Screen", "Action", "Permission", ...PROD_ROLES.map(r => r.code)].map((h, idx) => (
                <div key={h} className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-center" style={{ color: idx >= 3 && h === selectedProdRole ? "#1d3f73" : "#8c94a6", borderRight: idx < 5 ? "1px solid #eef1f5" : undefined }}>{h}</div>
              ))}
            </div>
            {permissionRows.map((row, idx) => (
              <div key={`${row.screen}-${row.action}`} className="grid items-center min-w-[788px]" style={{ gridTemplateColumns: "140px minmax(240px,1fr) 190px repeat(3,64px)", borderBottom: "1px solid #f0f2f5", backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fbfcfe" }}>
                <div className="px-3 py-2 text-[11px] font-semibold" style={{ color: "#3a4254", borderRight: "1px solid #eef1f5" }}>{row.screen}</div>
                <div className="px-3 py-2 text-[11px]" style={{ color: "#1a2234", borderRight: "1px solid #eef1f5" }}>{row.action}</div>
                <div className="px-3 py-2 text-[10px] font-mono truncate" style={{ color: "#697285", borderRight: "1px solid #eef1f5" }}>{row.permission}</div>
                {PROD_ROLES.map(r => {
                  const state = row.states[r.code];
                  const cfg = STATE_STYLE[state];
                  const selected = selectedProdRole === r.code;
                  const editable = canEditPermissionMatrix && isPermissionEditMode && r.code !== "WA" && !row.locked;
                  return (
                    <div key={r.code} className="h-full flex items-center justify-center px-2 py-1.5" style={{ backgroundColor: selected ? "#f3f6fb" : undefined, borderRight: r.code !== "PM" ? "1px solid #eef1f5" : undefined }}>
                      {editable ? (
                        <select
                          aria-label={`${row.screen} ${row.action} ${r.code} permission state`}
                          value={state}
                          onChange={event => editPermissionState(idx, r.code, event.target.value as PermissionState)}
                          className="w-12 h-6 rounded-sm text-center text-[10px] font-bold focus:outline-none"
                          style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
                        >
                          {PERMISSION_STATE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <span title={row.locked ? "System baseline permission" : r.code === "WA" ? "Workspace Admin baseline" : undefined} className="w-10 inline-flex items-center justify-center gap-0.5 text-center text-[10px] font-bold rounded-sm py-0.5" style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
                          {(row.locked || r.code === "WA") && <Lock size={8} />}
                          {state}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
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
                    <button key={item.key} onClick={() => !locked && setActiveTab(item.key)} className={cx("w-full flex items-center gap-2 px-2 py-1.5 text-[12px] rounded text-left mb-0.5", locked && "opacity-40 cursor-not-allowed")} style={{ backgroundColor: activeTab === item.key ? "#edf2fb" : "transparent", color: activeTab === item.key ? "#1d3f73" : "#3a4254", fontWeight: activeTab === item.key ? 600 : 400 }} disabled={locked}>
                      <span style={{ color: activeTab === item.key ? "#1d3f73" : "#8c94a6" }}>{item.icon}</span>
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
          <h2 className="text-[14px] font-semibold mb-4" style={{ color: "#1a2234" }}>{sections.flatMap(s => s.items).find(i => i.key === activeTab)?.label || "Settings"}</h2>
          {content[activeTab] || <p className="text-[12px]" style={{ color: "#5c6478" }}>Select a section from the left menu.</p>}
        </div>
      </div>
      {selectedUser && <UserDetailModal key={selectedUser.email} user={selectedUser} onClose={() => setSelectedUser(null)} onSave={saveUser} onRemoveAccess={setRemoveUserTarget} />}
      {removeUserTarget && <ConfirmRemoveUserAccess user={removeUserTarget} onCancel={() => setRemoveUserTarget(null)} onConfirm={() => removeUserAccess(removeUserTarget)} />}
    </>
  );
}

