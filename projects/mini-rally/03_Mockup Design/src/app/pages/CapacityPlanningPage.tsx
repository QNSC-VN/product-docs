import { useMemo, useState } from "react";
import {
  AlertTriangle, ArrowDownUp, ArrowLeft, BarChart2, Calculator, Check, ChevronDown,
  ChevronRight, CircleAlert, Filter, Layers, MoreHorizontal, Plus, Search, Send,
  Split, Users, X,
} from "lucide-react";
import {
  type CapacityPlan, type CapacityPlanAllocation, type Feature, type NewCapacityPlanInput,
  type ReleaseItem, type Role, type ScopeProject, type WorkItem, ROLE_SCOPE,
} from "../model";
import { EmptyState, TypeBadge } from "../components/shared";

type UnitMode = CapacityPlan["viewBy"];

function canManageCapacityPlan(role: Role, projectKey: string) {
  if (role === "Workspace Admin") return true;
  if (role === "Project Admin") return ROLE_SCOPE.projectAdminProjectKeys.includes(projectKey as typeof ROLE_SCOPE.projectAdminProjectKeys[number]);
  return false;
}

function newAllocationId() {
  return `CPA-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function getFeatureMetrics(feature: Feature, workItems: WorkItem[], viewBy: UnitMode, team?: string) {
  const children = workItems.filter(item =>
    item.featureId === feature.id &&
    (item.type === "Story" || item.type === "Defect") &&
    (!team || item.team === team)
  );
  const accepted = children.filter(item => item.status === "Accepted" || item.status === "Release");
  const estimated = viewBy === "Count" ? children.length : children.reduce((sum, item) => sum + item.planEstimate, 0);
  const rollup = viewBy === "Count" ? accepted.length : accepted.reduce((sum, item) => sum + item.planEstimate, 0);
  const completePct = estimated <= 0 ? 0 : Math.round((rollup / estimated) * 100);
  return { children, estimated, rollup, completePct };
}

function getPlanFeature(featureId: string, features: Feature[]) {
  return features.find(feature => feature.id === featureId);
}

const TEAM_CAPACITY_GRID = "minmax(260px,1fr) 92px 240px 100px 100px 100px 120px";
const FEATURE_CAPACITY_GRID = "minmax(260px,1fr) 92px 240px 100px 100px 100px";
const FEATURE_IDENTITY_GRID = "44px 74px minmax(180px,1fr) 130px";

function formatCapacityNumber(value: number | undefined) {
  const safeValue = Number.isFinite(value) ? Number(value) : 0;
  return Number.isInteger(safeValue) ? String(safeValue) : safeValue.toFixed(1).replace(/\.0$/, "");
}

function pctOfBase(value: number, base: number) {
  if (base <= 0) return 0;
  return Math.round((value / base) * 100);
}

function floorPct(value: number, base: number) {
  if (base <= 0) return 0;
  return Math.floor((value / base) * 100);
}

function topDownEstimate(feature: Feature, viewBy: UnitMode) {
  const value = viewBy === "Count" ? feature.refinedWorkItemCountEstimate : feature.refinedEstimate;
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function MetricCell({ value, pct }: { value: number; pct: number }) {
  return (
    <div className="text-right tabular-nums whitespace-nowrap">
      <span>{formatCapacityNumber(value)}</span>
      {" "}
      <span className="ml-1 text-[10px]" style={{ color: "#6b5dd3" }}>{pct}%</span>
    </div>
  );
}

type BreakdownItem = { label: string; value: number; pct: number; kind: "complete" | "rollup" | "estimated" | "capacity" };

function CapacityBreakdownTooltip({ items, visible }: { items: BreakdownItem[]; visible: boolean }) {
  return (
    <div className={`pointer-events-none absolute left-1/2 top-full z-30 mt-2 min-w-44 -translate-x-1/2 rounded bg-white p-3 text-[12px] shadow-lg ${visible ? "block" : "hidden group-hover:block"}`} style={{ border: "1px solid #d9dee7", color: "#1a2234" }}>
      <div className="absolute left-1/2 top-[-5px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-white" style={{ borderLeft: "1px solid #d9dee7", borderTop: "1px solid #d9dee7" }} />
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.label} className="grid items-center gap-2" style={{ gridTemplateColumns: "14px 1fr auto auto" }}>
            <span className="h-3.5 w-3.5" style={{
              backgroundColor: item.kind === "complete" ? "#5b8fe6" : item.kind === "rollup" ? "#cfe0ff" : item.kind === "capacity" ? "#dff8e8" : "repeating-linear-gradient(-45deg,#dfe5ee 0,#dfe5ee 3px,#ffffff 3px,#ffffff 6px)",
              border: `1px solid ${item.kind === "capacity" ? "#4fc281" : item.kind === "rollup" ? "#4b82f3" : item.kind === "complete" ? "#1f64c8" : "#b8c2d0"}`,
            }} />
            <span>{item.label}</span>
            <span className="text-right font-semibold">{formatCapacityNumber(item.value)}</span>
            {item.kind === "capacity" ? <span className="text-[10px]" style={{ color: "#b45309" }}>base</span> : <span className="text-[10px]" style={{ color: "#d946ef" }}>{item.pct}%</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ complete, rollup, estimated, capacity, showCapacity = true }: { complete: number; rollup: number; estimated: number; capacity: number; showCapacity?: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const base = showCapacity ? capacity : Math.max(complete, rollup, estimated, capacity, 1);
  const completePct = pctOfBase(complete, base);
  const rollupPct = pctOfBase(rollup, base);
  const estimatedPct = pctOfBase(estimated, base);
  const items: BreakdownItem[] = [
    { label: "Complete", value: complete, pct: completePct, kind: "complete" },
    { label: "Rollup", value: rollup, pct: rollupPct, kind: "rollup" },
    { label: "Estimated", value: estimated, pct: estimatedPct, kind: "estimated" },
    ...(showCapacity ? [{ label: "Capacity", value: capacity, pct: 100, kind: "capacity" as const }] : []),
  ];
  return (
    <div className="group relative flex items-center justify-center" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} onFocus={() => setShowTooltip(true)} onBlur={() => setShowTooltip(false)}>
      <div className="relative h-5 w-full max-w-[220px] overflow-hidden rounded-sm" style={{ backgroundColor: "#f8fafc", border: `1px solid ${showCapacity ? "#57c083" : "#c8d3e0"}` }} aria-label={`Capacity progress complete ${completePct}% rollup ${rollupPct}% estimated ${estimatedPct}%`} tabIndex={0}>
        <div className="absolute inset-y-0 left-0" style={{ width: `${Math.min(100, Math.max(0, estimatedPct))}%`, backgroundImage: "repeating-linear-gradient(-45deg,#dfe5ee 0,#dfe5ee 5px,#ffffff 5px,#ffffff 10px)" }} />
        <div className="absolute inset-y-0 left-0" style={{ width: `${Math.min(100, Math.max(0, rollupPct))}%`, backgroundColor: "#cfe0ff", borderRight: "1px solid #4b82f3" }} />
        <div className="absolute inset-y-0 left-0" style={{ width: `${Math.min(100, Math.max(0, completePct))}%`, backgroundColor: "#5b8fe6", borderRight: completePct > 0 ? "1px solid #1f64c8" : undefined }} />
      </div>
      <CapacityBreakdownTooltip items={items} visible={showTooltip} />
    </div>
  );
}

function CapacityStatusBadge({ status }: { status: CapacityPlan["status"] }) {
  const published = status === "Published";
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-sm" style={{ backgroundColor: published ? "#eef6f0" : "#eef3fb", color: published ? "#1e6930" : "#2558a6", border: `1px solid ${published ? "#a8d5b3" : "#bdd0ef"}` }}>
      {status}
    </span>
  );
}

function NewCapacityPlanModal({ project, releases, plans, onClose, onCreate }: { project: ScopeProject; releases: ReleaseItem[]; plans: CapacityPlan[]; onClose: () => void; onCreate: (input: NewCapacityPlanInput) => CapacityPlan }) {
  const releaseOptions = releases.filter(release => release.projectKey === project.key);
  const [name, setName] = useState("");
  const [releaseId, setReleaseId] = useState(releaseOptions[0]?.id || "");
  const [viewBy, setViewBy] = useState<UnitMode>("Points");
  const duplicate = plans.some(plan => plan.projectKey === project.key && plan.releaseId === releaseId);
  const canCreate = name.trim().length > 0 && Boolean(releaseId) && !duplicate;
  function submit() {
    if (!canCreate) return;
    onCreate({ name: name.trim(), projectKey: project.key, releaseId, viewBy });
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-[560px] max-h-[86vh] overflow-hidden rounded bg-white shadow-2xl flex flex-col" style={{ border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e2e6eb" }}>
          <div>
            <h2 className="text-[18px] font-semibold" style={{ color: "#1a2234" }}>New Capacity Plan</h2>
            <p className="text-[11px]" style={{ color: "#8c94a6" }}>Single Release · Feature · {viewBy}</p>
          </div>
          <button aria-label="Close capacity plan modal" onClick={onClose} className="p-1 rounded" style={{ color: "#5c6478" }}><X size={17} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold mb-1" style={{ color: "#5c6478" }}>Project scope</label>
            <div className="px-3 py-2 rounded text-[13px]" style={{ backgroundColor: "#eef0f3", border: "1px solid #d4d8de", color: "#5c6478" }}>{project.name}</div>
            <p className="mt-1 text-[10px]" style={{ color: "#8c94a6" }}>Stores the plan only. Teams are added later from Project Breakdown.</p>
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1" style={{ color: "#5c6478" }}>Name <span style={{ color: "#dc2626" }}>*</span></label>
            <input autoFocus value={name} onChange={event => setName(event.target.value)} className="w-full px-3 py-2 text-[13px] rounded focus:outline-none" style={{ border: "1px solid #cbd5e1", color: "#1a2234" }} />
          </div>
          <div className="p-3 space-y-3" style={{ backgroundColor: "#f4f6f9" }}>
            <div>
              <div className="text-[11px] font-semibold mb-2" style={{ color: "#5c6478" }}>Plan Type</div>
              <div className="inline-flex rounded-sm overflow-hidden" style={{ border: "1px solid #bdd0ef" }}>
                <span className="px-3 py-1.5 text-[12px] font-semibold text-white" style={{ backgroundColor: "#2f6fd6" }}>Single Release</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold mb-1" style={{ color: "#5c6478" }}>Release <span style={{ color: "#dc2626" }}>*</span></label>
              <select aria-label="Capacity plan release" value={releaseId} onChange={event => setReleaseId(event.target.value)} className="w-full px-3 py-2 text-[13px] rounded bg-white focus:outline-none" style={{ border: "1px solid #9fb5d5", color: "#1a2234" }}>
                {releaseOptions.map(release => <option key={release.id} value={release.id}>{release.name}</option>)}
              </select>
              {duplicate && <p className="mt-1 text-[10px]" style={{ color: "#b91c1c" }}>A Capacity Plan already exists for this Project and Release.</p>}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1" style={{ color: "#5c6478" }}>Portfolio Item Type</label>
            <div className="px-3 py-2 rounded text-[13px]" style={{ border: "1px solid #cbd5e1", color: "#1a2234" }}>Feature</div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1" style={{ color: "#5c6478" }}>View Work Items By</label>
            <div className="inline-flex rounded-sm overflow-hidden" style={{ border: "1px solid #bdd0ef" }}>
              {(["Points", "Count"] as UnitMode[]).map(mode => (
                <button key={mode} onClick={() => setViewBy(mode)} className="px-3 py-1.5 text-[12px] font-semibold" style={{ color: viewBy === mode ? "#fff" : "#2558a6", backgroundColor: viewBy === mode ? "#2f6fd6" : "#fff" }}>{mode}</button>
              ))}
            </div>
            <p className="mt-1 text-[10px]" style={{ color: "#8c94a6" }}>Locked after plan creation.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] rounded" style={{ color: "#2558a6" }}>Cancel</button>
          <button disabled={!canCreate} onClick={submit} className="px-4 py-1.5 text-[12px] font-semibold rounded disabled:opacity-45" style={{ color: "#fff", backgroundColor: "#2f6fd6" }}>Create</button>
        </div>
      </div>
    </div>
  );
}

function TeamPickerModal({ plan, project, onClose, onApply }: { plan: CapacityPlan; project: ScopeProject; onClose: () => void; onApply: (teams: string[]) => void }) {
  const [selected, setSelected] = useState(() => new Set(plan.teams.map(team => team.team)));
  function toggle(team: string) {
    setSelected(previous => {
      const next = new Set(previous);
      next.has(team) ? next.delete(team) : next.add(team);
      return next;
    });
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <div className="relative w-[520px] rounded bg-white shadow-2xl overflow-hidden" style={{ border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #e2e6eb" }}>
          <div>
            <div className="font-semibold text-[14px]" style={{ color: "#1a2234" }}>Add Team from Project Breakdown</div>
            <p className="text-[11px]" style={{ color: "#8c94a6" }}>Leaf project rows are treated as Teams in Mini Rally.</p>
          </div>
          <button aria-label="Close team picker" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="p-4">
          <div className="rounded" style={{ border: "1px solid #dde2ea" }}>
            <div className="px-3 py-2 text-[12px] font-semibold" style={{ backgroundColor: "#f7f8fa", color: "#1a2234", borderBottom: "1px solid #edf0f4" }}>Workspace / {project.name}</div>
            {project.teams.map(team => (
              <label key={team} className="flex items-center gap-2 px-8 py-2 text-[12px]" style={{ borderBottom: "1px solid #f0f2f5", color: "#1a2234" }}>
                <input type="checkbox" checked={selected.has(team)} onChange={() => toggle(team)} />
                <Users size={13} style={{ color: "#2558a6" }} />
                {team}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
          <button onClick={onClose} className="px-3 py-1.5 text-[12px]" style={{ color: "#5c6478" }}>Cancel</button>
          <button onClick={() => onApply([...selected])} className="px-3 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

function AddFeaturesModal({ plan, features, teamName, onClose, onAdd }: { plan: CapacityPlan; features: Feature[]; teamName?: string; onClose: () => void; onAdd: (featureIds: string[], team?: string) => void }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const inTeam = new Set(plan.allocations.filter(allocation => allocation.team === teamName).map(allocation => allocation.featureId));
  const inPlan = new Set(plan.allocations.map(allocation => allocation.featureId));
  const candidates = features.filter(feature => (teamName ? !inTeam.has(feature.id) : !inPlan.has(feature.id)) && `${feature.id} ${feature.name} ${feature.project}`.toLowerCase().includes(search.toLowerCase()));
  function toggle(featureId: string) {
    setSelected(previous => {
      const next = new Set(previous);
      next.has(featureId) ? next.delete(featureId) : next.add(featureId);
      return next;
    });
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-[900px] max-h-[82vh] overflow-hidden rounded bg-white shadow-2xl flex flex-col" style={{ border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e2e6eb" }}>
          <div>
            <h2 className="text-[16px] font-semibold" style={{ color: "#1a2234" }}>{teamName ? "Add Features to Team" : "Add Features to Plan"}</h2>
            <p className="mt-0.5 text-[11px]" style={{ color: "#8c94a6" }}>{teamName ? `Team: ${teamName}` : "Added Features remain unassigned until you allocate them to a Team."}</p>
          </div>
          <button aria-label="Close add features modal" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="h-14 shrink-0 flex items-center gap-3 px-5" style={{ borderBottom: "1px solid #e2e6eb" }}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#2f6fd6" }} />
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search Work Items" className="w-56 pl-9 pr-3 py-2 text-[12px] rounded bg-white focus:outline-none" style={{ border: "1px solid #c8d3e0", color: "#1a2234" }} />
          </div>
          <button className="px-3 py-2 text-[12px] rounded bg-[#eef0f3]" style={{ color: "#8c94a6", border: "1px solid #c8d3e0" }}>Show Filters</button>
          <button className="px-3 py-2 text-[12px] rounded bg-[#eef0f3]" style={{ color: "#8c94a6", border: "1px solid #c8d3e0" }}>Show Fields</button>
          <div className="flex-1" />
          <span className="text-[12px]" style={{ color: "#5c6478" }}>Total Work Items: {candidates.length}</span>
        </div>
        <div className="flex-1 overflow-auto px-5 py-3">
          <div style={{ border: "1px solid #d9dee7" }}>
            <div className="grid h-9 items-center px-3 text-[11px] font-semibold uppercase" style={{ gridTemplateColumns: "36px 90px 1fr 130px 150px", backgroundColor: "#f7f8fa", borderBottom: "1px solid #d9dee7", color: "#1a2234" }}>
              <div /><div>ID</div><div>Name</div><div>Project</div><div>Allocation</div>
            </div>
            {candidates.map(feature => {
              const featureAllocations = plan.allocations.filter(allocation => allocation.featureId === feature.id);
              const allocationLabel = featureAllocations.length === 0
                ? "Not in plan"
                : featureAllocations.every(allocation => !allocation.team)
                  ? "Unallocated"
                  : `In ${featureAllocations.map(allocation => allocation.team || "Unallocated").join(", ")}`;
              return (
                <label key={feature.id} className="grid min-h-10 items-center px-3 text-[12px]" style={{ gridTemplateColumns: "36px 90px 1fr 130px 150px", borderBottom: "1px solid #edf0f4", color: "#1a2234" }}>
                  <input type="checkbox" checked={selected.has(feature.id)} onChange={() => toggle(feature.id)} />
                  <span className="font-mono text-[#2558a6]">{feature.id}</span>
                  <span>{feature.name}</span>
                  <span>{feature.project}</span>
                  <span style={{ color: "#5c6478" }}>{allocationLabel}</span>
                </label>
              );
            })}
            {candidates.length === 0 && <div className="px-4 py-8 text-center text-[13px]" style={{ color: "#5c6478" }}>No matching Features found.</div>}
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
          <span className="text-[12px]" style={{ color: "#5c6478" }}>{selected.size} Changes</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-[12px]" style={{ color: "#2558a6" }}>Cancel</button>
            <button disabled={selected.size === 0} onClick={() => { onAdd([...selected], teamName); onClose(); }} className="px-4 py-1.5 text-[12px] font-semibold rounded disabled:opacity-45" style={{ color: "#fff", backgroundColor: "#2f6fd6" }}>{teamName ? "Add to Team" : "Add to Plan"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

type AllocationDraft = { team: string; value: string };

function AllocateDialog({ feature, plan, viewBy, onClose, onApply }: { feature: Feature; plan: CapacityPlan; viewBy: UnitMode; onClose: () => void; onApply: (rows: { team: string; value: number; estimateSource: "Manual" | "Feature Estimate" }[]) => void }) {
  const existing = plan.allocations.filter(allocation => allocation.featureId === feature.id && allocation.team);
  const [rows, setRows] = useState<AllocationDraft[]>(() => existing.length > 0
    ? existing.map(allocation => ({ team: allocation.team || "", value: allocation.estimateSource === "Feature Estimate" ? "" : String(allocation.value) }))
    : [{ team: "", value: "" }]);
  const sourceEstimate = topDownEstimate(feature, viewBy);
  function updateRow(index: number, patch: Partial<AllocationDraft>) {
    setRows(previous => previous.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row));
  }
  function apply() {
    const valid = rows.filter(row => row.team).map(row => ({
      team: row.team,
      value: row.value.trim() === "" ? sourceEstimate : Math.max(0, Number(row.value) || 0),
      estimateSource: row.value.trim() === "" ? "Feature Estimate" as const : "Manual" as const,
    }));
    if (valid.length > 0) onApply(valid);
    onClose();
  }
  const assigned = new Set(rows.map(row => row.team).filter(Boolean));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-[620px] overflow-hidden rounded bg-white shadow-2xl" style={{ border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e2e6eb" }}>
          <div><h2 className="text-[16px] font-semibold" style={{ color: "#1a2234" }}>Allocate to Teams</h2><p className="text-[11px]" style={{ color: "#8c94a6" }}>{feature.id} · {feature.name}</p></div>
          <button onClick={onClose} aria-label="Close allocate dialog"><X size={16} /></button>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3 rounded p-3 text-[12px]" style={{ backgroundColor: "#f7f8fa", border: "1px solid #e2e6eb", color: "#3a4254" }}>
            <div><span className="block text-[10px] font-semibold uppercase" style={{ color: "#8c94a6" }}>Preliminary estimate</span>{feature.preliminaryEstimate}</div>
            <div><span className="block text-[10px] font-semibold uppercase" style={{ color: "#8c94a6" }}>Refined estimate</span>{topDownEstimate(feature, viewBy) || "Not refined"}</div>
          </div>
          <p className="text-[11px]" style={{ color: "#5c6478" }}>Leave Estimate blank to commit the current refined Feature estimate ({formatCapacityNumber(sourceEstimate)} {viewBy.toLowerCase()}). Enter a value to make a fixed manual allocation.</p>
          {rows.map((row, index) => (
            <div key={index} className="grid grid-cols-[1fr_160px_28px] items-end gap-3 rounded p-3" style={{ border: "1px solid #d9dee7" }}>
              <label className="text-[11px] font-semibold" style={{ color: "#5c6478" }}>Team
                <select value={row.team} onChange={event => updateRow(index, { team: event.target.value })} className="mt-1 w-full rounded bg-white px-2 py-2 text-[12px]" style={{ border: "1px solid #c8d3e0" }}>
                  <option value="">Select a Team...</option>
                  {plan.teams.filter(team => !assigned.has(team.team) || team.team === row.team).map(team => <option key={team.team} value={team.team}>{team.team}</option>)}
                </select>
              </label>
              <label className="text-[11px] font-semibold" style={{ color: "#5c6478" }}>Estimate ({viewBy})
                <input value={row.value} onChange={event => updateRow(index, { value: event.target.value })} inputMode="decimal" placeholder={`Full ${formatCapacityNumber(sourceEstimate)}`} className="mt-1 w-full rounded px-2 py-2 text-right text-[12px]" style={{ border: "1px solid #c8d3e0" }} />
              </label>
              <button disabled={rows.length === 1} onClick={() => setRows(previous => previous.filter((_, rowIndex) => rowIndex !== index))} className="mb-1 p-1 disabled:opacity-30" style={{ color: "#8c94a6" }} aria-label="Remove allocation row"><X size={15} /></button>
            </div>
          ))}
          <button onClick={() => setRows(previous => [...previous, { team: "", value: "" }])} className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#2f6fd6" }}><Plus size={14} /> Add another Team</button>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
          <button onClick={onClose} className="px-3 py-1.5 text-[12px]" style={{ color: "#2558a6" }}>Cancel</button>
          <button onClick={apply} disabled={!rows.some(row => row.team)} className="rounded px-4 py-1.5 text-[12px] font-semibold text-white disabled:opacity-45" style={{ backgroundColor: "#2f6fd6" }}>Allocate</button>
        </div>
      </div>
    </div>
  );
}

function CapacityForecastDialog({ teams, onClose, onApply }: { teams: CapacityPlan["teams"]; onClose: () => void; onApply: (forecast: Record<string, number>) => void }) {
  const [velocity, setVelocity] = useState("24");
  const multiplier = Math.max(0, Number(velocity) || 0);
  const forecast = Object.fromEntries(teams.map((team, index) => [team.team, Math.round(multiplier * (index === 0 ? 1 : index === 1 ? 0.8 : 0.9))]));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black/30" onClick={onClose} /><div className="relative w-[500px] overflow-hidden rounded bg-white shadow-2xl" style={{ border: "1px solid #d4d8de" }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e2e6eb" }}><div><h2 className="text-[16px] font-semibold">Calculate Capacity Forecast</h2><p className="text-[11px]" style={{ color: "#8c94a6" }}>Forecast is a Draft-only planning aid. You may overwrite every capacity afterwards.</p></div><button onClick={onClose}><X size={16} /></button></div>
      <div className="space-y-3 p-5"><label className="block text-[12px] font-semibold" style={{ color: "#5c6478" }}>Historic velocity / team
        <input type="number" min={0} value={velocity} onChange={event => setVelocity(event.target.value)} className="mt-1 w-full rounded px-3 py-2" style={{ border: "1px solid #c8d3e0" }} />
      </label><div className="space-y-2 rounded p-3 text-[12px]" style={{ backgroundColor: "#f7f8fa", border: "1px solid #e2e6eb" }}>{teams.map(team => <div key={team.team} className="flex justify-between"><span>{team.team}</span><b>{forecast[team.team]}</b></div>)}</div></div>
      <div className="flex justify-end gap-2 px-5 py-3" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}><button onClick={onClose} className="px-3 py-1.5 text-[12px]" style={{ color: "#2558a6" }}>Cancel</button><button onClick={() => { onApply(forecast); onClose(); }} className="rounded px-4 py-1.5 text-[12px] font-semibold text-white" style={{ backgroundColor: "#2f6fd6" }}>Apply forecast</button></div>
    </div></div>
  );
}

type CapacityPlanningPageProps = {
  role: Role;
  project: ScopeProject;
  releases: ReleaseItem[];
  features: Feature[];
  workItems: WorkItem[];
  capacityPlans: CapacityPlan[];
  onCreateCapacityPlan: (input: NewCapacityPlanInput) => CapacityPlan;
  onUpdateCapacityPlan: (id: string, updater: (plan: CapacityPlan) => CapacityPlan) => void;
  onPublishCapacityPlan: (id: string, updateFields?: boolean) => void;
};

export function CapacityPlanningPage({ role, project, releases, features, workItems, capacityPlans, onCreateCapacityPlan, onUpdateCapacityPlan, onPublishCapacityPlan }: CapacityPlanningPageProps) {
  const [search, setSearch] = useState("");
  const [releaseFilter, setReleaseFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [detailTab, setDetailTab] = useState<"teams" | "features">("teams");
  const [teamSort, setTeamSort] = useState<"name" | "capacity">("name");
  const [featureSort, setFeatureSort] = useState<"rank" | "name" | "estimated" | "rollup">("rank");
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [addFeaturesTeam, setAddFeaturesTeam] = useState<string | null>(null);
  const [showAddFeaturesPlan, setShowAddFeaturesPlan] = useState(false);
  const [allocateFeatureId, setAllocateFeatureId] = useState<string | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const projectPlans = capacityPlans.filter(plan => plan.projectKey === project.key);
  const releaseOptions = releases.filter(release => release.projectKey === project.key);
  const visiblePlans = projectPlans.filter(plan => {
    const matchesSearch = `${plan.id} ${plan.name} ${plan.release}`.toLowerCase().includes(search.toLowerCase());
    const matchesRelease = releaseFilter === "All" || plan.releaseId === releaseFilter;
    return matchesSearch && matchesRelease;
  });
  const activePlan = activePlanId ? capacityPlans.find(plan => plan.id === activePlanId) || null : null;
  const canManageActivePlan = activePlan ? canManageCapacityPlan(role, activePlan.projectKey) : false;
  const editable = Boolean(activePlan && canManageActivePlan && activePlan.status === "Draft");

  const eligibleFeatures = useMemo(() => {
    if (!activePlan) return [];
    return features.filter(feature =>
      feature.project === activePlan.projectKey &&
      !feature.archivedAt &&
      feature.status !== "Cancelled" &&
      (feature.release === "Unscheduled" || feature.releaseId === activePlan.releaseId || feature.release === activePlan.release)
    );
  }, [activePlan, features]);

  function openCreatedPlan(input: NewCapacityPlanInput) {
    const plan = onCreateCapacityPlan(input);
    setActivePlanId(plan.id);
    return plan;
  }

  function updatePlan(updater: (plan: CapacityPlan) => CapacityPlan) {
    if (!activePlan) return;
    onUpdateCapacityPlan(activePlan.id, updater);
  }

  function addFeaturesToPlan(featureIds: string[], team: string) {
    updatePlan(plan => {
      let nextRank = Math.max(0, ...plan.allocations.map(allocation => allocation.rank)) + 1;
      const nextAllocations = [...plan.allocations];
      featureIds.forEach(featureId => {
        if (nextAllocations.some(allocation => allocation.featureId === featureId && allocation.team === team)) return;
        const unallocatedIndex = nextAllocations.findIndex(allocation => allocation.featureId === featureId && !allocation.team);
        if (unallocatedIndex >= 0) {
          nextAllocations[unallocatedIndex] = { ...nextAllocations[unallocatedIndex], team };
          return;
        }
        nextAllocations.push({ id: newAllocationId(), featureId, team, value: 0, estimateSource: "Manual", rank: nextRank });
        nextRank += 1;
      });
      return { ...plan, lastUpdated: "Just now", allocations: nextAllocations };
    });
  }

  function addFeaturesUnassignedToPlan(featureIds: string[]) {
    updatePlan(plan => {
      let nextRank = Math.max(0, ...plan.allocations.map(allocation => allocation.rank)) + 1;
      const existing = new Set(plan.allocations.map(allocation => allocation.featureId));
      const additions = featureIds.filter(featureId => !existing.has(featureId)).map(featureId => ({
        id: newAllocationId(), featureId, value: 0, estimateSource: "Manual" as const, rank: nextRank++,
      }));
      return additions.length === 0 ? plan : { ...plan, lastUpdated: "Just now", allocations: [...plan.allocations, ...additions] };
    });
  }

  function assignAllocation(allocationId: string, team?: string) {
    updatePlan(plan => ({
      ...plan,
      lastUpdated: "Just now",
      allocations: plan.allocations.map(allocation => allocation.id === allocationId ? { ...allocation, team } : allocation),
    }));
  }

  function updateAllocationValue(allocationId: string, value: number) {
    updatePlan(plan => ({
      ...plan,
      lastUpdated: "Just now",
      allocations: plan.allocations.map(allocation => allocation.id === allocationId ? { ...allocation, value: Math.max(0, value), estimateSource: "Manual" } : allocation),
    }));
  }

  function applyFeatureAllocations(featureId: string, rows: { team: string; value: number; estimateSource: "Manual" | "Feature Estimate" }[]) {
    updatePlan(plan => {
      const preserved = plan.allocations.filter(allocation => allocation.featureId !== featureId);
      const nextRank = Math.max(0, ...plan.allocations.map(allocation => allocation.rank)) + 1;
      return {
        ...plan,
        lastUpdated: "Just now",
        allocations: [...preserved, ...rows.map((row, index) => ({ id: newAllocationId(), featureId, team: row.team, value: row.value, estimateSource: row.estimateSource, rank: nextRank + index }))],
      };
    });
  }

  function splitAllocation(allocationId: string) {
    updatePlan(plan => {
      const source = plan.allocations.find(allocation => allocation.id === allocationId);
      if (!source) return plan;
      return {
        ...plan,
        lastUpdated: "Just now",
        allocations: [...plan.allocations, { id: newAllocationId(), featureId: source.featureId, value: 0, estimateSource: "Manual", rank: Math.max(0, ...plan.allocations.map(allocation => allocation.rank)) + 1 }],
      };
    });
  }

  function removeAllocation(allocationId: string) {
    updatePlan(plan => ({
      ...plan,
      lastUpdated: "Just now",
      allocations: plan.allocations.filter(allocation => allocation.id !== allocationId),
    }));
  }

  function applyTeams(teamNames: string[]) {
    if (!activePlan) return;
    const nextTeamSet = new Set(teamNames);
    updatePlan(plan => ({
      ...plan,
      lastUpdated: "Just now",
      teams: teamNames.map(team => plan.teams.find(existing => existing.team === team) || { team, capacity: 0 }),
      allocations: plan.allocations.map(allocation => allocation.team && !nextTeamSet.has(allocation.team) ? { ...allocation, team: undefined } : allocation),
    }));
    setShowTeamPicker(false);
  }

  if (activePlan) {
    const visibleTeams = role === "Project Member"
      ? activePlan.teams.filter(team => ROLE_SCOPE.projectMemberTeams.includes(team.team as typeof ROLE_SCOPE.projectMemberTeams[number]))
      : activePlan.teams;
    const sortedTeams = [...visibleTeams].sort((left, right) => teamSort === "capacity" ? right.capacity - left.capacity : left.team.localeCompare(right.team));
    const uniqueFeatureIdsInPlan = new Set(activePlan.allocations.map(allocation => allocation.featureId));
    const assignedIds = new Set(activePlan.allocations.filter(allocation => allocation.team).map(allocation => allocation.featureId));
    const unassignedAllocations = activePlan.allocations.filter(allocation => !allocation.team);
    const planTotals = activePlan.teams.reduce((totals, team) => {
      const teamAllocations = activePlan.allocations.filter(allocation => allocation.team === team.team);
      const metrics = teamAllocations.map(allocation => {
        const feature = getPlanFeature(allocation.featureId, eligibleFeatures);
        return feature ? getFeatureMetrics(feature, workItems, activePlan.viewBy, team.team) : null;
      }).filter((metric): metric is ReturnType<typeof getFeatureMetrics> => Boolean(metric));
      return {
        demand: totals.demand + teamAllocations.reduce((sum, allocation) => sum + allocation.value, 0),
        rollup: totals.rollup + metrics.reduce((sum, metric) => sum + metric.rollup, 0),
        estimated: totals.estimated + metrics.reduce((sum, metric) => sum + metric.estimated, 0),
        capacity: totals.capacity + team.capacity,
      };
    }, { demand: 0, rollup: 0, estimated: 0, capacity: 0 });
    const planCompletePct = planTotals.estimated <= 0 ? 0 : Math.round((planTotals.rollup / planTotals.estimated) * 100);
    const featureRows = [...uniqueFeatureIdsInPlan].map(featureId => {
      const feature = getPlanFeature(featureId, eligibleFeatures);
      if (!feature) return null;
      const allocations = activePlan.allocations.filter(allocation => allocation.featureId === featureId);
      const execution = getFeatureMetrics(feature, workItems, activePlan.viewBy);
      const estimated = topDownEstimate(feature, activePlan.viewBy);
      const rollup = execution.rollup;
      const completed = execution.rollup;
      return { feature, allocations, estimated, rollup, completed, completePct: floorPct(completed, estimated) };
    }).filter((row): row is { feature: Feature; allocations: CapacityPlanAllocation[]; estimated: number; rollup: number; completed: number; completePct: number } => Boolean(row)).sort((left, right) => {
      if (featureSort === "name") return left.feature.name.localeCompare(right.feature.name);
      if (featureSort === "estimated") return right.estimated - left.estimated;
      if (featureSort === "rollup") return right.rollup - left.rollup;
      return (left.feature.rank || 0) - (right.feature.rank || 0);
    });
    let cumulativeEstimate = 0;
    let cutlineAfterId: string | null = null;
    if (featureSort === "rank" && planTotals.capacity > 0) {
      for (const row of featureRows) {
        cumulativeEstimate += row.estimated;
        if (cumulativeEstimate >= planTotals.capacity) { cutlineAfterId = row.feature.id; break; }
      }
    }
    const allocatingFeature = allocateFeatureId ? getPlanFeature(allocateFeatureId, eligibleFeatures) : undefined;

    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f0f2f5]">
        <div className="h-12 shrink-0 flex items-center px-4 gap-3 text-white" style={{ backgroundColor: "#17365d" }}>
          <button aria-label="Back to capacity plans" onClick={() => setActivePlanId(null)} className="p-1.5 rounded bg-white/10"><ArrowLeft size={15} /></button>
          <div className="font-mono text-[18px] font-semibold">{activePlan.id}</div>
          <div className="text-[15px] font-semibold truncate">{activePlan.name}</div>
          <CapacityStatusBadge status={activePlan.status} />
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full" style={{ color: "#4c1d95", backgroundColor: "#f3e8ff" }}>{activePlan.release}</span>
          <div className="flex-1" />
          {activePlan.status === "Published" && canManageActivePlan && <button onClick={() => updatePlan(plan => ({ ...plan, status: "Draft", lastUpdated: "Just now" }))} className="px-3 py-1.5 text-[12px] font-semibold rounded text-white" style={{ backgroundColor: "#5c6478" }}>Revert to Draft</button>}
          {editable && <button onClick={() => onPublishCapacityPlan(activePlan.id, false)} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded text-white" style={{ backgroundColor: "#64748b" }}><Send size={13} /> Publish Without Updating Fields</button>}
          {editable && <button onClick={() => onPublishCapacityPlan(activePlan.id, true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded text-white" style={{ backgroundColor: "#2f6fd6" }}><Send size={13} /> Publish</button>}
        </div>
        <div className="h-14 shrink-0 flex items-center justify-between px-4 bg-white" style={{ borderBottom: "1px solid #d9dee7" }}>
          <div className="flex items-center gap-5 text-[12px]">
            <span>Portfolio Item Type <span className="ml-1"><TypeBadge type="Feature" /></span></span>
            <span><b>{eligibleFeatures.length}</b> Eligible · <b>{assignedIds.size}</b> Assigned · <b>{unassignedAllocations.length}</b> Unassigned</span>
            <span>View by <b>{activePlan.viewBy}</b></span>
          </div>
          <div className="flex items-center rounded overflow-hidden" style={{ border: "1px solid #c8d3e0" }}>
            <div className="px-3 py-2 text-[12px] font-semibold" style={{ backgroundColor: "#dfe8f4", color: "#3a4254" }}>{activePlan.viewBy}</div>
            <div className="px-3 py-2 text-[12px]" style={{ color: "#3a4254" }}>Complete <b>{planCompletePct}%</b></div>
            <div className="px-3 py-2 text-[12px]" style={{ color: "#3a4254" }}>Demand <b>{planTotals.demand}</b></div>
            <div className="px-3 py-2 text-[12px]" style={{ color: "#3a4254" }}>Rollup <b>{planTotals.rollup}</b></div>
            <div className="px-3 py-2 text-[12px]" style={{ color: "#3a4254" }}>Estimated <b>{planTotals.estimated}</b></div>
            <div className="px-3 py-2 text-[12px]" style={{ color: "#3a4254" }}>Capacity <b>{planTotals.capacity}</b></div>
          </div>
        </div>
        <div className="h-12 shrink-0 flex items-end gap-6 px-4 bg-white" style={{ borderBottom: "1px solid #d9dee7" }}>
          <button onClick={() => setDetailTab("teams")} className="h-9 px-2 text-[13px] font-semibold" style={{ color: detailTab === "teams" ? "#0b5cad" : "#5c6478", borderBottom: detailTab === "teams" ? "2px solid #2f6fd6" : "2px solid transparent" }}>Teams by Total</button>
          <button onClick={() => setDetailTab("features")} className="h-9 px-2 text-[13px] font-semibold" style={{ color: detailTab === "features" ? "#0b5cad" : "#5c6478", borderBottom: detailTab === "features" ? "2px solid #2f6fd6" : "2px solid transparent" }}>{"Features"}</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {activePlan.status === "Published" && <div className="mb-4 flex items-center gap-2 rounded px-3 py-2 text-[12px]" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412" }}><CircleAlert size={15} /> Plan has been published — revert to Draft to make changes.</div>}
          {detailTab === "teams" && editable && (
            <div className="mb-4 flex items-center gap-2">
              <button onClick={() => setShowTeamPicker(true)} className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold rounded text-white" style={{ backgroundColor: "#2f6fd6" }}><Plus size={14} /> Add Team</button>
              <button onClick={() => setShowForecast(true)} className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold rounded bg-white" style={{ border: "1px solid #bdd0ef", color: "#2f6fd6" }}><Calculator size={14} /> Calculate Capacity Forecast</button>
              <label className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "#5c6478" }}><ArrowDownUp size={13} /> Sort
                <select value={teamSort} onChange={event => setTeamSort(event.target.value as typeof teamSort)} className="rounded bg-white px-2 py-1 text-[11px]" style={{ border: "1px solid #c8d3e0" }}><option value="name">Team name</option><option value="capacity">Capacity</option></select>
              </label>
            </div>
          )}
          {detailTab === "teams" ? <>
          <div className="bg-white" style={{ border: "1px solid #d9dee7" }}>
            <div className="grid items-center h-10 px-3 text-[11px] font-semibold uppercase" style={{ gridTemplateColumns: TEAM_CAPACITY_GRID, color: "#1a2234", borderBottom: "1px solid #d9dee7" }}>
              <div>Team Name</div><div className="text-right">Features</div><div /><div className="text-right">Complete</div><div className="text-right">Rollup</div><div className="text-right">Estimated</div><div className="text-right">Capacity</div>
            </div>
            {sortedTeams.map(team => {
              const teamAllocations = activePlan.allocations.filter(allocation => allocation.team === team.team).sort((a, b) => a.rank - b.rank);
              const metrics = teamAllocations.map(allocation => {
                const feature = getPlanFeature(allocation.featureId, eligibleFeatures);
                return feature ? { allocation, feature, ...getFeatureMetrics(feature, workItems, activePlan.viewBy, team.team) } : null;
              }).filter((metric): metric is { allocation: CapacityPlanAllocation; feature: Feature; estimated: number; rollup: number; completePct: number; children: WorkItem[] } => Boolean(metric));
              const demand = teamAllocations.reduce((sum, allocation) => sum + allocation.value, 0);
              const rollup = metrics.reduce((sum, metric) => sum + metric.rollup, 0);
              const estimated = metrics.reduce((sum, metric) => sum + metric.estimated, 0);
              const overCapacity = demand > team.capacity;
              const warningCount = overCapacity ? 1 : 0;
              const expanded = expandedTeams.has(team.team);
              return (
                <div key={team.team} style={{ borderBottom: "1px solid #edf0f4" }}>
                  <div className="grid items-center h-14 px-3 text-[13px]" style={{ gridTemplateColumns: TEAM_CAPACITY_GRID, color: "#1a2234" }}>
                    <button onClick={() => setExpandedTeams(previous => { const next = new Set(previous); next.has(team.team) ? next.delete(team.team) : next.add(team.team); return next; })} className="flex items-center gap-2 text-left font-medium">
                      {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}<Users size={14} style={{ color: "#2558a6" }} />{team.team}
                      {warningCount > 0 && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-semibold rounded-full text-white" style={{ backgroundColor: "#dc2626" }}><AlertTriangle size={11} />{warningCount}</span>}
                    </button>
                    <div className="text-right">{new Set(teamAllocations.map(allocation => allocation.featureId)).size}</div>
                    <ProgressBar complete={rollup} rollup={demand} estimated={estimated} capacity={team.capacity} />
                    <MetricCell value={rollup} pct={pctOfBase(rollup, team.capacity)} />
                    <MetricCell value={demand} pct={pctOfBase(demand, team.capacity)} />
                    <MetricCell value={estimated} pct={pctOfBase(estimated, team.capacity)} />
                    <div className="text-right">{editable ? <input aria-label={`${team.team} capacity`} type="number" min={0} value={team.capacity} onChange={event => updatePlan(plan => ({ ...plan, lastUpdated: "Just now", teams: plan.teams.map(row => row.team === team.team ? { ...row, capacity: Math.max(0, Number(event.target.value)) } : row) }))} className="w-16 px-2 py-1 text-right rounded bg-white" style={{ border: "1px solid #c8d3e0" }} /> : team.capacity}</div>
                  </div>
                  {expanded && (
                    <div className="ml-3 mb-3" style={{ border: "1px solid #d9dee7", marginRight: 120 }}>
                      {editable && (
                        <div className="flex items-center justify-between px-2 py-2" style={{ borderBottom: "1px solid #d9dee7", backgroundColor: "#fff" }}>
                          <div className="text-[12px] font-semibold" style={{ color: "#1a2234" }}>Features allocated to {team.team}</div>
                          <button onClick={() => setAddFeaturesTeam(team.team)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-semibold rounded bg-white" style={{ border: "1px solid #bdd0ef", color: "#2f6fd6" }}><Plus size={13} /> Add Features</button>
                        </div>
                      )}
                      <div className="grid h-8 items-center px-2 text-[10px] font-semibold uppercase" style={{ gridTemplateColumns: FEATURE_CAPACITY_GRID, color: "#1a2234", backgroundColor: "#f7f8fa" }}>
                        <div className="grid gap-2" style={{ gridTemplateColumns: FEATURE_IDENTITY_GRID }}><span>Rank</span><span>ID</span><span>Name</span><span>State</span></div><div /><div /><div className="text-right">Complete</div><div className="text-right">Rollup</div><div className="text-right">Estimated</div>
                      </div>
                      {metrics.map(metric => {
                        return (
                          <div key={metric.allocation.id} className="grid min-h-10 items-center px-2 text-[12px]" style={{ gridTemplateColumns: FEATURE_CAPACITY_GRID, borderTop: "1px solid #edf0f4", color: "#1a2234" }}>
                            <div className="grid items-center gap-2 min-w-0" style={{ gridTemplateColumns: FEATURE_IDENTITY_GRID }}>
                              <div>{metric.allocation.rank}</div>
                              <div className="font-mono text-[#2558a6]">{metric.feature.id}</div>
                              <div className="truncate">{metric.feature.name}</div>
                              <div className="truncate">{metric.feature.status}</div>
                            </div>
                            <div />
                            <ProgressBar complete={metric.rollup} rollup={metric.allocation.value} estimated={metric.estimated} capacity={team.capacity} showCapacity={false} />
                            <MetricCell value={metric.rollup} pct={pctOfBase(metric.rollup, team.capacity)} />
                            <div className="flex justify-end items-center gap-1" onClick={event => event.stopPropagation()}>
                              {editable ? <input aria-label={`${metric.allocation.id} rollup allocation`} type="number" min={0} value={metric.allocation.value} onChange={event => updateAllocationValue(metric.allocation.id, Number(event.target.value))} className="w-14 px-1 py-1 text-right rounded bg-white" style={{ border: "1px solid #c8d3e0" }} /> : <MetricCell value={metric.allocation.value} pct={pctOfBase(metric.allocation.value, team.capacity)} />}
                              {editable && <span className="text-[10px]" style={{ color: "#6b5dd3" }}>{pctOfBase(metric.allocation.value, team.capacity)}%</span>}
                              {editable && <button aria-label={`Split ${metric.feature.id}`} onClick={() => splitAllocation(metric.allocation.id)} className="p-1 rounded" style={{ color: "#2f6fd6" }}><Split size={12} /></button>}
                            </div>
                            <MetricCell value={metric.estimated} pct={pctOfBase(metric.estimated, team.capacity)} />
                          </div>
                        );
                      })}
                      {metrics.length === 0 && <div className="px-3 py-4 text-[12px]" style={{ color: "#8c94a6" }}>No Features allocated to this Team.</div>}
                    </div>
                  )}
                </div>
              );
            })}
            {visibleTeams.length === 0 && <div className="px-4 py-8 text-[13px]" style={{ color: "#8c94a6" }}>No Teams in this plan yet. Use Add Team to choose leaf projects from Project Breakdown.</div>}
          </div>
          <div className="mt-4 bg-white" style={{ border: "1px solid #d9dee7" }}>
            <div className="flex items-center justify-between px-3 h-10" style={{ borderBottom: "1px solid #d9dee7" }}>
              <div className="font-semibold text-[13px]" style={{ color: "#1a2234" }}>Unallocated Features in Plan</div>
              <span className="text-[11px]" style={{ color: "#8c94a6" }}>{unassignedAllocations.length} allocation rows waiting for Team</span>
            </div>
            {unassignedAllocations.map(allocation => {
              const feature = getPlanFeature(allocation.featureId, eligibleFeatures);
              if (!feature) return null;
              const metric = getFeatureMetrics(feature, workItems, activePlan.viewBy);
              return (
                <div key={allocation.id} className="grid items-center px-3 min-h-12 text-[12px]" style={{ gridTemplateColumns: "92px 1fr 110px 130px 150px 70px", borderBottom: "1px solid #edf0f4", color: "#1a2234" }}>
                  <div className="font-mono text-[#2558a6]">{feature.id}</div>
                  <div className="truncate">{feature.name}</div>
                  <div className="text-right">{editable ? <input aria-label={`${allocation.id} unallocated value`} type="number" min={0} value={allocation.value} onChange={event => updateAllocationValue(allocation.id, Number(event.target.value))} className="w-16 px-2 py-1 text-right rounded bg-white" style={{ border: "1px solid #c8d3e0" }} /> : allocation.value}</div>
                  <div className="text-right">{metric.rollup}/{metric.estimated} live</div>
                  <div className="text-right">{editable ? <select aria-label={`${allocation.id} assign team`} value="" onChange={event => assignAllocation(allocation.id, event.target.value || undefined)} className="w-36 text-[12px] px-2 py-1 rounded bg-white" style={{ border: "1px solid #c8d3e0" }}><option value="">Assign to Team...</option>{activePlan.teams.map(team => <option key={team.team}>{team.team}</option>)}</select> : "Unallocated"}</div>
                  <div className="flex justify-end items-center gap-1">
                    {editable && <button aria-label={`Split ${feature.id}`} onClick={() => splitAllocation(allocation.id)} className="p-1 rounded" style={{ color: "#2f6fd6" }}><Split size={13} /></button>}
                    {editable && <button aria-label={`Remove ${feature.id} allocation`} onClick={() => removeAllocation(allocation.id)} className="p-1 rounded" style={{ color: "#8c94a6" }}><X size={13} /></button>}
                  </div>
                </div>
              );
            })}
            {unassignedAllocations.length === 0 && <div className="px-3 py-5 text-[12px]" style={{ color: "#8c94a6" }}>No unallocated Features. Expand a Team row to add Features, or split an existing allocation.</div>}
          </div>
          </> : <div className="flex min-h-full gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center justify-between rounded bg-white px-3 py-2" style={{ border: "1px solid #d9dee7" }}>
              <div className="text-[12px]" style={{ color: "#5c6478" }}><b style={{ color: "#1a2234" }}>{featureRows.length}</b> {"Feature"}{featureRows.length === 1 ? "" : "s"} in this plan · allocation is managed from each Feature or an expanded Team.</div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "#5c6478" }}><ArrowDownUp size={13} /> Sort
                <select value={featureSort} onChange={event => setFeatureSort(event.target.value as typeof featureSort)} className="rounded bg-white px-2 py-1 text-[11px]" style={{ border: "1px solid #c8d3e0" }}><option value="rank">Rank</option><option value="name">Name</option><option value="estimated">Estimated</option><option value="rollup">Rollup</option></select>
              </label>
            </div>
            {editable && <button onClick={() => setShowAddFeaturesPlan(true)} className="flex items-center gap-1.5 rounded px-3 py-2 text-[12px] font-semibold text-white" style={{ backgroundColor: "#2f6fd6" }}><Plus size={14} /> Add Feature</button>}
            <div className="overflow-hidden bg-white" style={{ border: "1px solid #d9dee7" }}>
              <div className="grid min-w-[1040px] items-center gap-3 px-3 py-2 text-[10px] font-semibold uppercase" style={{ gridTemplateColumns: "34px 48px 74px minmax(220px,1fr) 120px 120px 105px 105px 145px 34px", backgroundColor: "#f7f8fa", borderBottom: "1px solid #d9dee7", color: "#1a2234" }}>
                <div>+/-</div><div>Rank</div><div>ID</div><div>Name</div><div>State</div><div>Estimated</div><div className="text-right">Rollup</div><div className="text-right">Complete</div><div>Planned Team</div><div />
              </div>
              {featureRows.map(row => {
                const teamAllocations = row.allocations.filter(allocation => allocation.team);
                const displayAllocation = teamAllocations.reduce((sum, allocation) => sum + allocation.value, 0);
                const hasManualAllocation = teamAllocations.some(allocation => allocation.estimateSource !== "Feature Estimate");
                const teamLabel = teamAllocations.length === 0 ? "Not assigned" : teamAllocations.length === 1 ? teamAllocations[0].team : `${teamAllocations.length} teams`;
                return <div key={row.feature.id}>
                  <div className="grid min-w-[1040px] items-center gap-3 px-3 py-2.5 text-[12px]" style={{ gridTemplateColumns: "34px 48px 74px minmax(220px,1fr) 120px 120px 105px 105px 145px 34px", borderBottom: "1px solid #edf0f4", color: "#1a2234" }}>
                    <div>{activePlan.status === "Published" ? <span className="text-[13px]" style={{ color: "#8c94a6" }}>—</span> : null}</div>
                    <div>{row.feature.rank || "—"}</div><div className="font-mono text-[#2558a6]">{row.feature.id}</div><div className="truncate font-medium">{row.feature.name}</div><div className="truncate">{row.feature.status}</div>
                    <div className="flex items-center gap-1.5"><span title={hasManualAllocation ? "One or more Team allocations use a fixed manual value." : "Uses the Feature's refined estimate when allocated without a manual value."} className="inline-flex"><CircleAlert size={13} style={{ color: hasManualAllocation ? "#2f6fd6" : "#8c94a6" }} /></span><span>{row.estimated > 0 ? formatCapacityNumber(row.estimated) : "Not refined"}</span></div>
                    <div className="text-right"><b>{formatCapacityNumber(row.rollup)}</b></div><div className="text-right"><div className="flex items-center justify-end gap-1.5"><span>{formatCapacityNumber(row.completed)}</span><span className="text-[10px]" style={{ color: "#6b5dd3" }}>{row.completePct}%</span></div><div className="mt-1 h-1.5 overflow-hidden rounded" style={{ backgroundColor: "#e4eaf2" }}><div className="h-full" style={{ width: `${Math.min(100, row.completePct)}%`, backgroundColor: "#5b8fe6" }} /></div></div>
                    <div>{teamAllocations.length === 0 ? <span className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-[10px] font-semibold" style={{ color: "#b91c1c", backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}><AlertTriangle size={11} /> Not assigned</span> : <span title={teamAllocations.map(allocation => `${allocation.team}: ${formatCapacityNumber(allocation.value)}`).join(" · ")}>{teamLabel}</span>}</div>
                    <div>{editable && <button onClick={() => setAllocateFeatureId(row.feature.id)} className="rounded p-1" aria-label={`Allocate ${row.feature.id}`} style={{ color: "#2f6fd6" }}><MoreHorizontal size={16} /></button>}</div>
                  </div>
                  {teamAllocations.length > 1 && <div className="ml-[156px] mr-[34px]" style={{ borderLeft: "2px solid #d9e5f7" }}>{teamAllocations.map(allocation => <div key={allocation.id} className="grid items-center gap-3 px-3 py-2 text-[11px]" style={{ gridTemplateColumns: "minmax(220px,1fr) 120px 105px 105px 145px", borderBottom: "1px solid #edf0f4", color: "#5c6478" }}><div>Allocation to <b style={{ color: "#1a2234" }}>{allocation.team}</b></div><div>{allocation.estimateSource === "Feature Estimate" ? "Feature estimate" : "Manual allocation"}</div><div className="text-right">{formatCapacityNumber(allocation.value)}</div><div /><div /></div>)}</div>}
                  {cutlineAfterId === row.feature.id && <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase" style={{ color: "#b45309", backgroundColor: "#fffaf0", borderTop: "2px solid #f59e0b", borderBottom: "1px solid #fde7bd" }}><span>Capacity cutline</span><span className="font-normal normal-case" style={{ color: "#8c5b10" }}>Cumulative estimated work reaches {formatCapacityNumber(planTotals.capacity)} {activePlan.viewBy.toLowerCase()} capacity; lower-ranked Features are outside the current cutline.</span></div>}
                </div>;
              })}
              {featureRows.length === 0 && <EmptyState title="No Features in this plan" body="Use Add Feature to place an eligible Portfolio Feature in the plan, then allocate it to one or more Teams." icon={<Layers size={18} />} />}
            </div>
            {featureSort !== "rank" && <div className="text-[11px]" style={{ color: "#8c94a6" }}>Capacity cutline is hidden while sorted by {featureSort}; sort by Rank to view it.</div>}
          </div>
          <aside className="w-[300px] shrink-0 self-stretch bg-white p-3" style={{ borderLeft: "1px solid #c8d3e0", borderRight: "1px solid #d9dee7" }}>
            <h2 className="mb-3 text-[16px] font-semibold" style={{ color: "#3a506f" }}>Team Capacity</h2>
            <div style={{ border: "1px solid #e2e6eb" }}>
              <div className="grid grid-cols-[1fr_104px] items-center gap-2 px-2 py-2 text-[10px] font-semibold uppercase" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #d9dee7", color: "#1a2234" }}><div>Name</div><div className="text-right">{activePlan.viewBy} / Capacity</div></div>
              {sortedTeams.map(team => {
                const demand = activePlan.allocations.filter(allocation => allocation.team === team.team).reduce((sum, allocation) => sum + allocation.value, 0);
                const overloaded = demand > team.capacity;
                return <div key={team.team} className="grid grid-cols-[1fr_104px] items-center gap-2 px-2 py-3 text-[12px]" style={{ borderBottom: "1px solid #edf0f4", color: "#1a2234" }}><div className="truncate">{team.team}</div><div className="flex items-center justify-end gap-1 text-right tabular-nums"><span>{formatCapacityNumber(demand)} / {formatCapacityNumber(team.capacity)}</span>{overloaded && <AlertTriangle size={14} style={{ color: "#dc2626" }} />}</div></div>;
              })}
              {sortedTeams.length === 0 && <div className="px-3 py-5 text-[12px]" style={{ color: "#8c94a6" }}>No Teams added to this plan.</div>}
            </div>
          </aside>
          </div>}
        </div>
        {showTeamPicker && <TeamPickerModal plan={activePlan} project={project} onClose={() => setShowTeamPicker(false)} onApply={applyTeams} />}
        {addFeaturesTeam && <AddFeaturesModal plan={activePlan} features={eligibleFeatures} teamName={addFeaturesTeam} onClose={() => setAddFeaturesTeam(null)} onAdd={addFeaturesToPlan} />}
        {showAddFeaturesPlan && <AddFeaturesModal plan={activePlan} features={eligibleFeatures} onClose={() => setShowAddFeaturesPlan(false)} onAdd={featureIds => addFeaturesUnassignedToPlan(featureIds)} />}
        {allocatingFeature && <AllocateDialog feature={allocatingFeature} plan={activePlan} viewBy={activePlan.viewBy} onClose={() => setAllocateFeatureId(null)} onApply={rows => applyFeatureAllocations(allocatingFeature.id, rows)} />}
        {showForecast && <CapacityForecastDialog teams={activePlan.teams} onClose={() => setShowForecast(false)} onApply={forecast => updatePlan(plan => ({ ...plan, lastUpdated: "Just now", teams: plan.teams.map(team => ({ ...team, capacity: forecast[team.team] ?? team.capacity })) }))} />}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f7f8fa]">
      <div className="px-5 pt-4 pb-3 bg-white" style={{ borderBottom: "1px solid #d9dee7" }}>
        <div className="flex items-center gap-3">
          <h1 className="text-[28px] font-semibold tracking-tight" style={{ color: "#1a2234" }}>Capacity Planning</h1>
          <select aria-label="Release filter" value={releaseFilter} onChange={event => setReleaseFilter(event.target.value)} className="ml-4 w-64 px-3 py-1.5 text-[13px] rounded bg-white" style={{ border: "1px solid #c8d3e0", color: "#1a2234" }}>
            <option value="All">All Releases</option>
            {releaseOptions.map(release => <option key={release.id} value={release.id}>{release.name}</option>)}
          </select>
          <div className="flex-1" />
          <span className="text-[12px]" style={{ color: "#5c6478" }}>Total Plans: {visiblePlans.length}</span>
        </div>
      </div>
      <div className="h-14 shrink-0 flex items-center gap-3 px-5" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#2f6fd6" }} />
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search plans" className="w-60 pl-9 pr-3 py-2 text-[13px] rounded bg-white focus:outline-none" style={{ border: "1px solid #c8d3e0", color: "#1a2234" }} />
        </div>
        {canManageCapacityPlan(role, project.key) && <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded bg-white" style={{ border: "1px solid #bdd0ef", color: "#2f6fd6" }}><Plus size={15} /> Add New</button>}
        <button className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded bg-white" style={{ border: "1px solid #bdd0ef", color: "#2f6fd6" }}><Filter size={14} /> Show Filters</button>
        <button className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded bg-white" style={{ border: "1px solid #bdd0ef", color: "#2f6fd6" }}><Layers size={14} /> Show Fields</button>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <div className="bg-white" style={{ border: "1px solid #d9dee7" }}>
          <div className="grid h-11 items-center px-3 text-[12px] font-semibold" style={{ gridTemplateColumns: "120px 1fr 220px 130px 190px 130px", borderBottom: "1px solid #d9dee7", color: "#1a2234" }}>
            <div>ID</div><div>Name</div><div>Release</div><div>Status</div><div>Last Updated</div><div className="text-right">Teams in Plan</div>
          </div>
          {visiblePlans.map(plan => (
            <button key={plan.id} onClick={() => setActivePlanId(plan.id)} className="grid w-full min-h-16 items-center px-3 text-left text-[13px] hover:bg-[#f4f6f9]" style={{ gridTemplateColumns: "120px 1fr 220px 130px 190px 130px", borderBottom: "1px solid #edf0f4", color: "#1a2234" }}>
              <div className="font-mono font-semibold" style={{ color: "#2558a6" }}>{plan.id}</div>
              <div className="font-medium">{plan.name}</div>
              <div>{plan.release}</div>
              <div><CapacityStatusBadge status={plan.status} /></div>
              <div>{plan.lastUpdated}</div>
              <div className="text-right"><span className="px-2 py-1 rounded-sm" style={{ color: "#2f6fd6", border: "1px solid #c8d3e0" }}>{role === "Project Member" ? plan.teams.filter(team => ROLE_SCOPE.projectMemberTeams.includes(team.team as typeof ROLE_SCOPE.projectMemberTeams[number])).length : plan.teams.length}</span></div>
            </button>
          ))}
          {visiblePlans.length === 0 && <EmptyState title="No Capacity Plans" body="Create a single-Release plan, then add Teams and Features before setting allocations." icon={<BarChart2 size={18} />} />}
        </div>
      </div>
      {showCreate && <NewCapacityPlanModal project={project} releases={releases} plans={capacityPlans} onClose={() => setShowCreate(false)} onCreate={openCreatedPlan} />}
    </div>
  );
}
