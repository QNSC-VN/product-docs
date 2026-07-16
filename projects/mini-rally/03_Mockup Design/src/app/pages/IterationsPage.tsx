import { useMemo, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { AlignLeft, ArrowDown, ArrowUpDown, Bold, ChevronLeft, ChevronRight, Filter, Info, Italic, Link2, List, ListOrdered, PencilLine, Plus, Search, Underline, X } from "lucide-react";
import { type IterationItem, type Owner, type ReleaseItem, type Role, can, ITERATIONS_DATA, OWNERS, RELEASES_DATA, SCOPE_PROJECTS } from "../model";

type TimeboxType = "Iterations" | "Releases" | "Milestones";
type NewTimeboxType = "Iteration" | "Release" | "Milestones";
type MilestoneState = "Planned" | "At Risk" | "Met" | "Missed" | "Cancelled" | "Completed";
type TimeboxState = IterationItem["state"] | ReleaseItem["status"] | MilestoneState;
type IterationColumnKey = "name" | "theme" | "startDate" | "endDate" | "project" | "plannedVelocity" | "taskEstimate" | "state";
type IterationSort = { column: IterationColumnKey; direction: "asc" | "desc" };
type ArtifactItem = { id: string; name: string; type: "Release Note" | "Spec" | "Evidence" | "Link" };
type SelectionGroup = "projects" | "teams" | "releases";
type SelectionOption = { id: string; label: string; meta?: string };
type TimeboxListItem = {
  id: string;
  name: string;
  theme: string;
  startDate: string;
  endDate: string;
  project: string;
  projectKey?: string;
  team?: string;
  plannedVelocity: number | "";
  taskEstimate: number | "";
  state: TimeboxState;
  releaseIds?: string[];
  projectKeys?: string[];
  projectNames?: string[];
  teams?: string[];
  artifacts?: ArtifactItem[];
  owner?: Owner;
};
type TimeboxDraft = {
  id?: string;
  type: NewTimeboxType;
  projectKey: string;
  projectName: string;
  team: string;
  name: string;
  theme?: string;
  startDate?: string;
  endDate?: string;
  state?: TimeboxState;
  plannedVelocity?: number | "";
  releaseIds?: string[];
  projectKeys?: string[];
  projectNames?: string[];
  teams?: string[];
  artifacts?: ArtifactItem[];
  owner?: Owner;
};

const STATE_STYLES: Record<"Planned" | "Planning" | "Committed" | "Active" | "Accepted" | "At Risk" | "Met" | "Missed" | "Cancelled" | "Completed", { bg: string; text: string; border: string }> = {
  Planned: { bg: "#eef3fb", text: "#475569", border: "#cbd5e1" },
  Planning: { bg: "#eef3fb", text: "#1d3f73", border: "#bdd0ef" },
  Committed: { bg: "#fef5e4", text: "#8a5808", border: "#f4d28d" },
  Active: { bg: "#fef5e4", text: "#8a5808", border: "#f4d28d" },
  Accepted: { bg: "#eaf5ed", text: "#1e6930", border: "#b9dec2" },
  "At Risk": { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" },
  Met: { bg: "#eaf5ed", text: "#1e6930", border: "#b9dec2" },
  Missed: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
  Cancelled: { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" },
  Completed: { bg: "#eef6f0", text: "#1e6930", border: "#a8d5b3" },
};

const COLUMNS: Array<{ key: IterationColumnKey; label: string; align?: "right" }> = [
  { key: "name", label: "Name" },
  { key: "theme", label: "Theme" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "project", label: "Project" },
  { key: "plannedVelocity", label: "Planned Velocity", align: "right" },
  { key: "taskEstimate", label: "Task Estimate", align: "right" },
  { key: "state", label: "State" },
];

const DEFAULT_COLUMN_WIDTHS: Record<IterationColumnKey, number> = {
  name: 230,
  theme: 260,
  startDate: 170,
  endDate: 170,
  project: 180,
  plannedVelocity: 116,
  taskEstimate: 108,
  state: 130,
};

const MIN_COLUMN_WIDTHS: Record<IterationColumnKey, number> = {
  name: 150,
  theme: 180,
  startDate: 130,
  endDate: 130,
  project: 150,
  plannedVelocity: 96,
  taskEstimate: 96,
  state: 110,
};

const MILESTONES_DATA: TimeboxListItem[] = [
  { id: "MS-Q4-RC", name: "Q4 Release Candidate", theme: "Release candidate coordination across platform and mobile scope.", startDate: "2024-07-01", endDate: "2024-11-01", project: "Nexus Platform 2025, Mobile App MVP", projectKey: "NXP", team: "Core Platform, Mobile Experience", plannedVelocity: "", taskEstimate: "", state: "Planned", releaseIds: ["REL-004", "REL-001"], projectKeys: ["NXP", "MOB"], projectNames: ["Nexus Platform 2025", "Mobile App MVP"], teams: ["Core Platform", "Mobile Experience"], artifacts: [{ id: "ART-RN-Q4", name: "Q4 release note rollup", type: "Release Note" }, { id: "ART-UAT-RC", name: "UAT sign-off evidence", type: "Evidence" }], owner: OWNERS[0] },
  { id: "MS-SEC", name: "Security Review Complete", theme: "Authentication and infrastructure security checkpoint.", startDate: "2024-10-01", endDate: "2024-11-01", project: "Nexus Platform 2025, Infrastructure Refresh", projectKey: "NXP", team: "Identity & Access, Platform Reliability", plannedVelocity: "", taskEstimate: "", state: "At Risk", releaseIds: ["REL-001"], projectKeys: ["NXP", "INF"], projectNames: ["Nexus Platform 2025", "Infrastructure Refresh"], teams: ["Identity & Access", "Platform Reliability"], artifacts: [{ id: "ART-SEC-SAML", name: "SAML security review notes", type: "Spec" }], owner: OWNERS[2] },
  { id: "MS-Q4-GA", name: "Q4 General Availability", theme: "Production launch milestone for Q4 and Q1 carry-forward scope.", startDate: "2024-10-01", endDate: "2025-02-01", project: "Nexus Platform 2025", projectKey: "NXP", team: "Core Platform, Data & Reporting", plannedVelocity: "", taskEstimate: "", state: "Completed", releaseIds: ["REL-001", "REL-002"], projectKeys: ["NXP"], projectNames: ["Nexus Platform 2025"], teams: ["Core Platform", "Data & Reporting"], artifacts: [{ id: "ART-GA-NOTES", name: "GA release notes", type: "Release Note" }], owner: OWNERS[0] },
];

function StateBadge({ state }: { state: keyof typeof STATE_STYLES }) {
  const style = STATE_STYLES[state];
  return (
    <span className="inline-flex items-center px-1.5 py-px text-[11px] font-medium rounded-sm whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
      {state}
    </span>
  );
}

function TextBadge({ value }: { value: TimeboxListItem["state"] }) {
  if (value in STATE_STYLES) return <StateBadge state={value as keyof typeof STATE_STYLES} />;
  return (
    <span className="inline-flex items-center px-1.5 py-px text-[11px] font-medium rounded-sm whitespace-nowrap" style={{ backgroundColor: "#f1f5f9", color: "#5c6478", border: "1px solid #d9dee7" }}>
      {value}
    </span>
  );
}

function stateOptionsForType(type: NewTimeboxType): TimeboxState[] {
  if (type === "Release") return ["Planning", "Active", "Accepted"];
  if (type === "Milestones") return ["Planned", "At Risk", "Met", "Missed", "Cancelled", "Completed"];
  return ["Planning", "Committed", "Accepted"];
}

function defaultStateForType(type: NewTimeboxType): TimeboxState {
  if (type === "Milestones") return "Planned";
  return "Planning";
}

function getSortValue(iteration: TimeboxListItem, column: IterationColumnKey): string | number {
  switch (column) {
    case "plannedVelocity": return iteration.plannedVelocity;
    case "taskEstimate": return iteration.taskEstimate;
    default: return String(iteration[column]).toLowerCase();
  }
}

function createButtonLabel(type: TimeboxType) {
  if (type === "Iterations") return "Create Iteration";
  if (type === "Releases") return "Create Release";
  return "Create Milestone";
}

function modalTypeFromList(type: TimeboxType): NewTimeboxType {
  if (type === "Iterations") return "Iteration";
  if (type === "Releases") return "Release";
  return "Milestones";
}

function toDateInputValue(value?: string) {
  if (!value) return "";
  const isoDate = value.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  if (isoDate) return isoDate;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${parsed.getFullYear()}-${month}-${day}`;
}

function selectedReleases(releaseIds?: string[]) {
  const selectedIds = new Set(releaseIds || []);
  return RELEASES_DATA.filter(release => selectedIds.has(release.id));
}

function releaseSummaryForIds(releaseIds?: string[]) {
  const releases = selectedReleases(releaseIds);
  if (releases.length === 0) return "No releases";
  return releases.map(release => release.name).join(", ");
}

function releaseListTitle(releaseIds?: string[]) {
  const releases = selectedReleases(releaseIds);
  return releases.length ? releases.map(release => release.name).join(", ") : "No releases";
}

function releaseDateWindow(releaseIds?: string[]) {
  const releases = selectedReleases(releaseIds);
  const starts = releases.map(release => toDateInputValue(release.startDate)).filter(Boolean).sort();
  const ends = releases.map(release => toDateInputValue(release.releaseDate)).filter(Boolean).sort();
  return {
    startDate: starts[0] || "",
    endDate: ends[ends.length - 1] || "",
  };
}

function allScopeTeams() {
  return SCOPE_PROJECTS.flatMap(project => project.teams).filter((team, index, teams) => teams.indexOf(team) === index);
}

function selectedProjectNames(projectKeys?: string[]) {
  const selectedKeys = new Set(projectKeys || []);
  return SCOPE_PROJECTS.filter(project => selectedKeys.has(project.key)).map(project => project.name);
}

function toggleStringValue(values: string[], value: string) {
  return values.includes(value) ? values.filter(item => item !== value) : [...values, value];
}

function summaryText(values?: string[], empty = "None") {
  if (!values?.length) return empty;
  return values.join(", ");
}

function buildIterationItems(): TimeboxListItem[] {
  return ITERATIONS_DATA.map(iteration => ({
    id: iteration.id,
    name: iteration.name,
    theme: iteration.theme,
    startDate: iteration.startDate,
    endDate: iteration.endDate,
    project: iteration.project,
    projectKey: iteration.projectKey,
    team: iteration.team,
    plannedVelocity: iteration.plannedVelocity,
    taskEstimate: iteration.taskEstimate,
    state: iteration.state,
  }));
}

function buildReleaseItems(): TimeboxListItem[] {
  return RELEASES_DATA.map(release => ({
    id: release.id,
    name: release.name,
    theme: release.description,
    startDate: release.startDate,
    endDate: release.releaseDate,
    project: "Nexus Platform 2025",
    projectKey: "NXP",
    team: "Core Platform",
    plannedVelocity: release.totalItems,
    taskEstimate: release.completedItems,
    state: release.status,
  }));
}

function IterationHeaderCell({ column, width, sort, onSort, onResize }: { column: (typeof COLUMNS)[number]; width: number; sort: IterationSort | null; onSort: (column: IterationColumnKey) => void; onResize: (column: IterationColumnKey, event: ReactMouseEvent<HTMLDivElement>) => void }) {
  const active = sort?.column === column.key;
  return (
    <div className="relative h-full shrink-0" style={{ width, borderRight: "1px solid #e2e6eb" }}>
      <button onClick={() => onSort(column.key)} className="h-full w-full min-w-0 flex items-center justify-between gap-1 px-2 text-[11px] font-semibold group" style={{ color: active ? "#1d3f73" : "#8c94a6", textAlign: column.align }}>
        <span className="truncate">{column.label}</span>
        {active && sort.direction === "asc" ? <ArrowDown size={11} style={{ color: "#2558a6" }} /> : <ArrowUpDown size={11} style={{ color: active ? "#2558a6" : "#b0b8c8" }} />}
      </button>
      <div role="separator" aria-label={`Resize ${column.label} column`} aria-orientation="vertical" onMouseDown={event => onResize(column.key, event)} className="absolute right-0 top-0 h-full w-2 cursor-col-resize z-10 group">
        <div className="absolute right-[3px] top-1 bottom-1 w-px group-hover:bg-[#2558a6]" style={{ backgroundColor: "#e2e6eb" }} />
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#64748b" }}>
        {label}{required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function DetailEditorButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} className="w-7 h-7 flex items-center justify-center rounded-sm" style={{ color: "#475569" }} onMouseEnter={event => (event.currentTarget.style.backgroundColor = "#edf2f7")} onMouseLeave={event => (event.currentTarget.style.backgroundColor = "transparent")}>
      {children}
    </button>
  );
}

function DetailTextEditor({ title, placeholder, minHeight, initialValue = "" }: { title: string; placeholder: string; minHeight: number; initialValue?: string }) {
  return (
    <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
      <div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>{title}</div>
      <div className="flex items-center gap-0.5 px-2 py-1.5 overflow-x-auto" style={{ borderBottom: "1px solid #dde2ea", backgroundColor: "white" }}>
        <select aria-label={`${title}: Text style`} className="h-7 w-28 px-2 text-[11px] rounded-sm bg-white focus:outline-none" style={{ color: "#334155", border: "1px solid #d7dde7" }}>
          <option>Paragraph</option>
          <option>Heading 2</option>
          <option>Heading 3</option>
          <option>Quote</option>
        </select>
        <span className="w-px h-5 mx-1 shrink-0" style={{ backgroundColor: "#d7dde7" }} />
        <DetailEditorButton label={`${title}: Bold`}><Bold size={15} /></DetailEditorButton>
        <DetailEditorButton label={`${title}: Italic`}><Italic size={15} /></DetailEditorButton>
        <DetailEditorButton label={`${title}: Underline`}><Underline size={15} /></DetailEditorButton>
        <span className="w-px h-5 mx-1 shrink-0" style={{ backgroundColor: "#d7dde7" }} />
        <DetailEditorButton label={`${title}: Bulleted list`}><List size={15} /></DetailEditorButton>
        <DetailEditorButton label={`${title}: Numbered list`}><ListOrdered size={15} /></DetailEditorButton>
        <DetailEditorButton label={`${title}: Align left`}><AlignLeft size={15} /></DetailEditorButton>
        <span className="w-px h-5 mx-1 shrink-0" style={{ backgroundColor: "#d7dde7" }} />
        <DetailEditorButton label={`${title}: Insert link`}><Link2 size={15} /></DetailEditorButton>
      </div>
      <textarea defaultValue={initialValue} placeholder={placeholder} className="block w-full resize-none px-4 py-3 text-[13px] leading-6 focus:outline-none" style={{ minHeight, color: "#334155", backgroundColor: "white" }} />
    </section>
  );
}

function SelectionSummaryButton({ label, count, onClick }: { label: string; count: number; onClick: () => void }) {
  const itemLabel = label.endsWith("s") ? label.slice(0, -1).toLowerCase() : label.toLowerCase();
  return (
    <button type="button" onClick={onClick} className="w-full h-8 flex items-center gap-2 rounded-sm px-2 text-left bg-white hover:bg-[#f8fafc] focus:outline-none focus:ring-1 focus:ring-[#2f6fc5]" style={{ border: "1px solid #cbd5e1", color: "#1a2234" }}>
      <PencilLine size={13} style={{ color: "#2558a6" }} />
      <span className="truncate text-[12px]">{count} {itemLabel}{count === 1 ? "" : "s"} selected</span>
    </button>
  );
}

function SelectionModal({ title, options, selectedIds, onToggle, onClose }: { title: string; options: SelectionOption[]; selectedIds: string[]; onToggle: (id: string) => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = options.filter(option => {
    if (!normalizedQuery) return true;
    return `${option.label} ${option.meta || ""}`.toLowerCase().includes(normalizedQuery);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
      <div className="w-[440px] max-w-[calc(100vw-32px)] rounded bg-white shadow-xl overflow-hidden" style={{ border: "1px solid #d7dde7" }}>
        <div className="h-12 px-4 flex items-center gap-3" style={{ borderBottom: "1px solid #e2e6eb" }}>
          <div>
            <h3 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>{title}</h3>
            <p className="text-[10px]" style={{ color: "#8c94a6" }}>{selectedIds.length} selected</p>
          </div>
          <div className="flex-1" />
          <button type="button" aria-label={`Close ${title}`} onClick={onClose} className="p-1 rounded hover:bg-[#f3f5f8]" style={{ color: "#64748b" }}><X size={15} /></button>
        </div>
        <div className="p-3" style={{ borderBottom: "1px solid #edf0f4" }}>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} className="w-full h-8 pl-8 pr-3 text-[12px] rounded bg-white focus:outline-none" style={{ border: "1px solid #d7dde7", color: "#1a2234" }} />
          </div>
        </div>
        <div className="max-h-[320px] overflow-y-auto p-2">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-6 text-center text-[12px]" style={{ color: "#8c94a6" }}>No matching items</div>
          ) : filteredOptions.map(option => (
            <label key={option.id} className="flex items-start gap-2 rounded px-2 py-2 hover:bg-[#f8fafc]" style={{ color: "#1a2234" }}>
              <input type="checkbox" checked={selectedIds.includes(option.id)} onChange={() => onToggle(option.id)} className="mt-0.5 h-3.5 w-3.5" />
              <span className="min-w-0">
                <span className="block truncate text-[12px] font-medium">{option.label}</span>
                {option.meta && <span className="block truncate text-[10px]" style={{ color: "#8c94a6" }}>{option.meta}</span>}
              </span>
            </label>
          ))}
        </div>
        <div className="h-11 px-3 flex items-center justify-end" style={{ borderTop: "1px solid #edf0f4" }}>
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-[11px] font-semibold rounded text-white" style={{ backgroundColor: "#1d3f73" }}>Done</button>
        </div>
      </div>
    </div>
  );
}

function ArtifactDashboard({ artifacts, artifactName, onArtifactNameChange, onAddArtifact }: { artifacts: ArtifactItem[]; artifactName: string; onArtifactNameChange: (value: string) => void; onAddArtifact: () => void }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredArtifacts = artifacts.filter(artifact => {
    if (!normalizedQuery) return true;
    return `${artifact.id} ${artifact.name} ${artifact.type}`.toLowerCase().includes(normalizedQuery);
  });

  return (
    <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
      <div className="h-10 px-4 flex items-center gap-3" style={{ borderBottom: "1px solid #dde2ea", backgroundColor: "#f8fafc" }}>
        <h3 className="text-[12px] font-semibold" style={{ color: "#273449" }}>Artifacts</h3>
        <span className="text-[10px]" style={{ color: "#8c94a6" }}>{artifacts.length} assigned</span>
        <div className="flex-1" />
        <div className="relative w-56">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search artifacts..." className="w-full h-7 pl-7 pr-2 text-[11px] rounded bg-white focus:outline-none" style={{ border: "1px solid #d7dde7", color: "#1a2234" }} />
        </div>
      </div>
      <div className="overflow-auto">
        <div className="grid h-8 items-center text-[10px] font-semibold uppercase tracking-wider" style={{ gridTemplateColumns: "96px minmax(220px, 1fr) 120px", color: "#64748b", backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          <div className="px-3">ID</div>
          <div className="px-3">Name</div>
          <div className="px-3">Type</div>
        </div>
        {filteredArtifacts.length === 0 ? (
          <div className="px-4 py-5 text-[12px]" style={{ color: "#8c94a6" }}>No artifacts assigned</div>
        ) : filteredArtifacts.map(artifact => (
          <div key={artifact.id} className="grid h-9 items-center text-[12px] hover:bg-[#f8fafc]" style={{ gridTemplateColumns: "96px minmax(220px, 1fr) 120px", borderBottom: "1px solid #edf0f4" }}>
            <div className="px-3 font-mono" style={{ color: "#2558a6" }}>{artifact.id}</div>
            <div className="px-3 min-w-0 flex items-center gap-2">
              <Link2 size={12} style={{ color: "#2558a6" }} />
              <span className="truncate" style={{ color: "#1a2234" }}>{artifact.name}</span>
            </div>
            <div className="px-3" style={{ color: "#5c6478" }}>{artifact.type}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 p-3" style={{ borderTop: "1px solid #edf0f4" }}>
        <input aria-label="Artifact name" value={artifactName} onChange={event => onArtifactNameChange(event.target.value)} placeholder="Add artifact link/name..." className="min-w-0 flex-1 h-8 text-[12px] px-2.5 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} />
        <button type="button" onClick={onAddArtifact} className="px-3 h-8 text-[11px] font-semibold rounded" style={{ border: "1px solid #bdd0ef", color: "#2558a6", backgroundColor: "#edf2fb" }}>Add</button>
      </div>
    </section>
  );
}

function IterationCreateDetailPage({ draft, onBack }: { draft: TimeboxDraft; onBack: () => void }) {
  const [startDate, setStartDate] = useState(toDateInputValue(draft.startDate));
  const [endDate, setEndDate] = useState(toDateInputValue(draft.endDate));
  const [state, setState] = useState<TimeboxState>(draft.state || defaultStateForType(draft.type));
  const [plannedVelocity, setPlannedVelocity] = useState(draft.plannedVelocity === undefined ? "" : String(draft.plannedVelocity));
  const [releaseIds, setReleaseIds] = useState<string[]>(draft.releaseIds?.length ? draft.releaseIds : RELEASES_DATA.slice(0, 2).map(release => release.id));
  const [projectKeys, setProjectKeys] = useState<string[]>(draft.projectKeys?.length ? draft.projectKeys : [draft.projectKey]);
  const [teamNames, setTeamNames] = useState<string[]>(draft.teams?.length ? draft.teams : [draft.team].filter(Boolean));
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>(draft.artifacts || []);
  const [artifactName, setArtifactName] = useState("");
  const [ownerName, setOwnerName] = useState(draft.owner?.name || OWNERS[0].name);
  const [selectionModal, setSelectionModal] = useState<SelectionGroup | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "artifacts">("details");
  const isMilestone = draft.type === "Milestones";
  const isProjectLevel = draft.type === "Release" || isMilestone;
  const milestoneWindow = releaseDateWindow(releaseIds);
  const fieldClass = "w-full text-[12px] px-3 py-2 rounded bg-white focus:outline-none";
  const fieldStyle = { border: "1px solid #d7dde7", color: "#1a2234" };
  const projectOptions: SelectionOption[] = SCOPE_PROJECTS.map(project => ({ id: project.key, label: project.name, meta: `${project.key} - ${project.teams.length} teams` }));
  const teamOptions: SelectionOption[] = allScopeTeams().map(team => ({ id: team, label: team }));
  const milestoneReleaseOptions: SelectionOption[] = RELEASES_DATA.map(release => ({ id: release.id, label: release.name, meta: `${release.startDate} - ${release.releaseDate}` }));
  const activeSelection = selectionModal === "projects"
    ? { title: "Projects", options: projectOptions, selectedIds: projectKeys, onToggle: (id: string) => setProjectKeys(previous => toggleStringValue(previous, id)) }
    : selectionModal === "teams"
      ? { title: "Teams", options: teamOptions, selectedIds: teamNames, onToggle: (id: string) => setTeamNames(previous => toggleStringValue(previous, id)) }
      : selectionModal === "releases"
        ? { title: "Releases", options: milestoneReleaseOptions, selectedIds: releaseIds, onToggle: toggleRelease }
        : null;

  function toggleRelease(releaseId: string) {
    setReleaseIds(previous => {
      if (previous.includes(releaseId)) return previous.filter(id => id !== releaseId);
      return [...previous, releaseId];
    });
  }

  function addArtifact() {
    const name = artifactName.trim();
    if (!name) return;
    setArtifacts(previous => [...previous, { id: `ART-${previous.length + 1}`, name, type: "Link" }]);
    setArtifactName("");
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="shrink-0 text-white" style={{ backgroundColor: "#173f78" }}>
        <div className="h-12 px-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,.18)" }}>
          <button aria-label="Back to timeboxes" onClick={onBack} className="p-1.5 rounded hover:bg-white/10"><ChevronLeft size={18} /></button>
          <span className="px-1.5 py-px text-[10px] font-semibold rounded-sm whitespace-nowrap" style={{ backgroundColor: "#eef3fb", color: "#1d3f73", border: "1px solid #bdd0ef" }}>{draft.type}</span>
          <span className="font-mono text-[13px] font-semibold text-white">{draft.id || "New"}</span>
          <span className="h-5 w-px bg-white/25" />
          <h1 className="text-[15px] font-semibold truncate">{draft.name || `New ${draft.type}`}</h1>
          <div className="flex-1" />
        </div>
        <div className="h-16 px-5 flex items-stretch gap-2">
          <button onClick={() => setActiveTab("details")} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "details" ? "#2f6fc5" : "transparent", color: "white" }}>
            <span className="h-5 flex items-center justify-center"><Info size={18} /></span>
            <span>Details</span>
          </button>
          {isMilestone && (
            <button onClick={() => setActiveTab("artifacts")} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "artifacts" ? "#2f6fc5" : "transparent", color: "white" }}>
              <span className="h-5 flex items-center justify-center"><Link2 size={18} /></span>
              <span>Artifacts</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 gap-2" style={{ backgroundColor: "#e7ebf0" }}>
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
          <div className="w-full space-y-5">
            {activeTab === "details" ? (
              <>
                <div>
                  <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Details</h2>
                </div>
                <DetailTextEditor title={isMilestone ? "Description" : "Theme"} placeholder={isMilestone ? "Describe the milestone purpose, cross-release context, dependency notes, and expected outcome..." : "Describe the iteration goal, scope, and planning context..."} minHeight={250} initialValue={draft.theme || ""} />
                <DetailTextEditor title="Notes" placeholder={isMilestone ? "Capture milestone notes, risks, dependencies, artifacts, and sign-off decisions..." : "Capture team notes, risks, carry-over context, or planning decisions..."} minHeight={220} />
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Artifacts</h2>
                </div>
                <ArtifactDashboard artifacts={artifacts} artifactName={artifactName} onArtifactNameChange={setArtifactName} onAddArtifact={addArtifact} />
              </>
            )}
          </div>
        </main>

        {activeTab === "details" && <aside className="w-[340px] shrink-0 overflow-y-auto p-5 space-y-4 bg-white" style={{ borderLeft: "1px solid #d7dde7", scrollbarGutter: "stable" }}>
          {!isMilestone && <Field label="Project"><select defaultValue={draft.projectKey} className={fieldClass} style={fieldStyle}>{SCOPE_PROJECTS.map(project => <option key={project.key} value={project.key}>{project.key} / {project.name}</option>)}</select></Field>}
          {isMilestone && <Field label="Projects"><SelectionSummaryButton label="Projects" count={projectKeys.length} onClick={() => setSelectionModal("projects")} /></Field>}
          {false && (
            <Field label="Projects">
              <div className="space-y-1.5 rounded bg-white px-2 py-2" style={fieldStyle}>
                {SCOPE_PROJECTS.map(project => (
                  <label key={project.key} className="flex items-start gap-2 rounded px-1 py-1 text-[12px]" style={{ color: "#1a2234" }}>
                    <input type="checkbox" checked={projectKeys.includes(project.key)} onChange={() => setProjectKeys(previous => toggleStringValue(previous, project.key))} className="mt-0.5 h-3.5 w-3.5" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{project.name}</span>
                      <span className="block text-[10px]" style={{ color: "#8c94a6" }}>{project.key} · {project.teams.length} teams</span>
                    </span>
                  </label>
                ))}
              </div>
            </Field>
          )}
          {!isProjectLevel && <Field label="Team"><select defaultValue={draft.team} className={fieldClass} style={fieldStyle}>{SCOPE_PROJECTS.flatMap(project => project.teams).filter((team, index, teams) => teams.indexOf(team) === index).map(team => <option key={team}>{team}</option>)}</select></Field>}
          {isMilestone && <Field label="Teams"><SelectionSummaryButton label="Teams" count={teamNames.length} onClick={() => setSelectionModal("teams")} /></Field>}
          {false && (
            <Field label="Teams">
              <div className="space-y-1 rounded bg-white px-2 py-2" style={fieldStyle}>
                {allScopeTeams().map(team => (
                  <label key={team} className="flex items-center gap-2 rounded px-1 py-0.5 text-[12px]" style={{ color: "#1a2234" }}>
                    <input type="checkbox" checked={teamNames.includes(team)} onChange={() => setTeamNames(previous => toggleStringValue(previous, team))} className="h-3.5 w-3.5" />
                    <span className="truncate">{team}</span>
                  </label>
                ))}
              </div>
            </Field>
          )}
          {isMilestone && <Field label="Releases"><SelectionSummaryButton label="Releases" count={releaseIds.length} onClick={() => setSelectionModal("releases")} /></Field>}
          {false && (
            <Field label="Releases">
              <div className="space-y-1.5 rounded bg-white px-2 py-2" style={fieldStyle}>
                {RELEASES_DATA.map(release => (
                  <label key={release.id} className="flex items-start gap-2 rounded px-1 py-1 text-[12px]" style={{ color: "#1a2234" }}>
                    <input type="checkbox" checked={releaseIds.includes(release.id)} onChange={() => toggleRelease(release.id)} className="mt-0.5 h-3.5 w-3.5" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{release.name}</span>
                      <span className="block text-[10px]" style={{ color: "#8c94a6" }}>{release.startDate} - {release.releaseDate}</span>
                    </span>
                  </label>
                ))}
              </div>
            </Field>
          )}
          {isMilestone && <Field label="Owner"><select value={ownerName} onChange={event => setOwnerName(event.target.value)} className={fieldClass} style={fieldStyle}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field>}
          <Field label={isMilestone ? "Target Start Date" : "Start Date"} required><input type="date" value={isMilestone ? milestoneWindow.startDate : startDate} onChange={event => setStartDate(event.target.value)} readOnly={isMilestone} className={fieldClass} style={{ ...fieldStyle, backgroundColor: isMilestone ? "#f3f5f8" : "white" }} /></Field>
          <Field label={isMilestone ? "Target End Date" : "End Date"} required><input type="date" value={isMilestone ? milestoneWindow.endDate : endDate} onChange={event => setEndDate(event.target.value)} readOnly={isMilestone} className={fieldClass} style={{ ...fieldStyle, backgroundColor: isMilestone ? "#f3f5f8" : "white" }} /></Field>
          <Field label="State" required><select value={state} onChange={event => setState(event.target.value as TimeboxState)} className={fieldClass} style={fieldStyle}>{stateOptionsForType(draft.type).map(option => <option key={option}>{option}</option>)}</select></Field>
          {false && (
            <Field label="Artifacts">
              <div className="rounded bg-white" style={fieldStyle}>
                <div className="max-h-36 overflow-y-auto">
                  {artifacts.length === 0 ? (
                    <div className="px-3 py-2 text-[11px]" style={{ color: "#8c94a6" }}>No artifacts added</div>
                  ) : artifacts.map(artifact => (
                    <div key={artifact.id} className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: "1px solid #edf0f4" }}>
                      <Link2 size={12} style={{ color: "#2558a6" }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px]" style={{ color: "#1a2234" }}>{artifact.name}</span>
                        <span className="block text-[10px]" style={{ color: "#8c94a6" }}>{artifact.type}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1.5 p-2" style={{ borderTop: "1px solid #edf0f4" }}>
                  <input aria-label="Artifact name" value={artifactName} onChange={event => setArtifactName(event.target.value)} placeholder="Add artifact link/name..." className="min-w-0 flex-1 text-[11px] px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} />
                  <button type="button" onClick={addArtifact} className="px-2 py-1 text-[11px] font-semibold rounded" style={{ border: "1px solid #bdd0ef", color: "#2558a6", backgroundColor: "#edf2fb" }}>Add</button>
                </div>
              </div>
            </Field>
          )}
          {!isMilestone && <Field label="Planned Velocity"><input type="number" min={0} value={plannedVelocity} onChange={event => setPlannedVelocity(event.target.value)} placeholder="0" className={fieldClass} style={fieldStyle} /></Field>}
        </aside>}
      </div>
      {activeSelection && <SelectionModal title={activeSelection.title} options={activeSelection.options} selectedIds={activeSelection.selectedIds} onToggle={activeSelection.onToggle} onClose={() => setSelectionModal(null)} />}
    </div>
  );
}

function NewTimeboxModal({ initialType, onClose, onCreateWithDetails }: { initialType: NewTimeboxType; onClose: () => void; onCreateWithDetails: (draft: TimeboxDraft) => void }) {
  const [type, setType] = useState<NewTimeboxType>(initialType);
  const [projectKey, setProjectKey] = useState(SCOPE_PROJECTS[0].key);
  const [team, setTeam] = useState(SCOPE_PROJECTS[0].teams[0]);
  const [projectKeys, setProjectKeys] = useState<string[]>([SCOPE_PROJECTS[0].key]);
  const [teamNames, setTeamNames] = useState<string[]>([SCOPE_PROJECTS[0].teams[0]]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [state, setState] = useState<TimeboxState>(defaultStateForType(initialType));
  const [releaseIds, setReleaseIds] = useState<string[]>(RELEASES_DATA.slice(0, 2).map(release => release.id));
  const [artifactName, setArtifactName] = useState("");
  const [ownerName, setOwnerName] = useState(OWNERS[0].name);
  const selectedProject = SCOPE_PROJECTS.find(project => project.key === projectKey) || SCOPE_PROJECTS[0];
  const isProjectLevel = type === "Release" || type === "Milestones";
  const isMilestone = type === "Milestones";
  const milestoneWindow = releaseDateWindow(releaseIds);
  const fieldClass = "w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white";
  const fieldStyle = { border: "1px solid #dde2ea", color: "#1a2234" };

  function selectProject(nextProjectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(project => project.key === nextProjectKey) || SCOPE_PROJECTS[0];
    setProjectKey(nextProject.key);
    setTeam(nextProject.teams[0]);
  }

  function toggleRelease(releaseId: string) {
    setReleaseIds(previous => {
      if (previous.includes(releaseId)) return previous.filter(id => id !== releaseId);
      return [...previous, releaseId];
    });
  }

  function addDraftArtifact(): ArtifactItem[] {
    const name = artifactName.trim();
    return name ? [{ id: "ART-NEW", name, type: "Link" }] : [];
  }

  function openDetails() {
    const selectedOwner = OWNERS.find(owner => owner.name === ownerName) || OWNERS[0];
    const milestoneProjectNames = selectedProjectNames(projectKeys);
    onCreateWithDetails({
      type,
      projectKey: type === "Milestones" ? projectKeys[0] || selectedProject.key : projectKey,
      projectName: type === "Milestones" ? summaryText(milestoneProjectNames, selectedProject.name) : selectedProject.name,
      team: type === "Milestones" ? summaryText(teamNames, team) : team,
      name: name.trim() || `New ${type}`,
      startDate: type === "Milestones" ? milestoneWindow.startDate : startDate,
      endDate: type === "Milestones" ? milestoneWindow.endDate : endDate,
      state,
      releaseIds: type === "Milestones" ? releaseIds : undefined,
      projectKeys: type === "Milestones" ? projectKeys : undefined,
      projectNames: type === "Milestones" ? milestoneProjectNames : undefined,
      teams: type === "Milestones" ? teamNames : undefined,
      artifacts: type === "Milestones" ? addDraftArtifact() : undefined,
      owner: type === "Milestones" ? selectedOwner : undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <div className="relative bg-white rounded shadow-2xl flex flex-col overflow-hidden" style={{ width: 520, maxHeight: "80vh", border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>New Timebox</p>
            <p className="text-[11px]" style={{ color: "#8c94a6" }}>{selectedProject.name}{isProjectLevel ? "" : ` / ${team}`}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={event => { event.currentTarget.style.backgroundColor = "#edf0f4"; event.currentTarget.style.color = "#1a2234"; }} onMouseLeave={event => { event.currentTarget.style.backgroundColor = "transparent"; event.currentTarget.style.color = "#8c94a6"; }}><X size={15} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#5c6478" }}>Type</label>
            <div className="flex gap-2">
              {(["Iteration", "Release", "Milestones"] as const).map(option => (
                <button key={option} disabled className="flex-1 py-1.5 text-[11px] font-semibold rounded-sm cursor-not-allowed" style={{ backgroundColor: type === option ? "#eef3fb" : "#f8fafc", color: type === option ? "#1d3f73" : "#9aa3b2", border: `1px solid ${type === option ? "#bdd0ef" : "#dde2ea"}`, opacity: type === option ? 1 : 0.65 }}>{option}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {!isMilestone && <Field label="Project"><select aria-label="Project" value={projectKey} onChange={event => selectProject(event.target.value)} className={fieldClass} style={fieldStyle}>{SCOPE_PROJECTS.map(project => <option key={project.key} value={project.key}>{project.key} / {project.name}</option>)}</select></Field>}
            {!isProjectLevel && <Field label="Team"><select aria-label="Team" value={team} onChange={event => setTeam(event.target.value)} className={fieldClass} style={fieldStyle}>{selectedProject.teams.map(projectTeam => <option key={projectTeam}>{projectTeam}</option>)}</select></Field>}
            {isProjectLevel && <div />}
          </div>
          {isMilestone && (
            <Field label="Projects">
              <div className="grid grid-cols-2 gap-1.5 rounded bg-white px-2 py-2" style={fieldStyle}>
                {SCOPE_PROJECTS.map(project => (
                  <label key={project.key} className="flex items-center gap-2 text-[12px]" style={{ color: "#1a2234" }}>
                    <input type="checkbox" checked={projectKeys.includes(project.key)} onChange={() => setProjectKeys(previous => toggleStringValue(previous, project.key))} className="h-3.5 w-3.5" />
                    <span className="truncate">{project.key} · {project.name}</span>
                  </label>
                ))}
              </div>
            </Field>
          )}
          {isMilestone && (
            <Field label="Teams">
              <div className="grid grid-cols-2 gap-1.5 rounded bg-white px-2 py-2" style={fieldStyle}>
                {allScopeTeams().map(teamName => (
                  <label key={teamName} className="flex items-center gap-2 text-[12px]" style={{ color: "#1a2234" }}>
                    <input type="checkbox" checked={teamNames.includes(teamName)} onChange={() => setTeamNames(previous => toggleStringValue(previous, teamName))} className="h-3.5 w-3.5" />
                    <span className="truncate">{teamName}</span>
                  </label>
                ))}
              </div>
            </Field>
          )}
          <Field label="Name" required><input autoFocus type="text" value={name} onChange={event => setName(event.target.value)} placeholder="Enter timebox name..." className="w-full text-[13px] px-3 py-2 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} onFocus={event => (event.currentTarget.style.borderColor = "rgba(29,63,115,0.4)")} onBlur={event => (event.currentTarget.style.borderColor = "#dde2ea")} /></Field>
          {isMilestone && (
            <Field label="Releases">
              <div className="space-y-1.5 rounded bg-white px-2 py-2" style={fieldStyle}>
                {RELEASES_DATA.map(release => (
                  <label key={release.id} className="flex items-start gap-2 rounded px-1 py-1 text-[12px]" style={{ color: "#1a2234" }}>
                    <input type="checkbox" checked={releaseIds.includes(release.id)} onChange={() => toggleRelease(release.id)} className="mt-0.5 h-3.5 w-3.5" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{release.name}</span>
                      <span className="block text-[10px]" style={{ color: "#8c94a6" }}>{release.startDate} - {release.releaseDate}</span>
                    </span>
                  </label>
                ))}
              </div>
            </Field>
          )}
          {isMilestone && <Field label="Owner"><select value={ownerName} onChange={event => setOwnerName(event.target.value)} className={fieldClass} style={fieldStyle}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field>}
          {isMilestone && <Field label="Artifact"><input value={artifactName} onChange={event => setArtifactName(event.target.value)} placeholder="Artifact link or name..." className={fieldClass} style={fieldStyle} /></Field>}
          <div className="grid grid-cols-2 gap-4">
            <Field label={isMilestone ? "Target Start Date" : "Start Date"} required><input type="date" value={isMilestone ? milestoneWindow.startDate : startDate} onChange={event => setStartDate(event.target.value)} readOnly={isMilestone} className={fieldClass} style={{ ...fieldStyle, backgroundColor: isMilestone ? "#f3f5f8" : "white" }} /></Field>
            <Field label={isMilestone ? "Target End Date" : "End Date"} required><input type="date" value={isMilestone ? milestoneWindow.endDate : endDate} onChange={event => setEndDate(event.target.value)} readOnly={isMilestone} className={fieldClass} style={{ ...fieldStyle, backgroundColor: isMilestone ? "#f3f5f8" : "white" }} /></Field>
          </div>
          <Field label="State" required><select value={state} onChange={event => setState(event.target.value as TimeboxState)} className={fieldClass} style={fieldStyle}>{stateOptionsForType(type).map(option => <option key={option}>{option}</option>)}</select></Field>
        </div>
        <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
          <span className="text-[10px]" style={{ color: "#8c94a6" }}>Ctrl+Enter to save</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3.5 py-1.5 text-[12px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }} onMouseEnter={event => (event.currentTarget.style.backgroundColor = "#edf0f4")} onMouseLeave={event => (event.currentTarget.style.backgroundColor = "transparent")}>Cancel</button>
            <button onClick={openDetails} className="px-4 py-1.5 text-[12px] font-semibold rounded" style={{ border: "1px solid #9fb5d5", color: "#1d3f73", backgroundColor: "#f5f8fc" }} onMouseEnter={event => (event.currentTarget.style.backgroundColor = "#e8eff8")} onMouseLeave={event => (event.currentTarget.style.backgroundColor = "#f5f8fc")}>Create with details</button>
            <button onClick={onClose} className="px-4 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={event => (event.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={event => (event.currentTarget.style.backgroundColor = "#1d3f73")}>Create Timebox</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IterationsPage({ role }: { role: Role }) {
  const [timeboxType, setTimeboxType] = useState<TimeboxType>("Iterations");
  const [iterationItems, setIterationItems] = useState<TimeboxListItem[]>(buildIterationItems);
  const [releaseItems, setReleaseItems] = useState<TimeboxListItem[]>(buildReleaseItems);
  const [milestoneItems, setMilestoneItems] = useState<TimeboxListItem[]>(MILESTONES_DATA);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createDetailDraft, setCreateDetailDraft] = useState<TimeboxDraft | null>(null);
  const [stateFilter, setStateFilter] = useState<"All" | IterationItem["state"]>("All");
  const [sort, setSort] = useState<IterationSort | null>({ column: "startDate", direction: "asc" });
  const [columnWidths, setColumnWidths] = useState<Record<IterationColumnKey, number>>(DEFAULT_COLUMN_WIDTHS);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const editable = can.manageSprints(role);
  const displayColumns = useMemo(() => COLUMNS.map(column => {
    if (timeboxType === "Milestones" && column.key === "startDate") return { ...column, label: "Target Start Date" };
    if (timeboxType === "Milestones" && column.key === "endDate") return { ...column, label: "Target End Date" };
    if (timeboxType === "Releases" && column.key === "endDate") return { ...column, label: "Release Date" };
    return column;
  }).filter(column => timeboxType !== "Milestones" || ["name", "startDate", "endDate", "state"].includes(column.key)), [timeboxType]);
  const tableWidth = displayColumns.reduce((total, column) => total + columnWidths[column.key], 0) + 40;
  const showColumn = (key: IterationColumnKey) => displayColumns.some(column => column.key === key);

  const listItems = useMemo<TimeboxListItem[]>(() => {
    if (timeboxType === "Releases") return releaseItems;
    if (timeboxType === "Milestones") return milestoneItems;
    return iterationItems;
  }, [iterationItems, milestoneItems, releaseItems, timeboxType]);

  const filteredIterations = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const filtered = listItems.filter(iteration => {
      const matchesSearch = !normalized || [iteration.name, iteration.theme, iteration.project, iteration.state].some(value => String(value).toLowerCase().includes(normalized));
      const matchesState = timeboxType !== "Iterations" || stateFilter === "All" || iteration.state === stateFilter;
      return matchesSearch && matchesState;
    });

    if (!sort) return filtered;
    return [...filtered].sort((a, b) => {
      const aValue = getSortValue(a, sort.column);
      const bValue = getSortValue(b, sort.column);
      const result = typeof aValue === "number" && typeof bValue === "number" ? aValue - bValue : String(aValue).localeCompare(String(bValue));
      return sort.direction === "asc" ? result : -result;
    });
  }, [listItems, search, sort, stateFilter, timeboxType]);

  const totalPages = Math.max(1, Math.ceil(filteredIterations.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * pageSize;
  const paginatedIterations = filteredIterations.slice(pageStart, pageStart + pageSize);

  function toggleSort(column: IterationColumnKey) {
    setSort(previous => previous?.column === column ? { column, direction: previous.direction === "asc" ? "desc" : "asc" } : { column, direction: "asc" });
  }

  function changeTimeboxType(nextType: TimeboxType) {
    setTimeboxType(nextType);
    setCurrentPage(1);
    setStateFilter("All");
    setShowFilters(false);
  }

  function openCreateDetails(draft: TimeboxDraft) {
    setShowCreateModal(false);
    setCreateDetailDraft(draft);
  }

  function updateTimeboxItem(id: string, patch: Partial<TimeboxListItem>) {
    const updater = (items: TimeboxListItem[]) => items.map(item => item.id === id ? { ...item, ...patch } : item);
    if (timeboxType === "Releases") setReleaseItems(updater);
    else if (timeboxType === "Milestones") setMilestoneItems(updater);
    else setIterationItems(updater);
  }

  function startColumnResize(column: IterationColumnKey, event: ReactMouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = columnWidths[column];
    function onMove(moveEvent: MouseEvent) {
      const nextWidth = Math.max(MIN_COLUMN_WIDTHS[column], startWidth + moveEvent.clientX - startX);
      setColumnWidths(previous => ({ ...previous, [column]: nextWidth }));
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function timeboxStateOptions(): TimeboxState[] {
    return stateOptionsForType(modalTypeFromList(timeboxType));
  }

  function openRecordDetails(iteration: TimeboxListItem) {
    setCreateDetailDraft({
      id: iteration.id,
      type: modalTypeFromList(timeboxType),
      projectKey: iteration.projectKey || "NXP",
      projectName: iteration.project,
      team: iteration.team || "Core Platform",
      name: iteration.name,
      theme: iteration.theme,
      startDate: iteration.startDate,
      endDate: iteration.endDate,
      state: iteration.state,
      plannedVelocity: iteration.plannedVelocity,
      releaseIds: iteration.releaseIds,
      projectKeys: iteration.projectKeys,
      projectNames: iteration.projectNames,
      teams: iteration.teams,
      artifacts: iteration.artifacts,
      owner: iteration.owner,
    });
  }

  if (createDetailDraft) {
    return <IterationCreateDetailPage draft={createDetailDraft} onBack={() => setCreateDetailDraft(null)} />;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-end gap-2 px-4 py-2 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div className="flex flex-col items-start gap-1.5 mr-2 min-w-[150px]">
          <h2 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Timeboxes</h2>
          {editable && (
            <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={event => (event.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={event => (event.currentTarget.style.backgroundColor = "#1d3f73")}>
              <Plus size={12} /> {createButtonLabel(timeboxType)}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#8c94a6" }}>Type</span>
          <select aria-label="Timebox type" value={timeboxType} onChange={event => changeTimeboxType(event.target.value as TimeboxType)} className="h-7 px-2.5 text-[11px] rounded bg-white focus:outline-none" style={{ width: 145, border: "1px solid #dde2ea", color: "#1a2234" }}>
            {(["Iterations", "Releases", "Milestones"] as const).map(option => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
          <input type="text" placeholder={`Search ${timeboxType.toLowerCase()}...`} value={search} onChange={event => { setSearch(event.target.value); setCurrentPage(1); }} className="pl-7 pr-3 py-1 text-[11px] rounded focus:outline-none" style={{ backgroundColor: "#f4f6f9", border: "1px solid #dde2ea", color: "#1a2234", width: 190 }} />
        </div>
        {timeboxType === "Iterations" && (
          <button onClick={() => setShowFilters(previous => !previous)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded" style={{ border: "1px solid #bdd0ef", color: "#2558a6", backgroundColor: showFilters || stateFilter !== "All" ? "#edf2fb" : "#fff" }} onMouseEnter={event => (event.currentTarget.style.backgroundColor = "#edf2fb")} onMouseLeave={event => (event.currentTarget.style.backgroundColor = showFilters || stateFilter !== "All" ? "#edf2fb" : "#fff")}>
            <Filter size={12} /> {showFilters ? "Hide filter" : "Show filter"}{stateFilter !== "All" ? " (1)" : ""}
          </button>
        )}
        <div className="flex-1" />
      </div>

      {showFilters && timeboxType === "Iterations" && (
        <div className="px-4 py-3 shrink-0" style={{ backgroundColor: "#f5f8fc", borderBottom: "1px solid #cfdced" }}>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white rounded" style={{ border: "1px solid #dde2ea" }}>
              <span className="text-[11px] font-semibold" style={{ color: "#3a4254" }}>State</span>
              <select value={stateFilter} onChange={event => { setStateFilter(event.target.value as "All" | IterationItem["state"]); setCurrentPage(1); }} className="text-[11px] px-2 py-1 rounded bg-white focus:outline-none" style={{ minWidth: 120, border: "1px solid #dde2ea", color: "#1a2234" }}>
                {["All", "Planning", "Committed", "Accepted"].map(state => <option key={state}>{state}</option>)}
              </select>
            </div>
            {stateFilter !== "All" && <button onClick={() => setStateFilter("All")} className="px-2.5 py-1 text-[11px] rounded" style={{ color: "#2558a6" }}>Clear filters</button>}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden bg-white">
          <div className="flex-1 overflow-auto">
            <div style={{ width: tableWidth, minWidth: "100%" }}>
              <div className="sticky top-0 z-10 flex items-center h-8 px-3 gap-0 select-none" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
                <div className="w-10 shrink-0" />
                {displayColumns.map(column => <IterationHeaderCell key={column.key} column={column} width={columnWidths[column.key]} sort={sort} onSort={toggleSort} onResize={startColumnResize} />)}
              </div>

              {paginatedIterations.map(iteration => (
                <div key={iteration.id} onClick={() => openRecordDetails(iteration)} className="flex items-center h-8 px-3 gap-0 cursor-pointer hover:bg-[#f7f8fa]" style={{ width: tableWidth, minWidth: "100%", borderBottom: "1px solid #edf0f4" }}>
                  <div className="w-10 shrink-0 flex items-center justify-center"><Info size={13} style={{ color: "#2558a6" }} /></div>
                  {showColumn("name") && <div className="shrink-0 px-2" onClick={event => event.stopPropagation()} style={{ width: columnWidths.name }}>
                    {editable ? (
                      <input aria-label={`${iteration.id} name`} value={iteration.name} onChange={event => updateTimeboxItem(iteration.id, { name: event.target.value })} className="w-full text-[11px] font-medium bg-transparent rounded-sm px-1 py-0.5 focus:outline-none focus:bg-white" style={{ color: "#1a2234", border: "1px solid transparent" }} />
                    ) : (
                      <span className="block text-[11px] font-medium truncate" style={{ color: "#1a2234" }}>{iteration.name}</span>
                    )}
                  </div>}
                  {showColumn("theme") && <div className="shrink-0 px-2" onClick={event => event.stopPropagation()} style={{ width: columnWidths.theme }}>
                    {editable ? (
                      <input aria-label={`${iteration.id} theme`} value={iteration.theme} onChange={event => updateTimeboxItem(iteration.id, { theme: event.target.value })} className="w-full text-[11px] bg-transparent rounded-sm px-1 py-0.5 focus:outline-none focus:bg-white" style={{ color: "#1a2234", border: "1px solid transparent" }} />
                    ) : (
                      <span className="block text-[11px] truncate" style={{ color: "#1a2234" }}>{iteration.theme}</span>
                    )}
                  </div>}
                  {showColumn("startDate") && <div className="shrink-0 px-2" onClick={event => event.stopPropagation()} style={{ width: columnWidths.startDate }}>
                    {editable && timeboxType !== "Milestones" ? (
                      <input aria-label={`${iteration.id} start date`} type="date" value={toDateInputValue(iteration.startDate)} onChange={event => updateTimeboxItem(iteration.id, { startDate: event.target.value })} className="w-full text-[11px] bg-transparent rounded-sm px-1 py-0.5 focus:outline-none focus:bg-white" style={{ color: "#5c6478", border: "1px solid transparent" }} />
                    ) : (
                      <span className="block text-[11px] truncate" style={{ color: "#5c6478" }}>{iteration.startDate}</span>
                    )}
                  </div>}
                  {showColumn("endDate") && <div className="shrink-0 px-2" onClick={event => event.stopPropagation()} style={{ width: columnWidths.endDate }}>
                    {editable && timeboxType !== "Milestones" ? (
                      <input aria-label={`${iteration.id} end date`} type="date" value={toDateInputValue(iteration.endDate)} onChange={event => updateTimeboxItem(iteration.id, { endDate: event.target.value })} className="w-full text-[11px] bg-transparent rounded-sm px-1 py-0.5 focus:outline-none focus:bg-white" style={{ color: "#5c6478", border: "1px solid transparent" }} />
                    ) : (
                      <span className="block text-[11px] truncate" style={{ color: "#5c6478" }}>{iteration.endDate}</span>
                    )}
                  </div>}
                  {showColumn("project") && <div className="shrink-0 px-2" onClick={event => event.stopPropagation()} style={{ width: columnWidths.project }}>
                    {editable ? (
                      <select aria-label={`${iteration.id} project`} value={iteration.projectKey || SCOPE_PROJECTS.find(project => project.name === iteration.project)?.key || "NXP"} onChange={event => {
                        const project = SCOPE_PROJECTS.find(item => item.key === event.target.value) || SCOPE_PROJECTS[0];
                        updateTimeboxItem(iteration.id, { projectKey: project.key, project: project.name, team: project.teams[0] });
                      }} className="w-full text-[11px] bg-transparent rounded-sm px-1 py-0.5 focus:outline-none focus:bg-white" style={{ color: "#5c6478", border: "1px solid transparent" }}>
                        {SCOPE_PROJECTS.map(project => <option key={project.key} value={project.key}>{project.name}</option>)}
                      </select>
                    ) : (
                      <span className="block text-[11px] truncate" style={{ color: "#5c6478" }}>{iteration.project}</span>
                    )}
                  </div>}
                  {showColumn("plannedVelocity") && <div className="shrink-0 px-2" onClick={event => event.stopPropagation()} style={{ width: columnWidths.plannedVelocity }}>
                    {timeboxType === "Milestones" ? (
                      <span className="block text-[11px] truncate" title={releaseListTitle(iteration.releaseIds)} style={{ color: "#2558a6" }}>{releaseSummaryForIds(iteration.releaseIds)}</span>
                    ) : editable ? (
                      <input aria-label={`${iteration.id} planned velocity`} type="number" min={0} value={iteration.plannedVelocity} onChange={event => updateTimeboxItem(iteration.id, { plannedVelocity: event.target.value === "" ? "" : Number(event.target.value) })} className="w-full text-right text-[11px] font-mono tabular-nums bg-transparent rounded-sm px-1 py-0.5 focus:outline-none focus:bg-white" style={{ color: "#5c6478", border: "1px solid transparent" }} />
                    ) : (
                      <span className="block text-right text-[11px] font-mono tabular-nums" style={{ color: "#5c6478" }}>{iteration.plannedVelocity || ""}</span>
                    )}
                  </div>}
                  {showColumn("taskEstimate") && <div className="shrink-0 px-2" onClick={event => event.stopPropagation()} style={{ width: columnWidths.taskEstimate }}>
                    {timeboxType === "Milestones" && editable ? (
                      <select aria-label={`${iteration.id} owner`} value={iteration.owner?.name || OWNERS[0].name} onChange={event => {
                        const owner = OWNERS.find(item => item.name === event.target.value) || OWNERS[0];
                        updateTimeboxItem(iteration.id, { owner });
                      }} className="w-full text-[11px] bg-transparent rounded-sm px-1 py-0.5 focus:outline-none focus:bg-white" style={{ color: "#5c6478", border: "1px solid transparent" }}>
                        {OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}
                      </select>
                    ) : timeboxType === "Milestones" ? (
                      <span className="block text-[11px] truncate" style={{ color: "#5c6478" }}>{iteration.owner?.name || ""}</span>
                    ) : editable ? (
                      <input aria-label={`${iteration.id} task estimate`} type="number" min={0} value={iteration.taskEstimate} onChange={event => updateTimeboxItem(iteration.id, { taskEstimate: event.target.value === "" ? "" : Number(event.target.value) })} className="w-full text-right text-[11px] font-mono tabular-nums bg-transparent rounded-sm px-1 py-0.5 focus:outline-none focus:bg-white" style={{ color: "#5c6478", border: "1px solid transparent" }} />
                    ) : (
                      <span className="block text-right text-[11px] font-mono tabular-nums" style={{ color: "#5c6478" }}>{iteration.taskEstimate || ""}</span>
                    )}
                  </div>}
                  {showColumn("state") && <div className="shrink-0 px-2" onClick={event => event.stopPropagation()} style={{ width: columnWidths.state }}>
                    {editable ? (
                      <select aria-label={`${iteration.id} state`} value={iteration.state} onChange={event => updateTimeboxItem(iteration.id, { state: event.target.value as TimeboxState })} className="w-full text-[11px] bg-transparent rounded-sm px-1 py-0.5 focus:outline-none focus:bg-white" style={{ color: "#2558a6", border: "1px solid #bdd0ef" }}>
                        {timeboxStateOptions().map(state => <option key={state}>{state}</option>)}
                      </select>
                    ) : (
                      <TextBadge value={iteration.state} />
                    )}
                  </div>}
                </div>
              ))}

              {paginatedIterations.length === 0 && (
                <div className="h-40 flex items-center justify-center text-[12px]" style={{ color: "#8c94a6", borderBottom: "1px solid #edf0f4" }}>
                  No {timeboxType.toLowerCase()} found
                </div>
              )}
            </div>
          </div>

          <div className="h-10 shrink-0 flex items-center justify-between px-3 bg-white" style={{ borderTop: "1px solid #e2e6eb" }}>
            <div className="flex items-center gap-2 text-[11px]" style={{ color: "#5c6478" }}>
              <span>Rows per page</span>
              <select aria-label="Rows per page" value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setCurrentPage(1); }} className="px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>
                {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
              </select>
              <span style={{ color: "#8c94a6" }}>{filteredIterations.length === 0 ? "0 records" : `${pageStart + 1}-${Math.min(pageStart + pageSize, filteredIterations.length)} of ${filteredIterations.length}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] tabular-nums" style={{ color: "#5c6478" }}>Page {activePage} of {totalPages}</span>
              <button aria-label="Previous page" disabled={activePage === 1} onClick={() => setCurrentPage(activePage - 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronLeft size={13} /></button>
              <button aria-label="Next page" disabled={activePage === totalPages} onClick={() => setCurrentPage(activePage + 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronRight size={13} /></button>
            </div>
          </div>
        </div>
      </div>
      {showCreateModal && <NewTimeboxModal initialType={modalTypeFromList(timeboxType)} onClose={() => setShowCreateModal(false)} onCreateWithDetails={openCreateDetails} />}
    </div>
  );
}
