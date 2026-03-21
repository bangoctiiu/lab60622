import api from './apiClient';
import { ContractDetail } from '@/models/Contract';
import { MOCK_CONTRACTS } from '@/mocks/contractMocks';

export const portalService = {
  getActiveContract: async (): Promise<ContractDetail> => {
    // In production, this would be api.get('/api/portal/contract/active')
    // For now, return mock
    await new Promise(r => setTimeout(r, 600));
    return MOCK_CONTRACTS[0];
  },

  getRepairRequests: async (): Promise<any[]> => {
    await new Promise(r => setTimeout(r, 500));
    return [
      { id: 'RQ-001', title: 'Hư vòi sen phòng tắm', status: 'In Progress', createdAt: '2024-03-20' },
      { id: 'RQ-002', title: 'Bóng đèn hành lang nhấp nháy', status: 'Completed', createdAt: '2024-03-10' },
    ];
  },

  getResidentBills: async (): Promise<any[]> => {
    await new Promise(r => setTimeout(r, 700));
    return [
      { id: 'BL-001', code: 'INV/2024/003', amount: 3500000, status: 'Unpaid', dueDate: '2024-04-05' },
      { id: 'BL-002', code: 'INV/2024/002', amount: 15450000, status: 'Paid', dueDate: '2024-03-05' },
    ];
  }
};

export default portalService;
