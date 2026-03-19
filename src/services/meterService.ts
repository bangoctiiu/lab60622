import { 
  Meter, 
  MeterReading, 
  LatestMeterReading 
} from '@/models/Meter';
import { subMonths, format } from 'date-fns';
import { MOCK_METERS, MOCK_LATEST_READINGS } from '@/mocks/meterMocks';
import { API_ENDPOINTS } from '@/constants/api';
import { handleServiceError } from '@/utils/errorUtils';
import { BaseRequestParams, PaginatedResponse } from '@/types/api';

export interface MeterFilter extends BaseRequestParams {
  buildingId?: string;
  roomId?: string;
  type?: string;
  status?: string;
  missingOnly?: boolean;
}

export const meterService = {
  getMeters: async (params: MeterFilter = {}) => {
    try {
      await new Promise(r => setTimeout(r, 600));
      let filtered = [...MOCK_METERS];
      
      if (params.buildingId) filtered = filtered.filter(m => m.buildingId === params.buildingId);
      if (params.roomId) filtered = filtered.filter(m => m.roomId === params.roomId);
      if (params.type) filtered = filtered.filter(m => m.meterType === params.type);
      if (params.status) filtered = filtered.filter(m => m.meterStatus === params.status);

      const currentMonth = new Date().toISOString().substring(0, 7);
      
      // RULE-01: Correctly join with latest reading
      const joinedData = filtered.map(m => ({
        ...m,
        latestReadingIndex: MOCK_LATEST_READINGS[m.id]?.currentIndex || 0,
        latestMonthYear: MOCK_LATEST_READINGS[m.id]?.monthYear || '--',
        hasReadingThisMonth: MOCK_LATEST_READINGS[m.id]?.monthYear === currentMonth
      }));

      return { data: joinedData, total: joinedData.length };
    } catch (error) {
      return handleServiceError(error, 'Không thể tải danh sách đồng hồ');
    }
  },

  getLatestReading: async (meterId: string): Promise<LatestMeterReading> => {
    try {
      await new Promise(r => setTimeout(r, 400));
      return MOCK_LATEST_READINGS[meterId] || { meterId, currentIndex: 0, monthYear: '', readingDate: '', consumption: 0 };
    } catch (error) {
      return handleServiceError(error, 'Không thể tải chỉ số mới nhất');
    }
  },

  getReadings: async (params: { meterId: string; monthYear?: string } & BaseRequestParams) => {
    try {
      await new Promise(r => setTimeout(r, 600));
      const now = new Date();
      const mockArray: MeterReading[] = [];
      const latest = MOCK_LATEST_READINGS[params.meterId]?.currentIndex || 1000;
      
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
            recordedByName: 'Admin',
            createdAt: new Date().toISOString()
         });
      }
      
      return { data: mockArray, total: mockArray.length };
    } catch (error) {
      return handleServiceError(error, 'Không thể tải lịch sử chỉ số');
    }
  },

  submitReading: async (body: any) => {
    try {
      await new Promise(r => setTimeout(r, 1000));
      return { id: 'NEW-R', ...body, consumption: 0, recordedById: 'U1', createdAt: new Date().toISOString() };
    } catch (error) {
      return handleServiceError(error, 'Không thể gửi chỉ số mới');
    }
  }
};

export default meterService;
