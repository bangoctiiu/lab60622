import {
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
  ReportMetadata,
  AlertAnalytics,
  ReportData,
} from '@/types/reports';

export const MOCK_GENERIC_REPORT_DATA = (id: string): ReportData => ({
  reportId: id,
  title: 'Báo cáo chi tiết',
  generatedAt: new Date().toISOString(),
  columns: [
    { key: 'period', label: 'Kỳ' },
    { key: 'amount', label: 'Số tiền' }
  ],
  data: [
    { period: '2024-01', amount: 12000000 },
    { period: '2024-02', amount: 15400000 }
  ],
  summaryData: {
    total: 27400000
  }
});

export const MOCK_REPORTS: ReportMetadata[] = [
  { id: 'occupancy', name: 'Tỷ lệ lấp đầy', category: 'Operational', description: 'Phân tích hiệu suất khai thác phòng' },
  { id: 'financial', name: 'Doanh thu & Thu nợ', category: 'Finance', description: 'Báo cáo dòng tiền và công nợ' },
  { id: 'consumption', name: 'Tiêu thụ Điện / Nước', category: 'Utilities', description: 'Theo dõi chỉ số và chi phí điện nước' },
  { id: 'lifecycle', name: 'Vòng đời phòng', category: 'Operational', description: 'Lịch sử trạng thái của từng phòng' }
];

export const MOCK_OCCUPANCY_KPI: OccupancyKPI = {
  avgOccupancyRate: 88.5,
  avgOccupancyDelta: 4.2,
  occupiedRooms: 156,
  longestVacantRoom: { roomCode: "P.902", days: 45 },
  avgVacancyDays: 12,
  sparklineData: [
    { value: 140 }, { value: 145 }, { value: 142 }, { value: 150 }, { value: 148 }, { value: 156 }, { value: 156 }
  ]
};

export const MOCK_OCCUPANCY_TREND = (months: string[], buildings: string[]): OccupancyTrendPoint[] => {
  const data: OccupancyTrendPoint[] = [];
  months.forEach(m => {
    buildings.forEach(b => {
      data.push({
        month: m,
        buildingId: Math.floor(Math.random() * 100),
        buildingName: b,
        rate: Math.floor(Math.random() * 40) + 60
      });
    });
  });
  return data;
};

export const MOCK_HEATMAP = (rooms: string[], months: string[]): HeatmapCell[] => {
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

export const MOCK_FINANCIAL_KPI: FinancialKPI = {
  totalRevenue: 2450000000,
  totalRevenueDelta: 12.5,
  netRevenue: 1980000000,
  totalDebt: 320000000,
  totalDebtDelta: 5.4,
  collected: 1660000000,
  collectionRate: 84,
  expiringContracts: 12
};

export const MOCK_FINANCIAL_CHART: FinancialChartPoint[] = Array.from({ length: 12 }, (_, i) => ({
  month: `T${i + 1}`,
  revenue: Math.floor(Math.random() * 500000000) + 1500000000,
  debt: Math.floor(Math.random() * 200000000) + 100000000,
  collected: Math.floor(Math.random() * 400000000) + 1200000000,
}));

export const MOCK_REVENUE_BREAKDOWN: RevenueBreakdownRow[] = [
  { source: "Tiền thuê", months: [500000000, 520000000, 510000000], quarterTotal: 1530000000, percentage: 65, yoyPct: 8.2 },
  { source: "Phí dịch vụ", months: [120000000, 125000000, 122000000], quarterTotal: 367000000, percentage: 15, yoyPct: 12.5 },
  { source: "Điện nước", months: [180000000, 190000000, 210000000], quarterTotal: 580000000, percentage: 18, yoyPct: -2.1 },
  { source: "TỔNG", months: [800000000, 835000000, 842000000], quarterTotal: 2477000000, percentage: 100, yoyPct: 7.8 },
];

export const MOCK_DEBT_AGING: DebtAgingRow[] = [
  { ageGroup: "current", label: "Chưa quá hạn", contractCount: 45, invoiceCount: 52, totalDebt: 120000000, percentage: 40 },
  { ageGroup: "1-30", label: "1 - 30 ngày", contractCount: 12, invoiceCount: 15, totalDebt: 85000000, percentage: 25 },
  { ageGroup: "31-60", label: "31 - 60 ngày", contractCount: 8, invoiceCount: 10, totalDebt: 65000000, percentage: 18 },
  { ageGroup: "61-90", label: "61 - 90 ngày", contractCount: 4, invoiceCount: 5, totalDebt: 32000000, percentage: 12 },
  { ageGroup: "90+", label: "> 90 ngày", contractCount: 2, invoiceCount: 3, totalDebt: 18000000, percentage: 5 },
];

export const MOCK_DEBT_DETAIL: DebtDetailRow[] = Array.from({ length: 10 }, (_, i) => ({
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

export const MOCK_CONSUMPTION_KPI: ConsumptionKPI = {
  avgElectricityPerRoom: 245,
  avgElectricityDelta: 12.5,
  avgWaterPerRoom: 18,
  avgWaterDelta: -4.2,
  highestRoom: { roomCode: "P.2405", roomId: 123, kwh: 850 },
  avgElectricityBill: 857500
};

export const MOCK_CONSUMPTION_DETAIL: ConsumptionDetailRow[] = Array.from({ length: 15 }, (_, i) => ({
  roomId: i,
  roomCode: `P.${100 + i}`,
  buildingName: i % 2 === 0 ? "Keangnam A" : "Lotte Center",
  type: (Math.random() > 0.5 ? "electricity" : "water") as "electricity" | "water",
  prevIndex: 1200 + i,
  currentIndex: 1450 + i,
  consumption: 250,
  estimatedAmount: 875000,
  vsLastMonth: Math.floor(Math.random() * 20) - 10
}));

export const MOCK_ROOM_LIFECYCLE = (rooms: string[]): RoomLifecycleSegment[] => {
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

export const MOCK_VACANCY_SUMMARY: VacancyRateSummary = {
  avgVacancyDaysThisMonth: 12,
  avgVacancyDaysPrevMonth: 15,
  avgVacancyRateThisMonth: 8.5,
  avgVacancyRatePrevMonth: 10.2,
  longestVacantRoom: { roomCode: "P.905", roomId: 99, days: 68 },
  avgDaysToLease: 14,
  avgDaysToLeasePrev: 18
};

export const MOCK_NPS_SUMMARY: NPSSummary = {
  score: 68,
  promoterPct: 75,
  passivePct: 18,
  detractorPct: 7,
  totalResponses: 256
};

export const MOCK_STAFF_PERFORMANCE = (names: string[]): StaffPerformance[] => {
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

export const MOCK_ALERTS_ANALYTICS: AlertAnalytics = {
  criticalCount: 15,
  criticalDelta: 2.5,
  warningCount: 42,
  warningDelta: -5.2,
  resolutionRate: 85,
  trend: Array.from({ length: 15 }, (_, i) => ({
    date: `2024-03-${String(i + 1).padStart(2, '0')}`,
    count: Math.floor(Math.random() * 20) + 5
  }))
};

export const MOCK_CONSUMPTION_CHART = (months: string[], buildings: string[]): ConsumptionChartPoint[] => {
  const data: ConsumptionChartPoint[] = [];
  months.forEach(m => {
    buildings.forEach(b => {
      data.push({
        month: m,
        buildingName: b,
        electricity: Math.floor(Math.random() * 1000) + 500,
        water: Math.floor(Math.random() * 50) + 20
      });
    });
  });
  return data;
};

export const MOCK_NPS_TREND = (months: string[]): NPSTrendPoint[] => {
  return months.map(m => ({
    month: m,
    score: Math.floor(Math.random() * 40) + 50
  }));
};

export const MOCK_NPS_RESPONSES: NPSResponse[] = Array.from({ length: 6 }, (_, i) => ({
  tenantName: `Cư dân ${String.fromCharCode(65 + i)}`,
  score: Math.floor(Math.random() * 10) + 1,
  comment: i % 2 === 0 ? "Dịch vụ rất tốt, nhân viên nhiệt tình." : "Cần cải thiện thời gian xử lý sự cố.",
  triggerType: (i % 3 === 0 ? "Monthly" : i % 3 === 1 ? "PostCheckOut" : "PostMaintenance") as any,
  createdAt: "2024-03-10T10:00:00Z"
}));
