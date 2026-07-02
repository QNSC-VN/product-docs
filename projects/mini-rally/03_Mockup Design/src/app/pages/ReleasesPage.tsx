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

export function ReleaseStatusBadge({ status }: { status: ReleaseItem["status"] }) {
  const c = releaseStatusCfg(status);
  return (
    <span className="inline-flex items-center gap-1 px-2 py-px text-[11px] font-medium rounded-sm whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.dot }} />{status}
    </span>
  );
}

export function ReleaseRow({ rel, expanded, onToggle }: { rel: ReleaseItem; expanded: boolean; onToggle: () => void }) {
  const [hov, setHov] = useState(false);
  const barColor = rel.progress === 100 ? "#2a8c3f" : rel.progress > 50 ? "#2558a6" : "#e59f0c";
  return (
    <>
      <div className="flex items-center h-9 px-3 gap-2 cursor-pointer" style={{ backgroundColor: expanded ? "#f7f8fa" : hov ? "#f7f8fa" : "#fff", borderBottom: "1px solid #edf0f4" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onToggle}>
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          {expanded ? <ChevronDown size={12} style={{ color: "#8c94a6" }} /> : <ChevronRight size={12} style={{ color: "#8c94a6" }} />}
          <span className="block truncate text-[12px] font-semibold" style={{ color: "#1a2234" }}>{rel.name}</span>
        </div>
        <div className="w-20 shrink-0 font-mono text-[11px]" style={{ color: "#5c6478" }}>{rel.version}</div>
        <div className="w-28 shrink-0"><ReleaseStatusBadge status={rel.status} /></div>
        <div className="w-24 shrink-0 text-[11px]" style={{ color: "#5c6478" }}>{rel.startDate}</div>
        <div className="w-24 shrink-0 text-[11px]" style={{ color: "#5c6478" }}>{rel.releaseDate}</div>
        <div className="w-28 shrink-0 flex items-center gap-2">
          <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e4e8ed" }}><div className="h-full rounded-full" style={{ width: `${rel.progress}%`, backgroundColor: barColor }} /></div>
          <span className="text-[10px] tabular-nums" style={{ color: "#5c6478" }}>{rel.progress}%</span>
        </div>
        <div className="w-14 shrink-0 text-[11px] text-center tabular-nums" style={{ color: "#5c6478" }}>{rel.totalItems}</div>
        <div className="w-16 shrink-0 text-[11px] text-center tabular-nums" style={{ color: "#1e6930" }}>{rel.completedItems}</div>
        <div className="w-20 shrink-0 text-center text-[11px] tabular-nums" style={{ color: rel.openDefects > 0 ? "#b91c1c" : "#5c6478" }}>{rel.openDefects}</div>
        <div className="w-14 shrink-0 text-center text-[11px] tabular-nums" style={{ color: rel.blockedItems > 0 ? "#b91c1c" : "#5c6478" }}>{rel.blockedItems}</div>
        <div className="w-12 shrink-0 flex justify-center"><Avatar owner={rel.owner} size="xs" /></div>
        <div className="w-16 shrink-0 flex justify-center"><button className="p-0.5 rounded" style={{ color: "#8c94a6" }} onClick={e => e.stopPropagation()}><MoreHorizontal size={14} /></button></div>
      </div>
      {expanded && (
        <div className="px-8 py-4" style={{ backgroundColor: "#f7f9fc", borderBottom: "1px solid #e2e6eb" }}>
          <p className="text-[12px] leading-relaxed mb-3 max-w-3xl" style={{ color: "#3a4254" }}>{rel.description}</p>
          <div className="flex items-center gap-2 mb-3 max-w-md">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#e4e8ed" }}><div className="h-full rounded-full" style={{ width: `${rel.progress}%`, backgroundColor: barColor }} /></div>
            <span className="text-[11px] font-semibold tabular-nums" style={{ color: "#1a2234" }}>{rel.progress}%</span>
          </div>
          <div className="flex gap-3 mb-3">
            {[{ label: "Total Items", value: rel.totalItems, color: "#1a2234" }, { label: "Completed", value: rel.completedItems, color: "#1e6930" }, { label: "Open Defects", value: rel.openDefects, color: rel.openDefects > 0 ? "#b91c1c" : "#1a2234" }, { label: "Blocked", value: rel.blockedItems, color: rel.blockedItems > 0 ? "#b91c1c" : "#1a2234" }].map(t => (
              <div key={t.label} className="bg-white rounded px-4 py-2" style={{ border: "1px solid #e2e6eb", minWidth: 110 }}>
                <p className="text-[9px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "#8c94a6" }}>{t.label}</p>
                <p className="text-[16px] font-semibold leading-none" style={{ color: t.color }}>{t.value}</p>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "#2558a6" }}><ArrowUpRight size={12} /> View Included Items</button>
        </div>
      )}
    </>
  );
}

export function ReleasesPage({ role }: { role: Role }) {
  const [expanded, setExpanded] = useState<string | null>("REL-001");
  const total = RELEASES_DATA.length;
  const inProgress = RELEASES_DATA.filter(r => r.status === "In Progress").length;
  const released = RELEASES_DATA.filter(r => r.status === "Released").length;
  const planned = RELEASES_DATA.filter(r => r.status === "Planned").length;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <h2 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Releases</h2>
        {can.manageBacklog(role) && <button className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}><Plus size={12} /> Create Release</button>}
      </div>
      <div className="flex items-stretch bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb", height: 52 }}>
        {[{ label: "Total Releases", value: String(total), color: "#1a2234" }, { label: "In Progress", value: String(inProgress), color: "#8a5808" }, { label: "Released", value: String(released), color: "#1e6930" }, { label: "Planned", value: String(planned), color: "#475569" }].map((m, i) => (
          <div key={m.label} className="flex flex-col justify-center px-5 gap-0.5" style={{ borderLeft: i > 0 ? "1px solid #e2e6eb" : undefined }}>
            <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>{m.label}</span>
            <span className="text-[17px] font-semibold leading-none" style={{ color: m.color }}>{m.value}</span>
          </div>
        ))}
        <div className="flex-1" style={{ borderLeft: "1px solid #e2e6eb" }} />
      </div>
      <div className="flex-1 overflow-auto bg-white">
        <div className="flex items-center h-8 px-3 gap-2 shrink-0 sticky top-0 z-10" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          {[["flex-1 min-w-0", "Release Name"], ["w-20 shrink-0", "Version"], ["w-28 shrink-0", "Status"], ["w-24 shrink-0", "Start Date"], ["w-24 shrink-0", "Release Date"], ["w-28 shrink-0", "Progress"], ["w-14 shrink-0 text-center", "Total"], ["w-16 shrink-0 text-center", "Completed"], ["w-20 shrink-0 text-center", "Open Defects"], ["w-14 shrink-0 text-center", "Blocked"], ["w-12 shrink-0 text-center", "Owner"], ["w-16 shrink-0 text-center", "Actions"]].map(([cls, label], i) => (
            <div key={i} className={cx(cls, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{label}</div>
          ))}
        </div>
        {RELEASES_DATA.map(rel => (
          <ReleaseRow key={rel.id} rel={rel} expanded={expanded === rel.id} onToggle={() => setExpanded(expanded === rel.id ? null : rel.id)} />
        ))}
      </div>
    </div>
  );
}

