import { User, UserRoleType, Permission, RolePermission, AuditLog } from '@/types';
import { Role } from '../models/Role';

export const mockRoles: Role[] = [
  { id: 'Admin', name: 'Admin', description: 'Full system access', isSystem: true },
  { id: 'Staff', name: 'Staff', description: 'Building management access', isSystem: true },
  { id: 'Viewer', name: 'Viewer', description: 'Read-only access to reports', isSystem: true },
  { id: 'Tenant', name: 'Tenant', description: 'Portal access for residents', isSystem: true },
];

export const mockPermissions: Permission[] = [
  { group: 'Contracts', key: 'contract.view', name: 'Xem hợp đồng' },
  { group: 'Contracts', key: 'contract.create', name: 'Tạo hợp đồng' },
  { group: 'Contracts', key: 'contract.delete', name: 'Xóa hợp đồng' },
  { group: 'Invoices', key: 'invoice.view', name: 'Xem hóa đơn' },
  { group: 'Invoices', key: 'invoice.create', name: 'Tạo hóa đơn' },
  { group: 'Payments', key: 'payment.approve', name: 'Duyệt thanh toán' },
  { group: 'Rooms', key: 'room.view', name: 'Xem phòng' },
  { group: 'Buildings', key: 'building.view', name: 'Xem tòa nhà' },
  { group: 'Tenants', key: 'tenant.view', name: 'Xem cư dân' },
  { group: 'Tickets', key: 'ticket.view', name: 'Xem sự cố' },
  { group: 'Meters', key: 'meter.view', name: 'Xem chỉ số điện nước' },
  { group: 'Reports', key: 'report.view', name: 'Xem báo cáo' },
  { group: 'Services', key: 'service.view', name: 'Xem dịch vụ' },
  { group: 'Users', key: 'user.view', name: 'Xem người dùng' },
  { group: 'Users', key: 'user.config', name: 'Cấu hình người dùng & quyền' },
  { group: 'System', key: 'system.config', name: 'Cấu hình hệ thống' },
  { group: 'Users', key: 'pii.view', name: 'Xem thông tin cá nhân (CCCD/Phone)' },
];

export const mockRolePermissions: RolePermission[] = [
  {
    roleId: 'Admin',
    permissions: mockPermissions.map(p => p.key),
  },
  {
    roleId: 'Staff',
    permissions: ['contract.view', 'contract.create', 'invoice.view', 'invoice.create', 'pii.view', 'room.view', 'tenant.view', 'ticket.view'],
  },
  {
    roleId: 'Viewer',
    permissions: ['contract.view', 'invoice.view', 'report.view'],
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

export const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    userId: 1,
    username: 'admin',
    action: 'Cập nhật phân quyền',
    module: 'Users',
    details: 'Đã thay đổi quyền của role Staff',
    ipAddress: '192.168.1.1',
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 2,
    username: 'staff01',
    action: 'Đăng nhập',
    module: 'Auth',
    details: 'Đăng nhập thành công',
    ipAddress: '113.190.45.12',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 3,
    userId: 1,
    username: 'admin',
    action: 'Khóa tài khoản',
    module: 'Users',
    details: 'Đã khóa tài khoản user tenant03',
    ipAddress: '192.168.1.1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  }
];
