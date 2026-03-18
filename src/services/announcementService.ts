import { Announcement } from '@/models/Announcement';
import { MOCK_ANNOUNCEMENTS } from '@/mocks/announcementMocks';

export const announcementService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_ANNOUNCEMENTS as any[];
  },

  createAnnouncement: async (data: Partial<Announcement>) => {
    await new Promise(r => setTimeout(r, 800));
    console.log(`Created announcement: ${data.title}`);
    return true;
  },

  deleteAnnouncement: async (id: number) => {
    await new Promise(r => setTimeout(r, 800));
    console.log(`Deleted announcement: ${id}`);
    return true;
  }
};
