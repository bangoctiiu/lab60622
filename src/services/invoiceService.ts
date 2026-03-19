import { Invoice, InvoiceDetail, InvoiceStatus } from '@/models/Invoice';
import { addDays, format, subMonths } from 'date-fns';
import { MOCK_INVOICES, MOCK_INVOICE_ITEMS_TEMPLATE, MOCK_BANK_INFO } from '@/mocks/invoiceMocks';
import { API_ENDPOINTS } from '@/constants/api';
import { handleServiceError } from '@/utils/errorUtils';
import { BaseRequestParams, ApiResponse } from '@/types/api';

export type PaymentMethod = 'Wallet' | 'VNPay' | 'MoMo' | 'ZaloPay' | 'Transfer';

export interface InvoiceFilter extends BaseRequestParams {
  status?: InvoiceStatus;
  buildingId?: string;
  roomId?: string;
  tenantId?: string;
  from?: string;
  to?: string;
}

export const invoiceService = {
  getInvoices: async (filters: InvoiceFilter = {}): Promise<Invoice[]> => {
    try {
      await new Promise(r => setTimeout(r, 800));
      return MOCK_INVOICES;
    } catch (error) {
      return handleServiceError(error, 'Không thể tải danh sách hóa đơn');
    }
  },

  getInvoiceCounts: async (): Promise<Record<InvoiceStatus | 'All', number>> => {
    try {
      return {
        All: MOCK_INVOICES.length,
        Unpaid: MOCK_INVOICES.filter(i => i.status === 'Unpaid').length,
        Paid: MOCK_INVOICES.filter(i => i.status === 'Paid').length,
        Overdue: MOCK_INVOICES.filter(i => i.status === 'Overdue').length,
        Cancelled: MOCK_INVOICES.filter(i => i.status === 'Cancelled').length
      };
    } catch (error) {
       return handleServiceError(error, 'Không thể tải thống kê hóa đơn');
    }
  },

  getInvoiceDetail: async (id: string): Promise<InvoiceDetail> => {
    try {
      await new Promise(r => setTimeout(r, 500));
      const base = MOCK_INVOICES.find(i => i.id === id) || MOCK_INVOICES[0];
      
      // RULE-03, RULE-04 simulation
      return {
        ...base,
        subTotal: base.totalAmount - 500000,
        taxAmount: 500000,
        discountAmount: 0,
        overdueFee: base.status === 'Overdue' ? 150000 : 0,
        items: [
          {
            id: 'item-1',
            type: 'Rent',
            description: `Tiền thuê phòng tháng ${base.period}`,
            quantity: 1,
            unitPriceSnapshot: 15000000,
            amount: 15000000
          },
          {
            id: 'item-2',
            type: 'Electricity',
            description: 'Tiền điện (Chỉ số: 1250 - 1450)',
            quantity: 200,
            unitPriceSnapshot: 3500,
            amount: 700000,
            tierBreakdown: [
              { label: 'Bậc 1: 0 - 50kWh', value: '50 x 1,678', amount: 83900 },
              { label: 'Bậc 2: 51 - 100kWh', value: '50 x 1,734', amount: 86700 },
              { label: 'Bậc 3: 101 - 200kWh', value: '100 x 2,014', amount: 201400 },
            ]
          },
          {
            id: 'item-3',
            type: 'Water',
            description: 'Tiền nước (Chỉ số: 45 - 55)',
            quantity: 10,
            unitPriceSnapshot: 15000,
            amount: 150000,
            tierBreakdown: [
              { label: 'Mức 1: < 10m3', value: '10 x 15,000', amount: 150000 },
            ]
          },
          {
            id: 'item-4',
            type: 'Service',
            description: 'Phí dịch vụ quản lý',
            quantity: 1,
            unitPriceSnapshot: 500000,
            amount: 500000
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
          ...MOCK_BANK_INFO,
          qrContent: MOCK_BANK_INFO.qrContent(base.invoiceCode)
        }
      };
    } catch (error) {
      return handleServiceError(error, 'Không thể tải chi tiết hóa đơn');
    }
  },

  initiatePayment: async (invoiceId: string, method: PaymentMethod): Promise<{ success: boolean; redirectUrl?: string; message?: string }> => {
    try {
      await new Promise(r => setTimeout(r, 1500));
      
      if (method === 'Transfer') {
         return { success: true, message: 'Vui lòng quét mã QR để chuyển khoản' };
      }
      
      if (method === 'Wallet') {
         return { success: true, message: 'Thanh toán thành công từ ví SmartStay' };
      }

      return { 
        success: true, 
        redirectUrl: `https://mock-payment-gateway.com/pay?id=${invoiceId}&method=${method}&return=${window.location.origin}/portal/invoices/${invoiceId}?paymentResult=success` 
      };
    } catch (error) {
      return handleServiceError(error, 'Không thể khởi tạo thanh toán');
    }
  },

  logInvoiceView: async (invoiceId: string) => {
    try {
      console.log(`Log viewing of invoice: ${invoiceId}`);
      // return apiClient.post(`${API_ENDPOINTS.INVOICES}/${invoiceId}/view-log`);
    } catch (error) {
      console.error('Error logging invoice view', error);
    }
  }
};
export default invoiceService;
