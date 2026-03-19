import { TenantBalance, TenantBalanceTransaction } from '@/models/TenantBalance';
import { subDays } from 'date-fns';

export const MOCK_BALANCE: TenantBalance = {
  tenantId: 'T1',
  currentBalance: 2500000,
  totalPaid: 125000000,
  totalUnpaid: 0,
  lastUpdated: new Date().toISOString(),
  lastUpdatedAt: new Date().toISOString()
};

export const MOCK_BALANCE_TRANSACTIONS: TenantBalanceTransaction[] = [
  {
    id: 'TXN001',
    tenantId: 'T1',
    type: 'Payment',
    amount: 15500000,
    balanceBefore: -13000000,
    balanceAfter: 2500000,
    description: 'Thanh toán hóa đơn tháng 3/2025',
    referenceId: 'PAY001',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TXN002',
    tenantId: 'T1',
    type: 'ManualDeduct', // Replace Debit with something valid
    amount: -13000000,
    balanceBefore: 0,
    balanceAfter: -13000000,
    description: 'Ghi nợ hóa đơn tháng 3/2025',
    relatedInvoiceId: 'INV001',
    createdAt: subDays(new Date(), 2).toISOString()
  },
  {
    id: 'TXN003',
    tenantId: 'T1',
    type: 'Refund',
    amount: 5000000,
    balanceBefore: -5000000,
    balanceAfter: 0, 
    description: 'Hoàn cọc 1 phần do thay đổi phòng',
    createdAt: subDays(new Date(), 30).toISOString()
  }
];
