import { 
  Room, RoomDetail, RoomStatus, RoomType, 
  HandoverChecklist, RoomStatusHistory 
} from '@/models/Room';
import { Asset } from '@/models/Asset';
import { format, subMonths } from 'date-fns';
import { MOCK_ROOMS, getMockRoomDetail, MOCK_HANDOVER_CHECKLIST } from '@/mocks/roomMocks';
import { MOCK_ASSETS } from '@/mocks/assetMocks';
import useUIStore from '@/stores/uiStore';

export const roomService = {
  getRooms: async (filters?: any): Promise<Room[]> => {
    await new Promise(r => setTimeout(r, 800));
    let result = [...MOCK_ROOMS];
    
    // Prioritize filter buildingId, fallback to global store
    const targetBuildingId = filters?.buildingId ?? useUIStore.getState().activeBuildingId;
    
    if (targetBuildingId) {
      result = result.filter(r => r.buildingId === targetBuildingId.toString() || r.buildingId === targetBuildingId);
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

    if (filters?.minFloor !== undefined) result = result.filter(r => r.floorNumber >= filters.minFloor);
    if (filters?.maxFloor !== undefined) result = result.filter(r => r.floorNumber <= filters.maxFloor);
    if (filters?.minArea !== undefined) result = result.filter(r => r.areaSqm >= filters.minArea);
    if (filters?.minPrice !== undefined) result = result.filter(r => r.baseRentPrice >= filters.minPrice);
    if (filters?.maxPrice !== undefined) result = result.filter(r => r.baseRentPrice <= filters.maxPrice);
    if (filters?.hasMeter !== undefined) result = result.filter(r => r.hasMeter === filters.hasMeter);

    return result;
  },

  getRoomHandoverChecklist: async (roomId: string): Promise<HandoverChecklist[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_HANDOVER_CHECKLIST.map(h => ({ ...h, roomId }));
  },

  getRoomDetail: async (id: string): Promise<RoomDetail> => {
    await new Promise(r => setTimeout(r, 500));
    return getMockRoomDetail(id);
  },

  checkRoomCodeUnique: async (code: string, buildingId: number): Promise<boolean> => {
    return !MOCK_ROOMS.some(r => r.roomCode === code && r.buildingId === buildingId.toString());
  },

  createRoom: async (data: any): Promise<Room> => {
    return { ...MOCK_ROOMS[0], id: Math.random().toString(), ...data };
  },

  updateRoom: async (id: string, data: any): Promise<Room> => {
    return { ...MOCK_ROOMS[0], id, ...data };
  },

  getAssets: async (filters?: any): Promise<Asset[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_ASSETS;
  }
};
