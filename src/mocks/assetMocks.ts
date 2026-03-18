import { Asset } from '@/models/Asset';

export const MOCK_ASSETS: Asset[] = [
  { id: 'A1', assetName: 'Điều hòa Daikin', assetCode: 'AC-001', type: 'Appliance', condition: 'New', roomId: 'R001', roomCode: 'A-101', purchaseDate: '2024-10-01', purchasePrice: 12000000, warrantyExpiry: '2026-10-01', images: [] },
  { id: 'A4', assetName: 'Máy giặt LG', assetCode: 'WM-001', type: 'Appliance', condition: 'Good', roomId: 'R002', roomCode: 'B-205', purchaseDate: '2024-11-15', purchasePrice: 8500000, warrantyExpiry: '2025-11-15', images: [] },
  { id: 'A5', assetName: 'Quạt trần Panasonic', assetCode: 'CF-001', type: 'Fixture', condition: 'Good', purchaseDate: '2024-05-20', purchasePrice: 2500000, warrantyExpiry: '2025-05-20', images: [] },
];
