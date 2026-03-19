import { 
  PaymentTransaction, 
  TenantBalanceTransaction, 
  WebhookLog, 
  ChannelHealth,
  PaymentStatus,
  TransactionType
} from '@/models/Payment';
import { format, subDays, subHours } from 'date-fns';
import { MOCK_PAYMENTS, MOCK_LEDGER, MOCK_WEBHOOKS, MOCK_CHANNEL_HEALTH } from '@/mocks/paymentMocks';
import { MOCK_BALANCE } from '@/mocks/tenantBalanceMocks';

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
      description: note,
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
      description: `Khấu trừ cho ${invoiceIds.length} hóa đơn`,
      createdAt: new Date().toISOString()
    };
    MOCK_LEDGER.unshift(newTransaction);
    return true;
  },

  getTenantBalance: async (tenantId: string) => {
    await new Promise(r => setTimeout(r, 400));
    return {
      ...MOCK_BALANCE,
      tenantId,
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
    return MOCK_CHANNEL_HEALTH;
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
