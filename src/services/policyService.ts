import apiClient from "./apiClient";
import {
  ElectricityPolicy,
  ElectricityTier,
  WaterPolicy,
  WaterTier,
  CreateElectricityPolicyDto,
  CreateWaterPolicyDto,
  TierPreviewResult,
} from "../types/policy";

// --- MOCK DATA ---
const MOCK_ELECTRICITY_TIERS: ElectricityTier[] = [
  { fromKwh: 0, toKwh: 50, unitPrice: 1806, unitPriceWithVat: 1986.6 },
  { fromKwh: 51, toKwh: 100, unitPrice: 1866, unitPriceWithVat: 2052.6 },
  { fromKwh: 101, toKwh: 200, unitPrice: 2167, unitPriceWithVat: 2383.7 },
  { fromKwh: 201, toKwh: 300, unitPrice: 2729, unitPriceWithVat: 3001.9 },
  { fromKwh: 301, toKwh: 400, unitPrice: 3050, unitPriceWithVat: 3355 },
  { fromKwh: 401, toKwh: null, unitPrice: 3151, unitPriceWithVat: 3466.1 },
];

const MOCK_WATER_TIERS: WaterTier[] = [
  { fromM3: 0, toM3: 10, unitPrice: 5973, unitPriceWithVat: 6570.3 },
  { fromM3: 11, toM3: 20, unitPrice: 7052, unitPriceWithVat: 7757.2 },
  { fromM3: 21, toM3: 30, unitPrice: 8669, unitPriceWithVat: 9535.9 },
  { fromM3: 31, toM3: null, unitPrice: 15929, unitPriceWithVat: 17521.9 },
];

const MOCK_ELECTRICITY_HISTORY: ElectricityPolicy[] = [
  {
    policyId: 3,
    policyName: "Giá điện sinh hoạt 2025",
    effectiveFrom: "2025-01-01",
    effectiveTo: null,
    vatRate: 10,
    isActive: true,
    tiers: MOCK_ELECTRICITY_TIERS,
  },
  {
    policyId: 2,
    policyName: "Giá điện sinh hoạt 2024",
    effectiveFrom: "2024-01-01",
    effectiveTo: "2024-12-31",
    vatRate: 10,
    isActive: false,
    tiers: MOCK_ELECTRICITY_TIERS,
  },
  {
    policyId: 1,
    policyName: "Giá điện sinh hoạt 2023",
    effectiveFrom: "2023-01-01",
    effectiveTo: "2023-12-31",
    vatRate: 10,
    isActive: false,
    tiers: MOCK_ELECTRICITY_TIERS,
  },
];

const MOCK_WATER_HISTORY: WaterPolicy[] = [
  {
    policyId: 2,
    policyName: "Giá nước sinh hoạt 2025",
    effectiveFrom: "2025-01-01",
    effectiveTo: null,
    vatRate: 10,
    isActive: true,
    zoneName: "Khu vực 1",
    environmentFee: 10,
    maintenanceFee: 5,
    tiers: MOCK_WATER_TIERS,
  },
  {
    policyId: 1,
    policyName: "Giá nước sinh hoạt 2024",
    effectiveFrom: "2024-01-01",
    effectiveTo: "2024-12-31",
    vatRate: 10,
    isActive: false,
    zoneName: "Khu vực 1",
    environmentFee: 10,
    maintenanceFee: 5,
    tiers: MOCK_WATER_TIERS,
  },
];

// --- ELECTRICITY SERVICES ---

export const getCurrentElectricityPolicy = async (): Promise<ElectricityPolicy> => {
  try {
    const response = await apiClient.get<ElectricityPolicy[]>("/api/electricity-policies?active=true");
    return response.data[0] || MOCK_ELECTRICITY_HISTORY[0];
  } catch (error) {
    return MOCK_ELECTRICITY_HISTORY[0];
  }
};

export const getElectricityPolicyHistory = async (): Promise<ElectricityPolicy[]> => {
  try {
    const response = await apiClient.get<ElectricityPolicy[]>("/api/electricity-policies");
    return response.data.length > 0 ? response.data : MOCK_ELECTRICITY_HISTORY;
  } catch (error) {
    return MOCK_ELECTRICITY_HISTORY;
  }
};

export const createElectricityPolicy = async (dto: CreateElectricityPolicyDto): Promise<ElectricityPolicy> => {
  const response = await apiClient.post<ElectricityPolicy>("/api/electricity-policies", dto);
  return response.data;
};

// --- WATER SERVICES ---

export const getCurrentWaterPolicy = async (): Promise<WaterPolicy> => {
  try {
    const response = await apiClient.get<WaterPolicy[]>("/api/water-policies?active=true");
    return response.data[0] || MOCK_WATER_HISTORY[0];
  } catch (error) {
    return MOCK_WATER_HISTORY[0];
  }
};

export const getWaterPolicyHistory = async (): Promise<WaterPolicy[]> => {
  try {
    const response = await apiClient.get<WaterPolicy[]>("/api/water-policies");
    return response.data.length > 0 ? response.data : MOCK_WATER_HISTORY;
  } catch (error) {
    return MOCK_WATER_HISTORY;
  }
};

export const createWaterPolicy = async (dto: CreateWaterPolicyDto): Promise<WaterPolicy> => {
  const response = await apiClient.post<WaterPolicy>("/api/water-policies", dto);
  return response.data;
};

// --- PREVIEW CALCULATION ---

export const previewTierCalculation = (
  usage: number,
  tiers: ElectricityTier[] | WaterTier[],
  vatRate: number
): TierPreviewResult => {
  const tierBreakdowns: TierPreviewResult["tierBreakdowns"] = [];
  let remainingUsage = usage;
  let subtotal = 0;

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    const from = "fromKwh" in tier ? tier.fromKwh : (tier as WaterTier).fromM3;
    const to = "toKwh" in tier ? tier.toKwh : (tier as WaterTier).toM3;
    
    // Tính số đơn vị (kWh/m3) trong bậc này
    let tierUsage = 0;
    if (remainingUsage > 0) {
      if (to === null) {
        tierUsage = remainingUsage;
      } else {
        const tierCapacity = to - from + 1;
        tierUsage = Math.min(remainingUsage, tierCapacity);
      }
    }

    const amount = tierUsage * tier.unitPrice;
    subtotal += amount;
    remainingUsage -= tierUsage;

    tierBreakdowns.push({
      tier: i + 1,
      from,
      to,
      usage: tierUsage,
      unitPrice: tier.unitPrice,
      amount,
    });

    if (remainingUsage <= 0 && i < tiers.length - 1) {
      // Tiếp tục loop để hiển thị các bậc còn lại với usage = 0 cho đầy đủ bảng preview
    }
  }

  const vat = (subtotal * vatRate) / 100;
  const total = subtotal + vat;

  return {
    tierBreakdowns,
    subtotal,
    vat,
    total,
  };
};
