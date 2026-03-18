import { User, RolePermissionMatrix } from '@/models/User';

export const MOCK_USERS: User[] = [
  { 
    id: 1, 
    fullName: "Nguyễn Văn Admin", 
    username: "admin",
    email: "admin@smartstay.vn", 
    role: "Admin", 
    isActive: true,
    isTwoFactorEnabled: true, 
    forceChangePassword: false,
    lastLoginAt: new Date().toISOString(), 
    buildingAccess: [],
    createdAt: "2024-01-01" 
  },
  { 
    id: 2, 
    fullName: "Trần Thị Staff", 
    username: "staff01",
    email: "staff01@smartstay.vn", 
    phone: "0901234567",
    role: "Staff", 
    isActive: true, 
    isTwoFactorEnabled: false,
    forceChangePassword: false,
    lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
    buildingAccess: [{ buildingId: "B1", buildingName: "Keangnam Landmark" }],
    createdAt: "2024-03-01" 
  },
  { 
    id: 3, 
    fullName: "Lê Văn Viewer", 
    username: "viewer01",
    email: "viewer01@smartstay.vn", 
    role: "Viewer",
    isActive: false, 
    isTwoFactorEnabled: false,
    forceChangePassword: true,
    lastLoginAt: undefined, 
    buildingAccess: [],
    createdAt: "2024-06-01" 
  }
];

export const MOCK_ROLE_PERMISSIONS: RolePermissionMatrix = {
  permissions: [
    { permissionKey: "contract.view", module: "Contracts", description: "Xem hợp đồng" },
    { permissionKey: "contract.create", module: "Contracts", description: "Tạo hợp đồng" },
    { permissionKey: "contract.delete", module: "Contracts", description: "Xóa hợp đồng" },
    { permissionKey: "invoice.view", module: "Invoices", description: "Xem hóa đơn" },
    { permissionKey: "invoice.create", module: "Invoices", description: "Tạo hóa đơn" },
    { permissionKey: "payment.view", module: "Payments", description: "Xem thanh toán" },
    { permissionKey: "payment.approve", module: "Payments", description: "Duyệt thanh toán" },
    { permissionKey: "room.view", module: "Rooms", description: "Xem phòng" },
    { permissionKey: "ticket.view", module: "Tickets", description: "Xem ticket" },
    { permissionKey: "ticket.view.all", module: "Tickets", description: "Xem tất cả ticket" },
    { permissionKey: "meter.entry", module: "Meters", description: "Nhập đồng hồ" },
    { permissionKey: "building.view", module: "Buildings", description: "Xem tòa nhà" },
    { permissionKey: "building.manage", module: "Buildings", description: "Quản lý tòa nhà" },
    { permissionKey: "tenant.view", module: "Tenants", description: "Xem cư dân" },
    { permissionKey: "tenant.manage", module: "Tenants", description: "Quản lý cư dân" },
    { permissionKey: "report.view", module: "Reports", description: "Xem báo cáo" },
    { permissionKey: "service.manage", module: "Services", description: "Quản lý dịch vụ" },
    { permissionKey: "pii.view", module: "Users", description: "Xem CCCD/SĐT" },
    { permissionKey: "system.config", module: "System", description: "Cấu hình hệ thống" },
  ],
  roleMap: {
    Admin: ["contract.view","contract.create","contract.delete",
            "invoice.view","invoice.create","payment.view",
            "payment.approve","room.view","ticket.view",
            "ticket.view.all","meter.entry","report.view",
            "service.manage","pii.view","system.config"],
    Staff: ["contract.view","invoice.view","payment.view",
            "room.view","ticket.view","meter.entry","pii.view"],
    Viewer: ["contract.view","invoice.view","room.view","ticket.view"],
    Tenant: [],
  }
};
