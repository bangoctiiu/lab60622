import apiClient from './apiClient';
import { Contract, ContractDetail } from '@/models/Contract';
import { MOCK_CONTRACTS } from '@/mocks/contractMocks';
import { API_ENDPOINTS } from '@/constants/api';
import { handleServiceError } from '@/utils/errorUtils';
import { ApiResponse, BaseRequestParams } from '@/types/api';
import { toast } from 'sonner';

export interface ContractFilter extends BaseRequestParams {
  buildingId?: string;
  status?: string;
}

export const contractService = {
  getContracts: async (filters: ContractFilter = {}): Promise<Contract[]> => {
    try {
      // For now using mock, but structured for API call
      // const response = await apiClient.get<ApiResponse<Contract[]>>(API_ENDPOINTS.CONTRACTS, { params: filters });
      // return response.data.data;

      await new Promise(r => setTimeout(r, 800));
      let result = [...MOCK_CONTRACTS];
      if (filters.buildingId) {
        result = result.filter(c => c.buildingId === filters.buildingId);
      }
      return result;
    } catch (error) {
      return handleServiceError(error, 'Không thể tải danh sách hợp đồng');
    }
  },

  getContractDetail: async (id: string): Promise<ContractDetail> => {
    try {
      // const response = await apiClient.get<ApiResponse<ContractDetail>>(`${API_ENDPOINTS.CONTRACTS}/${id}`);
      // return response.data.data;

      await new Promise(r => setTimeout(r, 500));
      const contract = MOCK_CONTRACTS.find(c => c.id === id) || MOCK_CONTRACTS[0];
      return contract;
    } catch (error) {
      return handleServiceError(error, 'Không thể tải thông tin chi tiết hợp đồng');
    }
  },

  exportContracts: async (filters: ContractFilter) => {
    try {
      toast.success('Đang khởi tạo file Excel...');
      return apiClient.get(`${API_ENDPOINTS.CONTRACTS}/export`, { params: filters, responseType: 'blob' });
    } catch (error) {
      return handleServiceError(error, 'Không thể xuất file hợp đồng');
    }
  }
};


