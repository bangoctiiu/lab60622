import { 
  Tenant, TenantProfile, TenantStatus, 
  EmergencyContact, OnboardingProgress, 
  TenantFeedback, NPSSurvey, TenantSummary,
  TenantBalanceTransaction 
} from '@/models/Tenant';
import { format, subDays, subMonths } from 'date-fns';

const MOCK_TENANTS: TenantSummary[] = [
  {
    id: 'T1',
    fullName: 'Lê Minh Tâm',
    phone: '0987654321',
    email: 'tamlun@gmail.com',
    cccd: '001085001234',
    status: 'Active',
    currentRoomId: 'R1',
    currentRoomCode: 'A-101',
    avatarUrl: 'https://i.pravatar.cc/150?u=T1',
    onboardingPercent: 100,
    hasActiveContract: true
  },
  {
    id: 'T2',
    fullName: 'Hoàng Thu Trang',
    phone: '0912345678',
    email: 'trang.hoang@gmail.com',
    cccd: '001290112233',
    status: 'Active',
    currentRoomId: 'R2',
    currentRoomCode: 'B-205',
    avatarUrl: 'https://i.pravatar.cc/150?u=T2',
    onboardingPercent: 65,
    hasActiveContract: true
  },
  {
    id: 'T3',
    fullName: 'Nguyễn Văn A',
    phone: '0944556677',
    email: 'vana@gmail.com',
    cccd: '001300998877',
    status: 'CheckedOut',
    onboardingPercent: 100,
    hasActiveContract: false
  },
  {
    id: 'T4',
    fullName: 'Phạm Thị B',
    phone: '0955667788',
    email: 'phamb@outlook.com',
    cccd: '001200334455',
    status: 'Blacklisted',
    onboardingPercent: 20,
    hasActiveContract: false
  }
];

export const tenantService = {
  getTenants: async (filters?: any): Promise<TenantSummary[]> => {
    await new Promise(r => setTimeout(r, 800));
    let filtered = [...MOCK_TENANTS];
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.fullName.toLowerCase().includes(s) || 
        t.phone.includes(s) || 
        t.cccd.includes(s)
      );
    }
    if (filters?.status && filters.status.length > 0) {
      filtered = filtered.filter(t => filters.status.includes(t.status));
    }
    if (filters?.buildingId) {
      // In mock, all belong to B1 (Manor)
      if (filters.buildingId !== 'B1') filtered = [];
    }
    if (filters?.hasActiveContract !== undefined) {
      filtered = filtered.filter(t => t.hasActiveContract === filters.hasActiveContract);
    }
    if (filters?.onboardingComplete) {
      filtered = filtered.filter(t => t.onboardingPercent === 100);
    }
    return filtered;
  },

  getTenantDetail: async (id: string): Promise<TenantProfile> => {
    await new Promise(r => setTimeout(r, 600));
    const base = MOCK_TENANTS.find(t => t.id === id) || MOCK_TENANTS[0];
    return {
      ...base,
      gender: 'Male',
      dateOfBirth: '1995-05-15',
      cccdIssuedDate: '2020-01-01',
      cccdIssuedPlace: 'Cục Cảnh sát QLHC về TTXH',
      nationality: 'Vietnam',
      occupation: 'Kỹ sư phần mềm',
      permanentAddress: '123 Đường Láng, Ba Đình, Hà Nội',
      vehiclePlates: ['29-A1 123.45', '30-B2 678.90'],
      notes: 'Khách hàng lâu năm, thanh toán đúng hạn.'
    };
  },

  getEmergencyContacts: async (tenantId: string): Promise<EmergencyContact[]> => {
    return [
      { id: 'EC1', tenantId, contactName: 'Nguyễn Văn B', relationship: 'Cha/Me', phone: '0900112233', email: 'vnb@gmail.com', isPrimary: true },
      { id: 'EC2', tenantId, contactName: 'Trần Thị C', relationship: 'Vo/Chong', phone: '0911223344', email: 'ttc@gmail.com', isPrimary: false },
    ];
  },

  getOnboardingProgress: async (tenantId: string): Promise<OnboardingProgress> => {
    return {
      tenantId,
      isPersonalInfoConfirmed: true,
      isCCCDUploaded: true,
      isEmergencyContactAdded: true,
      isContractSigned: false,
      isDepositPaid: false,
      isRoomHandovered: false,
      completionPercent: 50
    };
  },

  getFeedback: async (tenantId: string): Promise<TenantFeedback[]> => {
    return [
      { id: 'F1', tenantId, feedbackType: 'Complaint', content: 'Vòi nước nhà vệ sinh bị rò rỉ.', isResolved: true, createdAt: subDays(new Date(), 10).toISOString() },
      { id: 'F2', tenantId, feedbackType: 'Suggestion', content: 'Nên thêm thùng rác ở hành lang.', isResolved: false, createdAt: subDays(new Date(), 2).toISOString() },
    ];
  },

  getNPSSurveys: async (tenantId: string): Promise<NPSSurvey[]> => {
    return [
      { id: 'N1', tenantId, score: 9, triggerType: 'Monthly', comment: 'Dịch vụ rất tốt.', scoreDate: subMonths(new Date(), 1).toISOString() },
      { id: 'N2', tenantId, score: 6, triggerType: 'PostMaintenance', comment: 'Thời gian phản hồi hơi chậm.', scoreDate: subDays(new Date(), 15).toISOString() },
    ];
  },

  getTenantBalanceTransactions: async (tenantId: string): Promise<TenantBalanceTransaction[]> => {
    await new Promise(r => setTimeout(r, 500));
    return [
      { 
        id: 'L1', tenantId, amount: -3500000, type: 'Payment', description: 'Thanh toán hóa đơn tháng 02/2026', 
        balanceBefore: 28000000, balanceAfter: 24500000, createdAt: subDays(new Date(), 5).toISOString(), referenceId: 'INV1' 
      },
      { 
        id: 'L2', tenantId, amount: 15000000, type: 'Payment', description: 'Nạp tiền vào ví điện tử', 
        balanceBefore: 13000000, balanceAfter: 28000000, createdAt: subDays(new Date(), 10).toISOString() 
      },
      { 
        id: 'L3', tenantId, amount: -500000, type: 'Correction', description: 'Điều chỉnh phí dịch vụ dư', 
        balanceBefore: 13500000, balanceAfter: 13000000, createdAt: subDays(new Date(), 15).toISOString() 
      }
    ];
  },

  addTenantBalanceTransaction: async (data: Omit<TenantBalanceTransaction, 'id' | 'createdAt'>): Promise<TenantBalanceTransaction> => {
    const newTransaction: TenantBalanceTransaction = {
      ...data,
      id: 'L' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    return newTransaction;
  }
};
