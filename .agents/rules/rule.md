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
