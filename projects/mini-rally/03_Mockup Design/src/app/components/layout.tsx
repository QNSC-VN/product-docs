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
import { type Role, type Page, type WorkItemType, type StatusType, type PriorityType, type Owner, type WorkItem, type Notification, type Feature, type Project, type ScopeProject, type Initiative, type ReleaseItem, type WorkspaceUser, type WorkflowStatusItem, type LabelItem, can, OWNERS, PROJECTS, ROLE_SCOPE, SCOPE_PROJECTS, WORK_ITEMS, FEATURES, NOTIFICATIONS, VELOCITY_DATA, BURNDOWN_DATA, STATUS_PIE, INITIATIVES, RELEASES_DATA, WORKSPACE_USERS, WORKFLOW_STATUSES, LABELS_DATA, WORKLOAD_DATA, PLANNED_VS_COMPLETED, PERMISSIONS_MATRIX, DEFECT_ENVIRONMENTS, RELATED_STORIES } from "../model";
import { releaseStatusCfg, cx, Avatar, TYPE_CFG, TypeBadge, STATUS_CFG, StatusBadge, PRI_CFG, PriorityBadge, MiniProgress, RoleBadge, DetailPanel, NewItemModal, EmptyState, SectionCard } from "./shared";

export const NAV_ITEMS: { key: Page; label: string; icon: React.ReactNode; children?: { key: Page; label: string; icon: React.ReactNode }[] }[] = [
  { key: "home", label: "Home", icon: <Home size={12} /> },
  { key: "backlog", label: "Plan", icon: <Calendar size={12} />, children: [{ key: "backlog", label: "Backlog", icon: <AlignJustify size={12} /> }, { key: "iterations", label: "Timeboxes", icon: <RotateCw size={12} /> }] },
  { key: "track", label: "Track", icon: <Activity size={12} />, children: [{ key: "track", label: "Iteration Status", icon: <Activity size={12} /> }, { key: "teamStatus", label: "Team status", icon: <ListChecks size={12} /> }] },
  { key: "quality", label: "Quality", icon: <CheckCircle size={12} />, children: [{ key: "quality", label: "Defect", icon: <AlertTriangle size={12} /> }] },
  { key: "portfolio", label: "Portfolio", icon: <Package size={12} />, children: [{ key: "releasePlanning", label: "Release Planning (Phase 5)", icon: <Tag size={12} /> }] },
  { key: "reports", label: "Reports", icon: <BarChart2 size={12} /> },
];

export function TopNav({
  currentPage, onNavigate, currentRole, onRoleChange, unreadCount, currentProject, currentTeam, onScopeChange, onSignOut, onCreateProject,
}: {
  currentPage: Page; onNavigate: (p: Page) => void;
  currentRole: Role; onRoleChange: (r: Role) => void; unreadCount: number;
  currentProject: ScopeProject; currentTeam: string;
  onScopeChange: (project: ScopeProject, team: string) => void;
  onSignOut: () => void;
  onCreateProject: () => void;
}) {
  const [wsOpen, setWsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [openNavKey, setOpenNavKey] = useState<Page | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(["NXP"]));
  const roles: Role[] = ["Workspace Admin", "Project Admin", "Project Member"];
  const visibleProjects = currentRole === "Project Member"
    ? SCOPE_PROJECTS
      .filter(project => project.key === ROLE_SCOPE.projectMemberProjectKey)
      .map(project => ({ ...project, teams: project.teams.filter(team => ROLE_SCOPE.projectMemberTeams.includes(team as typeof ROLE_SCOPE.projectMemberTeams[number])) }))
    : SCOPE_PROJECTS;
  const visibleNavItems = currentRole === "Project Member"
    ? NAV_ITEMS
      .filter(item => ["home", "backlog", "track"].includes(item.key))
      .map(item => item.children ? { ...item, children: item.children.filter(child => child.key === "track" || child.key === "backlog") } : item)
    : NAV_ITEMS;
  function toggleProject(key: string) {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <div className="h-10 flex items-center px-3 shrink-0 relative z-30" style={{ backgroundColor: "#1d3f73", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2 mr-4">
        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
          <Layers size={13} className="text-white" />
        </div>
        <div className="relative">
          <button onClick={() => { setWsOpen(o => !o); setUserOpen(false); }} className="flex items-center gap-1.5 text-white hover:opacity-90 text-left">
            <div className="leading-tight">
              <div className="text-[12px] font-semibold">ACME Space Inc.</div>
              <div className="text-[8px] font-normal truncate max-w-44" style={{ color: "rgba(255,255,255,0.55)" }}>{currentProject.key} · {currentTeam}</div>
            </div>
            <ChevronDown size={10} className="opacity-60" />
          </button>
          {wsOpen && (
            <div className="absolute left-0 top-full mt-1 w-80 bg-white rounded shadow-xl z-50 py-1.5 overflow-hidden" style={{ border: "1px solid #d9dee7" }}>
              <div className="px-3 py-2.5 flex items-center gap-2.5" style={{ borderBottom: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
                <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: "#e5ebf4", color: "#1d3f73" }}><Layers size={14} /></div>
                <div className="flex-1 min-w-0"><div className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>Company / Workspace</div><div className="text-[12px] font-semibold truncate" style={{ color: "#1a2234" }}>ACME Space Inc.</div></div>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm" style={{ color: "#1e6930", backgroundColor: "#eaf5ed" }}>Active</span>
              </div>
              <div className="px-3 pt-2 pb-1 text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>Projects & Teams</div>
              <div className="max-h-80 overflow-y-auto px-1.5">
                {visibleProjects.map(project => {
                  const expanded = expandedProjects.has(project.key);
                  const selectedProject = currentProject.key === project.key;
                  return (
                    <div key={project.key} className="mb-0.5">
                      <div className="flex items-center rounded" style={{ backgroundColor: selectedProject ? "#edf2fb" : "transparent" }}>
                        <button aria-label={`${expanded ? "Collapse" : "Expand"} ${project.name}`} onClick={() => toggleProject(project.key)} className="p-1.5 shrink-0" style={{ color: "#8c94a6" }}>{expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}</button>
                        <button onClick={() => { onScopeChange(project, currentRole === "Project Member" ? project.teams[0] : "All Teams"); setWsOpen(false); }} className="flex-1 flex items-center gap-2 pr-2 py-1.5 text-left min-w-0">
                          <Package size={12} style={{ color: selectedProject ? "#1d3f73" : "#5c6478" }} />
                          <span className="flex-1 min-w-0"><span className="block text-[11px] font-semibold truncate" style={{ color: selectedProject ? "#1d3f73" : "#1a2234" }}>{project.name}</span><span className="block text-[9px]" style={{ color: "#8c94a6" }}>{project.key} · {project.teams.length} teams</span></span>
                          {selectedProject && <Check size={11} style={{ color: "#1d3f73" }} />}
                        </button>
                      </div>
                      {expanded && (
                        <div className="ml-5 pl-2" style={{ borderLeft: "1px solid #d9dee7" }}>
                          {(currentRole === "Project Member" ? project.teams : ["All Teams", ...project.teams]).map(team => {
                            const selectedTeam = selectedProject && currentTeam === team;
                            return <button key={team} onClick={() => { onScopeChange(project, team); setWsOpen(false); }} className="w-full flex items-center gap-2 px-2 py-1.5 text-left rounded hover:bg-[#f4f6f9]" style={{ backgroundColor: selectedTeam ? "#f0f4fb" : "transparent" }}><Users size={10} style={{ color: selectedTeam ? "#2558a6" : "#8c94a6" }} /><span className="flex-1 text-[10px] truncate" style={{ color: selectedTeam ? "#1d3f73" : "#5c6478", fontWeight: selectedTeam ? 600 : 400 }}>{team}</span>{selectedTeam && <Check size={10} style={{ color: "#2558a6" }} />}</button>;
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-[#e2e6eb] mt-1 pt-1 px-1.5 flex items-center justify-end">
                {currentRole !== "Project Member" && <button aria-label="Manage workspace projects" title="Manage workspace projects" onClick={() => { onNavigate("projects"); setWsOpen(false); }} className="flex items-center gap-1 px-2 py-1.5 text-[10px] rounded hover:bg-[#f4f6f9]" style={{ color: "#5c6478" }}><Settings size={11} /> Manage Projects</button>}
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-0.5 flex-1">
        {visibleNavItems.map(({ key, label, icon, children }) => {
          const active = currentPage === key || Boolean(children?.some(child => child.key === currentPage));
          const open = openNavKey === key;
          return children ? (
          <div key={label} className="relative">
            <div className="flex items-center rounded transition-colors" style={{ backgroundColor: active ? "rgba(255,255,255,0.16)" : "transparent" }}>
              <button onClick={() => { onNavigate(key); setOpenNavKey(null); }} className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 text-[11px] font-medium" style={{ color: active ? "#ffffff" : "rgba(255,255,255,0.65)" }}>{icon}{label}</button>
              <button aria-label={`Open ${label} menu`} onClick={() => { setOpenNavKey(current => current === key ? null : key); setWsOpen(false); setUserOpen(false); }} className="pr-2 py-1" style={{ color: active ? "#ffffff" : "rgba(255,255,255,0.55)" }}><ChevronDown size={9} /></button>
            </div>
            {open && (
              <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded shadow-lg z-50 py-1" style={{ border: "1px solid #d9dee7" }}>
                <div className="px-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>{label}</div>
                {children.map(child => <button key={child.key} onClick={() => { onNavigate(child.key); setOpenNavKey(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-left hover:bg-[#f4f6f9]" style={{ color: currentPage === child.key ? "#1d3f73" : "#1a2234", backgroundColor: currentPage === child.key ? "#edf2fb" : "transparent", fontWeight: currentPage === child.key ? 600 : 400 }}>{child.icon}<span className="flex-1">{child.label}</span>{currentPage === child.key && <Check size={11} />}</button>)}
              </div>
            )}
          </div>
        ) : (
          <button key={key} onClick={() => { onNavigate(key); setOpenNavKey(null); }} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded transition-colors"
            style={{ backgroundColor: currentPage === key ? "rgba(255,255,255,0.16)" : "transparent", color: currentPage === key ? "#ffffff" : "rgba(255,255,255,0.65)" }}
            onMouseEnter={e => { if (currentPage !== key) { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; } }}
            onMouseLeave={e => { if (currentPage !== key) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; } }}>
            {icon}{label}
          </button>
        );
        })}
      </nav>

      <div className="flex items-center gap-1">
        <div className="relative mr-1">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.4)" }} />
          <input type="text" placeholder="Search all work items..." className="pl-7 pr-3 py-1 text-[11px] rounded" style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", width: 190 }} onFocus={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }} onBlur={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }} />
        </div>
        <button aria-label="Notifications" title="Notifications" onClick={() => onNavigate("notifications")} className="relative p-1.5 rounded" style={{ color: "rgba(255,255,255,0.65)" }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}>
          <Bell size={14} />{unreadCount > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f97316" }} />}
        </button>
        <button aria-label="Help" title="Help" className="p-1.5 rounded" style={{ color: "rgba(255,255,255,0.65)" }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}><HelpCircle size={14} /></button>
        {can.viewAdmin(currentRole) && (
          <button aria-label="Workspace Settings" title="Workspace Settings" onClick={() => onNavigate("settings")} className="p-1.5 rounded" style={{ color: currentPage === "settings" ? "#fff" : "rgba(255,255,255,0.65)", backgroundColor: currentPage === "settings" ? "rgba(255,255,255,0.15)" : "transparent" }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={e => { if (currentPage !== "settings") { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; } }}>
            <Settings size={14} />
          </button>
        )}
        <div className="w-px h-4 mx-1" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
        <div className="relative">
          <button onClick={() => { setUserOpen(o => !o); setWsOpen(false); }} className="flex items-center gap-2 px-2 py-1 rounded" style={{ backgroundColor: userOpen ? "rgba(255,255,255,0.15)" : "transparent" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")} onMouseLeave={e => { if (!userOpen) e.currentTarget.style.backgroundColor = "transparent"; }}>
            <Avatar owner={OWNERS[0]} size="sm" />
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-medium text-white leading-none">Marcus Webb</div>
              <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{currentRole}</div>
            </div>
            <ChevronDown size={10} style={{ color: "rgba(255,255,255,0.5)" }} />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-full mt-1 w-60 bg-white rounded shadow-lg z-50 py-1" style={{ border: "1px solid #e2e6eb" }}>
              <div className="px-3 py-2" style={{ borderBottom: "1px solid #edf0f4" }}>
                <div className="text-[12px] font-semibold" style={{ color: "#1a2234" }}>Marcus Webb</div>
                <div className="text-[11px]" style={{ color: "#5c6478" }}>marcus.webb@acme.com</div>
                <div className="mt-1"><RoleBadge role={currentRole} /></div>
              </div>
              <div className="px-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>Demo: Switch Role</div>
              {roles.map(r => (
                <button key={r} onClick={() => { onRoleChange(r); setUserOpen(false); }} className="w-full flex items-center justify-between px-3 py-1.5 text-[12px] text-left hover:bg-[#f4f6f9]" style={{ color: "#1a2234" }}>
                  {r}{currentRole === r && <Check size={11} style={{ color: "#1d3f73" }} />}
                </button>
              ))}
              <div className="border-t border-[#edf0f4] mt-1 pt-1">
                <button onClick={() => { onNavigate("settings"); setUserOpen(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-[#f4f6f9]" style={{ color: "#5c6478" }}><UserCheck size={11} /> Profile & Account</button>
                <button onClick={onSignOut} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-[#f4f6f9]" style={{ color: "#5c6478" }}><LogOut size={11} /> Sign out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Context Bar ──────────────────────────────────────────────────────────────

export function CtxSelect({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] font-medium" style={{ color: "#8c94a6" }}>{label}:</span>
      <button className="flex items-center gap-0.5 text-[12px] font-medium px-1.5 py-0.5 rounded" style={{ color: "#1a2234" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#edf2fb")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
        {value} <ChevronDown size={10} style={{ color: "#8c94a6" }} />
      </button>
    </div>
  );
}

export function SavedViewsDrop() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478", backgroundColor: open ? "#f4f6f9" : "transparent" }}>
        <Bookmark size={11} /> Saved Views <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded shadow-lg z-50 py-1" style={{ border: "1px solid #e2e6eb" }}>
          <div className="px-3 py-1 text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>My Views</div>
          {["All Active Items", "Critical Defects", "My Assignments", "This Sprint"].map(v => (
            <button key={v} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-left hover:bg-[#f4f6f9]" style={{ color: "#1a2234" }} onClick={() => setOpen(false)}>
              <Bookmark size={10} style={{ color: "#8c94a6" }} /> {v}
            </button>
          ))}
          <div className="px-3 py-1 text-[9px] font-semibold uppercase tracking-widest mt-1" style={{ color: "#8c94a6", borderTop: "1px solid #edf0f4", paddingTop: 8 }}>Shared Views</div>
          {["Sprint Planning View", "QA Dashboard"].map(v => (
            <button key={v} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-left hover:bg-[#f4f6f9]" style={{ color: "#1a2234" }} onClick={() => setOpen(false)}>
              <Share2 size={10} style={{ color: "#8c94a6" }} /> {v}
            </button>
          ))}
          <div className="border-t border-[#edf0f4] mt-1 pt-1">
            <button className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-[#f4f6f9]" style={{ color: "#5c6478" }}><Save size={10} /> Save current view</button>
            <button className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-[#f4f6f9]" style={{ color: "#5c6478" }}><RotateCcw size={10} /> Reset view</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ContextBar({ currentPage, currentProject, currentTeam }: { currentPage: Page; currentProject: ScopeProject; currentTeam: string }) {
  if (currentPage === "settings" || currentPage === "notifications") return null;
  const crumbs: Record<Page, string[]> = {
    home: ["ACME Space Inc.", "Home"],
    projects: ["ACME Space Inc.", "Manage Projects"],
    backlog: [currentProject.name, "Plan", "Backlog"],
    iterations: [currentProject.name, "Plan", "Timeboxes"],
    track: [currentProject.name, "Track", "Iteration Status"],
    teamBoard: [currentProject.name, "Track", "Team board"],
    teamStatus: [currentProject.name, "Track", "Team status"],
    quality: [currentProject.name, "Quality", "Defects"],
    portfolio: [currentProject.name, "Portfolio", "Initiatives"],
    releasePlanning: [currentProject.name, "Portfolio", "Release Planning (Phase 5)"],
    releases: [currentProject.name, "Releases"],
    reports: [currentProject.name, "Reports"],
    notifications: [],
    settings: [],
  };
  const showSaved = ["backlog", "quality", "portfolio", "releases"].includes(currentPage);

  return (
    <div className="h-8 flex items-center px-4 gap-4 bg-white shrink-0 relative z-20" style={{ borderBottom: "1px solid #e2e6eb" }}>
      <div className="flex items-center gap-1 text-[12px]">
        {crumbs[currentPage].map((c, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={11} style={{ color: "#b0b8c8" }} />}
            <span style={{ color: i === 0 ? "#1d3f73" : i === crumbs[currentPage].length - 1 ? "#1a2234" : "#5c6478", fontWeight: i === 0 || i === crumbs[currentPage].length - 1 ? 600 : 400 }}>{c}</span>
          </span>
        ))}
      </div>
      <div className="flex-1" />
      {!["projects", "backlog", "iterations", "track", "teamBoard", "teamStatus"].includes(currentPage) && (
        <div className="flex items-center gap-4" style={{ borderLeft: "1px solid #e2e6eb", paddingLeft: "1rem" }}>
          {["home", "projects"].includes(currentPage) && <CtxSelect label="Company" value="ACME Space Inc." />}
          {!["home", "projects"].includes(currentPage) && <CtxSelect label="Project" value={currentProject.name} />}
          {["track", "teamBoard", "teamStatus"].includes(currentPage) && <CtxSelect label="Release" value="Q4 2024" />}
          {["track", "teamBoard", "teamStatus"].includes(currentPage) && <CtxSelect label="Iteration" value="Sprint 24.3" />}
          {currentPage === "releases" && <CtxSelect label="Status" value="All Releases" />}
          {currentPage === "reports" && <CtxSelect label="Period" value="Last 6 Sprints" />}
          {!["home", "projects"].includes(currentPage) && <CtxSelect label="Team" value={currentTeam} />}
          {showSaved && <SavedViewsDrop />}
        </div>
      )}
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
