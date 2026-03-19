import { 
  TenantSummary, TenantProfile, TenantStatus, 
  EmergencyContact, OnboardingProgress, 
  TenantFeedback, NPSSurvey, ContactGroup
} from '@/models/Tenant';
import { TenantBalance, TenantBalanceTransaction } from '@/models/TenantBalance';
import { MOCK_TENANTS, getMockTenantDetail, MOCK_EMERGENCY_CONTACTS, MOCK_ONBOARDING_PROGRESS } from '@/mocks/tenantMocks';
import { MOCK_LEDGER } from '@/mocks/paymentMocks';
import { MOCK_BALANCE } from '@/mocks/tenantBalanceMocks';

export const tenantService = {
  getTenants: async (filters?: any): Promise<TenantSummary[]> => {
    await new Promise(r => setTimeout(r, 800));
    let result = [...MOCK_TENANTS];
    if (filters?.status && filters.status !== 'All') {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(t => t.fullName.toLowerCase().includes(s) || t.phone.includes(s));
    }
    return result;
  },

  getTenantDetail: async (id: string): Promise<TenantProfile> => {
    await new Promise(r => setTimeout(r, 500));
    return getMockTenantDetail(id);
  },

  getTenantBalance: async (id: string): Promise<TenantBalance> => {
    await new Promise(r => setTimeout(r, 400));
    return { ...MOCK_BALANCE, tenantId: id, lastUpdatedAt: new Date().toISOString() };
  },

  getTenantLedger: async (id: string): Promise<TenantBalanceTransaction[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_LEDGER.filter(l => l.tenantId === id);
  },

  getEmergencyContacts: async (id: string): Promise<EmergencyContact[]> => {
    return MOCK_EMERGENCY_CONTACTS.filter(ec => ec.tenantId === id || ec.tenantId === 'T1');
  },

  getOnboardingProgress: async (id: string): Promise<OnboardingProgress> => {
    return { ...MOCK_ONBOARDING_PROGRESS, tenantId: id };
  },

  // Mock methods for other tabs
  getFeedback: async (id: string): Promise<TenantFeedback[]> => [],
  getNPSSurveys: async (id: string): Promise<NPSSurvey[]> => [],
  getTenantBalanceTransactions: async (id: string): Promise<TenantBalanceTransaction[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_LEDGER.filter(l => l.tenantId === id);
  },
  getContactGroups: async (): Promise<ContactGroup[]> => []
};

export default tenantService;
