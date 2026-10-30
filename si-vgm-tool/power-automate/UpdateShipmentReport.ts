/**
 * Office Script: UpdateShipmentReport
 * Writes one SI/VGM Builder hand-off file (SIVGM_REPORT_<booking>.json) into "Report_Shipment Export.xlsx".
 *
 * Called from Power Automate: Excel Online (Business) > Run script, parameter `payload` = the JSON text.
 * - Booking already in the report  -> fills Container / Seal and ticks PRE-INV / SI / VGM on its rows (never unticks).
 * - Booking not in the report yet  -> adds one row per container under the last job, with a new JOB no.
 * Columns, merges and formats follow the existing sheet; nothing else in the workbook is touched.
 */

interface Ctr { seq: number; loadDate: string; size: string; no: string; seal: string; tare: number | null; }
interface Payload {
  version: number; booking: string; invoice: string; vessel: string; etd: string; carrier: string; port: string;
  siCut: string; vgmCut: string; closing: string; returnCode: string;
  preInvoice: boolean; siReady: boolean; vgmReady: boolean; containers: Ctr[];
}

const SHEET = "Shipment";
const JOB_PREFIX = "SRT";
// column letters as in the sheet's header row
const C = { job: "A", load: "B", booking: "C", qty: "D", size: "E", inv: "F", vessel: "G", etd: "H", carrier: "I", port: "J",
  siCut: "K", vgmCut: "L", closing: "M", ret: "N", ctr: "O", seal: "P", preInv: "R", si: "T", vgm: "U" };
const LAST_COL = "AB";
const CHECKBOX_COLS = ["R", "S", "T", "U", "V", "W", "X"];
const MERGED_PER_JOB = ["D", "F", "G"]; // QTY, INV, VESSEL span all rows of a job
// the report writes every 40' box as "40DC"
const SIZE_IN_REPORT: { [k: string]: string } = { "40HQ": "40DC", "40GP": "40DC", "20GP": "20DC" };

function main(workbook: ExcelScript.Workbook, payload: string): string {
  const p = JSON.parse(payload) as Payload;
  if (!p || !p.booking || !p.containers || !p.containers.length) throw new Error("payload ไม่มี booking หรือรายการตู้");
  const ws = workbook.getWorksheet(SHEET);
  if (!ws) throw new Error(`ไม่พบชีต ${SHEET}`);

  // rows 2..last that have a JOB no.
  const colA = ws.getRange("A1:A2000").getValues();
  let last = 1;
  colA.forEach((r, i) => { if (String(r[0]).trim() !== "") last = i + 1; });
  const bookings = ws.getRange(`${C.booking}1:${C.booking}${last}`).getValues().map(r => String(r[0]).trim());
  const mine: number[] = [];
  bookings.forEach((b, i) => { if (i > 0 && b === p.booking) mine.push(i + 1); });

  return mine.length ? updateRows(ws, p, mine) : addRows(ws, p, last, colA);
}

function updateRows(ws: ExcelScript.Worksheet, p: Payload, rows: number[]): string {
  const n = Math.min(rows.length, p.containers.length);
  for (let i = 0; i < n; i++) {
    const r = rows[i], c = p.containers[i];
    if (c.no) ws.getRange(`${C.ctr}${r}`).setValue(c.no);
    if (c.seal) ws.getRange(`${C.seal}${r}`).setValue(c.seal);
    if (p.preInvoice) ws.getRange(`${C.preInv}${r}`).setValue(true);
    if (p.siReady) ws.getRange(`${C.si}${r}`).setValue(true);
    if (p.vgmReady) ws.getRange(`${C.vgm}${r}`).setValue(true);
  }
  const job = String(ws.getRange(`${C.job}${rows[0]}`).getValue());
  let note = `อัปเดต ${job} (booking ${p.booking}) ${n} แถว` + (p.siReady ? " · ติ๊ก SI" : "") + (p.vgmReady ? " · ติ๊ก VGM" : "");
  if (rows.length !== p.containers.length) note += ` · ⚠ ใน Report มี ${rows.length} แถว แต่ไฟล์มี ${p.containers.length} ตู้ — ตรวจด้วยตา`;
  return note;
}

function addRows(ws: ExcelScript.Worksheet, p: Payload, last: number, colA: (string | number | boolean)[][]): string {
  const n = p.containers.length, first = last + 1, end = last + n;
  const yymm = (p.containers[0].loadDate || p.etd).slice(2, 7).replace("-", "");   // "2026-11-03" -> "2611"
  const prefix = `${JOB_PREFIX}-${yymm}-`;
  let max = 0;
  colA.forEach(r => { const s = String(r[0]); if (s.startsWith(prefix)) max = Math.max(max, parseInt(s.slice(prefix.length), 10) || 0); });
  const job = prefix + String(max + 1).padStart(3, "0");

  // formats (borders, date formats, checkboxes) come from the last job's last row;
  // the merged columns copy from the booking column so no merge area is cut in half
  const src = last;
  for (const [from, to] of [["A", "C"], ["E", "E"], ["H", LAST_COL]]) {
    ws.getRange(`${from}${first}:${to}${end}`).copyFrom(ws.getRange(`${from}${src}:${to}${src}`), ExcelScript.RangeCopyType.formats);
  }
  for (const col of MERGED_PER_JOB) {
    ws.getRange(`${col}${first}:${col}${end}`).copyFrom(ws.getRange(`${C.booking}${src}`), ExcelScript.RangeCopyType.formats);
  }

  const booking: string | number = /^\d+$/.test(p.booking) ? Number(p.booking) : p.booking;
  const carrier = p.carrier.replace(/\s+/g, "").toUpperCase();     // "YANG MING" -> "YANGMING" as in the report
  const ret: string | number = /^\d+$/.test(p.returnCode) ? Number(p.returnCode) : p.returnCode;
  p.containers.forEach((c, i) => {
    const r = first + i;
    const set = (col: string, v: string | number | boolean) => ws.getRange(`${col}${r}`).setValue(v);
    set(C.job, job);
    if (c.loadDate) set(C.load, serial(c.loadDate));
    set(C.booking, booking);
    set(C.size, SIZE_IN_REPORT[c.size] || c.size);
    if (p.etd) set(C.etd, serial(p.etd));
    set(C.carrier, carrier);
    set(C.port, p.port.toUpperCase());
    if (p.siCut) set(C.siCut, serial(p.siCut));
    if (p.vgmCut) set(C.vgmCut, serial(p.vgmCut));
    if (p.closing) set(C.closing, serial(p.closing));
    if (p.returnCode) set(C.ret, ret);
    if (c.no) set(C.ctr, c.no);
    if (c.seal) set(C.seal, c.seal);
    for (const col of CHECKBOX_COLS) set(col, false);
    if (p.preInvoice) set(C.preInv, true);
    if (p.siReady) set(C.si, true);
    if (p.vgmReady) set(C.vgm, true);
  });
  ws.getRange(`${C.qty}${first}`).setValue(n);
  ws.getRange(`${C.inv}${first}`).setValue(p.invoice);
  ws.getRange(`${C.vessel}${first}`).setValue(p.vessel);
  if (n > 1) for (const col of MERGED_PER_JOB) ws.getRange(`${col}${first}:${col}${end}`).merge(false);
  return `เพิ่ม ${job} (booking ${p.booking}) ${n} ตู้ แถว ${first}–${end}`;
}

// "2026-11-03" -> Excel date serial
function serial(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return (Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 86400000;
}
