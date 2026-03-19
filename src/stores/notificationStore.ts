import { create } from 'zustand'

import { Notification } from '@/types/notification'

interface NotificationState {
  // State
  unreadCount: number;
  notifications: Notification[];
  hasNew: boolean;

  // Actions
  fetchUnread: () => Promise<void>;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (notification: Omit<Notification, "isRead" | "createdAt" | "id">) => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  notifications: [],
  hasNew: false,

  fetchUnread: async () => {
    // Logic to fetch from API would go here
    // const res = await api.get('/notifications/unread/count');
    // set({ unreadCount: res.data.count });
  },

  markRead: (id) => set((state) => {
    const updated = state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    const newCount = updated.filter(n => !n.isRead).length;
    return { 
      notifications: updated, 
      unreadCount: newCount,
      hasNew: newCount > 0 
    };
  }),

  markAllRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0,
    hasNew: false
  })),

  addNotification: (data) => set((state) => {
    const newNotif: Notification = {
      ...data,
      id: Math.random().toString(36).substring(7),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    return {
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
      hasNew: true
    };
  }),
}))

export default useNotificationStore;
