import { BuildingSummary, BuildingDetail, Building } from '@/models/Building';
import { OwnerSummary, OwnerDetail, Owner } from '@/models/Owner';
import { MOCK_BUILDING_SUMMARIES, MOCK_BUILDINGS } from '@/mocks/buildingMocks';
import { MOCK_OWNERS } from '@/mocks/ownerMocks';
import { MOCK_PROVINCES, MOCK_DISTRICTS, MOCK_WARDS } from '@/mocks/systemMocks';

export const buildingService = {
  getBuildings: async (filters?: { search?: string }): Promise<BuildingSummary[]> => {
    await new Promise(r => setTimeout(r, 800));
    if (!filters?.search) return MOCK_BUILDING_SUMMARIES;
    const s = filters.search.toLowerCase();
    return MOCK_BUILDING_SUMMARIES.filter((b: any) => 
      b.buildingName.toLowerCase().includes(s) || 
      b.address.toLowerCase().includes(s) ||
      b.buildingCode.toLowerCase().includes(s)
    );
  },

  getBuildingDetail: async (id: string): Promise<BuildingDetail> => {
    await new Promise(r => setTimeout(r, 500));
    const base = MOCK_BUILDINGS.find((b: any) => b.id === id) || MOCK_BUILDINGS[0];
    
    // Ensure all fields from mock are present
    return {
      ...base,
      // Fallback description if missing in mock
      description: base.description || 'Căn hộ chung cư cao cấp với phong cách hiện đại, đầy đủ các thiện ích xung quanh.',
    } as BuildingDetail;
  },

  getOwners: async (search?: string): Promise<OwnerSummary[]> => {
    await new Promise(r => setTimeout(r, 600));
    const ownersBase = MOCK_OWNERS.map(o => ({
      id: o.id,
      fullName: o.fullName,
      avatarUrl: o.avatarUrl,
      phone: o.phone,
      email: o.email,
      cccd: o.cccd,
      taxCode: o.taxCode,
      address: o.address,
      buildingsOwned: o.buildingsOwned.map(b => ({ buildingId: b.buildingId, buildingName: b.buildingName })),
      totalBuildings: o.totalBuildings,
      isDeleted: o.isDeleted
    }));

    if (!search) return ownersBase;
    const s = search.toLowerCase();
    return ownersBase.filter(o => 
      o.fullName.toLowerCase().includes(s) || 
      o.email.toLowerCase().includes(s) ||
      o.phone.includes(s)
    );
  },

  getOwnerDetail: async (id: string): Promise<OwnerDetail> => {
    await new Promise(r => setTimeout(r, 400));
    const owner = MOCK_OWNERS.find(o => o.id === id) || MOCK_OWNERS[0];
    return owner;
  },

  getProvinces: async () => {
    return MOCK_PROVINCES;
  },

  getDistricts: async (provinceId: string) => {
    return MOCK_DISTRICTS[provinceId] || [];
  },

  getWards: async (districtId: string) => {
    return MOCK_WARDS[districtId] || [];
  },

  checkBuildingCodeUnique: async (code: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 400));
    return !MOCK_BUILDINGS.some(b => b.buildingCode.toLowerCase() === code.toLowerCase());
  },

  createBuilding: async (data: any): Promise<Building> => {
    await new Promise(r => setTimeout(r, 800));
    const newBuilding = {
      ...data,
      id: `B${MOCK_BUILDINGS.length + 1}`,
      isDeleted: false
    };
    return newBuilding;
  },

  updateBuilding: async (id: string, data: any): Promise<Building> => {
    await new Promise(r => setTimeout(r, 800));
    return { ...data, id };
  },

  createOwner: async (data: any): Promise<Owner> => {
    await new Promise(r => setTimeout(r, 800));
    return {
      ...data,
      id: `O${Date.now()}`,
      isDeleted: false
    };
  },

  updateOwner: async (id: string, data: any): Promise<Owner> => {
    await new Promise(r => setTimeout(r, 800));
    return { ...data, id };
  }
};
