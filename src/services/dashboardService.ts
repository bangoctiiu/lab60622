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
import { 
  MOCK_KPI_DATA, 
  MOCK_REVENUE_CHART, 
  MOCK_OCCUPANCY_STATS, 
  MOCK_RECENT_PAYMENTS, 
  MOCK_RECENT_TICKETS, 
  MOCK_ELECTRICITY_CHART, 
  MOCK_ANALYTICS_ALERTS,
  MOCK_STAFF_KPI 
} from '@/mocks/dashboardMocks';

export const dashboardService = {
  getKPIs: async (buildingId?: string | number): Promise<KPIData> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_KPI_DATA;
  },

  getRevenueChart: async (buildingId?: string | number, months: number = 12): Promise<RevenueDataPoint[]> => {
    await new Promise(r => setTimeout(r, 800));
    return MOCK_REVENUE_CHART;
  },

  getOccupancy: async (buildingId?: string | number): Promise<OccupancyData> => {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_OCCUPANCY_STATS;
  },

  getRecentPayments: async (buildingId?: string | number): Promise<RecentPayment[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_RECENT_PAYMENTS;
  },

  getRecentTickets: async (buildingId?: string | number): Promise<RecentTicket[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_RECENT_TICKETS;
  },

  getElectricityChart: async (buildingId?: string | number, months: number = 6): Promise<ElectricityDataPoint[]> => {
    await new Promise(r => setTimeout(r, 700));
    return MOCK_ELECTRICITY_CHART;
  },

  getAnalyticsAlerts: async (): Promise<AnalyticsAlert[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_ANALYTICS_ALERTS;
  },

  getStaffKPIs: async (buildingId?: string | number): Promise<any> => {
    return MOCK_STAFF_KPI;
  },

  getStaffTickets: async (buildingId?: string | number): Promise<RecentTicket[]> => {
    return MOCK_RECENT_TICKETS.slice(0, 2);
  },

  dismissAlert: async (id: string): Promise<void> => {
    // PATCH /api/analytics-alerts/:id {IsResolved:true}
    await api.patch(`/analytics-alerts/${id}`, { isResolved: true });
  }
};

export default dashboardService;
