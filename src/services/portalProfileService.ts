import { TenantProfile } from '@/models/Tenant';
import { MOCK_TENANTS, getMockTenantDetail } from '@/mocks/tenantMocks';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { handleServiceError } from '@/utils/errorUtils';
import { ApiResponse } from '@/types/api';

export interface PortalProfile extends TenantProfile {
  buildingName: string;
  roomCode: string;
  avatar: string;
  notificationPrefs: {
    sms: boolean;
    email: boolean;
    push: boolean;
  };
}

export const portalProfileService = {
  getProfile: async (tenantId: string = 'T1'): Promise<PortalProfile> => {
    try {
      // Simulate API delay
      await new Promise(r => setTimeout(r, 800));
      
      const base = getMockTenantDetail(tenantId);
      return {
        ...base,
        avatar: base.avatarUrl || '',
        roomCode: base.currentRoomCode || 'A-101',
        buildingName: 'SmartStay Tower A',
        notificationPrefs: {
          sms: true,
          email: true,
          push: true,
        }
      };
    } catch (error) {
      return handleServiceError(error, 'Không thể tải thông tin cá nhân');
    }
  },

  updateProfile: async (data: Partial<PortalProfile>): Promise<void> => {
    try {
      await new Promise(r => setTimeout(r, 800));
      console.log('Updating profile:', data);
      // await apiClient.patch(API_ENDPOINTS.PORTAL.PROFILE, data);
    } catch (error) {
      handleServiceError(error, 'Không thể cập nhật thông tin cá nhân');
    }
  },

  updateAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    try {
      await new Promise(r => setTimeout(r, 1200));
      // Simulate file upload
      return { avatarUrl: URL.createObjectURL(file) };
    } catch (error) {
      return handleServiceError(error, 'Không thể cập nhật ảnh đại diện');
    }
  },

  changePassword: async (data: any): Promise<void> => {
    try {
      await new Promise(r => setTimeout(r, 800));
      console.log('Changing password', data);
      // await apiClient.post(`${API_ENDPOINTS.PORTAL.PROFILE}/change-password`, data);
    } catch (error) {
      handleServiceError(error, 'Không thể đổi mật khẩu');
    }
  },

  submitFeedback: async (content: string): Promise<void> => {
    try {
      await new Promise(r => setTimeout(r, 800));
      console.log('Feedback submitted:', content);
    } catch (error) {
      handleServiceError(error, 'Không thể gửi góp ý');
    }
  }
};

export default portalProfileService;
