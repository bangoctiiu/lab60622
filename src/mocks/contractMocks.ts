import { ContractDetail } from '@/models/Contract';

export const MOCK_CONTRACTS: any[] = [
  {
    id: 'C1',
    contractCode: 'HD-2403-001',
    tenantName: 'Nguyễn Văn A',
    roomId: 'R001',
    roomCode: 'A-101',
    buildingName: 'Keangnam Landmark',
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    rentPriceSnapshot: 5000000,
    depositAmount: 10000000,
    depositStatus: 'Available',
    paymentCycle: 1,
    paymentDueDay: 5,
    status: 'Active',
    type: 'Residential',
    autoRenew: false,
    isRepresentative: true,
    tenants: [
      {
        id: 'T1',
        fullName: 'Nguyễn Văn A',
        cccd: '001090123456',
        isRepresentative: true,
        joinedAt: '2024-03-01'
      }
    ],
    services: [
      {
        id: 'S1',
        serviceName: 'Phí dịch vụ chung',
        unit: 'Tháng',
        unitPriceSnapshot: 200000,
        quantity: 1,
        totalPerCycle: 200000
      },
      {
        id: 'S2',
        serviceName: 'Internet',
        unit: 'Tháng',
        unitPriceSnapshot: 150000,
        quantity: 1,
        totalPerCycle: 150000
      }
    ],
    signers: [
      {
        id: 'SIG1',
        side: 'Tenant',
        fullName: 'Nguyễn Văn A',
        cccd: '001090123456',
        phone: '0987654321',
        email: 'vana@gmail.com',
        signedAt: '2024-02-28'
      }
    ],
    extensions: []
  }
];
