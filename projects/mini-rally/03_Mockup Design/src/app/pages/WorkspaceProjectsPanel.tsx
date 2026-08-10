import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Archive, Check, ChevronDown, ChevronRight, Edit3, FolderKanban,
  Plus, RotateCcw, Search, Trash2, UserPlus, Users, X,
} from "lucide-react";
import { OWNERS, PROJECTS, ROLE_SCOPE, SCOPE_PROJECTS, type Owner, type Role } from "../model";
import { Avatar } from "../components/shared";

type ProjectStatus = "Active" | "Archived";
type TeamStatus = "Active" | "Deactive";
export type ProjectPermission = "Admin" | "Editor" | "Viewer" | "No Access";
export type SharedProjectAccess = { projectKey: string; level: ProjectPermission; teams: string[] };
export type SharedWorkspaceUser = { name: string; email: string; owner: Owner; status: string; projectAccess: SharedProjectAccess[] };
type ProjectTab = "details" | "users" | "teams";
type SelectedNode = { type: "workspace" } | { type: "project"; key: string } | { type: "team"; id: string };
const T_SHIRT_SIZES = ["XS", "S", "M", "L", "XL"] as const;
type TShirtSize = typeof T_SHIRT_SIZES[number];

type AdminProject = {
  id: string;
  key: string;
  name: string;
  description: string;
  owner: Owner;
  status: ProjectStatus;
  startDate: string;
  preliminaryPoints: Record<TShirtSize, number>;
  hoursPerPoint: number;
};

type AdminTeam = {
  id: string;
  key: string;
  name: string;
  projectKey: string;
  lead: Owner;
  status: TeamStatus;
  members: string[];
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  owner: Owner;
  status: "Active" | "Invited" | "Disabled";
  permissions: Record<string, ProjectPermission>;
  teams: string[];
};

type ProjectDraft = { name: string; key: string; description: string; ownerName: string; startDate: string; preliminaryPoints: Record<TShirtSize, number>; hoursPerPoint: number };
type TeamMemberAccess = Record<string, "Admin" | "Editor">;
type TeamDraft = { name: string; key: string; leadName: string; status: TeamStatus; memberAccess: TeamMemberAccess };

const INITIAL_PROJECTS: AdminProject[] = PROJECTS.map((project, index) => ({
  id: `project-${project.key.toLowerCase()}`,
  key: project.key,
  name: project.name,
  description: index === 0 ? "Core product platform and shared enterprise capabilities." : "Delivery workspace for the assigned product scope.",
  owner: project.owner,
  status: "Active",
  startDate: ["Jan 06, 2025", "Feb 03, 2025", "Mar 10, 2025", "Apr 01, 2025"][index] ?? "Jan 01, 2025",
  preliminaryPoints: { XS: 1, S: 2, M: 3, L: 5, XL: 8 },
  hoursPerPoint: 8,
}));

const INITIAL_TEAMS: AdminTeam[] = SCOPE_PROJECTS.flatMap((project, projectIndex) =>
  project.teams.map((team, teamIndex) => ({
    id: `team-${project.key.toLowerCase()}-${team.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    key: team.split(/\s+/).map(word => word[0]).join("").slice(0, 5).toUpperCase(),
    name: team,
    projectKey: project.key,
    lead: OWNERS[1 + ((projectIndex + teamIndex) % Math.max(1, OWNERS.length - 2))],
    status: "Active" as const,
    members: teamIndex === 0 ? ["Sarah Chen", "Priya Nair"] : ["James Okafor"],
  })),
);

function accessFor(role: Role, projectKey: string): ProjectPermission {
  if (role === "Workspace Admin") return "Admin";
  if (role === "Project Member") return projectKey === ROLE_SCOPE.projectMemberProjectKey ? "Editor" : "No Access";
  if (ROLE_SCOPE.projectAdminProjectKeys.includes(projectKey as typeof ROLE_SCOPE.projectAdminProjectKeys[number])) return "Admin";
  if (ROLE_SCOPE.projectAdminViewerProjectKeys.includes(projectKey as typeof ROLE_SCOPE.projectAdminViewerProjectKeys[number])) return "Viewer";
  return "No Access";
}

function StatusBadge({ value }: { value: ProjectStatus | TeamStatus }) {
  const active = value === "Active";
  return <span className="inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: active ? "#1e6930" : "#8c94a6" }}><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: active ? "#2a8c3f" : "#a8afbc" }} />{value}</span>;
}

function IconButton({ label, onClick, danger = false, children }: { label: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return <button aria-label={label} title={label} onClick={onClick} className="flex h-7 w-7 items-center justify-center rounded border bg-white" style={{ color: danger ? "#b91c1c" : "#5c6478", borderColor: danger ? "#f0c7c1" : "#d9dee7" }}>{children}</button>;
}

function ConfirmDialog({ title, body, action, requiredText, onClose, onConfirm }: { title: string; body: string; action: string; requiredText?: string; onClose: () => void; onConfirm: () => void }) {
  const [typed, setTyped] = useState("");
  const ready = !requiredText || typed === requiredText;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button aria-label="Close confirmation" className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,.34)" }} onClick={onClose} />
      <div className="relative w-[430px] rounded-md bg-white p-5 shadow-xl" style={{ border: "1px solid #d9dee7" }}>
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full" style={{ color: "#b91c1c", backgroundColor: "#fef2f2" }}><Trash2 size={17} /></div>
        <h3 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>{title}</h3>
        <p className="mt-2 text-[11px] leading-5" style={{ color: "#5c6478" }}>{body}</p>
        {requiredText && <label className="mt-4 block text-[10px] font-semibold uppercase" style={{ color: "#8c94a6" }}>Type {requiredText} to confirm<input value={typed} onChange={event => setTyped(event.target.value)} className="mt-1.5 w-full rounded border px-3 py-2 text-[12px] normal-case outline-none" style={{ borderColor: "#d9dee7", color: "#1a2234" }} /></label>}
        <div className="mt-5 flex justify-end gap-2"><button onClick={onClose} className="rounded border px-3 py-1.5 text-[11px]" style={{ borderColor: "#d9dee7", color: "#5c6478" }}>Cancel</button><button disabled={!ready} onClick={onConfirm} className="rounded px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-45" style={{ backgroundColor: "#b91c1c" }}>{action}</button></div>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose, onSave }: { project: AdminProject | null; onClose: () => void; onSave: (draft: ProjectDraft) => void }) {
  const [draft, setDraft] = useState<ProjectDraft>(project ? { name: project.name, key: project.key, description: project.description, ownerName: project.owner.name, startDate: project.startDate, preliminaryPoints: { ...project.preliminaryPoints }, hoursPerPoint: project.hoursPerPoint } : { name: "", key: "", description: "", ownerName: OWNERS[0].name, startDate: "2026-08-10", preliminaryPoints: { XS: 1, S: 2, M: 3, L: 5, XL: 8 }, hoursPerPoint: 8 });
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const key = draft.key.trim().toUpperCase();
    if (!draft.name.trim() || !/^[A-Z][A-Z0-9]{1,9}$/.test(key)) return setError("Project name and a 2-10 character uppercase key are required.");
    if (T_SHIRT_SIZES.some(size => draft.preliminaryPoints[size] <= 0) || draft.hoursPerPoint <= 0) return setError("Estimate points and hours per point must be greater than zero.");
    onSave({ ...draft, key, name: draft.name.trim() });
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button aria-label="Close project form" className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,.34)" }} onClick={onClose} />
      <form onSubmit={submit} className="relative w-[620px] overflow-hidden rounded-md bg-white shadow-xl" style={{ border: "1px solid #d9dee7" }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}><div><h3 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>{project ? "Edit Project" : "Create Project"}</h3><p className="text-[10px]" style={{ color: "#8c94a6" }}>ACME Space Inc. / Workspaces & Projects</p></div><button type="button" onClick={onClose} aria-label="Close"><X size={15} style={{ color: "#8c94a6" }} /></button></div>
        <div className="space-y-4 p-5">
          {error && <div className="rounded border px-3 py-2 text-[11px]" style={{ color: "#b91c1c", backgroundColor: "#fef2f2", borderColor: "#f0c7c1" }}>{error}</div>}
          <div className="grid grid-cols-[1fr_150px] gap-4"><Field label="Project name"><input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} className="admin-input" /></Field><Field label="Project key"><input disabled={Boolean(project)} value={draft.key} onChange={event => setDraft({ ...draft, key: event.target.value.toUpperCase() })} className="admin-input disabled:bg-[#f1f3f6]" /></Field></div>
          <Field label="Description"><textarea rows={3} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} className="admin-input resize-none" /></Field>
          <div className="grid grid-cols-2 gap-4"><Field label="Project owner"><select value={draft.ownerName} onChange={event => setDraft({ ...draft, ownerName: event.target.value })} className="admin-input bg-white">{OWNERS.filter(owner => owner.name !== "Unassigned").map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field><Field label="Start date"><input value={draft.startDate} onChange={event => setDraft({ ...draft, startDate: event.target.value })} className="admin-input" /></Field></div>
          <div className="space-y-3 pt-4" style={{ borderTop: "1px solid #e2e6eb" }}>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>Estimation Settings</h4>
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase" style={{ color: "#5c6478" }}>Preliminary Estimate</p>
              <div className="grid grid-cols-5 gap-2">
                {T_SHIRT_SIZES.map(size => <label key={size} className="block"><span className="mb-1 block text-center text-[10px] font-semibold" style={{ color: "#1d3f73" }}>{size}</span><input aria-label={`${size} points`} type="number" min="0.5" step="0.5" value={draft.preliminaryPoints[size]} onChange={event => setDraft({ ...draft, preliminaryPoints: { ...draft.preliminaryPoints, [size]: Number(event.target.value) } })} className="admin-input text-center" /></label>)}
              </div>
            </div>
            <div className="w-44"><Field label="Hours per point"><input aria-label="Hours per point" type="number" min="0.5" step="0.5" value={draft.hoursPerPoint} onChange={event => setDraft({ ...draft, hoursPerPoint: Number(event.target.value) })} className="admin-input" /></Field></div>
          </div>
        </div>
        <ModalActions primary={project ? "Save Changes" : "Create Project"} onClose={onClose} />
      </form>
    </div>
  );
}

function TeamModal({ team, project, users, canManageAccess, onClose, onSave }: { team: AdminTeam | null; project: AdminProject; users: AdminUser[]; canManageAccess: boolean; onClose: () => void; onSave: (draft: TeamDraft) => void }) {
  const leadCandidates = users.filter(user => user.email !== "marcus.webb@acme.com" && ["Admin", "Editor"].includes(user.permissions[project.key] ?? "No Access"));
  const memberCandidates = users.filter(user => {
    if (user.email === "marcus.webb@acme.com") return false;
    return canManageAccess || ["Admin", "Editor"].includes(user.permissions[project.key] ?? "No Access");
  });
  const initialMemberAccess = Object.fromEntries(users.filter(user => (user.permissions[project.key] ?? "No Access") === "Admin").map(user => [user.email, "Admin"])) as TeamMemberAccess;
  const [draft, setDraft] = useState<TeamDraft>(team ? { name: team.name, key: team.key, leadName: team.lead.name, status: team.status, memberAccess: {} } : { name: "", key: "", leadName: leadCandidates[0]?.name ?? OWNERS[1].name, status: "Active", memberAccess: initialMemberAccess });
  const [error, setError] = useState("");

  function toggleMember(user: AdminUser) {
    const currentPermission = user.permissions[project.key] ?? "No Access";
    if (currentPermission === "Admin") return;
    setDraft(previous => {
      const memberAccess = { ...previous.memberAccess };
      if (memberAccess[user.email]) delete memberAccess[user.email];
      else memberAccess[user.email] = "Editor";
      return { ...previous, memberAccess };
    });
  }

  function changeMemberAccess(email: string, access: "Admin" | "Editor") {
    setDraft(previous => ({ ...previous, memberAccess: { ...previous.memberAccess, [email]: access } }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const key = draft.key.trim().toUpperCase();
    if (!draft.name.trim() || !/^[A-Z][A-Z0-9]{1,9}$/.test(key)) return setError("Team name and a 2-10 character uppercase key are required.");
    onSave({ ...draft, key, name: draft.name.trim() });
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button aria-label="Close team form" className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,.34)" }} onClick={onClose} />
      <form onSubmit={submit} className="relative flex max-h-[88vh] w-[700px] flex-col overflow-hidden rounded-md bg-white shadow-xl" style={{ border: "1px solid #d9dee7" }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}><div><h3 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>{team ? "Edit Team" : "Add Team"}</h3><p className="text-[10px]" style={{ color: "#8c94a6" }}>{project.key} / {project.name}</p></div><button type="button" onClick={onClose} aria-label="Close"><X size={15} style={{ color: "#8c94a6" }} /></button></div>
        <div className="space-y-4 overflow-y-auto p-5">
          {error && <div className="rounded border px-3 py-2 text-[11px]" style={{ color: "#b91c1c", backgroundColor: "#fef2f2", borderColor: "#f0c7c1" }}>{error}</div>}
          <div className="grid grid-cols-[1fr_140px] gap-4"><Field label="Team name"><input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} className="admin-input" /></Field><Field label="Team key"><input disabled={Boolean(team)} value={draft.key} onChange={event => setDraft({ ...draft, key: event.target.value.toUpperCase() })} className="admin-input disabled:bg-[#f1f3f6]" /></Field></div>
          <div className="grid grid-cols-2 gap-4"><Field label="Team lead"><select value={draft.leadName} onChange={event => setDraft({ ...draft, leadName: event.target.value })} className="admin-input bg-white">{leadCandidates.map(user => <option key={user.email}>{user.name}</option>)}</select></Field><Field label="Status"><select value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value as TeamStatus })} className="admin-input bg-white"><option>Active</option><option>Deactive</option></select></Field></div>
          {!team && <div className="pt-1"><div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-semibold uppercase" style={{ color: "#5c6478" }}>Members & Access</p><p className="text-[9px]" style={{ color: "#8c94a6" }}>{canManageAccess ? "Admin joins All Teams; Editor joins this Team" : "Add existing project Editors to this Team"}</p></div><div className="overflow-hidden rounded border" style={{ borderColor: "#e2e6eb" }}><div className="grid grid-cols-[minmax(240px,1fr)_110px_140px] bg-[#f7f8fa] px-3 py-2 text-[9px] font-semibold uppercase" style={{ color: "#8c94a6" }}><span>User</span><span>Current</span><span>{canManageAccess ? "New Access" : "Team Access"}</span></div>{memberCandidates.map(user => { const currentPermission = user.permissions[project.key] ?? "No Access"; const isProjectAdmin = currentPermission === "Admin"; const selectedAccess = draft.memberAccess[user.email]; const selected = Boolean(selectedAccess); return <div key={user.id} className="grid min-h-11 grid-cols-[minmax(240px,1fr)_110px_140px] items-center border-t px-3" style={{ borderColor: "#edf0f4", opacity: user.status === "Disabled" ? 0.5 : 1 }}><button type="button" disabled={isProjectAdmin || user.status === "Disabled"} onClick={() => toggleMember(user)} className="flex items-center gap-2 text-left"><span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm border" style={{ borderColor: selected ? "#1d3f73" : "#b8bfcc", backgroundColor: selected ? "#1d3f73" : "white" }}>{selected && <Check size={9} color="white" />}</span><Avatar owner={user.owner} size="sm" /><span><span className="block text-[10px] font-semibold" style={{ color: "#1a2234" }}>{user.name}</span><span className="block text-[9px]" style={{ color: "#8c94a6" }}>{user.email}</span></span></button><span className="text-[9px]" style={{ color: "#5c6478" }}>{currentPermission}</span>{selected ? canManageAccess ? <select disabled={isProjectAdmin} value={selectedAccess} onChange={event => changeMemberAccess(user.email, event.target.value as "Admin" | "Editor")} className="rounded border bg-white px-2 py-1 text-[10px] disabled:bg-[#f4f6f9]" style={{ borderColor: "#d9dee7", color: "#1a2234" }}><option>Admin</option><option>Editor</option></select> : <span className="text-[10px] font-semibold" style={{ color: "#1e6930" }}>{selectedAccess}</span> : <span className="text-[9px]" style={{ color: "#b0b8c8" }}>Not added</span>}</div>; })}</div></div>}
        </div>
        <ModalActions primary={team ? "Save Changes" : "Add Team"} onClose={onClose} />
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-[10px] font-semibold uppercase" style={{ color: "#5c6478" }}>{label}<div className="mt-1.5">{children}</div></label>;
}

function ModalActions({ primary, onClose }: { primary: string; onClose: () => void }) {
  return <div className="flex justify-end gap-2 px-5 py-3" style={{ backgroundColor: "#f7f8fa", borderTop: "1px solid #e2e6eb" }}><button type="button" onClick={onClose} className="rounded border px-3 py-1.5 text-[11px]" style={{ borderColor: "#d9dee7", color: "#5c6478" }}>Cancel</button><button type="submit" className="rounded px-4 py-1.5 text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}>{primary}</button></div>;
}

function EditorTeamsModal({ user, project, projectTeams, selectedTeamIds, onClose, onSave }: { user: AdminUser; project: AdminProject; projectTeams: AdminTeam[]; selectedTeamIds: string[]; onClose: () => void; onSave: (teamIds: string[]) => void }) {
  const activeTeams = projectTeams.filter(team => team.status === "Active");
  const [draftTeamIds, setDraftTeamIds] = useState(() => selectedTeamIds.filter(teamId => activeTeams.some(team => team.id === teamId)));

  function toggleTeam(teamId: string) {
    setDraftTeamIds(previous => previous.includes(teamId) ? previous.filter(id => id !== teamId) : [...previous, teamId]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button aria-label="Close team assignment" className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,.34)" }} onClick={onClose} />
      <div className="relative w-[460px] overflow-hidden rounded-md bg-white shadow-xl" style={{ border: "1px solid #d9dee7" }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}><div><h3 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Assign Editor Teams</h3><p className="text-[10px]" style={{ color: "#8c94a6" }}>{user.name} / {project.name}</p></div><button onClick={onClose} aria-label="Close"><X size={15} style={{ color: "#8c94a6" }} /></button></div>
        <div className="space-y-2 p-5">{activeTeams.map(team => { const checked = draftTeamIds.includes(team.id); return <button key={team.id} onClick={() => toggleTeam(team.id)} className="flex w-full items-center gap-2 rounded border px-3 py-2 text-left text-[11px]" style={{ color: checked ? "#1d3f73" : "#5c6478", backgroundColor: checked ? "#edf2fb" : "white", borderColor: checked ? "#bdd0ea" : "#d9dee7" }}><span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm border" style={{ borderColor: checked ? "#1d3f73" : "#b8bfcc", backgroundColor: checked ? "#1d3f73" : "white" }}>{checked && <Check size={9} color="white" />}</span>{team.name}</button>; })}<p className="pt-1 text-[10px]" style={{ color: draftTeamIds.length ? "#8c94a6" : "#b91c1c" }}>Editor must belong to at least one team.</p></div>
        <div className="flex justify-end gap-2 px-5 py-3" style={{ backgroundColor: "#f7f8fa", borderTop: "1px solid #e2e6eb" }}><button onClick={onClose} className="rounded border px-3 py-1.5 text-[11px]" style={{ borderColor: "#d9dee7", color: "#5c6478" }}>Cancel</button><button disabled={draftTeamIds.length === 0} onClick={() => onSave(draftTeamIds)} className="rounded px-4 py-1.5 text-[11px] font-semibold text-white disabled:opacity-45" style={{ backgroundColor: "#1d3f73" }}>Save Access</button></div>
      </div>
    </div>
  );
}

function AddExistingUserModal({ project, projectTeams, users, onClose, onAdd }: { project: AdminProject; projectTeams: AdminTeam[]; users: AdminUser[]; onClose: () => void; onAdd: (userId: string, permission: Exclude<ProjectPermission, "No Access">, teamIds: string[]) => void }) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [permission, setPermission] = useState<Exclude<ProjectPermission, "No Access">>("Editor");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const activeTeams = projectTeams.filter(team => team.status === "Active");
  const candidates = users.filter(user => user.email !== "marcus.webb@acme.com" && (user.permissions[project.key] ?? "No Access") === "No Access" && `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()));
  const canAdd = Boolean(selectedId) && (permission !== "Editor" || selectedTeamIds.length > 0);

  function changePermission(next: Exclude<ProjectPermission, "No Access">) {
    setPermission(next);
    setSelectedTeamIds(next === "Admin" ? activeTeams.map(team => team.id) : []);
  }

  function toggleTeam(teamId: string) {
    setSelectedTeamIds(previous => previous.includes(teamId) ? previous.filter(id => id !== teamId) : [...previous, teamId]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button aria-label="Close add user" className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,.34)" }} onClick={onClose} />
      <div className="relative flex h-[580px] w-[620px] flex-col overflow-hidden rounded-md bg-white shadow-xl" style={{ border: "1px solid #d9dee7" }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}><div><h3 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Add Existing User</h3><p className="text-[10px]" style={{ color: "#8c94a6" }}>{project.key} / {project.name}</p></div><button onClick={onClose} aria-label="Close"><X size={15} style={{ color: "#8c94a6" }} /></button></div>
        <div className="p-4"><div className="relative"><Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search workspace users..." className="admin-input pl-8" /></div></div>
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_240px] border-t" style={{ borderColor: "#e2e6eb" }}>
          <div className="overflow-auto p-4" style={{ borderRight: "1px solid #e2e6eb" }}>{candidates.map(user => <button key={user.id} onClick={() => setSelectedId(user.id)} className="mb-1 flex w-full items-center gap-2 rounded border px-3 py-2 text-left" style={{ color: "#1a2234", backgroundColor: selectedId === user.id ? "#edf2fb" : "white", borderColor: selectedId === user.id ? "#bdd0ea" : "#e2e6eb" }}><Avatar owner={user.owner} size="sm" /><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold">{user.name}</span><span className="block truncate text-[9px]" style={{ color: "#8c94a6" }}>{user.email}</span></span><span className="text-[9px]" style={{ color: user.status === "Disabled" ? "#b91c1c" : "#5c6478" }}>{user.status}</span>{selectedId === user.id && <Check size={12} style={{ color: "#1d3f73" }} />}</button>)}{candidates.length === 0 && <p className="py-10 text-center text-[11px]" style={{ color: "#8c94a6" }}>No users available to add.</p>}</div>
          <div className="space-y-4 p-4">
            <Field label="Access Level"><select value={permission} onChange={event => changePermission(event.target.value as Exclude<ProjectPermission, "No Access">)} className="admin-input bg-white"><option>Admin</option><option>Editor</option><option>Viewer</option></select></Field>
            <div><p className="text-[10px] font-semibold uppercase" style={{ color: "#5c6478" }}>Teams</p><div className="mt-2">
              {permission === "Admin" && <span className="inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[10px] font-semibold" style={{ color: "#1d3f73", backgroundColor: "#edf2fb", borderColor: "#bdd0ea" }}><Check size={11} />All Teams</span>}
              {permission === "Editor" && <div className="space-y-1.5">{activeTeams.map(team => { const checked = selectedTeamIds.includes(team.id); return <button key={team.id} onClick={() => toggleTeam(team.id)} className="flex w-full items-center gap-2 rounded border px-2 py-1.5 text-left text-[10px]" style={{ color: checked ? "#1d3f73" : "#5c6478", backgroundColor: checked ? "#edf2fb" : "white", borderColor: checked ? "#bdd0ea" : "#d9dee7" }}><span className="flex h-3 w-3 items-center justify-center rounded-sm border" style={{ borderColor: checked ? "#1d3f73" : "#b8bfcc", backgroundColor: checked ? "#1d3f73" : "white" }}>{checked && <Check size={9} color="white" />}</span>{team.name}</button>; })}<p className="text-[9px]" style={{ color: selectedTeamIds.length ? "#8c94a6" : "#b91c1c" }}>Select at least one team.</p></div>}
              {permission === "Viewer" && <p className="text-[10px] leading-4" style={{ color: "#8c94a6" }}>Project-wide read-only access. No team assignment.</p>}
            </div></div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3" style={{ backgroundColor: "#f7f8fa", borderTop: "1px solid #e2e6eb" }}><button onClick={onClose} className="rounded border px-3 py-1.5 text-[11px]" style={{ borderColor: "#d9dee7", color: "#5c6478" }}>Cancel</button><button disabled={!canAdd} onClick={() => onAdd(selectedId, permission, selectedTeamIds)} className="rounded px-4 py-1.5 text-[11px] font-semibold text-white disabled:opacity-45" style={{ backgroundColor: "#1d3f73" }}>Add User</button></div>
      </div>
    </div>
  );
}

export function WorkspaceProjectsPanel({ role, workspaceUsers, onChangeProjectAccess, onAddProjectTeam }: { role: Role; workspaceUsers: SharedWorkspaceUser[]; onChangeProjectAccess: (email: string, projectKey: string, permission: ProjectPermission, teamNames: string[]) => void; onAddProjectTeam: (projectKey: string, teamName: string) => void }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [selected, setSelected] = useState<SelectedNode>({ type: "project", key: "NXP" });
  const [expanded, setExpanded] = useState(() => new Set(["NXP"]));
  const [projectTab, setProjectTab] = useState<ProjectTab>("details");
  const [userSearch, setUserSearch] = useState("");
  const [projectModal, setProjectModal] = useState<AdminProject | null | undefined>(undefined);
  const [teamModal, setTeamModal] = useState<AdminTeam | null | undefined>(undefined);
  const [archiveProject, setArchiveProject] = useState<AdminProject | null>(null);
  const [deleteProject, setDeleteProject] = useState<AdminProject | null>(null);
  const [archiveTeam, setArchiveTeam] = useState<AdminTeam | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [removeUser, setRemoveUser] = useState<AdminUser | null>(null);
  const [editTeamsUser, setEditTeamsUser] = useState<AdminUser | null>(null);

  const users = useMemo<AdminUser[]>(() => workspaceUsers.map((user, index) => {
    const permissions = Object.fromEntries(user.projectAccess.map(access => [access.projectKey, access.level])) as Record<string, ProjectPermission>;
    const assignedTeamIds = user.projectAccess.flatMap(access => {
      if (access.level === "Admin") return teams.filter(team => team.projectKey === access.projectKey).map(team => team.id);
      if (access.level !== "Editor") return [];
      return teams.filter(team => team.projectKey === access.projectKey && access.teams.includes(team.name)).map(team => team.id);
    });
    return {
      id: `admin-user-${index + 1}`,
      name: user.name,
      email: user.email,
      owner: user.owner,
      status: user.status === "Deactive" || user.status === "Suspended" ? "Disabled" : user.status === "Invited" ? "Invited" : "Active",
      permissions,
      teams: assignedTeamIds,
    };
  }), [workspaceUsers, teams]);

  const visibleProjects = useMemo(() => projects.filter(project => accessFor(role, project.key) !== "No Access"), [projects, role]);
  const visibleTeams = useMemo(() => teams.filter(team => role !== "Project Member" || (team.projectKey === ROLE_SCOPE.projectMemberProjectKey && ROLE_SCOPE.projectMemberTeams.includes(team.name as typeof ROLE_SCOPE.projectMemberTeams[number]))), [teams, role]);
  const selectedProject = selected.type === "project" ? projects.find(project => project.key === selected.key) : selected.type === "team" ? projects.find(project => project.key === teams.find(team => team.id === selected.id)?.projectKey) : undefined;
  const selectedTeam = selected.type === "team" ? visibleTeams.find(team => team.id === selected.id) : undefined;
  const effectiveAccess = selectedProject ? accessFor(role, selectedProject.key) : role === "Workspace Admin" ? "Admin" : "No Access";
  const canManageProjectDetails = Boolean(selectedProject && role === "Workspace Admin");
  const canManageTeams = Boolean(selectedProject && role === "Workspace Admin");
  const canManageMembership = role === "Workspace Admin";
  const canCreateProject = role === "Workspace Admin";
  const projectTeams = selectedProject ? visibleTeams.filter(team => team.projectKey === selectedProject.key) : [];
  const filteredUsers = users.filter(user => {
    if (!selectedProject) return false;
    const permission = user.permissions[selectedProject.key] ?? "No Access";
    return user.email !== "marcus.webb@acme.com" && permission !== "No Access" && `${user.name} ${user.email}`.toLowerCase().includes(userSearch.toLowerCase());
  });

  useEffect(() => {
    if (role !== "Project Member") return;
    setSelected({ type: "project", key: ROLE_SCOPE.projectMemberProjectKey });
    setProjectTab("details");
    setExpanded(new Set([ROLE_SCOPE.projectMemberProjectKey]));
  }, [role]);

  function toggleProject(key: string) {
    setExpanded(previous => { const next = new Set(previous); next.has(key) ? next.delete(key) : next.add(key); return next; });
  }

  function saveProject(draft: ProjectDraft) {
    const owner = OWNERS.find(candidate => candidate.name === draft.ownerName) ?? OWNERS[0];
    if (projectModal) {
      setProjects(previous => previous.map(project => project.id === projectModal.id ? { ...project, ...draft, owner } : project));
    } else {
      const project: AdminProject = { id: `project-${draft.key.toLowerCase()}`, ...draft, owner, status: "Active" };
      setProjects(previous => [...previous, project]);
      setSelected({ type: "project", key: project.key });
    }
    setProjectModal(undefined);
  }

  function saveTeam(draft: TeamDraft) {
    if (!selectedProject) return;
    const { memberAccess, ...teamDraft } = draft;
    const lead = OWNERS.find(candidate => candidate.name === draft.leadName) ?? OWNERS[0];
    if (teamModal) {
      setTeams(previous => previous.map(team => team.id === teamModal.id ? { ...team, ...teamDraft, lead } : team));
    } else {
      setTeams(previous => [...previous, { id: `team-${selectedProject.key.toLowerCase()}-${draft.key.toLowerCase()}`, ...teamDraft, projectKey: selectedProject.key, lead, members: [] }]);
      onAddProjectTeam(selectedProject.key, draft.name);
      Object.entries(memberAccess).forEach(([email, permission]) => {
        const workspaceUser = workspaceUsers.find(user => user.email === email);
        if (!workspaceUser) return;
        if (permission === "Admin") {
          onChangeProjectAccess(email, selectedProject.key, "Admin", ["All Teams"]);
          return;
        }
        const currentAccess = workspaceUser.projectAccess.find(access => access.projectKey === selectedProject.key);
        const existingTeams = currentAccess?.level === "Editor" ? currentAccess.teams : [];
        onChangeProjectAccess(email, selectedProject.key, "Editor", Array.from(new Set([...existingTeams, draft.name])));
      });
      setExpanded(previous => new Set(previous).add(selectedProject.key));
    }
    setTeamModal(undefined);
  }

  function updatePermission(userId: string, projectKey: string, permission: ProjectPermission) {
    const user = users.find(candidate => candidate.id === userId);
    if (!user) return;
    const projectTeams = teams.filter(team => team.projectKey === projectKey);
    const currentTeamNames = projectTeams.filter(team => user.teams.includes(team.id)).map(team => team.name);
    onChangeProjectAccess(user.email, projectKey, permission, permission === "Admin" ? ["All Teams"] : permission === "Editor" ? currentTeamNames : []);
  }

  function addExistingUser(userId: string, projectKey: string, permission: Exclude<ProjectPermission, "No Access">, teamIds: string[]) {
    const user = users.find(candidate => candidate.id === userId);
    if (!user) return;
    const teamNames = teams.filter(team => teamIds.includes(team.id)).map(team => team.name);
    onChangeProjectAccess(user.email, projectKey, permission, permission === "Admin" ? ["All Teams"] : permission === "Editor" ? teamNames : []);
  }

  function saveEditorTeams(userId: string, projectKey: string, teamIds: string[]) {
    const user = users.find(candidate => candidate.id === userId);
    if (!user) return;
    const teamNames = teams.filter(team => teamIds.includes(team.id)).map(team => team.name);
    onChangeProjectAccess(user.email, projectKey, "Editor", teamNames);
    setEditTeamsUser(null);
  }

  function selectProject(key: string) {
    setSelected({ type: "project", key });
    setProjectTab("details");
  }

  return (
    <div className="-mx-6 -mb-6 flex min-h-[650px] overflow-hidden border-t" style={{ borderColor: "#e2e6eb" }}>
      <style>{`.admin-input{width:100%;padding:8px 10px;border:1px solid #d9dee7;border-radius:4px;font-size:12px;color:#1a2234;outline:none}.admin-input:focus{border-color:#8fa8ca;box-shadow:0 0 0 2px rgba(29,63,115,.08)}`}</style>
      <aside className="w-72 shrink-0 overflow-y-auto bg-[#f7f8fa]" style={{ borderRight: "1px solid #e2e6eb" }}>
        <div className="px-3 py-2 text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>Workspace & Projects</div>
        <button onClick={() => setSelected({ type: "workspace" })} className="flex w-full items-center gap-2 px-3 py-2 text-left" style={{ backgroundColor: selected.type === "workspace" ? "#e8eef8" : "transparent", color: "#1d3f73" }}><FolderKanban size={13} /><span className="flex-1 text-[11px] font-semibold">ACME Space Inc.</span><span className="text-[9px]">{visibleProjects.length}</span></button>
        <div className="py-1">
          {visibleProjects.map(project => {
            const isExpanded = expanded.has(project.key);
            const isSelected = selected.type === "project" && selected.key === project.key;
            const childTeams = visibleTeams.filter(team => team.projectKey === project.key);
            return <div key={project.key}>
              <div className="flex items-center" style={{ backgroundColor: isSelected ? "#e8eef8" : "transparent" }}><button aria-label={`${isExpanded ? "Collapse" : "Expand"} ${project.name}`} className="p-2 pl-4" onClick={() => toggleProject(project.key)} style={{ color: "#8c94a6" }}>{isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}</button><button onClick={() => selectProject(project.key)} className="flex min-w-0 flex-1 items-center gap-2 py-2 pr-3 text-left"><FolderKanban size={12} style={{ color: isSelected ? "#1d3f73" : "#5c6478" }} /><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold" style={{ color: isSelected ? "#1d3f73" : "#1a2234" }}>{project.name}</span><span className="block text-[9px]" style={{ color: "#8c94a6" }}>{project.key} / {childTeams.length} {childTeams.length === 1 ? "team" : "teams"}</span></span></button></div>
              {isExpanded && <div className="ml-9 border-l pl-2" style={{ borderColor: "#d9dee7" }}>{childTeams.map(team => <button key={team.id} onClick={() => setSelected({ type: "team", id: team.id })} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left" style={{ backgroundColor: selected.type === "team" && selected.id === team.id ? "#edf2fb" : "transparent", color: "#5c6478" }}><Users size={10} /><span className="truncate text-[10px]">{team.name}</span></button>)}</div>}
            </div>;
          })}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
        {selected.type === "workspace" && <>
          <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: "1px solid #e2e6eb" }}><div><h3 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>ACME Space Inc.</h3><p className="text-[10px]" style={{ color: "#8c94a6" }}>Company workspace / {visibleProjects.length} accessible projects</p></div><div className="flex-1" />{canCreateProject && <button onClick={() => setProjectModal(null)} className="flex items-center gap-1.5 rounded px-3 py-1.5 text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}><Plus size={12} /> Create Project</button>}</div>
          <div className="overflow-auto"><div className="grid min-w-[700px] grid-cols-[100px_minmax(220px,1fr)_120px_180px_90px] items-center border-b bg-[#f7f8fa] px-4 py-2 text-[9px] font-semibold uppercase" style={{ color: "#8c94a6", borderColor: "#e2e6eb" }}><span>Key</span><span>Project</span><span>Status</span><span>Owner</span><span>Teams</span></div>{visibleProjects.map(project => <button key={project.id} onClick={() => selectProject(project.key)} className="grid min-h-12 w-full min-w-[700px] grid-cols-[100px_minmax(220px,1fr)_120px_180px_90px] items-center border-b px-4 text-left hover:bg-[#f8fafc]" style={{ borderColor: "#edf0f4" }}><span className="font-mono text-[10px] font-semibold" style={{ color: "#2558a6" }}>{project.key}</span><span><span className="block text-[11px] font-semibold" style={{ color: "#1a2234" }}>{project.name}</span><span className="block truncate text-[9px]" style={{ color: "#8c94a6" }}>{project.description}</span></span><StatusBadge value={project.status} /><span className="flex items-center gap-2 text-[10px]" style={{ color: "#5c6478" }}><Avatar owner={project.owner} size="xs" />{project.owner.name}</span><span className="text-[10px]" style={{ color: "#5c6478" }}>{visibleTeams.filter(team => team.projectKey === project.key).length}</span></button>)}</div>
        </>}

        {selectedProject && selected.type === "project" && <>
          <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: "1px solid #e2e6eb" }}>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>{selectedProject.name}</h3>
                {role !== "Workspace Admin" && <span className="rounded-sm px-2 py-0.5 text-[9px] font-semibold" style={{ color: effectiveAccess === "Admin" ? "#2558a6" : "#1e6930", backgroundColor: effectiveAccess === "Admin" ? "#edf2fb" : "#eef6f0" }}>{effectiveAccess}</span>}
              </div>
              <p className="text-[10px]" style={{ color: "#8c94a6" }}>{selectedProject.key} / {selectedProject.status} / {projectTeams.length} {projectTeams.length === 1 ? "team" : "teams"}</p>
            </div>
            <div className="flex-1" />
            {canManageProjectDetails && <div className="flex gap-1"><IconButton label="Edit project" onClick={() => setProjectModal(selectedProject)}><Edit3 size={12} /></IconButton><IconButton label={selectedProject.status === "Active" ? "Archive project" : "Restore project"} onClick={() => selectedProject.status === "Active" ? setArchiveProject(selectedProject) : setProjects(previous => previous.map(project => project.id === selectedProject.id ? { ...project, status: "Active" } : project))}>{selectedProject.status === "Active" ? <Archive size={12} /> : <RotateCcw size={12} />}</IconButton><IconButton label="Delete project" danger onClick={() => setDeleteProject(selectedProject)}><Trash2 size={12} /></IconButton></div>}
          </div>
          <div className="flex h-9 items-end gap-5 px-5" style={{ borderBottom: "1px solid #e2e6eb" }}>{([['details', 'Details'], ...(role === "Project Member" ? [] : [['users', 'Users & Permissions']]), ['teams', 'Teams']] as [ProjectTab, string][]).map(([key, label]) => <button key={key} onClick={() => setProjectTab(key)} className="h-9 border-b-2 px-1 text-[11px] font-semibold" style={{ color: projectTab === key ? "#1d3f73" : "#5c6478", borderColor: projectTab === key ? "#1d3f73" : "transparent" }}>{label}</button>)}</div>

          {projectTab === "details" && (
            <div className="max-w-3xl space-y-5 overflow-auto p-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[["Project name", selectedProject.name], ["Project key", selectedProject.key], ["Status", selectedProject.status], ["Start date", selectedProject.startDate], ["Project owner", selectedProject.owner.name]].map(([label, value]) => <div key={label}><p className="text-[9px] font-semibold uppercase" style={{ color: "#8c94a6" }}>{label}</p><p className="mt-1 text-[12px] font-medium" style={{ color: "#1a2234" }}>{value}</p></div>)}
              </div>
              <div><p className="text-[9px] font-semibold uppercase" style={{ color: "#8c94a6" }}>Description</p><p className="mt-1 text-[12px] leading-5" style={{ color: "#5c6478" }}>{selectedProject.description}</p></div>
              <div className="space-y-3 pt-4" style={{ borderTop: "1px solid #e2e6eb" }}>
                <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>Estimation Settings</p>
                <div>
                  <p className="mb-2 text-[10px] font-semibold" style={{ color: "#5c6478" }}>Preliminary Estimate</p>
                  <div className="space-y-1.5">
                    {T_SHIRT_SIZES.map(size => <p key={size} className="text-[12px]" style={{ color: "#1a2234" }}><span className="inline-block w-7 font-semibold" style={{ color: "#1d3f73" }}>{size}</span><span style={{ color: "#8c94a6" }}>=</span><span className="ml-2 font-medium">{selectedProject.preliminaryPoints[size]} pts</span></p>)}
                  </div>
                </div>
                <div><p className="text-[10px] font-semibold" style={{ color: "#5c6478" }}>Point Conversion</p><p className="mt-1 text-[12px] font-medium" style={{ color: "#1a2234" }}>1 point = {selectedProject.hoursPerPoint} hours</p></div>
              </div>
              {effectiveAccess === "Viewer" && <div className="rounded border px-3 py-2 text-[11px]" style={{ color: "#5c6478", backgroundColor: "#f7f8fa", borderColor: "#d9dee7" }}>You can view this project, but project settings and membership are read-only.</div>}
            </div>
          )}

          {projectTab === "users" && (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: "1px solid #e2e6eb" }}>
                <div className="relative"><Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} /><input value={userSearch} onChange={event => setUserSearch(event.target.value)} placeholder="Search project users..." className="w-60 rounded border py-1.5 pl-7 pr-3 text-[11px] outline-none" style={{ borderColor: "#d9dee7" }} /></div>
                <div className="flex-1" />
                <span className="text-[10px]" style={{ color: "#8c94a6" }}>{filteredUsers.length} project users</span>
                {canManageMembership && <button onClick={() => setAddUserOpen(true)} className="flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-[10px] font-semibold" style={{ color: "#1d3f73", borderColor: "#bdd0ea" }}><UserPlus size={11} /> Add Existing User</button>}
              </div>
              <div className="overflow-auto">
                <div className="grid min-w-[720px] grid-cols-[minmax(280px,1fr)_130px_160px_100px] items-center border-b bg-[#f7f8fa] px-4 py-2 text-[9px] font-semibold uppercase" style={{ color: "#8c94a6", borderColor: "#e2e6eb" }}><span>User</span><span>Status</span><span>Access Level</span><span>Action</span></div>
                {filteredUsers.map(user => {
                  const permission = user.permissions[selectedProject.key] ?? "No Access";
                  const statusColor = user.status === "Disabled" ? "#b91c1c" : user.status === "Invited" ? "#a16207" : "#1e6930";
                  const statusBg = user.status === "Disabled" ? "#fef2f2" : user.status === "Invited" ? "#fffbeb" : "#eef6f0";
                  return (
                    <div key={user.id} className="grid min-h-12 min-w-[720px] grid-cols-[minmax(280px,1fr)_130px_160px_100px] items-center border-b bg-white px-4" style={{ borderColor: "#edf0f4" }}>
                      <div className="flex items-center gap-2"><Avatar owner={user.owner} size="sm" /><span><span className="block text-[11px] font-semibold" style={{ color: "#1a2234" }}>{user.name}</span><span className="block text-[9px]" style={{ color: "#8c94a6" }}>{user.email}</span></span></div>
                      <span className="w-fit rounded-sm px-2 py-0.5 text-[9px] font-semibold" style={{ color: statusColor, backgroundColor: statusBg }}>{user.status}</span>
                      <div className="flex flex-col items-start gap-1">
                        <select aria-label={`${user.name} access level`} disabled={!canManageMembership} value={permission} onChange={event => { const next = event.target.value as Exclude<ProjectPermission, "No Access">; if (next === "Editor") setEditTeamsUser(user); else updatePermission(user.id, selectedProject.key, next); }} className="w-32 rounded border bg-white px-2 py-1 text-[10px] disabled:bg-[#f4f6f9]" style={{ borderColor: "#d9dee7", color: "#1a2234" }}><option>Admin</option><option>Editor</option><option>Viewer</option></select>
                        {permission === "Admin" && <span className="text-[9px]" style={{ color: "#8c94a6" }}>All Teams</span>}
                      </div>
                      <div>{canManageMembership ? <button onClick={() => setRemoveUser(user)} className="rounded border px-2 py-1 text-[10px] font-semibold" style={{ color: "#b91c1c", borderColor: "#f0c7c1" }}>Remove</button> : <span className="text-[10px]" style={{ color: "#b0b8c8" }}>-</span>}</div>
                    </div>
                  );
                })}
                {filteredUsers.length === 0 && <p className="py-8 text-center text-[11px]" style={{ color: "#8c94a6" }}>No users have access to this project.</p>}
              </div>
            </div>
          )}

          {projectTab === "teams" && <div className="flex min-h-0 flex-1 flex-col"><div className="flex items-center px-4 py-2" style={{ borderBottom: "1px solid #e2e6eb" }}><p className="text-[10px]" style={{ color: "#8c94a6" }}>{projectTeams.length} {projectTeams.length === 1 ? "team" : "teams"} in this project</p><div className="flex-1" />{canManageTeams && <button onClick={() => setTeamModal(null)} className="flex items-center gap-1.5 rounded px-3 py-1.5 text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}><Plus size={12} /> Add Team</button>}</div><div className="overflow-auto"><div className="grid min-w-[760px] grid-cols-[90px_minmax(220px,1fr)_150px_110px_90px_90px] items-center border-b bg-[#f7f8fa] px-4 py-2 text-[9px] font-semibold uppercase" style={{ color: "#8c94a6", borderColor: "#e2e6eb" }}><span>Key</span><span>Team</span><span>Lead</span><span>Status</span><span>Members</span><span>Actions</span></div>{projectTeams.map(team => <div key={team.id} role="button" tabIndex={0} onClick={() => setSelected({ type: "team", id: team.id })} onKeyDown={event => { if (event.key === "Enter") setSelected({ type: "team", id: team.id }); }} className="grid min-h-12 w-full min-w-[760px] cursor-pointer grid-cols-[90px_minmax(220px,1fr)_150px_110px_90px_90px] items-center border-b px-4 text-left hover:bg-[#f8fafc]" style={{ borderColor: "#edf0f4" }}><span className="font-mono text-[10px] font-semibold" style={{ color: "#2558a6" }}>{team.key}</span><span className="text-[11px] font-semibold" style={{ color: "#1a2234" }}>{team.name}</span><span className="flex items-center gap-2 text-[10px]" style={{ color: "#5c6478" }}><Avatar owner={team.lead} size="xs" />{team.lead.name}</span><StatusBadge value={team.status} /><span className="text-[10px]" style={{ color: "#5c6478" }}>{users.filter(user => user.teams.includes(team.id)).length}</span><span className="flex gap-1" onClick={event => event.stopPropagation()}>{canManageTeams && <><IconButton label="Edit team" onClick={() => setTeamModal(team)}><Edit3 size={11} /></IconButton>{team.status === "Active" ? <IconButton label="Deactivate team" onClick={() => setArchiveTeam(team)}><Archive size={11} /></IconButton> : <IconButton label="Restore team" onClick={() => setTeams(previous => previous.map(item => item.id === team.id ? { ...item, status: "Active" } : item))}><RotateCcw size={11} /></IconButton>}</>}</span></div>)}</div></div>}
        </>}

        {selectedTeam && selectedProject && <><div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: "1px solid #e2e6eb" }}><div><h3 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>{selectedTeam.name}</h3><p className="text-[10px]" style={{ color: "#8c94a6" }}>{selectedProject.key} / {selectedProject.name}</p></div><div className="flex-1" />{canManageTeams && <IconButton label="Edit team" onClick={() => setTeamModal(selectedTeam)}><Edit3 size={12} /></IconButton>}</div><div className="max-w-3xl space-y-5 overflow-auto p-5"><div className="grid grid-cols-2 gap-5">{[["Team key", selectedTeam.key], ["Status", selectedTeam.status], ["Team lead", selectedTeam.lead.name], ["Members", String(users.filter(user => user.teams.includes(selectedTeam.id)).length)]].map(([label, value]) => <div key={label}><p className="text-[9px] font-semibold uppercase" style={{ color: "#8c94a6" }}>{label}</p><p className="mt-1 text-[12px] font-medium" style={{ color: "#1a2234" }}>{value}</p></div>)}</div><div><p className="mb-2 text-[9px] font-semibold uppercase" style={{ color: "#8c94a6" }}>Team members</p><div className="rounded border" style={{ borderColor: "#e2e6eb" }}>{users.filter(user => user.teams.includes(selectedTeam.id)).map(user => <div key={user.id} className="flex items-center gap-2 border-b px-3 py-2 last:border-b-0" style={{ borderColor: "#edf0f4" }}><Avatar owner={user.owner} size="sm" /><span className="text-[11px] font-semibold" style={{ color: "#1a2234" }}>{user.name}</span><span className="ml-auto text-[10px]" style={{ color: "#8c94a6" }}>{user.email}</span></div>)}</div></div></div></>}
      </section>

      {projectModal !== undefined && <ProjectModal project={projectModal} onClose={() => setProjectModal(undefined)} onSave={saveProject} />}
      {teamModal !== undefined && selectedProject && <TeamModal team={teamModal} project={selectedProject} users={users} canManageAccess={canManageMembership} onClose={() => setTeamModal(undefined)} onSave={saveTeam} />}
      {addUserOpen && selectedProject && <AddExistingUserModal project={selectedProject} projectTeams={projectTeams} users={users} onClose={() => setAddUserOpen(false)} onAdd={(userId, permission, teamIds) => { addExistingUser(userId, selectedProject.key, permission, teamIds); setAddUserOpen(false); }} />}
      {editTeamsUser && selectedProject && <EditorTeamsModal user={editTeamsUser} project={selectedProject} projectTeams={projectTeams} selectedTeamIds={editTeamsUser.teams} onClose={() => setEditTeamsUser(null)} onSave={teamIds => saveEditorTeams(editTeamsUser.id, selectedProject.key, teamIds)} />}
      {removeUser && selectedProject && <ConfirmDialog title={`Remove ${removeUser.name} from ${selectedProject.name}?`} body="The user's project access becomes No Access and all team memberships in this project are removed." action="Remove Access" onClose={() => setRemoveUser(null)} onConfirm={() => { updatePermission(removeUser.id, selectedProject.key, "No Access"); setRemoveUser(null); }} />}
      {archiveProject && <ConfirmDialog title={`${archiveProject.status === "Active" ? "Archive" : "Restore"} ${archiveProject.name}?`} body="The project becomes read-only and is removed from active delivery selectors. Existing work and audit history are preserved." action={archiveProject.status === "Active" ? "Archive Project" : "Restore Project"} onClose={() => setArchiveProject(null)} onConfirm={() => { setProjects(previous => previous.map(project => project.id === archiveProject.id ? { ...project, status: project.status === "Active" ? "Archived" : "Active" } : project)); setArchiveProject(null); }} />}
      {deleteProject && <ConfirmDialog title={`Delete ${deleteProject.name}?`} body="This removes the project from the workspace administration tree. This mockup treats delete as a Workspace Admin-only destructive action." action="Delete Project" requiredText={deleteProject.key} onClose={() => setDeleteProject(null)} onConfirm={() => { setProjects(previous => previous.filter(project => project.id !== deleteProject.id)); setTeams(previous => previous.filter(team => team.projectKey !== deleteProject.key)); setSelected({ type: "workspace" }); setDeleteProject(null); }} />}
      {archiveTeam && <ConfirmDialog title={`Deactivate ${archiveTeam.name}?`} body="The team becomes unavailable for new membership assignments. Existing delivery history is preserved." action="Deactivate Team" onClose={() => setArchiveTeam(null)} onConfirm={() => { setTeams(previous => previous.map(team => team.id === archiveTeam.id ? { ...team, status: "Deactive" } : team)); setArchiveTeam(null); }} />}
    </div>
  );
}
