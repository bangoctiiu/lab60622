export type UserRole = "Admin" | "Staff" | "Tenant";

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: UserRole;
  buildingId?: number; // For Staff/Tenant
}
