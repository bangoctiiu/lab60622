import { 
  Room, RoomDetail, RoomStatus, RoomType, 
  HandoverChecklist, RoomStatusHistory 
} from '@/models/Room';
import { Asset } from '@/models/Asset';
import { format, subMonths } from 'date-fns';
import { MOCK_ROOMS, getMockRoomDetail } from '@/mocks/roomMocks';

export const roomService = {
  getRooms: async (filters?: any): Promise<Room[]> => {
    await new Promise(r => setTimeout(r, 800));
    let result = [...MOCK_ROOMS];
    
    if (filters?.buildingId) {
      result = result.filter(r => r.buildingId === filters.buildingId);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(r => 
        r.roomCode.toLowerCase().includes(search) || 
        r.buildingName?.toLowerCase().includes(search)
      );
    }

    if (filters?.status && filters.status.length > 0) {
      result = result.filter(r => filters.status.includes(r.status));
    }

    if (filters?.roomType && filters.roomType !== '') {
      result = result.filter(r => r.roomType === filters.roomType);
    }

    if (filters?.minFloor !== undefined) {
      result = result.filter(r => r.floorNumber >= filters.minFloor);
    }
    if (filters?.maxFloor !== undefined) {
      result = result.filter(r => r.floorNumber <= filters.maxFloor);
    }

    if (filters?.minArea !== undefined) {
      result = result.filter(r => r.areaSqm >= filters.minArea);
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter(r => r.baseRentPrice >= filters.minPrice);
    }
    if (filters?.maxPrice !== undefined) {
      result = result.filter(r => r.baseRentPrice <= filters.maxPrice);
    }

    if (filters?.hasMeter !== undefined) {
      result = result.filter(r => r.hasMeter === filters.hasMeter);
    }

    return result;
  },

  getRoomHandoverChecklist: async (roomId: string): Promise<HandoverChecklist[]> => {
    await new Promise(r => setTimeout(r, 600));
    return [
      {
        id: 'HO1',
        roomId,
        roomCode: 'A-101',
        handoverType: 'CheckIn',
        date: '2024-12-20',
        status: 'Completed',
        sections: [
          {
            id: 'S1',
            title: 'Hệ thống điện & nước',
            items: [
              { id: 'I1', name: 'Hệ thống đèn', status: 'OK' },
              { id: 'I2', name: 'Vòi sen', status: 'NotOK', note: 'Rò rỉ nhẹ', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400' },
            ]
          },
          {
            id: 'S2',
            title: 'Nội thất',
            items: [
              { id: 'I3', name: 'Giường ngủ', status: 'OK' },
            ]
          }
        ],
        assets: [
          { id: 'A1', assetName: 'Điều hòa Daikin', assetCode: 'AC-001', conditionBefore: 'New', conditionAfter: 'Good' }
        ],
        witnessSignatureUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        tenantSignatureUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
      }
    ];
  },

  getRoomDetail: async (id: string): Promise<RoomDetail> => {
    await new Promise(r => setTimeout(r, 500));
    return getMockRoomDetail(id);
  },

  checkRoomCodeUnique: async (code: string, buildingId: number): Promise<boolean> => {
    // Simulate API call to check uniqueness
    return !MOCK_ROOMS.some(r => r.roomCode === code && r.buildingId === buildingId);
  },

  createRoom: async (data: any): Promise<Room> => {
    console.log('Creating room:', data);
    return { ...MOCK_ROOMS[0], id: Math.random().toString(), ...data };
  },

  updateRoom: async (id: string, data: any): Promise<Room> => {
    console.log('Updating room:', id, data);
    return { ...MOCK_ROOMS[0], id, ...data };
  },

  getAssets: async (filters?: any): Promise<Asset[]> => {
    await new Promise(r => setTimeout(r, 600));
    return [
      { id: 'A1', assetName: 'Điều hòa Daikin', assetCode: 'AC-001', type: 'Appliance', condition: 'New', roomCode: 'A-101', purchaseDate: '2024-10-01', purchasePrice: 12000000, warrantyExpiry: '2026-10-01' },
      { id: 'A4', assetName: 'Máy giặt LG', assetCode: 'WM-001', type: 'Appliance', condition: 'Good', roomCode: 'B-205', purchaseDate: '2024-11-15', purchasePrice: 8500000, warrantyExpiry: '2025-11-15' },
      { id: 'A5', assetName: 'Quạt trần Panasonic', assetCode: 'CF-001', type: 'Fixture', condition: 'Good', purchaseDate: '2024-05-20', purchasePrice: 2500000, warrantyExpiry: '2025-05-20' },
    ];
  }
};
