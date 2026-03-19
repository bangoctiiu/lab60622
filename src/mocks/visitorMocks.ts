export interface Visitor {
  id: string;
  name: string;
  phone: string;
  visitDate: string;
  visitTime: string;
  status: 'Expected' | 'Arrived' | 'Departed';
  qrCode: string;
  roomCode: string;
  tenantId: string;
}

export const MOCK_VISITORS: Visitor[] = [
  {
    id: 'V1',
    name: 'Nguyễn Văn Hùng',
    phone: '0912345678',
    visitDate: '2026-03-20',
    visitTime: '10:00',
    status: 'Expected',
    qrCode: 'QR-VIS-001',
    roomCode: 'A-101',
    tenantId: 'T1'
  },
  {
    id: 'V2',
    name: 'Trần Thị Thu',
    phone: '0987654321',
    visitDate: '2026-03-19',
    visitTime: '14:30',
    status: 'Arrived',
    qrCode: 'QR-VIS-002',
    roomCode: 'A-101',
    tenantId: 'T1'
  },
  {
    id: 'V3',
    name: 'Phạm Minh Đức',
    phone: '0900112233',
    visitDate: '2026-03-15',
    visitTime: '09:00',
    status: 'Departed',
    qrCode: 'QR-VIS-003',
    roomCode: 'B-205',
    tenantId: 'T2'
  }
];
