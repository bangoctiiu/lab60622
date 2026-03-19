export enum FormMode {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  VIEW = 'VIEW'
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type UserRoleType = "Admin" | "Staff" | "Tenant" | "Viewer";

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRoleType;
  buildingsAccess?: (number | string)[];
  isActive: boolean;
  lastLoginAt?: string;
  isTwoFactorEnabled: boolean;
  forceChangePassword?: boolean;
  completionPercent?: number;
  createdAt?: string;
}

export interface Permission {
  key: string;
  group: string;
  name: string;
}

export interface RolePermission {
  roleId: string;
  permissions: string[]; // array of permission keys
}

export interface RolePermissionMatrix {
  permissions: { permissionKey: string; module: string; description: string }[];
  roleMap: Record<string, string[]>;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  userId: number;
  username: string;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
}
