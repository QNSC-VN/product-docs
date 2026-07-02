import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Archive, Check, ChevronLeft, ChevronRight, Edit3, FolderKanban, MoreHorizontal, Plus, RotateCcw, Search, Users, X } from "lucide-react";
import { OWNERS, PROJECTS, SCOPE_PROJECTS, type Owner, type Role } from "../model";
import { Avatar } from "../components/shared";

type ProjectStatus = "Active" | "Archived";

type ProjectRecord = {
  id: string;
  key: string;
  name: string;
  description: string;
  owner: Owner;
  status: ProjectStatus;
  teams: string[];
  members: number;
  startDate: string;
  updatedAt: string;
};

type ProjectDraft = {
  name: string;
  key: string;
  description: string;
  ownerName: string;
  startDate: string;
  teamNames: string[];
};

const EMPTY_DRAFT: ProjectDraft = { name: "", key: "", description: "", ownerName: OWNERS[0].name, startDate: "2026-07-01", teamNames: [] };
const ALL_TEAMS = Array.from(new Set(SCOPE_PROJECTS.flatMap(project => project.teams)));

const INITIAL_PROJECTS: ProjectRecord[] = [
  ...PROJECTS.map((project, index) => ({
    id: `project-${project.key.toLowerCase()}`,
    key: project.key,
    name: project.name,
    description: index === 0 ? "Core product platform and shared enterprise capabilities." : "Delivery workspace for the assigned product scope.",
    owner: project.owner,
    status: "Active" as const,
    teams: SCOPE_PROJECTS.find(scope => scope.key === project.key)?.teams ?? [],
    members: [24, 12, 9, 15][index] ?? 8,
    startDate: ["Jan 06, 2025", "Feb 03, 2025", "Mar 10, 2025", "Apr 01, 2025"][index] ?? "Jan 01, 2025",
    updatedAt: ["2 hours ago", "Yesterday", "Jun 18, 2026", "Jun 16, 2026"][index] ?? "Recently",
  })),
  { id: "project-leg", key: "LEG", name: "Legacy Billing Migration", description: "Completed migration retained for audit and delivery history.", owner: OWNERS[2], status: "Archived", teams: ["Core Platform"], members: 7, startDate: "Aug 12, 2024", updatedAt: "May 20, 2026" },
];

function StatusBadge({ status }: { status: ProjectStatus }) {
  const active = status === "Active";
  return <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-semibold" style={{ color: active ? "#1e6930" : "#64748b", backgroundColor: active ? "#eaf5ed" : "#f1f5f9", border: `1px solid ${active ? "#c7e4ce" : "#d9dee7"}` }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? "#2a8c3f" : "#94a3b8" }} />{status}</span>;
}

function ProjectModal({ project, existingKeys, onClose, onSave }: { project: ProjectRecord | null; existingKeys: string[]; onClose: () => void; onSave: (draft: ProjectDraft) => void }) {
  const [draft, setDraft] = useState<ProjectDraft>(project ? { name: project.name, key: project.key, description: project.description, ownerName: project.owner.name, startDate: "2025-01-06", teamNames: project.teams } : EMPTY_DRAFT);
  const [error, setError] = useState("");
  const editing = Boolean(project);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const key = draft.key.trim().toUpperCase();
    if (!draft.name.trim() || !key) return setError("Project name and key are required.");
    if (!/^[A-Z][A-Z0-9]{1,9}$/.test(key)) return setError("Key must be 2–10 uppercase letters or numbers and start with a letter.");
    if (!editing && existingKeys.includes(key)) return setError("Project key already exists in ACME Space Inc.");
    onSave({ ...draft, key });
  }

  function toggleTeam(team: string) {
    setDraft(previous => ({ ...previous, teamNames: previous.teamNames.includes(team) ? previous.teamNames.filter(item => item !== team) : [...previous.teamNames, team] }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.34)" }} onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-[620px] bg-white rounded-md shadow-2xl overflow-hidden" style={{ border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          <div><p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>{editing ? "Edit Project" : "Create Project"}</p><p className="text-[10px]" style={{ color: "#8c94a6" }}>ACME Space Inc. · Company project</p></div>
          <button type="button" aria-label="Close project form" onClick={onClose} className="p-1" style={{ color: "#8c94a6" }}><X size={15} /></button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <div role="alert" className="px-3 py-2 rounded text-[11px]" style={{ color: "#b91c1c", backgroundColor: "#fef2f2", border: "1px solid #f0c7c1" }}>{error}</div>}
          <div className="grid grid-cols-[1fr_150px] gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Project name *</label><input autoFocus value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} placeholder="e.g. Customer Portal" className="w-full px-3 py-2 rounded text-[12px] focus:outline-none" style={{ border: "1px solid #d9dee7" }} /></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Project key *</label><input value={draft.key} disabled={editing} onChange={event => setDraft({ ...draft, key: event.target.value.toUpperCase() })} placeholder="CP" maxLength={10} className="w-full px-3 py-2 rounded text-[12px] font-mono uppercase disabled:bg-[#f1f3f6] focus:outline-none" style={{ border: "1px solid #d9dee7" }} /></div>
          </div>
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Description</label><textarea value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} rows={3} placeholder="Describe the project scope and delivery outcome..." className="w-full px-3 py-2 rounded text-[12px] resize-none focus:outline-none" style={{ border: "1px solid #d9dee7" }} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Project owner</label><select value={draft.ownerName} onChange={event => setDraft({ ...draft, ownerName: event.target.value })} className="w-full px-3 py-2 rounded text-[12px] bg-white" style={{ border: "1px solid #d9dee7" }}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Start date</label><input type="date" value={draft.startDate} onChange={event => setDraft({ ...draft, startDate: event.target.value })} className="w-full px-3 py-2 rounded text-[12px]" style={{ border: "1px solid #d9dee7" }} /></div>
          </div>
          <div>
            <div className="flex items-end justify-between mb-2"><div><label className="block text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#5c6478" }}>Teams</label><p className="text-[10px] mt-0.5" style={{ color: "#8c94a6" }}>A Team can be linked to multiple Projects.</p></div><span className="text-[10px]" style={{ color: "#5c6478" }}>{draft.teamNames.length} selected</span></div>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 rounded" style={{ border: "1px solid #e2e6eb", backgroundColor: "#fafbfc" }}>
              {ALL_TEAMS.map(team => { const selected = draft.teamNames.includes(team); return <button type="button" key={team} onClick={() => toggleTeam(team)} className="flex items-center gap-2 px-2.5 py-2 rounded text-left text-[11px]" style={{ color: selected ? "#1d3f73" : "#5c6478", backgroundColor: selected ? "#edf2fb" : "white", border: `1px solid ${selected ? "#bdd0ef" : "#e2e6eb"}` }}><span className="w-3.5 h-3.5 rounded-sm flex items-center justify-center" style={{ backgroundColor: selected ? "#1d3f73" : "white", border: `1px solid ${selected ? "#1d3f73" : "#b8c0cc"}` }}>{selected && <Check size={9} className="text-white" />}</span><Users size={11} />{team}</button>; })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3" style={{ backgroundColor: "#f7f8fa", borderTop: "1px solid #e2e6eb" }}><button type="button" onClick={onClose} className="px-3 py-1.5 rounded text-[11px]" style={{ border: "1px solid #d9dee7", color: "#5c6478" }}>Cancel</button><button type="submit" className="px-4 py-1.5 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}>{editing ? "Save Changes" : "Create Project"}</button></div>
      </form>
    </div>
  );
}

export function ProjectsPage({ role, createRequest = 0, onCreateRequestHandled }: { role: Role; createRequest?: number; onCreateRequestHandled?: () => void }) {
  const [projects, setProjects] = useState<ProjectRecord[]>(INITIAL_PROJECTS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | ProjectStatus>("Active");
  const [editingProject, setEditingProject] = useState<ProjectRecord | null | undefined>(undefined);
  const [archiveTarget, setArchiveTarget] = useState<ProjectRecord | null>(null);
  const canManage = role === "Workspace Admin" || role === "Project Manager";
  const filtered = useMemo(() => projects.filter(project => (status === "All" || project.status === status) && `${project.key} ${project.name} ${project.owner.name}`.toLowerCase().includes(search.toLowerCase())), [projects, search, status]);

  useEffect(() => {
    if (createRequest > 0 && canManage) {
      setEditingProject(null);
      onCreateRequestHandled?.();
    }
  }, [createRequest, canManage, onCreateRequestHandled]);

  function saveProject(draft: ProjectDraft) {
    const owner = OWNERS.find(item => item.name === draft.ownerName) ?? OWNERS[0];
    if (editingProject) {
      setProjects(previous => previous.map(project => project.id === editingProject.id ? { ...project, name: draft.name.trim(), description: draft.description.trim(), owner, teams: draft.teamNames, updatedAt: "Just now" } : project));
    } else {
      setProjects(previous => [{ id: `project-${draft.key.toLowerCase()}`, key: draft.key, name: draft.name.trim(), description: draft.description.trim(), owner, status: "Active", teams: draft.teamNames, members: 1, startDate: new Date(`${draft.startDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }), updatedAt: "Just now" }, ...previous]);
      setStatus("Active");
    }
    setEditingProject(undefined);
  }

  function archiveProject(project: ProjectRecord) {
    setProjects(previous => previous.map(item => item.id === project.id ? { ...item, status: "Archived", updatedAt: "Just now" } : item));
    setArchiveTarget(null);
  }

  function restoreProject(project: ProjectRecord) {
    setProjects(previous => previous.map(item => item.id === project.id ? { ...item, status: "Active", updatedAt: "Just now" } : item));
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="px-4 py-3 flex items-center gap-3 shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div><h2 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>Projects</h2><p className="text-[10px] mt-0.5" style={{ color: "#8c94a6" }}>Manage all delivery projects for ACME Space Inc.</p></div>
        <div className="flex-1" />
        {canManage && <button onClick={() => setEditingProject(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}><Plus size={12} /> Create Project</button>}
      </div>

      <div className="grid grid-cols-4 gap-3 px-4 py-3 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
        {[{ label: "Total Projects", value: projects.length, icon: FolderKanban }, { label: "Active", value: projects.filter(item => item.status === "Active").length, icon: Check }, { label: "Archived", value: projects.filter(item => item.status === "Archived").length, icon: Archive }, { label: "Linked Teams", value: new Set(projects.flatMap(item => item.teams)).size, icon: Users }].map(metric => <div key={metric.label} className="bg-white rounded px-3 py-2.5 flex items-center gap-3" style={{ border: "1px solid #e2e6eb" }}><div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: "#edf2fb", color: "#1d3f73" }}><metric.icon size={13} /></div><div><p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>{metric.label}</p><p className="text-[17px] font-semibold" style={{ color: "#1a2234" }}>{metric.value}</p></div></div>)}
      </div>

      <div className="flex items-center gap-2 px-4 py-2 shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div className="relative"><Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search projects..." className="pl-7 pr-3 py-1.5 rounded text-[11px] focus:outline-none w-56" style={{ border: "1px solid #d9dee7" }} /></div>
        <div className="flex items-center rounded p-0.5" style={{ backgroundColor: "#edf0f4" }}>{(["All", "Active", "Archived"] as const).map(item => <button key={item} onClick={() => setStatus(item)} className="px-3 py-1 rounded text-[10px] font-medium" style={{ color: status === item ? "#1d3f73" : "#5c6478", backgroundColor: status === item ? "white" : "transparent", boxShadow: status === item ? "0 1px 2px rgba(0,0,0,.08)" : "none" }}>{item}</button>)}</div>
        <div className="flex-1" /><span className="text-[10px]" style={{ color: "#8c94a6" }}>{filtered.length} projects</span>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-[1120px]">
          <div className="sticky top-0 z-10 flex items-center h-8 px-4 gap-3" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>{[["w-20","Key"],["flex-1","Project"],["w-24","Status"],["w-36","Owner"],["w-44","Teams"],["w-20","Members"],["w-28","Start Date"],["w-24","Updated"],["w-20 text-right","Actions"]].map(([width,label]) => <div key={label} className={`${width} shrink-0 text-[9px] font-semibold uppercase tracking-wider`} style={{ color: "#8c94a6" }}>{label}</div>)}</div>
          {filtered.map(project => <div key={project.id} className="flex items-center min-h-12 px-4 gap-3 hover:bg-[#f9fafb]" style={{ borderBottom: "1px solid #edf0f4" }}>
            <div className="w-20 shrink-0 font-mono text-[10px] font-semibold" style={{ color: "#2558a6" }}>{project.key}</div>
            <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold truncate" style={{ color: "#1a2234" }}>{project.name}</p><p className="text-[9px] truncate mt-0.5" style={{ color: "#8c94a6" }}>{project.description || "No description"}</p></div>
            <div className="w-24 shrink-0"><StatusBadge status={project.status} /></div>
            <div className="w-36 shrink-0 flex items-center gap-1.5"><Avatar owner={project.owner} size="xs" /><span className="text-[10px] truncate" style={{ color: "#5c6478" }}>{project.owner.name}</span></div>
            <div className="w-44 shrink-0 flex items-center -space-x-1">{project.teams.slice(0,2).map(team => <span key={team} className="px-1.5 py-0.5 rounded-sm text-[9px] truncate max-w-24" style={{ color: "#475569", backgroundColor: "#f1f5f9", border: "1px solid white" }}>{team}</span>)}{project.teams.length > 2 && <span className="text-[9px] ml-1.5" style={{ color: "#8c94a6" }}>+{project.teams.length-2}</span>}{project.teams.length === 0 && <span className="text-[9px]" style={{ color: "#b0b8c8" }}>No teams</span>}</div>
            <div className="w-20 shrink-0 text-[10px]" style={{ color: "#5c6478" }}>{project.members}</div><div className="w-28 shrink-0 text-[10px]" style={{ color: "#5c6478" }}>{project.startDate}</div><div className="w-24 shrink-0 text-[10px]" style={{ color: "#8c94a6" }}>{project.updatedAt}</div>
            <div className="w-20 shrink-0 flex items-center justify-end gap-1">{canManage && project.status === "Active" && <><button aria-label={`Edit ${project.name}`} onClick={() => setEditingProject(project)} className="p-1.5 rounded hover:bg-[#edf2fb]" style={{ color: "#5c6478" }}><Edit3 size={12} /></button><button aria-label={`Archive ${project.name}`} onClick={() => setArchiveTarget(project)} className="p-1.5 rounded hover:bg-[#fef2f2]" style={{ color: "#b45309" }}><Archive size={12} /></button></>}{canManage && project.status === "Archived" && <button aria-label={`Restore ${project.name}`} onClick={() => restoreProject(project)} className="flex items-center gap-1 px-2 py-1 rounded text-[10px]" style={{ color: "#1e6930", border: "1px solid #c7e4ce" }}><RotateCcw size={10} /> Restore</button>}{!canManage && <MoreHorizontal size={13} style={{ color: "#b0b8c8" }} />}</div>
          </div>)}
          {filtered.length === 0 && <div className="py-16 text-center"><FolderKanban size={28} className="mx-auto mb-2" style={{ color: "#c4cad4" }} /><p className="text-[12px] font-semibold" style={{ color: "#5c6478" }}>No projects found</p><p className="text-[10px] mt-1" style={{ color: "#8c94a6" }}>Change the search or status filter.</p></div>}
        </div>
      </div>

      <div className="h-10 shrink-0 flex items-center justify-between px-4" style={{ borderTop: "1px solid #e2e6eb" }}><span className="text-[10px]" style={{ color: "#8c94a6" }}>1–{filtered.length} of {filtered.length}</span><div className="flex items-center gap-2"><span className="text-[10px]" style={{ color: "#5c6478" }}>Page 1 of 1</span><button disabled className="p-1.5 rounded opacity-35" style={{ border: "1px solid #dde2ea" }}><ChevronLeft size={12} /></button><button disabled className="p-1.5 rounded opacity-35" style={{ border: "1px solid #dde2ea" }}><ChevronRight size={12} /></button></div></div>

      {editingProject !== undefined && <ProjectModal project={editingProject} existingKeys={projects.map(project => project.key)} onClose={() => setEditingProject(undefined)} onSave={saveProject} />}
      {archiveTarget && <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,.34)" }} onClick={() => setArchiveTarget(null)} /><div className="relative bg-white rounded-md shadow-xl w-[430px] p-5" style={{ border: "1px solid #d9dee7" }}><div className="w-9 h-9 rounded-full flex items-center justify-center mb-3" style={{ color: "#b45309", backgroundColor: "#fff7ed" }}><Archive size={17} /></div><h3 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>Archive {archiveTarget.name}?</h3><p className="text-[11px] mt-2 leading-5" style={{ color: "#5c6478" }}>The project becomes read-only and is hidden from active selectors. Teams and delivery history are preserved.</p><div className="flex justify-end gap-2 mt-5"><button onClick={() => setArchiveTarget(null)} className="px-3 py-1.5 rounded text-[11px]" style={{ border: "1px solid #d9dee7" }}>Cancel</button><button onClick={() => archiveProject(archiveTarget)} className="px-3 py-1.5 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: "#b45309" }}>Archive Project</button></div></div></div>}
    </div>
  );
}
