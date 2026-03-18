import api from "./apiClient";
import { toast } from "sonner";
import { checkImageIntegrity } from "@/utils/security";

// Simulated rate-limiting for uploads (max 5 per minute)
const UPLOAD_TIMESTAMPS: number[] = [];
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW = 60000;

export const fileService = {
  /**
   * Upload a file or blob to the server with MIME validation
   * Securely handles signature images and proof photos
   */
  uploadFile: async (file: File | Blob, originalName?: string): Promise<string> => {
    // 1. Client-side simulated Rate Limiting
    const now = Date.now();
    const recentUploads = UPLOAD_TIMESTAMPS.filter(ts => now - ts < RATE_LIMIT_WINDOW);
    if (recentUploads.length >= RATE_LIMIT_COUNT) {
      throw new Error('SECURITY_REJECTION: Tải lên quá nhanh. Vui lòng đợi 1 phút.');
    }
    UPLOAD_TIMESTAMPS.push(now);

    // 2. Client-side Integrity Validation (Magic Bytes)
    const isValid = await checkImageIntegrity(file);
    if (!isValid) {
      throw new Error('SECURITY_REJECTION: Tệp không hợp lệ hoặc bị hỏng (Magic Byte mismatch).');
    }

    // 3. STRICT Server-Side MIME Validation (Mocked)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('SERVER_REJECTION: Định dạng file không hỗ trợ.');
    }

    // 4. STRICT Size Validation (Mocked)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      throw new Error('SERVER_REJECTION: File quá lớn (Tối đa 2MB).');
    }

    // 5. Prepare FormData for secure multipart/form-data upload
    const formData = new FormData();
    const fileName = originalName || `signature_${Date.now()}.png`;
    formData.append('file', file, fileName);

    try {
      // In a real app:
      // const response = await api.post<{ url: string }>('/api/upload', formData);
      // return response.data.url;

      // Mocking successful upload - Ensuring URL is from trusted domain
      await new Promise(resolve => setTimeout(resolve, 800));
      return `https://cdn.smartstay.vn/signatures/${Date.now()}_secured.png`;
    } catch (err) {
      console.error('Upload failed:', err);
      throw new Error('Lỗi hệ thống khi lưu trữ tệp tin');
    }
  }
};
