import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "D:/Mini_Rally_pj/outputs/project-completion-plan";
const outputPath = `${outputDir}/Mini Rally Project Completion Plan - Prod Status.xlsx`;
const qaDir = `${outputDir}/99_old/qa_latest_20260712`;
await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(qaDir, { recursive: true });

const wb = Workbook.create();
const sheets = [
  "Dashboard",
  "Assumptions",
  "Phase Roadmap",
  "Build Tasks",
  "Phase 3 Handoff",
  "Capacity Plan",
  "Risks & Decisions",
  "Source Notes",
];
for (const name of sheets) wb.worksheets.add(name);

const colors = {
  navy: "#173B6D",
  blue: "#2563EB",
  blueLight: "#DBEAFE",
  green: "#16803C",
  greenLight: "#DCFCE7",
  amber: "#B45309",
  amberLight: "#FEF3C7",
  red: "#B91C1C",
  redLight: "#FEE2E2",
  purple: "#6D28D9",
  purpleLight: "#EDE9FE",
  grayText: "#64748B",
  gray: "#E5E7EB",
  grayLight: "#F8FAFC",
  border: "#CBD5E1",
  white: "#FFFFFF",
  black: "#0F172A",
};

function safeName(value) {
  return value.replace(/[^A-Za-z0-9_]/g, "_");
}

function setTitle(sheet, title, subtitle, lastCol = "H") {
  sheet.showGridLines = false;
  sheet.getRange(`A1:${lastCol}1`).merge();
  sheet.getRange("A1").values = [[title]];
  sheet.getRange("A1").format = {
    fill: colors.navy,
    font: { bold: true, color: colors.white, size: 16 },
    horizontalAlignment: "left",
  };
  sheet.getRange(`A2:${lastCol}2`).merge();
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange("A2").format = {
    fill: "#EFF6FF",
    font: { color: colors.grayText, italic: true },
    wrapText: true,
  };
  sheet.getRange("A1:A2").format.rowHeight = 24;
}

function writeTable(sheet, startRow, startCol, headers, rows, tableName) {
  const colCount = headers.length;
  const rowCount = rows.length + 1;
  const range = sheet.getRangeByIndexes(startRow - 1, startCol - 1, rowCount, colCount);
  range.values = [headers, ...rows];
  const header = sheet.getRangeByIndexes(startRow - 1, startCol - 1, 1, colCount);
  header.format = {
    fill: colors.navy,
    font: { bold: true, color: colors.white },
    wrapText: true,
    horizontalAlignment: "center",
  };
  range.format.borders = { preset: "all", style: "thin", color: colors.border };
  range.format.wrapText = true;
  const table = sheet.tables.add(range.address, true, tableName);
  table.style = "TableStyleMedium2";
  table.showFilterButton = true;
  return { range, table, rowCount, colCount };
}

function statusFill(status) {
  if (["Done", "BA Done", "Accepted", "Prod Gap Fixed", "Completed"].includes(status)) return colors.greenLight;
  if (["Ready for Dev", "Ready", "BA/SRS Ready", "Planned", "Target 20/07", "Decided"].includes(status)) return colors.blueLight;
  if (["In Progress", "Dev In Progress", "In Review", "Dev In Review", "Pending Confirm", "Pending BA"].includes(status)) return colors.amberLight;
  if (["Blocked", "Open Risk"].includes(status)) return colors.redLight;
  if (["Future", "Future Backlog", "Deferred", "Post-MVP"].includes(status)) return colors.purpleLight;
  return colors.grayLight;
}

function applyStatusBand(sheet, firstDataRow, statusCol, lastCol, rows) {
  rows.forEach((row, idx) => {
    const status = row[statusCol - 1];
    const r = firstDataRow + idx;
    sheet.getRangeByIndexes(r - 1, statusCol - 1, 1, 1).format.fill = statusFill(status);
    sheet.getRangeByIndexes(r - 1, statusCol - 1, 1, 1).format.font = {
      bold: true,
      color: colors.black,
    };
    sheet.getRangeByIndexes(r - 1, 1 - 1, 1, lastCol).format.borders = {
      bottom: { style: "thin", color: colors.border },
    };
  });
}

function setWidths(sheet, widths) {
  widths.forEach((width, idx) => {
    sheet.getRangeByIndexes(0, idx, 1, 1).format.columnWidth = width;
  });
}

const assumptions = [
  ["Input", "Value", "Notes"],
  ["Workbook Updated", new Date(2026, 6, 12), "Latest BA/doc status baseline after Part 1-5 confirmation and final audit."],
  ["Target Phase 5 Finish", new Date(2026, 6, 20), "Compressed target: finish execution through Phase 5 by 2026-07-20."],
  ["Dev Count", 2, "Current project has 2 developers."],
  ["BA Count", 1, "Current project has 1 BA."],
  ["Conservative Dev Hours / Dev / Day", 4, "Evening work lower bound."],
  ["Target Dev Hours / Dev / Day", 6.7, "Required compressed target basis to finish Phase 5 by 2026-07-20."],
  ["Optimistic Dev Hours / Dev / Day", 9, "Upper compressed target; assumes parallel work and weekend support."],
  ["Base BA Hours / Day", 3, "Editable default for BA follow-up/spec review."],
  ["Buffer %", 0.2, "Applied to forecast estimates."],
  ["Calendar Days / Week", 7, "Compressed plan uses calendar days, including weekend support."],
  ["Forecast Scenario", "Target 20/07", "Valid values: Target 20/07, Normal Base, Fallback."],
];

const phaseRows = [
  ["Phase 0", "Foundation", "BA Accepted", "Done", "Dev", 12, 4, "High", "High", "Foundation scope is accepted as baseline for the Mini Rally BA pack.", "None", "Testing document exists and Phase 0 is not in the current change scope.", "Completed"],
  ["Phase 1", "Core Work Management", "BA/SRS Ready", "In Review", "Dev + BA", 16, 8, "High", "High", "Projects, Teams, Users, Backlog, Work Item detail, Task, Time, Content and Activity are covered as the core work-management baseline.", "Phase 0", "Testing document exists; keep remaining implementation defects as prod follow-up rather than BA scope change.", "Dev In Review"],
  ["Phase 2.1", "Backlog Enhancement", "BA/SRS Ready", "In Review", "Dev", 9, 2, "High", "High", "Backlog filters, sorting, rank/order behavior, bulk assignment and Iteration/Release assignment are confirmed.", "Phase 1 Backlog", "No schema/infra changes in this BA pass.", "Dev In Review"],
  ["Phase 2.2", "Timeboxes / Iterations", "BA/SRS Ready", "In Review", "Dev", 14, 2, "High", "High", "Iterations default to Planning; assigning backlog into an Iteration means the team has committed scope.", "Phase 1 + P2.1", "Status remains manual-first; system auto-status is convenience only.", "Dev In Review"],
  ["Phase 2.3", "Iteration Status", "BA/SRS Ready", "In Review", "Dev", 14, 2, "High", "High", "Iteration Status supports manual team execution; when all US/DE are Accepted the system may auto-mark Iteration Accepted, but user can override manually.", "P2.1 + P2.2", "No lock: teams can still add US/DE while sprint is running.", "Dev In Review"],
  ["Phase 3", "Agile Delivery Extensions", "BA/SRS Ready", "In Progress", "BA + Dev", 44, 10, "High", "High", "Team Status, Release Management, Milestones and Quality > Defect are confirmed for dev execution. Team Board is out of current Agile MVP.", "Phase 2", "Task roll-up, manual status override, release/milestone assignment and quality dashboard rules are confirmed.", "Dev In Progress"],
  ["Phase 4", "Collaboration & Governance", "Planned", "Not Started", "BA + Dev", 30, 8, "High", "Medium", "Notifications, RBAC/permissions, settings, audit and workflow governance. Team Board is excluded from this target and stays Future Backlog.", "Phase 1-3", "Compressed execution window: finish Phase 4 by 2026-07-18.", "Target 20/07"],
  ["Phase 5", "Reporting", "Planned", "Not Started", "BA + Dev", 24, 6, "High", "Medium", "Dashboard, Burndown, Velocity, Workload, Release Progress and Exports.", "Phase 1-4 data", "Compressed execution window: finish Phase 5 by 2026-07-20.", "Target 20/07"],
  ["Post-MVP", "Portfolio", "Future", "Not Started", "BA + Dev", 32, 8, "Low", "Low", "Initiative, roadmap, cross-project tracking.", "MVP decision", "Optional; not included in MVP release forecast.", "Post-MVP"],
];

const phaseTargetEnds = [
  new Date(2026, 6, 12),
  new Date(2026, 6, 13),
  new Date(2026, 6, 14),
  new Date(2026, 6, 14),
  new Date(2026, 6, 15),
  new Date(2026, 6, 16),
  new Date(2026, 6, 18),
  new Date(2026, 6, 20),
  "Post-MVP",
];

const taskRows = [
  ["P0-01", "Phase 0", "Foundation", "DB/Auth baseline", "Verify migrations, fixed company, admin seed, auth/session and project/team context API are production-ready.", "BA Accepted", "Done", "Dev 1", "BA", "High", 5, "High", "None", "MVP", "2026-07-08"],
  ["P0-02", "Phase 0", "Foundation", "App shell and context", "Wire protected routes, navigation, breadcrumb, context selector and access/error states.", "BA Accepted", "Done", "Dev 2", "BA", "High", 4, "Medium", "P0-01", "MVP", "2026-07-08"],
  ["P0-03", "Phase 0", "Foundation", "Project CRUD verification", "Verify create/edit/archive/restore project, fixed workspace, permission enforcement and smoke tests.", "BA Accepted", "Done", "Dev 1", "BA", "High", 3, "Medium", "P0-01", "Jul 10", "2026-07-10"],

  ["P1-01", "Phase 1", "Manage", "Create Project", "Build Manage > Projects create/edit/deactive flow and project selector compatibility.", "Ready for Dev", "Done", "Dev 1", "BA", "Critical", 3, "High", "P0-01", "Jul 10", "2026-07-10"],
  ["P1-02", "Phase 1", "Manage", "Create Team", "Build Teams list and Team Info/Members modal; status Active/Deactive; members selectable with search.", "Ready for Dev", "Done", "Dev 1", "BA", "Critical", 3, "High", "P1-01", "Jul 10", "2026-07-10"],
  ["P1-03", "Phase 1", "Manage", "Invite/Edit User", "Build Users list and Invite/Edit User modal; assign user to teams only; user project access derives from Team -> Project.", "Ready for Dev", "Done", "Dev 2", "BA", "High", 2.5, "High", "P1-02", "MVP", "2026-07-12"],
  ["P1-04", "Phase 1", "Backlog", "Backlog base list", "Build Story/Defect backlog list with selected Project/Team context, server search/filter/sort/pagination.", "Ready for Dev", "Done", "Dev 2", "BA", "Critical", 3, "High", "P1-01,P1-02", "Jul 10", "2026-07-10"],
  ["P1-05", "Phase 1", "Work Item", "Create Work Item", "Build Story/Defect quick create and create-with-details; Project/Team required and validated.", "Ready for Dev", "Done", "Dev 2", "BA", "Critical", 3, "High", "P1-04", "Jul 10", "2026-07-10"],
  ["P1-06", "Phase 1", "Work Item", "Work Item Detail", "Build full detail page with Details, Tasks, Revision History and right-panel fields.", "Ready for Dev", "Done", "Dev 1", "BA", "High", 4, "Medium", "P1-05", "MVP", "2026-07-15"],
  ["P1-07", "Phase 1", "Task", "Child Task flow", "Build task list, add task modal, task detail, task estimates and parent validation.", "Ready for Dev", "In Review", "Dev 2", "BA", "High", 4, "Medium", "P1-06", "MVP", "2026-07-16"],
  ["P1-08", "Phase 1", "Content", "Time/content/activity", "Persist Plan Estimate, To Do, Actual, Description, Notes, Attachments and Revision History.", "Ready for Dev", "In Review", "Dev 1", "BA", "Medium", 4, "Medium", "P1-06", "MVP", "2026-07-17"],

  ["P2-01", "Phase 2.1", "Backlog Enhancement", "Advanced list behavior", "Add Manage Filters, column sorting, resizable columns, inline edit, rank reorder and bulk release/iteration assignment.", "Done", "Done", "Dev 1", "BA", "Critical", 9, "High", "P1-04,P1-05", "MVP", "2026-07-18"],
  ["P2-02", "Phase 2.2", "Timeboxes", "Create Timebox / Iteration", "Build Plan > Timeboxes Iterations list, quick create, create-with-details and full Iteration detail.", "Done", "Done", "Dev 2", "BA", "Critical", 8, "High", "P1-02,P2-01", "Jul 10", "2026-07-10"],
  ["P2-03", "Phase 2.2", "Timeboxes", "Assign backlog to Iteration", "Expose Work Item Iteration field in Backlog list/detail and validate Project/Team match.", "Done", "Done", "Dev 1", "BA", "Critical", 6, "High", "P2-02", "MVP", "2026-07-19"],
  ["P2-04", "Phase 2.3", "Iteration Status", "Iteration Status page", "Build Track > Iteration Status selector, metrics strip, list, filters, inline edit and detail integration.", "Done", "In Review", "Dev 2", "BA", "Critical", 10, "High", "P2-02,P2-03", "Jul 10", "2026-07-10"],
  ["P2-05", "Phase 2.3", "Iteration Status", "Add item to Iteration", "Create Story/Defect directly into selected Iteration and also show it in Backlog; reuse Backlog create-with-details flow.", "Done", "In Review", "Dev 1", "BA", "High", 4, "High", "P2-04", "MVP", "2026-07-19"],

  ["P3-01", "Phase 3", "Team Status", "Team Status + Task roll-up", "Build Team Status from Iteration Status template. Tasks are optional child records; when all child Tasks are Completed, parent US/DE can auto-complete, while user can still change status manually.", "BA/SRS Ready", "In Progress", "Dev 2", "BA", "Critical", 10, "High", "P2-04", "20/07 Target", "2026-07-13"],
  ["P3-02", "Phase 3", "Release", "Release Management", "Build Release list/create/detail with Planning/Active/Accepted status. A Story/Defect has one active Release assignment; readiness is interpreted by users from US/DE notes, not a locked checklist.", "BA/SRS Ready", "Not Started", "Dev 1", "BA", "Critical", 10, "High", "P1-05,P2-01", "20/07 Target", "2026-07-14"],
  ["P3-03", "Phase 3", "Milestone", "Milestone core", "Build project-level Milestone list/create/detail: multi project/team/release selection, target dates, owner/status and direct assignment of US/DE artifacts to the milestone.", "BA/SRS Ready", "Not Started", "Dev 2", "BA", "High", 10, "Medium", "P3-02", "20/07 Target", "2026-07-15"],
  ["P3-04", "Phase 3", "Quality", "Quality > Defect dashboard", "Build dedicated Quality > Defect dashboard using Backlog Defect data and columns: Rank, ID, Name, User Story, Severity, Priority, State, Flow State, Fixed In Build, Iteration, Submitted By, Owner.", "BA/SRS Ready", "Not Started", "Dev 1", "BA", "High", 14, "Medium", "P1-06", "20/07 Target", "2026-07-16"],
  ["P3-05", "Phase 3", "Task Dashboard", "Inline edit in Task Dashboard", "Task Dashboard supports inline edit for Task status and key fields. The auto-complete behavior is convenience only and does not lock manual US/DE status changes.", "BA/SRS Ready", "Not Started", "Dev 2", "BA", "Medium", 4, "Medium", "P3-01", "20/07 Target", "2026-07-16"],
  ["P3-06", "Phase 3", "Release", "Release readiness note", "No readiness checklist in app; users gather readiness from US/DE release notes. Keep release summary and notes editable.", "BA/SRS Ready", "Not Started", "Dev 1", "BA", "Medium", 2, "Medium", "P3-02,P3-04", "20/07 Target", "2026-07-16"],

  ["P4-01", "Phase 4", "Future Backlog", "Team Board", "Keep Team Board in Backlog for the future. Current Agile flow continues with Backlog, Iteration Status, Team Status, Release, Milestone and Quality views.", "Future Backlog", "Not Started", "Dev 1", "BA", "High", 0, "Medium", "P2-04,P3-04", "Future", "Future"],
  ["P4-02", "Phase 4", "Governance", "Notifications", "Build in-app notifications for assigned, mentioned, comments, status, iteration/release dates and read/unread.", "Planned", "Not Started", "Dev 1", "BA", "Medium", 8, "Medium", "Phase 1-3", "20/07 Target", "2026-07-17"],
  ["P4-03", "Phase 4", "Governance", "RBAC and permission hardening", "Define and enforce workspace/project roles, action-level gating, backend permission codes and access denied states.", "Planned", "Not Started", "Dev 2", "BA", "High", 14, "Medium", "Phase 1-3", "20/07 Target", "2026-07-18"],
  ["P4-04", "Phase 4", "Governance", "Settings and audit", "Project/workflow settings, labels, user admin rules, audit log and destructive confirmation patterns.", "Planned", "Not Started", "Dev 1", "BA", "Medium", 8, "Medium", "P4-03", "20/07 Target", "2026-07-18"],

  ["P5-01", "Phase 5", "Reporting", "Dashboard and burndown", "Build project/iteration dashboard, burndown, velocity, planned vs completed and blocked item rollups.", "Planned", "Not Started", "Dev 2", "BA", "Medium", 10, "Medium", "Phase 1-4 data", "20/07 Target", "2026-07-19"],
  ["P5-02", "Phase 5", "Reporting", "Operational reports", "Build workload, defect summary, release progress, filters and export report capability.", "Planned", "Not Started", "Dev 1", "BA", "Medium", 10, "Medium", "P5-01", "20/07 Target", "2026-07-20"],
  ["P5-03", "Phase 5", "Reporting", "Report QA and handoff", "Verify report numbers against source records, permissions and export output.", "Planned", "Not Started", "Dev 2", "BA", "Medium", 4, "Medium", "P5-02", "20/07 Target", "2026-07-20"],
];

const milestoneRows = [
  ["P3H-01", "Task roll-up", "Child Tasks are optional. When all Tasks under a US/DE are Completed, that US/DE can auto-complete; user may still manually change status.", "Phase 3", "P3-01,P3-05", "Dev 2", "Critical", "Done", 10, "High"],
  ["P3H-02", "Iteration lifecycle", "Iteration starts Planning; assigning backlog commits sprint scope; all US/DE Accepted can auto-mark Iteration Accepted, but manual status override remains allowed.", "Phase 2.3", "P2-04,P2-05", "Dev 2", "Critical", "Done", 10, "High"],
  ["P3H-03", "Team Status", "Team Status remains a tracking view; no board lock and no restriction on adding US/DE while sprint is running.", "Phase 3", "P3-01", "Dev 2", "Critical", "Done", 10, "High"],
  ["P3H-04", "Release Management", "One active Release assignment per Story/Defect. Release status is user-managed; no readiness checklist lock.", "Phase 3", "P3-02,P3-06", "Dev 1", "Critical", "Done", 10, "High"],
  ["P3H-05", "Milestones", "Milestones can link multiple projects/teams/releases and assign US/DE artifacts directly.", "Phase 3", "P3-03", "Dev 2", "High", "Done", 10, "Medium"],
  ["P3H-06", "Quality > Defect", "Dedicated Quality > Defect dashboard uses Defect work items and keeps advanced actions such as delete/reopen/bulk for later.", "Phase 3", "P3-04", "Dev 1", "High", "Done", 14, "Medium"],
  ["P3H-07", "Team Board", "Team Board is not part of the current Agile MVP flow and is moved to Future Backlog.", "Phase 4", "P4-01", "BA", "Medium", "Deferred", 0, "High"],
];

const capacityRows = [
  ["Target 20/07", 2, 6.7, 13.4, 1, 4, 0, "Compressed target: calendar-day execution, parallel dev work, weekend support, no Team Board."],
  ["Normal Base", 2, 5, 10, 1, 3, 0.2, "Normal evening capacity; likely misses 2026-07-20 unless scope is reduced."],
  ["Fallback", 2, 4, 8, 1, 2, 0.2, "High-risk path; requires descoping or moving Phase 4/5 items back to backlog."],
];

const riskRows = [
  ["R01", "Auto-status must not remove user control.", "Phase 2/3", "High", "Treat auto-complete as convenience only. Users can manually change Task, US/DE, Release, Milestone and Iteration status.", "BA/Dev", "Decided"],
  ["R02", "Phase 3 development can drift if docs and mockups are not frozen.", "Phase 3", "Medium", "Use the confirmed Part 1-5 rules as the dev handoff baseline; schema/DB/infra remain out of scope for this BA pass.", "BA/Dev", "Open Risk"],
  ["R03", "20/07 finish target is compressed and capacity-sensitive.", "Phase 3-5", "High", "Keep scope frozen, exclude Team Board, run parallel dev tracks and include weekend/calendar-day support.", "BA/Dev", "Open Risk"],
  ["R04", "Team Board must not be included in the current Agile MVP flow.", "Phase 4/Future", "High", "Workbook places Team Board in Future Backlog and keeps Team Status as the Phase 3 tracking view.", "BA", "Decided"],
  ["R05", "Milestone artifact behavior is confirmed at BA level.", "Phase 3", "Low", "Milestones may assign US/DE artifacts directly; no readiness checklist is required.", "BA", "Decided"],
  ["R06", "Permissions matrix is not finalized.", "Phase 4", "Medium", "Define minimum RBAC/settings/audit scope needed for 20/07; move hardening extras to future backlog.", "BA/Tech", "Open Risk"],
  ["R07", "Phase 0-3 testing and traceability need to stay synchronized as dev continues.", "Phase 0-3", "Medium", "Testing documents exist and should be updated when production behavior changes.", "BA/QA", "In Review"],
];

const sourceRows = [
  ["Time line.md", "Master timeline, Phase 2 closure, recommended build order and risks.", "D:/Mini_Rally_pj/Time line.md"],
  ["Project_developement_plan.md", "Roadmap, phase scope and latest baseline decisions.", "D:/Mini_Rally_pj/04_Developement_tracking/Project_developement_plan.md"],
  ["PHASE0_DEVELOPMENT_TRACKING.md", "Phase 0 historical 12h tracking and acceptance notes.", "D:/Mini_Rally_pj/04_Developement_tracking/Phase 0/PHASE0_DEVELOPMENT_TRACKING.md"],
  ["PHASE1_DEVELOPMENT_TRACKING.md", "Phase 1 official 16h cap and task plan.", "D:/Mini_Rally_pj/04_Developement_tracking/Phase 1/PHASE1_DEVELOPMENT_TRACKING.md"],
  ["PHASE2_DEVELOPMENT_TRACKING.md", "Phase 2 37h tracking, P2.1/P2.2/P2.3 tasks and context rules.", "D:/Mini_Rally_pj/04_Developement_tracking/Phase 2/PHASE2_DEVELOPMENT_TRACKING.md"],
  ["Phase 3 Team Status SRS", "Team Status scope and dashboard behavior ready for development.", "D:/Mini_Rally_pj/04_Developement_tracking/Phase 3/01_Team_Status/SRS.md"],
  ["Phase 3 Release SRS", "Release Management scope ready for development.", "D:/Mini_Rally_pj/04_Developement_tracking/Phase 3/02_Release_Management/SRS.md"],
  ["Phase 3 Milestone SRS", "Milestone core scope ready; US/DE artifact assignment confirmed.", "D:/Mini_Rally_pj/04_Developement_tracking/Phase 3/03_Milestones/SRS.md"],
  ["Phase 3 Quality Defect SRS", "Quality > Defect dashboard scope ready.", "D:/Mini_Rally_pj/04_Developement_tracking/Phase 3/04_Quality_Defect/SRS.md"],
  ["Mini Rally doc commit", "Latest committed BA/doc baseline after Phase 0-3 final audit.", "D:/Mini_Rally_pj @ 7e68304a"],
  ["Testing folder", "Phase 0/1/2/3 testing documents, E2E flows and traceability matrix.", "D:/Mini_Rally_pj/testing"],
  ["RALLY_MINI_RALLY_ALIGNMENT_GAP.md", "BA-facing alignment and remaining gap baseline.", "D:/Mini_Rally_pj/output/RALLY_MINI_RALLY_ALIGNMENT_GAP.md"],
  ["RALLY_TEST_EXECUTION_2026-07-07.md", "Runtime BA/FE verification result for Rally Phase 0/1/2.", "D:/Mini_Rally_pj/output/RALLY_TEST_EXECUTION_2026-07-07.md"],
];

// Assumptions
{
  const sheet = wb.worksheets.getItem("Assumptions");
  setTitle(sheet, "Assumptions", "Editable planning inputs for the Mini Rally completion workbook.", "F");
  sheet.getRange("A4:C15").values = assumptions;
  sheet.getRange("A4:C4").format = { fill: colors.navy, font: { bold: true, color: colors.white } };
  sheet.getRange("A4:C15").format.borders = { preset: "all", style: "thin", color: colors.border };
  sheet.getRange("A4:C15").format.wrapText = true;
  sheet.getRange("B5:B6").setNumberFormat("yyyy-mm-dd");
  sheet.getRange("B13").setNumberFormat("0%");
  sheet.getRange("B15").dataValidation = { rule: { type: "list", values: ["Target 20/07", "Normal Base", "Fallback"] } };
  setWidths(sheet, [34, 18, 70]);
  sheet.freezePanes.freezeRows(4);
}

// Phase Roadmap
{
  const sheet = wb.worksheets.getItem("Phase Roadmap");
  setTitle(sheet, "Phase Roadmap", "Compressed phase-level plan: finish execution through Phase 5 by 2026-07-20. Portfolio remains Post-MVP.", "O");
  const headers = ["Phase", "Theme", "BA Status", "Dev Status", "Primary Owner", "Dev Estimate h", "BA Estimate h", "Priority", "Confidence", "Build Scope", "Dependency", "Notes", "Tracker Status", "Dev Days Base", "Target End"];
  const rows = phaseRows.map((r, i) => [
    ...r,
    `=SUMIF('Build Tasks'!$B$5:$B$33,A${i + 5},'Build Tasks'!$P$5:$P$33)/('Assumptions'!$B$7*'Assumptions'!$B$10)`,
    phaseTargetEnds[i],
  ]);
  writeTable(sheet, 4, 1, headers, rows, "PhaseRoadmapTable");
  applyStatusBand(sheet, 5, 13, headers.length, rows);
  sheet.getRange("F5:G13").setNumberFormat("0.0");
  sheet.getRange("N5:N13").setNumberFormat("0.0");
  sheet.getRange("O5:O13").setNumberFormat("yyyy-mm-dd");
  setWidths(sheet, [12, 24, 16, 16, 14, 13, 13, 10, 12, 55, 22, 48, 16, 14, 16]);
  sheet.freezePanes.freezeRows(4);
}

// Build Tasks
{
  const sheet = wb.worksheets.getItem("Build Tasks");
  setTitle(sheet, "Build Tasks", "Detailed build checklist: what each phase needs to build, who owns it, estimate and release target.", "Q");
  const headers = ["ID", "Phase", "Workstream", "Capability", "Build Detail", "BA Status", "Dev Status", "Dev Owner", "BA Owner", "Priority", "Estimate h", "Confidence", "Dependency", "Release Target", "Target Date", "Remaining h", "Progress"];
  const rows = taskRows.map((r, i) => {
    const rowNum = i + 5;
    return [...r, `=IF(G${rowNum}="Done",0,IF(G${rowNum}="In Review",K${rowNum}*0.35,IF(G${rowNum}="In Progress",K${rowNum}*0.5,K${rowNum})))`, `=IF(G${rowNum}="Done",1,IF(G${rowNum}="In Review",0.65,IF(G${rowNum}="In Progress",0.5,0)))`];
  });
  writeTable(sheet, 4, 1, headers, rows, "BuildTasksTable");
  applyStatusBand(sheet, 5, 7, headers.length, rows);
  sheet.getRange("K5:K33").setNumberFormat("0.0");
  sheet.getRange("P5:P33").setNumberFormat("0.0");
  sheet.getRange("Q5:Q33").setNumberFormat("0%");
  sheet.getRange("O5:O33").setNumberFormat("yyyy-mm-dd");
  sheet.getRange("G5:G33").dataValidation = { rule: { type: "list", values: ["Not Started", "In Progress", "In Review", "Done", "Blocked"] } };
  sheet.getRange("J5:J33").dataValidation = { rule: { type: "list", values: ["Critical", "High", "Medium", "Low"] } };
  setWidths(sheet, [10, 12, 18, 24, 72, 14, 14, 12, 10, 11, 11, 11, 24, 14, 13, 12, 10]);
  sheet.freezePanes.freezeRows(4);
  sheet.freezePanes.freezeColumns(2);
}

// Phase 3 Handoff
{
  const sheet = wb.worksheets.getItem("Phase 3 Handoff");
  setTitle(sheet, "Phase 3 Handoff", "Confirmed BA rules for Phase 3 development after Part 1-5 confirmation and final audit.", "K");
  const headers = ["ID", "Confirmed Point", "Acceptance Meaning", "Phase", "Linked Task", "Owner", "Priority", "Status", "Estimate h", "Confidence", "Confirmed?"];
  const rows = milestoneRows.map((r, i) => [...r, `=IF(H${i + 5}="Done","Yes","No")`]);
  writeTable(sheet, 4, 1, headers, rows, "Phase3HandoffTable");
  applyStatusBand(sheet, 5, 8, headers.length, rows);
  sheet.getRange("I5:I11").setNumberFormat("0.0");
  sheet.getRange("H5:H11").dataValidation = { rule: { type: "list", values: ["Not Started", "In Progress", "In Review", "Done", "Deferred", "Blocked"] } };
  setWidths(sheet, [10, 24, 70, 14, 20, 12, 11, 14, 11, 12, 10]);
  sheet.freezePanes.freezeRows(4);
}

// Capacity Plan
{
  const sheet = wb.worksheets.getItem("Capacity Plan");
  setTitle(sheet, "Capacity Plan", "Compressed delivery-capacity view for finishing through Phase 5 by 2026-07-20.", "L");
  const headers = ["Scenario", "Dev Count", "Dev h / Day", "Dev Capacity / Day", "BA Count", "BA h / Day", "Buffer %", "Notes", "Target Remaining h", "Buffered h", "Calendar Days", "Forecast End"];
  const rows = capacityRows.map((r, i) => {
    const row = i + 5;
    return [
      ...r,
      `=SUMIFS('Build Tasks'!P5:P33,'Build Tasks'!N5:N33,"20/07 Target")+SUMIFS('Build Tasks'!P5:P33,'Build Tasks'!N5:N33,"MVP")+SUMIFS('Build Tasks'!P5:P33,'Build Tasks'!N5:N33,"Jul 10")`,
      `=I${row}*(1+G${row})`,
      `=CEILING(J${row}/D${row},1)`,
      `='Assumptions'!$B$5+K${row}`,
    ];
  });
  writeTable(sheet, 4, 1, headers, rows, "CapacityPlanTable");
  sheet.getRange("G5:G7").setNumberFormat("0%");
  sheet.getRange("I5:K7").setNumberFormat("0.0");
  sheet.getRange("L5:L7").setNumberFormat("yyyy-mm-dd");
  setWidths(sheet, [16, 11, 12, 16, 10, 10, 10, 32, 12, 12, 13, 14]);
  sheet.freezePanes.freezeRows(4);
}

// Risks
{
  const sheet = wb.worksheets.getItem("Risks & Decisions");
  setTitle(sheet, "Risks & Decisions", "Open risks and decisions that can change timeline, priority or scope.", "G");
  const headers = ["ID", "Risk / Decision", "Phase", "Impact", "Mitigation / Decision", "Owner", "Status"];
  writeTable(sheet, 4, 1, headers, riskRows, "RisksDecisionsTable");
  applyStatusBand(sheet, 5, 7, headers.length, riskRows);
  setWidths(sheet, [9, 60, 14, 12, 70, 16, 14]);
  sheet.freezePanes.freezeRows(4);
}

// Source Notes
{
  const sheet = wb.worksheets.getItem("Source Notes");
  setTitle(sheet, "Source Notes", "Auditable source files used to create this workbook. Paths are plain text so BA/dev can verify them.", "C");
  const headers = ["Source", "Used For", "Path"];
  writeTable(sheet, 4, 1, headers, sourceRows, "SourceNotesTable");
  setWidths(sheet, [34, 70, 94]);
  sheet.freezePanes.freezeRows(4);
}

// Dashboard last so formulas can reference populated sheets.
{
  const sheet = wb.worksheets.getItem("Dashboard");
  setTitle(sheet, "Mini Rally Project Completion Dashboard", "Compressed BA/Dev time plan: finish execution through Phase 5 by 2026-07-20.", "J");
  sheet.getRange("A4:J4").merge();
  sheet.getRange("A4").values = [["Executive Summary"]];
  sheet.getRange("A4").format = { fill: colors.blueLight, font: { bold: true, color: colors.navy, size: 13 } };

  const cards = [
    ["A6:B7", "A8:B9", "Current BA scope ready", `=(COUNTIF('Phase Roadmap'!C5:C10,"Done")+COUNTIF('Phase Roadmap'!C5:C10,"Ready for Dev")+COUNTIF('Phase Roadmap'!C5:C10,"BA Accepted")+COUNTIF('Phase Roadmap'!C5:C10,"BA/SRS Ready"))/COUNTA('Phase Roadmap'!C5:C10)`, "Phase 0-3 docs/mockups", "0%"],
    ["D6:E7", "D8:E9", "Dev completion", `=AVERAGE('Build Tasks'!Q5:Q33)`, "Production task completion", "0%"],
    ["G6:H7", "G8:H9", "P3 handoff ready", `=COUNTIF('Phase 3 Handoff'!H5:H11,"Done")/(COUNTA('Phase 3 Handoff'!H5:H11)-COUNTIF('Phase 3 Handoff'!H5:H11,"Deferred"))`, "Confirmed BA rules", "0%"],
    ["I6:J7", "I8:J9", "Target finish", `='Assumptions'!B6`, "Phase 5 complete by", "yyyy-mm-dd"],
  ];
  for (const [labelRange, metricRange, title, formula, note, numberFormat] of cards) {
    const blockRange = `${labelRange.split(":")[0]}:${metricRange.split(":")[1]}`;
    sheet.getRange(blockRange).format = {
      fill: colors.white,
      borders: { preset: "outside", style: "thin", color: colors.border },
      wrapText: true,
    };
    sheet.getRange(labelRange).merge();
    sheet.getRange(metricRange).merge();
    const labelCell = labelRange.split(":")[0];
    const metricCell = metricRange.split(":")[0];
    sheet.getRange(labelCell).values = [[`${title}\n${note}`]];
    sheet.getRange(labelCell).format.font = { bold: true, color: colors.grayText };
    sheet.getRange(metricCell).formulas = [[formula]];
    sheet.getRange(metricCell).setNumberFormat(numberFormat);
    sheet.getRange(metricCell).format = {
      font: { bold: true, size: 22, color: colors.navy },
      horizontalAlignment: "center",
      verticalAlignment: "middle",
    };
  }

  sheet.getRange("A12:J12").merge();
  sheet.getRange("A12").values = [["Compressed Target Forecast"]];
  sheet.getRange("A12").format = { fill: colors.navy, font: { bold: true, color: colors.white } };
  sheet.getRange("A13:J18").values = [
    ["Scenario", "Dev h/day", "Buffered Dev h", "Calendar days", "Forecast End", "Interpretation", "", "", "", ""],
    ["Target 20/07", "='Capacity Plan'!D5", "='Capacity Plan'!J5", "='Capacity Plan'!K5", "='Capacity Plan'!L5", "Compressed plan required to finish Phase 5 on 2026-07-20.", "", "", "", ""],
    ["Normal Base", "='Capacity Plan'!D6", "='Capacity Plan'!J6", "='Capacity Plan'!K6", "='Capacity Plan'!L6", "Misses target unless scope is reduced or capacity is increased.", "", "", "", ""],
    ["Fallback", "='Capacity Plan'!D7", "='Capacity Plan'!J7", "='Capacity Plan'!K7", "='Capacity Plan'!L7", "High-risk path; move Phase 4/5 items back to backlog if capacity is unavailable.", "", "", "", ""],
    ["Target Scope Through Phase 5", "", "='Capacity Plan'!I5", "='Capacity Plan'!K5", "='Assumptions'!B6", "Target scope excludes Team Board; finish Phase 3 by 16/07, Phase 4 by 18/07, Phase 5 by 20/07.", "", "", "", ""],
    ["Immediate next action", "", "", "", "", "Run Phase 3 13-16/07, Phase 4 17-18/07, Phase 5 19-20/07. Keep scope frozen.", "", "", "", ""],
  ];
  sheet.getRange("A13:F13").format = { fill: colors.blueLight, font: { bold: true, color: colors.navy } };
  sheet.getRange("C14:D17").setNumberFormat("0.0");
  sheet.getRange("E14:E17").setNumberFormat("yyyy-mm-dd");
  sheet.getRange("A13:F18").format.borders = { preset: "all", style: "thin", color: colors.border };
  sheet.getRange("A13:F18").format.wrapText = true;
  sheet.getRange("A17:F18").format.rowHeight = 34;

  sheet.getRange("A21:J21").merge();
  sheet.getRange("A21").values = [["Current Phase Status"]];
  sheet.getRange("A21").format = { fill: colors.navy, font: { bold: true, color: colors.white } };
  sheet.getRange("A22:F31").values = [
    ["Phase", "BA Status", "Dev Status", "Estimate h", "Tracker Status", "Next Action"],
    ["Phase 0", "='Phase Roadmap'!C5", "='Phase Roadmap'!D5", "='Phase Roadmap'!F5", "='Phase Roadmap'!M5", "Verify architecture baseline."],
    ["Phase 1", "='Phase Roadmap'!C6", "='Phase Roadmap'!D6", "='Phase Roadmap'!F6", "='Phase Roadmap'!M6", "Build Manage + Backlog foundations."],
    ["Phase 2.1", "='Phase Roadmap'!C7", "='Phase Roadmap'!D7", "='Phase Roadmap'!F7", "='Phase Roadmap'!M7", "Build enhanced Backlog."],
    ["Phase 2.2", "='Phase Roadmap'!C8", "='Phase Roadmap'!D8", "='Phase Roadmap'!F8", "='Phase Roadmap'!M8", "Build Iterations/Timeboxes."],
    ["Phase 2.3", "='Phase Roadmap'!C9", "='Phase Roadmap'!D9", "='Phase Roadmap'!F9", "='Phase Roadmap'!M9", "Build Iteration Status."],
    ["Phase 3", "='Phase Roadmap'!C10", "='Phase Roadmap'!D10", "='Phase Roadmap'!F10", "='Phase Roadmap'!M10", "Develop Team Status, Task Dashboard inline edit, Release, Milestone and Quality > Defect using confirmed BA rules."],
    ["Phase 4", "='Phase Roadmap'!C11", "='Phase Roadmap'!D11", "='Phase Roadmap'!F11", "='Phase Roadmap'!M11", "Execute notifications, RBAC and settings/audit by 18/07; keep Team Board in Future Backlog."],
    ["Phase 5", "='Phase Roadmap'!C12", "='Phase Roadmap'!D12", "='Phase Roadmap'!F12", "='Phase Roadmap'!M12", "Execute reporting dashboard, operational reports and QA handoff by 20/07."],
    ["Post-MVP", "='Phase Roadmap'!C13", "='Phase Roadmap'!D13", "='Phase Roadmap'!F13", "='Phase Roadmap'!M13", "Portfolio optional after MVP."],
  ];
  sheet.getRange("A22:F22").format = { fill: colors.blueLight, font: { bold: true, color: colors.navy } };
  sheet.getRange("A22:F31").format.borders = { preset: "all", style: "thin", color: colors.border };
  sheet.getRange("A22:F31").format.wrapText = true;
  sheet.getRange("D23:D31").setNumberFormat("0.0");

  setWidths(sheet, [18, 18, 18, 16, 18, 58, 4, 18, 18, 18]);
  sheet.freezePanes.freezeRows(4);
}

// Render previews for QA.
for (const name of sheets) {
  const rendered = await wb.render({ sheetName: name, autoCrop: "all", scale: 1, format: "png" });
  const filename = `${safeName(name)}.png`;
  await fs.writeFile(path.join(qaDir, filename), new Uint8Array(await rendered.arrayBuffer()));
}

const inspectDashboard = await wb.inspect({
  kind: "table",
  range: "Dashboard!A1:J31",
  include: "values,formulas",
  tableMaxRows: 40,
  tableMaxCols: 10,
  maxChars: 8000,
});
console.log("DASHBOARD_INSPECT");
console.log(inspectDashboard.ndjson);

const errors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
  maxChars: 4000,
});
console.log("ERROR_SCAN");
console.log(errors.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(wb);
try {
  await xlsx.save(outputPath);
  console.log(outputPath);
} catch (error) {
  if (error?.code !== "EBUSY") throw error;
  const fallbackPath = `${outputDir}/Mini Rally Project Completion Plan - Prod Status.xlsx`;
  await xlsx.save(fallbackPath);
  console.log(fallbackPath);
}
