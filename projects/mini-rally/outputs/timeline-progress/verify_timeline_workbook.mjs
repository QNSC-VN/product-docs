import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "D:/Mini_Rally_pj/outputs/timeline-progress/Mini Rally Timeline.xlsx";
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const sheets = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 3000,
  tableMaxRows: 3,
  tableMaxCols: 6,
});
console.log(sheets.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

for (const sheetName of ["Dashboard", "Master Timeline", "Progress Tracker", "Phase Checklist", "Next Plan", "Risks", "Source Notes"]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(
    `D:/Mini_Rally_pj/outputs/timeline-progress/verify_${sheetName.replace(/[^A-Za-z0-9]+/g, "_")}.png`,
    new Uint8Array(await preview.arrayBuffer()),
  );
}

console.log(`VERIFIED ${inputPath}`);
