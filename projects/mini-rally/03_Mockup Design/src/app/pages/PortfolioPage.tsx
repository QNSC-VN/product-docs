import { useState } from "react";
import {
  Search, ChevronDown, ChevronRight, LayoutList, LayoutGrid,
  Plus, Filter, Bell, HelpCircle, Settings, RefreshCw, Download,
  MoreHorizontal, X, Layers, Paperclip, Link2, Edit3,
  Home, Shield, Users, LogOut, MessageSquare,
  CheckCircle, Flag, Lock, Check, Archive, Eye, BarChart2,
  Bookmark, Save, RotateCcw, SlidersHorizontal, Activity,
  TrendingUp, TrendingDown, Package, Clock, Star, UserCheck,
  FileText, Hash, ChevronUp, Share2, ChevronLeft,
  GripVertical, Copy, Scissors, UserPlus, GitMerge,
  ExternalLink, AlignJustify, Minus, Zap,
  Tag, Calendar, RotateCw, ListChecks, Globe, Send, ArrowUpRight,
  CheckSquare, Square, Columns, ArrowUp, ArrowDown, ArrowUpDown,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { type Role, type Page, type WorkItemType, type StatusType, type PriorityType, type PortfolioState, type EstimateSize, type MilestoneItem, type TaskItem, type NewWorkItemInput, type Owner, type WorkItem, type Epic, type Feature, type NewEpicInput, type NewFeatureInput, type Project, type ScopeProject, type Initiative, type ReleaseItem, type WorkspaceUser, type WorkflowStatusItem, type LabelItem, can, PRELIMINARY_ESTIMATE_POINT_FALLBACK, PRELIMINARY_ESTIMATE_COUNT_FALLBACK, OWNERS, PROJECTS, ROLE_SCOPE, SCOPE_PROJECTS, WORK_ITEMS, FEATURES, NOTIFICATIONS, VELOCITY_DATA, BURNDOWN_DATA, STATUS_PIE, INITIATIVES, RELEASES_DATA, WORKSPACE_USERS, WORKFLOW_STATUSES, LABELS_DATA, WORKLOAD_DATA, PLANNED_VS_COMPLETED, PERMISSIONS_MATRIX, DEFECT_ENVIRONMENTS, RELATED_STORIES } from "../model";
import { releaseStatusCfg, Avatar, TYPE_CFG, TypeBadge, STATUS_CFG, ScheduleStateBar, PRI_CFG, PriorityBadge, MiniProgress, RoleBadge, DetailPanel, NewItemModal, EmptyState, SectionCard } from "../components/shared";
import { Field, RichTextEditor, TaskStateBadge, fieldClass, fieldStyle } from "./WorkItemDetailPage";
import { ResizableBacklogHeader, type BacklogColumnKey } from "./BacklogPage";

export type PortfolioColumnKey = "rank" | "type" | "id" | "name" | "release" | "state" | "percentDoneByStoryPlanEstimate" | "percentDoneByStoryCount" | "project" | "team" | "owner";
type PortfolioSort = { column: PortfolioColumnKey; direction: "asc" | "desc" };
const PORTFOLIO_COLUMN_DEFS: Array<{ key: PortfolioColumnKey; label: string; align?: "left" | "center" | "right" }> = [
  { key: "rank", label: "Rank", align: "right" },
  { key: "type", label: "Type" },
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "release", label: "Release" },
  { key: "state", label: "State" },
  { key: "percentDoneByStoryPlanEstimate", label: "Percent Done By Story Plan Estimate" },
  { key: "percentDoneByStoryCount", label: "Percent Done By Story Count" },
  { key: "project", label: "Project" },
  { key: "team", label: "Team" },
  { key: "owner", label: "Owner" },
];

function getPortfolioSortTooltip(column: PortfolioColumnKey, direction: "asc" | "desc") {
  if (column === "percentDoneByStoryPlanEstimate" || column === "percentDoneByStoryCount") return direction === "desc" ? "Highest to lowest" : "Lowest to highest";
  if (column === "id") return direction === "desc" ? "Newest to oldest" : "Oldest to newest";
  if (column === "rank") return direction === "asc" ? "Rank low to high" : "Rank high to low";
  return direction === "asc" ? "A to Z" : "Z to A";
}

function ResizablePortfolioHeader({ label, width, column, onResize, sort, onSort, align = "left" }: { label: string; width: number; column: PortfolioColumnKey; onResize: (column: PortfolioColumnKey, event: React.MouseEvent<HTMLDivElement>) => void; sort: PortfolioSort | null; onSort: (column: PortfolioColumnKey) => void; align?: "left" | "center" | "right" }) {
  const isSorted = sort?.column === column;
  const tooltip = isSorted ? getPortfolioSortTooltip(column, sort.direction) : "Sort";
  const SortIcon = isSorted ? (sort.direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <div className="relative shrink-0 h-full flex items-center text-[11px] font-semibold uppercase select-none" style={{ width, color: "#8c94a6", justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start" }}>
      <button
        type="button"
        title={tooltip}
        aria-label={`Sort ${label}: ${tooltip}`}
        onClick={() => onSort(column)}
        className="h-full min-w-0 flex items-center gap-1 text-[11px] rounded-sm focus:outline-none"
        style={{ color: isSorted ? "#2558a6" : "#8c94a6", justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start", width: "calc(100% - 8px)" }}
      >
        <span className="truncate text-[11px]">{label}</span>
        <SortIcon size={10} className="shrink-0" />
      </button>
      <div
        role="separator"
        aria-label={`Resize ${label} column`}
        aria-orientation="vertical"
        onMouseDown={event => onResize(column, event)}
        className="absolute right-0 top-0 h-full w-2 cursor-col-resize group z-10"
      >
        <div className="absolute right-[3px] top-1 bottom-1 w-px group-hover:bg-[#2558a6]" style={{ backgroundColor: "#d9dee7" }} />
      </div>
    </div>
  );
}

const PORTFOLIO_STATE_CFG: Record<PortfolioState, { bg: string; text: string; border: string; dot: string }> = {
  "No Entry": { bg: "#f1f5f9", text: "#64748b", border: "#cbd5e1", dot: "#94a3b8" },
  Intake: { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1", dot: "#94a3b8" },
  "Idea Prioritization": { bg: "#eef3fb", text: "#2558a6", border: "#bdd0ef", dot: "#2558a6" },
  "Problem Discovery": { bg: "#eef3fb", text: "#2558a6", border: "#bdd0ef", dot: "#2558a6" },
  "Solution Discovery": { bg: "#eef3fb", text: "#2558a6", border: "#bdd0ef", dot: "#2558a6" },
  "Feature Prioritization": { bg: "#eef3fb", text: "#2558a6", border: "#bdd0ef", dot: "#2558a6" },
  Developing: { bg: "#fef5e4", text: "#8a5808", border: "#f5d899", dot: "#e59f0c" },
  Accepted: { bg: "#eaf0fb", text: "#1d3f73", border: "#99b8e0", dot: "#1d3f73" },
  Measuring: { bg: "#f5f3ff", text: "#6d28d9", border: "#d0c6f5", dot: "#7c3aed" },
  Done: { bg: "#eef6f0", text: "#1e6930", border: "#a8d5b3", dot: "#2a8c3f" },
  Cancelled: { bg: "#fef2f2", text: "#b91c1c", border: "#f3c6c6", dot: "#dc2626" },
};

function PortfolioStateBadge({ state }: { state: PortfolioState }) {
  const c = PORTFOLIO_STATE_CFG[state];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-px text-[11px] font-medium rounded-sm whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.dot }} />
      {state}
    </span>
  );
}

function PortfolioItemTypeBadge({ type }: { type: "Epic" | "Feature" }) {
  if (type === "Feature") return <TypeBadge type="Feature" />;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-px text-[10px] font-semibold rounded-sm whitespace-nowrap" style={{ backgroundColor: "#f5f3ff", color: "#6d28d9", border: "1px solid #d8b4fe" }}>
      <Layers size={11} />
      Epic
    </span>
  );
}

function FeatureProgressMeter({ label, pct, numerator, denominator, unit }: { label: string; pct: number; numerator: number; denominator: number; unit: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[12px] leading-4" style={{ color: "#1a2234" }}>{label}</p>
          <p className="text-[11px]" style={{ color: "#64748b" }}><span className="text-[15px] font-semibold" style={{ color: "#15803d" }}>{pct}%</span> {numerator}/{denominator} {unit} complete</p>
        </div>
        <div className="flex flex-col gap-1 pt-0.5" style={{ color: "#2f6fd6" }}>
          <Settings size={12} />
          <HelpCircle size={12} />
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#dbe2ec" }}>
        <div className="h-full" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, backgroundColor: "#38a169" }} />
      </div>
    </div>
  );
}

function FeatureListProgressCell({ pct, numerator, denominator }: { pct: number; numerator: number; denominator: number }) {
  const clampedPct = Math.min(100, Math.max(0, pct));
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-20 h-1.5 rounded-full overflow-hidden shrink-0" style={{ backgroundColor: "#e4e8ed" }}>
        <div className="h-full rounded-full" style={{ width: `${clampedPct}%`, backgroundColor: clampedPct === 100 ? "#2a8c3f" : clampedPct > 50 ? "#2558a6" : "#e59f0c" }} />
      </div>
      <span className="text-[10px] tabular-nums truncate" style={{ color: "#5c6478" }}>{pct}% ({numerator}/{denominator})</span>
    </div>
  );
}

const PORTFOLIO_STATES: PortfolioState[] = ["No Entry", "Intake", "Idea Prioritization", "Problem Discovery", "Solution Discovery", "Feature Prioritization", "Developing", "Accepted", "Measuring", "Done", "Cancelled"];
const ESTIMATE_SIZES: EstimateSize[] = ["No Entry", "XS", "S", "M", "L", "XL"];

function getFeatureTopDownPointEstimate(feature: Feature) {
  return feature.refinedEstimate ?? PRELIMINARY_ESTIMATE_POINT_FALLBACK[feature.preliminaryEstimate];
}

function getFeatureTopDownCountEstimate(feature: Feature) {
  return feature.refinedWorkItemCountEstimate ?? PRELIMINARY_ESTIMATE_COUNT_FALLBACK[feature.preliminaryEstimate];
}

function getEpicTopDownPointEstimate(epic: Epic) {
  return epic.refinedEstimate ?? PRELIMINARY_ESTIMATE_POINT_FALLBACK[epic.preliminaryEstimate];
}

function getEpicTopDownCountEstimate(epic: Epic) {
  return epic.refinedWorkItemCountEstimate ?? PRELIMINARY_ESTIMATE_COUNT_FALLBACK[epic.preliminaryEstimate];
}

function parseOptionalNonNegativeNumber(value: string) {
  if (value.trim() === "") return undefined;
  return Math.max(0, Number(value) || 0);
}

function getPortfolioSortValue(feat: Feature, pctByStoryPlanEstimate: number, pctByStoryCount: number, column: PortfolioColumnKey): string | number {
  switch (column) {
    case "rank": return feat.rank ?? 999;
    case "type": return "Feature";
    case "id": return Number(feat.id.replace(/\D/g, "")) || 0;
    case "name": return feat.name.toLowerCase();
    case "release": return feat.release.toLowerCase();
    case "state": return PORTFOLIO_STATES.indexOf(feat.status);
    case "percentDoneByStoryPlanEstimate": return pctByStoryPlanEstimate;
    case "percentDoneByStoryCount": return pctByStoryCount;
    case "project": return (feat.project || "").toLowerCase();
    case "team": return (feat.team || "").toLowerCase();
    case "owner": return feat.owner.name.toLowerCase();
  }
}
function comparePortfolioSortValues(a: string | number, b: string | number) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

function EstimateBadge({ size }: { size: EstimateSize }) {
  if (size === "No Entry") return <span className="text-[11px]" style={{ color: "#8c94a6" }}>No Entry</span>;
  return <span className="inline-flex items-center px-1.5 py-px text-[10px] font-semibold rounded-sm" style={{ backgroundColor: "#f0f2f5", color: "#3a4254", border: "1px solid #dde2ea" }}>{size}</span>;
}

type ChildSort = { column: BacklogColumnKey; direction: "asc" | "desc" };
type ArchiveFilter = "Active" | "Archived" | "All";
const CHILD_DEFECT_PRIORITY_LABELS: Record<string, string> = { Critical: "Urgent", High: "High", Medium: "Normal", Low: "Low" };
const CHILD_DEFECT_PRIORITY_TO_LEGACY: Record<string, string> = { Urgent: "Critical", High: "High", Normal: "Medium", Low: "Low", None: "None" };
const CHILD_STATUS_OPTIONS: StatusType[] = ["Idea", "Defined", "In-Progress", "Completed", "Accepted", "Release"];
const CHILD_PRIORITY_OPTIONS = ["Low", "Normal", "High", "Urgent", "None"];
const CHILD_PRIORITY_ORDER: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
const CHILD_STATUS_ORDER: Record<StatusType, number> = { Idea: 1, Defined: 2, "In-Progress": 3, Completed: 4, Accepted: 5, Release: 6 };
const CHILD_FILTER_COLUMNS: Array<{ key: BacklogColumnKey; label: string; mode: "search" | "select" }> = [
  { key: "id", label: "ID", mode: "search" },
  { key: "name", label: "Name", mode: "search" },
  { key: "type", label: "Type", mode: "select" },
  { key: "priority", label: "Priority", mode: "select" },
  { key: "estimate", label: "Est", mode: "search" },
  { key: "owner", label: "Owner", mode: "select" },
  { key: "status", label: "Schedule State", mode: "select" },
  { key: "release", label: "Release", mode: "select" },
];
function canManageFeatureInProject(role: Role, projectKey?: string) {
  if (role === "Workspace Admin") return true;
  if (role === "Project Admin") return ROLE_SCOPE.projectAdminProjectKeys.includes((projectKey || "") as typeof ROLE_SCOPE.projectAdminProjectKeys[number]);
  return false;
}
function getRoleScopedProjects(role: Role, currentProject: ScopeProject) {
  if (role === "Workspace Admin") return SCOPE_PROJECTS;
  if (role === "Project Admin") return SCOPE_PROJECTS.filter(project => ROLE_SCOPE.projectAdminProjectKeys.includes(project.key as typeof ROLE_SCOPE.projectAdminProjectKeys[number]));
  return [currentProject];
}
function getProjectReleaseOptions(releases: ReleaseItem[], projectKey?: string) {
  return ["Unscheduled", ...releases.filter(release => release.projectKey === projectKey).map(release => release.name)];
}
function getReleasePatch(releases: ReleaseItem[], projectKey: string, releaseName: string): Pick<Feature, "release" | "releaseId"> {
  if (releaseName === "Unscheduled") return { release: "Unscheduled", releaseId: undefined };
  const release = releases.find(candidate => candidate.projectKey === projectKey && candidate.name === releaseName);
  return release ? { release: release.name, releaseId: release.id } : { release: "Unscheduled", releaseId: undefined };
}
function getChildSortValue(item: WorkItem, column: BacklogColumnKey): string | number {
  switch (column) {
    case "type": return item.type;
    case "id": return Number(item.id.replace(/\D/g, "")) || 0;
    case "name": return item.title.toLowerCase();
    case "priority": return item.type === "Defect" ? CHILD_PRIORITY_ORDER[item.priority] ?? 0 : -1;
    case "estimate": return item.planEstimate;
    case "owner": return item.owner.name.toLowerCase();
    case "status": return CHILD_STATUS_ORDER[item.status] ?? 0;
    case "release": return item.release.toLowerCase();
    default: return 0;
  }
}
function compareChildSortValues(a: string | number, b: string | number) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

function NewFeatureModal({ role, currentProject, currentTeam, releases, epics = [], defaultEpicId, onClose, onCreate, onCreateWithDetails }: { role: Role; currentProject: ScopeProject; currentTeam: string; releases: ReleaseItem[]; epics?: Epic[]; defaultEpicId?: string; onClose: () => void; onCreate: (input: NewFeatureInput) => Feature; onCreateWithDetails: (input: NewFeatureInput) => void }) {
  const [name, setName] = useState("");
  const allowedProjects = getRoleScopedProjects(role, currentProject);
  const initialProject = allowedProjects.find(project => project.key === currentProject.key) || allowedProjects[0] || currentProject;
  const [projectKey, setProjectKey] = useState(initialProject.key);
  const [team, setTeam] = useState(currentTeam !== "All Teams" && initialProject.teams.includes(currentTeam) ? currentTeam : initialProject.teams[0]);
  const [ownerName, setOwnerName] = useState(OWNERS[0].name);
  const [release, setRelease] = useState("Unscheduled");
  const [epicId, setEpicId] = useState(defaultEpicId || "");
  const [state, setState] = useState<PortfolioState>("No Entry");
  const [preliminaryEstimate, setPreliminaryEstimate] = useState<EstimateSize>("No Entry");
  const selectedProject = allowedProjects.find(project => project.key === projectKey) || initialProject;
  const releaseOptions = getProjectReleaseOptions(releases, selectedProject.key);
  const epicOptions = epics.filter(epic => epic.project === selectedProject.key && !epic.archivedAt);
  const canCreate = name.trim().length > 0;
  function selectProject(nextProjectKey: string) {
    const nextProject = allowedProjects.find(project => project.key === nextProjectKey) || initialProject;
    setProjectKey(nextProject.key);
    setTeam(nextProject.teams[0]);
    setEpicId("");
    setRelease("Unscheduled");
  }
  function buildInput(): NewFeatureInput {
    const owner = OWNERS.find(candidate => candidate.name === ownerName) || OWNERS[0];
    const releasePatch = getReleasePatch(releases, projectKey, release);
    return { name: name.trim(), project: projectKey, team, epicId: epicId || undefined, owner, release: releasePatch.release, releaseId: releasePatch.releaseId, state, preliminaryEstimate };
  }
  function submit() {
    if (!canCreate) return;
    onCreate(buildInput());
    onClose();
  }
  function submitWithDetails() {
    if (!canCreate) return;
    onCreateWithDetails(buildInput());
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <div className="relative bg-white rounded shadow-2xl flex flex-col overflow-hidden" style={{ width: 480, maxHeight: "85vh", border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          <div><p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>New Feature</p><p className="text-[11px]" style={{ color: "#8c94a6" }}>Portfolio Items</p></div>
          <button onClick={onClose} className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#edf0f4"; e.currentTarget.style.color = "#1a2234"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8c94a6"; }}><X size={15} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Project</label><select aria-label="New Feature project" value={projectKey} onChange={event => selectProject(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{allowedProjects.map(project => <option key={project.key} value={project.key}>{project.key} · {project.name}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Team</label><select aria-label="New Feature team" value={team} onChange={event => setTeam(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{selectedProject.teams.map(projectTeam => <option key={projectTeam}>{projectTeam}</option>)}</select></div>
          </div>
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Epic</label><select aria-label="New Feature Epic" value={epicId} onChange={event => setEpicId(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}><option value="">Unassigned</option>{epicOptions.map(epic => <option key={epic.id} value={epic.id}>{epic.id} · {epic.name}</option>)}</select></div>
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Name <span style={{ color: "#dc2626" }}>*</span></label>
            <input autoFocus type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter a concise, descriptive name..." className="w-full text-[13px] px-3 py-2 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} onFocus={e => (e.currentTarget.style.borderColor = "rgba(29,63,115,0.4)")} onBlur={e => (e.currentTarget.style.borderColor = "#dde2ea")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>State</label><select aria-label="New Feature state" value={state} onChange={event => setState(event.target.value as PortfolioState)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{PORTFOLIO_STATES.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Preliminary Estimate</label><select aria-label="New Feature preliminary estimate" value={preliminaryEstimate} onChange={event => setPreliminaryEstimate(event.target.value as EstimateSize)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{ESTIMATE_SIZES.map(s => <option key={s}>{s}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Owner</label><select aria-label="New Feature owner" value={ownerName} onChange={event => setOwnerName(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Target Release</label><select aria-label="New Feature target release" value={release} onChange={event => setRelease(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{releaseOptions.map(option => <option key={option}>{option}</option>)}</select></div>
          </div>
          <p className="text-[11px]" style={{ color: "#8c94a6" }}>Feature has no Plan Estimate. Progress is read-only; refined top-down estimates are edited in Details and Capacity allocation is entered inside Capacity Planning.</p>
        </div>
        <div className="flex items-center justify-end px-5 py-3 shrink-0" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3.5 py-1.5 text-[12px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#edf0f4")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>Cancel</button>
            <button disabled={!canCreate} onClick={submitWithDetails} className="px-4 py-1.5 text-[12px] font-semibold rounded disabled:opacity-45" style={{ border: "1px solid #9fb5d5", color: "#1d3f73", backgroundColor: "#f5f8fc" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e8eff8")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f5f8fc")}>Create with details</button>
            <button disabled={!canCreate} onClick={submit} className="px-4 py-1.5 text-[12px] font-semibold text-white rounded disabled:opacity-45" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}>Create Feature</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewEpicModal({ role, currentProject, onClose, onCreate, onCreateWithDetails }: { role: Role; currentProject: ScopeProject; onClose: () => void; onCreate: (input: NewEpicInput) => Epic; onCreateWithDetails: (input: NewEpicInput) => void }) {
  const [name, setName] = useState("");
  const allowedProjects = getRoleScopedProjects(role, currentProject);
  const initialProject = allowedProjects.find(project => project.key === currentProject.key) || allowedProjects[0] || currentProject;
  const [projectKey, setProjectKey] = useState(initialProject.key);
  const [ownerName, setOwnerName] = useState(OWNERS[0].name);
  const [state, setState] = useState<PortfolioState>("No Entry");
  const [preliminaryEstimate, setPreliminaryEstimate] = useState<EstimateSize>("No Entry");
  const canCreate = name.trim().length > 0;
  function selectProject(nextProjectKey: string) {
    const nextProject = allowedProjects.find(project => project.key === nextProjectKey) || initialProject;
    setProjectKey(nextProject.key);
  }
  function buildInput(): NewEpicInput {
    const owner = OWNERS.find(candidate => candidate.name === ownerName) || OWNERS[0];
    return { name: name.trim(), project: projectKey, owner, release: "Unscheduled", releaseId: undefined, state, preliminaryEstimate };
  }
  function submit() {
    if (!canCreate) return;
    onCreate(buildInput());
    onClose();
  }
  function submitWithDetails() {
    if (!canCreate) return;
    onCreateWithDetails(buildInput());
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <div className="relative bg-white rounded shadow-2xl flex flex-col overflow-hidden" style={{ width: 480, maxHeight: "85vh", border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          <div><p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>New Epic</p><p className="text-[11px]" style={{ color: "#8c94a6" }}>Portfolio Items</p></div>
          <button onClick={onClose} className="p-1 rounded" style={{ color: "#8c94a6" }}><X size={15} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Project</label><select aria-label="New Epic project" value={projectKey} onChange={event => selectProject(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{allowedProjects.map(project => <option key={project.key} value={project.key}>{project.key} · {project.name}</option>)}</select></div>
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Name <span style={{ color: "#dc2626" }}>*</span></label><input autoFocus type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter Epic name..." className="w-full text-[13px] px-3 py-2 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>State</label><select aria-label="New Epic state" value={state} onChange={event => setState(event.target.value as PortfolioState)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{PORTFOLIO_STATES.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Preliminary Estimate</label><select aria-label="New Epic preliminary estimate" value={preliminaryEstimate} onChange={event => setPreliminaryEstimate(event.target.value as EstimateSize)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{ESTIMATE_SIZES.map(s => <option key={s}>{s}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Owner</label><select aria-label="New Epic owner" value={ownerName} onChange={event => setOwnerName(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select></div>
          </div>
          <p className="text-[11px]" style={{ color: "#8c94a6" }}>Epic is Project-level and groups Features. Its four progress bars roll up leaf Story/Defect through child Features.</p>
        </div>
        <div className="flex items-center justify-end px-5 py-3 shrink-0" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3.5 py-1.5 text-[12px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}>Cancel</button>
            <button disabled={!canCreate} onClick={submitWithDetails} className="px-4 py-1.5 text-[12px] font-semibold rounded disabled:opacity-45" style={{ border: "1px solid #9fb5d5", color: "#1d3f73", backgroundColor: "#f5f8fc" }}>Create with details</button>
            <button disabled={!canCreate} onClick={submit} className="px-4 py-1.5 text-[12px] font-semibold text-white rounded disabled:opacity-45" style={{ backgroundColor: "#1d3f73" }}>Create Epic</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureDetailView({ feature, childItems, totalEstimate, doneEstimate, role, readOnly, releases, milestones, epics, features, tasks, onBack, onUpdateFeature, onArchiveFeature, onUpdateItem, onCreateItem, onOpenFull }: {
  feature: Feature; childItems: WorkItem[]; totalEstimate: number; doneEstimate: number;
  role: Role; readOnly: boolean; releases: ReleaseItem[]; milestones: MilestoneItem[]; epics: Epic[]; features: Feature[]; tasks: TaskItem[]; onBack: () => void;
  onUpdateFeature: (patch: Partial<Feature>) => void;
  onArchiveFeature: () => void;
  onUpdateItem: (id: string, patch: Partial<WorkItem>) => void;
  onCreateItem: (input: NewWorkItemInput, openDetails: boolean) => void;
  onOpenFull: (item: WorkItem) => void;
}) {
  const editable = !readOnly && canManageFeatureInProject(role, feature.project);
  const [activeTab, setActiveTab] = useState<"details" | "children">("details");
  const [acceptedChildrenMode, setAcceptedChildrenMode] = useState<"Points" | "Count">("Points");
  const [expandedChildIds, setExpandedChildIds] = useState<Set<string>>(new Set());
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const selectedMilestoneIds = feature.milestoneIds || [];
  const milestoneOptions = milestones.filter(m => selectedMilestoneIds.includes(m.id) || m.projectKeys.includes(feature.project || ""));
  const epicOptions = epics.filter(epic => epic.project === feature.project && !epic.archivedAt);
  const editableProjectOptions = role === "Workspace Admin"
    ? SCOPE_PROJECTS
    : SCOPE_PROJECTS.filter(project => ROLE_SCOPE.projectAdminProjectKeys.includes(project.key as typeof ROLE_SCOPE.projectAdminProjectKeys[number]));

  const [childSearch, setChildSearch] = useState("");
  const [childShowFilters, setChildShowFilters] = useState(false);
  const [childFilters, setChildFilters] = useState<Partial<Record<BacklogColumnKey, string>>>({});
  const [childShowManageFilters, setChildShowManageFilters] = useState(false);
  const [childFilterColumnSearch, setChildFilterColumnSearch] = useState("");
  const [childPendingFilterColumns, setChildPendingFilterColumns] = useState<Set<BacklogColumnKey>>(new Set());
  const [childSort, setChildSort] = useState<ChildSort | null>(null);
  const [childColumnWidths, setChildColumnWidths] = useState<Record<BacklogColumnKey, number>>({ rank: 0, type: 72, id: 82, name: 320, priority: 96, estimate: 56, owner: 124, status: 128, iteration: 96, release: 130 });
  const [childPageSize, setChildPageSize] = useState(25);
  const [childCurrentPage, setChildCurrentPage] = useState(1);

  const childActiveFilterColumns = CHILD_FILTER_COLUMNS.filter(column => childFilters[column.key] !== undefined);
  const childActiveFilterCount = childActiveFilterColumns.length;
  const childAvailableFilterColumns = CHILD_FILTER_COLUMNS.filter(column => column.label.toLowerCase().includes(childFilterColumnSearch.toLowerCase()));
  const scopedReleaseOptions = getProjectReleaseOptions(releases, feature.project);
  const childReleaseOptions = scopedReleaseOptions;
  const filteredChildren = childItems.filter(item =>
    (item.title.toLowerCase().includes(childSearch.toLowerCase()) || item.id.toLowerCase().includes(childSearch.toLowerCase())) &&
    childActiveFilterColumns.every(filter => {
      const value = (childFilters[filter.key] || "").trim();
      if (!value || value === "All") return true;
      const searchValue = value.toLowerCase();
      switch (filter.key) {
        case "id": return item.id.toLowerCase().includes(searchValue);
        case "name": return item.title.toLowerCase().includes(searchValue);
        case "estimate": return String(item.planEstimate).includes(searchValue);
        case "type": return item.type === value;
        case "priority": return item.type === "Defect" && (CHILD_DEFECT_PRIORITY_LABELS[item.priority] ?? "None") === value;
        case "owner": return item.owner.name === value;
        case "status": return item.status === value;
        case "release": return item.release === value;
        default: return true;
      }
    })
  ).sort((a, b) => {
    if (!childSort) return 0;
    const result = compareChildSortValues(getChildSortValue(a, childSort.column), getChildSortValue(b, childSort.column));
    return childSort.direction === "asc" ? result : -result;
  });
  const childTotalPages = Math.max(1, Math.ceil(filteredChildren.length / childPageSize));
  const childActivePage = Math.min(childCurrentPage, childTotalPages);
  const childPageStart = (childActivePage - 1) * childPageSize;
  const paginatedChildren = filteredChildren.slice(childPageStart, childPageStart + childPageSize);
  const acceptedChildren = childItems.filter(item => item.status === "Accepted" || item.status === "Release");
  const acceptedStoryCount = acceptedChildren.length;
  const totalStoryCount = childItems.length;
  const pctByStoryPlanEstimate = totalEstimate <= 0 ? 0 : Math.round((doneEstimate / totalEstimate) * 100);
  const pctByStoryCount = totalStoryCount <= 0 ? 0 : Math.round((acceptedStoryCount / totalStoryCount) * 100);
  const topDownPointEstimate = getFeatureTopDownPointEstimate(feature);
  const topDownCountEstimate = getFeatureTopDownCountEstimate(feature);
  const pctEstimatedByFeaturePoints = topDownPointEstimate <= 0 ? 0 : Math.round((doneEstimate / topDownPointEstimate) * 100);
  const pctEstimatedByFeatureCount = topDownCountEstimate <= 0 ? 0 : Math.round((acceptedStoryCount / topDownCountEstimate) * 100);
  const acceptedChildrenSummary = acceptedChildrenMode === "Points"
    ? { pct: pctByStoryPlanEstimate, numerator: doneEstimate, denominator: totalEstimate, unit: "points" }
    : { pct: pctByStoryCount, numerator: acceptedStoryCount, denominator: totalStoryCount, unit: "stories" };

  function getChildFilterSelectOptions(column: BacklogColumnKey) {
    switch (column) {
      case "type": return ["All", "Story", "Defect"];
      case "priority": return ["All", ...CHILD_PRIORITY_OPTIONS];
      case "owner": return ["All", ...OWNERS.map(o => o.name)];
      case "status": return ["All", ...CHILD_STATUS_OPTIONS];
      case "release": return ["All", ...childReleaseOptions];
      default: return [];
    }
  }
  function openChildManageFilters() {
    setChildShowFilters(true);
    setChildPendingFilterColumns(new Set(childActiveFilterColumns.map(column => column.key)));
    setChildShowManageFilters(true);
  }
  function toggleChildPendingFilterColumn(column: BacklogColumnKey) {
    setChildPendingFilterColumns(previous => { const next = new Set(previous); next.has(column) ? next.delete(column) : next.add(column); return next; });
  }
  function applyChildManagedFilters() {
    setChildFilters(previous => {
      const next: Partial<Record<BacklogColumnKey, string>> = {};
      childPendingFilterColumns.forEach(column => { next[column] = previous[column] ?? ""; });
      return next;
    });
    setChildShowManageFilters(false);
    setChildCurrentPage(1);
  }
  function updateChildFilterValue(column: BacklogColumnKey, value: string) {
    setChildFilters(previous => ({ ...previous, [column]: value }));
    setChildCurrentPage(1);
  }
  function removeChildFilter(column: BacklogColumnKey) {
    setChildFilters(previous => { const next = { ...previous }; delete next[column]; return next; });
    setChildCurrentPage(1);
  }
  function toggleChildSort(column: BacklogColumnKey) {
    setChildSort(previous => {
      if (previous?.column === column) return { column, direction: previous.direction === "asc" ? "desc" : "asc" };
      const defaultDirection = column === "estimate" || column === "id" || column === "priority" ? "desc" : "asc";
      return { column, direction: defaultDirection };
    });
    setChildCurrentPage(1);
  }
  function startChildColumnResize(column: BacklogColumnKey, event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = childColumnWidths[column];
    const minimums: Partial<Record<BacklogColumnKey, number>> = { type: 60, id: 64, name: 180, priority: 80, estimate: 48, owner: 96, status: 96, release: 72 };
    function handleMouseMove(moveEvent: MouseEvent) {
      const nextWidth = Math.max(minimums[column] ?? 48, startWidth + moveEvent.clientX - startX);
      setChildColumnWidths(previous => ({ ...previous, [column]: nextWidth }));
    }
    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
  function updateChildItemPriority(id: string, priorityLabel: string) {
    const priority = CHILD_DEFECT_PRIORITY_TO_LEGACY[priorityLabel] as PriorityType | "None";
    if (priority !== "None") onUpdateItem(id, { priority });
  }
  const childTableWidth = 22 + Object.values(childColumnWidths).reduce((total, width) => total + width, 0);

  function toggleMilestone(milestoneId: string) {
    const next = selectedMilestoneIds.includes(milestoneId) ? selectedMilestoneIds.filter(id => id !== milestoneId) : [...selectedMilestoneIds, milestoneId];
    onUpdateFeature({ milestoneIds: next });
  }
  function changeProject(projectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(candidate => candidate.key === projectKey) || SCOPE_PROJECTS[0];
    const releasePatch = getReleasePatch(releases, nextProject.key, feature.release);
    onUpdateFeature({ project: nextProject.key, team: nextProject.teams[0], epicId: undefined, ...releasePatch });
  }
  function archiveFeature() {
    setShowActions(false);
    setShowArchiveConfirm(true);
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="shrink-0 text-white" style={{ backgroundColor: "#173f78" }}>
        <div className="h-12 px-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,.18)" }}>
          <button aria-label="Back to Portfolio Items" onClick={onBack} className="p-1.5 rounded hover:bg-white/10"><ChevronLeft size={18} /></button>
          <TypeBadge type="Feature" />
          <span className="font-mono text-[13px] font-semibold text-white">{feature.id}</span>
          <span className="h-5 w-px bg-white/25" />
          <h1 className="text-[15px] font-semibold truncate">{feature.name}</h1>
          <div className="flex-1" />
          {feature.archivedAt && <span className="rounded-sm px-2 py-1 text-[11px] font-semibold" style={{ color: "#f8fafc", backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>Archived</span>}
          <div className="relative">
            <button aria-label="More Feature actions" onClick={() => setShowActions(previous => !previous)} className="p-1.5 rounded hover:bg-white/10"><MoreHorizontal size={17} /></button>
            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-40 rounded bg-white py-1 shadow-xl z-30" style={{ border: "1px solid #cbd5e1" }}>
                <button disabled={!editable} onClick={archiveFeature} className="w-full flex items-center gap-2 px-3 py-2 text-left text-[12px] disabled:opacity-45 hover:bg-[#f8fafc]" style={{ color: "#b45309" }}><Archive size={13} />Archive</button>
              </div>
            )}
          </div>
        </div>
        <div className="h-16 px-5 flex items-stretch gap-2">
          <button onClick={() => setActiveTab("details")} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "details" ? "#2f6fc5" : "transparent", color: activeTab === "details" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center"><FileText size={18} /></span><span>Details</span></button>
          <button onClick={() => setActiveTab("children")} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "children" ? "#2f6fc5" : "transparent", color: activeTab === "children" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center gap-1.5"><ListChecks size={19} /><span className="text-[10px] font-semibold tabular-nums">{childItems.length}</span></span><span>Children</span></button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 gap-2" style={{ backgroundColor: "#e7ebf0" }}>
        <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
          {activeTab === "details" ? (
            <div className="w-full space-y-5">
              <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Details</h2>
              {feature.archivedAt && <div className="rounded px-3 py-2 text-[12px]" style={{ color: "#7c2d12", backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}>Archived Features are read-only. Child items and history remain visible.</div>}
              <section className="bg-white rounded px-4 py-3" style={{ border: "1px solid #dde2ea" }}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#5c6478" }}>Total Accepted Children</p>
                  <div className="inline-flex rounded-sm overflow-hidden" style={{ border: "1px solid #bdd0ef" }}>
                    {(["Points", "Count"] as const).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setAcceptedChildrenMode(mode)}
                        className="px-3 py-1 text-[11px] font-semibold"
                        style={{ color: acceptedChildrenMode === mode ? "#fff" : "#2558a6", backgroundColor: acceptedChildrenMode === mode ? "#2f6fd6" : "#fff" }}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <FeatureProgressMeter
                  label={acceptedChildrenMode === "Points" ? "Accepted Children by Story Plan Estimate" : "Accepted Children by Story Count"}
                  pct={acceptedChildrenSummary.pct}
                  numerator={acceptedChildrenSummary.numerator}
                  denominator={acceptedChildrenSummary.denominator}
                  unit={acceptedChildrenSummary.unit}
                />
              </section>
              <RichTextEditor title="Description" initialValue={feature.description || ""} minHeight={220} readOnly={!editable} onChange={value => onUpdateFeature({ description: value })} />
              <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
                <div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>Attachments</div>
                {(feature.attachments || []).map(attachment => (
                  <div key={attachment} className="mx-3 mt-2 flex items-center gap-2 rounded px-3 py-2 text-[12px]" style={{ color: "#334155", backgroundColor: "#f8fafc", border: "1px solid #edf0f4" }}>
                    <Paperclip size={13} style={{ color: "#64748b" }} />
                    <span className="flex-1 truncate">{attachment}</span>
                    {editable && <button aria-label={`Remove ${attachment}`} onClick={() => onUpdateFeature({ attachments: (feature.attachments || []).filter(item => item !== attachment) })} className="p-1 rounded hover:bg-[#edf0f4]" style={{ color: "#8c94a6" }}><X size={12} /></button>}
                  </div>
                ))}
                {editable && <button onClick={() => onUpdateFeature({ attachments: [...(feature.attachments || []), `feature-attachment-${(feature.attachments || []).length + 1}.pdf`] })} className="m-3 flex items-center gap-1.5 px-3 py-2 text-[12px] rounded text-left" style={{ width: "calc(100% - 24px)", color: "#2563c5", border: "1px solid #b9c9df", backgroundColor: "#fbfdff" }}><Plus size={15} />Add attachment metadata</button>}
              </section>
              <RichTextEditor title="Notes" initialValue={feature.notes || ""} minHeight={180} readOnly={!editable} onChange={value => onUpdateFeature({ notes: value })} />
              <RichTextEditor title="What Success Looks Like" initialValue={feature.successCriteria || ""} minHeight={180} readOnly={!editable} onChange={value => onUpdateFeature({ successCriteria: value })} />
            </div>
          ) : (
            <div className="w-full flex flex-col" style={{ height: "calc(100% - 0px)" }}>
              <div className="flex items-end gap-2 mb-3 flex-wrap">
                <div className="flex flex-col items-start gap-1.5 mr-2 min-w-[150px]">
                  <div>
                    <h2 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Children</h2>
                    <p className="text-[10px]" style={{ color: "#8c94a6" }}>All Story/Defect linked to this Feature. Click the arrow to see its Tasks.</p>
                  </div>
                  {editable && <button onClick={() => setShowAddItemModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}><Plus size={12} />Add Item</button>}
                </div>
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
                  <input type="text" placeholder="Search children..." value={childSearch} onChange={e => { setChildSearch(e.target.value); setChildCurrentPage(1); }} className="pl-7 pr-3 py-1 text-[11px] rounded focus:outline-none" style={{ backgroundColor: "#f4f6f9", border: "1px solid #dde2ea", color: "#1a2234", width: 160 }} />
                </div>
                <button onClick={() => setChildShowFilters(previous => !previous)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded" style={{ border: "1px solid #bdd0ef", color: "#2558a6", backgroundColor: childShowFilters ? "#edf2fb" : "#fff" }}>
                  <Filter size={12} /> {childShowFilters ? "Hide filter" : "Show filter"}{childActiveFilterCount > 0 ? ` (${childActiveFilterCount})` : ""}
                </button>
              </div>

              {childShowFilters && (
                <div className="px-3 py-3 mb-3 rounded" style={{ backgroundColor: "#f5f8fc", border: "1px solid #cfdced" }}>
                  <div className="relative flex items-start gap-2">
                    <div className="relative shrink-0">
                      <button onClick={openChildManageFilters} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded" style={{ color: "#fff", backgroundColor: "#4b74d9", border: "1px solid #3d66c8" }}><Filter size={12} /> Manage filters</button>
                      {childShowManageFilters && (
                        <div className="absolute left-0 top-[34px] z-30 w-[300px] rounded bg-white shadow-xl" style={{ border: "1px solid #cfd6e3" }}>
                          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #edf0f4" }}>
                            <p className="text-[14px] font-semibold" style={{ color: "#3a4254" }}>Manage Filters</p>
                            <button aria-label="Close manage filters" onClick={() => setChildShowManageFilters(false)} className="p-1 rounded" style={{ color: "#2558a6" }}><X size={16} /></button>
                          </div>
                          <div className="px-4 pt-3">
                            <div className="relative">
                              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5c6478" }} />
                              <input value={childFilterColumnSearch} onChange={e => setChildFilterColumnSearch(e.target.value)} placeholder="Search" className="w-full pl-8 pr-3 py-2 text-[12px] rounded focus:outline-none" style={{ border: "1px solid #6aa0ff", color: "#1a2234" }} />
                            </div>
                          </div>
                          <div className="px-4 py-3 max-h-[220px] overflow-y-auto">
                            <p className="text-[11px] font-semibold uppercase mb-2" style={{ color: "#1a2234" }}>Selected</p>
                            {CHILD_FILTER_COLUMNS.filter(column => childPendingFilterColumns.has(column.key)).length === 0 ? (
                              <p className="text-[11px] mb-3" style={{ color: "#8c94a6" }}>No columns selected</p>
                            ) : CHILD_FILTER_COLUMNS.filter(column => childPendingFilterColumns.has(column.key)).map(column => (
                              <label key={column.key} className="flex items-center gap-2 py-1.5 text-[12px]" style={{ color: "#1a2234" }}>
                                <input type="checkbox" checked onChange={() => toggleChildPendingFilterColumn(column.key)} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#4b74d9" }} />
                                {column.label}
                              </label>
                            ))}
                            <p className="text-[11px] font-semibold uppercase mt-2 mb-2" style={{ color: "#1a2234" }}>Available</p>
                            {childAvailableFilterColumns.filter(column => !childPendingFilterColumns.has(column.key)).map(column => (
                              <label key={column.key} className="flex items-center gap-2 py-1.5 text-[12px]" style={{ color: "#3a4254" }}>
                                <input type="checkbox" checked={false} onChange={() => toggleChildPendingFilterColumn(column.key)} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#4b74d9" }} />
                                {column.label}
                              </label>
                            ))}
                          </div>
                          <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: "1px solid #edf0f4" }}>
                            <button onClick={() => setChildShowManageFilters(false)} className="px-3 py-1.5 text-[12px] rounded" style={{ color: "#2558a6" }}>Cancel</button>
                            <button onClick={applyChildManagedFilters} className="px-4 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#4b74d9" }}>Apply</button>
                          </div>
                        </div>
                      )}
                    </div>
                    {childActiveFilterCount > 0 && <button onClick={() => setChildFilters({})} className="px-2.5 py-1 text-[11px] rounded" style={{ color: "#2558a6" }}>Clear filters</button>}
                  </div>
                  {childActiveFilterCount === 0 ? (
                    <div className="mt-2 px-3 py-2 text-[11px] rounded bg-white" style={{ color: "#8c94a6", border: "1px dashed #cfd6e3" }}>No filters selected. Use Manage filters to choose columns.</div>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {childActiveFilterColumns.map(columnMeta => {
                        const filterValue = childFilters[columnMeta.key] ?? "";
                        return (
                          <div key={columnMeta.key} className="flex items-center gap-1.5 px-2 py-1.5 bg-white rounded" style={{ border: "1px solid #dde2ea" }}>
                            <span className="text-[11px] font-semibold" style={{ color: "#3a4254" }}>{columnMeta.label}</span>
                            {columnMeta.mode === "search" ? (
                              <div className="relative">
                                <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
                                <input aria-label={`${columnMeta.label} filter value`} type={columnMeta.key === "estimate" ? "number" : "text"} value={filterValue} onChange={e => updateChildFilterValue(columnMeta.key, e.target.value)} placeholder={`Filter ${columnMeta.label}`} className="pl-6 pr-2 py-1 text-[11px] rounded focus:outline-none" style={{ width: columnMeta.key === "name" ? 200 : 120, border: "1px solid #dde2ea", color: "#1a2234" }} />
                              </div>
                            ) : (
                              <select aria-label={`${columnMeta.label} filter value`} value={filterValue || "All"} onChange={e => updateChildFilterValue(columnMeta.key, e.target.value)} className="text-[11px] px-2 py-1 rounded bg-white focus:outline-none" style={{ minWidth: 120, border: "1px solid #dde2ea", color: "#1a2234" }}>
                                {getChildFilterSelectOptions(columnMeta.key).map(option => <option key={option}>{option}</option>)}
                              </select>
                            )}
                            <button aria-label={`Remove ${columnMeta.label} filter`} onClick={() => removeChildFilter(columnMeta.key)} className="p-1 rounded" style={{ color: "#8c94a6" }}><X size={12} /></button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1 bg-white rounded overflow-hidden flex flex-col" style={{ border: "1px solid #dde2ea" }}>
                <div className="flex-1 overflow-auto">
                  <div style={{ width: childTableWidth, minWidth: "100%" }}>
                    <div className="sticky top-0 z-10 flex items-center h-8 px-3 gap-1.5 select-none" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
                      <div className="w-4 shrink-0" />
                      <ResizableBacklogHeader label="Type" column="type" width={childColumnWidths.type} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <ResizableBacklogHeader label="ID" column="id" width={childColumnWidths.id} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <ResizableBacklogHeader label="Name" column="name" width={childColumnWidths.name} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <ResizableBacklogHeader label="Priority" column="priority" width={childColumnWidths.priority} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <ResizableBacklogHeader label="Est" column="estimate" width={childColumnWidths.estimate} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} align="center" />
                      <ResizableBacklogHeader label="Owner" column="owner" width={childColumnWidths.owner} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <ResizableBacklogHeader label="Schedule State" column="status" width={childColumnWidths.status} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <div className="shrink-0 text-[11px] font-semibold uppercase" style={{ width: childColumnWidths.iteration, color: "#8c94a6" }}>Iteration</div>
                      <ResizableBacklogHeader label="Release" column="release" width={childColumnWidths.release} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                    </div>

                    <div aria-label="Children totals" className="flex items-center h-8 px-3 gap-1.5 text-[11px] font-semibold" style={{ backgroundColor: "#eef3fb", borderBottom: "1px solid #cfdced", color: "#1d3f73" }}>
                      <div className="w-4 shrink-0" />
                      <div className="shrink-0" style={{ width: childColumnWidths.type }} />
                      <div className="shrink-0 px-1" style={{ width: childColumnWidths.id }}>Totals</div>
                      <div className="shrink-0" style={{ width: childColumnWidths.name }} />
                      <div className="shrink-0" style={{ width: childColumnWidths.priority }} />
                      <div className="shrink-0 text-right font-mono tabular-nums" style={{ width: childColumnWidths.estimate }}>{totalEstimate}</div>
                      <div className="shrink-0" style={{ width: childColumnWidths.owner }} />
                      <div className="shrink-0" style={{ width: childColumnWidths.status }} />
                      <div className="shrink-0" style={{ width: childColumnWidths.iteration }} />
                      <div className="shrink-0" style={{ width: childColumnWidths.release }} />
                    </div>

                    {filteredChildren.length === 0 ? <EmptyState message="No Story/Defect linked yet" /> : paginatedChildren.map(item => {
                      const itemExp = expandedChildIds.has(item.id);
                      const itemTasks = tasks.filter(task => task.parentWorkItemId === item.id);
                      return (
                        <div key={item.id}>
                          <div className="flex items-center h-9 px-3 gap-1.5 text-[12px] cursor-pointer hover:bg-[#f7f8fa]" style={{ width: childTableWidth, minWidth: "100%", borderBottom: "1px solid #edf0f4", color: "#334155" }} onClick={() => onOpenFull(item)}>
                            <button aria-label={`${itemExp ? "Collapse" : "Expand"} ${item.id} tasks`} onClick={event => { event.stopPropagation(); setExpandedChildIds(previous => { const next = new Set(previous); next.has(item.id) ? next.delete(item.id) : next.add(item.id); return next; }); }} className="w-4 shrink-0 flex items-center justify-center" style={{ color: "#8c94a6" }}>
                              {itemTasks.length > 0 ? (itemExp ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : null}
                            </button>
                            <div className="shrink-0 overflow-hidden" style={{ width: childColumnWidths.type }}><TypeBadge type={item.type} /></div>
                            <div className="shrink-0 overflow-hidden font-mono text-[11px]" style={{ width: childColumnWidths.id, color: "#2558a6" }}>{item.id}</div>
                            <div className="shrink-0 min-w-0 pr-2" style={{ width: childColumnWidths.name }} onClick={event => event.stopPropagation()}>
                              <input aria-label={`${item.id} name`} readOnly={!editable} value={item.title} onChange={e => onUpdateItem(item.id, { title: e.target.value })} className="block w-full truncate text-[12px] bg-transparent px-1 py-1 focus:outline-none focus:bg-white focus:rounded" style={{ color: "#1a2234", border: editable ? "1px solid transparent" : "0" }} />
                            </div>
                            <div className="shrink-0 overflow-hidden" style={{ width: childColumnWidths.priority }} onClick={event => event.stopPropagation()}>
                              {item.type === "Defect" && editable ? (
                                <select aria-label={`${item.id} priority`} value={CHILD_DEFECT_PRIORITY_LABELS[item.priority] ?? "None"} onChange={e => updateChildItemPriority(item.id, e.target.value)} className="w-[88px] text-[11px] font-semibold rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #f5d899", color: "#9a3412" }}>{CHILD_PRIORITY_OPTIONS.map(p => <option key={p}>{p}</option>)}</select>
                              ) : item.type === "Defect" ? <span className="inline-flex items-center gap-1 px-1.5 py-px text-[11px] font-semibold rounded-sm" style={{ backgroundColor: "#fff7ed", color: "#9a3412" }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f97316" }} />{CHILD_DEFECT_PRIORITY_LABELS[item.priority] ?? "None"}</span> : <span className="text-[11px] font-mono" style={{ color: "#a0a7b5" }}>—</span>}
                            </div>
                            <div className="shrink-0 text-center" style={{ width: childColumnWidths.estimate }} onClick={event => event.stopPropagation()}>
                              <input aria-label={`${item.id} plan estimate`} readOnly={!editable} type="number" min={0} value={item.planEstimate} onChange={e => onUpdateItem(item.id, { planEstimate: Number(e.target.value) })} className="w-11 text-center font-mono text-[11px] font-semibold bg-transparent focus:outline-none focus:bg-white focus:rounded" style={{ color: "#5c6478", border: editable ? "1px solid transparent" : "0" }} />
                            </div>
                            <div className="shrink-0 flex items-center gap-1 overflow-hidden" style={{ width: childColumnWidths.owner }} onClick={event => event.stopPropagation()}>
                              <Avatar owner={item.owner} size="xs" />
                              {editable ? <select aria-label={`${item.id} owner`} value={item.owner.name} onChange={e => { const o = OWNERS.find(c => c.name === e.target.value); if (o) onUpdateItem(item.id, { owner: o }); }} className="min-w-0 flex-1 text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select> : <span className="text-[11px] truncate" style={{ color: "#5c6478" }}>{item.owner.initials}</span>}
                            </div>
                            <div className="shrink-0 overflow-hidden" style={{ width: childColumnWidths.status }} onClick={event => event.stopPropagation()}>
                              <ScheduleStateBar aria-label={`${item.id} schedule state`} value={item.status} onChange={editable ? next => onUpdateItem(item.id, { status: next }) : undefined} />
                            </div>
                            <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: childColumnWidths.iteration, color: "#5c6478" }}>{item.iteration}</div>
                            <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: childColumnWidths.release }} onClick={event => event.stopPropagation()}>
                              {editable ? <select aria-label={`${item.id} release`} value={item.release} onChange={e => onUpdateItem(item.id, { release: e.target.value, releaseId: releases.find(r => r.projectKey === feature.project && r.name === e.target.value)?.id })} className="w-[110px] text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{childReleaseOptions.map(r => <option key={r}>{r}</option>)}</select> : <span style={{ color: "#5c6478" }}>{item.release}</span>}
                            </div>
                          </div>
                          {itemExp && itemTasks.map(task => (
                            <div key={task.id} className="flex items-center h-9 px-3 gap-1.5 text-[11px]" style={{ width: childTableWidth, minWidth: "100%", paddingLeft: 44, backgroundColor: "#fcfdfe", borderBottom: "1px solid #f0f2f5", color: "#334155" }}>
                              <span className="shrink-0 truncate font-mono" style={{ width: childColumnWidths.type + childColumnWidths.id - 24, color: "#8c94a6" }}>{task.id}</span>
                              <span className="shrink-0 min-w-0 truncate" style={{ width: childColumnWidths.name }}>{task.name}</span>
                              <span className="shrink-0" style={{ width: childColumnWidths.priority }}><TaskStateBadge state={task.state} /></span>
                              <span className="shrink-0 text-right font-mono" style={{ width: childColumnWidths.estimate }}>{task.estimate}</span>
                              <span className="shrink-0 flex items-center gap-1.5 min-w-0" style={{ width: childColumnWidths.owner }}><Avatar owner={task.owner} size="xs" /><span className="truncate">{task.owner.name}</span></span>
                              <span className="shrink-0 text-[10px]" style={{ width: childColumnWidths.status + childColumnWidths.iteration + childColumnWidths.release, color: "#8c94a6" }}>To Do {task.todo}h · Actual {task.actuals}h</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="h-10 shrink-0 flex items-center justify-between px-3 bg-white" style={{ borderTop: "1px solid #e2e6eb" }}>
                  <div className="flex items-center gap-2 text-[11px]" style={{ color: "#5c6478" }}>
                    <span>Rows per page</span>
                    <select aria-label="Children rows per page" value={childPageSize} onChange={e => { setChildPageSize(Number(e.target.value)); setChildCurrentPage(1); }} className="px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>
                      {[10, 25, 50].map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                    <span style={{ color: "#8c94a6" }}>{filteredChildren.length === 0 ? "0 records" : `${childPageStart + 1}-${Math.min(childPageStart + childPageSize, filteredChildren.length)} of ${filteredChildren.length}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] tabular-nums" style={{ color: "#5c6478" }}>Page {childActivePage} of {childTotalPages}</span>
                    <button aria-label="Previous page" disabled={childActivePage === 1} onClick={() => setChildCurrentPage(childActivePage - 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronLeft size={13} /></button>
                    <button aria-label="Next page" disabled={childActivePage === childTotalPages} onClick={() => setChildCurrentPage(childActivePage + 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronRight size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {activeTab === "details" && (
        <aside className="w-[340px] shrink-0 overflow-y-scroll p-5 space-y-4 bg-white" style={{ borderLeft: "1px solid #d7dde7", scrollbarGutter: "stable" }}>
          <Field label="Owner"><select disabled={!editable} aria-label="Feature owner" className={fieldClass} style={fieldStyle} value={feature.owner.name} onChange={e => { const o = OWNERS.find(c => c.name === e.target.value); if (o) onUpdateFeature({ owner: o }); }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select></Field>
          <Field label="Project"><select disabled={!editable} aria-label="Feature project" className={fieldClass} style={fieldStyle} value={feature.project || SCOPE_PROJECTS[0].key} onChange={e => changeProject(e.target.value)}>{editableProjectOptions.map(p => <option key={p.key} value={p.key}>{p.key} · {p.name}</option>)}</select></Field>
          <Field label="Epic"><select disabled={!editable} aria-label="Feature Epic" className={fieldClass} style={fieldStyle} value={feature.epicId || ""} onChange={e => onUpdateFeature({ epicId: e.target.value || undefined })}><option value="">Unassigned</option>{epicOptions.map(epic => <option key={epic.id} value={epic.id}>{epic.id} · {epic.name}</option>)}</select></Field>
          <section className="space-y-3">
            <FeatureProgressMeter label="Percent Done By Story Plan Estimate" pct={pctByStoryPlanEstimate} numerator={doneEstimate} denominator={totalEstimate} unit="points" />
            <FeatureProgressMeter label="Percent Done By Story Count" pct={pctByStoryCount} numerator={acceptedStoryCount} denominator={totalStoryCount} unit="stories" />
            <FeatureProgressMeter label="Estimated Progress by Story Points" pct={pctEstimatedByFeaturePoints} numerator={doneEstimate} denominator={topDownPointEstimate} unit="points" />
            <FeatureProgressMeter label="Estimated Progress by Story Count" pct={pctEstimatedByFeatureCount} numerator={acceptedStoryCount} denominator={topDownCountEstimate} unit="stories" />
          </section>
          <Field label="Preliminary Estimate"><select disabled={!editable} aria-label="Feature preliminary estimate" className={fieldClass} style={fieldStyle} value={feature.preliminaryEstimate} onChange={e => onUpdateFeature({ preliminaryEstimate: e.target.value as EstimateSize })}>{ESTIMATE_SIZES.map(size => <option key={size}>{size}</option>)}</select></Field>
          <Field label="State"><select disabled={!editable} aria-label="Feature state" className={fieldClass} style={fieldStyle} value={feature.status} onChange={e => onUpdateFeature({ status: e.target.value as PortfolioState })}>{PORTFOLIO_STATES.map(s => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Release"><select disabled={!editable} aria-label="Feature release" className={fieldClass} style={fieldStyle} value={scopedReleaseOptions.includes(feature.release) ? feature.release : "Unscheduled"} onChange={e => onUpdateFeature(getReleasePatch(releases, feature.project || "", e.target.value))}>{scopedReleaseOptions.map(option => <option key={option}>{option}</option>)}</select></Field>
          <Field label="Milestone">
            <details className="rounded bg-white" style={fieldStyle}>
              <summary className="cursor-pointer list-none px-3 py-2 text-[12px]" style={{ color: "#1a2234" }}>{selectedMilestoneIds.length} milestone{selectedMilestoneIds.length === 1 ? "" : "s"} selected</summary>
              <div className="max-h-44 overflow-y-auto px-2 pb-2" style={{ borderTop: "1px solid #edf0f4" }}>
                {milestoneOptions.length === 0 ? <p className="px-1 py-2 text-[11px]" style={{ color: "#8c94a6" }}>No related milestone available</p> : milestoneOptions.map(milestone => (
                  <label key={milestone.id} className="flex items-start gap-2 rounded px-1 py-1.5 text-[11px] hover:bg-[#f8fafc]" style={{ color: "#334155" }}>
                    <input type="checkbox" disabled={!editable} checked={selectedMilestoneIds.includes(milestone.id)} onChange={() => toggleMilestone(milestone.id)} className="mt-0.5 h-3.5 w-3.5" />
                    <span><span className="block font-medium">{milestone.name}</span><span className="block text-[10px]" style={{ color: "#8c94a6" }}>{milestone.id}</span></span>
                  </label>
                ))}
              </div>
            </details>
          </Field>
          <Field label="Creation Date"><input readOnly disabled className={fieldClass} style={{ ...fieldStyle, backgroundColor: "#f8fafc" }} value={feature.createdAt} /></Field>
          <Field label="Refined Estimate"><input type="number" min={0} disabled={!editable} aria-label="Feature refined estimate" className={fieldClass} style={fieldStyle} value={feature.refinedEstimate ?? ""} placeholder={`${PRELIMINARY_ESTIMATE_POINT_FALLBACK[feature.preliminaryEstimate]} pts fallback`} onChange={e => onUpdateFeature({ refinedEstimate: parseOptionalNonNegativeNumber(e.target.value) })} /></Field>
          <Field label="Refined Work Item Count Estimate"><input type="number" min={0} disabled={!editable} aria-label="Feature refined work item count estimate" className={fieldClass} style={fieldStyle} value={feature.refinedWorkItemCountEstimate ?? ""} placeholder={`${PRELIMINARY_ESTIMATE_COUNT_FALLBACK[feature.preliminaryEstimate]} stories fallback`} onChange={e => onUpdateFeature({ refinedWorkItemCountEstimate: parseOptionalNonNegativeNumber(e.target.value) })} /></Field>
          <Field label="Planned Start Date"><input disabled={!editable} placeholder="e.g. Nov 1, 2024" className={fieldClass} style={fieldStyle} value={feature.plannedStartDate || ""} onChange={e => onUpdateFeature({ plannedStartDate: e.target.value })} /></Field>
          <Field label="Planned End Date"><input type="date" disabled={!editable} className={fieldClass} style={fieldStyle} value={feature.plannedEndDate || ""} onChange={e => onUpdateFeature({ plannedEndDate: e.target.value })} /></Field>
          <Field label="Market Release Date"><input type="date" disabled={!editable} className={fieldClass} style={fieldStyle} value={feature.marketReleaseDate || ""} onChange={e => onUpdateFeature({ marketReleaseDate: e.target.value })} /></Field>
        </aside>
        )}
      </div>
      {showArchiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.34)" }} onClick={() => setShowArchiveConfirm(false)} />
          <section className="relative w-[420px] rounded bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="archive-feature-title" style={{ border: "1px solid #cbd5e1" }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #e2e8f0" }}>
              <h2 id="archive-feature-title" className="text-[15px] font-semibold" style={{ color: "#1a2234" }}>Archive Feature</h2>
              <p className="mt-1 text-[12px] leading-5" style={{ color: "#64748b" }}>{feature.id} remains available in history and becomes read-only. It will be hidden from the default Active list.</p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3" style={{ backgroundColor: "#f8fafc" }}>
              <button onClick={() => setShowArchiveConfirm(false)} className="px-3.5 py-1.5 text-[12px] font-medium rounded" style={{ border: "1px solid #cbd5e1", color: "#475569" }}>Cancel</button>
              <button onClick={() => { setShowArchiveConfirm(false); onArchiveFeature(); }} className="px-3.5 py-1.5 text-[12px] font-semibold rounded text-white" style={{ backgroundColor: "#b45309" }}>Archive</button>
            </div>
          </section>
        </div>
      )}
      {editable && showAddItemModal && <NewItemModal onClose={() => setShowAddItemModal(false)} defaultProjectKey={feature.project} defaultTeam={feature.team} allowedTypes={["Story", "Defect"]} features={features} defaultFeatureId={feature.id} onCreate={(input, openDetails) => onCreateItem({ ...input, featureId: feature.id }, openDetails)} />}
    </div>
  );
}

function EpicDetailView({ epic, childFeatures, leafItems, role, readOnly, releases, milestones, features, tasks, onBack, onUpdateEpic, onArchiveEpic, onUpdateFeature, onCreateFeature, onOpenFeature }: {
  epic: Epic; childFeatures: Feature[]; leafItems: WorkItem[];
  role: Role; readOnly: boolean; releases: ReleaseItem[]; milestones: MilestoneItem[]; features: Feature[]; tasks: TaskItem[];
  onBack: () => void;
  onUpdateEpic: (patch: Partial<Epic>) => void;
  onArchiveEpic: () => void;
  onUpdateFeature: (id: string, patch: Partial<Feature>) => void;
  onCreateFeature: (input: NewFeatureInput) => Feature;
  onOpenFeature: (id: string) => void;
}) {
  const editable = !readOnly && canManageFeatureInProject(role, epic.project);
  const [activeTab, setActiveTab] = useState<"details" | "children">("details");
  const [showActions, setShowActions] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showAddFeatureModal, setShowAddFeatureModal] = useState(false);
  const [acceptedChildrenMode, setAcceptedChildrenMode] = useState<"Points" | "Count">("Points");
  const [expandedFeatureIds, setExpandedFeatureIds] = useState<Set<string>>(new Set());
  const selectedMilestoneIds = epic.milestoneIds || [];
  const milestoneOptions = milestones.filter(m => selectedMilestoneIds.includes(m.id) || m.projectKeys.includes(epic.project || ""));
  const editableProjectOptions = role === "Workspace Admin"
    ? SCOPE_PROJECTS
    : SCOPE_PROJECTS.filter(project => ROLE_SCOPE.projectAdminProjectKeys.includes(project.key as typeof ROLE_SCOPE.projectAdminProjectKeys[number]));
  const acceptedLeaf = leafItems.filter(item => item.status === "Accepted" || item.status === "Release");
  const totalEstimate = leafItems.reduce((sum, item) => sum + item.planEstimate, 0);
  const doneEstimate = acceptedLeaf.reduce((sum, item) => sum + item.planEstimate, 0);
  const acceptedStoryCount = acceptedLeaf.length;
  const totalStoryCount = leafItems.length;
  const pctByStoryPlanEstimate = totalEstimate <= 0 ? 0 : Math.round((doneEstimate / totalEstimate) * 100);
  const pctByStoryCount = totalStoryCount <= 0 ? 0 : Math.round((acceptedStoryCount / totalStoryCount) * 100);
  const topDownPointEstimate = getEpicTopDownPointEstimate(epic);
  const topDownCountEstimate = getEpicTopDownCountEstimate(epic);
  const pctEstimatedByEpicPoints = topDownPointEstimate <= 0 ? 0 : Math.round((doneEstimate / topDownPointEstimate) * 100);
  const pctEstimatedByEpicCount = topDownCountEstimate <= 0 ? 0 : Math.round((acceptedStoryCount / topDownCountEstimate) * 100);
  const acceptedChildrenSummary = acceptedChildrenMode === "Points"
    ? { pct: pctByStoryPlanEstimate, numerator: doneEstimate, denominator: totalEstimate, unit: "points" }
    : { pct: pctByStoryCount, numerator: acceptedStoryCount, denominator: totalStoryCount, unit: "stories" };
  const activeChildFeatures = childFeatures.filter(feature => !feature.archivedAt);

  function changeProject(projectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(candidate => candidate.key === projectKey) || SCOPE_PROJECTS[0];
    onUpdateEpic({ project: nextProject.key });
  }
  function toggleMilestone(milestoneId: string) {
    const next = selectedMilestoneIds.includes(milestoneId) ? selectedMilestoneIds.filter(id => id !== milestoneId) : [...selectedMilestoneIds, milestoneId];
    onUpdateEpic({ milestoneIds: next });
  }
  function archiveEpic() {
    setShowActions(false);
    setShowArchiveConfirm(true);
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="shrink-0 text-white" style={{ backgroundColor: "#173f78" }}>
        <div className="h-12 px-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,.18)" }}>
          <button aria-label="Back to Portfolio Items" onClick={onBack} className="p-1.5 rounded hover:bg-white/10"><ChevronLeft size={18} /></button>
          <PortfolioItemTypeBadge type="Epic" />
          <span className="font-mono text-[13px] font-semibold text-white">{epic.id}</span>
          <span className="h-5 w-px bg-white/25" />
          <h1 className="text-[15px] font-semibold truncate">{epic.name}</h1>
          <div className="flex-1" />
          {epic.archivedAt && <span className="rounded-sm px-2 py-1 text-[11px] font-semibold" style={{ color: "#f8fafc", backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>Archived</span>}
          <div className="relative">
            <button aria-label="More Epic actions" onClick={() => setShowActions(previous => !previous)} className="p-1.5 rounded hover:bg-white/10"><MoreHorizontal size={17} /></button>
            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-40 rounded bg-white py-1 shadow-xl z-30" style={{ border: "1px solid #cbd5e1" }}>
                <button disabled={!editable || activeChildFeatures.length > 0} title={activeChildFeatures.length > 0 ? "Archive blocked while active child Features exist" : "Archive Epic"} onClick={archiveEpic} className="w-full flex items-center gap-2 px-3 py-2 text-left text-[12px] disabled:opacity-45 hover:bg-[#f8fafc]" style={{ color: "#b45309" }}><Archive size={13} />Archive</button>
              </div>
            )}
          </div>
        </div>
        <div className="h-16 px-5 flex items-stretch gap-2">
          <button onClick={() => setActiveTab("details")} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "details" ? "#2f6fc5" : "transparent", color: activeTab === "details" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center"><FileText size={18} /></span><span>Details</span></button>
          <button onClick={() => setActiveTab("children")} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "children" ? "#2f6fc5" : "transparent", color: activeTab === "children" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center gap-1.5"><ListChecks size={19} /><span className="text-[10px] font-semibold tabular-nums">{childFeatures.length}</span></span><span>Children</span></button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 gap-2" style={{ backgroundColor: "#e7ebf0" }}>
        <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
          {activeTab === "details" ? (
            <div className="w-full space-y-5">
              <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Details</h2>
              <section className="bg-white rounded px-4 py-3" style={{ border: "1px solid #dde2ea" }}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#5c6478" }}>Total Accepted Children</p>
                  <div className="inline-flex rounded-sm overflow-hidden" style={{ border: "1px solid #bdd0ef" }}>
                    {(["Points", "Count"] as const).map(mode => (
                      <button key={mode} type="button" onClick={() => setAcceptedChildrenMode(mode)} className="px-3 py-1 text-[11px] font-semibold" style={{ color: acceptedChildrenMode === mode ? "#fff" : "#2558a6", backgroundColor: acceptedChildrenMode === mode ? "#2f6fd6" : "#fff" }}>{mode}</button>
                    ))}
                  </div>
                </div>
                <FeatureProgressMeter label={acceptedChildrenMode === "Points" ? "Accepted Leaf Story Plan Estimate" : "Accepted Leaf Story Count"} pct={acceptedChildrenSummary.pct} numerator={acceptedChildrenSummary.numerator} denominator={acceptedChildrenSummary.denominator} unit={acceptedChildrenSummary.unit} />
              </section>
              <RichTextEditor title="Description" initialValue={epic.description || ""} minHeight={220} readOnly={!editable} onChange={value => onUpdateEpic({ description: value })} />
              <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
                <div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>Attachments</div>
                {(epic.attachments || []).map(attachment => (
                  <div key={attachment} className="mx-3 mt-2 flex items-center gap-2 rounded px-3 py-2 text-[12px]" style={{ color: "#334155", backgroundColor: "#f8fafc", border: "1px solid #edf0f4" }}>
                    <Paperclip size={13} style={{ color: "#64748b" }} />
                    <span className="flex-1 truncate">{attachment}</span>
                    {editable && <button aria-label={`Remove ${attachment}`} onClick={() => onUpdateEpic({ attachments: (epic.attachments || []).filter(item => item !== attachment) })} className="p-1 rounded hover:bg-[#edf0f4]" style={{ color: "#8c94a6" }}><X size={12} /></button>}
                  </div>
                ))}
                {editable && <button onClick={() => onUpdateEpic({ attachments: [...(epic.attachments || []), `epic-attachment-${(epic.attachments || []).length + 1}.pdf`] })} className="m-3 flex items-center gap-1.5 px-3 py-2 text-[12px] rounded text-left" style={{ width: "calc(100% - 24px)", color: "#2563c5", border: "1px solid #b9c9df", backgroundColor: "#fbfdff" }}><Plus size={15} />Add attachment metadata</button>}
              </section>
              <RichTextEditor title="Notes" initialValue={epic.notes || ""} minHeight={180} readOnly={!editable} onChange={value => onUpdateEpic({ notes: value })} />
              <RichTextEditor title="What Success Looks Like" initialValue={epic.successCriteria || ""} minHeight={180} readOnly={!editable} onChange={value => onUpdateEpic({ successCriteria: value })} />
            </div>
          ) : (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Children</h2>
                  <p className="text-[10px]" style={{ color: "#8c94a6" }}>Features grouped under this Epic. Leaf Story/Defect rollups flow through these Features.</p>
                </div>
                {editable && <button onClick={() => setShowAddFeatureModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}><Plus size={12} />Add Feature</button>}
              </div>
              <div className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
                <div className="grid h-8 items-center gap-2 px-3 text-[11px] font-semibold uppercase" style={{ gridTemplateColumns: "36px 74px minmax(260px,1fr) 130px 130px 90px 90px 90px 132px", color: "#475569", backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
                  <span className="text-right">Rank</span><span>ID</span><span>Name</span><span>Team</span><span>State</span><span className="text-right">Complete</span><span className="text-right">Rollup</span><span className="text-right">Estimated</span><span>Owner</span>
                </div>
                {childFeatures.length === 0 ? <EmptyState message="No Feature linked to this Epic yet" /> : childFeatures.sort((a, b) => (a.rank || 99) - (b.rank || 99)).map((feature, idx) => {
                  const featureLeaf = leafItems.filter(item => item.featureId === feature.id);
                  const accepted = featureLeaf.filter(item => item.status === "Accepted" || item.status === "Release");
                  const complete = accepted.reduce((sum, item) => sum + item.planEstimate, 0);
                  const rollup = featureLeaf.reduce((sum, item) => sum + item.planEstimate, 0);
                  const estimated = getFeatureTopDownPointEstimate(feature);
                  const expanded = expandedFeatureIds.has(feature.id);
                  return (
                    <div key={feature.id}>
                      <div className="grid min-h-9 items-center gap-2 px-3 text-[12px] hover:bg-[#f7f8fa] cursor-pointer" style={{ gridTemplateColumns: "36px 74px minmax(260px,1fr) 130px 130px 90px 90px 90px 132px", color: "#334155", borderBottom: "1px solid #edf0f4" }} onClick={() => onOpenFeature(feature.id)}>
                        <span className="text-right font-mono tabular-nums">{idx + 1}</span>
                        <span className="font-mono font-semibold" style={{ color: "#2558a6" }}>{feature.id}</span>
                        <span className="flex items-center gap-1.5 min-w-0"><button aria-label={`${expanded ? "Collapse" : "Expand"} ${feature.id}`} onClick={event => { event.stopPropagation(); setExpandedFeatureIds(previous => { const next = new Set(previous); next.has(feature.id) ? next.delete(feature.id) : next.add(feature.id); return next; }); }} className="p-0.5 rounded" style={{ color: "#8c94a6" }}>{expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</button><span className="truncate font-semibold">{feature.name}</span></span>
                        <span className="truncate">{feature.team}</span>
                        <PortfolioStateBadge state={feature.status} />
                        <span className="text-right font-mono tabular-nums">{complete}</span>
                        <span className="text-right font-mono tabular-nums">{rollup}</span>
                        <span className="text-right font-mono tabular-nums">{estimated}</span>
                        <span className="flex items-center gap-1.5 min-w-0"><Avatar owner={feature.owner} size="xs" /><span className="truncate">{feature.owner.name}</span></span>
                      </div>
                      {expanded && featureLeaf.slice(0, 5).map(item => (
                        <div key={item.id} className="grid h-8 items-center gap-2 px-3 text-[11px]" style={{ gridTemplateColumns: "36px 74px minmax(260px,1fr) 130px 130px 90px 90px 90px 132px", color: "#64748b", backgroundColor: "#fcfdfe", borderBottom: "1px solid #f0f2f5" }}>
                          <span /><span className="font-mono">{item.id}</span><span className="truncate pl-6">{item.title}</span><span>{item.team}</span><span>{item.status}</span><span className="text-right">{item.status === "Accepted" || item.status === "Release" ? item.planEstimate : 0}</span><span className="text-right">{item.planEstimate}</span><span className="text-right">{item.planEstimate}</span><span>{item.owner.name}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        {activeTab === "details" && (
          <aside className="w-[340px] shrink-0 overflow-y-scroll p-5 space-y-4 bg-white" style={{ borderLeft: "1px solid #d7dde7", scrollbarGutter: "stable" }}>
            <Field label="Owner"><select disabled={!editable} aria-label="Epic owner" className={fieldClass} style={fieldStyle} value={epic.owner.name} onChange={e => { const o = OWNERS.find(c => c.name === e.target.value); if (o) onUpdateEpic({ owner: o }); }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select></Field>
            <Field label="Project"><select disabled={!editable} aria-label="Epic project" className={fieldClass} style={fieldStyle} value={epic.project || SCOPE_PROJECTS[0].key} onChange={e => changeProject(e.target.value)}>{editableProjectOptions.map(p => <option key={p.key} value={p.key}>{p.key} · {p.name}</option>)}</select></Field>
            <section className="space-y-3">
              <FeatureProgressMeter label="Percent Done By Story Plan Estimate" pct={pctByStoryPlanEstimate} numerator={doneEstimate} denominator={totalEstimate} unit="points" />
              <FeatureProgressMeter label="Percent Done By Story Count" pct={pctByStoryCount} numerator={acceptedStoryCount} denominator={totalStoryCount} unit="stories" />
              <FeatureProgressMeter label="Estimated Progress by Story Points" pct={pctEstimatedByEpicPoints} numerator={doneEstimate} denominator={topDownPointEstimate} unit="points" />
              <FeatureProgressMeter label="Estimated Progress by Story Count" pct={pctEstimatedByEpicCount} numerator={acceptedStoryCount} denominator={topDownCountEstimate} unit="stories" />
            </section>
            <Field label="Preliminary Estimate"><select disabled={!editable} aria-label="Epic preliminary estimate" className={fieldClass} style={fieldStyle} value={epic.preliminaryEstimate} onChange={e => onUpdateEpic({ preliminaryEstimate: e.target.value as EstimateSize })}>{ESTIMATE_SIZES.map(size => <option key={size}>{size}</option>)}</select></Field>
            <Field label="State"><select disabled={!editable} aria-label="Epic state" className={fieldClass} style={fieldStyle} value={epic.status} onChange={e => onUpdateEpic({ status: e.target.value as PortfolioState })}>{PORTFOLIO_STATES.map(s => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Milestone">
              <details className="rounded bg-white" style={fieldStyle}>
                <summary className="cursor-pointer list-none px-3 py-2 text-[12px]" style={{ color: "#1a2234" }}>{selectedMilestoneIds.length} milestone{selectedMilestoneIds.length === 1 ? "" : "s"} selected</summary>
                <div className="max-h-44 overflow-y-auto px-2 pb-2" style={{ borderTop: "1px solid #edf0f4" }}>
                  {milestoneOptions.length === 0 ? <p className="px-1 py-2 text-[11px]" style={{ color: "#8c94a6" }}>No related milestone available</p> : milestoneOptions.map(milestone => (
                    <label key={milestone.id} className="flex items-start gap-2 rounded px-1 py-1.5 text-[11px] hover:bg-[#f8fafc]" style={{ color: "#334155" }}>
                      <input type="checkbox" disabled={!editable} checked={selectedMilestoneIds.includes(milestone.id)} onChange={() => toggleMilestone(milestone.id)} className="mt-0.5 h-3.5 w-3.5" />
                      <span><span className="block font-medium">{milestone.name}</span><span className="block text-[10px]" style={{ color: "#8c94a6" }}>{milestone.id}</span></span>
                    </label>
                  ))}
                </div>
              </details>
            </Field>
            <Field label="Creation Date"><input readOnly disabled className={fieldClass} style={{ ...fieldStyle, backgroundColor: "#f8fafc" }} value={epic.createdAt} /></Field>
            <Field label="Refined Estimate"><input type="number" min={0} disabled={!editable} aria-label="Epic refined estimate" className={fieldClass} style={fieldStyle} value={epic.refinedEstimate ?? ""} placeholder={`${PRELIMINARY_ESTIMATE_POINT_FALLBACK[epic.preliminaryEstimate]} pts fallback`} onChange={e => onUpdateEpic({ refinedEstimate: parseOptionalNonNegativeNumber(e.target.value) })} /></Field>
            <Field label="Refined Work Item Count Estimate"><input type="number" min={0} disabled={!editable} aria-label="Epic refined work item count estimate" className={fieldClass} style={fieldStyle} value={epic.refinedWorkItemCountEstimate ?? ""} placeholder={`${PRELIMINARY_ESTIMATE_COUNT_FALLBACK[epic.preliminaryEstimate]} stories fallback`} onChange={e => onUpdateEpic({ refinedWorkItemCountEstimate: parseOptionalNonNegativeNumber(e.target.value) })} /></Field>
            <Field label="Planned Start Date"><input disabled={!editable} placeholder="e.g. Nov 1, 2024" className={fieldClass} style={fieldStyle} value={epic.plannedStartDate || ""} onChange={e => onUpdateEpic({ plannedStartDate: e.target.value })} /></Field>
            <Field label="Planned End Date"><input type="date" disabled={!editable} className={fieldClass} style={fieldStyle} value={epic.plannedEndDate || ""} onChange={e => onUpdateEpic({ plannedEndDate: e.target.value })} /></Field>
            <Field label="Market Release Date"><input type="date" disabled={!editable} className={fieldClass} style={fieldStyle} value={epic.marketReleaseDate || ""} onChange={e => onUpdateEpic({ marketReleaseDate: e.target.value })} /></Field>
          </aside>
        )}
      </div>
      {showArchiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.34)" }} onClick={() => setShowArchiveConfirm(false)} />
          <section className="relative w-[420px] rounded bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="archive-epic-title" style={{ border: "1px solid #cbd5e1" }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #e2e8f0" }}>
              <h2 id="archive-epic-title" className="text-[15px] font-semibold" style={{ color: "#1a2234" }}>Archive Epic</h2>
              <p className="mt-1 text-[12px] leading-5" style={{ color: "#64748b" }}>{epic.id} remains available in history. It can only be archived when no active child Feature remains.</p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3" style={{ backgroundColor: "#f8fafc" }}>
              <button onClick={() => setShowArchiveConfirm(false)} className="px-3.5 py-1.5 text-[12px] font-medium rounded" style={{ border: "1px solid #cbd5e1", color: "#475569" }}>Cancel</button>
              <button disabled={activeChildFeatures.length > 0} onClick={() => { setShowArchiveConfirm(false); onArchiveEpic(); }} className="px-3.5 py-1.5 text-[12px] font-semibold rounded text-white disabled:opacity-45" style={{ backgroundColor: "#b45309" }}>Archive</button>
            </div>
          </section>
        </div>
      )}
      {editable && showAddFeatureModal && <NewFeatureModal role={role} currentProject={SCOPE_PROJECTS.find(project => project.key === epic.project) || SCOPE_PROJECTS[0]} currentTeam="All Teams" releases={releases} epics={[epic]} defaultEpicId={epic.id} onClose={() => setShowAddFeatureModal(false)} onCreate={input => onCreateFeature({ ...input, epicId: epic.id })} onCreateWithDetails={input => onOpenFeature(onCreateFeature({ ...input, epicId: epic.id }).id)} />}
    </div>
  );
}

export function PortfolioPage({ role, project, team, portfolioTypeFilter, releases, epics, features, workItems, tasks, milestones, onCreateEpic, onUpdateEpic, onCreateFeature, onUpdateFeature, onUpdateItem, onCreateItem, onOpenFull }: {
  role: Role; project: ScopeProject; team: string; releases: ReleaseItem[]; epics: Epic[]; features: Feature[]; workItems: WorkItem[]; tasks: TaskItem[]; milestones: MilestoneItem[];
  portfolioTypeFilter: "Epic" | "Feature";
  onCreateEpic: (input: NewEpicInput) => Epic;
  onUpdateEpic: (id: string, patch: Partial<Epic>) => void;
  onCreateFeature: (input: NewFeatureInput) => Feature;
  onUpdateFeature: (id: string, patch: Partial<Feature>) => void;
  onUpdateItem: (id: string, patch: Partial<WorkItem>) => void;
  onCreateItem: (input: NewWorkItemInput, openDetails: boolean) => void;
  onOpenFull: (item: WorkItem) => void;
}) {
  const [showModal, setShowModal] = useState<"Epic" | "Feature" | null>(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [portfolioSearch, setPortfolioSearch] = useState("");
  const [showFieldsOpen, setShowFieldsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<PortfolioColumnKey, boolean>>(() =>
    PORTFOLIO_COLUMN_DEFS.reduce((acc, column) => ({ ...acc, [column.key]: true }), {} as Record<PortfolioColumnKey, boolean>)
  );
  const [selectedPortfolioIds, setSelectedPortfolioIds] = useState<Set<string>>(new Set());
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);
  const [activeEpicId, setActiveEpicId] = useState<string | null>(null);
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);
  const [expandedEpicIds, setExpandedEpicIds] = useState<Set<string>>(new Set());
  const [expandedFeatureIds, setExpandedFeatureIds] = useState<Set<string>>(new Set());
  const archiveFilter: ArchiveFilter = "Active";
  const backlogItems = workItems.filter(i => (i.type === "Story" || i.type === "Defect") && i.project === project.key);
  const editable = canManageFeatureInProject(role, project.key);
  const [columnWidthsState, setColumnWidths] = useState<Record<PortfolioColumnKey, number>>({ rank: 56, type: 76, id: 76, name: 280, release: 132, state: 172, percentDoneByStoryPlanEstimate: 190, percentDoneByStoryCount: 180, project: 64, team: 150, owner: 132 });
  const [sort, setSort] = useState<PortfolioSort | null>(null);
  function toggleFeatureExpanded(id: string) {
    setExpandedFeatureIds(previous => { const next = new Set(previous); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }
  function toggleEpicExpanded(id: string) {
    setExpandedEpicIds(previous => { const next = new Set(previous); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  const normalizedPortfolioSearch = portfolioSearch.trim().toLowerCase();
  function matchesPortfolioSearch(values: Array<string | number | undefined | null>) {
    if (!normalizedPortfolioSearch) return true;
    return values.some(value => String(value ?? "").toLowerCase().includes(normalizedPortfolioSearch));
  }
  const visibleColumnKeys = PORTFOLIO_COLUMN_DEFS.filter(column => visibleColumns[column.key]).map(column => column.key);
  const columnWidths = PORTFOLIO_COLUMN_DEFS.reduce((acc, column) => ({ ...acc, [column.key]: visibleColumns[column.key] ? columnWidthsState[column.key] : 0 }), {} as Record<PortfolioColumnKey, number>);
  const shownColumnWidths = visibleColumnKeys.reduce((total, key) => total + columnWidths[key], 0);
  const portfolioTableWidth = shownColumnWidths + 74;

  const scopedFeatures = features.filter(feat =>
    feat.project === project.key &&
    (team === "All Teams" || feat.team === team) &&
    (archiveFilter === "All" || (archiveFilter === "Archived" ? Boolean(feat.archivedAt) : !feat.archivedAt)) &&
    matchesPortfolioSearch([feat.id, feat.name, feat.release, feat.status, feat.project, feat.team, feat.owner.name])
  );
  const featureRollups = scopedFeatures.map(feat => {
    const children = backlogItems.filter(i => i.featureId === feat.id);
    const totalEstimate = children.reduce((s, i) => s + i.planEstimate, 0);
    const acceptedChildren = children.filter(i => i.status === "Accepted" || i.status === "Release");
    const doneEstimate = acceptedChildren.reduce((s, i) => s + i.planEstimate, 0);
    const totalStoryCount = children.length;
    const acceptedStoryCount = acceptedChildren.length;
    const pctByStoryPlanEstimate = totalEstimate > 0 ? Math.round((doneEstimate / totalEstimate) * 100) : 0;
    const pctByStoryCount = totalStoryCount > 0 ? Math.round((acceptedStoryCount / totalStoryCount) * 100) : 0;
    return { feat, children, totalEstimate, doneEstimate, totalStoryCount, acceptedStoryCount, pctByStoryPlanEstimate, pctByStoryCount };
  });
  const epicRollups = epics.filter(epic =>
    team === "All Teams" &&
    epic.project === project.key &&
    (archiveFilter === "All" || (archiveFilter === "Archived" ? Boolean(epic.archivedAt) : !epic.archivedAt))
  ).map(epic => {
    const childFeatures = features.filter(feature => feature.project === project.key && feature.epicId === epic.id && (archiveFilter === "All" || (archiveFilter === "Archived" ? Boolean(feature.archivedAt) : !feature.archivedAt)));
    const childFeatureIds = new Set(childFeatures.map(feature => feature.id));
    const children = backlogItems.filter(item => item.featureId && childFeatureIds.has(item.featureId));
    const totalEstimate = children.reduce((s, i) => s + i.planEstimate, 0);
    const acceptedChildren = children.filter(i => i.status === "Accepted" || i.status === "Release");
    const doneEstimate = acceptedChildren.reduce((s, i) => s + i.planEstimate, 0);
    const totalStoryCount = children.length;
    const acceptedStoryCount = acceptedChildren.length;
    const pctByStoryPlanEstimate = totalEstimate > 0 ? Math.round((doneEstimate / totalEstimate) * 100) : 0;
    const pctByStoryCount = totalStoryCount > 0 ? Math.round((acceptedStoryCount / totalStoryCount) * 100) : 0;
    return { epic, childFeatures, children, totalEstimate, doneEstimate, totalStoryCount, acceptedStoryCount, pctByStoryPlanEstimate, pctByStoryCount };
  }).filter(rollup => matchesPortfolioSearch([rollup.epic.id, rollup.epic.name, rollup.epic.status, rollup.epic.project, rollup.epic.owner.name, ...rollup.childFeatures.map(feature => feature.name)]));
  const activeRollup = activeFeatureId ? featureRollups.find(r => r.feat.id === activeFeatureId) : undefined;
  const activeEpicRollup = activeEpicId ? epicRollups.find(r => r.epic.id === activeEpicId) : undefined;
  const releaseOptions = getProjectReleaseOptions(releases, project.key);
  const sortedRollups = [...featureRollups].sort((a, b) => {
    if (!sort) return (a.feat.rank || 99) - (b.feat.rank || 99);
    const result = comparePortfolioSortValues(getPortfolioSortValue(a.feat, a.pctByStoryPlanEstimate, a.pctByStoryCount, sort.column), getPortfolioSortValue(b.feat, b.pctByStoryPlanEstimate, b.pctByStoryCount, sort.column));
    return sort.direction === "asc" ? result : -result;
  });
  const sortedEpicRollups = [...epicRollups].sort((a, b) => {
    if (!sort) return (a.epic.rank || 99) - (b.epic.rank || 99);
    const pseudoA: Feature = { ...(a.epic as unknown as Feature), team: "" };
    const pseudoB: Feature = { ...(b.epic as unknown as Feature), team: "" };
    const result = comparePortfolioSortValues(getPortfolioSortValue(pseudoA, a.pctByStoryPlanEstimate, a.pctByStoryCount, sort.column), getPortfolioSortValue(pseudoB, b.pctByStoryPlanEstimate, b.pctByStoryCount, sort.column));
    return sort.direction === "asc" ? result : -result;
  });
  const shouldShowEpicRows = team === "All Teams" && portfolioTypeFilter === "Epic";
  const shouldShowFeatureRows = portfolioTypeFilter === "Feature";
  const teamEpicFilterBlocked = team !== "All Teams" && portfolioTypeFilter === "Epic";
  const visibleRowCount = teamEpicFilterBlocked ? 0 : (shouldShowEpicRows ? sortedEpicRollups.length : 0) + (shouldShowFeatureRows ? sortedRollups.length : 0);
  const visibleSelectableIds = [
    ...(shouldShowEpicRows ? sortedEpicRollups.map(rollup => rollup.epic.id) : []),
    ...(shouldShowFeatureRows ? sortedRollups.map(rollup => rollup.feat.id) : []),
  ];
  const allVisibleSelected = visibleSelectableIds.length > 0 && visibleSelectableIds.every(id => selectedPortfolioIds.has(id));

  function toggleSort(column: PortfolioColumnKey) {
    setSort(previous => {
      if (previous?.column === column) return { column, direction: previous.direction === "asc" ? "desc" : "asc" };
      const defaultDirection = column === "percentDoneByStoryPlanEstimate" || column === "percentDoneByStoryCount" || column === "id" ? "desc" : "asc";
      return { column, direction: defaultDirection };
    });
  }
  function startColumnResize(column: PortfolioColumnKey, event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = columnWidths[column];
    const minimums: Record<PortfolioColumnKey, number> = { rank: 48, type: 60, id: 64, name: 160, release: 90, state: 110, percentDoneByStoryPlanEstimate: 150, percentDoneByStoryCount: 140, project: 56, team: 90, owner: 96 };
    function handleMouseMove(moveEvent: MouseEvent) {
      const nextWidth = Math.max(minimums[column], startWidth + moveEvent.clientX - startX);
      setColumnWidths(previous => ({ ...previous, [column]: nextWidth }));
    }
    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
  function moveFeature(id: string, direction: -1 | 1) {
    const ordered = features.filter(feature => feature.project === project.key && !feature.archivedAt).sort((a, b) => (a.rank || 99) - (b.rank || 99));
    const index = ordered.findIndex(f => f.id === id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return;
    [ordered[index], ordered[targetIndex]] = [ordered[targetIndex], ordered[index]];
    ordered.forEach((f, idx) => onUpdateFeature(f.id, { rank: idx + 1 }));
  }
  function changeFeatureProject(id: string, projectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(p => p.key === projectKey) || SCOPE_PROJECTS[0];
    const currentFeature = features.find(feature => feature.id === id);
    const releasePatch = getReleasePatch(releases, nextProject.key, currentFeature?.release || "Unscheduled");
    onUpdateFeature(id, { project: nextProject.key, team: nextProject.teams[0], ...releasePatch });
  }
  function archiveFeature(id: string) {
    onUpdateFeature(id, { archivedAt: "Just now" });
    setActiveFeatureId(null);
  }
  function archiveEpic(id: string) {
    onUpdateEpic(id, { archivedAt: "Just now" });
    setActiveEpicId(null);
  }
  function togglePortfolioColumn(column: PortfolioColumnKey) {
    setVisibleColumns(previous => {
      const visibleCount = Object.values(previous).filter(Boolean).length;
      if (previous[column] && visibleCount <= 1) return previous;
      return { ...previous, [column]: !previous[column] };
    });
  }
  function togglePortfolioSelection(id: string) {
    setBulkMessage(null);
    setSelectedPortfolioIds(previous => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function selectAllVisiblePortfolioRows() {
    setBulkMessage(null);
    setSelectedPortfolioIds(previous => {
      if (allVisibleSelected) return new Set([...previous].filter(id => !visibleSelectableIds.includes(id)));
      return new Set([...previous, ...visibleSelectableIds]);
    });
  }
  function editSelectedPortfolioItem() {
    const [id] = [...selectedPortfolioIds];
    if (!id || selectedPortfolioIds.size !== 1) return;
    if (id.startsWith("EP-")) setActiveEpicId(id);
    if (id.startsWith("FE-")) setActiveFeatureId(id);
  }
  function deleteSelectedPortfolioItems() {
    let blockedEpics = 0;
    selectedPortfolioIds.forEach(id => {
      if (id.startsWith("EP-")) {
        const hasActiveChild = features.some(feature => feature.epicId === id && !feature.archivedAt);
        if (hasActiveChild) blockedEpics += 1;
        else onUpdateEpic(id, { archivedAt: "Just now" });
      }
      if (id.startsWith("FE-")) onUpdateFeature(id, { archivedAt: "Just now" });
    });
    setSelectedPortfolioIds(new Set());
    setBulkMessage(blockedEpics > 0 ? `${blockedEpics} Epic has active Feature children and was not deleted.` : null);
  }

  if (activeEpicRollup) {
    return (
      <EpicDetailView
        epic={activeEpicRollup.epic}
        childFeatures={activeEpicRollup.childFeatures}
        leafItems={activeEpicRollup.children}
        role={role}
        readOnly={!canManageFeatureInProject(role, activeEpicRollup.epic.project) || Boolean(activeEpicRollup.epic.archivedAt)}
        releases={releases}
        milestones={milestones}
        features={features}
        tasks={tasks}
        onBack={() => setActiveEpicId(null)}
        onUpdateEpic={patch => onUpdateEpic(activeEpicRollup.epic.id, patch)}
        onArchiveEpic={() => archiveEpic(activeEpicRollup.epic.id)}
        onUpdateFeature={onUpdateFeature}
        onCreateFeature={onCreateFeature}
        onOpenFeature={id => { setActiveEpicId(null); setActiveFeatureId(id); }}
      />
    );
  }

  if (activeRollup) {
    return (
      <FeatureDetailView
        feature={activeRollup.feat}
        childItems={activeRollup.children}
        totalEstimate={activeRollup.totalEstimate}
        doneEstimate={activeRollup.doneEstimate}
        role={role}
        readOnly={!canManageFeatureInProject(role, activeRollup.feat.project) || Boolean(activeRollup.feat.archivedAt)}
        releases={releases}
        milestones={milestones}
        epics={epics}
        features={features}
        tasks={tasks}
        onBack={() => setActiveFeatureId(null)}
        onUpdateFeature={patch => onUpdateFeature(activeRollup.feat.id, patch)}
        onArchiveFeature={() => archiveFeature(activeRollup.feat.id)}
        onUpdateItem={onUpdateItem}
        onCreateItem={onCreateItem}
        onOpenFull={onOpenFull}
      />
    );
  }

  return (
      <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-1.5 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
          <input
            aria-label="Search portfolio items"
            value={portfolioSearch}
            onChange={event => setPortfolioSearch(event.target.value)}
            placeholder="Search portfolio items"
            className="h-7 w-60 rounded pl-8 pr-3 text-[12px] focus:outline-none"
            style={{ border: "1px solid #cbd5e1", color: "#1a2234" }}
          />
        </div>
        {editable && (
          <div className="relative">
            <button onClick={() => setShowCreateMenu(previous => !previous)} className="flex h-7 items-center gap-1.5 px-3 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}><Plus size={12} /> New Portfolio Item <ChevronDown size={12} /></button>
            {showCreateMenu && (
              <div className="absolute left-0 top-full mt-1 w-40 rounded bg-white py-1 shadow-xl z-30" style={{ border: "1px solid #cbd5e1" }}>
                <button onClick={() => { setShowCreateMenu(false); setShowModal("Epic"); }} className="w-full flex items-center gap-2 px-3 py-2 text-left text-[12px] hover:bg-[#f8fafc]" style={{ color: "#334155" }}><Layers size={13} />New Epic</button>
                <button onClick={() => { setShowCreateMenu(false); setShowModal("Feature"); }} className="w-full flex items-center gap-2 px-3 py-2 text-left text-[12px] hover:bg-[#f8fafc]" style={{ color: "#334155" }}><Package size={13} />New Feature</button>
              </div>
            )}
          </div>
        )}
        <button className="flex h-7 items-center gap-1.5 px-2 text-[11px] rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><Filter size={11} /> Filter</button>
        <div className="relative">
          <button onClick={() => setShowFieldsOpen(previous => !previous)} className="flex h-7 items-center gap-1.5 px-2 text-[11px] rounded" style={{ border: "1px solid #bdd0ef", color: "#2558a6", backgroundColor: showFieldsOpen ? "#edf2fb" : "#ffffff" }}><Columns size={11} /> Show Fields</button>
          {showFieldsOpen && (
            <div className="absolute left-0 top-full mt-1 w-72 rounded bg-white py-2 shadow-xl z-40" style={{ border: "1px solid #cbd5e1" }}>
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>Columns</div>
              {PORTFOLIO_COLUMN_DEFS.map(column => (
                <label key={column.key} className="flex items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-[#f8fafc]" style={{ color: "#334155" }}>
                  <input type="checkbox" checked={visibleColumns[column.key]} onChange={() => togglePortfolioColumn(column.key)} className="h-3.5 w-3.5" style={{ accentColor: "#2558a6" }} />
                  <span>{column.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1" />
      </div>
      {selectedPortfolioIds.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 shrink-0" style={{ backgroundColor: "#edf2fb", borderBottom: "1px solid #bdd0ef" }}>
          <span className="text-[11px] font-semibold mr-1" style={{ color: "#2558a6" }}>{selectedPortfolioIds.size} selected</span>
          <button disabled={selectedPortfolioIds.size !== 1} onClick={editSelectedPortfolioItem} className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded disabled:opacity-45" style={{ color: "#2558a6", border: "1px solid #bdd0ef" }}><Edit3 size={11} /> Edit</button>
          <button onClick={deleteSelectedPortfolioItems} className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded" style={{ color: "#b91c1c", border: "1px solid #fecaca", backgroundColor: "#fff" }}><Archive size={11} /> Delete</button>
          {bulkMessage && <span className="text-[11px]" style={{ color: "#b45309" }}>{bulkMessage}</span>}
          <div className="flex-1" />
          <button aria-label="Clear selected portfolio items" onClick={() => { setSelectedPortfolioIds(new Set()); setBulkMessage(null); }} className="p-0.5" style={{ color: "#5c6478" }}><X size={13} /></button>
        </div>
      )}
      <div className="flex-1 overflow-auto bg-white">
        <div style={{ width: portfolioTableWidth, minWidth: "100%" }}>
          <div className="flex items-center h-8 px-3 gap-2 shrink-0 sticky top-0 z-10" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            <div className="w-5 shrink-0" />
            <div className="w-4 shrink-0" onClick={event => event.stopPropagation()}><input aria-label="Select all visible portfolio items" type="checkbox" checked={allVisibleSelected} onChange={selectAllVisiblePortfolioRows} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
            {PORTFOLIO_COLUMN_DEFS.filter(column => visibleColumns[column.key]).map(column => (
              <ResizablePortfolioHeader key={column.key} label={column.label} column={column.key} width={columnWidths[column.key]} onResize={startColumnResize} sort={sort} onSort={toggleSort} align={column.align} />
            ))}
          </div>
          {visibleRowCount === 0 ? <EmptyState message={teamEpicFilterBlocked ? "Filter not show item" : "No Portfolio Items found"} /> : <>
          {shouldShowEpicRows && sortedEpicRollups.map(({ epic, childFeatures, children, totalEstimate, doneEstimate, totalStoryCount, acceptedStoryCount, pctByStoryPlanEstimate, pctByStoryCount }, idx) => {
            const epicExpanded = expandedEpicIds.has(epic.id);
            const rowEditable = editable && !epic.archivedAt && canManageFeatureInProject(role, epic.project);
            const isSelected = selectedPortfolioIds.has(epic.id);
            const childRollups = featureRollups.filter(rollup => rollup.feat.epicId === epic.id);
            return (
              <div key={epic.id}>
                <div className="flex items-center h-9 px-3 gap-2 cursor-pointer hover:bg-[#f7f8fa]" style={{ width: portfolioTableWidth, minWidth: "100%", borderBottom: "1px solid #edf0f4", backgroundColor: isSelected ? "#edf2fb" : "#fbfaff" }} onClick={() => setActiveEpicId(epic.id)}>
                  <button aria-label={`${epicExpanded ? "Collapse" : "Expand"} ${epic.id} children`} onClick={event => { event.stopPropagation(); if (childFeatures.length > 0) toggleEpicExpanded(epic.id); }} className="w-5 shrink-0 flex items-center justify-center" style={{ color: "#6d28d9" }}>
                    {childFeatures.length > 0 ? (epicExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : null}
                  </button>
                  <div className="w-4 shrink-0" onClick={event => event.stopPropagation()}><input aria-label={`Select ${epic.id}`} type="checkbox" checked={isSelected} onChange={() => togglePortfolioSelection(epic.id)} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
                  <div className="shrink-0 flex items-center justify-end gap-1" style={{ width: columnWidths.rank }}><span className="text-[11px] font-mono tabular-nums" style={{ color: "#5c6478" }}>{epic.rank ?? idx + 1}</span></div>
                  <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.type }}><PortfolioItemTypeBadge type="Epic" /></div>
                  <div className="shrink-0 overflow-hidden font-mono text-[11px] font-semibold" style={{ width: columnWidths.id, color: "#6d28d9" }}>{epic.id}</div>
                  <div className="shrink-0 min-w-0 pr-2" style={{ width: columnWidths.name }} onClick={event => event.stopPropagation()}>
                    <input aria-label={`${epic.id} name`} readOnly={!rowEditable} value={epic.name} onChange={e => onUpdateEpic(epic.id, { name: e.target.value })} className="block w-full truncate text-[12px] font-semibold bg-transparent px-1 py-1 focus:outline-none focus:bg-white focus:rounded" style={{ color: "#1a2234", border: rowEditable ? "1px solid transparent" : "0" }} />
                  </div>
                  <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.release, color: "#94a3b8" }}>—</div>
                  <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.state }} onClick={event => event.stopPropagation()}>
                    {rowEditable ? <select aria-label={`${epic.id} state`} value={epic.status} onChange={e => onUpdateEpic(epic.id, { status: e.target.value as PortfolioState })} className="w-full text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234", padding: "3px 4px" }}>{PORTFOLIO_STATES.map(s => <option key={s}>{s}</option>)}</select> : <PortfolioStateBadge state={epic.status} />}
                  </div>
                  <div className="shrink-0 flex items-center" style={{ width: columnWidths.percentDoneByStoryPlanEstimate }}><FeatureListProgressCell pct={pctByStoryPlanEstimate} numerator={doneEstimate} denominator={totalEstimate} /></div>
                  <div className="shrink-0 flex items-center" style={{ width: columnWidths.percentDoneByStoryCount }}><FeatureListProgressCell pct={pctByStoryCount} numerator={acceptedStoryCount} denominator={totalStoryCount} /></div>
                  <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.project }} onClick={event => event.stopPropagation()}>
                    {rowEditable ? <select aria-label={`${epic.id} project`} value={epic.project || project.key} onChange={e => { const nextProject = SCOPE_PROJECTS.find(p => p.key === e.target.value) || project; onUpdateEpic(epic.id, { project: nextProject.key }); }} className="w-full text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{getRoleScopedProjects(role, project).map(p => <option key={p.key}>{p.key}</option>)}</select> : <span style={{ color: "#5c6478" }}>{epic.project}</span>}
                  </div>
                  <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.team, color: "#8c94a6" }}>{childFeatures.length} Feature{childFeatures.length === 1 ? "" : "s"}</div>
                  <div className="shrink-0 flex items-center gap-1.5 overflow-hidden" style={{ width: columnWidths.owner }} onClick={event => event.stopPropagation()}>
                    <Avatar owner={epic.owner} size="xs" />
                    {rowEditable ? <select aria-label={`${epic.id} owner`} value={epic.owner.name} onChange={e => { const o = OWNERS.find(c => c.name === e.target.value); if (o) onUpdateEpic(epic.id, { owner: o }); }} className="min-w-0 flex-1 text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select> : <span className="text-[11px] truncate" style={{ color: "#5c6478" }}>{epic.owner.name}</span>}
                  </div>
                </div>
                {epicExpanded && childRollups.map(({ feat, totalEstimate, doneEstimate, totalStoryCount, acceptedStoryCount, pctByStoryPlanEstimate, pctByStoryCount }) => {
                  const childRowEditable = editable && !feat.archivedAt && canManageFeatureInProject(role, feat.project);
                  const childProjectTeams = (SCOPE_PROJECTS.find(p => p.key === feat.project) || SCOPE_PROJECTS[0]).teams;
                  const childReleaseOptions = getProjectReleaseOptions(releases, feat.project);
                  return (
                    <div key={`${epic.id}-${feat.id}`} className="flex items-center h-8 px-3 gap-2 cursor-pointer hover:bg-[#f7f8fa]" style={{ width: portfolioTableWidth, minWidth: "100%", backgroundColor: "#fcfdfe", borderBottom: "1px solid #f0f2f5" }} onClick={() => setActiveFeatureId(feat.id)}>
                      <div className="w-5 shrink-0" />
                      <div className="w-4 shrink-0" />
                      <div className="shrink-0" style={{ width: columnWidths.rank }} />
                      <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.type }}><PortfolioItemTypeBadge type="Feature" /></div>
                      <div className="shrink-0 overflow-hidden font-mono text-[11px] font-semibold" style={{ width: columnWidths.id, color: "#2558a6" }}>{feat.id}</div>
                      <div className="shrink-0 min-w-0 pr-2" style={{ width: columnWidths.name }} onClick={event => event.stopPropagation()}>
                        <input aria-label={`${feat.id} name`} readOnly={!childRowEditable} value={feat.name} onChange={e => onUpdateFeature(feat.id, { name: e.target.value })} className="block w-full truncate text-[11px] font-semibold bg-transparent px-1 py-1 focus:outline-none focus:bg-white focus:rounded" style={{ color: "#334155", border: childRowEditable ? "1px solid transparent" : "0" }} />
                      </div>
                      <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.release }} onClick={event => event.stopPropagation()}>
                        {childRowEditable ? <select aria-label={`${feat.id} release`} value={childReleaseOptions.includes(feat.release) ? feat.release : "Unscheduled"} onChange={e => onUpdateFeature(feat.id, getReleasePatch(releases, feat.project, e.target.value))} className="w-full text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{childReleaseOptions.map(r => <option key={r}>{r}</option>)}</select> : <span style={{ color: "#5c6478" }}>{feat.release}</span>}
                      </div>
                      <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.state }} onClick={event => event.stopPropagation()}>
                        {childRowEditable ? <select aria-label={`${feat.id} state`} value={feat.status} onChange={e => onUpdateFeature(feat.id, { status: e.target.value as PortfolioState })} className="w-full text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234", padding: "3px 4px" }}>{PORTFOLIO_STATES.map(s => <option key={s}>{s}</option>)}</select> : <PortfolioStateBadge state={feat.status} />}
                      </div>
                      <div className="shrink-0 flex items-center" style={{ width: columnWidths.percentDoneByStoryPlanEstimate }}><FeatureListProgressCell pct={pctByStoryPlanEstimate} numerator={doneEstimate} denominator={totalEstimate} /></div>
                      <div className="shrink-0 flex items-center" style={{ width: columnWidths.percentDoneByStoryCount }}><FeatureListProgressCell pct={pctByStoryCount} numerator={acceptedStoryCount} denominator={totalStoryCount} /></div>
                      <div className="shrink-0 overflow-hidden text-[11px] truncate" style={{ width: columnWidths.project, color: "#5c6478" }}>{feat.project}</div>
                      <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.team }} onClick={event => event.stopPropagation()}>
                        {childRowEditable ? <select aria-label={`${feat.id} team`} value={feat.team || childProjectTeams[0]} onChange={e => onUpdateFeature(feat.id, { team: e.target.value })} className="w-full text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{childProjectTeams.map(t => <option key={t}>{t}</option>)}</select> : <span style={{ color: "#5c6478" }}>{feat.team}</span>}
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5 overflow-hidden" style={{ width: columnWidths.owner }} onClick={event => event.stopPropagation()}>
                        <Avatar owner={feat.owner} size="xs" />
                        {childRowEditable ? <select aria-label={`${feat.id} owner`} value={feat.owner.name} onChange={e => { const o = OWNERS.find(c => c.name === e.target.value); if (o) onUpdateFeature(feat.id, { owner: o }); }} className="min-w-0 flex-1 text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select> : <span className="text-[11px] truncate" style={{ color: "#5c6478" }}>{feat.owner.name}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {shouldShowFeatureRows && sortedRollups.map(({ feat, children, totalEstimate, doneEstimate, totalStoryCount, acceptedStoryCount, pctByStoryPlanEstimate, pctByStoryCount }, idx) => {
            const projectTeams = (SCOPE_PROJECTS.find(p => p.key === feat.project) || SCOPE_PROJECTS[0]).teams;
            const featExpanded = expandedFeatureIds.has(feat.id);
            const shownChildren = children.slice(0, 5);
            const rowEditable = editable && !feat.archivedAt && canManageFeatureInProject(role, feat.project);
            const isSelected = selectedPortfolioIds.has(feat.id);
            return (
              <div key={feat.id}>
              <div className="flex items-center h-9 px-3 gap-2 cursor-pointer hover:bg-[#f7f8fa]" style={{ width: portfolioTableWidth, minWidth: "100%", borderBottom: "1px solid #edf0f4", backgroundColor: isSelected ? "#edf2fb" : undefined }} onClick={() => setActiveFeatureId(feat.id)}>
                <button aria-label={`${featExpanded ? "Collapse" : "Expand"} ${feat.id} children`} onClick={event => { event.stopPropagation(); if (children.length > 0) toggleFeatureExpanded(feat.id); }} className="w-5 shrink-0 flex items-center justify-center" style={{ color: "#8c94a6" }}>
                  {children.length > 0 ? (featExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : null}
                </button>
                <div className="w-4 shrink-0" onClick={event => event.stopPropagation()}><input aria-label={`Select ${feat.id}`} type="checkbox" checked={isSelected} onChange={() => togglePortfolioSelection(feat.id)} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
                <div className="shrink-0 flex items-center justify-end gap-1" style={{ width: columnWidths.rank }} onClick={event => event.stopPropagation()}>
                  {rowEditable && (
                    <div className="flex flex-col">
                      <button aria-label={`Move ${feat.id} up`} disabled={idx === 0} onClick={() => moveFeature(feat.id, -1)} className="h-3 disabled:opacity-30" style={{ color: "#8c94a6" }}><ChevronUp size={10} /></button>
                      <button aria-label={`Move ${feat.id} down`} disabled={idx === sortedRollups.length - 1} onClick={() => moveFeature(feat.id, 1)} className="h-3 disabled:opacity-30" style={{ color: "#8c94a6" }}><ChevronDown size={10} /></button>
                    </div>
                  )}
                  <span className="text-[11px] font-mono tabular-nums" style={{ color: "#5c6478" }}>{feat.rank ?? idx + 1}</span>
                </div>
                <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.type }}><TypeBadge type="Feature" /></div>
                <div className="shrink-0 overflow-hidden font-mono text-[11px] font-semibold" style={{ width: columnWidths.id, color: "#2558a6" }}>{feat.id}</div>
                <div className="shrink-0 min-w-0 pr-2" style={{ width: columnWidths.name }} onClick={event => event.stopPropagation()}>
                  <input aria-label={`${feat.id} name`} readOnly={!rowEditable} value={feat.name} onChange={e => onUpdateFeature(feat.id, { name: e.target.value })} className="block w-full truncate text-[12px] font-semibold bg-transparent px-1 py-1 focus:outline-none focus:bg-white focus:rounded" style={{ color: "#1a2234", border: rowEditable ? "1px solid transparent" : "0" }} />
                </div>
                <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.release }} onClick={event => event.stopPropagation()}>
                  {rowEditable ? <select aria-label={`${feat.id} release`} value={releaseOptions.includes(feat.release) ? feat.release : "Unscheduled"} onChange={e => onUpdateFeature(feat.id, getReleasePatch(releases, project.key, e.target.value))} className="w-full text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{releaseOptions.map(r => <option key={r}>{r}</option>)}</select> : <span style={{ color: "#5c6478" }}>{feat.release}</span>}
                </div>
                <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.state }} onClick={event => event.stopPropagation()}>
                  {rowEditable ? <select aria-label={`${feat.id} state`} value={feat.status} onChange={e => onUpdateFeature(feat.id, { status: e.target.value as PortfolioState })} className="w-full text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234", padding: "3px 4px" }}>{PORTFOLIO_STATES.map(s => <option key={s}>{s}</option>)}</select> : <PortfolioStateBadge state={feat.status} />}
                </div>
                <div className="shrink-0 flex items-center" style={{ width: columnWidths.percentDoneByStoryPlanEstimate }}>
                  <FeatureListProgressCell pct={pctByStoryPlanEstimate} numerator={doneEstimate} denominator={totalEstimate} />
                </div>
                <div className="shrink-0 flex items-center" style={{ width: columnWidths.percentDoneByStoryCount }}>
                  <FeatureListProgressCell pct={pctByStoryCount} numerator={acceptedStoryCount} denominator={totalStoryCount} />
                </div>
                <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.project }} onClick={event => event.stopPropagation()}>
                  {rowEditable ? <select aria-label={`${feat.id} project`} value={feat.project || project.key} onChange={e => changeFeatureProject(feat.id, e.target.value)} className="w-full text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{getRoleScopedProjects(role, project).map(p => <option key={p.key} value={p.key}>{p.key}</option>)}</select> : <span style={{ color: "#5c6478" }}>{feat.project}</span>}
                </div>
                <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.team }} onClick={event => event.stopPropagation()}>
                  {rowEditable ? <select aria-label={`${feat.id} team`} value={feat.team || projectTeams[0]} onChange={e => onUpdateFeature(feat.id, { team: e.target.value })} className="w-full text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{projectTeams.map(t => <option key={t}>{t}</option>)}</select> : <span style={{ color: "#5c6478" }}>{feat.team}</span>}
                </div>
                <div className="shrink-0 flex items-center gap-1.5 overflow-hidden" style={{ width: columnWidths.owner }} onClick={event => event.stopPropagation()}>
                  <Avatar owner={feat.owner} size="xs" />
                  {rowEditable ? <select aria-label={`${feat.id} owner`} value={feat.owner.name} onChange={e => { const o = OWNERS.find(c => c.name === e.target.value); if (o) onUpdateFeature(feat.id, { owner: o }); }} className="min-w-0 flex-1 text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select> : <span className="text-[11px] truncate" style={{ color: "#5c6478" }}>{feat.owner.name}</span>}
                </div>
              </div>
              {featExpanded && shownChildren.map(item => {
                return (
                  <div key={item.id} className="flex items-center h-8 px-3 gap-2" style={{ width: portfolioTableWidth, minWidth: "100%", backgroundColor: "#fcfdfe", borderBottom: "1px solid #f0f2f5" }}>
                    <div className="w-5 shrink-0" />
                    <div className="w-4 shrink-0" />
                    <div className="shrink-0" style={{ width: columnWidths.rank }} />
                    <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.type }}><TypeBadge type={item.type} /></div>
                    <div className="shrink-0 overflow-hidden font-mono text-[11px]" style={{ width: columnWidths.id, color: item.type === "Defect" ? "#b45309" : "#2558a6" }}>{item.id}</div>
                    <div className="shrink-0 min-w-0 pr-2 truncate text-[11px]" style={{ width: columnWidths.name, color: "#334155" }}>{item.title}</div>
                    <div className="shrink-0 overflow-hidden text-[11px] truncate" style={{ width: columnWidths.release, color: "#5c6478" }}>{item.release}</div>
                    <div className="shrink-0" style={{ width: columnWidths.state }} />
                    <div className="shrink-0" style={{ width: columnWidths.percentDoneByStoryPlanEstimate }} />
                    <div className="shrink-0" style={{ width: columnWidths.percentDoneByStoryCount }} />
                    <div className="shrink-0 overflow-hidden text-[11px] truncate" style={{ width: columnWidths.project, color: "#5c6478" }}>{item.project}</div>
                    <div className="shrink-0 overflow-hidden text-[11px] truncate" style={{ width: columnWidths.team, color: "#5c6478" }}>{item.team}</div>
                    <div className="shrink-0 flex items-center gap-1.5 overflow-hidden" style={{ width: columnWidths.owner }}>
                      <Avatar owner={item.owner} size="xs" /><span className="text-[11px] truncate" style={{ color: "#5c6478" }}>{item.owner.name}</span>
                    </div>
                  </div>
                );
              })}
              {featExpanded && children.length > shownChildren.length && (
                <div className="flex items-center h-7 px-3" style={{ backgroundColor: "#fcfdfe", borderBottom: "1px solid #f0f2f5", paddingLeft: 20 + columnWidths.rank + 24 }}>
                  <button className="text-[11px]" style={{ color: "#2558a6" }}>+ {children.length - shownChildren.length} more - see Children tab</button>
                </div>
              )}
              </div>
            );
          })}</>}
        </div>
      </div>
      {showModal === "Epic" && <NewEpicModal role={role} currentProject={project} onClose={() => setShowModal(null)} onCreate={onCreateEpic} onCreateWithDetails={input => setActiveEpicId(onCreateEpic(input).id)} />}
      {showModal === "Feature" && <NewFeatureModal role={role} currentProject={project} currentTeam={team} releases={releases} epics={epics} onClose={() => setShowModal(null)} onCreate={onCreateFeature} onCreateWithDetails={input => setActiveFeatureId(onCreateFeature(input).id)} />}
    </div>
  );
}

