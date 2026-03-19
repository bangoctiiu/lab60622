import { Asset, AssetType, AssetCondition } from '@/models/Asset';
import { MOCK_ASSETS } from '@/mocks/assetMocks';

export const assetService = {
  getAssets: async (params?: any): Promise<Asset[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filtered = [...MOCK_ASSETS];
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(a => a.assetName.toLowerCase().includes(s) || a.assetCode.toLowerCase().includes(s));
    }
    if (params?.type) {
      filtered = filtered.filter(a => a.type === params.type);
    }
    return filtered;
  },

  getAssetDetail: async (id: string | number): Promise<Asset | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const asset = MOCK_ASSETS.find(a => a.id.toString() === id.toString());
    return asset || null;
  }
};
