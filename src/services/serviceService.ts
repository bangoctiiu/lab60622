import apiClient from "@/services/apiClient";
import {
  Service,
  ServiceFilter,
  ServicePriceHistory,
  CreateServiceDto,
  UpdateServiceDto,
  UpdateServicePriceDto,
} from "@/types/service";

export const getServices = async (
  filter: ServiceFilter
): Promise<{ data: Service[]; total: number }> => {
  // Mock data — thay bằng API khi backend sẵn sàng:
  // return apiClient.get('/services', { params: filter })
  const mock: Service[] = [
    {
      serviceId: 1,
      serviceName: "Phí quản lý",
      serviceCode: "SVC-MGMT",
      serviceType: "Management",
      unit: "người/tháng",
      billingMethod: "PerPerson",
      isActive: true,
      currentPrice: 200000,
      currentPriceEffectiveFrom: "2025-01-01",
    },
    {
      serviceId: 2,
      serviceName: "Điện",
      serviceCode: "SVC-ELEC",
      serviceType: "Utility",
      unit: "KW",
      billingMethod: "Metered",
      isActive: true,
      currentPrice: 3500,
      currentPriceEffectiveFrom: "2025-01-01",
    },
    {
      serviceId: 3,
      serviceName: "Nước",
      serviceCode: "SVC-WATER",
      serviceType: "Utility",
      unit: "m3",
      billingMethod: "Metered",
      isActive: true,
      currentPrice: 15000,
      currentPriceEffectiveFrom: "2025-01-01",
    },
    {
      serviceId: 4,
      serviceName: "Gửi xe máy",
      serviceCode: "SVC-PARK",
      serviceType: "Optional",
      unit: "tháng",
      billingMethod: "Fixed",
      isActive: true,
      currentPrice: 100000,
      currentPriceEffectiveFrom: "2025-01-01",
    },
    {
      serviceId: 5,
      serviceName: "Vệ sinh",
      serviceCode: "SVC-CLEAN",
      serviceType: "Amenity",
      unit: "lần",
      billingMethod: "Usage",
      isActive: false,
      currentPrice: 50000,
      currentPriceEffectiveFrom: "2024-06-01",
    },
  ];
  return { data: mock, total: mock.length };
};

export const getServiceById = async (id: number): Promise<Service> => {
  // return apiClient.get(`/services/${id}`)
  throw new Error(`Mock: getServiceById for ID ${id} not implemented`);
};

export const getPriceHistory = async (
  serviceId: number
): Promise<ServicePriceHistory[]> => {
  // return apiClient.get(`/services/${serviceId}/price-history`)
  return [
    {
      priceHistoryId: 1,
      serviceId,
      price: 200000,
      effectiveFrom: "2025-01-01",
      effectiveTo: null,
      setByName: "Admin",
      reason: "Cập nhật đầu năm 2025",
      isActive: true,
    },
    {
      priceHistoryId: 2,
      serviceId,
      price: 180000,
      effectiveFrom: "2024-01-01",
      effectiveTo: "2024-12-31",
      setByName: "Admin",
      reason: "Cập nhật đầu năm 2024",
      isActive: false,
    },
    {
      priceHistoryId: 3,
      serviceId,
      price: 150000,
      effectiveFrom: "2023-01-01",
      effectiveTo: "2023-12-31",
      setByName: "Admin",
      reason: "Giá ban đầu",
      isActive: false,
    },
  ];
};

export const createService = async (dto: CreateServiceDto): Promise<Service> => {
  return apiClient.post("/services", dto);
};

export const updateService = async (
  id: number,
  dto: UpdateServiceDto
): Promise<Service> => {
  return apiClient.patch(`/services/${id}`, dto);
};

export const toggleServiceActive = async (
  id: number,
  isActive: boolean
): Promise<void> => {
  return apiClient.patch(`/services/${id}`, { isActive });
};

// RULE-08: Chỉ INSERT, không UPDATE giá cũ
export const updateServicePrice = async (
  serviceId: number,
  dto: UpdateServicePriceDto
): Promise<void> => {
  // Backend sẽ: UPDATE current price SET EffectiveTo = effectiveFrom - 1 day
  //             INSERT new price record
  return apiClient.post(`/services/${serviceId}/price-history`, dto);
};

export const checkServiceCodeUnique = async (
  code: string,
  excludeId?: number
): Promise<boolean> => {
  // return apiClient.get(`/services/check-code?code=${code}&excludeId=${excludeId}`)
  // Mock: luôn unique
  console.log(`Checking uniqueness for code: ${code}, excluding ID: ${excludeId}`);
  return true;
};

export const checkServiceNameUnique = async (
  name: string,
  excludeId?: number
): Promise<boolean> => {
  // return apiClient.get(`/services/check-name?name=${name}&excludeId=${excludeId}`)
  // Mock: luôn unique
  console.log(`Checking uniqueness for name: ${name}, excluding ID: ${excludeId}`);
  return true;
};

// Auto-generate ServiceCode
export const generateServiceCode = (): string => {
  return `SVC-${Date.now().toString(36).toUpperCase().slice(-4)}`;
};
