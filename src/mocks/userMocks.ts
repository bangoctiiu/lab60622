import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission, RolePermission } from '../models/Permission';

export const mockRoles: Role[] = [
  { id: 'admin', name: 'Admin', description: 'Full system access', isSystem: true },
  { id: 'staff', name: 'Staff', description: 'Building management access', isSystem: true },
  { id: 'viewer', name: 'Viewer', description: 'Read-only access to reports', isSystem: true },
  { id: 'tenant', name: 'Tenant', description: 'Portal access for residents', isSystem: true },
];

export const mockPermissions: Permission[] = [
  { group: 'Contracts', key: 'contract.view', name: 'Xem hợp đồng' },
  { group: 'Contracts', key: 'contract.create', name: 'Tạo hợp đồng' },
  { group: 'Contracts', key: 'contract.delete', name: 'Xóa hợp đồng' },
  { group: 'Invoices', key: 'invoice.view', name: 'Xem hóa đơn' },
  { group: 'Invoices', key: 'invoice.create', name: 'Tạo hóa đơn' },
  { group: 'Payments', key: 'payment.approve', name: 'Duyệt thanh toán' },
  { group: 'System', key: 'system.config', name: 'Cấu hình hệ thống' },
  { group: 'Users', key: 'pii.view', name: 'Xem thông tin cá nhân (CCCD/Phone)' },
];

export const mockRolePermissions: RolePermission[] = [
  {
    roleId: 'admin',
    permissions: mockPermissions.map(p => p.key),
  },
  {
    roleId: 'staff',
    permissions: ['contract.view', 'contract.create', 'invoice.view', 'invoice.create', 'pii.view'],
  },
  {
    roleId: 'viewer',
    permissions: ['contract.view', 'invoice.view'],
  },
];

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    fullName: 'System Admin',
    email: 'admin@smartstay.com',
    role: 'Admin',
    isActive: true,
    isTwoFactorEnabled: true,
    lastLoginAt: '2024-03-18T10:00:00Z',
    buildingsAccess: [], // All
  },
  {
    id: 2,
    username: 'staff_hanoi',
    fullName: 'Nguyen Van A',
    email: 'staff1@smartstay.com',
    phone: '0987654321',
    role: 'Staff',
    isActive: true,
    isTwoFactorEnabled: false,
    lastLoginAt: '2024-03-18T09:30:00Z',
    buildingId: 1,
    buildingsAccess: [1, 2],
  },
  {
    id: 3,
    username: 'viewer_user',
    fullName: 'Tran Thi B',
    email: 'viewer@smartstay.com',
    role: 'Viewer',
    isActive: true,
    isTwoFactorEnabled: false,
    lastLoginAt: '2024-03-17T15:00:00Z',
    buildingsAccess: [],
  },
];
