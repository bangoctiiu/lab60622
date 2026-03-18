import { Notification } from "@/types/notification";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Hóa đơn tiền điện tháng 03/2024",
    message: "Hóa đơn tiền điện của bạn đã đến hạn thanh toán. Vui lòng thanh toán trước ngày 15/03.",
    type: "InvoiceDue",
    isRead: false,
    link: "/portal/billing",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Thanh toán thành công",
    message: "Giao dịch thanh toán tiền nước mã #PAY123 đã được xác nhận.",
    type: "PaymentConfirmed",
    isRead: true,
    link: "/portal/history",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    title: "Yêu cầu sửa chữa mới",
    message: "Phòng A101 vừa gửi yêu cầu sửa chữa vòi nước.",
    type: "TicketAssigned",
    isRead: false,
    link: "/tickets/123",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];
