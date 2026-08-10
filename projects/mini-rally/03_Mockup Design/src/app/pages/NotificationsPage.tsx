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

export function NotificationsPage({ onOpenWorkItem }: { onOpenWorkItem: (workItemId: string) => void }) {
  const [filter, setFilter] = useState("all");
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const tabs = [["all", "All"], ["unread", "Unread"], ["assigned", "Assigned"], ["mention", "Mentions"]];
  const iconMap: Record<string, React.ReactNode> = {
    assigned: <Flag size={12} style={{ color: "#6d28d9" }} />,
    mention: <Hash size={12} style={{ color: "#e59f0c" }} />,
  };
  const bgMap: Record<string, string> = { assigned: "#f5f3ff", mention: "#fef5e4" };
  const projectMap: Record<string, string> = { assigned: "Nexus Platform 2025", mention: "Nexus Platform 2025" };
  const filtered = notifs.filter(n => filter === "all" ? true : filter === "unread" ? !n.read : n.type === filter);
  const popup = notifs.find(n => !n.read && n.type === "mention") ?? notifs.find(n => !n.read);
  function openNotification(notification: Notification) {
    setNotifs(prev => prev.map(x => x.id === notification.id ? { ...x, read: true } : x));
    onOpenWorkItem(notification.workItemId);
  }

  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: "#f0f2f5" }}>
      {popup && (
        <button onClick={() => openNotification(popup)} className="fixed right-4 top-14 w-80 bg-white rounded shadow-lg z-40 p-3.5 text-left" style={{ border: "1px solid #bdd0ef", borderLeft: "3px solid #2558a6" }}>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: bgMap[popup.type] || "#f1f5f9" }}>{iconMap[popup.type]}</div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#2558a6" }}>New notification</div>
              <div className="text-[11px] font-semibold mt-0.5" style={{ color: "#1a2234" }}>{popup.title}</div>
              <div className="text-[12px] mt-0.5" style={{ color: "#3a4254" }}>{popup.body}</div>
            </div>
          </div>
        </button>
      )}
      <div className="bg-white px-6 py-4" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div className="flex items-center justify-between">
          <div><h1 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>Notifications</h1><p className="text-[11px]" style={{ color: "#5c6478" }}>{notifs.filter(n => !n.read).length} unread</p></div>
          <button onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))} className="text-[11px] font-medium" style={{ color: "#2558a6" }}>Mark all as read</button>
        </div>
        <div className="flex gap-0.5 mt-3">
          {tabs.map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} className="px-3 py-1.5 text-[11px] font-medium rounded-sm" style={{ backgroundColor: filter === key ? "#1d3f73" : "transparent", color: filter === key ? "#fff" : "#5c6478" }}>{label}</button>
          ))}
        </div>
      </div>
      <div className="max-w-2xl mx-auto py-4 px-4 space-y-2">
        {filtered.length === 0 && <div className="text-center py-16 text-[12px]" style={{ color: "#8c94a6" }}>No notifications in this category.</div>}
        {filtered.map(n => (
            <div key={n.id} className="flex items-start gap-3 bg-white rounded p-3.5 cursor-pointer group" style={{ border: `1px solid ${n.read ? "#edf0f4" : "#bdd0ef"}`, backgroundColor: n.read ? "#fff" : "#f7f9fd", borderLeft: n.read ? "1px solid #edf0f4" : "3px solid #2558a6" }} onClick={() => openNotification(n)}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: bgMap[n.type] || "#f1f5f9" }}>{iconMap[n.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5"><span className="text-[11px] font-semibold" style={{ color: "#1a2234" }}>{n.title}</span>{!n.read && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#f97316" }} />}</div>
                <p className="text-[12px]" style={{ color: "#3a4254" }}>{n.body}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#8c94a6" }}>{n.project || projectMap[n.type] || "Nexus Platform 2025"}</p>
                <div className="flex items-center gap-2 mt-1.5"><Avatar owner={n.user} size="xs" /><span className="text-[10px]" style={{ color: "#8c94a6" }}>{n.time}</span></div>
              </div>
              <button className="flex items-center gap-1 text-[11px] font-medium shrink-0 self-center px-2 py-1 rounded opacity-0 group-hover:opacity-100" style={{ color: "#2558a6" }} onClick={e => { e.stopPropagation(); openNotification(n); }}>Go to item <ChevronRight size={12} /></button>
            </div>
        ))}
      </div>
    </div>
  );
}

