import { PaymentTransaction, TenantBalanceTransaction, WebhookLog } from '@/models/Payment';

export const MOCK_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'P1',
    transactionCode: 'TRX123456',
    amount: 5000000,
    method: 'BankTransfer',
    status: 'Confirmed',
    paidAt: '2024-03-01T10:00:00Z',
    tenantId: 'T1',
    tenantName: 'Nguyễn Văn A',
    createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: 'P2',
    transactionCode: 'TRX789012',
    amount: 3200000,
    method: 'Momo',
    status: 'Pending',
    paidAt: '2024-03-02T15:30:00Z',
    tenantId: 'T2',
    tenantName: 'Trần Thị B',
    createdAt: '2024-03-02T15:30:00Z'
  }
];

export const MOCK_LEDGER: TenantBalanceTransaction[] = [
  {
    id: 'L1',
    tenantId: 'T1',
    amount: -5000000,
    balanceBefore: 0,
    balanceAfter: -5000000,
    type: 'Overpayment',
    description: 'Thanh toán hóa đơn tháng 3',
    createdAt: '2024-03-01T10:00:00Z'
  }
];

export const MOCK_WEBHOOKS: WebhookLog[] = [
  {
    id: 'W1',
    provider: 'Momo',
    transactionCode: 'TRX789012',
    amount: 3200000,
    status: 'Processed',
    receivedAt: '2024-03-02T15:30:00Z',
    retryCount: 0,
    maxRetries: 3,
    payloadJson: '{}'
  }
];
