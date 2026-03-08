import { 
  Meter, 
  MeterReading, 
  LatestMeterReading 
} from '@/models/Meter';
import { subMonths, format } from 'date-fns';

const MOCK_METERS: Meter[] = [
  { id: 'M1', meterCode: 'E-MN-101', meterType: 'Electricity', meterStatus: 'Active', buildingId: 'B1', roomId: 'R1', roomCode: 'A-101' },
  { id: 'M2', meterCode: 'W-MN-101', meterType: 'Water', meterStatus: 'Active', buildingId: 'B1', roomId: 'R1', roomCode: 'A-101' },
  { id: 'M3', meterCode: 'E-MN-205', meterType: 'Electricity', meterStatus: 'Active', buildingId: 'B1', roomId: 'R2', roomCode: 'B-205' },
  { id: 'M4', meterCode: 'W-MN-205', meterType: 'Water', meterStatus: 'Active', buildingId: 'B1', roomId: 'R2', roomCode: 'B-205' },
  { id: 'M5', meterCode: 'E-VH-401', meterType: 'Electricity', meterStatus: 'Inactive', buildingId: 'B2', roomId: 'R3', roomCode: 'V-401' },
  { id: 'M6', meterCode: 'W-VH-401', meterType: 'Water', meterStatus: 'Active', buildingId: 'B2', roomId: 'R3', roomCode: 'V-401' }
];

const MOCK_LATEST: Record<string, LatestMeterReading> = {
  'M1': { meterId: 'M1', currentIndex: 12450, monthYear: '2026-02', readingDate: '2026-02-25', consumption: 450 },
  'M2': { meterId: 'M2', currentIndex: 342, monthYear: '2026-02', readingDate: '2026-02-25', consumption: 12 },
  'M3': { meterId: 'M3', currentIndex: 8900, monthYear: '2026-02', readingDate: '2026-02-25', consumption: 380 },
  'M4': { meterId: 'M4', currentIndex: 156, monthYear: '2026-02', readingDate: '2026-02-25', consumption: 8 },
  'M6': { meterId: 'M6', currentIndex: 98, monthYear: '2026-02', readingDate: '2026-02-25', consumption: 5 }
};

export const meterService = {
  getMeters: async (params: { buildingId?: string; roomId?: string; type?: string; status?: string; missingOnly?: boolean } = {}) => {
    await new Promise(r => setTimeout(r, 600));
    let filtered = [...MOCK_METERS];
    
    if (params.buildingId) filtered = filtered.filter(m => m.buildingId === params.buildingId);
    if (params.roomId) filtered = filtered.filter(m => m.roomId === params.roomId);
    if (params.type) filtered = filtered.filter(m => m.meterType === params.type);
    if (params.status) filtered = filtered.filter(m => m.meterStatus === params.status);

    const currentMonth = new Date().toISOString().substring(0, 7);
    if (params.missingOnly) {
       filtered = filtered.filter(m => MOCK_LATEST[m.id]?.monthYear !== currentMonth);
    }

    // RULE-01: Correctly join with latest reading view (vw_LatestMeterReading)
    const joinedData = filtered.map(m => ({
      ...m,
      latestReadingIndex: MOCK_LATEST[m.id]?.currentIndex || 0,
      latestMonthYear: MOCK_LATEST[m.id]?.monthYear || '--',
      hasReadingThisMonth: MOCK_LATEST[m.id]?.monthYear === currentMonth
    }));

    return { data: joinedData, total: joinedData.length };
  },

  getLatestReading: async (meterId: string): Promise<LatestMeterReading> => {
    await new Promise(r => setTimeout(r, 400));
    // RULE-01: Explicitly fetch from the latest reading source
    return MOCK_LATEST[meterId] || { meterId, currentIndex: 0, monthYear: '', readingDate: '', consumption: 0 };
  },

  getReadings: async (params: { meterId: string; monthYear?: string; page?: number; limit?: number }) => {
    await new Promise(r => setTimeout(r, 600));
    const now = new Date();
    const mockArray: MeterReading[] = [];
    const latest = MOCK_LATEST[params.meterId]?.currentIndex || 1000;
    
    // Generate 6 months of history
    for(let i=0; i<6; i++) {
       const m = subMonths(now, i);
       const my = format(m, 'yyyy-MM');
       mockArray.push({
          id: `R-${params.meterId}-${i}`,
          meterId: params.meterId,
          monthYear: my,
          readingDate: format(m, 'yyyy-MM-25'),
          previousIndex: latest - (i + 1) * 200,
          currentIndex: latest - i * 200,
          consumption: 200,
          recordedById: 'U1',
          recordedByName: 'Trần Văn Quản lý',
          createdAt: new Date().toISOString()
       });
    }
    
    return { data: mockArray, total: mockArray.length };
  },

  submitReading: async (body: any) => {
    await new Promise(r => setTimeout(r, 1000));
    return { id: 'NEW-R', ...body, consumption: 0, recordedById: 'U1', createdAt: new Date().toISOString() };
  },

  submitBulkReadings: async (body: any) => {
    await new Promise(r => setTimeout(r, 1500));
    return { success: body.readings.length, failed: 0, errors: [] };
  },

  updateReading: async (id: string, body: any) => {
    await new Promise(r => setTimeout(r, 800));
    return { id, ...body, updatedAt: new Date().toISOString() };
  }
};
