import { Announcement, AnnouncementType, AnnouncementStatus } from '@/types/announcement';
import { MOCK_ANNOUNCEMENTS } from '@/mocks/announcementMocks';

export const announcementService = {
  getAnnouncements: async (filters?: any): Promise<Announcement[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_ANNOUNCEMENTS as any[];
  },

  getAnnouncementDetail: async (id: string | number): Promise<Announcement | undefined> => {
    await new Promise(r => setTimeout(r, 400));
    const stringId = id.toString();
    return (MOCK_ANNOUNCEMENTS as any[]).find(a => a.id.toString() === stringId);
  },

  createAnnouncement: async (announcement: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> => {
    await new Promise(r => setTimeout(r, 800));
    return {
      ...announcement,
      id: Date.now(),
      createdAt: new Date().toISOString()
    } as any;
  },

  deleteAnnouncement: async (id: number | string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    return true;
  }
};

export default announcementService;
