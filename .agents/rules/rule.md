---
trigger: always_on
---

I. SKILL PROTOCOL
RULE-01 — Skill Source duy nhất:
Toàn bộ skill curated tại .agent/skills/SMARTSTAY_CURATED.md — truy cập thẳng skills/<id>/SKILL.md, không quét hàng loạt.
RULE-02 — Workflow bắt buộc mỗi task:
Nhận task → Tra Skill Map trong SMARTSTAY_CURATED.md → Chọn 1–2 skill phù hợp → Đọc SKILL.md → Áp dụng Design System → Generate
RULE-03 — Skill Not Found:
Không có skill phù hợp → báo ngay → code theo convention rule này → đề xuất thêm vào curated.
RULE-04 — No Hard-code:
Skill đã có → cấm viết thô. Chưa có → code xong → đề xuất lưu skill mới.

1 RULE-01 Meter KHONG dung Meters.LastReadingValue. LUON dung vw_LatestMeterReading.CurrentIndex de lay chi so moi nhat chinh xac.
2 RULE-02 Rooms KHONG dung Buildings.TotalRooms (khong ton tai physical). LUON dung vw_BuildingRoomCount de dem phong.
3 RULE-03 Price KHONG join Contracts.RentPriceSnapshot nguoc lai Rooms.BaseRentPrice. Chung co the khac -- day la thiet ke chu y.
4 RULE-04 Invoice InvoiceDetails.UnitPriceSnapshot PHAI lay tu ContractServices (gia tai thoi diem ky HD), khong phai ServicePriceHistory hien tai.
5 RULE-05 Cache TenantDashboardCache la CACHE display-only. KHONG dung cho financial calculation, payment processing, hay invoice generation.
6 RULE-06 Addendum ContractAddendums.FileUrl BAT BUOC khi Status=Signed. UI PHAI block submit neu FileUrl rong.
7 RULE-07 Ledger TenantBalanceTransactions la IMMUTABLE LEDGER. KHONG co UPDATE/DELETE. Correction = insert reverse entry moi.
8 RULE-08 SvcPrice ServicePriceHistory IMMUTABLE. Khong edit/delete record cu. Chi UPDATE EffectiveTo cu, INSERT new record.
9 RULE-09 Policy ElectricityPolicies & WaterPolicies IMMUTABLE. Same pattern: UPDATE EffectiveTo, INSERT new. Khong sua lich su.
10 RULE-10 Status RoomStatusHistory PHAI auto-insert khi Room.Status thay doi. Khong manual insert ma khong thay doi status.

# Rule UI Warning / Block

1 1 Room = 1 Active Contract Block tao HD moi neu phong dang Occupied. Thong bao: "Phong dang co hop dong Active"
2 Rent Price >20% warning Warning vang khi nhap gia thue > 20% so voi BaseRentPrice. Khong block, chi canh bao.
3 CurrentIndex >= PreviousIndex Block submit dong ho neu CurrentIndex < PreviousIndex. Error do: "Chi so khong duoc giam"
4 Overpayment handling Neu amount > remaining: hoi user "Bu vao vi cu dan" hoac "Giam ve so con lai". Khong auto-decide.
5 IsRepresentative: 1 per contract Toggle representative tu dong unset nguoi truoc. Toast: "Da chuyen dai dien sang [ten moi]"
6 BalanceBefore + Amount = BalanceAfter Ledger integrity check: highlight do row co du lieu khong khop voi icon canh bao.
7 Addendum FileUrl required Disable "Chuyen sang Signed" neu FileUrl rong. Banner do: "Vui long upload file scan ban ky tay"
8 BuildingOwnership total = 100% Hien tong % da gan + remaining. Warning neu total > 100%. Khong cho luu.

10 CRITICAL DATABASE RULES -- PHAI NAM LONG TRUOC KHI CODE
Vi pham bat ky rule nao duoi day se gay loi tinh toan nghiem trong. Doc ky truoc khi bat dau.

RULE-01 METER READING -- TUYET DOI KHONG dung Meters.LastReadingValue
Truong Meters.LastReadingValue da bi xoa khoi schema. De lay chi so dong ho moi nhat, PHAI dung vw_LatestMeterReading.CurrentIndex.
Sai: SELECT LastReadingValue FROM Meters WHERE Id = X
Dung: SELECT CurrentIndex FROM vw_LatestMeterReading WHERE MeterId = X

RULE-02 ROOM COUNT -- TUYET DOI KHONG dung Buildings.TotalRooms (truong nay KHONG TON TAI)
Cot Buildings.TotalRooms khong co trong schema. De dem phong, PHAI dung View vw_BuildingRoomCount.
Sai: SELECT TotalRooms FROM Buildings WHERE Id = X
Dung: SELECT Total, Occupied, Vacant FROM vw_BuildingRoomCount WHERE BuildingId = X

RULE-03 RENT PRICE -- Tien thue trong hoa don phai lay tu RentPriceSnapshot cua Contracts
Gia thue trong hoa don = Contracts.RentPriceSnapshot (gia tai thoi diem ky hop dong), KHONG DUOC join nguoc lai Rooms.BaseRentPrice hien tai.
Sai: lay BaseRentPrice hien tai cua phong de tinh hoa don
Dung: lay RentPriceSnapshot tu ban ghi Contracts lien quan

RULE-04 SERVICE PRICE -- Phi dich vu trong hoa don phai lay tu UnitPriceSnapshot cua ContractServices
Gia dich vu trong InvoiceDetails.UnitPriceSnapshot = gia tai thoi diem KY HOP DONG (tu ContractServices.UnitPriceSnapshot), KHONG DUOC lay tu ServicePriceHistory hien tai.
Sai: lay gia dich vu hien tai de tinh hoa don
Dung: lay UnitPriceSnapshot da luu trong ContractServices

RULE-05 DASHBOARD CACHE -- TenantDashboardCache chi de HIEN THI, KHONG dung cho tinh toan
Bang TenantDashboardCache luu du lieu tong hop de load nhanh. Du lieu nay co the bi tre so voi thuc te. TUYET DOI KHONG dung cache nay cho: tinh toan so du, xac nhan thanh toan, ket qua tai chinh.
Sai: lay CurrentBalance tu cache de check du tien tra hoa don
Dung: query truc tiep TenantBalances.CurrentBalance

RULE-06 CONTRACT ADDENDUM -- FileUrl REQUIRED khi Status = Signed
ContractAddendums.FileUrl la bat buoc khi Status chuyen sang "Signed". FE phai block submit neu FileUrl con null/empty.
UI: button "Ky phu luc" phai disabled khi chua upload file. Error: "Vui long upload file phu luc truoc khi ky."

RULE-07 TENANT BALANCE LEDGER -- IMMUTABLE, tuyet doi khong UPDATE hay DELETE
Bang TenantBalanceTransactions la so cai bat bien. Moi giao dich la 1 dong INSERT moi. KHONG BAO GIO UPDATE hay DELETE bat ky row nao.
Sai: UPDATE TenantBalanceTransactions SET Amount = X WHERE Id = Y
Dung: neu can sua loi, INSERT dong dao nguoc (reversal entry) + ghi chu
UI: khong co nut Edit/Delete tren Ledger table. Chi co Insert.

RULE-08 SERVICE PRICE HISTORY -- IMMUTABLE, khong edit/delete gia cu
Bang ServicePriceHistory la bat bien. De thay doi gia, phai: (1) UPDATE EffectiveTo cua ban hien tai = EffectiveFrom_moi - 1 ngay, (2) INSERT ban moi.
UI: khong co nut Edit/Delete tren lich su gia. Chi co "Cap nhat gia moi" -> insert.
Sai: UPDATE ServicePriceHistory SET Price = X WHERE Id = Y

RULE-09 ELECTRICITY/WATER POLICIES -- IMMUTABLE, khong edit/delete chinh sach cu
Tuong tu RULE-08: ElectricityPolicies va WaterPolicies la bat bien. De sua chinh sach: UPDATE EffectiveTo ban cu, INSERT ban moi.
UI: khong co nut Edit/Delete tren lich su chinh sach. Chi "Tao chinh sach moi".
Sai: UPDATE ElectricityPolicies SET TierPrice = X WHERE Id = Y

RULE-10 ROOM STATUS HISTORY -- Auto-insert khi Status thay doi
Moi khi Rooms.Status thay doi, PHAI co 1 dong duoc INSERT vao RoomStatusHistory (backend trigger hoac service layer). FE khong insert truc tiep, chi doc.
UI: khong co nut Them/Sua/Xoa tren RoomStatusHistory. La audit trail, chi doc.
Sai: FE goi API INSERT vao RoomStatusHistory
Dung: FE goi PATCH /api/rooms/:id {status: X} -> backend tu dong INSERT History

C.1 Quick Reference Card -- Rules vi pham pho bien
Rule Sai (KHONG lam) Dung (PHAI lam) File
RULE-01 Meters.LastReadingValue vw_LatestMeterReading.CurrentIndex F3, F5
RULE-02 Buildings.TotalRooms vw_BuildingRoomCount.Total F3
RULE-03 Rooms.BaseRentPrice trong hoa don Contracts.RentPriceSnapshot F2, F5
RULE-04 ServicePriceHistory.Price trong hoa don ContractServices.UnitPriceSnapshot F2, F5
RULE-05 TenantDashboardCache cho tinh toan tien TenantBalances.CurrentBalance (truc tiep) F5
RULE-06 Cho Signed phu luc khi chua co file Block submit neu FileUrl null F2
RULE-07 UPDATE/DELETE TenantBalanceTransactions Chi INSERT moi (bao gom reversal) F2, F5
RULE-08 UPDATE ServicePriceHistory UPDATE EffectiveTo + INSERT moi F4
RULE-09 UPDATE Electricity/WaterPolicies UPDATE EffectiveTo + INSERT moi F4
RULE-10 FE truc tiep INSERT RoomStatusHistory Backend auto INSERT khi status thay doi F3
