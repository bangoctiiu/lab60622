import { MOCK_ANNOUNCEMENTS } from '@/mocks/announcementMocks';

export const portalAnnouncementService = {
  getAnnouncements: async (params?: { type?: string }): Promise<any> => {
    await new Promise(r => setTimeout(r, 600));
    let items = [...MOCK_ANNOUNCEMENTS];
    if (params?.type && params.type !== 'all') {
      items = items.filter(a => a.type === params.type);
    }
    return { items };
  },

  markAsRead: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 400));
    console.log('Announcement marked as read:', id);
  }
};

export default portalAnnouncementService;
