import { create } from 'zustand';

interface PermissionState {
  permissions: string[];
  setPermissions: (perms: string[]) => void;
  hasPermission: (perm: string) => boolean;
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: [],
  setPermissions: (perms) => set({ permissions: perms }),
  hasPermission: (perm) => get().permissions.includes(perm),
}));

export const usePermission = () => {
  const { permissions, hasPermission } = usePermissionStore();
  return { 
    permissions, 
    hasPermission,
    can: hasPermission 
  };
};
