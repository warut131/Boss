# SI / VGM Builder

เครื่องมือสร้างไฟล์ SI / VGM (Excel) จาก Booking Request — **ไฟล์เดียว `SI_VGM_Tool.html`**
ดับเบิลคลิกเปิดใน Chrome / Edge ได้ทุกเครื่อง ไม่ต้องติดตั้ง ไม่ต้องต่อเน็ต ข้อมูลไม่ออกนอกเครื่อง

## วิธีใช้
หน้าจอแบ่ง 2 ฝั่ง: ซ้ายคือฟอร์ม, ขวาคือ **Preview ไฟล์ Excel จริง** (สลับดูชีต SI DATA / VGM / ATTACH ได้, กรอบสีน้ำเงิน = ช่องที่เครื่องมือกรอก, กรอบส้ม = ยังรอข้อมูล)

1. เปิด `SI_VGM_Tool_SRAU.html` (มี Template ในตัว) หรือ `SI_VGM_Tool.html` (ต้องวาง Template เอง)
2. ลาก **Booking Request** มาวาง — ข้อมูล Shipment / Pieces / kg / CBM เข้าเอง
3. กด **ดาวน์โหลดใบขอข้อมูลตู้** → ได้ `CONTAINER_INFO_{Booking}.xlsx` ส่งให้ทีมตู้
   - ทีมตู้กรอกเฉพาะช่องสีเหลือง: Container No. · Seal No. · Tare weight (ช่องอื่นถูกล็อกไว้)
4. ได้ไฟล์กลับมา → ลากมาวางในช่องเดิม ข้อมูลเข้าตารางเอง (ถ้าทีมตอบเป็นข้อความทาง LINE ใช้ "วางข้อความ")
5. ดูแถบตรวจสอบ แล้วกด **ดาวน์โหลด SI / VGM**

## สิ่งที่เครื่องมือกรอกให้
| ชีต | ช่อง |
|---|---|
| SI DATA | Booking (J2), เรือ/เที่ยว (A28), POL (D25/D28), POD/Place of delivery (A31/D31), จำนวนตู้ (D38), Pieces/KGS/CBM (D39/J39/K39), Description (E40), I/V No. (E41), TOTAL … CONTAINER(S) (C58), Consignee (A9–A12), Notify (A17–A20), Agent (G24–G27) |
| ATTACH SHEET | แถว 6–20: เลขตู้, ซีล, Pieces, KGS, CBM, Type — แถวที่ไม่ใช้ถูกล้าง |
| VGM | แถว 12–26: วันชั่ง, Method 2, Tare — เลขตู้/น้ำหนัก/Total VGM เป็นสูตรเดิมของ template |

รูปแบบ, merge, สูตร ของ template คงเดิมทั้งหมด (แก้เฉพาะค่าใน cell) และ Excel จะคำนวณสูตรใหม่เมื่อเปิดไฟล์

## การตรวจสอบ
- เลขตู้ ISO 6346 (รูปแบบ + check digit), เลขตู้ซ้ำ, ช่องว่าง
- ผลรวม Pieces / kg / CBM เทียบ Booking, จำนวนตู้เทียบ Booking
- วันชั่งเลย CY Cut

## สำหรับผู้พัฒนา
แก้โค้ดที่ `src/app.html` แล้วรัน `python3 build.py` เพื่อรวม `vendor/jszip-3.10.1.min.js` เข้าเป็น `SI_VGM_Tool.html`

## ทำ Template เปล่าจากไฟล์ที่กรอกแล้ว
```
python3 make_blank_template.py ไฟล์ที่กรอกแล้ว.xlsx Template_เปล่า.xlsx
```
ล้างข้อมูลงาน (Booking, เรือ, ท่าเรือ, จำนวนตู้/น้ำหนัก, I/V, รายการตู้, ข้อมูล VGM) แต่คงข้อมูลคงที่ (Shipper, Consignee, Notify, Agent, ผู้ติดต่อ, FREIGHT PREPAID) และรูปแบบ/สูตรไว้

## ตรวจว่าไฟล์ที่ได้ไม่เพี้ยนจาก Template
```
python3 audit_xlsx.py Template.xlsx ไฟล์ที่ได้.xlsx
```
เทียบทีละช่อง: style/ฟอนต์, merge, ความกว้างคอลัมน์, ความสูงแถว, ตั้งค่าหน้ากระดาษ, สูตร และแสดงรายการข้อความที่เปลี่ยน
