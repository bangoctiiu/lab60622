import { Owner } from '@/models/Owner';

export interface OwnerDetail extends Owner {
  buildingsOwned: Array<{
    buildingId: string;
    buildingName: string;
    buildingCode: string;
    ownershipPercent: number;
    ownershipType: 'FullOwner' | 'CoOwner' | 'Investor';
    startDate: string;
  }>;
  totalBuildings: number;
  totalRooms: number;
}

export const MOCK_OWNERS: OwnerDetail[] = [
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
      { buildingId: 'B1', buildingName: 'Keangnam Landmark', buildingCode: 'KN-LMD', ownershipPercent: 60, ownershipType: 'Investor', startDate: '2020-01-01' },
      { buildingId: 'B2', buildingName: 'Lotte Center', buildingCode: 'LT-CTR', ownershipPercent: 100, ownershipType: 'FullOwner', startDate: '2018-06-15' }
    ],
    totalBuildings: 2,
    totalRooms: 2700,
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
      { buildingId: 'B1', buildingName: 'Keangnam Landmark', buildingCode: 'KN-LMD', ownershipPercent: 40, ownershipType: 'CoOwner', startDate: '2021-05-15' }
    ],
    totalBuildings: 1,
    totalRooms: 1500,
    isDeleted: false
  }
];
