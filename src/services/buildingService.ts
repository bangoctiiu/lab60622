import { BuildingSummary, BuildingDetail, Building } from '@/models/Building';
import { OwnerSummary } from '@/models/Owner';

const MOCK_BUILDINGS: BuildingSummary[] = [
  {
    id: 'B1',
    buildingCode: 'KN-LMD',
    buildingName: 'Keangnam Landmark',
    type: 'Apartment',
    address: 'Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội',
    provinceId: '1',
    districtId: '101',
    wardId: '10101',
    yearBuilt: 2011,
    totalFloors: 72,
    managementPhone: '024 3333 3333',
    managementEmail: 'management@keangnam.com',
    latitude: 21.0173,
    longitude: 105.784,
    heroImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    totalRooms: 1500,
    occupiedRooms: 1350,
    occupancyRate: 90,
    isDeleted: false
  },
  {
    id: 'B2',
    buildingCode: 'LT-CTR',
    buildingName: 'Lotte Center',
    type: 'Mixed',
    address: 'Liễu Giai, Ngọc Khánh, Ba Đình, Hà Nội',
    provinceId: '1',
    districtId: '102',
    wardId: '10201',
    yearBuilt: 2014,
    totalFloors: 65,
    managementPhone: '024 4444 4444',
    managementEmail: 'contact@lottehanoi.com',
    latitude: 21.034,
    longitude: 105.812,
    heroImageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    totalRooms: 1200,
    occupiedRooms: 960,
    occupancyRate: 80,
    isDeleted: false
  },
  {
    id: 'B3',
    buildingCode: 'VN-PAR',
    buildingName: 'Vincom Park',
    type: 'Shophouse',
    address: 'Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh',
    provinceId: '79',
    districtId: '7901',
    wardId: '790101',
    yearBuilt: 2018,
    totalFloors: 45,
    managementPhone: '028 5555 5555',
    managementEmail: 'vincom@vinhomes.vn',
    latitude: 10.778,
    longitude: 106.702,
    heroImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    totalRooms: 450,
    occupiedRooms: 315,
    occupancyRate: 70,
    isDeleted: false
  }
];

const MOCK_OWNERS: OwnerSummary[] = [
  {
    id: 'O1',
    fullName: 'Nguyễn Tiến Dũng',
    avatarUrl: 'https://i.pravatar.cc/150?u=O1',
    phone: '0987654321',
    email: 'dung.nt@gmail.com',
    cccd: '001085001234',
    taxCode: '852369741',
    address: 'Hà Nội, Việt Nam',
    buildingsOwned: [
      { buildingId: 'B1', buildingName: 'Keangnam Landmark' },
      { buildingId: 'B2', buildingName: 'Lotte Center' }
    ],
    totalBuildings: 2,
    isDeleted: false
  },
  {
    id: 'O2',
    fullName: 'Trần Thị Mai',
    avatarUrl: 'https://i.pravatar.cc/150?u=O2',
    phone: '0912345678',
    email: 'mai.tt@fpt.com',
    cccd: '001290112233',
    taxCode: '963258741',
    address: 'Đà Nẵng, Việt Nam',
    buildingsOwned: [
      { buildingId: 'B1', buildingName: 'Keangnam Landmark' }
    ],
    totalBuildings: 1,
    isDeleted: false
  }
];

export const buildingService = {
  getBuildings: async (filters?: { search?: string }): Promise<BuildingSummary[]> => {
    await new Promise(r => setTimeout(r, 800));
    if (!filters?.search) return MOCK_BUILDINGS;
    const s = filters.search.toLowerCase();
    return MOCK_BUILDINGS.filter(b => 
      b.buildingName.toLowerCase().includes(s) || 
      b.address.toLowerCase().includes(s) ||
      b.buildingCode.toLowerCase().includes(s)
    );
  },

  getBuildingDetail: async (id: string): Promise<BuildingDetail> => {
    await new Promise(r => setTimeout(r, 500));
    const base = MOCK_BUILDINGS.find(b => b.id === id) || MOCK_BUILDINGS[0];
    return {
      ...base,
      amenities: ['Gym', 'Pool', 'Parking', 'Security24h', 'Elevator', 'Lobby', 'Garden', 'Supermarket'],
      description: 'Căn hộ chung cư cao cấp với phong cách hiện đại, đầy đủ các tiện ích xung quanh.',
      images: [
        { id: 'IMG1', url: base.heroImageUrl!, isMain: true, sortOrder: 0 },
        { id: 'IMG2', url: 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800', isMain: false, sortOrder: 1 },
        { id: 'IMG3', url: 'https://images.unsplash.com/photo-1582408921715-18e7806365c1?w=800', isMain: false, sortOrder: 2 },
      ],
      ownership: [
        { 
          id: 'OWN1', ownerId: 'O1', ownerName: 'Nguyễn Tiến Dũng', 
          ownerAvatar: 'https://i.pravatar.cc/150?u=O1', ownershipPercent: 60, 
          ownershipType: 'Investor', startDate: '2020-01-01' 
        },
        { 
          id: 'OWN2', ownerId: 'O2', ownerName: 'Trần Thị Mai', 
          ownerAvatar: 'https://i.pravatar.cc/150?u=O2', ownershipPercent: 40, 
          ownershipType: 'CoOwner', startDate: '2021-05-15' 
        }
      ]
    };
  },

  getOwners: async (search?: string): Promise<OwnerSummary[]> => {
    await new Promise(r => setTimeout(r, 600));
    if (!search) return MOCK_OWNERS;
    const s = search.toLowerCase();
    return MOCK_OWNERS.filter(o => 
      o.fullName.toLowerCase().includes(s) || 
      o.email.toLowerCase().includes(s) ||
      o.phone.includes(s)
    );
  },

  getProvinces: async () => {
    return [{ id: '1', name: 'Hà Nội' }, { id: '79', name: 'TP. Hồ Chí Minh' }];
  },

  getDistricts: async (provinceId: string) => {
    if (provinceId === '1') return [{ id: '101', name: 'Nam Từ Liêm' }, { id: '102', name: 'Ba Đình' }];
    return [{ id: '7901', name: 'Quận 1' }];
  },

  getWards: async (districtId: string) => {
    if (districtId === '101') return [{ id: '10101', name: 'Mễ Trì' }];
    if (districtId === '102') return [{ id: '10201', name: 'Ngọc Khánh' }];
    return [{ id: '790101', name: 'Bến Nghé' }];
  }
};
