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
import { type Role, type Page, type WorkItemType, type StatusType, type PriorityType, type Owner, type WorkItem, type Notification, type Feature, type Project, type ScopeProject, type Initiative, type ReleaseItem, type WorkspaceUser, type WorkflowStatusItem, type LabelItem, can, OWNERS, PROJECTS, ROLE_SCOPE, SCOPE_PROJECTS, WORK_ITEMS, FEATURES, NOTIFICATIONS, VELOCITY_DATA, BURNDOWN_DATA, STATUS_PIE, INITIATIVES, RELEASES_DATA, WORKSPACE_USERS, WORKFLOW_STATUSES, LABELS_DATA, WORKLOAD_DATA, PLANNED_VS_COMPLETED, PERMISSIONS_MATRIX, DEFECT_ENVIRONMENTS, RELATED_STORIES, ITERATIONS_DATA } from "../model";
import { releaseStatusCfg, cx, Avatar, TYPE_CFG, TypeBadge, STATUS_CFG, StatusBadge, PRI_CFG, PriorityBadge, MiniProgress, RoleBadge, DetailPanel, NewItemModal, EmptyState, SectionCard } from "../components/shared";

export type BacklogColumnKey = "rank" | "type" | "id" | "name" | "priority" | "estimate" | "owner" | "status" | "iteration" | "release";
type BacklogFilterColumn = "id" | "name" | "type" | "priority" | "estimate" | "owner" | "status" | "iteration" | "release";
type BacklogFilters = Partial<Record<BacklogFilterColumn, string>>;
type BacklogSort = { column: BacklogColumnKey; direction: "asc" | "desc" };
const DEFECT_PRIORITY_LABELS: Record<string, string> = { Critical: "Urgent", High: "High", Medium: "Normal", Low: "Low" };
const DEFECT_PRIORITY_TO_LEGACY: Record<string, string> = { Urgent: "Critical", High: "High", Normal: "Medium", Low: "Low", None: "None" };
const BACKLOG_STATUS_OPTIONS: StatusType[] = ["Defined", "In-Progress", "Code Review", "Testing", "Completed", "Accepted"];
const BACKLOG_PRIORITY_OPTIONS = ["Low", "Normal", "High", "Urgent", "None"];
const BACKLOG_PRIORITY_ORDER: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
const BACKLOG_STATUS_ORDER: Record<StatusType, number> = { Defined: 1, "In-Progress": 2, "Code Review": 3, Testing: 4, Completed: 5, Accepted: 6 };
const BACKLOG_FILTER_COLUMNS: Array<{ key: BacklogFilterColumn; label: string; mode: "search" | "select" }> = [
  { key: "id", label: "ID", mode: "search" },
  { key: "name", label: "Name", mode: "search" },
  { key: "type", label: "Type", mode: "select" },
  { key: "priority", label: "Priority", mode: "select" },
  { key: "estimate", label: "Est", mode: "search" },
  { key: "owner", label: "Owner", mode: "select" },
  { key: "status", label: "Schedule State", mode: "select" },
  { key: "iteration", label: "Iteration", mode: "select" },
  { key: "release", label: "Release", mode: "select" },
];

function getSortTooltip(column: BacklogColumnKey, direction: "asc" | "desc") {
  if (column === "estimate") return direction === "desc" ? "Largest to smallest" : "Smallest to largest";
  if (column === "id") return direction === "desc" ? "Newest to oldest" : "Oldest to newest";
  if (column === "priority") return direction === "desc" ? "Highest to lowest" : "Lowest to highest";
  if (column === "rank") return direction === "asc" ? "Rank low to high" : "Rank high to low";
  return direction === "asc" ? "A to Z" : "Z to A";
}

function getSortValue(item: WorkItem, column: BacklogColumnKey): string | number {
  switch (column) {
    case "rank": return item.rank || 999;
    case "type": return item.type;
    case "id": return Number(item.id.replace(/\D/g, "")) || 0;
    case "name": return item.title.toLowerCase();
    case "priority": return item.type === "Defect" ? BACKLOG_PRIORITY_ORDER[item.priority] ?? 0 : -1;
    case "estimate": return item.planEstimate;
    case "owner": return item.owner.name.toLowerCase();
    case "status": return BACKLOG_STATUS_ORDER[item.status] ?? 0;
    case "iteration": return item.iteration.toLowerCase();
    case "release": return item.release.toLowerCase();
  }
}

function compareSortValues(a: string | number, b: string | number) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

export function ResizableBacklogHeader({ label, width, column, onResize, sort, onSort, align = "left" }: { label: string; width: number; column: BacklogColumnKey; onResize: (column: BacklogColumnKey, event: React.MouseEvent<HTMLDivElement>) => void; sort: BacklogSort | null; onSort: (column: BacklogColumnKey) => void; align?: "left" | "center" | "right" }) {
  const isSorted = sort?.column === column;
  const tooltip = isSorted ? getSortTooltip(column, sort.direction) : "Sort";
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

export function BacklogPage({ role, project, team, activeItem, onItemClick, onOpenFull }: { role: Role; project: ScopeProject; team: string; activeItem: WorkItem | null; onItemClick: (i: WorkItem) => void; onOpenFull?: (item: WorkItem) => void }) {
  const [backlogItems, setBacklogItems] = useState<WorkItem[]>(() =>
    WORK_ITEMS.filter(item => item.id.startsWith("US") || item.id.startsWith("DE"))
  );
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BacklogFilters>({});
  const [showManageFilters, setShowManageFilters] = useState(false);
  const [filterColumnSearch, setFilterColumnSearch] = useState("");
  const [pendingFilterColumns, setPendingFilterColumns] = useState<Set<BacklogFilterColumn>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnWidths, setColumnWidths] = useState<Record<BacklogColumnKey, number>>({ rank: 56, type: 72, id: 82, name: 520, priority: 96, estimate: 56, owner: 124, status: 128, iteration: 128, release: 88 });
  const [sort, setSort] = useState<BacklogSort | null>(null);

  const releaseOptions = Array.from(new Set(backlogItems.map(item => item.release))).sort();
  const iterationOptions = Array.from(new Set([...ITERATIONS_DATA.map(iteration => iteration.name), "Unscheduled", ...backlogItems.map(item => item.iteration)])).sort();
  const editable = can.manageBacklog(role) && !(role === "Project Admin" && !ROLE_SCOPE.projectAdminProjectKeys.includes(project.key as typeof ROLE_SCOPE.projectAdminProjectKeys[number]));
  const canEditRelease = editable && role !== "Project Member";
  const activeFilterColumns = BACKLOG_FILTER_COLUMNS.filter(column => filters[column.key] !== undefined);
  const activeFilterCount = activeFilterColumns.length;
  const availableFilterColumns = BACKLOG_FILTER_COLUMNS.filter(column => column.label.toLowerCase().includes(filterColumnSearch.toLowerCase()));
  const filtered = backlogItems.filter(item =>
    (item.title.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase())) &&
    activeFilterColumns.every(filter => {
      const value = (filters[filter.key] || "").trim();
      if (!value || value === "All") return true;
      const searchValue = value.toLowerCase();
      switch (filter.key) {
        case "id": return item.id.toLowerCase().includes(searchValue);
        case "name": return item.title.toLowerCase().includes(searchValue);
        case "estimate": return String(item.planEstimate).includes(searchValue);
        case "type": return item.type === value;
        case "priority": return item.type === "Defect" && (DEFECT_PRIORITY_LABELS[item.priority] ?? "None") === value;
        case "owner": return item.owner.name === value;
        case "status": return item.status === value;
        case "iteration": return item.iteration === value;
        case "release": return item.release === value;
      }
    })
  ).sort((a, b) => {
    if (!sort) return (a.rank || 99) - (b.rank || 99);
    const result = compareSortValues(getSortValue(a, sort.column), getSortValue(b, sort.column));
    return sort.direction === "asc" ? result : -result;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * pageSize;
  const paginatedItems = filtered.slice(pageStart, pageStart + pageSize);
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
    setBacklogItems(previous => previous.map(item => item.id === id ? { ...item, ...patch } : item));
  }
  function updateItemOwner(id: string, ownerName: string) {
    const owner = OWNERS.find(candidate => candidate.name === ownerName);
    if (owner) updateItem(id, { owner });
  }
  function updateItemPriority(id: string, priorityLabel: string) {
    const priority = DEFECT_PRIORITY_TO_LEGACY[priorityLabel] as PriorityType | "None";
    if (priority !== "None") updateItem(id, { priority });
  }
  function assignSelectedRelease(release: string) {
    setBacklogItems(previous => previous.map(item => selectedIds.has(item.id) ? { ...item, release } : item));
  }
  function assignSelectedIteration(iteration: string) {
    setBacklogItems(previous => previous.map(item => selectedIds.has(item.id) ? { ...item, iteration } : item));
  }
  function openManageFilters() {
    setShowFilters(true);
    setPendingFilterColumns(new Set(activeFilterColumns.map(column => column.key)));
    setShowManageFilters(true);
  }
  function togglePendingFilterColumn(column: BacklogFilterColumn) {
    setPendingFilterColumns(previous => {
      const next = new Set(previous);
      next.has(column) ? next.delete(column) : next.add(column);
      return next;
    });
  }
  function applyManagedFilters() {
    setFilters(previous => {
      const next: BacklogFilters = {};
      pendingFilterColumns.forEach(column => {
        next[column] = previous[column] ?? "";
      });
      return next;
    });
    setShowManageFilters(false);
    setCurrentPage(1);
  }
  function updateFilterValue(column: BacklogFilterColumn, value: string) {
    setFilters(previous => ({ ...previous, [column]: value }));
    setCurrentPage(1);
  }
  function removeFilter(column: BacklogFilterColumn) {
    setFilters(previous => {
      const next = { ...previous };
      delete next[column];
      return next;
    });
    setCurrentPage(1);
  }
  function getFilterSelectOptions(column: BacklogFilterColumn) {
    switch (column) {
      case "type": return ["All", "Story", "Defect"];
      case "priority": return ["All", ...BACKLOG_PRIORITY_OPTIONS];
      case "owner": return ["All", ...OWNERS.map(owner => owner.name)];
      case "status": return ["All", ...BACKLOG_STATUS_OPTIONS];
      case "iteration": return ["All", ...iterationOptions];
      case "release": return ["All", ...releaseOptions];
      default: return [];
    }
  }
  function toggleSort(column: BacklogColumnKey) {
    setSort(previous => {
      if (previous?.column === column) return { column, direction: previous.direction === "asc" ? "desc" : "asc" };
      const defaultDirection = column === "estimate" || column === "id" || column === "priority" ? "desc" : "asc";
      return { column, direction: defaultDirection };
    });
    setCurrentPage(1);
  }
  function moveItem(id: string, direction: -1 | 1) {
    const ordered = [...backlogItems].sort((a, b) => (a.rank || 99) - (b.rank || 99));
    const index = ordered.findIndex(item => item.id === id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return;
    [ordered[index], ordered[targetIndex]] = [ordered[targetIndex], ordered[index]];
    const nextRank = new Map(ordered.map((item, idx) => [item.id, idx + 1]));
    setBacklogItems(previous => previous.map(item => ({ ...item, rank: nextRank.get(item.id) ?? item.rank })));
  }
  function startColumnResize(column: BacklogColumnKey, event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = columnWidths[column];
    const minimums: Record<BacklogColumnKey, number> = { rank: 48, type: 60, id: 64, name: 180, priority: 80, estimate: 48, owner: 96, status: 96, iteration: 96, release: 72 };
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
  const backlogTableWidth = 164 + Object.values(columnWidths).reduce((total, width) => total + width, 0);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-end gap-2 px-4 py-2 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div className="flex flex-col items-start gap-1.5 mr-2 min-w-[150px]">
          <div>
            <h2 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Backlog</h2>
            <p className="text-[10px]" style={{ color: "#8c94a6" }}>{project.name} · {team}</p>
          </div>
          {editable && (
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}>
              <Plus size={12} /> Create Work Item
            </button>
          )}
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
          <input type="text" placeholder="Search work..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-7 pr-3 py-1 text-[11px] rounded focus:outline-none" style={{ backgroundColor: "#f4f6f9", border: "1px solid #dde2ea", color: "#1a2234", width: 180 }} />
        </div>
        <button onClick={() => setShowFilters(previous => !previous)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded" style={{ border: "1px solid #bdd0ef", color: "#2558a6", backgroundColor: showFilters ? "#edf2fb" : "#fff" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#edf2fb")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = showFilters ? "#edf2fb" : "#fff")}>
          <Filter size={12} /> {showFilters ? "Hide filter" : "Show filter"}{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </button>
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
                    <button aria-label="Close manage filters" onClick={() => setShowManageFilters(false)} className="p-1 rounded" style={{ color: "#2558a6" }}><X size={16} /></button>
                  </div>
                  <div className="px-4 pt-3">
                    <div className="relative">
                      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5c6478" }} />
                      <input value={filterColumnSearch} onChange={event => setFilterColumnSearch(event.target.value)} placeholder="Search" className="w-full pl-8 pr-3 py-2 text-[12px] rounded focus:outline-none" style={{ border: "1px solid #6aa0ff", color: "#1a2234" }} />
                    </div>
                  </div>
                  <div className="px-4 py-3 max-h-[250px] overflow-y-auto">
                    <p className="text-[11px] font-semibold uppercase mb-2" style={{ color: "#1a2234" }}>Selected</p>
                    {BACKLOG_FILTER_COLUMNS.filter(column => pendingFilterColumns.has(column.key)).length === 0 ? (
                      <p className="text-[11px] mb-3" style={{ color: "#8c94a6" }}>No columns selected</p>
                    ) : BACKLOG_FILTER_COLUMNS.filter(column => pendingFilterColumns.has(column.key)).map(column => (
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
                        <input aria-label={`${columnMeta.label} filter value`} type={columnMeta.key === "estimate" ? "number" : "text"} value={filterValue} onChange={event => updateFilterValue(columnMeta.key, event.target.value)} placeholder={`Filter ${columnMeta.label}`} className="pl-6 pr-2 py-1 text-[11px] rounded focus:outline-none" style={{ width: columnMeta.key === "name" ? 220 : 128, border: "1px solid #dde2ea", color: "#1a2234" }} />
                      </div>
                    ) : (
                      <select aria-label={`${columnMeta.label} filter value`} value={filterValue || "All"} onChange={event => updateFilterValue(columnMeta.key, event.target.value)} className="text-[11px] px-2 py-1 rounded bg-white focus:outline-none" style={{ minWidth: 132, border: "1px solid #dde2ea", color: "#1a2234" }}>
                        {getFilterSelectOptions(columnMeta.key).map(option => <option key={option}>{option}</option>)}
                      </select>
                    )}
                    <button aria-label={`Remove ${columnMeta.label} filter`} onClick={() => removeFilter(columnMeta.key)} className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f4f6f9"; e.currentTarget.style.color = "#1a2234"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8c94a6"; }}><X size={12} /></button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 shrink-0" style={{ backgroundColor: "#edf2fb", borderBottom: "1px solid #bdd0ef" }}>
          <span className="text-[11px] font-semibold mr-1" style={{ color: "#2558a6" }}>{selectedIds.size} selected</span>
          <select aria-label="Assign selected release" onChange={event => assignSelectedRelease(event.target.value)} defaultValue="" className="px-2.5 py-1 text-[11px] rounded bg-white" style={{ color: "#2558a6", border: "1px solid #bdd0ef" }}>
            <option value="" disabled>Move to Release</option>
            {releaseOptions.map(release => <option key={release} value={release}>{release}</option>)}
          </select>
          <select aria-label="Assign selected iteration" onChange={event => assignSelectedIteration(event.target.value)} defaultValue="" className="px-2.5 py-1 text-[11px] rounded bg-white" style={{ color: "#2558a6", border: "1px solid #bdd0ef" }}>
            <option value="" disabled>Move to Iteration</option>
            {iterationOptions.map(iteration => <option key={iteration} value={iteration}>{iteration}</option>)}
          </select>
          {["Edit Priority", "Assign Owner", "Link Items", "Delete"].map(a => (
            <button key={a} className="px-2.5 py-1 text-[11px] rounded" style={{ color: "#2558a6", border: "1px solid #bdd0ef" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#dde8f5")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>{a}</button>
          ))}
          <div className="flex-1" />
          <button onClick={() => setSelectedIds(new Set())} className="p-0.5" style={{ color: "#5c6478" }}><X size={13} /></button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden bg-white">
          <div className="flex-1 overflow-auto">
            <div style={{ width: backlogTableWidth, minWidth: "100%" }}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center h-8 px-3 gap-2 select-none" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
              <div className="w-5 shrink-0"><input type="checkbox" checked={allChecked} onChange={selectAll} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
              <div className="w-4 shrink-0" />
              <ResizableBacklogHeader label="Rank" column="rank" width={columnWidths.rank} onResize={startColumnResize} sort={sort} onSort={toggleSort} align="right" />
              <ResizableBacklogHeader label="Type" column="type" width={columnWidths.type} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
              <ResizableBacklogHeader label="ID" column="id" width={columnWidths.id} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
              <ResizableBacklogHeader label="Name" column="name" width={columnWidths.name} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
              <ResizableBacklogHeader label="Priority" column="priority" width={columnWidths.priority} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
              <ResizableBacklogHeader label="Est" column="estimate" width={columnWidths.estimate} onResize={startColumnResize} sort={sort} onSort={toggleSort} align="center" />
              <ResizableBacklogHeader label="Owner" column="owner" width={columnWidths.owner} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
              <ResizableBacklogHeader label="Schedule State" column="status" width={columnWidths.status} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
              <ResizableBacklogHeader label="Iteration" column="iteration" width={columnWidths.iteration} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
              <ResizableBacklogHeader label="Release" column="release" width={columnWidths.release} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
            </div>

            {filtered.length === 0 ? <EmptyState message="No backlog items found" /> : paginatedItems.map((item, idx) => {
              const isActive = activeItem?.id === item.id;
              const isSel = selectedIds.has(item.id);
              return (
                <div key={item.id} className="flex items-center h-8 px-3 gap-2 cursor-pointer group hover:bg-[#f7f8fa]" style={{ width: backlogTableWidth, minWidth: "100%", backgroundColor: isActive ? "#edf2fb" : isSel ? "#f3f6fb" : undefined, borderBottom: "1px solid #edf0f4" }} onClick={() => onOpenFull ? onOpenFull(item) : onItemClick(item)}>
                  <div className="w-5 shrink-0" onClick={e => { e.stopPropagation(); toggleSelect(item.id); }}><input type="checkbox" checked={isSel} onChange={() => toggleSelect(item.id)} onClick={e => e.stopPropagation()} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
                  <div className="w-4 shrink-0 flex flex-col opacity-0 group-hover:opacity-100" onClick={event => event.stopPropagation()}>
                    <button aria-label="Move item up" disabled={!editable || pageStart + idx === 0} onClick={() => moveItem(item.id, -1)} className="h-3 disabled:opacity-30" style={{ color: "#8c94a6" }}><ChevronUp size={10} /></button>
                    <button aria-label="Move item down" disabled={!editable || pageStart + idx >= filtered.length - 1} onClick={() => moveItem(item.id, 1)} className="h-3 disabled:opacity-30" style={{ color: "#8c94a6" }}><ChevronDown size={10} /></button>
                  </div>
                  <div className="shrink-0 text-[11px] font-mono text-right tabular-nums pr-2" style={{ width: columnWidths.rank, color: "#5c6478" }}>{item.rank ?? pageStart + idx + 1}</div>
                  <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.type }}><TypeBadge type={item.type} /></div>
                  <div className="shrink-0 overflow-hidden font-mono text-[11px] underline-offset-2 group-hover:underline" style={{ width: columnWidths.id, color: "#2558a6" }}>{item.id}</div>
                  <div className="shrink-0 min-w-0 pr-2" style={{ width: columnWidths.name }} onClick={event => event.stopPropagation()}>
                    <input aria-label={`${item.id} title`} readOnly={!editable} value={item.title} onChange={event => updateItem(item.id, { title: event.target.value })} className="block w-full truncate text-[11px] font-medium bg-transparent focus:outline-none focus:bg-white focus:px-1 focus:py-0.5 focus:rounded" style={{ color: "#1a2234", border: editable ? "1px solid transparent" : "0" }} />
                  </div>
                  <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.priority }} onClick={event => event.stopPropagation()}>
                    {item.type === "Defect" && editable ? (
                      <select aria-label={`${item.id} defect priority`} value={DEFECT_PRIORITY_LABELS[item.priority] ?? "None"} onChange={event => updateItemPriority(item.id, event.target.value)} className="w-[88px] text-[11px] font-semibold rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #f5d899", color: "#9a3412" }}>{BACKLOG_PRIORITY_OPTIONS.map(priority => <option key={priority}>{priority}</option>)}</select>
                    ) : item.type === "Defect" ? <span className="inline-flex items-center gap-1 px-1.5 py-px text-[11px] font-semibold rounded-sm whitespace-nowrap" style={{ backgroundColor: "#fff7ed", color: "#9a3412" }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f97316" }} />{DEFECT_PRIORITY_LABELS[item.priority] ?? "None"}</span> : <span className="text-[11px] font-mono" style={{ color: "#a0a7b5" }}>—</span>}
                  </div>
                  <div className="shrink-0 text-center" style={{ width: columnWidths.estimate }} onClick={event => event.stopPropagation()}>
                    <input aria-label={`${item.id} plan estimate`} readOnly={!editable} type="number" min={0} value={item.planEstimate} onChange={event => updateItem(item.id, { planEstimate: Number(event.target.value) })} className="w-11 text-center font-mono text-[11px] font-semibold bg-transparent focus:outline-none focus:bg-white focus:rounded" style={{ color: "#5c6478", border: editable ? "1px solid transparent" : "0" }} />
                  </div>
                  <div className="shrink-0 flex items-center gap-1 overflow-hidden" style={{ width: columnWidths.owner }} onClick={event => event.stopPropagation()}>
                    <Avatar owner={item.owner} size="xs" />
                    {editable ? <select aria-label={`${item.id} owner`} value={item.owner.name} onChange={event => updateItemOwner(item.id, event.target.value)} className="min-w-0 flex-1 text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select> : <span className="text-[11px] truncate" style={{ color: "#5c6478" }}>{item.owner.initials}</span>}
                  </div>
                  <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.status }} onClick={event => event.stopPropagation()}>
                    {editable ? <select aria-label={`${item.id} schedule state`} value={item.status} onChange={event => updateItem(item.id, { status: event.target.value as StatusType })} className="w-[118px] text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #bdd0ef", color: "#2558a6" }}>{BACKLOG_STATUS_OPTIONS.map(status => <option key={status}>{status}</option>)}</select> : <StatusBadge status={item.status} />}
                  </div>
                  <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.iteration, color: "#5c6478" }} onClick={event => event.stopPropagation()}>
                    {editable ? <select aria-label={`${item.id} iteration`} value={item.iteration} onChange={event => updateItem(item.id, { iteration: event.target.value })} className="w-[122px] text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{iterationOptions.map(iteration => <option key={iteration}>{iteration}</option>)}</select> : item.iteration}
                  </div>
                  <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.release, color: "#5c6478" }} onClick={event => event.stopPropagation()}>
                    {canEditRelease ? <select aria-label={`${item.id} release`} value={item.release} onChange={event => updateItem(item.id, { release: event.target.value })} className="w-[82px] text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{releaseOptions.map(release => <option key={release}>{release}</option>)}</select> : item.release}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
          <div className="h-10 shrink-0 flex items-center justify-between px-3 bg-white" style={{ borderTop: "1px solid #e2e6eb" }}>
            <div className="flex items-center gap-2 text-[11px]" style={{ color: "#5c6478" }}>
              <span>Rows per page</span>
              <select aria-label="Rows per page" value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setCurrentPage(1); }} className="px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>
                {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
              </select>
              <span style={{ color: "#8c94a6" }}>{filtered.length === 0 ? "0 records" : `${pageStart + 1}–${Math.min(pageStart + pageSize, filtered.length)} of ${filtered.length}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] tabular-nums" style={{ color: "#5c6478" }}>Page {activePage} of {totalPages}</span>
              <button aria-label="Previous page" disabled={activePage === 1} onClick={() => setCurrentPage(activePage - 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronLeft size={13} /></button>
              <button aria-label="Next page" disabled={activePage === totalPages} onClick={() => setCurrentPage(activePage + 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronRight size={13} /></button>
            </div>
          </div>
        </div>
        {activeItem && <DetailPanel item={activeItem} onClose={() => onItemClick(activeItem)} role={role} onOpenFull={onOpenFull} />}
      </div>
      {showModal && <NewItemModal onClose={() => setShowModal(false)} defaultType="Story" allowedTypes={["Story", "Defect"]} />}
    </div>
  );
}

