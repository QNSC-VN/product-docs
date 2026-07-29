import { type ReactNode, useMemo, useState } from "react";
import {
  AlertTriangle, ArrowDown, ArrowDownUp, ArrowLeft, ArrowUp, BarChart2, Calculator, Check, ChevronDown,
  ChevronRight, CircleAlert, Filter, Layers, Minus, MoreVertical, Plus, Search, Send,
  Settings, Split, Users, X,
} from "lucide-react";
import {
  type CapacityPlan, type CapacityPlanAllocation, type Feature, type NewCapacityPlanInput,
  type ReleaseItem, type Role, type ScopeProject, type WorkItem, ROLE_SCOPE,
  PRELIMINARY_ESTIMATE_POINT_FALLBACK, PRELIMINARY_ESTIMATE_COUNT_FALLBACK,
} from "../model";
import { EmptyState, TypeBadge } from "../components/shared";
import { type RoleActionRow, permissionAllows } from "./SettingsPage";

type UnitMode = CapacityPlan["viewBy"];

/**
 * Two independent gates must both pass before a role may change a plan:
 * the temporary Capacity Planner Full/View permission from the saved role
 * matrix, and Project scope (a Project Admin only manages its assigned
 * Projects). Passing the permission but failing scope, or vice versa, means
 * read-only. Capacity-planning action-level RBAC is intentionally deferred.
 */
function canManageCapacityPlan(role: Role, projectKey: string, permissionMatrix: RoleActionRow[]) {
  if (!permissionAllows(permissionMatrix, "capacity_planning:manage", role)) return false;
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
    // Older seed children do not always carry Team explicitly. In that case
    // they belong to the Feature's own Team; a split Team starts with no
    // execution rollup until children are assigned to that Team.
    (!team || (item.team || feature.team) === team)
  );
  // "Complete" is live. Completed and every later terminal state count; moving
  // a child back to In-Progress removes it from Complete on the next render.
  const completed = children.filter(item => item.status === "Completed" || item.status === "Accepted" || item.status === "Release");
  const complete = viewBy === "Count" ? completed.length : completed.reduce((sum, item) => sum + item.planEstimate, 0);
  const rollup = viewBy === "Count" ? children.length : children.reduce((sum, item) => sum + item.planEstimate, 0);
  return { children, complete, rollup };
}

/**
 * Resolves an allocation's Feature for display. Always pass the full Feature
 * list, never an eligibility-filtered one: Team-level Add Features can pull in a
 * Feature whose Release does not match the plan, and resolving against a
 * narrower list would drop that allocation's row while still counting it in the
 * Team totals - an invisible allocation.
 */
function getPlanFeature(featureId: string, features: Feature[]) {
  return features.find(feature => feature.id === featureId);
}

const TEAM_CAPACITY_GRID = "minmax(300px,1fr) 132px 260px 96px 96px 96px 110px";
const FEATURE_CAPACITY_GRID = "minmax(300px,1fr) 132px 260px 96px 96px 96px";
// Leading 30px column carries the per-row settings menu (rank Move up / Move down).
// Allocation and Dependencies were appended 2026-07-27; with nine columns the
// expanded table no longer fits beside the Team row, so it scrolls horizontally
// inside FEATURE_TABLE_MIN_WIDTH rather than squeezing Name to nothing.
const FEATURE_IDENTITY_GRID = "30px 44px 74px minmax(180px,1fr) 120px 150px 120px";
const FEATURE_TABLE_MIN_WIDTH = 1180;
const FEATURE_PLAN_GRID = "58px 58px 104px minmax(280px,1fr) 220px 190px 110px 96px 96px 110px";
const FEATURE_PLAN_MIN_WIDTH = 1322;
const ADD_FEATURES_GRID = "36px 90px 1fr 110px 150px 150px";

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

/**
 * Top-down forecast for a Feature: Refined Estimate, falling back to the
 * Preliminary Estimate size mapping.
 *
 * This deliberately ignores plan allocations. It is the value offered as the
 * default when allocating, so folding allocations back in would be circular -
 * leaving Estimate blank would then commit the sum of the allocations that
 * blank field is meant to produce.
 */
function topDownEstimate(feature: Feature, viewBy: UnitMode) {
  const refined = viewBy === "Count" ? feature.refinedWorkItemCountEstimate : feature.refinedEstimate;
  if (typeof refined === "number" && Number.isFinite(refined) && refined > 0) return refined;
  const fallback = viewBy === "Count" ? PRELIMINARY_ESTIMATE_COUNT_FALLBACK : PRELIMINARY_ESTIMATE_POINT_FALLBACK;
  return fallback[feature.preliminaryEstimate] ?? 0;
}

type EstimateSource = "Allocated" | "Refined" | "Preliminary" | "None";

/**
 * Estimated for a Feature inside a plan, in priority order:
 *
 *   1. Total Allocated - sum of this Feature's Team allocation values
 *   2. Refined Estimate
 *   3. Preliminary Estimate (size mapping)
 *
 * Once a planner has actually allocated demand, that committed total is the
 * truth and outranks any top-down forecast; the forecasts only stand in until
 * then. The source is returned so the UI can label where the number came from.
 */
function featureEstimated(feature: Feature, allocations: CapacityPlanAllocation[], viewBy: UnitMode): { value: number; source: EstimateSource } {
  const allocated = allocations
    .filter(allocation => allocation.featureId === feature.id && allocation.team)
    .reduce((sum, allocation) => sum + allocation.value, 0);
  if (allocated > 0) return { value: allocated, source: "Allocated" };
  const refined = viewBy === "Count" ? feature.refinedWorkItemCountEstimate : feature.refinedEstimate;
  if (typeof refined === "number" && Number.isFinite(refined) && refined > 0) return { value: refined, source: "Refined" };
  const fallback = viewBy === "Count" ? PRELIMINARY_ESTIMATE_COUNT_FALLBACK : PRELIMINARY_ESTIMATE_POINT_FALLBACK;
  const preliminary = fallback[feature.preliminaryEstimate] ?? 0;
  return preliminary > 0 ? { value: preliminary, source: "Preliminary" } : { value: 0, source: "None" };
}

type EstimateTrace = {
  current: EstimateSource;
  allocated: number;
  refined: number;
  preliminary: number;
  manual?: boolean;
};

function EstimateSourceIndicator({ trace }: { trace: EstimateTrace }) {
  const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number } | null>(null);
  const rows = [
    { source: "Allocated" as const, icon: <Users size={13} />, value: trace.allocated, active: trace.current === "Allocated" },
    { source: "Refined" as const, icon: <Check size={13} />, value: trace.refined, active: trace.current === "Refined" },
    { source: "Preliminary" as const, icon: <Layers size={13} />, value: trace.preliminary, active: trace.current === "Preliminary" },
  ];
  const iconColor = trace.current === "Allocated" ? "#2558a6" : trace.current === "None" ? "#8c94a6" : "#6b5dd3";
  function showTooltip(target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    const left = Math.max(8, Math.min(rect.right - 224, window.innerWidth - 232));
    const top = Math.min(rect.bottom + 8, window.innerHeight - 150);
    setTooltipPosition({ left, top });
  }
  return (
    <span
      className="relative inline-flex cursor-help"
      tabIndex={0}
      aria-label={`Estimate source ${trace.current}`}
      onMouseEnter={event => showTooltip(event.currentTarget)}
      onMouseLeave={() => setTooltipPosition(null)}
      onFocus={event => showTooltip(event.currentTarget)}
      onBlur={() => setTooltipPosition(null)}
    >
      <CircleAlert size={13} style={{ color: iconColor }} />
      {tooltipPosition && <span className="pointer-events-none fixed z-50 w-56 rounded px-3 py-2 text-left text-[12px] shadow-xl" style={{ left: tooltipPosition.left, top: tooltipPosition.top, backgroundColor: "#3f4753", color: "#f8fafc" }}>
        <span className="mb-2 block text-[11px]" style={{ color: "#cbd5e1" }}>Estimate</span>
        {rows.map(row => (
          <span key={row.source} className={`flex items-center gap-2 py-1 ${row.active ? "font-semibold" : "opacity-55"}`}>
            <span className="inline-flex w-4">{row.icon}</span>
            <span className={row.active ? "" : "line-through"}>{row.source}</span>
            <span className="ml-auto tabular-nums">{row.value > 0 ? formatCapacityNumber(row.value) : "-"}</span>
            {row.active && <Check size={13} style={{ color: "#86efac" }} />}
          </span>
        ))}
        {trace.manual && <span className="mt-1 block text-[10px]" style={{ color: "#cbd5e1" }}>Manual allocation overrides the default Feature estimate for this Team.</span>}
      </span>}
    </span>
  );
}

function estimateTraceForAllocation(feature: Feature, allocation: CapacityPlanAllocation, viewBy: UnitMode): EstimateTrace {
  const refined = viewBy === "Count" ? feature.refinedWorkItemCountEstimate : feature.refinedEstimate;
  const fallback = viewBy === "Count" ? PRELIMINARY_ESTIMATE_COUNT_FALLBACK : PRELIMINARY_ESTIMATE_POINT_FALLBACK;
  return {
    current: allocation.value > 0 ? "Allocated" : "None",
    allocated: allocation.value,
    refined: typeof refined === "number" && Number.isFinite(refined) ? refined : 0,
    preliminary: fallback[feature.preliminaryEstimate] ?? 0,
    manual: allocation.estimateSource !== "Feature Estimate",
  };
}

function MetricCell({ value, pct, showPercent = true }: { value: number; pct: number; showPercent?: boolean }) {
  return (
    <div className="px-2 text-right tabular-nums whitespace-nowrap">
      <span>{formatCapacityNumber(value)}</span>
      {showPercent && <span className="ml-1 text-[10px]" style={{ color: "#6b5dd3" }}>{pct}%</span>}
    </div>
  );
}

function HeaderSortIcons() {
  return <span className="inline-flex items-center gap-0.5" style={{ color: "#5c6478" }}><ArrowUp size={11} /><ArrowDown size={11} /></span>;
}

function TeamHeaderCell({ children, align = "left" }: { children: string; align?: "left" | "right" | "center" }) {
  const alignment = align === "right" ? "justify-end text-right" : align === "center" ? "justify-center text-center" : "justify-between";
  return (
    <div className={`flex h-full items-center gap-1 border-l px-2 first:border-l-0 ${alignment}`} style={{ borderColor: "#d9dee7" }}>
      <span>{children}</span><HeaderSortIcons />
    </div>
  );
}

function FeatureAttentionBadge({ count }: { count: number }) {
  const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number } | null>(null);
  if (count <= 0) return null;
  function showTooltip(target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    const tooltipWidth = 220;
    const left = Math.max(8, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 8));
    const top = Math.max(8, rect.top - 38);
    setTooltipPosition({ left, top });
  }
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={event => showTooltip(event.currentTarget)}
      onMouseLeave={() => setTooltipPosition(null)}
      onFocus={event => showTooltip(event.currentTarget)}
      onBlur={() => setTooltipPosition(null)}
    >
      <span
        aria-label={`${count} ${count === 1 ? "Feature requires" : "Features require"} attention`}
        tabIndex={0}
        className="inline-flex h-5 min-w-9 items-center justify-center gap-1 rounded-full px-1.5 text-[11px] font-semibold text-white"
        style={{ backgroundColor: "#dc2626", boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.12)" }}
      >
        <AlertTriangle size={12} fill="#fff" />
        <span>{count}</span>
      </span>
      {tooltipPosition && (
        <span
          className="pointer-events-none fixed z-50 rounded px-2.5 py-1.5 text-[12px] text-white shadow-lg"
          style={{ left: tooltipPosition.left, top: tooltipPosition.top, backgroundColor: "#374151" }}
        >
          {count} {count === 1 ? "Feature requires" : "Features require"} attention
        </span>
      )}
    </span>
  );
}

function ProgressCell({ children }: { children: ReactNode }) {
  return <div className="px-3">{children}</div>;
}

function MetricSwatch({ kind }: { kind: BreakdownItem["kind"] }) {
  return (
    <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{
      backgroundColor: kind === "complete" ? "#5b8fe6" : kind === "rollup" ? "#cfe0ff" : kind === "capacity" ? "#dff8e8" : "repeating-linear-gradient(-45deg,#dfe5ee 0,#dfe5ee 3px,#ffffff 3px,#ffffff 6px)",
      border: `1px solid ${kind === "capacity" ? "#4fc281" : kind === "rollup" ? "#4b82f3" : kind === "complete" ? "#1f64c8" : "#b8c2d0"}`,
    }} />
  );
}

function SummaryMetric({ label, value, pct, kind }: { label: string; value: number; pct?: number; kind?: BreakdownItem["kind"] }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 text-[12px]" style={{ color: "#3a4254" }}>
      {kind && <MetricSwatch kind={kind} />}
      <span>{label} <b>{formatCapacityNumber(value)}</b></span>
      {pct !== undefined && <span className="text-[10px]" style={{ color: "#6b5dd3" }}>{pct}%</span>}
    </div>
  );
}

type BreakdownItem = { label: string; value: number; pct: number; kind: "complete" | "rollup" | "estimated" | "capacity" };
type CapacityWarning = { label: string };

function getCapacityWarnings(rollup: number, estimated: number, capacity: number, includeCapacity: boolean): CapacityWarning[] {
  return [
    ...(rollup > estimated ? [{ label: "Rollup exceeds Estimated" }] : []),
    ...(includeCapacity && rollup > capacity ? [{ label: "Rollup exceeds Capacity" }] : []),
    ...(includeCapacity && estimated > capacity ? [{ label: "Estimated exceeds Capacity" }] : []),
  ];
}

function WarningIndicator({ messages }: { messages: string[] }) {
  const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number } | null>(null);
  if (messages.length === 0) return null;
  function showTooltip(target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    const tooltipWidth = 210;
    const left = Math.max(8, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 8));
    const top = Math.min(rect.bottom + 8, window.innerHeight - 80);
    setTooltipPosition({ left, top });
  }
  return (
    <span
      className="relative inline-flex cursor-help"
      tabIndex={0}
      aria-label={messages.join(", ")}
      onMouseEnter={event => showTooltip(event.currentTarget)}
      onMouseLeave={() => setTooltipPosition(null)}
      onFocus={event => showTooltip(event.currentTarget)}
      onBlur={() => setTooltipPosition(null)}
    >
      <AlertTriangle size={14} fill="#fee2e2" style={{ color: "#dc2626" }} />
      {tooltipPosition && (
        <span className="pointer-events-none fixed z-50 rounded px-2.5 py-1.5 text-[12px] text-white shadow-lg" style={{ left: tooltipPosition.left, top: tooltipPosition.top, backgroundColor: "#374151" }}>
          {messages.map(message => <span key={message} className="block whitespace-nowrap">{message}</span>)}
        </span>
      )}
    </span>
  );
}

function CapacityBreakdownTooltip({ items, position, showPercent, warnings }: { items: BreakdownItem[]; position: { left: number; top: number } | null; showPercent: boolean; warnings: CapacityWarning[] }) {
  if (!position) return null;
  return (
    <div className="pointer-events-none fixed z-50 min-w-52 rounded bg-white p-3 text-[12px] shadow-lg" style={{ left: position.left, top: position.top, border: "1px solid #d9dee7", color: "#1a2234" }}>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.label} className="grid items-center gap-2" style={{ gridTemplateColumns: showPercent ? "14px 1fr auto auto" : "14px 1fr auto" }}>
            <span className="h-3.5 w-3.5" style={{
              backgroundColor: item.kind === "complete" ? "#5b8fe6" : item.kind === "rollup" ? "#cfe0ff" : item.kind === "capacity" ? "#dff8e8" : "repeating-linear-gradient(-45deg,#dfe5ee 0,#dfe5ee 3px,#ffffff 3px,#ffffff 6px)",
              border: `1px solid ${item.kind === "capacity" ? "#4fc281" : item.kind === "rollup" ? "#4b82f3" : item.kind === "complete" ? "#1f64c8" : "#b8c2d0"}`,
            }} />
            <span>{item.label}</span>
            <span className="text-right font-semibold">{formatCapacityNumber(item.value)}</span>
            {item.kind === "capacity"
              ? <span className="text-[10px]" style={{ color: "#b45309" }}>base</span>
              : showPercent ? <span className="text-[10px]" style={{ color: "#d946ef" }}>{item.pct}%</span> : null}
          </div>
        ))}
        {warnings.length > 0 && (
          <div className="space-y-1 pt-2" style={{ borderTop: "1px solid #edf0f4" }}>
            {warnings.map(warning => (
              <div key={warning.label} className="flex items-center gap-1.5" style={{ color: "#dc2626" }}>
                <AlertTriangle size={14} fill="#fee2e2" />
                <span>{warning.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ complete, rollup, estimated, capacity, showCapacity = true, showPercent = true }: { complete: number; rollup: number; estimated: number; capacity: number; showCapacity?: boolean; showPercent?: boolean }) {
  const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number } | null>(null);
  const base = showCapacity ? capacity : Math.max(complete, rollup, estimated, 1);
  const completePct = pctOfBase(complete, base);
  const rollupPct = pctOfBase(rollup, base);
  const estimatedPct = pctOfBase(estimated, base);
  const warnings = getCapacityWarnings(rollup, estimated, capacity, showCapacity);
  const items: BreakdownItem[] = [
    { label: "Complete", value: complete, pct: completePct, kind: "complete" },
    { label: "Rollup", value: rollup, pct: rollupPct, kind: "rollup" },
    { label: "Estimated", value: estimated, pct: estimatedPct, kind: "estimated" },
    ...(showCapacity ? [{ label: "Capacity", value: capacity, pct: 100, kind: "capacity" as const }] : []),
  ];
  function showTooltip(target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    const tooltipWidth = 236;
    const left = Math.max(8, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 8));
    const top = Math.min(rect.bottom + 8, window.innerHeight - 190);
    setTooltipPosition({ left, top });
  }
  return (
    <div
      className="group relative flex items-center justify-center"
      onMouseEnter={event => showTooltip(event.currentTarget)}
      onMouseLeave={() => setTooltipPosition(null)}
      onFocus={event => showTooltip(event.currentTarget)}
      onBlur={() => setTooltipPosition(null)}
    >
      <div
        className="relative h-5 w-full max-w-[440px] overflow-hidden rounded-sm"
        style={{ backgroundColor: "#f8fafc", border: `1px solid ${showCapacity ? "#57c083" : "#c8d3e0"}` }}
        aria-label={showPercent
          ? `Capacity progress complete ${completePct}% rollup ${rollupPct}% estimated ${estimatedPct}%${warnings.length ? ` ${warnings.map(warning => warning.label).join(" ")}` : ""}`
          : `Feature progress complete ${formatCapacityNumber(complete)} rollup ${formatCapacityNumber(rollup)} estimated ${formatCapacityNumber(estimated)}${warnings.length ? ` ${warnings.map(warning => warning.label).join(" ")}` : ""}`}
        tabIndex={0}
      >
        <div className="absolute inset-y-0 left-0" style={{ width: `${Math.min(100, Math.max(0, estimatedPct))}%`, backgroundImage: "repeating-linear-gradient(-45deg,#dfe5ee 0,#dfe5ee 5px,#ffffff 5px,#ffffff 10px)" }} />
        <div className="absolute inset-y-0 left-0" style={{ width: `${Math.min(100, Math.max(0, rollupPct))}%`, backgroundColor: "#cfe0ff", borderRight: "1px solid #4b82f3" }} />
        <div className="absolute inset-y-0 left-0" style={{ width: `${Math.min(100, Math.max(0, completePct))}%`, backgroundColor: "#5b8fe6", borderRight: completePct > 0 ? "1px solid #1f64c8" : undefined }} />
        {warnings.length > 0 && (
          <div className="absolute inset-y-0 right-0 flex w-10 items-center justify-center" style={{ backgroundColor: "#fee2e2", borderLeft: "1px solid #dc2626", boxShadow: "inset 0 0 0 1px #dc2626" }}>
            <AlertTriangle size={14} fill="#fff" style={{ color: "#dc2626" }} />
          </div>
        )}
      </div>
      <CapacityBreakdownTooltip items={items} position={tooltipPosition} showPercent={showPercent} warnings={warnings} />
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
  // Team mode lists every Feature across the Project's Teams and keeps the ones
  // already added visible, so the planner can see what is already in this Team
  // instead of the row silently disappearing. Plan mode still hides Features
  // that are already in the plan, because that list is about what is missing.
  const candidates = features.filter(feature =>
    (teamName ? true : !inPlan.has(feature.id)) &&
    `${feature.id} ${feature.name} ${feature.project} ${feature.team || ""}`.toLowerCase().includes(search.toLowerCase())
  );
  const addableCount = candidates.filter(feature => !inTeam.has(feature.id)).length;
  function toggle(featureId: string) {
    if (teamName && inTeam.has(featureId)) return;
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
          <span className="text-[12px]" style={{ color: "#5c6478" }}>Total Work Items: {candidates.length}{teamName ? ` · ${addableCount} available to add` : ""}</span>
        </div>
        <div className="flex-1 overflow-auto px-5 py-3">
          <div style={{ border: "1px solid #d9dee7" }}>
            <div className="grid h-9 items-center px-3 text-[11px] font-semibold uppercase" style={{ gridTemplateColumns: ADD_FEATURES_GRID, backgroundColor: "#f7f8fa", borderBottom: "1px solid #d9dee7", color: "#1a2234" }}>
              <div /><div>ID</div><div>Name</div><div>Project</div><div>Team</div><div>Allocation</div>
            </div>
            {candidates.map(feature => {
              const featureAllocations = plan.allocations.filter(allocation => allocation.featureId === feature.id);
              const alreadyInTeam = Boolean(teamName) && inTeam.has(feature.id);
              const allocationLabel = featureAllocations.length === 0
                ? "Not in plan"
                : featureAllocations.every(allocation => !allocation.team)
                  ? "Unallocated"
                  : `In ${featureAllocations.map(allocation => allocation.team || "Unallocated").join(", ")}`;
              return (
                <label key={feature.id} className="grid min-h-10 items-center px-3 text-[12px]" style={{ gridTemplateColumns: ADD_FEATURES_GRID, borderBottom: "1px solid #edf0f4", color: alreadyInTeam ? "#8c94a6" : "#1a2234", backgroundColor: alreadyInTeam ? "#f7f8fa" : undefined }}>
                  <input type="checkbox" disabled={alreadyInTeam} checked={alreadyInTeam || selected.has(feature.id)} onChange={() => toggle(feature.id)} />
                  <span className="font-mono" style={{ color: alreadyInTeam ? "#8c94a6" : "#2558a6" }}>{feature.id}</span>
                  <span className="truncate">{feature.name}</span>
                  <span>{feature.project}</span>
                  <span className="truncate">{feature.team || "—"}</span>
                  {alreadyInTeam
                    ? <span className="inline-flex w-fit items-center gap-1 px-1.5 py-0.5 text-[11px] font-semibold rounded-sm" style={{ backgroundColor: "#eef6f0", color: "#1e6930", border: "1px solid #bad7c1" }}><Check size={11} /> Added</span>
                    : <span style={{ color: "#5c6478" }}>{allocationLabel}</span>}
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
  const refinedRaw = viewBy === "Count" ? feature.refinedWorkItemCountEstimate : feature.refinedEstimate;
  const refinedValue = typeof refinedRaw === "number" && Number.isFinite(refinedRaw) ? refinedRaw : 0;
  // Live preview of what the Feature's Estimated will become once applied, since
  // Estimated prefers total allocated over any top-down forecast.
  const draftTotal = rows
    .filter(row => row.team)
    .reduce((sum, row) => sum + (row.value.trim() === "" ? sourceEstimate : Math.max(0, Number(row.value) || 0)), 0);
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
          <p className="text-[12px]" style={{ color: "#3a4254" }}>Select the Teams that will contribute to the Portfolio Item below to model capacity in this plan.</p>
          <div style={{ border: "1px solid #d9dee7" }}>
            <div className="grid items-center px-3 h-8 text-[10px] font-semibold uppercase" style={{ gridTemplateColumns: "74px minmax(180px,1fr) 96px 96px", backgroundColor: "#f7f8fa", borderBottom: "1px solid #d9dee7", color: "#1a2234" }}>
              <div>ID</div><div>Name</div><div className="text-right">Prelim Estimate</div><div className="text-right">Refined Estimate</div>
            </div>
            <div className="grid items-center px-3 min-h-10 text-[12px]" style={{ gridTemplateColumns: "74px minmax(180px,1fr) 96px 96px", color: "#1a2234" }}>
              <div className="font-mono text-[#2558a6]">{feature.id}</div>
              <div className="truncate">{feature.name}</div>
              <div className="text-right">{feature.preliminaryEstimate}</div>
              <div className="text-right">{refinedValue > 0 ? formatCapacityNumber(refinedValue) : "—"}</div>
            </div>
          </div>
          <p className="text-[11px]" style={{ color: "#5c6478" }}>Leave Estimate blank to commit the Feature's top-down estimate ({formatCapacityNumber(sourceEstimate)} {viewBy.toLowerCase()}{refinedValue > 0 ? ", from Refined Estimate" : `, from Preliminary Estimate ${feature.preliminaryEstimate}`}). Enter a value to make a fixed manual allocation. Once any Team is allocated, the Feature's Estimated becomes the total allocated.</p>
          <div style={{ border: "1px solid #d9dee7" }}>
            <div className="grid items-center px-3 h-8 text-[10px] font-semibold uppercase" style={{ gridTemplateColumns: "28px minmax(180px,1fr) 120px", backgroundColor: "#f7f8fa", borderBottom: "1px solid #d9dee7", color: "#1a2234" }}>
              <div /><div>Team</div><div className="text-right">Estimate ({viewBy})</div>
            </div>
            {rows.map((row, index) => (
              <div key={index} className="grid items-center gap-2 px-3 py-2" style={{ gridTemplateColumns: "28px minmax(180px,1fr) 120px", borderTop: index === 0 ? "none" : "1px solid #edf0f4" }}>
                <button disabled={rows.length === 1} onClick={() => setRows(previous => previous.filter((_, rowIndex) => rowIndex !== index))} className="p-1 disabled:opacity-30" style={{ color: "#2f6fd6" }} aria-label={`Remove allocation row ${index + 1}`}><Minus size={14} /></button>
                <select aria-label={`Allocation row ${index + 1} team`} value={row.team} onChange={event => updateRow(index, { team: event.target.value })} className="w-full rounded bg-white px-2 py-2 text-[12px]" style={{ border: "1px solid #c8d3e0" }}>
                  <option value="">Select a Team...</option>
                  {plan.teams.filter(team => !assigned.has(team.team) || team.team === row.team).map(team => <option key={team.team} value={team.team}>{team.team}</option>)}
                </select>
                <input aria-label={`Allocation row ${index + 1} estimate`} value={row.value} onChange={event => updateRow(index, { value: event.target.value })} inputMode="decimal" placeholder={formatCapacityNumber(sourceEstimate)} className="w-full rounded px-2 py-2 text-right text-[12px]" style={{ border: "1px solid #c8d3e0" }} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => setRows(previous => [...previous, { team: "", value: "" }])} className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "#2f6fd6" }}><Plus size={14} /> Add Team</button>
            <span className="text-[11px]" style={{ color: "#5c6478" }}>Total allocated: <b>{formatCapacityNumber(draftTotal)}</b> {viewBy.toLowerCase()}</span>
          </div>
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
  permissionMatrix: RoleActionRow[];
  onCreateCapacityPlan: (input: NewCapacityPlanInput) => CapacityPlan;
  onUpdateCapacityPlan: (id: string, updater: (plan: CapacityPlan) => CapacityPlan) => void;
  onPublishCapacityPlan: (id: string, updateFields?: boolean) => void;
};

export function CapacityPlanningPage({ role, project, releases, features, workItems, capacityPlans, permissionMatrix, onCreateCapacityPlan, onUpdateCapacityPlan, onPublishCapacityPlan }: CapacityPlanningPageProps) {
  const [search, setSearch] = useState("");
  const [releaseFilter, setReleaseFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [detailTab, setDetailTab] = useState<"teams" | "features">("teams");
  const [teamSort] = useState<"name" | "capacity">("name");
  const [featureSort, setFeatureSort] = useState<"rank" | "name" | "estimated" | "rollup">("rank");
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [addFeaturesTeam, setAddFeaturesTeam] = useState<string | null>(null);
  const [showAddFeaturesPlan, setShowAddFeaturesPlan] = useState(false);
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const [showPlanBreakdown, setShowPlanBreakdown] = useState(false);
  // Allocation row whose per-row settings menu (rank Move up / Move down) is open.
  const [openRowMenu, setOpenRowMenu] = useState<{ id: string; left: number; top: number } | null>(null);
  const [allocateFeatureId, setAllocateFeatureId] = useState<string | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const projectPlans = capacityPlans.filter(plan => plan.projectKey === project.key);
  const releaseOptions = releases.filter(release => release.projectKey === project.key);
  const visiblePlans = projectPlans.filter(plan => {
    const matchesSearch = `${plan.id} ${plan.name} ${plan.release}`.toLowerCase().includes(search.toLowerCase());
    const matchesRelease = releaseFilter === "All" || plan.releaseId === releaseFilter;
    // A Project Member only sees a plan once it is Published; Draft plans are
    // planning-in-progress and stay hidden from them entirely.
    const visibleToRole = role !== "Project Member" || plan.status === "Published";
    return matchesSearch && matchesRelease && visibleToRole;
  });
  const resolvedPlan = activePlanId ? capacityPlans.find(plan => plan.id === activePlanId) || null : null;
  // Mirrors the list rule above so a Draft plan cannot be reached by a Project
  // Member through stale state either.
  const activePlan = resolvedPlan && role === "Project Member" && resolvedPlan.status !== "Published" ? null : resolvedPlan;
  const canManageActivePlan = activePlan ? canManageCapacityPlan(role, activePlan.projectKey, permissionMatrix) : false;
  const canPublishActivePlan = canManageActivePlan;
  const canCreatePlan = canManageCapacityPlan(role, project.key, permissionMatrix);
  const editable = Boolean(activePlan && canManageActivePlan && activePlan.status === "Draft");
  const publishable = Boolean(activePlan && canPublishActivePlan && activePlan.status === "Draft");

  const eligibleFeatures = useMemo(() => {
    if (!activePlan) return [];
    return features.filter(feature =>
      feature.project === activePlan.projectKey &&
      !feature.archivedAt &&
      feature.status !== "Cancelled" &&
      (feature.release === "Unscheduled" || feature.releaseId === activePlan.releaseId || feature.release === activePlan.release)
    );
  }, [activePlan, features]);

  /**
   * Team-level Add Features lists every Feature across the Project's Teams, so a
   * planner can pull work in regardless of which Team currently owns it - hence
   * the Team column in that dialog. Unlike `eligibleFeatures` there is no Release
   * filter here. Archived and Cancelled Features stay excluded because they are
   * dead records that cannot be planned against.
   */
  const projectFeatures = useMemo(() => {
    if (!activePlan) return [];
    return features.filter(feature =>
      feature.project === activePlan.projectKey &&
      !feature.archivedAt &&
      feature.status !== "Cancelled"
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

  function defaultDirectAllocationValue(featureId: string, existingValue = 0) {
    if (existingValue > 0) return { value: existingValue, estimateSource: "Manual" as const };
    const feature = getPlanFeature(featureId, features);
    return { value: feature ? topDownEstimate(feature, activePlan?.viewBy || "Points") : 0, estimateSource: "Feature Estimate" as const };
  }

  function addFeaturesToPlan(featureIds: string[], team: string) {
    updatePlan(plan => {
      let nextRank = Math.max(0, ...plan.allocations.map(allocation => allocation.rank)) + 1;
      const nextAllocations = [...plan.allocations];
      featureIds.forEach(featureId => {
        if (nextAllocations.some(allocation => allocation.featureId === featureId && allocation.team === team)) return;
        const unallocatedIndex = nextAllocations.findIndex(allocation => allocation.featureId === featureId && !allocation.team);
        if (unallocatedIndex >= 0) {
          const defaultValue = defaultDirectAllocationValue(featureId, nextAllocations[unallocatedIndex].value);
          nextAllocations[unallocatedIndex] = { ...nextAllocations[unallocatedIndex], team, ...defaultValue };
          return;
        }
        nextAllocations.push({ id: newAllocationId(), featureId, team, ...defaultDirectAllocationValue(featureId), rank: nextRank });
        nextRank += 1;
      });
      return { ...plan, lastUpdated: "Just now", allocations: nextAllocations };
    });
  }

  /**
   * Reorders one allocation inside its own Team by swapping rank with the
   * adjacent row. Scoped to the Team because the expanded Feature list is
   * per-Team, so moving a row must not reshuffle another Team's order.
   */
  function moveAllocationRank(allocationId: string, direction: -1 | 1) {
    updatePlan(plan => {
      const moving = plan.allocations.find(allocation => allocation.id === allocationId);
      if (!moving) return plan;
      const siblings = plan.allocations
        .filter(allocation => allocation.team === moving.team)
        .sort((a, b) => a.rank - b.rank);
      const index = siblings.findIndex(allocation => allocation.id === allocationId);
      const target = siblings[index + direction];
      if (!target) return plan;
      return {
        ...plan,
        lastUpdated: "Just now",
        allocations: plan.allocations.map(allocation => {
          if (allocation.id === moving.id) return { ...allocation, rank: target.rank };
          if (allocation.id === target.id) return { ...allocation, rank: moving.rank };
          return allocation;
        }),
      };
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

  function moveFeatureRank(featureId: string, direction: -1 | 1) {
    updatePlan(plan => {
      const orderedFeatureIds = [...new Set(plan.allocations.map(allocation => allocation.featureId))]
        .map(id => ({
          id,
          rank: Math.min(...plan.allocations.filter(allocation => allocation.featureId === id).map(allocation => allocation.rank)),
        }))
        .sort((left, right) => left.rank - right.rank)
        .map(row => row.id);
      const index = orderedFeatureIds.indexOf(featureId);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= orderedFeatureIds.length) return plan;
      const reordered = [...orderedFeatureIds];
      [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
      const nextRankByFeature = new Map(reordered.map((id, rowIndex) => [id, rowIndex + 1]));
      return {
        ...plan,
        lastUpdated: "Just now",
        allocations: plan.allocations.map(allocation => ({ ...allocation, rank: nextRankByFeature.get(allocation.featureId) ?? allocation.rank })),
      };
    });
  }

  function assignFeatureTeamFromFeaturesTab(featureId: string, team: string) {
    updatePlan(plan => {
      const featureAllocations = plan.allocations.filter(allocation => allocation.featureId === featureId);
      if (featureAllocations.length > 1) return plan;
      const existing = featureAllocations[0];
      if (!team) {
        if (!existing) return plan;
        return {
          ...plan,
          lastUpdated: "Just now",
          allocations: plan.allocations.map(allocation => allocation.id === existing.id ? { ...allocation, team: undefined } : allocation),
        };
      }
      const defaultValue = defaultDirectAllocationValue(featureId, existing?.value || 0);
      if (existing) {
        return {
          ...plan,
          lastUpdated: "Just now",
          allocations: plan.allocations.map(allocation => allocation.id === existing.id ? { ...allocation, team, ...defaultValue } : allocation),
        };
      }
      const nextRank = Math.max(0, ...plan.allocations.map(allocation => allocation.rank)) + 1;
      return {
        ...plan,
        lastUpdated: "Just now",
        allocations: [...plan.allocations, { id: newAllocationId(), featureId, team, ...defaultValue, rank: nextRank }],
      };
    });
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

  function removeFeatureFromPlan(featureId: string) {
    updatePlan(plan => ({
      ...plan,
      lastUpdated: "Just now",
      // Plan removal is Feature-wide: a split Feature disappears from every
      // Team in this plan, while the Portfolio Feature itself is untouched.
      allocations: plan.allocations.filter(allocation => allocation.featureId !== featureId),
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
        const feature = getPlanFeature(allocation.featureId, features);
        return feature ? getFeatureMetrics(feature, workItems, activePlan.viewBy, team.team) : null;
      }).filter((metric): metric is ReturnType<typeof getFeatureMetrics> => Boolean(metric));
      const teamEstimated = teamAllocations.reduce((sum, allocation) => sum + allocation.value, 0);
      return {
        demand: totals.demand + teamEstimated,
        complete: totals.complete + metrics.reduce((sum, metric) => sum + metric.complete, 0),
        rollup: totals.rollup + metrics.reduce((sum, metric) => sum + metric.rollup, 0),
        estimated: totals.estimated + teamEstimated,
        capacity: totals.capacity + team.capacity,
      };
    }, { demand: 0, complete: 0, rollup: 0, estimated: 0, capacity: 0 });
    const planCompletePct = pctOfBase(planTotals.complete, planTotals.capacity);
    const planRollupPct = pctOfBase(planTotals.rollup, planTotals.capacity);
    const planEstimatedPct = pctOfBase(planTotals.estimated, planTotals.capacity);
    const featureRows = [...uniqueFeatureIdsInPlan].map(featureId => {
      const feature = getPlanFeature(featureId, features);
      if (!feature) return null;
      const allocations = activePlan.allocations.filter(allocation => allocation.featureId === featureId);
      const execution = getFeatureMetrics(feature, workItems, activePlan.viewBy);
      const estimate = featureEstimated(feature, activePlan.allocations, activePlan.viewBy);
      const estimated = estimate.value;
      const estimateSource = estimate.source;
      const rollup = execution.rollup;
      const completed = execution.complete;
      const planRank = Math.min(...allocations.map(allocation => allocation.rank));
      return { feature, allocations, estimated, estimateSource, rollup, completed, completePct: floorPct(completed, rollup), planRank };
    }).filter((row): row is { feature: Feature; allocations: CapacityPlanAllocation[]; estimated: number; estimateSource: EstimateSource; rollup: number; completed: number; completePct: number; planRank: number } => Boolean(row)).sort((left, right) => {
      if (featureSort === "name") return left.feature.name.localeCompare(right.feature.name);
      if (featureSort === "estimated") return right.estimated - left.estimated;
      if (featureSort === "rollup") return right.rollup - left.rollup;
      return left.planRank - right.planRank;
    });
    let cumulativeEstimate = 0;
    let cutlineAfterId: string | null = null;
    if (featureSort === "rank" && planTotals.capacity > 0) {
      for (const row of featureRows) {
        cumulativeEstimate += row.estimated;
        if (cumulativeEstimate >= planTotals.capacity) { cutlineAfterId = row.feature.id; break; }
      }
    }
    const allocatingFeature = allocateFeatureId ? getPlanFeature(allocateFeatureId, features) : undefined;

    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f0f2f5]">
        <div className="h-12 shrink-0 flex items-center px-4 gap-3 text-white" style={{ backgroundColor: "#17365d" }}>
          <button aria-label="Back to capacity plans" onClick={() => setActivePlanId(null)} className="p-1.5 rounded bg-white/10"><ArrowLeft size={15} /></button>
          {publishable && (
            <div className="relative">
              <button aria-label="Publish actions" aria-expanded={showPublishMenu} onClick={() => setShowPublishMenu(previous => !previous)} className="rounded bg-white p-1.5 shadow-sm" style={{ color: "#2558a6" }}>
                <MoreVertical size={17} />
              </button>
              {showPublishMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowPublishMenu(false)} />
                  <div className="absolute left-0 top-9 z-40 w-56 rounded bg-white py-1 text-[12px] shadow-xl" style={{ border: "1px solid #cfd6e3", color: "#1a2234" }}>
                    <button onClick={() => { onPublishCapacityPlan(activePlan.id, false); setShowPublishMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[#f4f6f9]"><Send size={13} /> Publish Without Updating Fields</button>
                    <button onClick={() => { onPublishCapacityPlan(activePlan.id, true); setShowPublishMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[#f4f6f9]"><Send size={13} /> Publish</button>
                  </div>
                </>
              )}
            </div>
          )}
          <div className="font-mono text-[18px] font-semibold">{activePlan.id}</div>
          <div className="text-[15px] font-semibold truncate">{activePlan.name}</div>
          <CapacityStatusBadge status={activePlan.status} />
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full" style={{ color: "#4c1d95", backgroundColor: "#f3e8ff" }}>{activePlan.release}</span>
          <div className="flex-1" />
          <div className="w-[36rem] max-w-[64vw]">
            <ProgressBar complete={planTotals.complete} rollup={planTotals.rollup} estimated={planTotals.estimated} capacity={planTotals.capacity} />
          </div>
          {activePlan.status === "Published" && canPublishActivePlan && <button onClick={() => updatePlan(plan => ({ ...plan, status: "Draft", lastUpdated: "Just now" }))} className="px-3 py-1.5 text-[12px] font-semibold rounded text-white" style={{ backgroundColor: "#5c6478" }}>Revert to Draft</button>}
        </div>
        <div className="h-14 shrink-0 flex items-center justify-between px-4 bg-white" style={{ borderBottom: "1px solid #d9dee7" }}>
          <div className="flex items-center gap-5 text-[12px] [&>span:nth-child(n+3)]:hidden">
            <span>Portfolio Item Type <span className="ml-1"><TypeBadge type="Feature" /></span></span>
            <span><b>{assignedIds.size}</b> Assigned · <b>{unassignedAllocations.length}</b> Unassigned</span>
            <span><b>{eligibleFeatures.length}</b> Eligible · <b>{assignedIds.size}</b> Assigned · <b>{unassignedAllocations.length}</b> Unassigned</span>
            <span>View by <b>{activePlan.viewBy}</b></span>
          </div>
          <div className="relative">
            <div className="flex items-center rounded overflow-hidden" style={{ border: "1px solid #c8d3e0" }}>
              <div className="px-3 py-2 text-[12px] font-semibold" style={{ backgroundColor: "#dfe8f4", color: "#3a4254" }}>{activePlan.viewBy}</div>
              <SummaryMetric label="Complete" value={planTotals.complete} pct={planCompletePct} kind="complete" />
              <SummaryMetric label="Demand" value={planTotals.demand} />
              <SummaryMetric label="Rollup" value={planTotals.rollup} pct={planRollupPct} kind="rollup" />
              <SummaryMetric label="Estimated" value={planTotals.estimated} pct={planEstimatedPct} kind="estimated" />
              <SummaryMetric label="Capacity" value={planTotals.capacity} kind="capacity" />
              <button onClick={() => setShowPlanBreakdown(previous => !previous)} className="px-3 py-2 text-[12px]" style={{ color: "#2f6fd6", borderLeft: "1px solid #c8d3e0", backgroundColor: showPlanBreakdown ? "#eef4ff" : "#fff" }}>Breakdown</button>
            </div>
            {showPlanBreakdown && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowPlanBreakdown(false)} />
                <div className="absolute right-0 top-11 z-40 w-[360px] rounded bg-white p-4 text-[12px] shadow-xl" style={{ border: "1px solid #d9dee7", color: "#1a2234" }}>
                  <h3 className="mb-3 text-right text-[15px] font-semibold" style={{ color: "#3a4254" }}>By {activePlan.viewBy}</h3>
                  <div className="mb-4 pl-[86px] pr-[70px]">
                    <ProgressBar complete={planTotals.complete} rollup={planTotals.rollup} estimated={planTotals.estimated} capacity={planTotals.capacity} />
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Complete", value: planTotals.complete, pct: planCompletePct, kind: "complete" as const, leftPct: 0, widthPct: planCompletePct },
                      { label: "Rollup", value: planTotals.rollup, pct: planRollupPct, kind: "rollup" as const, leftPct: planCompletePct, widthPct: Math.max(0, planRollupPct - planCompletePct) },
                      { label: "Estimated", value: planTotals.estimated, pct: planEstimatedPct, kind: "estimated" as const, leftPct: planRollupPct, widthPct: Math.max(0, planEstimatedPct - planRollupPct) },
                      { label: "Capacity", value: planTotals.capacity, pct: 100, kind: "capacity" as const, leftPct: 0, widthPct: 100 },
                    ].map(item => {
                      const isEstimated = item.kind === "estimated";
                      const segmentFill = item.kind === "complete" ? "#5b8fe3" : item.kind === "rollup" ? "#cfe0fb" : item.kind === "capacity" ? "#d8f6df" : "#fff";
                      const segmentBorder = item.kind === "complete" ? "#1f5cb8" : item.kind === "rollup" ? "#3f7bf0" : item.kind === "capacity" ? "#58ca82" : "#c8d3e0";
                      return (
                      <div key={item.label} className="grid items-center gap-2" style={{ gridTemplateColumns: "76px 1fr 54px 34px" }}>
                        <span className="text-right">{item.label}</span>
                        <div className="relative h-3.5 rounded-sm" style={{ backgroundColor: "#f8fafc", border: "1px solid #d9dee7" }}>
                          <span
                            className="absolute top-0 h-full rounded-sm"
                            style={{
                              left: `${Math.min(100, Math.max(0, item.leftPct))}%`,
                              width: `${Math.min(100, Math.max(0, item.widthPct))}%`,
                              backgroundColor: segmentFill,
                              backgroundImage: isEstimated ? "repeating-linear-gradient(-45deg, #edf2f8 0, #edf2f8 5px, #cbd5e1 5px, #cbd5e1 8px)" : undefined,
                              border: `1px solid ${segmentBorder}`,
                            }}
                          />
                        </div>
                        <span className="font-semibold tabular-nums">{formatCapacityNumber(item.value)}</span>
                        <span className="text-[10px]" style={{ color: item.kind === "capacity" ? "#b45309" : "#d946ef" }}>{item.kind === "capacity" ? "base" : `${item.pct}%`}</span>
                      </div>
                    );})}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="h-12 shrink-0 flex items-end gap-6 px-4 bg-white" style={{ borderBottom: "1px solid #d9dee7" }}>
          <button onClick={() => setDetailTab("teams")} className="h-9 px-2 text-[13px] font-semibold" style={{ color: detailTab === "teams" ? "#0b5cad" : "#5c6478", borderBottom: detailTab === "teams" ? "2px solid #2f6fd6" : "2px solid transparent" }}>Teams by Total</button>
          <button onClick={() => setDetailTab("features")} className="h-9 px-2 text-[13px] font-semibold" style={{ color: detailTab === "features" ? "#0b5cad" : "#5c6478", borderBottom: detailTab === "features" ? "2px solid #2f6fd6" : "2px solid transparent" }}>{"Features"}</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {activePlan.status === "Published" && <div className="mb-4 flex items-center gap-2 rounded px-3 py-2 text-[12px]" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412" }}><CircleAlert size={15} /> Plan has been published — revert to Draft to make changes.</div>}
          {detailTab === "teams" && (
            <div className="mb-4 flex items-center gap-2">
              {/* Add Team and the forecast change the plan, so they follow the edit
                  gate. Sort is a read action and stays available to read-only
                  viewers, matching how the Features tab keeps its own sort. */}
              {editable && <button onClick={() => setShowTeamPicker(true)} className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold rounded text-white" style={{ backgroundColor: "#2f6fd6" }}><Plus size={14} /> Add Team</button>}
              {editable && <button onClick={() => setShowForecast(true)} className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold rounded bg-white" style={{ border: "1px solid #bdd0ef", color: "#2f6fd6" }}><Calculator size={14} /> Calculate Capacity Forecast</button>}
            </div>
          )}
          {detailTab === "teams" ? <>
          <div className="bg-white" style={{ border: "1px solid #d9dee7" }}>
            <div className="grid items-center h-10 text-[11px] font-semibold uppercase" style={{ gridTemplateColumns: TEAM_CAPACITY_GRID, color: "#1a2234", borderBottom: "1px solid #d9dee7" }}>
              <TeamHeaderCell>Team Name</TeamHeaderCell>
              <TeamHeaderCell>Features</TeamHeaderCell>
              <div className="h-full border-l border-r" style={{ borderColor: "#d9dee7" }} />
              <TeamHeaderCell align="right">Complete</TeamHeaderCell>
              <TeamHeaderCell align="right">Rollup</TeamHeaderCell>
              <TeamHeaderCell align="right">Estimated</TeamHeaderCell>
              <TeamHeaderCell align="right">Capacity</TeamHeaderCell>
            </div>
            {sortedTeams.map(team => {
              const teamAllocations = activePlan.allocations.filter(allocation => allocation.team === team.team).sort((a, b) => a.rank - b.rank);
              const metrics = teamAllocations.map(allocation => {
                const feature = getPlanFeature(allocation.featureId, features);
                return feature ? { allocation, feature, ...getFeatureMetrics(feature, workItems, activePlan.viewBy, team.team) } : null;
              }).filter((metric): metric is { allocation: CapacityPlanAllocation; feature: Feature; complete: number; rollup: number; children: WorkItem[] } => Boolean(metric));
              const demand = teamAllocations.reduce((sum, allocation) => sum + allocation.value, 0);
              const complete = metrics.reduce((sum, metric) => sum + metric.complete, 0);
              const rollup = metrics.reduce((sum, metric) => sum + metric.rollup, 0);
              // At Team level Estimated is this Team's committed slice. The
              // Features tab sums every Team slice back to the Feature total.
              const estimated = demand;
              const attentionFeatureCount = metrics.filter(metric =>
                getCapacityWarnings(metric.rollup, metric.allocation.value, team.capacity, false).length > 0
              ).length;
              const expanded = expandedTeams.has(team.team);
              return (
                <div key={team.team} style={{ borderBottom: "1px solid #edf0f4" }}>
                  <div className="grid items-center h-14 px-3 text-[13px]" style={{ gridTemplateColumns: TEAM_CAPACITY_GRID, color: "#1a2234" }}>
                    <button onClick={() => setExpandedTeams(previous => { const next = new Set(previous); next.has(team.team) ? next.delete(team.team) : next.add(team.team); return next; })} className="flex items-center gap-2 text-left font-medium">
                      {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}<Users size={14} style={{ color: "#2558a6" }} />{team.team}
                    </button>
                    <div className="flex items-center justify-start gap-2 px-2 tabular-nums">
                      <span>{new Set(teamAllocations.map(allocation => allocation.featureId)).size}</span>
                      <FeatureAttentionBadge count={attentionFeatureCount} />
                    </div>
                    <ProgressCell><ProgressBar complete={complete} rollup={rollup} estimated={estimated} capacity={team.capacity} /></ProgressCell>
                    <MetricCell value={complete} pct={pctOfBase(complete, team.capacity)} />
                    <MetricCell value={rollup} pct={pctOfBase(rollup, team.capacity)} />
                    <MetricCell value={estimated} pct={pctOfBase(estimated, team.capacity)} />
                    <div className="text-right">{editable ? <input aria-label={`${team.team} capacity`} type="number" min={0} value={team.capacity} onChange={event => updatePlan(plan => ({ ...plan, lastUpdated: "Just now", teams: plan.teams.map(row => row.team === team.team ? { ...row, capacity: Math.max(0, Number(event.target.value)) } : row) }))} className="w-16 px-2 py-1 text-right rounded bg-white" style={{ border: "1px solid #c8d3e0" }} /> : team.capacity}</div>
                  </div>
                  {expanded && (
                    <div className="ml-3 mb-3" style={{ border: "1px solid #d9dee7", marginRight: 120 }}>
                      <div className="overflow-x-auto">
                      <div style={{ minWidth: FEATURE_TABLE_MIN_WIDTH }}>
                      <div className="grid h-8 items-center px-2 text-[10px] font-semibold uppercase" style={{ gridTemplateColumns: FEATURE_CAPACITY_GRID, color: "#1a2234", backgroundColor: "#f7f8fa" }}>
                        <div className="grid gap-2" style={{ gridTemplateColumns: FEATURE_IDENTITY_GRID }}><span /><span>Rank</span><span>ID</span><span>Name</span><span>State</span><span>Allocation</span><span>Dependencies</span></div><div className="h-full border-l" style={{ borderColor: "#d9dee7" }} /><div className="h-full border-l border-r" style={{ borderColor: "#d9dee7" }} /><div className="text-right">Complete</div><div className="text-right">Rollup</div><div className="text-right">Estimated</div>
                      </div>
                      {metrics.map((metric, metricIndex) => {
                        const menuOpen = openRowMenu?.id === metric.allocation.id;
                        // The Feature's own Team (set in Portfolio Items) is its origin. When it
                        // has been split into a different Team, that row states where it came
                        // from; on its own Team's row there is nothing to attribute.
                        const originTeamLabel = metric.feature.team && metric.feature.team !== team.team
                          ? `From ${metric.feature.team}`
                          : "";
                        return (
                          <div key={metric.allocation.id} className="grid min-h-10 items-center px-2 text-[12px]" style={{ gridTemplateColumns: FEATURE_CAPACITY_GRID, borderTop: "1px solid #edf0f4", color: "#1a2234" }}>
                            <div className="grid items-center gap-2 min-w-0" style={{ gridTemplateColumns: FEATURE_IDENTITY_GRID }}>
                              <div className="relative" onClick={event => event.stopPropagation()}>
                                {editable && (
                                  <button
                                    aria-label={`${metric.feature.id} row settings`}
                                    aria-expanded={menuOpen}
                                    onClick={event => {
                                      if (menuOpen) { setOpenRowMenu(null); return; }
                                      const rect = event.currentTarget.getBoundingClientRect();
                                      setOpenRowMenu({ id: metric.allocation.id, left: rect.left, top: rect.bottom + 4 });
                                    }}
                                    className="p-1 rounded"
                                    style={{ color: menuOpen ? "#2f6fd6" : "#8c94a6" }}
                                  >
                                    <Settings size={13} />
                                  </button>
                                )}
                                {menuOpen && (
                                  <>
                                    {/* Click-away layer so the menu closes like the other popovers. */}
                                    <div className="fixed inset-0 z-30" onClick={() => setOpenRowMenu(null)} />
                                    <div className="fixed z-40 w-44 rounded bg-white py-1 shadow-xl" style={{ left: openRowMenu?.left ?? 0, top: openRowMenu?.top ?? 0, border: "1px solid #cfd6e3" }}>
                                      <button
                                        disabled={metricIndex === 0}
                                        onClick={() => { moveAllocationRank(metric.allocation.id, -1); setOpenRowMenu(null); }}
                                        className="flex w-full items-center gap-2 whitespace-nowrap px-3 py-1.5 text-[12px] text-left disabled:opacity-40 hover:bg-[#f4f6f9] disabled:hover:bg-transparent"
                                        style={{ color: "#1a2234" }}
                                      >
                                        <ArrowUp size={12} /> Move up
                                      </button>
                                      <button
                                        disabled={metricIndex === metrics.length - 1}
                                        onClick={() => { moveAllocationRank(metric.allocation.id, 1); setOpenRowMenu(null); }}
                                        className="flex w-full items-center gap-2 whitespace-nowrap px-3 py-1.5 text-[12px] text-left disabled:opacity-40 hover:bg-[#f4f6f9] disabled:hover:bg-transparent"
                                        style={{ color: "#1a2234" }}
                                      >
                                        <ArrowDown size={12} /> Move down
                                      </button>
                                      <div className="my-1 h-px" style={{ backgroundColor: "#edf0f4" }} />
                                      <button
                                        onClick={() => { setAllocateFeatureId(metric.feature.id); setOpenRowMenu(null); }}
                                        className="flex w-full items-center gap-2 whitespace-nowrap px-3 py-1.5 text-[12px] text-left hover:bg-[#f4f6f9]"
                                        style={{ color: "#1a2234" }}
                                      >
                                        <Split size={12} /> Allocate
                                      </button>
                                      <button
                                        onClick={() => { removeFeatureFromPlan(metric.feature.id); setOpenRowMenu(null); }}
                                        className="flex w-full items-center gap-2 whitespace-nowrap px-3 py-1.5 text-[12px] text-left hover:bg-[#fef2f2]"
                                        style={{ color: "#b91c1c" }}
                                        title={`Remove ${metric.feature.id} and all of its Team allocations from this plan`}
                                      >
                                        <X size={12} /> Remove from Plan
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div>{metricIndex + 1}</div>
                              <div className="font-mono text-[#2558a6]">{metric.feature.id}</div>
                              <div className="truncate">{metric.feature.name}</div>
                              <div className="truncate">{metric.feature.status}</div>
                              <div className="truncate">
                                {originTeamLabel
                                  ? <span title={`${metric.feature.id} belongs to ${metric.feature.team}; this row is a split of that Feature into ${team.team}.`} style={{ color: "#6b5dd3" }}>{originTeamLabel}</span>
                                  : <span title={`${team.team} is this Feature's own Team.`} style={{ color: "#8c94a6" }}>—</span>}
                              </div>
                              <div className="truncate" style={{ color: "#8c94a6" }} title="Dependencies are not modelled in this slice.">—</div>
                            </div>
                            <div />
                            <ProgressCell><ProgressBar complete={metric.complete} rollup={metric.rollup} estimated={metric.allocation.value} capacity={team.capacity} showCapacity={false} showPercent={false} /></ProgressCell>
                            <MetricCell value={metric.complete} pct={0} showPercent={false} />
                            <MetricCell value={metric.rollup} pct={0} showPercent={false} />
                            {/* Read-only: this Team's Estimated slice is its allocation value.
                                The Allocate dialog is the only place to change it. */}
                            <div className="flex items-center justify-end gap-1.5 tabular-nums whitespace-nowrap">
                              <span>{formatCapacityNumber(metric.allocation.value)}</span>
                              <EstimateSourceIndicator trace={estimateTraceForAllocation(metric.feature, metric.allocation, activePlan.viewBy)} />
                            </div>
                          </div>
                        );
                      })}
                      {metrics.length === 0 && <div className="px-3 py-4 text-[12px]" style={{ color: "#8c94a6" }}>No Features allocated to this Team.</div>}
                      {editable && (
                        <div className="flex justify-end px-2 py-2" style={{ borderTop: "1px solid #edf0f4", backgroundColor: "#fff" }}>
                          <button onClick={() => setAddFeaturesTeam(team.team)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-semibold rounded text-white" style={{ backgroundColor: "#2f6fd6" }}><Plus size={13} /> Add Features</button>
                        </div>
                      )}
                      </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {visibleTeams.length === 0 && <div className="px-4 py-8 text-[13px]" style={{ color: "#8c94a6" }}>No Teams in this plan yet. Use Add Team to choose leaf projects from Project Breakdown.</div>}
          </div>
          </> : <div className="flex min-h-full gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="hidden" aria-hidden="true">
              <div className="text-[12px]" style={{ color: "#5c6478" }}><b style={{ color: "#1a2234" }}>{featureRows.length}</b> {"Feature"}{featureRows.length === 1 ? "" : "s"} in this plan · allocation is managed from each Feature or an expanded Team.</div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "#5c6478" }}><ArrowDownUp size={13} /> Sort
                <select value={featureSort} onChange={event => setFeatureSort(event.target.value as typeof featureSort)} className="rounded bg-white px-2 py-1 text-[11px]" style={{ border: "1px solid #c8d3e0" }}><option value="rank">Rank</option><option value="name">Name</option><option value="estimated">Estimated</option><option value="rollup">Rollup</option></select>
              </label>
            </div>
            {editable && <button onClick={() => setShowAddFeaturesPlan(true)} className="flex items-center gap-1.5 rounded px-3 py-2 text-[12px] font-semibold text-white" style={{ backgroundColor: "#2f6fd6" }}><Plus size={14} /> Add Feature</button>}
            <div className="overflow-hidden bg-white" style={{ border: "1px solid #d9dee7" }}>
              <div className="overflow-x-auto">
                <div style={{ minWidth: FEATURE_PLAN_MIN_WIDTH }}>
                  <div className="grid h-9 items-center text-[10px] font-semibold uppercase" style={{ gridTemplateColumns: FEATURE_PLAN_GRID, backgroundColor: "#f7f8fa", borderBottom: "1px solid #d9dee7", color: "#1a2234" }}>
                    <div className="flex h-full items-center justify-center px-2" style={{ borderRight: "1px solid #d9dee7" }}><HeaderSortIcons /></div>
                    <TeamHeaderCell>Rank</TeamHeaderCell>
                    <TeamHeaderCell>ID</TeamHeaderCell>
                    <TeamHeaderCell>Name</TeamHeaderCell>
                    <TeamHeaderCell>Planned Team Assignment</TeamHeaderCell>
                    <TeamHeaderCell>Team</TeamHeaderCell>
                    <TeamHeaderCell align="center">Dependencies</TeamHeaderCell>
                    <TeamHeaderCell align="right">Complete</TeamHeaderCell>
                    <TeamHeaderCell align="right">Rollup</TeamHeaderCell>
                    <TeamHeaderCell align="right">Estimated</TeamHeaderCell>
                  </div>
                  {featureRows.map((row, rowIndex) => {
                    const teamAllocations = row.allocations.filter(allocation => allocation.team);
                    const hasManualAllocation = teamAllocations.some(allocation => allocation.estimateSource !== "Feature Estimate");
                    const teamLabel = teamAllocations.length === 0 ? "Not assigned" : teamAllocations.length === 1 ? teamAllocations[0].team : `${teamAllocations.length} teams`;
                    const projectLabel = row.feature.team || "—";
                    const menuId = `feature:${row.feature.id}`;
                    const menuOpen = openRowMenu?.id === menuId;
                    const rollupWarnings = row.rollup > row.estimated ? ["Rollup exceeds Estimated"] : [];
                    const estimateWarnings = row.estimateSource === "None" ? ["Point Estimated missing"] : [];
                    const refinedEstimate = activePlan.viewBy === "Count" ? row.feature.refinedWorkItemCountEstimate : row.feature.refinedEstimate;
                    const preliminaryEstimate = (activePlan.viewBy === "Count" ? PRELIMINARY_ESTIMATE_COUNT_FALLBACK : PRELIMINARY_ESTIMATE_POINT_FALLBACK)[row.feature.preliminaryEstimate] ?? 0;
                    const allocatedEstimate = teamAllocations.reduce((sum, allocation) => sum + allocation.value, 0);
                    return <div key={row.feature.id}>
                      <div className="grid min-h-11 items-center text-[12px]" style={{ gridTemplateColumns: FEATURE_PLAN_GRID, borderBottom: "1px solid #edf0f4", color: "#1a2234" }}>
                        <div className="relative flex items-center gap-1 px-2" onClick={event => event.stopPropagation()}>
                          {teamAllocations.length > 1 ? <ChevronDown size={13} style={{ color: "#2558a6" }} /> : <span className="w-[13px]" />}
                          {editable && (
                            <button
                              aria-label={`${row.feature.id} feature settings`}
                              aria-expanded={menuOpen}
                              onClick={event => {
                                if (menuOpen) { setOpenRowMenu(null); return; }
                                const rect = event.currentTarget.getBoundingClientRect();
                                setOpenRowMenu({ id: menuId, left: rect.left, top: rect.bottom + 4 });
                              }}
                              className="rounded p-1"
                              style={{ color: menuOpen ? "#2f6fd6" : "#8c94a6" }}
                            >
                              <Settings size={13} />
                            </button>
                          )}
                          {menuOpen && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setOpenRowMenu(null)} />
                              <div className="fixed z-40 w-44 rounded bg-white py-1 shadow-xl" style={{ left: openRowMenu?.left ?? 0, top: openRowMenu?.top ?? 0, border: "1px solid #cfd6e3" }}>
                                <button
                                  disabled={rowIndex === 0}
                                  onClick={() => { moveFeatureRank(row.feature.id, -1); setOpenRowMenu(null); }}
                                  className="flex w-full items-center gap-2 whitespace-nowrap px-3 py-1.5 text-[12px] text-left disabled:opacity-40 hover:bg-[#f4f6f9] disabled:hover:bg-transparent"
                                  style={{ color: "#1a2234" }}
                                >
                                  <ArrowUp size={12} /> Move up
                                </button>
                                <button
                                  disabled={rowIndex === featureRows.length - 1}
                                  onClick={() => { moveFeatureRank(row.feature.id, 1); setOpenRowMenu(null); }}
                                  className="flex w-full items-center gap-2 whitespace-nowrap px-3 py-1.5 text-[12px] text-left disabled:opacity-40 hover:bg-[#f4f6f9] disabled:hover:bg-transparent"
                                  style={{ color: "#1a2234" }}
                                >
                                  <ArrowDown size={12} /> Move down
                                </button>
                                <div className="my-1 h-px" style={{ backgroundColor: "#edf0f4" }} />
                                <button
                                  onClick={() => { setAllocateFeatureId(row.feature.id); setOpenRowMenu(null); }}
                                  className="flex w-full items-center gap-2 whitespace-nowrap px-3 py-1.5 text-[12px] text-left hover:bg-[#f4f6f9]"
                                  style={{ color: "#1a2234" }}
                                >
                                  <Split size={12} /> Allocate
                                </button>
                                <button
                                  onClick={() => { removeFeatureFromPlan(row.feature.id); setOpenRowMenu(null); }}
                                  className="flex w-full items-center gap-2 whitespace-nowrap px-3 py-1.5 text-[12px] text-left hover:bg-[#fef2f2]"
                                  style={{ color: "#b91c1c" }}
                                  title={`Remove ${row.feature.id} and all of its Team allocations from this plan`}
                                >
                                  <X size={12} /> Remove from Plan
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="px-2 text-right tabular-nums">{rowIndex + 1}</div>
                        <div className="px-2 font-mono text-[#2558a6]">{row.feature.id}</div>
                        <div className="truncate px-2 font-medium">{row.feature.name}</div>
                        <div className="truncate px-2">
                          {teamAllocations.length <= 1 ? (
                            <select
                              aria-label={`${row.feature.id} planned team assignment`}
                              disabled={!editable}
                              value={teamAllocations[0]?.team || ""}
                              onChange={event => assignFeatureTeamFromFeaturesTab(row.feature.id, event.target.value)}
                              className={`max-w-full rounded px-2 py-1 text-[11px] ${teamAllocations.length === 0 ? "font-semibold" : ""}`}
                              style={{
                                border: `1px solid ${teamAllocations.length === 0 ? "#f5c451" : "#c8d3e0"}`,
                                backgroundColor: teamAllocations.length === 0 ? "#fff7d6" : "#fff",
                                color: teamAllocations.length === 0 ? "#8a5a00" : "#1a2234",
                              }}
                            >
                              <option value="">{teamAllocations.length === 0 ? "⚠ Not assigned" : "Unassign"}</option>
                              {activePlan.teams.map(team => <option key={team.team} value={team.team}>{team.team}</option>)}
                            </select>
                          ) : <span title={teamAllocations.map(allocation => `${allocation.team}: ${formatCapacityNumber(allocation.value)}`).join(" · ")}>{teamLabel}</span>}
                        </div>
                        <div className="truncate px-2">{projectLabel}</div>
                        <div className="flex justify-center px-2"><span className="rounded px-2 py-0.5 text-[11px]" style={{ border: "1px solid #c8d3e0", color: "#2f6fd6", backgroundColor: "#fff" }}>0</span></div>
                        <MetricCell value={row.completed} pct={0} showPercent={false} />
                        <div className="flex items-center justify-end gap-1.5 px-2 text-right tabular-nums"><WarningIndicator messages={rollupWarnings} /><span>{formatCapacityNumber(row.rollup)}</span></div>
                        <div className="flex items-center justify-end gap-1.5 px-2 text-right tabular-nums">
                          <WarningIndicator messages={estimateWarnings} />
                          <span>{row.estimated > 0 ? formatCapacityNumber(row.estimated) : "—"}</span>
                          <EstimateSourceIndicator trace={{ current: row.estimateSource, allocated: allocatedEstimate, refined: typeof refinedEstimate === "number" && Number.isFinite(refinedEstimate) ? refinedEstimate : 0, preliminary: preliminaryEstimate, manual: hasManualAllocation }} />
                        </div>
                      </div>
                      {teamAllocations.length > 1 && teamAllocations.map(allocation => {
                        const teamMetric = getFeatureMetrics(row.feature, workItems, activePlan.viewBy, allocation.team || undefined);
                        const allocationRollupWarnings = teamMetric.rollup > allocation.value ? ["Rollup exceeds Estimated"] : [];
                        const allocationEstimateWarnings = allocation.value <= 0 ? ["Point Estimated missing"] : [];
                        return (
                          <div key={allocation.id} className="grid min-h-9 items-center text-[11px]" style={{ gridTemplateColumns: FEATURE_PLAN_GRID, borderBottom: "1px solid #edf0f4", color: "#5c6478", backgroundColor: "#fbfcfe" }}>
                            <div />
                            <div />
                            <div />
                            <div className="truncate px-2 italic" style={{ borderLeft: "2px solid #d9e5f7" }}>↳ Allocation</div>
                            <div className="truncate px-2">{allocation.team}</div>
                            <div className="truncate px-2">{projectLabel}</div>
                            <div />
                            <MetricCell value={teamMetric.complete} pct={0} showPercent={false} />
                            <div className="flex items-center justify-end gap-1.5 px-2 text-right tabular-nums"><WarningIndicator messages={allocationRollupWarnings} /><span>{formatCapacityNumber(teamMetric.rollup)}</span></div>
                            <div className="flex items-center justify-end gap-1.5 px-2 text-right tabular-nums">
                              <WarningIndicator messages={allocationEstimateWarnings} />
                              <span>{formatCapacityNumber(allocation.value)}</span>
                              <EstimateSourceIndicator trace={estimateTraceForAllocation(row.feature, allocation, activePlan.viewBy)} />
                            </div>
                          </div>
                        );
                      })}
                      {cutlineAfterId === row.feature.id && <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase" style={{ color: "#b45309", backgroundColor: "#fffaf0", borderTop: "2px solid #f59e0b", borderBottom: "1px solid #fde7bd" }}><span>Capacity cutline</span><span className="font-normal normal-case" style={{ color: "#8c5b10" }}>Cumulative estimated work reaches {formatCapacityNumber(planTotals.capacity)} {activePlan.viewBy.toLowerCase()} capacity; lower-ranked Features are outside the current cutline.</span></div>}
                    </div>;
                  })}
                </div>
              </div>
              {featureRows.length === 0 && <EmptyState title="No Features in this plan" body="Use Add Feature to place an eligible Portfolio Feature in the plan, then allocate it to one or more Teams." icon={<Layers size={18} />} />}
            </div>
            {featureSort !== "rank" && <div className="text-[11px]" style={{ color: "#8c94a6" }}>Capacity cutline is hidden while sorted by {featureSort}; sort by Rank to view it.</div>}
          </div>
          <aside className="w-[300px] shrink-0 self-stretch bg-white p-3" style={{ borderLeft: "1px solid #c8d3e0", borderRight: "1px solid #d9dee7" }}>
            <h2 className="mb-3 text-[16px] font-semibold" style={{ color: "#3a506f" }}>Team Capacity</h2>
            <div style={{ border: "1px solid #e2e6eb" }}>
              <div className="grid grid-cols-[1fr_104px] items-center gap-2 px-2 py-2 text-[10px] font-semibold uppercase" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #d9dee7", color: "#1a2234" }}><div>Name</div><div className="text-right">{activePlan.viewBy} / Capacity</div></div>
              {sortedTeams.map(team => {
                const teamAllocations = activePlan.allocations.filter(allocation => allocation.team === team.team);
                const metrics = teamAllocations.map(allocation => {
                  const feature = getPlanFeature(allocation.featureId, features);
                  return feature ? getFeatureMetrics(feature, workItems, activePlan.viewBy, team.team) : null;
                }).filter((metric): metric is ReturnType<typeof getFeatureMetrics> => Boolean(metric));
                const demand = teamAllocations.reduce((sum, allocation) => sum + allocation.value, 0);
                const rollup = metrics.reduce((sum, metric) => sum + metric.rollup, 0);
                const teamWarnings = getCapacityWarnings(rollup, demand, team.capacity, true).map(warning => warning.label);
                return <div key={team.team} className="grid grid-cols-[1fr_104px] items-center gap-2 px-2 py-3 text-[12px]" style={{ borderBottom: "1px solid #edf0f4", color: "#1a2234" }}><div className="truncate">{team.team}</div><div className="flex items-center justify-end gap-1 text-right tabular-nums"><span>{formatCapacityNumber(demand)} / {formatCapacityNumber(team.capacity)}</span><WarningIndicator messages={teamWarnings} /></div></div>;
              })}
              {sortedTeams.length === 0 && <div className="px-3 py-5 text-[12px]" style={{ color: "#8c94a6" }}>No Teams added to this plan.</div>}
            </div>
          </aside>
          </div>}
        </div>
        {showTeamPicker && <TeamPickerModal plan={activePlan} project={project} onClose={() => setShowTeamPicker(false)} onApply={applyTeams} />}
        {addFeaturesTeam && <AddFeaturesModal plan={activePlan} features={projectFeatures} teamName={addFeaturesTeam} onClose={() => setAddFeaturesTeam(null)} onAdd={addFeaturesToPlan} />}
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
        {canCreatePlan && <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded bg-white" style={{ border: "1px solid #bdd0ef", color: "#2f6fd6" }}><Plus size={15} /> Add New</button>}
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
