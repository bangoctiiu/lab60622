import { ElectricityPolicy, WaterPolicy } from '../types/policy';

export const MOCK_ELECTRICITY_POLICIES: ElectricityPolicy[] = [
  {
    policyId: 1,
    policyName: 'Giá điện sinh hoạt 2024',
    effectiveFrom: '2024-01-01',
    effectiveTo: null,
    vatRate: 10,
    tiers: [
      { fromKwh: 0, toKwh: 50, unitPrice: 1806, unitPriceWithVat: 1987 },
      { fromKwh: 51, toKwh: 100, unitPrice: 1866, unitPriceWithVat: 2053 }
    ],
    isActive: true
  }
];

export const MOCK_WATER_POLICIES: WaterPolicy[] = [
  {
    policyId: 1,
    policyName: 'Giá nước sinh hoạt 2024',
    effectiveFrom: '2024-01-01',
    effectiveTo: null,
    vatRate: 5,
    zoneName: 'Khu vực 1',
    environmentFee: 10,
    maintenanceFee: 5,
    tiers: [
      { fromM3: 0, toM3: 10, unitPrice: 5973, unitPriceWithVat: 6272 },
      { fromM3: 11, toM3: 20, unitPrice: 7052, unitPriceWithVat: 7405 }
    ],
    isActive: true
  }
];
