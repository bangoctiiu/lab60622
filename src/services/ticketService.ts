import { Ticket, TicketSummary, TicketStatus, TicketPriority, TicketType, TicketComment, StaffServiceRating } from '@/models/Ticket';
import { addDays, subDays, addHours, format, isAfter } from 'date-fns';

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TKT001',
    ticketCode: 'TKT-2403-001',
    title: 'Hỏng vòi nước phòng tắm',
    description: 'Vòi nước bị rò rỉ liên tục ngay sau khi sử dụng. Cần thợ sửa gấp.',
    type: 'Maintenance',
    priority: 'High',
    status: 'Open',
    buildingId: 'B1',
    buildingName: 'The Manor Central Park',
    roomId: 'R101',
    roomCode: 'A-101',
    tenantId: 'T1',
    tenantName: 'Nguyễn Văn A',
    slaDeadline: addHours(new Date(), 2).toISOString(),
    createdAt: subDays(new Date(), 1).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: 'TKT002',
    ticketCode: 'TKT-2403-002',
    title: 'Thang máy block B kêu to',
    description: 'Thang máy số 3 có tiếng kêu lạ khi di chuyển từ tầng 10 lên 15.',
    type: 'Emergency',
    priority: 'Critical',
    status: 'InProgress',
    buildingId: 'B1',
    buildingName: 'The Manor Central Park',
    assignedToId: 'S1',
    assignedToName: 'Lê Kỹ Thuật',
    assignedToAvatar: 'https://i.pravatar.cc/150?u=s1',
    slaDeadline: addHours(new Date(), -1).toISOString(), // Breached
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: 'TKT003',
    ticketCode: 'TKT-2403-003',
    title: 'Phàn nàn về tiếng ồn ban đêm',
    description: 'Hàng xóm phòng 15.02 thường xuyên hát karaoke sau 10h tối.',
    type: 'Complaint',
    priority: 'Medium',
    status: 'Resolved',
    buildingId: 'B1',
    buildingName: 'The Manor Central Park',
    tenantId: 'T2',
    tenantName: 'Trần Thị B',
    assignedToId: 'S2',
    assignedToName: 'Phạm Quản Lý',
    slaDeadline: addDays(new Date(), 2).toISOString(),
    resolvedAt: subDays(new Date(), 1).toISOString(),
    resolutionNote: 'Đã nhắc nhở cư dân phòng 15.02. Họ cam kết không tái phạm.',
    createdAt: subDays(new Date(), 3).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  }
];

const MOCK_COMMENTS: TicketComment[] = [
  {
    id: 'C1',
    ticketId: 'TKT002',
    content: 'Tôi đã kiểm tra sơ bộ, có lỗi ở cáp tải.',
    authorId: 'S1',
    authorName: 'Lê Kỹ Thuật',
    authorRole: 'Staff',
    authorAvatar: 'https://i.pravatar.cc/150?u=s1',
    isInternal: true,
    attachments: [],
    createdAt: subDays(new Date(), 1).toISOString()
  },
  {
    id: 'C2',
    ticketId: 'TKT002',
    content: 'Đã báo cho bên bảo trì thang máy đến xử lý trong chiều nay.',
    authorId: 'S2',
    authorName: 'Phạm Quản Lý',
    authorRole: 'Admin',
    isInternal: false,
    attachments: [],
    createdAt: subDays(new Date(), 1).toISOString()
  }
];

export const ticketService = {
  getTickets: async (filters?: any): Promise<TicketSummary[]> => {
    await new Promise(r => setTimeout(r, 600));
    let filtered = [...MOCK_TICKETS];
    
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.ticketCode.toLowerCase().includes(s) || 
        t.title.toLowerCase().includes(s)
      );
    }
    
    if (filters?.buildingId) {
      filtered = filtered.filter(t => t.buildingId === filters.buildingId);
    }
    
    if (filters?.status && filters.status.length > 0) {
      filtered = filtered.filter(t => filters.status.includes(t.status));
    }
    
    if (filters?.priority && filters.priority.length > 0) {
      filtered = filtered.filter(t => filters.priority.includes(t.priority));
    }
    
    if (filters?.type && filters.type.length > 0) {
      filtered = filtered.filter(t => filters.type.includes(t.type));
    }
    
    if (filters?.assignedToId) {
      filtered = filtered.filter(t => t.assignedToId === filters.assignedToId);
    }
    
    if (filters?.slaBreached) {
      filtered = filtered.filter(t => isAfter(new Date(), new Date(t.slaDeadline)) && t.status !== 'Resolved' && t.status !== 'Closed');
    }

    return filtered.map(t => ({
      id: t.id,
      ticketCode: t.ticketCode,
      title: t.title,
      priority: t.priority,
      type: t.type,
      status: t.status,
      assignedToName: t.assignedToName,
      assignedToAvatar: t.assignedToAvatar,
      slaDeadline: t.slaDeadline,
      createdAt: t.createdAt
    }));
  },

  getTicketDetail: async (id: string): Promise<Ticket> => {
    await new Promise(r => setTimeout(r, 500));
    const ticketAx = MOCK_TICKETS.find(t => t.id === id);
    if (!ticketAx) throw new Error('Ticket not found');
    return ticketAx;
  },

  getTicketComments: async (id: string): Promise<TicketComment[]> => {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_COMMENTS.filter(c => c.ticketId === id);
  },

  updateStatus: async (id: string, status: TicketStatus, resolution?: { resolutionNote?: string, rootCause?: string }): Promise<void> => {
    console.log(`Updating ticket ${id} to ${status}`, resolution);
    await new Promise(r => setTimeout(r, 800));
  },

  assignTicket: async (id: string, staffId: string): Promise<void> => {
    console.log(`Assigning ticket ${id} to staff ${staffId}`);
    await new Promise(r => setTimeout(r, 800));
  },

  addComment: async (ticketId: string, content: string, isInternal: boolean): Promise<TicketComment> => {
    await new Promise(r => setTimeout(r, 800));
    const newComment: TicketComment = {
      id: Math.random().toString(36).substr(2, 9),
      ticketId,
      content,
      isInternal,
      authorId: 'CU',
      authorName: 'Current User',
      authorRole: 'Admin',
      attachments: [],
      createdAt: new Date().toISOString()
    };
    return newComment;
  },

  getStaffRatings: async (staffId: string): Promise<{ average: number, summary: any, list: StaffServiceRating[] }> => {
    await new Promise(r => setTimeout(r, 800));
    const list: StaffServiceRating[] = [
      {
        id: 'R1',
        staffId,
        staffName: 'Lê Kỹ Thuật',
        staffRole: 'Staff',
        rating: 5,
        comment: 'Nhiệt tình, xử lý nhanh.',
        tenantId: 'T1',
        tenantName: 'Nguyễn Văn A',
        ticketId: 'TKT001',
        ticketCode: 'TKT-2403-001',
        createdAt: subDays(new Date(), 2).toISOString()
      },
      {
        id: 'R2',
        staffId,
        staffName: 'Lê Kỹ Thuật',
        staffRole: 'Staff',
        rating: 4,
        comment: 'Ổn, nhưng đến hơi trễ 10p.',
        tenantId: 'T2',
        tenantName: 'Trần Thị B',
        ticketId: 'TKT003',
        ticketCode: 'TKT-2403-003',
        createdAt: subDays(new Date(), 5).toISOString()
      }
    ];
    
    return {
      average: 4.5,
      summary: {
        5: 1, 4: 1, 3: 0, 2: 0, 1: 0
      },
      list
    };
  }
};
