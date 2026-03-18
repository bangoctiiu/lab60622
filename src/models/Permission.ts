export interface Permission {
  group: string;
  key: string;
  name: string;
}

export interface RolePermission {
  roleId: string;
  permissions: string[];
}
