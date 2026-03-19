import { Invoice, InvoiceDetail, InvoiceStatus } from '@/models/Invoice';
import { addDays, format, subMonths } from 'date-fns';
import { MOCK_INVOICES } from '@/mocks/invoiceMocks';

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
