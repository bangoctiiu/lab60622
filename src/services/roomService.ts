import { 
  Room, RoomDetail, RoomStatus, RoomType, 
  HandoverChecklist, RoomStatusHistory 
} from '@/models/Room';
import { Asset } from '@/models/Asset';
import { format, subMonths } from 'date-fns';

const MOCK_ROOMS: Room[] = [
  {
    id: 'R001',
    roomCode: 'A-101',
    buildingId: 1,
    buildingName: 'Keangnam Landmark',
    floorNumber: 1,
    roomType: '2BR',
    areaSqm: 75.5,
    baseRentPrice: 15000000,
    status: 'Occupied',
    tenantNames: ['Nguyễn Văn A', 'Trần Thị B'],
    contractId: 'C001',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
  },
  {
    id: 'R002',
    roomCode: 'B-205',
    buildingId: 1,
    buildingName: 'Keangnam Landmark',
    floorNumber: 2,
    roomType: 'Studio',
    areaSqm: 35.0,
    baseRentPrice: 8500000,
    status: 'Vacant',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'
  },
  {
    id: 'R003',
    roomCode: 'C-309',
    buildingId: 1,
    buildingName: 'Keangnam Landmark',
    floorNumber: 3,
    roomType: '3BR',
    areaSqm: 110.0,
    baseRentPrice: 22000000,
    status: 'Maintenance',
    thumbnailUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop'
  },
  {
    id: 'R004',
    roomCode: 'D-501',
    buildingId: 2,
    buildingName: 'Lotte Center',
    floorNumber: 5,
    roomType: 'Penthouse',
    areaSqm: 250.0,
    baseRentPrice: 55000000,
    status: 'Reserved',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'
  }
];

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
    const base = MOCK_ROOMS.find(r => r.id === id) || MOCK_ROOMS[0];
    
    return {
      ...base,
      description: 'Căn hộ cao cấp đầy đủ tiện nghi, view thành phố tuyệt đẹp.',
      maxOccupancy: 4,
      furnishing: 'FullyFurnished',
      directionFacing: 'SE',
      hasBalcony: true,
      conditionScore: 9,
      lastMaintenanceDate: '2025-01-15',
      images: [
        { id: 'IMG1', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isMain: true, sortOrder: 0 },
        { id: 'IMG2', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', isMain: false, sortOrder: 1 },
        { id: 'IMG3', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', isMain: false, sortOrder: 2 },
      ],
      amenities: ['WiFi', 'AirConditioner', 'HotWater', 'Fridge', 'Washer', 'Balcony', 'Furniture'],
      meters: [
        { 
          id: 'M1', 
          meterCode: 'E-LG72-001', 
          meterType: 'Electricity', 
          lastReading: 1250, 
          lastReadingDate: '2025-03-01',
          history: [
            { month: '09/2024', value: 950 },
            { month: '10/2024', value: 1020 },
            { month: '11/2024', value: 1080 },
            { month: '12/2024', value: 1150 },
            { month: '01/2025', value: 1210 },
            { month: '02/2025', value: 1250 },
          ]
        },
        { 
          id: 'M2', 
          meterCode: 'W-LG72-001', 
          meterType: 'Water', 
          lastReading: 450, 
          lastReadingDate: '2025-03-01',
          history: [
             { month: '09/2024', value: 380 },
             { month: '10/2024', value: 395 },
             { month: '11/2024', value: 410 },
             { month: '12/2024', value: 425 },
             { month: '01/2025', value: 440 },
             { month: '02/2025', value: 450 },
          ]
        }
      ],
      assets: [
        { id: 'A1', assetName: 'Điều hòa Daikin 12000 BTU', assetCode: 'AC-001', type: 'Appliance', condition: 'New', assignedAt: '2024-12-01' },
        { id: 'A2', assetName: 'Sofa da thật Ý', assetCode: 'SF-001', type: 'Furniture', condition: 'Good', assignedAt: '2024-12-05' },
        { id: 'A3', assetName: 'Tủ lạnh Samsung Inverter 400L', assetCode: 'RF-001', type: 'Appliance', condition: 'New', assignedAt: '2024-12-10' },
      ],
      // RULE-10: Backend auto-logs this.
      statusHistory: [
        { id: 'H1', fromStatus: 'Vacant', toStatus: 'Occupied', changedAt: '2024-12-20 09:00', changedBy: 'Admin', reason: 'Ký hợp đồng C001', contractId: 'C001' },
        { id: 'H2', fromStatus: 'Maintenance', toStatus: 'Vacant', changedAt: '2024-12-15 15:30', changedBy: 'Staff A', reason: 'Hoàn thành sơn sửa' },
        { id: 'H3', fromStatus: 'Vacant', toStatus: 'Maintenance', changedAt: '2024-12-10 08:00', changedBy: 'Admin', reason: 'Định kỳ bảo trì trang thiết bị' },
      ]
    };
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
