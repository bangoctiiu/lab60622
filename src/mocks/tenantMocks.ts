import { TenantProfile, EmergencyContact, OnboardingProgress, TenantFeedback, NPSSurvey, TenantSummary } from '@/models/Tenant';

export const MOCK_TENANTS: TenantSummary[] = [
  {
    id: 'T1',
    fullName: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'nva@example.com',
    cccd: '123456789',
    status: 'Active',
    currentRoomCode: 'A-101',
    hasActiveContract: true,
    onboardingPercent: 100
  },
  {
    id: 'T2',
    fullName: 'Trần Thị B',
    phone: '0907654321',
    email: 'ttb@example.com',
    cccd: '987654321',
    status: 'Active',
    currentRoomCode: 'B-205',
    hasActiveContract: true,
    onboardingPercent: 80
  }
];

export const getMockTenantDetail = (id: string): TenantProfile => {
  const base = MOCK_TENANTS.find(t => t.id === id) || MOCK_TENANTS[0];
  return {
    ...base,
    gender: 'Male',
    dateOfBirth: '1990-05-15',
    cccdIssuedDate: '2015-01-01',
    cccdIssuedPlace: 'Hà Nội',
    nationality: 'Việt Nam',
    occupation: 'Software Engineer',
    permanentAddress: '123 Đường Láng, Đống Đa, Hà Nội',
    notes: 'Khách hàng thân thiết',
    vehiclePlates: ['29A-12345']
  };
};

export const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { 
    id: 'EC1', 
    tenantId: 'T1', 
    contactName: 'Nguyễn Văn Phụ', 
    relationship: 'Cha/Me', 
    phone: '0988776655',
    isPrimary: true 
  }
];

export const MOCK_ONBOARDING_PROGRESS: OnboardingProgress = {
  tenantId: 'T1',
  isPersonalInfoConfirmed: true,
  isCCCDUploaded: true,
  isEmergencyContactAdded: true,
  isContractSigned: true,
  isDepositPaid: true,
  isRoomHandovered: true,
  completionPercent: 100
};

export const MOCK_TENANT_FEEDBACK: TenantFeedback[] = [
  { 
    id: 'F1', 
    tenantId: 'T1', 
    feedbackType: 'Complaint', 
    content: 'Thang máy hơi chậm', 
    isResolved: true, 
    createdAt: '2024-03-05' 
  }
];

export const MOCK_NPS_SURVEYS: NPSSurvey[] = [
  { 
    id: 'S1', 
    tenantId: 'T1', 
    score: 9, 
    triggerType: 'Monthly',
    comment: 'Dịch vụ rất tốt.', 
    scoreDate: '2024-03-10' 
  }
];
