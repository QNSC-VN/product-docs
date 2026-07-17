import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Filter, Plus, Search, X } from "lucide-react";
import { can, OWNERS, RELATED_STORIES, WORK_ITEMS, type Owner, type PriorityType, type Role, type StatusType, type WorkItem } from "../model";
import { Avatar, DetailPanel, EmptyState, NewItemModal } from "../components/shared";

type DefectColumnKey = "rank" | "id" | "name" | "userStory" | "severity" | "priority" | "state" | "flowState" | "fixedInBuild" | "iteration" | "submittedBy" | "owner";
type DefectSort = { column: DefectColumnKey; direction: "asc" | "desc" };
type DefectSeverity = "None" | "Critical" | "Major Problem" | "Minor Problem" | "Trivial";
type DefectPriority = "None" | "Urgent" | "High" | "Normal" | "Low";
type DefectState = "Submitted" | "Open" | "Fixed" | "Closed" | "Closed Declined";
type DefectFlowState = "Idea" | "Defined" | "In-Progress" | "Completed" | "Accepted" | "Released";
type DefectRowMeta = { userStory: string; fixedInBuild: string; submittedBy: Owner };

const DEFECT_COLUMNS: Array<{ key: DefectColumnKey; label: string; width: number; min: number; align?: "left" | "center" | "right" }> = [
  { key: "rank", label: "Rank", width: 72, min: 56, align: "right" },
  { key: "id", label: "ID", width: 104, min: 76 },
  { key: "name", label: "Name", width: 360, min: 220 },
  { key: "userStory", label: "User Story", width: 220, min: 160 },
  { key: "severity", label: "Severity", width: 128, min: 96 },
  { key: "priority", label: "Priority", width: 128, min: 96 },
  { key: "state", label: "State", width: 104, min: 88 },
  { key: "flowState", label: "Flow State", width: 128, min: 104 },
  { key: "fixedInBuild", label: "Fixed In Build", width: 128, min: 104 },
  { key: "iteration", label: "Iteration", width: 128, min: 104 },
  { key: "submittedBy", label: "Submitted By", width: 136, min: 112 },
  { key: "owner", label: "Owner", width: 136, min: 112 },
];

const DEFECT_STATE_OPTIONS: DefectState[] = ["Submitted", "Open", "Fixed", "Closed", "Closed Declined"];
const DEFECT_FLOW_STATE_OPTIONS: DefectFlowState[] = ["Idea", "Defined", "In-Progress", "Completed", "Accepted", "Released"];
const DEFECT_SEVERITY_OPTIONS: DefectSeverity[] = ["None", "Critical", "Major Problem", "Minor Problem", "Trivial"];
const DEFECT_PRIORITY_OPTIONS: DefectPriority[] = ["None", "Urgent", "High", "Normal", "Low"];
const DEFECT_PRIORITY_LABELS: Record<PriorityType, string> = { Low: "Low", Medium: "Normal", High: "High", Critical: "Urgent" };
const DEFECT_PRIORITY_TO_LEGACY: Record<DefectPriority, PriorityType | "None"> = { Low: "Low", Normal: "Medium", High: "High", Urgent: "Critical", None: "None" };
const FIXED_BUILDS = ["2024.10.1", "2024.10.2", "2024.11.0", "Unassigned"];
const SEVERITY_ORDER: Record<DefectSeverity, number> = { None: 0, Trivial: 1, "Minor Problem": 2, "Major Problem": 3, Critical: 4 };
const PRIORITY_ORDER: Record<DefectPriority, number> = { None: 0, Low: 1, Normal: 2, High: 3, Urgent: 4 };
const DEFECT_STATE_ORDER: Record<DefectState, number> = { Submitted: 1, Open: 2, Fixed: 3, Closed: 4, "Closed Declined": 5 };
const FLOW_STATE_ORDER: Record<DefectFlowState, number> = { Idea: 1, Defined: 2, "In-Progress": 3, Completed: 4, Accepted: 5, Released: 6 };
const DEFAULT_SEVERITIES: DefectSeverity[] = ["Critical", "Major Problem", "Minor Problem", "Trivial"];
const DEFAULT_DEFECT_STATES: DefectState[] = ["Submitted", "Open", "Open", "Closed"];

function defaultFlowState(status: StatusType): DefectFlowState {
  if (status === "Defined") return "Defined";
  if (status === "In-Progress" || status === "Code Review" || status === "Testing") return "In-Progress";
  if (status === "Completed") return "Completed";
  if (status === "Accepted") return "Accepted";
  return "Idea";
}

function defectMeta(item: WorkItem, index: number): DefectRowMeta {
  return {
    userStory: RELATED_STORIES[index % RELATED_STORIES.length],
    fixedInBuild: item.status === "Accepted" || item.status === "Completed" ? FIXED_BUILDS[index % 3] : "Unassigned",
    submittedBy: OWNERS[(index + 2) % OWNERS.length],
  };
}

function getSortValue(item: WorkItem, meta: DefectRowMeta, severity: DefectSeverity, priority: DefectPriority, state: DefectState, flowState: DefectFlowState, column: DefectColumnKey): string | number {
  switch (column) {
    case "rank": return item.rank || 999;
    case "id": return Number(item.id.replace(/\D/g, "")) || 0;
    case "name": return item.title.toLowerCase();
    case "userStory": return meta.userStory.toLowerCase();
    case "severity": return SEVERITY_ORDER[severity] ?? 0;
    case "priority": return PRIORITY_ORDER[priority] ?? 0;
    case "state": return DEFECT_STATE_ORDER[state] ?? 0;
    case "flowState": return FLOW_STATE_ORDER[flowState] ?? 0;
    case "fixedInBuild": return meta.fixedInBuild.toLowerCase();
    case "iteration": return item.iteration.toLowerCase();
    case "submittedBy": return meta.submittedBy.name.toLowerCase();
    case "owner": return item.owner.name.toLowerCase();
  }
}

function compareValues(a: string | number, b: string | number) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

function SeverityBadge({ value }: { value: DefectSeverity }) {
  const style = value === "Critical"
    ? { backgroundColor: "#fff1f0", color: "#b91c1c", border: "1px solid #fcc5c0" }
    : value === "Major Problem"
      ? { backgroundColor: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" }
      : value === "Minor Problem"
        ? { backgroundColor: "#fffbeb", color: "#8a5808", border: "1px solid #fde68a" }
      : { backgroundColor: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" };
  return <span className="inline-flex items-center px-1.5 py-px rounded-sm text-[11px] font-semibold" style={style}>{value}</span>;
}

function SeveritySelect({ value, onChange, label }: { value: DefectSeverity; onChange: (value: DefectSeverity) => void; label: string }) {
  return (
    <select aria-label={label} value={value} onChange={event => onChange(event.target.value as DefectSeverity)} className="w-[118px] text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #f5d899", color: value === "Critical" ? "#b91c1c" : "#9a3412" }}>
      {DEFECT_SEVERITY_OPTIONS.map(severity => <option key={severity}>{severity}</option>)}
    </select>
  );
}

function PrioritySelect({ value, onChange, label }: { value: DefectPriority; onChange: (value: DefectPriority) => void; label: string }) {
  return (
    <select aria-label={label} value={value} onChange={event => onChange(event.target.value as DefectPriority)} className="w-[92px] text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #f5d899", color: "#9a3412" }}>
      {DEFECT_PRIORITY_OPTIONS.map(priority => <option key={priority}>{priority}</option>)}
    </select>
  );
}

function ResizableDefectHeader({ column, width, sort, onSort, onResize }: { column: { key: DefectColumnKey; label: string; align?: "left" | "center" | "right" }; width: number; sort: DefectSort | null; onSort: (column: DefectColumnKey) => void; onResize: (column: DefectColumnKey, event: ReactMouseEvent<HTMLDivElement>) => void }) {
  const isSorted = sort?.column === column.key;
  const SortIcon = isSorted ? (sort.direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <div className="relative shrink-0 h-full flex items-center select-none" style={{ width, justifyContent: column.align === "right" ? "flex-end" : column.align === "center" ? "center" : "flex-start" }}>
      <button type="button" onClick={() => onSort(column.key)} className="h-full min-w-0 flex items-center gap-1 rounded-sm focus:outline-none" style={{ width: "calc(100% - 8px)", color: isSorted ? "#2558a6" : "#5c6478", justifyContent: column.align === "right" ? "flex-end" : column.align === "center" ? "center" : "flex-start" }}>
        <span className="truncate text-[11px] font-semibold">{column.label}</span>
        <SortIcon size={10} className="shrink-0" />
      </button>
      <div role="separator" aria-label={`Resize ${column.label} column`} aria-orientation="vertical" onMouseDown={event => onResize(column.key, event)} className="absolute right-0 top-0 h-full w-2 cursor-col-resize group z-10">
        <div className="absolute right-[3px] top-1 bottom-1 w-px group-hover:bg-[#2558a6]" style={{ backgroundColor: "#d9dee7" }} />
      </div>
    </div>
  );
}

export function QualityPage({ role, readOnly = false, activeItem, onItemClick, onOpenFull }: { role: Role; readOnly?: boolean; activeItem: WorkItem | null; onItemClick: (i: WorkItem) => void; onOpenFull?: (item: WorkItem) => void }) {
  const [defectItems, setDefectItems] = useState<WorkItem[]>(() => WORK_ITEMS.filter(item => item.type === "Defect"));
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<DefectSort | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<DefectColumnKey, number>>(() => Object.fromEntries(DEFECT_COLUMNS.map(column => [column.key, column.width])) as Record<DefectColumnKey, number>);
  const [severityById, setSeverityById] = useState<Record<string, DefectSeverity>>(() => Object.fromEntries(WORK_ITEMS.filter(item => item.type === "Defect").map((item, index) => [item.id, DEFAULT_SEVERITIES[index % DEFAULT_SEVERITIES.length]])));
  const [priorityById, setPriorityById] = useState<Record<string, DefectPriority>>(() => Object.fromEntries(WORK_ITEMS.filter(item => item.type === "Defect").map(item => [item.id, DEFECT_PRIORITY_LABELS[item.priority] as DefectPriority])));
  const [stateById, setStateById] = useState<Record<string, DefectState>>(() => Object.fromEntries(WORK_ITEMS.filter(item => item.type === "Defect").map((item, index) => [item.id, DEFAULT_DEFECT_STATES[index % DEFAULT_DEFECT_STATES.length]])));
  const [flowStateById, setFlowStateById] = useState<Record<string, DefectFlowState>>(() => Object.fromEntries(WORK_ITEMS.filter(item => item.type === "Defect").map(item => [item.id, defaultFlowState(item.status)])));
  const editable = !readOnly && can.createDefects(role);

  const rows = defectItems.map((item, index) => ({ item, meta: defectMeta(item, index) }));
  const filtered = rows.filter(({ item, meta }) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [item.id, item.title, meta.userStory, stateById[item.id] || "", flowStateById[item.id] || "", item.iteration, item.owner.name, meta.submittedBy.name].some(value => value.toLowerCase().includes(query));
  }).sort((a, b) => {
    if (!sort) return (a.item.rank || 999) - (b.item.rank || 999);
    const result = compareValues(
      getSortValue(a.item, a.meta, severityById[a.item.id] || "None", priorityById[a.item.id] || "None", stateById[a.item.id] || "Submitted", flowStateById[a.item.id] || "Idea", sort.column),
      getSortValue(b.item, b.meta, severityById[b.item.id] || "None", priorityById[b.item.id] || "None", stateById[b.item.id] || "Submitted", flowStateById[b.item.id] || "Idea", sort.column)
    );
    return sort.direction === "asc" ? result : -result;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * pageSize;
  const paginatedRows = filtered.slice(pageStart, pageStart + pageSize);
  const allChecked = paginatedRows.length > 0 && paginatedRows.every(row => selectedIds.has(row.item.id));
  const tableWidth = 28 + DEFECT_COLUMNS.reduce((sum, column) => sum + columnWidths[column.key], 0);

  function toggleSelect(id: string) {
    setSelectedIds(previous => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(previous => {
      const next = new Set(previous);
      paginatedRows.forEach(({ item }) => allChecked ? next.delete(item.id) : next.add(item.id));
      return next;
    });
  }

  function updateItem(id: string, patch: Partial<WorkItem>) {
    setDefectItems(previous => previous.map(item => item.id === id ? { ...item, ...patch } : item));
  }

  function updateOwner(id: string, ownerName: string) {
    const owner = OWNERS.find(candidate => candidate.name === ownerName);
    if (owner) updateItem(id, { owner });
  }

  function updateSeverity(id: string, severity: DefectSeverity) {
    setSeverityById(previous => ({ ...previous, [id]: severity }));
  }

  function updatePriority(id: string, priority: DefectPriority) {
    setPriorityById(previous => ({ ...previous, [id]: priority }));
    const legacyPriority = DEFECT_PRIORITY_TO_LEGACY[priority];
    if (legacyPriority !== "None") updateItem(id, { priority: legacyPriority });
  }

  function updateDefectState(id: string, state: DefectState) {
    setStateById(previous => ({ ...previous, [id]: state }));
  }

  function updateFlowState(id: string, flowState: DefectFlowState) {
    setFlowStateById(previous => ({ ...previous, [id]: flowState }));
  }

  function toggleSort(column: DefectColumnKey) {
    setSort(previous => previous?.column === column ? { column, direction: previous.direction === "asc" ? "desc" : "asc" } : { column, direction: "asc" });
  }

  function startColumnResize(column: DefectColumnKey, event: ReactMouseEvent<HTMLDivElement>) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = columnWidths[column];
    const minimum = DEFECT_COLUMNS.find(item => item.key === column)?.min || 72;
    const onMove = (moveEvent: MouseEvent) => {
      setColumnWidths(previous => ({ ...previous, [column]: Math.max(minimum, startWidth + moveEvent.clientX - startX) }));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-4 py-1.5 shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <h2 className="text-[13px] font-semibold mr-2" style={{ color: "#1a2234" }}>Defects</h2>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
          <input type="text" placeholder="Search defects..." value={search} onChange={event => { setSearch(event.target.value); setCurrentPage(1); }} className="pl-7 pr-3 py-1 text-[11px] rounded focus:outline-none" style={{ backgroundColor: "#f4f6f9", border: "1px solid #dde2ea", color: "#1a2234", width: 180 }} />
        </div>
        <button className="flex items-center gap-1.5 px-2 py-1 text-[11px] rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><Filter size={11} /> Filter</button>
        <div className="flex-1" />
        {editable && <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={event => (event.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={event => (event.currentTarget.style.backgroundColor = "#1d3f73")}><Plus size={12} /> Log Defect</button>}
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 shrink-0" style={{ backgroundColor: "#edf2fb", borderBottom: "1px solid #bdd0ef" }}>
          <span className="text-[11px] font-semibold mr-1" style={{ color: "#2558a6" }}>{selectedIds.size} selected</span>
          {["Assign Owner", "Set State", "Set Build", "Link Story", "Delete"].map(action => (
            <button key={action} className="px-2.5 py-1 text-[11px] rounded" style={{ color: "#2558a6", border: "1px solid #bdd0ef" }} onMouseEnter={event => (event.currentTarget.style.backgroundColor = "#dde8f5")} onMouseLeave={event => (event.currentTarget.style.backgroundColor = "transparent")}>{action}</button>
          ))}
          <div className="flex-1" />
          <button onClick={() => setSelectedIds(new Set())} className="p-0.5" style={{ color: "#5c6478" }}><X size={13} /></button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden bg-white">
          <div className="flex-1 overflow-auto">
            <div style={{ width: tableWidth, minWidth: "100%" }}>
              <div className="sticky top-0 z-10 flex items-center h-8 px-3 gap-0 select-none" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #d7dde7" }}>
                <div className="w-7 shrink-0"><input type="checkbox" checked={allChecked} onChange={selectAll} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
                {DEFECT_COLUMNS.map(column => <ResizableDefectHeader key={column.key} column={column} width={columnWidths[column.key]} sort={sort} onSort={toggleSort} onResize={startColumnResize} />)}
              </div>

              {paginatedRows.length === 0 ? <EmptyState message="No defects found" /> : paginatedRows.map(({ item, meta }) => {
                const selected = selectedIds.has(item.id);
                const severity = severityById[item.id] || "None";
                const priority = priorityById[item.id] || "None";
                const defectState = stateById[item.id] || "Submitted";
                const flowState = flowStateById[item.id] || "Idea";
                return (
                  <div key={item.id} onClick={() => onItemClick(item)} className="flex items-center h-8 px-3 gap-0 cursor-pointer hover:bg-[#f7f8fa]" style={{ width: tableWidth, minWidth: "100%", borderBottom: "1px solid #edf0f4", backgroundColor: activeItem?.id === item.id ? "#edf2fb" : selected ? "#f3f6fb" : "white" }}>
                    <div className="w-7 shrink-0" onClick={event => { event.stopPropagation(); toggleSelect(item.id); }}><input type="checkbox" checked={selected} onChange={() => toggleSelect(item.id)} onClick={event => event.stopPropagation()} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#1d3f73" }} /></div>
                    <div className="shrink-0 text-[11px] font-mono text-right tabular-nums pr-3" style={{ width: columnWidths.rank, color: "#5c6478" }}>{item.rank}</div>
                    <div className="shrink-0 overflow-hidden font-mono text-[11px] underline-offset-2 hover:underline px-2" style={{ width: columnWidths.id, color: "#2558a6" }}>{item.id}</div>
                    <div className="shrink-0 min-w-0 px-2" style={{ width: columnWidths.name }} onClick={event => event.stopPropagation()}><input aria-label={`${item.id} defect name`} readOnly={!editable} value={item.title} onChange={event => updateItem(item.id, { title: event.target.value })} className="block w-full truncate text-[11px] font-medium bg-transparent focus:outline-none focus:bg-white focus:px-1 focus:py-0.5 focus:rounded" style={{ color: "#1a2234", border: editable ? "1px solid transparent" : "0" }} /></div>
                    <div className="shrink-0 overflow-hidden px-2 text-[11px] font-mono" style={{ width: columnWidths.userStory, color: meta.userStory === "—" ? "#a0a7b5" : "#2558a6" }}>{meta.userStory}</div>
                    <div className="shrink-0 overflow-hidden px-2" style={{ width: columnWidths.severity }} onClick={event => event.stopPropagation()}>{editable ? <SeveritySelect label={`${item.id} severity`} value={severity} onChange={nextSeverity => updateSeverity(item.id, nextSeverity)} /> : <SeverityBadge value={severity} />}</div>
                    <div className="shrink-0 overflow-hidden px-2" style={{ width: columnWidths.priority }} onClick={event => event.stopPropagation()}>{editable ? <PrioritySelect label={`${item.id} priority`} value={priority} onChange={nextPriority => updatePriority(item.id, nextPriority)} /> : <span className="inline-flex items-center px-1.5 py-px rounded-sm text-[11px] font-semibold" style={{ backgroundColor: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" }}>{priority}</span>}</div>
                    <div className="shrink-0 overflow-hidden px-2" style={{ width: columnWidths.state }} onClick={event => event.stopPropagation()}>{editable ? <select aria-label={`${item.id} state`} value={defectState} onChange={event => updateDefectState(item.id, event.target.value as DefectState)} className="w-[96px] text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #bdd0ef", color: "#2558a6" }}>{DEFECT_STATE_OPTIONS.map(state => <option key={state}>{state}</option>)}</select> : <span className="text-[11px]" style={{ color: "#5c6478" }}>{defectState}</span>}</div>
                    <div className="shrink-0 overflow-hidden px-2" style={{ width: columnWidths.flowState }} onClick={event => event.stopPropagation()}>{editable ? <select aria-label={`${item.id} flow state`} value={flowState} onChange={event => updateFlowState(item.id, event.target.value as DefectFlowState)} className="w-[116px] text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #bdd0ef", color: "#2558a6" }}>{DEFECT_FLOW_STATE_OPTIONS.map(state => <option key={state}>{state}</option>)}</select> : <span className="text-[11px]" style={{ color: "#5c6478" }}>{flowState}</span>}</div>
                    <div className="shrink-0 overflow-hidden px-2 text-[11px]" style={{ width: columnWidths.fixedInBuild, color: meta.fixedInBuild === "Unassigned" ? "#8c94a6" : "#5c6478" }}>{meta.fixedInBuild}</div>
                    <div className="shrink-0 overflow-hidden px-2 text-[11px]" style={{ width: columnWidths.iteration, color: "#5c6478" }}>{item.iteration}</div>
                    <div className="shrink-0 overflow-hidden px-2 flex items-center gap-1" style={{ width: columnWidths.submittedBy }}><Avatar owner={meta.submittedBy} size="xs" /><span className="truncate text-[11px]" style={{ color: "#5c6478" }}>{meta.submittedBy.name}</span></div>
                    <div className="shrink-0 overflow-hidden px-2 flex items-center gap-1" style={{ width: columnWidths.owner }} onClick={event => event.stopPropagation()}><Avatar owner={item.owner} size="xs" />{editable ? <select aria-label={`${item.id} owner`} value={item.owner.name} onChange={event => updateOwner(item.id, event.target.value)} className="min-w-0 flex-1 text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select> : <span className="truncate text-[11px]" style={{ color: "#5c6478" }}>{item.owner.name}</span>}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-10 shrink-0 flex items-center justify-between px-3 bg-white" style={{ borderTop: "1px solid #e2e6eb" }}>
            <div className="flex items-center gap-2 text-[11px]" style={{ color: "#5c6478" }}>
              <span>Rows per page</span>
              <select aria-label="Rows per page" value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setCurrentPage(1); }} className="px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>
                {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
              </select>
              <span style={{ color: "#8c94a6" }}>{filtered.length === 0 ? "0 records" : `${pageStart + 1}-${Math.min(pageStart + pageSize, filtered.length)} of ${filtered.length}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] tabular-nums" style={{ color: "#5c6478" }}>Page {activePage} of {totalPages}</span>
              <button aria-label="Previous page" disabled={activePage === 1} onClick={() => setCurrentPage(activePage - 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronLeft size={13} /></button>
              <button aria-label="Next page" disabled={activePage === totalPages} onClick={() => setCurrentPage(activePage + 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronRight size={13} /></button>
            </div>
          </div>
        </div>
        {activeItem && <DetailPanel item={activeItem} onClose={() => onItemClick(activeItem)} role={role} onOpenFull={onOpenFull} />}
      </div>
      {showModal && <NewItemModal onClose={() => setShowModal(false)} defaultType="Defect" allowedTypes={["Defect"]} />}
    </div>
  );
}
