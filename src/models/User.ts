export type UserRole = "Admin" | "Staff" | "Tenant" | "Viewer";

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  buildingId?: number; // Primary building
  buildingsAccess?: number[]; // IDs of buildings user can manage
  isActive: boolean;
  lastLoginAt?: string;
  isTwoFactorEnabled: boolean;
  forceChangePassword?: boolean;
}
