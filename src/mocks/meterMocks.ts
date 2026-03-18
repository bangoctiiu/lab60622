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
  'M1': {
    meterId: 'M1',
    currentIndex: 1250,
    monthYear: '2024-03',
    readingDate: '2024-03-25',
    consumption: 150
  },
  'M2': {
    meterId: 'M2',
    currentIndex: 45,
    monthYear: '2024-03',
    readingDate: '2024-03-25',
    consumption: 5
  }
};
