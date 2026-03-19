import { SystemConfig } from "../types/system";

export const MOCK_SYSTEM_CONFIGS: SystemConfig[] = [
  {
    configKey: "BUILDING_NAME",
    configValue: "SmartStay Premium Apartment",
    group: "General",
    description: "Tên hiển thị chính thức của tòa nhà/đơn vị.",
    updatedAt: new Date().toISOString(),
    lastUpdatedByName: "Admin User"
  },
  {
    configKey: "MAINTENANCE_MODE",
    configValue: "false",
    group: "Maintenance",
    description: "Bật chế độ bảo trì để tạm dừng các giao dịch.",
    updatedAt: new Date().toISOString(),
    lastUpdatedByName: "System"
  },
  {
    configKey: "DEFAULT_VAT_RATE",
    configValue: "8",
    group: "Invoice",
    description: "Thuế suất VAT mặc định (%) cho hóa đơn.",
    updatedAt: new Date().toISOString(),
    lastUpdatedByName: "Finance Manager"
  },
  {
    configKey: "CHECKIN_TIME",
    configValue: "14:00",
    group: "Operational",
    description: "Giờ nhận phòng tiêu chuẩn.",
    updatedAt: new Date().toISOString(),
    lastUpdatedByName: "Admin User"
  },
  {
    configKey: "SESSION_TIMEOUT",
    configValue: "60",
    group: "Security",
    description: "Thời gian hết hạn phiên đăng nhập (phút).",
    updatedAt: new Date().toISOString(),
    lastUpdatedByName: "IT Security"
  },
  {
    configKey: "WEBHOOK_PAYMENT_URL",
    configValue: "https://api.smartstay.vn/webhooks/payment",
    group: "Integration",
    description: "URL nhận thông báo từ cổng thanh toán.",
    updatedAt: new Date().toISOString(),
    lastUpdatedByName: "Developer"
  },
  {
    configKey: "NOTIFICATION_POLLING_INTERVAL",
    configValue: "30",
    group: "Notification",
    description: "Thời gian làm mới thông báo (giây).",
    updatedAt: new Date().toISOString(),
    lastUpdatedByName: "Admin User"
  }
];
