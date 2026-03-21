import { normalizeNotificationType } from './notificationUtils';

/**
 * Manual test suite for notification normalization
 * Run with: npx vitest src/utils/notificationUtils.test.ts (if vitest is installed)
 */
export const runNotificationTests = () => {
  const tests = [
    { input: 'InvoiceDue', expected: 'invoice_due' },
    { input: 'payment_success', expected: 'payment_confirmed' },
    { input: 'TicketAssigned', expected: 'ticket' },
    { input: 'bill_new', expected: 'invoice_new' },
    { input: 'contract-expiring', expected: 'contract_renew' },
    { input: 'UNKNOWN_TYPE', expected: 'default' },
    { input: '', expected: 'default' },
    { input: undefined, expected: 'default' }
  ];

  console.log('--- Running Notification Normalization Tests ---');
  let passed = 0;
  tests.forEach(({ input, expected }) => {
    const result = normalizeNotificationType(input as any);
    if (result === expected) {
      console.log(`✅ [PASS] "${input}" -> "${result}"`);
      passed++;
    } else {
      console.error(`❌ [FAIL] "${input}" -> expected "${expected}", got "${result}"`);
    }
  });
  console.log(`--- Total: ${passed}/${tests.length} passed ---`);
};

// Auto-run if this file is executed directly in some environments
// In most React projects we'd use a real test runner like Vitest or Jest.
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  runNotificationTests();
}
