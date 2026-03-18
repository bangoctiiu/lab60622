import { Ticket, TicketComment } from "@/models/Ticket";

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "123",
    ticketCode: "T-123",
    title: "Vòi nước bị rò rỉ",
    description: "Vòi nước trong phòng tắm chính bị rò rỉ nước liên tục mặc dù đã khóa chặt.",
    status: "Open",
    priority: "High",
    type: "Maintenance",
    buildingId: "B1",
    buildingName: "Keangnam Landmark",
    roomCode: "A-101",
    tenantId: "T1",
    tenantName: "Nguyễn Văn A",
    assignedToId: "101",
    assignedToName: "Kỹ thuật Thắng",
    slaDeadline: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "124",
    ticketCode: "T-124",
    title: "Điều hòa không mát",
    description: "Điều hòa chỉ ra gió, không lạnh dù đã chỉnh 16 độ.",
    status: "InProgress",
    priority: "Medium",
    type: "Maintenance",
    buildingId: "B1",
    buildingName: "Keangnam Landmark",
    roomCode: "B-205",
    tenantId: "T2",
    tenantName: "Trần Thị B",
    assignedToId: "102",
    assignedToName: "Kỹ thuật Hùng",
    slaDeadline: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 72000000).toISOString(),
  }
];

export const MOCK_TICKET_COMMENTS: TicketComment[] = [
  {
    id: "1",
    ticketId: "123",
    content: "Tôi sẽ qua kiểm tra sau 15 phút nữa.",
    authorId: "101",
    authorName: "Kỹ thuật Thắng",
    authorRole: "Staff",
    isInternal: false,
    attachments: [],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  }
];
