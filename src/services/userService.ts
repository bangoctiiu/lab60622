import apiClient from './apiClient';
import { User } from '@/types';
import { mockUsers } from '@/mocks/userMocks';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockUsers] as any[];
  },
  
  getUserById: async (id: number | string): Promise<User | undefined> => {
    const stringId = id.toString();
    return (mockUsers as any[]).find(u => u.id.toString() === stringId);
  },
  
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...user, id: Date.now() } as any;
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
