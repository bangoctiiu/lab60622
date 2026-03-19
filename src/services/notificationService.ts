import { MOCK_NOTIFICATIONS } from '@/mocks/notificationMocks';

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    await new Promise(r => setTimeout(r, 800));
    // Adapt mock to match component expectation
    return MOCK_NOTIFICATIONS.map(n => ({
      id: n.id,
      title: n.title,
      content: n.message,
      type: n.type.toLowerCase(), // normalized
      isRead: n.isRead,
      createdAt: n.createdAt
    }));
  },

  markAsRead: async (id?: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 500));
    console.log(id ? `Marking ${id} as read` : 'Marking all as read');
  },

  deleteNotification: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 500));
    console.log(`Deleting notification ${id}`);
  }
};

export default notificationService;
