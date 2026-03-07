import apiClient from './apiClient';
import { Contract, ContractDetail } from '@/models/Contract';

export const contractService = {
  getContracts: async (filters: any): Promise<Contract[]> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            contractCode: 'HD-KN-2025-0001',
            roomId: 'R101',
            roomCode: 'A-101',
            buildingName: 'Keangnam Landmark',
            tenantName: 'Nguyễn Văn A',
            type: 'Residential',
            status: 'Active',
            rentPriceSnapshot: 15000000,
            startDate: '2025-01-01',
            endDate: '2026-01-01',
            autoRenew: true,
            paymentCycle: 1,
            isRepresentative: true
          },
          {
            id: '2',
            contractCode: 'HD-LT-2025-0002',
            roomId: 'R205',
            roomCode: 'B-205',
            buildingName: 'Lotte Center',
            tenantName: 'Trần Thị B',
            type: 'Commercial',
            status: 'Active',
            rentPriceSnapshot: 45000000,
            startDate: '2025-02-15',
            endDate: '2025-04-15', // Near expiry (< 60 days)
            autoRenew: false,
            paymentCycle: 3,
            isRepresentative: true
          },
          {
            id: '3',
            contractCode: 'HD-VO-2025-0003',
            roomId: 'R303',
            roomCode: 'C-303',
            buildingName: 'Vinhomes Ocean Park',
            tenantName: 'Lê Văn C',
            type: 'Residential',
            status: 'Draft',
            rentPriceSnapshot: 8000000,
            startDate: '2025-04-01',
            endDate: '2026-04-01',
            autoRenew: false,
            paymentCycle: 1,
            isRepresentative: true
          },
          {
            id: '4',
            contractCode: 'HD-GM-2025-0004',
            roomId: 'R404',
            roomCode: 'D-404',
            buildingName: 'Goldmark City',
            tenantName: 'Phạm Văn D',
            type: 'Shortterm',
            status: 'Active',
            rentPriceSnapshot: 12000000,
            startDate: '2025-01-10',
            endDate: '2025-03-25', // Near expiry (< 30 days)
            autoRenew: false,
            paymentCycle: 1,
            isRepresentative: true
          },
          {
            id: '5',
            contractCode: 'HD-KN-2025-0005',
            roomId: 'R505',
            roomCode: 'A-505',
            buildingName: 'Keangnam Landmark',
            tenantName: 'Hoàng Thị E',
            type: 'Residential',
            status: 'Expired',
            rentPriceSnapshot: 14000000,
            startDate: '2024-01-01',
            endDate: '2025-01-01',
            autoRenew: false,
            paymentCycle: 6,
            isRepresentative: true
          }
        ]);
      }, 800);
    });
  },

  getContractDetail: async (id: string): Promise<ContractDetail> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          contractCode: 'HD-KN-2025-0001',
          roomId: 'R101',
          roomCode: 'A-101',
          buildingName: 'Keangnam Landmark',
          tenantName: 'Nguyễn Văn A',
          type: 'Residential',
          status: 'Active',
          rentPriceSnapshot: 15000000,
          startDate: '2025-01-01',
          endDate: '2026-01-01',
          autoRenew: true,
          paymentCycle: 1,
          isRepresentative: true,
          depositAmount: 15000000,
          depositStatus: 'Available',
          paymentDueDay: 5,
          noticePeriodDays: 30,
          tenants: [
            { id: 't1', fullName: 'Nguyễn Văn A', cccd: '001234567890', isRepresentative: true, joinedAt: '2025-01-01' },
            { id: 't2', fullName: 'Nguyễn Thị B', cccd: '001234567891', isRepresentative: false, joinedAt: '2025-01-01' }
          ],
          services: [
            { id: 's1', serviceName: 'Tiền điện', unit: 'kWh', unitPriceSnapshot: 3500, quantity: 1, totalPerCycle: 0 },
            { id: 's2', serviceName: 'Tiền nước', unit: 'm3', unitPriceSnapshot: 15000, quantity: 1, totalPerCycle: 0 },
            { id: 's3', serviceName: 'Phí dịch vụ', unit: 'Tháng', unitPriceSnapshot: 200000, quantity: 1, totalPerCycle: 200000 }
          ]
        });
      }, 500);
    });
  },

  exportContracts: async (filters: any) => {
    // Simulated download
    toast.success('Đang khởi tạo file Excel...');
    return apiClient.get('/api/contracts/export', { params: filters, responseType: 'blob' });
  }
};

import { toast } from 'sonner';
