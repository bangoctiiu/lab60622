import apiClient from "@/services/apiClient";
import {
  Service,
  ServiceFilter,
  ServicePriceHistory,
  CreateServiceDto,
  UpdateServiceDto,
  UpdateServicePriceDto,
} from "@/types/service";
import { MOCK_SERVICES } from "@/mocks/serviceMocks";

export const getServices = async (
  filter: ServiceFilter
): Promise<{ data: Service[]; total: number }> => {
  await new Promise(r => setTimeout(r, 600));
  let result = [...MOCK_SERVICES] as Service[];
  
  if (filter.search) {
    const s = filter.search.toLowerCase();
    result = result.filter(svc => svc.serviceName.toLowerCase().includes(s));
  }
  
  return { data: result, total: result.length };
};

export const getServiceById = async (id: number): Promise<Service | undefined> => {
  return (MOCK_SERVICES as Service[]).find(s => s.serviceId === id);
};

export const getPriceHistory = async (
  serviceId: number
): Promise<ServicePriceHistory[]> => {
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
    }
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
  await apiClient.patch(`/services/${id}`, { isActive });
};

export const updateServicePrice = async (
  serviceId: number,
  dto: UpdateServicePriceDto
): Promise<void> => {
  await apiClient.post(`/services/${serviceId}/price-history`, dto);
};

export const checkServiceCodeUnique = async (code: string): Promise<boolean> => true;
export const checkServiceNameUnique = async (name: string): Promise<boolean> => true;
export const generateServiceCode = (): string => `SVC-${Date.now().toString(36).toUpperCase().slice(-4)}`;
