import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Archive, Check, ChevronLeft, ChevronRight, Edit3, FolderKanban,
  MoreHorizontal, Plus, RotateCcw, Search, Shield, UserCheck,
  UserPlus, Users, X,
} from "lucide-react";
import { OWNERS, PROJECTS, SCOPE_PROJECTS, WORKSPACE_USERS, type Owner, type Role } from "../model";
import { Avatar } from "../components/shared";

type ManageTab = "projects" | "teams";
type ProjectStatus = "Active" | "Archived";
type TeamStatus = "Active" | "Deactive";
type UserStatus = "Active" | "Invited" | "Deactive";
type WorkspaceRoleCode = "workspace_admin" | "project_admin" | "project_member";

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

type TeamRecord = {
  id: string;
  key: string;
  name: string;
  description: string;
  projectKey: string;
  projectName: string;
  lead: Owner;
  status: TeamStatus;
  members: string[];
  updatedAt: string;
};

type UserRecord = {
  id: string;
  name: string;
  email: string;
  owner: Owner;
  workspaceRole: WorkspaceRoleCode;
  status: UserStatus;
  projectAccess: string[];
  teams: string[];
  lastLogin: string;
};

type ProjectDraft = {
  name: string;
  key: string;
  description: string;
  ownerName: string;
  startDate: string;
  teamNames: string[];
};

type TeamDraft = {
  projectKey: string;
  name: string;
  key: string;
  description: string;
  leadName: string;
  status: TeamStatus;
  members: string[];
};

type UserDraft = {
  name: string;
  email: string;
  workspaceRole: WorkspaceRoleCode;
  status: UserStatus;
  teams: string[];
};

const EMPTY_PROJECT_DRAFT: ProjectDraft = {
  name: "",
  key: "",
  description: "",
  ownerName: OWNERS[0].name,
  startDate: "2026-07-01",
  teamNames: [],
};

const EMPTY_TEAM_DRAFT: TeamDraft = {
  projectKey: SCOPE_PROJECTS[0].key,
  name: "",
  key: "",
  description: "",
  leadName: OWNERS[0].name,
  status: "Active",
  members: [OWNERS[0].name, OWNERS[1].name],
};

const EMPTY_USER_DRAFT: UserDraft = {
  name: "",
  email: "",
  workspaceRole: "project_member",
  status: "Invited",
  teams: [SCOPE_PROJECTS[0].teams[0]],
};

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
  {
    id: "project-leg",
    key: "LEG",
    name: "Legacy Billing Migration",
    description: "Completed migration retained for audit and delivery history.",
    owner: OWNERS[2],
    status: "Archived",
    teams: ["Core Platform"],
    members: 7,
    startDate: "Aug 12, 2024",
    updatedAt: "May 20, 2026",
  },
];

const INITIAL_TEAMS: TeamRecord[] = SCOPE_PROJECTS.flatMap((project, projectIndex) =>
  project.teams.map((team, teamIndex) => ({
    id: `team-${project.key.toLowerCase()}-${team.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    key: toKey(team),
    name: team,
    description: `${team} delivery team for ${project.name}.`,
    projectKey: project.key,
    projectName: project.name,
    lead: OWNERS[(projectIndex + teamIndex) % OWNERS.length],
    status: "Active" as const,
    members: OWNERS.slice(0, Math.max(2, 5 - teamIndex)).map(owner => owner.name),
    updatedAt: ["Today", "Yesterday", "Jun 18, 2026"][teamIndex % 3] ?? "Recently",
  })),
);

const INITIAL_USERS: UserRecord[] = WORKSPACE_USERS.map((user, index) => ({
  id: `user-${index + 1}`,
  name: user.name,
  email: user.email,
  owner: user.owner,
  workspaceRole: mapRoleToProd(user.role),
  status: user.status,
  projectAccess: index < 3 ? ["NXP", "REP"] : ["NXP"],
  teams: index === 0 ? ["Core Platform", "Identity & Access"] : [INITIAL_TEAMS[index % INITIAL_TEAMS.length].name],
  lastLogin: user.lastLogin,
}));

const ROLES: { code: WorkspaceRoleCode; label: string }[] = [
  { code: "workspace_admin", label: "Workspace Admin" },
  { code: "project_admin", label: "Project Admin" },
  { code: "project_member", label: "Project Member" },
];

function mapRoleToProd(role: Role): WorkspaceRoleCode {
  if (role === "Workspace Admin") return "workspace_admin";
  if (role === "Project Admin") return "project_admin";
  return "project_member";
}

function toKey(value: string) {
  const initials = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0])
    .join("")
    .slice(0, 5)
    .toUpperCase();
  return initials.length >= 2 ? initials : value.trim().slice(0, 3).toUpperCase();
}

function ownerForName(name: string) {
  return OWNERS.find(owner => owner.name === name) ?? OWNERS[0];
}

function projectForKey(key: string) {
  return SCOPE_PROJECTS.find(project => project.key === key) ?? SCOPE_PROJECTS[0];
}

function makeOwnerFromName(name: string): Owner {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = (words.length > 1 ? `${words[0][0]}${words[words.length - 1][0]}` : words[0]?.slice(0, 2) || "U").toUpperCase();
  return { name: name.trim() || "New User", initials, color: "#4a7c6e" };
}

function StatusDot({ status }: { status: ProjectStatus | TeamStatus | UserStatus }) {
  const cfg = status === "Active"
    ? { color: "#1e6930", bg: "#eaf5ed", border: "#c7e4ce", dot: "#2a8c3f" }
    : status === "Invited"
      ? { color: "#8a5808", bg: "#fef5e4", border: "#f5d899", dot: "#e59f0c" }
      : status === "Deactive"
        ? { color: "#b91c1c", bg: "#fef2f2", border: "#f0c7c1", dot: "#dc2626" }
        : { color: "#64748b", bg: "#f1f5f9", border: "#d9dee7", dot: "#94a3b8" };
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-semibold" style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
      {status}
    </span>
  );
}

function WorkspaceRoleBadge({ role }: { role: WorkspaceRoleCode }) {
  const meta = ROLES.find(item => item.code === role) ?? ROLES[2];
  const style = role === "workspace_admin"
    ? { bg: "#eef6f0", color: "#1e6930", border: "#c7e4ce" }
    : role === "project_admin"
      ? { bg: "#edf2fb", color: "#1d3f73", border: "#bdd0ea" }
      : { bg: "#f1f5f9", color: "#475569", border: "#d9dee7" };
  return (
    <span className="inline-flex flex-col gap-0.5 px-2 py-1 rounded-sm text-[10px] font-semibold" style={{ backgroundColor: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
      <span>{meta.label}</span>
      <span className="font-mono font-medium opacity-80">{role}</span>
    </span>
  );
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof FolderKanban }) {
  return (
    <div className="bg-white rounded px-3 py-2.5 flex items-center gap-3" style={{ border: "1px solid #e2e6eb" }}>
      <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: "#edf2fb", color: "#1d3f73" }}><Icon size={13} /></div>
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>{label}</p>
        <p className="text-[17px] font-semibold" style={{ color: "#1a2234" }}>{value}</p>
      </div>
    </div>
  );
}

function Tabs({ activeTab, onChange }: { activeTab: ManageTab; onChange: (tab: ManageTab) => void }) {
  const tabs: { key: ManageTab; label: string; icon: typeof FolderKanban }[] = [
    { key: "projects", label: "Projects", icon: FolderKanban },
    { key: "teams", label: "Teams", icon: Users },
  ];
  return (
    <div className="flex items-center gap-1 p-1 rounded" style={{ backgroundColor: "#edf0f4" }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button key={tab.key} onClick={() => onChange(tab.key)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold" style={{ color: activeTab === tab.key ? "#1d3f73" : "#5c6478", backgroundColor: activeTab === tab.key ? "#fff" : "transparent", boxShadow: activeTab === tab.key ? "0 1px 2px rgba(0,0,0,.08)" : "none" }}>
            <Icon size={12} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function ProjectModal({ project, existingKeys, allTeamNames, onClose, onSave }: { project: ProjectRecord | null; existingKeys: string[]; allTeamNames: string[]; onClose: () => void; onSave: (draft: ProjectDraft) => void }) {
  const [draft, setDraft] = useState<ProjectDraft>(project ? { name: project.name, key: project.key, description: project.description, ownerName: project.owner.name, startDate: "2025-01-06", teamNames: project.teams } : EMPTY_PROJECT_DRAFT);
  const [error, setError] = useState("");
  const editing = Boolean(project);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const key = draft.key.trim().toUpperCase();
    if (!draft.name.trim() || !key) return setError("Project name and key are required.");
    if (!/^[A-Z][A-Z0-9]{1,9}$/.test(key)) return setError("Key must be 2-10 uppercase letters or numbers and start with a letter.");
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
        <ModalHeader title={editing ? "Edit Project" : "Create Project"} subtitle="ACME Space Inc. / Company project" onClose={onClose} />
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <ErrorMessage text={error} />}
          <div className="grid grid-cols-[1fr_150px] gap-4">
            <Field label="Project name *"><input autoFocus value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} placeholder="e.g. Customer Portal" className="form-input" /></Field>
            <Field label="Project key *"><input value={draft.key} disabled={editing} onChange={event => setDraft({ ...draft, key: event.target.value.toUpperCase() })} placeholder="CP" maxLength={10} className="form-input font-mono uppercase disabled:bg-[#f1f3f6]" /></Field>
          </div>
          <Field label="Description"><textarea value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} rows={3} placeholder="Describe the project scope and delivery outcome..." className="form-input resize-none" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Project owner"><select value={draft.ownerName} onChange={event => setDraft({ ...draft, ownerName: event.target.value })} className="form-input bg-white">{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field>
            <Field label="Start date"><input type="date" value={draft.startDate} onChange={event => setDraft({ ...draft, startDate: event.target.value })} className="form-input" /></Field>
          </div>
          <Picker title="Teams" caption="A team can be linked to multiple projects." count={draft.teamNames.length}>
            {allTeamNames.map(team => {
              const selected = draft.teamNames.includes(team);
              return <CheckButton key={team} selected={selected} onClick={() => toggleTeam(team)} icon={<Users size={11} />} label={team} />;
            })}
          </Picker>
        </div>
        <ModalFooter primaryLabel={editing ? "Save Changes" : "Create Project"} onClose={onClose} />
      </form>
    </div>
  );
}

function TeamModal({ team, projects, existingKeys, onClose, onSave }: { team: TeamRecord | null; projects: ProjectRecord[]; existingKeys: string[]; onClose: () => void; onSave: (draft: TeamDraft) => void }) {
  const [draft, setDraft] = useState<TeamDraft>(team ? { projectKey: team.projectKey, name: team.name, key: team.key, description: team.description, leadName: team.lead.name, status: team.status, members: team.members } : EMPTY_TEAM_DRAFT);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<"info" | "members">("info");
  const [memberSearch, setMemberSearch] = useState("");
  const editing = Boolean(team);
  const filteredMembers = OWNERS.filter(owner => `${owner.name} ${owner.initials}`.toLowerCase().includes(memberSearch.toLowerCase()));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const key = draft.key.trim().toUpperCase();
    if (!draft.name.trim() || !key || !draft.projectKey) return setError("Project, team name and team key are required.");
    if (!/^[A-Z][A-Z0-9]{1,9}$/.test(key)) return setError("Team key must be 2-10 uppercase letters or numbers.");
    if (!editing && existingKeys.includes(key)) return setError("Team key already exists.");
    onSave({ ...draft, key, name: draft.name.trim() });
  }

  function updateName(name: string) {
    setDraft(previous => ({ ...previous, name, key: editing || previous.key ? previous.key : toKey(name) }));
  }

  function toggleMember(member: string) {
    setDraft(previous => ({ ...previous, members: previous.members.includes(member) ? previous.members.filter(item => item !== member) : [...previous.members, member] }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.34)" }} onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-[680px] h-[600px] bg-white rounded-md shadow-2xl overflow-hidden flex flex-col" style={{ border: "1px solid #d4d8de" }}>
        <ModalHeader title={editing ? "Edit Team" : "Create Team"} subtitle="Manage Projects / Teams" onClose={onClose} />
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          {error && <ErrorMessage text={error} />}
          <div className="flex items-center gap-1 p-1 rounded" style={{ backgroundColor: "#edf0f4" }}>
            <UserModalTab active={activeSection === "info"} onClick={() => setActiveSection("info")} label="Team Info" />
            <UserModalTab active={activeSection === "members"} onClick={() => setActiveSection("members")} label={`Members (${draft.members.length})`} />
          </div>

          {activeSection === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Project *"><select value={draft.projectKey} onChange={event => setDraft({ ...draft, projectKey: event.target.value })} className="form-input bg-white">{projects.filter(project => project.status === "Active").map(project => <option key={project.key} value={project.key}>{project.key} / {project.name}</option>)}</select></Field>
                <Field label="Team lead"><select value={draft.leadName} onChange={event => setDraft({ ...draft, leadName: event.target.value })} className="form-input bg-white">{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field>
              </div>
              <div className="grid grid-cols-[1fr_140px] gap-4">
                <Field label="Team name *"><input autoFocus value={draft.name} onChange={event => updateName(event.target.value)} placeholder="e.g. Platform Services" className="form-input" /></Field>
                <Field label="Team key *"><input value={draft.key} onChange={event => setDraft({ ...draft, key: event.target.value.toUpperCase() })} maxLength={10} placeholder="PS" className="form-input font-mono uppercase" /></Field>
              </div>
              <Field label="Description"><textarea value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} rows={3} placeholder="Describe ownership, product area, or delivery responsibility..." className="form-input resize-none" /></Field>
              <div className="max-w-[220px]">
                <Field label="Status"><select value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value as TeamStatus })} className="form-input bg-white"><option>Active</option><option>Deactive</option></select></Field>
              </div>
            </div>
          )}

          {activeSection === "members" && (
            <Picker title="Members" caption="Choose workspace users assigned to this team." count={draft.members.length} layout="list" searchValue={memberSearch} onSearch={setMemberSearch} searchPlaceholder="Search members...">
              {filteredMembers.map(owner => <CheckButton key={owner.name} selected={draft.members.includes(owner.name)} onClick={() => toggleMember(owner.name)} icon={<Avatar owner={owner} size="xs" />} label={owner.name} />)}
              {filteredMembers.length === 0 && <PickerEmpty text="No members found" />}
            </Picker>
          )}
        </div>
        <ModalFooter primaryLabel={editing ? "Save Changes" : "Create Team"} onClose={onClose} />
      </form>
    </div>
  );
}

function UserModal({ user, teams, existingEmails, onClose, onSave }: { user: UserRecord | null; teams: TeamRecord[]; existingEmails: string[]; onClose: () => void; onSave: (draft: UserDraft) => void }) {
  const [draft, setDraft] = useState<UserDraft>(user ? { name: user.name, email: user.email, workspaceRole: user.workspaceRole, status: user.status, teams: user.teams } : EMPTY_USER_DRAFT);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<"info" | "teams">("info");
  const [teamSearch, setTeamSearch] = useState("");
  const editing = Boolean(user);
  const filteredTeams = teams.filter(team => team.status === "Active" && `${team.name} ${team.key} ${team.projectName}`.toLowerCase().includes(teamSearch.toLowerCase()));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = draft.email.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("A valid email is required.");
    if (!editing && existingEmails.includes(email)) return setError("This user already exists.");
    onSave({ ...draft, email, name: draft.name.trim() || email.split("@")[0] });
  }

  function toggleTeam(teamName: string) {
    setDraft(previous => ({ ...previous, teams: previous.teams.includes(teamName) ? previous.teams.filter(item => item !== teamName) : [...previous.teams, teamName] }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.34)" }} onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-[680px] h-[600px] bg-white rounded-md shadow-2xl overflow-hidden flex flex-col" style={{ border: "1px solid #d4d8de" }}>
        <ModalHeader title={editing ? "Edit User" : "Invite User"} subtitle="Manage Projects / Users" onClose={onClose} />
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          {error && <ErrorMessage text={error} />}
          <div className="flex items-center gap-1 p-1 rounded" style={{ backgroundColor: "#edf0f4" }}>
            <UserModalTab active={activeSection === "info"} onClick={() => setActiveSection("info")} label="Info" />
            <UserModalTab active={activeSection === "teams"} onClick={() => setActiveSection("teams")} label={`Teams (${draft.teams.length})`} />
          </div>

          {activeSection === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full name"><input autoFocus value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} placeholder="e.g. Alex Morgan" className="form-input" /></Field>
                <Field label="Email *"><input value={draft.email} disabled={editing} onChange={event => setDraft({ ...draft, email: event.target.value })} placeholder="name@company.com" className="form-input disabled:bg-[#f1f3f6]" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Access role"><select value={draft.workspaceRole} onChange={event => setDraft({ ...draft, workspaceRole: event.target.value as WorkspaceRoleCode })} className="form-input bg-white">{ROLES.map(role => <option key={role.code} value={role.code}>{role.label} / {role.code}</option>)}</select></Field>
                <Field label="Status"><select value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value as UserStatus })} className="form-input bg-white"><option>Active</option><option>Invited</option><option>Deactive</option></select></Field>
              </div>
            </div>
          )}

          {activeSection === "teams" && (
            <Picker title="Team membership" caption="Teams determine the projects this user can work in." count={draft.teams.length} layout="list" searchValue={teamSearch} onSearch={setTeamSearch} searchPlaceholder="Search teams...">
              {filteredTeams.map(team => <CheckButton key={team.id} selected={draft.teams.includes(team.name)} onClick={() => toggleTeam(team.name)} icon={<Users size={11} />} label={`${team.name} / ${team.projectKey}`} />)}
              {filteredTeams.length === 0 && <PickerEmpty text="No teams found" />}
            </Picker>
          )}
        </div>
        <ModalFooter primaryLabel={editing ? "Save Changes" : "Send Invite"} onClose={onClose} />
      </form>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
      <div><p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>{title}</p><p className="text-[10px]" style={{ color: "#8c94a6" }}>{subtitle}</p></div>
      <button type="button" aria-label="Close form" onClick={onClose} className="p-1" style={{ color: "#8c94a6" }}><X size={15} /></button>
    </div>
  );
}

function UserModalTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="flex-1 px-3 py-1.5 rounded text-[11px] font-semibold" style={{ color: active ? "#1d3f73" : "#5c6478", backgroundColor: active ? "white" : "transparent", boxShadow: active ? "0 1px 2px rgba(0,0,0,.08)" : "none" }}>
      {label}
    </button>
  );
}

function ModalFooter({ primaryLabel, onClose }: { primaryLabel: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2 px-5 py-3" style={{ backgroundColor: "#f7f8fa", borderTop: "1px solid #e2e6eb" }}>
      <button type="button" onClick={onClose} className="px-3 py-1.5 rounded text-[11px]" style={{ border: "1px solid #d9dee7", color: "#5c6478" }}>Cancel</button>
      <button type="submit" className="px-4 py-1.5 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}>{primaryLabel}</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#5c6478" }}>{label}<div className="mt-1.5">{children}</div></label>;
}

function ErrorMessage({ text }: { text: string }) {
  return <div role="alert" className="px-3 py-2 rounded text-[11px]" style={{ color: "#b91c1c", backgroundColor: "#fef2f2", border: "1px solid #f0c7c1" }}>{text}</div>;
}

function Picker({ title, caption, count, children, layout = "grid", searchValue, onSearch, searchPlaceholder }: { title: string; caption: string; count: number; children: React.ReactNode; layout?: "grid" | "list"; searchValue?: string; onSearch?: (value: string) => void; searchPlaceholder?: string }) {
  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div><label className="block text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#5c6478" }}>{title}</label><p className="text-[10px] mt-0.5" style={{ color: "#8c94a6" }}>{caption}</p></div>
        <span className="text-[10px]" style={{ color: "#5c6478" }}>{count} selected</span>
      </div>
      {onSearch && (
        <div className="relative mb-2">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} />
          <input value={searchValue ?? ""} onChange={event => onSearch(event.target.value)} placeholder={searchPlaceholder ?? "Search..."} className="w-full pl-7 pr-3 py-1.5 rounded text-[11px] focus:outline-none" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
        </div>
      )}
      <div className={`${layout === "list" ? "flex flex-col max-h-[380px]" : "grid grid-cols-2 max-h-40"} gap-2 overflow-y-auto p-2 rounded`} style={{ border: "1px solid #e2e6eb", backgroundColor: "#fafbfc" }}>{children}</div>
    </div>
  );
}

function PickerEmpty({ text }: { text: string }) {
  return <div className="px-2.5 py-2 text-[10px] rounded" style={{ color: "#8c94a6", backgroundColor: "white", border: "1px dashed #d9dee7" }}>{text}</div>;
}

function CheckButton({ selected, onClick, icon, label }: { selected: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 px-2.5 py-2 rounded text-left text-[11px] min-w-0" style={{ color: selected ? "#1d3f73" : "#5c6478", backgroundColor: selected ? "#edf2fb" : "white", border: `1px solid ${selected ? "#bdd0ef" : "#e2e6eb"}` }}>
      <span className="w-3.5 h-3.5 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: selected ? "#1d3f73" : "white", border: `1px solid ${selected ? "#1d3f73" : "#b8c0cc"}` }}>{selected && <Check size={9} className="text-white" />}</span>
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} />
      <input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="pl-7 pr-3 py-1.5 rounded text-[11px] focus:outline-none w-56" style={{ border: "1px solid #d9dee7" }} />
    </div>
  );
}

function Segmented<T extends string>({ value, values, onChange }: { value: T; values: readonly T[]; onChange: (value: T) => void }) {
  return (
    <div className="flex items-center rounded p-0.5" style={{ backgroundColor: "#edf0f4" }}>
      {values.map(item => <button key={item} onClick={() => onChange(item)} className="px-3 py-1 rounded text-[10px] font-medium" style={{ color: value === item ? "#1d3f73" : "#5c6478", backgroundColor: value === item ? "white" : "transparent", boxShadow: value === item ? "0 1px 2px rgba(0,0,0,.08)" : "none" }}>{item}</button>)}
    </div>
  );
}

export function ProjectsPage({ role, createRequest = 0, onCreateRequestHandled }: { role: Role; createRequest?: number; onCreateRequestHandled?: () => void }) {
  const [activeTab, setActiveTab] = useState<ManageTab>("projects");
  const [projects, setProjects] = useState<ProjectRecord[]>(INITIAL_PROJECTS);
  const [teams, setTeams] = useState<TeamRecord[]>(INITIAL_TEAMS);
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null | undefined>(undefined);
  const [editingTeam, setEditingTeam] = useState<TeamRecord | null | undefined>(undefined);
  const [editingUser, setEditingUser] = useState<UserRecord | null | undefined>(undefined);
  const [archiveProjectTarget, setArchiveProjectTarget] = useState<ProjectRecord | null>(null);
  const [restoreProjectTarget, setRestoreProjectTarget] = useState<ProjectRecord | null>(null);
  const [archiveTeamTarget, setArchiveTeamTarget] = useState<TeamRecord | null>(null);
  const [restoreTeamTarget, setRestoreTeamTarget] = useState<TeamRecord | null>(null);
  const canManageCompanyStructure = role === "Workspace Admin";
  const allTeamNames = Array.from(new Set(teams.map(team => team.name))).sort();

  useEffect(() => {
    if (createRequest > 0 && canManageCompanyStructure) {
      setActiveTab("projects");
      setEditingProject(null);
      onCreateRequestHandled?.();
    }
  }, [createRequest, canManageCompanyStructure, onCreateRequestHandled]);

  function saveProject(draft: ProjectDraft) {
    const owner = ownerForName(draft.ownerName);
    if (editingProject) {
      setProjects(previous => previous.map(project => project.id === editingProject.id ? { ...project, name: draft.name.trim(), description: draft.description.trim(), owner, teams: draft.teamNames, updatedAt: "Just now" } : project));
    } else {
      setProjects(previous => [{
        id: `project-${draft.key.toLowerCase()}`,
        key: draft.key,
        name: draft.name.trim(),
        description: draft.description.trim(),
        owner,
        status: "Active",
        teams: draft.teamNames,
        members: 1,
        startDate: new Date(`${draft.startDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        updatedAt: "Just now",
      }, ...previous]);
    }
    setEditingProject(undefined);
  }

  function saveTeam(draft: TeamDraft) {
    const project = projectForKey(draft.projectKey);
    const lead = ownerForName(draft.leadName);
    if (editingTeam) {
      setTeams(previous => previous.map(team => team.id === editingTeam.id ? { ...team, ...draft, projectName: project.name, lead, updatedAt: "Just now" } : team));
    } else {
      setTeams(previous => [{
        id: `team-${draft.projectKey.toLowerCase()}-${draft.key.toLowerCase()}`,
        key: draft.key,
        name: draft.name,
        description: draft.description,
        projectKey: draft.projectKey,
        projectName: project.name,
        lead,
        status: draft.status,
        members: draft.members,
        updatedAt: "Just now",
      }, ...previous]);
      setProjects(previous => previous.map(item => item.key === draft.projectKey && !item.teams.includes(draft.name) ? { ...item, teams: [...item.teams, draft.name], updatedAt: "Just now" } : item));
    }
    setEditingTeam(undefined);
  }

  function projectAccessFromTeams(teamNames: string[]) {
    return Array.from(new Set(teams.filter(team => teamNames.includes(team.name)).map(team => team.projectKey)));
  }

  function saveUser(draft: UserDraft) {
    const derivedProjectAccess = projectAccessFromTeams(draft.teams);
    if (editingUser) {
      setUsers(previous => previous.map(user => user.id === editingUser.id ? { ...user, ...draft, projectAccess: derivedProjectAccess, owner: makeOwnerFromName(draft.name), lastLogin: draft.status === "Invited" ? "-" : user.lastLogin } : user));
    } else {
      const owner = makeOwnerFromName(draft.name);
      setUsers(previous => [{
        id: `user-${Date.now()}`,
        name: draft.name,
        email: draft.email,
        owner,
        workspaceRole: draft.workspaceRole,
        status: draft.status,
        projectAccess: derivedProjectAccess,
        teams: draft.teams,
        lastLogin: draft.status === "Invited" ? "-" : "Just now",
      }, ...previous]);
    }
    setEditingUser(undefined);
  }

  function archiveProject(project: ProjectRecord) {
    setProjects(previous => previous.map(item => item.id === project.id ? { ...item, status: "Archived", updatedAt: "Just now" } : item));
    setArchiveProjectTarget(null);
  }

  function restoreProject(project: ProjectRecord) {
    setProjects(previous => previous.map(item => item.id === project.id ? { ...item, status: "Active", updatedAt: "Just now" } : item));
    setRestoreProjectTarget(null);
  }

  function archiveTeam(team: TeamRecord) {
    setTeams(previous => previous.map(item => item.id === team.id ? { ...item, status: "Deactive", updatedAt: "Just now" } : item));
    setArchiveTeamTarget(null);
  }

  function restoreTeam(team: TeamRecord) {
    setTeams(previous => previous.map(item => item.id === team.id ? { ...item, status: "Active", updatedAt: "Just now" } : item));
    setRestoreTeamTarget(null);
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <style>{`.form-input{width:100%;padding:0.5rem 0.75rem;border:1px solid #d9dee7;border-radius:4px;font-size:12px;color:#1a2234;outline:none}.form-input:focus{border-color:rgba(29,63,115,.45);box-shadow:0 0 0 2px rgba(29,63,115,.08)}`}</style>
      <div className="px-4 py-3 flex items-center gap-4 shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div>
          <h2 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>Manage Projects</h2>
          <p className="text-[10px] mt-0.5" style={{ color: "#8c94a6" }}>Projects and teams under ACME Space Inc.</p>
        </div>
        <Tabs activeTab={activeTab} onChange={setActiveTab} />
        <div className="flex-1" />
        {activeTab === "projects" && canManageCompanyStructure && <button onClick={() => setEditingProject(null)} className="primary-button"><Plus size={12} /> Create Project</button>}
        {activeTab === "teams" && canManageCompanyStructure && <button onClick={() => setEditingTeam(null)} className="primary-button"><Plus size={12} /> Create Team</button>}
      </div>

      {activeTab === "projects" && <ProjectsTab projects={projects} canManage={canManageCompanyStructure} onEdit={setEditingProject} onArchive={setArchiveProjectTarget} onRestore={setRestoreProjectTarget} />}
      {activeTab === "teams" && <TeamsTab teams={teams} projects={projects} canManage={canManageCompanyStructure} onEdit={setEditingTeam} onArchive={setArchiveTeamTarget} onRestore={setRestoreTeamTarget} />}

      <style>{`.primary-button{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:4px;font-size:11px;font-weight:600;color:white;background-color:#1d3f73}`}</style>

      {editingProject !== undefined && <ProjectModal project={editingProject} existingKeys={projects.map(project => project.key)} allTeamNames={allTeamNames} onClose={() => setEditingProject(undefined)} onSave={saveProject} />}
      {editingTeam !== undefined && <TeamModal team={editingTeam} projects={projects} existingKeys={teams.filter(team => team.id !== editingTeam?.id).map(team => team.key)} onClose={() => setEditingTeam(undefined)} onSave={saveTeam} />}
      {editingUser !== undefined && <UserModal user={editingUser} teams={teams} existingEmails={users.filter(user => user.id !== editingUser?.id).map(user => user.email.toLowerCase())} onClose={() => setEditingUser(undefined)} onSave={saveUser} />}
      {archiveProjectTarget && <ConfirmDestructive title={`Archive ${archiveProjectTarget.name}?`} body="The project becomes read-only and is hidden from active selectors. Teams and delivery history are preserved." actionLabel="Archive Project" onCancel={() => setArchiveProjectTarget(null)} onConfirm={() => archiveProject(archiveProjectTarget)} />}
      {restoreProjectTarget && <ConfirmDestructive tone="restore" title={`Restore ${restoreProjectTarget.name}?`} body="The project returns to active selectors and can be managed again by Workspace Admin." actionLabel="Restore Project" onCancel={() => setRestoreProjectTarget(null)} onConfirm={() => restoreProject(restoreProjectTarget)} />}
      {archiveTeamTarget && <ConfirmDestructive title={`Deactivate ${archiveTeamTarget.name}?`} body="The team becomes unavailable in new project/team selectors. Existing history is preserved." actionLabel="Deactivate Team" onCancel={() => setArchiveTeamTarget(null)} onConfirm={() => archiveTeam(archiveTeamTarget)} />}
      {restoreTeamTarget && <ConfirmDestructive tone="restore" title={`Restore ${restoreTeamTarget.name}?`} body="The team returns to active project/team selectors and can receive resource allocations again." actionLabel="Restore Team" onCancel={() => setRestoreTeamTarget(null)} onConfirm={() => restoreTeam(restoreTeamTarget)} />}
    </div>
  );
}

function ProjectsTab({ projects, canManage, onEdit, onArchive, onRestore }: { projects: ProjectRecord[]; canManage: boolean; onEdit: (project: ProjectRecord) => void; onArchive: (project: ProjectRecord) => void; onRestore: (project: ProjectRecord) => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | ProjectStatus>("Active");
  const filtered = useMemo(() => projects.filter(project => (status === "All" || project.status === status) && `${project.key} ${project.name} ${project.owner.name}`.toLowerCase().includes(search.toLowerCase())), [projects, search, status]);

  return (
    <>
      <div className="grid grid-cols-4 gap-3 px-4 py-3 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
        <MetricCard label="Total Projects" value={projects.length} icon={FolderKanban} />
        <MetricCard label="Active" value={projects.filter(item => item.status === "Active").length} icon={Check} />
        <MetricCard label="Archived" value={projects.filter(item => item.status === "Archived").length} icon={Archive} />
        <MetricCard label="Linked Teams" value={new Set(projects.flatMap(item => item.teams)).size} icon={Users} />
      </div>
      <Toolbar count={`${filtered.length} projects`}>
        <SearchBox value={search} onChange={setSearch} placeholder="Search projects..." />
        <Segmented value={status} values={["All", "Active", "Archived"] as const} onChange={setStatus} />
      </Toolbar>
      <div className="flex-1 overflow-auto"><div className="min-w-[1120px]">
        <Header columns={[["w-20", "Key"], ["flex-1", "Project"], ["w-24", "Status"], ["w-36", "Owner"], ["w-44", "Teams"], ["w-20", "Members"], ["w-28", "Start Date"], ["w-24", "Updated"], ["w-20 text-right", "Actions"]]} />
        {filtered.map(project => <div key={project.id} className={canManage ? "row cursor-pointer hover:bg-[#f7f8fa]" : "row"} onClick={() => canManage && onEdit(project)}>
          <div className="w-20 shrink-0 font-mono text-[10px] font-semibold" style={{ color: "#2558a6" }}>{project.key}</div>
          <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold truncate" style={{ color: "#1a2234" }}>{project.name}</p><p className="text-[9px] truncate mt-0.5" style={{ color: "#8c94a6" }}>{project.description || "No description"}</p></div>
          <div className="w-24 shrink-0"><StatusDot status={project.status} /></div>
          <div className="w-36 shrink-0 flex items-center gap-1.5"><Avatar owner={project.owner} size="xs" /><span className="text-[10px] truncate" style={{ color: "#5c6478" }}>{project.owner.name}</span></div>
          <div className="w-44 shrink-0 flex items-center -space-x-1">{project.teams.slice(0, 2).map(team => <span key={team} className="px-1.5 py-0.5 rounded-sm text-[9px] truncate max-w-24" style={{ color: "#475569", backgroundColor: "#f1f5f9", border: "1px solid white" }}>{team}</span>)}{project.teams.length > 2 && <span className="text-[9px] ml-1.5" style={{ color: "#8c94a6" }}>+{project.teams.length - 2}</span>}{project.teams.length === 0 && <span className="text-[9px]" style={{ color: "#b0b8c8" }}>No teams</span>}</div>
          <div className="w-20 shrink-0 text-[10px]" style={{ color: "#5c6478" }}>{project.members}</div><div className="w-28 shrink-0 text-[10px]" style={{ color: "#5c6478" }}>{project.startDate}</div><div className="w-24 shrink-0 text-[10px]" style={{ color: "#8c94a6" }}>{project.updatedAt}</div>
          <RowActions canManage={canManage} active={project.status === "Active"} onEdit={() => onEdit(project)} onArchive={() => onArchive(project)} onRestore={() => onRestore(project)} archiveLabel="Archive" restoreLabel="Restore" />
        </div>)}
        {filtered.length === 0 && <EmptyTable icon={FolderKanban} title="No projects found" />}
      </div></div>
      <Footer count={filtered.length} />
      <TableStyles />
    </>
  );
}

function TeamsTab({ teams, projects, canManage, onEdit, onArchive, onRestore }: { teams: TeamRecord[]; projects: ProjectRecord[]; canManage: boolean; onEdit: (team: TeamRecord) => void; onArchive: (team: TeamRecord) => void; onRestore: (team: TeamRecord) => void }) {
  const [search, setSearch] = useState("");
  const [project, setProject] = useState("All");
  const [status, setStatus] = useState<"All" | TeamStatus>("Active");
  const filtered = useMemo(() => teams.filter(team => (project === "All" || team.projectKey === project) && (status === "All" || team.status === status) && `${team.key} ${team.name} ${team.projectName} ${team.lead.name}`.toLowerCase().includes(search.toLowerCase())), [teams, project, search, status]);
  const activeTeams = teams.filter(team => team.status === "Active");

  return (
    <>
      <div className="grid grid-cols-3 gap-3 px-4 py-3 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
        <MetricCard label="Total Teams" value={teams.length} icon={Users} />
        <MetricCard label="Active" value={activeTeams.length} icon={Check} />
        <MetricCard label="Deactive" value={teams.filter(team => team.status === "Deactive").length} icon={Archive} />
      </div>
      <Toolbar count={`${filtered.length} teams`}>
        <SearchBox value={search} onChange={setSearch} placeholder="Search teams..." />
        <select value={project} onChange={event => setProject(event.target.value)} className="px-2.5 py-1.5 rounded text-[11px] bg-white" style={{ border: "1px solid #d9dee7", color: "#1a2234" }}><option value="All">All projects</option>{projects.filter(item => item.status === "Active").map(item => <option key={item.key} value={item.key}>{item.key} / {item.name}</option>)}</select>
        <Segmented value={status} values={["All", "Active", "Deactive"] as const} onChange={setStatus} />
      </Toolbar>
      <div className="flex-1 overflow-auto"><div className="min-w-[1040px]">
        <Header columns={[["w-20", "Key"], ["flex-1", "Team"], ["w-52", "Project"], ["w-24", "Status"], ["w-40", "Lead"], ["w-28", "Updated"], ["w-20 text-right", "Actions"]]} />
        {filtered.map(team => <div key={team.id} className={canManage ? "row cursor-pointer hover:bg-[#f7f8fa]" : "row"} onClick={() => canManage && onEdit(team)}>
          <div className="w-20 shrink-0 font-mono text-[10px] font-semibold" style={{ color: "#2558a6" }}>{team.key}</div>
          <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold truncate" style={{ color: "#1a2234" }}>{team.name}</p><p className="text-[9px] truncate mt-0.5" style={{ color: "#8c94a6" }}>{team.description}</p></div>
          <div className="w-52 shrink-0 text-[10px] truncate" style={{ color: "#5c6478" }}>{team.projectKey} / {team.projectName}</div>
          <div className="w-24 shrink-0"><StatusDot status={team.status} /></div>
          <div className="w-40 shrink-0 flex items-center gap-1.5"><Avatar owner={team.lead} size="xs" /><span className="text-[10px] truncate" style={{ color: "#5c6478" }}>{team.lead.name}</span></div>
          <div className="w-28 shrink-0 text-[10px]" style={{ color: "#8c94a6" }}>{team.updatedAt}</div>
          <RowActions canManage={canManage} active={team.status === "Active"} onEdit={() => onEdit(team)} onArchive={() => onArchive(team)} onRestore={() => onRestore(team)} archiveLabel="Deactivate" restoreLabel="Restore" />
        </div>)}
        {filtered.length === 0 && <EmptyTable icon={Users} title="No teams found" />}
      </div></div>
      <Footer count={filtered.length} />
      <TableStyles />
    </>
  );
}

function UsersTab({ users, canManage, onEdit }: { users: UserRecord[]; canManage: boolean; onEdit: (user: UserRecord) => void }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"All" | WorkspaceRoleCode>("All");
  const [status, setStatus] = useState<"All" | UserStatus>("All");
  const filtered = useMemo(() => users.filter(user => (role === "All" || user.workspaceRole === role) && (status === "All" || user.status === status) && `${user.name} ${user.email} ${user.workspaceRole}`.toLowerCase().includes(search.toLowerCase())), [users, role, search, status]);

  return (
    <>
      <div className="grid grid-cols-3 gap-3 px-4 py-3 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
        <MetricCard label="Total Users" value={users.length} icon={Users} />
        <MetricCard label="Active" value={users.filter(user => user.status === "Active").length} icon={UserCheck} />
        <MetricCard label="Admins" value={users.filter(user => user.workspaceRole === "workspace_admin").length} icon={Shield} />
      </div>
      <Toolbar count={`${filtered.length} users`}>
        <SearchBox value={search} onChange={setSearch} placeholder="Search users..." />
        <select value={role} onChange={event => setRole(event.target.value as "All" | WorkspaceRoleCode)} className="px-2.5 py-1.5 rounded text-[11px] bg-white" style={{ border: "1px solid #d9dee7", color: "#1a2234" }}><option value="All">All roles</option>{ROLES.map(item => <option key={item.code} value={item.code}>{item.label} / {item.code}</option>)}</select>
        <Segmented value={status} values={["All", "Active", "Deactive"] as const} onChange={setStatus} />
      </Toolbar>
      <div className="flex-1 overflow-auto"><div className="min-w-[1080px]">
        <Header columns={[["w-52", "User"], ["w-56", "Email"], ["w-36", "Role"], ["w-24", "Status"], ["flex-1", "Teams"], ["w-36", "Last Login"]]} />
        {filtered.map(user => (
          <div key={user.id} className={canManage ? "row cursor-pointer hover:bg-[#f7f8fa]" : "row"} onClick={() => canManage && onEdit(user)}>
            <div className="w-52 shrink-0 flex items-center gap-2 min-w-0"><Avatar owner={user.owner} size="sm" /><span className="text-[11px] font-semibold truncate" style={{ color: "#1a2234" }}>{user.name}</span></div>
            <div className="w-56 shrink-0 text-[10px] truncate" style={{ color: "#5c6478" }}>{user.email}</div>
            <div className="w-36 shrink-0"><WorkspaceRoleBadge role={user.workspaceRole} /></div>
            <div className="w-24 shrink-0"><StatusDot status={user.status} /></div>
            <div className="flex-1 min-w-0 text-[10px] truncate" style={{ color: "#5c6478" }}>{user.teams.join(", ")}</div>
            <div className="w-36 shrink-0 text-[10px]" style={{ color: "#8c94a6" }}>{user.lastLogin}</div>
          </div>
        ))}
        {filtered.length === 0 && <EmptyTable icon={Users} title="No users found" />}
      </div></div>
      <Footer count={filtered.length} />
      <TableStyles />
    </>
  );
}

function Toolbar({ count, children }: { count: string; children: React.ReactNode }) {
  return <div className="flex items-center gap-2 px-4 py-2 shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>{children}<div className="flex-1" /><span className="text-[10px]" style={{ color: "#8c94a6" }}>{count}</span></div>;
}

function Header({ columns }: { columns: [string, string][] }) {
  return (
    <div className="sticky top-0 z-10 flex items-center h-8 px-4 gap-3" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
      {columns.map(([width, label]) => <div key={label} className={`${width} shrink-0 text-[9px] font-semibold uppercase tracking-wider`} style={{ color: "#8c94a6" }}>{label}</div>)}
    </div>
  );
}

function RowActions({ canManage, active, onEdit, onArchive, onRestore, archiveLabel, restoreLabel }: { canManage: boolean; active: boolean; onEdit: () => void; onArchive: () => void; onRestore: () => void; archiveLabel: string; restoreLabel: string }) {
  return (
    <div className="w-20 shrink-0 flex items-center justify-end gap-1" onClick={event => event.stopPropagation()}>
      {canManage && active && <><button aria-label="Edit" onClick={onEdit} className="icon-button"><Edit3 size={12} /></button><button aria-label={archiveLabel} title={archiveLabel} onClick={onArchive} className="icon-button" style={{ color: "#b45309" }}><Archive size={12} /></button></>}
      {canManage && !active && <button aria-label={restoreLabel} onClick={onRestore} className="flex items-center gap-1 px-2 py-1 rounded text-[10px]" style={{ color: "#1e6930", border: "1px solid #c7e4ce" }}><RotateCcw size={10} /> {restoreLabel}</button>}
      {!canManage && <MoreHorizontal size={13} style={{ color: "#b0b8c8" }} />}
    </div>
  );
}

function Footer({ count }: { count: number }) {
  return <div className="h-10 shrink-0 flex items-center justify-between px-4" style={{ borderTop: "1px solid #e2e6eb" }}><span className="text-[10px]" style={{ color: "#8c94a6" }}>1-{count} of {count}</span><div className="flex items-center gap-2"><span className="text-[10px]" style={{ color: "#5c6478" }}>Page 1 of 1</span><button disabled className="p-1.5 rounded opacity-35" style={{ border: "1px solid #dde2ea" }}><ChevronLeft size={12} /></button><button disabled className="p-1.5 rounded opacity-35" style={{ border: "1px solid #dde2ea" }}><ChevronRight size={12} /></button></div></div>;
}

function EmptyTable({ icon: Icon, title }: { icon: typeof FolderKanban; title: string }) {
  return <div className="py-16 text-center"><Icon size={28} className="mx-auto mb-2" style={{ color: "#c4cad4" }} /><p className="text-[12px] font-semibold" style={{ color: "#5c6478" }}>{title}</p><p className="text-[10px] mt-1" style={{ color: "#8c94a6" }}>Change the search or filters.</p></div>;
}

function ConfirmDestructive({ title, body, actionLabel, requiredText, tone = "danger", onCancel, onConfirm }: { title: string; body: string; actionLabel: string; requiredText?: string; tone?: "danger" | "restore"; onCancel: () => void; onConfirm: () => void }) {
  const [typedText, setTypedText] = useState("");
  const requiresText = Boolean(requiredText);
  const canConfirm = !requiresText || typedText.trim() === requiredText;
  const Icon = tone === "restore" ? RotateCcw : Archive;
  const accent = tone === "restore"
    ? { text: "#1e6930", bg: "#eef6f0", button: "#1e6930" }
    : { text: "#b45309", bg: "#fff7ed", button: "#b45309" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,.34)" }} onClick={onCancel} />
      <div className="relative bg-white rounded-md shadow-xl w-[430px] p-5" style={{ border: "1px solid #d9dee7" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center mb-3" style={{ color: accent.text, backgroundColor: accent.bg }}><Icon size={17} /></div>
        <h3 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>{title}</h3>
        <p className="text-[11px] mt-2 leading-5" style={{ color: "#5c6478" }}>{body}</p>
        {requiresText && (
          <label className="block mt-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Type {requiredText} to confirm</span>
            <input value={typedText} onChange={event => setTypedText(event.target.value)} className="form-input mt-1" />
          </label>
        )}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onCancel} className="px-3 py-1.5 rounded text-[11px]" style={{ border: "1px solid #d9dee7" }}>Cancel</button>
          <button disabled={!canConfirm} onClick={onConfirm} className="px-3 py-1.5 rounded text-[11px] font-semibold text-white disabled:opacity-45" style={{ backgroundColor: accent.button }}>{actionLabel}</button>
        </div>
      </div>
    </div>
  );
}

function TableStyles() {
  return <style>{`.row{display:flex;align-items:center;min-height:48px;padding:0 16px;gap:12px;border-bottom:1px solid #edf0f4}.row:hover{background-color:#f9fafb}.icon-button{padding:6px;border-radius:4px;color:#5c6478}.icon-button:hover{background:#edf2fb}.chip{padding:1px 6px;border-radius:2px;font-size:9px;background:#f1f5f9;color:#475569}`}</style>;
}
