import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpDown, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { type IterationItem, type Owner, type Role, type StatusType, type TaskItem, type TaskState, type WorkItem, can, ITERATIONS_DATA, OWNERS } from "../model";
import { Avatar, TypeBadge } from "../components/shared";

type TeamStatusPageProps = {
  role: Role;
  readOnly?: boolean;
  items: WorkItem[];
  tasks: TaskItem[];
  onUpdateTask: (id: string, patch: Partial<TaskItem>) => void;
  onOpenFull: (item: WorkItem) => void;
};

type MemberGroup = {
  owner: Owner;
  items: TaskItem[];
  capacity: number;
  estimate: number;
  todo: number;
  actuals: number;
};

type TeamStatusColumnKey = "rank" | "id" | "taskName" | "workProduct" | "release" | "state" | "capacity" | "estimate" | "todo" | "actuals" | "owner";

const DEFAULT_COLUMN_WIDTHS: Record<TeamStatusColumnKey, number> = {
  rank: 70,
  id: 220,
  taskName: 360,
  workProduct: 170,
  release: 140,
  state: 112,
  capacity: 96,
  estimate: 92,
  todo: 92,
  actuals: 92,
  owner: 170,
};

const MIN_COLUMN_WIDTHS: Record<TeamStatusColumnKey, number> = {
  rank: 58,
  id: 130,
  taskName: 220,
  workProduct: 150,
  release: 100,
  state: 108,
  capacity: 82,
  estimate: 78,
  todo: 72,
  actuals: 78,
  owner: 120,
};

const TEAM_STATUS_OPTIONS: TaskState[] = ["Defined", "In-Progress", "Completed"];

const DEFAULT_CAPACITY: Record<string, number> = {
  "Marcus Webb": 54,
  "Sarah Chen": 48,
  "James Okafor": 42,
  "Priya Nair": 45,
  "Tom Brennan": 36,
};

const STATE_STEPS = ["Defined", "In-Progress", "Completed", "Accepted"] as const;

function formatIterationRange(iteration: IterationItem) {
  return `${iteration.startDate.slice(0, 10)} - ${iteration.endDate.slice(0, 10)}`;
}

function toHours(value: number) {
  return `${value} Hours`;
}

function actualHours(item: WorkItem) {
  const estimate = item.taskEstimate ?? item.planEstimate ?? 0;
  const ratio = item.taskCount ? item.completedTasks / item.taskCount : item.status === "Accepted" ? 1 : item.status === "Completed" ? 0.9 : 0.45;
  return Math.round(estimate * ratio);
}

function toTeamScheduleState(status: StatusType): StatusType {
  if (status === "Completed" || status === "Accepted" || status === "Release") return "Completed";
  if (status === "Defined" || status === "Idea") return "Defined";
  return "In-Progress";
}

function workProductIdFor(item: WorkItem) {
  return item.id.replace("-", "");
}

function buildGridTemplate(widths: Record<TeamStatusColumnKey, number>) {
  return `${widths.rank}px ${widths.id}px minmax(${widths.taskName}px,1fr) ${widths.workProduct}px ${widths.release}px ${widths.state}px ${widths.capacity}px ${widths.estimate}px ${widths.todo}px ${widths.actuals}px ${widths.owner}px`;
}

function HeaderCell({ children, column, onResize, className = "", align = "left" }: { children: ReactNode; column: TeamStatusColumnKey; onResize: (column: TeamStatusColumnKey, event: React.MouseEvent<HTMLDivElement>) => void; className?: string; align?: "left" | "right" | "center" }) {
  return (
    <div className={`relative h-full px-2 flex items-center gap-1 text-[11px] font-semibold select-none ${className}`} style={{ color: "#8c94a6", justifyContent: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start", borderRight: "1px solid #e2e6eb" }}>
      <span className="truncate">{children}</span>
      <ArrowUpDown size={10} className="shrink-0" style={{ color: "#b0b8c8" }} />
      <div role="separator" aria-label={`Resize ${children} column`} aria-orientation="vertical" onMouseDown={event => onResize(column, event)} className="absolute right-0 top-0 h-full w-2 cursor-col-resize group z-10">
        <div className="absolute right-[3px] top-1 bottom-1 w-px group-hover:bg-[#2558a6]" style={{ backgroundColor: "#e2e6eb" }} />
      </div>
    </div>
  );
}

function GroupRow({ group, expanded, editable, gridTemplate, onToggle, onCapacityChange }: { group: MemberGroup; expanded: boolean; editable: boolean; gridTemplate: string; onToggle: () => void; onCapacityChange: (value: number) => void }) {
  const percent = group.estimate ? Math.min(100, Math.round((group.actuals / group.estimate) * 100)) : 0;
  return (
    <div className="grid h-8 items-center text-[11px]" style={{ gridTemplateColumns: gridTemplate, backgroundColor: "#e9edf3", borderBottom: "1px solid #d5dbe5", color: "#1a2234" }}>
      <div className="px-2 flex justify-center">
        <button onClick={onToggle} aria-label={`${expanded ? "Collapse" : "Expand"} ${group.owner.name}`} className="w-5 h-5 flex items-center justify-center rounded-sm" style={{ color: "#2563eb", backgroundColor: "transparent" }}>
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>
      <div className="px-2 flex items-center gap-2 min-w-0">
        <Avatar owner={group.owner} size="xs" />
        <span className="font-medium truncate" style={{ color: "#273449" }}>{group.owner.name}</span>
        <span className="text-[10px] shrink-0" style={{ color: "#5c6478" }}>({group.items.length} Tasks)</span>
      </div>
      <div />
      <div />
      <div />
      <div className="px-2">
        <div className="text-[11px] font-semibold mb-0.5" style={{ color: "#16a34a" }}>{percent}%</div>
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#d7dee8" }}>
          <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: "#2da44e" }} />
        </div>
      </div>
      <div className="px-2 text-right">
        {editable ? (
          <input type="number" min={0} value={group.capacity} onChange={event => onCapacityChange(Number(event.target.value))} className="w-14 px-1 py-0.5 text-right text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #c8d3e0", color: "#273449" }} />
        ) : (
          <span>{group.capacity}</span>
        )}
      </div>
      <div className="px-2 text-right tabular-nums">{group.estimate}</div>
      <div className="px-2 text-right tabular-nums">{group.todo}</div>
      <div className="px-2 text-right tabular-nums">{group.actuals}</div>
      <div />
    </div>
  );
}

function ItemRow({ task, parent, editable, gridTemplate, onOpen, onUpdate }: { task: TaskItem; parent: WorkItem; editable: boolean; gridTemplate: string; onOpen: (item: WorkItem) => void; onUpdate: (id: string, patch: Partial<TaskItem>) => void }) {
  const parentStatus = toTeamScheduleState(parent.status);
  return (
    <div onClick={() => onOpen(parent)} className="grid h-8 items-center text-[11px] cursor-pointer hover:bg-[#f7f8fa]" style={{ gridTemplateColumns: gridTemplate, borderBottom: "1px solid #edf0f4", color: "#3a4254" }}>
      <div className="px-2 flex justify-center"><input type="checkbox" onClick={event => event.stopPropagation()} className="w-3.5 h-3.5" /></div>
      <div className="px-2 flex items-center gap-2 min-w-0">
        <TypeBadge type="Task" />
        <span className="font-mono text-[10px] font-medium truncate" style={{ color: "#2563eb" }}>{task.id}</span>
      </div>
      <div className="px-2 min-w-0" onClick={event => event.stopPropagation()}>
        <input aria-label={`${task.id} task name`} readOnly={!editable} value={task.name} onChange={event => onUpdate(task.id, { name: event.target.value })} className="block w-full truncate text-[11px] bg-transparent focus:outline-none focus:bg-white focus:px-1 focus:py-0.5 focus:rounded" style={{ color: "#1a2234", border: editable ? "1px solid transparent" : "0" }} />
      </div>
      <div className="px-2 flex items-center gap-2 min-w-0">
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ backgroundColor: parent.type === "Defect" ? "#d4a20c" : "#c9c514" }}>{parent.type === "Defect" ? "D" : "S"}</span>
        <span className="min-w-0 flex-1 truncate text-[11px]" style={{ color: "#2563eb" }}>{workProductIdFor(parent)}: <span style={{ color: "#5c6478" }}>{parent.title}</span></span>
        <span className="shrink-0 rounded px-1 py-px text-[9px] font-semibold" style={{ backgroundColor: parentStatus === "Completed" ? "#eef6f0" : "#eef3fb", color: parentStatus === "Completed" ? "#1e6930" : "#2558a6" }}>{parentStatus === "Completed" ? "Done" : parentStatus}</span>
      </div>
      <div className="px-2 truncate">{parent.release}</div>
      <div className="px-2" onClick={event => event.stopPropagation()}>
        {editable ? (
          <select aria-label={`${task.id} schedule state`} value={task.state} onChange={event => onUpdate(task.id, { state: event.target.value as TaskState })} className="w-[106px] max-w-full text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #bdd0ef", color: "#2558a6" }}>
            {TEAM_STATUS_OPTIONS.map(status => <option key={status}>{status}</option>)}
          </select>
        ) : (
          <span className="text-[11px]" style={{ color: "#5c6478" }}>{task.state}</span>
        )}
      </div>
      <div className="px-2" />
      <div className="px-2 text-right tabular-nums font-mono">{task.estimate}</div>
      <div className="px-2 text-right tabular-nums font-mono">{task.todo}</div>
      <div className="px-2 text-right tabular-nums font-mono">{task.actuals}</div>
      <div className="px-2 truncate text-[11px]">{task.owner.name}</div>
    </div>
  );
}

export function TeamStatusPage({ role, readOnly = false, items, tasks, onUpdateTask, onOpenFull }: TeamStatusPageProps) {
  const [selectedIterationId, setSelectedIterationId] = useState("IT-24-3");
  const [iterationOpen, setIterationOpen] = useState(false);
  const [expandedOwners, setExpandedOwners] = useState<Set<string>>(new Set(OWNERS.map(owner => owner.name)));
  const [capacityByOwner, setCapacityByOwner] = useState<Record<string, number>>(DEFAULT_CAPACITY);
  const [columnWidths, setColumnWidths] = useState<Record<TeamStatusColumnKey, number>>(DEFAULT_COLUMN_WIDTHS);

  const iterations = ITERATIONS_DATA;
  const selectedIteration = iterations.find(iteration => iteration.id === selectedIterationId) ?? iterations[0];
  const selectedIterationIndex = iterations.findIndex(iteration => iteration.id === selectedIteration.id);
  const editable = !readOnly && can.edit(role);
  const gridTemplate = buildGridTemplate(columnWidths);
  const tableWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);
  const parentById = useMemo(() => new Map(items.map(item => [item.id, item])), [items]);

  const groups = useMemo<MemberGroup[]>(() => {
    const scopedTasks = tasks.filter(task => parentById.get(task.parentWorkItemId)?.iteration === selectedIteration.name);

    return OWNERS.map(owner => {
      const ownerItems = scopedTasks.filter(item => item.owner.name === owner.name);
      const estimate = ownerItems.reduce((sum, item) => sum + item.estimate, 0);
      const todo = ownerItems.reduce((sum, item) => sum + item.todo, 0);
      const actuals = ownerItems.reduce((sum, item) => sum + item.actuals, 0);
      return { owner, items: ownerItems, capacity: capacityByOwner[owner.name] ?? DEFAULT_CAPACITY[owner.name] ?? 40, estimate, todo, actuals };
    }).filter(group => group.items.length > 0);
  }, [capacityByOwner, parentById, selectedIteration.name, tasks]);

  const totals = groups.reduce((acc, group) => ({
    capacity: acc.capacity + group.capacity,
    estimate: acc.estimate + group.estimate,
    todo: acc.todo + group.todo,
    actuals: acc.actuals + group.actuals,
    items: acc.items + group.items.length,
    blocked: acc.blocked + group.items.filter(item => item.blocked).length,
    defects: acc.defects + group.items.filter(item => item.type === "Defect").length,
  }), { capacity: 0, estimate: 0, todo: 0, actuals: 0, items: 0, blocked: 0, defects: 0 });

  function toggleOwner(name: string) {
    setExpandedOwners(previous => {
      const next = new Set(previous);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function moveIteration(direction: -1 | 1) {
    const next = Math.max(0, Math.min(iterations.length - 1, selectedIterationIndex + direction));
    setSelectedIterationId(iterations[next].id);
    setIterationOpen(false);
  }

  function startColumnResize(column: TeamStatusColumnKey, event: React.MouseEvent<HTMLDivElement>) {
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

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="flex items-center gap-3 px-4 py-2 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <span className="text-[11px] font-semibold" style={{ color: "#1a2234" }}>Iteration</span>
        <div className="flex items-center rounded bg-white overflow-visible" style={{ border: "1px solid #bdd0ef", height: 28 }}>
          <button disabled={selectedIterationIndex <= 0} onClick={() => moveIteration(-1)} className="h-full px-2 flex items-center" style={{ color: selectedIterationIndex <= 0 ? "#b0b8c8" : "#2558a6", borderRight: "1px solid #dde2ea" }}><ChevronLeft size={14} /></button>
          <div className="relative h-full">
            <button onClick={() => setIterationOpen(open => !open)} className="h-full flex items-center gap-3 px-3 text-left bg-white" style={{ minWidth: 270, color: "#1a2234" }}>
              <span className="text-[12px] font-semibold whitespace-nowrap">{selectedIteration.name}</span>
              <span className="text-[11px] whitespace-nowrap" style={{ color: "#5c6478" }}>{formatIterationRange(selectedIteration)}</span>
              <ChevronDown size={12} className="ml-auto" style={{ color: "#5c6478" }} />
            </button>
            {iterationOpen && (
              <div className="absolute left-0 top-full mt-1 w-full bg-white rounded shadow-lg z-50 py-1" style={{ border: "1px solid #d9dee7" }}>
                {iterations.map(iteration => (
                  <button key={iteration.id} onClick={() => { setSelectedIterationId(iteration.id); setIterationOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#f4f6f9]" style={{ backgroundColor: selectedIteration.id === iteration.id ? "#edf2fb" : "transparent" }}>
                    <span className="text-[12px] font-semibold flex-1" style={{ color: selectedIteration.id === iteration.id ? "#1d3f73" : "#1a2234" }}>{iteration.name}</span>
                    <span className="text-[11px]" style={{ color: "#5c6478" }}>{formatIterationRange(iteration)}</span>
                    {selectedIteration.id === iteration.id && <Check size={11} style={{ color: "#1d3f73" }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button disabled={selectedIterationIndex >= iterations.length - 1} onClick={() => moveIteration(1)} className="h-full px-2 flex items-center" style={{ color: selectedIterationIndex >= iterations.length - 1 ? "#b0b8c8" : "#2558a6", borderLeft: "1px solid #dde2ea" }}><ChevronRight size={14} /></button>
        </div>
        <div className="flex-1" />
      </div>

      <div className="flex-1 overflow-auto">
        <div style={{ width: tableWidth, minWidth: "100%" }}>
          <div className="grid h-8 sticky top-0 z-10" style={{ gridTemplateColumns: gridTemplate, backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            <HeaderCell column="rank" onResize={startColumnResize}>Rank</HeaderCell>
            <HeaderCell column="id" onResize={startColumnResize}>ID</HeaderCell>
            <HeaderCell column="taskName" onResize={startColumnResize}>Task Name</HeaderCell>
            <HeaderCell column="workProduct" onResize={startColumnResize}>Work Product</HeaderCell>
            <HeaderCell column="release" onResize={startColumnResize}>Release</HeaderCell>
            <HeaderCell column="state" onResize={startColumnResize}>State</HeaderCell>
            <HeaderCell column="capacity" onResize={startColumnResize} align="right">Capacity</HeaderCell>
            <HeaderCell column="estimate" onResize={startColumnResize} align="right">Estimate</HeaderCell>
            <HeaderCell column="todo" onResize={startColumnResize} align="right">ToDo</HeaderCell>
            <HeaderCell column="actuals" onResize={startColumnResize} align="right">Actuals</HeaderCell>
            <HeaderCell column="owner" onResize={startColumnResize}>Owner</HeaderCell>
          </div>

          <div className="grid h-6 items-center text-[11px] font-medium" style={{ gridTemplateColumns: gridTemplate, borderBottom: "1px solid #e2e6eb", color: "#1a2234" }}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div className="px-2 text-right">{toHours(totals.capacity)}</div>
            <div className="px-2 text-right">{toHours(totals.estimate)}</div>
            <div className="px-2 text-right">{toHours(totals.todo)}</div>
            <div className="px-2 text-right">{toHours(totals.actuals)}</div>
            <div />
          </div>

          {groups.map(group => (
            <div key={group.owner.name}>
              <GroupRow
                group={group}
                expanded={expandedOwners.has(group.owner.name)}
                editable={editable}
                gridTemplate={gridTemplate}
                onToggle={() => toggleOwner(group.owner.name)}
                onCapacityChange={value => setCapacityByOwner(previous => ({ ...previous, [group.owner.name]: value }))}
              />
              {expandedOwners.has(group.owner.name) && group.items.map(task => {
                const parent = parentById.get(task.parentWorkItemId);
                if (!parent) return null;
                return <ItemRow key={task.id} task={task} parent={parent} editable={editable} gridTemplate={gridTemplate} onOpen={onOpenFull} onUpdate={onUpdateTask} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
