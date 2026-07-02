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
  CheckSquare, Square, Columns,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { type Role, type Page, type WorkItemType, type StatusType, type PriorityType, type Owner, type WorkItem, type Notification, type Feature, type Project, type ScopeProject, type Initiative, type ReleaseItem, type WorkspaceUser, type WorkflowStatusItem, type LabelItem, can, OWNERS, PROJECTS, SCOPE_PROJECTS, WORK_ITEMS, FEATURES, NOTIFICATIONS, VELOCITY_DATA, BURNDOWN_DATA, STATUS_PIE, INITIATIVES, RELEASES_DATA, WORKSPACE_USERS, WORKFLOW_STATUSES, LABELS_DATA, WORKLOAD_DATA, PLANNED_VS_COMPLETED, PERMISSIONS_MATRIX, DEFECT_ENVIRONMENTS, RELATED_STORIES } from "../model";
import { releaseStatusCfg, cx, Avatar, TYPE_CFG, TypeBadge, STATUS_CFG, StatusBadge, PRI_CFG, PriorityBadge, MiniProgress, RoleBadge, DetailPanel, NewItemModal, EmptyState, SectionCard } from "../components/shared";

export type BacklogColumnKey = "type" | "id" | "name" | "priority" | "estimate" | "owner" | "status" | "release";
const DEFECT_PRIORITY_LABELS: Record<string, string> = { Critical: "Urgent", High: "High", Medium: "Normal", Low: "Low" };
const DEFECT_PRIORITY_TO_LEGACY: Record<string, string> = { Urgent: "Critical", High: "High", Normal: "Medium", Low: "Low", None: "None" };

export function ResizableBacklogHeader({ label, width, column, onResize, align = "left" }: { label: string; width: number; column: BacklogColumnKey; onResize: (column: BacklogColumnKey, event: React.MouseEvent<HTMLDivElement>) => void; align?: "left" | "center" | "right" }) {
  return (
    <div className="relative shrink-0 h-full flex items-center text-[9px] font-semibold uppercase tracking-wider select-none" style={{ width, color: "#8c94a6", justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start" }}>
      {label}
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

export function BacklogPage({ role, activeItem, onItemClick, onOpenFull }: { role: Role; activeItem: WorkItem | null; onItemClick: (i: WorkItem) => void; onOpenFull?: (item: WorkItem) => void }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnWidths, setColumnWidths] = useState<Record<BacklogColumnKey, number>>({ type: 72, id: 82, name: 640, priority: 96, estimate: 52, owner: 112, status: 128, release: 88 });

  const filtered = WORK_ITEMS.filter(i =>
    (i.id.startsWith("US") || i.id.startsWith("DE")) &&
    (filterType === "All" || i.type === filterType) &&
    (filterStatus === "All" || i.status === filterStatus) &&
    (filterPriority === "All" || (i.type === "Defect" && i.priority === DEFECT_PRIORITY_TO_LEGACY[filterPriority])) &&
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => (a.rank || 99) - (b.rank || 99));

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
  function startColumnResize(column: BacklogColumnKey, event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = columnWidths[column];
    const minimums: Record<BacklogColumnKey, number> = { type: 60, id: 64, name: 180, priority: 80, estimate: 44, owner: 80, status: 96, release: 72 };
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
        <div className="flex flex-col items-start gap-1.5 mr-2">
          <h2 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Backlog</h2>
          {can.create(role) && (
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}>
              <Plus size={12} /> Create Work Item
            </button>
          )}
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-7 pr-3 py-1 text-[11px] rounded focus:outline-none" style={{ backgroundColor: "#f4f6f9", border: "1px solid #dde2ea", color: "#1a2234", width: 150 }} />
        </div>
        {/* Type filter */}
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="text-[11px] px-2 py-1 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}>
          {["All", "Story", "Defect"].map(t => <option key={t}>{t}</option>)}
        </select>
        {/* Schedule State filter */}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-[11px] px-2 py-1 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}>
          {["All", "Idea", "Defined", "In-Progress", "Completed", "Accepted", "Release"].map(s => <option key={s}>{s}</option>)}
        </select>
        {/* Priority filter */}
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="text-[11px] px-2 py-1 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}>
          {["All", "Low", "Normal", "High", "Urgent", "None"].map(p => <option key={p}>{p}</option>)}
        </select>
        <div className="flex-1" />
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 shrink-0" style={{ backgroundColor: "#edf2fb", borderBottom: "1px solid #bdd0ef" }}>
          <span className="text-[11px] font-semibold mr-1" style={{ color: "#2558a6" }}>{selectedIds.size} selected</span>
          {["Move to Release", "Edit Priority", "Assign Owner", "Link Items", "Delete"].map(a => (
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
              <div className="w-6 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-right" style={{ color: "#8c94a6" }}>#</div>
              <ResizableBacklogHeader label="Type" column="type" width={columnWidths.type} onResize={startColumnResize} />
              <ResizableBacklogHeader label="ID" column="id" width={columnWidths.id} onResize={startColumnResize} />
              <ResizableBacklogHeader label="Name" column="name" width={columnWidths.name} onResize={startColumnResize} />
              <ResizableBacklogHeader label="Priority" column="priority" width={columnWidths.priority} onResize={startColumnResize} />
              <ResizableBacklogHeader label="Est" column="estimate" width={columnWidths.estimate} onResize={startColumnResize} align="center" />
              <ResizableBacklogHeader label="Owner" column="owner" width={columnWidths.owner} onResize={startColumnResize} />
              <ResizableBacklogHeader label="Schedule State" column="status" width={columnWidths.status} onResize={startColumnResize} />
              <ResizableBacklogHeader label="Release" column="release" width={columnWidths.release} onResize={startColumnResize} />
            </div>

            {filtered.length === 0 ? <EmptyState message="No backlog items found" /> : paginatedItems.map((item, idx) => {
              const isActive = activeItem?.id === item.id;
              const isSel = selectedIds.has(item.id);
              return (
                <div key={item.id} className="flex items-center h-8 px-3 gap-2 cursor-pointer group hover:bg-[#f7f8fa]" style={{ width: backlogTableWidth, minWidth: "100%", backgroundColor: isActive ? "#edf2fb" : isSel ? "#f3f6fb" : undefined, borderBottom: "1px solid #edf0f4" }} onClick={() => onOpenFull ? onOpenFull(item) : onItemClick(item)}>
                  <div className="w-5 shrink-0" onClick={e => { e.stopPropagation(); toggleSelect(item.id); }}><input type="checkbox" checked={isSel} onChange={() => toggleSelect(item.id)} onClick={e => e.stopPropagation()} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
                  <div className="w-4 shrink-0 opacity-0 group-hover:opacity-100 cursor-grab"><GripVertical size={11} style={{ color: "#8c94a6" }} /></div>
                  <div className="w-6 shrink-0 text-[10px] font-mono text-right tabular-nums" style={{ color: "#8c94a6" }}>{pageStart + idx + 1}</div>
                  <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.type }}><TypeBadge type={item.type} /></div>
                  <div className="shrink-0 overflow-hidden font-mono text-[10px] underline-offset-2 group-hover:underline" style={{ width: columnWidths.id, color: "#2558a6" }}>{item.id}</div>
                  <div className="shrink-0 min-w-0 pr-2" style={{ width: columnWidths.name }}><span className="block truncate text-[12px] font-medium" style={{ color: "#1a2234" }}>{item.title}</span></div>
                  <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.priority }}>{item.type === "Defect" ? <span className="inline-flex items-center gap-1 px-1.5 py-px text-[10px] font-semibold rounded-sm whitespace-nowrap" style={{ backgroundColor: "#fff7ed", color: "#9a3412" }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f97316" }} />{DEFECT_PRIORITY_LABELS[item.priority] ?? "None"}</span> : <span className="text-[10px] font-mono" style={{ color: "#a0a7b5" }}>—</span>}</div>
                  <div className="shrink-0 text-center font-mono text-[10px] font-semibold" style={{ width: columnWidths.estimate, color: "#5c6478" }}>{item.planEstimate}</div>
                  <div className="shrink-0 flex items-center gap-1 overflow-hidden" style={{ width: columnWidths.owner }}><Avatar owner={item.owner} size="xs" /><span className="text-[10px] truncate" style={{ color: "#5c6478" }}>{item.owner.initials}</span></div>
                  <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.status }}><StatusBadge status={item.status} /></div>
                  <div className="shrink-0 overflow-hidden text-[10px]" style={{ width: columnWidths.release, color: "#5c6478" }}>{item.release}</div>
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

