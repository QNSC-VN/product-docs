import { useMemo, useState, type ReactNode } from "react";
import { AlignLeft, ArrowDown, ArrowUpDown, Bold, ChevronLeft, ChevronRight, Filter, Info, Italic, Link2, List, ListOrdered, Plus, Search, Underline, X } from "lucide-react";
import { type IterationItem, type ReleaseItem, type Role, can, ITERATIONS_DATA, RELEASES_DATA, SCOPE_PROJECTS } from "../model";

type TimeboxType = "Iterations" | "Releases" | "Milestones";
type NewTimeboxType = "Iteration" | "Release" | "Milestones";
type IterationColumnKey = "name" | "theme" | "startDate" | "endDate" | "project" | "plannedVelocity" | "taskEstimate" | "state";
type IterationSort = { column: IterationColumnKey; direction: "asc" | "desc" };
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
  state: IterationItem["state"] | ReleaseItem["status"] | "Planned" | "Accepted";
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
  state?: IterationItem["state"];
  plannedVelocity?: number | "";
};

const STATE_STYLES: Record<IterationItem["state"], { bg: string; text: string; border: string }> = {
  Planning: { bg: "#eef3fb", text: "#1d3f73", border: "#bdd0ef" },
  Committed: { bg: "#fef5e4", text: "#8a5808", border: "#f4d28d" },
  Accepted: { bg: "#eaf5ed", text: "#1e6930", border: "#b9dec2" },
};

const COLUMNS: Array<{ key: IterationColumnKey; label: string; width: number; align?: "right" }> = [
  { key: "name", label: "Name", width: 230 },
  { key: "theme", label: "Theme", width: 260 },
  { key: "startDate", label: "Start Date", width: 170 },
  { key: "endDate", label: "End Date", width: 170 },
  { key: "project", label: "Project", width: 180 },
  { key: "plannedVelocity", label: "Planned Velocity", width: 116, align: "right" },
  { key: "taskEstimate", label: "Task Estimate", width: 108, align: "right" },
  { key: "state", label: "State", width: 130 },
];

const MILESTONES_DATA: TimeboxListItem[] = [
  { id: "MS-Q4-RC", name: "Q4 Release Candidate", theme: "Release readiness checkpoint", startDate: "2024-10-25", endDate: "2024-10-25", project: "Nexus Platform 2025", projectKey: "NXP", team: "Core Platform", plannedVelocity: "", taskEstimate: "", state: "Planned" },
  { id: "MS-SEC", name: "Security Review Complete", theme: "Authentication sign-off", startDate: "2024-10-30", endDate: "2024-10-30", project: "Nexus Platform 2025", projectKey: "NXP", team: "Core Platform", plannedVelocity: "", taskEstimate: "", state: "Planned" },
  { id: "MS-Q4-GA", name: "Q4 General Availability", theme: "Production release milestone", startDate: "2024-11-01", endDate: "2024-11-01", project: "Nexus Platform 2025", projectKey: "NXP", team: "Core Platform", plannedVelocity: "", taskEstimate: "", state: "Accepted" },
];

function StateBadge({ state }: { state: IterationItem["state"] }) {
  const style = STATE_STYLES[state];
  return (
    <span className="inline-flex items-center px-1.5 py-px text-[11px] font-medium rounded-sm whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
      {state}
    </span>
  );
}

function TextBadge({ value }: { value: TimeboxListItem["state"] }) {
  if (value === "Planning" || value === "Committed" || value === "Accepted") return <StateBadge state={value} />;
  return (
    <span className="inline-flex items-center px-1.5 py-px text-[11px] font-medium rounded-sm whitespace-nowrap" style={{ backgroundColor: "#f1f5f9", color: "#5c6478", border: "1px solid #d9dee7" }}>
      {value}
    </span>
  );
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

function IterationHeaderCell({ column, sort, onSort }: { column: (typeof COLUMNS)[number]; sort: IterationSort | null; onSort: (column: IterationColumnKey) => void }) {
  const active = sort?.column === column.key;
  return (
    <button onClick={() => onSort(column.key)} className="h-full min-w-0 flex items-center justify-between gap-1 px-2 text-[11px] font-semibold group" style={{ width: column.width, color: active ? "#1d3f73" : "#8c94a6", borderRight: "1px solid #e2e6eb", textAlign: column.align }}>
      <span className="truncate">{column.label}</span>
      {active && sort.direction === "asc" ? <ArrowDown size={11} style={{ color: "#2558a6" }} /> : <ArrowUpDown size={11} style={{ color: active ? "#2558a6" : "#b0b8c8" }} />}
    </button>
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

function IterationCreateDetailPage({ draft, onBack }: { draft: TimeboxDraft; onBack: () => void }) {
  const [startDate, setStartDate] = useState(toDateInputValue(draft.startDate));
  const [endDate, setEndDate] = useState(toDateInputValue(draft.endDate));
  const [state, setState] = useState<IterationItem["state"]>(draft.state || "Planning");
  const [plannedVelocity, setPlannedVelocity] = useState(draft.plannedVelocity === undefined ? "" : String(draft.plannedVelocity));
  const fieldClass = "w-full text-[12px] px-3 py-2 rounded bg-white focus:outline-none";
  const fieldStyle = { border: "1px solid #d7dde7", color: "#1a2234" };

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
          <button className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: "#2f6fc5", color: "white" }}>
            <span className="h-5 flex items-center justify-center"><Info size={18} /></span>
            <span>Details</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 gap-2" style={{ backgroundColor: "#e7ebf0" }}>
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
          <div className="w-full space-y-5">
            <div>
              <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Details</h2>
            </div>
            <DetailTextEditor title="Theme" placeholder="Describe the iteration goal, scope, and planning context..." minHeight={250} initialValue={draft.theme || ""} />
            <DetailTextEditor title="Notes" placeholder="Capture team notes, risks, carry-over context, or planning decisions..." minHeight={220} />
          </div>
        </main>

        <aside className="w-[340px] shrink-0 overflow-y-auto p-5 space-y-4 bg-white" style={{ borderLeft: "1px solid #d7dde7", scrollbarGutter: "stable" }}>
          <Field label="Project"><select defaultValue={draft.projectKey} className={fieldClass} style={fieldStyle}>{SCOPE_PROJECTS.map(project => <option key={project.key} value={project.key}>{project.key} / {project.name}</option>)}</select></Field>
          <Field label="Team"><select defaultValue={draft.team} className={fieldClass} style={fieldStyle}>{SCOPE_PROJECTS.flatMap(project => project.teams).filter((team, index, teams) => teams.indexOf(team) === index).map(team => <option key={team}>{team}</option>)}</select></Field>
          <Field label="Start Date" required><input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} className={fieldClass} style={fieldStyle} /></Field>
          <Field label="End Date" required><input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} className={fieldClass} style={fieldStyle} /></Field>
          <Field label="State" required><select value={state} onChange={event => setState(event.target.value as IterationItem["state"])} className={fieldClass} style={fieldStyle}>{(["Planning", "Committed", "Accepted"] as const).map(option => <option key={option}>{option}</option>)}</select></Field>
          <Field label="Planned Velocity"><input type="number" min={0} value={plannedVelocity} onChange={event => setPlannedVelocity(event.target.value)} placeholder="0" className={fieldClass} style={fieldStyle} /></Field>
        </aside>
      </div>
    </div>
  );
}

function NewTimeboxModal({ initialType, onClose, onCreateWithDetails }: { initialType: NewTimeboxType; onClose: () => void; onCreateWithDetails: (draft: TimeboxDraft) => void }) {
  const [type, setType] = useState<NewTimeboxType>(initialType);
  const [projectKey, setProjectKey] = useState(SCOPE_PROJECTS[0].key);
  const [team, setTeam] = useState(SCOPE_PROJECTS[0].teams[0]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [state, setState] = useState<IterationItem["state"]>("Planning");
  const selectedProject = SCOPE_PROJECTS.find(project => project.key === projectKey) || SCOPE_PROJECTS[0];
  const fieldClass = "w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white";
  const fieldStyle = { border: "1px solid #dde2ea", color: "#1a2234" };

  function selectProject(nextProjectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(project => project.key === nextProjectKey) || SCOPE_PROJECTS[0];
    setProjectKey(nextProject.key);
    setTeam(nextProject.teams[0]);
  }

  function openDetails() {
    onCreateWithDetails({
      type,
      projectKey,
      projectName: selectedProject.name,
      team,
      name: name.trim() || `New ${type}`,
      startDate,
      endDate,
      state,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <div className="relative bg-white rounded shadow-2xl flex flex-col overflow-hidden" style={{ width: 520, maxHeight: "80vh", border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>New Timebox</p>
            <p className="text-[11px]" style={{ color: "#8c94a6" }}>{selectedProject.name} / {team}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={event => { event.currentTarget.style.backgroundColor = "#edf0f4"; event.currentTarget.style.color = "#1a2234"; }} onMouseLeave={event => { event.currentTarget.style.backgroundColor = "transparent"; event.currentTarget.style.color = "#8c94a6"; }}><X size={15} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#5c6478" }}>Type</label>
            <div className="flex gap-2">
              {(["Iteration", "Release", "Milestones"] as const).map(option => (
                <button key={option} onClick={() => setType(option)} className="flex-1 py-1.5 text-[11px] font-semibold rounded-sm" style={{ backgroundColor: type === option ? "#eef3fb" : "transparent", color: type === option ? "#1d3f73" : "#5c6478", border: `1px solid ${type === option ? "#bdd0ef" : "#dde2ea"}` }}>{option}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Project"><select aria-label="Project" value={projectKey} onChange={event => selectProject(event.target.value)} className={fieldClass} style={fieldStyle}>{SCOPE_PROJECTS.map(project => <option key={project.key} value={project.key}>{project.key} / {project.name}</option>)}</select></Field>
            <Field label="Team"><select aria-label="Team" value={team} onChange={event => setTeam(event.target.value)} className={fieldClass} style={fieldStyle}>{selectedProject.teams.map(projectTeam => <option key={projectTeam}>{projectTeam}</option>)}</select></Field>
          </div>
          <Field label="Name" required><input autoFocus type="text" value={name} onChange={event => setName(event.target.value)} placeholder="Enter timebox name..." className="w-full text-[13px] px-3 py-2 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} onFocus={event => (event.currentTarget.style.borderColor = "rgba(29,63,115,0.4)")} onBlur={event => (event.currentTarget.style.borderColor = "#dde2ea")} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date" required><input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} className={fieldClass} style={fieldStyle} /></Field>
            <Field label="End Date" required><input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} className={fieldClass} style={fieldStyle} /></Field>
          </div>
          <Field label="State" required><select value={state} onChange={event => setState(event.target.value as IterationItem["state"])} className={fieldClass} style={fieldStyle}>{(["Planning", "Committed", "Accepted"] as const).map(option => <option key={option}>{option}</option>)}</select></Field>
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
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createDetailDraft, setCreateDetailDraft] = useState<TimeboxDraft | null>(null);
  const [stateFilter, setStateFilter] = useState<"All" | IterationItem["state"]>("All");
  const [sort, setSort] = useState<IterationSort | null>({ column: "startDate", direction: "asc" });
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const editable = can.manageSprints(role);
  const tableWidth = COLUMNS.reduce((total, column) => total + column.width, 0) + 40;

  const listItems = useMemo<TimeboxListItem[]>(() => {
    if (timeboxType === "Releases") {
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
    if (timeboxType === "Milestones") return MILESTONES_DATA;
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
  }, [timeboxType]);

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

  function openRecordDetails(iteration: TimeboxListItem) {
    const iterationState = iteration.state === "Planning" || iteration.state === "Committed" || iteration.state === "Accepted" ? iteration.state : "Planning";
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
      state: iterationState,
      plannedVelocity: iteration.plannedVelocity,
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
                {COLUMNS.map(column => <IterationHeaderCell key={column.key} column={column} sort={sort} onSort={toggleSort} />)}
              </div>

              {paginatedIterations.map(iteration => (
                <div key={iteration.id} onClick={() => openRecordDetails(iteration)} className="flex items-center h-8 px-3 gap-0 cursor-pointer hover:bg-[#f7f8fa]" style={{ width: tableWidth, minWidth: "100%", borderBottom: "1px solid #edf0f4" }}>
                  <div className="w-10 shrink-0 flex items-center justify-center"><Info size={13} style={{ color: "#2558a6" }} /></div>
                  <div className="shrink-0 px-2 text-[11px] font-medium truncate" style={{ width: COLUMNS[0].width, color: "#1a2234" }}>{iteration.name}</div>
                  <div className="shrink-0 px-2 text-[11px] truncate" style={{ width: COLUMNS[1].width, color: "#1a2234" }}>{iteration.theme}</div>
                  <div className="shrink-0 px-2 text-[11px] truncate" style={{ width: COLUMNS[2].width, color: "#5c6478" }}>{iteration.startDate}</div>
                  <div className="shrink-0 px-2 text-[11px] truncate" style={{ width: COLUMNS[3].width, color: "#5c6478" }}>{iteration.endDate}</div>
                  <div className="shrink-0 px-2 text-[11px] truncate" style={{ width: COLUMNS[4].width, color: "#5c6478" }}>{iteration.project}</div>
                  <div className="shrink-0 px-2 text-right text-[11px] font-mono tabular-nums" style={{ width: COLUMNS[5].width, color: "#5c6478" }}>{iteration.plannedVelocity || ""}</div>
                  <div className="shrink-0 px-2 text-right text-[11px] font-mono tabular-nums" style={{ width: COLUMNS[6].width, color: "#5c6478" }}>{iteration.taskEstimate || ""}</div>
                  <div className="shrink-0 px-2" style={{ width: COLUMNS[7].width }}><TextBadge value={iteration.state} /></div>
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
