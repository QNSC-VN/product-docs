import { useState, type ReactNode } from "react";
import { AlignLeft, AtSign, Bold, ChevronLeft, Code2, FileText, History, ImagePlus, Italic, Link2, List, ListChecks, ListOrdered, Maximize2, Minimize2, MoreHorizontal, Plus, Redo2, Strikethrough, Table2, Underline, Undo2 } from "lucide-react";
import { type Role, type ScopeProject, type StatusType, type WorkItem, OWNERS, SCOPE_PROJECTS } from "../model";
import { Avatar, TypeBadge } from "../components/shared";

type DetailTab = "details" | "tasks" | "history";
type TaskDetailTab = "details" | "history";

const TASK_ROWS = [
  { rank: 1, id: "TA-2291", name: "Prepare implementation approach", state: "Completed" as StatusType, owner: OWNERS[0], project: "NXP", teams: "Core Platform", todo: 0, actuals: 8, estimate: 3, description: "Define the implementation approach, affected services, rollout steps, and validation checkpoints before coding begins.", notes: "Coordinate with platform lead before finalizing the cutover plan.", attachments: ["implementation-outline.md"] },
  { rank: 2, id: "TA-2292", name: "Implement and review the change", state: "In-Progress" as StatusType, owner: OWNERS[1], project: "NXP", teams: "Core Platform", todo: 0, actuals: 13, estimate: 5, description: "Implement the selected SSO flow changes, update service configuration, and complete peer review.", notes: "Review session handling and metadata parsing with Security.", attachments: [] },
  { rank: 3, id: "TA-2293", name: "Add automated verification", state: "Defined" as StatusType, owner: OWNERS[3], project: "NXP", teams: "QA Automation", todo: 0, actuals: 0, estimate: 2, description: "Add automated coverage for SAML metadata upload, user provisioning, and expected error handling.", notes: "Start after implementation branch is ready for QA.", attachments: [] },
];

const WORK_ITEM_STATE_OPTIONS = ["Idea", "Defined", "In-Progress", "Completed", "Accepted", "Release"];
const DEFECT_PRIORITY_OPTIONS = ["Low", "Normal", "High", "Urgent", "None"];
const DEFECT_PRIORITY_DEFAULTS: Record<string, string> = { Low: "Low", Medium: "Normal", High: "High", Critical: "Urgent" };

type TaskRow = (typeof TASK_ROWS)[number];

const taskTotals = TASK_ROWS.reduce(
  (totals, task) => ({
    todo: totals.todo + task.todo,
    actuals: totals.actuals + task.actuals,
    estimate: totals.estimate + task.estimate,
  }),
  { todo: 0, actuals: 0, estimate: 0 },
);

const TASK_GRID_COLUMNS = "44px 72px 110px minmax(320px,1fr) 140px 170px 160px 150px 90px 100px 100px";

const ACTIVITY_ROWS = [
  { id: "ACT-1007", at: "Today, 10:24", actor: OWNERS[0], action: "changed State", target: "US-4821", detail: "Defined → In-Progress" },
  { id: "ACT-1006", at: "Today, 10:18", actor: OWNERS[1], action: "updated Estimate", target: "TA-2292", detail: "3h → 5h" },
  { id: "ACT-1005", at: "Today, 09:42", actor: OWNERS[3], action: "created Task", target: "TA-2293", detail: "Add automated verification" },
  { id: "ACT-1004", at: "Yesterday, 16:40", actor: OWNERS[0], action: "added Attachment", target: "TA-2291", detail: "implementation-outline.md" },
  { id: "ACT-1003", at: "Yesterday, 15:12", actor: OWNERS[1], action: "updated Notes", target: "US-4821", detail: "Added Security review follow-up" },
  { id: "ACT-1002", at: "Oct 21, 2024", actor: OWNERS[0], action: "created Work Item", target: "US-4821", detail: "Implement SSO authentication via SAML 2.0" },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#64748b" }}>{label}</label>{children}</div>;
}

function EditorButton({ label, command, disabled, children }: { label: string; command?: string; disabled?: boolean; children: ReactNode }) {
  return <button type="button" aria-label={label} title={label} disabled={disabled} onMouseDown={event => { event.preventDefault(); if (command && !disabled) document.execCommand(command); }} className="w-7 h-7 flex items-center justify-center rounded-sm disabled:opacity-35" style={{ color: "#475569" }} onMouseEnter={event => (event.currentTarget.style.backgroundColor = "#edf2f7")} onMouseLeave={event => (event.currentTarget.style.backgroundColor = "transparent")}>{children}</button>;
}

function RichTextEditor({ title, initialValue = "", minHeight, readOnly }: { title: string; initialValue?: string; minHeight: number; readOnly: boolean }) {
  return (
    <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
      <div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>{title}</div>
      <div className="flex items-center gap-0.5 px-2 py-1.5 overflow-x-auto" style={{ borderBottom: "1px solid #dde2ea", backgroundColor: "white" }}>
        <EditorButton label={`${title}: Undo`} command="undo" disabled={readOnly}><Undo2 size={14} /></EditorButton>
        <EditorButton label={`${title}: Redo`} command="redo" disabled={readOnly}><Redo2 size={14} /></EditorButton>
        <span className="w-px h-5 mx-1 shrink-0" style={{ backgroundColor: "#d7dde7" }} />
        <select aria-label={`${title}: Text style`} disabled={readOnly} onChange={event => document.execCommand("formatBlock", false, event.target.value)} className="h-7 w-28 px-2 text-[11px] rounded-sm bg-white focus:outline-none" style={{ color: "#334155", border: "1px solid #d7dde7" }}><option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option></select>
        <span className="w-px h-5 mx-1 shrink-0" style={{ backgroundColor: "#d7dde7" }} />
        <EditorButton label={`${title}: Bold`} command="bold" disabled={readOnly}><Bold size={15} /></EditorButton>
        <EditorButton label={`${title}: Italic`} command="italic" disabled={readOnly}><Italic size={15} /></EditorButton>
        <EditorButton label={`${title}: Underline`} command="underline" disabled={readOnly}><Underline size={15} /></EditorButton>
        <EditorButton label={`${title}: Strikethrough`} command="strikeThrough" disabled={readOnly}><Strikethrough size={15} /></EditorButton>
        <span className="w-px h-5 mx-1 shrink-0" style={{ backgroundColor: "#d7dde7" }} />
        <EditorButton label={`${title}: Bulleted list`} command="insertUnorderedList" disabled={readOnly}><List size={15} /></EditorButton>
        <EditorButton label={`${title}: Numbered list`} command="insertOrderedList" disabled={readOnly}><ListOrdered size={15} /></EditorButton>
        <EditorButton label={`${title}: Align left`} command="justifyLeft" disabled={readOnly}><AlignLeft size={15} /></EditorButton>
        <span className="w-px h-5 mx-1 shrink-0" style={{ backgroundColor: "#d7dde7" }} />
        <EditorButton label={`${title}: Insert link`} disabled={readOnly}><Link2 size={15} /></EditorButton>
        <EditorButton label={`${title}: Inline code`} disabled={readOnly}><Code2 size={15} /></EditorButton>
        <EditorButton label={`${title}: Insert table`} disabled={readOnly}><Table2 size={15} /></EditorButton>
        <EditorButton label={`${title}: Insert image`} disabled={readOnly}><ImagePlus size={15} /></EditorButton>
        <EditorButton label={`${title}: Mention user`} disabled={readOnly}><AtSign size={15} /></EditorButton>
        <div className="flex-1 min-w-1" />
        <EditorButton label={`${title}: Expand editor`}><Maximize2 size={15} /></EditorButton>
      </div>
      <div contentEditable={!readOnly} suppressContentEditableWarning className="px-4 py-3 text-[13px] leading-6 focus:outline-none" style={{ minHeight, color: "#334155", backgroundColor: readOnly ? "#f8fafc" : "white" }}>{initialValue}</div>
    </section>
  );
}

function TaskHeaderCell({ label, activeSort }: { label: string; activeSort?: boolean }) {
  return (
    <span className="flex items-center justify-between h-full px-3 text-[12px] font-semibold" style={{ color: "#1f2937", borderRight: "1px dashed #8c99ad" }}>
      <span>{label}</span>
      <span className="text-[17px] leading-none" style={{ color: activeSort ? "#2563eb" : "#1f2937" }}>↕</span>
    </span>
  );
}

function TaskStateBadge({ state }: { state: StatusType }) {
  const colors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    Defined: { bg: "#eef3fb", text: "#2558a6", border: "#bdd0ef", dot: "#2558a6" },
    "In-Progress": { bg: "#fef5e4", text: "#8a5808", border: "#f5d899", dot: "#e59f0c" },
    Completed: { bg: "#eef6f0", text: "#1e6930", border: "#a8d5b3", dot: "#2a8c3f" },
  };
  const c = colors[state] || colors.Defined;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-px text-[11px] font-medium rounded-sm whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.dot }} />
      {state}
    </span>
  );
}

function ActivityLogView() {
  return (
    <div className="w-full space-y-5">
      <div>
        <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Revision History</h2>
        <p className="text-[12px] mt-1" style={{ color: "#64748b" }}>Basic activity log for field changes, task updates, attachments, and work item creation.</p>
      </div>

      <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
        <div className="grid grid-cols-[150px_180px_150px_1fr] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#64748b", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
          <span>Time</span>
          <span>Actor</span>
          <span>Action</span>
          <span>Details</span>
        </div>
        {ACTIVITY_ROWS.map(activity => (
          <div key={activity.id} className="grid grid-cols-[150px_180px_150px_1fr] items-start px-4 py-3 text-[12px]" style={{ borderBottom: "1px solid #edf0f4", color: "#334155" }}>
            <span className="font-mono text-[11px]" style={{ color: "#64748b" }}>{activity.at}</span>
            <span className="flex items-center gap-2 min-w-0"><Avatar owner={activity.actor} size="xs" /><span className="truncate">{activity.actor.name}</span></span>
            <span className="font-semibold" style={{ color: "#273449" }}>{activity.action}</span>
            <span><span className="font-mono text-[11px]" style={{ color: "#2558a6" }}>{activity.target}</span><span className="mx-2" style={{ color: "#94a3b8" }}>·</span>{activity.detail}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

function TaskActivityLogView({ task }: { task: TaskRow }) {
  const rows = [
    { id: "TACT-3004", at: "Today, 10:18", actor: task.owner, action: "updated Actual", target: task.id, detail: `Actual time is now ${task.actuals}h` },
    { id: "TACT-3003", at: "Today, 09:55", actor: OWNERS[1], action: "changed State", target: task.id, detail: "In-Progress → Completed" },
    { id: "TACT-3002", at: "Yesterday, 16:40", actor: OWNERS[0], action: "added Attachment", target: task.id, detail: task.attachments[0] || "No attachment" },
    { id: "TACT-3001", at: "Yesterday, 14:12", actor: OWNERS[0], action: "created Task", target: task.id, detail: task.name },
  ];

  return (
    <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
      <div className="w-full space-y-5">
        <div>
          <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Revision History</h2>
          <p className="text-[12px] mt-1" style={{ color: "#64748b" }}>Basic activity log for task {task.id}.</p>
        </div>
        <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
          <div className="grid grid-cols-[150px_180px_150px_1fr] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#64748b", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
            <span>Time</span>
            <span>Actor</span>
            <span>Action</span>
            <span>Details</span>
          </div>
          {rows.map(activity => (
            <div key={activity.id} className="grid grid-cols-[150px_180px_150px_1fr] items-start px-4 py-3 text-[12px]" style={{ borderBottom: "1px solid #edf0f4", color: "#334155" }}>
              <span className="font-mono text-[11px]" style={{ color: "#64748b" }}>{activity.at}</span>
              <span className="flex items-center gap-2 min-w-0"><Avatar owner={activity.actor} size="xs" /><span className="truncate">{activity.actor.name}</span></span>
              <span className="font-semibold" style={{ color: "#273449" }}>{activity.action}</span>
              <span><span className="font-mono text-[11px]" style={{ color: "#2558a6" }}>{activity.target}</span><span className="mx-2" style={{ color: "#94a3b8" }}>·</span>{activity.detail}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

const fieldClass = "w-full text-[12px] px-3 py-2 rounded bg-white focus:outline-none";
const fieldStyle = { border: "1px solid #d7dde7", color: "#1a2234" };

function AddTaskModal({ defaultOwner, onClose }: { defaultOwner: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [estimate, setEstimate] = useState("");
  const [owner, setOwner] = useState(defaultOwner);
  const canCreate = name.trim().length > 0;

  function submit() {
    if (!canCreate) return;
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(15, 23, 42, .42)" }}>
      <section className="w-full max-w-[520px] rounded bg-white shadow-2xl overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="add-task-title" style={{ border: "1px solid #cbd5e1" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
          <div>
            <h2 id="add-task-title" className="text-[16px] font-semibold" style={{ color: "#1f2937" }}>Create Task</h2>
            <p className="text-[11px] mt-1" style={{ color: "#64748b" }}>Create a child task under this work item.</p>
          </div>
          <button aria-label="Close create task modal" onClick={onClose} className="w-8 h-8 rounded text-[20px] leading-none" style={{ color: "#64748b" }}>×</button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Name *">
            <input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="Enter task name" className={fieldClass} style={fieldStyle} />
            {!canCreate && <p className="mt-1.5 text-[10px]" style={{ color: "#b45309" }}>Name is required.</p>}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Estimate">
              <input value={estimate} onChange={event => setEstimate(event.target.value)} type="number" min={0} placeholder="0" className={fieldClass} style={fieldStyle} />
            </Field>
            <Field label="Owner">
              <select value={owner} onChange={event => setOwner(event.target.value)} className={fieldClass} style={fieldStyle}>
                {OWNERS.map(candidate => <option key={candidate.name}>{candidate.name}</option>)}
              </select>
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4" style={{ backgroundColor: "#f8fafc", borderTop: "1px solid #dde2ea" }}>
          <button onClick={onClose} className="px-4 py-2 rounded text-[12px] font-semibold" style={{ color: "#334155", border: "1px solid #cbd5e1", backgroundColor: "white" }}>Cancel</button>
          <button onClick={submit} disabled={!canCreate} className="px-4 py-2 rounded text-[12px] font-semibold disabled:opacity-45" style={{ color: "#1d3f73", border: "1px solid #9fb4d1", backgroundColor: "#eef3fb" }}>Create</button>
          <button onClick={submit} disabled={!canCreate} className="px-4 py-2 rounded text-[12px] font-semibold text-white disabled:opacity-45" style={{ backgroundColor: "#1d3f73" }}>Create with details</button>
        </div>
      </section>
    </div>
  );
}

function TaskDetailView({ task, parentItem, role, onBack }: { task: TaskRow; parentItem: WorkItem; role: Role; onBack: () => void }) {
  const [activeTaskTab, setActiveTaskTab] = useState<TaskDetailTab>("details");
  const [taskProject, setTaskProject] = useState(task.project);
  const selectedTaskProject = SCOPE_PROJECTS.find(candidate => candidate.key === taskProject) || SCOPE_PROJECTS[0];
  const [taskTeam, setTaskTeam] = useState(selectedTaskProject.teams.includes(task.teams) ? task.teams : selectedTaskProject.teams[0]);

  function changeTaskProject(projectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(candidate => candidate.key === projectKey) || SCOPE_PROJECTS[0];
    setTaskProject(nextProject.key);
    setTaskTeam(nextProject.teams[0]);
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="shrink-0 text-white" style={{ backgroundColor: "#173f78" }}>
        <div className="h-12 px-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,.18)" }}>
          <button aria-label="Back to task list" onClick={onBack} className="p-1.5 rounded hover:bg-white/10"><ChevronLeft size={18} /></button>
          <span className="px-1.5 py-px text-[10px] font-semibold rounded-sm whitespace-nowrap" style={{ backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" }}>Task</span>
          <span className="font-mono text-[13px] font-semibold text-white">{task.id}</span>
          <span className="h-5 w-px bg-white/25" />
          <h1 className="text-[15px] font-semibold truncate">{task.name}</h1>
          <div className="flex-1" />
          <button aria-label="More task actions" className="p-1.5 rounded hover:bg-white/10"><MoreHorizontal size={17} /></button>
        </div>
        <div className="h-16 px-5 flex items-stretch gap-2">
          <button onClick={() => setActiveTaskTab("details")} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTaskTab === "details" ? "#2f6fc5" : "transparent", color: activeTaskTab === "details" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center"><FileText size={18} /></span><span>Details</span></button>
          <button onClick={() => setActiveTaskTab("history")} className="w-32 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTaskTab === "history" ? "#2f6fc5" : "transparent", color: activeTaskTab === "history" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center"><History size={19} /></span><span>Revision History</span></button>
        </div>
      </div>

      {activeTaskTab === "history" ? (
        <TaskActivityLogView task={task} />
      ) : (
    <div className="flex flex-1 min-h-0 gap-2" style={{ backgroundColor: "#e7ebf0" }}>
      <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
        <div className="w-full space-y-5">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-sm text-[10px] font-semibold" style={{ color: "#475569", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" }}>Task</span>
            <span className="font-mono text-[13px] font-semibold" style={{ color: "#2558a6" }}>{task.id}</span>
            <h2 className="text-[20px] font-semibold truncate" style={{ color: "#273449" }}>{task.name}</h2>
          </div>

          <RichTextEditor title="Description" initialValue={task.description} minHeight={250} readOnly={role === "Viewer"} />
          <RichTextEditor title="Notes" initialValue={task.notes} minHeight={220} readOnly={role === "Viewer"} />
          <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
            <div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>Attachments</div>
            <div className="p-3 space-y-2">
              {task.attachments.length > 0 ? task.attachments.map(fileName => <div key={fileName} className="flex items-center justify-between px-3 py-2 rounded text-[12px]" style={{ border: "1px solid #e2e8f0", color: "#334155", backgroundColor: "#fbfdff" }}><span>{fileName}</span><span className="text-[10px]" style={{ color: "#64748b" }}>Attached to task</span></div>) : <p className="text-[12px]" style={{ color: "#64748b" }}>No attachments yet.</p>}
              <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] rounded text-left" style={{ width: "100%", color: "#2563c5", border: "1px solid #b9c9df", backgroundColor: "#fbfdff" }}><Plus size={15} />Drag or click to add attachments</button>
            </div>
          </section>
        </div>
      </main>

      <aside className="w-[340px] shrink-0 overflow-y-scroll p-5 space-y-4 bg-white" style={{ borderLeft: "1px solid #d7dde7", scrollbarGutter: "stable" }}>
        <Field label="State"><select className={fieldClass} style={fieldStyle} defaultValue={task.state}>{["Defined", "In-Progress", "Completed"].map(state => <option key={state}>{state}</option>)}</select></Field>
        <Field label="Owner"><select className={fieldClass} style={fieldStyle} defaultValue={task.owner.name}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field>
        <Field label="Project"><select aria-label="Task project" value={taskProject} onChange={event => changeTaskProject(event.target.value)} className={fieldClass} style={fieldStyle}>{SCOPE_PROJECTS.map(scopeProject => <option key={scopeProject.key} value={scopeProject.key}>{scopeProject.key} · {scopeProject.name}</option>)}</select></Field>
        <Field label="Team"><select aria-label="Task team" value={taskTeam} onChange={event => setTaskTeam(event.target.value)} className={fieldClass} style={fieldStyle}>{selectedTaskProject.teams.map(scopeTeam => <option key={scopeTeam}>{scopeTeam}</option>)}</select></Field>
        <Field label="Work Product"><select className={fieldClass} style={fieldStyle} defaultValue={parentItem.id}><option value={parentItem.id}>{parentItem.id} · {parentItem.title}</option><option value="unscheduled">Unassigned</option></select></Field>
        <Field label="Estimate"><input className={fieldClass} style={fieldStyle} type="number" min={0} defaultValue={task.estimate} /></Field>
        <Field label="To Do"><input className={fieldClass} style={fieldStyle} type="number" min={0} defaultValue={task.todo} /></Field>
        <Field label="Actual"><input className={fieldClass} style={fieldStyle} type="number" min={0} defaultValue={task.actuals} /></Field>
      </aside>
    </div>
      )}
    </div>
  );
}

export function WorkItemDetailPage({ item, role, project, team: initialTeam, onBack, onMinimize }: { item: WorkItem; role: Role; project: ScopeProject; team: string; onBack: () => void; onMinimize?: (item: WorkItem) => void }) {
  const [activeTab, setActiveTab] = useState<DetailTab>("details");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);
  const [selectedProjectKey, setSelectedProjectKey] = useState(item.project || project.key);
  const selectedProject = SCOPE_PROJECTS.find(candidate => candidate.key === selectedProjectKey) || project;
  const [team, setTeam] = useState(selectedProject.teams.includes(initialTeam) ? initialTeam : selectedProject.teams[0]);

  function changeProject(projectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(candidate => candidate.key === projectKey) || project;
    setSelectedProjectKey(nextProject.key);
    setTeam(nextProject.teams[0]);
  }

  if (selectedTask) {
    return <TaskDetailView task={selectedTask} parentItem={item} role={role} onBack={() => setSelectedTask(null)} />;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="shrink-0 text-white" style={{ backgroundColor: "#173f78" }}>
        <div className="h-12 px-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,.18)" }}>
          <button aria-label="Back to backlog" onClick={onBack} className="p-1.5 rounded hover:bg-white/10"><ChevronLeft size={18} /></button>
          <TypeBadge type={item.type} />
          <span className="font-mono text-[13px] font-semibold text-white">{item.id}</span>
          <span className="h-5 w-px bg-white/25" />
          <h1 className="text-[15px] font-semibold truncate">{item.title}</h1>
          <div className="flex-1" />
          <button aria-label="Collapse work item to summary panel" title="Collapse to summary" onClick={() => onMinimize ? onMinimize(item) : onBack()} className="p-1.5 rounded hover:bg-white/10"><Minimize2 size={17} /></button>
          <button aria-label="More work item actions" className="p-1.5 rounded hover:bg-white/10"><MoreHorizontal size={17} /></button>
        </div>
        <div className="h-16 px-5 flex items-stretch gap-2">
          <button onClick={() => { setSelectedTask(null); setActiveTab("details"); }} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "details" ? "#2f6fc5" : "transparent", color: activeTab === "details" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center"><FileText size={18} /></span><span>Details</span></button>
          <button onClick={() => { setSelectedTask(null); setActiveTab("tasks"); }} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "tasks" ? "#2f6fc5" : "transparent", color: activeTab === "tasks" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center gap-1.5"><ListChecks size={19} /><span className="text-[10px] font-semibold tabular-nums">{item.taskCount}</span></span><span>Tasks</span></button>
          <button onClick={() => { setSelectedTask(null); setActiveTab("history"); }} className="w-32 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "history" ? "#2f6fc5" : "transparent", color: activeTab === "history" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center"><History size={19} /></span><span>Revision History</span></button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 gap-2" style={{ backgroundColor: "#e7ebf0" }}>
        <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
          {activeTab === "details" ? (
            <div className="w-full space-y-5">
              <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Details</h2>
              <RichTextEditor title="Description" initialValue={item.description} minHeight={250} readOnly={role === "Viewer"} />
              <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
                <div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>Attachments</div>
                <button className="m-3 flex items-center gap-1.5 px-3 py-2 text-[12px] rounded text-left" style={{ width: "calc(100% - 24px)", color: "#2563c5", border: "1px solid #b9c9df", backgroundColor: "#fbfdff" }}><Plus size={15} />Drag or click to add attachments</button>
              </section>
              <RichTextEditor title="Notes" minHeight={220} readOnly={role === "Viewer"} />
              <RichTextEditor title="Release Notes (Technical Writer Content)" minHeight={160} readOnly={role === "Viewer"} />
            </div>
          ) : activeTab === "history" ? (
            <ActivityLogView />
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4"><div><h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Tasks</h2><p className="text-[11px] mt-1" style={{ color: "#64748b" }}>Break this work item into trackable delivery tasks.</p></div><button onClick={() => setIsAddTaskOpen(true)} disabled={role === "Viewer"} className="flex items-center gap-1.5 px-3 py-2 rounded text-[11px] font-semibold text-white disabled:opacity-45" style={{ backgroundColor: "#1d3f73" }}><Plus size={13} />Add Task</button></div>
              <div className="bg-white rounded overflow-x-auto" style={{ border: "1px solid #dde2ea" }}>
                <div className="min-w-[1450px]">
                  <div className="grid h-10 items-center" style={{ gridTemplateColumns: TASK_GRID_COLUMNS, backgroundColor: "white", borderBottom: "2px solid #9fb4d1" }}>
                    <div className="flex items-center justify-center h-full" style={{ borderRight: "1px dashed #8c99ad" }}><input type="checkbox" aria-label="Select all tasks" className="w-4 h-4 rounded" /></div>
                    <TaskHeaderCell label="Rank" />
                    <TaskHeaderCell label="ID" />
                    <TaskHeaderCell label="Name" />
                    <TaskHeaderCell label="State" />
                    <TaskHeaderCell label="Owner" activeSort />
                    <TaskHeaderCell label="Project" />
                    <TaskHeaderCell label="Teams" />
                    <TaskHeaderCell label="To Do" />
                    <TaskHeaderCell label="Actuals" />
                    <span className="flex items-center h-full px-3 text-[12px] font-semibold" style={{ color: "#1f2937" }}>Estimate</span>
                  </div>

                  <div className="grid h-8 items-center text-[12px] font-semibold" style={{ gridTemplateColumns: TASK_GRID_COLUMNS, backgroundColor: "#f3f6fa", borderBottom: "1px solid #d7dde7", color: "#1f2937" }}>
                    <span />
                    <span className="px-3">Totals</span>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span className="px-3 text-right font-mono">{taskTotals.todo} Hours</span>
                    <span className="px-3 text-right font-mono">{taskTotals.actuals} Hours</span>
                    <span className="px-3 text-right font-mono">{taskTotals.estimate} Hours</span>
                  </div>

                  {TASK_ROWS.map(task => (
                    <div key={task.id} className="grid min-h-11 items-center text-[12px]" style={{ gridTemplateColumns: TASK_GRID_COLUMNS, borderBottom: "1px solid #edf0f4", color: "#334155" }}>
                      <div className="flex items-center justify-center"><input type="checkbox" aria-label={`Select task ${task.id}`} className="w-4 h-4 rounded" /></div>
                      <span className="px-3 font-mono text-[11px]" style={{ color: "#64748b" }}>{task.rank}</span>
                      <button onClick={() => setSelectedTask(task)} className="px-3 text-left font-mono text-[11px] underline-offset-2 hover:underline" style={{ color: "#2558a6" }}>{task.id}</button>
                      <span className="px-3 font-medium truncate" style={{ color: "#273449" }}>{task.name}</span>
                      <span className="px-3"><TaskStateBadge state={task.state} /></span>
                      <span className="px-3 flex items-center gap-2 min-w-0"><Avatar owner={task.owner} size="xs" /><span className="truncate">{task.owner.name}</span></span>
                      <span className="px-3 truncate">{task.project}</span>
                      <span className="px-3 truncate">{task.teams}</span>
                      <span className="px-3 text-right font-mono">{task.todo}h</span>
                      <span className="px-3 text-right font-mono">{task.actuals}h</span>
                      <span className="px-3 text-right font-mono">{task.estimate}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {activeTab === "details" && (
        <aside className="w-[340px] shrink-0 overflow-y-scroll p-5 space-y-4 bg-white" style={{ borderLeft: "1px solid #d7dde7", scrollbarGutter: "stable" }}>
          <Field label="Owner"><select className={fieldClass} style={fieldStyle} defaultValue={item.owner.name}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field>
          <Field label="Project"><select aria-label="Detail project" value={selectedProjectKey} onChange={event => changeProject(event.target.value)} className={fieldClass} style={fieldStyle}>{SCOPE_PROJECTS.map(scopeProject => <option key={scopeProject.key} value={scopeProject.key}>{scopeProject.key} · {scopeProject.name}</option>)}</select></Field>
          <Field label="Team"><select aria-label="Detail team" value={team} onChange={event => setTeam(event.target.value)} className={fieldClass} style={fieldStyle}>{selectedProject.teams.map(scopeTeam => <option key={scopeTeam}>{scopeTeam}</option>)}</select></Field>
          <Field label="Schedule State"><select className={fieldClass} style={fieldStyle} defaultValue={WORK_ITEM_STATE_OPTIONS.includes(item.status) ? item.status : "Defined"}>{WORK_ITEM_STATE_OPTIONS.map(status => <option key={status}>{status}</option>)}</select></Field>
          <Field label="Flow State"><select className={fieldClass} style={fieldStyle} defaultValue={WORK_ITEM_STATE_OPTIONS.includes(item.status) ? item.status : "In-Progress"}>{WORK_ITEM_STATE_OPTIONS.map(status => <option key={status}>{status}</option>)}</select></Field>
          {item.type === "Defect" && <Field label="Priority"><select className={fieldClass} style={fieldStyle} defaultValue={DEFECT_PRIORITY_DEFAULTS[item.priority] ?? "None"}>{DEFECT_PRIORITY_OPTIONS.map(priority => <option key={priority}>{priority}</option>)}</select></Field>}
          <Field label="Plan Estimate"><input className={fieldClass} style={fieldStyle} type="number" min={0} defaultValue={item.planEstimate} /></Field>
          <Field label="Release"><select className={fieldClass} style={fieldStyle} defaultValue={item.release}>{[item.release, "Q1 2025", "Q2 2025", "Unscheduled"].filter((value, index, values) => values.indexOf(value) === index).map(release => <option key={release}>{release}</option>)}</select></Field>
          <Field label="Iteration"><select className={fieldClass} style={fieldStyle} defaultValue={item.iteration}>{[item.iteration, "Sprint 24.4", "Sprint 25.1", "Unscheduled"].filter((value, index, values) => values.indexOf(value) === index).map(iteration => <option key={iteration}>{iteration}</option>)}</select></Field>
        </aside>
        )}
      </div>
      {isAddTaskOpen && <AddTaskModal defaultOwner={item.owner.name} onClose={() => setIsAddTaskOpen(false)} />}
    </div>
  );
}
