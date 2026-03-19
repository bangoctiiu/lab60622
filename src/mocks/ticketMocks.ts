import { Ticket, TicketComment } from "@/models/Ticket";

export const MOCK_TICKET_STATISTICS = {
  total: 156,
  open: 12,
  inProgress: 8,
  resolved: 130,
  cancelled: 6,
  slaBreached: 3,
  avgResolutionTimeHours: 4.5,
  satisfactionRate: 4.8
};

export const MOCK_STAFF_RATINGS = (staffId: string) => ({
  average: 4.8,
  summary: { 5: 120, 4: 25, 3: 5, 2: 2, 1: 0 },
  list: [
    {
      id: '1',
      ticketId: 'TK-001',
      ticketCode: 'TK-001',
      rating: 5,
      comment: 'Rất nhiệt tình và chuyên nghiệp!',
      tenantId: 'tenant1',
      tenantName: 'Nguyễn Văn A',
      staffId: staffId,
      staffName: 'Lê Kỹ Thuật',
      staffRole: 'Senior Maintenance Staff',
      createdAt: new Date().toISOString()
    }
  ]
});

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
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "125",
    ticketCode: "T-125",
    title: "Đăng ký thẻ xe cho cư dân mới",
    description: "Tôi muốn đăng ký thêm 1 thẻ xe máy cho người thân vừa mới dọn vào.",
    status: "Resolved",
    priority: "Low",
    type: "ServiceRequest",
    buildingId: "B1",
    buildingName: "Keangnam Landmark",
    roomCode: "A-101",
    tenantId: "T1",
    tenantName: "Nguyễn Văn A",
    assignedToId: "105",
    assignedToName: "CSKH Lan Anh",
    slaDeadline: new Date(Date.now() - 3600000 * 24).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
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
  },
  {
    id: "2",
    ticketId: "123",
    content: "Vâng, tôi đang có mặt ở nhà. Cảm ơn anh.",
    authorId: "T1",
    authorName: "Nguyễn Văn A",
    authorRole: "User",
    isInternal: false,
    attachments: [],
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "3",
    ticketId: "124",
    content: "Đội kỹ thuật đã tiếp nhận. Chúng tôi sẽ kiểm tra gas vào chiều nay.",
    authorId: "102",
    authorName: "Kỹ thuật Hùng",
    authorRole: "Staff",
    isInternal: false,
    attachments: [],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];
