# ให้ Report_Shipment Export กรอกเองด้วย Power Automate

```
SI/VGM Builder ──(ปุ่ม "ไฟล์ส่งเข้า Report")──> SIVGM_REPORT_<booking>.json
      │  บันทึกลง OneDrive โฟลเดอร์ "SIVGM Report Inbox"
      ▼
Power Automate (เห็นไฟล์ใหม่) ──> Excel: Run script "UpdateShipmentReport" บน Report_Shipment Export.xlsx
      │                              └─ ย้ายไฟล์ไป "Processed" + แจ้งผลทาง Teams/อีเมล (ถ้าต้องการ)
```

- ใช้แค่ connector มาตรฐาน (OneDrive for Business, Excel Online (Business)) **ไม่ต้องใช้ Premium**
- ต้องมี Microsoft 365 แบบองค์กร และเปิดใช้ **Office Scripts** (ถ้าใน Excel ไม่มีแท็บ **Automate** ให้ขอ IT เปิด)
- ไม่ต้องแปลงไฟล์ Report เป็น Table และไม่ต้องยกเลิก merge — script เขียนลงชีต `Shipment` ตามรูปแบบเดิม

## ตั้งค่าครั้งเดียว

### 1. ใส่ Office Script ลงในไฟล์ Report
1. เปิด `Report_Shipment Export.xlsx` (Excel บนเว็บ หรือ Excel desktop ที่เปิด AutoSave)
2. แท็บ **Automate** → **New Script**
3. ลบโค้ดตัวอย่างทิ้ง แล้ววางโค้ดทั้งหมดจาก [`UpdateShipmentReport.ts`](UpdateShipmentReport.ts)
4. ตั้งชื่อ script เป็น **UpdateShipmentReport** → **Save script**

### 2. สร้างโฟลเดอร์รับไฟล์
ใน OneDrive ของคุณ สร้างโฟลเดอร์ **SIVGM Report Inbox** และในนั้นสร้าง **Processed**

### 3. สร้าง Flow ที่ make.powerautomate.com
**Create → Automated cloud flow** ชื่อ `SI/VGM → Report_Shipment Export`

1. **Trigger:** OneDrive for Business › **When a file is created**
   - Folder: `/SIVGM Report Inbox`
   - (แนะนำ) ⋯ › Settings › Trigger conditions ใส่
     `@startsWith(triggerOutputs()?['headers/x-ms-file-name'], 'SIVGM_REPORT_')`
2. **Action:** Excel Online (Business) › **Run script**
   - Location / Document Library / File: เลือกไฟล์ `Report_Shipment Export.xlsx` ที่ทีมใช้อยู่ (SharePoint ของทีมก็เลือกได้)
   - Script: `UpdateShipmentReport`
   - payload: แท็บ Expression แล้ววาง
     `if(equals(triggerBody()?['$content'], null), string(triggerBody()), base64ToString(triggerBody()?['$content']))`
3. **Action:** OneDrive for Business › **Move or rename a file**
   - File: Expression `triggerOutputs()?['headers/x-ms-file-id']`
   - Destination File Path: `/SIVGM Report Inbox/Processed/` ตามด้วย Expression `triggerOutputs()?['headers/x-ms-file-name']`
   - Overwrite: Yes
4. (ถ้าต้องการ) **Microsoft Teams › Post message in a chat or channel** หรือ **Outlook › Send an email (V2)**
   ข้อความ: Expression `outputs('Run_script')?['body/result']` → จะได้ข้อความเช่น "เพิ่ม SRT-2611-006 (booking …) 10 ตู้ แถว 34–43"
5. **Save** แล้วลองกับงานจริง 1 งาน

## ใช้งานประจำวัน
ในเครื่องมือ SI/VGM Builder กด **ไฟล์ส่งเข้า Report** แล้วบันทึกไฟล์ลงโฟลเดอร์ **SIVGM Report Inbox**
(ตั้ง Chrome/Edge ให้ "ถามตำแหน่งที่จะบันทึกทุกครั้ง" หรือลากจาก Downloads ไปวางในโฟลเดอร์ OneDrive ที่ sync ไว้ก็ได้) — รอ 1–3 นาที Report จะอัปเดต

แต่ละงานกด 2 รอบ:
1. **ได้ Booking + PDF จากลูกค้า** → script เพิ่มแถว 1 แถวต่อ 1 ตู้ พร้อมเลข JOB ใหม่ และติ๊ก PRE-INV
2. **ทีมตู้ส่ง เลขตู้ / ซีล / Tare แล้ว** → script ใส่ Container + Seal ลงแถวเดิม และติ๊ก SI (เมื่อมีเลขตู้+ซีลครบทุกตู้) และ VGM (เมื่อมี Tare + วันชั่งครบทุกตู้)

## script กรอกอะไรบ้าง
| คอลัมน์ | ที่มา | รูปแบบ (ตามไฟล์เดิม) |
|---|---|---|
| JOB | สร้างใหม่ `SRT-ปปดด-ลำดับ` ต่อจากเลขล่าสุดของเดือนนั้น | `SRT-2611-006` |
| LOAD DATE | วันบรรจุแต่ละตู้ (Booking) | วันที่ |
| BOOKING NO / INV / VESSEL | Booking | QTY, INV, VESSEL merge ตามจำนวนแถวของงาน |
| QTY / Size | จำนวนตู้ / ขนาด | 40HQ เขียนเป็น `40DC` ตามที่ทีมใช้ |
| ETD / CARRIER / PORT | Booking | `YANG MING` → `YANGMING`, PORT เฉพาะชื่อเมือง |
| SI Cut off / VGM Cut off / CLOSING / RETURN | PDF Shinki | RETURN = รหัส PPL เช่น `2836` |
| Container / Seal | ทีมตู้ | |
| PRE-INV / SI / VGM | ติ๊กอัตโนมัติ (ไม่เคยเอาติ๊กออก) | |

**ไม่แตะ:** Declaration, FINAL-INV, 0309, 0409, SHORT, Remark, CLEARANCE, CUSTOMS FEE, COST — ยังกรอกเองเหมือนเดิม

## ข้อควรรู้
- ถ้า Booking มีอยู่แล้ว script จะ**อัปเดตแถวเดิม** ไม่เพิ่มซ้ำ ถ้าจำนวนแถวใน Report ไม่เท่าจำนวนตู้ จะแจ้งเตือนในข้อความผลลัพธ์
- ถ้าไม่ได้วาง PDF Shinki ช่อง SI/VGM Cut off และ RETURN จะว่าง (CLOSING ใช้ CY Cut จาก Booking แทน)
- ถ้าแถวใหม่ไม่มีช่อง checkbox ให้เลือกช่อง R:X ของแถวนั้น แล้ว Insert › Checkbox (script ใส่ค่า TRUE/FALSE ไว้แล้ว)
- ทดสอบ logic ของ script แล้ว (จำลอง Excel บนข้อมูลจริงของไฟล์ Report): งานเดิม SRT-2611-002 อัปเดตเลขตู้/ซีล/ติ๊กถูกแถว · งานใหม่จากข้อมูลงาน 005 ได้แถวที่ตรงกับที่ทีมกรอกเองทุกคอลัมน์ — **แต่ยังไม่ได้รันใน Excel / Power Automate จริง** ให้ทดสอบกับสำเนาไฟล์ Report ก่อนชี้ Flow ไปที่ไฟล์ทีม
