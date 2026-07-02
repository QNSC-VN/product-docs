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
  CheckSquare, Square, Columns, Maximize2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { type Role, type Page, type WorkItemType, type StatusType, type PriorityType, type Owner, type WorkItem, type Notification, type Feature, type Project, type ScopeProject, type Initiative, type ReleaseItem, type WorkspaceUser, type WorkflowStatusItem, type LabelItem, can, OWNERS, PROJECTS, SCOPE_PROJECTS, WORK_ITEMS, FEATURES, NOTIFICATIONS, VELOCITY_DATA, BURNDOWN_DATA, STATUS_PIE, INITIATIVES, RELEASES_DATA, WORKSPACE_USERS, WORKFLOW_STATUSES, LABELS_DATA, WORKLOAD_DATA, PLANNED_VS_COMPLETED, PERMISSIONS_MATRIX, DEFECT_ENVIRONMENTS, RELATED_STORIES } from "../model";

export function releaseStatusCfg(status: ReleaseItem["status"]): { bg: string; text: string; border: string; dot: string } {
  switch (status) {
    case "Planned": return { bg: "#eef3fb", text: "#475569", border: "#cbd5e1", dot: "#64748b" };
    case "In Progress": return { bg: "#fef5e4", text: "#8a5808", border: "#f5d899", dot: "#e59f0c" };
    case "Released": return { bg: "#eef6f0", text: "#1e6930", border: "#a8d5b3", dot: "#2a8c3f" };
    case "Cancelled": return { bg: "#fef2f2", text: "#b91c1c", border: "#fcc5c0", dot: "#dc2626" };
    case "Archived": return { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1", dot: "#94a3b8" };
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function cx(...cls: (string | false | undefined | null)[]) {
  return cls.filter(Boolean).join(" ");
}

// ─── Atom Components ──────────────────────────────────────────────────────────

export function Avatar({ owner, size = "sm" }: { owner: Owner; size?: "xs" | "sm" | "md" | "lg" }) {
  const sz = { xs: "w-5 h-5 text-[9px]", sm: "w-6 h-6 text-[10px]", md: "w-7 h-7 text-[11px]", lg: "w-8 h-8 text-xs" };
  return (
    <div className={cx("rounded-full flex items-center justify-center font-semibold text-white shrink-0", sz[size])} style={{ backgroundColor: owner.color }} title={owner.name}>
      {owner.initials}
    </div>
  );
}

export const TYPE_CFG: Record<WorkItemType, { bg: string; text: string; border: string }> = {
  Story: { bg: "#eef2ff", text: "#3550b8", border: "#c7d4f5" },
  Defect: { bg: "#fff1f0", text: "#b91c1c", border: "#fcc5c0" },
  Task: { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" },
  Feature: { bg: "#f5f3ff", text: "#6d28d9", border: "#d0c6f5" },
};

export function TypeBadge({ type }: { type: WorkItemType }) {
  const c = TYPE_CFG[type];
  return <span className="inline-flex items-center px-1.5 py-px text-[10px] font-semibold rounded-sm whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}>{type}</span>;
}

export const STATUS_CFG: Record<StatusType, { bg: string; text: string; border: string; dot: string }> = {
  Idea: { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1", dot: "#94a3b8" },
  Defined: { bg: "#eef3fb", text: "#2558a6", border: "#bdd0ef", dot: "#2558a6" },
  "In-Progress": { bg: "#fef5e4", text: "#8a5808", border: "#f5d899", dot: "#e59f0c" },
  "Code Review": { bg: "#f0f7ff", text: "#0369a1", border: "#bae6fd", dot: "#0ea5e9" },
  Testing: { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff", dot: "#a855f7" },
  Completed: { bg: "#eef6f0", text: "#1e6930", border: "#a8d5b3", dot: "#2a8c3f" },
  Accepted: { bg: "#eaf0fb", text: "#1d3f73", border: "#99b8e0", dot: "#1d3f73" },
  Release: { bg: "#f5f3ff", text: "#6d28d9", border: "#d0c6f5", dot: "#7c3aed" },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const c = STATUS_CFG[status];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-px text-[11px] font-medium rounded-sm whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.dot }} />
      {status === "Completed" ? "Done" : status}
    </span>
  );
}

export const PRI_CFG: Record<PriorityType, { dot: string; bg: string; text: string }> = {
  Critical: { dot: "#dc2626", bg: "#fef2f2", text: "#b91c1c" },
  High: { dot: "#ea8c2a", bg: "#fff7ed", text: "#c2610c" },
  Medium: { dot: "#d4a017", bg: "#fefce8", text: "#a36a00" },
  Low: { dot: "#6b9e73", bg: "#f0f7f1", text: "#2d6a36" },
};

export function PriorityBadge({ priority }: { priority: PriorityType }) {
  const c = PRI_CFG[priority];
  return <span className="inline-flex items-center gap-1 px-1.5 py-px text-[10px] font-semibold rounded-sm whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.text }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />{priority}</span>;
}

export function MiniProgress({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  const track = pct === 100 ? "#2a8c3f" : pct > 50 ? "#2558a6" : "#e59f0c";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e4e8ed" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: track }} />
      </div>
      <span className="text-[10px] tabular-nums" style={{ color: "#8c94a6" }}>{value}/{max}</span>
    </div>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  const colors: Record<Role, { bg: string; text: string }> = {
    "Workspace Admin": { bg: "#fef2f2", text: "#b91c1c" },
    "Project Manager": { bg: "#eef3fb", text: "#2558a6" },
    "Product Owner": { bg: "#f5f3ff", text: "#6d28d9" },
    Developer: { bg: "#eef6f0", text: "#1e6930" },
    Tester: { bg: "#fef5e4", text: "#8a5808" },
    Viewer: { bg: "#f1f5f9", text: "#475569" },
  };
  const c = colors[role];
  return <span className="px-2 py-px text-[10px] font-semibold rounded-sm" style={{ backgroundColor: c.bg, color: c.text }}>{role}</span>;
}


export function DetailPanel({ item, onClose, role, onOpenFull }: { item: WorkItem; onClose: () => void; role: Role; onOpenFull?: (item: WorkItem) => void }) {
  const [comment, setComment] = useState("");
  return (
    <div className="w-80 flex flex-col bg-white shrink-0 overflow-hidden" style={{ borderLeft: "1px solid #e2e6eb" }}>
      <div className="flex items-start justify-between px-4 py-3 shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5"><TypeBadge type={item.type} /><span className="font-mono text-[11px]" style={{ color: "#8c94a6" }}>{item.id}</span></div>
          <p className="text-[13px] font-semibold leading-snug" style={{ color: "#1a2234" }}>{item.title}</p>
        </div>
        <div className="ml-2 flex items-center gap-1 shrink-0">
          {onOpenFull && <button aria-label="Expand work item to full page" title="Open full detail" onClick={() => onOpenFull(item)} className="p-1 rounded" style={{ color: "#5c6478" }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#edf2fb"; e.currentTarget.style.color = "#1d3f73"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#5c6478"; }}><Maximize2 size={14} /></button>}
          <button aria-label="Close work item panel" onClick={onClose} className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f4f6f9"; e.currentTarget.style.color = "#1a2234"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8c94a6"; }}><X size={14} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-[9px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#8c94a6" }}>Status</p><StatusBadge status={item.status} /></div>
          <div><p className="text-[9px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#8c94a6" }}>Priority</p><PriorityBadge priority={item.priority} /></div>
        </div>
        <div><p className="text-[9px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#8c94a6" }}>Owner</p><div className="flex items-center gap-2"><Avatar owner={item.owner} size="sm" /><span className="text-[12px] font-medium" style={{ color: "#1a2234" }}>{item.owner.name}</span></div></div>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#8c94a6" }}>Plan Estimate</p><p className="text-[12px] font-mono" style={{ color: "#1a2234" }}>{item.planEstimate} pts</p></div>
          <div><p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#8c94a6" }}>Release</p><p className="text-[12px]" style={{ color: "#1a2234" }}>{item.release}</p></div>
        </div>
        <div><p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#8c94a6" }}>Iteration</p><p className="text-[12px]" style={{ color: "#1a2234" }}>{item.iteration}</p></div>
        {item.dueDate && <div><p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#8c94a6" }}>Due Date</p><p className="text-[12px]" style={{ color: "#1a2234" }}>{item.dueDate}</p></div>}
        <div><p className="text-[9px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#8c94a6" }}>Tasks</p><MiniProgress value={item.completedTasks} max={item.taskCount} /></div>
        {item.tags.length > 0 && <div><p className="text-[9px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#8c94a6" }}>Tags</p><div className="flex flex-wrap gap-1">{item.tags.map(tag => <span key={tag} className="px-2 py-px text-[10px] font-medium rounded-sm" style={{ backgroundColor: "#f0f2f5", color: "#5c6478", border: "1px solid #dde2ea" }}>{tag}</span>)}</div></div>}
        <div style={{ borderTop: "1px solid #edf0f4", paddingTop: 12 }}>
          <p className="text-[9px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#8c94a6" }}>Description</p>
          <p className="text-[12px] leading-relaxed" style={{ color: "#3a4254" }}>{item.description}</p>
        </div>
        <div style={{ borderTop: "1px solid #edf0f4", paddingTop: 12 }}>
          <p className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#8c94a6" }}>Activity</p>
          {can.edit(role) ? (
            <div className="flex gap-2"><Avatar owner={OWNERS[0]} size="xs" /><input type="text" placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} className="flex-1 text-[12px] px-2.5 py-1.5 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", backgroundColor: "#f7f8fa", color: "#1a2234" }} /></div>
          ) : <p className="text-[11px]" style={{ color: "#8c94a6" }}>Comments are read-only for your role.</p>}
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
        <span className="text-[10px]" style={{ color: "#8c94a6" }}>Updated {item.lastUpdated}</span>
        <div className="flex items-center gap-1">
          {[Paperclip, Link2, Edit3].map((Icon, i) => <button key={i} className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => (e.currentTarget.style.color = "#1a2234")} onMouseLeave={e => (e.currentTarget.style.color = "#8c94a6")}><Icon size={12} /></button>)}
        </div>
      </div>
    </div>
  );
}

// ─── New Item Modal ───────────────────────────────────────────────────────────

export function NewItemModal({ onClose, defaultType, allowedTypes = ["Feature", "Story", "Defect", "Task"] }: { onClose: () => void; defaultType?: WorkItemType; allowedTypes?: WorkItemType[] }) {
  const [type, setType] = useState<WorkItemType>(defaultType && allowedTypes.includes(defaultType) ? defaultType : allowedTypes[0]);
  const [title, setTitle] = useState("");
  const [projectKey, setProjectKey] = useState(SCOPE_PROJECTS[0].key);
  const [team, setTeam] = useState(SCOPE_PROJECTS[0].teams[0]);
  const selectedProject = SCOPE_PROJECTS.find(project => project.key === projectKey) || SCOPE_PROJECTS[0];
  function selectProject(nextProjectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(project => project.key === nextProjectKey) || SCOPE_PROJECTS[0];
    setProjectKey(nextProject.key);
    setTeam(nextProject.teams[0]);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <div className="relative bg-white rounded shadow-2xl flex flex-col overflow-hidden" style={{ width: 520, maxHeight: "80vh", border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          <div><p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>New Work Item</p><p className="text-[11px]" style={{ color: "#8c94a6" }}>{selectedProject.name} · {team}</p></div>
          <button onClick={onClose} className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#edf0f4"; e.currentTarget.style.color = "#1a2234"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8c94a6"; }}><X size={15} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#5c6478" }}>Type</label>
            <div className="flex gap-2">{allowedTypes.map(t => { const c = TYPE_CFG[t]; return <button key={t} onClick={() => setType(t)} className="flex-1 py-1.5 text-[11px] font-semibold rounded-sm" style={{ backgroundColor: type === t ? c.bg : "transparent", color: type === t ? c.text : "#5c6478", border: `1px solid ${type === t ? c.border : "#dde2ea"}` }}>{t}</button>; })}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Project</label><select aria-label="Project" value={projectKey} onChange={event => selectProject(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{SCOPE_PROJECTS.map(project => <option key={project.key} value={project.key}>{project.key} · {project.name}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Team</label><select aria-label="Team" value={team} onChange={event => setTeam(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{selectedProject.teams.map(projectTeam => <option key={projectTeam}>{projectTeam}</option>)}</select></div>
          </div>
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Title <span style={{ color: "#dc2626" }}>*</span></label>
            <input autoFocus type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a concise, descriptive title..." className="w-full text-[13px] px-3 py-2 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} onFocus={e => (e.currentTarget.style.borderColor = "rgba(29,63,115,0.4)")} onBlur={e => (e.currentTarget.style.borderColor = "#dde2ea")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Owner</label><select className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Plan Estimate (pts)</label><input type="number" min={0} placeholder="0" className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} /></div>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
          <span className="text-[10px]" style={{ color: "#8c94a6" }}>Ctrl+Enter to save</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3.5 py-1.5 text-[12px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#edf0f4")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>Cancel</button>
            <button onClick={onClose} className="px-4 py-1.5 text-[12px] font-semibold rounded" style={{ border: "1px solid #9fb5d5", color: "#1d3f73", backgroundColor: "#f5f8fc" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e8eff8")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f5f8fc")}>Create with details</button>
            <button onClick={onClose} className="px-4 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}>Create Item</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({ message = "No items found" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "#eef2ff" }}><Search size={22} style={{ color: "#3550b8" }} /></div>
      <p className="text-[13px] font-semibold mb-1" style={{ color: "#1a2234" }}>{message}</p>
      <p className="text-[12px] max-w-xs" style={{ color: "#5c6478" }}>Adjust filters or search criteria to see results.</p>
    </div>
  );
}


export function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded" style={{ border: "1px solid #e2e6eb" }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid #edf0f4", backgroundColor: "#f7f8fa" }}>
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#5c6478" }}>{title}</span>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

