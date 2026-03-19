import { Role } from '../models/Role';
import { RolePermission, Permission } from '../models/Permission';
import { mockRoles, mockRolePermissions, mockPermissions } from '../mocks/userMocks';

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    return [...mockRoles];
  },
  getAllPermissions: async (): Promise<Permission[]> => {
    return [...mockPermissions];
  },
  getRolePermissions: async (): Promise<RolePermission[]> => {
    return [...mockRolePermissions];
  },
  getRoleById: async (id: string): Promise<Role | undefined> => {
    return mockRoles.find(r => r.id === id);
  },
  updateRolePermissions: async (roleId: string, permissions: string[]): Promise<void> => {
    const index = mockRolePermissions.findIndex(p => p.roleId === roleId);
    if (index !== -1) {
      mockRolePermissions[index].permissions = permissions;
    } else {
      mockRolePermissions.push({ roleId, permissions });
    }
    return new Promise(resolve => setTimeout(resolve, 800));
  },
};
