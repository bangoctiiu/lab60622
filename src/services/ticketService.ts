import { 
  Ticket, TicketSummary, TicketStatus, 
  TicketPriority, TicketType, TicketComment, 
  StaffServiceRating, TicketStatistics 
} from '@/models/Ticket';
import { MOCK_TICKETS, MOCK_TICKET_COMMENTS } from '@/mocks/ticketMocks';

export const ticketService = {
  getTickets: async (filters?: any): Promise<Ticket[]> => {
    await new Promise(r => setTimeout(r, 700));
    let result = [...MOCK_TICKETS];
    if (filters?.status && filters.status !== 'All') {
      result = result.filter(t => t.status === filters.status);
    }
    return result;
  },

  getTicketDetail: async (id: string): Promise<Ticket> => {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_TICKETS.find(t => t.id === id) || MOCK_TICKETS[0];
  },

  getTicketComments: async (ticketId: string): Promise<TicketComment[]> => {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_TICKET_COMMENTS.filter(c => c.ticketId === ticketId);
  },

  getTicketStatistics: async (): Promise<TicketStatistics> => {
    return {
      total: 156,
      open: 12,
      inProgress: 8,
      resolved: 130,
      cancelled: 6,
      slaBreached: 3,
      avgResolutionTimeHours: 4.5,
      satisfactionRate: 4.8
    };
  },

  createTicket: async (ticket: Omit<Ticket, 'id' | 'ticketCode' | 'createdAt' | 'updatedAt'>): Promise<Ticket> => {
    await new Promise(r => setTimeout(r, 1000));
    return {
      ...ticket,
      id: Date.now().toString(),
      ticketCode: `TK-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Ticket;
  },

  updateTicketStatus: async (id: string, status: TicketStatus): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    return true;
  },

  updateStatus: async (id: string, status: TicketStatus, resolution?: any): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    console.log(`Updating ticket ${id} to ${status}`, resolution);
    return true;
  },

  addComment: async (ticketId: string, content: string, isInternal: boolean = false): Promise<TicketComment> => {
    await new Promise(r => setTimeout(r, 600));
    return {
      id: Date.now().toString(),
      ticketId,
      content,
      authorId: 'admin',
      authorName: 'Admin',
      authorRole: 'Staff',
      isInternal,
      attachments: [],
      createdAt: new Date().toISOString()
    };
  },

  getStaffRatings: async (staffId: string): Promise<{ average: number, summary: Record<number, number>, list: StaffServiceRating[] }> => {
    await new Promise(r => setTimeout(r, 700));
    return {
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
    };
  }
};

export default ticketService;
