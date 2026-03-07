# 🤖 SMARTSTAY BMS — AI FRONTEND WORKFLOW
**Dùng với AI (Claude / Cursor / Copilot) để build frontend theo spec BMS v5.0**
*Copy từng PROMPT BLOCK phù hợp → paste vào AI → nhận code chuẩn spec ngay*

---

## ⚡ MASTER CONTEXT BLOCK
> **BẮT ĐẦU MỖI SESSION MỚI**: Paste block này vào đầu cuộc trò chuyện với AI để AI hiểu toàn bộ hệ thống.

```
SYSTEM CONTEXT — SMARTSTAY BMS v5.0

Stack: React + TypeScript + Tailwind CSS. MVC pattern.
- Model: /src/models/ (TypeScript interfaces)
- View: /src/views/pages/ + /src/views/components/
- Controller: /src/controllers/ (business logic, API calls, state)
- Services: /src/services/api.ts (axios layer)
- Store: Zustand

Design Tokens (CSS variables):
--primary: #1E3A5F | --primary-light: #2E5D9F | --secondary: #2BBFBF
--accent: #F5864B | --bg: #F2F4F7 | --card: #FFFFFF
--success: #27AE60 | --warning: #F39C12 | --danger: #E74C3C
--text-primary: #1A1A2E | --text-secondary: #6B7280 | --border: #E5E7EB
Font: Inter. Base: 14px/400. Title: 24px/700. Section: 18px/600.

SHARED COMPONENTS đã có sẵn (import trực tiếp):
StatusBadge, DataTable, FilterPanel, SearchBar, Modal, ConfirmDialog,
Pagination, FormField, DatePicker, CurrencyInput, FileUploader,
NotificationToast, LoadingSpinner, EmptyState, ErrorState,
ActionMenu, InfoRow, AmountDisplay, Timeline, SignaturePad,
QRCodeDisplay, ProgressSteps, AppShell, Sidebar, TopNavbar,
PageContainer, SectionCard

CRITICAL BUSINESS RULES:
1. RentPriceSnapshot ≠ Room.BaseRentPrice — CHỐT khi ký, không đổi
2. UnitPriceSnapshot từ ContractServices — KHÔNG call giá hiện tại
3. UNIQUE(ContractId, MonthYear) — validate trước khi tạo hóa đơn
4. CurrentMeterIndex >= PreviousIndex — validate real-time
5. FileUrl BẮT BUỘC khi Addendum.Status = Signed
6. Dùng vw_BuildingRoomCount — KHÔNG dùng Buildings.TotalRooms
7. Dùng vw_LatestMeterReading — KHÔNG dùng Meters.LastReadingValue
8. TenantDashboardCache chỉ để hiển thị — KHÔNG tính toán tài chính
9. TenantFinancialTimeline là READ-ONLY denormalized
10. Priority=1 notification bypass QuietHour

ROLES: Admin (full) | Staff (ops) | Tenant (portal /portal/*)
```

---

## 📋 PHASE 1 — CONTRACT MANAGEMENT

### PROMPT 1.1 — Contract List Page (`/contracts`)

```
Tạo React page: Contract List Page theo SmartStay BMS spec.
Route: /contracts

YÊU CẦU:
1. STATS ROW: 4 KPI Cards
   - Tổng hợp đồng (primary #1E3A5F)
   - Đang Active (success #27AE60)
   - Sắp hết hạn 30 ngày (warning #F39C12)
   - Đã hết hạn/Chấm dứt (danger #E74C3C)
   Mỗi card: icon + số + label. Auto-refresh 5 phút.

2. FILTER PANEL (collapsible):
   - SearchBar: debounce 300ms, placeholder "Tìm mã HĐ, tên cư dân, mã phòng"
   - Select: Tòa nhà | Select: Trạng thái (Draft/Active/Expired/Terminated)
   - DateRangePicker: Ngày tạo/Ngày ký
   - Select: Loại HĐ (Residential/Commercial/Shortterm/Longterm)
   - Toggle: Sắp hết hạn (EndDate <= today+30)
   - Active filter chips: hiển thị filter đang áp dụng, click xóa chip
   - Filter state lưu vào URL query params

3. DATATABLE columns:
   Checkbox | Mã HĐ (link /contracts/:id) | Phòng+Tầng badge |
   Tòa nhà | Cư dân đại diện (avatar+name) | Ngày ký (DD/MM/YYYY) |
   Thời hạn (StartDate~EndDate) | Giá thuê (VND, tooltip "Giá đã chốt") |
   Trạng thái (StatusBadge) | Thao tác (ActionMenu)

4. ROW VISUAL RULES:
   - Background vàng nhạt: EndDate-today <= 30 ngày AND Status=Active
   - Background đỏ nhạt: Status=Overdue hoặc Terminated
   - Tooltip "Sắp hết hạn: còn X ngày"

5. ACTION MENU per row:
   - Xem: luôn hiện → /contracts/:id
   - Sửa: chỉ khi Draft → /contracts/:id/edit
   - Gia hạn: chỉ khi Active → mở ExtensionModal
   - Thanh lý: khi Active/Expired → /liquidations/create?contractId=X
   - Xóa: chỉ khi Draft → ConfirmDialog → soft delete

6. BULK ACTIONS (khi chọn ≥1): Xuất Excel | In danh sách

7. STATES: Loading skeleton | Empty state + CTA tạo mới | Pagination 20/page

Dùng Controller pattern: ContractController.ts xử lý logic, View chỉ render.
```

---

### PROMPT 1.2 — Contract Detail Page (`/contracts/:id`)

```
Tạo React page: Contract Detail Page theo SmartStay BMS spec.
Route: /contracts/:id

YÊU CẦU:
1. PAGE HEADER:
   - Left: ContractCode + StatusBadge + ContractType badge
   - Right buttons (hiện/ẩn theo Status):
     [Gia hạn] chỉ Active | [Tạo phụ lục] | [In HĐ] | [Thanh lý] | [Chỉnh sửa] chỉ Draft

2. TABS (lưu active tab vào URL hash):
   - Thông tin chung
   - Cư dân & Đại diện (badge: COUNT ContractTenants)
   - Dịch vụ (badge: COUNT ContractServices)
   - Gia hạn (badge: COUNT extensions)
   - Phụ lục (badge: COUNT addendums)
   - Hóa đơn (badge: COUNT unpaid)
   - Lịch sử (Admin/Staff only)

3. TAB: Thông tin chung — 2-column layout:
   LEFT CARD: ContractCode | ContractType | Phòng (link) | Tòa nhà (link) |
   Ngày ký | Hiệu lực StartDate~EndDate | Chu kỳ TT | DepositAmount | DepositStatus | AutoRenew
   
   RIGHT CARD: RentPriceSnapshot (large AmountDisplay bold) + cảnh báo "Giá đã chốt" |
   ContractStatus | TerminationDate | TerminationReason | CreatedBy
   
   CONTRACT PROGRESS BAR (chỉ khi Active):
   [StartDate] ====[Today●]=====[EndDate]
   Label: "Còn X ngày" — xanh >30 ngày, vàng 10-30, đỏ <10

4. TAB: Cư dân & Đại diện:
   Tenant table: Avatar+Name | CCCD | Phone | JoinedAt/LeftAt | Crown icon nếu IsRepresentative
   Actions: [Check-out] [Xem hồ sơ]
   Button: [+ Thêm cư dân]
   
   Representative table: RepresentativeType badge (TenantSide=Blue/OwnerSide=Teal/Guarantor=Orange/Witness=Gray) |
   FullName | CCCD | Role | SignedAt | AuthorizationLetterUrl

5. TAB: Dịch vụ:
   ServiceName | ChargeType | Quantity | UnitPriceSnapshot (VND) | Thành tiền/tháng
   WARNING banner: "UnitPriceSnapshot là giá chốt lúc ký — không cập nhật theo bảng giá"

6. TAB: Gia hạn — Vertical timeline:
   OldEndDate → NewEndDate | NewRentPriceSnapshot | Reason | ApprovedBy | ApprovedAt
   Button [+ Tạo yêu cầu gia hạn] chỉ khi Active

7. TAB: Phụ lục — Table:
   AddendumCode | Title | AddendumType | EffectiveDate | Status (badge) | FileUrl (download)

8. Deep link: /contracts/:id?tab=addendums → auto open tab
9. Print mode: @media print ẩn tabs, full content
10. Warn if terminate + has Unpaid invoice
```

---

### PROMPT 1.3 — Contract Create/Edit Form (`/contracts/create`)

```
Tạo React page: Multi-Step Contract Form theo SmartStay BMS spec.
Route: /contracts/create | /contracts/:id/edit

YÊU CẦU — 4-Step form với ProgressSteps component:

STEP 1 — Thông tin cơ bản:
- ContractCode: auto-gen "HĐ-YYYYMM-XXX", unique async check onBlur
- ContractType: Select (Residential/Commercial/Shortterm/Longterm)
- Mẫu hợp đồng: Select filtered by ContractType
- Tòa nhà*: Select → onChange load danh sách phòng
- Phòng*: Select chỉ Status=Vacant
- StartDate*, EndDate* (validate EndDate > StartDate)
- Chu kỳ thanh toán*: Radio 1|2|3|6|12 tháng
- RentPriceSnapshot*: CurrencyInput — AUTO-FILL từ Room.BaseRentPrice khi chọn phòng
  ⚠️ WARNING BANNER: "Giá này sẽ được CHỐT vào HĐ và không thay đổi sau khi ký"
- DepositAmount*, DepositStatus
- AutoRenew Toggle → conditional NoticePeriodDays input (default 30)

STEP 2 — Cư dân:
- TenantSearch: async search by tên/CCCD/phone
- Selected tenants: card list với Name/CCCD/Phone/IsRepresentative radio/JoinedAt/Remove
- Validation: >= 1 tenant, đúng 1 IsRepresentative=true
- Button "+ Thêm cư dân mới" → mini modal tạo nhanh

STEP 3 — Dịch vụ:
- 2 panels: trái = available services, phải = đã chọn
- IsRequired services: auto-checked, disabled
- UnitPriceSnapshot: auto-fill từ ServicePriceHistory current, editable
- Note: "Đơn giá sẽ chốt vào HĐ"

STEP 4 — Xem lại:
- Accordion review toàn bộ thông tin
- TotalEstimate: Rent + Services/tháng
- Actions: [← Quay lại] [Lưu nháp] [Kích hoạt ngay]

VALIDATION RULES (all onBlur + async):
- ContractCode unique → API check
- Room chỉ Vacant
- EndDate > StartDate
- RentPriceSnapshot > 0
- Exactly 1 IsRepresentative

EXTRA:
- Không cho qua step nếu step hiện tại có lỗi
- Auto-save draft vào localStorage mỗi 30 giây
- Unsaved changes warning khi navigate rời
```

---

### PROMPT 1.4 — Extension Modal + Addendum Modal

```
Tạo 2 Modal components cho Contract:

MODAL 1: ExtensionModal
Props: contractId, onSuccess
- Context Banner (readonly): Mã HĐ | Phòng | Cư dân | Ngày kết thúc hiện tại
- Fields:
  * Ngày kết thúc mới* (DatePicker, min = OldEndDate + 1 day)
  * Giá thuê mới* (CurrencyInput, hint "Giá HĐ hiện tại: X đ")
  * Lý do gia hạn (Textarea, optional)
- Footer: [Hủy] [Tạo yêu cầu gia hạn]
- Post-submit:
  * Không có quyền approve → banner "Đang chờ phê duyệt"
  * Có quyền → thêm button [Phê duyệt ngay]

MODAL 2: AddendumModal  
Props: contractId, addendumId (optional, for edit)
- Fields:
  * Mã phụ lục* (auto: PL-{ContractCode}-{seq})
  * Tiêu đề*
  * Loại phụ lục* (PriceChange/RoomChange/RuleChange/Other)
  * Ngày hiệu lực* (DatePicker)
  * Nội dung (RichTextEditor, markdown)
  * Trạng thái (Draft/Signed/Cancelled)
  * File scan* — FileUploader PDF/Image max 10MB
  
- STATUS FLOW GUARD:
  * Draft → Signed: BLOCK nếu FileUrl = null, hiện error banner
  * Draft → Cancelled: ConfirmDialog
  * Signed → readonly hoàn toàn

- Footer: [Hủy] [Lưu nháp] [Gửi phê duyệt]
```

---

## 💰 PHASE 1 — INVOICE MANAGEMENT

### PROMPT 2.1 — Invoice List Page (`/invoices`)

```
Tạo React page: Invoice List Page theo SmartStay BMS spec.
Route: /invoices

YÊU CẦU:
1. STATS ROW: 4 KPI Cards
   - Tổng HĐ tháng này (primary)
   - Đã thanh toán: COUNT + SUM (success)
   - Chưa thanh toán: COUNT + SUM (warning)
   - Quá hạn: COUNT + SUM (danger)

2. FILTER PANEL:
   - SearchBar: Mã HĐ, tên cư dân, mã phòng, mã hóa đơn
   - Select: Tòa nhà | Select: Trạng thái (Unpaid/Paid/Overdue/Cancelled)
   - MonthYearPicker: Kỳ tháng | DateRangePicker: DueDate range
   - Quick Filter Pills: [Quá hạn] [Hôm nay đến hạn] [Tháng này] [Chưa xem]

3. DATATABLE columns:
   Mã HĐ (link) | Mã hóa đơn (link) | Phòng | Cư dân (avatar) |
   Kỳ (Tháng MM/YYYY) | Tổng tiền (bold VND) |
   Hạn TT (đỏ nếu overdue) | Trạng thái (StatusBadge) |
   Đã xem (icon ✓/○ + tooltip last-viewed) |
   Thao tác: Xem | Ghi nhận TT | Gửi TB | Hủy

4. ROW VISUAL RULES:
   - Overdue: background #FDECEA (đỏ nhạt)
   - Paid: background #EBF7EE (xanh nhạt)  
   - DueDate trong 3 ngày + Unpaid: background #FEFCE8 (vàng nhạt)

5. LOGIC:
   - InvoiceViewLog icon: tooltip "Xem lần cuối: DD/MM/YYYY HH:mm"
   - Overdue = frontend check DueDate < today AND Status ≠ Paid
   - Bulk: [Gửi thông báo hàng loạt] → chọn kênh Push/Email/Zalo
   - Button [Tạo hóa đơn hàng loạt] → Bulk create modal
```

---

### PROMPT 2.2 — Invoice Detail Page (`/invoices/:id`)

```
Tạo React page: Invoice Detail Page theo SmartStay BMS spec.
Route: /invoices/:id

YÊU CẦU:
1. PAGE HEADER:
   - Left: InvoiceCode + StatusBadge + MonthYear badge
   - Right: [Ghi nhận TT] [Gửi thông báo] [Xuất PDF] [Hủy hóa đơn]

2. TOP SECTION — 2-column grid:
   LEFT CARD: InvoiceCode | ContractCode (link) | Phòng+Tòa | Cư dân |
   Kỳ thanh toán | Ngày tạo | Hạn TT (đỏ nếu overdue + countdown badge) | Ngày TT (nếu Paid)
   
   RIGHT CARD — Financial Summary:
   Tiền thuê | Tiền điện | Tiền nước | Dịch vụ
   ─────────────────────
   Tạm tính (SubTotal)
   Thuế VAT
   Giảm giá (negative, màu xanh)
   Phí phạt trễ
   ═════════════════════
   TỔNG CỘNG — LARGE BOLD (TotalAmount)
   Nếu Unpaid: CTA button [Ghi nhận thanh toán] full-width accent

3. INVOICE DETAIL LINES — Grouped by ItemType với expandable:
   🏠 Tiền thuê: Mô tả | Qty=1 | Đơn giá snapshot | Thành tiền (không expand)
   ⚡ Tiền điện: → expand = TierBreakdownTable
   💧 Tiền nước: → expand = TierBreakdownTable + PhíBVMT
   🔧 Dịch vụ: multiple rows — Tên DV | Qty | UnitPriceSnapshot | Thành tiền

4. ELECTRICITY TIER TABLE (khi expand):
   Bậc | Từ kWh | Đến kWh | kWh bậc này | Đơn giá (VND/kWh) | Thành tiền
   Footer: Chỉ số đầu X | Chỉ số cuối Y | Tiêu thụ Z kWh | Chính sách tên
   VAT row: Tổng trước VAT | VAT X% | Tổng sau VAT

5. INVOICE VIEW LOG (Staff only):
   Table: Thời gian | Cư dân | Kênh (App/Web/Email/PDF) | Thiết bị | Thời gian đọc
   Empty state: "⚠️ Cư dân chưa xem hóa đơn" + [Gửi nhắc nhở]
   
   AUTO LOG: Khi tenant mở trang này → POST /invoice-view-logs tự động (no user action)

6. PAYMENT HISTORY:
   Table: Ngày TT | Số tiền | Phương thức (icon+label) | Trạng thái |
   Bằng chứng (camera icon → lightbox) | Người xác nhận
```

---

### PROMPT 2.3 — Create Invoice + Bulk Create

```
Tạo 2 flows: Single Invoice Create và Bulk Invoice Create.

FLOW 1: Single Create — /invoices/create (3 steps)
STEP 1 — Chọn hợp đồng:
- Search: Active contracts chưa có invoice kỳ đang tạo
- Contract list: RoomCode | TenantName | RentPriceSnapshot | PaymentCycle

STEP 2 — Kỳ thanh toán & Chỉ số:
- Kỳ* (MonthYearPicker, default: current month)
- Hạn thanh toán* (DatePicker, default: ngày 15 từ SystemConfig)
- Chỉ số điện* (NumberInput, validate >= previous)
- Ảnh đồng hồ điện (FileUploader, recommended)
- Chỉ số nước* (NumberInput, validate >= previous)
- Ảnh đồng hồ nước (FileUploader)
- LIVE PREVIEW: nhập chỉ số → debounce 500ms → GET /invoices/preview → hiển thị realtime breakdown

STEP 3 — Xem lại:
- InvoicePreviewCard: Tiền thuê + Điện + Nước + DV = TỔNG
- Discount (CurrencyInput, optional)
- Ghi chú (Textarea)
- Duplicate check: validate UNIQUE(ContractId, MonthYear) trước submit

FLOW 2: Bulk Create — /invoices/bulk-create (4 steps)
STEP 1: Chọn MonthYear
STEP 2: Chọn Building → load Active contracts chưa có invoice kỳ này
STEP 3: Table preview: ContractCode | Room | Tenant | RentPrice | Status
STEP 4: Confirm → Progress bar → Report "X thành công, Y thất bại + chi tiết lỗi"
```

---

## 💳 PHASE 1 — PAYMENT MANAGEMENT

### PROMPT 3.1 — Payment List + Record Payment Modal

```
Tạo Payment List Page và RecordPaymentModal:

PAGE: /payments
1. STATS ROW: Tổng TT hôm nay | Đã xác nhận | Chờ duyệt | Từ chối
2. TAB NAV: [Tất cả] [Chờ duyệt {badge}] [Đã xác nhận] [Từ chối] [Thanh toán điện tử]
3. DATATABLE:
   TransactionCode (monospace) | InvoiceCode (link) | Cư dân (avatar) | Phòng |
   Số tiền (bold VND green) | PaymentMethod (icon+label) | PaidAt | Status (badge) |
   Bằng chứng (camera→lightbox) | Thao tác
   
   PAYMENT METHOD ICONS: Cash💵 | BankTransfer🏦 | VNPay logo | Momo logo | ZaloPay logo

4. BULK ACTIONS (Tab Chờ duyệt): Chọn nhiều → [Xác nhận hàng loạt] → confirm dialog

MODAL: RecordPaymentModal — Props: invoiceId
1. Invoice Context Banner (readonly): InvoiceCode | Phòng | Tổng Xđ | Hạn | Status
   Outstanding: TotalAmount - SUM(confirmed payments)

2. FORM:
   - Số tiền* (CurrencyInput, hint "Còn lại: Xđ")
   - Phương thức* (RadioGroup with icons): Cash|BankTransfer|VNPay|Momo|ZaloPay
   - Ngày TT* (DateTimePicker, default now())
   - Mã giao dịch (auto-gen TXN-YYYYMMDD-XXXX for cash)
   - Tên ngân hàng (conditional nếu BankTransfer)
   - Ảnh chứng từ (FileUploader, Image/PDF max 5MB)
   - Ghi chú (Textarea)

3. OVERPAYMENT WARNING:
   Nếu Amount > còn lại → banner vàng "Số tiền vượt quá. Phần thừa (Xđ) vào ví cư dân"

4. FOOTER BUTTONS:
   [Hủy] | [Lưu - Chờ duyệt] (all staff) | [Xác nhận ngay] (permission: payment.confirm)
```

---

### PROMPT 3.2 — Tenant Balance Page + Financial Timeline

```
Tạo 2 pages cho Tenant Finance:

PAGE 1: Tenant Balance — /tenants/:id/balance
1. BALANCE OVERVIEW CARD:
   - Title "Ví của {TenantName}"
   - AmountDisplay large (BalanceAmount)
   - LastUpdatedAt caption
   - Buttons: [Nạp tiền vào ví] [Trừ thủ công] → mở modal tương ứng

2. TRANSACTION HISTORY:
   Filter: TransactionType select + DateRangePicker
   Columns: Thời gian | Loại GD (badge+label) | Số tiền (green+/red-) |
   Số dư trước | Số dư sau (bold) | Liên quan (link) | Ghi chú

   TRANSACTION TYPE LABELS:
   Overpayment="+Thanh toán thừa" green | Refund="+Hoàn tiền" green |
   ManualTopUp="+Nạp thủ công" green | ManualDeduct="−Trừ thủ công" red |
   AutoOffset="−Bù trừ hóa đơn" blue

3. INTEGRITY CHECK BADGE:
   ✅ "Sổ cái hợp lệ" nếu tất cả BalanceBefore + Amount = BalanceAfter
   ⚠️ Warning badge nếu phát hiện sai lệch

4. MODALS: TopUp Modal (số tiền, lý do) | Deduct Modal (số tiền max=BalanceAmount, lý do)
   Warn if creating negative balance

PAGE 2: Financial Timeline (Tenant Portal) — /portal/financial-timeline
- Balance Summary Card + link "Xem chi tiết ví"
- Filter Tabs: [Tất cả] [Hóa đơn] [Thanh toán] [Hoàn tiền] [Đặt cọc]
- TIMELINE grouped by month (accordion):
  Event icons: 📄 InvoiceCreated | ✅ PaymentReceived | ⚠️ OverdueFee |
  💚 Refund | 🔒 Deposit | 🔓 DepositReturn | ➕ CreditAdded
  Each: Icon + Description natural language + Amount + Date + BalanceAfter
  IsHighlighted=true → yellow background
- ⚠️ TenantFinancialTimeline READ-ONLY — KHÔNG dùng để tính toán
```

---

## 👤 PHASE 2 — TENANT + ROOM + BUILDING

### PROMPT 4.1 — Tenant Management Pages

```
Tạo Tenant Management (List + Detail + Form):

PAGE: Tenant List — /tenants
- Stats: Tổng | Đang ở (Active) | Vắng tạm (Temporary_Absent) | Đã chuyển (Moved_Out)
- Filter: Search (tên/CCCD/phone/email) | Tòa nhà | Trạng thái | Quốc tịch (VN/Nước ngoài)
- Table: Avatar+Name (link) | CCCD/Passport (masked ****1234) | Phone (tel:) | 
  Phòng hiện tại | Tòa nhà | Status badge | CreatedAt | Actions

PAGE: Tenant Detail — /tenants/:id
TABS: Hồ sơ | Hợp đồng | Hóa đơn | Thanh toán | Ví (Balance) | Thiết bị | Feedback

TAB Hồ sơ: Avatar | FullName | DOB | Gender | CCCD/Passport+Nationality |
Phone | Email | PermanentAddress | Occupation | EmergencyContact | Portal account status

FORM: Tenant Create/Edit — /tenants/create
- FullName* | DOB | Gender
- Loại giấy tờ: Radio CCCD (VN) / Passport (nước ngoài)
  * CCCD: 12 số, unique
  * Passport: + Nationality select (country list)
- Phone* (validate format) | Email | PermanentAddress* | Occupation
- EmergencyContact Name + Phone
- Link tài khoản portal: Select/Search existing User
```

---

### PROMPT 5.1 — Room Management Pages

```
Tạo Room Management (List + Detail + Form):

PAGE: Room List — /rooms
- Stats: Tổng phòng | Đang thuê (Occupied) | Trống (Vacant) | Bảo trì
  ⚠️ DÙNG vw_BuildingRoomCount — KHÔNG dùng Buildings.TotalRooms

- VIEW MODES toggle: Grid View | Table View | Floor Plan
  
  GRID VIEW — RoomCard:
  Top: RoomCode badge + Status badge (Vacant=green, Occupied=blue, Maintenance=orange)
  Image thumbnail | Tầng X | X m² | BaseRentPrice VND/tháng
  Current tenant (nếu Occupied) | ConditionScore ★★★★★
  Hover: [Xem] [Sửa] [Tạo HĐ]
  
  TABLE VIEW columns:
  RoomCode | Tòa nhà | Tầng | Diện tích | RoomType | BaseRentPrice |
  Status (badge) | Cư dân | ConditionScore/10 | ActionMenu

PAGE: Room Detail — /rooms/:id
TABS: Thông tin | Hợp đồng | Tài sản | Đồng hồ | Lịch sử trạng thái | Hình ảnh

TAB Thông tin — 2-column:
LEFT: RoomCode | Floor | Area | Type | MaxOccupants | Orientation | Balcony | Bathroom | Quality stars | Noise rating
RIGHT: BaseRentPrice (note "không dùng trực tiếp cho HĐ") | Status + [Thay đổi trạng thái] button

Status Change Modal: Select (Vacant/Occupied/Maintenance) + Reason → creates RoomStatusHistory

TAB Tài sản:
Table: AssetName | Brand+Model | SerialNumber | Status (Good/Broken/Maintenance) |
WarrantyExpiry (đỏ nếu expired) | NextMaintenance | Actions
[Xem log bảo trì] → Asset Maintenance Log Modal

FORM: Room Create/Edit — /rooms/create
Fields: Tòa nhà* | RoomCode* (unique per building) | Tầng* | Area* | RoomType |
BaseRentPrice* | MaxOccupants | Balcony toggle | HasPrivateBathroom toggle |
Orientation select | ConditionScore slider 1-10 | NoiseLevelRating slider 1-5 |
Description RichText | PriceNegotiable toggle
```

---

### PROMPT 6.1 — Building Management Pages

```
Tạo Building Management (List + Detail + Form):

PAGE: Building List — /buildings
- Table: Tên tòa nhà (link) | Địa chỉ (truncated+tooltip) |
  Tổng phòng (vw_BuildingRoomCount) | Tỷ lệ lấp đầy (progress bar %) |
  Quản lý | PCCC hết hạn (đỏ nếu < 30 ngày) | Trạng thái | Actions

PAGE: Building Detail — /buildings/:id
TABS: Tổng quan | Danh sách phòng | Chủ sở hữu | Cảnh báo | Hình ảnh

TAB Tổng quan: Name + Address + OperationDate | Manager | WaterZone | ElectricPolicy |
Insurance (warn < 30 ngày) | PCCC (warn < 30 ngày)
Occupancy Stats: Doughnut chart + Vacant/Occupied/Maintenance counts

FORM: Building Create/Edit — /buildings/create
Fields: Tên* | Địa chỉ* | TotalFloors | OperationDate |
Manager (Select Staff role) | PrimaryOwner (Select Owner) |
WaterZoneId (Select WaterPricingZones) |
ElectricPolicyId (null = auto use IsActive=1 — hiện hint) |
InsurancePolicyNumber | InsuranceExpiry (warn < 30 days) |
FireSafetyCertificateExpiry | ExternalCode | Latitude+Longitude | Description
```

---

## 🎫 PHASE 4 — TICKET + NOTIFICATION

### PROMPT 9.1 — Ticket System

```
Tạo Ticket System (List + Detail + Create):

PAGE: Ticket List — /tickets
- Stats: Mới (Open/danger) | Đang xử lý (warning) | Đã giải quyết (success) | SLA vi phạm (danger)
- Filter: Search | Tòa nhà/Phòng | Trạng thái | Priority | Nhân viên | DateRange | SLA overdue toggle
- Table: Tiêu đề (link) | Phòng | Priority badge (Critical=red/High=orange/Medium=blue/Low=gray) |
  Status | Người tạo | Gán cho | CreatedAt (relative) | ResolvedAt+SLA | Rating stars

PAGE: Ticket Detail — /tickets/:id
Layout: Left 70% + Right 30%
LEFT: Title + Description (richtext) + Category badge + Images gallery + Activity Timeline
RIGHT STATUS PANEL:
- Status Flow: Open→InProgress→Resolved→Closed (clickable steps)
- Priority badge + edit
- AssignedTo: Staff search/select
- SLA: time elapsed + threshold remaining
- EstimatedCost / ActualCost
- ServiceRating: stars + comment

FORM: Create Ticket
Staff: /tickets/create — Tiêu đề* | Mô tả* | Phòng (any) | Category | Priority | AssignedTo | Images
Tenant: /portal/tickets/create — Tiêu đề* | Mô tả* | Phòng auto-fill | Category | Priority | Images
```

---

### PROMPT 10.1 — Notification Center + Announcements

```
Tạo Notification Center:

PAGE: /notifications (Staff/Admin)
TABS: [Hàng đợi] [Đã gửi] [Thất bại] [Templates] [Announcements]

QUEUE TAB Table:
Người nhận | Tiêu đề (truncated) | Kênh (Push/SMS/Email/Zalo icon) |
Priority (1=Critical/2=High/3=Normal/4=Low) | ScheduledAt | Status | Retry X/Y | Actions

ANNOUNCEMENTS PAGE: /announcements
Card grid + list toggle:
Tiêu đề | Type (Maintenance/Emergency/Event/Rule/Promotion/General) |
Priority (1=Emergency: red pulsing badge) | Đối tượng (All/Building/Room/Staff) |
StartAt~EndAt | RequireAcknowledgment | Status | X/Y đã xác nhận

CREATE/EDIT ANNOUNCEMENT FORM:
- Tiêu đề VI* + EN (optional for foreign tenants)
- Nội dung VI* + EN (RichTextEditor)
- Loại* | Priority* (1=Emergency red / 2=Important / 3=Normal / 4=Info)
- Đối tượng* → conditional: Tòa nhà field nếu SpecificBuilding / Phòng nếu SpecificRoom
- StartAt* | EndAt (validate > StartAt)
- RequireAcknowledgment toggle | AllowComments toggle
- BannerImage FileUploader | Attachment FileUploader

TENANT IN-APP: /portal/notifications
- Bell icon badge = UnreadCount từ vw_UnreadNotifications
- Dropdown top 5 preview
- Full page: grouped Today/Yesterday/This week/Older
- Mark as read on click | Mark all read button
- Filter tabs: [Tất cả] [Hóa đơn] [Hợp đồng] [Ticket] [Hệ thống]
```

---

## 📊 PHASE 5 — DASHBOARD + REPORTS

### PROMPT 11.1 — Admin Dashboard

```
Tạo Admin Dashboard — /dashboard:

KPI ROW 1 — Tòa nhà & Phòng:
KPICard: Tổng tòa nhà🏢 | Tổng phòng🚪 | Đang thuê👥(+trend) | Trống🔑(+trend)

KPI ROW 2 — Tài chính:
KPICard: Doanh thu tháng💰(trend) | Công nợ tồn⚠️(overdue count) | HĐ Active📋 | Ticket mở🎫(critical count)

CHARTS:
1. Revenue Chart (Combo): Bar=doanh thu + Line=chi phí bảo trì | 12 tháng | Filter tòa nhà
2. Occupancy Chart (Doughnut + Stacked Bar per building): vw_BuildingOccupancy data
3. Electricity Chart (Area gradient): 6 tháng | kWh | SUM MeterReadingsV2 by MonthYear

ACTIVITY FEEDS (3 columns):
- Recent Activity: Last 10 AuditLog — Avatar+Name+Action+Entity+time
- Recent Payments: Last 5 confirmed — Tenant+Amount+Method icon+Time
- Recent Tickets: Last 5 open/inprogress — Title+Priority+Status+Staff+Time

ALERTS SECTION:
- AnalyticsAlerts WHERE IsResolved=0, ORDER BY Severity DESC
- Critical (Severity=1) → Red banner ở TOP của dashboard
- Others → Alert cards với severity icon
```

---

### PROMPT 11.2 — Tenant Dashboard (Portal)

```
Tạo Tenant Dashboard — /portal/dashboard:
⚠️ Load từ TenantDashboardCache — target < 100ms. IsStale=1 → trigger refresh.

TOP SUMMARY CARDS (4):
- Phòng + Tòa nhà: CurrentRoomCode + BuildingName (prominent)
- HĐ còn lại: DaysUntilContractEnd — countdown badge, đỏ nếu < 30
- Số dư ví: BalanceAmount (xanh, link /portal/balance)
- Thông báo chưa đọc: UnreadNotificationCount (badge, link /portal/notifications)

INVOICE SECTION:
- Hóa đơn tháng này: Status + Amount + DueDate
- Nếu Unpaid/Overdue → [Thanh toán ngay] button PROMINENT accent color
- Điện tháng trước: X kWh + trend arrow (so sánh tháng trước)
- Nước tháng trước: X m³ + trend arrow

QUICK ACTIONS grid 2x3:
[Xem hóa đơn] [Tạo yêu cầu DV] [Đặt tiện ích] [Đăng ký khách] [Xem FAQ] [Liên hệ hỗ trợ]

RECENT TICKETS: Last 3 (Status != Closed) — Title + Status badge + Last updated

ONBOARDING PROGRESS BAR (nếu CompletionPercent < 100):
Progress bar + "Bạn đã hoàn thành X/9 bước nhập cư" + [Hoàn thành ngay →]
```

---

## 🌟 USER-FIRST EXPERIENCE (UF PAGES)

### PROMPT UF.1 — Tenant Portal Pages

```
Tạo User-First Experience pages:

PAGE UF-3: Onboarding — /portal/onboarding
- Horizontal progress bar + percentage
- Checklist 9 bước: Đọc thư chào | WiFi | Nội quy✅BẮT BUỘC | Liên hệ KCấp |
  Cài app | Bật TB | Hoàn thiện hồ sơ | Thêm PT thanh toán | Đóng tiền lần đầu
- Gamification: "Hoàn thành để nhận ưu đãi!"

PAGE UF-4: Handover Checklist — /portal/handover/:checklistId
- Toggle items: Tường/Sàn/Cửa/WC/Điện/Nước/ĐiềuHòa → OK | Có vấn đề
- BẮT BUỘC: ElectricIndex + WaterIndex inputs
- PhotoUrls: Multi FileUploader (chụp ít nhất 4 góc)
- SIGNATURE SECTION: SignaturePad (staff) + SignaturePad (tenant on app) + confirm button

PAGE UF-5: Amenity Booking — /portal/amenities
- AmenityCard: Image | Name | Type | Hours | Capacity | [Đặt chỗ]
- Booking Form Modal: Ngày* | Giờ bắt đầu* (slots) | Giờ kết thúc* | Số người <= Capacity | Mục đích
- Conflict check: real-time API khi chọn slot
- BookingCode: "Mã đặt chỗ: BK-XXXX" sau khi tạo

PAGE UF-7: Visitor Registration — /portal/visitors
- Form: VisitorName* | VisitorPhone* | VisitorCCCD | Purpose | ExpectedArrival* | ExpectedDeparture
- POST SUBMIT: Hiển thị QRCodeDisplay → tenant share qua Zalo/Messenger
- Guard view: Scan QR → update ActualArrival, Status=Checked-in
```

---

## 🔧 UTILITY PROMPTS — Dùng cho mọi phase

### PROMPT U.1 — StatusBadge Color System

```
Tạo StatusBadge component với đầy đủ status mapping:

CONTRACTS: Draft=Gray | Active=Green | Expired=Orange | Terminated=Red
INVOICES: Unpaid=Blue | Paid=Green | Overdue=Orange | Cancelled=Red
PAYMENTS: Pending=Yellow | Confirmed=Green | Rejected=Red
ROOMS: Vacant=Green | Occupied=Blue | Maintenance=Yellow
TICKETS: Open=Orange | InProgress=Blue | Resolved=Teal | Closed=Gray
ANNOUNCEMENTS: Draft=Gray | Published=Green | Archived=Gray
WEBHOOKS: Pending=Yellow | Processed=Green | Failed=Red

Props: status (string), variant ('sm'|'md'|'lg')
Design: rounded pill, semibold 12px, with dot indicator
```

---

### PROMPT U.2 — Permission Guard HOC

```
Tạo Permission Guard system cho SmartStay BMS:

ROLES: Admin | Staff | Tenant

PERMISSION MATRIX:
- Audit Log tab: Admin only
- Xác nhận thanh toán: Admin + Staff
- Tạo hóa đơn: Admin + Staff
- Khoá tài khoản: Admin only
- System Config: Admin only
- RBAC Management: Admin only
- Xem tất cả tenant: Admin + Staff (Tenant chỉ xem của mình)
- Tạo yêu cầu DV: Staff + Tenant
- Đặt lịch tiện ích: Tenant only
- Financial Timeline: Staff view all | Tenant own only

IMPLEMENTATION:
1. usePermission(role, permission) hook
2. <PermissionGuard roles={['Admin', 'Staff']}> wrapper component
3. Hide UI elements (không redirect, chỉ ẩn) dựa theo role
4. URL guard: /portal/* chỉ Tenant | /admin/* chỉ Admin
```

---

### PROMPT U.3 — API Service Layer

```
Tạo API service layer cho SmartStay BMS — /src/services/api.ts:

BASE CONFIG:
- axios instance với baseURL từ env
- Request interceptor: attach Bearer token
- Response interceptor: handle 401 (refresh token), 403 (redirect), 500 (toast error)
- Loading state: global loading store

CONTRACT APIs: getContracts(filters) | getContract(id) | createContract | updateContract |
activateContract | terminateContract | createExtension | approveExtension | createAddendum

INVOICE APIs: getInvoices(filters) | getInvoice(id) | createInvoice | bulkCreateInvoices |
cancelInvoice | previewInvoice | logInvoiceView | getInvoiceStats

PAYMENT APIs: getPayments(filters) | createPayment | confirmPayment | rejectPayment |
getTenantBalance | getBalanceTransactions | topupBalance | deductBalance |
getFinancialTimeline

Mỗi function: TypeScript generic return type, error handling, loading state.
```

---

### PROMPT U.4 — Form Validation Pattern

```
Tạo reusable Form Validation utilities cho SmartStay BMS:

VALIDATION RULES:
1. ContractCode: required + unique (async API check, debounce 500ms)
2. RentPriceSnapshot: > 0, warn khi khác BaseRentPrice
3. EndDate: > StartDate
4. MeterReading: CurrentIndex >= PreviousIndex (real-time)
5. CCCD: 12 digits, unique
6. Phone: Vietnamese format
7. CurrencyAmount: >= 0, proper VND format
8. FileUrl: required khi Addendum.Status=Signed

PATTERN:
- Validate onBlur (không chỉ onSubmit)
- Async validation: debounce 500ms
- Error: red border + message below field
- Warning: yellow banner (informational, không block)
- Required: dấu * + block submit nếu rỗng
- Form-level error summary ở cuối trước submit

useSmartForm hook: trả về {values, errors, warnings, handleChange, handleBlur, handleSubmit, isValid}
```

---

## 🚀 QUICK START WORKFLOW

### Cách dùng hiệu quả nhất:

```
WORKFLOW CHO MỖI TRANG MỚI:

1. PASTE MASTER CONTEXT BLOCK vào đầu session AI
   (chỉ cần paste 1 lần, giữ nguyên trong session)

2. PASTE PROMPT tương ứng với trang cần build
   Ví dụ: build contract list → copy PROMPT 1.1

3. THÊM YÊU CẦU CỤ THỂ nếu cần:
   "Dùng Shadcn UI components"
   "Export default component"
   "Thêm storybook stories"

4. SAU KHI NHẬN CODE, hỏi follow-up:
   "Tạo ContractController.ts cho page này"
   "Tạo TypeScript interface ContractModel"
   "Tạo unit tests cho validation logic"

5. ITERATION:
   "Thêm skeleton loading states"
   "Thêm error boundary"
   "Optimize re-renders với useMemo"
```

---

## 📁 FILE STRUCTURE REFERENCE

```
src/
├── models/
│   ├── Contract.ts      # ContractModel, ContractStatus, ContractType enums
│   ├── Invoice.ts       # InvoiceModel, InvoiceStatus, InvoiceDetailItem
│   ├── Payment.ts       # PaymentModel, PaymentMethod, TenantBalance
│   ├── Room.ts          # RoomModel, RoomStatus
│   ├── Building.ts      # BuildingModel
│   ├── Tenant.ts        # TenantModel, TenantProfile
│   ├── Ticket.ts        # TicketModel, TicketStatus, Priority
│   └── Notification.ts  # NotificationModel, AnnouncementModel
│
├── views/pages/
│   ├── contracts/       # ContractListPage, ContractDetailPage, ContractFormPage
│   ├── invoices/        # InvoiceListPage, InvoiceDetailPage, InvoiceCreatePage
│   ├── payments/        # PaymentListPage, TenantBalancePage
│   ├── rooms/           # RoomListPage, RoomDetailPage, RoomFormPage
│   ├── buildings/       # BuildingListPage, BuildingDetailPage
│   ├── tickets/         # TicketListPage, TicketDetailPage
│   ├── dashboard/       # AdminDashboard, TenantDashboard
│   ├── reports/         # OccupancyReport, FinancialReport, NPSReport
│   └── portal/          # Tenant-facing pages (/portal/*)
│
├── views/components/
│   ├── shared/          # StatusBadge, DataTable, FilterPanel, etc.
│   ├── contracts/       # ContractProgressBar, ExtensionModal, AddendumModal
│   ├── invoices/        # ElectricTierTable, InvoiceAmountSummary
│   ├── payments/        # PaymentMethodBadge, BalanceCard
│   └── dashboard/       # KPICard, RevenueChart, OccupancyChart
│
├── controllers/
│   ├── ContractController.ts
│   ├── InvoiceController.ts
│   ├── PaymentController.ts
│   └── ...
│
├── services/
│   └── api.ts           # Centralized axios layer
│
└── store/
    ├── contractStore.ts
    ├── invoiceStore.ts
    └── authStore.ts     # Role, permissions
```

---

*SmartStay BMS v5.0 — AI Frontend Workflow v1.0 — March 2026*
