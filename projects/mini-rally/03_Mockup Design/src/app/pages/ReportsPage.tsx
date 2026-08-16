import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Download } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type IterationItem,
  type Role,
  type TaskItem,
  type WorkItem,
  ITERATION_DAILY_SNAPSHOTS,
  VELOCITY_DATA,
} from "../model";

export function Widget({ title, span = 1, children }: { title: string; span?: number; children: React.ReactNode }) {
  return (
    <div className="rounded bg-white p-4" style={{ border: "1px solid #e2e6eb", gridColumn: `span ${span}` }}>
      <p className="mb-3 text-[11px] font-semibold" style={{ color: "#1a2234" }}>{title}</p>
      {children}
    </div>
  );
}

const TEAM_CAPACITY_DATA = [
  { projectKey: "NXP", team: "Core Platform", member: "Marcus Webb", capacity: 96 },
  { projectKey: "NXP", team: "Core Platform", member: "Sarah Chen", capacity: 82 },
  { projectKey: "NXP", team: "Identity & Access", member: "Marcus Webb", capacity: 60 },
  { projectKey: "NXP", team: "Data & Reporting", member: "Priya Nair", capacity: 72 },
];

function dateInputValue(value: string) {
  const match = value.match(/\d{4}-\d{2}-\d{2}/);
  return match?.[0] ?? value;
}

function shortDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : `${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
}

function daysBetween(start: string, end: string) {
  const startDate = new Date(dateInputValue(start));
  const endDate = new Date(dateInputValue(end));
  const days = Math.round((endDate.getTime() - startDate.getTime()) / 86400000);
  return Math.max(1, days);
}

function buildFallbackSnapshots(iteration: IterationItem, totalEstimateAtStart: number) {
  const start = new Date(dateInputValue(iteration.startDate));
  const end = new Date(dateInputValue(iteration.endDate));
  const count = Math.max(2, Math.min(11, Math.round((end.getTime() - start.getTime()) / 86400000) + 1));
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start.getTime() + ((end.getTime() - start.getTime()) * index) / (count - 1));
    return {
      iterationId: iteration.id,
      date: date.toISOString().slice(0, 10),
      remainingToDo: Math.max(0, Math.round(totalEstimateAtStart * (1 - index / (count - 1)))),
      acceptedPoints: Math.round((iteration.acceptedPoints * index) / (count - 1)),
    };
  });
}

function IterationBurndown({ projectKey, team, iterations, items, tasks, selectedIterationId, onIterationChange }: { projectKey: string; team: string; iterations: IterationItem[]; items: WorkItem[]; tasks: TaskItem[]; selectedIterationId: string; onIterationChange: (iterationId: string) => void }) {
  const availableIterations = useMemo(() => iterations.filter(iteration => iteration.projectKey === projectKey && (team === "All Teams" || iteration.team === team)), [iterations, projectKey, team]);
  const defaultIteration = availableIterations.find(iteration => iteration.name === "Sprint 24.3") ?? availableIterations[0];
  const selectedIteration = availableIterations.find(iteration => iteration.id === selectedIterationId) ?? defaultIteration;

  if (!selectedIteration) return <div className="p-4 text-[11px] text-[#6f7787]">No Iteration available.</div>;

  const selectedItems = items.filter(item => item.project === projectKey && (team === "All Teams" || item.team === team) && item.iteration === selectedIteration.name && (item.type === "Story" || item.type === "Defect"));
  const selectedItemIds = new Set(selectedItems.map(item => item.id));
  const totalEstimateAtStart = selectedIteration.totalTaskEstimateAtStart ?? tasks.filter(task => selectedItemIds.has(task.parentWorkItemId)).reduce((sum, task) => sum + task.estimate, 0);
  const storedSnapshots = ITERATION_DAILY_SNAPSHOTS.filter(snapshot => snapshot.iterationId === selectedIteration.id);
  const snapshots = storedSnapshots.length > 0 ? storedSnapshots : buildFallbackSnapshots(selectedIteration, totalEstimateAtStart);
  const totalDays = daysBetween(selectedIteration.startDate, selectedIteration.endDate);
  const chartData = snapshots.map(snapshot => {
    const elapsedDays = Math.max(0, Math.round((new Date(snapshot.date).getTime() - new Date(dateInputValue(selectedIteration.startDate)).getTime()) / 86400000));
    const ideal = Math.max(0, totalEstimateAtStart * (1 - elapsedDays / totalDays));
    return { ...snapshot, label: shortDate(snapshot.date), ideal: Number(ideal.toFixed(1)) };
  });
  const latest = chartData[chartData.length - 1];
  const behindPlan = latest.remainingToDo > latest.ideal;
  const iterationIndex = availableIterations.findIndex(iteration => iteration.id === selectedIteration.id);

  return (
    <Widget title="Iteration Burndown" span={3}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-[11px] font-semibold" style={{ color: "#1a2234" }}>Iteration</span>
        <div className="flex h-8 overflow-hidden rounded" style={{ border: "1px solid #cbd5e1" }}>
          <button aria-label="Previous iteration" disabled={iterationIndex <= 0} onClick={() => onIterationChange(availableIterations[iterationIndex - 1]?.id ?? selectedIteration.id)} className="flex w-8 items-center justify-center disabled:opacity-30" style={{ borderRight: "1px solid #dce2ea", color: "#2f6fd6" }}><ChevronLeft size={15} /></button>
          <select aria-label="Iteration burndown iteration" value={selectedIteration.id} onChange={event => onIterationChange(event.target.value)} className="min-w-48 bg-white px-2.5 text-[11px] outline-none">
            {availableIterations.map(iteration => <option key={iteration.id} value={iteration.id}>{iteration.name}</option>)}
          </select>
          <span className="hidden items-center border-l border-[#dce2ea] px-3 text-[10px] text-[#657084] md:flex">{dateInputValue(selectedIteration.startDate)} - {dateInputValue(selectedIteration.endDate)}</span>
          <button aria-label="Next iteration" disabled={iterationIndex >= availableIterations.length - 1} onClick={() => onIterationChange(availableIterations[iterationIndex + 1]?.id ?? selectedIteration.id)} className="flex w-8 items-center justify-center border-l border-[#dce2ea] disabled:opacity-30" style={{ color: "#2f6fd6" }}><ChevronRight size={15} /></button>
        </div>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold" style={{ color: behindPlan ? "#b91c1c" : "#2f7d45" }}>
          {behindPlan ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
          {behindPlan ? "Behind plan" : "On track"}
        </span>
      </div>
      <div className="mb-3 text-center text-[13px] font-semibold" style={{ color: "#1a2234" }}>{selectedIteration.project} - {team}</div>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 12, right: 16, left: 4, bottom: 12 }}>
            <CartesianGrid stroke="#dfe5ec" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#5f6b7c" }} label={{ value: "Date", position: "insideBottom", offset: -4, style: { fontSize: 10, fill: "#5f6b7c" } }} />
            <YAxis yAxisId="hours" tick={{ fontSize: 10, fill: "#5f6b7c" }} label={{ value: "Task To Do (Hours)", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#5f6b7c" } }} />
            <YAxis yAxisId="points" orientation="right" tick={{ fontSize: 10, fill: "#5f6b7c" }} label={{ value: "Accepted (Points)", angle: 90, position: "insideRight", style: { fontSize: 10, fill: "#5f6b7c" } }} />
            <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e2e6eb", borderRadius: 3 }} />
            <Bar yAxisId="hours" dataKey="remainingToDo" name="Task To Do (Hours)" fill="#176f84" barSize={34} />
            <Line yAxisId="hours" type="linear" dataKey="ideal" name="Ideal" stroke="#566274" strokeWidth={2.5} dot={{ r: 3, fill: "#566274" }} />
            <Bar yAxisId="points" dataKey="acceptedPoints" name="Accepted (Points)" fill="#5dbb4f" barSize={18} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded bg-[#f7f9fb] px-3 py-2.5 text-[10px]" style={{ border: "1px solid #e5eaf0", color: "#4f5d70" }}>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#176f84" }} />Task To Do (Hours)</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4" style={{ backgroundColor: "#566274" }} />Ideal</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#5dbb4f" }} />Accepted (Points)</span>
      </div>
    </Widget>
  );
}

function average(values: number[]) {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function VelocityChart({ projectKey, team }: { projectKey: string; team: string }) {
  const [velocityWindow, setVelocityWindow] = useState<5 | 10>(() => window.localStorage.getItem("mini-rally.velocity-window") === "5" ? 5 : 10);
  useEffect(() => {
    window.localStorage.setItem("mini-rally.velocity-window", String(velocityWindow));
  }, [velocityWindow]);
  const completedIterations = useMemo(() => VELOCITY_DATA
    .filter(iteration => iteration.projectKey === projectKey && (team === "All Teams" || iteration.team === team) && iteration.hasScheduledItems && new Date(`${iteration.endDate}T23:59:59`).getTime() < Date.now())
    .sort((left, right) => left.endDate.localeCompare(right.endDate)), [projectKey, team]);
  const chartIterations = completedIterations.slice(-velocityWindow);
  const duringValues = chartIterations.map(iteration => iteration.acceptedDuring);
  const last3 = average(duringValues.slice(-3));
  const best3 = average([...duringValues].sort((left, right) => right - left).slice(0, 3));
  const worst3 = average([...duringValues].sort((left, right) => left - right).slice(0, 3));
  const trend = average(duringValues);
  const chartData = chartIterations.map(iteration => ({ ...iteration, trend }));

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold text-[#5c6478]">Team: {team}</p>
        <label className="flex items-center gap-2 text-[10px] font-semibold text-[#6f7787]" htmlFor="velocity-window-filter">
          Window
          <select id="velocity-window-filter" aria-label="Velocity chart window" value={velocityWindow} onChange={event => setVelocityWindow(Number(event.target.value) as 5 | 10)} className="h-7 rounded bg-white px-2 text-[11px] font-normal text-[#1a2234] outline-none" style={{ border: "1px solid #cbd5e1" }}>
            <option value={5}>Last 5 sprints</option>
            <option value={10}>Last 10 sprints</option>
          </select>
        </label>
      </div>
      <div className="mx-auto mb-3 max-w-[560px] rounded border border-[#dce5e0] bg-[#f8fbf9] px-2.5 py-1.5">
        <p className="mb-1 text-center text-[9px] font-semibold text-[#405447]">Averages over Last {velocityWindow} Iterations</p>
        <div className="grid grid-cols-3 gap-2">
          {[{ label: "Last 3", value: last3 }, { label: "Best 3", value: best3 }, { label: "Worst 3", value: worst3 }].map(metric => (
            <div key={metric.label} className="rounded bg-white px-2 py-1 text-center" style={{ border: "1px solid #e2ebe4" }}>
              <div className="text-[9px] text-[#6f7787]">{metric.label}</div>
              <div className="mt-0.5 text-[13px] font-semibold text-[#2f7d45]">{metric.value.toFixed(2)} <span className="text-[9px] font-normal">Points</span></div>
            </div>
          ))}
        </div>
      </div>
      {chartData.length > 0 ? <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 18, left: 8, bottom: 14 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#edf0f2" vertical={false} />
          <XAxis dataKey="sprint" tick={{ fontSize: 10, fill: "#6f7787" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#6f7787" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} label={{ value: "Velocity (Points)", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#5c6478" } }} />
          <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #dce5e0", borderRadius: 3 }} />
          <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
          <Bar dataKey="acceptedDuring" stackId="velocity" name="Accepted During Iteration" fill="#3d8c56" barSize={52} />
          <Bar dataKey="acceptedAfter" stackId="velocity" name="Accepted After Iteration" fill="#83bd91" barSize={52} />
          <Bar dataKey="notAccepted" stackId="velocity" name="Not Accepted" fill="#ef6a67" barSize={52} radius={[2, 2, 0, 0]} />
          <Line type="monotone" dataKey="trend" name={`Trend: ${trend.toFixed(2)}`} stroke="#247344" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer> : <div className="flex h-[400px] items-center justify-center text-[11px] text-[#6f7787]">No completed iteration data for this project/team scope.</div>}
    </>
  );
}

type CapacityMemberRow = { member: string; capacity: number; estimate: number; todo: number; actuals: number };
type CapacityTeamRow = { team: string; capacity: number; estimate: number; todo: number; actuals: number; members: CapacityMemberRow[] };
type ReportView = "burndown" | "velocity" | "capacity";

function TeamCapacity({ projectKey, team, iterations, selectedIteration, items, tasks, onIterationChange }: { projectKey: string; team: string; iterations: IterationItem[]; selectedIteration?: IterationItem; items: WorkItem[]; tasks: TaskItem[]; onIterationChange: (iterationId: string) => void }) {
  const [collapsedTeams, setCollapsedTeams] = useState<Set<string>>(new Set());
  const parentById = useMemo(() => new Map(items.map(item => [item.id, item])), [items]);
  const teamRows = useMemo<CapacityTeamRow[]>(() => {
    const baseRows = TEAM_CAPACITY_DATA.filter(row => row.projectKey === projectKey && (team === "All Teams" || row.team === team));
    const scopedTasks = selectedIteration ? tasks.filter(task => {
      const parent = parentById.get(task.parentWorkItemId);
      return parent?.project === projectKey && parent.iteration === selectedIteration.name && (team === "All Teams" || task.team === team);
    }) : [];
    const byTeam = new Map<string, CapacityTeamRow>();
    baseRows.forEach(row => {
      const memberTasks = scopedTasks.filter(task => task.team === row.team && task.owner.name === row.member);
      const member = {
        member: row.member,
        capacity: row.capacity,
        estimate: memberTasks.reduce((sum, task) => sum + task.estimate, 0),
        todo: memberTasks.reduce((sum, task) => sum + task.todo, 0),
        actuals: memberTasks.reduce((sum, task) => sum + task.actuals, 0),
      };
      const existing = byTeam.get(row.team);
      byTeam.set(row.team, existing ? { ...existing, capacity: existing.capacity + member.capacity, estimate: existing.estimate + member.estimate, todo: existing.todo + member.todo, actuals: existing.actuals + member.actuals, members: [...existing.members, member] } : { team: row.team, capacity: member.capacity, estimate: member.estimate, todo: member.todo, actuals: member.actuals, members: [member] });
    });
    return [...byTeam.values()];
  }, [parentById, projectKey, selectedIteration, tasks, team]);
  const totals = teamRows.reduce((sum, row) => ({ capacity: sum.capacity + row.capacity, estimate: sum.estimate + row.estimate, todo: sum.todo + row.todo, actuals: sum.actuals + row.actuals }), { capacity: 0, estimate: 0, todo: 0, actuals: 0 });
  const columns = "minmax(220px, 1fr) 110px 110px 110px 110px";
  const selectedIterationIndex = iterations.findIndex(iteration => iteration.id === selectedIteration?.id);

  function toggleTeam(teamName: string) {
    setCollapsedTeams(previous => {
      const next = new Set(previous);
      next.has(teamName) ? next.delete(teamName) : next.add(teamName);
      return next;
    });
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between text-[10px] text-[#6f7787]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1a2234]">Iteration</span>
          <div className="flex h-7 overflow-hidden rounded bg-white" style={{ border: "1px solid #bdd0ef" }}>
            <button aria-label="Previous capacity iteration" disabled={selectedIterationIndex <= 0} onClick={() => onIterationChange(iterations[selectedIterationIndex - 1]?.id ?? selectedIteration?.id ?? "")} className="flex w-7 items-center justify-center border-r border-[#dce2ea] text-[#2558a6] disabled:opacity-30"><ChevronLeft size={13} /></button>
            <select aria-label="Team capacity iteration" value={selectedIteration?.id ?? ""} onChange={event => onIterationChange(event.target.value)} className="min-w-40 bg-white px-2 text-[10px] font-semibold text-[#1a2234] outline-none">
              {iterations.map(iteration => <option key={iteration.id} value={iteration.id}>{iteration.name}</option>)}
            </select>
            <span className="hidden items-center border-l border-[#dce2ea] px-2 text-[9px] text-[#657084] md:flex">{selectedIteration ? `${dateInputValue(selectedIteration.startDate)} - ${dateInputValue(selectedIteration.endDate)}` : ""}</span>
            <button aria-label="Next capacity iteration" disabled={selectedIterationIndex < 0 || selectedIterationIndex >= iterations.length - 1} onClick={() => onIterationChange(iterations[selectedIterationIndex + 1]?.id ?? selectedIteration?.id ?? "")} className="flex w-7 items-center justify-center border-l border-[#dce2ea] text-[#2558a6] disabled:opacity-30"><ChevronRight size={13} /></button>
          </div>
        </div>
        <span>Team Status hours</span>
      </div>
      <div className="mb-4 grid grid-cols-4 gap-3">
        {[{ label: "Capacity", value: totals.capacity }, { label: "Estimate", value: totals.estimate }, { label: "ToDo", value: totals.todo }, { label: "Actual", value: totals.actuals }].map(metric => (
          <div key={metric.label} className="rounded bg-[#f7f9fb] px-3 py-2" style={{ border: "1px solid #e5eaf0" }}><div className="text-[10px] text-[#6f7787]">{metric.label} Hours</div><div className="mt-1 text-xl font-semibold text-[#1d3f73]">{metric.value}h</div></div>
        ))}
      </div>
      <div className="overflow-hidden rounded" style={{ border: "1px solid #dce2ea" }}>
        <div className="grid h-8 items-center bg-[#f7f8fa] text-[10px] font-semibold text-[#6f7787]" style={{ gridTemplateColumns: columns }}>
          <span className="px-3">Team / Member</span><span className="px-3 text-right">Capacity</span><span className="px-3 text-right">Estimate</span><span className="px-3 text-right">ToDo</span><span className="px-3 text-right">Actual</span>
        </div>
        {teamRows.length > 0 ? teamRows.map(row => {
          const collapsed = collapsedTeams.has(row.team);
          return <div key={row.team}>
            <div className="grid h-9 items-center bg-[#e9edf3] text-[11px] font-semibold text-[#273449]" style={{ gridTemplateColumns: columns, borderTop: "1px solid #d5dbe5" }}>
              <button onClick={() => toggleTeam(row.team)} className="flex items-center gap-1 px-3 text-left font-semibold"><span className="flex h-5 w-5 items-center justify-center text-[#2563eb]">{collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}</span>{row.team}</button>
              <span className="px-3 text-right">{row.capacity}h</span><span className="px-3 text-right">{row.estimate}h</span><span className="px-3 text-right">{row.todo}h</span><span className="px-3 text-right">{row.actuals}h</span>
            </div>
            {!collapsed && row.members.map(member => <div key={`${row.team}-${member.member}`} className="grid h-8 items-center text-[11px] text-[#5c6478]" style={{ gridTemplateColumns: columns, borderTop: "1px solid #edf0f4" }}><span className="pl-12">{member.member}</span><span className="px-3 text-right">{member.capacity}h</span><span className="px-3 text-right">{member.estimate}h</span><span className="px-3 text-right">{member.todo}h</span><span className="px-3 text-right">{member.actuals}h</span></div>)}
          </div>;
        }) : <div className="px-3 py-5 text-center text-[11px] text-[#6f7787]">No capacity data for this project/team scope.</div>}
      </div>
    </>
  );
}

export function ReportsPage({ role, readOnly = false, projectKey, team = "All Teams", iterations, items, tasks }: { role: Role; readOnly?: boolean; projectKey: string; team?: string; iterations: IterationItem[]; items: WorkItem[]; tasks: TaskItem[] }) {
  const canExport = !readOnly && role !== "Editor";
  const [selectedReport, setSelectedReport] = useState<ReportView>("burndown");
  const availableIterations = useMemo(() => iterations.filter(iteration => iteration.projectKey === projectKey && (team === "All Teams" || iteration.team === team)), [iterations, projectKey, team]);
  const [selectedIterationId, setSelectedIterationId] = useState("IT-24-3");
  const selectedIteration = availableIterations.find(iteration => iteration.id === selectedIterationId) ?? availableIterations.find(iteration => iteration.name === "Sprint 24.3") ?? availableIterations[0];
  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: "#f0f2f5" }}>
      <div className="flex shrink-0 items-center justify-between border-b border-[#e2e6eb] bg-white px-6 py-3">
        <div className="flex items-center gap-5">
          <h2 className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>Reports</h2>
          <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#6f7787]" htmlFor="reports-view-picker">
            Type
            <select id="reports-view-picker" aria-label="Reports view" value={selectedReport} onChange={event => setSelectedReport(event.target.value as ReportView)} className="h-8 rounded bg-white px-2 text-[11px] font-normal normal-case tracking-normal outline-none" style={{ border: "1px solid #cbd5e1", color: "#1a2234" }}>
              <option value="burndown">Iteration Burndown</option>
              <option value="velocity">Velocity</option>
              <option value="capacity">Team Capacity</option>
            </select>
          </label>
        </div>
        {canExport && <button className="flex items-center gap-1.5 rounded px-3 py-1.5 text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}><Download size={12} /> Export Report</button>}
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        {selectedReport === "burndown" && <IterationBurndown projectKey={projectKey} team={team} iterations={iterations} items={items} tasks={tasks} selectedIterationId={selectedIteration?.id ?? ""} onIterationChange={setSelectedIterationId} />}
        {selectedReport === "velocity" && <Widget title="Velocity - Accepted Iterations" span={3}><VelocityChart projectKey={projectKey} team={team} /></Widget>}
        {selectedReport === "capacity" && <Widget title={`Team Capacity - ${team}`} span={3}><TeamCapacity projectKey={projectKey} team={team} iterations={availableIterations} selectedIteration={selectedIteration} items={items} tasks={tasks} onIterationChange={setSelectedIterationId} /></Widget>}
      </div>
    </div>
  );
}
