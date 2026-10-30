# HANDOFF — SI/VGM Builder (ย้ายไป session ใหม่)

> ไฟล์นี้สรุปทุกอย่างที่ session ก่อนรู้ ให้ session ใหม่อ่านก่อนเริ่มงาน
> ผู้ใช้: ทำงานส่งออก (DSV / Sumitomo Rubber Thailand → SRAU Australia) สื่อสารภาษาไทย

## 1. เป้าหมายของงาน
เครื่องมือ **ไฟล์ HTML ไฟล์เดียว** เปิดได้ทุกเครื่อง (offline, ข้อมูลไม่ออกนอกเครื่อง) ที่
อ่าน **Booking Request (.xlsx)** แล้วสร้าง **SI / VGM (.xlsx)** ที่สมบูรณ์ ตาม Template ของลูกค้า
**ผู้ใช้ย้ำ: ซีเรียสมาก ผิดตัวเดียวคือผิด — ห้ามเปลี่ยนฟอนต์ / ตำแหน่ง / รูปแบบ ของ Template เด็ดขาด**

## 2. ที่อยู่ของงาน
- GitHub repo: `warut131/boss` branch `claude/study-two-files-xl5is3` โฟลเดอร์ `si-vgm-tool/`
  - `src/app.html` — โค้ดหลัก (แก้ที่นี่)
  - `build.py` — รวม `vendor/jszip-3.10.1.min.js` เข้าไป → `SI_VGM_Tool.html` (+ `SI_VGM_Tool_SRAU.html` ถ้ามี Template เปล่าในโฟลเดอร์)
  - `SI_VGM_Tool.html` — ตัวทั่วไป (ต้องวาง Template เอง)
  - `make_blank_template.py` — ทำ Template เปล่าจากไฟล์ที่กรอกแล้ว
  - `audit_xlsx.py` — เทียบไฟล์ผลลัพธ์กับ Template ทีละช่อง (style, merge, cols, rows, page setup, สูตร, ข้อความ)
  - `README.md` — วิธีใช้ภาษาไทย
- **ไม่อยู่ใน git** (มีที่อยู่ลูกค้า, `.gitignore` กันไว้) — ผู้ใช้มีไฟล์เหล่านี้แล้ว ต้องวางเองในโฟลเดอร์ `si-vgm-tool/`:
  - `SHINKI_SRAU_VGM_SI_TEMPLATE_BLANK.xlsx` (Template เปล่า)
  - `SI_VGM_Tool_SRAU.html` (ตัวที่ฝัง Template เปล่าไว้ — วางแค่ Booking ก็ได้)

## 3. ไฟล์ต้นฉบับที่ศึกษา
**Booking Request** (`BOOKING_REQUEST_EET261014536.xlsx`, ชีตเดียว ชื่อ = ship code):
label อยู่คอลัมน์ C ค่าอยู่ I (บางตัวมีต่อที่ O) — เครื่องมือหา **ตาม label ไม่ fix cell**:
`INV. No:` EET261014536 · `BOOKING No:` 2341516770 · `CUSTOMER:` A8011000 AUSTRALIA SRAU ·
`FINAL DESTINATION:` ADELAIDE · `TRUCKER/NVOCC:` NIPPON EXPRESS · `DEPARTURE PORT:` THLCH ·
`ARRIVAL PORT:` ADELAIDE, AUSTRALIA · `VESSEL:` KOTA LUMAYAN · `VOYAGE:` 194S · `CY CUT:` 07-Nov-2026 08:00 ·
`ETD:` 10-Nov-2026 · `ETA:` 02-Dec-2026 · `SHIPPING LINE:` OOCL · `COMMODITY:` TIRES ·
`SHIPPING INSTRUCTION No:` 00238364 · `SHIP CODE:` A8011000005-000709
ตารางตู้: หัวแถว `STUFFING DATE | CONTAINER TYPE | CONTAINER No | TIRE Q'ty | Container Capa | M3 | WEIGHT | AMOUNT | Currency`
แถวข้อมูลจนถึง `SUB TOTAL` / `TOTAL` (ตัวอย่าง: 03-Nov-2026, `40HC-1143928`, 1, 527 เส้น, 66.789 M3, 8,295 kg)
`CONTAINER No` = ลำดับตู้ 1,2,3 (1 แถว = 1 ตู้ ไม่ใช่จำนวนตู้ และไม่ใช่เลขตู้) · 40HC → เขียนใน SI เป็น 40HQ

**Template SI/VGM** (`SHINKI_SRAU_VGM_SI_BKG._A488017325_DTAU-SYDNEY_1.xlsx`) 3 ชีต:
sheet1 = `SI DATA`, sheet2 = `VGM ` (มีช่องว่างท้ายชื่อ!), sheet3 = `ATTACH SHEET (WHEN REQUIRED)`

| ชีต | Cell | ใส่อะไร |
|---|---|---|
| SI DATA | J2 | Booking No (ตัวเลข) |
| | A28 | `KOTA LUMAYAN V.194S` |
| | D25 / D28 | `LAEM CHABANG, THAILAND ` (D25 มีช่องว่างท้าย) / `LAEM CHABANG, THAILAND` |
| | A31 / D31 | `ADELAIDE,SA,AUSTRALIA` (รูปแบบ CITY,STATE,AUSTRALIA ตามต้นฉบับ — ยึดต้นฉบับเสมอ) |
| | D38 | `1x40HQ` |
| | D39 / J39 / K39 | `527 PIECE(S)` / `8,295 KGS ` (ช่องว่างท้าย) / `66.789  CBM` (2 ช่องว่าง) |
| | E40 | `FALKEN/SUMITOMO TYRES ` |
| | E41 | `I/V NO. EET261014536` |
| | C58 | `TOTAL : ONE (1) CONTAINERS ONLY ` (ต้นฉบับใช้ CONTAINERS เสมอ) |
| | A9–A12 / A17–A20 / G24–G27 | Consignee (Dunlop Prestons) / Notify (Toll Sydney) / Agent (Diamond Freight) — ค่าคงที่ของ Template |
| ATTACH | แถว 6–20: B,C,D,F,H,J | เลขตู้, ซีล, เส้น, kg, CBM, Type · I1 = `'SI DATA'!J2` |
| VGM | แถว 12–26: B,C,G | วันชั่ง (date serial), Method `2`, Tare · A/D/H = สูตรดึงจาก ATTACH (H = G+D) · E6 = booking · E35 = B12 |
- รองรับสูงสุด **15 ตู้** (ตาราง VGM 15 แถว)
- Template มี **shared formulas** (VGM H13:H26, ATTACH J7:J15) → โค้ดแปลงเป็นสูตรรายช่องก่อนแก้ (`Sheet.unshare`)
- ข้อความ rich text มีเฉพาะ label ชีต VGM (ไม่แตะ)

## 4. หลักการเขียนไฟล์ (สำคัญ — เพื่อไม่ให้รูปแบบเพี้ยน)
- แก้ XML ใน xlsx ตรง ๆ ด้วย JSZip **เฉพาะ cell เป้าหมาย** เก็บ attribute `s` (style) เดิมไว้ เขียนค่าเป็น inlineStr / number
- ช่อง Consignee/Notify/Agent **เขียนเฉพาะเมื่อข้อความเปลี่ยน**
- คำนวณ cached value ของสูตรง่าย ๆ เอง (`recalc`) + ลบ `calcChain.xml` + ตั้ง `fullCalcOnLoad="1"`
- `zip.file(..., { createFolders:false })` — ห้ามเพิ่ม folder entry
- ผลตรวจล่าสุดด้วย `audit_xlsx.py`: styles.xml/theme/sharedStrings ตรงทุก byte, style ทุกช่อง/merge/cols/rows/page setup เหมือนเดิม, ต่างเฉพาะข้อความที่ตั้งใจ
- **Template เปล่า** ต่างจากต้นฉบับ (แจ้งผู้ใช้แล้ว): สูตร 5 ช่องห่อ `IF(X="","",X)` (VGM E6, E35, ATTACH I1, SI B84, B85) และ ATTACH J6–J15 ไม่มีสูตร (เครื่องมือเขียน `40HQ` ตรง ๆ ค่าเหมือนกัน) — ผู้ใช้ยังไม่ได้ตัดสินใจว่าจะให้คืนสูตร J หรือไม่
- ยังไม่ได้ทดสอบเปิดด้วย Microsoft Excel จริง (ทดสอบแค่ LibreOffice) — ควรให้ผู้ใช้ลองเปิดใน Excel

## 5. ฟีเจอร์ปัจจุบันของเครื่องมือ
- ช่องวางไฟล์ช่องเดียว รู้เองว่าเป็น Booking / Template / ไฟล์ข้อมูลตู้ที่ทีมส่งกลับ
- Template: ฝังในตัว (SRAU) หรือวางเอง (จำไว้ใน localStorage) + ลิงก์ "กลับไปใช้ Template ในตัว"
- **Preview ด้านขวา**: render workbook จริง (ฟอนต์, สี theme+tint, เส้นขอบ, merge, ความกว้างคอลัมน์, number format) แท็บ 3 ชีต, ไฮไลต์ช่องที่กรอก (น้ำเงิน) / ยังรอ (ส้ม), zoom
- **ขั้นตอนกับทีมตู้** (ทีมอื่นเป็นคนกรอก Container No., Seal No., Tare):
  - ปุ่ม "ดาวน์โหลดใบขอข้อมูลตู้" → `CONTAINER_INFO_{booking}.xlsx` ชีต `CONTAINER INFO` (ช่องเหลืองปลดล็อก ที่เหลือล็อก, data validation เลขตู้ 11 ตัว / tare 1000–10000) หัวตารางแถว 11 ข้อมูลเริ่มแถว 12
  - ไฟล์ที่ส่งกลับ → ลากวาง นำเข้าเอง (เช็ก booking ตรงกันไหม) · หรือวางข้อความจาก LINE (parser หาเลขตู้/ซีล/tare)
  - สถานะ "รอข้อมูล x/y ตู้" · Tare default 3,700 แต่เตือนจนกว่าจะได้ค่าจริง
- ตรวจสอบ: ISO 6346 check digit, เลขตู้ซ้ำ, ผลรวมเทียบ Booking, จำนวนตู้, วันชั่งเลย CY Cut

## 6. งานค้าง / สิ่งที่ผู้ใช้จะทำต่อ
- ผู้ใช้มี **วิดีโอ (~100+ MB)** จะให้ session ใหม่ (บนเครื่อง Mac ของผู้ใช้) ดู — ยังไม่รู้เนื้อหา (น่าจะเป็นขั้นตอนทำงานจริง)
- ตารางคู่ค้าตามปลายทาง (Consignee/Notify/Agent ของ Adelaide ฯลฯ) — ผู้ใช้บอก "เดี๋ยวบอกอีกที"
- ตัดสินใจเรื่องคืนสูตร ATTACH J6–J15 ใน Template เปล่า
- หัวเมลที่เคยเสนอ (นัดประชุม): `Meeting Invitation: SI/VGM Builder – Automating SI & VGM Preparation from Booking Requests`

## 7. วิธีพัฒนา / ทดสอบ
```bash
git clone https://github.com/warut131/boss.git && cd boss && git checkout claude/study-two-files-xl5is3
cd si-vgm-tool && python3 build.py
python3 audit_xlsx.py Template.xlsx ไฟล์ที่ได้.xlsx
```
- แก้ `src/app.html` แล้ว `python3 build.py` ทุกครั้ง
- หลังแก้ ต้องรัน `audit_xlsx.py` เทียบกับ Template เสมอ (ผู้ใช้ซีเรียสเรื่องความถูกต้อง)
- commit message ท้ายด้วยบรรทัด attribution ตามที่ระบบกำหนด, ไม่ commit ไฟล์ .xlsx ลูกค้า
