import { Meter, LatestMeterReading } from '@/models/Meter';

export const MOCK_METERS: Meter[] = [
  {
    id: 'M1',
    meterCode: 'E-A101',
    meterType: 'Electricity',
    buildingId: 'B1',
    buildingName: 'Keangnam Landmark',
    roomId: 'R1',
    roomCode: 'A-101',
    latestReadingIndex: 1250,
    latestMonthYear: '2024-03',
    meterStatus: 'Active'
  },
  {
    id: 'M2',
    meterCode: 'W-A101',
    meterType: 'Water',
    buildingId: 'B1',
    buildingName: 'Keangnam Landmark',
    roomId: 'R1',
    roomCode: 'A-101',
    latestReadingIndex: 45,
    latestMonthYear: '2024-03',
    meterStatus: 'Active'
  }
];

export const MOCK_LATEST_READINGS: Record<string, LatestMeterReading> = {
  'M1': { meterId: 'M1', currentIndex: 12450, monthYear: '2026-02', readingDate: '2026-02-25', consumption: 450 },
  'M2': { meterId: 'M2', currentIndex: 342, monthYear: '2026-02', readingDate: '2026-02-25', consumption: 12 },
  'M3': { meterId: 'M3', currentIndex: 8900, monthYear: '2026-02', readingDate: '2026-02-25', consumption: 380 },
};
