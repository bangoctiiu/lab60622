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

export type UserRole = "Admin" | "Staff" | "Tenant" | "Viewer";

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  buildingId?: number | string;
  buildingsAccess?: (number | string)[];
  buildingAccess?: any[]; // For compatibility with mocks
  isActive: boolean;
  lastLoginAt?: string;
  isTwoFactorEnabled: boolean;
  forceChangePassword?: boolean;
  completionPercent?: number;
  createdAt?: string;
}

export interface Permission {
  permissionKey: string;
  module: string;
  description: string;
}

export interface RolePermissionMatrix {
  permissions: Permission[];
  roleMap: Record<string, string[]>;
}
