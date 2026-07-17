import { useState } from "react";
import {
  Search, ChevronDown, ChevronRight, LayoutList, LayoutGrid,
  Plus, Filter, Bell, HelpCircle, Settings, RefreshCw, Download,
  MoreHorizontal, X, Layers, Paperclip, Link2, Edit3,
  Home, Shield, Users, LogOut, AlertTriangle, MessageSquare,
  CheckCircle, Flag, Lock, Check, Archive, Eye, BarChart2,
  Bookmark, Save, RotateCcw, SlidersHorizontal, Activity,
  TrendingUp, TrendingDown, Package, Clock, Star, UserCheck,
  FileText, Hash, ChevronUp, Share2, ChevronLeft,
  GripVertical, Copy, Scissors, UserPlus, GitMerge,
  ExternalLink, AlignJustify, Minus, Zap,
  Tag, Calendar, RotateCw, ListChecks, Globe, Send, ArrowUpRight,
  ArrowDown, ArrowUp, ArrowUpDown,
  CheckSquare, Square, Columns,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { type Role, type Page, type WorkItemType, type StatusType, type PriorityType, type Owner, type WorkItem, type Notification, type Feature, type Project, type ScopeProject, type Initiative, type ReleaseItem, type WorkspaceUser, type WorkflowStatusItem, type LabelItem, type IterationItem, can, OWNERS, PROJECTS, SCOPE_PROJECTS, WORK_ITEMS, FEATURES, NOTIFICATIONS, VELOCITY_DATA, BURNDOWN_DATA, STATUS_PIE, INITIATIVES, RELEASES_DATA, WORKSPACE_USERS, WORKFLOW_STATUSES, LABELS_DATA, WORKLOAD_DATA, PLANNED_VS_COMPLETED, PERMISSIONS_MATRIX, DEFECT_ENVIRONMENTS, RELATED_STORIES, ITERATIONS_DATA } from "../model";
import { releaseStatusCfg, cx, Avatar, TYPE_CFG, TypeBadge, STATUS_CFG, StatusBadge, PRI_CFG, PriorityBadge, MiniProgress, RoleBadge, DetailPanel, NewItemModal, EmptyState, SectionCard } from "../components/shared";

type IterationColumnKey = "rank" | "id" | "name" | "status" | "iteration" | "blocked" | "planEstimate" | "taskEstimate" | "todoEstimate" | "owner";
type IterationFilterColumn = "id" | "name" | "type" | "status" | "iteration" | "blocked" | "planEstimate" | "taskEstimate" | "todoEstimate" | "owner";
type IterationFilters = Partial<Record<IterationFilterColumn, string>>;
type IterationSort = { column: IterationColumnKey; direction: "asc" | "desc" };

export const TRACK_ACTION_GROUPS = [
  ["Edit", "Delete", "Copy", "Split", "Add Peer", "Add Child", "Link Existing", "Copy Tasks From"],
  ["Rank Lowest", "Rank Highest", "Move to Position"],
];

const ITERATION_STATUS_OPTIONS: StatusType[] = ["Idea", "Defined", "In-Progress", "Completed", "Accepted", "Release"];
const ITERATION_STATUS_ORDER: Partial<Record<StatusType, number>> = { Idea: 1, Defined: 2, "In-Progress": 3, "Code Review": 3, Testing: 3, Completed: 4, Accepted: 5, Release: 6 };
const ITERATION_FILTER_COLUMNS: Array<{ key: IterationFilterColumn; label: string; mode: "search" | "select" }> = [
  { key: "id", label: "ID", mode: "search" },
  { key: "name", label: "Name", mode: "search" },
  { key: "type", label: "Type", mode: "select" },
  { key: "status", label: "Schedule State", mode: "select" },
  { key: "iteration", label: "Iteration", mode: "select" },
  { key: "blocked", label: "Blocked", mode: "select" },
  { key: "planEstimate", label: "Plan Est", mode: "search" },
  { key: "taskEstimate", label: "Task Est", mode: "search" },
  { key: "todoEstimate", label: "To Do", mode: "search" },
  { key: "owner", label: "Owner", mode: "select" },
];

function formatIterationRange(iteration: IterationItem) {
  return `${iteration.startDate.slice(0, 10)} - ${iteration.endDate.slice(0, 10)}`;
}

function toIterationScheduleState(status: StatusType): StatusType {
  return ITERATION_STATUS_OPTIONS.includes(status) ? status : "In-Progress";
}

function getIterationSortTooltip(column: IterationColumnKey, direction: "asc" | "desc") {
  if (["planEstimate", "taskEstimate", "todoEstimate"].includes(column)) return direction === "desc" ? "Largest to smallest" : "Smallest to largest";
  if (column === "id") return direction === "desc" ? "Newest to oldest" : "Oldest to newest";
  if (column === "rank") return direction === "asc" ? "Rank low to high" : "Rank high to low";
  return direction === "asc" ? "A to Z" : "Z to A";
}

function getIterationSortValue(item: WorkItem, column: IterationColumnKey): string | number {
  switch (column) {
    case "rank": return item.rank || 999;
    case "id": return Number(item.id.replace(/\D/g, "")) || 0;
    case "name": return item.title.toLowerCase();
    case "status": return ITERATION_STATUS_ORDER[toIterationScheduleState(item.status)] ?? 0;
    case "iteration": return item.iteration.toLowerCase();
    case "blocked": return item.blocked ? 1 : 0;
    case "planEstimate": return item.planEstimate;
    case "taskEstimate": return item.taskEstimate ?? 0;
    case "todoEstimate": return item.todoEstimate ?? 0;
    case "owner": return item.owner.name.toLowerCase();
  }
}

function compareIterationSortValues(a: string | number, b: string | number) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

function ResizableIterationHeader({ label, width, column, onResize, sort, onSort, align = "left" }: { label: string; width: number; column: IterationColumnKey; onResize: (column: IterationColumnKey, event: React.MouseEvent<HTMLDivElement>) => void; sort: IterationSort | null; onSort: (column: IterationColumnKey) => void; align?: "left" | "center" | "right" }) {
  const isSorted = sort?.column === column;
  const tooltip = isSorted ? getIterationSortTooltip(column, sort.direction) : "Sort";
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

export function SelectedItemToolbar({ count, onClear }: { count: number; onClear: () => void }) {
  return (
    <div className="flex items-center h-8 px-3 gap-1 shrink-0" style={{ backgroundColor: "#edf2fb", borderBottom: "1px solid #bdd0ef" }}>
      <span className="text-[11px] font-semibold mr-2" style={{ color: "#2558a6" }}>{count} selected</span>
      {TRACK_ACTION_GROUPS[0].map(a => (
        <button key={a} className="px-2 py-0.5 text-[11px] rounded" style={{ color: "#2558a6" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#dde8f5")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>{a}</button>
      ))}
      <div className="w-px h-4 mx-1" style={{ backgroundColor: "#bdd0ef" }} />
      {TRACK_ACTION_GROUPS[1].map(a => (
        <button key={a} className="px-2 py-0.5 text-[11px] rounded" style={{ color: "#2558a6" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#dde8f5")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>{a}</button>
      ))}
      <div className="flex-1" />
      <button onClick={onClear} className="p-0.5 rounded" style={{ color: "#5c6478" }}><X size={13} /></button>
    </div>
  );
}

function IterationAddItemModal({ iteration, onClose, onCreateWithDetails }: { iteration: IterationItem; onClose: () => void; onCreateWithDetails?: (item: WorkItem) => void }) {
  const [type, setType] = useState<WorkItemType>("Story");
  const [title, setTitle] = useState("");
  const [projectKey, setProjectKey] = useState(iteration.projectKey);
  const [team, setTeam] = useState(iteration.team);
  const [ownerName, setOwnerName] = useState(OWNERS[0].name);
  const [planEstimate, setPlanEstimate] = useState(0);
  const selectedProject = SCOPE_PROJECTS.find(project => project.key === projectKey) || SCOPE_PROJECTS[0];

  function selectProject(nextProjectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(project => project.key === nextProjectKey) || SCOPE_PROJECTS[0];
    setProjectKey(nextProject.key);
    setTeam(nextProject.teams[0]);
  }

  function buildDraftItem(): WorkItem {
    const owner = OWNERS.find(candidate => candidate.name === ownerName) || OWNERS[0];
    const typedPrefix = type === "Defect" ? "DE" : "US";
    return {
      id: `${typedPrefix}-NEW`,
      type,
      rank: 1,
      title: title.trim() || `New ${type}`,
      status: "Defined",
      priority: type === "Defect" ? "High" : "Medium",
      owner,
      planEstimate,
      taskCount: 0,
      completedTasks: 0,
      taskEstimate: 0,
      todoEstimate: 0,
      iteration: iteration.name,
      release: "Q4 2024",
      tags: [],
      description: title.trim() || `New ${type} created from ${iteration.name}.`,
      lastUpdated: "Just now",
      project: projectKey,
    };
  }

  function openDetails() {
    if (!onCreateWithDetails) {
      onClose();
      return;
    }
    const draft = buildDraftItem();
    onClose();
    onCreateWithDetails(draft);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <div className="relative bg-white rounded shadow-2xl flex flex-col overflow-hidden" style={{ width: 640, maxHeight: "86vh", border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Add Item to Iteration</p>
            <p className="text-[11px]" style={{ color: "#8c94a6" }}>{iteration.name} · {formatIterationRange(iteration)}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={event => { event.currentTarget.style.backgroundColor = "#edf0f4"; event.currentTarget.style.color = "#1a2234"; }} onMouseLeave={event => { event.currentTarget.style.backgroundColor = "transparent"; event.currentTarget.style.color = "#8c94a6"; }}><X size={15} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#5c6478" }}>Type</label>
            <div className="flex gap-2">
              {(["Story", "Defect"] as WorkItemType[]).map(option => {
                const cfg = TYPE_CFG[option];
                return <button key={option} onClick={() => setType(option)} className="flex-1 py-1.5 text-[11px] font-semibold rounded-sm" style={{ backgroundColor: type === option ? cfg.bg : "transparent", color: type === option ? cfg.text : "#5c6478", border: `1px solid ${type === option ? cfg.border : "#dde2ea"}` }}>{option}</button>;
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Project</label><select value={projectKey} onChange={event => selectProject(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{SCOPE_PROJECTS.map(project => <option key={project.key} value={project.key}>{project.key} · {project.name}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Team</label><select value={team} onChange={event => setTeam(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{selectedProject.teams.map(projectTeam => <option key={projectTeam}>{projectTeam}</option>)}</select></div>
          </div>
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Iteration</label><input readOnly value={`${iteration.name} · ${formatIterationRange(iteration)}`} className="w-full text-[12px] px-2.5 py-1.5 rounded bg-[#f7f8fa]" style={{ border: "1px solid #dde2ea", color: "#5c6478" }} /></div>
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Title <span style={{ color: "#dc2626" }}>*</span></label><input autoFocus value={title} onChange={event => setTitle(event.target.value)} placeholder="Enter a concise, descriptive title..." className="w-full text-[13px] px-3 py-2 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Owner</label><select value={ownerName} onChange={event => setOwnerName(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Plan Estimate</label><input type="number" min={0} value={planEstimate} onChange={event => setPlanEstimate(Number(event.target.value))} placeholder="0" className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} /></div>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
          <span className="text-[10px]" style={{ color: "#8c94a6" }}>New item will be created directly in this iteration.</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3.5 py-1.5 text-[12px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}>Cancel</button>
            <button onClick={openDetails} className="px-4 py-1.5 text-[12px] font-semibold rounded" style={{ border: "1px solid #9fb5d5", color: "#1d3f73", backgroundColor: "#f5f8fc" }}>Create with details</button>
            <button onClick={onClose} className="px-4 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}>Create Item</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrackPage({ title = "Iteration Status", initialView = "list", role, readOnly = false, activeItem, onItemClick, onOpenFull }: { title?: string; initialView?: "list" | "board"; role: Role; readOnly?: boolean; activeItem: WorkItem | null; onItemClick: (i: WorkItem) => void; onOpenFull?: (item: WorkItem) => void }) {
  const [iterationItems, setIterationItems] = useState<WorkItem[]>(WORK_ITEMS);
  const [view, setView] = useState<"list" | "board">(initialView);
  const [search, setSearch] = useState("");
  const [selectedIterationId, setSelectedIterationId] = useState("IT-24-3");
  const [iterationOpen, setIterationOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IterationFilters>({});
  const [showManageFilters, setShowManageFilters] = useState(false);
  const [filterColumnSearch, setFilterColumnSearch] = useState("");
  const [pendingFilterColumns, setPendingFilterColumns] = useState<Set<IterationFilterColumn>>(new Set());
  const [sort, setSort] = useState<IterationSort | null>(null);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnWidths, setColumnWidths] = useState<Record<IterationColumnKey, number>>({ rank: 32, id: 72, name: 380, status: 126, iteration: 128, blocked: 72, planEstimate: 72, taskEstimate: 72, todoEstimate: 62, owner: 170 });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);

  const iterations = [...ITERATIONS_DATA].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const selectedIteration = iterations.find(iteration => iteration.id === selectedIterationId) ?? iterations[0];
  const selectedIterationIndex = iterations.findIndex(iteration => iteration.id === selectedIteration.id);
  const iterationOptions = Array.from(new Set([...iterations.map(iteration => iteration.name), "Unscheduled", ...iterationItems.map(item => item.iteration)])).sort();

  function moveIteration(direction: -1 | 1) {
    const next = Math.max(0, Math.min(iterations.length - 1, selectedIterationIndex + direction));
    setSelectedIterationId(iterations[next].id);
    setIterationOpen(false);
    setSelectedIds(new Set());
  }

  const editable = !readOnly && can.manageBacklog(role);
  const boardEditable = editable && can.dragBoard(role);
  const activeFilterColumns = ITERATION_FILTER_COLUMNS.filter(column => filters[column.key] !== undefined);
  const activeFilterCount = activeFilterColumns.length;
  const availableFilterColumns = ITERATION_FILTER_COLUMNS.filter(column => column.label.toLowerCase().includes(filterColumnSearch.toLowerCase()));

  const sprintItems = iterationItems.filter(i =>
    i.iteration === selectedIteration.name &&
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())) &&
    activeFilterColumns.every(filter => {
      const value = (filters[filter.key] || "").trim();
      if (!value || value === "All") return true;
      const searchValue = value.toLowerCase();
      switch (filter.key) {
        case "id": return i.id.toLowerCase().includes(searchValue);
        case "name": return i.title.toLowerCase().includes(searchValue);
        case "type": return i.type === value;
        case "status": return toIterationScheduleState(i.status) === value;
        case "iteration": return i.iteration === value;
        case "blocked": return value === "Blocked" ? Boolean(i.blocked) : !i.blocked;
        case "planEstimate": return String(i.planEstimate).includes(searchValue);
        case "taskEstimate": return String(i.taskEstimate ?? 0).includes(searchValue);
        case "todoEstimate": return String(i.todoEstimate ?? 0).includes(searchValue);
        case "owner": return i.owner.name === value;
      }
    })
  ).sort((a, b) => {
    if (!sort) return (a.rank || 99) - (b.rank || 99);
    const result = compareIterationSortValues(getIterationSortValue(a, sort.column), getIterationSortValue(b, sort.column));
    return sort.direction === "asc" ? result : -result;
  });
  const totalPages = Math.max(1, Math.ceil(sprintItems.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * pageSize;
  const paginatedItems = sprintItems.slice(pageStart, pageStart + pageSize);
  const allChecked = paginatedItems.length > 0 && paginatedItems.every(i => selectedIds.has(i.id));

  function toggleSelect(id: string) { setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function selectAll() {
    setSelectedIds(previous => {
      const next = new Set(previous);
      paginatedItems.forEach(item => allChecked ? next.delete(item.id) : next.add(item.id));
      return next;
    });
  }
  function updateItem(id: string, patch: Partial<WorkItem>) {
    setIterationItems(previous => previous.map(item => item.id === id ? { ...item, ...patch } : item));
  }
  function updateItemOwner(id: string, ownerName: string) {
    const owner = OWNERS.find(candidate => candidate.name === ownerName);
    if (owner) updateItem(id, { owner });
  }
  function getFilterSelectOptions(column: IterationFilterColumn) {
    switch (column) {
      case "type": return ["All", "Story", "Defect", "Feature", "Task"];
      case "status": return ["All", ...ITERATION_STATUS_OPTIONS];
      case "iteration": return ["All", ...iterationOptions];
      case "blocked": return ["All", "Blocked", "Not Blocked"];
      case "owner": return ["All", ...OWNERS.map(owner => owner.name)];
      default: return [];
    }
  }
  function openManageFilters() {
    setShowFilters(true);
    setPendingFilterColumns(new Set(activeFilterColumns.map(column => column.key)));
    setShowManageFilters(true);
  }
  function togglePendingFilterColumn(column: IterationFilterColumn) {
    setPendingFilterColumns(previous => {
      const next = new Set(previous);
      next.has(column) ? next.delete(column) : next.add(column);
      return next;
    });
  }
  function applyManagedFilters() {
    setFilters(previous => {
      const next: IterationFilters = {};
      pendingFilterColumns.forEach(column => {
        next[column] = previous[column] ?? "";
      });
      return next;
    });
    setShowManageFilters(false);
    setCurrentPage(1);
  }
  function updateFilterValue(column: IterationFilterColumn, value: string) {
    setFilters(previous => ({ ...previous, [column]: value }));
    setCurrentPage(1);
  }
  function removeFilter(column: IterationFilterColumn) {
    setFilters(previous => {
      const next = { ...previous };
      delete next[column];
      return next;
    });
    setCurrentPage(1);
  }
  function toggleSort(column: IterationColumnKey) {
    setSort(previous => {
      if (previous?.column === column) return { column, direction: previous.direction === "asc" ? "desc" : "asc" };
      const defaultDirection = ["id", "planEstimate", "taskEstimate", "todoEstimate", "blocked"].includes(column) ? "desc" : "asc";
      return { column, direction: defaultDirection };
    });
    setCurrentPage(1);
  }
  function moveItem(id: string, direction: -1 | 1) {
    const ordered = [...iterationItems].filter(item => item.iteration === selectedIteration.name).sort((a, b) => (a.rank || 99) - (b.rank || 99));
    const index = ordered.findIndex(item => item.id === id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return;
    [ordered[index], ordered[targetIndex]] = [ordered[targetIndex], ordered[index]];
    const nextRank = new Map(ordered.map((item, idx) => [item.id, idx + 1]));
    setIterationItems(previous => previous.map(item => nextRank.has(item.id) ? { ...item, rank: nextRank.get(item.id) ?? item.rank } : item));
  }
  function startColumnResize(column: IterationColumnKey, event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = columnWidths[column];
    const minimums: Record<IterationColumnKey, number> = { rank: 32, id: 64, name: 180, status: 96, iteration: 96, blocked: 64, planEstimate: 56, taskEstimate: 56, todoEstimate: 56, owner: 112 };
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
  const iterationTableWidth = 86 + Object.values(columnWidths).reduce((total, width) => total + width, 0);

  const plannedPts = selectedIteration.plannedPoints || sprintItems.reduce((s, i) => s + i.planEstimate, 0);
  const acceptedPts = sprintItems.filter(i => i.status === "Accepted").reduce((s, i) => s + i.planEstimate, 0);
  const velocityPct = plannedPts > 0 ? Math.round((acceptedPts / plannedPts) * 100) : 0;
  const sprintDaysLeft = 6;
  const sprintDaysPct = Math.round(((10 - sprintDaysLeft) / 10) * 100);
  const defectCount = sprintItems.filter(i => i.type === "Defect").length;
  const taskCount = sprintItems.filter(i => i.type === "Task").length;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Sprint selector bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <span className="text-[11px] font-semibold" style={{ color: "#1a2234" }}>Iteration</span>
        <div className="flex items-center rounded bg-white overflow-visible" style={{ border: "1px solid #bdd0ef", height: 28 }}>
          <button disabled={selectedIterationIndex <= 0} onClick={() => moveIteration(-1)} className="h-full px-2 flex items-center" style={{ color: selectedIterationIndex <= 0 ? "#b0b8c8" : "#2558a6", borderRight: "1px solid #dde2ea" }}><ChevronLeft size={14} /></button>
          <div className="relative h-full">
            <button onClick={() => setIterationOpen(open => !open)} className="h-full flex items-center gap-3 px-3 text-left bg-white" style={{ minWidth: 270, color: "#1a2234" }}>
              <span className="text-[12px] font-semibold whitespace-nowrap">{selectedIteration.name}</span>
              <span className="text-[11px] whitespace-nowrap" style={{ color: "#5c6478" }}>{formatIterationRange(selectedIteration)}</span>
              <ChevronDown size={12} className="ml-auto" style={{ color: "#5c6478" }} />
            </button>
            {iterationOpen && (
              <div className="absolute left-0 top-full mt-1 w-full bg-white rounded shadow-lg z-50 py-1" style={{ border: "1px solid #d9dee7" }}>
                {iterations.map(iteration => (
                  <button key={iteration.id} onClick={() => { setSelectedIterationId(iteration.id); setIterationOpen(false); setSelectedIds(new Set()); }} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#f4f6f9]" style={{ backgroundColor: selectedIteration.id === iteration.id ? "#edf2fb" : "transparent" }}>
                    <span className="text-[12px] font-semibold flex-1" style={{ color: selectedIteration.id === iteration.id ? "#1d3f73" : "#1a2234" }}>{iteration.name}</span>
                    <span className="text-[11px]" style={{ color: "#5c6478" }}>{formatIterationRange(iteration)}</span>
                    {selectedIteration.id === iteration.id && <Check size={11} style={{ color: "#1d3f73" }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button disabled={selectedIterationIndex >= iterations.length - 1} onClick={() => moveIteration(1)} className="h-full px-2 flex items-center" style={{ color: selectedIterationIndex >= iterations.length - 1 ? "#b0b8c8" : "#2558a6", borderLeft: "1px solid #dde2ea" }}><ChevronRight size={14} /></button>
        </div>
        <div className="flex-1" />
        <div className="flex rounded overflow-hidden ml-2" style={{ border: "1px solid #dde2ea" }}>
          {(["list", "board"] as const).map((v, i) => (
            <button key={v} onClick={() => setView(v)} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: view === v ? "#1d3f73" : "transparent", color: view === v ? "#fff" : "#5c6478", borderLeft: i > 0 ? "1px solid #dde2ea" : undefined }}>
              {v === "list" ? <LayoutList size={13} /> : <LayoutGrid size={13} />}
              {v === "list" ? "List" : "Board"}
            </button>
          ))}
        </div>
      </div>

      {/* Status summary strip */}
      <div className="flex items-stretch bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb", height: 64 }}>
        {/* Planned Velocity */}
        <div className="flex flex-[1.35] flex-col justify-center px-5 gap-1 min-w-0">
          <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>Planned Velocity</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[20px] font-semibold leading-none" style={{ color: "#1a2234" }}>{velocityPct}%</span>
            <span className="text-[10px]" style={{ color: "#5c6478" }}>{acceptedPts}/{plannedPts} pts</span>
          </div>
          <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e4e8ed" }}>
            <div className="h-full rounded-full" style={{ width: `${velocityPct}%`, backgroundColor: velocityPct >= 70 ? "#2a8c3f" : "#2558a6" }} />
          </div>
        </div>
        {/* Iteration End */}
        <div className="flex flex-[1.35] flex-col justify-center px-5 gap-1 min-w-0" style={{ borderLeft: "1px solid #e2e6eb" }}>
          <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>Iteration End</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[20px] font-semibold leading-none" style={{ color: "#8a5808" }}>{sprintDaysLeft}</span>
            <span className="text-[10px]" style={{ color: "#5c6478" }}>days left</span>
          </div>
          <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e4e8ed" }}>
            <div className="h-full rounded-full" style={{ width: `${sprintDaysPct}%`, backgroundColor: "#e59f0c" }} />
          </div>
        </div>
        {/* Accepted */}
        <div className="flex flex-[1.35] flex-col justify-center px-5 gap-1 min-w-0" style={{ borderLeft: "1px solid #e2e6eb" }}>
          <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>Accepted</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[20px] font-semibold leading-none" style={{ color: "#1e6930" }}>{velocityPct}%</span>
            <span className="text-[10px]" style={{ color: "#5c6478" }}>{acceptedPts} pts</span>
          </div>
          <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e4e8ed" }}>
            <div className="h-full rounded-full" style={{ width: `${velocityPct}%`, backgroundColor: "#2a8c3f" }} />
          </div>
        </div>
        {/* Defects */}
        <div className="flex flex-[0.75] flex-col justify-center px-5 gap-0.5 min-w-0" style={{ borderLeft: "1px solid #e2e6eb" }}>
          <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>Defects</span>
          <span className="text-[20px] font-semibold leading-none" style={{ color: defectCount > 0 ? "#b91c1c" : "#1a2234" }}>{defectCount}</span>
          <span className="text-[10px]" style={{ color: "#5c6478" }}>active</span>
        </div>
        {/* Tasks */}
        <div className="flex flex-[0.75] flex-col justify-center px-5 gap-0.5 min-w-0" style={{ borderLeft: "1px solid #e2e6eb" }}>
          <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>Tasks</span>
          <span className="text-[20px] font-semibold leading-none" style={{ color: "#1a2234" }}>{taskCount}</span>
          <span className="text-[10px]" style={{ color: "#5c6478" }}>active</span>
        </div>
        <div className="flex flex-[0.9] items-center px-5 min-w-0" style={{ borderLeft: "1px solid #e2e6eb" }}>
          <button className="text-[11px] font-medium flex items-center gap-1" style={{ color: "#2558a6" }}>
            View Charts <ChevronRight size={11} />
          </button>
        </div>
      </div>

      {view === "list" ? (
        <>
          {/* Search + filter toolbar */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
              <input type="text" placeholder="Filter items..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-7 pr-3 py-1 text-[12px] rounded focus:outline-none" style={{ backgroundColor: "#f4f6f9", border: "1px solid #dde2ea", color: "#1a2234", width: 160 }} />
            </div>
            <button onClick={() => setShowFilters(previous => !previous)} className="flex items-center gap-1.5 px-2 py-1 text-[11px] rounded" style={{ border: "1px solid #bdd0ef", color: "#2558a6", backgroundColor: showFilters ? "#edf2fb" : "#fff" }}><Filter size={11} /> {showFilters ? "Hide filter" : "Show filter"}{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}</button>
            {editable && <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}><Plus size={12} /> Add Item</button>}
            <div className="flex-1" />
          </div>

          {showFilters && (
            <div className="px-4 py-3 shrink-0" style={{ backgroundColor: "#f5f8fc", borderBottom: "1px solid #cfdced" }}>
              <div className="relative flex items-start gap-2">
                <div className="relative shrink-0">
                  <button onClick={openManageFilters} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded" style={{ color: "#fff", backgroundColor: "#4b74d9", border: "1px solid #3d66c8" }}><Filter size={12} /> Manage filters</button>
                  {showManageFilters && (
                    <div className="absolute left-0 top-[34px] z-30 w-[330px] rounded bg-white shadow-xl" style={{ border: "1px solid #cfd6e3" }}>
                      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #edf0f4" }}>
                        <p className="text-[14px] font-semibold" style={{ color: "#3a4254" }}>Manage Filters</p>
                        <button onClick={() => setShowManageFilters(false)} className="p-1 rounded" style={{ color: "#2558a6" }}><X size={16} /></button>
                      </div>
                      <div className="px-4 pt-3">
                        <div className="relative">
                          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5c6478" }} />
                          <input value={filterColumnSearch} onChange={event => setFilterColumnSearch(event.target.value)} placeholder="Search" className="w-full pl-8 pr-3 py-2 text-[12px] rounded focus:outline-none" style={{ border: "1px solid #6aa0ff", color: "#1a2234" }} />
                        </div>
                      </div>
                      <div className="px-4 py-3 max-h-[250px] overflow-y-auto">
                        <p className="text-[11px] font-semibold uppercase mb-2" style={{ color: "#1a2234" }}>Selected</p>
                        {ITERATION_FILTER_COLUMNS.filter(column => pendingFilterColumns.has(column.key)).length === 0 ? (
                          <p className="text-[11px] mb-3" style={{ color: "#8c94a6" }}>No columns selected</p>
                        ) : ITERATION_FILTER_COLUMNS.filter(column => pendingFilterColumns.has(column.key)).map(column => (
                          <label key={column.key} className="flex items-center gap-2 py-1.5 text-[12px]" style={{ color: "#1a2234" }}>
                            <input type="checkbox" checked onChange={() => togglePendingFilterColumn(column.key)} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#4b74d9" }} />
                            {column.label}
                          </label>
                        ))}
                        <p className="text-[11px] font-semibold uppercase mt-2 mb-2" style={{ color: "#1a2234" }}>Available</p>
                        {availableFilterColumns.filter(column => !pendingFilterColumns.has(column.key)).map(column => (
                          <label key={column.key} className="flex items-center gap-2 py-1.5 text-[12px]" style={{ color: "#3a4254" }}>
                            <input type="checkbox" checked={false} onChange={() => togglePendingFilterColumn(column.key)} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#4b74d9" }} />
                            {column.label}
                          </label>
                        ))}
                      </div>
                      <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: "1px solid #edf0f4" }}>
                        <button onClick={() => setShowManageFilters(false)} className="px-3 py-1.5 text-[12px] rounded" style={{ color: "#2558a6" }}>Cancel</button>
                        <button onClick={applyManagedFilters} className="px-4 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#4b74d9" }}>Apply</button>
                      </div>
                    </div>
                  )}
                </div>
                {activeFilterCount > 0 && <button onClick={() => setFilters({})} className="px-2.5 py-1 text-[11px] rounded" style={{ color: "#2558a6" }}>Clear filters</button>}
              </div>
              {activeFilterCount === 0 ? (
                <div className="mt-2 px-3 py-2 text-[11px] rounded bg-white" style={{ color: "#8c94a6", border: "1px dashed #cfd6e3" }}>No filters selected. Use Manage filters to choose columns.</div>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeFilterColumns.map(columnMeta => {
                    const filterValue = filters[columnMeta.key] ?? "";
                    return (
                      <div key={columnMeta.key} className="flex items-center gap-1.5 px-2 py-1.5 bg-white rounded" style={{ border: "1px solid #dde2ea" }}>
                        <span className="text-[11px] font-semibold" style={{ color: "#3a4254" }}>{columnMeta.label}</span>
                        {columnMeta.mode === "search" ? (
                          <div className="relative">
                            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
                            <input value={filterValue} onChange={event => updateFilterValue(columnMeta.key, event.target.value)} placeholder={`Filter ${columnMeta.label}`} className="pl-6 pr-2 py-1 text-[11px] rounded focus:outline-none" style={{ width: columnMeta.key === "name" ? 220 : 120, border: "1px solid #dde2ea", color: "#1a2234" }} />
                          </div>
                        ) : (
                          <select value={filterValue || "All"} onChange={event => updateFilterValue(columnMeta.key, event.target.value)} className="text-[11px] px-2 py-1 rounded bg-white focus:outline-none" style={{ minWidth: 132, border: "1px solid #dde2ea", color: "#1a2234" }}>
                            {getFilterSelectOptions(columnMeta.key).map(option => <option key={option}>{option}</option>)}
                          </select>
                        )}
                        <button onClick={() => removeFilter(columnMeta.key)} className="p-1 rounded" style={{ color: "#8c94a6" }}><X size={12} /></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Selected item toolbar */}
          {selectedIds.size > 0 && <SelectedItemToolbar count={selectedIds.size} onClear={() => setSelectedIds(new Set())} />}

          {/* Table */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-col flex-1 overflow-hidden bg-white">
              <div className="flex-1 overflow-auto">
                <div style={{ width: iterationTableWidth, minWidth: "100%" }}>
                  <div className="sticky top-0 z-10 flex items-center h-8 px-3 gap-1.5 select-none" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
                    <div className="w-5 shrink-0"><input type="checkbox" checked={allChecked} onChange={selectAll} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
                    <div className="w-4 shrink-0" />
                    <ResizableIterationHeader label="#" column="rank" width={columnWidths.rank} onResize={startColumnResize} sort={sort} onSort={toggleSort} align="center" />
                    <ResizableIterationHeader label="ID" column="id" width={columnWidths.id} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
                    <ResizableIterationHeader label="Name" column="name" width={columnWidths.name} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
                    <ResizableIterationHeader label="Schedule State" column="status" width={columnWidths.status} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
                    <ResizableIterationHeader label="Iteration" column="iteration" width={columnWidths.iteration} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
                    <ResizableIterationHeader label="Blocked" column="blocked" width={columnWidths.blocked} onResize={startColumnResize} sort={sort} onSort={toggleSort} align="center" />
                    <ResizableIterationHeader label="Plan Est" column="planEstimate" width={columnWidths.planEstimate} onResize={startColumnResize} sort={sort} onSort={toggleSort} align="right" />
                    <ResizableIterationHeader label="Task Est" column="taskEstimate" width={columnWidths.taskEstimate} onResize={startColumnResize} sort={sort} onSort={toggleSort} align="right" />
                    <ResizableIterationHeader label="To Do" column="todoEstimate" width={columnWidths.todoEstimate} onResize={startColumnResize} sort={sort} onSort={toggleSort} align="right" />
                    <ResizableIterationHeader label="Owner" column="owner" width={columnWidths.owner} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
                  </div>

                  {sprintItems.length === 0 ? <EmptyState message="No sprint items found" /> : paginatedItems.map((item, idx) => {
                    const isActive = activeItem?.id === item.id;
                    const isSelected = selectedIds.has(item.id);
                    return (
                      <div key={item.id} className="group flex items-center h-8 px-3 gap-1.5 cursor-pointer hover:bg-[#f7f8fa]" style={{ width: iterationTableWidth, minWidth: "100%", backgroundColor: isActive ? "#edf2fb" : isSelected ? "#f3f6fb" : undefined, borderBottom: "1px solid #edf0f4" }} onClick={() => onOpenFull ? onOpenFull(item) : onItemClick(item)}>
                        <div className="w-5 shrink-0" onClick={e => { e.stopPropagation(); toggleSelect(item.id); }}><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(item.id)} onClick={e => e.stopPropagation()} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
                        <div className="w-4 shrink-0 flex flex-col opacity-0 group-hover:opacity-100" onClick={event => event.stopPropagation()}>
                          <button aria-label="Move item up" disabled={!editable || pageStart + idx === 0} onClick={() => moveItem(item.id, -1)} className="h-3 disabled:opacity-30" style={{ color: "#8c94a6" }}><ChevronUp size={10} /></button>
                          <button aria-label="Move item down" disabled={!editable || pageStart + idx >= sprintItems.length - 1} onClick={() => moveItem(item.id, 1)} className="h-3 disabled:opacity-30" style={{ color: "#8c94a6" }}><ChevronDown size={10} /></button>
                        </div>
                        <div className="shrink-0 text-[10px] font-mono text-center tabular-nums" style={{ width: columnWidths.rank, color: "#8c94a6" }}>{item.rank ?? pageStart + idx + 1}</div>
                        <div className="shrink-0 overflow-hidden font-mono text-[10px] underline-offset-2 hover:underline" style={{ width: columnWidths.id, color: "#2558a6" }}>{item.id}</div>
                        <div className="shrink-0 min-w-0 flex items-center gap-1.5 pr-2" style={{ width: columnWidths.name }} onClick={event => event.stopPropagation()}>
                          <TypeBadge type={item.type} />
                          <input aria-label={`${item.id} title`} readOnly={!editable} value={item.title} onChange={event => updateItem(item.id, { title: event.target.value })} className="block w-full truncate text-[12px] font-medium bg-transparent focus:outline-none focus:bg-white focus:px-1 focus:py-0.5 focus:rounded" style={{ color: "#1a2234", border: editable ? "1px solid transparent" : "0" }} />
                        </div>
                        <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.status }} onClick={event => event.stopPropagation()}>
                          {editable ? <select aria-label={`${item.id} schedule state`} value={toIterationScheduleState(item.status)} onChange={event => updateItem(item.id, { status: event.target.value as StatusType })} className="w-[118px] max-w-full text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #bdd0ef", color: "#2558a6" }}>{ITERATION_STATUS_OPTIONS.map(status => <option key={status}>{status}</option>)}</select> : <StatusBadge status={toIterationScheduleState(item.status)} />}
                        </div>
                        <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.iteration }} onClick={event => event.stopPropagation()}>
                          {editable ? <select aria-label={`${item.id} iteration`} value={item.iteration} onChange={event => updateItem(item.id, { iteration: event.target.value })} className="w-[122px] max-w-full text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #bdd0ef", color: "#2558a6" }}>{iterationOptions.map(iteration => <option key={iteration}>{iteration}</option>)}</select> : <span className="block truncate text-[11px]" style={{ color: "#5c6478" }}>{item.iteration}</span>}
                        </div>
                        <div className="shrink-0 flex justify-center" style={{ width: columnWidths.blocked }}>
                          {item.blocked ? <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "#b91c1c" }}><AlertTriangle size={11} />Yes</span> : <span className="text-[10px]" style={{ color: "#c4cad4" }}>—</span>}
                        </div>
                        <div className="shrink-0 text-right" style={{ width: columnWidths.planEstimate }} onClick={event => event.stopPropagation()}><input aria-label={`${item.id} plan estimate`} readOnly={!editable} type="number" min={0} value={item.planEstimate} onChange={event => updateItem(item.id, { planEstimate: Number(event.target.value) })} className="w-12 text-right font-mono text-[11px] font-semibold bg-transparent focus:outline-none focus:bg-white focus:rounded" style={{ color: "#1a2234", border: editable ? "1px solid transparent" : "0" }} /></div>
                        <div className="shrink-0 text-right font-mono text-[11px]" style={{ width: columnWidths.taskEstimate, color: "#5c6478" }}>{item.taskEstimate ?? "—"}</div>
                        <div className="shrink-0 text-right font-mono text-[11px]" style={{ width: columnWidths.todoEstimate, color: (item.todoEstimate ?? 0) > 0 ? "#8a5808" : "#5c6478" }}>{item.todoEstimate ?? "—"}</div>
                        <div className="shrink-0 min-w-0 flex items-center gap-1.5 overflow-hidden pl-1" style={{ width: columnWidths.owner }} onClick={event => event.stopPropagation()}><Avatar owner={item.owner} size="xs" />{editable ? <select aria-label={`${item.id} owner`} value={item.owner.name} onChange={event => updateItemOwner(item.id, event.target.value)} className="min-w-0 flex-1 truncate text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select> : <span className="min-w-0 flex-1 text-[11px] truncate" style={{ color: "#5c6478" }}>{item.owner.name.split(" ")[0]} {item.owner.name.split(" ")[1][0]}.</span>}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="h-10 shrink-0 flex items-center justify-between px-3 bg-white" style={{ borderTop: "1px solid #e2e6eb" }}>
                <div className="flex items-center gap-2 text-[11px]" style={{ color: "#5c6478" }}>
                  <span>Rows per page</span>
                  <select value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setCurrentPage(1); }} className="px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>
                    {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
                  </select>
                  <span style={{ color: "#8c94a6" }}>{sprintItems.length === 0 ? "0 records" : `${pageStart + 1}-${Math.min(pageStart + pageSize, sprintItems.length)} of ${sprintItems.length}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] tabular-nums" style={{ color: "#5c6478" }}>Page {activePage} of {totalPages}</span>
                  <button disabled={activePage === 1} onClick={() => setCurrentPage(activePage - 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronLeft size={13} /></button>
                  <button disabled={activePage === totalPages} onClick={() => setCurrentPage(activePage + 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronRight size={13} /></button>
                </div>
              </div>
            </div>
            {activeItem && <DetailPanel item={activeItem} onClose={() => onItemClick(activeItem)} role={role} onOpenFull={onOpenFull} />}
          </div>
        </>
      ) : (
        <TrackBoardView items={sprintItems} role={role} activeItem={activeItem} onItemClick={onItemClick} onOpenFull={onOpenFull} />
      )}
      {showModal && <IterationAddItemModal iteration={selectedIteration} onClose={() => setShowModal(false)} onCreateWithDetails={onOpenFull} />}
    </div>
  );
}

// ─── Screen 5 — Board View (6 columns) ───────────────────────────────────────

export function TrackBoardView({ items, role, activeItem, onItemClick, onOpenFull }: { items: WorkItem[]; role: Role; activeItem: WorkItem | null; onItemClick: (i: WorkItem) => void; onOpenFull?: (item: WorkItem) => void }) {
  const cols: { status: StatusType; label: string; wip?: number }[] = [
    { status: "Idea", label: "Idea" },
    { status: "Defined", label: "Defined", wip: 5 },
    { status: "In-Progress", label: "In Progress", wip: 4 },
    { status: "Completed", label: "Completed" },
    { status: "Accepted", label: "Accepted" },
    { status: "Release", label: "Release" },
  ];
  const [filterOwner, setFilterOwner] = useState<string>("All");

  const visibleItems = items.filter(i => filterOwner === "All" || i.owner.initials === filterOwner);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Board filter bar */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <span className="text-[10px] font-semibold uppercase tracking-wider mr-1" style={{ color: "#8c94a6" }}>Filter by Owner:</span>
        <button onClick={() => setFilterOwner("All")} className="px-2 py-0.5 text-[10px] font-medium rounded-sm" style={{ backgroundColor: filterOwner === "All" ? "#eef3fb" : "transparent", color: filterOwner === "All" ? "#2558a6" : "#5c6478", border: `1px solid ${filterOwner === "All" ? "#bdd0ef" : "#dde2ea"}` }}>All</button>
        {OWNERS.map(o => (
          <button key={o.initials} onClick={() => setFilterOwner(filterOwner === o.initials ? "All" : o.initials)} className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-sm" style={{ backgroundColor: filterOwner === o.initials ? "#eef3fb" : "transparent", border: `1px solid ${filterOwner === o.initials ? "#bdd0ef" : "#dde2ea"}` }}>
            <Avatar owner={o} size="xs" /><span style={{ color: filterOwner === o.initials ? "#2558a6" : "#5c6478" }}>{o.initials}</span>
          </button>
        ))}
        <div className="flex-1" />
        {!boardEditable && <span className="text-[10px] px-2 py-0.5 rounded-sm" style={{ backgroundColor: "#f1f5f9", color: "#8c94a6" }}>Board editing is unavailable for this context</span>}
      </div>

      <div className="flex flex-1 overflow-x-auto p-4" style={{ backgroundColor: "#f0f2f5" }}>
        <div className="flex gap-3 h-full">
          {cols.map(({ status, label, wip }) => {
            const colItems = visibleItems.filter(i => toIterationScheduleState(i.status) === status);
            const c = STATUS_CFG[status];
            const over = wip !== undefined && colItems.length > wip;
            return (
              <div key={status} style={{ width: 212, flexShrink: 0, display: "flex", flexDirection: "column" }}>
                <div className="flex items-center justify-between mb-2 px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: c.text }}>{label}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-px rounded-sm" style={{ backgroundColor: over ? "#fef2f2" : c.bg, color: over ? "#b91c1c" : c.text }}>
                      {colItems.length}{wip !== undefined && `/${wip}`}
                    </span>
                  </div>
                  {boardEditable && <Plus size={13} style={{ color: "#8c94a6" }} className="cursor-pointer" />}
                </div>
                <div className="flex-1 overflow-y-auto rounded p-2" style={{ backgroundColor: "#e8eaed", minHeight: 80 }}>
                  {colItems.map(item => (
                    <div key={item.id} className="bg-white rounded p-2.5 mb-2 cursor-pointer transition-shadow hover:shadow-sm" style={{ border: "1px solid #e2e6eb", outline: activeItem?.id === item.id ? "2px solid #2558a6" : undefined }}
                      onClick={() => onItemClick(item)}
                      draggable={boardEditable}
                    >
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <TypeBadge type={item.type} />
                        <span className="font-mono text-[9px]" style={{ color: "#8c94a6" }}>{item.id}</span>
                      </div>
                      <p className="text-[11px] font-medium leading-snug mb-2" style={{ color: "#1a2234", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.title}</p>
                      <div className="flex items-center justify-between mb-1.5">
                        <PriorityBadge priority={item.priority} />
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[9px]" style={{ color: "#8c94a6" }}>{item.planEstimate}pt</span>
                          <Avatar owner={item.owner} size="xs" />
                        </div>
                      </div>
                      {/* Card indicators */}
                      <div className="flex items-center gap-2 pt-1.5" style={{ borderTop: "1px solid #f0f2f5" }}>
                        {item.blocked && <span className="flex items-center gap-0.5 text-[9px] font-semibold" style={{ color: "#b91c1c" }}><AlertTriangle size={10} />Blocked</span>}
                        {(item.commentCount ?? 0) > 0 && <span className="flex items-center gap-0.5 text-[9px]" style={{ color: "#8c94a6" }}><MessageSquare size={9} />{item.commentCount}</span>}
                        {(item.attachmentCount ?? 0) > 0 && <span className="flex items-center gap-0.5 text-[9px]" style={{ color: "#8c94a6" }}><Paperclip size={9} />{item.attachmentCount}</span>}
                        {item.taskCount > 0 && <span className="text-[9px] ml-auto" style={{ color: "#8c94a6" }}>{item.completedTasks}/{item.taskCount}</span>}
                      </div>
                    </div>
                  ))}
                  {colItems.length === 0 && (
                    <div className="flex items-center justify-center py-6 text-[10px] rounded" style={{ color: "#8c94a6", border: "1.5px dashed #d4d8de", backgroundColor: "rgba(255,255,255,0.5)" }}>
                      {boardEditable ? "Drop items here" : "No items"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel on board */}
      {activeItem && (
        <div className="fixed right-0 top-10 bottom-0 w-80 z-20" style={{ boxShadow: "-2px 0 8px rgba(0,0,0,0.08)" }}>
          <DetailPanel item={activeItem} onClose={() => onItemClick(activeItem)} role={role} onOpenFull={onOpenFull} />
        </div>
      )}
    </div>
  );
}

