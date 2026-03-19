import { MOCK_BALANCE, MOCK_BALANCE_TRANSACTIONS } from '@/mocks/tenantBalanceMocks';

export const portalFinanceService = {
  getFreshBalance: async (tenantId: string = 'T1'): Promise<any> => {
    // RULE-05: Real-time calculation, NO cache
    await new Promise(r => setTimeout(r, 600));
    // Since MOCK_BALANCE is a single object in the file
    return MOCK_BALANCE;
  },

  getBalanceTransactions: async (tenantId: string = 'T1'): Promise<any> => {
    // RULE-07: Immutable Ledger
    await new Promise(r => setTimeout(r, 800));
    const txs = MOCK_BALANCE_TRANSACTIONS.filter((t: any) => t.tenantId === tenantId);
    return { items: txs };
  },

  getInvoices: async (): Promise<any[]> => {
    // Use invoice mocks
    await new Promise(r => setTimeout(r, 700));
    return []; // Placeholder if needed
  }
};

export default portalFinanceService;
