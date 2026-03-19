import apiClient from './apiClient';
import { User } from '@/types';
import { mockUsers } from '@/mocks/userMocks';

export const userService = {
  getUsers: async (filters?: { search?: string; role?: string; isActive?: boolean | string; buildingId?: string | number }): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filteredUsers = [...mockUsers];
    
    if (filters) {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(u => 
          u.username.toLowerCase().includes(s) || 
          u.fullName.toLowerCase().includes(s) || 
          u.email.toLowerCase().includes(s)
        );
      }
      if (filters.role && filters.role !== 'All') {
        filteredUsers = filteredUsers.filter(u => u.role === filters.role);
      }
      if (filters.isActive !== undefined && filters.isActive !== 'All') {
        const active = filters.isActive === true || filters.isActive === 'Active';
        filteredUsers = filteredUsers.filter(u => u.isActive === active);
      }
      if (filters.buildingId) {
        filteredUsers = filteredUsers.filter(u => u.buildingsAccess?.includes(Number(filters.buildingId)));
      }
    }
    
    return filteredUsers as User[];
  },
  
  getUserById: async (id: number | string): Promise<User | undefined> => {
    const stringId = id.toString();
    return mockUsers.find(u => u.id.toString() === stringId);
  },
  
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser = { ...user, id: Math.floor(Math.random() * 10000) } as User;
    return newUser;
  },
  
  updateUser: async (id: number | string, user: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { id, ...user } as any;
  },
  
  deleteUser: async (id: number | string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  resetPassword: async (id: number | string, newPassword?: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 700));
  },
  
  toggleUserStatus: async (id: number | string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  sendResetPasswordEmail: async (id: number | string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

export default userService;
