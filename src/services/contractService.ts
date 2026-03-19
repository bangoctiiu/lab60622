import apiClient from './apiClient';
import { Contract, ContractDetail } from '@/models/Contract';
import { MOCK_CONTRACTS } from '@/mocks/contractMocks';

export const contractService = {
  getContracts: async (filters: any): Promise<Contract[]> => {
    await new Promise(r => setTimeout(r, 800));
    let result = [...MOCK_CONTRACTS];
    // Apply filters if needed
    if (filters?.buildingId) {
      result = result.filter(c => c.buildingId === filters.buildingId);
    }
    return result;
  },

  getContractDetail: async (id: string): Promise<ContractDetail> => {
    await new Promise(r => setTimeout(r, 500));
    const contract = MOCK_CONTRACTS.find(c => c.id === id) || MOCK_CONTRACTS[0];
    return contract;
  },

  exportContracts: async (filters: any) => {
    // Simulated download
    toast.success('Đang khởi tạo file Excel...');
    return apiClient.get('/api/contracts/export', { params: filters, responseType: 'blob' });
  }
};

import { toast } from 'sonner';
