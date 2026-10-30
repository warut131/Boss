# SI / VGM Builder

เครื่องมือสร้างไฟล์ SI / VGM (Excel) จาก Booking Request — **ไฟล์เดียว `SI_VGM_Tool.html`**
ดับเบิลคลิกเปิดใน Chrome / Edge ได้ทุกเครื่อง ไม่ต้องติดตั้ง ไม่ต้องต่อเน็ต ข้อมูลไม่ออกนอกเครื่อง

## วิธีใช้
1. เปิด `SI_VGM_Tool_SRAU.html` (มี Template ในตัว วางแค่ Booking) หรือ `SI_VGM_Tool.html` (ต้องวาง Template เอง)
2. ลากไฟล์ **Booking Request** (.xlsx) และ **Template SI/VGM** ของปลายทางนั้น (.xlsx) มาวาง
   - Template จะถูกจำไว้ในเบราว์เซอร์ ครั้งหน้าลากแค่ Booking
3. ตรวจข้อมูล Shipment / คู่ค้า (แก้ได้ทุกช่อง)
4. กรอก **เลขตู้, ซีล** (และวันชั่ง / Tare ถ้าไม่ตรงค่าเริ่มต้น) — ถ้ามีหลายตู้ใส่ Pieces / kg / CBM รายตู้
5. ดูแถบตรวจสอบ (✖ ต้องแก้ / ⚠ ควรตรวจ) แล้วกด **ดาวน์โหลด SI / VGM**

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
