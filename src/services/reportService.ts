import apiClient from './apiClient';
import {
  ReportFilter,
  OccupancyKPI,
  OccupancyTrendPoint,
  HeatmapCell,
  FinancialKPI,
  FinancialChartPoint,
  RevenueBreakdownRow,
  DebtAgingRow,
  DebtDetailRow,
  ConsumptionKPI,
  ConsumptionChartPoint,
  ConsumptionDetailRow,
  RoomLifecycleSegment,
  VacancyRateSummary,
  NPSSummary,
  NPSTrendPoint,
  NPSResponse,
  StaffPerformance,
} from '@/types/reports';

// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Occupancy
export const getOccupancyKPI = async (filter: ReportFilter): Promise<OccupancyKPI> => {
  await delay(800);
  return {
    avgOccupancyRate: 88.5,
    avgOccupancyDelta: 4.2,
    occupiedRooms: 156,
    longestVacantRoom: { roomCode: "P.902", days: 45 },
    avgVacancyDays: 12,
    sparklineData: [
      { value: 140 }, { value: 145 }, { value: 142 }, { value: 150 }, { value: 148 }, { value: 156 }, { value: 156 }
    ]
  };
};

export const getOccupancyTrend = async (filter: ReportFilter): Promise<OccupancyTrendPoint[]> => {
  await delay(1000);
  const buildings = ["Keangnam A", "Lotte Center", "Vinhomes Skylake"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const data: OccupancyTrendPoint[] = [];
  months.forEach(m => {
    buildings.forEach(b => {
      data.push({
        month: m,
        buildingId: Math.random(),
        buildingName: b,
        rate: Math.floor(Math.random() * 40) + 60
      });
    });
  });
  return data;
};

export const getOccupancyHeatmap = async (buildingId: number, from: string, to: string): Promise<HeatmapCell[]> => {
  await delay(1200);
  const rooms = ["P.101", "P.102", "P.103", "P.201", "P.202", "P.301", "P.405", "P.502", "P.601", "P.703"];
  const months = ["01/2024", "02/2024", "03/2024"];
  const statuses: ("Occupied" | "Vacant" | "Maintenance" | "Reserved")[] = ["Occupied", "Vacant", "Maintenance", "Reserved"];
  
  const data: HeatmapCell[] = [];
  rooms.forEach(room => {
    months.forEach(month => {
      data.push({
        roomCode: room,
        month: month,
        status: statuses[Math.floor(Math.random() * 4)],
        fromDate: "2024-01-01",
        toDate: "2024-01-31",
        days: 30
      });
    });
  });
  return data;
};

// Financial
export const getFinancialKPI = async (filter: ReportFilter): Promise<FinancialKPI> => {
  await delay(800);
  return {
    totalRevenue: 2450000000,
    totalRevenueDelta: 12.5,
    netRevenue: 1980000000,
    totalDebt: 320000000,
    totalDebtDelta: 5.4,
    collected: 1660000000,
    collectionRate: 84,
    expiringContracts: 12
  };
};

export const getFinancialChart = async (filter: ReportFilter): Promise<FinancialChartPoint[]> => {
  await delay(1000);
  return Array.from({ length: 12 }, (_, i) => ({
    month: `T${i + 1}`,
    revenue: Math.floor(Math.random() * 500000000) + 1500000000,
    debt: Math.floor(Math.random() * 200000000) + 100000000,
    collected: Math.floor(Math.random() * 400000000) + 1200000000,
  }));
};

export const getRevenueBreakdown = async (filter: ReportFilter): Promise<RevenueBreakdownRow[]> => {
  await delay(900);
  return [
    { source: "Tiền thuê", months: [500000000, 520000000, 510000000], quarterTotal: 1530000000, percentage: 65, yoyPct: 8.2 },
    { source: "Phí dịch vụ", months: [120000000, 125000000, 122000000], quarterTotal: 367000000, percentage: 15, yoyPct: 12.5 },
    { source: "Điện nước", months: [180000000, 190000000, 210000000], quarterTotal: 580000000, percentage: 18, yoyPct: -2.1 },
    { source: "TỔNG", months: [800000000, 835000000, 842000000], quarterTotal: 2477000000, percentage: 100, yoyPct: 7.8 },
  ];
};

// Debt
export const getDebtAging = async (buildingId: number, asOf: string): Promise<DebtAgingRow[]> => {
  await delay(800);
  return [
    { ageGroup: "current", label: "Chưa quá hạn", contractCount: 45, invoiceCount: 52, totalDebt: 120000000, percentage: 40 },
    { ageGroup: "1-30", label: "1 - 30 ngày", contractCount: 12, invoiceCount: 15, totalDebt: 85000000, percentage: 25 },
    { ageGroup: "31-60", label: "31 - 60 ngày", contractCount: 8, invoiceCount: 10, totalDebt: 65000000, percentage: 18 },
    { ageGroup: "61-90", label: "61 - 90 ngày", contractCount: 4, invoiceCount: 5, totalDebt: 32000000, percentage: 12 },
    { ageGroup: "90+", label: "> 90 ngày", contractCount: 2, invoiceCount: 3, totalDebt: 18000000, percentage: 5 },
  ];
};

export const getDebtDetail = async (filter: ReportFilter & { minDays?: number; maxDays?: number }): Promise<DebtDetailRow[]> => {
  await delay(1000);
  return Array.from({ length: 10 }, (_, i) => ({
    tenantName: `Nguyễn Văn ${String.fromCharCode(65 + i)}`,
    roomCode: `P.120${i}`,
    contractCode: `HD-2024-${1000 + i}`,
    invoiceCode: `INV-03-${2000 + i}`,
    daysOverdue: Math.floor(Math.random() * 120),
    amountDue: Math.floor(Math.random() * 15000000) + 2000000,
    lastPaymentDate: i % 3 === 0 ? null : "2024-02-15",
    invoiceId: i,
    tenantId: i + 100
  }));
};

export const sendDebtReminder = async (invoiceIds: number[]): Promise<void> => {
  await delay(1500);
};

// Consumption
export const getConsumptionKPI = async (filter: ReportFilter): Promise<ConsumptionKPI> => {
  await delay(800);
  return {
    avgElectricityPerRoom: 245,
    avgElectricityDelta: 12.5,
    avgWaterPerRoom: 18,
    avgWaterDelta: -4.2,
    highestRoom: { roomCode: "P.2405", roomId: 123, kwh: 850 },
    avgElectricityBill: 857500
  };
};

export const getConsumptionChart = async (filter: ReportFilter): Promise<ConsumptionChartPoint[]> => {
  await delay(1000);
  const buildings = ["Keangnam A", "Lotte Center"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const data: ConsumptionChartPoint[] = [];
  months.forEach(m => {
    buildings.forEach(b => {
      data.push({
        month: m,
        buildingName: b,
        electricity: Math.floor(Math.random() * 300) + 100,
        water: Math.floor(Math.random() * 20) + 5
      });
    });
  });
  return data;
};

export const getConsumptionDetail = async (filter: ReportFilter): Promise<ConsumptionDetailRow[]> => {
  await delay(1100);
  return Array.from({ length: 15 }, (_, i) => ({
    roomId: i,
    roomCode: `P.${100 + i}`,
    buildingName: i % 2 === 0 ? "Keangnam A" : "Lotte Center",
    type: Math.random() > 0.5 ? "electricity" : "water",
    prevIndex: 1200 + i,
    currentIndex: 1450 + i,
    consumption: 250,
    estimatedAmount: 875000,
    vsLastMonth: Math.floor(Math.random() * 20) - 10
  }));
};

// Room Lifecycle
export const getRoomLifecycle = async (filter: ReportFilter): Promise<RoomLifecycleSegment[]> => {
  await delay(1200);
  const rooms = ["P.101", "P.102", "P.105", "P.2403", "P.1802"];
  return rooms.map(room => ({
    roomCode: room,
    roomId: Math.random(),
    segments: [
      { status: "Occupied", fromDate: "2024-01-01", toDate: "2024-03-15", days: 75 },
      { status: "Vacant", fromDate: "2024-03-16", toDate: "2024-04-10", days: 25 },
      { status: "Maintenance", fromDate: "2024-04-11", toDate: "2024-04-20", days: 10 },
      { status: "Reserved", fromDate: "2024-04-21", toDate: "2024-05-01", days: 10 }
    ]
  }));
};

export const getVacancySummary = async (filter: ReportFilter): Promise<VacancyRateSummary> => {
  await delay(800);
  return {
    avgVacancyDaysThisMonth: 12,
    avgVacancyDaysPrevMonth: 15,
    avgVacancyRateThisMonth: 8.5,
    avgVacancyRatePrevMonth: 10.2,
    longestVacantRoom: { roomCode: "P.905", roomId: 99, days: 68 },
    avgDaysToLease: 14,
    avgDaysToLeasePrev: 18
  };
};

// NPS
export const getNPSSummary = async (filter: ReportFilter): Promise<NPSSummary> => {
  await delay(800);
  return {
    score: 68,
    promoterPct: 75,
    passivePct: 18,
    detractorPct: 7,
    totalResponses: 256
  };
};

export const getNPSTrend = async (filter: ReportFilter): Promise<NPSTrendPoint[]> => {
  await delay(1000);
  return Array.from({ length: 12 }, (_, i) => ({
    month: `T${i + 1}`,
    score: Math.floor(Math.random() * 40) + 40
  }));
};

export const getNPSResponses = async (filter: ReportFilter & { triggerType?: string }): Promise<NPSResponse[]> => {
  await delay(900);
  return Array.from({ length: 10 }, (_, i) => ({
    tenantName: `Cư dân ${i + 1}`,
    score: Math.floor(Math.random() * 11),
    comment: "Chất lượng dịch vụ rất tốt, nhân viên thân thiện và hỗ trợ nhiệt tình.",
    triggerType: i % 2 === 0 ? "Monthly" : "PostCheckOut",
    createdAt: new Date().toISOString()
  }));
};

// Staff
export const getStaffPerformance = async (filter: ReportFilter): Promise<StaffPerformance[]> => {
  await delay(1000);
  const names = ["Trần Văn Hùng", "Lê Thị Lan", "Phạm Minh Đức", "Nguyễn Thu Hà", "Hoàng Anh Tuấn"];
  return names.map((name, i) => ({
    staffId: i + 1,
    staffName: name,
    avatarUrl: null,
    ticketsResolved: Math.floor(Math.random() * 50) + 20,
    avgResolutionHours: Math.random() * 5 + 1,
    slaRate: Math.floor(Math.random() * 20) + 80,
    avgRating: Math.random() * 1.5 + 3.5,
    ratingCount: Math.floor(Math.random() * 30) + 10
  }));
};

export const getAlertAnalytics = async (filter: ReportFilter): Promise<any> => {
  await delay(800);
  return {
    criticalCount: 42,
    criticalDelta: 12,
    warningCount: 156,
    warningDelta: -5,
    resolutionRate: 92,
    trend: Array.from({ length: 30 }, (_, i) => ({
      date: `03/${i + 1}`,
      count: Math.floor(Math.random() * 10)
    }))
  };
};

// Export (dùng chung)
export const exportReport = async (
  type: "financial" | "staff" | "occupancy" | "consumption" | "debt" | "nps" | "lifecycle",
  params: Record<string, any>
): Promise<void> => {
  await delay(2000);
  console.log(`Mock exporting ${type} with params:`, params);
  alert(`Đang xuất file báo cáo ${type}... (Tính năng này được giả lập)`);
};

export default {
  getOccupancyKPI,
  getOccupancyTrend,
  getOccupancyHeatmap,
  getFinancialKPI,
  getFinancialChart,
  getRevenueBreakdown,
  getDebtAging,
  getDebtDetail,
  sendDebtReminder,
  getConsumptionKPI,
  getConsumptionChart,
  getConsumptionDetail,
  getRoomLifecycle,
  getVacancySummary,
  getNPSSummary,
  getNPSTrend,
  getNPSResponses,
  getStaffPerformance,
  getAlertAnalytics,
  exportReport,
};
