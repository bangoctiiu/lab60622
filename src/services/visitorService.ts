import { MOCK_VISITORS, Visitor } from '@/mocks/visitorMocks';

export const visitorService = {
  getVisitors: async (filters?: any): Promise<Visitor[]> => {
    await new Promise(r => setTimeout(r, 600));
    let result = [...MOCK_VISITORS];
    if (filters?.tenantId) {
      result = result.filter(v => v.tenantId === filters.tenantId);
    }
    return result;
  },

  getVisitorDetail: async (id: string): Promise<Visitor | undefined> => {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_VISITORS.find(v => v.id === id);
  },

  createVisitor: async (visitor: Omit<Visitor, 'id' | 'qrCode' | 'status'>): Promise<Visitor> => {
    await new Promise(r => setTimeout(r, 800));
    return {
      ...visitor,
      id: `V${Date.now()}`,
      qrCode: `QR-VIS-${Math.floor(Math.random() * 1000)}`,
      status: 'Expected'
    };
  }
};

export default visitorService;
