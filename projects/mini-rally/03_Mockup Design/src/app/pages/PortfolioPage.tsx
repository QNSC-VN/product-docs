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

export function InitiativeTypeBadge() {
  return <span className="inline-flex items-center px-1.5 py-px text-[10px] font-semibold rounded-sm whitespace-nowrap" style={{ backgroundColor: "#fef3e2", color: "#7c5c2d", border: "1px solid #f0d9b5" }}>Initiative</span>;
}

export function PortfolioRow({ level, chevron, expanded, onToggle, id, idColor, badge, title, weight, owner, status, progressPct, progressLabel, release, related, blocked, updated }: {
  level: number; chevron: boolean; expanded?: boolean; onToggle?: () => void;
  id: string; idColor: string; badge: React.ReactNode; title: string; weight: number;
  owner: Owner; status: StatusType; progressPct: number; progressLabel: string;
  release: string; related: number | string; blocked: number; updated: string;
}) {
  const [hov, setHov] = useState(false);
  const barColor = progressPct === 100 ? "#2a8c3f" : progressPct > 50 ? "#2558a6" : "#e59f0c";
  return (
    <div className="flex items-center h-9 px-3 gap-2 cursor-pointer" style={{ backgroundColor: hov ? "#f7f8fa" : level === 0 ? "#fff" : "#fcfdfe", borderBottom: "1px solid #edf0f4" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onToggle}>
      <div className="w-20 shrink-0 flex items-center gap-1" style={{ paddingLeft: level * 24 }}>
        <span className="w-3.5 flex justify-center">{chevron ? (expanded ? <ChevronDown size={12} style={{ color: "#8c94a6" }} /> : <ChevronRight size={12} style={{ color: "#8c94a6" }} />) : null}</span>
        <span className="font-mono text-[10px]" style={{ color: idColor, fontWeight: level < 2 ? 600 : 400 }}>{id}</span>
      </div>
      <div className="w-20 shrink-0">{badge}</div>
      <div className="flex-1 min-w-0 pr-3"><span className="block truncate text-[12px]" style={{ color: "#1a2234", fontWeight: weight }}>{title}</span></div>
      <div className="w-28 shrink-0 flex items-center gap-1.5"><Avatar owner={owner} size="xs" /><span className="text-[10px] truncate" style={{ color: "#5c6478" }}>{owner.initials}</span></div>
      <div className="w-24 shrink-0"><StatusBadge status={status} /></div>
      <div className="w-32 shrink-0 flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e4e8ed" }}><div className="h-full rounded-full" style={{ width: `${progressPct}%`, backgroundColor: barColor }} /></div>
        <span className="text-[10px] tabular-nums" style={{ color: "#5c6478" }}>{progressLabel}</span>
      </div>
      <div className="w-24 shrink-0 text-[11px]" style={{ color: "#5c6478" }}>{release}</div>
      <div className="w-16 shrink-0 text-[11px] text-center tabular-nums" style={{ color: "#5c6478" }}>{related}</div>
      <div className="w-16 shrink-0 text-center">{Number(blocked) > 0 ? <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: "#b91c1c" }}><AlertTriangle size={10} />{blocked}</span> : <span className="text-[10px]" style={{ color: "#c4cad4" }}>—</span>}</div>
      <div className="w-20 shrink-0 text-[10px]" style={{ color: "#8c94a6" }}>{updated}</div>
    </div>
  );
}

export function PortfolioPage({ role }: { role: Role }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["IN-01", "FE-318", "FE-311"]));
  const [showModal, setShowModal] = useState(false);
  const stories = WORK_ITEMS.filter(i => i.type === "Story");
  function toggle(id: string) { setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-stretch bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb", height: 50 }}>
        {[{ label: "Initiatives", value: String(INITIATIVES.length), color: "#1a2234" }, { label: "Features", value: String(FEATURES.length), color: "#1a2234" }, { label: "Total Stories", value: String(FEATURES.reduce((s, f) => s + f.storyCount, 0)), color: "#1a2234" }, { label: "Accepted Stories", value: String(FEATURES.reduce((s, f) => s + f.completedStories, 0)), color: "#1e6930" }, { label: "Total Points", value: String(INITIATIVES.reduce((s, f) => s + f.planEstimate, 0)), color: "#2558a6" }].map((m, i) => (
          <div key={m.label} className="flex flex-col justify-center px-5 gap-0.5" style={{ borderLeft: i > 0 ? "1px solid #e2e6eb" : undefined }}>
            <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>{m.label}</span>
            <span className="text-[17px] font-semibold leading-none" style={{ color: m.color }}>{m.value}</span>
          </div>
        ))}
        <div className="flex-1" style={{ borderLeft: "1px solid #e2e6eb" }} />
      </div>
      <div className="flex items-center gap-2 px-4 py-1.5 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <h2 className="text-[13px] font-semibold mr-2" style={{ color: "#1a2234" }}>Portfolio Hierarchy</h2>
        <button className="flex items-center gap-1.5 px-2 py-1 text-[11px] rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><Filter size={11} /> Filter</button>
        <div className="flex-1" />
        <SavedViewsDrop />
        {can.create(role) && <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded ml-1" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}><Plus size={12} /> New Initiative</button>}
      </div>
      <div className="flex-1 overflow-auto bg-white">
        <div className="flex items-center h-8 px-3 gap-2 shrink-0 sticky top-0 z-10" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          {[["w-20 shrink-0", "ID"], ["w-20 shrink-0", "Type"], ["flex-1 min-w-0 pr-3", "Name"], ["w-28 shrink-0", "Owner"], ["w-24 shrink-0", "Status"], ["w-32 shrink-0", "Progress"], ["w-24 shrink-0", "Target Release"], ["w-16 shrink-0 text-center", "Related"], ["w-16 shrink-0 text-center", "Blocked"], ["w-20 shrink-0", "Updated"]].map(([cls, label], i) => (
            <div key={i} className={cx(cls, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{label}</div>
          ))}
        </div>
        {INITIATIVES.map(init => {
          const initExp = expanded.has(init.id);
          const initFeatures = FEATURES.filter(f => init.featureIds.includes(f.id));
          const accepted = initFeatures.reduce((s, f) => s + f.completedStories, 0);
          const total = initFeatures.reduce((s, f) => s + f.storyCount, 0);
          const initPct = total > 0 ? Math.round((accepted / total) * 100) : 0;
          return (
            <div key={init.id}>
              <PortfolioRow level={0} chevron expanded={initExp} onToggle={() => toggle(init.id)} id={init.id} idColor="#2558a6" badge={<InitiativeTypeBadge />} title={init.title} weight={700} owner={init.owner} status={init.status} progressPct={initPct} progressLabel={`${initPct}%`} release={init.release} related={init.relatedCount} blocked={init.blockedCount} updated={init.updatedAt} />
              {initExp && initFeatures.map(feat => {
                const featExp = expanded.has(feat.id);
                const featPct = feat.storyCount > 0 ? Math.round((feat.completedStories / feat.storyCount) * 100) : 0;
                const featStories = stories.slice(0, Math.min(feat.storyCount, 3));
                return (
                  <div key={feat.id}>
                    <PortfolioRow level={1} chevron expanded={featExp} onToggle={() => toggle(feat.id)} id={feat.id} idColor="#6d28d9" badge={<TypeBadge type="Feature" />} title={feat.title} weight={500} owner={feat.owner} status={feat.status} progressPct={featPct} progressLabel={`${featPct}% (${feat.completedStories}/${feat.storyCount})`} release={feat.release} related={feat.storyCount} blocked={0} updated="Oct 20, 2024" />
                    {featExp && featStories.map((s, si) => {
                      const sPct = s.taskCount > 0 ? Math.round((s.completedTasks / s.taskCount) * 100) : 0;
                      return <PortfolioRow key={si} level={2} chevron={false} id={s.id} idColor="#2558a6" badge={<TypeBadge type="Story" />} title={s.title} weight={400} owner={s.owner} status={s.status} progressPct={sPct} progressLabel={`${s.completedTasks}/${s.taskCount}`} release={s.release} related={s.commentCount ?? 0} blocked={s.blocked ? 1 : 0} updated={s.lastUpdated} />;
                    })}
                    {featExp && feat.storyCount > 3 && (
                      <div className="flex items-center h-7 px-3" style={{ backgroundColor: "#fcfdfe", borderBottom: "1px solid #f0f2f5", paddingLeft: 48 + 12 }}>
                        <button className="text-[11px]" style={{ color: "#2558a6" }}>+ {feat.storyCount - 3} more stories</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {showModal && <NewItemModal onClose={() => setShowModal(false)} defaultType="Feature" />}
    </div>
  );
}

