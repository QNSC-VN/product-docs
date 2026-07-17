import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "D:/Mini_Rally_pj/outputs/timeline-progress";
const outputPath = `${outputDir}/Mini Rally Timeline.xlsx`;
const sourcePath = "D:/Mini_Rally_pj/Time line.md";
const sourceText = await fs.readFile(sourcePath, "utf8");

const wb = Workbook.create();

const colors = {
  navy: "#173B66",
  blue: "#1F6FEB",
  paleBlue: "#EAF2FF",
  green: "#16803C",
  paleGreen: "#EAF7EF",
  amber: "#B7791F",
  paleAmber: "#FFF7E6",
  purple: "#6B46C1",
  palePurple: "#F2ECFF",
  gray: "#64748B",
  paleGray: "#F1F5F9",
  red: "#C2410C",
  paleRed: "#FFF1F0",
  ink: "#172033",
  muted: "#64748B",
  border: "#D6DEE8",
  white: "#FFFFFF",
};

const statusPalette = {
  "Done": { fill: colors.paleGreen, font: colors.green },
  "Accepted": { fill: colors.paleGreen, font: colors.green },
  "BA accepted": { fill: colors.paleGreen, font: colors.green },
  "Closed": { fill: colors.paleGreen, font: colors.green },
  "Ready": { fill: colors.paleBlue, font: colors.blue },
  "Ready for development planning": { fill: colors.paleBlue, font: colors.blue },
  "Pending": { fill: colors.paleAmber, font: colors.amber },
  "Pending BA confirmation": { fill: colors.paleAmber, font: colors.amber },
  "Next": { fill: colors.paleAmber, font: colors.amber },
  "Deferred": { fill: colors.palePurple, font: colors.purple },
  "Future": { fill: colors.palePurple, font: colors.purple },
  "Not started": { fill: colors.paleGray, font: colors.gray },
  "Open": { fill: colors.paleRed, font: colors.red },
  "Decided": { fill: colors.paleGreen, font: colors.green },
};

function addSheet(name) {
  const ws = wb.worksheets.add(name);
  ws.showGridLines = false;
  return ws;
}

function setTitle(ws, title, subtitle, lastCol = "K") {
  const titleRange = ws.getRange(`A1:${lastCol}1`);
  titleRange.merge();
  titleRange.values = [[title]];
  titleRange.format = {
    fill: colors.navy,
    font: { bold: true, color: colors.white, size: 18 },
    wrapText: true,
    horizontalAlignment: "left",
    verticalAlignment: "middle",
  };
  titleRange.format.rowHeightPx = 36;

  const subRange = ws.getRange(`A2:${lastCol}2`);
  subRange.merge();
  subRange.values = [[subtitle]];
  subRange.format = {
    fill: colors.paleBlue,
    font: { color: colors.ink, size: 10 },
    wrapText: true,
    horizontalAlignment: "left",
    verticalAlignment: "middle",
  };
  subRange.format.rowHeightPx = 28;
}

function writeTable(ws, startCell, headers, rows, tableName, widths = []) {
  const start = cellToIndexes(startCell);
  const allRows = [headers, ...rows];
  const range = ws.getRangeByIndexes(start.row, start.col, allRows.length, headers.length);
  range.values = allRows;
  range.format = {
    font: { color: colors.ink, size: 10 },
    wrapText: true,
    verticalAlignment: "top",
    borders: {
      insideHorizontal: { style: "thin", color: colors.border },
      top: { style: "thin", color: colors.border },
      bottom: { style: "thin", color: colors.border },
    },
  };

  const headerRange = ws.getRangeByIndexes(start.row, start.col, 1, headers.length);
  headerRange.format = {
    fill: colors.navy,
    font: { bold: true, color: colors.white, size: 10 },
    wrapText: true,
    horizontalAlignment: "center",
    verticalAlignment: "middle",
  };
  headerRange.format.rowHeightPx = 32;

  const dataRange = ws.getRangeByIndexes(start.row + 1, start.col, rows.length, headers.length);
  dataRange.format.rowHeightPx = 38;
  const table = ws.tables.add(range.address, true, tableName);
  table.showFilterButton = true;
  table.showBandedRows = true;
  table.style = "TableStyleMedium2";

  widths.forEach((w, i) => {
    if (w) ws.getRangeByIndexes(start.row, start.col + i, allRows.length, 1).format.columnWidth = w;
  });
  return { range, table, start, rowCount: allRows.length, colCount: headers.length };
}

function cellToIndexes(cell) {
  const match = /^([A-Z]+)(\d+)$/i.exec(cell);
  const letters = match[1].toUpperCase();
  let col = 0;
  for (const ch of letters) col = col * 26 + (ch.charCodeAt(0) - 64);
  return { row: Number(match[2]) - 1, col: col - 1 };
}

function statusStyle(ws, rangeAddress, statusColRelativeOneBased) {
  const r = ws.getRange(rangeAddress);
  for (const [text, style] of Object.entries(statusPalette)) {
    r.conditionalFormats.add("containsText", {
      text,
      format: { fill: style.fill, font: { color: style.font, bold: true } },
    });
  }
}

function formatStatusColumn(ws, tableMeta, relativeCol) {
  const colIndex = tableMeta.start.col + relativeCol - 1;
  const range = ws.getRangeByIndexes(tableMeta.start.row + 1, colIndex, tableMeta.rowCount - 1, 1);
  range.format = {
    horizontalAlignment: "center",
    verticalAlignment: "middle",
    font: { bold: true, size: 10 },
    borders: {
      insideHorizontal: { style: "thin", color: colors.border },
      top: { style: "thin", color: colors.border },
      bottom: { style: "thin", color: colors.border },
    },
  };
  statusStyle(ws, range.address, relativeCol);
}

function addNoteBox(ws, address, title, lines, fill = colors.paleAmber) {
  const range = ws.getRange(address);
  range.merge();
  range.values = [[`${title}\n${lines.join("\n")}`]];
  range.format = {
    fill,
    font: { color: colors.ink, size: 10 },
    wrapText: true,
    verticalAlignment: "top",
    borders: { preset: "outside", style: "thin", color: colors.border },
  };
}

const masterRows = [
  [1, "Phase 0", "Foundation", "App Shell, Auth, fixed Company/Workspace, Project, Project/Team context", "BA accepted", "Existing docs; old tracking superseded", "Not started", 12, "BA", "Keep as foundation baseline; align with architecture foundation before production."],
  [2, "Phase 1", "Core Work Management", "Backlog base, Story/Defect create, Work Item Detail, Tasks, Time Tracking, Content, Activity Log, Manage Projects/Teams/Users", "Ready", "SRS created and updated", "Not started", 16, "BA + Dev", "Ready for development planning. Manage Teams/Users is part of Phase 1."],
  [3, "Phase 2.1", "Backlog Enhancement", "Search, Manage Filters, sort, inline edit, Release/Iteration assignment, rank reorder, Project/Team context", "Done", "SRS complete", "Not started", 9, "BA done / Dev next", "Closed for BA handoff."],
  [4, "Phase 2.2", "Timeboxes / Iterations", "Iteration list, create, detail, Theme/Notes, Project/Team, assignment options for Backlog", "Done", "SRS complete", "Not started", 14, "BA done / Dev next", "Closed for BA handoff. Releases/Milestones deferred to Phase 3."],
  [5, "Phase 2.3", "Iteration Status", "Iteration selector, metrics, list from Backlog assignment, Add Item, inline edit, Project/Team context", "Done", "SRS complete", "Not started", 14, "BA done / Dev next", "Closed for BA handoff. Team Board/Team Status deferred."],
  [6, "Phase 3.1", "Team Board / Team Status", "Board view, Team Status rollup, drag/drop, WIP/transition rules", "Pending", "Pending BA confirmation", "Not started", null, "BA next", "Define SRS and acceptance rules."],
  [7, "Phase 3.2", "Release / Milestones", "Release CRUD/readiness/detail, Milestones/delivery checkpoints", "Pending", "Pending", "Not started", null, "BA next", "Define after Phase 3 priority is confirmed."],
  [8, "Phase 3.3", "Quality / Defect", "Defect lifecycle, severity/priority, environment, reproduce steps, verify/reopen", "Pending", "Pending", "Not started", null, "BA next", "Define as its own Phase 3 slice."],
  [9, "Phase 4", "Collaboration & Governance", "Notifications, RBAC, Settings, Audit", "Future", "Pending", "Not started", null, "BA later", "Later phase."],
  [10, "Phase 5", "Reporting", "Dashboard, burndown, velocity, workload, release progress, exports", "Future", "Pending", "Not started", null, "BA later", "Later phase."],
  [11, "Post-MVP", "Portfolio", "Initiative/roadmap/cross-project tracking", "Future", "Pending", "Not started", null, "BA later", "Optional after MVP."],
];

const checklistRows = [
  ["Phase 0", "Login / auth mockup", "Done", "BA", "Login Admin and auth states covered."],
  ["Phase 0", "App Shell", "Done", "BA", "Top navigation, breadcrumb, project/team context covered."],
  ["Phase 0", "Fixed Company / Workspace", "Accepted", "BA", "Single-company MVP; no Workspace create/switch UI."],
  ["Phase 0", "Project list/create/edit/archive mockup", "Done", "BA", "BA accepted fixed company and project creation."],
  ["Phase 1", "Backlog base list", "Ready", "BA", "Story/Defect only; Feature/Task not independent backlog items."],
  ["Phase 1", "Create Work Item", "Ready", "BA", "Story/Defect quick create and create-with-details defined."],
  ["Phase 1", "Work Item Detail", "Ready", "BA", "Details, Tasks, Revision History tabs defined."],
  ["Phase 1", "Task Management", "Ready", "BA", "Task is child of Work Item."],
  ["Phase 1", "Time Tracking", "Ready", "BA", "Plan Estimate, Estimate, To Do and Actual defined."],
  ["Phase 1", "Content / Attachments", "Ready", "BA", "Description, Notes, Attachments, Release Notes defined."],
  ["Phase 1", "Activity Log", "Ready", "BA", "Revision History represents basic activity log."],
  ["Phase 1", "Manage Projects", "Ready", "BA", "Projects tab kept in Manage."],
  ["Phase 1", "Manage Teams", "Ready", "BA", "Team list/create/edit/deactive; member selector in modal."],
  ["Phase 1", "Manage Users", "Ready", "BA", "Invite/edit/deactive user; assign user to Team."],
  ["Phase 2", "P2.1 Backlog Enhancement", "Done", "BA", "Advanced list behavior and Iteration assignment."],
  ["Phase 2", "P2.2 Timeboxes / Iterations", "Done", "BA", "Iteration list/create/detail and assignment options."],
  ["Phase 2", "P2.3 Iteration Status", "Done", "BA", "Selector, metrics, list from Backlog assignment, Add Item."],
  ["Phase 2", "Project/Team context rule", "Done", "BA", "Workspace selector filters records and defaults create forms."],
  ["Phase 2", "Team Board / Team Status", "Deferred", "BA", "Explicitly moved to Phase 3."],
  ["Phase 2", "Release Management / Milestones", "Deferred", "BA", "Phase 3 scope."],
  ["Phase 3", "Team Board", "Pending", "BA next", "Define create behavior, drag/drop, transitions and WIP."],
  ["Phase 3", "Team Status", "Pending", "BA next", "Define KPI/dashboard/list direction."],
  ["Phase 3", "Release Management", "Pending", "BA next", "Define release CRUD/readiness/detail."],
  ["Phase 3", "Milestones", "Pending", "BA next", "Define delivery checkpoint capability."],
  ["Phase 3", "Quality / Defect", "Pending", "BA next", "Define defect lifecycle and quality summary."],
];

const trackerRows = [
  ["Phase 0", "Foundation", "Accepted / historical baseline", "Not started", 12, "None", "Align with architecture foundation before production.", "High"],
  ["Phase 1", "Manage Projects/Teams/Users", "Ready", "Not started", 16, "Phase 0", "Dev planning and API/DB review.", "High"],
  ["Phase 1", "Backlog + Create + Detail + Task", "Ready", "Not started", 16, "Phase 0, Manage", "Dev planning and implementation.", "High"],
  ["Phase 1", "Time/Content/Activity", "Ready", "Not started", 16, "Work Item Detail", "Dev planning and implementation.", "Medium"],
  ["Phase 2.1", "Backlog Enhancement", "Done", "Not started", 9, "Phase 1 Backlog API", "Ready for dev after Phase 1.", "High"],
  ["Phase 2.2", "Timeboxes / Iterations", "Done", "Not started", 14, "Phase 1 Work Item API, Team context", "Ready for dev after Phase 2.1 contract.", "High"],
  ["Phase 2.3", "Iteration Status", "Done", "Not started", 14, "Phase 2.1 + Phase 2.2", "Ready for dev after Iteration and assignment APIs.", "High"],
  ["Phase 3.1", "Team Board", "Pending BA confirmation", "Not started", null, "Phase 2 Iteration Status", "Define SRS.", "High"],
  ["Phase 3.2", "Team Status", "Pending BA confirmation", "Not started", null, "Phase 2 Iteration Status", "Define SRS.", "Medium"],
  ["Phase 3.3", "Release Management", "Pending", "Not started", null, "Backlog / Iterations", "Define SRS.", "High"],
  ["Phase 3.4", "Milestones", "Pending", "Not started", null, "Release / Project planning", "Define SRS.", "Medium"],
  ["Phase 3.5", "Quality / Defect", "Pending", "Not started", null, "Work Item foundation", "Define SRS.", "High"],
  ["Phase 4", "Collaboration / Governance", "Future", "Not started", null, "Phase 1-3", "Define later.", "Medium"],
  ["Phase 5", "Reporting", "Future", "Not started", null, "Phase 1-4 data", "Define later.", "Medium"],
  ["Post-MVP", "Portfolio", "Future optional", "Not started", null, "Roadmap decision", "Define only if MVP needs it.", "Low"],
];

const nextRows = [
  [1, "Confirm Phase 3 scope boundary", "Decide exact Phase 3 slices: Team Board/Team Status first, or Release/Quality first.", "Phase 2 closure", "BA/PO", "Next"],
  [2, "Define Team Board SRS", "Board columns, card fields, create behavior, drag/drop, transition rules, WIP limits, permissions.", "Phase 2 Iteration Status", "BA", "Pending"],
  [3, "Define Team Status SRS", "KPI list, filters, layout, data source and drill-down behavior.", "Phase 2 Iteration Status", "BA", "Pending"],
  [4, "Define Release Management SRS", "Release list/detail/create/readiness, included work items, open defects, release status.", "Backlog + Iteration assignment", "BA", "Pending"],
  [5, "Define Milestones SRS", "Milestone entity, date/owner/status, relationship to release/project/work items.", "Release scope", "BA", "Pending"],
  [6, "Define Quality / Defect SRS", "Defect lifecycle, severity, environment, steps, verify/reopen, quality summary.", "Work Item/Backlog foundation", "BA", "Pending"],
  [7, "Development planning pass", "Convert Phase 1 and Phase 2 SRS into sprintable dev tasks with API/DB contract review.", "SRS baseline", "Tech Lead/Dev Agent", "Pending"],
  [8, "Production implementation", "Implement from foundation through Phase 1 then Phase 2, unless team chooses a vertical slice.", "Dev planning", "Dev Agent", "Pending"],
];

const buildRows = [
  [1, "Foundation / Phase 0 architecture", "Everything depends on auth, routing, company/project/team context and DB migrations.", "Login/session, app shell, fixed company, project/team context API ready."],
  [2, "Phase 1 Manage Projects/Teams/Users", "Project-Team-User relationships are required by Backlog, Work Item and Iteration context.", "Admin can manage Teams/Users; user access derives from Team -> Project."],
  [3, "Phase 1 Backlog + Create", "Core work item source of truth must exist before Iteration assignment.", "Story/Defect create/list with Project/Team validation."],
  [4, "Phase 1 Work Item Detail + Task", "Required for create-with-details, child tasks and later Iteration Status detail drilldown.", "Detail/edit/task flows persist data and permissions."],
  [5, "Phase 1 Time/Content/Activity", "Adds persistence quality and audit trail.", "Estimates, To Do, Actual, attachments and revision history work."],
  [6, "Phase 2.1 Backlog Enhancement", "Adds list productivity and Iteration assignment field.", "Advanced filters/sort/inline edit/iteration assignment pass tests."],
  [7, "Phase 2.2 Timeboxes / Iterations", "Iteration records must exist before Iteration Status.", "Create/list/detail Iterations by Project/Team."],
  [8, "Phase 2.3 Iteration Status", "Execution visibility over assigned backlog items.", "Metrics/list/add item/detail integration work from same source of truth."],
  [9, "Phase 3 Team Board / Team Status", "Builds on Iteration Status and Schedule State.", "Board/status SRS confirmed and implemented."],
  [10, "Phase 3 Release / Quality / Milestones", "Delivery and quality layer on top of work item execution.", "Release readiness and defect workflow implemented."],
];

const riskRows = [
  ["TL-R01", "Phase 0 tracking is superseded by newer architecture foundation.", "Phase 0", "Medium", "Treat Phase 0 old file as historical; use architecture foundation for production.", "Open"],
  ["TL-R02", "Production implementation progress is still 0% in tracking.", "All active phases", "High", "BA docs are ready, but dev planning/implementation must start separately.", "Open"],
  ["TL-R03", "Phase 1 timebox may be tight after adding Manage Teams/Users.", "Phase 1", "Medium", "Prioritize Create Team and User team membership if scope must split.", "Open"],
  ["TL-R04", "Phase 2 uses UI name Iterations while DB may still call entity sprints.", "Phase 2", "Medium", "Document alias clearly in API/DB contract before dev.", "Open"],
  ["TL-R05", "Team Board/Team Status mockup exists but is not Phase 2.", "Phase 3", "High", "Keep Phase 3 placeholder and do not implement during Phase 2.", "Decided"],
  ["TL-R06", "Permission matrix is not fully defined for later phases.", "Phase 2+", "Medium", "Current mockup assumes Workspace Admin; define roles before production hardening.", "Open"],
];

const sourceRows = [
  ["Timeline source", sourcePath],
  ["Phase 0 checklist", "D:/Mini_Rally_pj/04_Developement_tracking/Phase 0/PHASE0_MOCKUP_CHECKLIST.md"],
  ["Phase 1 checklist", "D:/Mini_Rally_pj/04_Developement_tracking/Phase 1/PHASE1_MOCKUP_CHECKLIST.md"],
  ["Phase 2 checklist", "D:/Mini_Rally_pj/04_Developement_tracking/Phase 2/PHASE2_MOCKUP_CHECKLIST.md"],
  ["Phase 3 placeholder", "D:/Mini_Rally_pj/04_Developement_tracking/Phase 3/01_Team_Board_Team_Status/SRS.md"],
];

// Dashboard
{
  const ws = addSheet("Dashboard");
  setTitle(ws, "Mini Rally - Timeline Dashboard", "BA/Dev progress view generated from Time line.md. Green = done, blue = ready, amber = pending/next, gray = dev not started.", "J");
  ws.freezePanes.freezeRows(4);

  const cards = [
    ["Phase 2", "BA scope completed", "DONE"],
    ["Phase 1", "Ready for dev planning", "READY"],
    ["Phase 3", "Next BA definition", "NEXT"],
    ["Production", "Implementation not started", "DEV"],
  ];
  const cardAddrs = ["A4:B6", "D4:E6", "G4:H6", "J4:K6"];
  cardAddrs.forEach((addr, i) => {
    const r = ws.getRange(addr);
    r.merge();
    r.values = [[`${cards[i][0]}\n${cards[i][1]}\n${cards[i][2]}`]];
    const fill = i === 0 ? colors.paleGreen : i === 1 ? colors.paleBlue : i === 2 ? colors.paleAmber : colors.paleGray;
    const font = i === 0 ? colors.green : i === 1 ? colors.blue : i === 2 ? colors.amber : colors.gray;
    r.format = {
      fill,
      font: { bold: true, color: font, size: 12 },
      wrapText: true,
      horizontalAlignment: "center",
      verticalAlignment: "middle",
      borders: { preset: "outside", style: "medium", color: colors.border },
    };
    r.format.rowHeightPx = 70;
  });

  addNoteBox(ws, "A8:K11", "Current BA conclusion", [
    "Phase 2 is complete for mockup/SRS handoff.",
    "Phase 3 is the next BA definition area.",
    "Production development is not started in the tracking files.",
    "Team Board, Team Status, Release Management and Milestones must stay out of Phase 2.",
  ], colors.paleGreen);

  const summary = [
    ["Metric", "Value", "Meaning"],
    ["BA completed / closed slices", 5, "Phase 0 accepted + Phase 2.1/2.2/2.3 closed + Phase 2 context rule"],
    ["Ready for dev planning", 1, "Phase 1 baseline"],
    ["Next BA definition items", 5, "Team Board, Team Status, Release, Milestones, Quality/Defect"],
    ["Production status", "Not started", "Development tasks still show 0% in tracking"],
  ];
  ws.getRange("A13:C17").values = summary;
  ws.getRange("A13:C13").format = { fill: colors.navy, font: { bold: true, color: colors.white } };
  ws.getRange("A14:C17").format = { fill: colors.white, borders: { preset: "all", style: "thin", color: colors.border }, wrapText: true };

  const ownerRows = [
    ["Owner", "Doing now", "Done", "Next"],
    ["BA", "Phase 3 scope definition", "Phase 0/1/2 BA docs and mockups", "Team Board/Team Status/Release/Milestone/Quality SRS"],
    ["Dev", "No production work marked in tracker", "None in tracking", "Plan and implement Phase 1, then Phase 2"],
  ];
  const t = writeTable(ws, "E13", ownerRows[0], ownerRows.slice(1), "OwnerStatus", [14, 32, 34, 34]);
  ws.getRange("A:A").format.columnWidth = 18;
  ws.getRange("B:C").format.columnWidth = 28;
  ws.getRange("D:D").format.columnWidth = 4;
  ws.getRange("E:H").format.columnWidth = 28;
  ws.getRange("I:I").format.columnWidth = 3;
  ws.getRange("J:K").format.columnWidth = 20;
}

// Master Timeline
{
  const ws = addSheet("Master Timeline");
  setTitle(ws, "Master Timeline", "End-to-end phase view from foundation through future reporting/portfolio.", "J");
  ws.freezePanes.freezeRows(4);
  const meta = writeTable(ws, "A4", ["Order", "Phase", "Business Theme", "Main Scope", "BA Status", "Docs Status", "Dev Status", "Est. Hours", "Owner Track", "Current Decision"], masterRows, "MasterTimeline", [8, 14, 22, 42, 18, 24, 16, 11, 18, 46]);
  formatStatusColumn(ws, meta, 5);
  formatStatusColumn(ws, meta, 7);
  ws.getRange("H5:H15").format.numberFormat = "#,##0";
}

// Progress Tracker
{
  const ws = addSheet("Progress Tracker");
  setTitle(ws, "Progress Tracker", "Excel-style tracking sheet: see what is BA done, what Dev has not started, and what is next.", "H");
  ws.freezePanes.freezeRows(4);
  const meta = writeTable(ws, "A4", ["Phase", "Slice", "BA / Mockup / SRS Status", "Production Status", "Planned Effort", "Dependency", "Next Action", "Priority"], trackerRows, "ProgressTracker", [14, 30, 26, 18, 13, 28, 44, 12]);
  formatStatusColumn(ws, meta, 3);
  formatStatusColumn(ws, meta, 4);
  ws.getRange("E5:E19").format.numberFormat = "#,##0";
  statusStyle(ws, "H5:H19", 8);
  ws.getRange("H5:H19").format = { horizontalAlignment: "center", font: { bold: true }, wrapText: true };
}

// Phase Checklist
{
  const ws = addSheet("Phase Checklist");
  setTitle(ws, "Phase Checklist", "Detailed item status by phase. Use this sheet for BA progress review.", "E");
  ws.freezePanes.freezeRows(4);
  const meta = writeTable(ws, "A4", ["Phase", "Item", "Status", "Owner", "Notes"], checklistRows, "PhaseChecklist", [14, 34, 16, 14, 70]);
  formatStatusColumn(ws, meta, 3);
  ws.getRange("D5:D29").format = { horizontalAlignment: "center", font: { bold: true }, wrapText: true };
}

// Next Plan
{
  const ws = addSheet("Next Plan");
  setTitle(ws, "Next Plan", "What happens after Phase 2: BA definition first, then dev planning and implementation.", "F");
  ws.freezePanes.freezeRows(4);
  const meta = writeTable(ws, "A4", ["Order", "Workstream", "Target Output", "Dependency", "Owner", "Status"], nextRows, "NextPlan", [8, 30, 58, 28, 22, 16]);
  formatStatusColumn(ws, meta, 6);
  const meta2 = writeTable(ws, "A16", ["Build Order", "Capability", "Why First", "Exit Criteria"], buildRows, "BuildOrder", [12, 34, 56, 56]);
}

// Risks
{
  const ws = addSheet("Risks");
  setTitle(ws, "Risks & Follow-up", "Open risks and decision guardrails from the timeline.", "F");
  ws.freezePanes.freezeRows(4);
  const meta = writeTable(ws, "A4", ["ID", "Risk / Follow-up", "Phase", "Impact", "Current Handling", "Status"], riskRows, "RiskFollowUp", [12, 48, 14, 12, 58, 14]);
  formatStatusColumn(ws, meta, 6);
  statusStyle(ws, "D5:D10", 4);
  ws.getRange("D5:D10").format = { horizontalAlignment: "center", font: { bold: true }, wrapText: true };
}

// Source Notes
{
  const ws = addSheet("Source Notes");
  setTitle(ws, "Source Notes", "Audit trail for this workbook.", "B");
  const sourceMeta = writeTable(ws, "A4", ["Source", "Path"], sourceRows, "SourceNotes", [28, 120]);
  ws.getRange("A12:B15").values = [
    ["Generation note", "This workbook is derived from Time line.md. It is intended as a BA/Dev progress tracker, not a production implementation status report."],
    ["Source length", `${sourceText.length} characters`],
    ["Generated date", "2026-07-04"],
    ["File owner", "Mini Rally BA tracking"],
  ];
  ws.getRange("A12:B15").format = { wrapText: true, borders: { preset: "all", style: "thin", color: colors.border } };
  ws.getRange("A12:A15").format = { fill: colors.paleBlue, font: { bold: true, color: colors.navy } };
}

for (const ws of wb.worksheets.items) {
  const used = ws.getUsedRange();
  used.format.autofitRows();
}

await fs.mkdir(outputDir, { recursive: true });

// Compact verification before export.
const inspect = await wb.inspect({
  kind: "sheet,table",
  maxChars: 6000,
  tableMaxRows: 5,
  tableMaxCols: 8,
});
console.log(inspect.ndjson);

const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

for (const sheetName of ["Dashboard", "Master Timeline", "Progress Tracker", "Phase Checklist", "Next Plan", "Risks"]) {
  const preview = await wb.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  const bytes = new Uint8Array(await preview.arrayBuffer());
  await fs.writeFile(path.join(outputDir, `${sheetName.replace(/[^A-Za-z0-9]+/g, "_")}.png`), bytes);
}

const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(outputPath);
console.log(`SAVED ${outputPath}`);
