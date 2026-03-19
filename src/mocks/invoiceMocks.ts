import { Invoice, InvoiceDetail, InvoiceItem } from '@/models/Invoice';

export const MOCK_BANK_INFO = {
  accountName: 'CONG TY SMARTSTAY',
  accountNumber: '190345678910',
  bankName: 'Techcombank',
  qrContent: (invoiceCode: string) => `PAY ${invoiceCode}`
};

export const MOCK_INVOICE_ITEMS_TEMPLATE: InvoiceItem[] = [
  {
    id: 'ITEM1',
    description: 'Tiền thuê phòng',
    quantity: 1,
    unitPriceSnapshot: 0, // Should be totalAmount - 1000000
    amount: 0,
    type: 'Rent'
  },
  {
    id: 'ITEM2',
    description: 'Tiền điện tháng 02/2025',
    quantity: 250,
    unitPriceSnapshot: 3500,
    amount: 875000,
    type: 'Electricity',
    tierBreakdown: [
      { tierOrder: 1, fromKwh: 0, toKwh: 50, kwh: 50, price: 1806, amount: 90300 },
      { tierOrder: 2, fromKwh: 51, toKwh: 100, kwh: 50, price: 1866, amount: 93300 },
      { tierOrder: 3, fromKwh: 101, toKwh: 200, kwh: 100, price: 2167, amount: 216700 },
      { tierOrder: 4, fromKwh: 201, toKwh: 300, kwh: 50, price: 2729, amount: 136450 }
    ]
  },
  {
    id: 'ITEM3',
    description: 'Phí dịch vụ chung',
    quantity: 1,
    unitPriceSnapshot: 200000,
    amount: 200000,
    type: 'Service'
  }
];

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
  },
  {
    id: 'INV3',
    invoiceCode: 'INV-2402-001',
    contractId: 'C1',
    contractCode: 'HD-2403-001',
    roomId: 'R001',
    roomCode: 'A-101',
    buildingId: 'B1',
    buildingName: 'Keangnam Landmark',
    tenantId: 'T1',
    tenantName: 'Nguyễn Văn A',
    period: '2024-02',
    totalAmount: 6200000,
    paidAmount: 6200000,
    dueDate: '2024-02-15',
    status: 'Paid',
    hasViewed: true,
    viewCount: 3,
    createdAt: '2024-02-01'
  },
  {
    id: 'INV4',
    invoiceCode: 'INV-2401-001',
    contractId: 'C1',
    contractCode: 'HD-2403-001',
    roomId: 'R001',
    roomCode: 'A-101',
    buildingId: 'B1',
    buildingName: 'Keangnam Landmark',
    tenantId: 'T1',
    tenantName: 'Nguyễn Văn A',
    period: '2024-01',
    totalAmount: 5800000,
    paidAmount: 5800000,
    dueDate: '2024-01-15',
    status: 'Paid',
    hasViewed: true,
    viewCount: 5,
    createdAt: '2024-01-01'
  }
];
