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

export function HomePage({ role, onNavigate }: { role: Role; onNavigate: (p: Page) => void }) {
  const myItems = WORK_ITEMS.filter(i => i.owner === OWNERS[0] && i.status !== "Accepted");
  const openDefects = WORK_ITEMS.filter(i => i.type === "Defect" && !["Accepted"].includes(i.status)).length;
  const blockedItems = WORK_ITEMS.filter(i => i.blocked).length;
  const activeProjects = PROJECTS.length;
  const openItems = WORK_ITEMS.filter(i => !["Accepted", "Completed"].includes(i.status)).length;

  const summaryMetrics = [
    { label: "Active Projects", value: String(activeProjects), color: "#1d3f73", action: () => onNavigate("portfolio") },
    { label: "Open Work Items", value: String(openItems), color: "#1a2234", action: () => onNavigate("backlog") },
    { label: "Active Sprints", value: "4", color: "#1a2234", action: () => onNavigate("track") },
    { label: "Blocked Items", value: String(blockedItems), color: blockedItems > 0 ? "#b91c1c" : "#1a2234", action: () => onNavigate("backlog") },
    { label: "Open Defects", value: String(openDefects), color: openDefects > 2 ? "#b91c1c" : "#1a2234", action: () => onNavigate("quality") },
    { label: "Assigned to Me", value: String(myItems.length), color: "#2558a6", action: () => {} },
  ];

  const activityFeed = [
    { icon: <Activity size={12} style={{ color: "#2558a6" }} />, bg: "#eef3fb", text: "US-4821 status changed to In-Progress by Marcus Webb", time: "2h ago" },
    { icon: <MessageSquare size={12} style={{ color: "#1d3f73" }} />, bg: "#eef2ff", text: "Sarah Chen commented on DE-1142 — heap profile attached", time: "4h ago" },
    { icon: <Flag size={12} style={{ color: "#7e22ce" }} />, bg: "#faf5ff", text: "US-554 moved to Testing by Priya Nair", time: "5h ago" },
    { icon: <Paperclip size={12} style={{ color: "#5c4a87" }} />, bg: "#faf5ff", text: "Priya Nair attached wireframes-v3.pdf to FE-318", time: "6h ago" },
    { icon: <Zap size={12} style={{ color: "#e59f0c" }} />, bg: "#fef5e4", text: "Sprint 24.3 started — 9 items, 47 planned points", time: "Oct 14" },
    { icon: <Archive size={12} style={{ color: "#3d7a4e" }} />, bg: "#eef6f0", text: "Release Q4 2024 target confirmed — Nov 1, 2024", time: "Oct 13" },
  ];

  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: "#f0f2f5" }}>
      {/* Page title */}
      <div className="bg-white px-6 py-3 shrink-0 flex items-center justify-between" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <h1 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>Home</h1>
        <div className="text-[11px]" style={{ color: "#5c6478" }}>Good morning, Marcus Webb · <span className="font-medium" style={{ color: "#1a2234" }}>Monday, Oct 22, 2024</span></div>
      </div>

      {/* Summary strip */}
      <div className="flex bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        {summaryMetrics.map((m, i) => (
          <button key={m.label} onClick={m.action} className="flex flex-col justify-center px-5 py-3 text-left transition-colors" style={{ borderLeft: i > 0 ? "1px solid #e2e6eb" : undefined, flex: 1 }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f7f8fa")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
            <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>{m.label}</span>
            <span className="text-[20px] font-semibold leading-tight" style={{ color: m.color }}>{m.value}</span>
          </button>
        ))}
      </div>

      <div className="p-4 grid grid-cols-3 gap-4">
        {/* My Work table */}
        <div className="col-span-2 bg-white rounded" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid #e2e6eb" }}>
            <p className="text-[12px] font-semibold" style={{ color: "#1a2234" }}>My Work</p>
            <span className="text-[10px] font-semibold px-1.5 py-px rounded-sm" style={{ backgroundColor: "#eef3fb", color: "#2558a6" }}>{myItems.length} items</span>
          </div>
          {/* My Work header */}
          <div className="flex items-center h-7 px-3 gap-2 select-none" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {[["w-[60px] shrink-0", "ID"], ["w-16 shrink-0", "Type"], ["flex-1 min-w-0 pr-2", "Name"], ["w-24 shrink-0", "Project"], ["w-24 shrink-0", "Status"], ["w-[80px] shrink-0", "Priority"], ["w-24 shrink-0", "Due Date"]].map(([cls, label], i) => (
              <div key={i} className={cx(cls as string, "text-[9px] font-semibold uppercase tracking-widest")} style={{ color: "#8c94a6" }}>{label}</div>
            ))}
          </div>
          {myItems.slice(0, 6).map(item => (
            <div key={item.id} className="flex items-center h-8 px-3 gap-2 hover:bg-[#f7f8fa] cursor-pointer" style={{ borderBottom: "1px solid #edf0f4" }}>
              <div className="w-[60px] shrink-0 font-mono text-[10px]" style={{ color: "#5c6478" }}>{item.id}</div>
              <div className="w-16 shrink-0"><TypeBadge type={item.type} /></div>
              <div className="flex-1 min-w-0 pr-2"><span className="block truncate text-[12px] font-medium" style={{ color: "#1a2234" }}>{item.title}</span></div>
              <div className="w-24 shrink-0 text-[10px] font-mono" style={{ color: "#5c6478" }}>{item.project || "NXP"}</div>
              <div className="w-24 shrink-0"><StatusBadge status={item.status} /></div>
              <div className="w-[80px] shrink-0"><PriorityBadge priority={item.priority} /></div>
              <div className="w-24 shrink-0 text-[10px]" style={{ color: item.dueDate ? "#1a2234" : "#8c94a6" }}>{item.dueDate || "—"}</div>
            </div>
          ))}
          {myItems.length > 6 && <div className="px-4 py-2"><button className="text-[11px]" style={{ color: "#2558a6" }}>+ {myItems.length - 6} more items</button></div>}
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid #e2e6eb" }}>
            <p className="text-[12px] font-semibold" style={{ color: "#1a2234" }}>Recent Activity</p>
            <button onClick={() => onNavigate("notifications")} className="text-[11px]" style={{ color: "#2558a6" }}>All</button>
          </div>
          <div className="p-3 space-y-2.5">
            {activityFeed.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: a.bg }}>{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] leading-snug" style={{ color: "#1a2234" }}>{a.text}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#8c94a6" }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Health table */}
        <div className="col-span-3 bg-white rounded" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid #e2e6eb" }}>
            <p className="text-[12px] font-semibold" style={{ color: "#1a2234" }}>Project Health</p>
            <button onClick={() => onNavigate("portfolio")} className="text-[11px]" style={{ color: "#2558a6" }}>View Portfolio</button>
          </div>
          {/* Header */}
          <div className="flex items-center h-7 px-4 gap-3 select-none" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {[["w-14 shrink-0", "Key"], ["flex-1 min-w-0", "Project Name"], ["w-32 shrink-0", "Active Sprint"], ["w-36 shrink-0", "Progress"], ["w-24 shrink-0", "Open Defects"], ["w-24 shrink-0", "Blocked"], ["w-32 shrink-0", "Owner"]].map(([cls, label], i) => (
              <div key={i} className={cx(cls as string, "text-[9px] font-semibold uppercase tracking-widest")} style={{ color: "#8c94a6" }}>{label}</div>
            ))}
          </div>
          {PROJECTS.map(proj => (
            <div key={proj.key} className="flex items-center h-9 px-4 gap-3 hover:bg-[#f7f8fa] cursor-pointer" style={{ borderBottom: "1px solid #edf0f4" }}>
              <div className="w-14 shrink-0"><span className="font-mono text-[10px] font-semibold px-1.5 py-px rounded-sm" style={{ backgroundColor: "#f0f2f5", color: "#5c6478" }}>{proj.key}</span></div>
              <div className="flex-1 min-w-0"><span className="block truncate text-[12px] font-medium" style={{ color: "#1a2234" }}>{proj.name}</span></div>
              <div className="w-32 shrink-0 text-[11px]" style={{ color: "#5c6478" }}>{proj.activeSprint}</div>
              <div className="w-36 shrink-0 flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e4e8ed" }}>
                  <div className="h-full rounded-full" style={{ width: `${proj.progress}%`, backgroundColor: proj.progress >= 70 ? "#2a8c3f" : proj.progress >= 40 ? "#2558a6" : "#e59f0c" }} />
                </div>
                <span className="text-[10px] font-semibold tabular-nums" style={{ color: "#5c6478" }}>{proj.progress}%</span>
              </div>
              <div className="w-24 shrink-0">
                <span className="text-[12px] font-semibold tabular-nums" style={{ color: proj.openDefects > 0 ? "#b91c1c" : "#2a8c3f" }}>{proj.openDefects}</span>
                <span className="text-[10px] ml-1" style={{ color: "#8c94a6" }}>{proj.openDefects === 1 ? "defect" : "defects"}</span>
              </div>
              <div className="w-24 shrink-0">
                {proj.blocked > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: "#b91c1c" }}>
                    <AlertTriangle size={11} />{proj.blocked} blocked
                  </span>
                ) : <span className="text-[10px]" style={{ color: "#2a8c3f" }}>None</span>}
              </div>
              <div className="w-32 shrink-0 flex items-center gap-1.5"><Avatar owner={proj.owner} size="xs" /><span className="text-[11px] truncate" style={{ color: "#5c6478" }}>{proj.owner.name}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

