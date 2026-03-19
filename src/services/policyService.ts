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
import { MOCK_ELECTRICITY_POLICIES, MOCK_WATER_POLICIES } from "@/mocks/policyMocks";

export const getCurrentElectricityPolicy = async (): Promise<ElectricityPolicy> => {
  await new Promise(r => setTimeout(r, 400));
  return MOCK_ELECTRICITY_POLICIES[0] as any;
};

export const getElectricityPolicyHistory = async (): Promise<ElectricityPolicy[]> => {
  return MOCK_ELECTRICITY_POLICIES as any[];
};

export const createElectricityPolicy = async (dto: CreateElectricityPolicyDto): Promise<ElectricityPolicy> => {
  const response = await apiClient.post<ElectricityPolicy>("/api/electricity-policies", dto);
  return response.data;
};

export const getCurrentWaterPolicy = async (): Promise<WaterPolicy> => {
  return MOCK_WATER_POLICIES[0] as any;
};

export const getWaterPolicyHistory = async (): Promise<WaterPolicy[]> => {
  return MOCK_WATER_POLICIES as any[];
};

export const createWaterPolicy = async (dto: CreateWaterPolicyDto): Promise<WaterPolicy> => {
  const response = await apiClient.post<WaterPolicy>("/api/water-policies", dto);
  return response.data;
};

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
  }

  const vat = (subtotal * vatRate) / 100;
  return {
    tierBreakdowns,
    subtotal,
    vat,
    total: subtotal + vat,
  };
};
