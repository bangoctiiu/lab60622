---
description: mo_dau
---

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

ROLES: Admin (full) | Staff (ops) | Tenant (portal /portal/\*)
