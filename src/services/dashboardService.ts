import api from './apiClient';
import { 
  KPIData, 
  RevenueDataPoint, 
  OccupancyData, 
  RecentPayment, 
  RecentTicket, 
  ElectricityDataPoint,
  AnalyticsAlert
} from '../models/Dashboard';

export const dashboardService = {
  getKPIs: async (buildingId?: string | number): Promise<KPIData> => {
    // GET /api/dashboard/kpi
    // Simulated mock response
    return {
      totalBuildings: 12,
      totalRooms: 1240,
      occupiedRooms: 1040,
      occupancyRate: 83.8,
      currentMonthRevenue: 2450000000,
      totalOverdueBalance: 125000000,
      activeContracts: 856,
      openTickets: 12,
      deltas: {
        totalBuildings: 2,
        occupancyRate: 3.5,
        currentMonthRevenue: 12.4,
        totalOverdueBalance: -5.2
      }
    };
  },

  getRevenueChart: async (buildingId?: string | number, months: number = 12): Promise<RevenueDataPoint[]> => {
    // GET /api/dashboard/revenue-chart?buildingId&months=12
    return [
      { month: 'T04/23', revenue: 1200000000, profit: 450000000 },
      { month: 'T05/23', revenue: 1350000000, profit: 500000000 },
      { month: 'T06/23', revenue: 1100000000, profit: 400000000 },
      { month: 'T07/23', revenue: 1500000000, profit: 700000000 },
      { month: 'T08/23', revenue: 1450000000, profit: 650000000 },
      { month: 'T09/23', revenue: 1600000000, profit: 800000000 },
      { month: 'T10/23', revenue: 1750000000, profit: 900000000 },
      { month: 'T11/23', revenue: 1900000000, profit: 1000000000 },
      { month: 'T12/23', revenue: 2100000000, profit: 1200000000 },
      { month: 'T01/24', revenue: 2000000000, profit: 1100000000 },
      { month: 'T02/24', revenue: 2300000000, profit: 1300000000 },
      { month: 'T03/24', revenue: 2450000000, profit: 1400000000 },
    ];
  },

  getOccupancy: async (buildingId?: string | number): Promise<OccupancyData> => {
    // GET /api/vw/building-occupancy?buildingId
    return {
      occupied: 1040,
      vacant: 120,
      maintenance: 45,
      reserved: 35,
      totalOccupancyRate: 83.8
    };
  },

  getRecentPayments: async (buildingId?: string | number): Promise<RecentPayment[]> => {
    // Top 5 payments
    return [
      { id: '1', transactionCode: 'CASH-001', tenantName: 'Lê Minh Tâm', amount: 15400000, method: 'Bank', status: 'Confirmed', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
      { id: '2', transactionCode: 'PAY-882', tenantName: 'Hoàng Thu Trang', amount: 8200000, method: 'VNPay', status: 'Confirmed', createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
      { id: '3', transactionCode: 'CASH-002', tenantName: 'Nguyễn Văn A', amount: 12000000, method: 'Cash', status: 'Pending', createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
      { id: '4', transactionCode: 'MOMO-991', tenantName: 'Trần Thị B', amount: 3500000, method: 'MoMo', status: 'Confirmed', createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
      { id: '5', transactionCode: 'BANK-X12', tenantName: 'Phạm Văn C', amount: 22000000, method: 'Bank', status: 'Confirmed', createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString() },
    ];
  },

  getRecentTickets: async (buildingId?: string | number): Promise<RecentTicket[]> => {
    // Top 5 tickets
    return [
      { id: '1', ticketCode: 'TK-102', title: 'Hỏng vòi nước nhà vệ sinh', roomName: 'P.1002', priority: 'High', status: 'Open', createdAt: new Date().toISOString(), slaDeadline: new Date(Date.now() + 1000 * 60 * 120).toISOString() },
      { id: '2', ticketCode: 'TK-105', title: 'Mất kết nối Internet tầng 5', roomName: 'Floor 5', priority: 'Critical', status: 'InProgress', createdAt: new Date().toISOString(), slaDeadline: new Date(Date.now() + 1000 * 60 * 30).toISOString() },
      { id: '3', ticketCode: 'TK-098', title: 'Thay bóng đèn hành lang', roomName: 'A1-HL', priority: 'Low', status: 'Open', createdAt: new Date().toISOString(), slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() },
      { id: '4', ticketCode: 'TK-110', title: 'Thang máy số 2 rung lắc', roomName: 'Lift 2', priority: 'Critical', status: 'Open', createdAt: new Date().toISOString(), slaDeadline: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
      { id: '5', ticketCode: 'TK-088', title: 'Vệ sinh định kỳ hồ bơi', roomName: 'Pool', priority: 'Medium', status: 'InProgress', createdAt: new Date().toISOString(), slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString() },
    ];
  },

  getElectricityChart: async (buildingId?: string | number, months: number = 6): Promise<ElectricityDataPoint[]> => {
    // GET /api/dashboard/electricity-chart
    return [
      { month: 'T10/23', 'Keangnam': 45000, 'Lotte': 38000, 'Vinhome': 52000 },
      { month: 'T11/23', 'Keangnam': 42000, 'Lotte': 41000, 'Vinhome': 48000 },
      { month: 'T12/23', 'Keangnam': 48000, 'Lotte': 45000, 'Vinhome': 55000 },
      { month: 'T01/24', 'Keangnam': 44000, 'Lotte': 39000, 'Vinhome': 51000 },
      { month: 'T02/24', 'Keangnam': 40000, 'Lotte': 35000, 'Vinhome': 46000 },
      { month: 'T03/24', 'Keangnam': 46000, 'Lotte': 42000, 'Vinhome': 53000 },
    ];
  },

  getAnalyticsAlerts: async (): Promise<AnalyticsAlert[]> => {
    // GET /api/analytics-alerts
    return [
      { id: '1', type: 'OccupancyDrop', severity: 2, message: 'Tòa Keangnam có tỷ lệ lấp đầy giảm 5%.', affectedEntity: 'Keangnam Landmark', isResolved: false, createdAt: new Date().toISOString() },
      { id: '2', type: 'RevenueGap', severity: 3, message: 'Doanh thu tháng 3 chưa đạt kế hoạch (thiếu 15%).', affectedEntity: 'Toàn hệ thống', isResolved: false, createdAt: new Date().toISOString() },
      { id: '3', type: 'OverdueSpike', severity: 1, message: 'Cảnh báo nợ quá hạn tăng cao tại tòa Lotte.', affectedEntity: 'Lotte Center', isResolved: false, createdAt: new Date().toISOString() },
    ];
  },

  getStaffKPIs: async (buildingId?: string | number): Promise<any> => {
    return {
      assignedTickets: 8,
      slaOverdueTickets: 2,
      todayTickets: 3,
      avgRating: 4.8,
      unprocessedTickets: 5,
      processingTickets: 2,
      completedThisWeek: 12,
      slaOnTimeRate: 94,
    };
  },

  getStaffTickets: async (buildingId?: string | number): Promise<RecentTicket[]> => {
    return [
      { id: '1', ticketCode: 'TK-102', title: 'Hỏng vòi nước nhà vệ sinh', roomName: 'P.1002', priority: 'High', status: 'Open', createdAt: new Date().toISOString(), slaDeadline: new Date(Date.now() + 1000 * 60 * 120).toISOString() },
      { id: '2', ticketCode: 'TK-105', title: 'Mất kết nối Internet tầng 5', roomName: 'Floor 5', priority: 'Critical', status: 'InProgress', createdAt: new Date().toISOString(), slaDeadline: new Date(Date.now() + 1000 * 60 * 30).toISOString() },
    ];
  },

  dismissAlert: async (id: string): Promise<void> => {
    // PATCH /api/analytics-alerts/:id {IsResolved:true}
    await api.patch(`/analytics-alerts/${id}`, { isResolved: true });
  }
};
