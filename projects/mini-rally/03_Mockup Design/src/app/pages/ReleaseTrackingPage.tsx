import { useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  HelpCircle,
  Search,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Feature, IterationItem, ReleaseItem, ScopeProject, WorkItem } from "../model";

type Bucket = "direct" | "derived" | "unparented";
type Unit = "Points" | "Count";
type SortKey = "rank" | "id" | "team";
type SortDirection = "asc" | "desc";
type ColumnKey = "rank" | "id" | "team" | "issue" | "name" | "status";

type TrackingRow = {
  kind: Bucket;
  id: string;
  rank: number;
  team: string;
  name: string;
  state: string;
  issue: boolean;
  feature?: Feature;
  item?: WorkItem;
};

type ReleaseMismatchIssue = {
  item: WorkItem;
  comparedReleaseWindow: string;
  itemRelease: string;
};

type IssuePopupState = {
  rowKey: string;
  top: number;
  left: number;
};

const ACCEPTED_STATES = new Set(["Accepted", "Release"]);
const ESTIMATE_POINTS = { "No Entry": 0, XS: 1, S: 3, M: 5, L: 8, XL: 13 } as const;
const COLUMN_MIN_WIDTH: Record<ColumnKey, number> = { rank: 52, id: 72, team: 100, issue: 48, name: 190, status: 150 };

function isLeaf(item: WorkItem) {
  return item.type === "Story" || item.type === "Defect";
}

function floorPercent(accepted: number, total: number) {
  return total > 0 ? Math.floor((accepted / total) * 100) : 0;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function formatAxisDate(value: string) {
  return value.replace(/^2024-/, "").replace(/^2025-/, "");
}

function toIsoDate(value: string) {
  const trimmed = value.trim();
  const isoLike = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoLike) return `${isoLike[1]}-${isoLike[2]}-${isoLike[3]}`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateToLocalIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function buildBurnupData(release: ReleaseItem, accepted: number, planned: number, preliminary: number) {
  const start = new Date(release.startDate);
  const end = new Date(release.releaseDate);
  const span = Math.max(1, end.getTime() - start.getTime());
  const acceptedCurve = [0, 0.08, 0.22, 0.42, 0.64, 0.82, 1];
  const plannedCurve = [0.72, 0.72, 0.82, 0.82, 0.92, 1, 1];
  return acceptedCurve.map((factor, index) => {
    const pointDate = new Date(start.getTime() + (span * index) / (acceptedCurve.length - 1));
    return {
      date: dateToLocalIso(pointDate),
      accepted: Math.round(accepted * factor),
      planned: Math.round(planned * plannedCurve[index]),
      preliminary,
      ideal: Math.round((planned * index) / (acceptedCurve.length - 1)),
    };
  });
}

function StatusCell({ accepted, total, unit, showPercent }: { accepted: number; total: number; unit: Unit; showPercent: boolean }) {
  const value = floorPercent(accepted, total);
  const label = unit === "Points" ? "points" : "items";
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-baseline gap-1.5 whitespace-nowrap">
        {showPercent && <span className="text-[13px] font-semibold" style={{ color: value === 100 ? "#2f6fd6" : value > 0 ? "#16856f" : "#c78300" }}>{value}%</span>}
        <span className="truncate text-[10px]" style={{ color: "#6f7787" }}>{formatNumber(accepted)}/{formatNumber(total)} {label} accepted</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "#dfe5ee" }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: value === 100 ? "#5b8def" : "#31a77c" }} />
      </div>
    </div>
  );
}

function ProgressLine({ label, accepted, total }: { label: string; accepted: number; total: number }) {
  const percent = floorPercent(accepted, total);
  return (
    <div>
      <div className="mb-1 flex items-baseline gap-2">
        <span className="text-[13px] font-semibold text-[#2f6fd6]">{percent}%</span>
        <span className="text-[11px] text-[#4f5b6e]">{formatNumber(accepted)}/{formatNumber(total)} {label}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-sm bg-[#dce6f7]">
        <div className="h-full rounded-sm bg-[#5b8def]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function IssuePopup({
  row,
  selectedRelease,
  mismatchIssues,
  children,
  position,
  onClose,
  onOpenWorkItem,
}: {
  row: TrackingRow;
  selectedRelease: ReleaseItem;
  mismatchIssues: ReleaseMismatchIssue[];
  children: WorkItem[];
  position: { top: number; left: number };
  onClose: () => void;
  onOpenWorkItem: (item: WorkItem) => void;
}) {
  const acceptedChildren = children.filter(item => ACCEPTED_STATES.has(item.status));
  const totalPoints = children.reduce((sum, item) => sum + item.planEstimate, 0);
  const acceptedPoints = acceptedChildren.reduce((sum, item) => sum + item.planEstimate, 0);
  const stories = children.filter(item => item.type === "Story");
  const defects = children.filter(item => item.type === "Defect");
  const releaseAssignedChildren = children.filter(item => Boolean(item.releaseId));
  const allReleaseAssignedChildrenMismatch = releaseAssignedChildren.length > 0 && mismatchIssues.length === releaseAssignedChildren.length;
  const comparedWindow = `${selectedRelease.name} (${toIsoDate(selectedRelease.startDate)} - ${toIsoDate(selectedRelease.releaseDate)})`;

  return (
    <div
      className="fixed z-[60] max-h-[calc(100vh-72px)] w-[430px] overflow-hidden rounded bg-white p-4 text-left shadow-2xl"
      onClick={event => event.stopPropagation()}
      style={{ top: position.top, left: position.left, border: "1px solid #cbd5e1", color: "#1b2538" }}
    >
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-[#fee2e2] text-[#dc2626]">
          <TriangleAlert size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold leading-5">{row.name}</div>
          <div className="mt-1 text-[10px] text-[#667085]">Comparing against {comparedWindow}</div>
        </div>
        <button aria-label="Close issue panel" onClick={onClose} className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#7aa2df] text-[#2f6fd6] hover:bg-[#edf4ff]">
          <X size={15} />
        </button>
      </div>

      <div className="mb-3 grid grid-cols-[130px_1fr] gap-y-2 text-[12px]">
        <span>Planned Start:</span><span>{row.feature?.plannedStartDate ?? "-"}</span>
        <span>Planned Completion:</span><span>{row.feature?.plannedEndDate ?? "-"}</span>
        <span>Teams Involved:</span><span>{row.team}</span>
      </div>

      <div className="mb-3 space-y-2">
        <ProgressLine label="total points complete" accepted={acceptedPoints} total={totalPoints} />
        {stories.length > 0 && <ProgressLine label="stories complete" accepted={stories.filter(item => ACCEPTED_STATES.has(item.status)).length} total={stories.length} />}
        {defects.length > 0 && <ProgressLine label="defects complete" accepted={defects.filter(item => ACCEPTED_STATES.has(item.status)).length} total={defects.length} />}
      </div>

      {allReleaseAssignedChildrenMismatch && (
        <div className="mb-3 rounded border border-[#fca5a5] bg-[#fff1f2] px-3 py-2 text-[11px] leading-4 text-[#991b1b]">
          All release-assigned child items mismatch this selected Release. Check whether the Feature release is stale or assigned to the wrong Release.
        </div>
      )}

      <div className="text-[13px] font-semibold">Issues ({mismatchIssues.length})</div>
      <div className="mt-1 max-h-56 overflow-y-auto rounded" style={{ border: "1px solid #cbd5e1" }}>
        <div className="bg-[#f8fafc] px-3 py-2 text-[11px] font-semibold text-[#344054]">Release mismatch</div>
        {mismatchIssues.map(issue => (
          <button
            key={issue.item.id}
            onClick={() => onOpenWorkItem(issue.item)}
            className="block w-full border-t border-[#dce2ea] px-3 py-2 text-left text-[12px] hover:bg-[#f8fafc]"
          >
            <div><span className="font-semibold text-[#2275a8]">{issue.item.id}</span> {issue.item.title}</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-[#1f2937]">
              <TriangleAlert size={11} className="text-[#dc2626]" />
              <span>Release mismatch vs {issue.comparedReleaseWindow}</span>
            </div>
            <div className="mt-0.5 text-[10px] text-[#667085]">Item release: {issue.itemRelease}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ArrowUpDown size={11} style={{ color: "#8791a3" }} />;
  return direction === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />;
}

export function ReleaseTrackingPage({
  project,
  team,
  releases,
  iterations,
  features,
  workItems,
  onOpenWorkItem,
}: {
  project: ScopeProject;
  team: string;
  releases: ReleaseItem[];
  iterations: IterationItem[];
  features: Feature[];
  workItems: WorkItem[];
  onOpenWorkItem: (item: WorkItem) => void;
}) {
  const availableReleases = useMemo(
    () => releases.filter(release => release.projectKey === project.key),
    [project.key, releases],
  );
  const [releaseId, setReleaseId] = useState(() => availableReleases[0]?.id ?? "");
  const [bucket, setBucket] = useState<Bucket>("direct");
  const [chartUnit, setChartUnit] = useState<Unit>("Points");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({ key: "rank", direction: "asc" });
  const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>({ rank: 58, id: 82, team: 128, issue: 54, name: 220, status: 180 });
  const [issuePopup, setIssuePopup] = useState<IssuePopupState | null>(null);

  const selectedRelease = availableReleases.find(release => release.id === releaseId) ?? availableReleases[0];
  if (!selectedRelease) {
    return <div className="flex flex-1 items-center justify-center text-sm text-[#6f7787]">No Release exists in {project.name}.</div>;
  }

  const releaseIndex = availableReleases.findIndex(release => release.id === selectedRelease.id);
  const allLeaves = workItems.filter(isLeaf);
  const belongsToScope = (projectKey?: string, teamName?: string) =>
    projectKey === project.key && (team === "All Teams" || teamName === team);
  const scopedLeaves = allLeaves.filter(item => belongsToScope(item.project, item.team));
  const childrenByFeature = new Map<string, WorkItem[]>();
  allLeaves.forEach(item => {
    if (!item.featureId) return;
    childrenByFeature.set(item.featureId, [...(childrenByFeature.get(item.featureId) ?? []), item]);
  });

  const directFeatures = features
    .filter(feature => feature.releaseId === selectedRelease.id && belongsToScope(feature.project, feature.team))
    .sort((a, b) => (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER));
  const directIds = new Set(directFeatures.map(feature => feature.id));
  const derivedFeatures = features
    .filter(feature => feature.releaseId !== selectedRelease.id && !directIds.has(feature.id))
    .filter(feature => (childrenByFeature.get(feature.id) ?? []).some(item => item.releaseId === selectedRelease.id && belongsToScope(item.project, item.team)))
    .sort((a, b) => (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER));
  const unparented = scopedLeaves
    .filter(item => item.releaseId === selectedRelease.id && !item.featureId)
    .sort((a, b) => (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER));
  const trackedLeaves = scopedLeaves.filter(item => item.releaseId === selectedRelease.id);

  const rowTeam = (feature: Feature, kind: "direct" | "derived") => {
    if (kind === "direct") return feature.team ?? "Unassigned";
    const matchingTeams = [...new Set((childrenByFeature.get(feature.id) ?? [])
      .filter(item => item.releaseId === selectedRelease.id && belongsToScope(item.project, item.team))
      .map(item => item.team ?? "Unassigned"))];
    return matchingTeams.join(", ") || "Unassigned";
  };
  const mismatchIssuesFor = (row: TrackingRow): ReleaseMismatchIssue[] => {
    if (!row.feature) return [];
    return (childrenByFeature.get(row.feature.id) ?? [])
      .filter(item => Boolean(item.releaseId) && item.releaseId !== selectedRelease.id)
      .map(item => ({
        item,
        comparedReleaseWindow: `${selectedRelease.name}, ${toIsoDate(selectedRelease.startDate)} - ${toIsoDate(selectedRelease.releaseDate)}`,
        itemRelease: releases.find(release => release.id === item.releaseId)?.name ?? item.release ?? "Unassigned",
      }));
  };

  const baseRows: TrackingRow[] = bucket === "direct"
    ? directFeatures.map((feature, index) => ({
        kind: "direct", id: feature.id, rank: index + 1, team: rowTeam(feature, "direct"), name: feature.name, state: feature.status, feature,
        issue: (childrenByFeature.get(feature.id) ?? []).some(item => Boolean(item.releaseId) && item.releaseId !== selectedRelease.id),
      }))
    : bucket === "derived"
      ? derivedFeatures.map((feature, index) => ({
          kind: "derived", id: feature.id, rank: index + 1, team: rowTeam(feature, "derived"), name: feature.name, state: feature.status, feature, issue: false,
        }))
      : unparented.map((item, index) => ({
          kind: "unparented", id: item.id, rank: index + 1, team: item.team ?? "Unassigned", name: item.title, state: item.status, item, issue: false,
        }));

  const query = search.trim().toLowerCase();
  const visibleRows = baseRows
    .filter(row => !query || `${row.id} ${row.name} ${row.team} ${row.state}`.toLowerCase().includes(query))
    .sort((a, b) => {
      const comparison = sort.key === "rank"
        ? a.rank - b.rank
        : sort.key === "id"
          ? a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: "base" })
          : a.team.localeCompare(b.team, undefined, { sensitivity: "base" });
      return sort.direction === "asc" ? comparison : -comparison;
    });

  const featureProgress = (row: TrackingRow) => {
    if (row.kind === "unparented" && row.item) {
      const total = chartUnit === "Points" ? row.item.planEstimate : 1;
      const accepted = ACCEPTED_STATES.has(row.item.status) ? total : 0;
      return { accepted, total, showPercent: false };
    }
    const allChildren = row.feature ? childrenByFeature.get(row.feature.id) ?? [] : [];
    const children = row.kind === "direct"
      ? allChildren
      : allChildren.filter(item => item.releaseId === selectedRelease.id && belongsToScope(item.project, item.team));
    const total = chartUnit === "Points" ? children.reduce((sum, item) => sum + item.planEstimate, 0) : children.length;
    const acceptedChildren = children.filter(item => ACCEPTED_STATES.has(item.status));
    const accepted = chartUnit === "Points" ? acceptedChildren.reduce((sum, item) => sum + item.planEstimate, 0) : acceptedChildren.length;
    return { accepted, total, showPercent: row.kind === "direct" };
  };

  const plannedPoints = trackedLeaves.reduce((sum, item) => sum + item.planEstimate, 0);
  const acceptedLeaves = trackedLeaves.filter(item => ACCEPTED_STATES.has(item.status));
  const acceptedPoints = acceptedLeaves.reduce((sum, item) => sum + item.planEstimate, 0);
  const chartFeatures = [...directFeatures, ...derivedFeatures];
  const preliminaryPoints = chartFeatures.reduce((sum, feature) => sum + (feature.refinedEstimate ?? ESTIMATE_POINTS[feature.preliminaryEstimate]), 0);
  const preliminaryCount = chartFeatures.reduce((sum, feature) => sum + (feature.refinedWorkItemCountEstimate ?? (childrenByFeature.get(feature.id) ?? []).length), 0);
  const chartData = buildBurnupData(
    selectedRelease,
    chartUnit === "Points" ? acceptedPoints : acceptedLeaves.length,
    chartUnit === "Points" ? plannedPoints : trackedLeaves.length,
    chartUnit === "Points" ? preliminaryPoints : preliminaryCount,
  );
  const releaseStart = toTime(selectedRelease.startDate);
  const releaseEnd = toTime(selectedRelease.releaseDate);
  const releaseIterations = iterations
    .filter(iteration => iteration.projectKey === project.key && (team === "All Teams" || iteration.team === team))
    .filter(iteration => toTime(iteration.endDate) >= releaseStart && toTime(iteration.startDate) <= releaseEnd)
    .sort((a, b) => toTime(a.startDate) - toTime(b.startDate));

  const toggleSort = (key: SortKey) => {
    setSort(current => current.key === key ? { key, direction: current.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" });
  };
  const toggleIssuePopup = (event: ReactMouseEvent<HTMLButtonElement>, rowKey: string) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const panelWidth = 430;
    const left = Math.min(Math.max(16, rect.right + 10), Math.max(16, window.innerWidth - panelWidth - 16));
    const top = Math.min(Math.max(54, rect.top - 12), Math.max(54, window.innerHeight - 620));
    setIssuePopup(current => current?.rowKey === rowKey ? null : { rowKey, left, top });
  };
  const beginResize = (event: ReactMouseEvent<HTMLSpanElement>, key: ColumnKey) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = columnWidths[key];
    const move = (moveEvent: MouseEvent) => setColumnWidths(current => ({ ...current, [key]: Math.max(COLUMN_MIN_WIDTH[key], startWidth + moveEvent.clientX - startX) }));
    const stop = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  };
  const selectAdjacentRelease = (offset: number) => {
    const next = availableReleases[releaseIndex + offset];
    if (next) setReleaseId(next.id);
  };
  const tableWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);

  const headerCell = (key: ColumnKey, label: string, sortable?: SortKey) => (
    <th className="relative h-9 bg-[#f7f9fb] px-2 text-left text-[10px] font-semibold" style={{ borderBottom: "1px solid #e4e9f0", color: "#344054" }}>
      {sortable ? (
        <button onClick={() => toggleSort(sortable)} className="flex w-full items-center gap-1 text-left">
          {label}<SortIcon active={sort.key === sortable} direction={sort.direction} />
        </button>
      ) : label}
      <span onMouseDown={event => beginResize(event, key)} className="absolute right-0 top-1 h-7 w-1 cursor-col-resize border-r border-[#cbd5e1]" aria-hidden="true" />
    </th>
  );
  const activeIssueRow = issuePopup ? visibleRows.find(row => `${row.kind}-${row.id}` === issuePopup.rowKey) : undefined;
  const activeIssueChildren = activeIssueRow?.feature ? childrenByFeature.get(activeIssueRow.feature.id) ?? [] : [];
  const activeMismatchIssues = activeIssueRow ? mismatchIssuesFor(activeIssueRow) : [];

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden" style={{ backgroundColor: "#f3f5f8", color: "#1b2538" }}>
      <header className="flex min-h-14 shrink-0 items-center gap-3 bg-white px-4" style={{ borderBottom: "1px solid #dce2ea" }}>
        <h1 className="mr-2 whitespace-nowrap text-[23px] font-semibold tracking-tight">Release Tracking</h1>
        <div className="flex h-8 items-center overflow-hidden rounded" style={{ border: "1px solid #cbd5e1" }}>
          <button aria-label="Previous release" disabled={releaseIndex <= 0} onClick={() => selectAdjacentRelease(-1)} className="flex h-full w-8 items-center justify-center disabled:opacity-30" style={{ borderRight: "1px solid #dce2ea", color: "#2f6fd6" }}><ChevronLeft size={16} /></button>
          <select aria-label="Release filter" value={selectedRelease.id} onChange={event => setReleaseId(event.target.value)} className="h-full min-w-52 bg-white px-3 text-[12px] font-medium outline-none">
            {availableReleases.map(release => <option key={release.id} value={release.id}>{release.name}</option>)}
          </select>
          <span className="hidden px-3 text-[10px] xl:inline" style={{ color: "#657084", borderLeft: "1px solid #dce2ea" }}>{toIsoDate(selectedRelease.startDate)} – {toIsoDate(selectedRelease.releaseDate)}</span>
          <button aria-label="Next release" disabled={releaseIndex >= availableReleases.length - 1} onClick={() => selectAdjacentRelease(1)} className="flex h-full w-8 items-center justify-center disabled:opacity-30" style={{ borderLeft: "1px solid #dce2ea", color: "#2f6fd6" }}><ChevronRight size={16} /></button>
        </div>
        <span className="hidden text-[10px] font-medium text-[#657084] 2xl:inline">{project.name} · {team}</span>
        <div className="flex-1" />
        <label className="text-[10px] font-semibold uppercase tracking-wide">Chart unit</label>
        <select aria-label="Chart unit" value={chartUnit} onChange={event => setChartUnit(event.target.value as Unit)} className="h-8 rounded bg-white px-2 text-[11px]" style={{ border: "1px solid #cbd5e1" }}>
          <option>Points</option><option>Count</option>
        </select>
        <div className="flex overflow-hidden rounded" style={{ border: "1px solid #b9c6d8" }}>
          <button className="flex h-8 items-center gap-1.5 px-3 text-[11px] font-medium text-white" style={{ backgroundColor: "#2f6fd6" }}><BarChart3 size={13} />Chart</button>
          <button disabled title="Future backlog FB-P6-001" className="flex h-8 items-center gap-1.5 border-l border-[#dce2ea] bg-[#f4f6f9] px-3 text-[11px] font-medium text-[#8a94a6]"><GitBranch size={13} />Dependencies · Future</button>
        </div>
        <HelpCircle size={15} style={{ color: "#2f6fd6" }} />
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(500px,44%)_1fr] gap-3 p-3">
        <section className="flex min-h-0 flex-col gap-3">
          <div className="rounded bg-white p-4 shadow-sm" style={{ border: "1px solid #dce2ea" }}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold">Features</h2>
              <div className="group relative">
                <button aria-label="Release tracking terminology" className="flex h-5 w-5 items-center justify-center rounded-full text-[#2f6fd6] hover:bg-[#edf4ff]">
                  <AlertCircle size={14} />
                </button>
                <div className="pointer-events-none absolute right-0 top-6 z-20 hidden w-[430px] rounded bg-white p-4 text-[12px] leading-5 shadow-xl group-hover:block" style={{ border: "1px solid #cbd5e1", color: "#1b2538" }}>
                  <div className="mb-2 text-[14px] font-semibold">Terminology</div>
                  <div className="mb-2"><span className="font-semibold">Features in Release</span><br />Features explicitly assigned to the selected release within the current project/team scope.</div>
                  <div className="mb-2"><span className="font-semibold">Derived Features</span><br />Features not assigned to this release, but with at least one child Story/Defect assigned to this release within scope.</div>
                  <div><span className="font-semibold">Unparented User Stories and Defects</span><br />Story/Defect items assigned to this release and scope that do not have a Feature parent.</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-[#e7ebf1]">
              {([['direct', directFeatures.length, 'Features in Release', '#168f82'], ['derived', derivedFeatures.length, 'Derived Features', '#6d78cb'], ['unparented', unparented.length, 'Unparented Stories & Defects', '#ca8100']] as const).map(([key, value, label, color]) => (
                <button key={key} onClick={() => setBucket(key)} className="px-2 text-center">
                  <div className="text-[27px] font-light leading-none" style={{ color }}>{value}</div>
                  <div className="mt-2 text-[10px] font-semibold leading-tight" style={{ color: bucket === key ? "#1b2538" : "#5e687a" }}>{label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded bg-white shadow-sm" style={{ border: "1px solid #dce2ea" }}>
            <div className="grid grid-cols-[1fr_1.1fr] gap-2 p-2">
              <select aria-label="Tracking category" value={bucket} onChange={event => setBucket(event.target.value as Bucket)} className="h-9 rounded bg-white px-2.5 text-[11px]" style={{ border: "1px solid #cbd5e1" }}>
                <option value="direct">Features in Release ({directFeatures.length})</option>
                <option value="derived">Derived Features ({derivedFeatures.length})</option>
                <option value="unparented">Unparented Stories & Defects ({unparented.length})</option>
              </select>
              <label className="flex h-9 items-center gap-2 rounded px-2.5" style={{ border: "1px solid #cbd5e1" }}>
                <Search size={14} style={{ color: "#2f6fd6" }} />
                <input aria-label="Search release tracking" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search..." className="min-w-0 flex-1 bg-transparent text-[11px] outline-none" />
              </label>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="table-fixed border-collapse" style={{ width: tableWidth, minWidth: "100%" }}>
                <colgroup>{Object.values(columnWidths).map((width, index) => <col key={index} style={{ width }} />)}</colgroup>
                <thead><tr>{headerCell("rank", "Rank", "rank")}{headerCell("id", "ID", "id")}{headerCell("team", "Team", "team")}{headerCell("issue", "Issue")}{headerCell("name", "Name")}{headerCell("status", "Status")}</tr></thead>
                <tbody>
                  {visibleRows.map(row => {
                    const progress = featureProgress(row);
                    const childRows = row.feature ? (childrenByFeature.get(row.feature.id) ?? []) : [];
                    const childCount = childRows.length;
                    const rowKey = `${row.kind}-${row.id}`;
                    return (
                      <tr key={rowKey} onClick={() => row.item && onOpenWorkItem(row.item)} className={row.item ? "cursor-pointer hover:bg-[#f8fafc]" : "hover:bg-[#f8fafc]"} style={{ borderBottom: "1px solid #e8ecf2" }}>
                        <td className="px-2 py-3 text-center text-[11px] text-[#657084]">{row.rank}</td>
                        <td className="truncate px-2 py-3 text-[11px] font-semibold text-[#2f6fd6]">{row.id}</td>
                        <td className="truncate px-2 py-3 text-[10px] text-[#475467]" title={row.team}>{row.team}</td>
                        <td className="relative px-2 py-3 text-center">
                          {row.issue && (
                            <>
                              <button
                                aria-label={`Open release mismatch issues for ${row.id}`}
                                onClick={event => toggleIssuePopup(event, rowKey)}
                                className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca]"
                              >
                                <TriangleAlert size={15} />
                              </button>
                            </>
                          )}
                        </td>
                        <td className="px-2 py-3 align-top">
                          <div className="whitespace-normal break-words text-[12px] font-medium leading-4" title={row.name}>{row.name}</div>
                          <div className="mt-1 whitespace-normal break-words text-[9px] leading-3 text-[#687386]">{row.kind === "direct" ? `Direct - ${childCount} total child item(s)` : row.kind === "derived" ? `Derived - only matching Release children are counted` : `${row.item?.type} - no parent Feature`} - {row.state}</div>
                        </td>
                        <td className="px-2 py-3"><StatusCell accepted={progress.accepted} total={progress.total} unit={chartUnit} showPercent={progress.showPercent} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {visibleRows.length === 0 && <div className="flex h-32 items-center justify-center text-[11px] text-[#7a8495]">No matching items in this Release and Team scope.</div>}
            </div>
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded bg-white p-4 shadow-sm" style={{ border: "1px solid #dce2ea" }}>
          <>
              <div className="mb-2">
                <h2 className="text-[15px] font-semibold">Burnup {selectedRelease.name} - {toIsoDate(selectedRelease.startDate)} - {toIsoDate(selectedRelease.releaseDate)}</h2>
              </div>
              <div className="h-[calc(100vh-400px)] min-h-[270px] max-h-[430px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 18, right: 18, left: 18, bottom: 8 }}>
                    <CartesianGrid stroke="#d9e0e9" />
                    <XAxis dataKey="date" tickFormatter={formatAxisDate} tick={{ fontSize: 10, fill: "#5f6b7c" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#5f6b7c" }} label={{ value: chartUnit === "Points" ? "Work Items Total Points" : "Work Items Total Count", angle: -90, position: "insideLeft", offset: -8, style: { fontSize: 10, fill: "#5f6b7c" } }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 4 }} /><Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                    <Area type="stepAfter" dataKey="accepted" name={`Accepted ${chartUnit}`} stroke="#168f82" fill="#bfe8e3" fillOpacity={0.55} strokeWidth={2} />
                    <Line type="stepAfter" dataKey="planned" name={`Planned ${chartUnit}`} stroke="#d58300" strokeWidth={2} dot={false} />
                    <Line type="stepAfter" dataKey="preliminary" name="Preliminary Estimate" stroke="#a36ade" strokeWidth={2} dot={false} />
                    <Line type="linear" dataKey="ideal" name={`Ideal (Accepted ${chartUnit})`} stroke="#3a9529" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              {releaseIterations.length > 0 && (
                <div className="mt-1 grid text-center text-[10px] font-semibold text-[#4f5b6e]" style={{ gridTemplateColumns: `repeat(${releaseIterations.length}, minmax(0, 1fr))` }}>
                  {releaseIterations.map(iteration => (
                    <div key={iteration.id} className="border-r border-[#dce2ea] px-2 last:border-r-0">
                      <div>{iteration.name}</div>
                      <div className="mt-0.5 text-[9px] font-normal text-[#7a8495]">{formatAxisDate(toIsoDate(iteration.startDate))} - {formatAxisDate(toIsoDate(iteration.endDate))}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded bg-[#eef9f7] p-3"><div className="text-[10px] text-[#557068]">Accepted</div><div className="mt-1 text-xl font-semibold text-[#168f82]">{chartUnit === "Points" ? acceptedPoints : acceptedLeaves.length} <span className="text-[10px] font-normal">{chartUnit}</span></div></div>
                <div className="rounded bg-[#fff7e8] p-3"><div className="text-[10px] text-[#796846]">Planned in Release</div><div className="mt-1 text-xl font-semibold text-[#b36f00]">{chartUnit === "Points" ? plannedPoints : trackedLeaves.length} <span className="text-[10px] font-normal">{chartUnit}</span></div></div>
                <div className="rounded bg-[#f5effd] p-3"><div className="text-[10px] text-[#6b5b7e]">Preliminary Feature Estimate</div><div className="mt-1 text-xl font-semibold text-[#8755bc]">{chartUnit === "Points" ? preliminaryPoints : preliminaryCount} <span className="text-[10px] font-normal">{chartUnit}</span></div></div>
              </div>
          </>
        </section>
      </div>
      {issuePopup && activeIssueRow && (
        <div className="fixed inset-0 z-50 bg-transparent" onClick={() => setIssuePopup(null)}>
          <IssuePopup
            row={activeIssueRow}
            selectedRelease={selectedRelease}
            mismatchIssues={activeMismatchIssues}
            children={activeIssueChildren}
            position={{ top: issuePopup.top, left: issuePopup.left }}
            onClose={() => setIssuePopup(null)}
            onOpenWorkItem={item => {
              setIssuePopup(null);
              onOpenWorkItem(item);
            }}
          />
        </div>
      )}
    </div>
  );
}
