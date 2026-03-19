import { 
  ReportMetadata, 
  ReportData, 
  ReportFilter, 
  RoomLifecycleSegment, 
  VacancyRateSummary,
  AlertAnalytics,
  ConsumptionKPI,
  ConsumptionChartPoint,
  ConsumptionDetailRow,
  DebtAgingRow,
  DebtDetailRow,
  FinancialKPI,
  FinancialChartPoint,
  RevenueBreakdownRow,
  NPSSummary,
  NPSTrendPoint,
  NPSResponse,
  OccupancyKPI,
  OccupancyTrendPoint,
  HeatmapCell,
  StaffPerformance
} from '@/types/reports';
import { 
  MOCK_REPORTS, 
  MOCK_ROOM_LIFECYCLE, 
  MOCK_VACANCY_SUMMARY,
  MOCK_ALERTS_ANALYTICS,
  MOCK_CONSUMPTION_KPI,
  MOCK_CONSUMPTION_CHART,
  MOCK_CONSUMPTION_DETAIL,
  MOCK_DEBT_AGING,
  MOCK_DEBT_DETAIL,
  MOCK_FINANCIAL_KPI,
  MOCK_FINANCIAL_CHART,
  MOCK_REVENUE_BREAKDOWN,
  MOCK_NPS_SUMMARY,
  MOCK_NPS_TREND,
  MOCK_NPS_RESPONSES,
  MOCK_OCCUPANCY_KPI,
  MOCK_OCCUPANCY_TREND,
  MOCK_HEATMAP,
  MOCK_STAFF_PERFORMANCE,
  MOCK_GENERIC_REPORT_DATA
} from '@/mocks/reportMocks';

export const reportService = {
  getAvailableReports: async (): Promise<ReportMetadata[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_REPORTS;
  },

  getReportData: async (id: string, params: any): Promise<ReportData> => {
    await new Promise(r => setTimeout(r, 1200));
    return MOCK_GENERIC_REPORT_DATA(id);
  },

  getRoomLifecycle: async (filters: ReportFilter): Promise<RoomLifecycleSegment[]> => {
    await new Promise(r => setTimeout(r, 1000));
    return MOCK_ROOM_LIFECYCLE(['P.101', 'P.102', 'P.103', 'P.201', 'P.202']);
  },

  getVacancySummary: async (filters: ReportFilter): Promise<VacancyRateSummary> => {
    await new Promise(r => setTimeout(r, 800));
    return MOCK_VACANCY_SUMMARY;
  },

  getAlertAnalytics: async (filters: ReportFilter): Promise<AlertAnalytics> => {
    await new Promise(r => setTimeout(r, 700));
    return MOCK_ALERTS_ANALYTICS;
  },

  getConsumptionKPI: async (filters: ReportFilter): Promise<ConsumptionKPI> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_CONSUMPTION_KPI;
  },

  getConsumptionChart: async (filters: ReportFilter): Promise<ConsumptionChartPoint[]> => {
    await new Promise(r => setTimeout(r, 900));
    return MOCK_CONSUMPTION_CHART(['T1', 'T2', 'T3', 'T4', 'T5', 'T6'], ['Keangnam A', 'Lotte Center']);
  },

  getConsumptionDetail: async (filters: ReportFilter): Promise<ConsumptionDetailRow[]> => {
    await new Promise(r => setTimeout(r, 1000));
    return MOCK_CONSUMPTION_DETAIL;
  },

  getDebtAging: async (filters: ReportFilter): Promise<DebtAgingRow[]> => {
    await new Promise(r => setTimeout(r, 800));
    return MOCK_DEBT_AGING;
  },

  getDebtDetail: async (filters: ReportFilter): Promise<DebtDetailRow[]> => {
    await new Promise(r => setTimeout(r, 1100));
    return MOCK_DEBT_DETAIL;
  },

  sendDebtReminder: async (invoiceIds: number[]): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1000));
    return true;
  },

  getFinancialKPI: async (filters: ReportFilter): Promise<FinancialKPI> => {
    await new Promise(r => setTimeout(r, 700));
    return MOCK_FINANCIAL_KPI;
  },

  getFinancialChart: async (filters: ReportFilter): Promise<FinancialChartPoint[]> => {
    await new Promise(r => setTimeout(r, 900));
    return MOCK_FINANCIAL_CHART;
  },

  getRevenueBreakdown: async (filters: ReportFilter): Promise<RevenueBreakdownRow[]> => {
    await new Promise(r => setTimeout(r, 800));
    return MOCK_REVENUE_BREAKDOWN;
  },

  getNPSSummary: async (filters: ReportFilter): Promise<NPSSummary> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_NPS_SUMMARY;
  },

  getNPSTrend: async (filters: ReportFilter): Promise<NPSTrendPoint[]> => {
    await new Promise(r => setTimeout(r, 800));
    return MOCK_NPS_TREND(['T1', 'T2', 'T3', 'T4', 'T5', 'T6']);
  },

  getNPSResponses: async (filters: ReportFilter): Promise<NPSResponse[]> => {
    await new Promise(r => setTimeout(r, 1000));
    return MOCK_NPS_RESPONSES;
  },

  getOccupancyKPI: async (filters: ReportFilter): Promise<OccupancyKPI> => {
    await new Promise(r => setTimeout(r, 700));
    return MOCK_OCCUPANCY_KPI;
  },

  getOccupancyTrend: async (filters: ReportFilter): Promise<OccupancyTrendPoint[]> => {
    await new Promise(r => setTimeout(r, 900));
    return MOCK_OCCUPANCY_TREND(['T1', 'T2', 'T3', 'T4', 'T5', 'T6'], ['Keangnam A', 'Lotte Center']);
  },

  getOccupancyHeatmap: async (filters: ReportFilter): Promise<HeatmapCell[]> => {
    await new Promise(r => setTimeout(r, 1200));
    return MOCK_HEATMAP(['P.101', 'P.102', 'P.103'], ['T1', 'T2', 'T3']);
  },

  getStaffPerformance: async (filters: ReportFilter): Promise<StaffPerformance[]> => {
    await new Promise(r => setTimeout(r, 1000));
    return MOCK_STAFF_PERFORMANCE(['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C']);
  },

  exportReport: async (id: string, params: any, format: 'excel' | 'pdf' = 'excel') => {
    await new Promise(r => setTimeout(r, 1500));
    return true;
  }
};

export default reportService;
