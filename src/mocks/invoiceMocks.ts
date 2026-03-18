import { Invoice } from '@/models/Invoice';

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV1',
    invoiceCode: 'INV-2403-001',
    contractId: 'C1',
    contractCode: 'HD-2403-001',
    roomId: 'R001',
    roomCode: 'A-101',
    buildingId: 'B1',
    buildingName: 'Keangnam Landmark',
    tenantId: 'T1',
    tenantName: 'Nguyễn Văn A',
    period: '2024-03',
    totalAmount: 6500000,
    paidAmount: 0,
    dueDate: '2024-03-15',
    status: 'Unpaid',
    hasViewed: false,
    viewCount: 0,
    createdAt: '2024-03-01'
  },
  {
    id: 'INV2',
    invoiceCode: 'INV-2403-002',
    contractId: 'C2',
    contractCode: 'HD-2403-002',
    roomId: 'R005',
    roomCode: 'B-205',
    buildingId: 'B1',
    buildingName: 'Keangnam Landmark',
    tenantId: 'T2',
    tenantName: 'Trần Thị B',
    period: '2024-03',
    totalAmount: 5200000,
    paidAmount: 5200000,
    dueDate: '2024-03-15',
    status: 'Paid',
    hasViewed: true,
    viewCount: 2,
    createdAt: '2024-03-01'
  }
];
