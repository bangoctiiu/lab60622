import api from './apiClient';
import { KPIData, RecentTicket } from '../models/Dashboard';
import { TenantBalance } from '../models/TenantBalance';
import { Announcement } from '../types/announcement';
import { ContractDetail } from '../models/Contract';

export interface OnboardingStatus {
  completionPercent: number;
  steps: {
    isPersonalInfoConfirmed: boolean;
    isCCCDUploaded: boolean;
    isEmergencyContactAdded: boolean;
    isRoomHandovered: boolean;
    isDepositPaid: boolean;
    isContractSigned: boolean;
  };
}

export interface DashboardSummary {
  balance: TenantBalance;
  pendingInvoicesCount: number;
  totalPendingAmount: number;
  upcomingInvoices: any[];
  recentTickets: RecentTicket[];
  hotAnnouncements: Announcement[];
  activeContract: ContractDetail;
  onboarding: OnboardingStatus;
}

export const tenantDashboardService = {
  getSummary: async (tenantId: string = 'T1'): Promise<DashboardSummary> => {
    // Simulated aggregation from multiple views and tables
    // RULE-01: Meters should use vw_LatestMeterReading
    // RULE-02: Rooms should use vw_BuildingRoomCount
    await new Promise(r => setTimeout(r, 800));
    
    return {
      balance: {
        tenantId,
        currentBalance: 12540000,
        lastUpdated: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString()
      },
      pendingInvoicesCount: 2,
      totalPendingAmount: 3450000,
      upcomingInvoices: [
        { id: 'inv-1', title: 'Tiền điện tháng 03/2026', amount: 1250000, dueDate: '2026-04-05' },
        { id: 'inv-2', title: 'Tiền nước tháng 03/2026', amount: 450000, dueDate: '2026-04-05' },
      ],
      recentTickets: [
        { 
          id: '1', 
          ticketCode: 'TK-102', 
          title: 'Hỏng vòi nước nhà vệ sinh', 
          roomName: 'P.1002', 
          priority: 'High', 
          status: 'Open', 
          createdAt: new Date().toISOString(), 
          slaDeadline: new Date(Date.now() + 1000 * 60 * 45).toISOString() // 45 mins left
        },
        { 
          id: '2', 
          ticketCode: 'TK-098', 
          title: 'Thay bóng đèn hành lang', 
          roomName: 'P.1002', 
          priority: 'Low', 
          status: 'InProgress', 
          createdAt: new Date(Date.now() - 86400000).toISOString(), 
          slaDeadline: new Date(Date.now() - 3600000).toISOString() // Breached 1 hour ago
        }
      ],
      hotAnnouncements: [
        {
          id: 1,
          title: 'Bảo trì hệ thống điện định kỳ',
          content: 'Tòa nhà sẽ ngắt điện vào lúc 02:00 sáng ngày 25/03 để bảo trì trạm biến áp.',
          type: 'Urgent',
          status: 'Published',
          publishAt: '2026-03-20',
          targetGroups: [],
          buildingIds: [],
          isPinned: true,
          createdBy: 1,
          createdAt: '2026-03-20',
          updatedAt: '2026-03-20'
        },
        {
          id: 2,
          title: 'Thông báo phí dịch vụ tháng 3',
          content: 'Quý cư dân vui lòng thanh toán phí dịch vụ trước ngày 05/04.',
          type: 'General',
          status: 'Published',
          publishAt: '2026-03-18',
          targetGroups: [],
          buildingIds: [],
          isPinned: false,
          createdBy: 1,
          createdAt: '2026-03-18',
          updatedAt: '2026-03-18'
        }
      ],
      activeContract: {
        id: 'C1',
        contractCode: 'CT-2024-001',
        tenantName: 'Nguyễn Văn An',
        roomId: 'R102',
        roomCode: 'P.1002',
        buildingName: 'SmartStay Tower A',
        type: 'Residential',
        startDate: '2024-01-01',
        endDate: '2026-04-15',
        rentPriceSnapshot: 15000000,
        autoRenew: false,
        paymentCycle: 1,
        isRepresentative: true,
        depositAmount: 30000000,
        depositStatus: 'Available',
        paymentDueDay: 5,
        status: 'Active',
        tenants: [],
        services: []
      },
      onboarding: {
        completionPercent: 50,
        steps: {
          isPersonalInfoConfirmed: true,
          isCCCDUploaded: true,
          isEmergencyContactAdded: true,
          isRoomHandovered: false,
          isDepositPaid: false,
          isContractSigned: false
        }
      }
    };
  }
};

export default tenantDashboardService;
