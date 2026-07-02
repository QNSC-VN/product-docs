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

export function DefectRow({ item, idx, active, selected, onClick, onToggle, severity, env, related }: { item: WorkItem; idx: number; active: boolean; selected: boolean; onClick: () => void; onToggle: () => void; severity: PriorityType; env: string; related: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="flex items-center h-8 px-3 gap-2 cursor-pointer" style={{ backgroundColor: active ? "#edf2fb" : selected ? "#f3f6fb" : hov ? "#f7f8fa" : "#fff", borderBottom: "1px solid #edf0f4" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}>
      <div className="w-7 shrink-0" onClick={e => { e.stopPropagation(); onToggle(); }}><input type="checkbox" checked={selected} onChange={onToggle} onClick={e => e.stopPropagation()} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
      <div className="w-[68px] shrink-0 font-mono text-[10px]" style={{ color: "#5c6478" }}>{item.id}</div>
      <div className="flex-1 min-w-0 pr-2"><span className="block truncate text-[12px] font-medium" style={{ color: "#1a2234" }}>{item.title}</span></div>
      <div className="w-20 shrink-0"><PriorityBadge priority={severity} /></div>
      <div className="w-20 shrink-0"><PriorityBadge priority={item.priority} /></div>
      <div className="w-24 shrink-0 text-[10px] truncate" style={{ color: "#5c6478" }}>{env}</div>
      <div className="w-16 shrink-0 flex items-center gap-1"><Avatar owner={item.owner} size="xs" /><span className="text-[10px]" style={{ color: "#5c6478" }}>{item.owner.initials}</span></div>
      <div className="w-24 shrink-0"><StatusBadge status={item.status} /></div>
      <div className="w-16 shrink-0 font-mono text-[10px]" style={{ color: related === "—" ? "#c4cad4" : "#2558a6" }}>{related}</div>
      <div className="w-20 shrink-0 text-[10px] truncate" style={{ color: "#5c6478" }}>{item.iteration}</div>
      <div className="w-16 shrink-0 text-[10px]" style={{ color: "#5c6478" }}>{item.release}</div>
      <div className="w-20 shrink-0 text-[10px]" style={{ color: "#8c94a6" }}>{item.lastUpdated}</div>
    </div>
  );
}

export function QualityPage({ role, activeItem, onItemClick, onOpenFull }: { role: Role; activeItem: WorkItem | null; onItemClick: (i: WorkItem) => void; onOpenFull?: (item: WorkItem) => void }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const defects = WORK_ITEMS.filter(i => i.type === "Defect" && (i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())));
  const critical = defects.filter(d => d.priority === "Critical").length;
  const open = defects.filter(d => ["Defined", "In-Progress"].includes(d.status)).length;
  const inTesting = defects.filter(d => d.status === "Testing").length;
  const verified = defects.filter(d => ["Completed", "Accepted"].includes(d.status)).length;
  const blockers = defects.filter(d => d.blocked).length;

  const meta = (id: string, i: number) => ({ severity: defects[i]?.priority ?? "Medium", env: DEFECT_ENVIRONMENTS[i % DEFECT_ENVIRONMENTS.length], related: RELATED_STORIES[i % RELATED_STORIES.length] });

  function toggleSelect(id: string) { setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  const allChecked = defects.length > 0 && defects.every(d => selectedIds.has(d.id));
  function selectAll() { setSelectedIds(allChecked ? new Set() : new Set(defects.map(d => d.id))); }

  const metrics = [
    { label: "Open Defects", value: String(open), color: "#8a5808" },
    { label: "Critical", value: String(critical), color: "#b91c1c" },
    { label: "In Testing", value: String(inTesting), color: "#7e22ce" },
    { label: "Verified / Accepted", value: String(verified), color: "#1e6930" },
    { label: "Reopened", value: "0", color: "#1a2234" },
    { label: "Blockers", value: String(blockers), color: blockers > 0 ? "#b91c1c" : "#1a2234" },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Metrics strip */}
      <div className="flex items-stretch bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb", height: 52 }}>
        {metrics.map((m, i) => (
          <div key={m.label} className="flex flex-col justify-center px-5 gap-0.5" style={{ borderLeft: i > 0 ? "1px solid #e2e6eb" : undefined }}>
            <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>{m.label}</span>
            <span className="text-[17px] font-semibold leading-none" style={{ color: m.color }}>{m.value}</span>
          </div>
        ))}
        <div className="flex-1" style={{ borderLeft: "1px solid #e2e6eb" }} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <h2 className="text-[13px] font-semibold mr-2" style={{ color: "#1a2234" }}>Defects</h2>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
          <input type="text" placeholder="Search defects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-7 pr-3 py-1 text-[11px] rounded focus:outline-none" style={{ backgroundColor: "#f4f6f9", border: "1px solid #dde2ea", color: "#1a2234", width: 160 }} />
        </div>
        <button className="flex items-center gap-1.5 px-2 py-1 text-[11px] rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><Filter size={11} /> Filter</button>
        <div className="flex-1" />
        <SavedViewsDrop />
        {can.createDefects(role) && <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded ml-1" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}><Plus size={12} /> Log Defect</button>}
      </div>

      {/* Quick create defect row */}
      {can.createDefects(role) && (
        <div className="flex items-center h-10 px-4 gap-2 shrink-0" style={{ backgroundColor: "#fff7f6", borderBottom: "1px solid #fcdfdb" }}>
          <input type="text" placeholder="New defect title..." className="flex-1 text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #f0c7c1", color: "#1a2234" }} />
          <select className="text-[11px] rounded px-1.5 py-1 bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} title="Severity">
            {["Critical", "High", "Medium", "Low"].map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="text-[11px] rounded px-1.5 py-1 bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} title="Priority">
            {["Critical", "High", "Medium", "Low"].map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="text-[11px] rounded px-1.5 py-1 bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} title="Environment">
            {DEFECT_ENVIRONMENTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="text-[11px] rounded px-1.5 py-1 bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} title="Owner">
            {OWNERS.map(o => <option key={o.name}>{o.initials}</option>)}
          </select>
          <select className="text-[11px] rounded px-1.5 py-1 bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} title="Related Story">
            {RELATED_STORIES.map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="px-3 py-1 text-[11px] font-semibold text-white rounded shrink-0" style={{ backgroundColor: "#b91c1c" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#991818")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#b91c1c")}>Create Defect</button>
        </div>
      )}

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 shrink-0" style={{ backgroundColor: "#edf2fb", borderBottom: "1px solid #bdd0ef" }}>
          <span className="text-[11px] font-semibold mr-1" style={{ color: "#2558a6" }}>{selectedIds.size} selected</span>
          {["Assign Owner", "Verify", "Reopen", "Link to Story", "Delete"].map(a => (
            <button key={a} className="px-2.5 py-1 text-[11px] rounded" style={{ color: "#2558a6", border: "1px solid #bdd0ef" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#dde8f5")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>{a}</button>
          ))}
          <div className="flex-1" />
          <button onClick={() => setSelectedIds(new Set())} className="p-0.5" style={{ color: "#5c6478" }}><X size={13} /></button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden bg-white">
          {/* Header */}
          <div className="flex items-center h-8 px-3 gap-2 shrink-0 select-none" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            <div className="w-7 shrink-0"><input type="checkbox" checked={allChecked} onChange={selectAll} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
            {[["w-[68px] shrink-0", "ID"], ["flex-1 min-w-0 pr-2", "Title"], ["w-20 shrink-0", "Severity"], ["w-20 shrink-0", "Priority"], ["w-24 shrink-0", "Environment"], ["w-16 shrink-0", "Owner"], ["w-24 shrink-0", "Status"], ["w-16 shrink-0", "Related"], ["w-20 shrink-0", "Sprint"], ["w-16 shrink-0", "Release"], ["w-20 shrink-0", "Updated"]].map(([cls, label], i) => (
              <div key={i} className={cx(cls, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{label}</div>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {defects.length === 0 ? <EmptyState message="No defects found" /> : defects.map((item, i) => {
              const m = meta(item.id, i);
              return <DefectRow key={item.id} item={item} idx={i} active={activeItem?.id === item.id} selected={selectedIds.has(item.id)} onClick={() => onItemClick(item)} onToggle={() => toggleSelect(item.id)} severity={m.severity} env={m.env} related={m.related} />;
            })}
          </div>
        </div>
        {activeItem && <DetailPanel item={activeItem} onClose={() => onItemClick(activeItem)} role={role} onOpenFull={onOpenFull} />}
      </div>
      {showModal && <NewItemModal onClose={() => setShowModal(false)} defaultType="Defect" />}
    </div>
  );
}

