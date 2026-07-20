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

export function Widget({ title, span = 1, children }: { title: string; span?: number; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded p-4" style={{ border: "1px solid #e2e6eb", gridColumn: `span ${span}` }}>
      <p className="text-[11px] font-semibold mb-3" style={{ color: "#1a2234" }}>{title}</p>
      {children}
    </div>
  );
}

export function ReportsPage({ role, readOnly = false }: { role: Role; readOnly?: boolean }) {
  const canExport = !readOnly && role !== "Project Member";
  const blockedItems = WORK_ITEMS.filter(i => i.blocked);
  const defectSummary = [
    { label: "Open", value: 3, color: "#8a5808" },
    { label: "Critical", value: 1, color: "#b91c1c" },
    { label: "In Progress", value: 1, color: "#7e22ce" },
    { label: "Resolved", value: 2, color: "#1e6930" },
  ];
  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: "#f0f2f5" }}>
      <div className="bg-white px-6 py-3 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div><h2 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>Reports</h2><p className="text-[11px]" style={{ color: "#5c6478" }}>Nexus Platform 2025 · Core Platform Team · Last 6 Sprints</p></div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><Columns size={12} /> Customize Dashboard</button>
          {canExport && <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}><Download size={12} /> Export Report</button>}
        </div>
      </div>

      <div className="p-4" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {/* Row 1 */}
        <Widget title="Sprint Burndown — Sprint 24.3" span={2}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={BURNDOWN_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#8c94a6" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#8c94a6" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e2e6eb", borderRadius: 3 }} />
              <Area type="monotone" dataKey="ideal" stroke="#c4cad4" fill="none" strokeDasharray="4 3" strokeWidth={1.5} dot={false} name="Ideal" />
              <Area type="monotone" dataKey="remaining" stroke="#1d3f73" fill="rgba(29,63,115,0.08)" strokeWidth={2} dot={{ r: 2, fill: "#1d3f73" }} connectNulls={false} name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
        </Widget>
        <Widget title="Sprint Velocity">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={VELOCITY_DATA} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fontSize: 9, fill: "#8c94a6" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#8c94a6" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e2e6eb", borderRadius: 3 }} />
              <Bar dataKey="planned" fill="#dde3ee" radius={[2, 2, 0, 0]} />
              <Bar dataKey="accepted" fill="#1d3f73" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Widget>

        {/* Row 2 */}
        <Widget title="Status Distribution">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart><Pie data={STATUS_PIE} cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={2} dataKey="value">{STATUS_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e2e6eb", borderRadius: 3 }} /></PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-1">{STATUS_PIE.map(s => <span key={s.name} className="flex items-center gap-1 text-[10px]" style={{ color: "#5c6478" }}><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: s.color }} />{s.name} <span className="font-semibold" style={{ color: "#1a2234" }}>{s.value}</span></span>)}</div>
        </Widget>
        <Widget title="Defect Summary">
          <div className="space-y-2.5 pt-1">
            {defectSummary.map(d => (
              <div key={d.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[12px]" style={{ color: "#3a4254" }}><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />{d.label}</span>
                <span className="text-[13px] font-semibold tabular-nums" style={{ color: d.color }}>{d.value}</span>
              </div>
            ))}
          </div>
        </Widget>
        <Widget title="Release Progress">
          <div className="space-y-3 pt-1">
            {RELEASES_DATA.slice(0, 3).map(r => {
              const barColor = r.progress === 100 ? "#2a8c3f" : r.progress > 50 ? "#2558a6" : "#e59f0c";
              return (
                <div key={r.id}>
                  <div className="flex items-center justify-between mb-1"><span className="text-[10px] truncate pr-2" style={{ color: "#3a4254" }}>{r.name}</span><span className="text-[10px] font-semibold tabular-nums" style={{ color: "#5c6478" }}>{r.progress}%</span></div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e4e8ed" }}><div className="h-full rounded-full" style={{ width: `${r.progress}%`, backgroundColor: barColor }} /></div>
                </div>
              );
            })}
          </div>
        </Widget>

        {/* Row 3 */}
        <Widget title="Workload by Owner" span={2}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={WORKLOAD_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="owner" tick={{ fontSize: 9, fill: "#8c94a6" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#8c94a6" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e2e6eb", borderRadius: 3 }} />
              <Bar dataKey="planned" stackId="w" fill="#c7d4f5" />
              <Bar dataKey="inProgress" stackId="w" fill="#e59f0c" />
              <Bar dataKey="accepted" stackId="w" fill="#1d3f73" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 text-[10px] mt-1 justify-center" style={{ color: "#5c6478" }}>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block" style={{ backgroundColor: "#c7d4f5" }} /> Planned</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block" style={{ backgroundColor: "#e59f0c" }} /> In Progress</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2 rounded-sm inline-block" style={{ backgroundColor: "#1d3f73" }} /> Accepted</span>
          </div>
        </Widget>
        <Widget title="Blocked Items">
          <div className="space-y-2 pt-1">
            {blockedItems.length === 0 ? <p className="text-[11px]" style={{ color: "#8c94a6" }}>No blocked items.</p> : blockedItems.map(i => (
              <div key={i.id} className="flex items-start gap-2">
                <AlertTriangle size={12} style={{ color: "#b91c1c", marginTop: 1 }} className="shrink-0" />
                <div className="min-w-0"><p className="text-[11px] truncate" style={{ color: "#1a2234" }}><span className="font-mono" style={{ color: "#8c94a6" }}>{i.id}</span> {i.title}</p></div>
              </div>
            ))}
          </div>
        </Widget>

        {/* Row 4 */}
        <Widget title="Planned vs Completed" span={2}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={PLANNED_VS_COMPLETED}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="sprint" tick={{ fontSize: 9, fill: "#8c94a6" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#8c94a6" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e2e6eb", borderRadius: 3 }} />
              <Area type="monotone" dataKey="planned" stroke="#b0b8c8" fill="rgba(176,184,200,0.15)" strokeWidth={1.5} dot={false} name="Planned" />
              <Area type="monotone" dataKey="completed" stroke="#1d3f73" fill="rgba(29,63,115,0.12)" strokeWidth={2} dot={false} name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </Widget>
        <Widget title="Recent Activity">
          <div className="space-y-2.5 pt-1">
            {NOTIFICATIONS.slice(0, 4).map(n => (
              <div key={n.id} className="flex items-start gap-2">
                <Avatar owner={n.user} size="xs" />
                <div className="min-w-0"><p className="text-[11px] leading-snug" style={{ color: "#3a4254" }}>{n.body}</p><p className="text-[10px] mt-0.5" style={{ color: "#8c94a6" }}>{n.time}</p></div>
              </div>
            ))}
          </div>
        </Widget>

        {/* Sprint Progress strip */}
        <Widget title="Current Sprint Progress — Sprint 24.3" span={3}>
          <div className="flex gap-3">
            {[{ label: "Committed Points", value: "47", color: "#1a2234" }, { label: "Accepted Points", value: "16", color: "#1e6930" }, { label: "Remaining", value: "31", color: "#8a5808" }, { label: "Days Left", value: "6", color: "#b91c1c" }, { label: "Completion", value: "34%", color: "#2558a6" }].map((t, i) => (
              <div key={t.label} className="flex flex-col justify-center px-4 py-1" style={{ borderLeft: i > 0 ? "1px solid #edf0f4" : undefined, flex: 1 }}>
                <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>{t.label}</span>
                <span className="text-[18px] font-semibold leading-tight" style={{ color: t.color }}>{t.value}</span>
              </div>
            ))}
          </div>
        </Widget>
      </div>
    </div>
  );
}

