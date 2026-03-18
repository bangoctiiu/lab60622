import { 
  PaymentTransaction, 
  TenantBalanceTransaction, 
  WebhookLog, 
  ChannelHealth,
  PaymentStatus,
  TransactionType
} from '@/models/Payment';
import { format, subDays, subHours } from 'date-fns';

const MOCK_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'TX001',
    transactionCode: 'CASH-1710001234',
    invoiceId: 'INV001',
    invoiceCode: 'INV-202503-0001',
    tenantId: 'T1',
    tenantName: 'Nguyễn Văn A',
    amount: 15500000,
    method: 'Cash',
    status: 'Pending',
    paidAt: new Date().toISOString(),
    recordedBy: 'Admin Staff',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TX002',
    transactionCode: 'BANK-TRX-5566',
    invoiceId: 'INV002',
    invoiceCode: 'INV-202503-0002',
    tenantId: 'T2',
    tenantName: 'Trần Thị B',
    amount: 12000000,
    method: 'BankTransfer',
    status: 'Confirmed',
    paidAt: subDays(new Date(), 1).toISOString(),
    evidenceImage: 'https://placehold.co/600x400/2563eb/white?text=Bank+Receipt',
    recordedBy: 'System',
    createdAt: subDays(new Date(), 1).toISOString()
  }
];

const MOCK_LEDGER: TenantBalanceTransaction[] = [
  {
    id: 'L1',
    tenantId: 'T1',
    type: 'ManualTopUp',
    amount: 5000000,
    balanceBefore: 0,
    balanceAfter: 5000000,
    note: 'Nạp tiền mặt tại văn phòng',
    createdAt: subDays(new Date(), 5).toISOString()
  },
  {
    id: 'L2',
    tenantId: 'T1',
    type: 'AutoOffset',
    amount: -3000000,
    balanceBefore: 5000000,
    balanceAfter: 2000000,
    relatedInvoiceId: 'INV000',
    relatedInvoiceCode: 'INV-202502-0099',
    note: 'Khấu trừ hóa đơn tháng 2',
    createdAt: subDays(new Date(), 2).toISOString()
  }
];

const MOCK_WEBHOOKS: WebhookLog[] = [
  {
    id: 'W1',
    provider: 'VNPay',
    transactionCode: 'VNP12345678',
    amount: 1500000,
    status: 'Processed',
    receivedAt: subHours(new Date(), 1).toISOString(),
    processedAt: subHours(new Date(), 1).toISOString(),
    retryCount: 0,
    maxRetries: 3,
    payloadJson: JSON.stringify({ vnp_Amount: "1500000", vnp_BankCode: "NCB", vnp_ResponseCode: "00" }, null, 2)
  },
  {
    id: 'W2',
    provider: 'Momo',
    transactionCode: 'MOMO-998877',
    amount: 2500000,
    status: 'Failed',
    receivedAt: subHours(new Date(), 3).toISOString(),
    retryCount: 2,
    maxRetries: 3,
    payloadJson: JSON.stringify({ resultCode: 99, message: "Transaction failed", orderId: "123" }, null, 2)
  }
];

export const paymentService = {
  getPayments: async (filters?: any): Promise<PaymentTransaction[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_PAYMENTS;
  },

  getPendingCount: async (): Promise<{ count: number; total: number }> => {
    const pending = MOCK_PAYMENTS.filter(p => p.status === 'Pending');
    return {
      count: pending.length,
      total: pending.reduce((sum, p) => sum + p.amount, 0)
    };
  },

  // 4.1.4 Quick Inline Actions for Pending rows
  approvePayment: async (id: string) => {
    await new Promise(r => setTimeout(r, 800));
    console.log(`Approved payment: ${id}`);
    return true;
  },

  rejectPayment: async (id: string, reason: string) => {
    await new Promise(r => setTimeout(r, 800));
    console.log(`Rejected payment: ${id}, reason: ${reason}`);
    return true;
  },

  // 4.2 Record Payment
  recordPayment: async (payment: Omit<PaymentTransaction, 'id' | 'createdAt'>) => {
    await new Promise(r => setTimeout(r, 1000));
    const newPayment = {
      ...payment,
      id: `TX${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    MOCK_PAYMENTS.unshift(newPayment as PaymentTransaction);
    return newPayment;
  },

  // 4.4.2 Manual Top-up / 4.4.3 Manual Deduct
  manualBalanceAdjustment: async (tenantId: string, amount: number, type: TransactionType, note: string) => {
    await new Promise(r => setTimeout(r, 800));
    const balance = await paymentService.getTenantBalance(tenantId);
    const newTransaction: TenantBalanceTransaction = {
      id: `L${Date.now()}`,
      tenantId,
      type,
      amount,
      balanceBefore: balance.currentBalance,
      balanceAfter: balance.currentBalance + amount,
      note,
      createdAt: new Date().toISOString()
    };
    MOCK_LEDGER.unshift(newTransaction);
    return newTransaction;
  },

  // 4.4.3 Auto-offset Modal (bu tru hoa don)
  autoOffsetInvoices: async (tenantId: string, invoiceIds: string[]) => {
    await new Promise(r => setTimeout(r, 1200));
    const balance = await paymentService.getTenantBalance(tenantId);
    // Simple mock logic: deduct total amount of invoices
    // In real app, this would be more complex
    const totalDeduct = -1500000; // Mock total
    const newTransaction: TenantBalanceTransaction = {
      id: `L-OFFSET-${Date.now()}`,
      tenantId,
      type: 'AutoOffset',
      amount: totalDeduct,
      balanceBefore: balance.currentBalance,
      balanceAfter: balance.currentBalance + totalDeduct,
      note: `Khấu trừ cho ${invoiceIds.length} hóa đơn`,
      createdAt: new Date().toISOString()
    };
    MOCK_LEDGER.unshift(newTransaction);
    return true;
  },

  getTenantBalance: async (tenantId: string) => {
    await new Promise(r => setTimeout(r, 400));
    return {
      tenantId,
      currentBalance: 2450000,
      lastUpdatedAt: new Date().toISOString()
    };
  },

  getTenantLedger: async (tenantId: string): Promise<TenantBalanceTransaction[]> => {
    await new Promise(r => setTimeout(r, 700));
    return MOCK_LEDGER.filter(l => l.tenantId === tenantId);
  },

  getWebhookLogs: async (): Promise<WebhookLog[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_WEBHOOKS;
  },

  getChannelHealth: async (): Promise<ChannelHealth[]> => {
    return [
      { provider: 'VNPay', successRate24h: 99.8, status: 'OK', lastReceivedAt: new Date().toISOString() },
      { provider: 'Momo', successRate24h: 94.2, status: 'Degraded', lastReceivedAt: subHours(new Date(), 1).toISOString() },
      { provider: 'ZaloPay', successRate24h: 100, status: 'OK', lastReceivedAt: subHours(new Date(), 2).toISOString() }
    ];
  },

  retryWebhook: async (id: string) => {
    await new Promise(r => setTimeout(r, 1000));
    console.log(`Retrying webhook: ${id}`);
    return true;
  },

  // 4.7.2 TransactionCode auto-gen
  generateCashCode: () => {
    return `CASH-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
};
