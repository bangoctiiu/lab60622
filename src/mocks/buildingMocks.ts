import { BuildingDetail } from '@/models/Building';

export const MOCK_BUILDINGS: any[] = [
  {
    id: 'B1',
    buildingName: 'Keangnam Landmark',
    buildingCode: 'KN-LMD',
    address: 'Phạm Hùng, Nam Từ Liêm, Hà Nội',
    type: 'Apartment',
    yearBuilt: 2011,
    totalFloors: 72,
    managementPhone: '02431234567',
    managementEmail: 'management@keangnam.vnn',
    heroImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    provinceId: '1',
    districtId: '1',
    wardId: '1',
    amenities: ['Gym', 'Pool', 'Parking', 'Security 24/7'],
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', isMain: true, sortOrder: 1 }
    ],
    ownership: [
      {
        id: 'own1',
        ownerId: 'O1',
        ownerName: 'Công ty Bất động sản A',
        ownershipPercent: 100,
        ownershipType: 'FullOwner',
        startDate: '2011-01-01'
      }
    ],
    isDeleted: false
  },
  {
    id: 'B2',
    buildingName: 'Lotte Center',
    buildingCode: 'LT-CTR',
    address: 'Liễu Giai, Ba Đình, Hà Nội',
    type: 'Mixed',
    yearBuilt: 2014,
    totalFloors: 65,
    managementPhone: '02439876543',
    managementEmail: 'info@lottecenter.vn',
    heroImageUrl: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&q=80&w=1000',
    provinceId: '1',
    districtId: '2',
    wardId: '10',
    amenities: ['Mall', 'Gym', 'Security'],
    images: [],
    ownership: [],
    isDeleted: false
  }
];

export const MOCK_BUILDING_SUMMARIES = MOCK_BUILDINGS.map(b => ({
  ...b,
  totalRooms: 100,
  occupiedRooms: 80,
  occupancyRate: 80
}));
