import { Invoice, InvoiceDetail, InvoiceStatus } from '@/models/Invoice';
import { addDays, format, subMonths } from 'date-fns';

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV001',
    invoiceCode: 'INV-202503-0001',
    contractId: 'C001',
    contractCode: 'HD-VH01-2025-0001',
    roomId: 'R101',
    roomCode: 'A-101',
    buildingId: 'B1',
    buildingName: 'Keangnam Landmark',
    tenantId: 'T1',
    tenantName: 'Nguyễn Văn A',
    period: '2025-03',
    totalAmount: 15500000,
    paidAmount: 0,
    dueDate: format(addDays(new Date(), -2), 'yyyy-MM-dd'),
    status: 'Overdue',
    hasViewed: true,
    viewCount: 3,
    lastViewedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'INV002',
    invoiceCode: 'INV-202503-0002',
    contractId: 'C002',
    contractCode: 'HD-VH01-2025-0002',
    roomId: 'R102',
    roomCode: 'B-205',
    buildingId: 'B1',
    buildingName: 'Keangnam Landmark',
    tenantId: 'T2',
    tenantName: 'Trần Thị B',
    period: '2025-03',
    totalAmount: 12000000,
    paidAmount: 12000000,
    dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    status: 'Paid',
    hasViewed: true,
    viewCount: 1,
    lastViewedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'INV003',
    invoiceCode: 'INV-202503-0003',
    contractId: 'C003',
    contractCode: 'HD-VH01-2025-0003',
    roomId: 'R103',
    roomCode: 'C-309',
    buildingId: 'B1',
    buildingName: 'Keangnam Landmark',
    tenantId: 'T3',
    tenantName: 'Lê Văn C',
    period: '2025-03',
    totalAmount: 8500000,
    paidAmount: 0,
    dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    status: 'Unpaid',
    hasViewed: false,
    viewCount: 0,
    createdAt: new Date().toISOString()
  }
];

export const invoiceService = {
  getInvoices: async (filters?: any): Promise<Invoice[]> => {
    await new Promise(r => setTimeout(r, 800));
    return MOCK_INVOICES;
  },

  getInvoiceCounts: async (): Promise<Record<InvoiceStatus | 'All', number>> => {
    return {
      All: MOCK_INVOICES.length,
      Unpaid: MOCK_INVOICES.filter(i => i.status === 'Unpaid').length,
      Paid: MOCK_INVOICES.filter(i => i.status === 'Paid').length,
      Overdue: MOCK_INVOICES.filter(i => i.status === 'Overdue').length,
      Cancelled: MOCK_INVOICES.filter(i => i.status === 'Cancelled').length
    };
  },

  getInvoiceDetail: async (id: string): Promise<InvoiceDetail> => {
    await new Promise(r => setTimeout(r, 500));
    const base = MOCK_INVOICES.find(i => i.id === id) || MOCK_INVOICES[0];
    
    return {
      ...base,
      subTotal: base.totalAmount - 500000,
      taxAmount: 500000,
      discountAmount: 0,
      overdueFee: base.status === 'Overdue' ? 150000 : 0,
      items: [
        {
          id: 'ITEM1',
          description: `Tiền thuê phòng ${base.period}`,
          quantity: 1,
          unitPriceSnapshot: base.totalAmount - 1000000,
          amount: base.totalAmount - 1000000,
          type: 'Rent'
        },
        {
          id: 'ITEM2',
          description: 'Tiền điện tháng 02/2025',
          quantity: 250,
          unitPriceSnapshot: 3500,
          amount: 875000,
          type: 'Electricity',
          // 3.2.1 Handle TierBreakdownJson parsing (Checklist #5)
          tierBreakdown: (() => {
            try {
              const rawJson = JSON.stringify([
                { tierOrder: 1, fromKwh: 0, toKwh: 50, kwh: 50, price: 1806, amount: 90300 },
                { tierOrder: 2, fromKwh: 51, toKwh: 100, kwh: 50, price: 1866, amount: 93300 },
                { tierOrder: 3, fromKwh: 101, toKwh: 200, kwh: 100, price: 2167, amount: 216700 },
                { tierOrder: 4, fromKwh: 201, toKwh: 300, kwh: 50, price: 2729, amount: 136450 }
              ]);
              return JSON.parse(rawJson);
            } catch (e) {
              console.error("Failed to parse TierBreakdownJson", e);
              return [];
            }
          })()
        },
        {
          id: 'ITEM3',
          description: 'Phí dịch vụ chung',
          quantity: 1,
          unitPriceSnapshot: 200000,
          amount: 200000,
          type: 'Service'
        }
      ],
      payments: base.status === 'Paid' ? [
        {
          id: 'P1',
          transactionCode: 'TRX998877',
          paidAt: new Date().toISOString(),
          amount: base.totalAmount,
          method: 'Transfer',
          note: 'Thanh toán tiền phòng tháng 3'
        }
      ] : [],
      bankInfo: {
        accountName: 'CONG TY SMARTSTAY',
        accountNumber: '190345678910',
        bankName: 'Techcombank',
        qrContent: `PAY ${base.invoiceCode}`
      }
    };
  },

  logInvoiceView: async (invoiceId: string) => {
    console.log(`Log viewing of invoice: ${invoiceId}`);
  }
};
