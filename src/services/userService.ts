import { User } from '../models/User';
import { mockUsers } from '../mocks/userMocks';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    // simulate API delay
    return new Promise(resolve => setTimeout(() => resolve([...mockUsers]), 500));
  },
  getUserById: async (id: number): Promise<User | undefined> => {
    return mockUsers.find(u => u.id === id);
  },
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const newUser = { ...user, id: Math.max(0, ...mockUsers.map(u => u.id)) + 1 };
    mockUsers.push(newUser);
    return newUser;
  },
  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers[index] = { ...mockUsers[index], ...data };
    return mockUsers[index];
  },
  toggleUserStatus: async (id: number): Promise<User> => {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers[index].isActive = !mockUsers[index].isActive;
    return mockUsers[index];
  },
  sendResetPasswordEmail: async (id: number): Promise<void> => {
    console.log(`Sending reset email to user ${id}`);
    return new Promise(resolve => setTimeout(resolve, 1000));
  },
  resetPassword: async (id: number, password: string): Promise<void> => {
    console.log(`Resetting password for user ${id} to ${password}`);
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
};
