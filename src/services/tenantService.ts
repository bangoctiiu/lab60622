import { 
  TenantSummary, TenantProfile, TenantStatus, 
  EmergencyContact, OnboardingProgress, 
  TenantFeedback, NPSSurvey, ContactGroup
} from '@/models/Tenant';
import { TenantBalance, TenantBalanceTransaction } from '@/models/TenantBalance';
import { MOCK_TENANTS, getMockTenantDetail } from '@/mocks/tenantMocks';
import { MOCK_LEDGER } from '@/mocks/paymentMocks';

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
    return {
      tenantId: id,
      currentBalance: 2450000,
      totalPaid: 15000000,
      totalUnpaid: 2450000,
      lastUpdated: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString()
    };
  },

  getTenantLedger: async (id: string): Promise<TenantBalanceTransaction[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_LEDGER.filter(l => l.tenantId === id);
  },

  getEmergencyContacts: async (id: string): Promise<EmergencyContact[]> => {
    return [
      { id: 'ec1', tenantId: id, contactName: 'Nguyễn Văn Phụ', relationship: 'Khac', phone: '0988776655', isPrimary: true }
    ];
  },

  getOnboardingProgress: async (id: string): Promise<OnboardingProgress> => {
    return {
      tenantId: id,
      isPersonalInfoConfirmed: true,
      isCCCDUploaded: true,
      isEmergencyContactAdded: true,
      isContractSigned: true,
      isDepositPaid: true,
      isRoomHandovered: false,
      completionPercent: 85
    };
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
