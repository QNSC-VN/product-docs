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

export const TRACK_ACTION_GROUPS = [
  ["Edit", "Delete", "Copy", "Split", "Add Peer", "Add Child", "Link Existing", "Copy Tasks From"],
  ["Rank Lowest", "Rank Highest", "Move to Position"],
];

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

export function TrackQuickCreateRow({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex items-center h-9 px-3 gap-2 shrink-0" style={{ backgroundColor: "#f0f4fb", borderBottom: "1px solid #e2e6eb" }}>
      <div className="w-5 shrink-0" /><div className="w-6 shrink-0" />
      <select className="text-[11px] rounded px-1.5 py-0.5 bg-white focus:outline-none" style={{ border: "1px solid #c7d4f5", width: 70, color: "#1a2234" }}>
        {["Story", "Defect", "Task", "Feature"].map(t => <option key={t}>{t}</option>)}
      </select>
      <select className="text-[11px] rounded px-1.5 py-0.5 bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", width: 55, color: "#1a2234" }}>
        {["NXP", "ECO", "MOB", "INF"].map(p => <option key={p}>{p}</option>)}
      </select>
      <input autoFocus type="text" placeholder="Enter a work item name..." className="flex-1 text-[12px] px-2 py-1 rounded focus:outline-none bg-white" style={{ border: "1px solid rgba(29,63,115,0.35)" }} />
      <input type="number" placeholder="Est" className="text-[11px] px-2 py-0.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", width: 44, color: "#1a2234" }} />
      <select className="text-[11px] rounded px-1 py-0.5 bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", width: 70, color: "#1a2234" }}>
        {OWNERS.map(o => <option key={o.name}>{o.initials}</option>)}
      </select>
      <button className="px-2.5 py-1 text-[11px] font-semibold text-white rounded shrink-0" style={{ backgroundColor: "#1d3f73" }}>Create + New</button>
      <button className="text-[11px] font-medium shrink-0" style={{ color: "#2558a6" }}>Create</button>
      <button className="text-[11px] shrink-0" style={{ color: "#5c6478" }}>Create with details</button>
      <button onClick={onCancel} className="shrink-0" style={{ color: "#8c94a6" }}><X size={13} /></button>
    </div>
  );
}

export function TrackPage({ role, activeItem, onItemClick, onOpenFull }: { role: Role; activeItem: WorkItem | null; onItemClick: (i: WorkItem) => void; onOpenFull?: (item: WorkItem) => void }) {
  const [view, setView] = useState<"list" | "board">("list");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showQuick, setShowQuick] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const sprintItems = WORK_ITEMS.filter(i =>
    i.iteration === "Sprint 24.3" &&
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()))
  );
  const allChecked = sprintItems.length > 0 && sprintItems.every(i => selectedIds.has(i.id));

  function toggleSelect(id: string) { setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function selectAll() { setSelectedIds(allChecked ? new Set() : new Set(sprintItems.map(i => i.id))); }

  const plannedPts = sprintItems.reduce((s, i) => s + i.planEstimate, 0);
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
        <h2 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Iteration Status</h2>
        <div className="flex items-center gap-1 ml-2">
          <button className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f4f6f9")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}><ChevronLeft size={14} /></button>
          <button className="flex items-center gap-1 px-2.5 py-1 text-[12px] font-semibold rounded" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>
            Sprint 24.3 <ChevronDown size={11} style={{ color: "#8c94a6" }} />
          </button>
          <button className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f4f6f9")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}><ChevronRight size={14} /></button>
        </div>
        <span className="text-[11px]" style={{ color: "#5c6478" }}>Oct 14 – Oct 28, 2024</span>
        <div className="flex-1" />
        <SavedViewsDrop />
        <div className="flex rounded overflow-hidden ml-2" style={{ border: "1px solid #dde2ea" }}>
          {(["list", "board"] as const).map((v, i) => (
            <button key={v} onClick={() => setView(v)} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: view === v ? "#1d3f73" : "transparent", color: view === v ? "#fff" : "#5c6478", borderLeft: i > 0 ? "1px solid #dde2ea" : undefined }}>
              {v === "list" ? <LayoutList size={13} /> : <LayoutGrid size={13} />}
              {v === "list" ? "List" : "Board"}
            </button>
          ))}
        </div>
        {can.create(role) && <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}><Plus size={12} /> Add Item</button>}
      </div>

      {/* Status summary strip — 5 tiles */}
      <div className="flex items-stretch bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb", height: 64 }}>
        {/* Planned Velocity */}
        <div className="flex flex-col justify-center px-5 gap-1" style={{ minWidth: 160 }}>
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
        <div className="flex flex-col justify-center px-5 gap-1" style={{ borderLeft: "1px solid #e2e6eb", minWidth: 150 }}>
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
        <div className="flex flex-col justify-center px-5 gap-1" style={{ borderLeft: "1px solid #e2e6eb", minWidth: 150 }}>
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
        <div className="flex flex-col justify-center px-5 gap-0.5" style={{ borderLeft: "1px solid #e2e6eb", minWidth: 110 }}>
          <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>Defects</span>
          <span className="text-[20px] font-semibold leading-none" style={{ color: defectCount > 0 ? "#b91c1c" : "#1a2234" }}>{defectCount}</span>
          <span className="text-[10px]" style={{ color: "#5c6478" }}>active</span>
        </div>
        {/* Tasks */}
        <div className="flex flex-col justify-center px-5 gap-0.5" style={{ borderLeft: "1px solid #e2e6eb", minWidth: 110 }}>
          <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>Tasks</span>
          <span className="text-[20px] font-semibold leading-none" style={{ color: "#1a2234" }}>{taskCount}</span>
          <span className="text-[10px]" style={{ color: "#5c6478" }}>active</span>
        </div>
        <div className="flex items-center px-5" style={{ borderLeft: "1px solid #e2e6eb" }}>
          <button className="text-[11px] font-medium flex items-center gap-1" style={{ color: "#2558a6" }}>
            View Charts <ChevronRight size={11} />
          </button>
        </div>
        <div className="flex-1" />
      </div>

      {view === "list" ? (
        <>
          {/* Search + filter toolbar */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
              <input type="text" placeholder="Filter items..." value={search} onChange={e => setSearch(e.target.value)} className="pl-7 pr-3 py-1 text-[12px] rounded focus:outline-none" style={{ backgroundColor: "#f4f6f9", border: "1px solid #dde2ea", color: "#1a2234", width: 160 }} />
            </div>
            <button className="flex items-center gap-1.5 px-2 py-1 text-[11px] rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><Filter size={11} /> Filter</button>
            <div className="flex-1" />
            {can.create(role) && <button onClick={() => setShowQuick(true)} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#1d3f73" }}><Plus size={11} /> Quick Create</button>}
          </div>

          {/* Selected item toolbar */}
          {selectedIds.size > 0 && <SelectedItemToolbar count={selectedIds.size} onClear={() => setSelectedIds(new Set())} />}

          {/* Quick create row */}
          {showQuick && <TrackQuickCreateRow onCancel={() => setShowQuick(false)} />}

          {/* Table */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-col flex-1 overflow-hidden bg-white">
              {/* Table header */}
              <div className="flex items-center h-8 px-3 gap-1.5 shrink-0 select-none" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
                <div className="w-5 shrink-0"><input type="checkbox" checked={allChecked} onChange={selectAll} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
                <div className="w-6 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-center" style={{ color: "#8c94a6" }}>#</div>
                <div className="w-[64px] shrink-0 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>ID</div>
                <div className="flex-1 min-w-0 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Name</div>
                <div className="w-28 shrink-0 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Schedule State</div>
                <div className="w-16 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-center" style={{ color: "#8c94a6" }}>Blocked</div>
                <div className="w-14 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-right" style={{ color: "#8c94a6" }}>Plan Est</div>
                <div className="w-14 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-right" style={{ color: "#8c94a6" }}>Task Est</div>
                <div className="w-12 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-right" style={{ color: "#8c94a6" }}>To Do</div>
                <div className="w-28 shrink-0 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Owner</div>
                <div className="w-16 shrink-0 text-[9px] font-semibold uppercase tracking-wider text-center" style={{ color: "#8c94a6" }}>Defects</div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {sprintItems.length === 0 ? <EmptyState message="No sprint items found" /> : sprintItems.map((item, idx) => {
                  const isActive = activeItem?.id === item.id;
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <div key={item.id} className="flex items-center h-8 px-3 gap-1.5 cursor-pointer hover:bg-[#f7f8fa]" style={{ backgroundColor: isActive ? "#edf2fb" : isSelected ? "#f3f6fb" : undefined, borderBottom: "1px solid #edf0f4" }} onClick={() => onItemClick(item)}>
                      <div className="w-5 shrink-0" onClick={e => { e.stopPropagation(); toggleSelect(item.id); }}><input type="checkbox" checked={isSelected} onChange={() => toggleSelect(item.id)} onClick={e => e.stopPropagation()} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
                      <div className="w-6 shrink-0 text-[10px] font-mono text-center tabular-nums" style={{ color: "#8c94a6" }}>{idx + 1}</div>
                      <div className="w-[64px] shrink-0 font-mono text-[10px]" style={{ color: "#5c6478" }}>{item.id}</div>
                      <div className="flex-1 min-w-0 flex items-center gap-1.5 pr-2">
                        <TypeBadge type={item.type} />
                        <span className="block truncate text-[12px] font-medium" style={{ color: "#1a2234" }}>{item.title}</span>
                      </div>
                      <div className="w-28 shrink-0"><StatusBadge status={item.status} /></div>
                      <div className="w-16 shrink-0 flex justify-center">
                        {item.blocked ? <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "#b91c1c" }}><AlertTriangle size={11} />Yes</span> : <span className="text-[10px]" style={{ color: "#c4cad4" }}>—</span>}
                      </div>
                      <div className="w-14 shrink-0 text-right font-mono text-[11px] font-semibold" style={{ color: "#1a2234" }}>{item.planEstimate}</div>
                      <div className="w-14 shrink-0 text-right font-mono text-[11px]" style={{ color: "#5c6478" }}>{item.taskEstimate ?? "—"}</div>
                      <div className="w-12 shrink-0 text-right font-mono text-[11px]" style={{ color: (item.todoEstimate ?? 0) > 0 ? "#8a5808" : "#5c6478" }}>{item.todoEstimate ?? "—"}</div>
                      <div className="w-28 shrink-0 flex items-center gap-1.5"><Avatar owner={item.owner} size="xs" /><span className="text-[11px] truncate" style={{ color: "#5c6478" }}>{item.owner.name.split(" ")[0]} {item.owner.name.split(" ")[1][0]}.</span></div>
                      <div className="w-16 shrink-0 text-center">
                        {(item.defectCount ?? 0) > 0 ? <span className="text-[10px] font-semibold" style={{ color: "#b91c1c" }}>{item.defectCount}</span> : <span className="text-[10px]" style={{ color: "#c4cad4" }}>—</span>}
                      </div>
                    </div>
                  );
                })}
                {!showQuick && can.create(role) && (
                  <button onClick={() => setShowQuick(true)} className="flex items-center gap-2 w-full px-4 py-2 text-[11px]" style={{ color: "#8c94a6", borderBottom: "1px solid #edf0f4" }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f0f4fb"; e.currentTarget.style.color = "#1d3f73"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8c94a6"; }}>
                    <Plus size={12} /> Add work item
                  </button>
                )}
              </div>
            </div>
            {activeItem && <DetailPanel item={activeItem} onClose={() => onItemClick(activeItem)} role={role} onOpenFull={onOpenFull} />}
          </div>
        </>
      ) : (
        <TrackBoardView items={sprintItems} role={role} activeItem={activeItem} onItemClick={onItemClick} onOpenFull={onOpenFull} />
      )}
      {showModal && <NewItemModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

// ─── Screen 5 — Board View (6 columns) ───────────────────────────────────────

export function TrackBoardView({ items, role, activeItem, onItemClick, onOpenFull }: { items: WorkItem[]; role: Role; activeItem: WorkItem | null; onItemClick: (i: WorkItem) => void; onOpenFull?: (item: WorkItem) => void }) {
  const cols: { status: StatusType; label: string; wip?: number }[] = [
    { status: "Defined", label: "Defined", wip: 5 },
    { status: "In-Progress", label: "In Progress", wip: 4 },
    { status: "Code Review", label: "Code Review", wip: 3 },
    { status: "Testing", label: "Testing", wip: 3 },
    { status: "Completed", label: "Done" },
    { status: "Accepted", label: "Accepted" },
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
        {!can.dragBoard(role) && <span className="text-[10px] px-2 py-0.5 rounded-sm" style={{ backgroundColor: "#f1f5f9", color: "#8c94a6" }}>View only — Viewer role cannot drag cards</span>}
      </div>

      <div className="flex flex-1 overflow-x-auto p-4" style={{ backgroundColor: "#f0f2f5" }}>
        <div className="flex gap-3 h-full">
          {cols.map(({ status, label, wip }) => {
            const colItems = visibleItems.filter(i => i.status === status);
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
                  {can.create(role) && <Plus size={13} style={{ color: "#8c94a6" }} className="cursor-pointer" />}
                </div>
                <div className="flex-1 overflow-y-auto rounded p-2" style={{ backgroundColor: "#e8eaed", minHeight: 80 }}>
                  {colItems.map(item => (
                    <div key={item.id} className="bg-white rounded p-2.5 mb-2 cursor-pointer transition-shadow hover:shadow-sm" style={{ border: "1px solid #e2e6eb", outline: activeItem?.id === item.id ? "2px solid #2558a6" : undefined }}
                      onClick={() => onItemClick(item)}
                      draggable={can.dragBoard(role)}
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
                        {(item.defectCount ?? 0) > 0 && <span className="text-[9px]" style={{ color: "#b91c1c" }}>🐛 {item.defectCount}</span>}
                        {(item.commentCount ?? 0) > 0 && <span className="flex items-center gap-0.5 text-[9px]" style={{ color: "#8c94a6" }}><MessageSquare size={9} />{item.commentCount}</span>}
                        {(item.attachmentCount ?? 0) > 0 && <span className="flex items-center gap-0.5 text-[9px]" style={{ color: "#8c94a6" }}><Paperclip size={9} />{item.attachmentCount}</span>}
                        {item.taskCount > 0 && <span className="text-[9px] ml-auto" style={{ color: "#8c94a6" }}>{item.completedTasks}/{item.taskCount}</span>}
                      </div>
                    </div>
                  ))}
                  {colItems.length === 0 && (
                    <div className="flex items-center justify-center py-6 text-[10px] rounded" style={{ color: "#8c94a6", border: "1.5px dashed #d4d8de", backgroundColor: "rgba(255,255,255,0.5)" }}>
                      {can.dragBoard(role) ? "Drop items here" : "No items"}
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

