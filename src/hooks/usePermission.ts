import { useMemo } from 'react';
import { mockRolePermissions } from '@/mocks/userMocks';

// Assuming we have a global auth store or context
// For now, we'll mock the current user's role
const CURRENT_USER_ROLE = 'Admin'; 

export const usePermission = () => {
  const userPermissions = useMemo(() => {
    const roleConfig = mockRolePermissions.find(rp => rp.roleId === CURRENT_USER_ROLE);
    return roleConfig ? roleConfig.permissions : [];
  }, []);

  const can = (permissionKey: string): boolean => {
    if (CURRENT_USER_ROLE === 'Admin') return true;
    return userPermissions.includes(permissionKey);
  };

  return { 
    can, 
    hasPermission: can, // Alias for legacy/existing code
    role: CURRENT_USER_ROLE 
  };
};

export default usePermission;
