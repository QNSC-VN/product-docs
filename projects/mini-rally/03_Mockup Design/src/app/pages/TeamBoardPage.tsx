import { useMemo, useState, type DragEvent } from "react";
import {
  AlertTriangle, Check, ChevronDown, ChevronLeft, ChevronRight,
  Filter, GripVertical, LayoutGrid, MessageSquare, Paperclip, Plus,
  Search, X,
} from "lucide-react";
import {
  type IterationItem,
  type Owner,
  type PriorityType,
  type Role,
  type StatusType,
  type WorkItem,
  type WorkItemType,
  can,
  ITERATIONS_DATA,
  OWNERS,
  SCOPE_PROJECTS,
  WORK_ITEMS,
} from "../model";
import { Avatar, DetailPanel, PriorityBadge, STATUS_CFG, TypeBadge, TYPE_CFG } from "../components/shared";

const BOARD_STATUSES: StatusType[] = ["Idea", "Defined", "In-Progress", "Completed", "Accepted", "Release"];
const WIP_LIMITS: Partial<Record<StatusType, number>> = {
  Defined: 6,
  "In-Progress": 4,
  Completed: 5,
};

function formatIterationRange(iteration: IterationItem) {
  return `${iteration.startDate.slice(0, 10)} - ${iteration.endDate.slice(0, 10)}`;
}

function toBoardState(status: StatusType): StatusType {
  return BOARD_STATUSES.includes(status) ? status : "In-Progress";
}

function statusLabel(status: StatusType) {
  return status === "In-Progress" ? "In Progress" : status;
}

function initialsName(owner: Owner) {
  const parts = owner.name.split(" ");
  return `${parts[0]} ${parts[1]?.[0] ?? ""}.`;
}

function BoardAddItemModal({
  iteration,
  onClose,
  onCreate,
  onCreateWithDetails,
}: {
  iteration: IterationItem;
  onClose: () => void;
  onCreate: (item: WorkItem) => void;
  onCreateWithDetails?: (item: WorkItem) => void;
}) {
  const [type, setType] = useState<WorkItemType>("Story");
  const [title, setTitle] = useState("");
  const [ownerName, setOwnerName] = useState(OWNERS[0].name);
  const [planEstimate, setPlanEstimate] = useState(0);
  const [status, setStatus] = useState<StatusType>("Defined");
  const selectedProject = SCOPE_PROJECTS.find(project => project.key === iteration.projectKey) || SCOPE_PROJECTS[0];

  function buildItem(): WorkItem {
    const owner = OWNERS.find(candidate => candidate.name === ownerName) || OWNERS[0];
    const prefix = type === "Defect" ? "DE" : type === "Task" ? "TA" : type === "Feature" ? "FE" : "US";
    return {
      id: `${prefix}-NEW-${Date.now().toString().slice(-4)}`,
      type,
      title: title.trim() || `New ${type}`,
      status,
      priority: type === "Defect" ? "High" : "Medium",
      owner,
      planEstimate,
      taskCount: 0,
      completedTasks: 0,
      taskEstimate: type === "Task" ? planEstimate : 0,
      todoEstimate: type === "Task" ? planEstimate : 0,
      iteration: iteration.name,
      release: "Q4 2024",
      tags: [],
      project: iteration.projectKey,
      rank: 1,
      description: title.trim() || `New ${type} created from Team board.`,
      lastUpdated: "Just now",
    };
  }

  function createItem(openDetails: boolean) {
    const item = buildItem();
    onCreate(item);
    onClose();
    if (openDetails && onCreateWithDetails) onCreateWithDetails(item);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <div className="relative bg-white rounded shadow-2xl flex flex-col overflow-hidden" style={{ width: 640, maxHeight: "86vh", border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Add Item to Team Board</p>
            <p className="text-[11px]" style={{ color: "#8c94a6" }}>{iteration.name} · {formatIterationRange(iteration)}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded" style={{ color: "#8c94a6" }}><X size={15} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#5c6478" }}>Type</label>
            <div className="grid grid-cols-4 gap-2">
              {(["Story", "Defect", "Task", "Feature"] as WorkItemType[]).map(option => {
                const cfg = TYPE_CFG[option];
                return (
                  <button key={option} onClick={() => setType(option)} className="py-1.5 text-[11px] font-semibold rounded-sm" style={{ backgroundColor: type === option ? cfg.bg : "transparent", color: type === option ? cfg.text : "#5c6478", border: `1px solid ${type === option ? cfg.border : "#dde2ea"}` }}>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Project</label><input readOnly value={`${iteration.projectKey} · ${selectedProject.name}`} className="w-full text-[12px] px-2.5 py-1.5 rounded bg-[#f7f8fa]" style={{ border: "1px solid #dde2ea", color: "#5c6478" }} /></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Team</label><input readOnly value={iteration.team} className="w-full text-[12px] px-2.5 py-1.5 rounded bg-[#f7f8fa]" style={{ border: "1px solid #dde2ea", color: "#5c6478" }} /></div>
          </div>
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Iteration</label><input readOnly value={`${iteration.name} · ${formatIterationRange(iteration)}`} className="w-full text-[12px] px-2.5 py-1.5 rounded bg-[#f7f8fa]" style={{ border: "1px solid #dde2ea", color: "#5c6478" }} /></div>
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Title <span style={{ color: "#dc2626" }}>*</span></label><input autoFocus value={title} onChange={event => setTitle(event.target.value)} placeholder="Enter a concise, descriptive title..." className="w-full text-[13px] px-3 py-2 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Schedule State</label><select value={status} onChange={event => setStatus(event.target.value as StatusType)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{BOARD_STATUSES.map(option => <option key={option}>{option}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Owner</label><select value={ownerName} onChange={event => setOwnerName(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Plan Estimate</label><input type="number" min={0} value={planEstimate} onChange={event => setPlanEstimate(Number(event.target.value))} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} /></div>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
          <span className="text-[10px]" style={{ color: "#8c94a6" }}>New card will appear on the selected board column.</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3.5 py-1.5 text-[12px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}>Cancel</button>
            <button onClick={() => createItem(true)} className="px-4 py-1.5 text-[12px] font-semibold rounded" style={{ border: "1px solid #9fb5d5", color: "#1d3f73", backgroundColor: "#f5f8fc" }}>Create with details</button>
            <button onClick={() => createItem(false)} className="px-4 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}>Create Item</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardCard({
  item,
  active,
  draggable,
  onClick,
  onOpenFull,
  onDragStart,
}: {
  item: WorkItem;
  active: boolean;
  draggable: boolean;
  onClick: () => void;
  onOpenFull?: (item: WorkItem) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDoubleClick={() => onOpenFull?.(item)}
      onClick={onClick}
      onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onClick(); } }}
      role="button"
      tabIndex={0}
      aria-label={`${item.id} ${item.title}`}
      className="bg-white rounded mb-2 cursor-pointer transition-shadow hover:shadow-sm group"
      style={{ border: active ? "2px solid #2558a6" : "1px solid #dfe4ec" }}
    >
      <div className="px-2.5 py-2">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <GripVertical size={12} className="opacity-0 group-hover:opacity-100 shrink-0" style={{ color: "#8c94a6" }} />
            <TypeBadge type={item.type} />
          </div>
          <span className="font-mono text-[10px] shrink-0" style={{ color: "#2558a6" }}>{item.id}</span>
        </div>
        <p className="text-[12px] font-medium leading-snug mb-2" style={{ color: "#1a2234", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{item.title}</p>
        <div className="flex items-center justify-between gap-2 mb-2">
          <PriorityBadge priority={item.priority} />
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px]" style={{ color: "#5c6478" }}>{item.planEstimate}pt</span>
            <Avatar owner={item.owner} size="xs" />
          </div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ backgroundColor: "#edf0f4" }}>
          <div className="h-full rounded-full" style={{ width: `${item.taskCount === 0 ? 0 : Math.round((item.completedTasks / item.taskCount) * 100)}%`, backgroundColor: item.completedTasks === item.taskCount && item.taskCount > 0 ? "#2a8c3f" : "#2558a6" }} />
        </div>
        <div className="flex items-center gap-2 text-[10px]" style={{ color: "#8c94a6" }}>
          {item.blocked && <span className="flex items-center gap-0.5 font-semibold" style={{ color: "#b91c1c" }}><AlertTriangle size={10} />Blocked</span>}
          {(item.commentCount ?? 0) > 0 && <span className="flex items-center gap-0.5"><MessageSquare size={10} />{item.commentCount}</span>}
          {(item.attachmentCount ?? 0) > 0 && <span className="flex items-center gap-0.5"><Paperclip size={10} />{item.attachmentCount}</span>}
          <span className="ml-auto">{item.completedTasks}/{item.taskCount} tasks</span>
        </div>
      </div>
    </div>
  );
}

export function TeamBoardPage({
  role,
  activeItem,
  onItemClick,
  onOpenFull,
}: {
  role: Role;
  activeItem: WorkItem | null;
  onItemClick: (item: WorkItem) => void;
  onOpenFull?: (item: WorkItem) => void;
}) {
  const iterations = useMemo(() => [...ITERATIONS_DATA].sort((a, b) => a.startDate.localeCompare(b.startDate)), []);
  const [items, setItems] = useState<WorkItem[]>(WORK_ITEMS);
  const [selectedIterationId, setSelectedIterationId] = useState("IT-24-3");
  const [iterationOpen, setIterationOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [blockedFilter, setBlockedFilter] = useState("All");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<StatusType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const selectedIteration = iterations.find(iteration => iteration.id === selectedIterationId) ?? iterations[0];
  const selectedIterationIndex = iterations.findIndex(iteration => iteration.id === selectedIteration.id);
  const editable = can.dragBoard(role);
  const selectedProject = SCOPE_PROJECTS.find(project => project.key === selectedIteration.projectKey) || SCOPE_PROJECTS[0];

  const iterationItems = items.filter(item =>
    item.iteration === selectedIteration.name &&
    item.project === selectedIteration.projectKey &&
    (item.title.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase())) &&
    (ownerFilter === "All" || item.owner.name === ownerFilter) &&
    (typeFilter === "All" || item.type === typeFilter) &&
    (blockedFilter === "All" || (blockedFilter === "Blocked" ? item.blocked : !item.blocked))
  );

  const plannedPoints = iterationItems.reduce((total, item) => total + item.planEstimate, 0);
  const acceptedPoints = iterationItems.filter(item => toBoardState(item.status) === "Accepted").reduce((total, item) => total + item.planEstimate, 0);
  const activeCount = iterationItems.filter(item => !["Accepted", "Release"].includes(toBoardState(item.status))).length;
  const blockedCount = iterationItems.filter(item => item.blocked).length;
  const todoEstimate = iterationItems.reduce((total, item) => total + (item.todoEstimate ?? 0), 0);

  function moveIteration(direction: -1 | 1) {
    const next = Math.max(0, Math.min(iterations.length - 1, selectedIterationIndex + direction));
    setSelectedIterationId(iterations[next].id);
    setIterationOpen(false);
    setDraggedId(null);
  }

  function updateItemStatus(id: string, status: StatusType) {
    setItems(previous => previous.map(item => item.id === id ? { ...item, status } : item));
  }

  function handleDrop(status: StatusType) {
    if (!editable || !draggedId) return;
    updateItemStatus(draggedId, status);
    setDraggedId(null);
    setDropTarget(null);
  }

  function addItem(item: WorkItem) {
    setItems(previous => [item, ...previous]);
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div className="flex items-center rounded bg-white overflow-visible" style={{ border: "1px solid #bdd0ef", height: 28 }}>
          <button aria-label="Previous iteration" disabled={selectedIterationIndex <= 0} onClick={() => moveIteration(-1)} className="h-full px-2 flex items-center disabled:opacity-40" style={{ color: "#2558a6", borderRight: "1px solid #dde2ea" }}><ChevronLeft size={14} /></button>
          <div className="relative h-full">
            <button onClick={() => setIterationOpen(open => !open)} className="h-full flex items-center gap-3 px-3 text-left bg-white" style={{ minWidth: 286, color: "#1a2234" }}>
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
          <button aria-label="Next iteration" disabled={selectedIterationIndex >= iterations.length - 1} onClick={() => moveIteration(1)} className="h-full px-2 flex items-center disabled:opacity-40" style={{ color: "#2558a6", borderLeft: "1px solid #dde2ea" }}><ChevronRight size={14} /></button>
        </div>
        <div className="flex items-center gap-1 text-[11px]" style={{ color: "#5c6478" }}>
          <span className="font-semibold" style={{ color: "#1a2234" }}>{selectedProject.name}</span>
          <span>·</span>
          <span>{selectedIteration.team}</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ border: "1px solid #bdd0ef", backgroundColor: "#edf2fb", color: "#1d3f73" }}>
          <LayoutGrid size={12} />
          <span className="text-[11px] font-semibold">Board</span>
        </div>
      </div>

      <div className="flex items-stretch bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb", height: 58 }}>
        {[
          ["Cards", iterationItems.length, "selected iteration", "#1a2234"],
          ["Active", activeCount, "not accepted", "#2558a6"],
          ["Plan Est", plannedPoints, "pts committed", "#1a2234"],
          ["Accepted", acceptedPoints, "pts accepted", "#1e6930"],
          ["To Do", todoEstimate, "task estimate", "#8a5808"],
          ["Blocked", blockedCount, "needs attention", blockedCount > 0 ? "#b91c1c" : "#1a2234"],
        ].map(([label, value, helper, color], index) => (
          <div key={label} className="flex flex-col justify-center px-5 gap-0.5" style={{ minWidth: 128, borderLeft: index === 0 ? undefined : "1px solid #e2e6eb" }}>
            <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#8c94a6" }}>{label}</span>
            <span className="text-[18px] font-semibold leading-none" style={{ color: String(color) }}>{value}</span>
            <span className="text-[10px]" style={{ color: "#5c6478" }}>{helper}</span>
          </div>
        ))}
        <div className="flex-1" />
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
          <input type="text" placeholder="Filter cards..." value={search} onChange={event => setSearch(event.target.value)} className="pl-7 pr-3 py-1 text-[12px] rounded focus:outline-none" style={{ backgroundColor: "#f4f6f9", border: "1px solid #dde2ea", color: "#1a2234", width: 180 }} />
        </div>
        <button onClick={() => setShowFilters(previous => !previous)} className="flex items-center gap-1.5 px-2 py-1 text-[11px] rounded" style={{ border: "1px solid #bdd0ef", color: "#2558a6", backgroundColor: showFilters ? "#edf2fb" : "#fff" }}><Filter size={11} /> {showFilters ? "Hide filter" : "Show filter"}</button>
        {can.create(role) && <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}><Plus size={12} /> Add Item</button>}
        <div className="flex-1" />
        {!editable && <span className="text-[10px] px-2 py-0.5 rounded-sm" style={{ backgroundColor: "#f1f5f9", color: "#8c94a6" }}>View only</span>}
      </div>

      {showFilters && (
        <div className="flex items-center gap-3 px-4 py-2 shrink-0" style={{ backgroundColor: "#f5f8fc", borderBottom: "1px solid #cfdced" }}>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "#3a4254" }}>Owner
            <select value={ownerFilter} onChange={event => setOwnerFilter(event.target.value)} className="text-[11px] px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234", minWidth: 144 }}>
              <option>All</option>
              {OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "#3a4254" }}>Type
            <select value={typeFilter} onChange={event => setTypeFilter(event.target.value)} className="text-[11px] px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234", minWidth: 112 }}>
              {["All", "Story", "Defect", "Feature", "Task"].map(option => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "#3a4254" }}>Blocked
            <select value={blockedFilter} onChange={event => setBlockedFilter(event.target.value)} className="text-[11px] px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234", minWidth: 112 }}>
              {["All", "Blocked", "Not Blocked"].map(option => <option key={option}>{option}</option>)}
            </select>
          </label>
          <button onClick={() => { setOwnerFilter("All"); setTypeFilter("All"); setBlockedFilter("All"); }} className="text-[11px] font-medium" style={{ color: "#2558a6" }}>Clear filters</button>
        </div>
      )}

      <div className="flex flex-1 overflow-x-auto p-3 gap-3" style={{ backgroundColor: "#f0f2f5" }}>
        {BOARD_STATUSES.map(status => {
          const cfg = STATUS_CFG[status];
          const columnItems = iterationItems.filter(item => toBoardState(item.status) === status).sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
          const limit = WIP_LIMITS[status];
          const overLimit = limit !== undefined && columnItems.length > limit;
          const estimate = columnItems.reduce((total, item) => total + item.planEstimate, 0);
          return (
            <div key={status} className="flex flex-col shrink-0" style={{ width: 244 }}>
              <div className="flex items-center justify-between px-1 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider truncate" style={{ color: cfg.text }}>{statusLabel(status)}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-px rounded-sm" style={{ backgroundColor: overLimit ? "#fef2f2" : cfg.bg, color: overLimit ? "#b91c1c" : cfg.text }}>
                    {columnItems.length}{limit !== undefined ? `/${limit}` : ""}
                  </span>
                  <span className="text-[10px]" style={{ color: "#8c94a6" }}>{estimate} pts</span>
                </div>
                {can.create(role) && <button aria-label={`Add item to ${statusLabel(status)}`} title={`Add item to ${statusLabel(status)}`} onClick={() => { setShowModal(true); }} className="p-0.5 rounded" style={{ color: "#8c94a6" }}><Plus size={13} /></button>}
              </div>
              <div
                onDragOver={event => { if (editable) { event.preventDefault(); setDropTarget(status); } }}
                onDragLeave={() => setDropTarget(current => current === status ? null : current)}
                onDrop={() => handleDrop(status)}
                className="flex-1 overflow-y-auto rounded p-2"
                style={{ backgroundColor: dropTarget === status ? "#dfeafa" : "#e8eaed", border: dropTarget === status ? "1px solid #7ca1d8" : "1px solid transparent", minHeight: 120 }}
              >
                {columnItems.map(item => (
                  <BoardCard
                    key={item.id}
                    item={item}
                    active={activeItem?.id === item.id}
                    draggable={editable}
                    onClick={() => onItemClick(item)}
                    onOpenFull={onOpenFull}
                    onDragStart={event => {
                      setDraggedId(item.id);
                      event.dataTransfer.effectAllowed = "move";
                    }}
                  />
                ))}
                {columnItems.length === 0 && (
                  <div className="flex items-center justify-center py-8 text-[10px] rounded" style={{ color: "#8c94a6", border: "1.5px dashed #c4cad4", backgroundColor: "rgba(255,255,255,0.45)" }}>
                    {editable ? "Drop cards here" : "No cards"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activeItem && (
        <div className="fixed right-0 top-10 bottom-0 w-80 z-20" style={{ boxShadow: "-2px 0 8px rgba(0,0,0,0.08)" }}>
          <DetailPanel item={activeItem} onClose={() => onItemClick(activeItem)} role={role} onOpenFull={onOpenFull} />
        </div>
      )}
      {showModal && <BoardAddItemModal iteration={selectedIteration} onClose={() => setShowModal(false)} onCreate={addItem} onCreateWithDetails={onOpenFull} />}
    </div>
  );
}
