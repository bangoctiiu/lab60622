import { Room, RoomDetail, HandoverChecklist } from '@/models/Room';

export const MOCK_HANDOVER_CHECKLIST: HandoverChecklist[] = [
  {
    id: 'HO1',
    roomId: 'R001',
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

export const MOCK_ROOMS: Room[] = [
  {
    id: 'R001',
    roomCode: 'A-101',
    buildingId: 'B1',
    buildingName: 'Keangnam Landmark',
    floorNumber: 1,
    roomType: 'Studio',
    areaSqm: 35,
    baseRentPrice: 5000000,
    status: 'Occupied',
    tenantNames: ['Nguyễn Văn A'],
    contractId: 'C1',
    hasMeter: true
  },
  {
    id: 'R005',
    roomCode: 'B-205',
    buildingId: 'B1',
    buildingName: 'Keangnam Landmark',
    floorNumber: 2,
    roomType: '1BR',
    areaSqm: 50,
    baseRentPrice: 7500000,
    status: 'Vacant',
    hasMeter: true
  }
];

export const generateMockRooms = (count: number): Room[] => {
  const rooms: Room[] = [];
  for (let i = 0; i < count; i++) {
    rooms.push({
      id: `R${i + 1}`,
      roomCode: `A-${100 + i + 1}`,
      buildingId: 'B1',
      buildingName: 'Keangnam Landmark',
      floorNumber: Math.floor(i / 10) + 1,
      roomType: 'Studio',
      areaSqm: 30,
      baseRentPrice: 4500000,
      status: i % 3 === 0 ? 'Occupied' : 'Vacant',
      tenantNames: i % 3 === 0 ? ['Cư dân ' + (i + 1)] : [],
      hasMeter: i % 2 === 0
    });
  }
  return rooms;
};

export const getMockRoomDetail = (id: string): RoomDetail => {
  const base = MOCK_ROOMS.find(r => r.id === id) || MOCK_ROOMS[0];
  return {
    ...base,
    description: 'Phòng Studio đầy đủ nội thất, view thành phố tuyệt đẹp.',
    maxOccupancy: 2,
    furnishing: 'FullyFurnished',
    directionFacing: 'E',
    hasBalcony: true,
    conditionScore: 9,
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', isMain: true, sortOrder: 1 }
    ],
    amenities: ['Wifi', 'Air Conditioner', 'Water Heater', 'Kitchen'],
    meters: [
      { id: 'M1', meterCode: 'E-A101', meterType: 'Electricity', currentIndex: 1250, lastReadingDate: '2024-03-01' },
      { id: 'M2', meterCode: 'W-A101', meterType: 'Water', currentIndex: 45, lastReadingDate: '2024-03-01' }
    ],
    assets: [
      { id: 'AS1', assetName: 'Điều hòa LG 12000BTU', assetCode: 'AC-001', type: 'Electronic', condition: 'Good', assignedAt: '2023-12-01' }
    ],
    statusHistory: [
      { id: 'H1', fromStatus: 'Vacant', toStatus: 'Occupied', changedAt: '2024-03-01', changedBy: 'Admin', reason: 'Tân gia', contractId: 'C1' }
    ]
  };
};
