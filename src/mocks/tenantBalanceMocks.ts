import { TenantBalance, TenantBalanceTransaction } from '@/models/TenantBalance';
import { subDays } from 'date-fns';

export const MOCK_BALANCE: TenantBalance = {
  tenantId: 'T1',
  balance: 2500000,
  totalDeposit: 15000000,
  totalPaid: 125000000,
  totalDebt: 0,
  updatedAt: new Date().toISOString()
};

export const MOCK_BALANCE_TRANSACTIONS: TenantBalanceTransaction[] = [
  {
    id: 'TXN001',
    tenantId: 'T1',
    transactionType: 'Credit',
    amount: 15500000,
    balanceAfter: 2500000,
    transactionDate: new Date().toISOString(),
    referenceType: 'Payment',
    referenceId: 'PAY001',
    note: 'Thanh toán hóa đơn tháng 3/2025',
    createdBy: 'admin@smartstay.vn'
  },
  {
    id: 'TXN002',
    tenantId: 'T1',
    transactionType: 'Debit',
    amount: 13000000,
    balanceAfter: -13000000,
    transactionDate: subDays(new Date(), 2).toISOString(),
    referenceType: 'Invoice',
    referenceId: 'INV001',
    note: 'Ghi nợ hóa đơn tháng 3/2025',
    createdBy: 'system'
  },
  {
    id: 'TXN003',
    tenantId: 'T1',
    transactionType: 'DepositReturn',
    amount: 5000000,
    balanceAfter: 0, 
    transactionDate: subDays(new Date(), 30).toISOString(),
    note: 'Hoàn cọc 1 phần do thay đổi phòng',
    createdBy: 'manager1'
  }
];
